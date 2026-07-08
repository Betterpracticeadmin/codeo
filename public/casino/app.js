/* ============================================================
   CASINO DÉMO — moteur de jeu
   Données : window.CASINO_DATA (historique réel game.db)
   Argent 100% fictif — aucune transaction réelle.
   ============================================================ */
(function () {
  'use strict';

  const DATA = window.CASINO_DATA || {};
  const START_BALANCE = 10000;
  const BOARD_SEED = 54;               // tours d'historique affichés au départ
  const CHIPS = [10, 50, 100, 500, 1000];

  // ---- Définition des jeux -------------------------------------------------
  const GAMES = {
    lucky7a: {
      id: 'lucky7a', key: 'lucky7a', type: 'lucky7',
      name: 'Lucky 7 · Table A', short: 'L7A', art: 'art-l7a', motif: '7',
      tag: 'Une carte · Haut ou Bas',
      desc: "Une seule carte est tirée. Pariez si elle sera basse (A–6), haute (8–roi) ou pile le 7.",
      slots: [{ id: 'card', lbl: 'Carte' }],
      bets: [
        { id: 'L', name: 'Bas', sub: 'A · 2 · 3 · 4 · 5 · 6', pay: 2.0, color: 'blue' },
        { id: '7', name: 'Lucky 7', sub: 'exactement 7', pay: 12.0, color: 'gold' },
        { id: 'H', name: 'Haut', sub: '8 · 9 · 10 · V · D · R', pay: 2.0, color: 'red' }
      ]
    },
    lucky7b: {
      id: 'lucky7b', key: 'lucky7b', type: 'lucky7',
      name: 'Lucky 7 · Table B', short: 'L7B', art: 'art-l7b', motif: '7',
      tag: 'Une carte · Haut ou Bas',
      desc: "La variante B, même règle : basse (A–6), haute (8–roi) ou le 7 payé 12×.",
      slots: [{ id: 'card', lbl: 'Carte' }],
      bets: [
        { id: 'L', name: 'Bas', sub: 'A · 2 · 3 · 4 · 5 · 6', pay: 2.0, color: 'blue' },
        { id: '7', name: 'Lucky 7', sub: 'exactement 7', pay: 12.0, color: 'gold' },
        { id: 'H', name: 'Haut', sub: '8 · 9 · 10 · V · D · R', pay: 2.0, color: 'red' }
      ]
    },
    dragon_tiger: {
      id: 'dragon_tiger', key: 'dragon_tiger', type: 'dragon_tiger',
      name: 'Dragon Tiger', short: 'D-T', art: 'art-dt', motif: '♠',
      tag: 'Deux cartes · la plus forte gagne',
      desc: "Une carte pour le Dragon, une pour le Tigre. La plus haute l'emporte. Égalité = Tie.",
      slots: [{ id: 'D', lbl: 'Dragon' }, { id: 'T', lbl: 'Tigre' }],
      bets: [
        { id: 'D', name: 'Dragon', sub: 'carte la plus haute', pay: 2.0, color: 'red' },
        { id: 'E', name: 'Tie', sub: 'égalité · –moitié sur D/T', pay: 9.0, color: 'green' },
        { id: 'T', name: 'Tigre', sub: 'carte la plus haute', pay: 2.0, color: 'blue' }
      ]
    },
    bollywood: {
      id: 'bollywood', key: 'bollywood', type: 'bollywood',
      name: 'Bollywood Casino', short: 'BW', art: 'art-bw', motif: '★',
      tag: 'Aucune donnée dans le dataset',
      desc: "Table présente dans la base mais sans historique (0 tour). Verrouillée en démo.",
      locked: true,
      slots: [], bets: []
    }
  };

  // Correspondance résultat -> libellé / couleur bille
  const OUTCOME_META = {
    L: { label: 'Bas', color: 'blue', bead: 'B' },
    H: { label: 'Haut', color: 'red', bead: 'H' },
    '7': { label: 'Lucky 7', color: 'gold', bead: '7' },
    D: { label: 'Dragon', color: 'red', bead: 'D' },
    T: { label: 'Tigre', color: 'blue', bead: 'T' },
    E: { label: 'Tie', color: 'green', bead: '=' }
  };

  const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'V', 'D', 'R'];
  const SUITS = [
    { s: '♠', c: 'black' }, { s: '♥', c: 'red' },
    { s: '♦', c: 'red' }, { s: '♣', c: 'black' }
  ];

  // ---- État ----------------------------------------------------------------
  let balance = loadBalance();
  let cur = null;          // jeu courant (objet GAMES)
  let mode = 'history';    // 'history' | 'random'
  let cursor = BOARD_SEED; // position de lecture dans le dataset
  let board = [];          // suite de résultats affichés (roadmap)
  let bets = {};           // { betId: montant }
  let lastBets = {};       // pour "Rejouer"
  let selectedChip = 100;
  let busy = false;        // pendant l'animation de distribution

  // ---- Utilitaires ---------------------------------------------------------
  const $ = (sel, root) => (root || document).querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const fmt = (n) => Math.round(n).toLocaleString('fr-FR');
  const rint = (n) => Math.floor(Math.random() * n);
  const rank = (v) => RANKS[v - 1];
  const suit = () => SUITS[rint(4)];

  function loadBalance() {
    const v = parseFloat(localStorage.getItem('casino_demo_balance'));
    return Number.isFinite(v) && v >= 0 ? v : START_BALANCE;
  }
  function saveBalance() {
    localStorage.setItem('casino_demo_balance', String(balance));
  }

  // Compte animé du solde
  let balAnim = null;
  function renderBalance(target) {
    const node = $('#balanceNum');
    if (!node) return;
    if (target == null) { node.textContent = fmt(balance); return; }
    cancelAnimationFrame(balAnim);
    const from = parseFloat(node.textContent.replace(/\s| /g, '')) || 0;
    const start = performance.now(), dur = 550;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      node.textContent = fmt(from + (target - from) * e);
      if (p < 1) balAnim = requestAnimationFrame(step);
    };
    balAnim = requestAnimationFrame(step);
  }

  function toast(msg, kind) {
    const wrap = $('#toastWrap');
    const t = el('div', 'toast ' + (kind || 'info'), msg);
    wrap.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity .3s, transform .3s';
      t.style.opacity = '0'; t.style.transform = 'translateY(-10px)';
      setTimeout(() => t.remove(), 300);
    }, 2100);
  }

  // ---- Distribution des cartes selon un résultat ---------------------------
  // Lucky 7 : une carte cohérente avec L / 7 / H
  function dealLucky7(outcome) {
    let v;
    if (outcome === 'L') v = rint(6) + 1;        // A..6
    else if (outcome === '7') v = 7;             // 7
    else v = rint(6) + 8;                         // 8..R (8..13)
    return [{ rank: rank(v), suit: suit(), v }];
  }
  // Dragon Tiger : deux cartes cohérentes avec D / T / E
  function dealDT(outcome) {
    let dv, tv;
    if (outcome === 'D') { dv = rint(12) + 2; tv = rint(dv - 1) + 1; }
    else if (outcome === 'T') { tv = rint(12) + 2; dv = rint(tv - 1) + 1; }
    else { dv = tv = rint(13) + 1; }
    return [{ rank: rank(dv), suit: suit(), v: dv }, { rank: rank(tv), suit: suit(), v: tv }];
  }
  // Tirage réellement aléatoire -> résultat déduit des cartes
  function drawRandom(game) {
    if (game.type === 'lucky7') {
      const v = rint(13) + 1;
      const outcome = v < 7 ? 'L' : v > 7 ? 'H' : '7';
      return { outcome, cards: [{ rank: rank(v), suit: suit(), v }] };
    }
    const dv = rint(13) + 1, tv = rint(13) + 1;
    const outcome = dv > tv ? 'D' : dv < tv ? 'T' : 'E';
    return { outcome, cards: [{ rank: rank(dv), suit: suit(), v: dv }, { rank: rank(tv), suit: suit(), v: tv }] };
  }

  function nextRound(game) {
    if (mode === 'random') return drawRandom(game);
    // Historique : lit le dataset dans l'ordre, boucle à la fin
    const rows = DATA[game.key] || [];
    if (!rows.length) return drawRandom(game);
    if (cursor >= rows.length) cursor = 0;
    const outcome = rows[cursor].r;
    cursor++;
    const cards = game.type === 'lucky7' ? dealLucky7(outcome) : dealDT(outcome);
    return { outcome, cards };
  }

  // ---- LOBBY ---------------------------------------------------------------
  function renderLobby() {
    const grid = $('#gamesGrid');
    grid.innerHTML = '';
    ['lucky7a', 'lucky7b', 'dragon_tiger', 'bollywood'].forEach((k) => {
      const g = GAMES[k];
      const rows = DATA[k] || [];
      const card = el('div', 'game-card' + (g.locked ? ' locked' : ''));
      const stats = g.locked
        ? ''
        : `<div class="gc-meta">
             <span><b>${fmt(rows.length)}</b> tours réels</span>
             <span>Historique <b>2023</b></span>
           </div>`;
      card.innerHTML = `
        <div class="art ${g.art}"><div class="suit-motif">${g.motif}</div></div>
        ${g.locked ? '<div class="lock-pill">Verrouillé</div>' : ''}
        <div class="gc-body">
          <div class="gc-tag">${g.tag}</div>
          <div class="gc-title">${g.name}</div>
          <div class="gc-desc">${g.desc}</div>
          ${stats}
          ${g.locked ? '' : '<div class="gc-play">Entrer au salon →</div>'}
        </div>`;
      if (!g.locked) card.onclick = () => openGame(k);
      else card.onclick = () => toast('Table Bollywood : aucun historique dans le dataset (0 tour).', 'info');
      grid.appendChild(card);
    });
    renderBalance();
  }

  // ---- OUVERTURE D'UN JEU --------------------------------------------------
  function openGame(key) {
    cur = GAMES[key];
    mode = 'history';
    bets = {}; lastBets = {};
    cursor = Math.min(BOARD_SEED, (DATA[key] || []).length);
    // Roadmap initialisée avec le vrai début d'historique
    const rows = DATA[key] || [];
    board = rows.slice(0, cursor).map(r => r.r);

    buildGameView();
    $('#lobbyView').classList.add('hidden');
    $('#gameView').classList.remove('hidden');
    window.scrollTo(0, 0);
  }

  function buildGameView() {
    const g = cur;
    const view = $('#gameView');
    const zoneCols = g.bets.length === 3 ? 'cols-3' : '';

    const slotsHTML = g.slots.map(s => `
      <div class="card-slot">
        <div class="slot-lbl">${s.lbl}</div>
        <div class="card-empty" data-slot="${s.id}">?</div>
      </div>`).join('');

    const zonesHTML = g.bets.map(b => `
      <div class="bet-zone" data-bet="${b.id}" data-color="${b.color}">
        <div class="bz-name">${b.name}</div>
        <div class="bz-sub">${b.sub}</div>
        <div class="bz-pay">gain ${b.pay % 1 === 0 ? b.pay : b.pay.toFixed(1)}×</div>
        <div class="bz-stake" data-stake="${b.id}"></div>
      </div>`).join('');

    const chipsHTML = CHIPS.map(c => `
      <div class="chip c${c} ${c === selectedChip ? 'selected' : ''}" data-chip="${c}">
        <span>${c >= 1000 ? (c / 1000) + 'K' : c}</span>
      </div>`).join('');

    view.innerHTML = `
      <div class="game-head">
        <button class="btn ghost back" onclick="Casino.goLobby()">← Salon</button>
        <div>
          <div class="game-title">${g.name}</div>
          <div class="game-tagline">${g.tag}</div>
        </div>
        <div class="mode-toggle">
          <button data-mode="history" class="active">Historique réel</button>
          <button data-mode="random">Aléatoire</button>
        </div>
      </div>

      <div class="game-grid">
        <section class="table">
          <div class="felt-mono">Maison Doré</div>
          <div class="deal-area">${slotsHTML}</div>
          <div class="result-banner" id="resultBanner"></div>
          <div class="bet-zones ${zoneCols}" id="betZones">${zonesHTML}</div>

          <div class="tray">
            <div class="chips" id="chips">${chipsHTML}</div>
            <div class="actions">
              <button class="btn" id="btnUndo">Annuler</button>
              <button class="btn" id="btnClear">Effacer</button>
              <button class="btn" id="btnRebet">Rejouer</button>
              <button class="btn gold" id="btnDeal">Distribuer</button>
            </div>
          </div>
          <div class="status-line" id="statusLine">Choisissez un jeton, puis cliquez une zone de mise.</div>
        </section>

        <aside class="side">
          <div class="panel">
            <h3>Roadmap <span class="hint">${mode === 'history' ? 'dataset' : 'session'}</span></h3>
            <div class="roadmap" id="roadmap"></div>
            <div class="legend" id="legend"></div>
          </div>
          <div class="panel">
            <h3>Statistiques <span class="hint">${fmt((DATA[g.key] || []).length)} tours</span></h3>
            <div id="statsBody"></div>
            <div class="streak-line" id="streakLine"></div>
          </div>
        </aside>
      </div>

      <p class="footnote">
        <b>Mode démo.</b> En «&nbsp;Historique réel&nbsp;», chaque distribution rejoue le résultat
        du tour suivant enregistré dans <b>game.db</b>. Les cartes sont reconstituées pour illustrer
        ce résultat. En «&nbsp;Aléatoire&nbsp;», les cartes sont tirées au hasard.
      </p>
    `;

    // Écouteurs
    $('#chips').addEventListener('click', (e) => {
      const c = e.target.closest('.chip'); if (!c) return;
      selectedChip = parseInt(c.dataset.chip, 10);
      [...$('#chips').children].forEach(ch => ch.classList.toggle('selected', ch === c));
    });
    $('#betZones').addEventListener('click', (e) => {
      const z = e.target.closest('.bet-zone'); if (!z || busy) return;
      placeBet(z.dataset.bet);
    });
    view.querySelectorAll('.mode-toggle button').forEach(b => {
      b.onclick = () => setMode(b.dataset.mode);
    });
    $('#btnUndo').onclick = undoBet;
    $('#btnClear').onclick = clearBets;
    $('#btnRebet').onclick = rebet;
    $('#btnDeal').onclick = deal;

    renderStakes();
    renderRoadmap();
    renderLegend();
    renderStats();
    renderBalance();
    updateStatus();
  }

  let betOrder = []; // pour "Annuler"

  function placeBet(betId) {
    if (balance < selectedChip) { toast('Solde insuffisant pour ce jeton.', 'lose'); return; }
    bets[betId] = (bets[betId] || 0) + selectedChip;
    balance -= selectedChip;
    betOrder.push({ betId, amt: selectedChip });
    saveBalance();
    renderBalance(balance);
    renderStakes();
    updateStatus();
  }

  function undoBet() {
    const last = betOrder.pop();
    if (!last) return;
    bets[last.betId] -= last.amt;
    if (bets[last.betId] <= 0) delete bets[last.betId];
    balance += last.amt;
    saveBalance();
    renderBalance(balance);
    renderStakes();
    updateStatus();
  }

  function clearBets() {
    const total = totalStake();
    if (!total) return;
    balance += total;
    bets = {}; betOrder = [];
    saveBalance();
    renderBalance(balance);
    renderStakes();
    updateStatus();
  }

  function rebet() {
    if (!Object.keys(lastBets).length) { toast('Aucune mise précédente.', 'info'); return; }
    const need = Object.values(lastBets).reduce((a, b) => a + b, 0);
    if (balance < need) { toast('Solde insuffisant pour rejouer.', 'lose'); return; }
    clearBets();
    for (const [id, amt] of Object.entries(lastBets)) {
      bets[id] = amt; balance -= amt; betOrder.push({ betId: id, amt });
    }
    saveBalance();
    renderBalance(balance);
    renderStakes();
    updateStatus();
  }

  const totalStake = () => Object.values(bets).reduce((a, b) => a + b, 0);

  function chipClassFor(amt) {
    // choisit un jeton visuel représentatif du montant misé
    let best = CHIPS[0];
    for (const c of CHIPS) if (amt >= c) best = c;
    return 'c' + best;
  }

  function renderStakes() {
    cur.bets.forEach(b => {
      const node = document.querySelector(`[data-stake="${b.id}"]`);
      if (!node) return;
      const amt = bets[b.id] || 0;
      node.innerHTML = amt > 0
        ? `<span class="bz-chip ${chipClassFor(amt)}"></span><span class="bz-amount">${fmt(amt)}</span>`
        : '';
    });
  }

  function updateStatus() {
    const total = totalStake();
    const line = $('#statusLine'); if (!line) return;
    if (busy) return;
    line.innerHTML = total > 0
      ? `Mise totale : <b>${fmt(total)}</b> jetons — cliquez «&nbsp;Distribuer&nbsp;».`
      : 'Choisissez un jeton, puis cliquez une zone de mise.';
    $('#btnDeal').disabled = total <= 0;
  }

  function setMode(m) {
    if (busy || m === mode) return;
    mode = m;
    document.querySelectorAll('.mode-toggle button')
      .forEach(b => b.classList.toggle('active', b.dataset.mode === m));
    $('.panel .hint').textContent = m === 'history' ? 'dataset' : 'session';
    if (m === 'history') {
      // recale la roadmap sur le vrai historique
      cursor = Math.min(BOARD_SEED, (DATA[cur.key] || []).length);
      board = (DATA[cur.key] || []).slice(0, cursor).map(r => r.r);
    } else {
      board = board.slice(-BOARD_SEED);
    }
    renderRoadmap();
    renderStats();
    toast(m === 'history' ? 'Mode Historique : on rejoue le dataset.' : 'Mode Aléatoire : tirage au hasard.', 'info');
  }

  // ---- DISTRIBUTION --------------------------------------------------------
  function deal() {
    const total = totalStake();
    if (total <= 0 || busy) return;
    busy = true;
    lastBets = { ...bets };
    $('#btnDeal').disabled = true;
    $('#statusLine').innerHTML = 'Distribution…';
    $('#resultBanner').className = 'result-banner';
    $('#resultBanner').textContent = '';

    const round = nextRound(cur);
    renderCards(round.cards, () => settleRound(round));
  }

  function renderCards(cards, done) {
    const area = $('.deal-area');
    area.innerHTML = '';
    cur.slots.forEach((s, i) => {
      const c = cards[i];
      const slot = el('div', 'card-slot');
      slot.appendChild(el('div', 'slot-lbl', s.lbl));
      const pc = el('div', 'pcard');
      pc.innerHTML = `
        <div class="pcard-inner">
          <div class="pcard-face pcard-back"></div>
          <div class="pcard-face pcard-front ${c.suit.c}">
            <div class="corner tl">${c.rank}<span>${c.suit.s}</span></div>
            <div class="pip">${c.suit.s}</div>
            <div class="corner br">${c.rank}<span>${c.suit.s}</span></div>
          </div>
        </div>`;
      slot.appendChild(pc);
      area.appendChild(slot);
      setTimeout(() => pc.classList.add('flipped'), 180 + i * 420);
    });
    const totalDelay = 180 + (cur.slots.length - 1) * 420 + 650;
    setTimeout(done, totalDelay);
  }

  function settleRound(round) {
    const { outcome } = round;
    let payout = 0, won = false;
    for (const [id, amt] of Object.entries(bets)) {
      if (amt <= 0) continue;
      if (cur.type === 'dragon_tiger' && outcome === 'E' && (id === 'D' || id === 'T')) {
        payout += amt * 0.5;              // règle du Tie : moitié rendue
        continue;
      }
      if (id === outcome) {
        const pay = cur.bets.find(b => b.id === id).pay;
        payout += amt * pay;
        won = true;
        const z = document.querySelector(`[data-bet="${id}"]`);
        if (z) { z.classList.remove('win-flash'); void z.offsetWidth; z.classList.add('win-flash'); }
      }
    }

    balance += payout;
    saveBalance();
    renderBalance(balance);

    const meta = OUTCOME_META[outcome];
    const banner = $('#resultBanner');
    const net = payout - totalStake();
    banner.className = 'result-banner ' + (net > 0 ? 'win' : net < 0 ? 'lose' : '');
    banner.textContent = 'Résultat : ' + meta.label;

    if (net > 0) toast('Gagné +' + fmt(net) + ' jetons', 'win');
    else if (net < 0) toast('Perdu ' + fmt(net) + ' jetons', 'lose');
    else toast('Mise rendue', 'info');

    // Roadmap + stats
    board.push(outcome);
    if (board.length > 240) board = board.slice(-240);
    renderRoadmap();
    renderStats();

    // Réinitialise la table pour le prochain tour
    bets = {}; betOrder = [];
    renderStakes();
    busy = false;
    $('#statusLine').innerHTML =
      `<b>${meta.label}</b>. ${net >= 0 ? 'Rejouez ou placez de nouvelles mises.' : 'Tentez votre chance à nouveau.'}`;
    if (balance <= 0) offerRecharge();
  }

  function offerRecharge() {
    setTimeout(() => {
      toast('Solde épuisé — bouton «Recharger» pour recréditer.', 'info');
    }, 400);
  }

  // ---- ROADMAP (bead plate) ------------------------------------------------
  function renderRoadmap() {
    const rm = $('#roadmap'); if (!rm) return;
    rm.innerHTML = '';
    const show = board.slice(-54);
    // remplit d'abord les cases vides pour garder 6 lignes complètes
    const cols = Math.max(9, Math.ceil(show.length / 6));
    const cells = cols * 6;
    const pad = cells - show.length;
    const seq = new Array(pad).fill(null).concat(show);
    // ordre colonne par colonne (haut->bas)
    seq.forEach(o => {
      if (o == null) { rm.appendChild(el('div', 'bead empty')); return; }
      const m = OUTCOME_META[o];
      rm.appendChild(el('div', 'bead ' + m.color, m.bead));
    });
  }

  function renderLegend() {
    const lg = $('#legend'); if (!lg) return;
    lg.innerHTML = cur.bets.map(b => {
      const m = OUTCOME_META[b.id];
      return `<span><i style="background:var(--${m.color === 'gold' ? 'gold' : m.color})"></i>${m.label}</span>`;
    }).join('');
  }

  // ---- STATISTIQUES --------------------------------------------------------
  function renderStats() {
    const body = $('#statsBody'); if (!body) return;
    const source = mode === 'history' ? (DATA[cur.key] || []).map(r => r.r) : board;
    const counts = {};
    cur.bets.forEach(b => counts[b.id] = 0);
    source.forEach(o => { if (counts[o] != null) counts[o]++; });
    const total = source.length || 1;

    body.innerHTML = cur.bets.map(b => {
      const m = OUTCOME_META[b.id];
      const pct = (counts[b.id] / total) * 100;
      const col = m.color === 'gold' ? 'var(--gold)' : `var(--${m.color})`;
      return `
        <div class="stat-row">
          <span class="lbl">${m.label}</span>
          <span class="stat-bar"><i style="width:${pct.toFixed(1)}%;background:${col}"></i></span>
          <span class="pct">${pct.toFixed(1)}%</span>
        </div>`;
    }).join('');

    // Série en cours
    let streak = 0, last = board[board.length - 1];
    for (let i = board.length - 1; i >= 0; i--) { if (board[i] === last) streak++; else break; }
    const sl = $('#streakLine');
    if (sl && last) {
      sl.innerHTML = `Série en cours : <b>${streak}× ${OUTCOME_META[last].label}</b> — dernier tour joué.`;
    } else if (sl) {
      sl.textContent = '';
    }
  }

  // ---- Navigation / reset --------------------------------------------------
  function goLobby() {
    if (busy) return;
    // rend les mises non distribuées
    if (totalStake() > 0) clearBets();
    cur = null;
    $('#gameView').classList.add('hidden');
    $('#lobbyView').classList.remove('hidden');
    renderLobby();
    window.scrollTo(0, 0);
  }

  function resetBalance() {
    balance = START_BALANCE;
    bets = {}; betOrder = [];
    saveBalance();
    renderBalance(balance);
    if (cur) { renderStakes(); updateStatus(); }
    toast('Solde rechargé : ' + fmt(START_BALANCE) + ' jetons.', 'info');
  }

  // ---- Boot ----------------------------------------------------------------
  window.Casino = { goLobby, resetBalance, openGame };
  renderLobby();
  renderBalance();
})();
