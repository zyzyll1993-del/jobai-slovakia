(function(){
  'use strict';

  function hasText(value){
    return String(value || '').replace(/\s+/g,' ').trim().length > 0;
  }

  function inputValue(id){
    var el=document.getElementById(id);
    return el ? el.value : '';
  }

  function meaningfulExperience(){
    return Array.isArray(window.experiences) && window.experiences.some(function(x){
      return x && ['company','position','start','end','description'].some(function(k){return hasText(x[k]);});
    });
  }

  function meaningfulEducation(){
    return Array.isArray(window.educations) && window.educations.some(function(x){
      return x && ['school','speciality','specialty','year'].some(function(k){return hasText(x[k]);});
    });
  }

  function hide(el){ if(el) el.style.display='none'; }
  function show(el){ if(el) el.style.display=''; }

  function clean(){
    var name=inputValue('name');
    var position=inputValue('position');
    var phone=inputValue('phone');
    var email=inputValue('email');
    var city=inputValue('city');
    var profile=inputValue('profile');
    var skills=inputValue('skills');
    var languages=inputValue('languages');
    var exp=meaningfulExperience();
    var edu=meaningfulEducation();

    var pn=document.getElementById('previewName');
    var pp=document.getElementById('previewPosition');
    var pc=document.getElementById('previewContact');
    if(pn){ if(hasText(name)) show(pn); else hide(pn); }
    if(pp){ if(hasText(position)) show(pp); else hide(pp); }
    if(pc){ if(hasText(phone)||hasText(email)||hasText(city)) show(pc); else hide(pc); }

    var preview=document.getElementById('resumePreview');
    if(!preview) return;

    var rules=[
      {names:['досвід роботи','experience','work experience'], ok:exp},
      {names:['освіта','education'], ok:edu},
      {names:['навички','skills','ключові навички'], ok:hasText(skills)},
      {names:['мови','мови та мови','languages'], ok:hasText(languages)},
      {names:['профіль','про себе','професійний профіль','profile','summary'], ok:hasText(profile)}
    ];

    preview.querySelectorAll('h2,h3,h4').forEach(function(head){
      var title=head.textContent.replace(/\s+/g,' ').trim().toLowerCase();
      var rule=rules.find(function(r){return r.names.some(function(n){return title===n || title.indexOf(n+' ')===0;});});
      if(!rule) return;

      var parent=head.parentElement;
      if(!rule.ok){
        hide(parent);
        return;
      }
      if(parent && parent.style.display==='none' && parent.dataset.jobaiEmptyHidden==='1'){
        show(parent);
        delete parent.dataset.jobaiEmptyHidden;
      }
    });

    preview.querySelectorAll('*').forEach(function(el){
      if(el.style.display==='none' || !el.textContent) return;
      var text=el.textContent.replace(/\s+/g,' ').trim();
      if(['Ваше ім\'я','Бажана посада','Телефон · Email · Місто'].indexOf(text)>=0){ hide(el); }
    });
  }

  function wrap(){
    var fn=window.updateResumePreview;
    if(typeof fn!=='function' || fn.__jobaiEmptyWrapped) return false;
    var wrapped=function(){
      var result=fn.apply(this,arguments);
      setTimeout(clean,0);
      return result;
    };
    wrapped.__jobaiEmptyWrapped=true;
    window.updateResumePreview=wrapped;
    window.jobAIUpdateResumePreview=wrapped;
    setTimeout(clean,50);
    return true;
  }

  function init(){
    if(!wrap()) setTimeout(init,100);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
