(function () {
    function normalizeText(text) {
        return String(text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
    }
    function getResumeText() {
        const ids = ["name","position","phone","email","city","profile","skills","languages"];
        let parts = [];
        ids.forEach(function(id){ const e=document.getElementById(id); if(e&&e.value) parts.push(e.value); });
        if(Array.isArray(window.experiences)) window.experiences.forEach(function(x){ parts.push(x.company||"",x.position||"",x.start||"",x.end||"",x.description||""); });
        if(Array.isArray(window.educations)) window.educations.forEach(function(x){ parts.push(x.school||"",x.speciality||"",x.specialty||"",x.year||""); });
        return normalizeText(parts.join(" "));
    }
    function uniqueArray(a){ return [...new Set((a||[]).filter(Boolean))]; }
    function escapeHTML(v){ return String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;"); }
    function analyzeJob(){
        const jobElement=document.getElementById("jobText")||document.getElementById("job");
        const resultElement=document.getElementById("analysisResult");
        if(!jobElement||!resultElement){ alert("Не знайдено поле вакансії або блок результату."); return; }
        const jobText=jobElement.value.trim();
        if(!jobText){ resultElement.style.display="block"; const r=document.getElementById("recommendation"); if(r) r.innerText="⚠️ Вставте текст вакансії."; return; }
        const resumeText=getResumeText();
        let detectedJobs=typeof window.findJobs==="function"?window.findJobs(jobText):[];
        detectedJobs=uniqueArray(detectedJobs);
        let requirements=typeof window.findJobSkills==="function"?window.findJobSkills(jobText):[];
        requirements=uniqueArray(requirements);
        let matched=[],missing=[];
        requirements.forEach(function(skill){ if(resumeText.includes(normalizeText(skill))) matched.push(skill); else missing.push(skill); });
        let score=0;
        if(requirements.length) score=Math.round(matched.length/requirements.length*100);
        else { const words=uniqueArray(normalizeText(jobText).split(/\s+/).filter(function(w){return w.length>=4;})); let hits=0; words.forEach(function(w){if(resumeText.includes(w))hits++;}); score=words.length?Math.round(hits/words.length*100):50; }
        score=Math.max(0,Math.min(100,score));
        let recommendation=score>=80?"🟢 Дуже хороша відповідність. Ви маєте більшість необхідних навичок для цієї вакансії.":score>=60?"🟡 Хороша відповідність. Резюме варто трохи доповнити відсутніми навичками.":score>=40?"🟠 Часткова відповідність. Рекомендується додати релевантний досвід та навички.":"🔴 Низька відповідність. Варто адаптувати резюме під цю вакансію.";
        resultElement.style.display="block";
        const scoreEl=document.getElementById("score"); if(scoreEl) scoreEl.innerText=score+"%";
        const bar=document.getElementById("progressBar"); if(bar) bar.style.width=score+"%";
        const detected=document.getElementById("detectedJobs");
        if(detected){ if(detectedJobs.length){ detected.style.display="block"; detected.innerHTML="<strong>🔎 Розпізнана професія:</strong><p>"+detectedJobs.map(escapeHTML).join(", ")+"</p>"; } else { detected.style.display="none"; detected.innerHTML=""; } }
        const list=function(items){return items.length?"<ul>"+items.map(function(x){return "<li>"+escapeHTML(x)+"</li>";}).join("")+"</ul>":"<p>—</p>";};
        const found=document.getElementById("found"); if(found) found.innerHTML=list(matched);
        const miss=document.getElementById("missing"); if(miss) miss.innerHTML=list(missing);
        const rec=document.getElementById("recommendation"); if(rec) rec.innerText=recommendation;
        setTimeout(function(){resultElement.scrollIntoView({behavior:"smooth",block:"start"});},100);
    }
    window.analyzeJob=analyzeJob;

    /* LIVE PREVIEW CONTROLS + FONT EDITING */
    const previewTemplates=[["modern","Modern"],["professional","Professional"],["executive","Executive"],["creative","Creative"],["ats","ATS Simple"]];
    const previewColors=[["blue","Синій","#1976d2"],["black","Чорний","#222222"],["green","Зелений","#198754"],["purple","Фіолетовий","#7048a8"],["orange","Помаранчевий","#d97706"],["red","Червоний","#c0392b"],["teal","Бірюзовий","#168b8b"],["navy","Темно-синій","#243b64"]];
    const fontOptions=[["Arial","Arial"],["Roboto","Roboto"],["Georgia","Georgia"],["Times New Roman","Times New Roman"],["Verdana","Verdana"]];
    const textSizes=[["small","Малий"],["normal","Стандарт"],["large","Великий"]];
    const nameSizes=[["small","Малий"],["normal","Стандарт"],["large","Великий"]];
    const weights=[["400","Звичайний"],["600","Напівжирний"]];
    const lineHeights=[["1.25","Компактний"],["1.5","Стандартний"],["1.8","Просторий"]];
    function previewLabels(){ const l=localStorage.getItem("jobaiLanguage")||"ua"; if(l==="sk") return {title:"Vzhľad životopisu",template:"Šablóna",color:"Farba",font:"Písmo",textSize:"Veľkosť textu",nameSize:"Veľkosť mena",weight:"Hrúbka textu",line:"Riadkovanie",small:"Malé",normal:"Štandard",large:"Veľké",regular:"Normálne",semi:"Polotučné",compact:"Kompaktné",spacious:"Priestranné"}; if(l==="en") return {title:"Resume appearance",template:"Template",color:"Color",font:"Font",textSize:"Text size",nameSize:"Name size",weight:"Text weight",line:"Line spacing",small:"Small",normal:"Standard",large:"Large",regular:"Normal",semi:"Semibold",compact:"Compact",spacious:"Spacious"}; return {title:"Вигляд резюме",template:"Шаблон",color:"Колір",font:"Шрифт",textSize:"Розмір тексту",nameSize:"Розмір імені",weight:"Товщина тексту",line:"Міжрядковий інтервал",small:"Малий",normal:"Стандарт",large:"Великий",regular:"Звичайний",semi:"Напівжирний",compact:"Компактний",spacious:"Просторий"}; }
    function fontSettings(){return {font:localStorage.getItem("jobaiResumeFont")||"Arial",textSize:localStorage.getItem("jobaiResumeFontSize")||"normal",nameSize:localStorage.getItem("jobaiResumeNameSize")||"normal",weight:localStorage.getItem("jobaiResumeFontWeight")||"400",line:localStorage.getItem("jobaiResumeLineHeight")||"1.5"};}
    function applyFontSettings(){
        const preview=document.getElementById("resumePreview"); if(!preview)return;
        const s=fontSettings();
        const sizes={small:"0.92",normal:"1",large:"1.08"};
        const nameScales={small:"0.88",normal:"1",large:"1.14"};
        preview.style.setProperty("--jobai-font-family", s.font+", Arial, Helvetica, sans-serif");
        preview.style.setProperty("--jobai-font-scale", sizes[s.textSize]||"1");
        preview.style.setProperty("--jobai-name-scale", nameScales[s.nameSize]||"1");
        preview.style.setProperty("--jobai-font-weight", s.weight);
        preview.style.setProperty("--jobai-line-height", s.line);
        preview.classList.remove("jobai-font-small","jobai-font-normal","jobai-font-large","jobai-name-small","jobai-name-normal","jobai-name-large");
        preview.classList.add("jobai-font-"+s.textSize,"jobai-name-"+s.nameSize);
    }
    function syncPreviewControls(){
        const box=document.getElementById("jobaiPreviewControls"); if(!box)return;
        const t=localStorage.getItem("jobaiResumeTemplate")||"modern", c=localStorage.getItem("jobaiResumeColor")||"blue", s=fontSettings();
        box.querySelectorAll("[data-preview-template]").forEach(function(b){b.classList.toggle("selected",b.dataset.previewTemplate===t);});
        box.querySelectorAll("[data-preview-color]").forEach(function(b){b.classList.toggle("selected",b.dataset.previewColor===c);});
        box.querySelectorAll("[data-preview-font]").forEach(function(b){b.classList.toggle("selected",b.dataset.previewFont===s.font);});
        box.querySelectorAll("[data-preview-size]").forEach(function(b){b.classList.toggle("selected",b.dataset.previewSize===s.textSize);});
        box.querySelectorAll("[data-preview-name-size]").forEach(function(b){b.classList.toggle("selected",b.dataset.previewNameSize===s.nameSize);});
        box.querySelectorAll("[data-preview-weight]").forEach(function(b){b.classList.toggle("selected",b.dataset.previewWeight===s.weight);});
        box.querySelectorAll("[data-preview-line]").forEach(function(b){b.classList.toggle("selected",b.dataset.previewLine===s.line);});
    }
    function optionButtons(items,attr,selectedClass){return items.map(function(x){return '<button type="button" class="jobai-font-option" data-preview-'+attr+'="'+x[0]+'">'+x[1]+'</button>';}).join("");}
    function initPreviewControls(){
        const preview=document.getElementById("preview"), wrapper=preview&&preview.querySelector(".preview-wrapper");
        if(!preview||!wrapper)return;
        if(!document.getElementById("jobaiPreviewControlsStyles")){
            const style=document.createElement("style"); style.id="jobaiPreviewControlsStyles"; style.textContent='.jobai-preview-controls{margin-bottom:20px}.jobai-preview-controls h2{margin-bottom:18px}.jobai-preview-control-group h3{margin:0 0 10px}.jobai-preview-controls .template-button.selected,.jobai-font-option.selected{background:#1976d2;border-color:#1976d2;color:#fff}.jobai-preview-controls .color-button{flex:0 0 35px}.jobai-font-options{display:flex;flex-wrap:wrap;gap:8px}.jobai-font-option{border:1px solid #475569;background:#1e293b;color:#fff;border-radius:8px;padding:9px 12px;font-weight:700}.jobai-font-option:hover{background:#334155}.jobai-font-group{margin-top:18px}.jobai-font-group-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.jobai-font-select{width:100%;border:1px solid #475569;background:#0f172a;color:#f8fafc;border-radius:8px;padding:10px}.jobai-font-small .resume-page-inner{font-size:92%!important}.jobai-font-large .resume-page-inner{font-size:108%!important}.jobai-font-normal .resume-page-inner{font-size:100%!important}.jobai-name-small .resume-page-inner h1{font-size:calc(1em * .88)!important}.jobai-name-large .resume-page-inner h1{font-size:calc(1em * 1.14)!important}.jobai-name-normal .resume-page-inner h1{font-size:inherit}.jobai-preview-page-font,.jobai-preview-page-font *{font-family:var(--jobai-font-family)!important;font-weight:var(--jobai-font-weight)!important;line-height:var(--jobai-line-height)!important}@media(max-width:700px){.jobai-preview-controls .template-grid{grid-template-columns:repeat(2,1fr)}.jobai-preview-controls .template-button{min-height:44px}.jobai-font-group-grid{grid-template-columns:1fr}}'; document.head.appendChild(style);
        }
        let box=document.getElementById("jobaiPreviewControls");
        if(!box){
            const l=previewLabels(); box=document.createElement("div"); box.id="jobaiPreviewControls"; box.className="card jobai-preview-controls";
            box.innerHTML='<h2 id="jobaiPreviewControlsTitle">'+l.title+'</h2><div class="jobai-preview-control-group"><h3 id="jobaiPreviewTemplateTitle">'+l.template+'</h3><div class="template-grid">'+previewTemplates.map(function(x){return '<button type="button" class="template-button" data-preview-template="'+x[0]+'">'+x[1]+'</button>';}).join("")+'</div></div><div class="jobai-preview-control-group" style="margin-top:18px"><h3 id="jobaiPreviewColorTitle">'+l.color+'</h3><div class="color-options">'+previewColors.map(function(x){return '<button type="button" class="color-button" title="'+x[1]+'" aria-label="'+x[1]+'" data-preview-color="'+x[0]+'" style="background:'+x[2]+'"></button>';}).join("")+'</div></div><div class="jobai-font-group"><h3>'+l.font+'</h3><div class="jobai-font-options">'+optionButtons(fontOptions,"font")+'</div></div><div class="jobai-font-group-grid"><div class="jobai-font-group"><h3>'+l.textSize+'</h3><div class="jobai-font-options">'+optionButtons([["small",l.small],["normal",l.normal],["large",l.large]],"size")+'</div></div><div class="jobai-font-group"><h3>'+l.nameSize+'</h3><div class="jobai-font-options">'+optionButtons([["small",l.small],["normal",l.normal],["large",l.large]],"name-size")+'</div></div><div class="jobai-font-group"><h3>'+l.weight+'</h3><div class="jobai-font-options">'+optionButtons([["400",l.regular],["600",l.semi]],"weight")+'</div></div><div class="jobai-font-group"><h3>'+l.line+'</h3><div class="jobai-font-options">'+optionButtons([["1.25",l.compact],["1.5",l.normal],["1.8",l.spacious]],"line")+'</div></div></div>';
            wrapper.parentNode.insertBefore(box,wrapper);
            box.querySelectorAll("[data-preview-template]").forEach(function(b){b.addEventListener("click",function(){if(typeof window.selectTemplate==="function")window.selectTemplate(b.dataset.previewTemplate);setTimeout(function(){syncPreviewControls();applyFontSettings();},0);});});
            box.querySelectorAll("[data-preview-color]").forEach(function(b){b.addEventListener("click",function(){if(typeof window.selectColor==="function")window.selectColor(b.dataset.previewColor);setTimeout(function(){syncPreviewControls();applyFontSettings();},0);});});
            box.querySelectorAll("[data-preview-font]").forEach(function(b){b.addEventListener("click",function(){localStorage.setItem("jobaiResumeFont",b.dataset.previewFont);applyFontSettings();syncPreviewControls();});});
            box.querySelectorAll("[data-preview-size]").forEach(function(b){b.addEventListener("click",function(){localStorage.setItem("jobaiResumeFontSize",b.dataset.previewSize);applyFontSettings();syncPreviewControls();});});
            box.querySelectorAll("[data-preview-name-size]").forEach(function(b){b.addEventListener("click",function(){localStorage.setItem("jobaiResumeNameSize",b.dataset.previewNameSize);applyFontSettings();syncPreviewControls();});});
            box.querySelectorAll("[data-preview-weight]").forEach(function(b){b.addEventListener("click",function(){localStorage.setItem("jobaiResumeFontWeight",b.dataset.previewWeight);applyFontSettings();syncPreviewControls();});});
            box.querySelectorAll("[data-preview-line]").forEach(function(b){b.addEventListener("click",function(){localStorage.setItem("jobaiResumeLineHeight",b.dataset.previewLine);applyFontSettings();syncPreviewControls();});});
        }
        const l=previewLabels(); const a=document.getElementById("jobaiPreviewControlsTitle"),b=document.getElementById("jobaiPreviewTemplateTitle"),c=document.getElementById("jobaiPreviewColorTitle"); if(a)a.textContent=l.title;if(b)b.textContent=l.template;if(c)c.textContent=l.color;
        applyFontSettings();syncPreviewControls();
    }
    function startPreviewControls(){setTimeout(initPreviewControls,100);}
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",startPreviewControls); else startPreviewControls();
    const originalShowTab=window.showTab;
    if(typeof originalShowTab==="function") window.showTab=function(tabName){const result=originalShowTab.apply(this,arguments);if(tabName==="preview")setTimeout(initPreviewControls,50);return result;};
    window.addEventListener("beforeprint",function(){try{applyFontSettings();if(typeof window.updateResumePreview==="function")window.updateResumePreview();}catch(e){console.error(e);}});
})();
