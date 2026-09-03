(function(){
  'use strict';
  function esc(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}
  function save(){try{if(typeof window.saveResumeData==='function')window.saveResumeData(false);else if(typeof window.saveAll==='function')window.saveAll();}catch(e){console.warn(e);}}
  function update(){try{if(typeof window.updateResumePreview==='function')window.updateResumePreview();}catch(e){}}
  function setup(type){
    var isExp=type==='experience', container=document.getElementById(isExp?'experienceContainer':'educationContainer');
    var card=container&&container.closest('.card'); if(!container||!card)return;
    var addBtn=card.querySelector(isExp?'#addExperience':'#addEducation');
    if(!addBtn)return;
    addBtn.style.display='none';
    var toggle=document.createElement('button'); toggle.type='button'; toggle.className='action-button primary jobai-section-toggle';
    toggle.setAttribute('aria-expanded','false');
    toggle.innerHTML=(isExp?'➕ Досвід роботи':'➕ Освіта');
    card.insertBefore(toggle,container);
    var list=document.createElement('div'); list.className='jobai-collapsible-list'; list.style.display='none';
    container.parentNode.insertBefore(list,container); container.style.display='none';
    toggle.addEventListener('click',function(){var open=list.style.display!=='none';list.style.display=open?'none':'block';container.style.display='none';toggle.setAttribute('aria-expanded',String(!open));toggle.innerHTML=(open?'➕ ':'➖ ')+(isExp?'Досвід роботи':'Освіта');});
    function render(){
      var arr=isExp?(Array.isArray(window.experiences)?window.experiences:[]):(Array.isArray(window.educations)?window.educations:[]);
      if(!arr.length){list.innerHTML='<div class="jobai-empty-note">Поки нічого не додано. Натисніть кнопку вище, щоб додати.</div>';return;}
      list.innerHTML=arr.map(function(x,i){
        if(isExp){return '<div class="entry jobai-entry"><div class="entry-header"><h3>Досвід роботи #'+(i+1)+'</h3><button type="button" class="action-button danger" data-remove="'+i+'">Видалити</button></div><div class="form-grid"><div class="form-group"><label>Компанія</label><input data-i="'+i+'" data-f="company" value="'+esc(x.company)+'"></div><div class="form-group"><label>Посада</label><input data-i="'+i+'" data-f="position" value="'+esc(x.position)+'"></div><div class="form-group"><label>Початок</label><input data-i="'+i+'" data-f="start" value="'+esc(x.start)+'" placeholder="01/2023"></div><div class="form-group"><label>Кінець</label><input data-i="'+i+'" data-f="end" value="'+esc(x.end)+'" placeholder="12/2025"></div><div class="form-group full"><label>Опис роботи</label><textarea data-i="'+i+'" data-f="description">'+esc(x.description)+'</textarea></div></div></div>';}
        return '<div class="entry jobai-entry"><div class="entry-header"><h3>Освіта #'+(i+1)+'</h3><button type="button" class="action-button danger" data-remove="'+i+'">Видалити</button></div><div class="form-grid"><div class="form-group"><label>Навчальний заклад</label><input data-i="'+i+'" data-f="school" value="'+esc(x.school)+'"></div><div class="form-group"><label>Спеціальність</label><input data-i="'+i+'" data-f="speciality" value="'+esc(x.speciality||x.specialty)+'"></div><div class="form-group"><label>Рік</label><input data-i="'+i+'" data-f="year" value="'+esc(x.year)+'" placeholder="2024"></div></div></div>';
      }).join('');
      list.querySelectorAll('[data-f]').forEach(function(el){el.addEventListener('input',function(){var a=isExp?window.experiences:window.educations;a[Number(el.dataset.i)][el.dataset.f]=el.value;save();update();});});
      list.querySelectorAll('[data-remove]').forEach(function(btn){btn.addEventListener('click',function(){var a=isExp?window.experiences:window.educations;a.splice(Number(btn.dataset.remove),1);render();save();update();});});
    }
    var oldAdd=isExp?window.addExperience:window.addEducation;
    function add(){
      if(isExp){if(!Array.isArray(window.experiences))window.experiences=[];window.experiences.push({company:'',position:'',start:'',end:'',description:''});}
      else {if(!Array.isArray(window.educations))window.educations=[];window.educations.push({school:'',speciality:'',year:''});}
      list.style.display='block';container.style.display='none';toggle.setAttribute('aria-expanded','true');toggle.innerHTML='➖ '+(isExp?'Досвід роботи':'Освіта');render();save();update();
    }
    if(isExp)window.addExperience=add;else window.addEducation=add;
    toggle.insertAdjacentElement('afterend',addBtn);
    addBtn.style.display='inline-block'; addBtn.textContent=isExp?'Додати досвід':'Додати освіту'; addBtn.className='action-button primary jobai-add-entry';
    addBtn.addEventListener('click',function(e){e.preventDefault();add();});
    render();
  }
  function init(){
    if(document.getElementById('jobaiResumeSectionsToggleStyles'))return;
    var s=document.createElement('style');s.id='jobaiResumeSectionsToggleStyles';s.textContent='.jobai-section-toggle{width:100%;text-align:left;margin-bottom:10px}.jobai-add-entry{margin-top:10px}.jobai-collapsible-list{margin-top:10px}.jobai-empty-note{padding:14px;border:1px dashed #475569;border-radius:8px;color:#94a3b8;margin-bottom:10px}.jobai-entry{margin-top:10px}';document.head.appendChild(s);
    setup('experience');setup('education');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,300);});else setTimeout(init,300);
})();
