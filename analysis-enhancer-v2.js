/* JobAI — vacancy analysis v2: clean skills + weighted match */
(function(){
  'use strict';
  var SKILLS=['JavaScript','TypeScript','HTML','CSS','React','Vue','Angular','Python','Java','C#','C++','PHP','SQL','Git','Docker','Linux','Excel','Word','PowerPoint','AutoCAD','SolidWorks','SAP','PLC','CNC','Heidenhain','Fanuc','Siemens','AWS','Azure','Kubernetes','Figma','Photoshop','Sklad','VZV','vodičský preukaz','B vodičský preukaz','angličtina','nemčina','slovenčina','ukrajinčina','čeština','poľština'];
  var LANG={uk:{skills:'Ключові навички',match:'Відповідність вакансії',none:'Навички не знайдено',matched:'збігів',tip:'Порада: додайте відсутні ключові навички у резюме, якщо маєте відповідний досвід.'},sk:{skills:'Kľúčové zručnosti',match:'Zhoda s pracovnou ponukou',none:'Zručnosti sa nenašli',matched:'zhôd',tip:'Tip: pridajte chýbajúce kľúčové zručnosti do životopisu, ak máte relevantné skúsenosti.'},en:{skills:'Key skills',match:'Vacancy match',none:'No skills found',matched:'matches',tip:'Tip: add missing key skills to your resume when you have relevant experience.'}};
  function lang(){var l=(localStorage.getItem('jobaiLanguage')||document.documentElement.lang||'uk').toLowerCase();return l.indexOf('sk')===0?'sk':l.indexOf('en')===0?'en':'uk';}
  function text(id){var e=document.getElementById(id);return e&&('value' in e)?e.value:(e?e.textContent:'');}
  function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
  function skills(s){var n=norm(s),out=[];SKILLS.forEach(function(x){var q=norm(x);if(n.indexOf(q)>=0&&!out.some(function(y){return norm(y)===q;}))out.push(x);});return out;}
  function resumeText(){return ['name','position','profile','skills','languages'].map(text).join(' ')+' '+(Array.isArray(window.experiences)?JSON.stringify(window.experiences):'')+' '+(Array.isArray(window.educations)?JSON.stringify(window.educations):'');}
  function update(){
    var job=text('jobText')||text('job');if(!job)return;
    var rs=resumeText(), js=skills(job), rsSkills=skills(rs), matched=js.filter(function(x){return norm(rs).indexOf(norm(x))>=0;}), missing=js.filter(function(x){return !matched.some(function(y){return norm(y)===norm(x);});});
    var title=norm(text('position')), roleHit=title&&norm(job).indexOf(title)>=0?1:0;
    var expHit=matched.length?Math.min(1,matched.length/Math.max(1,js.length)):0;
    var languageHit=js.filter(function(x){return ['angličtina','nemčina','slovenčina','ukrajinčina','čeština','poľština'].indexOf(x)>=0&&norm(rs).indexOf(norm(x))>=0;}).length>0?1:0;
    var other=roleHit*.6+expHit*.4;
    var score=Math.round((matched.length/Math.max(1,js.length))*45+other*25+languageHit*15+(rsSkills.length>0?15:5));
    score=Math.max(0,Math.min(100,score));
    var scoreEl=document.getElementById('score'),bar=document.getElementById('progressBar');if(scoreEl)scoreEl.textContent=score+'%';if(bar)bar.style.width=score+'%';
    var box=document.getElementById('jobaiAnalysisEnhancement');if(box){var e=document.getElementById('jobaiEnhSkills');if(e)e.innerHTML=js.length?js.map(function(x){return '<span style="display:inline-block;margin:3px 5px 3px 0;padding:5px 9px;border-radius:999px;background:rgba(59,130,246,.16)">'+x+'</span>';}).join(' '):LANG[lang()].none;var m=box.querySelector('[data-jobai-v2-matched]');if(m)m.textContent=matched.length+' '+LANG[lang()].matched;var mm=box.querySelector('[data-jobai-v2-missing]');if(mm)mm.innerHTML=missing.length?missing.join(', '):'—';}
    if(box&&!box.querySelector('[data-jobai-v2-note]')){var note=document.createElement('div');note.dataset.jobaiV2Note='1';note.style.cssText='margin-top:12px;font-size:13px;opacity:.8';note.textContent=LANG[lang()].tip;box.appendChild(note);}
    if(box){var labels=box.querySelectorAll('div');labels.forEach(function(e){if(e.textContent.trim()===LANG.uk.skills||e.textContent.trim()===LANG.sk.skills||e.textContent.trim()===LANG.en.skills)e.textContent=LANG[lang()].skills;});}
  }
  function hook(){document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button');if(!b)return;var t=norm(b.textContent);if(t.indexOf('analiz')>=0||t.indexOf('аналіз')>=0||t.indexOf('analyz')>=0)setTimeout(update,350);});setTimeout(update,1200);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();
