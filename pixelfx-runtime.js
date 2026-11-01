/*! PixelFX v0.3.0 | MIT | https://github.com/patch-gg/pixelfx */
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/core/math.js
  var TAU = Math.PI * 2;
  var clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
  var seg = (t, t0, t1) => clamp((t - t0) / (t1 - t0));
  var smooth = (e0, e1, x) => {
    const t = seg(x, e0, e1);
    return t * t * (3 - 2 * t);
  };
  function hash(...ns) {
    let h = 2654435769;
    for (const n of ns) {
      h = Math.imul(h ^ (n | 0), 2246822507);
      h ^= h >>> 13;
      h = Math.imul(h, 3266489909);
      h ^= h >>> 16;
    }
    return h >>> 0;
  }
  var Rng = class {
    constructor(seed = 1) {
      this.s = seed >>> 0 || 1;
    }
    next() {
      let t = this.s = this.s + 1831565813 >>> 0;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
    range(a, b) {
      return a + (b - a) * this.next();
    }
    int(a, b) {
      return Math.floor(this.range(a, b + 1));
    }
    chance(p) {
      return this.next() < p;
    }
    sign() {
      return this.next() < 0.5 ? -1 : 1;
    }
    pick(list) {
      return list[Math.floor(this.next() * list.length)];
    }
    /** Roughly normal, mean 0, sd 1. */
    gauss() {
      return (this.next() + this.next() + this.next() + this.next() - 2) * 1.732;
    }
  };
  var rng = (...ns) => new Rng(hash(...ns));

  // src/core/color.js
  var rgb = (r, g, b) => 255 << 24 | (b & 255) << 16 | (g & 255) << 8 | r & 255;
  var red = (c) => c & 255;
  var green = (c) => c >>> 8 & 255;
  var blue = (c) => c >>> 16 & 255;
  function hex(h) {
    if (typeof h === "number") return h;
    let s = h.replace("#", "");
    if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    const v = parseInt(s.slice(0, 6), 16);
    return rgb(v >> 16 & 255, v >> 8 & 255, v & 255);
  }
  var toHex = (c) => "#" + [red(c), green(c), blue(c)].map((v) => v.toString(16).padStart(2, "0")).join("");
  function mix(a, b, t) {
    t = clamp(t);
    return rgb(red(a) + (red(b) - red(a)) * t, green(a) + (green(b) - green(a)) * t, blue(a) + (blue(b) - blue(a)) * t);
  }
  var scale = (c, k) => rgb(Math.min(255, red(c) * k), Math.min(255, green(c) * k), Math.min(255, blue(c) * k));
  var ramp = (list) => list.map(hex);
  function fit(r, n) {
    r = r.map(hex);
    if (r.length === n) return r;
    return Array.from({ length: n }, (_, i) => r[Math.round(i * (r.length - 1) / Math.max(1, n - 1))]);
  }
  var PAL = {
    fire: ["#1f0b10", "#4a1118", "#8c1d1c", "#cc3a1a", "#f2701f", "#ffae35", "#ffe27a", "#fff8d6"],
    ember: ["#1a0a0e", "#3d1012", "#701a14", "#a8301a", "#e0561e", "#ff8a2a", "#ffc46a"],
    lava: ["#14060a", "#380a10", "#6e1210", "#ac2410", "#e8501a", "#ff8c2a", "#ffd25a"],
    smoke: ["#0e0c12", "#1d1a22", "#2e2a35", "#433e4b", "#5c5664", "#7b7484", "#a39cab"],
    dust: ["#1c1610", "#33281c", "#4f3f2c", "#6e5a40", "#927a58", "#b89f78", "#dcc8a2"],
    ice: ["#0c1430", "#162c5c", "#1f4f94", "#2f7fcc", "#58b4ec", "#9bdcff", "#d8f4ff", "#ffffff"],
    water: ["#081830", "#0e2e5a", "#14508c", "#1c76bc", "#36a2e0", "#78ccf4", "#c4ecff", "#ffffff"],
    electric: ["#0a0f2e", "#172a78", "#2550d0", "#3f8cff", "#7cc8ff", "#c8f0ff", "#ffffff"],
    volt: ["#24160a", "#5e3a0c", "#a8680f", "#e8a218", "#ffd23c", "#fff08a", "#ffffff"],
    poison: ["#0d1a0c", "#173a14", "#265e18", "#3f8a1e", "#6cb82a", "#a8e04a", "#e0ff8a"],
    holy: ["#2a1c08", "#5a3e10", "#9a6c18", "#d8a428", "#ffd84a", "#fff09a", "#fffbe6", "#ffffff"],
    heal: ["#08201a", "#0f3f2c", "#17663e", "#24924e", "#3ec466", "#7ee88a", "#c8ffc4", "#ffffff"],
    arcane: ["#140a26", "#2b1252", "#481c88", "#6b2cc0", "#9a48ec", "#c684ff", "#ecc8ff", "#ffffff"],
    shadow: ["#050308", "#0f0a18", "#1c1230", "#2c1a4a", "#432468", "#5e3290", "#8048b8", "#a970e0"],
    blood: ["#14040a", "#3a0a14", "#6a101c", "#a01824", "#d42a30", "#ff5a50", "#ff9a8a"],
    earth: ["#140e0a", "#2a1e14", "#47321e", "#69492a", "#8e6638", "#b88a52", "#dcb47c"],
    stone: ["#0e0e12", "#1c1c24", "#2c2c38", "#42424f", "#5c5c6b", "#7d7d8c", "#a4a4b2", "#d0d0da"],
    gold: ["#1e1206", "#4a2c08", "#86520c", "#c48412", "#f0b424", "#ffe066", "#fff6c4", "#ffffff"],
    leaf: ["#0c1a0e", "#163418", "#225224", "#357530", "#4f9a3a", "#7cc048", "#b4e070", "#e4ffb0"],
    wood: ["#160c06", "#2e1a0c", "#4a2c14", "#6a421e", "#8e5c2c", "#b47c40", "#d8a464"],
    metal: ["#0c0e14", "#1c2230", "#2e3648", "#4a5468", "#6e7a90", "#9aa6ba", "#d0d8e6", "#ffffff"],
    bone: ["#1a1814", "#3a352c", "#5e5648", "#8a806c", "#b8ad96", "#e4dcc8", "#fffaf0"],
    neon: ["#1a0516", "#3d0a33", "#701560", "#b0228f", "#f53cd1", "#ff86e6", "#ffd2f6", "#ffffff"],
    cyber: ["#041418", "#08303a", "#0c5260", "#108088", "#18b4b0", "#4ce8d8", "#b4fff0", "#ffffff"],
    matrix: ["#020a04", "#05200c", "#0a3c16", "#106624", "#1a9a34", "#3cd650", "#a4ffa8", "#e8ffe8"],
    candy: ["#ff4a5a", "#ff9a2a", "#ffe03c", "#5ad84a", "#3cc8ff", "#7a6cff", "#f53cd1"],
    night: ["#07060d", "#0c0a18", "#131026", "#1b1734", "#241f44", "#2f2956"]
  };
  var RAMP = Object.fromEntries(Object.entries(PAL).map(([k, v]) => [k, ramp(v)]));
  var WHITE = hex("#ffffff");
  var BLACK = hex("#000000");
  var INK = hex("#0b0a10");
  var PATCH = hex("#f53cd1");

  // src/core/sim.js
  var GRAVITY = 950;
  var CROSS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  var DIAG = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  var HOT = ["#fff3a6", "#ffe26b", "#ff8a2a", "#f2561d"].map(hex);
  var FIRE_RAMP = ["#ffffff", "#fff3a6", "#ffe26b", "#ffc23d", "#ff8a2a", "#f2561d", "#c9281f", "#8a1f17", "#4a1712"].map(hex);
  var SMOKE_RAMP = ["#7b6f72", "#5d5660", "#433d48", "#2b2630", "#1a171e"].map(hex);
  var rampAt = (r, t) => r[Math.min(r.length - 1, Math.max(0, Math.floor(t * r.length)))];
  var P = { SPARK: 0, MOTE: 1, STREAK: 2, FLAKE: 3, VAPOUR: 4, DUST: 5, STAR: 6, EMBER: 7, SMOKE: 8, FIRE: 9, BRAND: 10, GRIT: 11 };
  var PF = { SMOKES: 1, BIG: 2, BACK: 4 };
  var SOFT = /* @__PURE__ */ new Set([P.VAPOUR, P.DUST, P.SMOKE]);
  var Particles = class {
    constructor(opts = {}) {
      this.R = opts.rng ?? new Rng(opts.seed ?? 1);
      this.list = [];
      this.t = 0;
      this.ground = opts.ground ?? (() => Infinity);
      this.sparks = (opts.sparks ?? HOT).map(hex);
      this.haze = opts.haze === void 0 ? null : hex(opts.haze);
      this.onLand = opts.onLand ?? null;
    }
    /** delay: seconds before it appears; flag: PF bits. col 0 lets FIRE and SMOKE use their own ramps. */
    spawn(k, x, y, vx, vy, life, col = WHITE, size = 1, delay = 0, flag = 0) {
      this.list.push({ k, x, y, vx, vy, life, max: life, col: col ? hex(col) : 0, size, seed: this.R.next() * 100, delay, flag });
    }
    get count() {
      return this.list.length;
    }
    update(dt) {
      this.t += dt;
      const R = this.R, t = this.t;
      for (let i = this.list.length - 1; i >= 0; i--) {
        const p = this.list[i];
        if (p.delay > 0) {
          p.delay -= dt;
          continue;
        }
        if ((p.life -= dt) <= 0) {
          if (p.k === P.FIRE && p.flag & PF.SMOKES) {
            const big = p.flag & PF.BIG;
            this.spawn(P.SMOKE, p.x, p.y, p.vx * 0.6, p.vy * 0.6 - 6, big ? R.range(1.3, 2.3) : R.range(0.8, 1.4), 0, p.size * (big ? 0.85 : 0.7), 0, big ? PF.BIG : 0);
          }
          this.list.splice(i, 1);
          continue;
        }
        switch (p.k) {
          case P.FIRE:
            p.vy -= 95 * dt;
            p.vx += Math.sin(t * 17 + p.seed) * 30 * dt;
            p.vx -= p.vx * 5 * dt;
            p.vy -= p.vy * 3.2 * dt;
            break;
          case P.GRIT: {
            p.vy += GRAVITY * dt;
            p.vx -= p.vx * 0.8 * dt;
            const g = this.ground(p.x), ny = p.y + p.vy * dt;
            p.x += p.vx * dt;
            if (p.vy > 0 && p.y <= g && ny >= g) {
              p.y = g - 0.25;
              if (p.vy > 130 && R.chance(0.4)) p.vy = -p.vy * 0.25, p.vx = p.vx * 0.5 + R.range(-10, 10);
              else p.vx = p.vy = 0, p.life = Math.min(p.life, 0.5);
            } else p.y = ny;
            continue;
          }
          case P.BRAND: {
            p.vy += GRAVITY * 0.8 * dt;
            p.vx -= p.vx * 0.9 * dt;
            if (R.chance(0.9 * Math.min(1, dt * 60))) this.spawn(P.FIRE, p.x, p.y, p.vx * 0.1 + R.range(-7, 7), p.vy * 0.1 - 10, R.range(0.16, 0.32), 0, R.range(0.9, 1.7) * (0.5 + p.life / p.max * 0.6), 0, R.chance(0.4) ? PF.SMOKES : 0);
            const g = this.ground(p.x), ny = p.y + p.vy * dt;
            p.x += p.vx * dt;
            if (p.vy > 0 && p.y <= g && ny >= g) {
              this.onLand?.(p.x, g);
              this.list.splice(i, 1);
            } else p.y = ny;
            continue;
          }
          case P.SPARK: {
            p.vy += GRAVITY * 0.45 * dt;
            p.vx -= p.vx * 2.2 * dt;
            p.vy -= p.vy * 2.2 * dt;
            const g = this.ground(p.x), ny = p.y + p.vy * dt;
            p.x += p.vx * dt;
            if (p.vy > 0 && p.y <= g && ny >= g) p.vy = -p.vy * 0.45, p.vx *= 0.7, p.y = g - 0.25;
            else p.y = ny;
            continue;
          }
          case P.STREAK:
            p.vx += p.vx * 3 * dt, p.vy += p.vy * 3 * dt;
            break;
          case P.FLAKE:
            p.vx -= p.vx * 2.2 * dt;
            p.vy -= p.vy * 2.2 * dt - 35 * dt;
            p.x += Math.sin(this.t * 2.5 + p.seed) * 7 * dt;
            break;
          case P.EMBER:
            p.vy += (-30 + Math.sin(t * 3 + p.seed) * 20) * dt;
            p.vx += Math.cos(t * 2.3 + p.seed) * 45 * dt;
            p.vx -= p.vx * 1.6 * dt;
            p.vy -= p.vy * 1.6 * dt;
            break;
          case P.SMOKE: {
            const big = p.flag & PF.BIG;
            p.vy -= (big ? 23 : 16) * dt;
            p.vx += Math.sin(t * 1.3 + p.seed) * 8 * dt;
            p.vx -= p.vx * 1.6 * dt;
            p.vy -= p.vy * 1.2 * dt;
            break;
          }
          case P.MOTE:
            p.vx -= p.vx * 0.6 * dt;
            p.vy -= p.vy * 0.6 * dt;
            break;
          default: {
            const drag = SOFT.has(p.k) ? 4 : 1.6;
            p.vx -= p.vx * drag * dt;
            p.vy -= p.vy * drag * dt + 5 * dt;
          }
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
    }
    draw(p, layer) {
      for (const q of this.list) {
        if (q.delay > 0) continue;
        if (layer && (SOFT.has(q.k) || q.flag & PF.BACK ? "back" : "front") !== layer) continue;
        const k = q.life / q.max, x = q.x, y = q.y, sp = Math.hypot(q.vx, q.vy) || 1, ux = q.vx / sp, uy = q.vy / sp;
        switch (q.k) {
          case P.SPARK: {
            const S = this.sparks, head = k > 0.6 ? S[0] : k > 0.3 ? S[1] : S[2], len2 = Math.min(9, 1 + sp * 0.022);
            p.line(x - ux * len2, y - uy * len2, x - ux * len2 * 0.4, y - uy * len2 * 0.4, k > 0.5 ? head : S[S.length - 1]);
            p.line(x - ux * len2 * 0.45, y - uy * len2 * 0.45, x, y, head);
            p.glow(x, y, 3, head, 0.45 * k);
            break;
          }
          case P.MOTE: {
            const len2 = Math.min(16, 0.5 + sp * 0.026) * q.size, a = k < 0.35 ? k / 0.35 : 1;
            p.line(x - ux * len2, y - uy * len2, x - ux * len2 * 0.35, y - uy * len2 * 0.35, scale(q.col, 0.55), a);
            p.line(x - ux * len2 * 0.4, y - uy * len2 * 0.4, x, y, q.col, a);
            p.glow(x, y, 2.5 + q.size, q.col, 0.4 * k);
            break;
          }
          case P.STREAK: {
            const L = clamp(sp / 30, 1, 7);
            for (let d = L; d >= 0; d -= 0.5) p.dot(x - ux * d, y - uy * d, d < 1 ? WHITE : d < L * 0.5 ? q.col : scale(q.col, 0.6), d < L * 0.5 ? 1 : 1.2 - d / L);
            p.glow(x, y, 4, q.col, 0.4);
            break;
          }
          case P.FLAKE: {
            const a = Math.min(1, k * 3);
            p.dot(x, y, q.col, a);
            if (q.size > 1.3) for (const [dx, dy] of CROSS) p.dot(x + dx, y + dy, scale(q.col, 0.8), a * 0.8);
            break;
          }
          case P.VAPOUR: {
            const r = q.size * (0.6 + (1 - k) * 0.9);
            p.disc(x, y, r, q.col, Math.pow(k, 1.3) * 0.45);
            if (this.haze) p.glow(x, y, r * 1.8, this.haze, 0.16 * k);
            break;
          }
          case P.DUST:
            p.disc(x, y, q.size * (0.6 + (1 - k) * 0.9), q.col, Math.pow(k, 1.3) * 0.7);
            break;
          case P.SMOKE: {
            const age = 1 - k, big = q.flag & PF.BIG;
            const r = q.size * (0.65 + Math.min(1, age * 2.5) * 0.45 + age * (big ? 0.5 : 0.4));
            const a = Math.min(1, age * 12) * Math.min(1, k * 2.4) * (big ? 0.7 : 0.58);
            const c = q.col ? mix(q.col, rampAt(SMOKE_RAMP, age), age) : rampAt(SMOKE_RAMP, age * 1.05);
            p.disc(x, y, r, c, a * 0.45);
            p.disc(x + r * 0.05, y + r * 0.06, r * 0.74, c, a * 0.62);
            if (age < 0.5) p.disc(x - r * 0.22, y - r * 0.3, r * 0.5, mix(c, WHITE, 0.12), a * 0.4 * (1 - age * 2));
            break;
          }
          case P.FIRE: {
            const age = 1 - k, heat = Math.min(0.999, Math.pow(age, 0.62) + q.seed % 1 * 0.1), F = FIRE_RAMP, n = F.length;
            const idx = Math.min(n - 2, Math.floor(heat * (n - 1)));
            const r = q.size * (0.55 + 0.45 * Math.min(1, age * 7)) * (1 - age * 0.55), c = F[idx];
            if (idx >= n - 2) p.disc(x, y, r, c, Math.min(1, k * 3) * 0.85);
            else {
              p.circle(x, y, r, F[Math.min(n - 1, idx + 2)]);
              p.circle(x - r * 0.16, y - r * 0.22, r * 0.78, c);
              if (r > 1.6) p.circle(x, y - r * 0.9, r * 0.42, c);
              if (idx <= 3 && r > 1.8) p.circle(x - r * 0.28, y - r * 0.34, r * 0.36, F[Math.max(0, idx - 1)]);
              if (idx < 6) p.glow(x, y, r * 2.4 + 2, c, 0.18 * k);
            }
            break;
          }
          case P.BRAND:
            p.circle(x, y, 1.6, HOT[3]);
            p.px(x, y, Math.sin(this.t * 40 + q.seed) > 0 ? HOT[0] : HOT[1]);
            p.px(x + 1, y, HOT[1]);
            p.glow(x, y, 7, HOT[2], 0.45);
            break;
          case P.GRIT:
            if (k > 0.25 || k * 4 > 0.5) {
              p.px(x, y, q.col);
              if (q.size >= 2) p.px(x + 1, y, q.col), p.px(x, y + 1, scale(q.col, 0.8)), p.px(x + 1, y + 1, scale(q.col, 0.7));
            }
            break;
          case P.EMBER: {
            const c = k > 0.6 ? this.sparks[0] : k > 0.3 ? this.sparks[1] : this.sparks[2];
            if (k < 0.25 && Math.sin(this.t * 40 + q.seed) < 0) break;
            p.px(x, y, c);
            if (q.size > 1.5) p.px(x, y + 1, this.sparks[this.sparks.length - 1]);
            p.glow(x, y, 3 + q.size, c, 0.35 * k);
            break;
          }
          default: {
            const tw = 0.6 + 0.4 * Math.sin(this.t * (8 + q.seed % 5) + q.seed);
            if (q.size < 1) {
              if (tw * k > 0.25) p.px(x, y, tw > 0.8 ? WHITE : q.col);
              p.glow(x, y, 3, q.col, 0.4 * k * tw);
              break;
            }
            sparkle(p, x, y, q.size * tw * Math.min(1, k * 3), q.col, scale(q.col, 0.75), 0.5 * k * tw);
          }
        }
      }
    }
  };
  var Lights = class {
    constructor() {
      this.list = [];
    }
    add(x, y, r, color, k, life) {
      this.list.push({ x, y, r, color: hex(color), k, life, max: life });
    }
    update(dt) {
      for (let i = this.list.length - 1; i >= 0; i--) if ((this.list[i].life -= dt) <= 0) this.list.splice(i, 1);
    }
    draw(p) {
      for (const l of this.list) {
        const k = l.life / l.max;
        p.glow(l.x, l.y, l.r * (0.55 + 0.45 * k), l.color, l.k * k * k);
      }
    }
  };
  function sparkle(p, x, y, arm, c, tip = c, k = 0.6) {
    const n = Math.round(arm);
    if (n < 1) return;
    const X = Math.floor(x), Y = Math.floor(y);
    for (let d = 1; d <= n; d++) {
      const cc = d > n * 0.6 ? tip : c;
      for (const [dx, dy] of CROSS) p.px(X + dx * d, Y + dy * d, cc);
    }
    if (n >= 3) for (const [dx, dy] of DIAG) p.px(X + dx, Y + dy, c);
    if (n >= 6) for (const [dx, dy] of DIAG) p.px(X + dx * 2, Y + dy * 2, tip);
    p.px(X, Y, WHITE);
    p.glow(x, y, 4 + n * 2, c, k);
  }

  // src/core/font.js
  var MINI = {
    A: ".#.|#.#|###|#.#|#.#",
    B: "##.|#.#|##.|#.#|##.",
    C: ".##|#..|#..|#..|.##",
    D: "##.|#.#|#.#|#.#|##.",
    E: "###|#..|##.|#..|###",
    F: "###|#..|##.|#..|#..",
    G: ".##|#..|#.#|#.#|.##",
    H: "#.#|#.#|###|#.#|#.#",
    I: "###|.#.|.#.|.#.|###",
    J: "..#|..#|..#|#.#|.#.",
    K: "#.#|#.#|##.|#.#|#.#",
    L: "#..|#..|#..|#..|###",
    M: "#.#|###|###|#.#|#.#",
    N: "##.|#.#|#.#|#.#|#.#",
    O: ".#.|#.#|#.#|#.#|.#.",
    P: "##.|#.#|##.|#..|#..",
    Q: ".#.|#.#|#.#|##.|.##",
    R: "##.|#.#|##.|#.#|#.#",
    S: ".##|#..|.#.|..#|##.",
    T: "###|.#.|.#.|.#.|.#.",
    U: "#.#|#.#|#.#|#.#|###",
    V: "#.#|#.#|#.#|#.#|.#.",
    W: "#.#|#.#|###|###|#.#",
    X: "#.#|#.#|.#.|#.#|#.#",
    Y: "#.#|#.#|.#.|.#.|.#.",
    Z: "###|..#|.#.|#..|###",
    0: "###|#.#|#.#|#.#|###",
    1: ".#.|##.|.#.|.#.|###",
    2: "##.|..#|.#.|#..|###",
    3: "##.|..#|.#.|..#|##.",
    4: "#.#|#.#|###|..#|..#",
    5: "###|#..|##.|..#|##.",
    6: ".##|#..|###|#.#|###",
    7: "###|..#|.#.|.#.|.#.",
    8: "###|#.#|###|#.#|###",
    9: "###|#.#|###|..#|##.",
    "+": "...|.#.|###|.#.|...",
    "-": "...|...|###|...|...",
    "!": "#|#|#|.|#",
    "?": "##.|..#|.#.|...|.#.",
    ".": ".|.|.|.|#",
    ",": "..|..|..|.#|#.",
    ":": ".|#|.|#|.",
    "/": "..#|..#|.#.|#..|#..",
    "%": "#.#|..#|.#.|#..|#.#",
    x: "...|#.#|.#.|#.#|...",
    "*": "#.#|.#.|#.#|...|...",
    "'": "#|#|.|.|.",
    "(": ".#|#.|#.|#.|.#",
    ")": "#.|.#|.#|.#|#.",
    "<": "..#|.#.|#..|.#.|..#",
    ">": "#..|.#.|..#|.#.|#..",
    "=": "...|###|...|###|...",
    _: "...|...|...|...|###",
    "#": "#.#|###|#.#|###|#.#"
  };
  var BIG = {
    A: ".###.|#...#|#...#|#####|#...#|#...#|#...#",
    B: "####.|#...#|#...#|####.|#...#|#...#|####.",
    C: ".###.|#...#|#....|#....|#....|#...#|.###.",
    D: "####.|#...#|#...#|#...#|#...#|#...#|####.",
    E: "#####|#....|#....|####.|#....|#....|#####",
    F: "#####|#....|#....|####.|#....|#....|#....",
    G: ".###.|#...#|#....|#.###|#...#|#...#|.####",
    H: "#...#|#...#|#...#|#####|#...#|#...#|#...#",
    I: "###|.#.|.#.|.#.|.#.|.#.|###",
    J: "..###|...#.|...#.|...#.|...#.|#..#.|.##..",
    K: "#...#|#..#.|#.#..|##...|#.#..|#..#.|#...#",
    L: "#....|#....|#....|#....|#....|#....|#####",
    M: "#...#|##.##|#.#.#|#.#.#|#...#|#...#|#...#",
    N: "#...#|#...#|##..#|#.#.#|#..##|#...#|#...#",
    O: ".###.|#...#|#...#|#...#|#...#|#...#|.###.",
    P: "####.|#...#|#...#|####.|#....|#....|#....",
    Q: ".###.|#...#|#...#|#...#|#.#.#|#..#.|.##.#",
    R: "####.|#...#|#...#|####.|#.#..|#..#.|#...#",
    S: ".####|#....|#....|.###.|....#|....#|####.",
    T: "#####|..#..|..#..|..#..|..#..|..#..|..#..",
    U: "#...#|#...#|#...#|#...#|#...#|#...#|.###.",
    V: "#...#|#...#|#...#|#...#|#...#|.#.#.|..#..",
    W: "#...#|#...#|#...#|#.#.#|#.#.#|#.#.#|.#.#.",
    X: "#...#|#...#|.#.#.|..#..|.#.#.|#...#|#...#",
    Y: "#...#|#...#|.#.#.|..#..|..#..|..#..|..#..",
    Z: "#####|....#|...#.|..#..|.#...|#....|#####",
    0: ".###.|#...#|#..##|#.#.#|##..#|#...#|.###.",
    1: ".#.|##.|.#.|.#.|.#.|.#.|###",
    2: ".###.|#...#|....#|...#.|..#..|.#...|#####",
    3: "#####|...#.|..#..|...#.|....#|#...#|.###.",
    4: "...#.|..##.|.#.#.|#..#.|#####|...#.|...#.",
    5: "#####|#....|####.|....#|....#|#...#|.###.",
    6: "..##.|.#...|#....|####.|#...#|#...#|.###.",
    7: "#####|....#|...#.|..#..|.#...|.#...|.#...",
    8: ".###.|#...#|#...#|.###.|#...#|#...#|.###.",
    9: ".###.|#...#|#...#|.####|....#|...#.|.##..",
    "!": "#|#|#|#|#|.|#",
    "?": ".###.|#...#|....#|...#.|..#..|.....|..#..",
    "+": ".....|..#..|..#..|#####|..#..|..#..|.....",
    "-": "....|....|....|####|....|....|....",
    ".": ".|.|.|.|.|.|#",
    ",": "..|..|..|..|..|.#|#.",
    ":": ".|.|#|.|.|#|.",
    "/": "....#|....#|...#.|..#..|.#...|#....|#....",
    "%": "##...|##..#|...#.|..#..|.#...|#..##|...##",
    x: ".....|.....|#...#|.#.#.|..#..|.#.#.|#...#",
    "*": ".....|..#..|#.#.#|.###.|#.#.#|..#..|.....",
    "'": "#|#|.|.|.|.|.",
    "<": "...#|..#.|.#..|#...|.#..|..#.|...#",
    ">": "#...|.#..|..#.|...#|..#.|.#..|#...",
    "=": "....|....|####|....|####|....|....",
    "(": "..#|.#.|#..|#..|#..|.#.|..#",
    ")": "#..|.#.|..#|..#|..#|.#.|#..",
    "#": ".#.#.|.#.#.|#####|.#.#.|#####|.#.#.|.#.#."
  };
  function build(table, h) {
    const out = {};
    for (const [ch, src] of Object.entries(table)) {
      const rows = src.split("|");
      out[ch] = { w: rows[0].length, rows: rows.map((r) => [...r].map((c) => c === "#")) };
      if (rows.length !== h) throw new Error(`glyph ${ch} has ${rows.length} rows, expected ${h}`);
    }
    return out;
  }
  var FONTS = {
    mini: { h: 5, space: 2, gap: 1, glyphs: build(MINI, 5) },
    big: { h: 7, space: 3, gap: 1, glyphs: build(BIG, 7) }
  };
  function textWidth(str, font = "mini") {
    const F = FONTS[font];
    let w = 0;
    for (const ch of String(str)) {
      const g = F.glyphs[ch] ?? F.glyphs[ch.toUpperCase()];
      w += (g ? g.w : F.space) + F.gap;
    }
    return Math.max(0, w - F.gap);
  }
  function rasterText(str, font, plot2) {
    const F = FONTS[font];
    let x = 0;
    for (const ch of String(str)) {
      const g = F.glyphs[ch] ?? F.glyphs[ch.toUpperCase()];
      if (!g) {
        x += F.space + F.gap;
        continue;
      }
      for (let r = 0; r < F.h; r++) for (let c = 0; c < g.w; c++) if (g.rows[r][c]) plot2(x + c, r);
      x += g.w + F.gap;
    }
  }

  // src/core/painter.js
  var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
  var OUT = { c: 0, a: 1, l: 0, k: 0 };
  var sprites = /* @__PURE__ */ new WeakMap();
  var call = (v, ...args) => typeof v === "function" ? v(...args) : v;
  var Painter = class {
    constructor(frame3) {
      this.frame = frame3;
      this.reset();
    }
    /** Re-read the frame and clear placement, fade and light strength. */
    reset() {
      const f = this.frame;
      this.w = f.w;
      this.h = f.h;
      this.ox = f.ox | 0;
      this.oy = f.oy | 0;
      this.C = f.color;
      this.L = f.light;
      this.tx = 0;
      this.ty = 0;
      this.fx = 1;
      this.cs = 1;
      this.sn = 0;
      this.fade = 1;
      this.lightK = 1;
      this.layer = "front";
      return this;
    }
    /** Put the effect's origin at (x, y) in frame space, mirrored if flip, rotated by angle (radians). */
    place(x, y, flip = false, angle = 0) {
      this.tx = x;
      this.ty = y;
      this.fx = flip ? -1 : 1;
      this.cs = Math.cos(angle);
      this.sn = Math.sin(angle);
      return this;
    }
    // ---- transforms: local (effect) space <-> screen (frame) space
    toX(x, y) {
      return this.tx + x * this.fx * this.cs - y * this.sn;
    }
    toY(x, y) {
      return this.ty + x * this.fx * this.sn + y * this.cs;
    }
    fromX(sx, sy) {
      const dx = sx - this.tx, dy = sy - this.ty;
      return (dx * this.cs + dy * this.sn) * this.fx;
    }
    fromY(sx, sy) {
      const dx = sx - this.tx, dy = sy - this.ty;
      return -dx * this.sn + dy * this.cs;
    }
    // the screen pixel of the local pixel cell holding (x, y): mirrors and rotations land on whole cells
    cellX(x, y) {
      return Math.floor(this.toX(Math.floor(x) + 0.5, Math.floor(y) + 0.5));
    }
    cellY(x, y) {
      return Math.floor(this.toY(Math.floor(x) + 0.5, Math.floor(y) + 0.5));
    }
    // ---- raw writes, screen space, whole pixels. Color 0 means "nothing": it never erases what's there.
    put(sx, sy, c, a = 1) {
      if (!c) return;
      a *= this.fade;
      if (a < 1 && a <= BAYER[(sy & 3) << 2 | sx & 3]) return;
      const x = sx - this.ox, y = sy - this.oy;
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
      this.C[y * this.w + x] = c;
    }
    add(sx, sy, c, k = 1) {
      k *= this.fade * this.lightK;
      if (k <= 4e-3) return;
      const x = sx - this.ox, y = sy - this.oy;
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
      const i = y * this.w + x, d = this.L[i];
      const r = Math.min(255, (d & 255) + (c & 255) * k) | 0;
      const g = Math.min(255, (d >>> 8 & 255) + (c >>> 8 & 255) * k) | 0;
      const b = Math.min(255, (d >>> 16 & 255) + (c >>> 16 & 255) * k) | 0;
      this.L[i] = 255 << 24 | b << 16 | g << 8 | r;
    }
    /**
     * Blend a color over what's there at alpha a (0..1), keeping the result's own alpha: soft smoke, vapour and
     * mist. Use dithered dot() for hard pixel fades and blend() for translucent volumes.
     */
    blendPx(sx, sy, c, a) {
      a *= this.fade;
      if (!c || a <= 4e-3) return;
      const x = sx - this.ox, y = sy - this.oy;
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
      const i = y * this.w + x, d = this.C[i], da = (d >>> 24) / 255, oa = a + da * (1 - a), k = a / oa;
      const ch = (s) => (c >>> s & 255) * k + (d >>> s & 255) * (1 - k) & 255;
      this.C[i] = (oa * 255 & 255) << 24 | ch(16) << 16 | ch(8) << 8 | ch(0);
    }
    /** Translucent pixel at a local point. */
    blend(x, y, c, a) {
      this.blendPx(this.cellX(x, y), this.cellY(x, y), c, a);
    }
    /** A translucent disc: puffs of smoke, vapour, dust. c and a may be functions of (d: 0 center..1 rim, angle). */
    disc(cx, cy, r, c, a) {
      if (r < 0.5) return this.blend(cx, cy, call(c, 0, 0), call(a, 0, 0));
      this.each(cx - r, cy - r, cx + r, cy + r, (x, y, sx, sy) => {
        const dx = x - cx, dy = y - cy, d2 = dx * dx + dy * dy;
        if (d2 > r * r) return;
        const d = Math.sqrt(d2) / r, ang = Math.atan2(dy, dx);
        this.blendPx(sx, sy, call(c, d, ang), call(a, d, ang));
      });
    }
    /** Read back the color under a local point (0 if empty). */
    get(x, y) {
      const sx = this.cellX(x, y) - this.ox, sy = this.cellY(x, y) - this.oy;
      return sx < 0 || sy < 0 || sx >= this.w || sy >= this.h ? 0 : this.C[sy * this.w + sx];
    }
    // ---- pixels
    /** One opaque pixel. */
    px(x, y, c) {
      this.put(this.cellX(x, y), this.cellY(x, y), c, 1);
    }
    /** One pixel at alpha a (0..1), faded by ordered dither. */
    dot(x, y, c, a = 1) {
      if (a > 0) this.put(this.cellX(x, y), this.cellY(x, y), c, a);
    }
    /** Add light to one pixel. */
    light(x, y, c, k = 1) {
      this.add(this.cellX(x, y), this.cellY(x, y), c, k);
    }
    /**
     * Visit every screen pixel whose center falls in the local box [x0, x1] x [y0, y1], with that center in
     * local space: fn(lx, ly, sx, sy). The basis of every filled shape, so shapes mirror and rotate exactly.
     */
    each(x0, y0, x1, y1, fn) {
      let ax = Infinity, bx = -Infinity, ay = Infinity, by = -Infinity;
      for (let k = 0; k < 4; k++) {
        const x = k & 1 ? x1 : x0, y = k & 2 ? y1 : y0, sx = this.toX(x, y), sy = this.toY(x, y);
        if (sx < ax) ax = sx;
        if (sx > bx) bx = sx;
        if (sy < ay) ay = sy;
        if (sy > by) by = sy;
      }
      const sx0 = Math.max(Math.floor(ax), this.ox), sx1 = Math.min(Math.ceil(bx), this.ox + this.w - 1);
      const sy0 = Math.max(Math.floor(ay), this.oy), sy1 = Math.min(Math.ceil(by), this.oy + this.h - 1);
      for (let sy = sy0; sy <= sy1; sy++)
        for (let sx = sx0; sx <= sx1; sx++) {
          const cx = sx + 0.5, cy = sy + 0.5;
          fn(this.fromX(cx, cy), this.fromY(cx, cy), sx, sy);
        }
    }
    /**
     * A pixel shader over a local box. fn(x, y, out) returns a color, or sets out.c (color), out.a (alpha),
     * out.l (light color, defaults to out.c) and out.k (light amount). Return nothing to leave the pixel alone.
     */
    shade(x0, y0, x1, y1, fn) {
      const o = OUT;
      this.each(x0, y0, x1, y1, (lx, ly, sx, sy) => {
        o.c = 0;
        o.a = 1;
        o.l = 0;
        o.k = 0;
        const c = fn(lx, ly, o) || o.c;
        if (c) this.put(sx, sy, c, o.a);
        if (o.k > 0) this.add(sx, sy, o.l || c, o.k);
      });
    }
    // ---- shapes. Colors (c) and alphas (a) can be numbers or functions of the shape's own coordinates.
    /** 1 px line. c and a may be functions of u (0 at the start, 1 at the end). */
    line(x0, y0, x1, y1, c, a = 1) {
      let sx = this.cellX(x0, y0), sy = this.cellY(x0, y0);
      const ex = this.cellX(x1, y1), ey = this.cellY(x1, y1);
      const dx = Math.abs(ex - sx), dy = -Math.abs(ey - sy), stepx = sx < ex ? 1 : -1, stepy = sy < ey ? 1 : -1;
      const n = Math.max(dx, -dy) || 1, fc = typeof c === "function", fa = typeof a === "function";
      let err = dx + dy, i = 0;
      for (; ; ) {
        const u = i++ / n;
        this.put(sx, sy, fc ? c(u) : c, fa ? a(u) : a);
        if (sx === ex && sy === ey) break;
        const e2 = 2 * err;
        if (e2 >= dy) {
          err += dy;
          sx += stepx;
        }
        if (e2 <= dx) {
          err += dx;
          sy += stepy;
        }
      }
    }
    /** Lines through a list of points [[x, y], ...]. */
    polyline(pts, c, a = 1) {
      for (let i = 1; i < pts.length; i++) this.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], c, a);
    }
    /** Thick segment with round ends. c and a may be functions of (u along, v across: 0 center, 1 edge). */
    beam(x0, y0, x1, y1, width, c, a = 1) {
      const r = width / 2, dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy || 1e-9;
      this.shade(Math.min(x0, x1) - r, Math.min(y0, y1) - r, Math.max(x0, x1) + r, Math.max(y0, y1) + r, (x, y, o) => {
        const u = clamp(((x - x0) * dx + (y - y0) * dy) / L2), px = x0 + dx * u - x, py = y0 + dy * u - y;
        const d2 = px * px + py * py;
        if (d2 > r * r) return;
        const v = Math.sqrt(d2) / r;
        o.c = call(c, u, v);
        o.a = call(a, u, v);
      });
    }
    /** Filled disc. c and a may be functions of (d: 0 center to 1 rim, angle). */
    circle(cx, cy, r, c, a = 1) {
      if (r < 0.6) return this.dot(cx, cy, call(c, 0, 0), call(a, 0, 0));
      this.shade(cx - r, cy - r, cx + r, cy + r, (x, y, o) => {
        const dx = x - cx, dy = y - cy, d2 = dx * dx + dy * dy;
        if (d2 > r * r) return;
        const d = Math.sqrt(d2) / r, ang = Math.atan2(dy, dx);
        o.c = call(c, d, ang);
        o.a = call(a, d, ang);
      });
    }
    /** Ellipse. c and a may be functions of (d: 0 center to 1 rim, angle). */
    ellipse(cx, cy, rx, ry, c, a = 1) {
      if (rx <= 0 || ry <= 0) return;
      this.shade(cx - rx, cy - ry, cx + rx, cy + ry, (x, y, o) => {
        const dx = (x - cx) / rx, dy = (y - cy) / ry, d2 = dx * dx + dy * dy;
        if (d2 > 1) return;
        const d = Math.sqrt(d2), ang = Math.atan2(dy, dx);
        o.c = call(c, d, ang);
        o.a = call(a, d, ang);
      });
    }
    /** Ring from radius r - w to r. c and a may be functions of (v: 0 inner to 1 outer, angle). */
    ring(cx, cy, r, w, c, a = 1) {
      const r0 = Math.max(0, r - w);
      this.shade(cx - r, cy - r, cx + r, cy + r, (x, y, o) => {
        const dx = x - cx, dy = y - cy, d2 = dx * dx + dy * dy;
        if (d2 > r * r || d2 < r0 * r0) return;
        const v = w > 0 ? (Math.sqrt(d2) - r0) / (r - r0 || 1) : 1, ang = Math.atan2(dy, dx);
        o.c = call(c, v, ang);
        o.a = call(a, v, ang);
      });
    }
    /**
     * Band of a ring from angle a0 to a1 (radians, a1 > a0), radius r - w to r: the slash and smear shape.
     * c and a may be functions of (u: 0 at a0 to 1 at a1, v: 0 inner to 1 outer). w can be a function of u
     * for a crescent that tapers at both ends.
     */
    arc(cx, cy, r, w, a0, a1, c, a = 1) {
      const span = a1 - a0, wf = typeof w === "function";
      this.shade(cx - r, cy - r, cx + r, cy + r, (x, y, o) => {
        const dx = x - cx, dy = y - cy, d = Math.sqrt(dx * dx + dy * dy);
        if (d > r) return;
        let ang = Math.atan2(dy, dx) - a0;
        ang -= Math.floor(ang / (Math.PI * 2)) * Math.PI * 2;
        if (ang > span) return;
        const u = ang / span, ww = wf ? w(u) : w;
        if (ww <= 0 || d < r - ww) return;
        const v = (d - (r - ww)) / ww;
        o.c = call(c, u, v);
        o.a = call(a, u, v);
      });
    }
    /** Filled rectangle. */
    rect(x, y, w, h, c, a = 1) {
      if (this.sn === 0) {
        const X0 = Math.round(x), Y0 = Math.round(y), X1 = Math.round(x + w), Y1 = Math.round(y + h);
        for (let yy = Y0; yy < Y1; yy++) for (let xx = X0; xx < X1; xx++) this.put(this.cellX(xx, yy), this.cellY(xx, yy), c, a);
        return;
      }
      this.shade(x, y, x + w, y + h, (lx, ly, o) => {
        if (lx < x || ly < y || lx >= x + w || ly >= y + h) return;
        o.c = c;
        o.a = a;
      });
    }
    /** Filled polygon from points [[x, y], ...] (even-odd rule). */
    poly(pts, c, a = 1) {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const [x, y] of pts) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
      const n = pts.length;
      this.shade(x0, y0, x1, y1, (x, y, o) => {
        let inside = false;
        for (let i = 0, j = n - 1; i < n; j = i++) {
          const [xi, yi] = pts[i], [xj, yj] = pts[j];
          if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
        }
        if (!inside) return;
        o.c = call(c, x, y);
        o.a = call(a, x, y);
      });
    }
    tri(x0, y0, x1, y1, x2, y2, c, a = 1) {
      this.poly([[x0, y0], [x1, y1], [x2, y2]], c, a);
    }
    // ---- light
    /** Radial glow into the light buffer: k at the center, falling to 0 at radius r. */
    glow(x, y, r, c, k = 0.5) {
      if (r < 1 || k <= 4e-3) return;
      const cx = this.toX(x, y), cy = this.toY(x, y);
      const x0 = Math.floor(cx - r), x1 = Math.ceil(cx + r), y0 = Math.floor(cy - r), y1 = Math.ceil(cy + r);
      for (let sy = y0; sy <= y1; sy++) {
        const dy = (sy + 0.5 - cy) / r;
        for (let sx = x0; sx <= x1; sx++) {
          const dx = (sx + 0.5 - cx) / r, d = dx * dx + dy * dy;
          if (d >= 1) continue;
          const f = 1 - Math.sqrt(d);
          this.add(sx, sy, c, f * f * k);
        }
      }
    }
    /** Glow around a segment (a soft beam of light). */
    glowLine(x0, y0, x1, y1, r, c, k = 0.5) {
      if (r < 1 || k <= 4e-3) return;
      const ax = this.toX(x0, y0), ay = this.toY(x0, y0), bx = this.toX(x1, y1), by = this.toY(x1, y1);
      const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1e-9;
      const X0 = Math.floor(Math.min(ax, bx) - r), X1 = Math.ceil(Math.max(ax, bx) + r);
      const Y0 = Math.floor(Math.min(ay, by) - r), Y1 = Math.ceil(Math.max(ay, by) + r);
      for (let sy = Y0; sy <= Y1; sy++)
        for (let sx = X0; sx <= X1; sx++) {
          const px = sx + 0.5, py = sy + 0.5, u = clamp(((px - ax) * dx + (py - ay) * dy) / L2);
          const ex = ax + dx * u - px, ey = ay + dy * u - py, d = Math.sqrt(ex * ex + ey * ey) / r;
          if (d >= 1) continue;
          const f = 1 - d;
          this.add(sx, sy, c, f * f * k);
        }
    }
    /** Glow hugging a circle of radius R (a shockwave's light), falling off over width r. */
    glowRing(x, y, R, r, c, k = 0.5) {
      if (r < 1 || k <= 4e-3) return;
      const cx = this.toX(x, y), cy = this.toY(x, y), E = R + r;
      for (let sy = Math.floor(cy - E); sy <= Math.ceil(cy + E); sy++)
        for (let sx = Math.floor(cx - E); sx <= Math.ceil(cx + E); sx++) {
          const d = Math.abs(Math.hypot(sx + 0.5 - cx, sy + 0.5 - cy) - R) / r;
          if (d >= 1) continue;
          const f = 1 - d;
          this.add(sx, sy, c, f * f * k);
        }
    }
    // ---- sprites, text, masks
    /**
     * A little sprite from strings: rows like ["..##..", ".#oo#."], pal maps characters to colors
     * ({ "#": "#222034", o: 0xff... }); "." and " " are empty. Top-left at (x, y).
     * opts: { scale, a, flip (mirror left-right), flipY (upside down), tint (draw every pixel in one color) }.
     */
    sprite(rows, pal, x, y, opts = {}) {
      let s = sprites.get(rows);
      if (!s) sprites.set(rows, s = rows.map((r) => [...r]));
      const k = opts.scale ?? 1, a = opts.a ?? 1, W = s[0]?.length ?? 0, cache = {};
      for (let r = 0; r < s.length; r++)
        for (let q = 0; q < s[r].length; q++) {
          const ch = s[r][q];
          if (ch === "." || ch === " ") continue;
          let c = opts.tint;
          if (c === void 0) {
            c = cache[ch];
            if (c === void 0) c = cache[ch] = pal[ch] === void 0 ? 0 : hex(pal[ch]);
          }
          if (!c) continue;
          const col = opts.flip ? W - 1 - q : q, row = opts.flipY ? s.length - 1 - r : r;
          if (k === 1) this.dot(x + col, y + row, c, a);
          else this.rect(x + col * k, y + row * k, k, k, c, a);
        }
    }
    /**
     * Pixel text. opts: { font: "mini" (3x5) | "big" (5x7), scale, align: "left" | "center" | "right",
     * outline: color, shadow: color, a }. (x, y) is the top of the text, at the left, center or right.
     */
    text(str, x, y, c, opts = {}) {
      const font = opts.font ?? "mini", k = opts.scale ?? 1, a = opts.a ?? 1, w = textWidth(str, font) * k;
      const left = Math.round(opts.align === "center" ? x - w / 2 : opts.align === "right" ? x - w : x), top = Math.round(y);
      const ol = opts.outline, sh = opts.shadow;
      if (ol !== void 0) rasterText(str, font, (gx, gy) => this.rect(left + gx * k - 1, top + gy * k - 1, k + 2, k + 2, ol, a));
      if (sh !== void 0) rasterText(str, font, (gx, gy) => this.rect(left + gx * k + 1, top + gy * k + 1, k, k, sh, a));
      rasterText(str, font, (gx, gy) => this.rect(left + gx * k, top + gy * k, k, k, call(c, gx, gy), a));
    }
    /** Size of text in pixels: [w, h]. */
    measure(str, opts = {}) {
      const k = opts.scale ?? 1;
      return [textWidth(str, opts.font ?? "mini") * k, FONTS[opts.font ?? "mini"].h * k];
    }
    /** Fill a mask ({ w, h, data }) with its top-left at (x, y). c may be a function of (mx, my). */
    mask(m, x, y, c, a = 1) {
      for (let my = 0; my < m.h; my++)
        for (let mx = 0; mx < m.w; mx++) if (m.data[my * m.w + mx]) this.dot(x + mx, y + my, call(c, mx, my), call(a, mx, my));
    }
    /** The 1 px outline just outside a mask. */
    outline(m, x, y, c, a = 1) {
      const at = (mx, my) => mx >= 0 && my >= 0 && mx < m.w && my < m.h && m.data[my * m.w + mx];
      for (let my = -1; my <= m.h; my++)
        for (let mx = -1; mx <= m.w; mx++)
          if (!at(mx, my) && (at(mx - 1, my) || at(mx + 1, my) || at(mx, my - 1) || at(mx, my + 1)))
            this.dot(x + mx, y + my, call(c, mx, my), call(a, mx, my));
    }
  };

  // src/core/actor.js
  var HERO = [
    "....kkkkk...",
    "..kkhhhhhk..",
    ".khhhhhhhhk.",
    ".khhhhhhhhhk",
    ".khhssssshhk",
    ".khsessesshk",
    ".khsessesshk",
    "..ksssssssk.",
    "...kkSSSkk..",
    "..kttttttk..",
    ".kttTttTttk.",
    ".ksttTTttsk.",
    ".kstttttttk.",
    "..kbbbbbbk..",
    "..kppkkppk..",
    "..kppk.kppk.",
    "..kppk.kppk.",
    "..koook.kook",
    "..kkkkk.kkkk"
  ];
  var HERO_PAL = {
    k: "#17121f",
    h: "#7a4128",
    s: "#f3c49d",
    S: "#c98b6c",
    e: "#17121f",
    t: "#5f6f94",
    T: "#46536f",
    b: "#8a5a32",
    p: "#38334a",
    o: "#6a4030",
    // the 2x character's extra detail
    H: "#a35d34",
    w: "#ffffff",
    m: "#a3564a",
    g: "#e8c060",
    L: "#7f90b6",
    O: "#8f5a3f",
    P: "#4b4560",
    // the scarf
    c: "#f53cd1",
    C: "#ff8fe6",
    D: "#a31f8a"
  };
  var DUMMY_PAL = {
    k: "#0e0c14",
    A: "#e4e6ec",
    B: "#b6b9c3",
    C: "#868995",
    D: "#5c5e6a",
    E: "#6e707c",
    F: "#4b4d58",
    G: "#34353f",
    J: "#2a2b33",
    m: "#f53cd1"
  };
  var HERO2 = [
    "...........kkk..........",
    "..........kAABk.........",
    ".........kAAABJk........",
    ".........kABBJJk........",
    ".........kBBBJCDk.......",
    ".........kBCJDDDk.......",
    ".........kkJJJDk........",
    ".......kkkkABBJCkk......",
    "......kAABCJBCCCkDk.....",
    "......kABBCJCCCmDkDk....",
    "......kBBCDDJCDDDkDk....",
    "......kABCDJDDDDDkk.....",
    ".....kAABDkDDDDJkk......",
    ".....kABCDkDDJJGkk......",
    ".....kABCkJJJGGGkk......",
    "....kJJCDkFFFGGGk.......",
    "....kAJJDkJJJGGGk.......",
    "....kJCJJkABBJGGk.......",
    ".....kJCCkBBCDJJJk......",
    ".....kCCCJBBCDJJDk......",
    ".....kCCCDJCCDkJDDk.....",
    "......kCDDJBCDkDDDk.....",
    ".......kDJJJCDkDDDkk....",
    ".......kJBCJCDkDDDkk....",
    ".......kBDJBCDkCDDkk....",
    "........kJJBCDkCDDk.....",
    "........kBBBCDkCCDDk....",
    "........kBBBCDkCCDDk....",
    ".........kBBCDkJDDDk....",
    "........kBJJJJkCJJJk....",
    "........kBBCCDkCCDDk....",
    "........kBBCDDkCDDk.....",
    "........kBBCDkCCDDk.....",
    "........kBCCDkCCDDk.....",
    "........kBCDDkCDDDk.....",
    ".......kJBCJkkkDJkkkk...",
    ".......kAJJAAAAkCCCCCk..",
    "........kkkkkkkkkkkkk..."
  ];
  function maskOf(rows, k = 1) {
    const h = rows.length * k, w = rows[0].length * k, data = new Uint8Array(w * h);
    rows.forEach((r, y) => [...r].forEach((ch, x) => {
      if (ch === ".") return;
      for (let j = 0; j < k * k; j++) data[(y * k + (j / k | 0)) * w + x * k + j % k] = 1;
    }));
    return { w, h, data };
  }
  var MASKS = { 1: maskOf(HERO, 1), 2: maskOf(HERO2, 1) };
  function pixelsOf(rows, pal) {
    const w = rows[0].length, data = new Uint32Array(w * rows.length);
    rows.forEach((r, y) => [...r].forEach((ch, x) => data[y * w + x] = ch === "." ? 0 : hex(pal[ch])));
    return data;
  }
  var PIXELS = { 1: pixelsOf(HERO, HERO_PAL), 2: pixelsOf(HERO2, DUMMY_PAL) };
  function stockActor(k = 1) {
    k = k === 2 ? 2 : 1;
    const m = MASKS[k], x = -Math.floor(m.w / 2), y = -m.h;
    return { mask: m, pixels: PIXELS[k], x, y, w: m.w, h: m.h, k, head: [0, y], chest: [0, k === 2 ? -26 : y + 11], ...k === 2 ? { eyes: [[13, 3], [15, 3]] } : {} };
  }

  // src/core/fx.js
  function createFrame(w, h, ox = 0, oy = 0) {
    return { w, h, ox, oy, color: new Uint32Array(w * h), light: new Uint32Array(w * h) };
  }
  function clearFrame(f) {
    f.color.fill(0);
    f.light.fill(0);
    return f;
  }
  var painters = /* @__PURE__ */ new WeakMap();
  function painterFor(frame3) {
    let p = painters.get(frame3);
    if (!p) painters.set(frame3, p = new Painter(frame3));
    return p.reset();
  }
  var FADE = 0.3;
  var isRamp = (v) => Array.isArray(v) && v.length > 0 && v.every((c) => typeof c === "number" || /^#[0-9a-f]{3,8}$/i.test(c));
  function resolveOptions(meta2, o = {}) {
    const opts = { ...meta2.options ?? {}, ...o };
    for (const [k, def] of Object.entries(meta2.options ?? {}))
      if (isRamp(def) && isRamp(o[k]) && o[k].length !== def.length) opts[k] = fit(o[k], def.length).map(toHex);
    if (meta2.actor && !opts.actor) opts.actor = stockActor(meta2.actor === 2 ? 2 : 1);
    return opts;
  }
  function createFx(mod, o = {}) {
    const meta2 = mod.meta ?? {};
    const opts = resolveOptions(meta2, o);
    const impl = mod.create ? mod.create(opts) : mod;
    const D = meta2.duration ?? 1;
    let t = 0, stopAt = Infinity;
    return {
      meta: meta2,
      options: opts,
      get t() {
        return t;
      },
      update(dt) {
        t += dt;
        if (!impl.update) return;
        const n = Math.max(1, Math.ceil(dt * 120 - 1e-9));
        for (let i = 0; i < n; i++) impl.update(dt / n, opts);
      },
      draw(frame3, layer) {
        const p = painterFor(frame3);
        p.place(opts.x ?? 0, opts.y ?? 0, !!opts.flip, opts.angle ?? 0);
        p.fade = stopAt === Infinity ? 1 : clamp(1 - (t - stopAt) / FADE);
        p.lightK = opts.light ?? 1;
        const tt = meta2.loop ? t % D : Math.min(t, D);
        if (layer !== "front" && impl.drawBack) {
          p.layer = "back";
          impl.drawBack(p, tt, opts);
        }
        if (layer !== "back") {
          p.layer = "front";
          impl.draw(p, tt, opts);
        }
      },
      /** Let it end: loops fade out, one-shots cut short. */
      stop() {
        if (stopAt === Infinity) stopAt = t;
      },
      done() {
        return t - stopAt >= FADE || !meta2.loop && t >= D;
      }
    };
  }
  function composite(f, out, bg = null, lightK = 1) {
    const n = f.w * f.h, C = f.color, L = f.light, flat = typeof bg === "number";
    for (let i = 0; i < n; i++) {
      const c = C[i], l = L[i] & 16777215;
      let r, g, b, a;
      const ca = c >>> 24;
      if (ca === 255) {
        r = c & 255;
        g = c >>> 8 & 255;
        b = c >>> 16 & 255;
        a = 255;
      } else if (bg === null) {
        r = c & 255;
        g = c >>> 8 & 255;
        b = c >>> 16 & 255;
        a = ca;
      } else {
        const k = flat ? bg : bg[i], f2 = ca / 255;
        r = (c & 255) * f2 + (k & 255) * (1 - f2);
        g = (c >>> 8 & 255) * f2 + (k >>> 8 & 255) * (1 - f2);
        b = (c >>> 16 & 255) * f2 + (k >>> 16 & 255) * (1 - f2);
        a = 255;
      }
      if (l) {
        const lr = (l & 255) * lightK, lg = (l >>> 8 & 255) * lightK, lb = (l >>> 16 & 255) * lightK;
        if (a < 255) {
          const pa = a / 255, pr = r * pa + lr, pg = g * pa + lg, pb = b * pa + lb;
          const na = Math.min(1, Math.max(pa, Math.max(lr, lg, lb) / 255));
          if (na > 0) {
            r = Math.min(255, pr / na);
            g = Math.min(255, pg / na);
            b = Math.min(255, pb / na);
            a = na * 255;
          }
        } else {
          r = Math.min(255, r + lr);
          g = Math.min(255, g + lg);
          b = Math.min(255, b + lb);
        }
      }
      const j = i * 4;
      out[j] = r;
      out[j + 1] = g;
      out[j + 2] = b;
      out[j + 3] = a;
    }
    return out;
  }

  // src/core/scene.js
  var SKY = hex("#15131d");
  var SKY_TOP = hex("#0d0b14");
  var SKY_LOW = hex("#221d33");
  var FLOOR_EDGE = hex("#4a4263");
  var FLOOR = hex("#2b2639");
  var FLOOR_DARK = hex("#211d2d");
  var MORTAR = hex("#1a1724");

  // src/core/rig.js
  var PAL2 = Object.fromEntries(Object.entries(DUMMY_PAL).map(([k, v]) => [k, hex(v) >>> 0]));
  var INK2 = PAL2.k;
  var SEAM = PAL2.J;
  var MARK = PAL2.m;
  var SHELL = [PAL2.A, PAL2.B, PAL2.C, PAL2.D];
  var CORE = [PAL2.E, PAL2.F, PAL2.G, PAL2.G];
  var DEG = Math.PI / 180;
  var add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  var sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  var mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  var dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  var cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  var len = (a) => Math.hypot(a[0], a[1], a[2]);
  var unit = (a) => mul(a, 1 / (len(a) || 1e-6));
  var rotY = (t) => {
    const c = Math.cos(t), s = Math.sin(t);
    return [c, 0, s, 0, 1, 0, -s, 0, c];
  };
  var rotZ = (t) => {
    const c = Math.cos(t), s = Math.sin(t);
    return [c, -s, 0, s, c, 0, 0, 0, 1];
  };
  var mm = (A, B2) => {
    const o = new Array(9);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o[r * 3 + c] = A[r * 3] * B2[c] + A[r * 3 + 1] * B2[3 + c] + A[r * 3 + 2] * B2[6 + c];
    return o;
  };
  var mv = (M2, v) => [M2[0] * v[0] + M2[1] * v[1] + M2[2] * v[2], M2[3] * v[0] + M2[4] * v[1] + M2[5] * v[2], M2[6] * v[0] + M2[7] * v[1] + M2[8] * v[2]];
  var clamp01 = (v) => Math.max(0, Math.min(1, v));
  var M = {
    pelvis: 19.7,
    spine1: 2.8,
    spine2: 4.6,
    shoulderUp: 2.5,
    shoulderOut: 5.9,
    neckUp: 4,
    headUp: 3.1,
    hipDown: 1.1,
    hipOut: 2.8,
    thigh: 8.6,
    shin: 8.3,
    upper: 7.6,
    fore: 7.4,
    turn: 36 * DEG
  };
  var STAND = { lean: 0, crouch: 0, yaw: 0, fx: -3, fy: -15, bx: 5, by: -15, ffx: -2, ffy: -4, fbx: 3, fby: -4 };
  function ik(a, target, L1, L2, pole) {
    let to = sub(target, a), d = len(to);
    const reach = L1 + L2 - 0.02;
    if (d > reach) {
      to = mul(to, reach / d);
      d = reach;
    }
    const u = unit(to), along = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - along * along));
    let v = sub(pole, mul(u, dot(pole, u)));
    v = len(v) < 1e-4 ? unit(cross(u, [0, 0, 1])) : unit(v);
    return { joint: add(a, add(mul(u, along), mul(v, h))), end: add(a, to), u, v };
  }
  function frame(t, R) {
    return { t, R };
  }
  function boneFrame(a, b, pole) {
    const x = unit(sub(b, a));
    let y = sub(pole, mul(x, dot(pole, x)));
    y = len(y) < 1e-4 ? unit(cross(x, [0, 0, 1])) : unit(y);
    const z = cross(x, y);
    return frame(a, [x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]]);
  }
  var weaponOf = (name) => WEAPONS[name];
  function solve(pose) {
    const q = { ...STAND, ...pose }, lean = q.lean, W = q.weapon && weaponOf(q.weapon), OW = q.offWeapon && weaponOf(q.offWeapon);
    const sa = q.sa ?? 0, wl = q.wl ?? 1, axisZ = Math.sqrt(Math.max(0, 1 - wl * wl)) * (q.wz ?? 1);
    const axis = [Math.cos(sa) * wl, -Math.sin(sa) * wl, axisZ], side = [-Math.sin(sa), -Math.cos(sa), 0];
    const two = !!(q.two && W), nearZ = q.fz ?? (two ? 3 : 4.5);
    const fwd = (q.fx - STAND.fx) / 24, farFwd = two ? 0 : (q.bx - STAND.bx) / 22;
    let turn = M.turn + (fwd >= 0 ? -44 * DEG * Math.min(1, fwd) : 28 * DEG * Math.min(1, -fwd * 1.8));
    turn += (farFwd > 0 ? 34 * DEG * Math.min(1, farFwd) : 0) + (q.twist ?? 0) * 4 * DEG;
    if (q.turn !== void 0) turn = q.turn;
    const hipTurn = M.turn + (turn - M.turn) * 0.45, tilt = Math.atan2(lean, 13);
    const Rp = mm(rotZ(-tilt * 0.25), rotY(-hipTurn)), Rc = mm(rotZ(-tilt), rotY(-turn));
    const ankleN = [q.ffx, -q.ffy - 1.8, q.fzz ?? 2.4], ankleF = [q.fbx, -q.fby - 1.8, q.bzz ?? -2.4];
    let pelvis = [lean * 0.2, M.pelvis - q.crouch, 0];
    const hipAt = (s) => add(pelvis, mv(Rp, [0, -M.hipDown, s * M.hipOut]));
    const maxLeg = (M.thigh + M.shin) * 0.995;
    for (const [s, a] of [[1, ankleN], [-1, ankleF]]) {
      const h = hipAt(s), dx = h[0] - a[0], dz = h[2] - a[2], flat = dx * dx + dz * dz;
      if (flat < maxLeg * maxLeg) {
        const top = a[1] + Math.sqrt(maxLeg * maxLeg - flat);
        if (h[1] > top) pelvis = [pelvis[0], pelvis[1] - (h[1] - top), pelvis[2]];
      }
    }
    const waist = add(pelvis, [Math.sin(tilt * 0.45) * M.spine1, Math.cos(tilt * 0.45) * M.spine1, 0]);
    const chest = add(waist, [Math.sin(tilt) * M.spine2, Math.cos(tilt) * M.spine2, 0]);
    const neck = add(chest, mv(Rc, [0, M.neckUp, 0]));
    const headTurn = M.turn * 0.9 + (turn - M.turn) * 0.35, nod = tilt * 0.35 + (q.hy ?? 0) * 7 * DEG, roll = (q.hx ?? 0) * 7 * DEG;
    const Rh = mm(rotZ(-nod - roll), rotY(-headTurn));
    const head = add(neck, mv(Rh, [0.15, M.headUp, 0]));
    const pick = (s, target) => {
      const base = add(chest, mv(Rc, [0, M.shoulderUp, s * M.shoulderOut])), to = sub(target, base), d = len(to);
      return add(base, mul(unit(to), Math.min(1.8, Math.max(0, d - 11) * 0.35)));
    };
    const nearT = [q.fx, -q.fy, nearZ];
    const farT = two ? [q.fx + axis[0] * W.two, -q.fy + axis[1] * W.two, nearZ + axis[2] * W.two] : [q.bx, -q.by, q.bz ?? (q.armsFront ? 5.5 : -4.5)];
    const sN = pick(1, nearT), sF = pick(-1, farT);
    const pole = (s, T, shoulder, hold) => {
      const up = clamp01((T[1] - shoulder[1] + 2) / 10);
      const base = [-0.55 + up * 1.1, -1 + up * 0.9, s * (0.45 + up * 0.5)];
      if (!hold) return base;
      const u = unit(sub(T, shoulder));
      let best = base, score = Infinity;
      for (let i = 0; i < 16; i++) {
        const a = i / 16 * Math.PI * 2, x = unit(cross(u, [0.3, 1, 0.2])), y = cross(u, x), v = add(mul(x, Math.cos(a)), mul(y, Math.sin(a)));
        const A = ik(shoulder, T, M.upper, M.fore, v), f = unit(sub(A.end, A.joint));
        const cost = Math.abs(dot(f, hold)) * 0.7 + (1 - dot(unit(base), v)) * 0.55;
        if (cost < score) {
          score = cost;
          best = v;
        }
      }
      return best;
    };
    const holdN = W ? W.across ? side : axis : null, holdF = two ? W.across ? side : axis : OW ? [Math.cos(q.sb ?? Math.PI), -Math.sin(q.sb ?? Math.PI), 0] : null;
    const armN = ik(sN, nearT, M.upper, M.fore, pole(1, nearT, sN, holdN)), armF = ik(sF, farT, M.upper, M.fore, pole(-1, farT, sF, holdF));
    const kneePole = (s) => mv(Rp, [1, 0, s * 0.35]);
    const hipN = hipAt(1), hipF = hipAt(-1);
    const legN = ik(hipN, ankleN, M.thigh, M.shin, kneePole(1)), legF = ik(hipF, ankleF, M.thigh, M.shin, kneePole(-1));
    const footDir = (s) => {
      const t = hipTurn * 0.6 + s * 8 * DEG;
      return [Math.cos(t), 0, Math.sin(t)];
    };
    const B2 = {
      pelvis: frame(pelvis, Rp),
      waist: frame(waist, mm(rotZ(-tilt * 0.6), rotY(-(turn + hipTurn) / 2))),
      chest: frame(chest, Rc),
      head: frame(head, Rh),
      neck: frame(neck, Rh),
      upperN: boneFrame(sN, armN.joint, armN.v),
      foreN: boneFrame(armN.joint, armN.end, armN.v),
      upperF: boneFrame(sF, armF.joint, armF.v),
      foreF: boneFrame(armF.joint, armF.end, armF.v),
      thighN: boneFrame(hipN, legN.joint, legN.v),
      shinN: boneFrame(legN.joint, legN.end, legN.v),
      thighF: boneFrame(hipF, legF.joint, legF.v),
      shinF: boneFrame(legF.joint, legF.end, legF.v)
    };
    B2.footN = frame(legN.end, mm(rotY(-Math.atan2(footDir(1)[2], footDir(1)[0])), rotZ(q.toeF ? -55 * DEG : 0)));
    B2.footF = frame(legF.end, mm(rotY(-Math.atan2(footDir(-1)[2], footDir(-1)[0])), rotZ(q.toeB ? -55 * DEG : 0)));
    return { B: B2, W, OW, q, axis, side, armN, armF, legN, legF, sN, sF, hipN, hipF, turn };
  }
  var BW = 300;
  var BH = 240;
  var OX = 150;
  var OY = 180;
  var Zb = new Float32Array(BW * BH);
  var Tone = new Float32Array(BW * BH);
  var Part = new Int8Array(BW * BH);
  var Mat = new Int8Array(BW * BH);
  var Fr = new Int8Array(BW * BH);
  var LX = new Float32Array(BW * BH);
  var LY = new Float32Array(BW * BH);
  var Col = new Uint32Array(BW * BH);
  var touched = [];
  var LIGHT = unit([-0.55, 0.72, 0.5]);
  var curFrameIndex = 0;
  var onlyPart = 0;
  function plot(i, z, tone, part, mat, wx, wy, color) {
    if (onlyPart && part !== onlyPart) return;
    if (Part[i] === 0) touched.push(i);
    else if (z <= Zb[i]) return;
    Zb[i] = z;
    Tone[i] = tone;
    Part[i] = part;
    Mat[i] = mat;
    Fr[i] = curFrameIndex;
    LX[i] = wx;
    LY[i] = wy;
    Col[i] = color;
  }
  var PART = { pelvis: 1, waist: 2, chest: 3, neck: 4, head: 5, face: 6, upperN: 7, elbowN: 8, foreN: 9, handN: 10, upperF: 11, elbowF: 12, foreF: 13, handF: 14, thighN: 15, kneeN: 16, shinN: 17, footN: 18, thighF: 19, kneeF: 20, shinF: 21, footF: 22, weapon: 23, offWeapon: 24 };
  var STEEL = Object.fromEntries(Object.entries({ hi: "#ffffff", a: "#e8edf6", b: "#a4afc6", d: "#68748f", gold: "#ffd84a", goldD: "#b8862a", grip: "#7a3a2a", gripD: "#4a2018", wood: "#8a5a32", woodD: "#5a3820", dark: "#3a3448", darkD: "#262033", olive: "#58663f", oliveA: "#7d8c58", oliveD: "#3a4529" }).map(([k, v]) => [k, hex(v) >>> 0]));
  function blade(T, from, length, w) {
    for (let i = from; i <= from + length + 0.01; i += 0.4) {
      const r = i - from, wd = r > length - 5 ? Math.max(0, (length - r) / 5 * w) : w;
      for (let k = -wd; k <= wd + 0.01; k += 0.4) T(i, k, k < -w * 0.4 ? STEEL.hi : k > w * 0.4 ? STEEL.d : STEEL.a);
    }
  }
  var haft = (T, from, to, a, d, r = 0.8) => {
    for (let i = from; i <= to; i += 0.4) for (let k = -r; k <= r + 0.01; k += 0.4) T(i, k, k > 0.1 ? d : a);
  };
  var WEAPONS = {
    // the fist is at i = 0; `two` is where the other hand goes; `across`: the handle lies across the weapon's length
    sword: { two: -4.4, draw(T, q) {
      const end = q.two ? -6.5 : -2.6;
      haft(T, end, 2.2, STEEL.grip, STEEL.gripD);
      for (let k = -1.4; k <= 1.4; k += 0.4) T(end - 0.4, k, STEEL.gold);
      for (let k = -4.6; k <= 4.6; k += 0.4) T(2.6, k, Math.abs(k) > 3.8 ? STEEL.goldD : STEEL.gold), T(3, k, STEEL.goldD);
      blade(T, 3.2, 25, 2.2);
    } },
    greatsword: { two: -4.8, draw(T) {
      haft(T, -7.2, 2.2, STEEL.grip, STEEL.gripD);
      for (let k = -1.8; k <= 1.8; k += 0.4) T(-7.6, k, STEEL.gold);
      for (let k = -6.6; k <= 6.6; k += 0.4) T(2.6, k, Math.abs(k) > 5.6 ? STEEL.goldD : STEEL.gold), T(3, k, STEEL.goldD);
      blade(T, 3.2, 31, 3);
      for (let i = 4; i <= 28; i += 0.4) T(i, 0, STEEL.b);
    } },
    dagger: { draw(T) {
      haft(T, -2.4, 1.8, STEEL.grip, STEEL.gripD);
      for (let k = -2.6; k <= 2.6; k += 0.4) T(2.2, k, STEEL.goldD);
      blade(T, 2.6, 10, 1.3);
    } },
    spear: { two: -12, draw(T) {
      haft(T, -18, 36, STEEL.wood, STEEL.woodD, 0.5);
      blade(T, 36, 11, 2);
      for (let k = -2.4; k <= 2.4; k += 0.4) T(36, k, STEEL.goldD);
    } },
    hammer: { two: -7, draw(T) {
      for (const lift of [-0.8, 0, 0.8]) for (let i = -10; i <= 18; i += 0.4) for (let k = -0.8; k <= 0.81; k += 0.4) T(i, k, k > 0.1 ? STEEL.woodD : STEEL.wood, lift);
      for (let i = 18; i <= 28; i += 0.4) for (let k = -9; k <= 9; k += 0.4) {
        const face = Math.abs(k) > 7.4 ? k < 0 ? STEEL.a : STEEL.d : i < 20 ? STEEL.hi : i > 26.4 ? STEEL.d : Math.abs(k) < 2 ? STEEL.gold : STEEL.b;
        T(i, k, face, 4.5);
        T(i, k, face, -4.5);
        if (i < 18.4 || i > 27.6 || Math.abs(k) > 8.6) for (let l = -4; l <= 4; l += 0.4) T(i, k, k < 0 ? STEEL.a : i > 27.6 ? STEEL.d : STEEL.b, l);
      }
    } },
    scythe: { two: -11, draw(T) {
      haft(T, -16, 31, STEEL.dark, STEEL.darkD, 0.5);
      for (let j = 0; j <= 28; j += 0.4) {
        const u = j / 28, w = 3.2 * (1 - u) + 0.3, b = 31.5 - u * u * 12;
        for (let k = -w; k <= w; k += 0.4) T(b + k, j + 0.8, k > w * 0.3 ? STEEL.hi : k < -w * 0.4 ? STEEL.d : STEEL.b);
      }
    } },
    claw: { draw(T) {
      for (const q0 of [-2.4, 0, 2.4])
        for (let i = 2; i <= 9.5; i += 0.4) {
          const u = (i - 2) / 7.5, k = q0 + u * u * 1.8;
          T(i, k, u > 0.55 ? STEEL.hi : STEEL.a);
          if (u < 0.6) T(i, k + 0.8, STEEL.d);
        }
    } },
    bow: { across: true, draw(T, q, off) {
      for (let u = -1; u <= 1.001; u += 0.025) {
        const k = u * 17, i = 6 * (1 - u * u) - 1;
        T(i, k, Math.abs(u) > 0.85 ? STEEL.goldD : STEEL.wood);
        T(i + 0.8, k, STEEL.woodD);
      }
      const tipA = T.at(-1, -17), tipB = T.at(-1, 17), mid = q.pull ? off : T.at(-1, 0);
      const line = (A, B2, c) => {
        const n = Math.max(2, Math.ceil(len(sub(B2, A)) / 0.4)), Z = STEEL.a;
        for (let k = 0; k <= n; k++) {
          const P2 = add(A, mul(sub(B2, A), k / n)), wx = Math.round(P2[0]), wy = Math.round(P2[1]), idx = (OY - wy) * BW + (OX + wx);
          curFrameIndex = -1;
          plot(idx, P2[2] + 0.05, 2, PART.weapon, 2, wx, wy, c ?? Z);
        }
      };
      line(tipA, mid);
      line(tipB, mid);
      if (q.nocked) {
        const nock = mid, tip = T.at(13, 0);
        line(nock, tip, STEEL.wood);
        for (let i = 9; i <= 13; i += 0.4) for (let k = -(13 - i) * 0.45; k <= (13 - i) * 0.45; k += 0.4) T(i, k, STEEL.hi);
      }
    } },
    pistol: { across: true, draw(T) {
      for (let i = -1; i <= 9.5; i += 0.4) for (let k = -4.2; k <= -2.4; k += 0.4) T(i, k, k < -3.6 ? STEEL.a : k > -2.9 ? STEEL.d : STEEL.b);
      for (let i = -1.2; i <= 1.2; i += 0.4) for (let k = -2.4; k <= 2.4; k += 0.4) T(i, k, STEEL.gripD);
      T(9, -4.6, STEEL.hi);
    } },
    launcher: { two: -9, draw(T) {
      for (let i = -14; i <= 22; i += 0.4) for (let k = -6; k <= -1; k += 0.4) T(i, k, k < -4.8 ? STEEL.oliveA : k > -2.2 ? STEEL.oliveD : Math.abs(i - 3) < 1.4 ? STEEL.gold : STEEL.olive);
      for (let k = -6.8; k <= -0.2; k += 0.4) T(22.4, k, STEEL.b), T(-14.4, k, STEEL.d);
    } },
    handle: { draw(T) {
      haft(T, -2.6, 6, STEEL.grip, STEEL.gripD);
      for (let k = -1.6; k <= 1.6; k += 0.4) T(-3, k, STEEL.gold), T(6.4, k, STEEL.gold);
    } }
  };
  var REST_FRAMES = null;
  REST_FRAMES = solve({}).B;

  // src/core/act.js
  var TW = 38;
  var TH = 52;
  var TP = Object.fromEntries(Object.entries({ ink: "#0b0a1a", wood: "#724c2e", woodL: "#a0703a", woodD: "#4e331f", straw: "#d2aa55", strawL: "#f0d98a", burlapD: "#86643a", burlap: "#b38b57", burlapL: "#c9a26c", red: "#9a2f3c", redL: "#c4434f", white: "#ffffff" }).map(([k, v]) => [k, hex(v)]));
  var DUST = ["#efe7dc", "#c9bfb8", "#8f8693", "#5a5468"].map(hex);
  var DUMMY = new Uint32Array(TW * TH);
  (function buildDummy() {
    const px = (x, y, c) => {
      if (x >= 0 && y >= 0 && x < TW && y < TH) DUMMY[y * TW + x] = c;
    };
    const R = (x, y, w, h, c) => {
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(x + i, y + j, c);
    };
    R(15, 38, 8, 14, TP.ink);
    R(16, 34, 6, 18, TP.wood);
    R(16, 34, 2, 18, TP.woodL);
    R(20, 34, 2, 18, TP.woodD);
    R(1, 18, 36, 1, TP.ink);
    R(1, 23, 36, 1, TP.ink);
    R(1, 19, 36, 4, TP.wood);
    R(1, 19, 36, 1, TP.woodL);
    R(1, 22, 36, 1, TP.woodD);
    for (const [bx, s] of [[0, -1], [33, 1]]) {
      R(bx, 17, 5, 8, TP.straw);
      for (const [dx, dy, c] of [[2, 16, TP.straw], [3, 15, TP.strawL], [1, 17, TP.strawL], [2, 25, TP.straw], [1, 26, TP.strawL], [3, 25, TP.burlapD], [2, 19, TP.strawL], [3, 21, TP.strawL], [1, 22, TP.burlapD], [2, 23, TP.strawL]]) px(bx + dx, dy, c);
      px(s < 0 ? bx - 1 : bx + 5, 19, TP.straw);
      px(s < 0 ? bx - 1 : bx + 5, 22, TP.strawL);
    }
    const sack = (x, y, w, h) => {
      R(x + 1, y, w - 2, 1, TP.ink);
      R(x + 1, y + h - 1, w - 2, 1, TP.ink);
      R(x, y + 1, 1, h - 2, TP.ink);
      R(x + w - 1, y + 1, 1, h - 2, TP.ink);
      R(x + 1, y + 1, w - 2, h - 2, TP.burlap);
      R(x + w - 4, y + 1, 3, h - 2, TP.burlapD);
      R(x + 1, y + h - 3, w - 2, 2, TP.burlapD);
      R(x + 1, y + 1, 1, h - 4, TP.burlapL);
      R(x + 1, y + 1, w - 6, 1, TP.burlapL);
      for (let j = y + 2; j < y + h - 2; j += 3) for (let i = x + 3 + j % 2; i < x + w - 4; i += 4) px(i, j, TP.burlapD);
    };
    sack(9, 17, 20, 24);
    for (let y = 19; y < 36; y++) for (let x = 11; x < 27; x++) {
      const d = Math.hypot(x - 18.5, y - 27);
      if (d > 4 && d < 5.4 || d < 1.9) px(x, y, x + y < 45 ? TP.redL : TP.red);
    }
    for (let x = 10; x < 28; x++) {
      px(x, 36, x & 1 ? TP.woodL : TP.straw);
      px(x, 37, x & 1 ? TP.woodD : TP.wood);
    }
    for (const [x, y, c] of [[11, 41, TP.straw], [12, 42, TP.strawL], [14, 41, TP.strawL], [15, 42, TP.straw], [23, 41, TP.straw], [24, 42, TP.strawL], [26, 41, TP.straw], [13, 43, TP.straw], [25, 43, TP.straw]]) px(x, y, c);
    sack(10, 1, 18, 16);
    for (const ex of [14, 23]) for (let d = -2; d <= 2; d++) {
      px(ex + d, 7 + d, TP.ink);
      px(ex - d, 7 + d, TP.ink);
    }
    for (let x = 14; x < 24; x++) px(x, 12, x & 1 ? TP.ink : TP.burlapD);
    for (const x of [15, 18, 21]) {
      px(x, 11, TP.ink);
      px(x, 13, TP.ink);
    }
    for (let x = 12; x < 26; x++) {
      px(x, 16, x & 1 ? TP.woodL : TP.straw);
      px(x, 17, x & 1 ? TP.wood : TP.woodD);
    }
    for (const [x, y, c] of [[13, 0, TP.straw], [15, 0, TP.strawL], [18, 0, TP.straw], [21, 0, TP.strawL], [24, 0, TP.straw], [9, 4, TP.straw], [28, 6, TP.straw], [8, 7, TP.strawL], [29, 3, TP.strawL]]) px(x, y, c);
  })();
  var SKINS = { flash: [TP.white, 1], char: [hex("#1a0c0e"), 0.72], ice: [hex("#a8e8ff"), 0.72], shadow: [hex("#3a1a70"), 0.5], holy: [hex("#fff4c0"), 0.5], red: [hex("#ff2040"), 0.45], shock: [hex("#8fd6ff"), 0.6], poison: [hex("#58c43a"), 0.5] };
  var STRAW = [TP.strawL, TP.straw, TP.straw, TP.burlapD, TP.burlapD];
  var REST_MASK = new Uint8Array(24 * 38);
  var REST_PX = new Uint32Array(24 * 38);
  HERO2.forEach((row, r) => [...row].forEach((ch, c) => {
    if (ch !== ".") {
      REST_MASK[r * 24 + c] = 1;
      REST_PX[r * 24 + c] = hex(DUMMY_PAL[ch]);
    }
  }));
  var NEAREST = new Int16Array(24 * 38).fill(-1);
  for (let r = 0; r < 38; r++)
    for (let c = 0; c < 24; c++) {
      let best = -1, bd = 1e9;
      for (let y = Math.max(0, r - 7); y < Math.min(38, r + 8); y++)
        for (let x = Math.max(0, c - 7); x < Math.min(24, c + 8); x++) {
          const d = (x - c) * (x - c) + (y - r) * (y - r);
          if (REST_MASK[y * 24 + x] && d < bd) {
            bd = d;
            best = y * 24 + x;
          }
        }
      NEAREST[r * 24 + c] = best;
    }

  // src/fx/lightning/zap-hit.js
  var zap_hit_exports = {};
  __export(zap_hit_exports, {
    create: () => create,
    meta: () => meta
  });

  // src/fx/lightning/_lib.js
  var VOLT = ["#120a33", "#2a1b78", "#4630c0", "#5a62f0", "#58a6ff", "#9ed8ff", "#e4f6ff", "#ffffff"];
  var SOOT = hex("#110c16");
  var SOOT2 = hex("#1c1522");
  function zigzag(R, x0, y0, x1, y1, jag = 0.32, forks = 0.35, w = 1, depth = 0) {
    const out = { paths: [] }, L = Math.hypot(x1 - x0, y1 - y0);
    let pts = [[x0, y0], [x1, y1]], off = L * jag;
    while (pts.length < 2 + L / 3) {
      const nxt = [pts[0]];
      for (let i = 0; i < pts.length - 1; i++) {
        const [ax, ay] = pts[i], [bx, by] = pts[i + 1], l = Math.hypot(bx - ax, by - ay) || 1, o = R.range(-off, off);
        nxt.push([(ax + bx) / 2 + -(by - ay) / l * o, (ay + by) / 2 + (bx - ax) / l * o], [bx, by]);
      }
      pts = nxt;
      off *= 0.52;
    }
    out.paths.push({ pts, w });
    if (depth < 2) {
      for (let i = 2; i < pts.length - 3; i++)
        if (R.chance(forks / (1 + depth) / Math.max(4, pts.length / 6))) {
          const [ax, ay] = pts[i], [bx, by] = pts[Math.min(pts.length - 1, i + 3)];
          const a = Math.atan2(by - ay, bx - ax) + R.sign() * R.range(0.35, 0.9), l = (L - i / pts.length * L) * R.range(0.25, 0.55);
          out.paths.push(...zigzag(R, ax, ay, ax + Math.cos(a) * l, ay + Math.sin(a) * l, jag * 1.1, forks, w * 0.55, depth + 1).paths);
        }
    }
    return out;
  }
  var N = 1024;
  var HALF = 512;
  var GRID = new Uint8Array(N * N);
  var HIT = [];
  function mark(x, y, lvl) {
    const X = Math.floor(x) + HALF, Y = Math.floor(y) + HALF;
    if (X < 0 || Y < 0 || X >= N || Y >= N) return;
    const i = Y * N + X, v = GRID[i];
    if (!v) HIT.push(i);
    if (lvl > v) GRID[i] = lvl;
  }
  function stamp(x, y, r, lvl) {
    if (r <= 0.5) return mark(Math.round(x), Math.round(y), lvl);
    const r2 = r * r;
    for (let py = Math.floor(y - r); py <= Math.ceil(y + r); py++) {
      const dy = py + 0.5 - y;
      for (let px = Math.floor(x - r); px <= Math.ceil(x + r); px++) {
        const dx = px + 0.5 - x;
        if (dx * dx + dy * dy <= r2) mark(px, py, lvl);
      }
    }
  }
  function flush(p, cols, alphas) {
    for (const i of HIT) {
      const v = GRID[i];
      GRID[i] = 0;
      const x = i % N - HALF, y = (i / N | 0) - HALF, a = alphas ? alphas[v - 1] : 1;
      if (a >= 1) p.px(x, y, cols[v - 1]);
      else if (a > 0) p.dot(x, y, cols[v - 1], a);
    }
    HIT.length = 0;
  }
  var walk = (pts, fn) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1], l = Math.max(1, Math.hypot(bx - ax, by - ay));
      for (let d = 0; d <= l; d += 0.5) fn(ax + (bx - ax) * d / l, ay + (by - ay) * d / l, i);
    }
  };
  function stroke(p, b, k, C, s = 1, o = {}) {
    if (k <= 0.02) return;
    const lk = o.light ?? 0.5;
    for (const q of b.paths) {
      const trunk = q.w >= 1;
      if (!trunk && k < 0.5) continue;
      const rh = (trunk ? k > 0.6 ? 2.1 : 1.6 : 1.1) * s, rb = (trunk ? k > 0.6 ? 1.3 : 0.8 : 0.5) * s;
      const pts = o.upTo !== void 0 && trunk ? q.pts.slice(0, Math.max(2, Math.ceil(q.pts.length * o.upTo))) : q.pts;
      walk(pts, (x, y) => {
        stamp(x, y, rh, 1);
        stamp(x, y, rb, trunk ? 3 : 2);
        if (trunk && k > 0.3) o.core ? stamp(x, y, o.core, 4) : mark(x, y, 4);
      });
      for (let i = 0; i < pts.length - 1; i += 3) if (o.minY === void 0 || pts[i][1] > o.minY) p.glow(pts[i][0], pts[i][1], (trunk ? 14 : 7) * s, C[4], lk * k * q.w);
    }
    const a = o.a ?? 1;
    flush(p, o.hero ? [C[3], C[6], C[7], C[7]] : [C[2], C[4], C[5], C[7]], [a, a, a, a]);
  }
  function crackle(p, b, k, C, glowK = 0.5, a = 1) {
    if (k <= 0.02) return;
    for (const q of b.paths) {
      const thick = q.w >= 1;
      walk(q.pts, (x, y) => {
        if (k > 0.45 && thick) for (const [dx, dy] of CROSS2) mark(x + dx * 1.5, y + dy * 1.5, 1);
        if (k > 0.25 && (thick || q.w > 0.4)) mark(x + 1, y, 2), mark(x, y + 1, 2);
        mark(x, y, thick && k > 0.3 ? 4 : 3);
      });
      for (let i = 0; i < q.pts.length - 1; i += 3) p.glow(q.pts[i][0], q.pts[i][1], (thick ? 9 : 5) * (0.5 + k * 0.5), C[4], glowK * k * q.w);
    }
    flush(p, [C[3], C[5], C[5], C[7]], [Math.min(1, (k - 0.45) * 1.6) * a, a, a, a]);
  }
  var CROSS2 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  // src/fx/lightning/zap-hit.js
  var meta = {
    name: "Zap hit",
    desc: "A contact zap: an arc snaps in from the left, the hit point overloads into a knot of tiny crackling zigzags, a fern of burn marks glows outward, sparks jink away, ozone puffs.",
    tags: ["lightning", "electric", "hit", "impact", "combat", "directional", "one-shot"],
    size: [144, 112],
    origin: [76, 56],
    duration: 0.9,
    loop: false,
    fps: 30,
    bg: "dark",
    options: { palette: VOLT, seed: 3 }
  };
  var SNAP = 0.05;
  var ASH = hex("#6a6680");
  function fern(R) {
    const out = [];
    const grow = (x, y, a, len2, w, d, depth) => {
      const pts = [[x, y, d]];
      let side = R.sign();
      for (let s = 0; s < len2; s += 1.4) {
        a += R.range(-0.3, 0.3);
        x += Math.cos(a) * 1.4;
        y += Math.sin(a) * 1.4;
        d += 1.4;
        pts.push([x, y, d]);
        if (depth < 2 && s > 2 && R.chance(0.24)) {
          side = -side;
          grow(x, y, a + side * R.range(0.55, 1.05), (len2 - s) * R.range(0.3, 0.55), w * 0.6, d, depth + 1);
        }
      }
      out.push({ pts, w });
    };
    for (let i = 0; i < 6; i++) grow(0, 0, i / 6 * TAU + R.range(-0.35, 0.35), R.range(18, 32), 1, 0, 0);
    return out;
  }
  function create(o) {
    const C = fit(o.palette, 8), R = new Rng(o.seed), ps = new Particles({ rng: R }), lights = new Lights();
    const tree = fern(R), Y0 = R.range(-14, 6);
    const kinked = Array.from({ length: 16 }, () => {
      const a = R.range(-1.2, 1.2) + (R.chance(0.7) ? 0 : Math.PI), sp = R.range(130, 250);
      return { x: 0, y: 0, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40, life: R.range(0.2, 0.36), age: -SNAP, next: R.range(0.02, 0.05), trail: [] };
    });
    let t = 0, hit = false;
    return {
      update(dt) {
        t += dt;
        if (!hit && t >= SNAP) {
          hit = true;
          lights.add(0, 0, 60, C[4], 0.7, 0.3);
          lights.add(0, 0, 14, WHITE, 0.5, 0.07);
          for (let i = 0; i < 3; i++) ps.spawn(P.SMOKE, R.range(-3, 5), R.range(-4, 2), R.range(-5, 8), -R.range(8, 16), R.range(0.55, 0.75), mix(ASH, C[4], 0.3), R.range(2.5, 3.8), R.range(0.08, 0.16));
        }
        for (const s of kinked) {
          if ((s.age += dt) < 0 || s.age >= s.life) continue;
          if ((s.next -= dt) <= 0) {
            s.next = R.range(0.025, 0.055);
            const sp = Math.hypot(s.vx, s.vy), a = Math.atan2(s.vy, s.vx) + R.sign() * R.range(0.6, 1.3);
            s.vx = Math.cos(a) * sp;
            s.vy = Math.sin(a) * sp;
            s.trail.push([s.x, s.y]);
            if (s.trail.length > 4) s.trail.shift();
          }
          s.vx -= s.vx * 3 * dt;
          s.vy -= s.vy * 3 * dt - 140 * dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
        }
        ps.update(dt);
        lights.update(dt);
      },
      drawBack(p) {
        if (t < SNAP) return;
        const cool = smooth(0.45, 0.85, t), fade = 1 - smooth(0.78, 0.88, t);
        for (const br of tree)
          for (let i = 1; i < br.pts.length; i++) {
            const [x0, y0] = br.pts[i - 1], [x, y, d] = br.pts[i], age = t - SNAP - d / 260;
            if (age < 0) break;
            const k = Math.exp(-age / 0.22) - cool * 0.3, c = k > 0.75 ? WHITE : k > 0.45 ? C[6] : k > 0.25 ? C[5] : k > 0.1 ? C[4] : k > -0.05 ? C[2] : C[1];
            p.line(x0, y0, x, y, c, fade);
            if (br.w >= 1 && d < 9) p.line(x0 + 1, y0, x + 1, y, k > 0.45 ? C[5] : C[2], fade);
            if ((i & 3) === 0 && k > 0) p.glow(x, y, 5, C[5], 0.35 * k * fade);
          }
        ps.draw(p, "back");
      },
      draw(p) {
        const f = Math.floor(t * 30 + 1e-4);
        if (t < 0.32) {
          const r = rng(o.seed, 2, f), b = zigzag(r, -66, Y0, 0, 0, 0.22, 0.35), u = clamp(t / SNAP);
          const k = t < SNAP ? 1 : t < 0.2 ? f % 2 ? 0.7 : 1 : 0.55 * (1 - (t - 0.2) / 0.12);
          stroke(p, u < 1 ? { paths: [b.paths[0]] } : b, k, C, t < SNAP + 0.034 ? 0.95 : 0.7, { upTo: u, hero: t >= SNAP && t < SNAP + 0.034 });
          if (u < 1) {
            const tp = b.paths[0].pts, [hx, hy] = tp[Math.floor(u * (tp.length - 1))];
            p.circle(hx, hy, 2, WHITE);
            p.glow(hx, hy, 14, C[5], 0.6);
          }
        }
        if (t >= SNAP && t < 0.45) {
          const a = (t - SNAP) / 0.4, r = rng(o.seed, 5, f), R0 = 8 * (1 - a * 0.6), m = Math.round(11 * (1 - a * 0.5));
          for (let i = 0; i < m; i++) {
            const ang = r.range(0, TAU), d0 = r.range(0.5, R0 * 0.5), ang2 = ang + r.range(-1.2, 1.2), d1 = r.range(R0 * 0.55, R0);
            crackle(p, zigzag(r, Math.cos(ang) * d0, Math.sin(ang) * d0, Math.cos(ang2) * d1, Math.sin(ang2) * d1, 0.5, 0), 0.75 * (1 - a) + 0.25, C, 0.25);
          }
          p.circle(0, 0, 3 * (1 - a) + 1, C[5]);
          p.circle(0, 0, 2 * (1 - a) + 0.5, WHITE);
          p.glow(0, 0, 20, C[4], 0.55 * (1 - a));
          if (t < SNAP + 0.07) p.glow(0, 0, 9, WHITE, 0.4);
        }
        for (const s of kinked) {
          if (s.age < 0 || s.age >= s.life) continue;
          const k = 1 - s.age / s.life, path = [...s.trail, [s.x, s.y]];
          for (let i = 0; i < path.length - 1; i++) p.line(path[i][0], path[i][1], path[i + 1][0], path[i + 1][1], i === path.length - 2 ? k > 0.5 ? WHITE : C[6] : k > 0.5 ? C[5] : C[4], 0.6 + 0.4 * (i / path.length));
          p.px(s.x, s.y, k > 0.4 ? WHITE : C[5]);
          p.glow(s.x, s.y, 4, C[5], 0.4 * k);
        }
        if (t >= SNAP) p.glow(0, 0, 40 * Math.max(0, 1 - t / 0.85), C[3], 0.45 * Math.exp(-(t - SNAP) * 5) * (f % 2 ? 0.7 : 1));
        ps.draw(p, "front");
        lights.draw(p);
      }
    };
  }

  // spp-pixelfx-entry.js
  var RES = [320, 180];
  var modules = { ultimate: zap_hit_exports };
  var frame2 = createFrame(...RES);
  var image = new ImageData(...RES);
  var active = [];
  var last = performance.now();
  var canvas;
  var ctx;
  var palette = (rgb2) => {
    const c = rgb2?.startsWith?.("#") ? rgb2 : "#" + (rgb2 || "7df0ff").replaceAll(",", "");
    return ["#07111f", c, "#ffffff"];
  };
  function mount() {
    const host = document.querySelector(".court-wrap");
    if (!host) return;
    canvas = document.createElement("canvas");
    canvas.className = "pixelfx-layer";
    canvas.width = RES[0];
    canvas.height = RES[1];
    ctx = canvas.getContext("2d");
    host.append(canvas);
  }
  function emit(kind, x, y, opts = {}) {
    if (!canvas || !modules[kind]) return;
    const r = canvas.getBoundingClientRect();
    active.push(createFx(modules[kind], { x: x / Math.max(1, r.width) * RES[0], y: y / Math.max(1, r.height) * RES[1], palette: palette(opts.rgb), seed: opts.seed || Date.now(), light: 0.72 }));
    if (active.length > 14) active.shift();
  }
  function emitUltimate(x, y, rgb2, seed) {
    emit("ultimate", x, y, { rgb: rgb2, seed });
  }
  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1e3);
    last = now;
    if (ctx) {
      clearFrame(frame2);
      for (let i = active.length - 1; i >= 0; i--) {
        const f = active[i];
        f.update(dt);
        f.draw(frame2, "back");
        f.draw(frame2, "front");
        if (f.done()) active.splice(i, 1);
      }
      composite(frame2, image.data, null);
      ctx.putImageData(image, 0, 0);
    }
    requestAnimationFrame(tick);
  }
  var style = document.createElement("style");
  style.textContent = ".court-wrap{isolation:isolate}.pixelfx-layer{position:absolute;inset:0;width:100%;height:100%;z-index:8;pointer-events:none;image-rendering:pixelated}";
  document.head.append(style);
  mount();
  window.pixelFx = { ultimate: emitUltimate };
  requestAnimationFrame(tick);
})();
