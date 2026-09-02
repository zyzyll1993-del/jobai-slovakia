/* JobAI Slovakia — Preview controls */
(function () {
  "use strict";
  function init() {
    var preview=document.getElementById("preview");
    var wrapper=preview&&preview.querySelector(".preview-wrapper");
    if(!preview||!wrapper)return;
    var old=document.getElementById("jobaiPreviewControls");
    if(old) old.remove();
    var box=document.createElement("div");
    box.id="jobaiPreviewControls";
    box.className="card jobai-preview-controls";
    box.innerHTML=`<h2>Вигляд резюме</h2>
      <h3>Шаблон</h3><div class="template-grid">
      <button class="template-button" data-t="modern">Modern</button><button class="template-button" data-t="professional">Professional</button><button class="template-button" data-t="executive">Executive</button><button class="template-button" data-t="creative">Creative</button><button class="template-button" data-t="ats">ATS Simple</button></div>
      <h3 style="margin-top:18px">Колір</h3><div class="color-options">${[["blue","#1976d2"],["black","#222"],["green","#198754"],["purple","#7048a8"],["orange","#d97706"],["red","#c0392b"],["teal","#168b8b"],["navy","#243b64"]].map(x=>`<button class="color-button" data-c="${x[0]}" style="background:${x[1]}"></button>`).join("")}</div>
      <h3 style="margin-top:18px">Шрифт</h3><div class="jobai-font-options">${[["Arial","Arial"],["Roboto","Roboto"],["Georgia","Georgia"],["Times New Roman","Times New Roman"],["Verdana","Verdana"]].map(x=>`<button type="button" class="jobai-font-option" data-f="${x[0]}">${x[1]}</button>`).join("")}</div>
      <div class="jobai-font-grid"><div><h3>Розмір тексту</h3><button class="jobai-font-option" data-s="small">Малий</button><button class="jobai-font-option" data-s="normal">Стандарт</button><button class="jobai-font-option" data-s="large">Великий</button></div><div><h3>Розмір імені</h3><button class="jobai-font-option" data-n="small">Малий</button><button class="jobai-font-option" data-n="normal">Стандарт</button><button class="jobai-font-option" data-n="large">Великий</button></div><div><h3>Товщина</h3><button class="jobai-font-option" data-w="400">Звичайний</button><button class="jobai-font-option" data-w="600">Напівжирний</button></div><div><h3>Міжрядковий інтервал</h3><button class="jobai-font-option" data-l="1.25">Компактний</button><button class="jobai-font-option" data-l="1.5">Стандартний</button><button class="jobai-font-option" data-l="1.8">Просторий</button></div></div>`;
    wrapper.parentNode.insertBefore(box,wrapper);
    box.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{localStorage.setItem("jobaiResumeTemplate",b.dataset.t);if(window.selectTemplate)window.selectTemplate(b.dataset.t);refresh();});
    box.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{localStorage.setItem("jobaiResumeColor",b.dataset.c);if(window.selectColor)window.selectColor(b.dataset.c);refresh();});
    box.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{localStorage.setItem("jobaiResumeFont",b.dataset.f);apply();});
    box.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>{localStorage.setItem("jobaiResumeFontSize",b.dataset.s);apply();});
    box.querySelectorAll("[data-n]").forEach(b=>b.onclick=()=>{localStorage.setItem("jobaiResumeNameSize",b.dataset.n);apply();});
    box.querySelectorAll("[data-w]").forEach(b=>b.onclick=()=>{localStorage.setItem("jobaiResumeFontWeight",b.dataset.w);apply();});
    box.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{localStorage.setItem("jobaiResumeLineHeight",b.dataset.l);apply();});
    apply();refresh();
  }
  function apply(){
    var p=document.getElementById("resumePreview");if(!p)return;
    var f=localStorage.getItem("jobaiResumeFont")||"Arial";
    var fs=localStorage.getItem("jobaiResumeFontSize")||"normal";
    var ns=localStorage.getItem("jobaiResumeNameSize")||"normal";
    var w=localStorage.getItem("jobaiResumeFontWeight")||"400";
    var lh=localStorage.getItem("jobaiResumeLineHeight")||"1.5";
    p.style.setProperty("font-family",f+",Arial,sans-serif","important");p.style.setProperty("font-weight",w,"important");p.style.setProperty("line-height",lh,"important");
    p.querySelectorAll("*").forEach(e=>{e.style.setProperty("font-family",f+",Arial,sans-serif","important");e.style.setProperty("font-weight",w,"important");e.style.setProperty("line-height",lh,"important");});
    var inner=p.querySelector(".resume-page-inner");if(inner)inner.style.setProperty("font-size",fs==="small"?"92%":fs==="large"?"108%":"100%","important");
    var h1=p.querySelector(".resume-page-inner h1");if(h1)h1.style.setProperty("font-size",ns==="small"?"88%":ns==="large"?"114%":"","important");
    var box=document.getElementById("jobaiPreviewControls");if(box){box.querySelectorAll(".jobai-font-option").forEach(b=>b.classList.remove("selected"));box.querySelector(`[data-f="${f}"]`)?.classList.add("selected");box.querySelector(`[data-s="${fs}"]`)?.classList.add("selected");box.querySelector(`[data-n="${ns}"]`)?.classList.add("selected");box.querySelector(`[data-w="${w}"]`)?.classList.add("selected");box.querySelector(`[data-l="${lh}"]`)?.classList.add("selected");}}
  function refresh(){var box=document.getElementById("jobaiPreviewControls");if(!box)return;var t=localStorage.getItem("jobaiResumeTemplate")||"modern",c=localStorage.getItem("jobaiResumeColor")||"blue";box.querySelectorAll("[data-t]").forEach(b=>b.classList.toggle("selected",b.dataset.t===t));box.querySelectorAll("[data-c]").forEach(b=>b.classList.toggle("selected",b.dataset.c===c));}
  function start(){setTimeout(init,100);}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
  var oldShow=window.showTab;if(typeof oldShow==="function")window.showTab=function(t){var r=oldShow.apply(this,arguments);if(t==="preview")setTimeout(init,50);return r;};
  window.addEventListener("beforeprint",apply);
})();