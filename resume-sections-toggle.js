(function(){
  'use strict';
  function esc(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#039;');}
  function save(){try{if(typeof window.saveResumeData==='function')window.saveResumeData(false);else if(typeof window.saveAll==='function')window.saveAll();}catch(e){console.warn(e);}}
  function update(){try{if(typeof window.jobAIUpdateResumePreview==='function')window.jobAIUpdateResumePreview();else if(typeof window.updateResumePreview==='function')window.updateResumePreview();}catch(e){}}
  function renameProfessionalButton(){document.querySelectorAll('.template-button').forEach(function(btn){if(btn.textContent.trim()==='Professional')btn.textContent='Profi';});}
  function watchProfessionalButton(){renameProfessionalButton();if(window.MutationObserver){var root=document.body||document.documentElement;if(root){new MutationObserver(function(){renameProfessionalButton();}).observe(root,{childList:true,subtree:true});}}}
  function setup(type){
    var isExp=type==='experience', container=document.getElementById(isExp?'experienceContainer':'educationContainer');
    var card=container&&container.closest('.card'); if(!container||!card)return;
    var addBtn=card.querySelector(isExp?'#addExperience':'#addEducation');
    if(addBtn)addBtn.style.display='none';
    var old=card.querySelector('.jobai-section-toggle'); if(old)old.remove();
    var toggle=document.createElement('button'); toggle.type='button'; toggle.className='action-button primary jobai-section-toggle';
    toggle.setAttribute('aria-expanded','false'); toggle.innerHTML='➕ '+(isExp?'Досвід роботи':'Освіта');
    card.insertBefore(toggle,container);
    var list=document.createElement('div'); list.className='jobai-collapsible-list'; list.style.display='none';
    container.parentNode.insertBefore(list,container); container.style.display='none';
    function getArr(){return isExp?(Array.isArray(window.experiences)?window.experiences:[]):(Array.isArray(window.educations)?window.educations:[]);}
    function render(){var arr=getArr();if(!arr.length){list.innerHTML='';return;}list.innerHTML=arr.map(function(x,i){if(isExp)return '<div class="entry jobai-entry"><div class="entry-header"><h3>Досвід роботи #'+(i+1)+'</h3><button type="button" class="action-button danger" data-remove="'+i+'">Видалити</button></div><div class="form-grid"><div class="form-group"><label>Компанія</label><input data-i="'+i+'" data-f="company" value="'+esc(x.company)+'"></div><div class="form-group"><label>Посада</label><input data-i="'+i+'" data-f="position" value="'+esc(x.position)+'"></div><div class="form-group"><label>Початок</label><input data-i="'+i+'" data-f="start" value="'+esc(x.start)+'" placeholder="01/2023"></div><div class="form-group"><label>Кінець</label><input data-i="'+i+'" data-f="end" value="'+esc(x.end)+'" placeholder="12/2025"></div><div class="form-group full"><label>Опис роботи</label><textarea data-i="'+i+'" data-f="description">'+esc(x.description)+'</textarea></div></div></div>';return '<div class="entry jobai-entry"><div class="entry-header"><h3>Освіта #'+(i+1)+'</h3><button type="button" class="action-button danger" data-remove="'+i+'">Видалити</button></div><div class="form-grid"><div class="form-group"><label>Навчальний заклад</label><input data-i="'+i+'" data-f="school" value="'+esc(x.school)+'"></div><div class="form-group"><label>Спеціальність</label><input data-i="'+i+'" data-f="speciality" value="'+esc(x.speciality||x.specialty)+'"></div><div class="form-group"><label>Рік</label><input data-i="'+i+'" data-f="year" value="'+esc(x.year)+'" placeholder="2024"></div></div></div>';}).join('');list.querySelectorAll('[data-f]').forEach(function(el){el.addEventListener('input',function(){var a=getArr();if(a[Number(el.dataset.i)])a[Number(el.dataset.i)][el.dataset.f]=el.value;save();update();});});list.querySelectorAll('[data-remove]').forEach(function(btn){btn.addEventListener('click',function(){var a=getArr();a.splice(Number(btn.dataset.remove),1);render();save();update();if(!a.length){list.style.display='none';toggle.setAttribute('aria-expanded','false');toggle.innerHTML='➕ '+(isExp?'Досвід роботи':'Освіта');}});});}
    function add(){if(isExp){if(!Array.isArray(window.experiences))window.experiences=[];window.experiences.push({company:'',position:'',start:'',end:'',description:''});}else{if(!Array.isArray(window.educations))window.educations=[];window.educations.push({school:'',speciality:'',year:''});}}
    function open(){var arr=getArr();if(!arr.length)add();list.style.display='block';container.style.display='none';toggle.setAttribute('aria-expanded','true');toggle.innerHTML='➖ '+(isExp?'Досвід роботи':'Освіта');render();save();update();}
    function close(){list.style.display='none';toggle.setAttribute('aria-expanded','false');toggle.innerHTML='➕ '+(isExp?'Досвід роботи':'Освіта');}
    toggle.addEventListener('click',function(){if(toggle.getAttribute('aria-expanded')==='true')close();else open();});
    if(isExp)window.addExperience=function(data){add();var a=window.experiences;a[a.length-1]=Object.assign(a[a.length-1],data||{});open();};else window.addEducation=function(data){add();var a=window.educations;a[a.length-1]=Object.assign(a[a.length-1],data||{});open();};
    render();
  }
  function init(){
    watchProfessionalButton();
    if(document.getElementById('jobaiResumeSectionsToggleStyles'))return;
    var s=document.createElement('style');s.id='jobaiResumeSectionsToggleStyles';s.textContent='.jobai-section-toggle{width:100%;text-align:left;margin:8px 0 10px}.jobai-collapsible-list{margin-top:10px}.jobai-entry{margin-top:10px}.jobai-entry .entry-header{display:flex;justify-content:space-between;align-items:center;gap:10px}.jobai-entry .entry-header h3{margin:0}.jobai-entry input,.jobai-entry textarea{box-sizing:border-box;width:100%}.template-grid{width:100%;grid-template-columns:repeat(5,minmax(0,1fr));}.template-button{width:100%;min-width:0;min-height:44px;padding:10px 6px;line-height:1.2;white-space:normal;overflow-wrap:anywhere;word-break:break-word;text-align:center;}@media(max-width:700px){.jobai-section-toggle{min-height:46px}.jobai-entry .entry-header{align-items:flex-start;flex-direction:column}.jobai-entry .entry-header button{width:100%}.template-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.template-button{min-height:46px;padding:9px 6px;font-size:14px;}}';document.head.appendChild(s);
    setup('experience');setup('education');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,300);});else setTimeout(init,300);
})();
