/* JobAI Slovakia — Home CTA translations */
(function(){
  'use strict';
  var dict = {
    uk: {create:'Створити резюме', analyze:'Аналізувати'},
    sk: {create:'Vytvoriť životopis', analyze:'Analyzovať'},
    en: {create:'Create resume', analyze:'Analyze'}
  };
  function getLang(){
    var l = (localStorage.getItem('jobaiLanguage') || document.documentElement.lang || 'uk').toLowerCase();
    if(l.indexOf('sk')===0) return 'sk';
    if(l.indexOf('en')===0) return 'en';
    return 'uk';
  }
  function apply(){
    var t = dict[getLang()];
    document.querySelectorAll('.hero-buttons button, .hero-buttons a, button, a').forEach(function(el){
      var text = (el.textContent || '').trim();
      if(text==='Створити резюме' || text==='Vytvoriť životopis' || text==='Create resume') el.textContent=t.create;
      if(text==='Аналізувати' || text==='Analyzovať' || text==='Analyze') el.textContent=t.analyze;
    });
  }
  apply();
  document.addEventListener('click', function(e){
    var el=e.target.closest && e.target.closest('.language-switcher button, [data-lang]');
    if(el) setTimeout(apply,50);
  });
  window.addEventListener('storage', apply);
  new MutationObserver(function(){ apply(); }).observe(document.body,{childList:true,subtree:true});
})();
