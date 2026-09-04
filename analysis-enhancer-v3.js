/* JobAI — structured vacancy analysis v3 */
(function(){
'use strict';

var UI={
  ua:{
    empty:'Вставте текст вакансії.', estimated:'Орієнтовна відповідність', disclaimer:'Це оцінка відповідності вимогам вакансії, а не ймовірність працевлаштування.',
    position:'Посада',skills:'Навички',languages:'Мови',experience:'Досвід',education:'Освіта',licence:'Водійські категорії',location:'Локація',
    matched:'Підтверджено в резюме',missing:'Чого не видно в резюме',unknown:'Недостатньо даних для точної оцінки',notRequired:'Не вимагається',
    good:'Хороша відповідність. Перевірте нижче, які вимоги підтверджені та чого не видно в резюме.',
    partial:'Часткова відповідність. Додавайте до резюме лише той досвід і навички, які справді маєте.',
    low:'Низька відповідність за даними, які зараз є в резюме. Перевірте відсутні вимоги нижче.',
    title:'Структурований аналіз вимог', requirement:'Вимога вакансії', resume:'У резюме',
    roleOk:'Бажана посада схожа на вакансію', roleMiss:'Бажана посада не збігається з вакансією',
    expOk:'Досвіду за датами достатньо', expMiss:'За датами досвіду менше, ніж вимагається', expUnknown:'У резюме немає достатніх дат для перевірки досвіду',
    eduOk:'Освіта схожа на вимогу вакансії', eduMiss:'Потрібний рівень/тип освіти не видно в резюме',
    langOk:'Потрібна мова вказана в резюме', langMiss:'Потрібна мова не вказана в резюме',
    licenceOk:'Потрібна категорія вказана в резюме', licenceMiss:'Потрібна категорія не вказана в резюме',
    skillsOk:'Знайдені потрібні навички', skillsMiss:'Не видно потрібних навичок'
  },
  sk:{
    empty:'Vložte text pracovnej ponuky.', estimated:'Odhadovaná zhoda', disclaimer:'Ide o odhad zhody s požiadavkami ponuky, nie o pravdepodobnosť prijatia.',
    position:'Pozícia',skills:'Zručnosti',languages:'Jazyky',experience:'Prax',education:'Vzdelanie',licence:'Vodičské oprávnenie',location:'Lokalita',
    matched:'Potvrdené v životopise',missing:'Čo v životopise nevidno',unknown:'Nedostatok údajov na presné posúdenie',notRequired:'Nevyžaduje sa',
    good:'Dobrá zhoda. Nižšie skontrolujte potvrdené a chýbajúce požiadavky.',
    partial:'Čiastočná zhoda. Do životopisu dopĺňajte iba skúsenosti a zručnosti, ktoré skutočne máte.',
    low:'Nízka zhoda podľa údajov, ktoré sú teraz v životopise. Skontrolujte chýbajúce požiadavky.',
    title:'Štruktúrovaná analýza požiadaviek', requirement:'Požiadavka ponuky', resume:'V životopise',
    roleOk:'Želaná pozícia je podobná ponuke', roleMiss:'Želaná pozícia sa nezhoduje s ponukou',
    expOk:'Prax podľa dátumov spĺňa požiadavku', expMiss:'Prax podľa dátumov je kratšia než požiadavka', expUnknown:'V životopise nie sú dostatočné dátumy na overenie praxe',
    eduOk:'Vzdelanie je podobné požiadavke ponuky', eduMiss:'Požadovanú úroveň/typ vzdelania v životopise nevidno',
    langOk:'Požadovaný jazyk je uvedený v životopise', langMiss:'Požadovaný jazyk v životopise nie je uvedený',
    licenceOk:'Požadovaná skupina je uvedená v životopise', licenceMiss:'Požadovaná skupina v životopise nie je uvedená',
    skillsOk:'Nájdené požadované zručnosti', skillsMiss:'Požadované zručnosti sa v životopise nevidia'
  },
  en:{
    empty:'Paste the job vacancy text.', estimated:'Estimated match', disclaimer:'This is an estimate of fit with vacancy requirements, not a hiring probability.',
    position:'Position',skills:'Skills',languages:'Languages',experience:'Experience',education:'Education',licence:'Driving licence',location:'Location',
    matched:'Confirmed in resume',missing:'What is not shown in the resume',unknown:'Not enough information for a precise assessment',notRequired:'Not required',
    good:'Good match. Review the confirmed and missing requirements below.',
    partial:'Partial match. Add only experience and skills you actually have.',
    low:'Low match based on the information currently shown in your resume. Review the missing requirements below.',
    title:'Structured requirements analysis', requirement:'Vacancy requirement', resume:'In resume',
    roleOk:'Desired role is similar to the vacancy', roleMiss:'Desired role does not match the vacancy',
    expOk:'Experience dates appear to meet the requirement', expMiss:'Experience dates show less experience than required', expUnknown:'Resume dates are insufficient to verify experience',
    eduOk:'Education appears similar to the vacancy requirement', eduMiss:'Required education level/type is not shown in the resume',
    langOk:'Required language is shown in the resume', langMiss:'Required language is not shown in the resume',
    licenceOk:'Required licence category is shown in the resume', licenceMiss:'Required licence category is not shown in the resume',
    skillsOk:'Required skills found', skillsMiss:'Required skills are not shown in the resume'
  }
};

var DIRECT_SKILLS=[
 'CNC','Fanuc','Siemens','Heidenhain','Mazatrol','CMM','Calypso','AutoCAD','SolidWorks','CATIA','PLC','SAP','Excel','VZV','MIG','MAG','TIG','JavaScript','TypeScript','React','Vue','Angular','Python','Java','C#','C++','PHP','SQL','Git','Docker','Linux','AWS','Azure','Kubernetes',
 'meranie','rezanie','ohýbanie','tvarovanie','plech','ručné náradie','zváranie','montáž','údržba','diagnostika','kontrola kvality','technické výkresy','programovanie','sklad','logistika','elektrotechnika','mechanika'
];

function lang(){var l=(localStorage.getItem('jobaiLanguage')||document.documentElement.lang||'ua').toLowerCase();return l.indexOf('sk')===0?'sk':l.indexOf('en')===0?'en':'ua';}
function tr(){return UI[lang()];}
function text(id){var e=document.getElementById(id);return e&&('value' in e)?String(e.value||''):e?String(e.textContent||''):'';}
function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}
function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9+#а-яіїєґ\s:;,./+()-]/gi,' ').replace(/\s+/g,' ').trim();}
function tokens(v){var stop=['praca','pracovne','ponuka','ponuky','zamestnanec','zamestnanie','muz','zena','the','and','with','for','position','pozicia','резюме','resume','zivotopis'];return norm(v).split(/\s+/).filter(function(x){return x.length>2&&stop.indexOf(x)<0;});}
function uniq(a){var out=[];(a||[]).forEach(function(x){x=String(x||'').trim();if(x&&!out.some(function(y){return norm(y)===norm(x);}))out.push(x);});return out;}
function canonical(v){var n=' '+norm(v)+' ';var reps=[
 [/\bчпу\b/g,' cnc '],[/\bоператор\s+чпу\b/g,' cnc operator '],[/\bcnc\s+operat(?:or|er)\b/g,' cnc operator '],
 [/\bскладник\b/g,' skladnik '],[/\bwarehouse\b/g,' sklad '],[/\bводій\b/g,' vodic '],[/\bdriver\b/g,' vodic '],
 [/\bзварювальник\b/g,' zvarac '],[/\bwelder\b/g,' zvarac '],[/\bелектрик\b/g,' elektrikar '],[/\belectrician\b/g,' elektrikar '],
 [/\bмеханік\b/g,' mechanik '],[/\bmechanic\b/g,' mechanik '],[/\bпрограміст\b/g,' programator '],[/\bprogrammer\b/g,' programator '],[/\bdeveloper\b/g,' programator '],
 [/\bметролог\b/g,' metrolog '],[/\bmetrologist\b/g,' metrolog '],[/\bproduction\b/g,' vyroba '],[/\bвиробництв\w*\b/g,' vyroba ']
 ];reps.forEach(function(r){n=n.replace(r[0],r[1]);});return n.replace(/\s+/g,' ').trim();}
function overlap(a,b){var aa=tokens(canonical(a)),bb=tokens(canonical(b));if(!aa.length)return null;var u=aa.filter(function(x,i){return aa.indexOf(x)===i;}),hits=u.filter(function(x){return bb.indexOf(x)>=0;}).length;return Math.round(hits/u.length*100);}

function resumeText(){var s=[text('position'),text('profile'),text('skills'),text('languages'),text('city')].join(' ');if(Array.isArray(window.experiences))s+=' '+JSON.stringify(window.experiences);if(Array.isArray(window.educations))s+=' '+JSON.stringify(window.educations);return s;}
function resumeEducation(){return Array.isArray(window.educations)?window.educations.map(function(x){return [x&&x.school,x&&x.speciality,x&&x.specialty,x&&x.year].filter(Boolean).join(' ');}).join(' '):'';}
function lines(job){return String(job||'').split(/\r?\n/).map(function(x){return x.trim();}).filter(Boolean);}
function vacancyTitle(job){var ls=lines(job);for(var i=0;i<ls.length;i++){if(ls[i]&&ls[i].indexOf(':')<0)return ls[i];}return ls[0]||'';}
function valueAfter(job,labels){var ls=lines(job);for(var i=0;i<ls.length;i++){var n=norm(ls[i]);for(var j=0;j<labels.length;j++){var label=norm(labels[j]);if(n.indexOf(label)===0){var p=ls[i].indexOf(':');if(p>=0)return ls[i].slice(p+1).trim();}}}return '';}
function locationText(job){return valueAfter(job,['Miesto výkonu práce','Miesto','Mesto'])||'';}

function directSkills(job){var n=norm(job),out=[];DIRECT_SKILLS.forEach(function(x){if(n.indexOf(norm(x))>=0)out.push(x);});if(typeof window.findJobSkills==='function'){try{out=out.concat(window.findJobSkills(job)||[]);}catch(e){}}return uniq(out).slice(0,18);}
function skillScore(req,have){if(!req.length)return null;var matched=req.filter(function(x){return norm(have).indexOf(norm(x))>=0||overlap(x,have)>=70;});return {score:Math.round(matched.length/req.length*100),matched:matched,missing:req.filter(function(x){return !matched.some(function(y){return norm(y)===norm(x);});})};}

function languageCode(v){var n=norm(v);if(/sloven|slovak|словац/.test(n))return 'sk';if(/anglic|english|англ/.test(n))return 'en';if(/nemc|german|німец/.test(n))return 'de';if(/ukrajin|ukrain|україн/.test(n))return 'uk';if(/cestin|cesk|czech|чеськ/.test(n))return 'cs';if(/polst|polish|польськ/.test(n))return 'pl';if(/madar|hungar|угорськ/.test(n))return 'hu';return '';}
function vacancyLanguages(job){var out=[];var sl=valueAfter(job,['Slovenčina nevyhnutná','Slovenský jazyk','Slovenčina']);if(sl&&/ano|áno|yes|required|povinn/i.test(sl))out.push('Slovenčina');var foreign=valueAfter(job,['Cudzí jazyk','Cudzie jazyky','Jazyk','Jazyky','Foreign language']);if(foreign&&!/bez poziadavky|nevyzaduje|nie|none/i.test(norm(foreign)))out=out.concat(foreign.split(/[,;/]+/));return uniq(out.filter(function(x){return languageCode(x);}));}
function languageFit(req){if(!req.length)return null;var haveText=text('languages')+' '+resumeText(),haveCodes=[];['Slovenčina','Angličtina','Nemčina','Ukrajinčina','Čeština','Poľština','Maďarčina'].forEach(function(x){if(norm(haveText).indexOf(norm(x))>=0||languageCode(haveText)===languageCode(x))haveCodes.push(languageCode(x));});var matched=req.filter(function(x){return haveCodes.indexOf(languageCode(x))>=0;});return {score:Math.round(matched.length/req.length*100),matched:matched,missing:req.filter(function(x){return matched.indexOf(x)<0;})};}

function parseMonths(v){var n=norm(v);if(!n)return null;if(/bez poziadavky|bez praxe|no experience|не вимага|без досвід/.test(n))return 0;var m=n.match(/(\d+(?:[.,]\d+)?)\s*(rok|roky|rokov|year|years|рік|роки|років)/);if(m)return Math.round(parseFloat(m[1].replace(',','.'))*12);m=n.match(/(\d+(?:[.,]\d+)?)\s*(mesiac|mesiace|mesiacov|month|months|місяц)/);if(m)return Math.round(parseFloat(m[1].replace(',','.')));return null;}
function dateMonth(v){var s=String(v||'').trim();if(!s)return null;if(/teraz|sucas|present|current|дотепер|тепер/i.test(s)){var d=new Date();return d.getFullYear()*12+d.getMonth();}var m=s.match(/^(\d{1,2})[./-](\d{4})$/);if(m)return +m[2]*12+(+m[1]-1);m=s.match(/^(\d{4})[./-](\d{1,2})$/);if(m)return +m[1]*12+(+m[2]-1);m=s.match(/^(\d{4})$/);if(m)return +m[1]*12;return null;}
function resumeMonths(){if(!Array.isArray(window.experiences)||!window.experiences.length)return null;var total=0,known=0,now=new Date().getFullYear()*12+new Date().getMonth();window.experiences.forEach(function(x){var a=dateMonth(x&&x.start),b=dateMonth(x&&x.end);if(a!=null){if(b==null)b=now;if(b>=a){total+=b-a+1;known++;}}});return known?Math.min(total,600):null;}
function experienceFit(job){var raw=valueAfter(job,['Požadovaná prax','Prax','Požadované skúsenosti','Experience']);var req=parseMonths(raw);if(req===null)return null;if(req===0)return {score:100,raw:raw,required:0,have:resumeMonths(),status:'ok'};var have=resumeMonths();if(have===null)return {score:20,raw:raw,required:req,have:null,status:'unknown'};return {score:Math.max(0,Math.min(100,Math.round(have/req*100))),raw:raw,required:req,have:have,status:have>=req?'ok':'missing'};}

function educationLevel(v){var n=norm(v);if(/vysokosk|univer|university|master|magister|inzinier|bakalar|bachelor/.test(n))return 5;if(/vyssie odborne|higher vocational/.test(n))return 4;if(/uplne stredne|maturit|secondary.*matur/.test(n))return 3;if(/stredne odborne|vocational|ucnov|učňov/.test(n))return 2;if(/nizsie stredne|zakladne|primary|basic education/.test(n))return 1;return null;}
function educationFit(job){var raw=valueAfter(job,['Požadované vzdelanie','Vzdelanie','Education']);if(!raw||/bez poziadavky|nevyzaduje|none/i.test(norm(raw)))return null;var have=resumeEducation();if(!norm(have))return {score:0,raw:raw,status:'missing'};var reqLevel=educationLevel(raw),haveLevel=educationLevel(have);if(reqLevel!==null&&haveLevel!==null)return {score:haveLevel>=reqLevel?100:25,raw:raw,status:haveLevel>=reqLevel?'ok':'missing'};var ov=overlap(raw,have);if(ov!==null&&ov>=40)return {score:100,raw:raw,status:'ok'};return {score:50,raw:raw,status:'unknown'};}

function vacancyLicences(job){var raw=valueAfter(job,['Vodičské oprávnenie','Vodičský preukaz','Driving licence','Driving license']);if(!raw||/bez poziadavky|nevyzaduje|nie|none/i.test(norm(raw)))return [];var found=String(raw).toUpperCase().match(/\b(?:AM|A1|A2|A|B1|B|BE|C1E|C1|CE|C|D1E|D1|DE|D|T)\b/g)||[];return uniq(found);}
function licenceFit(req){if(!req.length)return null;var have=' '+String(resumeText()).toUpperCase().replace(/[^A-Z0-9+]+/g,' ')+' ';var matched=req.filter(function(x){return have.indexOf(' '+x+' ')>=0||have.indexOf(' '+x+',')>=0;});return {score:Math.round(matched.length/req.length*100),matched:matched,missing:req.filter(function(x){return matched.indexOf(x)<0;})};}

function roleFit(job){var desired=text('position').trim();if(!desired)return null;var title=vacancyTitle(job),s=overlap(title,desired);return {score:s==null?0:s,title:title,desired:desired,status:(s||0)>=40?'ok':'missing'};}
function locationBonus(job){var city=norm(text('city'));if(!city)return 0;return norm(job).indexOf(city)>=0?4:0;}

function build(job){var parts=[];function add(key,label,fit,w,req,resumeNote){if(fit===null)return;var score=typeof fit==='number'?fit:fit.score;parts.push({key:key,label:label,score:score,w:w,fit:fit,req:req||'',resumeNote:resumeNote||''});}
 var u=tr(),role=roleFit(job),skills=directSkills(job),sf=skillScore(skills,text('skills')+' '+resumeText()),langs=vacancyLanguages(job),lf=languageFit(langs),ef=experienceFit(job),edu=educationFit(job),lics=vacancyLicences(job),licf=licenceFit(lics);
 add('role',u.position,role,30,role&&role.title,role&&role.desired);
 add('skills',u.skills,sf,30,skills.join(', '),sf&&sf.matched.join(', '));
 add('languages',u.languages,lf,15,langs.join(', '),lf&&lf.matched.join(', '));
 add('experience',u.experience,ef,10,ef&&ef.raw,ef&&ef.have!=null?Math.round(ef.have/12*10)/10+' y':'');
 add('education',u.education,edu,10,edu&&edu.raw,resumeEducation());
 add('licence',u.licence,licf,5,lics.join(', '),licf&&licf.matched.join(', '));
 var w=parts.reduce(function(a,p){return a+p.w;},0),score=w?Math.round(parts.reduce(function(a,p){return a+p.score*p.w;},0)/w):10;score=Math.max(0,Math.min(99,score+locationBonus(job)));return {score:score,parts:parts,title:vacancyTitle(job),skills:skills,location:locationText(job)};}

function statusText(p){var u=tr(),f=p.fit;if(p.key==='role')return f.status==='ok'?u.roleOk:u.roleMiss;if(p.key==='skills')return f.matched.length?(u.skillsOk+': '+f.matched.join(', ')):(u.skillsMiss);if(p.key==='languages')return f.missing.length?(u.langMiss+': '+f.missing.join(', ')):(u.langOk+': '+f.matched.join(', '));if(p.key==='experience')return f.status==='ok'?u.expOk:f.status==='unknown'?u.expUnknown:u.expMiss;if(p.key==='education')return f.status==='ok'?u.eduOk:f.status==='unknown'?u.unknown:u.eduMiss;if(p.key==='licence')return f.missing.length?(u.licenceMiss+': '+f.missing.join(', ')):(u.licenceOk+': '+f.matched.join(', '));return '';}
function matchedMissing(details){var good=[],bad=[];details.parts.forEach(function(p){if(p.score>=70)good.push(p.label+': '+statusText(p));else bad.push(p.label+': '+statusText(p));});return {good:good,bad:bad};}
function list(items){return items.length?'<ul>'+items.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>':'<p>—</p>';}

function render(details){var result=document.getElementById('analysisResult');if(!result)return;result.style.display='block';var u=tr(),scoreEl=document.getElementById('score'),bar=document.getElementById('progressBar');if(scoreEl)scoreEl.textContent=details.score+'%';if(bar)bar.style.width=details.score+'%';
 var mm=matchedMissing(details),found=document.getElementById('found'),missing=document.getElementById('missing'),rec=document.getElementById('recommendation'),foundTitle=document.getElementById('foundSkillsTitle'),missingTitle=document.getElementById('missingSkillsTitle');if(foundTitle)foundTitle.textContent=lang()==='sk'?'Potvrdené požiadavky':lang()==='en'?'Confirmed requirements':'Підтверджені вимоги';if(missingTitle)missingTitle.textContent=lang()==='sk'?'Chýbajúce alebo nepotvrdené požiadavky':lang()==='en'?'Missing or unconfirmed requirements':'Відсутні або непідтверджені вимоги';if(found)found.innerHTML=list(mm.good);if(missing)missing.innerHTML=list(mm.bad);if(rec)rec.textContent=details.score>=70?u.good:details.score>=40?u.partial:u.low;
 var detected=document.getElementById('detectedJobs');if(detected){detected.style.display='block';detected.innerHTML='<strong>🔎 '+esc(u.position)+':</strong><p>'+esc(details.title||'—')+'</p>'+(details.location?'<p>📍 '+esc(details.location)+'</p>':'');}
 var old=document.getElementById('jobaiAnalysisEnhancement');if(old)old.remove();var box=document.createElement('div');box.id='jobaiAnalysisEnhancement';box.style.cssText='margin-top:18px;padding:16px;border-radius:14px;border:1px solid rgba(127,127,127,.25);background:rgba(127,127,127,.06)';
 var rows=details.parts.map(function(p){return '<div style="display:grid;grid-template-columns:minmax(110px,1fr) 60px;gap:7px 10px;align-items:start;padding:10px 0;border-bottom:1px solid rgba(127,127,127,.18)"><strong>'+esc(p.label)+'</strong><span style="font-weight:800;text-align:right">'+p.score+'%</span><span style="grid-column:1/-1;opacity:.9">'+esc(statusText(p))+'</span></div>';}).join('');
 box.innerHTML='<div style="font-weight:900;font-size:18px;margin-bottom:5px">'+esc(u.title)+'</div><div style="opacity:.8;margin-bottom:12px">'+esc(u.disclaimer)+'</div>'+rows+'<div style="margin-top:14px;font-size:24px;font-weight:900">'+esc(u.estimated)+': '+details.score+'%</div>';
 result.appendChild(box);setTimeout(function(){result.scrollIntoView({behavior:'smooth',block:'start'});},50);}

function loadRecommendations(){if(typeof window.renderJobRecommendations==='function'){setTimeout(window.renderJobRecommendations,40);return;}if(window.__jobaiRecommendationsLoading)return;window.__jobaiRecommendationsLoading=true;var old=document.getElementById('jobaiRecommendationsScript');if(old)old.remove();var s=document.createElement('script');s.id='jobaiRecommendationsScript';s.src='job-recommendations-v7.js?v=1';s.defer=true;s.onload=function(){window.__jobaiRecommendationsLoading=false;if(typeof window.renderJobRecommendations==='function')window.renderJobRecommendations();};s.onerror=function(){window.__jobaiRecommendationsLoading=false;};document.head.appendChild(s);}
function analyze(){var job=text('jobText')||text('job'),result=document.getElementById('analysisResult');if(!result)return;if(!String(job||'').trim()){result.style.display='block';var r=document.getElementById('recommendation');if(r)r.textContent=tr().empty;return;}var details=build(job);render(details);setTimeout(loadRecommendations,80);}
window.analyzeJob=analyze;

})();

/* Lazy vacancies launcher: heavy catalogue loads only after Jobs is opened. */
(function(){
'use strict';
function currentLang(){var l=(localStorage.getItem('jobaiLanguage')||document.documentElement.lang||'uk').toLowerCase();return l.indexOf('sk')===0?'sk':l.indexOf('en')===0?'en':'uk';}
function label(){var l=currentLang();return l==='sk'?'Pracovné ponuky':l==='en'?'Jobs':'Вакансії';}
function translate(){var b=document.getElementById('navJobs');if(b)b.textContent=label();}
function openJobs(){if(document.getElementById('jobs')){if(typeof window.showTab==='function')window.showTab('jobs');return;}if(window.__jobaiJobsLoading)return;window.__jobaiJobsLoading=true;var s=document.createElement('script');s.id='jobaiJobsPageScript';s.src='jobs-page.js?v=8';s.defer=true;s.onload=function(){window.__jobaiJobsLoading=false;translate();setTimeout(function(){if(typeof window.showTab==='function')window.showTab('jobs');},0);};s.onerror=function(){window.__jobaiJobsLoading=false;};document.head.appendChild(s);}
function init(){var nav=document.querySelector('.nav');if(!nav)return;var b=document.getElementById('navJobs');if(!b){b=document.createElement('button');b.id='navJobs';b.type='button';b.addEventListener('click',openJobs);var a=document.getElementById('navAnalysis');if(a)nav.insertBefore(b,a);else nav.appendChild(b);}translate();}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button');if(!b)return;var x=(b.textContent||'').trim().toUpperCase();if(x==='UA'||x==='SK'||x==='EN')setTimeout(translate,100);});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
