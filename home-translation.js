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
  function translateOne(text,from,to){
    var url='https://api.mymemory.translated.net/get?q='+encodeURIComponent(text)+'&langpair='+encodeURIComponent(from+'|'+to);
    return fetch(url).then(function(r){if(!r.ok)throw new Error('network');return r.json();}).then(function(data){if(!data||!data.responseData||!data.responseData.translatedText)throw new Error('translation');return data.responseData.translatedText;});
  }
  function fire(el){try{el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}}
  function translateResume(){
    var btn=document.getElementById('jobaiTranslateBtn'), status=document.getElementById('jobaiTranslateStatus'), from=document.getElementById('jobaiTranslatorFrom').value, to=document.getElementById('jobaiTranslatorTo').value, t=dict[getLang()];
    if(from===to){status.textContent=t.same;return;}
    var fields=editableResumeFields(); if(!fields.length){status.textContent=t.translateError;return;}
    btn.dataset.busy='1';btn.textContent=t.translating;btn.disabled=true;status.textContent='';var index=0;
    function next(){if(index>=fields.length){btn.disabled=false;delete btn.dataset.busy;btn.textContent=t.startTranslate;status.textContent='✓ '+t.translated;return;}var el=fields[index++],text=el.value.trim();translateOne(text,from,to).then(function(translated){el.value=translated;fire(el);setTimeout(next,80);}).catch(function(){btn.disabled=false;delete btn.dataset.busy;btn.textContent=t.startTranslate;status.textContent='⚠️ '+t.translateError;});}
    next();
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
