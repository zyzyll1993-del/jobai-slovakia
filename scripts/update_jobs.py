from __future__ import annotations
import json, re, time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup

BASE='https://www.sluzbyzamestnanosti.gov.sk'
SEARCH=BASE+'/pracovne-ponuky'
HEADERS={
 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
 'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
 'Accept-Language':'sk-SK,sk;q=0.9,en;q=0.7',
 'Cache-Control':'no-cache',
 'Pragma':'no-cache'
}
MAX_PAGES=30
PAGE_SIZE=30
MAX_JOBS=900
MIN_JOBS_TO_PUBLISH=100

CATEGORY_RULES=[
 ('Manažment a vedenie',['vedúci','veduca','vedúca','manažér','manazer','manager','supervízor','supervizor','team leader','majster','stavbyvedúci','stavbyveduci','riaditeľ','riaditel']),
 ('Výroba a strojárstvo',['výroba','vyroba','operátor','operator','cnc','obrábač','obrabac','strojár','strojar','mechanik','montáž','montaz','údržbár','udrzbar','nástrojár','nastrojar']),
 ('Elektro a technika',['elektrikár','elektrikar','elektrotechnik','elektromontér','elektromonter','mechatronik','plc','automatizácia','automatizacia']),
 ('Zváranie a kovovýroba',['zvárač','zvarac','zámočník','zamocnik','klampiar','brúsič','brusic','lakovník','lakovnik']),
 ('Logistika a sklad',['sklad','skladník','skladnik','vzv','komisionár','komisionar','picker','logistika','dispečer','dispecer','zásobovač','zasobovac']),
 ('Doprava',['vodič','vodic','kamión','kamion','autobus','kuriér','kurier','taxi']),
 ('Stavebníctvo',['staveb','murár','murar','tesár','tesar','železiar','zeleziar','inštalatér','instalater','vodoinštalatér','bagrista']),
 ('Obchod a služby',['predavač','predavac','pokladník','pokladnik','obchodný','obchodny','zákaznícky','zakaznicky','recepčný','recepcny','upratovač','upratovac','sbs','kaderník','kadernik','barber']),
 ('Gastro a hotelierstvo',['kuchár','kuchar','čašník','casnik','barman','pekár','pekar','cukrár','cukrar','hotel','reštaur','restaur']),
 ('Zdravotníctvo a sociálne služby',['sestra','lekár','lekar','opatrovateľ','opatrovatel','sanitár','sanitar','sociáln','socialn','farmaceut','zdravot']),
 ('Administratíva a financie',['administrat','účtovník','uctovnik','asistent','referent','ekonóm','ekonom','finanč','financ','office']),
 ('IT a digitál',['programátor','programator','developer','it technik','správca siete','spravca siete','tester','data analyst','kybernet','software','frontend','backend']),
 ('Kvalita a inžiniering',['kvalit','metrológ','metrolog','cmm','inžinier','inzinier','technológ','technolog','konštruktér','konstrukter','projektový','projektovy']),
 ('Školstvo',['učiteľ','ucitel','pedagog','vychovávateľ','vychovavatel','lektor','škola','skola']),
 ('Poľnohospodárstvo a potravinárstvo',['poľnohospod','polnohospod','traktorista','mäsiar','masiar','potravin','agronóm','agronom']),
 ('Remeslá a servis',['automechanik','autoservis','servisný','servisny','chladiar','stolár','stolar'])
]

SECTION_HEADINGS=[
 'Požadovaný stupeň vzdelania','Požadovaná prax','Prax','Požadované cudzie jazyky',
 'Znalosť slovenského jazyka je nevyhnutná','Počítačové zručnosti',
 'Vodičské oprávnenie','Vodičské oprávnenia','Práca na zmeny',
 'Všeobecné spôsobilosti','Osobnostné predpoklady','Ďalšie požiadavky',
 'Certifikáty','Osvedčenia','Dátum nástupu','Pracovný pomer',
 'Základná zložka mzdy','Náplň práce','Informácie o výberovom procese',
 'Miesto výkonu práce'
]
DRIVING_GROUPS={'AM','A1','A2','A','B1','B','BE','C1','C1E','C','CE','D1','D1E','D','DE','T'}

def clean(s): return re.sub(r'\s+',' ',str(s or '')).strip()
def norm(s): return clean(s).lower()

def classify(title, description=''):
    text=norm(title+' '+description)
    for category,keys in CATEGORY_RULES:
        if any(k in text for k in keys): return category
    return 'Iné profesie'

def value_after(lines,label,lookahead=10):
    low=label.lower()
    for i,x in enumerate(lines):
        if low in x.lower():
            for y in lines[i+1:i+1+lookahead]:
                y=clean(y)
                if y and y.lower()!=low and not y.endswith(':'): return y
    return ''

def is_section_heading(text, extra_stops=()):
    t=norm(text).rstrip(':')
    for h in list(SECTION_HEADINGS)+list(extra_stops):
        hn=norm(h).rstrip(':')
        if t==hn or t.startswith(hn+':'): return True
    return False

def values_between(lines,label,stop_labels=(),max_items=12):
    low=norm(label)
    for i,x in enumerate(lines):
        if low in norm(x):
            out=[]
            for y in lines[i+1:i+40]:
                y=clean(y)
                if not y: continue
                yl=norm(y)
                if yl==low: continue
                if is_section_heading(y,stop_labels): break
                if y not in out: out.append(y)
                if len(out)>=max_items: break
            return out
    return []

def clean_driving_licenses(values):
    found=[]
    for value in values:
        text=clean(value).upper().replace('/', ' ').replace(',', ' ')
        if norm(value) in {'skupina','skupiny','vodičské oprávnenie','vodičské oprávnenia'}: continue
        for token in re.findall(r'(?<![A-Z0-9])(?:AM|A1|A2|BE|B1|B|C1E|C1|CE|C|D1E|D1|DE|D|T)(?![A-Z0-9])',text):
            if token in DRIVING_GROUPS and token not in found: found.append(token)
    return found

def clean_requirement_values(values):
    noise={'áno','nie','skupina','skupiny','úroveň','uroven','stupeň','stupen','znalosť slovenského jazyka je nevyhnutná','znalost slovenskeho jazyka je nevyhnutna'}
    out=[]
    for value in values:
        v=clean(value)
        if not v or norm(v) in noise or is_section_heading(v): continue
        if v not in out: out.append(v)
    return out

def find_json_value(obj,key):
    if isinstance(obj,dict):
        if key in obj and clean(obj.get(key)): return clean(obj.get(key))
        for v in obj.values():
            found=find_json_value(v,key)
            if found: return found
    elif isinstance(obj,list):
        for v in obj:
            found=find_json_value(v,key)
            if found: return found
    return ''

def structured_address(soup):
    data=[]
    for node in soup.find_all('script',attrs={'type':'application/ld+json'}):
        raw=node.string or node.get_text() or ''
        try: data.append(json.loads(raw))
        except Exception: continue
    city=region=street=postal=''
    for obj in data:
        city=city or find_json_value(obj,'addressLocality')
        region=region or find_json_value(obj,'addressRegion')
        street=street or find_json_value(obj,'streetAddress')
        postal=postal or find_json_value(obj,'postalCode')
    return {'city':city,'region':region,'street':street,'postalCode':postal}

def location_fields(soup,lines):
    structured=structured_address(soup)
    raw=value_after(lines,'Miesto výkonu práce')
    city=structured['city']
    if not city:
        m=re.search(r'\b\d{3}\s?\d{2}\s+([^,;]+)',raw)
        if m: city=clean(re.split(r'\s+-\s+',m.group(1))[0])
    display=raw
    if structured['street'] and city:
        display=', '.join(x for x in [structured['street'],structured['postalCode'],city] if x)
    return {'location':display,'city':city,'district':'','region':structured['region'],'postalCode':structured['postalCode']}

def inactive(lines):
    text=' '.join(lines).lower()
    return any(x in text for x in ['ponuka už nie je aktívna','ponuka nie je aktívna','pracovná ponuka bola zrušená','ponuka bola zrušená','neaktívna pracovná ponuka'])

def detail(url,session):
    r=session.get(url,headers=HEADERS,timeout=25)
    if r.status_code in (404,410): return None
    r.raise_for_status(); soup=BeautifulSoup(r.text,'html.parser')
    h1=soup.find('h1'); title=clean(h1.get_text(' ',strip=True) if h1 else '')
    lines=[clean(x) for x in soup.stripped_strings if clean(x)]
    if not title or inactive(lines): return None
    employer=''
    if title in lines:
        idx=lines.index(title)
        for x in lines[idx+1:idx+9]:
            if 'Miesto výkonu práce' in x or 'Dátum nástupu' in x: break
            if x and x not in {'(muž/žena)','muž/žena'}: employer=x; break
    education=clean_requirement_values(values_between(lines,'Požadovaný stupeň vzdelania',max_items=6))
    languages=clean_requirement_values(values_between(lines,'Požadované cudzie jazyky',max_items=8))
    computer=clean_requirement_values(values_between(lines,'Počítačové zručnosti',max_items=12))
    raw_licenses=values_between(lines,'Vodičské oprávnenia',max_items=8) or values_between(lines,'Vodičské oprávnenie',max_items=8)
    licenses=clean_driving_licenses(raw_licenses)
    description=value_after(lines,'Náplň práce',18); category=classify(title,description); loc=location_fields(soup,lines)
    return {'title':title,'employer':employer,'location':loc['location'],'city':loc['city'],'district':loc['district'],'region':loc['region'],'postalCode':loc['postalCode'],'salary':value_after(lines,'Základná zložka mzdy'),'category':category,'searchTerm':'all-market','updated':value_after(lines,'Naposledy aktualizované'),'startDate':value_after(lines,'Dátum nástupu'),'employmentType':value_after(lines,'Pracovný pomer'),'experience':value_after(lines,'Požadovaná prax'),'education':education,'languages':languages,'computerSkills':computer,'drivingLicenses':licenses,'shiftWork':value_after(lines,'Práca na zmeny'),'slovakRequired':value_after(lines,'Znalosť slovenského jazyka je nevyhnutná'),'description':description,'url':url,'source':'ÚPSVaR / VPM'}

def page_urls(page,session):
    # VPM limits the official aggregate page to vacancies with internal detail pages.
    # This avoids losing most results just because Profesia and other partner cards
    # use external links instead of /pracovne-ponuky/<uuid> URLs.
    params={'pageNr':page,'pageSize':PAGE_SIZE,'zdrojPonuky':'VPM','lang':'sk'}
    r=session.get(SEARCH,params=params,headers=HEADERS,timeout=25)
    r.raise_for_status(); soup=BeautifulSoup(r.text,'html.parser'); found=[]
    for a in soup.find_all('a',href=True):
        href=a['href']
        if re.search(r'/pracovne-ponuky/[0-9a-fA-F-]{30,}',href):
            u=urljoin(BASE,href.split('?')[0])+'?lang=sk'
            if u not in found: found.append(u)
    return found

def main():
    s=requests.Session(); s.headers.update(HEADERS)
    try: s.get(SEARCH,params={'lang':'sk','zdrojPonuky':'VPM'},timeout=25)
    except Exception: pass
    jobs=[]; seen=set(); failures=0; empty_pages=0; pages_scanned=0
    for page in range(1,MAX_PAGES+1):
        pages_scanned=page
        try: urls=page_urls(page,s)
        except Exception as e:
            failures+=1; print('page failed',page,e); continue
        if not urls:
            empty_pages+=1
            if empty_pages>=2: break
            continue
        empty_pages=0
        for u in urls:
            if u in seen: continue
            seen.add(u)
            try:
                j=detail(u,s)
                if j: jobs.append(j)
            except Exception as e:
                failures+=1; print('detail failed',u,e)
            if len(jobs)>=MAX_JOBS: break
            time.sleep(.06)
        print('page',page,'urls',len(urls),'unique',len(seen),'jobs',len(jobs))
        if len(jobs)>=MAX_JOBS: break
    if len(jobs)<MIN_JOBS_TO_PUBLISH:
        raise SystemExit(f'Only {len(jobs)} vacancies fetched; refusing to replace production database (minimum {MIN_JOBS_TO_PUBLISH})')
    jobs.sort(key=lambda j:(j.get('updated',''),j.get('title',''),j.get('city',''),j.get('location','')),reverse=True)
    data={
      'updatedAt':datetime.now(timezone.utc).isoformat(),
      'source':'Služby zamestnanosti — VPM',
      'activeOnly':True,
      'schemaVersion':5,
      'collectionMode':'official-vpm-broad-feed',
      'pagesScanned':pages_scanned,
      'pageSizeRequested':PAGE_SIZE,
      'marketCategories':sorted(set(j.get('category','Iné profesie') for j in jobs)),
      'jobCount':len(jobs),
      'failures':failures,
      'jobs':jobs
    }
    Path('jobs-data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    print('saved',len(jobs),'active official vacancies across professions')

if __name__=='__main__': main()
