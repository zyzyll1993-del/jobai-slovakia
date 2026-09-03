/* JobAI — vacancy analysis v5: structured weighted resume match */
(function(){
'use strict';
var T={
 ua:{profession:'Професія',matched:'Збігається з резюме',missing:'Потрібно перевірити',why:'Як розраховано',advice:'Рекомендація',empty:'Вставте текст вакансії.',good:'Сильна орієнтовна відповідність вимогам вакансії.',mid:'Середня орієнтовна відповідність. Варто адаптувати резюме під ключові вимоги.',low:'Є вимоги, яких резюме зараз не підтверджує. Додавайте лише реальні навички та досвід.',role:'посада',skills:'навички',langs:'мови',experience:'досвід',education:'освіта',license:'права',estimated:'Орієнтовна відповідність'},
 sk:{profession:'Profesia',matched:'Zhoduje sa so životopisom',missing:'Treba overiť',why:'Ako sa skóre počíta',advice:'Odporúčanie',empty:'Vložte text pracovnej ponuky.',good:'Silná odhadovaná zhoda s požiadavkami pracovnej ponuky.',mid:'Stredná odhadovaná zhoda. Životopis sa oplatí prispôsobiť kľúčovým požiadavkám.',low:'Niektoré požiadavky životopis zatiaľ nepotvrdzuje. Uvádzajte iba skutočné zručnosti a prax.',role:'pozícia',skills:'zručnosti',langs:'jazyky',experience:'prax',education:'vzdelanie',license:'vodičský preukaz',estimated:'Odhadovaná zhoda'},
 en:{profession:'Profession',matched:'Matches resume',missing:'Needs checking',why:'How the score is calculated',advice:'Recommendation',empty:'Paste the vacancy text.',good:'Strong estimated match with the vacancy requirements.',mid:'Medium estimated match. Tailor your resume to the key requirements.',low:'Some requirements are not currently evidenced in the resume. Add only genuine skills and experience.',role:'role',skills:'skills',langs:'languages',experience:'experience',education:'education',license:'driving licence',estimated:'Estimated match'}
};
function lang(){var l=(localStorage.getItem('jobaiLanguage')||document.documentElement.lang||'ua').toLowerCase();return l.indexOf('sk')===0?'sk':l.indexOf('en')===0?'en':'ua';}
function tr(){return T[lang()];}
function val(id){var e=document.getElementById(id);return e&&'value' in e?e.value:'';}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9+#а-яіїєґ\s-]/gi,' ').replace(/\s+/g,' ').trim();}
function tokens(s){var stop=['praca','pracovne','ponuka','ponuky','zamestnanec','zamestnanie','muz','zena','the','and','with','for','resume','zivotopis','резюме','poziadavky','poziadavka'];return norm(s).split(' ').filter(function(w){return w.length>2&&stop.indexOf(w)<0;});}
function overlap(required,have){var r=tokens(required),h=tokens(have);if(!r.length)return null;var u=r.filter(function(x,i){return r.indexOf(x)===i;}),hits=u.filter(function(x){return h.indexOf(x)>=0;}).length;return Math.round(hits/u.length*100);}
function resumeText(){var s=[val('position'),val('profile'),val('skills'),val('languages'),val('city')].join(' ');if(Array.isArray(window.experiences))s+=' '+JSON.stringify(window.experiences);if(Array.isArray(window.educations))s+=' '+JSON.stringify(window.educations);return s;}
function field(text,labels){var lines=String(text||'').split(/\n+/);for(var i=0;i<lines.length;i++){for(var j=0;j<labels.length;j++){var n=norm(lines[i]),l=norm(labels[j]);if(n.indexOf(l)===0){var p=lines[i].indexOf(':');return p>=0?lines[i].slice(p+1).trim():lines[i].slice(labels[j].length).trim();}}}return '';}
function firstLine(text){return String(text||'').split(/\n+/).map(function(x){return x.trim();}).filter(Boolean)[0]||'';}
function parseJob(text){return {
 title:firstLine(text),
 skills:field(text,['Počítačové zručnosti','Pocitacove zrucnosti','Skills','Навички']),
 langs:field(text,['Požadované jazyky','Požadované cudzie jazyky','Languages','Мови']),
 experience:field(text,['Požadovaná prax','Prax','Experience','Досвід']),
 education:field(text,['Požadované vzdelanie','Požadovaný stupeň vzdelania','Education','Освіта']),
 license:field(text,['Vodičské oprávnenie','Vodičské oprávnenia','Driving licence','Водійські права']),
 slovak:field(text,['Slovenčina nevyhnutná','Znalosť slovenského jazyka je nevyhnutná'])
};}
function add(parts,key,score,w,label,required){parts.push({key:key,score:score==null?0:score,w:w,label:label,required:required});}
function analyze(){
 var jobEl=document.getElementById('jobText')||document.getElementById('job'),result=document.getElementById('analysisResult'),tt=tr();if(!jobEl||!result)return;
 var text=jobEl.value.trim();if(!text){result.style.display='block';var rr=document.getElementById('recommendation');if(rr)rr.textContent='⚠️ '+tt.empty;return;}
 var j=parseJob(text),cv=resumeText(),parts=[];
 var role=overlap(j.title,val('position')+' '+cv);add(parts,'role',role===null?40:Math.max(20,role),30,tt.role,j.title);
 if(j.skills){var s=overlap(j.skills,val('skills')+' '+cv);add(parts,'skills',s===null?0:s,30,tt.skills,j.skills);}
 var langReq=j.langs+(norm(j.slovak)==='ano'?' slovenčina':'');if(norm(langReq)){var l=overlap(langReq,val('languages')+' '+cv);add(parts,'langs',l===null?0:l,15,tt.langs,langReq);}
 if(j.experience){var e=overlap(j.experience,cv);add(parts,'experience',e===null?25:Math.max(25,e),10,tt.experience,j.experience);}
 if(j.education){var ed=overlap(j.education,cv);add(parts,'education',ed===null?20:Math.max(20,ed),10,tt.education,j.education);}
 if(j.license){var li=overlap(j.license,cv);add(parts,'license',li===null?0:li,5,tt.license,j.license);}
 var tw=parts.reduce(function(a,p){return a+p.w;},0),score=tw?Math.round(parts.reduce(function(a,p){return a+p.score*p.w;},0)/tw):50;score=Math.max(10,Math.min(99,score));
 var scoreEl=document.getElementById('score'),bar=document.getElementById('progressBar');if(scoreEl)scoreEl.textContent=score+'%';if(bar)bar.style.width=score+'%';
 var detected=document.getElementById('detectedJobs');if(detected){detected.style.display='block';detected.innerHTML='<strong>🔎 '+tt.profession+':</strong><p>'+esc(j.title||'—')+'</p>';}
 var good=parts.filter(function(p){return p.score>=65;}),check=parts.filter(function(p){return p.score<65;});
 function list(a){return a.length?'<ul>'+a.map(function(p){return '<li><b>'+esc(p.label)+'</b>: '+esc(p.required||'—')+' ('+p.score+'%)</li>';}).join('')+'</ul>':'<p>—</p>';}
 var found=document.getElementById('found'),missing=document.getElementById('missing');if(found)found.innerHTML=list(good);if(missing)missing.innerHTML=list(check);
 var rec=document.getElementById('recommendation');if(rec)rec.textContent=score>=75?'🟢 '+tt.good:score>=50?'🟡 '+tt.mid:'🔴 '+tt.low;
 var old=document.getElementById('jobaiAnalysisEnhancement');if(old)old.remove();var box=document.createElement('div');box.id='jobaiAnalysisEnhancement';box.className='jobai-analysis-v5';box.innerHTML='<h3>📊 '+tt.estimated+': '+score+'%</h3><div class="ja-grid"><section><h3>✅ '+tt.matched+'</h3>'+list(good)+'</section><section><h3>⚠️ '+tt.missing+'</h3>'+list(check)+'</section></div><section><h3>🧮 '+tt.why+'</h3><div class="ja-metrics">'+parts.map(function(p){return '<span>'+esc(p.label)+': <b>'+p.score+'%</b> · '+p.w+'</span>';}).join('')+'</div></section><section><h3>💡 '+tt.advice+'</h3><p>'+(score>=75?tt.good:score>=50?tt.mid:tt.low)+'</p></section>';
 result.appendChild(box);result.style.display='block';
 if(!document.getElementById('jobaiAnalysisV5Style')){var st=document.createElement('style');st.id='jobaiAnalysisV5Style';st.textContent='.jobai-analysis-v5{margin-top:18px;padding:18px;border:1px solid rgba(127,127,127,.25);border-radius:16px;background:rgba(127,127,127,.05)}.jobai-analysis-v5 section{margin:14px 0}.ja-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.ja-metrics{display:flex;gap:8px;flex-wrap:wrap}.ja-metrics span{padding:8px 10px;border-radius:10px;background:rgba(59,130,246,.12)}@media(max-width:700px){.ja-grid{grid-template-columns:1fr}}';document.head.appendChild(st);}
 if(typeof window.renderJobRecommendations==='function')setTimeout(window.renderJobRecommendations,20);setTimeout(function(){result.scrollIntoView({behavior:'smooth',block:'start'});},80);
}
window.analyzeJob=analyze;
function loadScript(id,src){if(document.getElementById(id))return;var s=document.createElement('script');s.id=id;s.src=src;document.head.appendChild(s);}
function loadExtras(){loadScript('jobaiRecommendationsScript','job-recommendations.js?v=4');loadScript('jobaiJobsPageScript','jobs-page.js?v=4');}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadExtras);else loadExtras();
})();
