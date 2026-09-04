/* JobAI — analysis result presentation only. Does not replace analyzeJob(). */
(function(){
'use strict';

var UI={
  ua:{match:'Орієнтовна відповідність',confirmed:'Підтверджені вимоги',missing:'Відсутні або непідтверджені вимоги',note:'Це орієнтовна оцінка відповідності вимогам вакансії, а не ймовірність отримати роботу.'},
  sk:{match:'Odhadovaná zhoda',confirmed:'Potvrdené požiadavky',missing:'Chýbajúce alebo nepotvrdené požiadavky',note:'Ide o orientačný odhad zhody s požiadavkami pracovnej ponuky, nie o pravdepodobnosť prijatia.'},
  en:{match:'Estimated match',confirmed:'Confirmed requirements',missing:'Missing or unconfirmed requirements',note:'This is an estimated fit with the vacancy requirements, not a probability of being hired.'}
};

function lang(){
  var l=(localStorage.getItem('jobaiLanguage')||document.documentElement.lang||'ua').toLowerCase();
  return l.indexOf('sk')===0?'sk':l.indexOf('en')===0?'en':'ua';
}

function ensureStyle(){
  if(document.getElementById('jobaiAnalysisResultUIStyle'))return;
  var s=document.createElement('style');
  s.id='jobaiAnalysisResultUIStyle';
  s.textContent='\n#analysisResult.jobai-result-ui{position:relative}\n#jobaiAnalysisResultNote{margin:0 0 16px;padding:11px 12px;border:1px solid rgba(127,127,127,.25);border-radius:10px;background:rgba(127,127,127,.06);font-size:13px;line-height:1.45;opacity:.9}\n#analysisResult.jobai-result-ui #score{font-size:34px;font-weight:900}\n#analysisResult.jobai-result-ui #found,#analysisResult.jobai-result-ui #missing{line-height:1.55}\n#analysisResult.jobai-result-ui #found ul,#analysisResult.jobai-result-ui #missing ul{padding-left:20px}\n@media(max-width:650px){#analysisResult.jobai-result-ui{padding:16px}#analysisResult.jobai-result-ui h2,#analysisResult.jobai-result-ui h3{line-height:1.25}#analysisResult.jobai-result-ui #score{font-size:30px}}\n';
  document.head.appendChild(s);
}

function decorate(){
  var result=document.getElementById('analysisResult');
  if(!result)return;
  ensureStyle();
  result.classList.add('jobai-result-ui');
  var t=UI[lang()];
  var match=document.getElementById('matchScoreTitle');
  var found=document.getElementById('foundSkillsTitle');
  var missing=document.getElementById('missingSkillsTitle');
  if(match)match.textContent=t.match;
  if(found)found.textContent=t.confirmed;
  if(missing)missing.textContent=t.missing;
  var note=document.getElementById('jobaiAnalysisResultNote');
  if(!note){
    note=document.createElement('p');
    note.id='jobaiAnalysisResultNote';
    var anchor=match||result.firstElementChild;
    if(anchor&&anchor.nextSibling)result.insertBefore(note,anchor.nextSibling);else result.appendChild(note);
  }
  note.textContent=t.note;
}

function afterAnalysis(){
  setTimeout(decorate,30);
  setTimeout(decorate,140);
}

document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('button');
  if(!b)return;
  if(b.id==='analyzeButton'){afterAnalysis();return;}
  var x=(b.textContent||'').trim().toUpperCase();
  if(x==='UA'||x==='SK'||x==='EN')setTimeout(decorate,100);
});

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',decorate);else decorate();
})();
