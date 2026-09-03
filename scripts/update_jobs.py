from __future__ import annotations
import json, re, time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup

BASE='https://www.sluzbyzamestnanosti.gov.sk'
SEARCH=BASE+'/pracovne-ponuky'
QUERIES=['CNC','zvárač','elektrikár','skladník','vodič','operátor výroby','programátor','metrológ']
HEADERS={'User-Agent':'JobAI-Slovakia/1.0 (+https://zyzyll1993-del.github.io/jobai-slovakia/)'}

def clean(s): return re.sub(r'\s+',' ',str(s or '')).strip()

def value_after(lines,label):
    low=label.lower()
    for i,x in enumerate(lines):
        if low in x.lower():
            for y in lines[i+1:i+6]:
                y=clean(y)
                if y and y.lower()!=low and not y.endswith(':'):
                    return y
    return ''

def detail(url, category, session):
    r=session.get(url,headers=HEADERS,timeout=25); r.raise_for_status()
    soup=BeautifulSoup(r.text,'html.parser')
    h1=soup.find('h1')
    title=clean(h1.get_text(' ',strip=True) if h1 else '')
    lines=[clean(x) for x in soup.stripped_strings if clean(x)]
    employer=''
    if title in lines:
        idx=lines.index(title)
        for x in lines[idx+1:idx+8]:
            if 'Miesto výkonu práce' in x or 'Dátum nástupu' in x: break
            if x and x not in {'(muž/žena)','muž/žena'}:
                employer=x; break
    location=value_after(lines,'Miesto výkonu práce')
    salary=value_after(lines,'Základná zložka mzdy')
    updated=value_after(lines,'Naposledy aktualizované')
    if not title: return None
    return {'title':title,'employer':employer,'location':location,'salary':salary,'category':category,'updated':updated,'url':url}

def search_urls(query,session,limit=6):
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
    s=requests.Session(); jobs=[]; seen=set()
    for q in QUERIES:
        try: urls=search_urls(q,s)
        except Exception as e:
            print('search failed',q,e); continue
        for u in urls:
            if u in seen: continue
            seen.add(u)
            try:
                j=detail(u,q,s)
                if j: jobs.append(j)
            except Exception as e: print('detail failed',u,e)
            time.sleep(.15)
    data={'updatedAt':datetime.now(timezone.utc).isoformat(),'source':'Služby zamestnanosti','jobs':jobs}
    Path('jobs-data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    print('saved',len(jobs),'jobs')

if __name__=='__main__': main()
