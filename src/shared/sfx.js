/* Effets sonores synthétisés (WebAudio, aucun fichier) : composteur, coq, Big Ben, jeu. */
(function () {
  var ctx = null, master = null, on = true, vol = 0.7;
  try { on = localStorage.getItem('kioukan.sound') !== 'off'; var sv = parseFloat(localStorage.getItem('kioukan.volume')); if (sv >= 0 && sv <= 1) vol = sv; } catch (e) { /* rien */ }
  function ac() {
    if (!ctx) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C(); master = ctx.createGain(); master.gain.value = 0.8 * vol; master.connect(ctx.destination); setTimeout(decodeAll, 0);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function env(g, t, a, peak, d) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function osc(type, f0, f1, t, dur, peak, dest) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, Math.min(0.01, dur / 3), peak, dur); o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(t, dur, peak, f, q, type) {
    var n = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0), i;
    for (i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    var s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = buf; fl.type = type || 'bandpass'; fl.frequency.value = f; fl.Q.value = q || 1;
    env(g, t, 0.002, peak, dur); s.connect(fl); fl.connect(g); g.connect(master); s.start(t);
  }

  /* vrais enregistrements : chargés à la demande, décodés au premier usage */
  var SAMPLES = { tic: 'audio/tic.mp3', flip: 'audio/flip.mp3', bonus: 'audio/bonus.mp3', coin: 'audio/coin.mp3', tear: 'audio/tear.mp3', malus: 'audio/malus.mp3', forbid: 'audio/forbid.mp3', ok: 'audio/ok.mp3', ko: 'audio/ko.mp3', victory: 'audio/victory.mp3' }, bufs = {}, raw = {};
  /* nom du jeu -> [échantillon, gain] ; sans échantillon prêt, on retombe sur la version synthétisée */
  var MAP = { tick: ['tic', 0.9], flip: ['flip', 0.6], pick: ['bonus', 0.55], hint: ['coin', 0.8], erase: ['tear', 0.7], win: ['ok', 0.8], wrong: ['ko', 0.8], malus: ['malus', 0.7], forbid: ['forbid', 0.7], victory: ['victory', 0.8] };
  function sampleLoad(name) {
    if (raw[name] || !SAMPLES[name] || !window.fetch) return;
    raw[name] = fetch(SAMPLES[name]).then(function (r) { return r.arrayBuffer(); }).catch(function () { return null; });
  }
  function decodeAll() {
    Object.keys(SAMPLES).forEach(function (n) {
      sampleLoad(n);
      raw[n].then(function (ab) { if (!ab || bufs[n]) return null; return new Promise(function (ok, ko) { ctx.decodeAudioData(ab.slice(0), ok, ko); }); })
        .then(function (b) { if (b) bufs[n] = b; }).catch(function () { /* rien */ });
    });
  }
  function samplePlay(name, gain) {
    sampleLoad(name);
    var go = function (b) { var s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = b; g.gain.value = gain || 1; s.connect(g); g.connect(master); s.start(); };
    if (bufs[name]) { go(bufs[name]); return; }
    raw[name].then(function (ab) { if (!ab) return null; return new Promise(function (ok, ko) { ctx.decodeAudioData(ab.slice(0), ok, ko); }); })
      .then(function (b) { if (b) { bufs[name] = b; go(b); } }).catch(function () { /* rien */ });
  }
  var S = {
    /* composteur de billet : clic métallique, coup sourd, petit tintement */
    punch: function (t) {
      noise(t, 0.03, 0.9, 3200, 3);
      osc('sine', 190, 55, t + 0.01, 0.11, 0.9);
      noise(t + 0.012, 0.05, 0.5, 900, 1.2);
      osc('triangle', 2900, 2600, t + 0.05, 0.22, 0.12);
      osc('triangle', 4300, 4100, t + 0.05, 0.14, 0.06);
    },
    click: function (t) { noise(t, 0.02, 0.35, 2400, 2); osc('sine', 900, 600, t, 0.04, 0.12); },
    tick: function (t) { noise(t, 0.015, 0.3, 3000, 4); osc('square', 1500, 1500, t, 0.02, 0.04); },
    pick: function (t) { osc('triangle', 520, 780, t, 0.09, 0.22); osc('sine', 1040, 1040, t + 0.03, 0.08, 0.08); },
    hint: function (t) { osc('sine', 880, 880, t, 0.16, 0.2); osc('sine', 1320, 1320, t + 0.09, 0.28, 0.16); },
    erase: function (t) { noise(t, 0.12, 0.25, 1800, 0.7, 'highpass'); },
    accuse: function (t) { osc('sawtooth', 220, 220, t, 0.28, 0.12); osc('sawtooth', 277, 277, t, 0.28, 0.1); osc('sawtooth', 330, 330, t, 0.28, 0.09); },
    wrong: function (t) { osc('sawtooth', 160, 110, t, 0.38, 0.28); osc('square', 150, 100, t + 0.02, 0.34, 0.1); },
    win: function (t) {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { osc('triangle', f, f, t + i * 0.1, 0.5, 0.2); osc('sine', f * 2, f * 2, t + i * 0.1, 0.4, 0.06); });
      noise(t + 0.45, 0.4, 0.12, 6000, 1, 'highpass');
    }
  };

  var DUR = {};
  window.KSFX = {
    play: function (name) {
      if (!on || vol <= 0 || !S[name]) return;
      var c = ac(); if (!c) return;
      var m = MAP[name];
      if (m) { sampleLoad(m[0]); if (bufs[m[0]]) { samplePlay(m[0], m[1]); return; } if (!S[name]) { samplePlay(m[0], m[1]); return; } }
      try { S[name](c.currentTime + 0.01); } catch (e) { /* rien */ }
    },
    force: function (name) { var c = ac(); if (!c) return; var m = MAP[name]; if (m && (bufs[m[0]] || !S[name])) { samplePlay(m[0], m[1]); return; } if (S[name]) { try { S[name](c.currentTime + 0.01); } catch (e) { /* rien */ } } },
    dur: function (name) { return (DUR[name] || 0.4) * 1000; },
    preload: function (name) { sampleLoad(name); },
    preloadAll: function () { for (var k in SAMPLES) sampleLoad(k); },
    isOn: function () { return on && vol > 0; },
    vol: function () { return vol; },
    setVol: function (v) { vol = Math.max(0, Math.min(1, v)); if (vol > 0 && !on) on = true; if (master) master.gain.value = 0.8 * vol; try { localStorage.setItem('kioukan.volume', String(vol)); localStorage.setItem('kioukan.sound', on ? 'on' : 'off'); } catch (e) { /* rien */ } sync(); },
    set: function (v) { on = !!v; if (on && vol <= 0) vol = 0.7; if (master) master.gain.value = 0.8 * vol; try { localStorage.setItem('kioukan.sound', on ? 'on' : 'off'); localStorage.setItem('kioukan.volume', String(vol)); } catch (e) { /* rien */ } sync(); if (on) window.KSFX.play('click'); }
  };

  var ICON_ON = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
  var ICON_OFF = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>';
  function sync() {
    var b = document.querySelectorAll('[data-sound-toggle]'), fr = window.KIOUKAN_LANG !== 'en', muted = !on || vol <= 0;
    for (var i = 0; i < b.length; i++) {
      b[i].innerHTML = muted ? ICON_OFF : ICON_ON;
      b[i].setAttribute('aria-expanded', b[i].parentNode.classList.contains('open') ? 'true' : 'false');
      b[i].setAttribute('aria-label', fr ? 'Réglages du son' : 'Sound settings');
      b[i].title = b[i].getAttribute('aria-label');
      var w = b[i].parentNode, r = w.querySelector('.snd-range'), m = w.querySelector('.snd-mute');
      if (r) { r.value = Math.round(vol * 100); r.setAttribute('aria-label', fr ? 'Volume' : 'Volume'); }
      if (m) m.textContent = fr ? (muted ? 'Activer le son' : 'Couper le son') : (muted ? 'Turn sound on' : 'Mute');
    }
  }
  function build() {
    var b = document.querySelectorAll('[data-sound-toggle]');
    for (var i = 0; i < b.length; i++) {
      (function (btn) {
        var w = document.createElement('span'); w.className = 'sndwrap';
        btn.parentNode.insertBefore(w, btn); w.appendChild(btn);
        var pop = document.createElement('div'); pop.className = 'sndpop'; pop.hidden = true;
        pop.innerHTML = '<input type="range" class="snd-range" min="0" max="100" step="5"><button type="button" class="snd-mute"></button>';
        w.appendChild(pop);
        btn.setAttribute('aria-haspopup', 'true');
        btn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); pop.hidden = !pop.hidden; w.classList.toggle('open', !pop.hidden); sync(); if (!pop.hidden) window.KSFX.force('click'); });
        var r = pop.querySelector('.snd-range');
        r.addEventListener('input', function () { window.KSFX.setVol(r.value / 100); });
        r.addEventListener('change', function () { window.KSFX.play('pick'); });
        pop.querySelector('.snd-mute').addEventListener('click', function (e) { e.stopPropagation(); window.KSFX.set(!(on && vol > 0)); });
        pop.addEventListener('click', function (e) { e.stopPropagation(); });
        document.addEventListener('click', function () { if (!pop.hidden) { pop.hidden = true; w.classList.remove('open'); sync(); } });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pop.hidden) { pop.hidden = true; w.classList.remove('open'); btn.focus(); sync(); } });
      })(b[i]);
    }
  }
  document.addEventListener('DOMContentLoaded', function () {
    build(); sync(); window.KSFX.preloadAll();
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target : null; if (!t) return;
      if (t.closest('.sndwrap')) return;
      var tk = t.closest('a.ticket');
      if (tk && on && !(e.metaKey || e.ctrlKey || e.shiftKey || e.button)) {
        e.preventDefault(); window.KSFX.play('punch');
        var href = tk.getAttribute('href'); setTimeout(function () { location.href = href; }, 330); return;
      }
      var act = t.closest('[data-act]');
      if (act) {
        var a = act.getAttribute('data-act');
        var map = { cell: 'tick', clear: 'erase', reset: 'erase', hint: 'hint', accuse: 'accuse', time: 'tick', liar: 'tick', next: 'punch', ep: 'punch', new: 'punch', skip: 'click', replay: 'click', list: 'flip', share: 'pick', close: 'click', check: 'click' };
        if (map[a]) window.KSFX.play(map[a]);
      } else if (t.closest('.btn, .navbtn, button')) { if (!t.closest('.ld-list, .acc-btn')) window.KSFX.play('click'); }
    }, true);
  });
})();
