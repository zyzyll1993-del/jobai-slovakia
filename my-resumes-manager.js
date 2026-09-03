/* JobAI — My Resumes Manager */
(function () {
  'use strict';
  var KEY = 'jobaiMyResumesV3';
  var ACTIVE = 'jobaiActiveResumeV3';
  var LANGS = {
    uk: ['🇺🇦', 'Українська'], sk: ['🇸🇰', 'Slovenčina'], en: ['🇬🇧', 'English'],
    de: ['🇩🇪', 'Deutsch'], cs: ['🇨🇿', 'Čeština'], pl: ['🇵🇱', 'Polski'], hu: ['🇭🇺', 'Magyar']
  };
  var FIELD_IDS = ['name','position','phone','email','city','profile','skills','languages'];
  var SETTINGS = ['jobaiResumeTemplate','jobaiResumeColor','jobaiResumeFont','jobaiResumeFontSize','jobaiResumeNameSize','jobaiResumeFontWeight','jobaiResumeLineHeight'];
  function getLang(){var l=(localStorage.getItem('jobaiLanguage')||document.documentElement.lang||'uk').toLowerCase();return LANGS[l.slice(0,2)]?l.slice(0,2):'uk';}
  function list(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')||[];}catch(e){return [];}}
  function saveList(a){localStorage.setItem(KEY,JSON.stringify(a));}
  function activeId(){return localStorage.getItem(ACTIVE)||'';}
  function setActive(id){localStorage.setItem(ACTIVE,id);}
  function uid(){return 'resume_'+Date.now()+'_'+Math.random().toString(36).slice(2,7);}
  function data(){var d={};FIELD_IDS.forEach(function(id){var e=document.getElementById(id);d[id]=e?e.value:'';});d.experiences=Array.isArray(window.experiences)?JSON.parse(JSON.stringify(window.experiences)):[];d.educations=Array.isArray(window.educations)?JSON.parse(JSON.stringify(window.educations)):[];d.photo=localStorage.getItem('jobaiPhoto')||'';SETTINGS.forEach(function(k){d[k]=localStorage.getItem(k)||'';});return d;}
  function restore(d){if(!d)return;FIELD_IDS.forEach(function(id){var e=document.getElementById(id);if(e)e.value=d[id]||'';});window.experiences=Array.isArray(d.experiences)?JSON.parse(JSON.stringify(d.experiences)):[];window.educations=Array.isArray(d.educations)?JSON.parse(JSON.stringify(d.educations)):[];if(d.photo)localStorage.setItem('jobaiPhoto',d.photo);else localStorage.removeItem('jobaiPhoto');SETTINGS.forEach(function(k){if(d[k])localStorage.setItem(k,d[k]);else localStorage.removeItem(k);});try{if(typeof renderExperiences==='function')renderExperiences();if(typeof renderEducations==='function')renderEducations();if(typeof displayResumePhoto==='function')displayResumePhoto();if(typeof updateResumePreview==='function')updateResumePreview();if(typeof applyFontSettings==='function')applyFontSettings();}catch(e){}FIELD_IDS.forEach(function(id){var e=document.getElementById(id);if(e){try{e.dispatchEvent(new Event('input',{bubbles:true}));}catch(x){}}});}
  function migrate(){
    var current=list(); if(current.length)return current;
    var legacy=[];
    try{var old=JSON.parse(localStorage.getItem('jobaiMyResumes')||'[]');if(Array.isArray(old))legacy=legacy.concat(old);}catch(e){}
    try{var versions=JSON.parse(localStorage.getItem('jobaiResumeVersions')||'{}');if(versions&&typeof versions==='object'){Object.keys(versions).forEach(function(k){var v=versions[k];if(v&&typeof v==='object'){legacy.push({name:v.name||k,language:v.language||k,data:v.data||v,updatedAt:v.timestamp||new Date().toISOString(),primary:false});}});}}catch(e){}
    if(!legacy.length)return current;
    var out=legacy.map(function(x){return {id:x.id||uid(),name:x.name||'Моє резюме',language:LANGS[x.language]?x.language:getLang(),updatedAt:x.updatedAt||new Date().toISOString(),primary:!!x.primary,data:x.data||{}};});
    if(!out.some(function(x){return x.primary;}))out[0].primary=true;
    saveList(out);if(!activeId())setActive((out.find(function(x){return x.primary;})||out[0]).id);return out;
  }
  function ensure(){var a=migrate();if(a.length)return a;var x={id:uid(),name:'Моє резюме',language:getLang(),updatedAt:new Date().toISOString(),primary:true,data:data()};a=[x];saveList(a);setActive(x.id);return a;}
  function fmt(s){try{return new Date(s).toLocaleString();}catch(e){return '';}}
  var LABELS={
    uk:{title:'Мої резюме',new:'Створити нове',save:'Зберегти',open:'Відкрити',dup:'Дублювати',ren:'Перейменувати',primary:'Зробити основним',pdf:'PDF',del:'Видалити',changed:'Змінено: ',newName:'Назва нового резюме:',copy:'Назва копії:',rename:'Нова назва:'},
    sk:{title:'Moje životopisy',new:'Vytvoriť nové',save:'Uložiť',open:'Otvoriť',dup:'Duplikovať',ren:'Premenovať',primary:'Nastaviť ako hlavné',pdf:'PDF',del:'Zmazať',changed:'Zmenené: ',newName:'Názov nového životopisu:',copy:'Názov kópie:',rename:'Nový názov:'},
    en:{title:'My resumes',new:'Create new',save:'Save',open:'Open',dup:'Duplicate',ren:'Rename',primary:'Make primary',pdf:'PDF',del:'Delete',changed:'Updated: ',newName:'New resume name:',copy:'Copy name:',rename:'New name:'},
    de:{title:'Meine Lebensläufe',new:'Neu erstellen',save:'Speichern',open:'Öffnen',dup:'Duplizieren',ren:'Umbenennen',primary:'Als Hauptversion festlegen',pdf:'PDF',del:'Löschen',changed:'Geändert: ',newName:'Name des neuen Lebenslaufs:',copy:'Name der Kopie:',rename:'Neuer Name:'},
    cs:{title:'Moje životopisy',new:'Vytvořit nový',save:'Uložit',open:'Otevřít',dup:'Duplikovat',ren:'Přejmenovat',primary:'Nastavit jako hlavní',pdf:'PDF',del:'Smazat',changed:'Změněno: ',newName:'Název nového životopisu:',copy:'Název kopie:',rename:'Nový název:'},
    pl:{title:'Moje życiorysy',new:'Utwórz nowy',save:'Zapisz',open:'Otwórz',dup:'Duplikuj',ren:'Zmień nazwę',primary:'Ustaw jako główne',pdf:'PDF',del:'Usuń',changed:'Zmieniono: ',newName:'Nazwa nowego życiorysu:',copy:'Nazwa kopii:',rename:'Nowa nazwa:'},
    hu:{title:'Önéletrajzaim',new:'Új létrehozása',save:'Mentés',open:'Megnyitás',dup:'Duplikálás',ren:'Átnevezés',primary:'Legyen elsődleges',pdf:'PDF',del:'Törlés',changed:'Módosítva: ',newName:'Új önéletrajz neve:',copy:'Másolat neve:',rename:'Új név:'}
  };
  function txt(k){return (LABELS[getLang()]||LABELS.uk)[k];}
  function cardStyle(){return 'border:1px solid rgba(127,127,127,.25);border-radius:14px;padding:14px;margin:9px 0;background:rgba(127,127,127,.06)';}
  function button(label,attr){return '<button type="button" '+attr+' style="border:0;border-radius:9px;padding:8px 10px;margin:2px;cursor:pointer;font-weight:700">'+label+'</button>';}
  function render(){var box=document.getElementById('jobaiMyResumesV3');if(!box)return;var a=ensure(),active=activeId(),html='<div style="font-size:21px;font-weight:800;margin-bottom:12px">📁 '+txt('title')+'</div>';
    html+='<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px">'+button('＋ '+txt('new'),'id="jrNew"')+button('💾 '+txt('save'),'id="jrSave"')+'</div>';
    a.forEach(function(x){var l=LANGS[x.language]||['🌐',x.language||''];active=x.id===active;html+='<div data-jr-card="'+x.id+'" style="'+cardStyle()+'"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;flex-wrap:wrap"><div><div style="font-weight:800;font-size:16px">'+(active?'● ':'')+l[0]+' '+escapeHtml(x.name)+(x.primary?' ⭐':'')+'</div><div style="font-size:12px;opacity:.7;margin-top:3px">'+l[1]+' · '+txt('changed')+fmt(x.updatedAt)+'</div></div><div style="display:flex;flex-wrap:wrap;justify-content:flex-end">'+button(txt('open'),'data-open="'+x.id+'"')+button('📋 '+txt('dup'),'data-dup="'+x.id+'"')+button('✏️ '+txt('ren'),'data-ren="'+x.id+'"')+button('⭐ '+txt('primary'),'data-primary="'+x.id+'"')+button('📄 '+txt('pdf'),'data-pdf="'+x.id+'"')+button('🗑️ '+txt('del'),'data-del="'+x.id+'"')+'</div></div></div>';});
    box.innerHTML=html;bind();
  }
  function escapeHtml(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#039;');}
  function find(id){return list().find(function(x){return x.id===id;});}
  function bind(){var box=document.getElementById('jobaiMyResumesV3');if(!box)return;
    box.querySelector('#jrNew').onclick=function(){var n=prompt(txt('newName'),'Моє резюме');if(!n)return;var a=list(),x={id:uid(),name:n,language:getLang(),updatedAt:new Date().toISOString(),primary:false,data:{}};a.unshift(x);saveList(a);setActive(x.id);restore(x.data);render();};
    box.querySelector('#jrSave').onclick=function(){var a=list(),id=activeId(),x=find(id);if(!x){var n=prompt('Resume name:','Моє резюме');if(!n)return;x={id:uid(),name:n,language:getLang(),primary:!a.length};a.unshift(x);setActive(x.id);}x.data=data();x.language=x.language||getLang();x.updatedAt=new Date().toISOString();saveList(a);render();};
    box.querySelectorAll('[data-open]').forEach(function(b){b.onclick=function(){var x=find(b.dataset.open);if(x){restore(x.data);setActive(x.id);render();}}});
    box.querySelectorAll('[data-dup]').forEach(function(b){b.onclick=function(){var x=find(b.dataset.dup);if(!x)return;var n=prompt(txt('copy'),x.name+' — копія');if(!n)return;var y=JSON.parse(JSON.stringify(x));y.id=uid();y.name=n;y.primary=false;y.updatedAt=new Date().toISOString();var a=list();a.unshift(y);saveList(a);setActive(y.id);restore(y.data);render();}});
    box.querySelectorAll('[data-ren]').forEach(function(b){b.onclick=function(){var a=list(),x=find(b.dataset.ren);if(!x)return;var n=prompt(txt('rename'),x.name);if(n){x.name=n;x.updatedAt=new Date().toISOString();saveList(a);render();}}});
    box.querySelectorAll('[data-primary]').forEach(function(b){b.onclick=function(){var a=list();a.forEach(function(x){x.primary=x.id===b.dataset.primary;});saveList(a);setActive(b.dataset.primary);render();}});
    box.querySelectorAll('[data-del]').forEach(function(b){b.onclick=function(){var a=list(),x=find(b.dataset.del);if(!x)return;if(a.length<=1){alert('Потрібно залишити хоча б одне резюме.');return;}if(!confirm('Видалити це резюме?'))return;var was=x.id===activeId();a=a.filter(function(z){return z.id!==x.id;});if(was)setActive((a.find(function(z){return z.primary;})||a[0]).id);saveList(a);var y=find(activeId());if(y)restore(y.data);render();}});
    box.querySelectorAll('[data-pdf]').forEach(function(b){b.onclick=function(){var x=find(b.dataset.pdf);if(x){restore(x.data);setActive(x.id);setTimeout(function(){window.print();},200);}}});
  }
  var timer;function autosave(){clearTimeout(timer);timer=setTimeout(function(){var x=find(activeId());if(!x)return;x.data=data();x.updatedAt=new Date().toISOString();saveList(list());render();},1200);}
  function mount(){if(document.getElementById('jobaiMyResumesV3')){render();return;}var anchor=document.getElementById('jobaiResumeTranslator')||document.getElementById('resumePreview')||document.querySelector('.preview-wrapper')||document.querySelector('.card');if(!anchor||!anchor.parentNode)return;var box=document.createElement('section');box.id='jobaiMyResumesV3';box.style.cssText='margin:20px 0;padding:16px;border-radius:16px;border:1px solid rgba(127,127,127,.22)';anchor.parentNode.insertBefore(box,anchor);render();}
  document.addEventListener('input',function(e){if(e.target&&e.target.closest&&e.target.closest('#jobaiMyResumesV3'))return;autosave();});
  function init(){setTimeout(mount,1000);setTimeout(mount,2500);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
