/* JobAI local resume text improver v1 */
(function(){
'use strict';
var T={
ua:{btn:'✨ Покращити текст',empty:'Спочатку введіть свій текст.',profileLead:'Професійний профіль:',expLead:'Досвід:',note:'Текст покращено без додавання нових фактів.'},
sk:{btn:'✨ Vylepšiť text',empty:'Najprv zadajte svoj text.',profileLead:'Profesijný profil:',expLead:'Prax:',note:'Text bol upravený bez pridania nových faktov.'},
en:{btn:'✨ Improve text',empty:'Enter your text first.',profileLead:'Professional profile:',expLead:'Experience:',note:'Text improved without adding new facts.'}
};
function lang(){var l=(localStorage.getItem('jobaiLanguage')||document.documentElement.lang||'ua').toLowerCase();return l.indexOf('sk')===0?'sk':l.indexOf('en')===0?'en':'ua';}
function clean(s){return String(s||'').replace(/\s+/g,' ').trim();}
function sentence(s){s=clean(s);if(!s)return'';s=s.charAt(0).toUpperCase()+s.slice(1);if(!/[.!?]$/.test(s))s+='.';return s;}
function improveProfile(raw){var s=clean(raw);if(!s)return'';var parts=s.split(/[.!?;]+/).map(clean).filter(Boolean);var uniq=[];parts.forEach(function(p){var n=p.toLowerCase();if(!uniq.some(function(x){return x.toLowerCase()===n;}))uniq.push(p);});return uniq.slice(0,4).map(sentence).join(' ');}
function improveExperience(raw){var s=clean(raw);if(!s)return'';var chunks=s.split(/[\n;]+|\.(?=\s|$)/).map(clean).filter(Boolean);var seen=[];chunks.forEach(function(c){var n=c.toLowerCase();if(!seen.some(function(x){return x.toLowerCase()===n;}))seen.push(c);});return seen.slice(0,6).map(function(c){c=c.replace(/^[-•]+\s*/,'');return '• '+c.charAt(0).toUpperCase()+c.slice(1).replace(/[.;,]+$/,'');}).join('\n');}
function dispatch(el){try{el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}}
function toast(msg){var d=document.createElement('div');d.textContent=msg;d.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99999;background:#111827;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.28);font-size:13px';document.body.appendChild(d);setTimeout(function(){d.remove();},2200);}
function improve(el,type){var x=T[lang()],raw=el.value||'';if(!clean(raw)){toast(x.empty);el.focus();return;}el.value=type==='profile'?improveProfile(raw):improveExperience(raw);dispatch(el);toast(x.note);}
function buttonFor(el,type){if(!el||el.dataset.jobaiImprove==='1')return;el.dataset.jobaiImprove='1';var b=document.createElement('button');b.type='button';b.className='jobai-improve-btn';b.dataset.type=type;b.textContent=T[lang()].btn;b.addEventListener('click',function(){improve(el,type);});el.insertAdjacentElement('afterend',b);}
function build(){buttonFor(document.getElementById('profile'),'profile');document.querySelectorAll('#experienceContainer textarea').forEach(function(t){buttonFor(t,'experience');});if(!document.getElementById('jobaiImproveStyle')){var s=document.createElement('style');s.id='jobaiImproveStyle';s.textContent='.jobai-improve-btn{margin-top:7px;padding:8px 11px;border:1px solid rgba(96,165,250,.45);border-radius:9px;background:rgba(59,130,246,.12);color:#dbeafe;font-weight:700;cursor:pointer}.jobai-improve-btn:hover{background:rgba(59,130,246,.2)}';document.head.appendChild(s);}}
function translate(){document.querySelectorAll('.jobai-improve-btn').forEach(function(b){b.textContent=T[lang()].btn;});}
var old=window.setLanguage;window.setLanguage=function(l){if(typeof old==='function')old(l);setTimeout(translate,30);};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
new MutationObserver(function(){build();}).observe(document.documentElement,{childList:true,subtree:true});
})();
