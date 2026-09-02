/* JobAI Slovakia — Resume editor builder layout + live multilingual navigation */
(function () {
  "use strict";
  function getLabels(){
    var lang=localStorage.getItem("jobaiLanguage")||"ua";
    if(lang==="sk") return {title:"Upraviť životopis",done:"Uloženie je automatické",sections:["Osobné údaje","Profil","Skúsenosti","Vzdelanie","Zručnosti a jazyky","Dizajn"]};
    if(lang==="en") return {title:"Edit resume",done:"Changes are saved automatically",sections:["Personal information","Profile","Experience","Education","Skills and languages","Design"]};
    return {title:"Редагування резюме",done:"Зміни зберігаються автоматично",sections:["Особисті дані","Профіль","Досвід роботи","Освіта","Навички та мови","Дизайн"]};
  }
  function refreshLanguage(){
    var root=document.getElementById("resume"), side=root&&root.querySelector(".jobai-editor-sidebar");
    if(!side) return;
    var l=getLabels(), brand=side.querySelector(".jobai-editor-brand"), save=side.querySelector(".jobai-editor-save"), nav=side.querySelector(".jobai-editor-nav");
    if(brand) brand.textContent=l.title;
    if(save) save.textContent="● "+l.done;
    if(nav) Array.prototype.forEach.call(nav.querySelectorAll(".jobai-editor-nav-item"),function(b,i){var t=b.querySelector(".jobai-nav-text");if(t) t.textContent=l.sections[i]||("Section "+(i+1));});
  }
  function init(){
    var root=document.getElementById("resume");
    if(!root||root.dataset.jobaiBuilderReady==="1") return;
    root.dataset.jobaiBuilderReady="1"; root.classList.add("jobai-resume-builder");
    var shell=document.createElement("div"), side=document.createElement("aside"), main=document.createElement("div"), l=getLabels();
    shell.className="jobai-editor-shell"; side.className="jobai-editor-sidebar"; main.className="jobai-editor-main";
    side.innerHTML='<div class="jobai-editor-brand">'+l.title+'</div><div class="jobai-editor-save">● '+l.done+'</div><div class="jobai-editor-nav"></div>';
    var nav=side.querySelector(".jobai-editor-nav");
    while(root.firstChild) main.appendChild(root.firstChild);
    var cards=Array.prototype.slice.call(main.querySelectorAll(":scope > .card"));
    if(!cards.length) cards=Array.prototype.slice.call(main.querySelectorAll(".card"));
    cards.forEach(function(card,i){
      card.id=card.id||("jobai-editor-section-"+i); card.classList.add("jobai-editor-card");
      var b=document.createElement("button"); b.type="button"; b.className="jobai-editor-nav-item"; b.innerHTML='<span class="jobai-editor-number">'+(i+1)+'</span><span class="jobai-nav-text">'+(l.sections[i]||("Section "+(i+1)))+'</span>';
      b.onclick=function(){card.scrollIntoView({behavior:"smooth",block:"start"});nav.querySelectorAll(".active").forEach(function(x){x.classList.remove("active")});b.classList.add("active")}; nav.appendChild(b);
    });
    shell.appendChild(side); shell.appendChild(main); root.appendChild(shell); if(nav.firstElementChild) nav.firstElementChild.classList.add("active");
    var style=document.createElement("style"); style.id="jobaiResumeEditorBuilderStyles"; style.textContent=`#resume.jobai-resume-builder{max-width:1200px;margin:0 auto;padding:0 0 40px}.jobai-editor-shell{display:grid;grid-template-columns:245px minmax(0,1fr);gap:22px;align-items:start}.jobai-editor-sidebar{position:sticky;top:18px;background:#172033;border:1px solid #334155;border-radius:14px;padding:18px;box-shadow:0 8px 30px rgba(0,0,0,.18)}.jobai-editor-brand{font-size:21px;font-weight:800;color:#fff;margin-bottom:7px}.jobai-editor-save{font-size:12px;color:#86efac;margin-bottom:18px}.jobai-editor-nav{display:flex;flex-direction:column;gap:6px}.jobai-editor-nav-item{width:100%;display:flex;align-items:center;gap:10px;text-align:left;border:1px solid transparent;background:transparent;color:#cbd5e1;border-radius:9px;padding:10px 9px;cursor:pointer;font-weight:600}.jobai-editor-nav-item:hover{background:#1e293b;color:#fff}.jobai-editor-nav-item.active{background:#1976d2;color:#fff}.jobai-editor-number{width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:#334155;color:#fff;font-size:12px;flex:0 0 24px}.jobai-editor-nav-item.active .jobai-editor-number{background:rgba(255,255,255,.22)}.jobai-editor-main{min-width:0}.jobai-editor-card{scroll-margin-top:20px;background:#fff!important;color:#172033!important;border:1px solid #d8dee8!important;border-radius:14px!important;padding:24px!important;box-shadow:0 5px 22px rgba(15,23,42,.08);margin-bottom:18px!important}.jobai-editor-card h2,.jobai-editor-card h3{color:#172033!important}.jobai-editor-card label{color:#334155!important}.jobai-editor-card input,.jobai-editor-card textarea,.jobai-editor-card select{background:#fff!important;color:#172033!important;border-color:#cbd5e1!important}.jobai-editor-card input:focus,.jobai-editor-card textarea:focus,.jobai-editor-card select:focus{border-color:#1976d2!important;box-shadow:0 0 0 3px rgba(25,118,210,.1)}.jobai-editor-card .entry{background:#f8fafc!important;border-color:#dbe3ee!important}.jobai-editor-card .action-button{background:#fff;color:#172033;border-color:#cbd5e1}.jobai-editor-card .action-button.primary{background:#1976d2;color:#fff;border-color:#1976d2}.jobai-editor-card .template-button{background:#f8fafc;color:#172033;border-color:#cbd5e1}.jobai-editor-card .template-button.selected{background:#1976d2;color:#fff;border-color:#1976d2}.jobai-editor-card .color-button.selected{box-shadow:0 0 0 2px #1976d2}@media(max-width:850px){#resume.jobai-resume-builder{padding:0 0 25px}.jobai-editor-shell{grid-template-columns:1fr;gap:12px}.jobai-editor-sidebar{position:sticky;top:0;z-index:20;padding:12px;border-radius:0 0 14px 14px}.jobai-editor-brand{font-size:18px}.jobai-editor-save{margin-bottom:10px}.jobai-editor-nav{flex-direction:row;overflow-x:auto;padding-bottom:2px}.jobai-editor-nav-item{min-width:max-content;width:auto;padding:8px}.jobai-editor-nav-item .jobai-nav-text{display:none}.jobai-editor-card{padding:18px!important}.jobai-editor-card .form-grid,.jobai-editor-card .design-grid{grid-template-columns:1fr!important}.jobai-editor-card .template-grid{grid-template-columns:repeat(2,1fr)}}`;
    document.head.appendChild(style);
  }
  function start(){setTimeout(init,120);setTimeout(refreshLanguage,200)}
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start); else start();
  var oldShow=window.showTab; if(typeof oldShow==="function") window.showTab=function(tab){var r=oldShow.apply(this,arguments);if(tab==="resume")setTimeout(function(){init();refreshLanguage()},50);return r};
  var lastLang=localStorage.getItem("jobaiLanguage")||"ua";
  setInterval(function(){var lang=localStorage.getItem("jobaiLanguage")||"ua";if(lang!==lastLang){lastLang=lang;refreshLanguage()}},200);
})();
