/* JobAI Slovakia — compact Preview controls + full translation */
(function () {
  "use strict";

  var lastLanguage = "";

  function labels(){
    var lang=(localStorage.getItem("jobaiLanguage")||"ua").toLowerCase();
    if(lang==="sk") return {
      title:"Náhľad životopisu",design:"Vzhľad",template:"Šablóna",color:"Farba",font:"Písmo",
      text:"Veľkosť textu",name:"Veľkosť mena",weight:"Hrúbka",line:"Riadkovanie",normal:"Normálne",bold:"Polotučné",
      auto:"● Automaticky uložené",
      templates:["Modern","Profi","Classic","Tech","Compact"]
    };
    if(lang==="en") return {
      title:"Resume preview",design:"Appearance",template:"Template",color:"Color",font:"Font",
      text:"Text size",name:"Name size",weight:"Weight",line:"Line spacing",normal:"Regular",bold:"Semibold",
      auto:"● Saved automatically",
      templates:["Modern","Profi","Classic","Tech","Compact"]
    };
    return {
      title:"Перегляд резюме",design:"Вигляд",template:"Шаблон",color:"Колір",font:"Шрифт",
      text:"Розмір тексту",name:"Розмір імені",weight:"Товщина",line:"Міжрядковий інтервал",normal:"Звичайний",bold:"Напівжирний",
      auto:"● Зберігається автоматично",
      templates:["Modern","Profi","Classic","Tech","Compact"]
    };
  }

  function init(){
    var preview=document.getElementById("preview");
    var wrapper=preview&&preview.querySelector(".preview-wrapper");
    if(!preview||!wrapper)return;
    var old=document.getElementById("jobaiPreviewControls");
    if(old)old.remove();
    var l=labels();
    var box=document.createElement("div");
    box.id="jobaiPreviewControls";
    box.className="card jobai-preview-controls";
    box.innerHTML=`
      <div class="jobai-preview-head">
        <div><div class="jobai-preview-title">${l.design}</div><div class="jobai-preview-subtitle">${l.title}</div></div>
        <div class="jobai-preview-status">${l.auto}</div>
      </div>
      <div class="jobai-preview-section">
        <div class="jobai-preview-label" data-preview-i18n="template">${l.template}</div>
        <div class="template-grid">
          <button class="template-button" data-t="modern">${l.templates[0]}</button>
          <button class="template-button" data-t="professional">${l.templates[1]}</button>
          <button class="template-button" data-t="executive">${l.templates[2]}</button>
          <button class="template-button" data-t="creative">${l.templates[3]}</button>
          <button class="template-button" data-t="ats">${l.templates[4]}</button>
        </div>
      </div>
      <div class="jobai-preview-row">
        <div class="jobai-preview-section jobai-preview-half">
          <div class="jobai-preview-label">${l.color}</div>
          <div class="color-options">${[["blue","#1976d2"],["black","#222"],["green","#198754"],["purple","#7048a8"],["orange","#d97706"],["red","#c0392b"],["teal","#168b8b"],["navy","#243b64"]].map(x=>`<button aria-label="${x[0]}" class="color-button" data-c="${x[0]}" style="background:${x[1]}"></button>`).join("")}</div>
        </div>
        <div class="jobai-preview-section jobai-preview-half">
          <div class="jobai-preview-label">${l.font}</div>
          <div class="jobai-font-options">${[["Arial","Arial"],["Roboto","Roboto"],["Georgia","Georgia"],["Times New Roman","Times New Roman"],["Verdana","Verdana"]].map(x=>`<button type="button" class="jobai-font-option" data-f="${x[0]}">${x[1]}</button>`).join("")}</div>
        </div>
      </div>
      <div class="jobai-preview-settings">
        <label data-preview-label="text">${l.text}<div class="jobai-number-wrap"><input id="jobaiTextSizePx" class="jobai-font-number" type="number" min="8" max="30" step="1" value="14"><span>px</span></div></label>
        <label data-preview-label="name">${l.name}<div class="jobai-number-wrap"><input id="jobaiNameSizePx" class="jobai-font-number" type="number" min="18" max="60" step="1" value="32"><span>px</span></div></label>
        <div><div class="jobai-setting-title" data-preview-label="weight">${l.weight}</div><button class="jobai-font-option" data-w="400">${l.normal}</button><button class="jobai-font-option" data-w="600">${l.bold}</button></div>
        <div><div class="jobai-setting-title" data-preview-label="line">${l.line}</div><button class="jobai-font-option" data-l="1.25">1.25</button><button class="jobai-font-option" data-l="1.5">1.5</button><button class="jobai-font-option" data-l="1.8">1.8</button></div>
      </div>`;

    wrapper.parentNode.insertBefore(box,wrapper);
    box.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{localStorage.setItem("jobaiResumeTemplate",b.dataset.t);if(window.selectTemplate)window.selectTemplate(b.dataset.t);setTimeout(apply,0);refresh();});
    box.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{localStorage.setItem("jobaiResumeColor",b.dataset.c);if(window.selectColor)window.selectColor(b.dataset.c);setTimeout(apply,0);refresh();});
    box.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{localStorage.setItem("jobaiResumeFont",b.dataset.f);apply();});
    box.querySelectorAll("[data-w]").forEach(b=>b.onclick=()=>{localStorage.setItem("jobaiResumeFontWeight",b.dataset.w);apply();});
    box.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{localStorage.setItem("jobaiResumeLineHeight",b.dataset.l);apply();});
    var ti=box.querySelector("#jobaiTextSizePx"),ni=box.querySelector("#jobaiNameSizePx");
    ti.addEventListener("input",function(){var v=Math.max(8,Math.min(30,parseInt(this.value)||14));localStorage.setItem("jobaiResumeFontSizePx",v);apply();});
    ni.addEventListener("input",function(){var v=Math.max(18,Math.min(60,parseInt(this.value)||32));localStorage.setItem("jobaiResumeNameSizePx",v);apply();});
    injectStyle();
    apply();refresh();
    translateResume();
    lastLanguage=(localStorage.getItem("jobaiLanguage")||"ua").toLowerCase();
  }

  function getTextSize(){var v=localStorage.getItem("jobaiResumeFontSizePx");if(v)return parseInt(v)||14;var old=localStorage.getItem("jobaiResumeFontSize");return old==="small"?12:old==="large"?16:14;}
  function getNameSize(){var v=localStorage.getItem("jobaiResumeNameSizePx");if(v)return parseInt(v)||32;var old=localStorage.getItem("jobaiResumeNameSize");return old==="small"?28:old==="large"?36:32;}

  function apply(){
    var p=document.getElementById("resumePreview");if(!p)return;
    var f=localStorage.getItem("jobaiResumeFont")||"Arial";
    var ts=getTextSize(),ns=getNameSize(),w=localStorage.getItem("jobaiResumeFontWeight")||"400",lh=localStorage.getItem("jobaiResumeLineHeight")||"1.5";
    p.style.setProperty("font-family",f+",Arial,sans-serif","important");
    p.style.setProperty("font-weight",w,"important");
    p.style.setProperty("line-height",lh,"important");
    p.querySelectorAll("*").forEach(e=>{e.style.setProperty("font-family",f+",Arial,sans-serif","important");e.style.setProperty("font-weight",w,"important");e.style.setProperty("line-height",lh,"important");});
    var inner=p.querySelector(".resume-page-inner");if(inner)inner.style.setProperty("font-size",ts+"px","important");
    var h1=p.querySelector(".resume-page-inner h1");if(h1)h1.style.setProperty("font-size",ns+"px","important");
    var box=document.getElementById("jobaiPreviewControls");
    if(box){var ti=box.querySelector("#jobaiTextSizePx"),ni=box.querySelector("#jobaiNameSizePx");if(ti)ti.value=ts;if(ni)ni.value=ns;box.querySelectorAll(".jobai-font-option").forEach(b=>b.classList.remove("selected"));box.querySelector(`[data-f="${f}"]`)?.classList.add("selected");box.querySelector(`[data-w="${w}"]`)?.classList.add("selected");box.querySelector(`[data-l="${lh}"]`)?.classList.add("selected");}
  }

  function refresh(){
    var box=document.getElementById("jobaiPreviewControls");if(!box)return;
    var t=localStorage.getItem("jobaiResumeTemplate")||"modern",c=localStorage.getItem("jobaiResumeColor")||"blue";
    box.querySelectorAll("[data-t]").forEach(b=>b.classList.toggle("selected",b.dataset.t===t));
    box.querySelectorAll("[data-c]").forEach(b=>b.classList.toggle("selected",b.dataset.c===c));
  }

  function translateResume(){
    var p=document.getElementById("resumePreview");
    if(!p)return;
    var lang=(localStorage.getItem("jobaiLanguage")||"ua").toLowerCase();
    var dict={
      ua:{
        "Профіль":"Профіль","Досвід роботи":"Досвід роботи","Освіта":"Освіта","Навички":"Навички","Мови":"Мови",
        "Особисті дані":"Особисті дані","Ваше ім'я":"Ваше ім'я","Бажана посада":"Бажана посада",
        "Телефон · Email · Місто":"Телефон · Email · Місто","Посада":"Посада","Спеціальність":"Спеціальність","Фото":"Фото"
      },
      sk:{
        "Профіль":"Profil","Досвід роботи":"Pracovné skúsenosti","Освіта":"Vzdelanie","Навички":"Zručnosti","Мови":"Jazyky",
        "Особисті дані":"Osobné údaje","Ваше ім'я":"Vaše meno","Бажана посада":"Požadovaná pozícia",
        "Телефон · Email · Місто":"Telefón · Email · Mesto","Посада":"Pozícia","Спеціальність":"Špecializácia","Фото":"Foto"
      },
      en:{
        "Профіль":"Profile","Досвід роботи":"Experience","Освіта":"Education","Навички":"Skills","Мови":"Languages",
        "Особисті дані":"Personal information","Ваше ім'я":"Your name","Бажана посада":"Desired position",
        "Телефон · Email · Місто":"Phone · Email · City","Посада":"Position","Спеціальність":"Specialization","Фото":"Photo"
      }
    }[lang] || null;
    if(!dict)return;
    p.querySelectorAll("*").forEach(function(el){
      if(el.children.length!==0)return;
      var text=(el.textContent||"").trim();
      if(dict[text])el.textContent=dict[text];
    });
    var h=labels();
    var box=document.getElementById("jobaiPreviewControls");
    if(box){
      var title=box.querySelector(".jobai-preview-title"),sub=box.querySelector(".jobai-preview-subtitle"),status=box.querySelector(".jobai-preview-status");
      if(title)title.textContent=h.design;if(sub)sub.textContent=h.title;if(status)status.textContent=h.auto;
      var names=h.templates;box.querySelectorAll("[data-t]").forEach(function(b){var i={modern:0,professional:1,executive:2,creative:3,ats:4}[b.dataset.t];if(i!==undefined)b.textContent=names[i];});
      var keys={template:h.template,color:h.color,font:h.font,text:h.text,name:h.name,weight:h.weight,line:h.line};
      var tl=box.querySelector('[data-preview-i18n="template"]');if(tl)tl.textContent=keys.template;
      box.querySelectorAll("[data-preview-label]").forEach(function(el){el.firstChild.textContent=keys[el.dataset.previewLabel];});
      var ws=box.querySelectorAll("[data-w]");if(ws.length>1){ws[0].textContent=h.normal;ws[1].textContent=h.bold;}
    }
  }

  function injectStyle(){
    if(document.getElementById("jobaiPreviewCompactStyles"))return;
    var s=document.createElement("style");s.id="jobaiPreviewCompactStyles";s.textContent=`
      #preview .jobai-preview-controls{max-width:1250px;margin:0 auto 18px;padding:18px 20px;background:#fff;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 8px 28px rgba(15,23,42,.08);color:#172033}
      .jobai-preview-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:15px}
      .jobai-preview-title{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#64748b}
      .jobai-preview-subtitle{font-size:21px;font-weight:800;margin-top:3px;color:#0f172a}
      .jobai-preview-status{font-size:12px;font-weight:700;color:#198754;background:#eefaf4;border:1px solid #ccebdc;padding:7px 10px;border-radius:999px;white-space:nowrap}
      .jobai-preview-section{margin-top:12px}.jobai-preview-label,.jobai-setting-title{font-size:12px;font-weight:800;color:#64748b;margin-bottom:7px}
      .template-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
      .template-button,.jobai-font-option{border:1px solid #dbe3ec;background:#f8fafc;color:#26364a;border-radius:8px;min-height:38px;padding:7px 10px;font-size:12px;font-weight:700;transition:.15s}
      .template-button:hover,.jobai-font-option:hover{border-color:#94a3b8;background:#f1f5f9}.template-button.selected,.jobai-font-option.selected{border-color:#1976d2;background:#eaf3fb;color:#125a9c;box-shadow:0 0 0 2px rgba(25,118,210,.08)}
      .jobai-preview-row{display:grid;grid-template-columns:1fr 1.7fr;gap:20px;border-top:1px solid #edf1f5;margin-top:14px;padding-top:14px}
      .color-options{display:flex;gap:8px;flex-wrap:wrap}.color-button{width:27px;height:27px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px #cbd5e1;cursor:pointer}.color-button.selected{box-shadow:0 0 0 2px #1976d2,0 0 0 4px #fff}
      .jobai-font-options{display:flex;gap:7px;flex-wrap:wrap}.jobai-font-options .jobai-font-option{min-width:68px}
      .jobai-preview-settings{display:grid;grid-template-columns:1fr 1fr 1.15fr 1.35fr;gap:14px;border-top:1px solid #edf1f5;margin-top:14px;padding-top:14px;align-items:end}
      .jobai-preview-settings label{font-size:12px;font-weight:800;color:#64748b}.jobai-number-wrap{display:flex;align-items:center;margin-top:7px}.jobai-font-number{width:82px;height:38px;border:1px solid #dbe3ec;border-radius:8px;padding:0 10px;color:#172033;background:#fff;font-weight:700}.jobai-number-wrap span{font-size:12px;margin-left:6px;color:#94a3b8}.jobai-setting-title{margin-bottom:7px}
      .jobai-preview-settings .jobai-font-option{margin-right:5px;min-height:34px}
      #preview .preview-wrapper{max-width:1250px;margin:0 auto;padding:0 20px 30px}
      @media(max-width:760px){#preview .jobai-preview-controls{margin:0 10px 14px;padding:15px}.template-grid{grid-template-columns:repeat(2,1fr)}.jobai-preview-row,.jobai-preview-settings{grid-template-columns:1fr;gap:12px}.jobai-preview-head{align-items:flex-start}.jobai-preview-subtitle{font-size:18px}#preview .preview-wrapper{padding:0 10px 20px}}
    `;document.head.appendChild(s);
  }

  function languageTick(){
    var lang=(localStorage.getItem("jobaiLanguage")||"ua").toLowerCase();
    if(lang!==lastLanguage){lastLanguage=lang;translateResume();}
  }

  function start(){setTimeout(init,100);setInterval(languageTick,200);}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
  var oldShow=window.showTab;
  if(typeof oldShow==="function")window.showTab=function(t){var r=oldShow.apply(this,arguments);if(t==="preview")setTimeout(init,50);return r;};
  window.addEventListener("beforeprint",apply);
})();