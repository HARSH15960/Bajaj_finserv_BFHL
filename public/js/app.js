const EXAMPLES = [
  ["a","1","334","4","R","$"],
  ["2","a","y","4","&","-","*","5","92","b"],
  ["A","ABcD","DOE"]
];

let lastData = null;

function fill(i) {
  document.getElementById('inputArea').value = JSON.stringify(EXAMPLES[i]);
}

fill(0);

async function run() {
  const errEl = document.getElementById('err');
  errEl.style.display = 'none';

  const raw = document.getElementById('inputArea').value.trim();
  let parsed;

  try { parsed = JSON.parse(raw); }
  catch(e) { errEl.textContent = '⚠ Invalid JSON format'; errEl.style.display = 'block'; return; }

  if (!Array.isArray(parsed)) {
    errEl.textContent = '⚠ Input must be a JSON array';
    errEl.style.display = 'block';
    return;
  }

  document.getElementById('runBtn').disabled = true;
  document.getElementById('results').style.display = 'none';

  try {
    const res = await fetch('/bfhl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: parsed })
    });

    const d = await res.json();
    lastData = d;

    const fmt = arr => arr && arr.length ? arr.join(', ') : '—';

    document.getElementById('r-even').textContent    = fmt(d.even_numbers);
    document.getElementById('r-odd').textContent     = fmt(d.odd_numbers);
    document.getElementById('r-alpha').textContent   = fmt(d.alphabets);
    document.getElementById('r-special').textContent = fmt(d.special_characters);
    document.getElementById('r-sum').textContent     = d.sum;
    document.getElementById('r-concat').textContent  = d.concat_string || '—';
    document.getElementById('jsonOut').textContent   = JSON.stringify(d, null, 2);

    document.getElementById('results').style.display = 'block';
  } catch(e) {
    errEl.textContent = '⚠ API error: ' + e.message;
    errEl.style.display = 'block';
  } finally {
    document.getElementById('runBtn').disabled = false;
  }
}

function copy() {
  if (!lastData) return;
  navigator.clipboard.writeText(JSON.stringify(lastData, null, 2));
}

document.getElementById('inputArea').addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.ctrlKey) run();
});