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
    function escapeHTML(v){ return String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"); }
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

    /* LIVE PREVIEW CONTROLS */
    const previewTemplates=[["modern","Modern"],["professional","Professional"],["executive","Executive"],["creative","Creative"],["ats","ATS Simple"]];
    const previewColors=[["blue","Синій","#1976d2"],["black","Чорний","#222222"],["green","Зелений","#198754"],["purple","Фіолетовий","#7048a8"],["orange","Помаранчевий","#d97706"],["red","Червоний","#c0392b"],["teal","Бірюзовий","#168b8b"],["navy","Темно-синій","#243b64"]];
    function previewLabels(){ const l=localStorage.getItem("jobaiLanguage")||"ua"; if(l==="sk") return {title:"Vzhľad životopisu",template:"Šablóna",color:"Farba"}; if(l==="en") return {title:"Resume appearance",template:"Template",color:"Color"}; return {title:"Вигляд резюме",template:"Шаблон",color:"Колір"}; }
    function syncPreviewControls(){
        const box=document.getElementById("jobaiPreviewControls"); if(!box)return;
        const t=localStorage.getItem("jobaiResumeTemplate")||"modern";
        const c=localStorage.getItem("jobaiResumeColor")||"blue";
        box.querySelectorAll("[data-preview-template]").forEach(function(b){b.classList.toggle("selected",b.dataset.previewTemplate===t);});
        box.querySelectorAll("[data-preview-color]").forEach(function(b){b.classList.toggle("selected",b.dataset.previewColor===c);});
    }
    function initPreviewControls(){
        const preview=document.getElementById("preview");
        const wrapper=preview&&preview.querySelector(".preview-wrapper");
        if(!preview||!wrapper)return;
        if(!document.getElementById("jobaiPreviewControlsStyles")){
            const style=document.createElement("style"); style.id="jobaiPreviewControlsStyles"; style.textContent='.jobai-preview-controls{margin-bottom:20px}.jobai-preview-controls h2{margin-bottom:18px}.jobai-preview-control-group h3{margin:0 0 10px}.jobai-preview-controls .template-button.selected{background:#1976d2;border-color:#1976d2}.jobai-preview-controls .color-button{flex:0 0 35px}@media(max-width:700px){.jobai-preview-controls .template-grid{grid-template-columns:repeat(2,1fr)}.jobai-preview-controls .template-button{min-height:44px}}'; document.head.appendChild(style);
        }
        let box=document.getElementById("jobaiPreviewControls");
        if(!box){
            const l=previewLabels(); box=document.createElement("div"); box.id="jobaiPreviewControls"; box.className="card jobai-preview-controls";
            box.innerHTML='<h2 id="jobaiPreviewControlsTitle">'+l.title+'</h2><div class="jobai-preview-control-group"><h3 id="jobaiPreviewTemplateTitle">'+l.template+'</h3><div class="template-grid">'+previewTemplates.map(function(x){return '<button type="button" class="template-button" data-preview-template="'+x[0]+'">'+x[1]+'</button>';}).join("")+'</div></div><div class="jobai-preview-control-group" style="margin-top:18px"><h3 id="jobaiPreviewColorTitle">'+l.color+'</h3><div class="color-options">'+previewColors.map(function(x){return '<button type="button" class="color-button" title="'+x[1]+'" aria-label="'+x[1]+'" data-preview-color="'+x[0]+'" style="background:'+x[2]+'"></button>';}).join("")+'</div></div>';
            wrapper.parentNode.insertBefore(box,wrapper);
            box.querySelectorAll("[data-preview-template]").forEach(function(b){b.addEventListener("click",function(){if(typeof window.selectTemplate==="function")window.selectTemplate(b.dataset.previewTemplate);setTimeout(syncPreviewControls,0);});});
            box.querySelectorAll("[data-preview-color]").forEach(function(b){b.addEventListener("click",function(){if(typeof window.selectColor==="function")window.selectColor(b.dataset.previewColor);setTimeout(syncPreviewControls,0);});});
        }
        const l=previewLabels(); const a=document.getElementById("jobaiPreviewControlsTitle"),b=document.getElementById("jobaiPreviewTemplateTitle"),c=document.getElementById("jobaiPreviewColorTitle"); if(a)a.textContent=l.title;if(b)b.textContent=l.template;if(c)c.textContent=l.color;syncPreviewControls();
    }
    function startPreviewControls(){setTimeout(initPreviewControls,100);}
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",startPreviewControls); else startPreviewControls();
    const originalShowTab=window.showTab;
    if(typeof originalShowTab==="function") window.showTab=function(tabName){const result=originalShowTab.apply(this,arguments);if(tabName==="preview")setTimeout(initPreviewControls,50);return result;};
    window.addEventListener("beforeprint",function(){try{if(typeof window.updateResumePreview==="function")window.updateResumePreview();}catch(e){console.error(e);}});
})();
