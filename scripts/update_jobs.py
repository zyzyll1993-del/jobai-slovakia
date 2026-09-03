from __future__ import annotations
import json, re, time
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse, parse_qs, unquote_plus
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

REGION_CITY_KEYS={
 'Bratislavský kraj':['bratislava','malacky','pezinok','senec'],
 'Trnavský kraj':['trnava','dunajská streda','dunajska streda','galanta','hlohovec','piešťany','piestany','senica','skalica'],
 'Trenčiansky kraj':['trenčín','trencin','bánovce nad bebravou','banovce nad bebravou','ilava','myjava','nové mesto nad váhom','nove mesto nad vahom','partizánske','partizanske','považská bystrica','povazska bystrica','prievidza','púchov','puchov'],
 'Nitriansky kraj':['nitra','komárno','komarno','levice','nové zámky','nove zamky','šaľa','sala','topoľčany','topolcany','zlaté moravce','zlate moravce'],
 'Žilinský kraj':['žilina','zilina','bytča','bytca','čadca','cadca','dolný kubín','dolny kubin','kysucké nové mesto','kysucke nove mesto','liptovský mikuláš','liptovsky mikulas','martin','námestovo','namestovo','ružomberok','ruzomberok','turčianske teplice','turcianske teplice','tvrdošín','tvrdosin'],
 'Banskobystrický kraj':['banská bystrica','banska bystrica','banská štiavnica','banska stiavnica','brezno','detva','krupina','lučenec','lucenec','poltár','poltar','revúca','revuca','rimavská sobota','rimavska sobota','veľký krtíš','velky krtis','zvolen','žiar nad hronom','ziar nad hronom','žarnovica','zarnovica'],
 'Prešovský kraj':['prešov','presov','bardejov','humenné','humenne','kežmarok','kezmarok','levoča','levoca','medzilaborce','poprad','sabinov','snina','stará ľubovňa','stara lubovna','stropkov','svidník','svidnik','vranov nad topľou','vranov nad toplou'],
 'Košický kraj':['košice','kosice','michalovce','rožňava','roznava','sobrance','spišská nová ves','spisska nova ves','trebišov','trebisov','gelnica']
}
FOREIGN_COUNTRY_KEYS=['rakúsko','rakusko','česko','cesko','česká republika','ceska republika','maďarsko','madarsko','poľsko','polsko','nemecko','holandsko','belgicko','švajčiarsko','svajciarsko','francúzsko','francuzsko','taliansko']

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
def clean_location_text(s):
    s=re.sub(r'\blocation_on\s*google\s*maps\b',' ',str(s or ''),flags=re.I)
    s=re.sub(r'\bgoogle\s*maps\b',' ',s,flags=re.I)
    return clean(s)

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

def map_address(soup):
    for a in soup.find_all('a',href=True):
        href=clean(a.get('href'))
        low=href.lower()
        if 'google' not in low or 'map' not in low: continue
        try:
            parsed=urlparse(href); qs=parse_qs(parsed.query)
            for key in ('query','q','destination'):
                if qs.get(key):
                    value=clean_location_text(unquote_plus(qs[key][0]))
                    if value: return value
            m=re.search(r'/maps/(?:search|place)/([^/?#]+)',href,re.I)
            if m:
                value=clean_location_text(unquote_plus(m.group(1)))
                if value: return value
        except Exception:
            continue
    return ''

def infer_region(city,district=''):
    text=norm(city+' '+district)
    for region,keys in REGION_CITY_KEYS.items():
        if any(norm(k) in text for k in keys): return region
    return ''

def exact_district_center(text):
    t=norm(text)
    for keys in REGION_CITY_KEYS.values():
        for key in keys:
            if t==norm(key): return clean(text)
    return ''

def location_parts_from_lines(lines):
    label='miesto výkonu práce'
    for i,x in enumerate(lines):
        if label in norm(x):
            parts=[]
            for y in lines[i+1:i+11]:
                y=clean_location_text(y)
                if not y: continue
                yn=norm(y)
                if yn.startswith('údaje o pracovnej pozícii') or yn.startswith('ďalšie miesta výkonu práce'):
                    break
                if parts and is_section_heading(y): break
                if yn in {'slovensko','slovenská republika'}: continue
                if 'miesto výkonu práce' in yn: continue
                parts.append(y)
            if parts: return parts
    return []

def location_fields(soup,lines):
    structured=structured_address(soup)
    parts=location_parts_from_lines(lines)
    raw=clean_location_text(' '.join(parts))
    mapped=map_address(soup)
    if mapped and (not raw or not re.search(r'\b\d{3}\s?\d{2}\b',raw)):
        raw=mapped
    raw=raw or clean_location_text(value_after(lines,'Miesto výkonu práce'))
    nraw=norm(raw)
    foreign=any(nraw.startswith(norm(country)) for country in FOREIGN_COUNTRY_KEYS)
    nationwide=nraw in {'slovensko','slovenská republika','slovenska republika'}
    country='' if not raw else ('Slovensko' if nraw.startswith('slovensko') or nraw.startswith('slovenská republika') or nraw.startswith('slovenska republika') else clean(raw.split(',')[0]))
    city=clean_location_text(structured['city']); district=''; postal=clean(structured['postalCode']); region=clean(structured['region'])
    m=re.search(r'\b(\d{3}\s?\d{2})\s+(.+?)(?:\s+-\s+([^,;]+))?(?:$|\s+Slovensko$)',raw,re.I)
    if m:
        postal=postal or clean(m.group(1)).replace(' ','')
        parsed_city=clean_location_text(m.group(2))
        parsed_district=clean_location_text(m.group(3) or '')
        city=city or parsed_city
        district=parsed_district
    if not city:
        m2=re.search(r'\b\d{3}\s?\d{2}\s+([^,;]+)',raw)
        if m2: city=clean_location_text(re.split(r'\s+-\s+',m2.group(1))[0])
    # Some official records intentionally specify only Slovakia + district.
    if not foreign and not nationwide and nraw.startswith('slovensko,'):
        tail=clean_location_text(raw.split(',',1)[1])
        if tail:
            district=district or tail
            if re.fullmatch(r'bratislava\s+(?:i|ii|iii|iv|v)',norm(tail)):
                city=city or 'Bratislava'
            else:
                city=city or exact_district_center(tail)
    if nationwide:
        region='Celé Slovensko'
    else:
        region=region or infer_region(city,district)
    display=clean_location_text(raw)
    if structured['street'] and city:
        display=', '.join(x for x in [clean_location_text(structured['street']),postal,city] if x)
    return {'location':display,'city':city,'district':district,'region':region,'postalCode':postal,'country':country,'nationwide':nationwide,'foreign':foreign}

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
    if loc['foreign']: return None
    return {'title':title,'employer':employer,'location':loc['location'],'city':loc['city'],'district':loc['district'],'region':loc['region'],'postalCode':loc['postalCode'],'country':loc['country'] or 'Slovensko','nationwide':loc['nationwide'],'salary':value_after(lines,'Základná zložka mzdy'),'category':category,'searchTerm':'all-market','updated':value_after(lines,'Naposledy aktualizované'),'startDate':value_after(lines,'Dátum nástupu'),'employmentType':value_after(lines,'Pracovný pomer'),'experience':value_after(lines,'Požadovaná prax'),'education':education,'languages':languages,'computerSkills':computer,'drivingLicenses':licenses,'shiftWork':value_after(lines,'Práca na zmeny'),'slovakRequired':value_after(lines,'Znalosť slovenského jazyka je nevyhnutná'),'description':description,'url':url,'source':'ÚPSVaR / VPM'}

def page_urls(page,session):
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
    city_count=sum(1 for j in jobs if j.get('city'))
    region_count=sum(1 for j in jobs if j.get('region'))
    nationwide_count=sum(1 for j in jobs if j.get('nationwide'))
    region_counts=Counter(j.get('region') or 'Neurčený kraj' for j in jobs)
    missing_regions=[region for region in REGION_CITY_KEYS if region_counts.get(region,0)==0]
    if missing_regions:
        raise SystemExit('Refusing to publish: missing Slovak regions: '+', '.join(missing_regions))
    unresolved=[j for j in jobs if not j.get('nationwide') and (not j.get('city') or not j.get('region'))]
    print('location fields',city_count,'cities',region_count,'regions','nationwide',nationwide_count)
    print('region counts',json.dumps(dict(sorted(region_counts.items())),ensure_ascii=False))
    print('unresolved locations',len(unresolved))
    for j in unresolved[:12]:
        print('unresolved',j.get('location',''),'|',j.get('url',''))
    data={
      'updatedAt':datetime.now(timezone.utc).isoformat(),
      'source':'Služby zamestnanosti — VPM',
      'activeOnly':True,
      'schemaVersion':8,
      'collectionMode':'official-vpm-broad-feed',
      'pagesScanned':pages_scanned,
      'pageSizeRequested':PAGE_SIZE,
      'marketCategories':sorted(set(j.get('category','Iné profesie') for j in jobs)),
      'regionCounts':dict(sorted(region_counts.items())),
      'nationwideCount':nationwide_count,
      'jobCount':len(jobs),
      'failures':failures,
      'jobs':jobs
    }
    Path('jobs-data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    print('saved',len(jobs),'active Slovakia vacancies across professions')

if __name__=='__main__': main()
