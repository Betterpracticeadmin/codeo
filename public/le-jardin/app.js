/* ============================================================
   Site vitrine restaurant — rendu depuis config.js (window.SITE)
   Tu n'as normalement PAS besoin de toucher ce fichier.
   ============================================================ */
(function () {
  const S = window.SITE;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Applique les couleurs de la config
  const root = document.documentElement.style;
  root.setProperty('--accent', S.couleurAccent);
  root.setProperty('--fond', S.couleurFond);
  document.title = `${S.nom} — ${S.slogan}`;

  // Helper image ou dégradé de secours
  const bgOrPlaceholder = (url) => url && url.trim()
    ? `style="background-image:url('${esc(url)}')"` : 'class-placeholder';

  // ---- NAV ----
  $('nav').innerHTML = `
    <div class="logo">${esc(S.nom.split(' ')[0])} <b>${esc(S.nom.split(' ').slice(1).join(' ')) || ''}</b></div>
    <div class="nav-links">
      <a href="#apropos">L'adresse</a>
      <a href="#carte">La carte</a>
      <a href="#galerie">Galerie</a>
      <a href="#infos">Infos</a>
    </div>
    <a href="#reserver" class="btn">Réserver</a>`;

  // ---- HERO ----
  const heroBg = S.photoHero && S.photoHero.trim()
    ? `<div class="hero-bg" style="background-image:url('${esc(S.photoHero)}')"></div>`
    : `<div class="hero-bg placeholder"></div>`;
  $('hero').innerHTML = `
    ${heroBg}
    <div class="wrap hero-inner">
      <div class="slogan">${esc(S.slogan)} · ${esc(S.ville)}</div>
      <h1>${esc(S.nom)}</h1>
      <p>${esc(S.phrase)}</p>
      <div class="actions">
        <a href="#reserver" class="btn lg">Réserver une table</a>
        <a href="#carte" class="btn ghost lg">Voir la carte</a>
      </div>
    </div>`;

  // ---- À PROPOS ----
  const aboutMedia = S.galerie[0] && S.galerie[0].trim()
    ? `<div class="about-media" style="background-image:url('${esc(S.galerie[0])}')"></div>`
    : `<div class="about-media placeholder"></div>`;
  $('apropos').innerHTML = `
    <div class="wrap about-grid reveal">
      ${aboutMedia}
      <div class="about-text">
        <div class="eyebrow">Notre maison</div>
        <h2 class="title">Le goût du fait-maison</h2>
        <p>Chez ${esc(S.nom)}, chaque assiette est préparée sur place à partir de produits frais et de saison. Une cuisine simple, sincère et généreuse, dans un cadre chaleureux au cœur de ${esc(S.ville)}.</p>
        <p>Que ce soit pour un déjeuner d'affaires, un dîner entre amis ou une occasion spéciale, notre équipe vous accueille avec le sourire.</p>
        <div class="about-stats">
          <div><div class="n">100%</div><div class="l">Fait maison</div></div>
          <div><div class="n">Frais</div><div class="l">Produits du marché</div></div>
          <div><div class="n">★★★★★</div><div class="l">Avis clients</div></div>
        </div>
      </div>
    </div>`;

  // ---- CARTE ----
  const cats = S.carte.map((c) => `
    <div class="menu-cat">
      <h3>${esc(c.cat)}</h3>
      ${c.plats.map((p) => `
        <div class="plat">
          <div class="info">
            <div class="nom">${esc(p.nom)}</div>
            <div class="desc">${esc(p.desc)}</div>
          </div>
          <div class="dots"></div>
          <div class="prix">${esc(p.prix)}</div>
        </div>`).join('')}
    </div>`).join('');
  $('carte').innerHTML = `
    <div class="wrap">
      <div class="center reveal">
        <div class="eyebrow">Notre carte</div>
        <h2 class="title">À déguster</h2>
      </div>
      <div class="menu-cols reveal">${cats}</div>
    </div>`;

  // ---- GALERIE ----
  const cells = S.galerie.map((url, i) => url && url.trim()
    ? `<div class="cell" style="background-image:url('${esc(url)}')"></div>`
    : `<div class="cell placeholder">${['🍷', '🥘', '🍰', '🧑‍🍳', '🥗', '☕'][i % 6]}</div>`).join('');
  $('galerie').innerHTML = `
    <div class="wrap">
      <div class="center reveal">
        <div class="eyebrow">En images</div>
        <h2 class="title">L'ambiance</h2>
      </div>
      <div class="gallery-grid reveal">${cells}</div>
    </div>`;

  // ---- INFOS + RÉSERVATION ----
  const hours = S.horaires.map((r) => `
    <div class="hours-row"><span class="j">${esc(r.j)}</span><span class="h">${esc(r.h)}</span></div>`).join('');
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(S.adresse);
  $('infos').innerHTML = `
    <div class="wrap info-grid">
      <div class="reveal">
        <div class="eyebrow">Nous trouver</div>
        <h2 class="title">Horaires &amp; contact</h2>
        <div style="margin-top:28px">${hours}</div>
        <div class="contact-line" style="margin-top:26px">📍 <a href="${mapsUrl}" target="_blank" rel="noopener"><b>${esc(S.adresse)}</b></a></div>
        <div class="contact-line">📞 <a href="tel:${esc(S.telephone.replace(/\s/g, ''))}"><b>${esc(S.telephone)}</b></a></div>
        <div class="contact-line">✉️ <a href="mailto:${esc(S.email)}"><b>${esc(S.email)}</b></a></div>
      </div>
      <div id="reserver">
        <div class="resa-card reveal">
          <h3>Réserver une table</h3>
          <div class="sub">Réponse rapide par téléphone ou email.</div>
          <form id="resaForm">
            <div class="field"><label>Nom</label><input name="nom" required placeholder="Votre nom"></div>
            <div class="field-row">
              <div class="field"><label>Date</label><input name="date" type="date" required></div>
              <div class="field"><label>Heure</label><input name="heure" type="time" required></div>
            </div>
            <div class="field-row">
              <div class="field"><label>Couverts</label>
                <select name="couverts">${[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `<option>${n}</option>`).join('')}<option>9+</option></select>
              </div>
              <div class="field"><label>Téléphone</label><input name="tel" required placeholder="06 ..."></div>
            </div>
            <div class="field"><label>Message (optionnel)</label><textarea name="msg" rows="2" placeholder="Allergies, occasion..."></textarea></div>
            <button type="submit" class="btn">Envoyer ma demande</button>
            <div class="resa-note">Nous vous confirmons sous quelques heures.</div>
          </form>
        </div>
      </div>
    </div>`;

  // ---- FOOTER ----
  $('footer').innerHTML = `
    <div class="wrap">
      <div class="logo">${esc(S.nom.split(' ')[0])} <b>${esc(S.nom.split(' ').slice(1).join(' ')) || ''}</b></div>
      <p>${esc(S.slogan)} — ${esc(S.adresse)}</p>
      <div class="socials">
        <a href="tel:${esc(S.telephone.replace(/\s/g, ''))}">Téléphone</a>
        <a href="mailto:${esc(S.email)}">Email</a>
        ${S.instagram ? `<a href="${esc(S.instagram)}" target="_blank" rel="noopener">Instagram</a>` : ''}
      </div>
      <p>© ${esc(S.nom)}. Tous droits réservés.</p>
    </div>`;

  // ---- Formulaire de réservation ----
  const form = $('resaForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form).entries());
    if (S.formspree && S.formspree.trim()) {
      fetch(S.formspree, {
        method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form),
      }).then(() => showToast('Demande envoyée ✓ Merci !')).catch(() => showToast('Erreur, réessayez.'));
      form.reset();
    } else {
      const sujet = encodeURIComponent(`Réservation — ${d.nom}`);
      const corps = encodeURIComponent(
        `Nom : ${d.nom}\nDate : ${d.date} à ${d.heure}\nCouverts : ${d.couverts}\nTéléphone : ${d.tel}\nMessage : ${d.msg || '—'}`);
      window.location.href = `mailto:${S.email}?subject=${sujet}&body=${corps}`;
      showToast('Ouverture de votre messagerie…');
    }
  });

  function showToast(msg) {
    let t = $('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  // ---- Animations au scroll ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((n) => io.observe(n));
})();
