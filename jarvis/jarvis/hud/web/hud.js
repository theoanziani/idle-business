// HUD Jarvis : panneaux modulables (déplacer, redimensionner, ajouter, retirer), disposition mémorisée.
(function () {
  const api = () => (window.pywebview && window.pywebview.api) || null;
  const call = async (fn, ...a) => { const x = api(); return x && x[fn] ? x[fn](...a) : null; };
  const $ = (s, el = document) => el.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------- Sons (synthétisés, aucun fichier) ----------
  let ac;
  function tone(freqs, dur = 0.12, vol = 0.05, type = "sine") {
    try {
      ac = ac || new AudioContext();
      const t = ac.currentTime, g = ac.createGain();
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      g.connect(ac.destination);
      freqs.forEach((f, i) => {
        const o = ac.createOscillator(); o.type = type;
        o.frequency.setValueAtTime(f, t + i * dur * 0.4); o.connect(g); o.start(t + i * dur * 0.4); o.stop(t + dur + i * dur * 0.4);
      });
    } catch (e) { /* pas d'audio : silence */ }
  }
  const sfx = {
    open: () => tone([660, 990], 0.12, 0.04, "triangle"),
    close: () => tone([520, 330], 0.12, 0.035, "triangle"),
    click: () => tone([1400], 0.05, 0.025, "square"),
    boot: () => tone([220, 330, 495, 742], 0.35, 0.05, "sine"),
  };

  // ---------- Catalogue des panneaux ----------
  const fmtDate = (d, o) => d.toLocaleDateString("fr-FR", o);
  const gauge = (label, pct, txt) => `<div class="gauge ${pct > 85 ? "hot" : ""}"><div class="lbl"><span>${label}</span><span>${txt}</span></div><div class="bar"><i style="width:${Math.min(100, pct)}%"></i></div></div>`;

  const TYPES = {
    heure: {
      titre: "Heure", every: 1000,
      render(b) {
        const n = new Date();
        b.innerHTML = `<div class="big">${n.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}<span class="muted" style="font-size:.4em"> ${String(n.getSeconds()).padStart(2, "0")}</span></div>
          <div class="muted" style="text-transform:capitalize">${fmtDate(n, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>`;
      },
    },
    systeme: {
      titre: "Système", every: 2000,
      async render(b) {
        const s = await call("systeme");
        if (!s) { b.innerHTML = `<span class="muted">Hors ligne</span>`; return; }
        b.innerHTML = gauge("CPU", s.cpu, `${Math.round(s.cpu)} %`) + gauge("RAM", s.ram, `${s.ram_used} / ${s.ram_total} Go`) +
          (s.gpu != null ? gauge("GPU", s.gpu, `${s.gpu} % · ${s.gpu_temp} °C`) + gauge("VRAM", (100 * s.vram) / s.vram_total, `${s.vram} / ${s.vram_total} Go`) : `<div class="muted">GPU non détecté</div>`);
      },
    },
    meteo: {
      titre: "Météo", every: 300000,
      async render(b) {
        const m = await call("meteo");
        if (!m || m.erreur) { b.innerHTML = `<span class="muted">Météo indisponible${m && m.erreur ? " : " + esc(m.erreur) : ""}</span>`; return; }
        b.innerHTML = `<div class="row"><div><div class="big">${m.temp}°</div><div style="text-transform:capitalize">${esc(m.ciel)}</div></div>
          <div class="muted" style="text-align:right">${esc(m.ville)}<br>Ressenti ${m.ressenti}°<br>Vent ${m.vent} km/h · ${m.humidite} %</div></div>
          <div class="days">${m.jours.map((j) => `<div><div style="text-transform:capitalize">${fmtDate(new Date(j.date), { weekday: "short" })}</div><b>${j.max}°</b> <span class="muted">${j.min}°</span></div>`).join("")}</div>`;
      },
    },
    agenda: {
      titre: "Agenda", every: 120000,
      async render(b) {
        const a = await call("agenda");
        if (!a || a.erreur) { b.innerHTML = `<span class="muted">Agenda indisponible${a && a.erreur ? " : " + esc(a.erreur) : ""}</span>`; return; }
        if (!a.evenements.length) { b.innerHTML = `<span class="muted">${esc(a.info || "Rien de prévu cette semaine, monsieur.")}</span>`; return; }
        b.innerHTML = a.evenements.map((e) => {
          const d = new Date(e.debut);
          return `<div class="event"><time>${fmtDate(d, { weekday: "short", day: "numeric" })} ${d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</time><span>${esc(e.titre)}</span></div>`;
        }).join("");
      },
    },
    musique: {
      titre: "Musique", every: 3000,
      init(b) {
        b.innerHTML = `<div class="music"><div class="track">—</div><div class="muted artist">Aucune lecture</div>
          <div class="controls"><button data-a="precedent" title="Précédent">⏮</button><button data-a="lecture_pause" title="Lecture / pause">⏯</button><button data-a="suivant" title="Suivant">⏭</button></div></div>`;
        b.addEventListener("click", async (e) => {
          const a = e.target.closest("button")?.dataset.a; if (!a) return;
          sfx.click(); await call("musique_action", a); setTimeout(() => TYPES.musique.render(b), 400);
        });
      },
      async render(b) {
        const m = (await call("musique")) || {};
        $(".track", b).textContent = m.titre || "—";
        $(".artist", b).textContent = m.titre ? [m.artiste, m.album].filter(Boolean).join(" · ") + (m.lecture ? "" : " (en pause)") : "Aucune lecture";
      },
    },
    conversation: {
      titre: "Conversation",
      init(b) {
        b.innerHTML = `<div class="chat"><div class="log"></div><form><input placeholder="Écrire à Jarvis…" autocomplete="off"></form></div>`;
        $("form", b).addEventListener("submit", (e) => {
          e.preventDefault();
          const i = $("input", b), t = i.value.trim(); if (!t) return;
          i.value = ""; sfx.click(); call("envoyer", t);
        });
        for (const m of history) addMsg(b, m.role, m.text);
      },
    },
  };

  const history = [];
  function addMsg(body, role, text) {
    const log = $(".log", body); if (!log) return;
    log.append(el("div", `msg ${role}`, esc(text)));
    while (log.children.length > 60) log.firstChild.remove();
    log.scrollTop = log.scrollHeight;
  }

  // ---------- Disposition (en % de l'écran pour s'adapter à toute résolution) ----------
  const DEFAULT = [
    { type: "heure", x: 2, y: 3, w: 18, h: 16 },
    { type: "meteo", x: 2, y: 22, w: 18, h: 26 },
    { type: "agenda", x: 2, y: 51, w: 18, h: 30 },
    { type: "systeme", x: 80, y: 3, w: 18, h: 30 },
    { type: "musique", x: 80, y: 36, w: 18, h: 20 },
    { type: "conversation", x: 70, y: 59, w: 28, h: 36 },
  ];
  let layout = [];
  const panels = new Map(); // id -> {spec, el, timer}
  let saveTimer;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => call("enregistrer_disposition", layout.map(({ id, type, x, y, w, h }) => ({ id, type, x, y, w, h }))), 400);
  }
  const uid = () => Math.random().toString(36).slice(2, 9);

  function place(p) {
    Object.assign(p.el.style, { left: p.spec.x + "vw", top: p.spec.y + "vh", width: p.spec.w + "vw", height: p.spec.h + "vh" });
  }

  function mount(spec) {
    const T = TYPES[spec.type]; if (!T) return;
    spec.id = spec.id || uid();
    const node = $("#tpl-panel").content.firstElementChild.cloneNode(true);
    $(".title", node).textContent = T.titre;
    const body = $(".body", node);
    const p = { spec, el: node, body };
    panels.set(spec.id, p);
    place(p);
    $("#panels").append(node);
    T.init && T.init(body);
    if (T.render) { T.render(body); if (T.every) p.timer = setInterval(() => T.render(body), T.every); }
    $(".close", node).addEventListener("click", () => unmount(spec.id));
    drag(p, $("header", node), "move");
    drag(p, $(".resize", node), "size");
    node.addEventListener("pointerdown", () => $("#panels").append(node)); // au premier plan
  }

  function unmount(id) {
    const p = panels.get(id); if (!p) return;
    clearInterval(p.timer); panels.delete(id);
    layout = layout.filter((s) => s.id !== id);
    sfx.close(); p.el.classList.add("leaving"); setTimeout(() => p.el.remove(), 300);
    save();
  }

  function drag(p, handle, mode) {
    handle.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button")) return;
      e.preventDefault(); handle.setPointerCapture(e.pointerId);
      const mx = e.clientX, my = e.clientY, { x: sx, y: sy, w: sw, h: sh } = p.spec;
      const vw = innerWidth / 100, vh = innerHeight / 100, snap = (v) => Math.round(v * 2) / 2;
      const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
      p.el.classList.add("dragging");
      const move = (ev) => {
        const dx = (ev.clientX - mx) / vw, dy = (ev.clientY - my) / vh;
        if (mode === "move") {
          p.spec.x = snap(clamp(sx + dx, 0, 100 - p.spec.w));
          p.spec.y = snap(clamp(sy + dy, 0, 100 - p.spec.h));
        } else {
          p.spec.w = snap(clamp(sw + dx, 10, 100 - p.spec.x));
          p.spec.h = snap(clamp(sh + dy, 10, 100 - p.spec.y));
        }
        place(p);
      };
      const up = () => {
        handle.removeEventListener("pointermove", move); handle.removeEventListener("pointerup", up);
        p.el.classList.remove("dragging"); save();
      };
      handle.addEventListener("pointermove", move); handle.addEventListener("pointerup", up);
    });
  }

  function apply(specs) {
    for (const id of [...panels.keys()]) { clearInterval(panels.get(id).timer); panels.get(id).el.remove(); panels.delete(id); }
    layout = specs.map((s) => ({ ...s, id: s.id || uid() }));
    layout.forEach(mount);
  }

  // ---------- Dock ----------
  const menu = $("#add-menu");
  for (const [k, T] of Object.entries(TYPES)) {
    const b = el("button", "", T.titre);
    b.addEventListener("click", () => {
      const spec = { type: k, x: 41, y: 35, w: 18, h: 26, id: uid() };
      layout.push(spec); mount(spec); sfx.open(); save(); menu.hidden = true;
    });
    menu.append(b);
  }
  $("#btn-add").addEventListener("click", () => { menu.hidden = !menu.hidden; sfx.click(); });
  $("#btn-reset").addEventListener("click", () => { apply(DEFAULT.map((s) => ({ ...s }))); sfx.boot(); save(); });
  $("#btn-hide").addEventListener("click", () => call("masquer"));
  addEventListener("keydown", (e) => { if (e.key === "Escape") call("masquer"); });
  let lastPing = 0;
  addEventListener("pointermove", () => { const n = Date.now(); if (n - lastPing > 5000) { lastPing = n; call("activite"); } });
  addEventListener("keydown", () => call("activite"));

  // ---------- Appels depuis Python ----------
  const LABELS = { idle: "En veille", ecoute: "J'écoute", reflexion: "Réflexion", parole: "Jarvis parle" };
  window.jarvis = {
    etat(s) {
      document.body.className = s; $("#status-text").textContent = LABELS[s] || s;
      window.reactor && reactor.setMode(s);
      if (s === "idle" && window.reactor) reactor.setLevel(0);
    },
    niveau(v) { window.reactor && reactor.setLevel(v); },
    message(role, text) {
      history.push({ role, text }); if (history.length > 60) history.shift();
      for (const p of panels.values()) if (p.spec.type === "conversation") addMsg(p.body, role, text);
    },
    apparition() {
      document.body.classList.add("boot"); sfx.boot();
      setTimeout(() => document.body.classList.remove("boot"), 1200);
      for (const p of panels.values()) TYPES[p.spec.type].render && TYPES[p.spec.type].render(p.body);
    },
  };

  let started = false;
  async function start() {
    if (started) return; started = true;
    const saved = await call("charger_disposition");
    apply(Array.isArray(saved) && saved.length ? saved : DEFAULT.map((s) => ({ ...s })));
    // La fenêtre est recréée à chaque réveil : on récupère la conversation et l'état gardés par Python.
    const h = await call("historique");
    if (h) { (h.messages || []).forEach((m) => jarvis.message(m.role, m.text)); jarvis.etat(h.etat || "idle"); }
    jarvis.apparition();
  }
  if (window.pywebview && window.pywebview.api) start();
  else { addEventListener("pywebviewready", start); setTimeout(start, 3000); }
})();
