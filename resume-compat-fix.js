(function(){
  'use strict';

  function esc(v){
    return String(v == null ? '' : v)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }
  function save(){
    try { if(typeof window.saveResumeData==='function') window.saveResumeData(false); } catch(e) { console.error(e); }
  }
  function refresh(){
    try { if(typeof window.jobAIUpdateResumePreview==='function') window.jobAIUpdateResumePreview();
          else if(typeof window.updateResumePreview==='function') window.updateResumePreview(); } catch(e) { console.error(e); }
  }

  window.addExperience = function(data){
    if(!Array.isArray(window.experiences)) window.experiences=[];
    data=data||{};
    window.experiences.push({company:data.company||'',position:data.position||'',start:data.start||'',end:data.end||'',description:data.description||''});
    renderExperiences(); save(); refresh();
  };
  window.removeExperience = function(index){
    if(!Array.isArray(window.experiences)) return;
    index=Number(index); if(index<0 || index>=window.experiences.length) return;
    window.experiences.splice(index,1); renderExperiences(); save(); refresh();
  };
  window.updateExperience = function(index,field,value){
    if(!window.experiences[index]) return;
    window.experiences[index][field]=value; save(); refresh();
  };
  function renderExperiences(){
    var c=document.getElementById('experienceContainer'); if(!c) return;
    var arr=Array.isArray(window.experiences)?window.experiences:[];
    if(!arr.length){ c.innerHTML='<p style="color:#7f8a96;">Додайте свій досвід роботи.</p>'; return; }
    c.innerHTML=arr.map(function(x,i){return '<div class="experience-item"><h4>Досвід роботи #'+(i+1)+'</h4><div class="form-grid">'+
      '<div class="form-group"><label>Компанія</label><input type="text" value="'+esc(x.company)+'" oninput="updateExperience('+i+',\'company\',this.value)"></div>'+ 
      '<div class="form-group"><label>Посада</label><input type="text" value="'+esc(x.position)+'" oninput="updateExperience('+i+',\'position\',this.value)"></div>'+ 
      '<div class="form-group"><label>Початок</label><input type="text" placeholder="01/2023" value="'+esc(x.start)+'" oninput="updateExperience('+i+',\'start\',this.value)"></div>'+ 
      '<div class="form-group"><label>Кінець</label><input type="text" placeholder="12/2025" value="'+esc(x.end)+'" oninput="updateExperience('+i+',\'end\',this.value)"></div>'+ 
      '<div class="form-group full"><label>Опис</label><textarea oninput="updateExperience('+i+',\'description\',this.value)">'+esc(x.description)+'</textarea></div></div>'+ 
      '<div class="actions"><button class="btn danger" type="button" onclick="removeExperience('+i+')">Видалити</button></div></div>';}).join('');
  }

  window.addEducation = function(data){
    if(!Array.isArray(window.educations)) window.educations=[];
    data=data||{};
    window.educations.push({school:data.school||'',speciality:data.speciality||data.specialty||'',year:data.year||''});
    renderEducations(); save(); refresh();
  };
  window.removeEducation = function(index){
    if(!Array.isArray(window.educations)) return;
    index=Number(index); if(index<0 || index>=window.educations.length) return;
    window.educations.splice(index,1); renderEducations(); save(); refresh();
  };
  window.updateEducation = function(index,field,value){
    if(!window.educations[index]) return;
    window.educations[index][field]=value; save(); refresh();
  };
  function renderEducations(){
    var c=document.getElementById('educationContainer'); if(!c) return;
    var arr=Array.isArray(window.educations)?window.educations:[];
    if(!arr.length){ c.innerHTML='<p style="color:#7f8a96;">Додайте освіту.</p>'; return; }
    c.innerHTML=arr.map(function(x,i){return '<div class="education-item"><h4>Освіта #'+(i+1)+'</h4><div class="form-grid">'+
      '<div class="form-group"><label>Навчальний заклад</label><input type="text" value="'+esc(x.school)+'" oninput="updateEducation('+i+',\'school\',this.value)"></div>'+ 
      '<div class="form-group"><label>Спеціальність</label><input type="text" value="'+esc(x.speciality)+'" oninput="updateEducation('+i+',\'speciality\',this.value)"></div>'+ 
      '<div class="form-group"><label>Рік</label><input type="text" placeholder="2024" value="'+esc(x.year)+'" oninput="updateEducation('+i+',\'year\',this.value)"></div></div>'+ 
      '<div class="actions"><button class="btn danger" type="button" onclick="removeEducation('+i+')">Видалити</button></div></div>';}).join('');
  }

  window.removePhoto = function(){
    if(typeof window.removeResumePhoto==='function') window.removeResumePhoto();
    else { localStorage.removeItem('jobaiPhoto'); var i=document.getElementById('photoInput'); if(i)i.value=''; refresh(); }
  };

  function init(){
    if(!Array.isArray(window.experiences)) window.experiences=[];
    if(!Array.isArray(window.educations)) window.educations=[];
    renderExperiences(); renderEducations();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
