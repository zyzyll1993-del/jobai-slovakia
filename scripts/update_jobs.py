from __future__ import annotations
import json, re, time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup

BASE='https://www.sluzbyzamestnanosti.gov.sk'
SEARCH=BASE+'/pracovne-ponuky'
HEADERS={'User-Agent':'JobAI-Slovakia/1.3 (+https://zyzyll1993-del.github.io/jobai-slovakia/)'}

# Broad market crawl. We no longer depend on a fixed list of professions.
# The updater walks the general job feed and classifies vacancies afterwards.
MAX_PAGES=30
PAGE_SIZE=30
MAX_JOBS=900

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


def clean(s):
    return re.sub(r'\s+',' ',str(s or '')).strip()


def norm(s):
    return clean(s).lower()


def classify(title, description=''):
    text=norm(title+' '+description)
    for category,keys in CATEGORY_RULES:
        if any(k in text for k in keys):
            return category
    return 'Iné profesie'


def value_after(lines,label,lookahead=10):
    low=label.lower()
    for i,x in enumerate(lines):
        if low in x.lower():
            for y in lines[i+1:i+1+lookahead]:
                y=clean(y)
                if y and y.lower()!=low and not y.endswith(':'):
                    return y
    return ''


def values_between(lines,label,stop_labels,max_items=12):
    low=label.lower(); stops=[x.lower() for x in stop_labels]
    for i,x in enumerate(lines):
        if low in x.lower():
            out=[]
            for y in lines[i+1:i+30]:
                y=clean(y); yl=y.lower()
                if any(s in yl for s in stops): break
                if y and yl!=low and y not in out: out.append(y)
                if len(out)>=max_items: break
            return out
    return []


def inactive(lines):
    text=' '.join(lines).lower()
    markers=['ponuka už nie je aktívna','ponuka nie je aktívna','pracovná ponuka bola zrušená','ponuka bola zrušená','neaktívna pracovná ponuka']
    return any(x in text for x in markers)


def detail(url, session):
    r=session.get(url,headers=HEADERS,timeout=25)
    if r.status_code in (404,410): return None
    r.raise_for_status()
    soup=BeautifulSoup(r.text,'html.parser')
    h1=soup.find('h1')
    title=clean(h1.get_text(' ',strip=True) if h1 else '')
    lines=[clean(x) for x in soup.stripped_strings if clean(x)]
    if not title or inactive(lines): return None

    employer=''
    if title in lines:
        idx=lines.index(title)
        for x in lines[idx+1:idx+9]:
            if 'Miesto výkonu práce' in x or 'Dátum nástupu' in x: break
            if x and x not in {'(muž/žena)','muž/žena'}:
                employer=x; break

    stop=['Požadovaná prax','Požadované cudzie jazyky','Počítačové zručnosti','Vodičské oprávnenie','Vodičské oprávnenia','Práca na zmeny','Dátum nástupu','Základná zložka mzdy','Náplň práce']
    education=values_between(lines,'Požadovaný stupeň vzdelania',stop,6)
    languages=values_between(lines,'Požadované cudzie jazyky',['Počítačové zručnosti','Vodičské oprávnenie','Vodičské oprávnenia','Práca na zmeny','Dátum nástupu'],8)
    computer=values_between(lines,'Počítačové zručnosti',['Vodičské oprávnenie','Vodičské oprávnenia','Práca na zmeny','Dátum nástupu'],12)
    licenses=values_between(lines,'Vodičské oprávnenia',['Práca na zmeny','Dátum nástupu','Náplň práce'],8) or values_between(lines,'Vodičské oprávnenie',['Práca na zmeny','Dátum nástupu','Náplň práce'],8)
    description=value_after(lines,'Náplň práce',18)
    category=classify(title,description)

    return {
      'title':title,'employer':employer,
      'location':value_after(lines,'Miesto výkonu práce'),
      'salary':value_after(lines,'Základná zložka mzdy'),
      'category':category,'searchTerm':'all-market',
      'updated':value_after(lines,'Naposledy aktualizované'),
      'startDate':value_after(lines,'Dátum nástupu'),
      'employmentType':value_after(lines,'Pracovný pomer'),
      'experience':value_after(lines,'Požadovaná prax'),
      'education':education,
      'languages':languages,
      'computerSkills':computer,
      'drivingLicenses':licenses,
      'shiftWork':value_after(lines,'Práca na zmeny'),
      'slovakRequired':value_after(lines,'Znalosť slovenského jazyka je nevyhnutná'),
      'description':description,
      'url':url
    }


def page_urls(page,session):
    r=session.get(SEARCH,params={'pageNr':page,'pageSize':PAGE_SIZE},headers=HEADERS,timeout=25)
    r.raise_for_status()
    soup=BeautifulSoup(r.text,'html.parser')
    found=[]
    for a in soup.find_all('a',href=True):
        href=a['href']
        if re.search(r'/pracovne-ponuky/[0-9a-fA-F-]{30,}',href):
            u=urljoin(BASE,href.split('?')[0])+'?lang=sk'
            if u not in found: found.append(u)
    return found


def main():
    s=requests.Session(); jobs=[]; seen=set(); failures=0
    empty_pages=0

    for page in range(1,MAX_PAGES+1):
        try:
            urls=page_urls(page,s)
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
        print('page',page,'jobs',len(jobs))
        if len(jobs)>=MAX_JOBS: break

    if not jobs:
        raise SystemExit('No active vacancies fetched; keeping previous jobs-data.json')

    jobs.sort(key=lambda j:(j.get('updated',''),j.get('title',''),j.get('location','')),reverse=True)
    categories=sorted(set(j.get('category','Iné profesie') for j in jobs))
    data={
      'updatedAt':datetime.now(timezone.utc).isoformat(),
      'source':'Služby zamestnanosti','activeOnly':True,'schemaVersion':3,
      'collectionMode':'broad-market-feed',
      'pagesScanned':min(MAX_PAGES,page),
      'marketCategories':categories,
      'jobCount':len(jobs),'failures':failures,'jobs':jobs
    }
    Path('jobs-data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    print('saved',len(jobs),'active market-wide vacancies')

if __name__=='__main__': main()
