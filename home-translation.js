/* JobAI Slovakia — Home CTA translations */
(function(){
  'use strict';
  var dict = {
    uk: {create:'Створити резюме', analyze:'Аналізувати вакансію'},
    sk: {create:'Vytvoriť životopis', analyze:'Analyzovať pracovnú ponuku'},
    en: {create:'Create resume', analyze:'Analyze vacancy'}
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
      if(text==='Створити резюме' || text==='Vytvoriť životopis' || text==='Create resume') {
        if(text !== t.create) el.textContent = t.create;
      }
      if(text==='Створити резюме' || text==='Vytvoriť životopis' || text==='Create resume') return;
      if(text==='Аналізувати вакансію' || text==='Аналізувати' || text==='Analyzovať pracovnú ponuku' || text==='Analyzovať' || text==='Analyze vacancy' || text==='Analyze') {
        if(text !== t.analyze) el.textContent = t.analyze;
      }
    });
  }

  apply();
  document.addEventListener('click', function(e){
    var el=e.target.closest && e.target.closest('.language-switcher button, [data-lang]');
    if(el) setTimeout(apply,100);
  });
  window.addEventListener('storage', apply);
  setInterval(apply, 500);
})();
