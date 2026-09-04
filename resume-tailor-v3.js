/* JobAI — safe resume tailoring v3: reuse structured analysis, never invent facts */
(function(){
'use strict';
var UI={
  ua:{btn:'🎯 Адаптувати резюме під вакансію',title:'Безпечна адаптація резюме',intro:'JobAI використовує лише те, що вже є у вашому резюме. Новий досвід, освіта, мови чи навички не вигадуються.',emphasize:'Що варто підкреслити',check:'Що не підтверджено',apply:'✅ Застосувати безпечні зміни',applied:'Готово: підтверджені навички та мови піднято вище. Нових фактів не додано.',nothing:'Немає безпечних змін для автоматичного застосування.',truth:'Додавайте відсутні вимоги тільки якщо вони справді відповідають вашому досвіду.',position:'Посада',skills:'Навички',languages:'Мови',experience:'Досвід',education:'Освіта',licence:'Водійські категорії'},
  sk:{btn:'🎯 Prispôsobiť životopis ponuke',title:'Bezpečné prispôsobenie životopisu',intro:'JobAI používa iba údaje, ktoré už máte v životopise. Nevymýšľa prax, vzdelanie, jazyky ani zručnosti.',emphasize:'Čo zvýrazniť',check:'Čo nie je potvrdené',apply:'✅ Použiť bezpečné zmeny',applied:'Hotovo: potvrdené zručnosti a jazyky sú vyššie. Neboli pridané žiadne nové fakty.',nothing:'Nie sú dostupné bezpečné automatické zmeny.',truth:'Chýbajúce požiadavky doplňte iba vtedy, ak ich skutočne spĺňate.',position:'Pozícia',skills:'Zručnosti',languages:'Jazyky',experience:'Prax',education:'Vzdelanie',licence:'Vodičské oprávnenie'},
  en:{btn:'🎯 Tailor resume to job',title:'Safe resume tailoring',intro:'JobAI only uses information already present in your resume. It does not invent experience, education, languages, or skills.',emphasize:'What to emphasize',check:'What is not confirmed',apply:'✅ Apply safe changes',applied:'Done: confirmed skills and languages were moved higher. No new facts were added.',nothing:'There are no safe automatic changes to apply.',truth:'Add missing requirements only when they are genuinely true for you.',position:'Position',skills:'Skills',languages:'Languages',experience:'Experience',education:'Education',licence:'Driving licence'}
};
function lang(){var l=(localStorage.getItem('jobaiLanguage')||document.documentElement.lang||'ua').toLowerCase();return l.indexOf('sk')===0?'sk':l.indexOf('en')===0?'en':'ua';}
function t(){return UI[lang()];}
function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9+#а-яіїєґ\s]/gi,' ').replace(/\s+/g,' ').trim();}
function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}
function val(id){var e=document.getElementById(id);return e&&'value' in e?String(e.value||''):'';}
function setVal(id,v){var e=document.getElementById(id);if(!e||!('value' in e))return false;if(e.value===v)return false;e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));return true;}
function splitField(v){return String(v||'').split(/[\n,;]+/).map(function(x){return x.trim();}).filter(Boolean);}
function uniq(a){var out=[];(a||[]).forEach(function(x){if(!out.some(function(y){return norm(y)===norm(x);}))out.push(x);});return out;}
function part(details,key){return details&&Array.isArray(details.parts)?details.parts.find(function(p){return p.key===key;}):null;}
function matchedOf(p){return p&&p.fit&&Array.isArray(p.fit.matched)?p.fit.matched:[];}
function missingOf(p){return p&&p.fit&&Array.isArray(p.fit.missing)?p.fit.missing:[];}
function reorderExisting(raw,preferred){var items=splitField(raw),pref=uniq(preferred||[]);if(!items.length||!pref.length)return raw;var yes=[],no=[];items.forEach(function(item){var hit=pref.some(function(p){var a=norm(item),b=norm(p);return a===b||a.indexOf(b)>=0||b.indexOf(a)>=0;});(hit?yes:no).push(item);});return yes.concat(no).join(', ');}
function confirmed(details){var x=t(),out=[],p;
 p=part(details,'role');if(p&&p.score>=70)out.push(x.position+': '+(details.title||p.req||'—'));
 p=part(details,'skills');matchedOf(p).forEach(function(v){out.push(x.skills+': '+v);});
 p=part(details,'languages');matchedOf(p).forEach(function(v){out.push(x.languages+': '+v);});
 p=part(details,'experience');if(p&&p.score>=70&&p.req)out.push(x.experience+': '+p.req);
 p=part(details,'education');if(p&&p.score>=70&&p.req)out.push(x.education+': '+p.req);
 p=part(details,'licence');matchedOf(p).forEach(function(v){out.push(x.licence+': '+v);});
 return uniq(out);
}
function unconfirmed(details){var x=t(),out=[];(details&&details.parts||[]).forEach(function(p){if(p.score>=70)return;var miss=missingOf(p);if(miss.length){miss.forEach(function(v){out.push(p.label+': '+v);});return;}if(p.req)out.push(p.label+': '+p.req);});return uniq(out);}
function list(a){return a.length?'<ul>'+a.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>':'<p>—</p>';}
function applySafe(){var d=window.__jobaiLastAnalysis,x=t();if(!d)return;var changed=false,sp=part(d,'skills'),lp=part(d,'languages');
 changed=setVal('skills',reorderExisting(val('skills'),matchedOf(sp)))||changed;
 changed=setVal('languages',reorderExisting(val('languages'),matchedOf(lp)))||changed;
 try{if(typeof window.saveResumeData==='function')window.saveResumeData(false);}catch(e){}
 try{if(typeof window.jobAIUpdateResumePreview==='function')window.jobAIUpdateResumePreview();else if(typeof window.updateResumePreview==='function')window.updateResumePreview();}catch(e){}
 var note=document.getElementById('jobaiTailorApplied');if(note){note.textContent=changed?x.applied:x.nothing;note.style.display='block';}
}
function render(){var d=window.__jobaiLastAnalysis;if(!d)return;var x=t(),area=document.getElementById('analysisResult')||document.getElementById('analysis');if(!area)return;var old=document.getElementById('jobaiTailorResult');if(old)old.remove();var box=document.createElement('div');box.id='jobaiTailorResult';box.style.cssText='margin-top:16px;padding:16px;border:1px solid rgba(127,127,127,.28);border-radius:14px;background:rgba(59,130,246,.05)';var good=confirmed(d),bad=unconfirmed(d);box.innerHTML='<h3 style="margin-top:0">'+esc(x.title)+'</h3><p>'+esc(x.intro)+'</p><div class="jrt3-grid"><section><strong>✅ '+esc(x.emphasize)+'</strong>'+list(good)+'</section><section><strong>⚠️ '+esc(x.check)+'</strong>'+list(bad)+'</section></div><button type="button" class="btn primary" id="jobaiTailorApply">'+esc(x.apply)+'</button><p id="jobaiTailorApplied" style="display:none;margin-top:10px"></p><p style="font-size:13px;opacity:.8">⚠️ '+esc(x.truth)+'</p>';area.appendChild(box);var a=document.getElementById('jobaiTailorApply');if(a)a.addEventListener('click',applySafe);if(!document.getElementById('jobaiTailorV3Style')){var s=document.createElement('style');s.id='jobaiTailorV3Style';s.textContent='.jrt3-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0}.jrt3-grid section{padding:12px;border-radius:12px;background:rgba(127,127,127,.06)}@media(max-width:650px){.jrt3-grid{grid-template-columns:1fr}}';document.head.appendChild(s);}box.scrollIntoView({behavior:'smooth',block:'center'});}
function install(){var d=window.__jobaiLastAnalysis,area=document.getElementById('analysisResult');if(!d||!area)return;var b=document.getElementById('jobaiTailorBtn');if(!b){b=document.createElement('button');b.type='button';b.id='jobaiTailorBtn';b.className='btn primary';b.style.margin='12px 0';b.addEventListener('click',render);area.parentNode.insertBefore(b,area);}b.textContent=t().btn;}
window.jobAITailorInit=install;
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button');if(!b)return;var x=(b.textContent||'').trim().toUpperCase();if(x==='UA'||x==='SK'||x==='EN')setTimeout(function(){var tb=document.getElementById('jobaiTailorBtn');if(tb)tb.textContent=t().btn;var box=document.getElementById('jobaiTailorResult');if(box)render();},80);});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
