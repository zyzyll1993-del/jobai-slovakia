/* JobAI SaaS billing fix — isolated from main JobAI. */
(function(){
'use strict';
var SUPABASE_URL='https://roxzulbpbufxgudvenbm.supabase.co';
var SUPABASE_KEY='sb_publishable_6iEGB0gTb-BTYBnw2iH14g_AfIncEZo';
if(!window.supabase||!window.supabase.createClient)return;
var billingClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

function status(message,isError){
  var el=document.getElementById('billingStatus');
  if(!el)return;
  el.textContent=message||'';
  el.style.color=isError?'#fca5a5':'#cbd5e1';
}
function setBusy(on){
  ['proMonthlyBtn','proYearlyBtn','portalBtn'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.disabled=!!on;
  });
}
async function safePayload(error){
  try{
    if(error&&error.context&&typeof error.context.clone==='function'){
      return await error.context.clone().json();
    }
  }catch(_e){}
  return {};
}
function clean(v,max){
  var s=String(v||'').replace(/[\r\n\t]+/g,' ').replace(/\s{2,}/g,' ').trim();
  return s.slice(0,max||180);
}
function stripeDetails(payload){
  var details=[];
  if(payload.stripe_status)details.push('HTTP '+payload.stripe_status);
  if(payload.stripe_type)details.push(clean(payload.stripe_type,60));
  if(payload.stripe_code)details.push(clean(payload.stripe_code,80));
  if(payload.stripe_param)details.push('param: '+clean(payload.stripe_param,80));
  if(payload.stripe_message)details.push(clean(payload.stripe_message,180));
  return details;
}
function explain(payload){
  var code=payload&&payload.error?String(payload.error):'unknown_error';
  if(code==='sandbox_billing_not_configured')return 'Stripe test secret nie je správne nastavený v Supabase (STRIPE_SECRET_KEY musí byť sk_test_…).';
  if(code==='unauthorized')return 'Relácia používateľa nebola prijatá backendom. Odhláste sa a prihláste znova.';
  if(code==='supabase_auth_not_configured')return 'Supabase backend auth nie je správne nakonfigurovaný.';
  if(code==='invalid_plan')return 'Neplatný tarif.';
  if(code==='stripe_price_invalid')return 'Stripe tarif je neaktívny alebo nemá správny recurring EUR typ.';
  if(code==='stripe_price_unavailable'){
    var p=stripeDetails(payload);
    return 'Stripe backend nevidí zvolený Price ID'+(p.length?' ('+p.join(', ')+')':'')+'.';
  }
  if(code==='stripe_checkout_failed'){
    var details=stripeDetails(payload);
    return 'Stripe Checkout zlyhal'+(details.length?' ('+details.join(', ')+')':'')+'.';
  }
  return 'Checkout chyba: '+code+'.';
}
async function checkout(plan){
  setBusy(true);
  status('Otváram bezpečný Stripe Checkout…',false);
  try{
    var sessionResult=await billingClient.auth.getSession();
    var session=sessionResult&&sessionResult.data?sessionResult.data.session:null;
    if(!session){status('Najprv sa prihláste.',true);return;}
    var result=await billingClient.functions.invoke('jobai-create-checkout',{body:{plan:plan}});
    if(result.error){
      var payload=await safePayload(result.error);
      status(explain(payload),true);
      return;
    }
    if(result.data&&result.data.url){
      location.assign(result.data.url);
      return;
    }
    status('Checkout chyba: missing_url.',true);
  }catch(e){
    status('Checkout chyba: client_exception.',true);
  }finally{
    setBusy(false);
  }
}
function bind(id,plan){
  var el=document.getElementById(id);
  if(!el)return;
  el.addEventListener('click',function(ev){
    ev.preventDefault();
    ev.stopImmediatePropagation();
    checkout(plan);
  },true);
}
bind('proMonthlyBtn','monthly');
bind('proYearlyBtn','yearly');
})();
