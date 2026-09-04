/* JobAI — vacancy analysis v2: clean skills + weighted match */
(function(){
  'use strict';
  var SKILLS=['JavaScript','TypeScript','HTML','CSS','React','Vue','Angular','Python','Java','C#','C++','PHP','SQL','Git','Docker','Linux','Excel','Word','PowerPoint','AutoCAD','SolidWorks','SAP','PLC','CNC','Heidenhain','Fanuc','Siemens','AWS','Azure','Kubernetes','Figma','Photoshop','Sklad','VZV','vodičský preukaz','B vodičský preukaz','angličtina','nemčina','slovenčina','ukrajinčina','čeština','poľština'];
  var LANG={uk:{skills:'Ключові навички',match:'Відповідність вакансії',matched:'Відповідає резюме',missing:'Чого не вистачає',none:'Навички не знайдено',tip:'Порада: додайте відсутні ключові навички у резюме, якщо маєте відповідний досвід.'},sk:{skills:'Kľúčové zručnosti',match:'Zhoda s pracovnou ponukou',matched:'Zodpovedá životopisu',missing:'Čo chýba',none:'Zručnosti sa nenašli',tip:'Tip: pridajte chýbajúce kľúčové zručnosti do životopisu, ak máte relevantné skúsenosti.'},en:{skills:'Key skills',match:'Vacancy match',matched:'Matches resume',missing:'What is missing',none:'No skills found',tip:'Tip: add missing key skills to your resume when you have relevant experience.'}};
  function lang(){var l=(localStorage.getItem('jobaiLanguage')||document.documentElement.lang||'uk').toLowerCase();return l.indexOf('sk')===0?'sk':l.indexOf('en')===0?'en':'uk';}
  function text(id){var e=document.getElementById(id);return e&&('value' in e)?e.value:(e?e.textContent:'');}
  function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
  function skills(s){var n=norm(s),out=[];SKILLS.forEach(function(x){var q=norm(x);if(n.indexOf(q)>=0&&!out.some(function(y){return norm(y)===q;}))out.push(x);});return out;}
  function resumeText(){return ['name','position','profile','skills','languages'].map(text).join(' ')+' '+(Array.isArray(window.experiences)?JSON.stringify(window.experiences):'')+' '+(Array.isArray(window.educations)?JSON.stringify(window.educations):'');}
  function escape(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');}
  function update(){
    var result=document.getElementById('analysisResult'),job=text('jobText')||text('job');if(!result||!job)return;
    var rs=resumeText(),js=skills(job),rsSkills=skills(rs),matched=js.filter(function(x){return norm(rs).indexOf(norm(x))>=0;}),missing=js.filter(function(x){return !matched.some(function(y){return norm(y)===norm(x);});});
    var title=norm(text('position')),roleHit=title&&norm(job).indexOf(title)>=0?1:0;
    var expHit=matched.length?Math.min(1,matched.length/Math.max(1,js.length)):0;
    var languageHit=js.filter(function(x){return ['angličtina','nemčina','slovenčina','ukrajinčina','čeština','poľština'].indexOf(x)>=0&&norm(rs).indexOf(norm(x))>=0;}).length>0?1:0;
    var other=roleHit*.6+expHit*.4;
    var score=Math.round((matched.length/Math.max(1,js.length))*45+other*25+languageHit*15+(rsSkills.length>0?15:5));
    score=Math.max(0,Math.min(100,score));
    var scoreEl=document.getElementById('score'),bar=document.getElementById('progressBar');if(scoreEl)scoreEl.textContent=score+'%';if(bar)bar.style.width=score+'%';
    var old=document.getElementById('jobaiAnalysisEnhancement');if(old)old.remove();
    var t=LANG[lang()],box=document.createElement('div');box.id='jobaiAnalysisEnhancement';box.style.cssText='margin-top:18px;padding:16px;border-radius:14px;border:1px solid rgba(127,127,127,.25);background:rgba(127,127,127,.06)';
    box.innerHTML='<div style="font-weight:800;margin-bottom:8px">'+t.skills+'</div><div style="margin-bottom:14px">'+(js.length?js.map(function(x){return '<span style="display:inline-block;margin:3px 5px 3px 0;padding:5px 9px;border-radius:999px;background:rgba(59,130,246,.16)">'+escape(x)+'</span>';}).join(''):'<span>'+t.none+'</span>')+'</div><div style="font-weight:800;margin-bottom:6px">'+t.matched+'</div><div style="margin-bottom:14px">'+(matched.length?escape(matched.join(', ')):'—')+'</div><div style="font-weight:800;margin-bottom:6px">'+t.missing+'</div><div style="margin-bottom:14px">'+(missing.length?escape(missing.join(', ')):'—')+'</div><div style="font-weight:800;margin-bottom:6px">'+t.match+'</div><div style="font-size:24px;font-weight:800;margin-bottom:8px">'+score+'%</div><div style="font-size:13px;opacity:.8">'+t.tip+'</div>';
    result.appendChild(box);
  }
  function loadRecommendations(){
    if(typeof window.renderJobRecommendations==='function'){setTimeout(window.renderJobRecommendations,50);return;}
    if(window.__jobaiRecommendationsLoading)return;
    window.__jobaiRecommendationsLoading=true;
    var old=document.getElementById('jobaiRecommendationsScript');if(old)old.remove();
    var s=document.createElement('script');s.id='jobaiRecommendationsScript';s.src='job-recommendations-v7.js?v=1';s.defer=true;
    s.onload=function(){window.__jobaiRecommendationsLoading=false;if(typeof window.renderJobRecommendations==='function')window.renderJobRecommendations();};
    s.onerror=function(){window.__jobaiRecommendationsLoading=false;};
    document.head.appendChild(s);
  }
  function hook(){document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button');if(!b)return;var t=norm(b.textContent);if(t.indexOf('analiz')>=0||t.indexOf('аналіз')>=0||t.indexOf('analyz')>=0){setTimeout(update,500);setTimeout(loadRecommendations,650);}});setTimeout(update,1200);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();

/* Lazy vacancies launcher: the heavy catalog is loaded only after user opens Jobs. */
(function(){
  'use strict';
  function currentLang(){var l=(localStorage.getItem('jobaiLanguage')||document.documentElement.lang||'uk').toLowerCase();return l.indexOf('sk')===0?'sk':l.indexOf('en')===0?'en':'uk';}
  function label(){var l=currentLang();return l==='sk'?'Pracovné ponuky':l==='en'?'Jobs':'Вакансії';}
  function translate(){var b=document.getElementById('navJobs');if(b)b.textContent=label();}
  function openJobs(){
    if(document.getElementById('jobs')){if(typeof window.showTab==='function')window.showTab('jobs');return;}
    if(window.__jobaiJobsLoading)return;
    window.__jobaiJobsLoading=true;
    var s=document.createElement('script');s.id='jobaiJobsPageScript';s.src='jobs-page.js?v=8';s.defer=true;
    s.onload=function(){window.__jobaiJobsLoading=false;translate();setTimeout(function(){if(typeof window.showTab==='function')window.showTab('jobs');},0);};
    s.onerror=function(){window.__jobaiJobsLoading=false;};
    document.head.appendChild(s);
  }
  function init(){
    var nav=document.querySelector('.nav');if(!nav)return;
    var b=document.getElementById('navJobs');
    if(!b){b=document.createElement('button');b.id='navJobs';b.type='button';b.addEventListener('click',openJobs);var a=document.getElementById('navAnalysis');if(a)nav.insertBefore(b,a);else nav.appendChild(b);}
    translate();
  }
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button');if(!b)return;var x=(b.textContent||'').trim().toUpperCase();if(x==='UA'||x==='SK'||x==='EN')setTimeout(translate,100);});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
