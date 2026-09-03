(function(){
  'use strict';
  function hasText(v){return String(v||'').replace(/\s+/g,' ').trim().length>0;}
  function val(id){var e=document.getElementById(id);return e?e.value:'';}
  function expOk(){return Array.isArray(window.experiences)&&window.experiences.some(function(x){return x&&['company','position','start','end','description'].some(function(k){return hasText(x[k]);});});}
  function eduOk(){return Array.isArray(window.educations)&&window.educations.some(function(x){return x&&['school','speciality','specialty','year'].some(function(k){return hasText(x[k]);});});}
  function hide(e){if(e){e.style.display='none';e.dataset.jobaiEmptyHidden='1';}}
  function show(e){if(e&&e.dataset.jobaiEmptyHidden==='1'){e.style.display='';delete e.dataset.jobaiEmptyHidden;}}
  function clean(){
    var name=val('name'),position=val('position'),phone=val('phone'),email=val('email'),city=val('city'),profile=val('profile'),skills=val('skills'),languages=val('languages');
    var pn=document.getElementById('previewName'),pp=document.getElementById('previewPosition'),pc=document.getElementById('previewContact');
    if(pn)(hasText(name)?show:hide)(pn); if(pp)(hasText(position)?show:hide)(pp); if(pc)((hasText(phone)||hasText(email)||hasText(city))?show:hide)(pc);
    var preview=document.getElementById('resumePreview'); if(!preview)return;
    var rules=[
      {n:['досвід роботи','experience','work experience'],ok:expOk()},
      {n:['освіта','education'],ok:eduOk()},
      {n:['навички','skills','ключові навички'],ok:hasText(skills)},
      {n:['мови','languages'],ok:hasText(languages)},
      {n:['профіль','про себе','професійний профіль','profile','summary'],ok:hasText(profile)}
    ];
    preview.querySelectorAll('h2,h3,h4').forEach(function(h){
      var t=h.textContent.replace(/\s+/g,' ').trim().toLowerCase();
      var r=rules.find(function(x){return x.n.some(function(n){return t===n||t.indexOf(n+' ')===0;});});
      if(!r)return;
      var p=h.parentElement;
      if(r.ok)show(p);else hide(p);
    });
    preview.querySelectorAll('*').forEach(function(e){
      if(e.dataset.jobaiEmptyHidden==='1')return;
      var t=e.textContent.replace(/\s+/g,' ').trim();
      if(t==="Ваше ім'я"||t==='Бажана посада'||t==='Телефон · Email · Місто')hide(e);
    });
  }
  function wrap(){
    var fn=window.updateResumePreview;
    if(typeof fn!=='function'||fn.__jobaiEmptyWrapped)return false;
    function wrapped(){var r=fn.apply(this,arguments);setTimeout(clean,0);return r;}
    wrapped.__jobaiEmptyWrapped=true;window.updateResumePreview=wrapped;window.jobAIUpdateResumePreview=wrapped;setTimeout(clean,50);return true;
  }
  function init(){if(!wrap())setTimeout(init,100);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
