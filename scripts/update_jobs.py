from __future__ import annotations
import json, re, time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup

BASE='https://www.sluzbyzamestnanosti.gov.sk'
SEARCH=BASE+'/pracovne-ponuky'
QUERY_GROUPS={
 'Výroba a strojárstvo':['operátor výroby','montážny pracovník','CNC','obrábač kovov','nastavovač strojov','nástrojár','strojár','údržbár','mechanik'],
 'Elektro a technika':['elektrikár','elektrotechnik','elektromontér','technik údržby','mechatronik','automatizácia','PLC'],
 'Zváranie a kovovýroba':['zvárač','zámočník','klampiar','lakovník','brúsič'],
 'Logistika a sklad':['skladník','VZV','komisionár','picker','logistika','dispečer','zásobovač'],
 'Doprava':['vodič','vodič kamiónu','vodič autobusu','kuriér','taxikár'],
 'Stavebníctvo':['stavebný pracovník','murár','tesár','železiar','inštalatér','vodoinštalatér','stavebný elektrikár','bagrista'],
 'Obchod a služby':['predavač','pokladník','obchodný zástupca','pracovník zákazníckeho servisu','recepčný','upratovač','SBS'],
 'Gastro a hotelierstvo':['kuchár','čašník','barman','pomocná sila v kuchyni','pekár','cukrár','hotel'],
 'Zdravotníctvo a sociálne služby':['sestra','zdravotná sestra','lekár','opatrovateľ','sanitár','sociálny pracovník','farmaceut'],
 'Administratíva a financie':['administratívny pracovník','účtovník','mzdový účtovník','asistent','referent','ekonóm','finančný analytik'],
 'IT a digitál':['programátor','developer','IT technik','správca siete','tester','data analyst','kybernetická bezpečnosť'],
 'Kvalita a inžiniering':['kontrolór kvality','metrológ','CMM','procesný inžinier','technológ','konštruktér','projektový inžinier'],
 'Školstvo':['učiteľ','pedagogický asistent','vychovávateľ','lektor'],
 'Poľnohospodárstvo a potravinárstvo':['poľnohospodársky pracovník','traktorista','mäsiar','potravinárska výroba','agronóm'],
 'Remeslá a servis':['automechanik','autoservis','kaderník','barber','servisný technik','chladiar','stolár']
}
HEADERS={'User-Agent':'JobAI-Slovakia/1.2 (+https://zyzyll1993-del.github.io/jobai-slovakia/)'}

def clean(s): return re.sub(r'\s+',' ',str(s or '')).strip()

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
                y=clean(y)
                yl=y.lower()
                if any(s in yl for s in stops): break
                if y and yl!=low and y not in out: out.append(y)
                if len(out)>=max_items: break
            return out
    return []

def inactive(lines):
    text=' '.join(lines).lower()
    markers=['ponuka už nie je aktívna','ponuka nie je aktívna','pracovná ponuka bola zrušená','ponuka bola zrušená','neaktívna pracovná ponuka']
    return any(x in text for x in markers)

def detail(url, category, query, session):
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
    return {
      'title':title,'employer':employer,
      'location':value_after(lines,'Miesto výkonu práce'),
      'salary':value_after(lines,'Základná zložka mzdy'),
      'category':category,'searchTerm':query,
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

def search_urls(query,session,limit=12):
    r=session.get(SEARCH,params={'nazovProfesie':query},headers=HEADERS,timeout=25); r.raise_for_status()
    soup=BeautifulSoup(r.text,'html.parser')
    found=[]
    for a in soup.find_all('a',href=True):
        href=a['href']
        if re.search(r'/pracovne-ponuky/[0-9a-fA-F-]{30,}',href):
            u=urljoin(BASE,href.split('?')[0])+'?lang=sk'
            if u not in found: found.append(u)
            if len(found)>=limit: break
    return found

def main():
    s=requests.Session(); jobs=[]; seen=set(); failures=0
    for category,queries in QUERY_GROUPS.items():
        for q in queries:
            try: urls=search_urls(q,s)
            except Exception as e:
                failures+=1; print('search failed',q,e); continue
            for u in urls:
                if u in seen: continue
                seen.add(u)
                try:
                    j=detail(u,category,q,s)
                    if j: jobs.append(j)
                except Exception as e:
                    failures+=1; print('detail failed',u,e)
                time.sleep(.08)
    if not jobs:
        raise SystemExit('No active vacancies fetched; keeping previous jobs-data.json')
    jobs.sort(key=lambda j:(j.get('category',''),j.get('title',''),j.get('location','')))
    data={
      'updatedAt':datetime.now(timezone.utc).isoformat(),
      'source':'Služby zamestnanosti','activeOnly':True,'schemaVersion':2,
      'marketCategories':list(QUERY_GROUPS.keys()),
      'queryCount':sum(len(x) for x in QUERY_GROUPS.values()),
      'jobCount':len(jobs),'failures':failures,'jobs':jobs
    }
    Path('jobs-data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    print('saved',len(jobs),'active jobs with detailed requirements')

if __name__=='__main__': main()
