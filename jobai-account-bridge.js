/* JobAI Slovakia — production account bridge. Public Supabase key only. */
(function(){
'use strict';

var SUPABASE_URL='https://roxzulbpbufxgudvenbm.supabase.co';
var SUPABASE_KEY='sb_publishable_6iEGB0gTb-BTYBnw2iH14g_AfIncEZo';
var ACCOUNT_URL=new URL('saas/account.html',location.href).href;
var state={resolved:false,signedIn:false,isPro:false,plan:'free',status:'inactive',email:'',session:null,client:null};
var observed={};

function lang(){
  var l=(localStorage.getItem('jobaiLanguage')||document.documentElement.lang||'ua').toLowerCase();
  if(l.indexOf('sk')===0)return 'sk';
  if(l.indexOf('en')===0)return 'en';
  return 'uk';
}

var T={
  uk:{account:'Акаунт',free:'Free',pro:'Pro',locked:'Кілька резюме та версії доступні в JobAI Pro.',open:'Відкрити Pro',checking:'Перевіряю підписку…'},
  sk:{account:'Účet',free:'Free',pro:'Pro',locked:'Viac životopisov a verzie sú dostupné v JobAI Pro.',open:'Otvoriť Pro',checking:'Kontrolujem predplatné…'},
  en:{account:'Account',free:'Free',pro:'Pro',locked:'Multiple resumes and versions are available with JobAI Pro.',open:'Open Pro',checking:'Checking subscription…'}
};
function tr(){return T[lang()]||T.uk;}

function ensureStyle(){
  if(document.getElementById('jobaiAccountBridgeStyle'))return;
  var s=document.createElement('style');
  s.id='jobaiAccountBridgeStyle';
  s.textContent='\n#jobaiAccountButton{height:38px;padding:0 14px;border-radius:8px;border:1px solid #475569;background:#1e293b;color:#fff;font-weight:800;white-space:nowrap}\n#jobaiAccountButton:hover{background:#334155}\n#jobaiAccountButton.jobai-pro{border-color:#22c55e;background:#14532d}\n.jobai-pro-lock{margin:10px 0 14px;padding:12px 14px;border:1px solid #475569;border-radius:12px;background:#111827;color:#cbd5e1;line-height:1.45}\n.jobai-pro-lock button{margin-top:9px;border:0;border-radius:8px;padding:9px 12px;background:#2563eb;color:#fff;font-weight:800;cursor:pointer}\n[data-jobai-pro-locked="1"] button:not(.jobai-pro-open){opacity:.45;cursor:not-allowed}\n';
  document.head.appendChild(s);
}

function ensureButton(){
  ensureStyle();
  var actions=document.querySelector('.header-actions');
  if(!actions)return null;
  var b=document.getElementById('jobaiAccountButton');
  if(!b){
    b=document.createElement('button');
    b.type='button';
    b.id='jobaiAccountButton';
    b.onclick=function(){location.href=ACCOUNT_URL;};
    var language=actions.querySelector('.language-switcher');
    if(language)actions.insertBefore(b,language);else actions.appendChild(b);
  }
  return b;
}

function updateButton(){
  var b=ensureButton();if(!b)return;
  b.classList.toggle('jobai-pro',!!state.isPro);
  if(!state.resolved)b.textContent='👤 '+tr().account;
  else if(state.isPro)b.textContent='★ '+tr().pro;
  else if(state.signedIn)b.textContent='👤 '+tr().free;
  else b.textContent='👤 '+tr().account;
  b.title=state.email||tr().account;
}

function lockHost(host){
  if(!host)return;
  var note=host.querySelector(':scope > .jobai-pro-lock');
  if(state.isPro){
    host.removeAttribute('data-jobai-pro-locked');
    if(note)note.remove();
    host.querySelectorAll('button').forEach(function(b){if(b.dataset.jobaiBridgeDisabled==='1'){b.disabled=false;delete b.dataset.jobaiBridgeDisabled;}});
    return;
  }
  host.setAttribute('data-jobai-pro-locked','1');
  if(!note){
    note=document.createElement('div');
    note.className='jobai-pro-lock';
    note.innerHTML='<div class="jobai-pro-lock-text"></div><button type="button" class="jobai-pro-open"></button>';
    note.querySelector('.jobai-pro-open').onclick=function(e){e.preventDefault();e.stopPropagation();location.href=ACCOUNT_URL;};
    host.insertBefore(note,host.firstChild);
  }
  var text=note.querySelector('.jobai-pro-lock-text');
  var open=note.querySelector('.jobai-pro-open');
  if(text)text.textContent=state.resolved?tr().locked:tr().checking;
  if(open)open.textContent=tr().open;
  host.querySelectorAll('button:not(.jobai-pro-open)').forEach(function(b){if(!b.disabled){b.disabled=true;b.dataset.jobaiBridgeDisabled='1';}});
}

function applyGates(){
  ['jobaiMyResumesV3','jobaiResumeVersions'].forEach(function(id){
    var host=document.getElementById(id);
    if(!host)return;
    lockHost(host);
    if(!observed[id]&&window.MutationObserver){
      observed[id]=true;
      new MutationObserver(function(){lockHost(host);}).observe(host,{childList:true,subtree:true});
    }
  });
}

function publish(){
  window.JobAIAccountState=state;
  updateButton();
  applyGates();
  try{window.dispatchEvent(new CustomEvent('jobai:account-state',{detail:{resolved:state.resolved,signedIn:state.signedIn,isPro:state.isPro,plan:state.plan,status:state.status,email:state.email}}));}catch(_e){}
}

function loadSDK(){
  return new Promise(function(resolve,reject){
    if(window.supabase&&window.supabase.createClient){resolve();return;}
    var existing=document.querySelector('script[data-jobai-supabase-sdk]');
    if(existing){existing.addEventListener('load',resolve,{once:true});existing.addEventListener('error',reject,{once:true});return;}
    var s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    s.async=true;
    s.dataset.jobaiSupabaseSdk='1';
    s.onload=resolve;s.onerror=reject;
    document.head.appendChild(s);
  });
}

async function refresh(){
  try{
    await loadSDK();
    if(!state.client)state.client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    var sr=await state.client.auth.getSession();
    var session=sr&&sr.data?sr.data.session:null;
    state.session=session||null;
    state.signedIn=!!(session&&session.user);
    state.email=state.signedIn?(session.user.email||''):'';
    state.isPro=false;state.plan='free';state.status='inactive';
    if(state.signedIn){
      var r=await state.client.from('subscriptions').select('plan,status').eq('user_id',session.user.id).maybeSingle();
      if(!r.error&&r.data){
        state.plan=String(r.data.plan||'free');
        state.status=String(r.data.status||'inactive');
        var active=state.status==='active'||state.status==='trialing';
        state.isPro=active&&(state.plan==='pro_monthly'||state.plan==='pro_yearly');
      }
    }
  }catch(_e){
    state.signedIn=false;state.isPro=false;state.plan='free';state.status='inactive';state.session=null;
  }
  state.resolved=true;
  publish();
  return state;
}

window.JobAIAccount={
  refresh:refresh,
  getState:function(){return state;},
  isPro:function(){return !!state.isPro;},
  openAccount:function(){location.href=ACCOUNT_URL;}
};

ensureButton();
publish();

var gateTimer=setInterval(applyGates,500);
setTimeout(function(){clearInterval(gateTimer);},10000);

document.addEventListener('click',function(e){
  var langBtn=e.target.closest&&e.target.closest('.language-switcher button,[data-lang]');
  if(langBtn)setTimeout(function(){updateButton();applyGates();},100);
},true);

refresh().then(function(){
  if(state.client){
    state.client.auth.onAuthStateChange(function(){setTimeout(refresh,0);});
  }
});
})();
