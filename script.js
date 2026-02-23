(function(){
  const q = document.getElementById('q');
  const btn = document.getElementById('findBtn');
  const status = document.getElementById('status');
  const pre = document.getElementById('transcript');
  if(!q || !btn || !pre) return;

  // keep a clean copy
  const original = pre.innerHTML;

  function escapeRegExp(s){
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function clearHighlights(){
    pre.innerHTML = original;
  }

  function highlight(term){
    clearHighlights();
    term = term.trim();
    if(!term){
      status.textContent = 'Введите запрос для поиска.';
      return;
    }

    // Highlight in text nodes (since transcript is mostly text + anchor tags around timestamps)
    // We'll do a simple innerHTML replace with a regex; not perfect but fast and adequate for this use case.
    const re = new RegExp(escapeRegExp(term), 'gi');
    let html = pre.innerHTML;
    let count = 0;
    html = html.replace(re, function(m){
      count++;
      return '<mark>' + m + '</mark>';
    });
    pre.innerHTML = html;

    status.textContent = count ? ('Найдено: ' + count) : 'Ничего не найдено.';
    if(count){
      const first = pre.querySelector('mark');
      if(first) first.scrollIntoView({behavior:'smooth', block:'center'});
    }
  }

  btn.addEventListener('click', () => highlight(q.value));
  q.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') highlight(q.value);
    if(e.key === 'Escape'){ q.value=''; clearHighlights(); status.textContent=''; }
  });

  // If URL has ?q=... run search
  const params = new URLSearchParams(location.search);
  const initial = params.get('q');
  if(initial){
    q.value = initial;
    setTimeout(()=>highlight(initial), 150);
  }
})();
