/* JobAI Slovakia — Home CTA translations + vacancy analysis enhancement */
(function(){
  'use strict';

  var dict = {
    uk: {create:'Створити резюме', analyze:'Аналізувати вакансію', skills:'Ключові навички', matched:'Відповідає резюме', missing:'Чого не вистачає', tips:'Що покращити в резюме', message:'Готове повідомлення роботодавцю', copy:'Копіювати'},
    sk: {create:'Vytvoriť životopis', analyze:'Analyzovať pracovnú ponuku', skills:'Kľúčové zručnosti', matched:'Zodpovedá životopisu', missing:'Čo chýba', tips:'Čo zlepšiť v životopise', message:'Pripravená správa pre zamestnávateľa', copy:'Kopírovať'},
    en: {create:'Create resume', analyze:'Analyze vacancy', skills:'Key skills', matched:'Matches resume', missing:'What is missing', tips:'What to improve in your resume', message:'Ready message for employer', copy:'Copy'}
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
  }

  function translateEnhancement(){
    var t=dict[getLang()];
    var ids={skills:'jobaiEnhSkills',matched:'jobaiEnhMatched',missing:'jobaiEnhMissing',tips:'jobaiEnhTips',message:'jobaiEnhMessage',copy:'jobaiEnhCopy'};
    Object.keys(ids).forEach(function(k){var e=document.getElementById(ids[k]);if(e)e.textContent=t[k];});
  }

  function getText(id){var e=document.getElementById(id);return e&&e.value?e.value:'';}
  function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}

  function enhanceAnalysis(){
    var result=document.getElementById('analysisResult');
    if(!result)return;
    var job=getText('jobText')||getText('job');
    var resume=[getText('position'),getText('profile'),getText('skills'),getText('languages')].join(' ');
    var missing=document.getElementById('missing');
    var matched=document.getElementById('found');
    var source=[];
    if(missing) missing.querySelectorAll('li').forEach(function(li){source.push(li.textContent.trim());});
    var found=[];
    if(matched) matched.querySelectorAll('li').forEach(function(li){found.push(li.textContent.trim());});
    var old=document.getElementById('jobaiAnalysisEnhancement');
    if(old)old.remove();
    var box=document.createElement('div');box.id='jobaiAnalysisEnhancement';box.style.cssText='margin-top:18px;padding:16px;border-radius:14px;border:1px solid rgba(127,127,127,.25);background:rgba(127,127,127,.06)';
    var t=dict[getLang()];
    var tips=[];
    if(source.length) source.slice(0,6).forEach(function(x){tips.push(x);});
    else tips.push(getLang()==='sk'?'Pridajte konkrétne zručnosti a skúsenosti uvedené v ponuke.':getLang()==='en'?'Add concrete skills and experience mentioned in the vacancy.':'Додайте конкретні навички та досвід, зазначені у вакансії.');
    var jobTitle=getText('position')||'';
    var message=getLang()==='sk'?'Dobrý deň, mám záujem o túto pracovnú ponuku. Moje skúsenosti a zručnosti zodpovedajú požiadavkám pozície. Rád/rada poskytnem ďalšie informácie.':getLang()==='en'?'Hello, I am interested in this position. My experience and skills match the requirements of the role. I would be happy to provide any additional information.':'Dobrý deň, mám záujem o túto pracovnú ponuku. Moje skúsenosti a zručnosti zodpovedajú požiadavkám pozície. Rád/rada poskytnem ďalšie informácie.';
    if(getLang()==='uk') message='Добрий день! Я зацікавлений(а) у цій вакансії. Мій досвід і навички відповідають вимогам позиції. Буду радий(а) надати додаткову інформацію.';
    box.innerHTML='<div style="font-weight:800;margin-bottom:10px">'+t.skills+'</div><div id="jobaiEnhSkills" style="margin-bottom:14px">'+(job?escapeHTML(job.slice(0,180)):'—')+'</div>'+
      '<div style="font-weight:800;margin-bottom:6px" id="jobaiEnhMatched">'+t.matched+'</div><div style="margin-bottom:14px">'+(found.length?found.slice(0,8).map(escapeHTML).join(', '):'—')+'</div>'+
      '<div style="font-weight:800;margin-bottom:6px" id="jobaiEnhMissing">'+t.missing+'</div><div style="margin-bottom:14px">'+(source.length?source.slice(0,8).map(escapeHTML).join(', '):'—')+'</div>'+
      '<div style="font-weight:800;margin-bottom:6px" id="jobaiEnhTips">'+t.tips+'</div><ul style="margin-top:4px">'+tips.map(function(x){return '<li>'+escapeHTML(x)+'</li>';}).join('')+'</ul>'+
      '<div style="font-weight:800;margin:12px 0 6px" id="jobaiEnhMessage">'+t.message+'</div><textarea id="jobaiEmployerMessage" readonly style="width:100%;min-height:100px;box-sizing:border-box;border-radius:10px;padding:10px">'+escapeHTML(message)+'</textarea><button type="button" id="jobaiEnhCopy" style="margin-top:8px;padding:9px 14px;border-radius:9px;border:0;cursor:pointer">'+t.copy+'</button>';
    result.appendChild(box);
    document.getElementById('jobaiEnhCopy').onclick=function(){
      var ta=document.getElementById('jobaiEmployerMessage');
      if(navigator.clipboard) navigator.clipboard.writeText(ta.value).then(function(){var b=document.getElementById('jobaiEnhCopy');b.textContent=getLang()==='sk'?'Skopírované!':getLang()==='en'?'Copied!':'Скопійовано!';setTimeout(function(){b.textContent=dict[getLang()].copy;},1200);});
      else {ta.select();document.execCommand('copy');}
    };
  }

  function escapeHTML(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#039;');}

  var originalAnalyze=null;
  function hook(){
    if(typeof window.analyzeJob==='function'&&window.analyzeJob!==originalAnalyze){
      originalAnalyze=window.analyzeJob;
      window.analyzeJob=function(){var r=originalAnalyze.apply(this,arguments);setTimeout(enhanceAnalysis,180);return r;};
    }
    apply();
  }
  hook();
  setInterval(hook,500);
  document.addEventListener('click',function(e){var el=e.target.closest&&e.target.closest('.language-switcher button,[data-lang]');if(el)setTimeout(apply,120);});
  window.addEventListener('storage',apply);
})();
