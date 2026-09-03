/* JobAI Slovakia — Home CTA translations + vacancy analysis enhancement + resume translator + language versions */
(function(){
  'use strict';

  var dict = {
    uk: {create:'Створити резюме', analyze:'Аналізувати вакансію', skills:'Ключові навички', matched:'Відповідає резюме', missing:'Чого не вистачає', tips:'Що покращити в резюме', message:'Готове повідомлення роботодавцю', copy:'Копіювати', translate:'Перекласти резюме', translatorTitle:'Переклад резюме', from:'З мови', to:'На мову', startTranslate:'Перекласти', translating:'Перекладаю…', translated:'Резюме перекладено', translateError:'Не вдалося перекласти. Перевірте підключення до інтернету і спробуйте ще раз.', same:'Оберіть іншу мову.', versions:'Версії резюме', saveVersion:'Зберегти версію', loadVersion:'Завантажити', saved:'Версію збережено!', noVersions:'Ще немає збережених версій.'},
    sk: {create:'Vytvoriť životopis', analyze:'Analyzovať pracovnú ponuku', skills:'Kľúčové zručnosti', matched:'Zodpovedá životopisu', missing:'Čo chýba', tips:'Čo zlepšiť v životopise', message:'Pripravená správa pre zamestnávateľa', copy:'Kopírovať', translate:'Preložiť životopis', translatorTitle:'Preklad životopisu', from:'Z jazyka', to:'Do jazyka', startTranslate:'Preložiť', translating:'Prekladám…', translated:'Životopis bol preložený', translateError:'Preklad sa nepodaril. Skontrolujte internetové pripojenie a skúste znova.', same:'Vyberte iný jazyk.', versions:'Verzie životopisu', saveVersion:'Uložiť verziu', loadVersion:'Načítať', saved:'Verzia bola uložená!', noVersions:'Zatiaľ nie sú uložené žiadne verzie.'},
    en: {create:'Create resume', analyze:'Analyze vacancy', skills:'Key skills', matched:'Matches resume', missing:'What is missing', tips:'What to improve in your resume', message:'Ready message for employer', copy:'Copy', translate:'Translate resume', translatorTitle:'Resume translation', from:'From', to:'To', startTranslate:'Translate', translating:'Translating…', translated:'Resume translated', translateError:'Translation failed. Check your internet connection and try again.', same:'Choose another language.', versions:'Resume versions', saveVersion:'Save version', loadVersion:'Load', saved:'Version saved!', noVersions:'No saved versions yet.'}
  };

  function getLang(){
    var l=(localStorage.getItem('jobaiLanguage')||document.documentElement.lang||'uk').toLowerCase();
    if(l.indexOf('sk')===0) return 'sk';
    if(l.indexOf('en')===0) return 'en';
    return 'uk';
  }

  function apply(){
    var t=dict[getLang()];
    document.querySelectorAll('.hero-buttons button, .hero-buttons a, button, a').forEach(function(el){
      var text=(el.textContent||'').trim();
      if(text==='Створити резюме'||text==='Vytvoriť životopis'||text==='Create resume') el.textContent=t.create;
      if(text==='Аналізувати вакансію'||text==='Аналізувати'||text==='Analyzovať pracovnú ponuku'||text==='Analyzovať'||text==='Analyze vacancy'||text==='Analyze') el.textContent=t.analyze;
    });
    translateEnhancement();
    translateTranslatorUI();
    updateVersionsUI();
  }

  function translateEnhancement(){
    var t=dict[getLang()];
    var ids={skills:'jobaiEnhSkills',matched:'jobaiEnhMatched',missing:'jobaiEnhMissing',tips:'jobaiEnhTips',message:'jobaiEnhMessage',copy:'jobaiEnhCopy'};
    Object.keys(ids).forEach(function(k){var e=document.getElementById(ids[k]);if(e)e.textContent=t[k];});
  }

  function getText(id){var e=document.getElementById(id);return e&&e.value?e.value:'';}
  function escapeHTML(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#039;');}

  function enhanceAnalysis(){
    var result=document.getElementById('analysisResult'); if(!result)return;
    var job=getText('jobText')||getText('job');
    var missing=document.getElementById('missing'), matched=document.getElementById('found'), source=[], found=[];
    if(missing) missing.querySelectorAll('li').forEach(function(li){source.push(li.textContent.trim());});
    if(matched) matched.querySelectorAll('li').forEach(function(li){found.push(li.textContent.trim());});
    var old=document.getElementById('jobaiAnalysisEnhancement'); if(old)old.remove();
    var box=document.createElement('div'); box.id='jobaiAnalysisEnhancement'; box.style.cssText='margin-top:18px;padding:16px;border-radius:14px;border:1px solid rgba(127,127,127,.25);background:rgba(127,127,127,.06)';
    var t=dict[getLang()], tips=[];
    if(source.length) source.slice(0,6).forEach(function(x){tips.push(x);}); else tips.push(getLang()==='sk'?'Pridajte konkrétne zručnosti a skúsenosti uvedené v ponuke.':getLang()==='en'?'Add concrete skills and experience mentioned in the vacancy.':'Додайте конкретні навички та досвід, зазначені у вакансії.');
    var message=getLang()==='sk'?'Dobrý deň, mám záujem o túto pracovnú ponuku. Moje skúsenosti a zručnosti zodpovedajú požiadavkám pozície. Rád/rada poskytnem ďalšie informácie.':getLang()==='en'?'Hello, I am interested in this position. My experience and skills match the requirements of the role. I would be happy to provide any additional information.':'Добрий день! Я зацікавлений(а) у цій вакансії. Мій досвід і навички відповідають вимогам позиції. Буду радий(а) надати додаткову інформацію.';
    box.innerHTML='<div style="font-weight:800;margin-bottom:10px">'+t.skills+'</div><div id="jobaiEnhSkills" style="margin-bottom:14px">'+(job?escapeHTML(job.slice(0,180)):'—')+'</div><div style="font-weight:800;margin-bottom:6px" id="jobaiEnhMatched">'+t.matched+'</div><div style="margin-bottom:14px">'+(found.length?found.slice(0,8).map(escapeHTML).join(', '):'—')+'</div><div style="font-weight:800;margin-bottom:6px" id="jobaiEnhMissing">'+t.missing+'</div><div style="margin-bottom:14px">'+(source.length?source.slice(0,8).map(escapeHTML).join(', '):'—')+'</div><div style="font-weight:800;margin-bottom:6px" id="jobaiEnhTips">'+t.tips+'</div><ul style="margin-top:4px">'+tips.map(function(x){return '<li>'+escapeHTML(x)+'</li>';}).join('')+'</ul><div style="font-weight:800;margin:12px 0 6px" id="jobaiEnhMessage">'+t.message+'</div><textarea id="jobaiEmployerMessage" readonly style="width:100%;min-height:100px;box-sizing:border-box;border-radius:10px;padding:10px">'+escapeHTML(message)+'</textarea><button type="button" id="jobaiEnhCopy" style="margin-top:8px;padding:9px 14px;border-radius:9px;border:0;cursor:pointer">'+t.copy+'</button>';
    result.appendChild(box);
    document.getElementById('jobaiEnhCopy').onclick=function(){var ta=document.getElementById('jobaiEmployerMessage');if(navigator.clipboard)navigator.clipboard.writeText(ta.value).then(function(){var b=document.getElementById('jobaiEnhCopy');b.textContent=getLang()==='sk'?'Skopírované!':getLang()==='en'?'Copied!':'Скопійовано!';setTimeout(function(){b.textContent=dict[getLang()].copy;},1200);});else{ta.select();document.execCommand('copy');}};
  }

  /* Resume translator */
  var LANGS={uk:'Ukrainian',sk:'Slovak',en:'English',de:'German',cs:'Czech',pl:'Polish',hu:'Hungarian'};
  var FIELD_SKIP={name:1,phone:1,email:1,city:1,jobText:1,job:1,jobaiEmployerMessage:1};
  function editableResumeFields(){
    var fields=[];
    document.querySelectorAll('input,textarea').forEach(function(el){
      if(!el||el.disabled||el.readOnly||!el.value.trim())return;
      var id=(el.id||'').toLowerCase(), name=(el.name||'').toLowerCase();
      if(FIELD_SKIP[id]||FIELD_SKIP[name])return;
      if(id.indexOf('job')===0||name.indexOf('job')===0)return;
      if(el.closest('#jobaiAnalysisEnhancement')||el.closest('#jobaiResumeTranslator')||el.closest('#jobaiResumeVersions'))return;
      fields.push(el);
    });
    return fields;
  }
  function translateTranslatorUI(){
    var t=dict[getLang()], title=document.getElementById('jobaiTranslatorTitle'), from=document.getElementById('jobaiTranslatorFromLabel'), to=document.getElementById('jobaiTranslatorToLabel'), btn=document.getElementById('jobaiTranslateBtn');
    if(title)title.textContent=t.translatorTitle; if(from)from.textContent=t.from; if(to)to.textContent=t.to; if(btn&&!btn.dataset.busy)btn.textContent=t.startTranslate;
  }
  function makeTranslator(){
    if(document.getElementById('jobaiResumeTranslator'))return;
    var anchor=document.querySelector('#resumePreview')||document.querySelector('.preview-wrapper')||document.querySelector('.card');
    if(!anchor||!anchor.parentNode)return;
    var box=document.createElement('div'); box.id='jobaiResumeTranslator'; box.className='card'; box.style.cssText='margin:18px 0;padding:16px;border-radius:14px;border:1px solid rgba(127,127,127,.25)';
    box.innerHTML='<h2 id="jobaiTranslatorTitle">'+dict[getLang()].translatorTitle+'</h2><p style="margin:6px 0 12px">'+dict[getLang()].translate+'</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><label><span id="jobaiTranslatorFromLabel">'+dict[getLang()].from+'</span><select id="jobaiTranslatorFrom" style="width:100%;padding:10px;border-radius:8px"><option value="uk">Українська</option><option value="sk">Slovenčina</option><option value="en">English</option><option value="de">Deutsch</option><option value="cs">Čeština</option><option value="pl">Polski</option><option value="hu">Magyar</option></select></label><label><span id="jobaiTranslatorToLabel">'+dict[getLang()].to+'</span><select id="jobaiTranslatorTo" style="width:100%;padding:10px;border-radius:8px"><option value="sk">Slovenčina</option><option value="en">English</option><option value="uk">Українська</option><option value="de">Deutsch</option><option value="cs">Čeština</option><option value="pl">Polski</option><option value="hu">Magyar</option></select></label></div><button type="button" id="jobaiTranslateBtn" style="margin-top:12px;padding:10px 16px;border-radius:9px;border:0;cursor:pointer;font-weight:700">'+dict[getLang()].startTranslate+'</button><div id="jobaiTranslateStatus" style="margin-top:10px"></div>';
    anchor.parentNode.insertBefore(box,anchor);
    var current=getLang(); document.getElementById('jobaiTranslatorFrom').value=current; document.getElementById('jobaiTranslatorTo').value=current==='sk'?'en':current==='en'?'sk':'sk';
    document.getElementById('jobaiTranslateBtn').onclick=translateResume;
  }
  function fire(el){try{el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}}
  function translateResume(){
    var status=document.getElementById('jobaiTranslateStatus'), lang=getLang();
    var message=lang==='sk'
      ? 'Automatický preklad je dočasne vypnutý, aby údaje zo životopisu neopustili vaše zariadenie.'
      : lang==='en'
        ? 'Automatic translation is temporarily disabled so your resume data stays on your device.'
        : 'Автоматичний переклад тимчасово вимкнено, щоб дані резюме залишалися на вашому пристрої.';
    if(status)status.textContent='🔒 '+message;
  }

  /* Separate saved resume versions for each language. */
  var VERSION_KEY='jobaiResumeVersions';
  function snapshotResume(){
    var ids=['name','position','phone','email','city','profile','skills','languages'], data={};
    ids.forEach(function(id){data[id]=getText(id);});
    data.experiences=Array.isArray(window.experiences)?JSON.parse(JSON.stringify(window.experiences)):[];
    data.educations=Array.isArray(window.educations)?JSON.parse(JSON.stringify(window.educations)):[];
    data.photo=localStorage.getItem('jobaiPhoto')||'';
    ['jobaiResumeTemplate','jobaiResumeColor','jobaiResumeFont','jobaiResumeFontSize','jobaiResumeNameSize','jobaiResumeFontWeight','jobaiResumeLineHeight'].forEach(function(k){data[k]=localStorage.getItem(k)||'';});
    data.updatedAt=new Date().toISOString();
    return data;
  }
  function getVersions(){try{return JSON.parse(localStorage.getItem(VERSION_KEY)||'{}')||{};}catch(e){return {};}}
  function saveResumeVersion(){
    var versions=getVersions(), lang=getLang();
    versions[lang]=snapshotResume();
    versions[lang].language=lang;
    localStorage.setItem(VERSION_KEY,JSON.stringify(versions));
    updateVersionsUI();
    alert(dict[lang].saved);
  }
  function loadResumeVersion(lang){
    var data=getVersions()[lang];if(!data)return;
    ['name','position','phone','email','city','profile','skills','languages'].forEach(function(id){var e=document.getElementById(id);if(e)e.value=data[id]||'';});
    window.experiences=Array.isArray(data.experiences)?JSON.parse(JSON.stringify(data.experiences)):[];
    window.educations=Array.isArray(data.educations)?JSON.parse(JSON.stringify(data.educations)):[];
    if(data.photo)localStorage.setItem('jobaiPhoto',data.photo);else localStorage.removeItem('jobaiPhoto');
    ['jobaiResumeTemplate','jobaiResumeColor','jobaiResumeFont','jobaiResumeFontSize','jobaiResumeNameSize','jobaiResumeFontWeight','jobaiResumeLineHeight'].forEach(function(k){if(data[k])localStorage.setItem(k,data[k]);});
    if(typeof window.renderExperiences==='function')window.renderExperiences();
    if(typeof window.renderEducations==='function')window.renderEducations();
    if(typeof window.displayResumePhoto==='function')window.displayResumePhoto(data.photo||'');
    if(typeof window.updateResumePreview==='function')window.updateResumePreview();
    setTimeout(function(){if(typeof window.applyFontSettings==='function')window.applyFontSettings();},50);
    var status=document.getElementById('jobaiVersionsStatus');if(status)status.textContent='✓ '+(dict[getLang()].loadVersion||'Loaded');
  }
  function updateVersionsUI(){
    var host=document.getElementById('jobaiResumeVersions');if(!host)return;
    var t=dict[getLang()], versions=getVersions(), langs=[['uk','🇺🇦 Українська'],['sk','🇸🇰 Slovenčina'],['en','🇬🇧 English']];
    host.innerHTML='<h2 style="margin:0 0 10px">'+t.versions+'</h2><div style="display:flex;flex-wrap:wrap;gap:8px">'+langs.map(function(x){var exists=!!versions[x[0]];return '<button type="button" data-jobai-version="'+x[0]+'" '+(exists?'':'disabled')+' style="padding:9px 12px;border-radius:9px;border:1px solid #475569;cursor:'+(exists?'pointer':'not-allowed')+';opacity:'+(exists?'1':'.45')+'">'+x[1]+(exists?' ✓':'')+'</button>';}).join('')+'</div><button type="button" id="jobaiSaveVersion" style="margin-top:12px;padding:10px 15px;border-radius:9px;border:0;cursor:pointer;font-weight:700">'+t.saveVersion+'</button><div id="jobaiVersionsStatus" style="margin-top:9px;font-size:13px"></div>';
    host.querySelectorAll('[data-jobai-version]').forEach(function(b){b.onclick=function(){loadResumeVersion(b.getAttribute('data-jobai-version'));};});
    host.querySelector('#jobaiSaveVersion').onclick=saveResumeVersion;
  }
  function makeVersionsUI(){
    if(document.getElementById('jobaiResumeVersions'))return;
    var anchor=document.getElementById('jobaiResumeTranslator')||document.querySelector('#resumePreview')||document.querySelector('.preview-wrapper');
    if(!anchor||!anchor.parentNode)return;
    var box=document.createElement('div');box.id='jobaiResumeVersions';box.className='card';box.style.cssText='margin:18px 0;padding:16px;border-radius:14px;border:1px solid rgba(127,127,127,.25)';
    anchor.parentNode.insertBefore(box,anchor);updateVersionsUI();
  }

  var originalAnalyze=null;
  function hook(){
    if(typeof window.analyzeJob==='function'&&window.analyzeJob!==originalAnalyze){originalAnalyze=window.analyzeJob;window.analyzeJob=function(){var r=originalAnalyze.apply(this,arguments);setTimeout(enhanceAnalysis,180);return r;};}
    makeTranslator();makeVersionsUI();apply();
  }
  hook();setInterval(hook,700);
  document.addEventListener('click',function(e){var el=e.target.closest&&e.target.closest('.language-switcher button,[data-lang]');if(el)setTimeout(function(){apply();makeVersionsUI();},150);});
  window.addEventListener('storage',function(){apply();makeVersionsUI();});
})();
\n\n/* JobAI My Resumes v1 */\n(function(){\n  'use strict';\n  var KEY='jobaiMyResumes';\n  var ACTIVE='jobaiActiveResume';\n  var LANGS={uk:'🇺🇦 Українська',sk:'🇸🇰 Slovenčina',en:'🇬🇧 English',de:'🇩🇪 Deutsch',cs:'🇨🇿 Čeština',pl:'🇵🇱 Polski',hu:'🇭🇺 Magyar'};\n  var FIELD_IDS=['name','position','phone','email','city','profile','skills','languages'];\n  function lang(){var l=(localStorage.getItem('jobaiLanguage')||document.documentElement.lang||'uk').toLowerCase();for(var k in LANGS)if(l.indexOf(k)===0)return k;return 'uk';}\n  function read(){var d={};FIELD_IDS.forEach(function(id){var e=document.getElementById(id);d[id]=e?e.value:'';});d.experiences=Array.isArray(window.experiences)?JSON.parse(JSON.stringify(window.experiences)):[];d.educations=Array.isArray(window.educations)?JSON.parse(JSON.stringify(window.educations)):[];d.photo=localStorage.getItem('jobaiPhoto')||'';['jobaiResumeTemplate','jobaiResumeColor','jobaiResumeFont','jobaiResumeFontSize','jobaiResumeNameSize','jobaiResumeFontWeight','jobaiResumeLineHeight'].forEach(function(k){d[k]=localStorage.getItem(k)||'';});return d;}\n  function all(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')||[];}catch(e){return [];}}\n  function put(a){localStorage.setItem(KEY,JSON.stringify(a));}\n  function esc(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\\\"/g,'&quot;').replace(/'/g,'&#039;');}\n  function fire(e){try{e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));}catch(x){}}\n  function restore(d){if(!d)return;FIELD_IDS.forEach(function(id){var e=document.getElementById(id);if(e)e.value=d[id]||'';});window.experiences=Array.isArray(d.experiences)?JSON.parse(JSON.stringify(d.experiences)):[];window.educations=Array.isArray(d.educations)?JSON.parse(JSON.stringify(d.educations)):[];if(d.photo)localStorage.setItem('jobaiPhoto',d.photo);else localStorage.removeItem('jobaiPhoto');['jobaiResumeTemplate','jobaiResumeColor','jobaiResumeFont','jobaiResumeFontSize','jobaiResumeNameSize','jobaiResumeFontWeight','jobaiResumeLineHeight'].forEach(function(k){if(d[k])localStorage.setItem(k,d[k]);});try{if(typeof renderExperiences==='function')renderExperiences();if(typeof renderEducations==='function')renderEducations();if(typeof displayResumePhoto==='function')displayResumePhoto();if(typeof updateResumePreview==='function')updateResumePreview();if(typeof applyFontSettings==='function')applyFontSettings();}catch(e){}FIELD_IDS.forEach(function(id){var e=document.getElementById(id);if(e)fire(e);});}\n  function save(id,name){var a=all(),i=a.findIndex(function(x){return x.id===id}),now=new Date().toISOString(),item={id:id||('cv_'+Date.now()),name:name||'Моє резюме',language:lang(),updatedAt:now,data:read()};if(i<0)a.unshift(item);else{item.name=a[i].name;item.language=a[i].language||lang();a[i]=Object.assign({},a[i],item);}put(a);localStorage.setItem(ACTIVE,item.id);render();return item;}\n  function formatDate(s){try{return new Date(s).toLocaleString();}catch(e){return '';}}\n  function render(){var box=document.getElementById('jobaiMyResumes');if(!box)return;var a=all(),t=lang(),title=t==='sk'?'Moje životopisy':t==='en'?'My resumes':'Мої резюме';var html='<div style="font-weight:800;font-size:20px;margin-bottom:12px">📁 '+title+'</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px"><button type="button" id="jobaiNewResume" style="padding:9px 13px;border:0;border-radius:9px;cursor:pointer;font-weight:700">＋ '+(t==='sk'?'Nové':t==='en'?'New':'Нове')+'</button><button type="button" id="jobaiSaveCurrent" style="padding:9px 13px;border:0;border-radius:9px;cursor:pointer;font-weight:700">💾 '+(t==='sk'?'Uložiť aktuálne':t==='en'?'Save current':'Зберегти поточне')+'</button></div>';if(!a.length)html+='<div style="opacity:.7">'+(t==='sk'?'Zatiaľ nemáte uložené žiadne životopisy.':t==='en'?'You have no saved resumes yet.':'У вас ще немає збережених резюме.')+'</div>';a.forEach(function(x){var active=localStorage.getItem(ACTIVE)===x.id;html+='<div data-resume-id="'+esc(x.id)+'" style="padding:13px;margin:9px 0;border:1px solid rgba(127,127,127,.25);border-radius:12px;background:'+(active?'rgba(127,127,127,.10)':'transparent')+'"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div><div style="font-weight:800">'+(active?'● ':'')+esc(x.name)+'</div><div style="font-size:12px;opacity:.7">'+(LANGS[x.language]||x.language||'')+' · '+formatDate(x.updatedAt)+'</div></div><div style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" data-load="'+esc(x.id)+'">'+(t==='sk'?'Načítať':t==='en'?'Load':'Завантажити')+'</button><button type="button" data-dup="'+esc(x.id)+'">'+(t==='sk'?'Duplikovať':t==='en'?'Duplicate':'Дублювати')+'</button><button type="button" data-rename="'+esc(x.id)+'">'+(t==='sk'?'Premenovať':t==='en'?'Rename':'Перейменувати')+'</button><button type="button" data-pdf="'+esc(x.id)+'">PDF</button><button type="button" data-del="'+esc(x.id)+'">'+(t==='sk'?'Zmazať':t==='en'?'Delete':'Видалити')+'</button></div></div></div>';});box.innerHTML=html;bind();}\n  function bind(){var box=document.getElementById('jobaiMyResumes');if(!box)return;box.querySelector('#jobaiNewResume').onclick=function(){var n=prompt(lang()==='sk'?'Názov nového životopisu:':lang()==='en'?'New resume name:':'Назва нового резюме:','Моє резюме');if(!n)return;var item=save(null,n);restore({});localStorage.setItem(ACTIVE,item.id);render();};box.querySelector('#jobaiSaveCurrent').onclick=function(){var id=localStorage.getItem(ACTIVE),a=all(),old=a.find(function(x){return x.id===id;});if(old)save(id,old.name);else{var n=prompt(lang()==='sk'?'Názov životopisu:':lang()==='en'?'Resume name:':'Назва резюме:','Моє резюме');if(n)save(null,n);}render();};box.querySelectorAll('[data-load]').forEach(function(b){b.onclick=function(){var x=all().find(function(z){return z.id===b.dataset.load;});if(x){restore(x.data);localStorage.setItem(ACTIVE,x.id);render();}}});box.querySelectorAll('[data-dup]').forEach(function(b){b.onclick=function(){var x=all().find(function(z){return z.id===b.dataset.dup;});if(!x)return;var n=prompt(lang()==='sk'?'Názov kópie:':lang()==='en'?'Copy name:':'Назва копії:',x.name+' — копія');if(!n)return;var a=all();var y=JSON.parse(JSON.stringify(x));y.id='cv_'+Date.now();y.name=n;y.updatedAt=new Date().toISOString();a.unshift(y);put(a);localStorage.setItem(ACTIVE,y.id);render();}});box.querySelectorAll('[data-rename]').forEach(function(b){b.onclick=function(){var a=all(),x=a.find(function(z){return z.id===b.dataset.rename;});if(!x)return;var n=prompt(lang()==='sk'?'Nový názov:':lang()==='en'?'New name:':'Нова назва:',x.name);if(n){x.name=n;x.updatedAt=new Date().toISOString();put(a);render();}}});box.querySelectorAll('[data-del]').forEach(function(b){b.onclick=function(){var a=all(),x=a.find(function(z){return z.id===b.dataset.del;});if(!x)return;if(!confirm(lang()==='sk'?'Zmazať tento životopis?':lang()==='en'?'Delete this resume?':'Видалити це резюме?'))return;put(a.filter(function(z){return z.id!==x.id;}));if(localStorage.getItem(ACTIVE)===x.id)localStorage.removeItem(ACTIVE);render();}});box.querySelectorAll('[data-pdf]').forEach(function(b){b.onclick=function(){var x=all().find(function(z){return z.id===b.dataset.pdf;});if(x){restore(x.data);localStorage.setItem(ACTIVE,x.id);setTimeout(function(){window.print();},150);}}});}\n  function mount(){if(document.getElementById('jobaiMyResumes')){render();return;}var anchor=document.getElementById('jobaiResumeTranslator')||document.querySelector('#resumePreview')||document.querySelector('.preview-wrapper')||document.querySelector('.card');if(!anchor||!anchor.parentNode)return;var box=document.createElement('div');box.id='jobaiMyResumes';box.className='card';box.style.cssText='margin:18px 0;padding:16px;border-radius:14px;border:1px solid rgba(127,127,127,.25)';anchor.parentNode.insertBefore(box,anchor);render();}\n  var timer;function autosave(){clearTimeout(timer);timer=setTimeout(function(){var id=localStorage.getItem(ACTIVE);if(id){var a=all(),x=a.find(function(z){return z.id===id;});if(x){x.data=read();x.updatedAt=new Date().toISOString();put(a);render();}}},1200);}\n  document.addEventListener('input',function(e){if(e.target&&e.target.closest&&e.target.closest('#jobaiMyResumes'))return;autosave();});\n  function init(){setTimeout(mount,900);setTimeout(mount,2200);}\n  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();\n})();\n