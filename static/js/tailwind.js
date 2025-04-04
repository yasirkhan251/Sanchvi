(() => {
  var lk = Object.create;
  var En = Object.defineProperty;
  var uk = Object.getOwnPropertyDescriptor;
  var fk = Object.getOwnPropertyNames;
  var ck = Object.getPrototypeOf,
    pk = Object.prototype.hasOwnProperty;
  var Xc = (t) => En(t, "__esModule", { value: !0 });
  var Zc = (t) => {
    if (typeof require != "undefined") return require(t);
    throw new Error('Dynamic require of "' + t + '" is not supported');
  };
  var A = (t, e) => () => (t && (e = t((t = 0))), e);
  var k = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports),
    He = (t, e) => {
      Xc(t);
      for (var r in e) En(t, r, { get: e[r], enumerable: !0 });
    },
    dk = (t, e, r) => {
      if ((e && typeof e == "object") || typeof e == "function")
        for (let i of fk(e))
          !pk.call(t, i) &&
            i !== "default" &&
            En(t, i, {
              get: () => e[i],
              enumerable: !(r = uk(e, i)) || r.enumerable,
            });
      return t;
    },
    ce = (t) =>
      dk(
        Xc(
          En(
            t != null ? lk(ck(t)) : {},
            "default",
            t && t.__esModule && "default" in t
              ? { get: () => t.default, enumerable: !0 }
              : { value: t, enumerable: !0 }
          )
        ),
        t
      );
  var g,
    u = A(() => {
      g = { platform: "", env: {}, versions: { node: "14.17.6" } };
    });
  var hk,
    ge,
    ft = A(() => {
      u();
      (hk = 0),
        (ge = {
          readFileSync: (t) => self[t] || "",
          statSync: () => ({ mtimeMs: hk++ }),
          promises: { readFile: (t) => Promise.resolve(self[t] || "") },
        });
    });
  var Da = k((EB, tp) => {
    u();
    ("use strict");
    var ep = class {
      constructor(e = {}) {
        if (!(e.maxSize && e.maxSize > 0))
          throw new TypeError("`maxSize` must be a number greater than 0");
        if (typeof e.maxAge == "number" && e.maxAge === 0)
          throw new TypeError("`maxAge` must be a number greater than 0");
        (this.maxSize = e.maxSize),
          (this.maxAge = e.maxAge || 1 / 0),
          (this.onEviction = e.onEviction),
          (this.cache = new Map()),
          (this.oldCache = new Map()),
          (this._size = 0);
      }
      _emitEvictions(e) {
        if (typeof this.onEviction == "function")
          for (let [r, i] of e) this.onEviction(r, i.value);
      }
      _deleteIfExpired(e, r) {
        return typeof r.expiry == "number" && r.expiry <= Date.now()
          ? (typeof this.onEviction == "function" &&
              this.onEviction(e, r.value),
            this.delete(e))
          : !1;
      }
      _getOrDeleteIfExpired(e, r) {
        if (this._deleteIfExpired(e, r) === !1) return r.value;
      }
      _getItemValue(e, r) {
        return r.expiry ? this._getOrDeleteIfExpired(e, r) : r.value;
      }
      _peek(e, r) {
        let i = r.get(e);
        return this._getItemValue(e, i);
      }
      _set(e, r) {
        this.cache.set(e, r),
          this._size++,
          this._size >= this.maxSize &&
            ((this._size = 0),
            this._emitEvictions(this.oldCache),
            (this.oldCache = this.cache),
            (this.cache = new Map()));
      }
      _moveToRecent(e, r) {
        this.oldCache.delete(e), this._set(e, r);
      }
      *_entriesAscending() {
        for (let e of this.oldCache) {
          let [r, i] = e;
          this.cache.has(r) ||
            (this._deleteIfExpired(r, i) === !1 && (yield e));
        }
        for (let e of this.cache) {
          let [r, i] = e;
          this._deleteIfExpired(r, i) === !1 && (yield e);
        }
      }
      get(e) {
        if (this.cache.has(e)) {
          let r = this.cache.get(e);
          return this._getItemValue(e, r);
        }
        if (this.oldCache.has(e)) {
          let r = this.oldCache.get(e);
          if (this._deleteIfExpired(e, r) === !1)
            return this._moveToRecent(e, r), r.value;
        }
      }
      set(
        e,
        r,
        {
          maxAge: i = this.maxAge === 1 / 0 ? void 0 : Date.now() + this.maxAge,
        } = {}
      ) {
        this.cache.has(e)
          ? this.cache.set(e, { value: r, maxAge: i })
          : this._set(e, { value: r, expiry: i });
      }
      has(e) {
        return this.cache.has(e)
          ? !this._deleteIfExpired(e, this.cache.get(e))
          : this.oldCache.has(e)
          ? !this._deleteIfExpired(e, this.oldCache.get(e))
          : !1;
      }
      peek(e) {
        if (this.cache.has(e)) return this._peek(e, this.cache);
        if (this.oldCache.has(e)) return this._peek(e, this.oldCache);
      }
      delete(e) {
        let r = this.cache.delete(e);
        return r && this._size--, this.oldCache.delete(e) || r;
      }
      clear() {
        this.cache.clear(), this.oldCache.clear(), (this._size = 0);
      }
      resize(e) {
        if (!(e && e > 0))
          throw new TypeError("`maxSize` must be a number greater than 0");
        let r = [...this._entriesAscending()],
          i = r.length - e;
        i < 0
          ? ((this.cache = new Map(r)),
            (this.oldCache = new Map()),
            (this._size = r.length))
          : (i > 0 && this._emitEvictions(r.slice(0, i)),
            (this.oldCache = new Map(r.slice(i))),
            (this.cache = new Map()),
            (this._size = 0)),
          (this.maxSize = e);
      }
      *keys() {
        for (let [e] of this) yield e;
      }
      *values() {
        for (let [, e] of this) yield e;
      }
      *[Symbol.iterator]() {
        for (let e of this.cache) {
          let [r, i] = e;
          this._deleteIfExpired(r, i) === !1 && (yield [r, i.value]);
        }
        for (let e of this.oldCache) {
          let [r, i] = e;
          this.cache.has(r) ||
            (this._deleteIfExpired(r, i) === !1 && (yield [r, i.value]));
        }
      }
      *entriesDescending() {
        let e = [...this.cache];
        for (let r = e.length - 1; r >= 0; --r) {
          let i = e[r],
            [n, a] = i;
          this._deleteIfExpired(n, a) === !1 && (yield [n, a.value]);
        }
        e = [...this.oldCache];
        for (let r = e.length - 1; r >= 0; --r) {
          let i = e[r],
            [n, a] = i;
          this.cache.has(n) ||
            (this._deleteIfExpired(n, a) === !1 && (yield [n, a.value]));
        }
      }
      *entriesAscending() {
        for (let [e, r] of this._entriesAscending()) yield [e, r.value];
      }
      get size() {
        if (!this._size) return this.oldCache.size;
        let e = 0;
        for (let r of this.oldCache.keys()) this.cache.has(r) || e++;
        return Math.min(this._size + e, this.maxSize);
      }
    };
    tp.exports = ep;
  });
  var rp,
    ip = A(() => {
      u();
      rp = (t) => t && t._hash;
    });
  function An(t) {
    return rp(t, { ignoreUnknown: !0 });
  }
  var np = A(() => {
    u();
    ip();
  });
  function Tt(t) {
    if (((t = `${t}`), t === "0")) return "0";
    if (/^[+-]?(\d+|\d*\.\d+)(e[+-]?\d+)?(%|\w+)?$/.test(t))
      return t.replace(/^[+-]?/, (r) => (r === "-" ? "" : "-"));
    let e = ["var", "calc", "min", "max", "clamp"];
    for (let r of e) if (t.includes(`${r}(`)) return `calc(${t} * -1)`;
  }
  var Cn = A(() => {
    u();
  });
  var sp,
    ap = A(() => {
      u();
      sp = [
        "preflight",
        "container",
        "accessibility",
        "pointerEvents",
        "visibility",
        "position",
        "inset",
        "isolation",
        "zIndex",
        "order",
        "gridColumn",
        "gridColumnStart",
        "gridColumnEnd",
        "gridRow",
        "gridRowStart",
        "gridRowEnd",
        "float",
        "clear",
        "margin",
        "boxSizing",
        "lineClamp",
        "display",
        "aspectRatio",
        "size",
        "height",
        "maxHeight",
        "minHeight",
        "width",
        "minWidth",
        "maxWidth",
        "flex",
        "flexShrink",
        "flexGrow",
        "flexBasis",
        "tableLayout",
        "captionSide",
        "borderCollapse",
        "borderSpacing",
        "transformOrigin",
        "translate",
        "rotate",
        "skew",
        "scale",
        "transform",
        "animation",
        "cursor",
        "touchAction",
        "userSelect",
        "resize",
        "scrollSnapType",
        "scrollSnapAlign",
        "scrollSnapStop",
        "scrollMargin",
        "scrollPadding",
        "listStylePosition",
        "listStyleType",
        "listStyleImage",
        "appearance",
        "columns",
        "breakBefore",
        "breakInside",
        "breakAfter",
        "gridAutoColumns",
        "gridAutoFlow",
        "gridAutoRows",
        "gridTemplateColumns",
        "gridTemplateRows",
        "flexDirection",
        "flexWrap",
        "placeContent",
        "placeItems",
        "alignContent",
        "alignItems",
        "justifyContent",
        "justifyItems",
        "gap",
        "space",
        "divideWidth",
        "divideStyle",
        "divideColor",
        "divideOpacity",
        "placeSelf",
        "alignSelf",
        "justifySelf",
        "overflow",
        "overscrollBehavior",
        "scrollBehavior",
        "textOverflow",
        "hyphens",
        "whitespace",
        "textWrap",
        "wordBreak",
        "borderRadius",
        "borderWidth",
        "borderStyle",
        "borderColor",
        "borderOpacity",
        "backgroundColor",
        "backgroundOpacity",
        "backgroundImage",
        "gradientColorStops",
        "boxDecorationBreak",
        "backgroundSize",
        "backgroundAttachment",
        "backgroundClip",
        "backgroundPosition",
        "backgroundRepeat",
        "backgroundOrigin",
        "fill",
        "stroke",
        "strokeWidth",
        "objectFit",
        "objectPosition",
        "padding",
        "textAlign",
        "textIndent",
        "verticalAlign",
        "fontFamily",
        "fontSize",
        "fontWeight",
        "textTransform",
        "fontStyle",
        "fontVariantNumeric",
        "lineHeight",
        "letterSpacing",
        "textColor",
        "textOpacity",
        "textDecoration",
        "textDecorationColor",
        "textDecorationStyle",
        "textDecorationThickness",
        "textUnderlineOffset",
        "fontSmoothing",
        "placeholderColor",
        "placeholderOpacity",
        "caretColor",
        "accentColor",
        "opacity",
        "backgroundBlendMode",
        "mixBlendMode",
        "boxShadow",
        "boxShadowColor",
        "outlineStyle",
        "outlineWidth",
        "outlineOffset",
        "outlineColor",
        "ringWidth",
        "ringColor",
        "ringOpacity",
        "ringOffsetWidth",
        "ringOffsetColor",
        "blur",
        "brightness",
        "contrast",
        "dropShadow",
        "grayscale",
        "hueRotate",
        "invert",
        "saturate",
        "sepia",
        "filter",
        "backdropBlur",
        "backdropBrightness",
        "backdropContrast",
        "backdropGrayscale",
        "backdropHueRotate",
        "backdropInvert",
        "backdropOpacity",
        "backdropSaturate",
        "backdropSepia",
        "backdropFilter",
        "transitionProperty",
        "transitionDelay",
        "transitionDuration",
        "transitionTimingFunction",
        "willChange",
        "contain",
        "content",
        "forcedColorAdjust",
      ];
    });
  function op(t, e) {
    return t === void 0
      ? e
      : Array.isArray(t)
      ? t
      : [
          ...new Set(
            e
              .filter((i) => t !== !1 && t[i] !== !1)
              .concat(Object.keys(t).filter((i) => t[i] !== !1))
          ),
        ];
  }
  var lp = A(() => {
    u();
  });
  var up = {};
  He(up, { default: () => Ye });
  var Ye,
    Pn = A(() => {
      u();
      Ye = new Proxy({}, { get: () => String });
    });
  function Ra(t, e, r) {
    (typeof g != "undefined" && g.env.JEST_WORKER_ID) ||
      (r && fp.has(r)) ||
      (r && fp.add(r),
      console.warn(""),
      e.forEach((i) => console.warn(t, "-", i)));
  }
  function Ba(t) {
    return Ye.dim(t);
  }
  var fp,
    V,
    Qe = A(() => {
      u();
      Pn();
      fp = new Set();
      V = {
        info(t, e) {
          Ra(Ye.bold(Ye.cyan("info")), ...(Array.isArray(t) ? [t] : [e, t]));
        },
        warn(t, e) {
          ["content-problems"].includes(t) ||
            Ra(
              Ye.bold(Ye.yellow("warn")),
              ...(Array.isArray(t) ? [t] : [e, t])
            );
        },
        risk(t, e) {
          Ra(Ye.bold(Ye.magenta("risk")), ...(Array.isArray(t) ? [t] : [e, t]));
        },
      };
    });
  var In = {};
  He(In, { default: () => Ma });
  function Yr({ version: t, from: e, to: r }) {
    V.warn(`${e}-color-renamed`, [
      `As of Tailwind CSS ${t}, \`${e}\` has been renamed to \`${r}\`.`,
      "Update your configuration file to silence this warning.",
    ]);
  }
  var Ma,
    Qr = A(() => {
      u();
      Qe();
      Ma = {
        inherit: "inherit",
        current: "currentColor",
        transparent: "transparent",
        black: "#000",
        white: "#fff",
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
        zinc: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
        stone: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        },
        red: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        orange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        yellow: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
          950: "#422006",
        },
        lime: {
          50: "#f7fee7",
          100: "#ecfccb",
          200: "#d9f99d",
          300: "#bef264",
          400: "#a3e635",
          500: "#84cc16",
          600: "#65a30d",
          700: "#4d7c0f",
          800: "#3f6212",
          900: "#365314",
          950: "#1a2e05",
        },
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        cyan: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          950: "#083344",
        },
        sky: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        indigo: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        violet: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        purple: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
          950: "#3b0764",
        },
        fuchsia: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75",
          950: "#4a044e",
        },
        pink: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
          950: "#500724",
        },
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
          950: "#4c0519",
        },
        get lightBlue() {
          return (
            Yr({ version: "v2.2", from: "lightBlue", to: "sky" }), this.sky
          );
        },
        get warmGray() {
          return (
            Yr({ version: "v3.0", from: "warmGray", to: "stone" }), this.stone
          );
        },
        get trueGray() {
          return (
            Yr({ version: "v3.0", from: "trueGray", to: "neutral" }),
            this.neutral
          );
        },
        get coolGray() {
          return (
            Yr({ version: "v3.0", from: "coolGray", to: "gray" }), this.gray
          );
        },
        get blueGray() {
          return (
            Yr({ version: "v3.0", from: "blueGray", to: "slate" }), this.slate
          );
        },
      };
    });
  function La(t, ...e) {
    for (let r of e) {
      for (let i in r) t?.hasOwnProperty?.(i) || (t[i] = r[i]);
      for (let i of Object.getOwnPropertySymbols(r))
        t?.hasOwnProperty?.(i) || (t[i] = r[i]);
    }
    return t;
  }
  var cp = A(() => {
    u();
  });
  function Ot(t) {
    if (Array.isArray(t)) return t;
    let e = t.split("[").length - 1,
      r = t.split("]").length - 1;
    if (e !== r)
      throw new Error(`Path is invalid. Has unbalanced brackets: ${t}`);
    return t.split(/\.(?![^\[]*\])|[\[\]]/g).filter(Boolean);
  }
  var qn = A(() => {
    u();
  });
  function he(t, e) {
    return Dn.future.includes(e)
      ? t.future === "all" || (t?.future?.[e] ?? pp[e] ?? !1)
      : Dn.experimental.includes(e)
      ? t.experimental === "all" || (t?.experimental?.[e] ?? pp[e] ?? !1)
      : !1;
  }
  function dp(t) {
    return t.experimental === "all"
      ? Dn.experimental
      : Object.keys(t?.experimental ?? {}).filter(
          (e) => Dn.experimental.includes(e) && t.experimental[e]
        );
  }
  function hp(t) {
    if (g.env.JEST_WORKER_ID === void 0 && dp(t).length > 0) {
      let e = dp(t)
        .map((r) => Ye.yellow(r))
        .join(", ");
      V.warn("experimental-flags-enabled", [
        `You have enabled experimental features: ${e}`,
        "Experimental features in Tailwind CSS are not covered by semver, may introduce breaking changes, and can change at any time.",
      ]);
    }
  }
  var pp,
    Dn,
    ct = A(() => {
      u();
      Pn();
      Qe();
      (pp = {
        optimizeUniversalDefaults: !1,
        generalizedModifiers: !0,
        disableColorOpacityUtilitiesByDefault: !1,
        relativeContentPathsByDefault: !1,
      }),
        (Dn = {
          future: [
            "hoverOnlyWhenSupported",
            "respectDefaultRingColorOpacity",
            "disableColorOpacityUtilitiesByDefault",
            "relativeContentPathsByDefault",
          ],
          experimental: ["optimizeUniversalDefaults", "generalizedModifiers"],
        });
    });
  function mp(t) {
    (() => {
      if (
        t.purge ||
        !t.content ||
        (!Array.isArray(t.content) &&
          !(typeof t.content == "object" && t.content !== null))
      )
        return !1;
      if (Array.isArray(t.content))
        return t.content.every((r) =>
          typeof r == "string"
            ? !0
            : !(
                typeof r?.raw != "string" ||
                (r?.extension && typeof r?.extension != "string")
              )
        );
      if (typeof t.content == "object" && t.content !== null) {
        if (
          Object.keys(t.content).some(
            (r) => !["files", "relative", "extract", "transform"].includes(r)
          )
        )
          return !1;
        if (Array.isArray(t.content.files)) {
          if (
            !t.content.files.every((r) =>
              typeof r == "string"
                ? !0
                : !(
                    typeof r?.raw != "string" ||
                    (r?.extension && typeof r?.extension != "string")
                  )
            )
          )
            return !1;
          if (typeof t.content.extract == "object") {
            for (let r of Object.values(t.content.extract))
              if (typeof r != "function") return !1;
          } else if (
            !(
              t.content.extract === void 0 ||
              typeof t.content.extract == "function"
            )
          )
            return !1;
          if (typeof t.content.transform == "object") {
            for (let r of Object.values(t.content.transform))
              if (typeof r != "function") return !1;
          } else if (
            !(
              t.content.transform === void 0 ||
              typeof t.content.transform == "function"
            )
          )
            return !1;
          if (
            typeof t.content.relative != "boolean" &&
            typeof t.content.relative != "undefined"
          )
            return !1;
        }
        return !0;
      }
      return !1;
    })() ||
      V.warn("purge-deprecation", [
        "The `purge`/`content` options have changed in Tailwind CSS v3.0.",
        "Update your configuration file to eliminate this warning.",
        "https://tailwindcss.com/docs/upgrade-guide#configure-content-sources",
      ]),
      (t.safelist = (() => {
        let { content: r, purge: i, safelist: n } = t;
        return Array.isArray(n)
          ? n
          : Array.isArray(r?.safelist)
          ? r.safelist
          : Array.isArray(i?.safelist)
          ? i.safelist
          : Array.isArray(i?.options?.safelist)
          ? i.options.safelist
          : [];
      })()),
      (t.blocklist = (() => {
        let { blocklist: r } = t;
        if (Array.isArray(r)) {
          if (r.every((i) => typeof i == "string")) return r;
          V.warn("blocklist-invalid", [
            "The `blocklist` option must be an array of strings.",
            "https://tailwindcss.com/docs/content-configuration#discarding-classes",
          ]);
        }
        return [];
      })()),
      typeof t.prefix == "function"
        ? (V.warn("prefix-function", [
            "As of Tailwind CSS v3.0, `prefix` cannot be a function.",
            "Update `prefix` in your configuration to be a string to eliminate this warning.",
            "https://tailwindcss.com/docs/upgrade-guide#prefix-cannot-be-a-function",
          ]),
          (t.prefix = ""))
        : (t.prefix = t.prefix ?? ""),
      (t.content = {
        relative: (() => {
          let { content: r } = t;
          return r?.relative
            ? r.relative
            : he(t, "relativeContentPathsByDefault");
        })(),
        files: (() => {
          let { content: r, purge: i } = t;
          return Array.isArray(i)
            ? i
            : Array.isArray(i?.content)
            ? i.content
            : Array.isArray(r)
            ? r
            : Array.isArray(r?.content)
            ? r.content
            : Array.isArray(r?.files)
            ? r.files
            : [];
        })(),
        extract: (() => {
          let r = (() =>
              t.purge?.extract
                ? t.purge.extract
                : t.content?.extract
                ? t.content.extract
                : t.purge?.extract?.DEFAULT
                ? t.purge.extract.DEFAULT
                : t.content?.extract?.DEFAULT
                ? t.content.extract.DEFAULT
                : t.purge?.options?.extractors
                ? t.purge.options.extractors
                : t.content?.options?.extractors
                ? t.content.options.extractors
                : {})(),
            i = {},
            n = (() => {
              if (t.purge?.options?.defaultExtractor)
                return t.purge.options.defaultExtractor;
              if (t.content?.options?.defaultExtractor)
                return t.content.options.defaultExtractor;
            })();
          if ((n !== void 0 && (i.DEFAULT = n), typeof r == "function"))
            i.DEFAULT = r;
          else if (Array.isArray(r))
            for (let { extensions: a, extractor: s } of r ?? [])
              for (let o of a) i[o] = s;
          else typeof r == "object" && r !== null && Object.assign(i, r);
          return i;
        })(),
        transform: (() => {
          let r = (() =>
              t.purge?.transform
                ? t.purge.transform
                : t.content?.transform
                ? t.content.transform
                : t.purge?.transform?.DEFAULT
                ? t.purge.transform.DEFAULT
                : t.content?.transform?.DEFAULT
                ? t.content.transform.DEFAULT
                : {})(),
            i = {};
          return (
            typeof r == "function"
              ? (i.DEFAULT = r)
              : typeof r == "object" && r !== null && Object.assign(i, r),
            i
          );
        })(),
      });
    for (let r of t.content.files)
      if (typeof r == "string" && /{([^,]*?)}/g.test(r)) {
        V.warn("invalid-glob-braces", [
          `The glob pattern ${Ba(
            r
          )} in your Tailwind CSS configuration is invalid.`,
          `Update it to ${Ba(
            r.replace(/{([^,]*?)}/g, "$1")
          )} to silence this warning.`,
        ]);
        break;
      }
    return t;
  }
  var gp = A(() => {
    u();
    ct();
    Qe();
  });
  function be(t) {
    if (Object.prototype.toString.call(t) !== "[object Object]") return !1;
    let e = Object.getPrototypeOf(t);
    return e === null || Object.getPrototypeOf(e) === null;
  }
  var ar = A(() => {
    u();
  });
  function Et(t) {
    return Array.isArray(t)
      ? t.map((e) => Et(e))
      : typeof t == "object" && t !== null
      ? Object.fromEntries(Object.entries(t).map(([e, r]) => [e, Et(r)]))
      : t;
  }
  var Rn = A(() => {
    u();
  });
  function Gt(t) {
    return t.replace(/\\,/g, "\\2c ");
  }
  var Bn = A(() => {
    u();
  });
  var Fa,
    yp = A(() => {
      u();
      Fa = {
        aliceblue: [240, 248, 255],
        antiquewhite: [250, 235, 215],
        aqua: [0, 255, 255],
        aquamarine: [127, 255, 212],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        bisque: [255, 228, 196],
        black: [0, 0, 0],
        blanchedalmond: [255, 235, 205],
        blue: [0, 0, 255],
        blueviolet: [138, 43, 226],
        brown: [165, 42, 42],
        burlywood: [222, 184, 135],
        cadetblue: [95, 158, 160],
        chartreuse: [127, 255, 0],
        chocolate: [210, 105, 30],
        coral: [255, 127, 80],
        cornflowerblue: [100, 149, 237],
        cornsilk: [255, 248, 220],
        crimson: [220, 20, 60],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgoldenrod: [184, 134, 11],
        darkgray: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkgrey: [169, 169, 169],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkseagreen: [143, 188, 143],
        darkslateblue: [72, 61, 139],
        darkslategray: [47, 79, 79],
        darkslategrey: [47, 79, 79],
        darkturquoise: [0, 206, 209],
        darkviolet: [148, 0, 211],
        deeppink: [255, 20, 147],
        deepskyblue: [0, 191, 255],
        dimgray: [105, 105, 105],
        dimgrey: [105, 105, 105],
        dodgerblue: [30, 144, 255],
        firebrick: [178, 34, 34],
        floralwhite: [255, 250, 240],
        forestgreen: [34, 139, 34],
        fuchsia: [255, 0, 255],
        gainsboro: [220, 220, 220],
        ghostwhite: [248, 248, 255],
        gold: [255, 215, 0],
        goldenrod: [218, 165, 32],
        gray: [128, 128, 128],
        green: [0, 128, 0],
        greenyellow: [173, 255, 47],
        grey: [128, 128, 128],
        honeydew: [240, 255, 240],
        hotpink: [255, 105, 180],
        indianred: [205, 92, 92],
        indigo: [75, 0, 130],
        ivory: [255, 255, 240],
        khaki: [240, 230, 140],
        lavender: [230, 230, 250],
        lavenderblush: [255, 240, 245],
        lawngreen: [124, 252, 0],
        lemonchiffon: [255, 250, 205],
        lightblue: [173, 216, 230],
        lightcoral: [240, 128, 128],
        lightcyan: [224, 255, 255],
        lightgoldenrodyellow: [250, 250, 210],
        lightgray: [211, 211, 211],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightsalmon: [255, 160, 122],
        lightseagreen: [32, 178, 170],
        lightskyblue: [135, 206, 250],
        lightslategray: [119, 136, 153],
        lightslategrey: [119, 136, 153],
        lightsteelblue: [176, 196, 222],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        limegreen: [50, 205, 50],
        linen: [250, 240, 230],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        mediumaquamarine: [102, 205, 170],
        mediumblue: [0, 0, 205],
        mediumorchid: [186, 85, 211],
        mediumpurple: [147, 112, 219],
        mediumseagreen: [60, 179, 113],
        mediumslateblue: [123, 104, 238],
        mediumspringgreen: [0, 250, 154],
        mediumturquoise: [72, 209, 204],
        mediumvioletred: [199, 21, 133],
        midnightblue: [25, 25, 112],
        mintcream: [245, 255, 250],
        mistyrose: [255, 228, 225],
        moccasin: [255, 228, 181],
        navajowhite: [255, 222, 173],
        navy: [0, 0, 128],
        oldlace: [253, 245, 230],
        olive: [128, 128, 0],
        olivedrab: [107, 142, 35],
        orange: [255, 165, 0],
        orangered: [255, 69, 0],
        orchid: [218, 112, 214],
        palegoldenrod: [238, 232, 170],
        palegreen: [152, 251, 152],
        paleturquoise: [175, 238, 238],
        palevioletred: [219, 112, 147],
        papayawhip: [255, 239, 213],
        peachpuff: [255, 218, 185],
        peru: [205, 133, 63],
        pink: [255, 192, 203],
        plum: [221, 160, 221],
        powderblue: [176, 224, 230],
        purple: [128, 0, 128],
        rebeccapurple: [102, 51, 153],
        red: [255, 0, 0],
        rosybrown: [188, 143, 143],
        royalblue: [65, 105, 225],
        saddlebrown: [139, 69, 19],
        salmon: [250, 128, 114],
        sandybrown: [244, 164, 96],
        seagreen: [46, 139, 87],
        seashell: [255, 245, 238],
        sienna: [160, 82, 45],
        silver: [192, 192, 192],
        skyblue: [135, 206, 235],
        slateblue: [106, 90, 205],
        slategray: [112, 128, 144],
        slategrey: [112, 128, 144],
        snow: [255, 250, 250],
        springgreen: [0, 255, 127],
        steelblue: [70, 130, 180],
        tan: [210, 180, 140],
        teal: [0, 128, 128],
        thistle: [216, 191, 216],
        tomato: [255, 99, 71],
        turquoise: [64, 224, 208],
        violet: [238, 130, 238],
        wheat: [245, 222, 179],
        white: [255, 255, 255],
        whitesmoke: [245, 245, 245],
        yellow: [255, 255, 0],
        yellowgreen: [154, 205, 50],
      };
    });
  function Jr(t, { loose: e = !1 } = {}) {
    if (typeof t != "string") return null;
    if (((t = t.trim()), t === "transparent"))
      return { mode: "rgb", color: ["0", "0", "0"], alpha: "0" };
    if (t in Fa) return { mode: "rgb", color: Fa[t].map((a) => a.toString()) };
    let r = t
      .replace(gk, (a, s, o, l, c) =>
        ["#", s, s, o, o, l, l, c ? c + c : ""].join("")
      )
      .match(mk);
    if (r !== null)
      return {
        mode: "rgb",
        color: [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)].map(
          (a) => a.toString()
        ),
        alpha: r[4] ? (parseInt(r[4], 16) / 255).toString() : void 0,
      };
    let i = t.match(yk) ?? t.match(wk);
    if (i === null) return null;
    let n = [i[2], i[3], i[4]].filter(Boolean).map((a) => a.toString());
    return n.length === 2 && n[0].startsWith("var(")
      ? { mode: i[1], color: [n[0]], alpha: n[1] }
      : (!e && n.length !== 3) ||
        (n.length < 3 && !n.some((a) => /^var\(.*?\)$/.test(a)))
      ? null
      : { mode: i[1], color: n, alpha: i[5]?.toString?.() };
  }
  function Na({ mode: t, color: e, alpha: r }) {
    let i = r !== void 0;
    return t === "rgba" || t === "hsla"
      ? `${t}(${e.join(", ")}${i ? `, ${r}` : ""})`
      : `${t}(${e.join(" ")}${i ? ` / ${r}` : ""})`;
  }
  var mk,
    gk,
    At,
    Mn,
    wp,
    Ct,
    yk,
    wk,
    za = A(() => {
      u();
      yp();
      (mk = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i),
        (gk = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i),
        (At = /(?:\d+|\d*\.\d+)%?/),
        (Mn = /(?:\s*,\s*|\s+)/),
        (wp = /\s*[,/]\s*/),
        (Ct = /var\(--(?:[^ )]*?)(?:,(?:[^ )]*?|var\(--[^ )]*?\)))?\)/),
        (yk = new RegExp(
          `^(rgba?)\\(\\s*(${At.source}|${Ct.source})(?:${Mn.source}(${At.source}|${Ct.source}))?(?:${Mn.source}(${At.source}|${Ct.source}))?(?:${wp.source}(${At.source}|${Ct.source}))?\\s*\\)$`
        )),
        (wk = new RegExp(
          `^(hsla?)\\(\\s*((?:${At.source})(?:deg|rad|grad|turn)?|${Ct.source})(?:${Mn.source}(${At.source}|${Ct.source}))?(?:${Mn.source}(${At.source}|${Ct.source}))?(?:${wp.source}(${At.source}|${Ct.source}))?\\s*\\)$`
        ));
    });
  function et(t, e, r) {
    if (typeof t == "function") return t({ opacityValue: e });
    let i = Jr(t, { loose: !0 });
    return i === null ? r : Na({ ...i, alpha: e });
  }
  function _e({ color: t, property: e, variable: r }) {
    let i = [].concat(e);
    if (typeof t == "function")
      return {
        [r]: "1",
        ...Object.fromEntries(
          i.map((a) => [
            a,
            t({ opacityVariable: r, opacityValue: `var(${r})` }),
          ])
        ),
      };
    let n = Jr(t);
    return n === null
      ? Object.fromEntries(i.map((a) => [a, t]))
      : n.alpha !== void 0
      ? Object.fromEntries(i.map((a) => [a, t]))
      : {
          [r]: "1",
          ...Object.fromEntries(
            i.map((a) => [a, Na({ ...n, alpha: `var(${r})` })])
          ),
        };
  }
  var Kr = A(() => {
    u();
    za();
  });
  function ye(t, e) {
    let r = [],
      i = [],
      n = 0,
      a = !1;
    for (let s = 0; s < t.length; s++) {
      let o = t[s];
      r.length === 0 &&
        o === e[0] &&
        !a &&
        (e.length === 1 || t.slice(s, s + e.length) === e) &&
        (i.push(t.slice(n, s)), (n = s + e.length)),
        (a = a ? !1 : o === "\\"),
        o === "(" || o === "[" || o === "{"
          ? r.push(o)
          : ((o === ")" && r[r.length - 1] === "(") ||
              (o === "]" && r[r.length - 1] === "[") ||
              (o === "}" && r[r.length - 1] === "{")) &&
            r.pop();
    }
    return i.push(t.slice(n)), i;
  }
  var Ht = A(() => {
    u();
  });
  function Ln(t) {
    return ye(t, ",").map((r) => {
      let i = r.trim(),
        n = { raw: i },
        a = i.split(bk),
        s = new Set();
      for (let o of a)
        (vp.lastIndex = 0),
          !s.has("KEYWORD") && vk.has(o)
            ? ((n.keyword = o), s.add("KEYWORD"))
            : vp.test(o)
            ? s.has("X")
              ? s.has("Y")
                ? s.has("BLUR")
                  ? s.has("SPREAD") || ((n.spread = o), s.add("SPREAD"))
                  : ((n.blur = o), s.add("BLUR"))
                : ((n.y = o), s.add("Y"))
              : ((n.x = o), s.add("X"))
            : n.color
            ? (n.unknown || (n.unknown = []), n.unknown.push(o))
            : (n.color = o);
      return (n.valid = n.x !== void 0 && n.y !== void 0), n;
    });
  }
  function bp(t) {
    return t
      .map((e) =>
        e.valid
          ? [e.keyword, e.x, e.y, e.blur, e.spread, e.color]
              .filter(Boolean)
              .join(" ")
          : e.raw
      )
      .join(", ");
  }
  var vk,
    bk,
    vp,
    $a = A(() => {
      u();
      Ht();
      (vk = new Set(["inset", "inherit", "initial", "revert", "unset"])),
        (bk = /\ +(?![^(]*\))/g),
        (vp = /^-?(\d+|\.\d+)(.*?)$/g);
    });
  function ja(t) {
    return xk.some((e) => new RegExp(`^${e}\\(.*\\)`).test(t));
  }
  function W(t, e = null, r = !0) {
    let i = e && kk.has(e.property);
    return t.startsWith("--") && !i
      ? `var(${t})`
      : t.includes("url(")
      ? t
          .split(/(url\(.*?\))/g)
          .filter(Boolean)
          .map((n) => (/^url\(.*?\)$/.test(n) ? n : W(n, e, !1)))
          .join("")
      : ((t = t
          .replace(/([^\\])_+/g, (n, a) => a + " ".repeat(n.length - 1))
          .replace(/^_/g, " ")
          .replace(/\\_/g, "_")),
        r && (t = t.trim()),
        (t = Sk(t)),
        t);
  }
  function Sk(t) {
    let e = ["theme"],
      r = [
        "min-content",
        "max-content",
        "fit-content",
        "safe-area-inset-top",
        "safe-area-inset-right",
        "safe-area-inset-bottom",
        "safe-area-inset-left",
        "titlebar-area-x",
        "titlebar-area-y",
        "titlebar-area-width",
        "titlebar-area-height",
        "keyboard-inset-top",
        "keyboard-inset-right",
        "keyboard-inset-bottom",
        "keyboard-inset-left",
        "keyboard-inset-width",
        "keyboard-inset-height",
        "radial-gradient",
        "linear-gradient",
        "conic-gradient",
        "repeating-radial-gradient",
        "repeating-linear-gradient",
        "repeating-conic-gradient",
      ];
    return t.replace(/(calc|min|max|clamp)\(.+\)/g, (i) => {
      let n = "";
      function a() {
        let s = n.trimEnd();
        return s[s.length - 1];
      }
      for (let s = 0; s < i.length; s++) {
        let o = function (f) {
            return f.split("").every((p, h) => i[s + h] === p);
          },
          l = function (f) {
            let p = 1 / 0;
            for (let m of f) {
              let b = i.indexOf(m, s);
              b !== -1 && b < p && (p = b);
            }
            let h = i.slice(s, p);
            return (s += h.length - 1), h;
          },
          c = i[s];
        if (o("var")) n += l([")", ","]);
        else if (r.some((f) => o(f))) {
          let f = r.find((p) => o(p));
          (n += f), (s += f.length - 1);
        } else
          e.some((f) => o(f))
            ? (n += l([")"]))
            : o("[")
            ? (n += l(["]"]))
            : ["+", "-", "*", "/"].includes(c) &&
              !["(", "+", "-", "*", "/", ","].includes(a())
            ? (n += ` ${c} `)
            : (n += c);
      }
      return n.replace(/\s+/g, " ");
    });
  }
  function Ua(t) {
    return t.startsWith("url(");
  }
  function Va(t) {
    return !isNaN(Number(t)) || ja(t);
  }
  function Xr(t) {
    return (t.endsWith("%") && Va(t.slice(0, -1))) || ja(t);
  }
  function Zr(t) {
    return (
      t === "0" ||
      new RegExp(`^[+-]?[0-9]*.?[0-9]+(?:[eE][+-]?[0-9]+)?${Tk}$`).test(t) ||
      ja(t)
    );
  }
  function xp(t) {
    return Ok.has(t);
  }
  function kp(t) {
    let e = Ln(W(t));
    for (let r of e) if (!r.valid) return !1;
    return !0;
  }
  function Sp(t) {
    let e = 0;
    return ye(t, "_").every(
      (i) => (
        (i = W(i)),
        i.startsWith("var(")
          ? !0
          : Jr(i, { loose: !0 }) !== null
          ? (e++, !0)
          : !1
      )
    )
      ? e > 0
      : !1;
  }
  function _p(t) {
    let e = 0;
    return ye(t, ",").every(
      (i) => (
        (i = W(i)),
        i.startsWith("var(")
          ? !0
          : Ua(i) ||
            Ak(i) ||
            ["element(", "image(", "cross-fade(", "image-set("].some((n) =>
              i.startsWith(n)
            )
          ? (e++, !0)
          : !1
      )
    )
      ? e > 0
      : !1;
  }
  function Ak(t) {
    t = W(t);
    for (let e of Ek) if (t.startsWith(`${e}(`)) return !0;
    return !1;
  }
  function Tp(t) {
    let e = 0;
    return ye(t, "_").every(
      (i) => (
        (i = W(i)),
        i.startsWith("var(") ? !0 : Ck.has(i) || Zr(i) || Xr(i) ? (e++, !0) : !1
      )
    )
      ? e > 0
      : !1;
  }
  function Op(t) {
    let e = 0;
    return ye(t, ",").every(
      (i) => (
        (i = W(i)),
        i.startsWith("var(")
          ? !0
          : (i.includes(" ") && !/(['"])([^"']+)\1/g.test(i)) || /^\d/g.test(i)
          ? !1
          : (e++, !0)
      )
    )
      ? e > 0
      : !1;
  }
  function Ep(t) {
    return Pk.has(t);
  }
  function Ap(t) {
    return Ik.has(t);
  }
  function Cp(t) {
    return qk.has(t);
  }
  var xk,
    kk,
    _k,
    Tk,
    Ok,
    Ek,
    Ck,
    Pk,
    Ik,
    qk,
    ei = A(() => {
      u();
      za();
      $a();
      Ht();
      xk = ["min", "max", "clamp", "calc"];
      kk = new Set([
        "scroll-timeline-name",
        "timeline-scope",
        "view-timeline-name",
        "font-palette",
        "anchor-name",
        "anchor-scope",
        "position-anchor",
        "position-try-options",
        "scroll-timeline",
        "animation-timeline",
        "view-timeline",
        "position-try",
      ]);
      (_k = [
        "cm",
        "mm",
        "Q",
        "in",
        "pc",
        "pt",
        "px",
        "em",
        "ex",
        "ch",
        "rem",
        "lh",
        "rlh",
        "vw",
        "vh",
        "vmin",
        "vmax",
        "vb",
        "vi",
        "svw",
        "svh",
        "lvw",
        "lvh",
        "dvw",
        "dvh",
        "cqw",
        "cqh",
        "cqi",
        "cqb",
        "cqmin",
        "cqmax",
      ]),
        (Tk = `(?:${_k.join("|")})`);
      Ok = new Set(["thin", "medium", "thick"]);
      Ek = new Set([
        "conic-gradient",
        "linear-gradient",
        "radial-gradient",
        "repeating-conic-gradient",
        "repeating-linear-gradient",
        "repeating-radial-gradient",
      ]);
      Ck = new Set(["center", "top", "right", "bottom", "left"]);
      Pk = new Set([
        "serif",
        "sans-serif",
        "monospace",
        "cursive",
        "fantasy",
        "system-ui",
        "ui-serif",
        "ui-sans-serif",
        "ui-monospace",
        "ui-rounded",
        "math",
        "emoji",
        "fangsong",
      ]);
      Ik = new Set([
        "xx-small",
        "x-small",
        "small",
        "medium",
        "large",
        "x-large",
        "xx-large",
        "xxx-large",
      ]);
      qk = new Set(["larger", "smaller"]);
    });
  function Pp(t) {
    let e = ["cover", "contain"];
    return ye(t, ",").every((r) => {
      let i = ye(r, "_").filter(Boolean);
      return i.length === 1 && e.includes(i[0])
        ? !0
        : i.length !== 1 && i.length !== 2
        ? !1
        : i.every((n) => Zr(n) || Xr(n) || n === "auto");
    });
  }
  var Ip = A(() => {
    u();
    ei();
    Ht();
  });
  function qp(t, e) {
    t.walkClasses((r) => {
      (r.value = e(r.value)),
        r.raws && r.raws.value && (r.raws.value = Gt(r.raws.value));
    });
  }
  function Dp(t, e) {
    if (!Pt(t)) return;
    let r = t.slice(1, -1);
    if (!!e(r)) return W(r);
  }
  function Dk(t, e = {}, r) {
    let i = e[t];
    if (i !== void 0) return Tt(i);
    if (Pt(t)) {
      let n = Dp(t, r);
      return n === void 0 ? void 0 : Tt(n);
    }
  }
  function Fn(t, e = {}, { validate: r = () => !0 } = {}) {
    let i = e.values?.[t];
    return i !== void 0
      ? i
      : e.supportsNegativeValues && t.startsWith("-")
      ? Dk(t.slice(1), e.values, r)
      : Dp(t, r);
  }
  function Pt(t) {
    return t.startsWith("[") && t.endsWith("]");
  }
  function Rp(t) {
    let e = t.lastIndexOf("/"),
      r = t.lastIndexOf("[", e),
      i = t.indexOf("]", e);
    return (
      t[e - 1] === "]" ||
        t[e + 1] === "[" ||
        (r !== -1 && i !== -1 && r < e && e < i && (e = t.lastIndexOf("/", r))),
      e === -1 || e === t.length - 1
        ? [t, void 0]
        : Pt(t) && !t.includes("]/[")
        ? [t, void 0]
        : [t.slice(0, e), t.slice(e + 1)]
    );
  }
  function or(t) {
    if (typeof t == "string" && t.includes("<alpha-value>")) {
      let e = t;
      return ({ opacityValue: r = 1 }) => e.replace(/<alpha-value>/g, r);
    }
    return t;
  }
  function Bp(t) {
    return W(t.slice(1, -1));
  }
  function Rk(t, e = {}, { tailwindConfig: r = {} } = {}) {
    if (e.values?.[t] !== void 0) return or(e.values?.[t]);
    let [i, n] = Rp(t);
    if (n !== void 0) {
      let a = e.values?.[i] ?? (Pt(i) ? i.slice(1, -1) : void 0);
      return a === void 0
        ? void 0
        : ((a = or(a)),
          Pt(n)
            ? et(a, Bp(n))
            : r.theme?.opacity?.[n] === void 0
            ? void 0
            : et(a, r.theme.opacity[n]));
    }
    return Fn(t, e, { validate: Sp });
  }
  function Bk(t, e = {}) {
    return e.values?.[t];
  }
  function De(t) {
    return (e, r) => Fn(e, r, { validate: t });
  }
  function Mk(t, e) {
    let r = t.indexOf(e);
    return r === -1 ? [void 0, t] : [t.slice(0, r), t.slice(r + 1)];
  }
  function Ga(t, e, r, i) {
    if (r.values && e in r.values)
      for (let { type: a } of t ?? []) {
        let s = Wa[a](e, r, { tailwindConfig: i });
        if (s !== void 0) return [s, a, null];
      }
    if (Pt(e)) {
      let a = e.slice(1, -1),
        [s, o] = Mk(a, ":");
      if (!/^[\w-_]+$/g.test(s)) o = a;
      else if (s !== void 0 && !Mp.includes(s)) return [];
      if (o.length > 0 && Mp.includes(s)) return [Fn(`[${o}]`, r), s, null];
    }
    let n = Ha(t, e, r, i);
    for (let a of n) return a;
    return [];
  }
  function* Ha(t, e, r, i) {
    let n = he(i, "generalizedModifiers"),
      [a, s] = Rp(e);
    if (
      ((n &&
        r.modifiers != null &&
        (r.modifiers === "any" ||
          (typeof r.modifiers == "object" &&
            ((s && Pt(s)) || s in r.modifiers)))) ||
        ((a = e), (s = void 0)),
      s !== void 0 && a === "" && (a = "DEFAULT"),
      s !== void 0 && typeof r.modifiers == "object")
    ) {
      let l = r.modifiers?.[s] ?? null;
      l !== null ? (s = l) : Pt(s) && (s = Bp(s));
    }
    for (let { type: l } of t ?? []) {
      let c = Wa[l](a, r, { tailwindConfig: i });
      c !== void 0 && (yield [c, l, s ?? null]);
    }
  }
  var Wa,
    Mp,
    ti = A(() => {
      u();
      Bn();
      Kr();
      ei();
      Cn();
      Ip();
      ct();
      (Wa = {
        any: Fn,
        color: Rk,
        url: De(Ua),
        image: De(_p),
        length: De(Zr),
        percentage: De(Xr),
        position: De(Tp),
        lookup: Bk,
        "generic-name": De(Ep),
        "family-name": De(Op),
        number: De(Va),
        "line-width": De(xp),
        "absolute-size": De(Ap),
        "relative-size": De(Cp),
        shadow: De(kp),
        size: De(Pp),
      }),
        (Mp = Object.keys(Wa));
    });
  function G(t) {
    return typeof t == "function" ? t({}) : t;
  }
  var Ya = A(() => {
    u();
  });
  function lr(t) {
    return typeof t == "function";
  }
  function ri(t, ...e) {
    let r = e.pop();
    for (let i of e)
      for (let n in i) {
        let a = r(t[n], i[n]);
        a === void 0
          ? be(t[n]) && be(i[n])
            ? (t[n] = ri({}, t[n], i[n], r))
            : (t[n] = i[n])
          : (t[n] = a);
      }
    return t;
  }
  function Lk(t, ...e) {
    return lr(t) ? t(...e) : t;
  }
  function Fk(t) {
    return t.reduce(
      (e, { extend: r }) =>
        ri(e, r, (i, n) =>
          i === void 0 ? [n] : Array.isArray(i) ? [n, ...i] : [n, i]
        ),
      {}
    );
  }
  function Nk(t) {
    return { ...t.reduce((e, r) => La(e, r), {}), extend: Fk(t) };
  }
  function Lp(t, e) {
    if (Array.isArray(t) && be(t[0])) return t.concat(e);
    if (Array.isArray(e) && be(e[0]) && be(t)) return [t, ...e];
    if (Array.isArray(e)) return e;
  }
  function zk({ extend: t, ...e }) {
    return ri(e, t, (r, i) =>
      !lr(r) && !i.some(lr)
        ? ri({}, r, ...i, Lp)
        : (n, a) => ri({}, ...[r, ...i].map((s) => Lk(s, n, a)), Lp)
    );
  }
  function* $k(t) {
    let e = Ot(t);
    if (e.length === 0 || (yield e, Array.isArray(t))) return;
    let r = /^(.*?)\s*\/\s*([^/]+)$/,
      i = t.match(r);
    if (i !== null) {
      let [, n, a] = i,
        s = Ot(n);
      (s.alpha = a), yield s;
    }
  }
  function jk(t) {
    let e = (r, i) => {
      for (let n of $k(r)) {
        let a = 0,
          s = t;
        for (; s != null && a < n.length; )
          (s = s[n[a++]]),
            (s =
              lr(s) && (n.alpha === void 0 || a <= n.length - 1)
                ? s(e, Qa)
                : s);
        if (s !== void 0) {
          if (n.alpha !== void 0) {
            let o = or(s);
            return et(o, n.alpha, G(o));
          }
          return be(s) ? Et(s) : s;
        }
      }
      return i;
    };
    return (
      Object.assign(e, { theme: e, ...Qa }),
      Object.keys(t).reduce(
        (r, i) => ((r[i] = lr(t[i]) ? t[i](e, Qa) : t[i]), r),
        {}
      )
    );
  }
  function Fp(t) {
    let e = [];
    return (
      t.forEach((r) => {
        e = [...e, r];
        let i = r?.plugins ?? [];
        i.length !== 0 &&
          i.forEach((n) => {
            n.__isOptionsFunction && (n = n()),
              (e = [...e, ...Fp([n?.config ?? {}])]);
          });
      }),
      e
    );
  }
  function Uk(t) {
    return [...t].reduceRight(
      (r, i) => (lr(i) ? i({ corePlugins: r }) : op(i, r)),
      sp
    );
  }
  function Vk(t) {
    return [...t].reduceRight((r, i) => [...r, ...i], []);
  }
  function Ja(t) {
    let e = [...Fp(t), { prefix: "", important: !1, separator: ":" }];
    return mp(
      La(
        {
          theme: jk(zk(Nk(e.map((r) => r?.theme ?? {})))),
          corePlugins: Uk(e.map((r) => r.corePlugins)),
          plugins: Vk(t.map((r) => r?.plugins ?? [])),
        },
        ...e
      )
    );
  }
  var Qa,
    Np = A(() => {
      u();
      Cn();
      ap();
      lp();
      Qr();
      cp();
      qn();
      gp();
      ar();
      Rn();
      ti();
      Kr();
      Ya();
      Qa = {
        colors: Ma,
        negative(t) {
          return Object.keys(t)
            .filter((e) => t[e] !== "0")
            .reduce((e, r) => {
              let i = Tt(t[r]);
              return i !== void 0 && (e[`-${r}`] = i), e;
            }, {});
        },
        breakpoints(t) {
          return Object.keys(t)
            .filter((e) => typeof t[e] == "string")
            .reduce((e, r) => ({ ...e, [`screen-${r}`]: t[r] }), {});
        },
      };
    });
  var Nn = k((PM, zp) => {
    u();
    zp.exports = {
      content: [],
      presets: [],
      darkMode: "media",
      theme: {
        accentColor: ({ theme: t }) => ({ ...t("colors"), auto: "auto" }),
        animation: {
          none: "none",
          spin: "spin 1s linear infinite",
          ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
          pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          bounce: "bounce 1s infinite",
        },
        aria: {
          busy: 'busy="true"',
          checked: 'checked="true"',
          disabled: 'disabled="true"',
          expanded: 'expanded="true"',
          hidden: 'hidden="true"',
          pressed: 'pressed="true"',
          readonly: 'readonly="true"',
          required: 'required="true"',
          selected: 'selected="true"',
        },
        aspectRatio: { auto: "auto", square: "1 / 1", video: "16 / 9" },
        backdropBlur: ({ theme: t }) => t("blur"),
        backdropBrightness: ({ theme: t }) => t("brightness"),
        backdropContrast: ({ theme: t }) => t("contrast"),
        backdropGrayscale: ({ theme: t }) => t("grayscale"),
        backdropHueRotate: ({ theme: t }) => t("hueRotate"),
        backdropInvert: ({ theme: t }) => t("invert"),
        backdropOpacity: ({ theme: t }) => t("opacity"),
        backdropSaturate: ({ theme: t }) => t("saturate"),
        backdropSepia: ({ theme: t }) => t("sepia"),
        backgroundColor: ({ theme: t }) => t("colors"),
        backgroundImage: {
          none: "none",
          "gradient-to-t": "linear-gradient(to top, var(--tw-gradient-stops))",
          "gradient-to-tr":
            "linear-gradient(to top right, var(--tw-gradient-stops))",
          "gradient-to-r":
            "linear-gradient(to right, var(--tw-gradient-stops))",
          "gradient-to-br":
            "linear-gradient(to bottom right, var(--tw-gradient-stops))",
          "gradient-to-b":
            "linear-gradient(to bottom, var(--tw-gradient-stops))",
          "gradient-to-bl":
            "linear-gradient(to bottom left, var(--tw-gradient-stops))",
          "gradient-to-l": "linear-gradient(to left, var(--tw-gradient-stops))",
          "gradient-to-tl":
            "linear-gradient(to top left, var(--tw-gradient-stops))",
        },
        backgroundOpacity: ({ theme: t }) => t("opacity"),
        backgroundPosition: {
          bottom: "bottom",
          center: "center",
          left: "left",
          "left-bottom": "left bottom",
          "left-top": "left top",
          right: "right",
          "right-bottom": "right bottom",
          "right-top": "right top",
          top: "top",
        },
        backgroundSize: { auto: "auto", cover: "cover", contain: "contain" },
        blur: {
          0: "0",
          none: "",
          sm: "4px",
          DEFAULT: "8px",
          md: "12px",
          lg: "16px",
          xl: "24px",
          "2xl": "40px",
          "3xl": "64px",
        },
        borderColor: ({ theme: t }) => ({
          ...t("colors"),
          DEFAULT: t("colors.gray.200", "currentColor"),
        }),
        borderOpacity: ({ theme: t }) => t("opacity"),
        borderRadius: {
          none: "0px",
          sm: "0.125rem",
          DEFAULT: "0.25rem",
          md: "0.375rem",
          lg: "0.5rem",
          xl: "0.75rem",
          "2xl": "1rem",
          "3xl": "1.5rem",
          full: "9999px",
        },
        borderSpacing: ({ theme: t }) => ({ ...t("spacing") }),
        borderWidth: { DEFAULT: "1px", 0: "0px", 2: "2px", 4: "4px", 8: "8px" },
        boxShadow: {
          sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          DEFAULT:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
          inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
          none: "none",
        },
        boxShadowColor: ({ theme: t }) => t("colors"),
        brightness: {
          0: "0",
          50: ".5",
          75: ".75",
          90: ".9",
          95: ".95",
          100: "1",
          105: "1.05",
          110: "1.1",
          125: "1.25",
          150: "1.5",
          200: "2",
        },
        caretColor: ({ theme: t }) => t("colors"),
        colors: ({ colors: t }) => ({
          inherit: t.inherit,
          current: t.current,
          transparent: t.transparent,
          black: t.black,
          white: t.white,
          slate: t.slate,
          gray: t.gray,
          zinc: t.zinc,
          neutral: t.neutral,
          stone: t.stone,
          red: t.red,
          orange: t.orange,
          amber: t.amber,
          yellow: t.yellow,
          lime: t.lime,
          green: t.green,
          emerald: t.emerald,
          teal: t.teal,
          cyan: t.cyan,
          sky: t.sky,
          blue: t.blue,
          indigo: t.indigo,
          violet: t.violet,
          purple: t.purple,
          fuchsia: t.fuchsia,
          pink: t.pink,
          rose: t.rose,
        }),
        columns: {
          auto: "auto",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
          11: "11",
          12: "12",
          "3xs": "16rem",
          "2xs": "18rem",
          xs: "20rem",
          sm: "24rem",
          md: "28rem",
          lg: "32rem",
          xl: "36rem",
          "2xl": "42rem",
          "3xl": "48rem",
          "4xl": "56rem",
          "5xl": "64rem",
          "6xl": "72rem",
          "7xl": "80rem",
        },
        container: {},
        content: { none: "none" },
        contrast: {
          0: "0",
          50: ".5",
          75: ".75",
          100: "1",
          125: "1.25",
          150: "1.5",
          200: "2",
        },
        cursor: {
          auto: "auto",
          default: "default",
          pointer: "pointer",
          wait: "wait",
          text: "text",
          move: "move",
          help: "help",
          "not-allowed": "not-allowed",
          none: "none",
          "context-menu": "context-menu",
          progress: "progress",
          cell: "cell",
          crosshair: "crosshair",
          "vertical-text": "vertical-text",
          alias: "alias",
          copy: "copy",
          "no-drop": "no-drop",
          grab: "grab",
          grabbing: "grabbing",
          "all-scroll": "all-scroll",
          "col-resize": "col-resize",
          "row-resize": "row-resize",
          "n-resize": "n-resize",
          "e-resize": "e-resize",
          "s-resize": "s-resize",
          "w-resize": "w-resize",
          "ne-resize": "ne-resize",
          "nw-resize": "nw-resize",
          "se-resize": "se-resize",
          "sw-resize": "sw-resize",
          "ew-resize": "ew-resize",
          "ns-resize": "ns-resize",
          "nesw-resize": "nesw-resize",
          "nwse-resize": "nwse-resize",
          "zoom-in": "zoom-in",
          "zoom-out": "zoom-out",
        },
        divideColor: ({ theme: t }) => t("borderColor"),
        divideOpacity: ({ theme: t }) => t("borderOpacity"),
        divideWidth: ({ theme: t }) => t("borderWidth"),
        dropShadow: {
          sm: "0 1px 1px rgb(0 0 0 / 0.05)",
          DEFAULT: [
            "0 1px 2px rgb(0 0 0 / 0.1)",
            "0 1px 1px rgb(0 0 0 / 0.06)",
          ],
          md: ["0 4px 3px rgb(0 0 0 / 0.07)", "0 2px 2px rgb(0 0 0 / 0.06)"],
          lg: ["0 10px 8px rgb(0 0 0 / 0.04)", "0 4px 3px rgb(0 0 0 / 0.1)"],
          xl: ["0 20px 13px rgb(0 0 0 / 0.03)", "0 8px 5px rgb(0 0 0 / 0.08)"],
          "2xl": "0 25px 25px rgb(0 0 0 / 0.15)",
          none: "0 0 #0000",
        },
        fill: ({ theme: t }) => ({ none: "none", ...t("colors") }),
        flex: {
          1: "1 1 0%",
          auto: "1 1 auto",
          initial: "0 1 auto",
          none: "none",
        },
        flexBasis: ({ theme: t }) => ({
          auto: "auto",
          ...t("spacing"),
          "1/2": "50%",
          "1/3": "33.333333%",
          "2/3": "66.666667%",
          "1/4": "25%",
          "2/4": "50%",
          "3/4": "75%",
          "1/5": "20%",
          "2/5": "40%",
          "3/5": "60%",
          "4/5": "80%",
          "1/6": "16.666667%",
          "2/6": "33.333333%",
          "3/6": "50%",
          "4/6": "66.666667%",
          "5/6": "83.333333%",
          "1/12": "8.333333%",
          "2/12": "16.666667%",
          "3/12": "25%",
          "4/12": "33.333333%",
          "5/12": "41.666667%",
          "6/12": "50%",
          "7/12": "58.333333%",
          "8/12": "66.666667%",
          "9/12": "75%",
          "10/12": "83.333333%",
          "11/12": "91.666667%",
          full: "100%",
        }),
        flexGrow: { 0: "0", DEFAULT: "1" },
        flexShrink: { 0: "0", DEFAULT: "1" },
        fontFamily: {
          sans: [
            "ui-sans-serif",
            "system-ui",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
            '"Noto Color Emoji"',
          ],
          serif: [
            "ui-serif",
            "Georgia",
            "Cambria",
            '"Times New Roman"',
            "Times",
            "serif",
          ],
          mono: [
            "ui-monospace",
            "SFMono-Regular",
            "Menlo",
            "Monaco",
            "Consolas",
            '"Liberation Mono"',
            '"Courier New"',
            "monospace",
          ],
        },
        fontSize: {
          xs: ["0.75rem", { lineHeight: "1rem" }],
          sm: ["0.875rem", { lineHeight: "1.25rem" }],
          base: ["1rem", { lineHeight: "1.5rem" }],
          lg: ["1.125rem", { lineHeight: "1.75rem" }],
          xl: ["1.25rem", { lineHeight: "1.75rem" }],
          "2xl": ["1.5rem", { lineHeight: "2rem" }],
          "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
          "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
          "5xl": ["3rem", { lineHeight: "1" }],
          "6xl": ["3.75rem", { lineHeight: "1" }],
          "7xl": ["4.5rem", { lineHeight: "1" }],
          "8xl": ["6rem", { lineHeight: "1" }],
          "9xl": ["8rem", { lineHeight: "1" }],
        },
        fontWeight: {
          thin: "100",
          extralight: "200",
          light: "300",
          normal: "400",
          medium: "500",
          semibold: "600",
          bold: "700",
          extrabold: "800",
          black: "900",
        },
        gap: ({ theme: t }) => t("spacing"),
        gradientColorStops: ({ theme: t }) => t("colors"),
        gradientColorStopPositions: {
          "0%": "0%",
          "5%": "5%",
          "10%": "10%",
          "15%": "15%",
          "20%": "20%",
          "25%": "25%",
          "30%": "30%",
          "35%": "35%",
          "40%": "40%",
          "45%": "45%",
          "50%": "50%",
          "55%": "55%",
          "60%": "60%",
          "65%": "65%",
          "70%": "70%",
          "75%": "75%",
          "80%": "80%",
          "85%": "85%",
          "90%": "90%",
          "95%": "95%",
          "100%": "100%",
        },
        grayscale: { 0: "0", DEFAULT: "100%" },
        gridAutoColumns: {
          auto: "auto",
          min: "min-content",
          max: "max-content",
          fr: "minmax(0, 1fr)",
        },
        gridAutoRows: {
          auto: "auto",
          min: "min-content",
          max: "max-content",
          fr: "minmax(0, 1fr)",
        },
        gridColumn: {
          auto: "auto",
          "span-1": "span 1 / span 1",
          "span-2": "span 2 / span 2",
          "span-3": "span 3 / span 3",
          "span-4": "span 4 / span 4",
          "span-5": "span 5 / span 5",
          "span-6": "span 6 / span 6",
          "span-7": "span 7 / span 7",
          "span-8": "span 8 / span 8",
          "span-9": "span 9 / span 9",
          "span-10": "span 10 / span 10",
          "span-11": "span 11 / span 11",
          "span-12": "span 12 / span 12",
          "span-full": "1 / -1",
        },
        gridColumnEnd: {
          auto: "auto",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
          11: "11",
          12: "12",
          13: "13",
        },
        gridColumnStart: {
          auto: "auto",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
          11: "11",
          12: "12",
          13: "13",
        },
        gridRow: {
          auto: "auto",
          "span-1": "span 1 / span 1",
          "span-2": "span 2 / span 2",
          "span-3": "span 3 / span 3",
          "span-4": "span 4 / span 4",
          "span-5": "span 5 / span 5",
          "span-6": "span 6 / span 6",
          "span-7": "span 7 / span 7",
          "span-8": "span 8 / span 8",
          "span-9": "span 9 / span 9",
          "span-10": "span 10 / span 10",
          "span-11": "span 11 / span 11",
          "span-12": "span 12 / span 12",
          "span-full": "1 / -1",
        },
        gridRowEnd: {
          auto: "auto",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
          11: "11",
          12: "12",
          13: "13",
        },
        gridRowStart: {
          auto: "auto",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
          11: "11",
          12: "12",
          13: "13",
        },
        gridTemplateColumns: {
          none: "none",
          subgrid: "subgrid",
          1: "repeat(1, minmax(0, 1fr))",
          2: "repeat(2, minmax(0, 1fr))",
          3: "repeat(3, minmax(0, 1fr))",
          4: "repeat(4, minmax(0, 1fr))",
          5: "repeat(5, minmax(0, 1fr))",
          6: "repeat(6, minmax(0, 1fr))",
          7: "repeat(7, minmax(0, 1fr))",
          8: "repeat(8, minmax(0, 1fr))",
          9: "repeat(9, minmax(0, 1fr))",
          10: "repeat(10, minmax(0, 1fr))",
          11: "repeat(11, minmax(0, 1fr))",
          12: "repeat(12, minmax(0, 1fr))",
        },
        gridTemplateRows: {
          none: "none",
          subgrid: "subgrid",
          1: "repeat(1, minmax(0, 1fr))",
          2: "repeat(2, minmax(0, 1fr))",
          3: "repeat(3, minmax(0, 1fr))",
          4: "repeat(4, minmax(0, 1fr))",
          5: "repeat(5, minmax(0, 1fr))",
          6: "repeat(6, minmax(0, 1fr))",
          7: "repeat(7, minmax(0, 1fr))",
          8: "repeat(8, minmax(0, 1fr))",
          9: "repeat(9, minmax(0, 1fr))",
          10: "repeat(10, minmax(0, 1fr))",
          11: "repeat(11, minmax(0, 1fr))",
          12: "repeat(12, minmax(0, 1fr))",
        },
        height: ({ theme: t }) => ({
          auto: "auto",
          ...t("spacing"),
          "1/2": "50%",
          "1/3": "33.333333%",
          "2/3": "66.666667%",
          "1/4": "25%",
          "2/4": "50%",
          "3/4": "75%",
          "1/5": "20%",
          "2/5": "40%",
          "3/5": "60%",
          "4/5": "80%",
          "1/6": "16.666667%",
          "2/6": "33.333333%",
          "3/6": "50%",
          "4/6": "66.666667%",
          "5/6": "83.333333%",
          full: "100%",
          screen: "100vh",
          svh: "100svh",
          lvh: "100lvh",
          dvh: "100dvh",
          min: "min-content",
          max: "max-content",
          fit: "fit-content",
        }),
        hueRotate: {
          0: "0deg",
          15: "15deg",
          30: "30deg",
          60: "60deg",
          90: "90deg",
          180: "180deg",
        },
        inset: ({ theme: t }) => ({
          auto: "auto",
          ...t("spacing"),
          "1/2": "50%",
          "1/3": "33.333333%",
          "2/3": "66.666667%",
          "1/4": "25%",
          "2/4": "50%",
          "3/4": "75%",
          full: "100%",
        }),
        invert: { 0: "0", DEFAULT: "100%" },
        keyframes: {
          spin: { to: { transform: "rotate(360deg)" } },
          ping: { "75%, 100%": { transform: "scale(2)", opacity: "0" } },
          pulse: { "50%": { opacity: ".5" } },
          bounce: {
            "0%, 100%": {
              transform: "translateY(-25%)",
              animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
            },
            "50%": {
              transform: "none",
              animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
            },
          },
        },
        letterSpacing: {
          tighter: "-0.05em",
          tight: "-0.025em",
          normal: "0em",
          wide: "0.025em",
          wider: "0.05em",
          widest: "0.1em",
        },
        lineHeight: {
          none: "1",
          tight: "1.25",
          snug: "1.375",
          normal: "1.5",
          relaxed: "1.625",
          loose: "2",
          3: ".75rem",
          4: "1rem",
          5: "1.25rem",
          6: "1.5rem",
          7: "1.75rem",
          8: "2rem",
          9: "2.25rem",
          10: "2.5rem",
        },
        listStyleType: { none: "none", disc: "disc", decimal: "decimal" },
        listStyleImage: { none: "none" },
        margin: ({ theme: t }) => ({ auto: "auto", ...t("spacing") }),
        lineClamp: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6" },
        maxHeight: ({ theme: t }) => ({
          ...t("spacing"),
          none: "none",
          full: "100%",
          screen: "100vh",
          svh: "100svh",
          lvh: "100lvh",
          dvh: "100dvh",
          min: "min-content",
          max: "max-content",
          fit: "fit-content",
        }),
        maxWidth: ({ theme: t, breakpoints: e }) => ({
          ...t("spacing"),
          none: "none",
          xs: "20rem",
          sm: "24rem",
          md: "28rem",
          lg: "32rem",
          xl: "36rem",
          "2xl": "42rem",
          "3xl": "48rem",
          "4xl": "56rem",
          "5xl": "64rem",
          "6xl": "72rem",
          "7xl": "80rem",
          full: "100%",
          min: "min-content",
          max: "max-content",
          fit: "fit-content",
          prose: "65ch",
          ...e(t("screens")),
        }),
        minHeight: ({ theme: t }) => ({
          ...t("spacing"),
          full: "100%",
          screen: "100vh",
          svh: "100svh",
          lvh: "100lvh",
          dvh: "100dvh",
          min: "min-content",
          max: "max-content",
          fit: "fit-content",
        }),
        minWidth: ({ theme: t }) => ({
          ...t("spacing"),
          full: "100%",
          min: "min-content",
          max: "max-content",
          fit: "fit-content",
        }),
        objectPosition: {
          bottom: "bottom",
          center: "center",
          left: "left",
          "left-bottom": "left bottom",
          "left-top": "left top",
          right: "right",
          "right-bottom": "right bottom",
          "right-top": "right top",
          top: "top",
        },
        opacity: {
          0: "0",
          5: "0.05",
          10: "0.1",
          15: "0.15",
          20: "0.2",
          25: "0.25",
          30: "0.3",
          35: "0.35",
          40: "0.4",
          45: "0.45",
          50: "0.5",
          55: "0.55",
          60: "0.6",
          65: "0.65",
          70: "0.7",
          75: "0.75",
          80: "0.8",
          85: "0.85",
          90: "0.9",
          95: "0.95",
          100: "1",
        },
        order: {
          first: "-9999",
          last: "9999",
          none: "0",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
          11: "11",
          12: "12",
        },
        outlineColor: ({ theme: t }) => t("colors"),
        outlineOffset: { 0: "0px", 1: "1px", 2: "2px", 4: "4px", 8: "8px" },
        outlineWidth: { 0: "0px", 1: "1px", 2: "2px", 4: "4px", 8: "8px" },
        padding: ({ theme: t }) => t("spacing"),
        placeholderColor: ({ theme: t }) => t("colors"),
        placeholderOpacity: ({ theme: t }) => t("opacity"),
        ringColor: ({ theme: t }) => ({
          DEFAULT: t("colors.blue.500", "#3b82f6"),
          ...t("colors"),
        }),
        ringOffsetColor: ({ theme: t }) => t("colors"),
        ringOffsetWidth: { 0: "0px", 1: "1px", 2: "2px", 4: "4px", 8: "8px" },
        ringOpacity: ({ theme: t }) => ({ DEFAULT: "0.5", ...t("opacity") }),
        ringWidth: {
          DEFAULT: "3px",
          0: "0px",
          1: "1px",
          2: "2px",
          4: "4px",
          8: "8px",
        },
        rotate: {
          0: "0deg",
          1: "1deg",
          2: "2deg",
          3: "3deg",
          6: "6deg",
          12: "12deg",
          45: "45deg",
          90: "90deg",
          180: "180deg",
        },
        saturate: { 0: "0", 50: ".5", 100: "1", 150: "1.5", 200: "2" },
        scale: {
          0: "0",
          50: ".5",
          75: ".75",
          90: ".9",
          95: ".95",
          100: "1",
          105: "1.05",
          110: "1.1",
          125: "1.25",
          150: "1.5",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px",
        },
        scrollMargin: ({ theme: t }) => ({ ...t("spacing") }),
        scrollPadding: ({ theme: t }) => t("spacing"),
        sepia: { 0: "0", DEFAULT: "100%" },
        skew: {
          0: "0deg",
          1: "1deg",
          2: "2deg",
          3: "3deg",
          6: "6deg",
          12: "12deg",
        },
        space: ({ theme: t }) => ({ ...t("spacing") }),
        spacing: {
          px: "1px",
          0: "0px",
          0.5: "0.125rem",
          1: "0.25rem",
          1.5: "0.375rem",
          2: "0.5rem",
          2.5: "0.625rem",
          3: "0.75rem",
          3.5: "0.875rem",
          4: "1rem",
          5: "1.25rem",
          6: "1.5rem",
          7: "1.75rem",
          8: "2rem",
          9: "2.25rem",
          10: "2.5rem",
          11: "2.75rem",
          12: "3rem",
          14: "3.5rem",
          16: "4rem",
          20: "5rem",
          24: "6rem",
          28: "7rem",
          32: "8rem",
          36: "9rem",
          40: "10rem",
          44: "11rem",
          48: "12rem",
          52: "13rem",
          56: "14rem",
          60: "15rem",
          64: "16rem",
          72: "18rem",
          80: "20rem",
          96: "24rem",
        },
        stroke: ({ theme: t }) => ({ none: "none", ...t("colors") }),
        strokeWidth: { 0: "0", 1: "1", 2: "2" },
        supports: {},
        data: {},
        textColor: ({ theme: t }) => t("colors"),
        textDecorationColor: ({ theme: t }) => t("colors"),
        textDecorationThickness: {
          auto: "auto",
          "from-font": "from-font",
          0: "0px",
          1: "1px",
          2: "2px",
          4: "4px",
          8: "8px",
        },
        textIndent: ({ theme: t }) => ({ ...t("spacing") }),
        textOpacity: ({ theme: t }) => t("opacity"),
        textUnderlineOffset: {
          auto: "auto",
          0: "0px",
          1: "1px",
          2: "2px",
          4: "4px",
          8: "8px",
        },
        transformOrigin: {
          center: "center",
          top: "top",
          "top-right": "top right",
          right: "right",
          "bottom-right": "bottom right",
          bottom: "bottom",
          "bottom-left": "bottom left",
          left: "left",
          "top-left": "top left",
        },
        transitionDelay: {
          0: "0s",
          75: "75ms",
          100: "100ms",
          150: "150ms",
          200: "200ms",
          300: "300ms",
          500: "500ms",
          700: "700ms",
          1e3: "1000ms",
        },
        transitionDuration: {
          DEFAULT: "150ms",
          0: "0s",
          75: "75ms",
          100: "100ms",
          150: "150ms",
          200: "200ms",
          300: "300ms",
          500: "500ms",
          700: "700ms",
          1e3: "1000ms",
        },
        transitionProperty: {
          none: "none",
          all: "all",
          DEFAULT:
            "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
          colors:
            "color, background-color, border-color, text-decoration-color, fill, stroke",
          opacity: "opacity",
          shadow: "box-shadow",
          transform: "transform",
        },
        transitionTimingFunction: {
          DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
          linear: "linear",
          in: "cubic-bezier(0.4, 0, 1, 1)",
          out: "cubic-bezier(0, 0, 0.2, 1)",
          "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
        },
        translate: ({ theme: t }) => ({
          ...t("spacing"),
          "1/2": "50%",
          "1/3": "33.333333%",
          "2/3": "66.666667%",
          "1/4": "25%",
          "2/4": "50%",
          "3/4": "75%",
          full: "100%",
        }),
        size: ({ theme: t }) => ({
          auto: "auto",
          ...t("spacing"),
          "1/2": "50%",
          "1/3": "33.333333%",
          "2/3": "66.666667%",
          "1/4": "25%",
          "2/4": "50%",
          "3/4": "75%",
          "1/5": "20%",
          "2/5": "40%",
          "3/5": "60%",
          "4/5": "80%",
          "1/6": "16.666667%",
          "2/6": "33.333333%",
          "3/6": "50%",
          "4/6": "66.666667%",
          "5/6": "83.333333%",
          "1/12": "8.333333%",
          "2/12": "16.666667%",
          "3/12": "25%",
          "4/12": "33.333333%",
          "5/12": "41.666667%",
          "6/12": "50%",
          "7/12": "58.333333%",
          "8/12": "66.666667%",
          "9/12": "75%",
          "10/12": "83.333333%",
          "11/12": "91.666667%",
          full: "100%",
          min: "min-content",
          max: "max-content",
          fit: "fit-content",
        }),
        width: ({ theme: t }) => ({
          auto: "auto",
          ...t("spacing"),
          "1/2": "50%",
          "1/3": "33.333333%",
          "2/3": "66.666667%",
          "1/4": "25%",
          "2/4": "50%",
          "3/4": "75%",
          "1/5": "20%",
          "2/5": "40%",
          "3/5": "60%",
          "4/5": "80%",
          "1/6": "16.666667%",
          "2/6": "33.333333%",
          "3/6": "50%",
          "4/6": "66.666667%",
          "5/6": "83.333333%",
          "1/12": "8.333333%",
          "2/12": "16.666667%",
          "3/12": "25%",
          "4/12": "33.333333%",
          "5/12": "41.666667%",
          "6/12": "50%",
          "7/12": "58.333333%",
          "8/12": "66.666667%",
          "9/12": "75%",
          "10/12": "83.333333%",
          "11/12": "91.666667%",
          full: "100%",
          screen: "100vw",
          svw: "100svw",
          lvw: "100lvw",
          dvw: "100dvw",
          min: "min-content",
          max: "max-content",
          fit: "fit-content",
        }),
        willChange: {
          auto: "auto",
          scroll: "scroll-position",
          contents: "contents",
          transform: "transform",
        },
        zIndex: {
          auto: "auto",
          0: "0",
          10: "10",
          20: "20",
          30: "30",
          40: "40",
          50: "50",
        },
      },
      plugins: [],
    };
  });
  function zn(t) {
    let e = (t?.presets ?? [$p.default])
        .slice()
        .reverse()
        .flatMap((n) => zn(n instanceof Function ? n() : n)),
      r = {
        respectDefaultRingColorOpacity: {
          theme: {
            ringColor: ({ theme: n }) => ({
              DEFAULT: "#3b82f67f",
              ...n("colors"),
            }),
          },
        },
        disableColorOpacityUtilitiesByDefault: {
          corePlugins: {
            backgroundOpacity: !1,
            borderOpacity: !1,
            divideOpacity: !1,
            placeholderOpacity: !1,
            ringOpacity: !1,
            textOpacity: !1,
          },
        },
      },
      i = Object.keys(r)
        .filter((n) => he(t, n))
        .map((n) => r[n]);
    return [t, ...i, ...e];
  }
  var $p,
    jp = A(() => {
      u();
      $p = ce(Nn());
      ct();
    });
  var Up = {};
  He(Up, { default: () => ii });
  function ii(...t) {
    let [, ...e] = zn(t[0]);
    return Ja([...t, ...e]);
  }
  var Ka = A(() => {
    u();
    Np();
    jp();
  });
  var Vp = {};
  He(Vp, { default: () => me });
  var me,
    Yt = A(() => {
      u();
      me = { resolve: (t) => t, extname: (t) => "." + t.split(".").pop() };
    });
  function $n(t) {
    return typeof t == "object" && t !== null;
  }
  function Gk(t) {
    return Object.keys(t).length === 0;
  }
  function Wp(t) {
    return typeof t == "string" || t instanceof String;
  }
  function Xa(t) {
    return $n(t) && t.config === void 0 && !Gk(t)
      ? null
      : $n(t) && t.config !== void 0 && Wp(t.config)
      ? me.resolve(t.config)
      : $n(t) && t.config !== void 0 && $n(t.config)
      ? null
      : Wp(t)
      ? me.resolve(t)
      : Hk();
  }
  function Hk() {
    for (let t of Wk)
      try {
        let e = me.resolve(t);
        return ge.accessSync(e), e;
      } catch (e) {}
    return null;
  }
  var Wk,
    Gp = A(() => {
      u();
      ft();
      Yt();
      Wk = [
        "./tailwind.config.js",
        "./tailwind.config.cjs",
        "./tailwind.config.mjs",
        "./tailwind.config.ts",
        "./tailwind.config.cts",
        "./tailwind.config.mts",
      ];
    });
  var Hp = {};
  He(Hp, { default: () => Za });
  var Za,
    eo = A(() => {
      u();
      Za = { parse: (t) => ({ href: t }) };
    });
  var to = k(() => {
    u();
  });
  var jn = k((zM, Jp) => {
    u();
    ("use strict");
    var Yp = (Pn(), up),
      Qp = to(),
      ur = class extends Error {
        constructor(e, r, i, n, a, s) {
          super(e);
          (this.name = "CssSyntaxError"),
            (this.reason = e),
            a && (this.file = a),
            n && (this.source = n),
            s && (this.plugin = s),
            typeof r != "undefined" &&
              typeof i != "undefined" &&
              (typeof r == "number"
                ? ((this.line = r), (this.column = i))
                : ((this.line = r.line),
                  (this.column = r.column),
                  (this.endLine = i.line),
                  (this.endColumn = i.column))),
            this.setMessage(),
            Error.captureStackTrace && Error.captureStackTrace(this, ur);
        }
        setMessage() {
          (this.message = this.plugin ? this.plugin + ": " : ""),
            (this.message += this.file ? this.file : "<css input>"),
            typeof this.line != "undefined" &&
              (this.message += ":" + this.line + ":" + this.column),
            (this.message += ": " + this.reason);
        }
        showSourceCode(e) {
          if (!this.source) return "";
          let r = this.source;
          e == null && (e = Yp.isColorSupported), Qp && e && (r = Qp(r));
          let i = r.split(/\r?\n/),
            n = Math.max(this.line - 3, 0),
            a = Math.min(this.line + 2, i.length),
            s = String(a).length,
            o,
            l;
          if (e) {
            let { bold: c, red: f, gray: p } = Yp.createColors(!0);
            (o = (h) => c(f(h))), (l = (h) => p(h));
          } else o = l = (c) => c;
          return i.slice(n, a).map((c, f) => {
            let p = n + 1 + f,
              h = " " + (" " + p).slice(-s) + " | ";
            if (p === this.line) {
              let m =
                l(h.replace(/\d/g, " ")) +
                c.slice(0, this.column - 1).replace(/[^\t]/g, " ");
              return (
                o(">") +
                l(h) +
                c +
                `
 ` +
                m +
                o("^")
              );
            }
            return " " + l(h) + c;
          }).join(`
`);
        }
        toString() {
          let e = this.showSourceCode();
          return (
            e &&
              (e =
                `

` +
                e +
                `
`),
            this.name + ": " + this.message + e
          );
        }
      };
    Jp.exports = ur;
    ur.default = ur;
  });
  var Un = k(($M, ro) => {
    u();
    ("use strict");
    ro.exports.isClean = Symbol("isClean");
    ro.exports.my = Symbol("my");
  });
  var io = k((jM, Xp) => {
    u();
    ("use strict");
    var Kp = {
      colon: ": ",
      indent: "    ",
      beforeDecl: `
`,
      beforeRule: `
`,
      beforeOpen: " ",
      beforeClose: `
`,
      beforeComment: `
`,
      after: `
`,
      emptyBody: "",
      commentLeft: " ",
      commentRight: " ",
      semicolon: !1,
    };
    function Yk(t) {
      return t[0].toUpperCase() + t.slice(1);
    }
    var Vn = class {
      constructor(e) {
        this.builder = e;
      }
      stringify(e, r) {
        if (!this[e.type])
          throw new Error(
            "Unknown AST node type " +
              e.type +
              ". Maybe you need to change PostCSS stringifier."
          );
        this[e.type](e, r);
      }
      document(e) {
        this.body(e);
      }
      root(e) {
        this.body(e), e.raws.after && this.builder(e.raws.after);
      }
      comment(e) {
        let r = this.raw(e, "left", "commentLeft"),
          i = this.raw(e, "right", "commentRight");
        this.builder("/*" + r + e.text + i + "*/", e);
      }
      decl(e, r) {
        let i = this.raw(e, "between", "colon"),
          n = e.prop + i + this.rawValue(e, "value");
        e.important && (n += e.raws.important || " !important"),
          r && (n += ";"),
          this.builder(n, e);
      }
      rule(e) {
        this.block(e, this.rawValue(e, "selector")),
          e.raws.ownSemicolon && this.builder(e.raws.ownSemicolon, e, "end");
      }
      atrule(e, r) {
        let i = "@" + e.name,
          n = e.params ? this.rawValue(e, "params") : "";
        if (
          (typeof e.raws.afterName != "undefined"
            ? (i += e.raws.afterName)
            : n && (i += " "),
          e.nodes)
        )
          this.block(e, i + n);
        else {
          let a = (e.raws.between || "") + (r ? ";" : "");
          this.builder(i + n + a, e);
        }
      }
      body(e) {
        let r = e.nodes.length - 1;
        for (; r > 0 && e.nodes[r].type === "comment"; ) r -= 1;
        let i = this.raw(e, "semicolon");
        for (let n = 0; n < e.nodes.length; n++) {
          let a = e.nodes[n],
            s = this.raw(a, "before");
          s && this.builder(s), this.stringify(a, r !== n || i);
        }
      }
      block(e, r) {
        let i = this.raw(e, "between", "beforeOpen");
        this.builder(r + i + "{", e, "start");
        let n;
        e.nodes && e.nodes.length
          ? (this.body(e), (n = this.raw(e, "after")))
          : (n = this.raw(e, "after", "emptyBody")),
          n && this.builder(n),
          this.builder("}", e, "end");
      }
      raw(e, r, i) {
        let n;
        if ((i || (i = r), r && ((n = e.raws[r]), typeof n != "undefined")))
          return n;
        let a = e.parent;
        if (
          i === "before" &&
          (!a ||
            (a.type === "root" && a.first === e) ||
            (a && a.type === "document"))
        )
          return "";
        if (!a) return Kp[i];
        let s = e.root();
        if (
          (s.rawCache || (s.rawCache = {}), typeof s.rawCache[i] != "undefined")
        )
          return s.rawCache[i];
        if (i === "before" || i === "after") return this.beforeAfter(e, i);
        {
          let o = "raw" + Yk(i);
          this[o]
            ? (n = this[o](s, e))
            : s.walk((l) => {
                if (((n = l.raws[r]), typeof n != "undefined")) return !1;
              });
        }
        return typeof n == "undefined" && (n = Kp[i]), (s.rawCache[i] = n), n;
      }
      rawSemicolon(e) {
        let r;
        return (
          e.walk((i) => {
            if (
              i.nodes &&
              i.nodes.length &&
              i.last.type === "decl" &&
              ((r = i.raws.semicolon), typeof r != "undefined")
            )
              return !1;
          }),
          r
        );
      }
      rawEmptyBody(e) {
        let r;
        return (
          e.walk((i) => {
            if (
              i.nodes &&
              i.nodes.length === 0 &&
              ((r = i.raws.after), typeof r != "undefined")
            )
              return !1;
          }),
          r
        );
      }
      rawIndent(e) {
        if (e.raws.indent) return e.raws.indent;
        let r;
        return (
          e.walk((i) => {
            let n = i.parent;
            if (
              n &&
              n !== e &&
              n.parent &&
              n.parent === e &&
              typeof i.raws.before != "undefined"
            ) {
              let a = i.raws.before.split(`
`);
              return (r = a[a.length - 1]), (r = r.replace(/\S/g, "")), !1;
            }
          }),
          r
        );
      }
      rawBeforeComment(e, r) {
        let i;
        return (
          e.walkComments((n) => {
            if (typeof n.raws.before != "undefined")
              return (
                (i = n.raws.before),
                i.includes(`
`) && (i = i.replace(/[^\n]+$/, "")),
                !1
              );
          }),
          typeof i == "undefined"
            ? (i = this.raw(r, null, "beforeDecl"))
            : i && (i = i.replace(/\S/g, "")),
          i
        );
      }
      rawBeforeDecl(e, r) {
        let i;
        return (
          e.walkDecls((n) => {
            if (typeof n.raws.before != "undefined")
              return (
                (i = n.raws.before),
                i.includes(`
`) && (i = i.replace(/[^\n]+$/, "")),
                !1
              );
          }),
          typeof i == "undefined"
            ? (i = this.raw(r, null, "beforeRule"))
            : i && (i = i.replace(/\S/g, "")),
          i
        );
      }
      rawBeforeRule(e) {
        let r;
        return (
          e.walk((i) => {
            if (
              i.nodes &&
              (i.parent !== e || e.first !== i) &&
              typeof i.raws.before != "undefined"
            )
              return (
                (r = i.raws.before),
                r.includes(`
`) && (r = r.replace(/[^\n]+$/, "")),
                !1
              );
          }),
          r && (r = r.replace(/\S/g, "")),
          r
        );
      }
      rawBeforeClose(e) {
        let r;
        return (
          e.walk((i) => {
            if (
              i.nodes &&
              i.nodes.length > 0 &&
              typeof i.raws.after != "undefined"
            )
              return (
                (r = i.raws.after),
                r.includes(`
`) && (r = r.replace(/[^\n]+$/, "")),
                !1
              );
          }),
          r && (r = r.replace(/\S/g, "")),
          r
        );
      }
      rawBeforeOpen(e) {
        let r;
        return (
          e.walk((i) => {
            if (
              i.type !== "decl" &&
              ((r = i.raws.between), typeof r != "undefined")
            )
              return !1;
          }),
          r
        );
      }
      rawColon(e) {
        let r;
        return (
          e.walkDecls((i) => {
            if (typeof i.raws.between != "undefined")
              return (r = i.raws.between.replace(/[^\s:]/g, "")), !1;
          }),
          r
        );
      }
      beforeAfter(e, r) {
        let i;
        e.type === "decl"
          ? (i = this.raw(e, null, "beforeDecl"))
          : e.type === "comment"
          ? (i = this.raw(e, null, "beforeComment"))
          : r === "before"
          ? (i = this.raw(e, null, "beforeRule"))
          : (i = this.raw(e, null, "beforeClose"));
        let n = e.parent,
          a = 0;
        for (; n && n.type !== "root"; ) (a += 1), (n = n.parent);
        if (
          i.includes(`
`)
        ) {
          let s = this.raw(e, null, "indent");
          if (s.length) for (let o = 0; o < a; o++) i += s;
        }
        return i;
      }
      rawValue(e, r) {
        let i = e[r],
          n = e.raws[r];
        return n && n.value === i ? n.raw : i;
      }
    };
    Xp.exports = Vn;
    Vn.default = Vn;
  });
  var ni = k((UM, Zp) => {
    u();
    ("use strict");
    var Qk = io();
    function no(t, e) {
      new Qk(e).stringify(t);
    }
    Zp.exports = no;
    no.default = no;
  });
  var si = k((VM, ed) => {
    u();
    ("use strict");
    var { isClean: Wn, my: Jk } = Un(),
      Kk = jn(),
      Xk = io(),
      Zk = ni();
    function so(t, e) {
      let r = new t.constructor();
      for (let i in t) {
        if (!Object.prototype.hasOwnProperty.call(t, i) || i === "proxyCache")
          continue;
        let n = t[i],
          a = typeof n;
        i === "parent" && a === "object"
          ? e && (r[i] = e)
          : i === "source"
          ? (r[i] = n)
          : Array.isArray(n)
          ? (r[i] = n.map((s) => so(s, r)))
          : (a === "object" && n !== null && (n = so(n)), (r[i] = n));
      }
      return r;
    }
    var Gn = class {
      constructor(e = {}) {
        (this.raws = {}), (this[Wn] = !1), (this[Jk] = !0);
        for (let r in e)
          if (r === "nodes") {
            this.nodes = [];
            for (let i of e[r])
              typeof i.clone == "function"
                ? this.append(i.clone())
                : this.append(i);
          } else this[r] = e[r];
      }
      error(e, r = {}) {
        if (this.source) {
          let { start: i, end: n } = this.rangeBy(r);
          return this.source.input.error(
            e,
            { line: i.line, column: i.column },
            { line: n.line, column: n.column },
            r
          );
        }
        return new Kk(e);
      }
      warn(e, r, i) {
        let n = { node: this };
        for (let a in i) n[a] = i[a];
        return e.warn(r, n);
      }
      remove() {
        return (
          this.parent && this.parent.removeChild(this),
          (this.parent = void 0),
          this
        );
      }
      toString(e = Zk) {
        e.stringify && (e = e.stringify);
        let r = "";
        return (
          e(this, (i) => {
            r += i;
          }),
          r
        );
      }
      assign(e = {}) {
        for (let r in e) this[r] = e[r];
        return this;
      }
      clone(e = {}) {
        let r = so(this);
        for (let i in e) r[i] = e[i];
        return r;
      }
      cloneBefore(e = {}) {
        let r = this.clone(e);
        return this.parent.insertBefore(this, r), r;
      }
      cloneAfter(e = {}) {
        let r = this.clone(e);
        return this.parent.insertAfter(this, r), r;
      }
      replaceWith(...e) {
        if (this.parent) {
          let r = this,
            i = !1;
          for (let n of e)
            n === this
              ? (i = !0)
              : i
              ? (this.parent.insertAfter(r, n), (r = n))
              : this.parent.insertBefore(r, n);
          i || this.remove();
        }
        return this;
      }
      next() {
        if (!this.parent) return;
        let e = this.parent.index(this);
        return this.parent.nodes[e + 1];
      }
      prev() {
        if (!this.parent) return;
        let e = this.parent.index(this);
        return this.parent.nodes[e - 1];
      }
      before(e) {
        return this.parent.insertBefore(this, e), this;
      }
      after(e) {
        return this.parent.insertAfter(this, e), this;
      }
      root() {
        let e = this;
        for (; e.parent && e.parent.type !== "document"; ) e = e.parent;
        return e;
      }
      raw(e, r) {
        return new Xk().raw(this, e, r);
      }
      cleanRaws(e) {
        delete this.raws.before,
          delete this.raws.after,
          e || delete this.raws.between;
      }
      toJSON(e, r) {
        let i = {},
          n = r == null;
        r = r || new Map();
        let a = 0;
        for (let s in this) {
          if (
            !Object.prototype.hasOwnProperty.call(this, s) ||
            s === "parent" ||
            s === "proxyCache"
          )
            continue;
          let o = this[s];
          if (Array.isArray(o))
            i[s] = o.map((l) =>
              typeof l == "object" && l.toJSON ? l.toJSON(null, r) : l
            );
          else if (typeof o == "object" && o.toJSON) i[s] = o.toJSON(null, r);
          else if (s === "source") {
            let l = r.get(o.input);
            l == null && ((l = a), r.set(o.input, a), a++),
              (i[s] = { inputId: l, start: o.start, end: o.end });
          } else i[s] = o;
        }
        return n && (i.inputs = [...r.keys()].map((s) => s.toJSON())), i;
      }
      positionInside(e) {
        let r = this.toString(),
          i = this.source.start.column,
          n = this.source.start.line;
        for (let a = 0; a < e; a++)
          r[a] ===
          `
`
            ? ((i = 1), (n += 1))
            : (i += 1);
        return { line: n, column: i };
      }
      positionBy(e) {
        let r = this.source.start;
        if (e.index) r = this.positionInside(e.index);
        else if (e.word) {
          let i = this.toString().indexOf(e.word);
          i !== -1 && (r = this.positionInside(i));
        }
        return r;
      }
      rangeBy(e) {
        let r = {
            line: this.source.start.line,
            column: this.source.start.column,
          },
          i = this.source.end
            ? { line: this.source.end.line, column: this.source.end.column + 1 }
            : { line: r.line, column: r.column + 1 };
        if (e.word) {
          let n = this.toString().indexOf(e.word);
          n !== -1 &&
            ((r = this.positionInside(n)),
            (i = this.positionInside(n + e.word.length)));
        } else
          e.start
            ? (r = { line: e.start.line, column: e.start.column })
            : e.index && (r = this.positionInside(e.index)),
            e.end
              ? (i = { line: e.end.line, column: e.end.column })
              : e.endIndex
              ? (i = this.positionInside(e.endIndex))
              : e.index && (i = this.positionInside(e.index + 1));
        return (
          (i.line < r.line || (i.line === r.line && i.column <= r.column)) &&
            (i = { line: r.line, column: r.column + 1 }),
          { start: r, end: i }
        );
      }
      getProxyProcessor() {
        return {
          set(e, r, i) {
            return (
              e[r] === i ||
                ((e[r] = i),
                (r === "prop" ||
                  r === "value" ||
                  r === "name" ||
                  r === "params" ||
                  r === "important" ||
                  r === "text") &&
                  e.markDirty()),
              !0
            );
          },
          get(e, r) {
            return r === "proxyOf"
              ? e
              : r === "root"
              ? () => e.root().toProxy()
              : e[r];
          },
        };
      }
      toProxy() {
        return (
          this.proxyCache ||
            (this.proxyCache = new Proxy(this, this.getProxyProcessor())),
          this.proxyCache
        );
      }
      addToError(e) {
        if (
          ((e.postcssNode = this),
          e.stack && this.source && /\n\s{4}at /.test(e.stack))
        ) {
          let r = this.source;
          e.stack = e.stack.replace(
            /\n\s{4}at /,
            `$&${r.input.from}:${r.start.line}:${r.start.column}$&`
          );
        }
        return e;
      }
      markDirty() {
        if (this[Wn]) {
          this[Wn] = !1;
          let e = this;
          for (; (e = e.parent); ) e[Wn] = !1;
        }
      }
      get proxyOf() {
        return this;
      }
    };
    ed.exports = Gn;
    Gn.default = Gn;
  });
  var ai = k((WM, td) => {
    u();
    ("use strict");
    var eS = si(),
      Hn = class extends eS {
        constructor(e) {
          e &&
            typeof e.value != "undefined" &&
            typeof e.value != "string" &&
            (e = { ...e, value: String(e.value) });
          super(e);
          this.type = "decl";
        }
        get variable() {
          return this.prop.startsWith("--") || this.prop[0] === "$";
        }
      };
    td.exports = Hn;
    Hn.default = Hn;
  });
  var ao = k((GM, rd) => {
    u();
    rd.exports = function (t, e) {
      return {
        generate: () => {
          let r = "";
          return (
            t(e, (i) => {
              r += i;
            }),
            [r]
          );
        },
      };
    };
  });
  var oi = k((HM, id) => {
    u();
    ("use strict");
    var tS = si(),
      Yn = class extends tS {
        constructor(e) {
          super(e);
          this.type = "comment";
        }
      };
    id.exports = Yn;
    Yn.default = Yn;
  });
  var It = k((YM, pd) => {
    u();
    ("use strict");
    var { isClean: nd, my: sd } = Un(),
      ad = ai(),
      od = oi(),
      rS = si(),
      ld,
      oo,
      lo,
      ud;
    function fd(t) {
      return t.map(
        (e) => (e.nodes && (e.nodes = fd(e.nodes)), delete e.source, e)
      );
    }
    function cd(t) {
      if (((t[nd] = !1), t.proxyOf.nodes)) for (let e of t.proxyOf.nodes) cd(e);
    }
    var Le = class extends rS {
      push(e) {
        return (e.parent = this), this.proxyOf.nodes.push(e), this;
      }
      each(e) {
        if (!this.proxyOf.nodes) return;
        let r = this.getIterator(),
          i,
          n;
        for (
          ;
          this.indexes[r] < this.proxyOf.nodes.length &&
          ((i = this.indexes[r]), (n = e(this.proxyOf.nodes[i], i)), n !== !1);

        )
          this.indexes[r] += 1;
        return delete this.indexes[r], n;
      }
      walk(e) {
        return this.each((r, i) => {
          let n;
          try {
            n = e(r, i);
          } catch (a) {
            throw r.addToError(a);
          }
          return n !== !1 && r.walk && (n = r.walk(e)), n;
        });
      }
      walkDecls(e, r) {
        return r
          ? e instanceof RegExp
            ? this.walk((i, n) => {
                if (i.type === "decl" && e.test(i.prop)) return r(i, n);
              })
            : this.walk((i, n) => {
                if (i.type === "decl" && i.prop === e) return r(i, n);
              })
          : ((r = e),
            this.walk((i, n) => {
              if (i.type === "decl") return r(i, n);
            }));
      }
      walkRules(e, r) {
        return r
          ? e instanceof RegExp
            ? this.walk((i, n) => {
                if (i.type === "rule" && e.test(i.selector)) return r(i, n);
              })
            : this.walk((i, n) => {
                if (i.type === "rule" && i.selector === e) return r(i, n);
              })
          : ((r = e),
            this.walk((i, n) => {
              if (i.type === "rule") return r(i, n);
            }));
      }
      walkAtRules(e, r) {
        return r
          ? e instanceof RegExp
            ? this.walk((i, n) => {
                if (i.type === "atrule" && e.test(i.name)) return r(i, n);
              })
            : this.walk((i, n) => {
                if (i.type === "atrule" && i.name === e) return r(i, n);
              })
          : ((r = e),
            this.walk((i, n) => {
              if (i.type === "atrule") return r(i, n);
            }));
      }
      walkComments(e) {
        return this.walk((r, i) => {
          if (r.type === "comment") return e(r, i);
        });
      }
      append(...e) {
        for (let r of e) {
          let i = this.normalize(r, this.last);
          for (let n of i) this.proxyOf.nodes.push(n);
        }
        return this.markDirty(), this;
      }
      prepend(...e) {
        e = e.reverse();
        for (let r of e) {
          let i = this.normalize(r, this.first, "prepend").reverse();
          for (let n of i) this.proxyOf.nodes.unshift(n);
          for (let n in this.indexes)
            this.indexes[n] = this.indexes[n] + i.length;
        }
        return this.markDirty(), this;
      }
      cleanRaws(e) {
        if ((super.cleanRaws(e), this.nodes))
          for (let r of this.nodes) r.cleanRaws(e);
      }
      insertBefore(e, r) {
        let i = this.index(e),
          n = i === 0 ? "prepend" : !1,
          a = this.normalize(r, this.proxyOf.nodes[i], n).reverse();
        i = this.index(e);
        for (let o of a) this.proxyOf.nodes.splice(i, 0, o);
        let s;
        for (let o in this.indexes)
          (s = this.indexes[o]), i <= s && (this.indexes[o] = s + a.length);
        return this.markDirty(), this;
      }
      insertAfter(e, r) {
        let i = this.index(e),
          n = this.normalize(r, this.proxyOf.nodes[i]).reverse();
        i = this.index(e);
        for (let s of n) this.proxyOf.nodes.splice(i + 1, 0, s);
        let a;
        for (let s in this.indexes)
          (a = this.indexes[s]), i < a && (this.indexes[s] = a + n.length);
        return this.markDirty(), this;
      }
      removeChild(e) {
        (e = this.index(e)),
          (this.proxyOf.nodes[e].parent = void 0),
          this.proxyOf.nodes.splice(e, 1);
        let r;
        for (let i in this.indexes)
          (r = this.indexes[i]), r >= e && (this.indexes[i] = r - 1);
        return this.markDirty(), this;
      }
      removeAll() {
        for (let e of this.proxyOf.nodes) e.parent = void 0;
        return (this.proxyOf.nodes = []), this.markDirty(), this;
      }
      replaceValues(e, r, i) {
        return (
          i || ((i = r), (r = {})),
          this.walkDecls((n) => {
            (r.props && !r.props.includes(n.prop)) ||
              (r.fast && !n.value.includes(r.fast)) ||
              (n.value = n.value.replace(e, i));
          }),
          this.markDirty(),
          this
        );
      }
      every(e) {
        return this.nodes.every(e);
      }
      some(e) {
        return this.nodes.some(e);
      }
      index(e) {
        return typeof e == "number"
          ? e
          : (e.proxyOf && (e = e.proxyOf), this.proxyOf.nodes.indexOf(e));
      }
      get first() {
        if (!!this.proxyOf.nodes) return this.proxyOf.nodes[0];
      }
      get last() {
        if (!!this.proxyOf.nodes)
          return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
      }
      normalize(e, r) {
        if (typeof e == "string") e = fd(ld(e).nodes);
        else if (Array.isArray(e)) {
          e = e.slice(0);
          for (let n of e) n.parent && n.parent.removeChild(n, "ignore");
        } else if (e.type === "root" && this.type !== "document") {
          e = e.nodes.slice(0);
          for (let n of e) n.parent && n.parent.removeChild(n, "ignore");
        } else if (e.type) e = [e];
        else if (e.prop) {
          if (typeof e.value == "undefined")
            throw new Error("Value field is missed in node creation");
          typeof e.value != "string" && (e.value = String(e.value)),
            (e = [new ad(e)]);
        } else if (e.selector) e = [new oo(e)];
        else if (e.name) e = [new lo(e)];
        else if (e.text) e = [new od(e)];
        else throw new Error("Unknown node type in node creation");
        return e.map(
          (n) => (
            n[sd] || Le.rebuild(n),
            (n = n.proxyOf),
            n.parent && n.parent.removeChild(n),
            n[nd] && cd(n),
            typeof n.raws.before == "undefined" &&
              r &&
              typeof r.raws.before != "undefined" &&
              (n.raws.before = r.raws.before.replace(/\S/g, "")),
            (n.parent = this.proxyOf),
            n
          )
        );
      }
      getProxyProcessor() {
        return {
          set(e, r, i) {
            return (
              e[r] === i ||
                ((e[r] = i),
                (r === "name" || r === "params" || r === "selector") &&
                  e.markDirty()),
              !0
            );
          },
          get(e, r) {
            return r === "proxyOf"
              ? e
              : e[r]
              ? r === "each" || (typeof r == "string" && r.startsWith("walk"))
                ? (...i) =>
                    e[r](
                      ...i.map((n) =>
                        typeof n == "function" ? (a, s) => n(a.toProxy(), s) : n
                      )
                    )
                : r === "every" || r === "some"
                ? (i) => e[r]((n, ...a) => i(n.toProxy(), ...a))
                : r === "root"
                ? () => e.root().toProxy()
                : r === "nodes"
                ? e.nodes.map((i) => i.toProxy())
                : r === "first" || r === "last"
                ? e[r].toProxy()
                : e[r]
              : e[r];
          },
        };
      }
      getIterator() {
        this.lastEach || (this.lastEach = 0),
          this.indexes || (this.indexes = {}),
          (this.lastEach += 1);
        let e = this.lastEach;
        return (this.indexes[e] = 0), e;
      }
    };
    Le.registerParse = (t) => {
      ld = t;
    };
    Le.registerRule = (t) => {
      oo = t;
    };
    Le.registerAtRule = (t) => {
      lo = t;
    };
    Le.registerRoot = (t) => {
      ud = t;
    };
    pd.exports = Le;
    Le.default = Le;
    Le.rebuild = (t) => {
      t.type === "atrule"
        ? Object.setPrototypeOf(t, lo.prototype)
        : t.type === "rule"
        ? Object.setPrototypeOf(t, oo.prototype)
        : t.type === "decl"
        ? Object.setPrototypeOf(t, ad.prototype)
        : t.type === "comment"
        ? Object.setPrototypeOf(t, od.prototype)
        : t.type === "root" && Object.setPrototypeOf(t, ud.prototype),
        (t[sd] = !0),
        t.nodes &&
          t.nodes.forEach((e) => {
            Le.rebuild(e);
          });
    };
  });
  var Qn = k((QM, md) => {
    u();
    ("use strict");
    var iS = It(),
      dd,
      hd,
      fr = class extends iS {
        constructor(e) {
          super({ type: "document", ...e });
          this.nodes || (this.nodes = []);
        }
        toResult(e = {}) {
          return new dd(new hd(), this, e).stringify();
        }
      };
    fr.registerLazyResult = (t) => {
      dd = t;
    };
    fr.registerProcessor = (t) => {
      hd = t;
    };
    md.exports = fr;
    fr.default = fr;
  });
  var uo = k((JM, yd) => {
    u();
    ("use strict");
    var gd = {};
    yd.exports = function (e) {
      gd[e] ||
        ((gd[e] = !0),
        typeof console != "undefined" && console.warn && console.warn(e));
    };
  });
  var fo = k((KM, wd) => {
    u();
    ("use strict");
    var Jn = class {
      constructor(e, r = {}) {
        if (
          ((this.type = "warning"), (this.text = e), r.node && r.node.source)
        ) {
          let i = r.node.rangeBy(r);
          (this.line = i.start.line),
            (this.column = i.start.column),
            (this.endLine = i.end.line),
            (this.endColumn = i.end.column);
        }
        for (let i in r) this[i] = r[i];
      }
      toString() {
        return this.node
          ? this.node.error(this.text, {
              plugin: this.plugin,
              index: this.index,
              word: this.word,
            }).message
          : this.plugin
          ? this.plugin + ": " + this.text
          : this.text;
      }
    };
    wd.exports = Jn;
    Jn.default = Jn;
  });
  var Xn = k((XM, vd) => {
    u();
    ("use strict");
    var nS = fo(),
      Kn = class {
        constructor(e, r, i) {
          (this.processor = e),
            (this.messages = []),
            (this.root = r),
            (this.opts = i),
            (this.css = void 0),
            (this.map = void 0);
        }
        toString() {
          return this.css;
        }
        warn(e, r = {}) {
          r.plugin ||
            (this.lastPlugin &&
              this.lastPlugin.postcssPlugin &&
              (r.plugin = this.lastPlugin.postcssPlugin));
          let i = new nS(e, r);
          return this.messages.push(i), i;
        }
        warnings() {
          return this.messages.filter((e) => e.type === "warning");
        }
        get content() {
          return this.css;
        }
      };
    vd.exports = Kn;
    Kn.default = Kn;
  });
  var _d = k((ZM, Sd) => {
    u();
    ("use strict");
    var co = "'".charCodeAt(0),
      bd = '"'.charCodeAt(0),
      Zn = "\\".charCodeAt(0),
      xd = "/".charCodeAt(0),
      es = `
`.charCodeAt(0),
      li = " ".charCodeAt(0),
      ts = "\f".charCodeAt(0),
      rs = "	".charCodeAt(0),
      is = "\r".charCodeAt(0),
      sS = "[".charCodeAt(0),
      aS = "]".charCodeAt(0),
      oS = "(".charCodeAt(0),
      lS = ")".charCodeAt(0),
      uS = "{".charCodeAt(0),
      fS = "}".charCodeAt(0),
      cS = ";".charCodeAt(0),
      pS = "*".charCodeAt(0),
      dS = ":".charCodeAt(0),
      hS = "@".charCodeAt(0),
      ns = /[\t\n\f\r "#'()/;[\\\]{}]/g,
      ss = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g,
      mS = /.[\n"'(/\\]/,
      kd = /[\da-f]/i;
    Sd.exports = function (e, r = {}) {
      let i = e.css.valueOf(),
        n = r.ignoreErrors,
        a,
        s,
        o,
        l,
        c,
        f,
        p,
        h,
        m,
        b,
        S = i.length,
        v = 0,
        w = [],
        _ = [];
      function T() {
        return v;
      }
      function O(N) {
        throw e.error("Unclosed " + N, v);
      }
      function E() {
        return _.length === 0 && v >= S;
      }
      function F(N) {
        if (_.length) return _.pop();
        if (v >= S) return;
        let fe = N ? N.ignoreUnclosed : !1;
        switch (((a = i.charCodeAt(v)), a)) {
          case es:
          case li:
          case rs:
          case is:
          case ts: {
            s = v;
            do (s += 1), (a = i.charCodeAt(s));
            while (a === li || a === es || a === rs || a === is || a === ts);
            (b = ["space", i.slice(v, s)]), (v = s - 1);
            break;
          }
          case sS:
          case aS:
          case uS:
          case fS:
          case dS:
          case cS:
          case lS: {
            let Se = String.fromCharCode(a);
            b = [Se, Se, v];
            break;
          }
          case oS: {
            if (
              ((h = w.length ? w.pop()[1] : ""),
              (m = i.charCodeAt(v + 1)),
              h === "url" &&
                m !== co &&
                m !== bd &&
                m !== li &&
                m !== es &&
                m !== rs &&
                m !== ts &&
                m !== is)
            ) {
              s = v;
              do {
                if (((f = !1), (s = i.indexOf(")", s + 1)), s === -1))
                  if (n || fe) {
                    s = v;
                    break;
                  } else O("bracket");
                for (p = s; i.charCodeAt(p - 1) === Zn; ) (p -= 1), (f = !f);
              } while (f);
              (b = ["brackets", i.slice(v, s + 1), v, s]), (v = s);
            } else
              (s = i.indexOf(")", v + 1)),
                (l = i.slice(v, s + 1)),
                s === -1 || mS.test(l)
                  ? (b = ["(", "(", v])
                  : ((b = ["brackets", l, v, s]), (v = s));
            break;
          }
          case co:
          case bd: {
            (o = a === co ? "'" : '"'), (s = v);
            do {
              if (((f = !1), (s = i.indexOf(o, s + 1)), s === -1))
                if (n || fe) {
                  s = v + 1;
                  break;
                } else O("string");
              for (p = s; i.charCodeAt(p - 1) === Zn; ) (p -= 1), (f = !f);
            } while (f);
            (b = ["string", i.slice(v, s + 1), v, s]), (v = s);
            break;
          }
          case hS: {
            (ns.lastIndex = v + 1),
              ns.test(i),
              ns.lastIndex === 0 ? (s = i.length - 1) : (s = ns.lastIndex - 2),
              (b = ["at-word", i.slice(v, s + 1), v, s]),
              (v = s);
            break;
          }
          case Zn: {
            for (s = v, c = !0; i.charCodeAt(s + 1) === Zn; )
              (s += 1), (c = !c);
            if (
              ((a = i.charCodeAt(s + 1)),
              c &&
                a !== xd &&
                a !== li &&
                a !== es &&
                a !== rs &&
                a !== is &&
                a !== ts &&
                ((s += 1), kd.test(i.charAt(s))))
            ) {
              for (; kd.test(i.charAt(s + 1)); ) s += 1;
              i.charCodeAt(s + 1) === li && (s += 1);
            }
            (b = ["word", i.slice(v, s + 1), v, s]), (v = s);
            break;
          }
          default: {
            a === xd && i.charCodeAt(v + 1) === pS
              ? ((s = i.indexOf("*/", v + 2) + 1),
                s === 0 && (n || fe ? (s = i.length) : O("comment")),
                (b = ["comment", i.slice(v, s + 1), v, s]),
                (v = s))
              : ((ss.lastIndex = v + 1),
                ss.test(i),
                ss.lastIndex === 0
                  ? (s = i.length - 1)
                  : (s = ss.lastIndex - 2),
                (b = ["word", i.slice(v, s + 1), v, s]),
                w.push(b),
                (v = s));
            break;
          }
        }
        return v++, b;
      }
      function z(N) {
        _.push(N);
      }
      return { back: z, nextToken: F, endOfFile: E, position: T };
    };
  });
  var as = k((eL, Od) => {
    u();
    ("use strict");
    var Td = It(),
      ui = class extends Td {
        constructor(e) {
          super(e);
          this.type = "atrule";
        }
        append(...e) {
          return this.proxyOf.nodes || (this.nodes = []), super.append(...e);
        }
        prepend(...e) {
          return this.proxyOf.nodes || (this.nodes = []), super.prepend(...e);
        }
      };
    Od.exports = ui;
    ui.default = ui;
    Td.registerAtRule(ui);
  });
  var cr = k((tL, Pd) => {
    u();
    ("use strict");
    var Ed = It(),
      Ad,
      Cd,
      Qt = class extends Ed {
        constructor(e) {
          super(e);
          (this.type = "root"), this.nodes || (this.nodes = []);
        }
        removeChild(e, r) {
          let i = this.index(e);
          return (
            !r &&
              i === 0 &&
              this.nodes.length > 1 &&
              (this.nodes[1].raws.before = this.nodes[i].raws.before),
            super.removeChild(e)
          );
        }
        normalize(e, r, i) {
          let n = super.normalize(e);
          if (r) {
            if (i === "prepend")
              this.nodes.length > 1
                ? (r.raws.before = this.nodes[1].raws.before)
                : delete r.raws.before;
            else if (this.first !== r)
              for (let a of n) a.raws.before = r.raws.before;
          }
          return n;
        }
        toResult(e = {}) {
          return new Ad(new Cd(), this, e).stringify();
        }
      };
    Qt.registerLazyResult = (t) => {
      Ad = t;
    };
    Qt.registerProcessor = (t) => {
      Cd = t;
    };
    Pd.exports = Qt;
    Qt.default = Qt;
    Ed.registerRoot(Qt);
  });
  var po = k((rL, Id) => {
    u();
    ("use strict");
    var fi = {
      split(t, e, r) {
        let i = [],
          n = "",
          a = !1,
          s = 0,
          o = !1,
          l = "",
          c = !1;
        for (let f of t)
          c
            ? (c = !1)
            : f === "\\"
            ? (c = !0)
            : o
            ? f === l && (o = !1)
            : f === '"' || f === "'"
            ? ((o = !0), (l = f))
            : f === "("
            ? (s += 1)
            : f === ")"
            ? s > 0 && (s -= 1)
            : s === 0 && e.includes(f) && (a = !0),
            a ? (n !== "" && i.push(n.trim()), (n = ""), (a = !1)) : (n += f);
        return (r || n !== "") && i.push(n.trim()), i;
      },
      space(t) {
        let e = [
          " ",
          `
`,
          "	",
        ];
        return fi.split(t, e);
      },
      comma(t) {
        return fi.split(t, [","], !0);
      },
    };
    Id.exports = fi;
    fi.default = fi;
  });
  var os = k((iL, Dd) => {
    u();
    ("use strict");
    var qd = It(),
      gS = po(),
      ci = class extends qd {
        constructor(e) {
          super(e);
          (this.type = "rule"), this.nodes || (this.nodes = []);
        }
        get selectors() {
          return gS.comma(this.selector);
        }
        set selectors(e) {
          let r = this.selector ? this.selector.match(/,\s*/) : null,
            i = r ? r[0] : "," + this.raw("between", "beforeOpen");
          this.selector = e.join(i);
        }
      };
    Dd.exports = ci;
    ci.default = ci;
    qd.registerRule(ci);
  });
  var Fd = k((nL, Ld) => {
    u();
    ("use strict");
    var yS = ai(),
      wS = _d(),
      vS = oi(),
      bS = as(),
      xS = cr(),
      Rd = os(),
      Bd = { empty: !0, space: !0 };
    function kS(t) {
      for (let e = t.length - 1; e >= 0; e--) {
        let r = t[e],
          i = r[3] || r[2];
        if (i) return i;
      }
    }
    var Md = class {
      constructor(e) {
        (this.input = e),
          (this.root = new xS()),
          (this.current = this.root),
          (this.spaces = ""),
          (this.semicolon = !1),
          (this.customProperty = !1),
          this.createTokenizer(),
          (this.root.source = {
            input: e,
            start: { offset: 0, line: 1, column: 1 },
          });
      }
      createTokenizer() {
        this.tokenizer = wS(this.input);
      }
      parse() {
        let e;
        for (; !this.tokenizer.endOfFile(); )
          switch (((e = this.tokenizer.nextToken()), e[0])) {
            case "space":
              this.spaces += e[1];
              break;
            case ";":
              this.freeSemicolon(e);
              break;
            case "}":
              this.end(e);
              break;
            case "comment":
              this.comment(e);
              break;
            case "at-word":
              this.atrule(e);
              break;
            case "{":
              this.emptyRule(e);
              break;
            default:
              this.other(e);
              break;
          }
        this.endFile();
      }
      comment(e) {
        let r = new vS();
        this.init(r, e[2]), (r.source.end = this.getPosition(e[3] || e[2]));
        let i = e[1].slice(2, -2);
        if (/^\s*$/.test(i))
          (r.text = ""), (r.raws.left = i), (r.raws.right = "");
        else {
          let n = i.match(/^(\s*)([^]*\S)(\s*)$/);
          (r.text = n[2]), (r.raws.left = n[1]), (r.raws.right = n[3]);
        }
      }
      emptyRule(e) {
        let r = new Rd();
        this.init(r, e[2]),
          (r.selector = ""),
          (r.raws.between = ""),
          (this.current = r);
      }
      other(e) {
        let r = !1,
          i = null,
          n = !1,
          a = null,
          s = [],
          o = e[1].startsWith("--"),
          l = [],
          c = e;
        for (; c; ) {
          if (((i = c[0]), l.push(c), i === "(" || i === "["))
            a || (a = c), s.push(i === "(" ? ")" : "]");
          else if (o && n && i === "{") a || (a = c), s.push("}");
          else if (s.length === 0)
            if (i === ";")
              if (n) {
                this.decl(l, o);
                return;
              } else break;
            else if (i === "{") {
              this.rule(l);
              return;
            } else if (i === "}") {
              this.tokenizer.back(l.pop()), (r = !0);
              break;
            } else i === ":" && (n = !0);
          else i === s[s.length - 1] && (s.pop(), s.length === 0 && (a = null));
          c = this.tokenizer.nextToken();
        }
        if (
          (this.tokenizer.endOfFile() && (r = !0),
          s.length > 0 && this.unclosedBracket(a),
          r && n)
        ) {
          if (!o)
            for (
              ;
              l.length &&
              ((c = l[l.length - 1][0]), !(c !== "space" && c !== "comment"));

            )
              this.tokenizer.back(l.pop());
          this.decl(l, o);
        } else this.unknownWord(l);
      }
      rule(e) {
        e.pop();
        let r = new Rd();
        this.init(r, e[0][2]),
          (r.raws.between = this.spacesAndCommentsFromEnd(e)),
          this.raw(r, "selector", e),
          (this.current = r);
      }
      decl(e, r) {
        let i = new yS();
        this.init(i, e[0][2]);
        let n = e[e.length - 1];
        for (
          n[0] === ";" && ((this.semicolon = !0), e.pop()),
            i.source.end = this.getPosition(n[3] || n[2] || kS(e));
          e[0][0] !== "word";

        )
          e.length === 1 && this.unknownWord(e),
            (i.raws.before += e.shift()[1]);
        for (
          i.source.start = this.getPosition(e[0][2]), i.prop = "";
          e.length;

        ) {
          let c = e[0][0];
          if (c === ":" || c === "space" || c === "comment") break;
          i.prop += e.shift()[1];
        }
        i.raws.between = "";
        let a;
        for (; e.length; )
          if (((a = e.shift()), a[0] === ":")) {
            i.raws.between += a[1];
            break;
          } else
            a[0] === "word" && /\w/.test(a[1]) && this.unknownWord([a]),
              (i.raws.between += a[1]);
        (i.prop[0] === "_" || i.prop[0] === "*") &&
          ((i.raws.before += i.prop[0]), (i.prop = i.prop.slice(1)));
        let s = [],
          o;
        for (
          ;
          e.length && ((o = e[0][0]), !(o !== "space" && o !== "comment"));

        )
          s.push(e.shift());
        this.precheckMissedSemicolon(e);
        for (let c = e.length - 1; c >= 0; c--) {
          if (((a = e[c]), a[1].toLowerCase() === "!important")) {
            i.important = !0;
            let f = this.stringFrom(e, c);
            (f = this.spacesFromEnd(e) + f),
              f !== " !important" && (i.raws.important = f);
            break;
          } else if (a[1].toLowerCase() === "important") {
            let f = e.slice(0),
              p = "";
            for (let h = c; h > 0; h--) {
              let m = f[h][0];
              if (p.trim().indexOf("!") === 0 && m !== "space") break;
              p = f.pop()[1] + p;
            }
            p.trim().indexOf("!") === 0 &&
              ((i.important = !0), (i.raws.important = p), (e = f));
          }
          if (a[0] !== "space" && a[0] !== "comment") break;
        }
        e.some((c) => c[0] !== "space" && c[0] !== "comment") &&
          ((i.raws.between += s.map((c) => c[1]).join("")), (s = [])),
          this.raw(i, "value", s.concat(e), r),
          i.value.includes(":") && !r && this.checkMissedSemicolon(e);
      }
      atrule(e) {
        let r = new bS();
        (r.name = e[1].slice(1)),
          r.name === "" && this.unnamedAtrule(r, e),
          this.init(r, e[2]);
        let i,
          n,
          a,
          s = !1,
          o = !1,
          l = [],
          c = [];
        for (; !this.tokenizer.endOfFile(); ) {
          if (
            ((e = this.tokenizer.nextToken()),
            (i = e[0]),
            i === "(" || i === "["
              ? c.push(i === "(" ? ")" : "]")
              : i === "{" && c.length > 0
              ? c.push("}")
              : i === c[c.length - 1] && c.pop(),
            c.length === 0)
          )
            if (i === ";") {
              (r.source.end = this.getPosition(e[2])), (this.semicolon = !0);
              break;
            } else if (i === "{") {
              o = !0;
              break;
            } else if (i === "}") {
              if (l.length > 0) {
                for (a = l.length - 1, n = l[a]; n && n[0] === "space"; )
                  n = l[--a];
                n && (r.source.end = this.getPosition(n[3] || n[2]));
              }
              this.end(e);
              break;
            } else l.push(e);
          else l.push(e);
          if (this.tokenizer.endOfFile()) {
            s = !0;
            break;
          }
        }
        (r.raws.between = this.spacesAndCommentsFromEnd(l)),
          l.length
            ? ((r.raws.afterName = this.spacesAndCommentsFromStart(l)),
              this.raw(r, "params", l),
              s &&
                ((e = l[l.length - 1]),
                (r.source.end = this.getPosition(e[3] || e[2])),
                (this.spaces = r.raws.between),
                (r.raws.between = "")))
            : ((r.raws.afterName = ""), (r.params = "")),
          o && ((r.nodes = []), (this.current = r));
      }
      end(e) {
        this.current.nodes &&
          this.current.nodes.length &&
          (this.current.raws.semicolon = this.semicolon),
          (this.semicolon = !1),
          (this.current.raws.after =
            (this.current.raws.after || "") + this.spaces),
          (this.spaces = ""),
          this.current.parent
            ? ((this.current.source.end = this.getPosition(e[2])),
              (this.current = this.current.parent))
            : this.unexpectedClose(e);
      }
      endFile() {
        this.current.parent && this.unclosedBlock(),
          this.current.nodes &&
            this.current.nodes.length &&
            (this.current.raws.semicolon = this.semicolon),
          (this.current.raws.after =
            (this.current.raws.after || "") + this.spaces);
      }
      freeSemicolon(e) {
        if (((this.spaces += e[1]), this.current.nodes)) {
          let r = this.current.nodes[this.current.nodes.length - 1];
          r &&
            r.type === "rule" &&
            !r.raws.ownSemicolon &&
            ((r.raws.ownSemicolon = this.spaces), (this.spaces = ""));
        }
      }
      getPosition(e) {
        let r = this.input.fromOffset(e);
        return { offset: e, line: r.line, column: r.col };
      }
      init(e, r) {
        this.current.push(e),
          (e.source = { start: this.getPosition(r), input: this.input }),
          (e.raws.before = this.spaces),
          (this.spaces = ""),
          e.type !== "comment" && (this.semicolon = !1);
      }
      raw(e, r, i, n) {
        let a,
          s,
          o = i.length,
          l = "",
          c = !0,
          f,
          p;
        for (let h = 0; h < o; h += 1)
          (a = i[h]),
            (s = a[0]),
            s === "space" && h === o - 1 && !n
              ? (c = !1)
              : s === "comment"
              ? ((p = i[h - 1] ? i[h - 1][0] : "empty"),
                (f = i[h + 1] ? i[h + 1][0] : "empty"),
                !Bd[p] && !Bd[f]
                  ? l.slice(-1) === ","
                    ? (c = !1)
                    : (l += a[1])
                  : (c = !1))
              : (l += a[1]);
        if (!c) {
          let h = i.reduce((m, b) => m + b[1], "");
          e.raws[r] = { value: l, raw: h };
        }
        e[r] = l;
      }
      spacesAndCommentsFromEnd(e) {
        let r,
          i = "";
        for (
          ;
          e.length &&
          ((r = e[e.length - 1][0]), !(r !== "space" && r !== "comment"));

        )
          i = e.pop()[1] + i;
        return i;
      }
      spacesAndCommentsFromStart(e) {
        let r,
          i = "";
        for (
          ;
          e.length && ((r = e[0][0]), !(r !== "space" && r !== "comment"));

        )
          i += e.shift()[1];
        return i;
      }
      spacesFromEnd(e) {
        let r,
          i = "";
        for (; e.length && ((r = e[e.length - 1][0]), r === "space"); )
          i = e.pop()[1] + i;
        return i;
      }
      stringFrom(e, r) {
        let i = "";
        for (let n = r; n < e.length; n++) i += e[n][1];
        return e.splice(r, e.length - r), i;
      }
      colon(e) {
        let r = 0,
          i,
          n,
          a;
        for (let [s, o] of e.entries()) {
          if (
            ((i = o),
            (n = i[0]),
            n === "(" && (r += 1),
            n === ")" && (r -= 1),
            r === 0 && n === ":")
          )
            if (!a) this.doubleColon(i);
            else {
              if (a[0] === "word" && a[1] === "progid") continue;
              return s;
            }
          a = i;
        }
        return !1;
      }
      unclosedBracket(e) {
        throw this.input.error(
          "Unclosed bracket",
          { offset: e[2] },
          { offset: e[2] + 1 }
        );
      }
      unknownWord(e) {
        throw this.input.error(
          "Unknown word",
          { offset: e[0][2] },
          { offset: e[0][2] + e[0][1].length }
        );
      }
      unexpectedClose(e) {
        throw this.input.error(
          "Unexpected }",
          { offset: e[2] },
          { offset: e[2] + 1 }
        );
      }
      unclosedBlock() {
        let e = this.current.source.start;
        throw this.input.error("Unclosed block", e.line, e.column);
      }
      doubleColon(e) {
        throw this.input.error(
          "Double colon",
          { offset: e[2] },
          { offset: e[2] + e[1].length }
        );
      }
      unnamedAtrule(e, r) {
        throw this.input.error(
          "At-rule without name",
          { offset: r[2] },
          { offset: r[2] + r[1].length }
        );
      }
      precheckMissedSemicolon() {}
      checkMissedSemicolon(e) {
        let r = this.colon(e);
        if (r === !1) return;
        let i = 0,
          n;
        for (
          let a = r - 1;
          a >= 0 && ((n = e[a]), !(n[0] !== "space" && ((i += 1), i === 2)));
          a--
        );
        throw this.input.error(
          "Missed semicolon",
          n[0] === "word" ? n[3] + 1 : n[2]
        );
      }
    };
    Ld.exports = Md;
  });
  var Nd = k(() => {
    u();
  });
  var $d = k((oL, zd) => {
    u();
    var SS = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict",
      _S =
        (t, e = 21) =>
        (r = e) => {
          let i = "",
            n = r;
          for (; n--; ) i += t[(Math.random() * t.length) | 0];
          return i;
        },
      TS = (t = 21) => {
        let e = "",
          r = t;
        for (; r--; ) e += SS[(Math.random() * 64) | 0];
        return e;
      };
    zd.exports = { nanoid: TS, customAlphabet: _S };
  });
  var ho = k((lL, jd) => {
    u();
    jd.exports = {};
  });
  var us = k((uL, Gd) => {
    u();
    ("use strict");
    var { SourceMapConsumer: OS, SourceMapGenerator: ES } = Nd(),
      { fileURLToPath: Ud, pathToFileURL: ls } = (eo(), Hp),
      { resolve: mo, isAbsolute: go } = (Yt(), Vp),
      { nanoid: AS } = $d(),
      yo = to(),
      Vd = jn(),
      CS = ho(),
      wo = Symbol("fromOffsetCache"),
      PS = Boolean(OS && ES),
      Wd = Boolean(mo && go),
      pi = class {
        constructor(e, r = {}) {
          if (
            e === null ||
            typeof e == "undefined" ||
            (typeof e == "object" && !e.toString)
          )
            throw new Error(`PostCSS received ${e} instead of CSS string`);
          if (
            ((this.css = e.toString()),
            this.css[0] === "\uFEFF" || this.css[0] === "\uFFFE"
              ? ((this.hasBOM = !0), (this.css = this.css.slice(1)))
              : (this.hasBOM = !1),
            r.from &&
              (!Wd || /^\w+:\/\//.test(r.from) || go(r.from)
                ? (this.file = r.from)
                : (this.file = mo(r.from))),
            Wd && PS)
          ) {
            let i = new CS(this.css, r);
            if (i.text) {
              this.map = i;
              let n = i.consumer().file;
              !this.file && n && (this.file = this.mapResolve(n));
            }
          }
          this.file || (this.id = "<input css " + AS(6) + ">"),
            this.map && (this.map.file = this.from);
        }
        fromOffset(e) {
          let r, i;
          if (this[wo]) i = this[wo];
          else {
            let a = this.css.split(`
`);
            i = new Array(a.length);
            let s = 0;
            for (let o = 0, l = a.length; o < l; o++)
              (i[o] = s), (s += a[o].length + 1);
            this[wo] = i;
          }
          r = i[i.length - 1];
          let n = 0;
          if (e >= r) n = i.length - 1;
          else {
            let a = i.length - 2,
              s;
            for (; n < a; )
              if (((s = n + ((a - n) >> 1)), e < i[s])) a = s - 1;
              else if (e >= i[s + 1]) n = s + 1;
              else {
                n = s;
                break;
              }
          }
          return { line: n + 1, col: e - i[n] + 1 };
        }
        error(e, r, i, n = {}) {
          let a, s, o;
          if (r && typeof r == "object") {
            let c = r,
              f = i;
            if (typeof c.offset == "number") {
              let p = this.fromOffset(c.offset);
              (r = p.line), (i = p.col);
            } else (r = c.line), (i = c.column);
            if (typeof f.offset == "number") {
              let p = this.fromOffset(f.offset);
              (s = p.line), (o = p.col);
            } else (s = f.line), (o = f.column);
          } else if (!i) {
            let c = this.fromOffset(r);
            (r = c.line), (i = c.col);
          }
          let l = this.origin(r, i, s, o);
          return (
            l
              ? (a = new Vd(
                  e,
                  l.endLine === void 0
                    ? l.line
                    : { line: l.line, column: l.column },
                  l.endLine === void 0
                    ? l.column
                    : { line: l.endLine, column: l.endColumn },
                  l.source,
                  l.file,
                  n.plugin
                ))
              : (a = new Vd(
                  e,
                  s === void 0 ? r : { line: r, column: i },
                  s === void 0 ? i : { line: s, column: o },
                  this.css,
                  this.file,
                  n.plugin
                )),
            (a.input = {
              line: r,
              column: i,
              endLine: s,
              endColumn: o,
              source: this.css,
            }),
            this.file &&
              (ls && (a.input.url = ls(this.file).toString()),
              (a.input.file = this.file)),
            a
          );
        }
        origin(e, r, i, n) {
          if (!this.map) return !1;
          let a = this.map.consumer(),
            s = a.originalPositionFor({ line: e, column: r });
          if (!s.source) return !1;
          let o;
          typeof i == "number" &&
            (o = a.originalPositionFor({ line: i, column: n }));
          let l;
          go(s.source)
            ? (l = ls(s.source))
            : (l = new URL(
                s.source,
                this.map.consumer().sourceRoot || ls(this.map.mapFile)
              ));
          let c = {
            url: l.toString(),
            line: s.line,
            column: s.column,
            endLine: o && o.line,
            endColumn: o && o.column,
          };
          if (l.protocol === "file:")
            if (Ud) c.file = Ud(l);
            else
              throw new Error(
                "file: protocol is not available in this PostCSS build"
              );
          let f = a.sourceContentFor(s.source);
          return f && (c.source = f), c;
        }
        mapResolve(e) {
          return /^\w+:\/\//.test(e)
            ? e
            : mo(this.map.consumer().sourceRoot || this.map.root || ".", e);
        }
        get from() {
          return this.file || this.id;
        }
        toJSON() {
          let e = {};
          for (let r of ["hasBOM", "css", "file", "id"])
            this[r] != null && (e[r] = this[r]);
          return (
            this.map &&
              ((e.map = { ...this.map }),
              e.map.consumerCache && (e.map.consumerCache = void 0)),
            e
          );
        }
      };
    Gd.exports = pi;
    pi.default = pi;
    yo && yo.registerInput && yo.registerInput(pi);
  });
  var cs = k((fL, Hd) => {
    u();
    ("use strict");
    var IS = It(),
      qS = Fd(),
      DS = us();
    function fs(t, e) {
      let r = new DS(t, e),
        i = new qS(r);
      try {
        i.parse();
      } catch (n) {
        throw n;
      }
      return i.root;
    }
    Hd.exports = fs;
    fs.default = fs;
    IS.registerParse(fs);
  });
  var xo = k((pL, Kd) => {
    u();
    ("use strict");
    var { isClean: tt, my: RS } = Un(),
      BS = ao(),
      MS = ni(),
      LS = It(),
      FS = Qn(),
      cL = uo(),
      Yd = Xn(),
      NS = cs(),
      zS = cr(),
      $S = {
        document: "Document",
        root: "Root",
        atrule: "AtRule",
        rule: "Rule",
        decl: "Declaration",
        comment: "Comment",
      },
      jS = {
        postcssPlugin: !0,
        prepare: !0,
        Once: !0,
        Document: !0,
        Root: !0,
        Declaration: !0,
        Rule: !0,
        AtRule: !0,
        Comment: !0,
        DeclarationExit: !0,
        RuleExit: !0,
        AtRuleExit: !0,
        CommentExit: !0,
        RootExit: !0,
        DocumentExit: !0,
        OnceExit: !0,
      },
      US = { postcssPlugin: !0, prepare: !0, Once: !0 },
      pr = 0;
    function di(t) {
      return typeof t == "object" && typeof t.then == "function";
    }
    function Qd(t) {
      let e = !1,
        r = $S[t.type];
      return (
        t.type === "decl"
          ? (e = t.prop.toLowerCase())
          : t.type === "atrule" && (e = t.name.toLowerCase()),
        e && t.append
          ? [r, r + "-" + e, pr, r + "Exit", r + "Exit-" + e]
          : e
          ? [r, r + "-" + e, r + "Exit", r + "Exit-" + e]
          : t.append
          ? [r, pr, r + "Exit"]
          : [r, r + "Exit"]
      );
    }
    function Jd(t) {
      let e;
      return (
        t.type === "document"
          ? (e = ["Document", pr, "DocumentExit"])
          : t.type === "root"
          ? (e = ["Root", pr, "RootExit"])
          : (e = Qd(t)),
        {
          node: t,
          events: e,
          eventIndex: 0,
          visitors: [],
          visitorIndex: 0,
          iterator: 0,
        }
      );
    }
    function vo(t) {
      return (t[tt] = !1), t.nodes && t.nodes.forEach((e) => vo(e)), t;
    }
    var bo = {},
      pt = class {
        constructor(e, r, i) {
          (this.stringified = !1), (this.processed = !1);
          let n;
          if (
            typeof r == "object" &&
            r !== null &&
            (r.type === "root" || r.type === "document")
          )
            n = vo(r);
          else if (r instanceof pt || r instanceof Yd)
            (n = vo(r.root)),
              r.map &&
                (typeof i.map == "undefined" && (i.map = {}),
                i.map.inline || (i.map.inline = !1),
                (i.map.prev = r.map));
          else {
            let a = NS;
            i.syntax && (a = i.syntax.parse),
              i.parser && (a = i.parser),
              a.parse && (a = a.parse);
            try {
              n = a(r, i);
            } catch (s) {
              (this.processed = !0), (this.error = s);
            }
            n && !n[RS] && LS.rebuild(n);
          }
          (this.result = new Yd(e, n, i)),
            (this.helpers = { ...bo, result: this.result, postcss: bo }),
            (this.plugins = this.processor.plugins.map((a) =>
              typeof a == "object" && a.prepare
                ? { ...a, ...a.prepare(this.result) }
                : a
            ));
        }
        get [Symbol.toStringTag]() {
          return "LazyResult";
        }
        get processor() {
          return this.result.processor;
        }
        get opts() {
          return this.result.opts;
        }
        get css() {
          return this.stringify().css;
        }
        get content() {
          return this.stringify().content;
        }
        get map() {
          return this.stringify().map;
        }
        get root() {
          return this.sync().root;
        }
        get messages() {
          return this.sync().messages;
        }
        warnings() {
          return this.sync().warnings();
        }
        toString() {
          return this.css;
        }
        then(e, r) {
          return this.async().then(e, r);
        }
        catch(e) {
          return this.async().catch(e);
        }
        finally(e) {
          return this.async().then(e, e);
        }
        async() {
          return this.error
            ? Promise.reject(this.error)
            : this.processed
            ? Promise.resolve(this.result)
            : (this.processing || (this.processing = this.runAsync()),
              this.processing);
        }
        sync() {
          if (this.error) throw this.error;
          if (this.processed) return this.result;
          if (((this.processed = !0), this.processing))
            throw this.getAsyncError();
          for (let e of this.plugins) {
            let r = this.runOnRoot(e);
            if (di(r)) throw this.getAsyncError();
          }
          if ((this.prepareVisitors(), this.hasListener)) {
            let e = this.result.root;
            for (; !e[tt]; ) (e[tt] = !0), this.walkSync(e);
            if (this.listeners.OnceExit)
              if (e.type === "document")
                for (let r of e.nodes)
                  this.visitSync(this.listeners.OnceExit, r);
              else this.visitSync(this.listeners.OnceExit, e);
          }
          return this.result;
        }
        stringify() {
          if (this.error) throw this.error;
          if (this.stringified) return this.result;
          (this.stringified = !0), this.sync();
          let e = this.result.opts,
            r = MS;
          e.syntax && (r = e.syntax.stringify),
            e.stringifier && (r = e.stringifier),
            r.stringify && (r = r.stringify);
          let n = new BS(r, this.result.root, this.result.opts).generate();
          return (
            (this.result.css = n[0]), (this.result.map = n[1]), this.result
          );
        }
        walkSync(e) {
          e[tt] = !0;
          let r = Qd(e);
          for (let i of r)
            if (i === pr)
              e.nodes &&
                e.each((n) => {
                  n[tt] || this.walkSync(n);
                });
            else {
              let n = this.listeners[i];
              if (n && this.visitSync(n, e.toProxy())) return;
            }
        }
        visitSync(e, r) {
          for (let [i, n] of e) {
            this.result.lastPlugin = i;
            let a;
            try {
              a = n(r, this.helpers);
            } catch (s) {
              throw this.handleError(s, r.proxyOf);
            }
            if (r.type !== "root" && r.type !== "document" && !r.parent)
              return !0;
            if (di(a)) throw this.getAsyncError();
          }
        }
        runOnRoot(e) {
          this.result.lastPlugin = e;
          try {
            if (typeof e == "object" && e.Once) {
              if (this.result.root.type === "document") {
                let r = this.result.root.nodes.map((i) =>
                  e.Once(i, this.helpers)
                );
                return di(r[0]) ? Promise.all(r) : r;
              }
              return e.Once(this.result.root, this.helpers);
            } else if (typeof e == "function")
              return e(this.result.root, this.result);
          } catch (r) {
            throw this.handleError(r);
          }
        }
        getAsyncError() {
          throw new Error(
            "Use process(css).then(cb) to work with async plugins"
          );
        }
        handleError(e, r) {
          let i = this.result.lastPlugin;
          try {
            r && r.addToError(e),
              (this.error = e),
              e.name === "CssSyntaxError" && !e.plugin
                ? ((e.plugin = i.postcssPlugin), e.setMessage())
                : i.postcssVersion;
          } catch (n) {
            console && console.error && console.error(n);
          }
          return e;
        }
        async runAsync() {
          this.plugin = 0;
          for (let e = 0; e < this.plugins.length; e++) {
            let r = this.plugins[e],
              i = this.runOnRoot(r);
            if (di(i))
              try {
                await i;
              } catch (n) {
                throw this.handleError(n);
              }
          }
          if ((this.prepareVisitors(), this.hasListener)) {
            let e = this.result.root;
            for (; !e[tt]; ) {
              e[tt] = !0;
              let r = [Jd(e)];
              for (; r.length > 0; ) {
                let i = this.visitTick(r);
                if (di(i))
                  try {
                    await i;
                  } catch (n) {
                    let a = r[r.length - 1].node;
                    throw this.handleError(n, a);
                  }
              }
            }
            if (this.listeners.OnceExit)
              for (let [r, i] of this.listeners.OnceExit) {
                this.result.lastPlugin = r;
                try {
                  if (e.type === "document") {
                    let n = e.nodes.map((a) => i(a, this.helpers));
                    await Promise.all(n);
                  } else await i(e, this.helpers);
                } catch (n) {
                  throw this.handleError(n);
                }
              }
          }
          return (this.processed = !0), this.stringify();
        }
        prepareVisitors() {
          this.listeners = {};
          let e = (r, i, n) => {
            this.listeners[i] || (this.listeners[i] = []),
              this.listeners[i].push([r, n]);
          };
          for (let r of this.plugins)
            if (typeof r == "object")
              for (let i in r) {
                if (!jS[i] && /^[A-Z]/.test(i))
                  throw new Error(
                    `Unknown event ${i} in ${r.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
                  );
                if (!US[i])
                  if (typeof r[i] == "object")
                    for (let n in r[i])
                      n === "*"
                        ? e(r, i, r[i][n])
                        : e(r, i + "-" + n.toLowerCase(), r[i][n]);
                  else typeof r[i] == "function" && e(r, i, r[i]);
              }
          this.hasListener = Object.keys(this.listeners).length > 0;
        }
        visitTick(e) {
          let r = e[e.length - 1],
            { node: i, visitors: n } = r;
          if (i.type !== "root" && i.type !== "document" && !i.parent) {
            e.pop();
            return;
          }
          if (n.length > 0 && r.visitorIndex < n.length) {
            let [s, o] = n[r.visitorIndex];
            (r.visitorIndex += 1),
              r.visitorIndex === n.length &&
                ((r.visitors = []), (r.visitorIndex = 0)),
              (this.result.lastPlugin = s);
            try {
              return o(i.toProxy(), this.helpers);
            } catch (l) {
              throw this.handleError(l, i);
            }
          }
          if (r.iterator !== 0) {
            let s = r.iterator,
              o;
            for (; (o = i.nodes[i.indexes[s]]); )
              if (((i.indexes[s] += 1), !o[tt])) {
                (o[tt] = !0), e.push(Jd(o));
                return;
              }
            (r.iterator = 0), delete i.indexes[s];
          }
          let a = r.events;
          for (; r.eventIndex < a.length; ) {
            let s = a[r.eventIndex];
            if (((r.eventIndex += 1), s === pr)) {
              i.nodes &&
                i.nodes.length &&
                ((i[tt] = !0), (r.iterator = i.getIterator()));
              return;
            } else if (this.listeners[s]) {
              r.visitors = this.listeners[s];
              return;
            }
          }
          e.pop();
        }
      };
    pt.registerPostcss = (t) => {
      bo = t;
    };
    Kd.exports = pt;
    pt.default = pt;
    zS.registerLazyResult(pt);
    FS.registerLazyResult(pt);
  });
  var Zd = k((hL, Xd) => {
    u();
    ("use strict");
    var VS = ao(),
      WS = ni(),
      dL = uo(),
      GS = cs(),
      HS = Xn(),
      ps = class {
        constructor(e, r, i) {
          (r = r.toString()),
            (this.stringified = !1),
            (this._processor = e),
            (this._css = r),
            (this._opts = i),
            (this._map = void 0);
          let n,
            a = WS;
          (this.result = new HS(this._processor, n, this._opts)),
            (this.result.css = r);
          let s = this;
          Object.defineProperty(this.result, "root", {
            get() {
              return s.root;
            },
          });
          let o = new VS(a, n, this._opts, r);
          if (o.isMap()) {
            let [l, c] = o.generate();
            l && (this.result.css = l), c && (this.result.map = c);
          }
        }
        get [Symbol.toStringTag]() {
          return "NoWorkResult";
        }
        get processor() {
          return this.result.processor;
        }
        get opts() {
          return this.result.opts;
        }
        get css() {
          return this.result.css;
        }
        get content() {
          return this.result.css;
        }
        get map() {
          return this.result.map;
        }
        get root() {
          if (this._root) return this._root;
          let e,
            r = GS;
          try {
            e = r(this._css, this._opts);
          } catch (i) {
            this.error = i;
          }
          if (this.error) throw this.error;
          return (this._root = e), e;
        }
        get messages() {
          return [];
        }
        warnings() {
          return [];
        }
        toString() {
          return this._css;
        }
        then(e, r) {
          return this.async().then(e, r);
        }
        catch(e) {
          return this.async().catch(e);
        }
        finally(e) {
          return this.async().then(e, e);
        }
        async() {
          return this.error
            ? Promise.reject(this.error)
            : Promise.resolve(this.result);
        }
        sync() {
          if (this.error) throw this.error;
          return this.result;
        }
      };
    Xd.exports = ps;
    ps.default = ps;
  });
  var th = k((mL, eh) => {
    u();
    ("use strict");
    var YS = Zd(),
      QS = xo(),
      JS = Qn(),
      KS = cr(),
      dr = class {
        constructor(e = []) {
          (this.version = "8.4.24"), (this.plugins = this.normalize(e));
        }
        use(e) {
          return (
            (this.plugins = this.plugins.concat(this.normalize([e]))), this
          );
        }
        process(e, r = {}) {
          return this.plugins.length === 0 &&
            typeof r.parser == "undefined" &&
            typeof r.stringifier == "undefined" &&
            typeof r.syntax == "undefined"
            ? new YS(this, e, r)
            : new QS(this, e, r);
        }
        normalize(e) {
          let r = [];
          for (let i of e)
            if (
              (i.postcss === !0 ? (i = i()) : i.postcss && (i = i.postcss),
              typeof i == "object" && Array.isArray(i.plugins))
            )
              r = r.concat(i.plugins);
            else if (typeof i == "object" && i.postcssPlugin) r.push(i);
            else if (typeof i == "function") r.push(i);
            else if (!(typeof i == "object" && (i.parse || i.stringify)))
              throw new Error(i + " is not a PostCSS plugin");
          return r;
        }
      };
    eh.exports = dr;
    dr.default = dr;
    KS.registerProcessor(dr);
    JS.registerProcessor(dr);
  });
  var ih = k((gL, rh) => {
    u();
    ("use strict");
    var XS = ai(),
      ZS = ho(),
      e2 = oi(),
      t2 = as(),
      r2 = us(),
      i2 = cr(),
      n2 = os();
    function hi(t, e) {
      if (Array.isArray(t)) return t.map((n) => hi(n));
      let { inputs: r, ...i } = t;
      if (r) {
        e = [];
        for (let n of r) {
          let a = { ...n, __proto__: r2.prototype };
          a.map && (a.map = { ...a.map, __proto__: ZS.prototype }), e.push(a);
        }
      }
      if ((i.nodes && (i.nodes = t.nodes.map((n) => hi(n, e))), i.source)) {
        let { inputId: n, ...a } = i.source;
        (i.source = a), n != null && (i.source.input = e[n]);
      }
      if (i.type === "root") return new i2(i);
      if (i.type === "decl") return new XS(i);
      if (i.type === "rule") return new n2(i);
      if (i.type === "comment") return new e2(i);
      if (i.type === "atrule") return new t2(i);
      throw new Error("Unknown node type: " + t.type);
    }
    rh.exports = hi;
    hi.default = hi;
  });
  var Re = k((yL, fh) => {
    u();
    ("use strict");
    var s2 = jn(),
      nh = ai(),
      a2 = xo(),
      o2 = It(),
      ko = th(),
      l2 = ni(),
      u2 = ih(),
      sh = Qn(),
      f2 = fo(),
      ah = oi(),
      oh = as(),
      c2 = Xn(),
      p2 = us(),
      d2 = cs(),
      h2 = po(),
      lh = os(),
      uh = cr(),
      m2 = si();
    function Q(...t) {
      return t.length === 1 && Array.isArray(t[0]) && (t = t[0]), new ko(t);
    }
    Q.plugin = function (e, r) {
      let i = !1;
      function n(...s) {
        console &&
          console.warn &&
          !i &&
          ((i = !0),
          console.warn(
            e +
              `: postcss.plugin was deprecated. Migration guide:
https://evilmartians.com/chronicles/postcss-8-plugin-migration`
          ),
          g.env.LANG &&
            g.env.LANG.startsWith("cn") &&
            console.warn(
              e +
                `: \u91CC\u9762 postcss.plugin \u88AB\u5F03\u7528. \u8FC1\u79FB\u6307\u5357:
https://www.w3ctech.com/topic/2226`
            ));
        let o = r(...s);
        return (o.postcssPlugin = e), (o.postcssVersion = new ko().version), o;
      }
      let a;
      return (
        Object.defineProperty(n, "postcss", {
          get() {
            return a || (a = n()), a;
          },
        }),
        (n.process = function (s, o, l) {
          return Q([n(l)]).process(s, o);
        }),
        n
      );
    };
    Q.stringify = l2;
    Q.parse = d2;
    Q.fromJSON = u2;
    Q.list = h2;
    Q.comment = (t) => new ah(t);
    Q.atRule = (t) => new oh(t);
    Q.decl = (t) => new nh(t);
    Q.rule = (t) => new lh(t);
    Q.root = (t) => new uh(t);
    Q.document = (t) => new sh(t);
    Q.CssSyntaxError = s2;
    Q.Declaration = nh;
    Q.Container = o2;
    Q.Processor = ko;
    Q.Document = sh;
    Q.Comment = ah;
    Q.Warning = f2;
    Q.AtRule = oh;
    Q.Result = c2;
    Q.Input = p2;
    Q.Rule = lh;
    Q.Root = uh;
    Q.Node = m2;
    a2.registerPostcss(Q);
    fh.exports = Q;
    Q.default = Q;
  });
  var Z,
    J,
    wL,
    vL,
    bL,
    xL,
    kL,
    SL,
    _L,
    TL,
    OL,
    EL,
    AL,
    CL,
    PL,
    IL,
    qL,
    DL,
    RL,
    BL,
    ML,
    LL,
    FL,
    NL,
    zL,
    $L,
    qt = A(() => {
      u();
      (Z = ce(Re())),
        (J = Z.default),
        (wL = Z.default.stringify),
        (vL = Z.default.fromJSON),
        (bL = Z.default.plugin),
        (xL = Z.default.parse),
        (kL = Z.default.list),
        (SL = Z.default.document),
        (_L = Z.default.comment),
        (TL = Z.default.atRule),
        (OL = Z.default.rule),
        (EL = Z.default.decl),
        (AL = Z.default.root),
        (CL = Z.default.CssSyntaxError),
        (PL = Z.default.Declaration),
        (IL = Z.default.Container),
        (qL = Z.default.Processor),
        (DL = Z.default.Document),
        (RL = Z.default.Comment),
        (BL = Z.default.Warning),
        (ML = Z.default.AtRule),
        (LL = Z.default.Result),
        (FL = Z.default.Input),
        (NL = Z.default.Rule),
        (zL = Z.default.Root),
        ($L = Z.default.Node);
    });
  var So = k((UL, ch) => {
    u();
    ch.exports = function (t, e, r, i, n) {
      for (e = e.split ? e.split(".") : e, i = 0; i < e.length; i++)
        t = t ? t[e[i]] : n;
      return t === n ? r : t;
    };
  });
  var hs = k((ds, ph) => {
    u();
    ("use strict");
    ds.__esModule = !0;
    ds.default = w2;
    function g2(t) {
      for (
        var e = t.toLowerCase(), r = "", i = !1, n = 0;
        n < 6 && e[n] !== void 0;
        n++
      ) {
        var a = e.charCodeAt(n),
          s = (a >= 97 && a <= 102) || (a >= 48 && a <= 57);
        if (((i = a === 32), !s)) break;
        r += e[n];
      }
      if (r.length !== 0) {
        var o = parseInt(r, 16),
          l = o >= 55296 && o <= 57343;
        return l || o === 0 || o > 1114111
          ? ["\uFFFD", r.length + (i ? 1 : 0)]
          : [String.fromCodePoint(o), r.length + (i ? 1 : 0)];
      }
    }
    var y2 = /\\/;
    function w2(t) {
      var e = y2.test(t);
      if (!e) return t;
      for (var r = "", i = 0; i < t.length; i++) {
        if (t[i] === "\\") {
          var n = g2(t.slice(i + 1, i + 7));
          if (n !== void 0) {
            (r += n[0]), (i += n[1]);
            continue;
          }
          if (t[i + 1] === "\\") {
            (r += "\\"), i++;
            continue;
          }
          t.length === i + 1 && (r += t[i]);
          continue;
        }
        r += t[i];
      }
      return r;
    }
    ph.exports = ds.default;
  });
  var hh = k((ms, dh) => {
    u();
    ("use strict");
    ms.__esModule = !0;
    ms.default = v2;
    function v2(t) {
      for (
        var e = arguments.length, r = new Array(e > 1 ? e - 1 : 0), i = 1;
        i < e;
        i++
      )
        r[i - 1] = arguments[i];
      for (; r.length > 0; ) {
        var n = r.shift();
        if (!t[n]) return;
        t = t[n];
      }
      return t;
    }
    dh.exports = ms.default;
  });
  var gh = k((gs, mh) => {
    u();
    ("use strict");
    gs.__esModule = !0;
    gs.default = b2;
    function b2(t) {
      for (
        var e = arguments.length, r = new Array(e > 1 ? e - 1 : 0), i = 1;
        i < e;
        i++
      )
        r[i - 1] = arguments[i];
      for (; r.length > 0; ) {
        var n = r.shift();
        t[n] || (t[n] = {}), (t = t[n]);
      }
    }
    mh.exports = gs.default;
  });
  var wh = k((ys, yh) => {
    u();
    ("use strict");
    ys.__esModule = !0;
    ys.default = x2;
    function x2(t) {
      for (var e = "", r = t.indexOf("/*"), i = 0; r >= 0; ) {
        e = e + t.slice(i, r);
        var n = t.indexOf("*/", r + 2);
        if (n < 0) return e;
        (i = n + 2), (r = t.indexOf("/*", i));
      }
      return (e = e + t.slice(i)), e;
    }
    yh.exports = ys.default;
  });
  var mi = k((rt) => {
    u();
    ("use strict");
    rt.__esModule = !0;
    rt.unesc = rt.stripComments = rt.getProp = rt.ensureObject = void 0;
    var k2 = ws(hs());
    rt.unesc = k2.default;
    var S2 = ws(hh());
    rt.getProp = S2.default;
    var _2 = ws(gh());
    rt.ensureObject = _2.default;
    var T2 = ws(wh());
    rt.stripComments = T2.default;
    function ws(t) {
      return t && t.__esModule ? t : { default: t };
    }
  });
  var dt = k((gi, xh) => {
    u();
    ("use strict");
    gi.__esModule = !0;
    gi.default = void 0;
    var vh = mi();
    function bh(t, e) {
      for (var r = 0; r < e.length; r++) {
        var i = e[r];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(t, i.key, i);
      }
    }
    function O2(t, e, r) {
      return (
        e && bh(t.prototype, e),
        r && bh(t, r),
        Object.defineProperty(t, "prototype", { writable: !1 }),
        t
      );
    }
    var E2 = function t(e, r) {
        if (typeof e != "object" || e === null) return e;
        var i = new e.constructor();
        for (var n in e)
          if (!!e.hasOwnProperty(n)) {
            var a = e[n],
              s = typeof a;
            n === "parent" && s === "object"
              ? r && (i[n] = r)
              : a instanceof Array
              ? (i[n] = a.map(function (o) {
                  return t(o, i);
                }))
              : (i[n] = t(a, i));
          }
        return i;
      },
      A2 = (function () {
        function t(r) {
          r === void 0 && (r = {}),
            Object.assign(this, r),
            (this.spaces = this.spaces || {}),
            (this.spaces.before = this.spaces.before || ""),
            (this.spaces.after = this.spaces.after || "");
        }
        var e = t.prototype;
        return (
          (e.remove = function () {
            return (
              this.parent && this.parent.removeChild(this),
              (this.parent = void 0),
              this
            );
          }),
          (e.replaceWith = function () {
            if (this.parent) {
              for (var i in arguments)
                this.parent.insertBefore(this, arguments[i]);
              this.remove();
            }
            return this;
          }),
          (e.next = function () {
            return this.parent.at(this.parent.index(this) + 1);
          }),
          (e.prev = function () {
            return this.parent.at(this.parent.index(this) - 1);
          }),
          (e.clone = function (i) {
            i === void 0 && (i = {});
            var n = E2(this);
            for (var a in i) n[a] = i[a];
            return n;
          }),
          (e.appendToPropertyAndEscape = function (i, n, a) {
            this.raws || (this.raws = {});
            var s = this[i],
              o = this.raws[i];
            (this[i] = s + n),
              o || a !== n
                ? (this.raws[i] = (o || s) + a)
                : delete this.raws[i];
          }),
          (e.setPropertyAndEscape = function (i, n, a) {
            this.raws || (this.raws = {}), (this[i] = n), (this.raws[i] = a);
          }),
          (e.setPropertyWithoutEscape = function (i, n) {
            (this[i] = n), this.raws && delete this.raws[i];
          }),
          (e.isAtPosition = function (i, n) {
            if (this.source && this.source.start && this.source.end)
              return !(
                this.source.start.line > i ||
                this.source.end.line < i ||
                (this.source.start.line === i &&
                  this.source.start.column > n) ||
                (this.source.end.line === i && this.source.end.column < n)
              );
          }),
          (e.stringifyProperty = function (i) {
            return (this.raws && this.raws[i]) || this[i];
          }),
          (e.valueToString = function () {
            return String(this.stringifyProperty("value"));
          }),
          (e.toString = function () {
            return [
              this.rawSpaceBefore,
              this.valueToString(),
              this.rawSpaceAfter,
            ].join("");
          }),
          O2(t, [
            {
              key: "rawSpaceBefore",
              get: function () {
                var i =
                  this.raws && this.raws.spaces && this.raws.spaces.before;
                return (
                  i === void 0 && (i = this.spaces && this.spaces.before),
                  i || ""
                );
              },
              set: function (i) {
                (0, vh.ensureObject)(this, "raws", "spaces"),
                  (this.raws.spaces.before = i);
              },
            },
            {
              key: "rawSpaceAfter",
              get: function () {
                var i = this.raws && this.raws.spaces && this.raws.spaces.after;
                return i === void 0 && (i = this.spaces.after), i || "";
              },
              set: function (i) {
                (0, vh.ensureObject)(this, "raws", "spaces"),
                  (this.raws.spaces.after = i);
              },
            },
          ]),
          t
        );
      })();
    gi.default = A2;
    xh.exports = gi.default;
  });
  var xe = k((ee) => {
    u();
    ("use strict");
    ee.__esModule = !0;
    ee.UNIVERSAL =
      ee.TAG =
      ee.STRING =
      ee.SELECTOR =
      ee.ROOT =
      ee.PSEUDO =
      ee.NESTING =
      ee.ID =
      ee.COMMENT =
      ee.COMBINATOR =
      ee.CLASS =
      ee.ATTRIBUTE =
        void 0;
    var C2 = "tag";
    ee.TAG = C2;
    var P2 = "string";
    ee.STRING = P2;
    var I2 = "selector";
    ee.SELECTOR = I2;
    var q2 = "root";
    ee.ROOT = q2;
    var D2 = "pseudo";
    ee.PSEUDO = D2;
    var R2 = "nesting";
    ee.NESTING = R2;
    var B2 = "id";
    ee.ID = B2;
    var M2 = "comment";
    ee.COMMENT = M2;
    var L2 = "combinator";
    ee.COMBINATOR = L2;
    var F2 = "class";
    ee.CLASS = F2;
    var N2 = "attribute";
    ee.ATTRIBUTE = N2;
    var z2 = "universal";
    ee.UNIVERSAL = z2;
  });
  var vs = k((yi, Th) => {
    u();
    ("use strict");
    yi.__esModule = !0;
    yi.default = void 0;
    var $2 = U2(dt()),
      ht = j2(xe());
    function kh(t) {
      if (typeof WeakMap != "function") return null;
      var e = new WeakMap(),
        r = new WeakMap();
      return (kh = function (n) {
        return n ? r : e;
      })(t);
    }
    function j2(t, e) {
      if (!e && t && t.__esModule) return t;
      if (t === null || (typeof t != "object" && typeof t != "function"))
        return { default: t };
      var r = kh(e);
      if (r && r.has(t)) return r.get(t);
      var i = {},
        n = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var a in t)
        if (a !== "default" && Object.prototype.hasOwnProperty.call(t, a)) {
          var s = n ? Object.getOwnPropertyDescriptor(t, a) : null;
          s && (s.get || s.set)
            ? Object.defineProperty(i, a, s)
            : (i[a] = t[a]);
        }
      return (i.default = t), r && r.set(t, i), i;
    }
    function U2(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function V2(t, e) {
      var r =
        (typeof Symbol != "undefined" && t[Symbol.iterator]) || t["@@iterator"];
      if (r) return (r = r.call(t)).next.bind(r);
      if (
        Array.isArray(t) ||
        (r = W2(t)) ||
        (e && t && typeof t.length == "number")
      ) {
        r && (t = r);
        var i = 0;
        return function () {
          return i >= t.length ? { done: !0 } : { done: !1, value: t[i++] };
        };
      }
      throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    function W2(t, e) {
      if (!!t) {
        if (typeof t == "string") return Sh(t, e);
        var r = Object.prototype.toString.call(t).slice(8, -1);
        if (
          (r === "Object" && t.constructor && (r = t.constructor.name),
          r === "Map" || r === "Set")
        )
          return Array.from(t);
        if (
          r === "Arguments" ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
        )
          return Sh(t, e);
      }
    }
    function Sh(t, e) {
      (e == null || e > t.length) && (e = t.length);
      for (var r = 0, i = new Array(e); r < e; r++) i[r] = t[r];
      return i;
    }
    function _h(t, e) {
      for (var r = 0; r < e.length; r++) {
        var i = e[r];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(t, i.key, i);
      }
    }
    function G2(t, e, r) {
      return (
        e && _h(t.prototype, e),
        r && _h(t, r),
        Object.defineProperty(t, "prototype", { writable: !1 }),
        t
      );
    }
    function H2(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        _o(t, e);
    }
    function _o(t, e) {
      return (
        (_o = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        _o(t, e)
      );
    }
    var Y2 = (function (t) {
      H2(e, t);
      function e(i) {
        var n;
        return (n = t.call(this, i) || this), n.nodes || (n.nodes = []), n;
      }
      var r = e.prototype;
      return (
        (r.append = function (n) {
          return (n.parent = this), this.nodes.push(n), this;
        }),
        (r.prepend = function (n) {
          return (n.parent = this), this.nodes.unshift(n), this;
        }),
        (r.at = function (n) {
          return this.nodes[n];
        }),
        (r.index = function (n) {
          return typeof n == "number" ? n : this.nodes.indexOf(n);
        }),
        (r.removeChild = function (n) {
          (n = this.index(n)),
            (this.at(n).parent = void 0),
            this.nodes.splice(n, 1);
          var a;
          for (var s in this.indexes)
            (a = this.indexes[s]), a >= n && (this.indexes[s] = a - 1);
          return this;
        }),
        (r.removeAll = function () {
          for (var n = V2(this.nodes), a; !(a = n()).done; ) {
            var s = a.value;
            s.parent = void 0;
          }
          return (this.nodes = []), this;
        }),
        (r.empty = function () {
          return this.removeAll();
        }),
        (r.insertAfter = function (n, a) {
          a.parent = this;
          var s = this.index(n);
          this.nodes.splice(s + 1, 0, a), (a.parent = this);
          var o;
          for (var l in this.indexes)
            (o = this.indexes[l]), s <= o && (this.indexes[l] = o + 1);
          return this;
        }),
        (r.insertBefore = function (n, a) {
          a.parent = this;
          var s = this.index(n);
          this.nodes.splice(s, 0, a), (a.parent = this);
          var o;
          for (var l in this.indexes)
            (o = this.indexes[l]), o <= s && (this.indexes[l] = o + 1);
          return this;
        }),
        (r._findChildAtPosition = function (n, a) {
          var s = void 0;
          return (
            this.each(function (o) {
              if (o.atPosition) {
                var l = o.atPosition(n, a);
                if (l) return (s = l), !1;
              } else if (o.isAtPosition(n, a)) return (s = o), !1;
            }),
            s
          );
        }),
        (r.atPosition = function (n, a) {
          if (this.isAtPosition(n, a))
            return this._findChildAtPosition(n, a) || this;
        }),
        (r._inferEndPosition = function () {
          this.last &&
            this.last.source &&
            this.last.source.end &&
            ((this.source = this.source || {}),
            (this.source.end = this.source.end || {}),
            Object.assign(this.source.end, this.last.source.end));
        }),
        (r.each = function (n) {
          this.lastEach || (this.lastEach = 0),
            this.indexes || (this.indexes = {}),
            this.lastEach++;
          var a = this.lastEach;
          if (((this.indexes[a] = 0), !!this.length)) {
            for (
              var s, o;
              this.indexes[a] < this.length &&
              ((s = this.indexes[a]), (o = n(this.at(s), s)), o !== !1);

            )
              this.indexes[a] += 1;
            if ((delete this.indexes[a], o === !1)) return !1;
          }
        }),
        (r.walk = function (n) {
          return this.each(function (a, s) {
            var o = n(a, s);
            if ((o !== !1 && a.length && (o = a.walk(n)), o === !1)) return !1;
          });
        }),
        (r.walkAttributes = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === ht.ATTRIBUTE) return n.call(a, s);
          });
        }),
        (r.walkClasses = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === ht.CLASS) return n.call(a, s);
          });
        }),
        (r.walkCombinators = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === ht.COMBINATOR) return n.call(a, s);
          });
        }),
        (r.walkComments = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === ht.COMMENT) return n.call(a, s);
          });
        }),
        (r.walkIds = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === ht.ID) return n.call(a, s);
          });
        }),
        (r.walkNesting = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === ht.NESTING) return n.call(a, s);
          });
        }),
        (r.walkPseudos = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === ht.PSEUDO) return n.call(a, s);
          });
        }),
        (r.walkTags = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === ht.TAG) return n.call(a, s);
          });
        }),
        (r.walkUniversals = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === ht.UNIVERSAL) return n.call(a, s);
          });
        }),
        (r.split = function (n) {
          var a = this,
            s = [];
          return this.reduce(function (o, l, c) {
            var f = n.call(a, l);
            return (
              s.push(l),
              f ? (o.push(s), (s = [])) : c === a.length - 1 && o.push(s),
              o
            );
          }, []);
        }),
        (r.map = function (n) {
          return this.nodes.map(n);
        }),
        (r.reduce = function (n, a) {
          return this.nodes.reduce(n, a);
        }),
        (r.every = function (n) {
          return this.nodes.every(n);
        }),
        (r.some = function (n) {
          return this.nodes.some(n);
        }),
        (r.filter = function (n) {
          return this.nodes.filter(n);
        }),
        (r.sort = function (n) {
          return this.nodes.sort(n);
        }),
        (r.toString = function () {
          return this.map(String).join("");
        }),
        G2(e, [
          {
            key: "first",
            get: function () {
              return this.at(0);
            },
          },
          {
            key: "last",
            get: function () {
              return this.at(this.length - 1);
            },
          },
          {
            key: "length",
            get: function () {
              return this.nodes.length;
            },
          },
        ]),
        e
      );
    })($2.default);
    yi.default = Y2;
    Th.exports = yi.default;
  });
  var Oo = k((wi, Eh) => {
    u();
    ("use strict");
    wi.__esModule = !0;
    wi.default = void 0;
    var Q2 = K2(vs()),
      J2 = xe();
    function K2(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function Oh(t, e) {
      for (var r = 0; r < e.length; r++) {
        var i = e[r];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(t, i.key, i);
      }
    }
    function X2(t, e, r) {
      return (
        e && Oh(t.prototype, e),
        r && Oh(t, r),
        Object.defineProperty(t, "prototype", { writable: !1 }),
        t
      );
    }
    function Z2(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        To(t, e);
    }
    function To(t, e) {
      return (
        (To = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        To(t, e)
      );
    }
    var e_ = (function (t) {
      Z2(e, t);
      function e(i) {
        var n;
        return (n = t.call(this, i) || this), (n.type = J2.ROOT), n;
      }
      var r = e.prototype;
      return (
        (r.toString = function () {
          var n = this.reduce(function (a, s) {
            return a.push(String(s)), a;
          }, []).join(",");
          return this.trailingComma ? n + "," : n;
        }),
        (r.error = function (n, a) {
          return this._error ? this._error(n, a) : new Error(n);
        }),
        X2(e, [
          {
            key: "errorGenerator",
            set: function (n) {
              this._error = n;
            },
          },
        ]),
        e
      );
    })(Q2.default);
    wi.default = e_;
    Eh.exports = wi.default;
  });
  var Ao = k((vi, Ah) => {
    u();
    ("use strict");
    vi.__esModule = !0;
    vi.default = void 0;
    var t_ = i_(vs()),
      r_ = xe();
    function i_(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function n_(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        Eo(t, e);
    }
    function Eo(t, e) {
      return (
        (Eo = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        Eo(t, e)
      );
    }
    var s_ = (function (t) {
      n_(e, t);
      function e(r) {
        var i;
        return (i = t.call(this, r) || this), (i.type = r_.SELECTOR), i;
      }
      return e;
    })(t_.default);
    vi.default = s_;
    Ah.exports = vi.default;
  });
  var Jt = k((GL, Ch) => {
    u();
    ("use strict");
    var a_ = {},
      o_ = a_.hasOwnProperty,
      l_ = function (e, r) {
        if (!e) return r;
        var i = {};
        for (var n in r) i[n] = o_.call(e, n) ? e[n] : r[n];
        return i;
      },
      u_ = /[ -,\.\/:-@\[-\^`\{-~]/,
      f_ = /[ -,\.\/:-@\[\]\^`\{-~]/,
      c_ = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g,
      Co = function t(e, r) {
        (r = l_(r, t.options)),
          r.quotes != "single" && r.quotes != "double" && (r.quotes = "single");
        for (
          var i = r.quotes == "double" ? '"' : "'",
            n = r.isIdentifier,
            a = e.charAt(0),
            s = "",
            o = 0,
            l = e.length;
          o < l;

        ) {
          var c = e.charAt(o++),
            f = c.charCodeAt(),
            p = void 0;
          if (f < 32 || f > 126) {
            if (f >= 55296 && f <= 56319 && o < l) {
              var h = e.charCodeAt(o++);
              (h & 64512) == 56320
                ? (f = ((f & 1023) << 10) + (h & 1023) + 65536)
                : o--;
            }
            p = "\\" + f.toString(16).toUpperCase() + " ";
          } else
            r.escapeEverything
              ? u_.test(c)
                ? (p = "\\" + c)
                : (p = "\\" + f.toString(16).toUpperCase() + " ")
              : /[\t\n\f\r\x0B]/.test(c)
              ? (p = "\\" + f.toString(16).toUpperCase() + " ")
              : c == "\\" ||
                (!n && ((c == '"' && i == c) || (c == "'" && i == c))) ||
                (n && f_.test(c))
              ? (p = "\\" + c)
              : (p = c);
          s += p;
        }
        return (
          n &&
            (/^-[-\d]/.test(s)
              ? (s = "\\-" + s.slice(1))
              : /\d/.test(a) && (s = "\\3" + a + " " + s.slice(1))),
          (s = s.replace(c_, function (m, b, S) {
            return b && b.length % 2 ? m : (b || "") + S;
          })),
          !n && r.wrap ? i + s + i : s
        );
      };
    Co.options = {
      escapeEverything: !1,
      isIdentifier: !1,
      quotes: "single",
      wrap: !1,
    };
    Co.version = "3.0.0";
    Ch.exports = Co;
  });
  var Io = k((bi, qh) => {
    u();
    ("use strict");
    bi.__esModule = !0;
    bi.default = void 0;
    var p_ = Ph(Jt()),
      d_ = mi(),
      h_ = Ph(dt()),
      m_ = xe();
    function Ph(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function Ih(t, e) {
      for (var r = 0; r < e.length; r++) {
        var i = e[r];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(t, i.key, i);
      }
    }
    function g_(t, e, r) {
      return (
        e && Ih(t.prototype, e),
        r && Ih(t, r),
        Object.defineProperty(t, "prototype", { writable: !1 }),
        t
      );
    }
    function y_(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        Po(t, e);
    }
    function Po(t, e) {
      return (
        (Po = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        Po(t, e)
      );
    }
    var w_ = (function (t) {
      y_(e, t);
      function e(i) {
        var n;
        return (
          (n = t.call(this, i) || this),
          (n.type = m_.CLASS),
          (n._constructed = !0),
          n
        );
      }
      var r = e.prototype;
      return (
        (r.valueToString = function () {
          return "." + t.prototype.valueToString.call(this);
        }),
        g_(e, [
          {
            key: "value",
            get: function () {
              return this._value;
            },
            set: function (n) {
              if (this._constructed) {
                var a = (0, p_.default)(n, { isIdentifier: !0 });
                a !== n
                  ? ((0, d_.ensureObject)(this, "raws"), (this.raws.value = a))
                  : this.raws && delete this.raws.value;
              }
              this._value = n;
            },
          },
        ]),
        e
      );
    })(h_.default);
    bi.default = w_;
    qh.exports = bi.default;
  });
  var Do = k((xi, Dh) => {
    u();
    ("use strict");
    xi.__esModule = !0;
    xi.default = void 0;
    var v_ = x_(dt()),
      b_ = xe();
    function x_(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function k_(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        qo(t, e);
    }
    function qo(t, e) {
      return (
        (qo = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        qo(t, e)
      );
    }
    var S_ = (function (t) {
      k_(e, t);
      function e(r) {
        var i;
        return (i = t.call(this, r) || this), (i.type = b_.COMMENT), i;
      }
      return e;
    })(v_.default);
    xi.default = S_;
    Dh.exports = xi.default;
  });
  var Bo = k((ki, Rh) => {
    u();
    ("use strict");
    ki.__esModule = !0;
    ki.default = void 0;
    var __ = O_(dt()),
      T_ = xe();
    function O_(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function E_(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        Ro(t, e);
    }
    function Ro(t, e) {
      return (
        (Ro = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        Ro(t, e)
      );
    }
    var A_ = (function (t) {
      E_(e, t);
      function e(i) {
        var n;
        return (n = t.call(this, i) || this), (n.type = T_.ID), n;
      }
      var r = e.prototype;
      return (
        (r.valueToString = function () {
          return "#" + t.prototype.valueToString.call(this);
        }),
        e
      );
    })(__.default);
    ki.default = A_;
    Rh.exports = ki.default;
  });
  var bs = k((Si, Lh) => {
    u();
    ("use strict");
    Si.__esModule = !0;
    Si.default = void 0;
    var C_ = Bh(Jt()),
      P_ = mi(),
      I_ = Bh(dt());
    function Bh(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function Mh(t, e) {
      for (var r = 0; r < e.length; r++) {
        var i = e[r];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(t, i.key, i);
      }
    }
    function q_(t, e, r) {
      return (
        e && Mh(t.prototype, e),
        r && Mh(t, r),
        Object.defineProperty(t, "prototype", { writable: !1 }),
        t
      );
    }
    function D_(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        Mo(t, e);
    }
    function Mo(t, e) {
      return (
        (Mo = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        Mo(t, e)
      );
    }
    var R_ = (function (t) {
      D_(e, t);
      function e() {
        return t.apply(this, arguments) || this;
      }
      var r = e.prototype;
      return (
        (r.qualifiedName = function (n) {
          return this.namespace ? this.namespaceString + "|" + n : n;
        }),
        (r.valueToString = function () {
          return this.qualifiedName(t.prototype.valueToString.call(this));
        }),
        q_(e, [
          {
            key: "namespace",
            get: function () {
              return this._namespace;
            },
            set: function (n) {
              if (n === !0 || n === "*" || n === "&") {
                (this._namespace = n), this.raws && delete this.raws.namespace;
                return;
              }
              var a = (0, C_.default)(n, { isIdentifier: !0 });
              (this._namespace = n),
                a !== n
                  ? ((0, P_.ensureObject)(this, "raws"),
                    (this.raws.namespace = a))
                  : this.raws && delete this.raws.namespace;
            },
          },
          {
            key: "ns",
            get: function () {
              return this._namespace;
            },
            set: function (n) {
              this.namespace = n;
            },
          },
          {
            key: "namespaceString",
            get: function () {
              if (this.namespace) {
                var n = this.stringifyProperty("namespace");
                return n === !0 ? "" : n;
              } else return "";
            },
          },
        ]),
        e
      );
    })(I_.default);
    Si.default = R_;
    Lh.exports = Si.default;
  });
  var Fo = k((_i, Fh) => {
    u();
    ("use strict");
    _i.__esModule = !0;
    _i.default = void 0;
    var B_ = L_(bs()),
      M_ = xe();
    function L_(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function F_(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        Lo(t, e);
    }
    function Lo(t, e) {
      return (
        (Lo = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        Lo(t, e)
      );
    }
    var N_ = (function (t) {
      F_(e, t);
      function e(r) {
        var i;
        return (i = t.call(this, r) || this), (i.type = M_.TAG), i;
      }
      return e;
    })(B_.default);
    _i.default = N_;
    Fh.exports = _i.default;
  });
  var zo = k((Ti, Nh) => {
    u();
    ("use strict");
    Ti.__esModule = !0;
    Ti.default = void 0;
    var z_ = j_(dt()),
      $_ = xe();
    function j_(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function U_(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        No(t, e);
    }
    function No(t, e) {
      return (
        (No = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        No(t, e)
      );
    }
    var V_ = (function (t) {
      U_(e, t);
      function e(r) {
        var i;
        return (i = t.call(this, r) || this), (i.type = $_.STRING), i;
      }
      return e;
    })(z_.default);
    Ti.default = V_;
    Nh.exports = Ti.default;
  });
  var jo = k((Oi, zh) => {
    u();
    ("use strict");
    Oi.__esModule = !0;
    Oi.default = void 0;
    var W_ = H_(vs()),
      G_ = xe();
    function H_(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function Y_(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        $o(t, e);
    }
    function $o(t, e) {
      return (
        ($o = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        $o(t, e)
      );
    }
    var Q_ = (function (t) {
      Y_(e, t);
      function e(i) {
        var n;
        return (n = t.call(this, i) || this), (n.type = G_.PSEUDO), n;
      }
      var r = e.prototype;
      return (
        (r.toString = function () {
          var n = this.length ? "(" + this.map(String).join(",") + ")" : "";
          return [
            this.rawSpaceBefore,
            this.stringifyProperty("value"),
            n,
            this.rawSpaceAfter,
          ].join("");
        }),
        e
      );
    })(W_.default);
    Oi.default = Q_;
    zh.exports = Oi.default;
  });
  var $h = {};
  He($h, { deprecate: () => J_ });
  function J_(t) {
    return t;
  }
  var jh = A(() => {
    u();
  });
  var Uo = k((HL, Uh) => {
    u();
    Uh.exports = (jh(), $h).deprecate;
  });
  var Qo = k((Ci) => {
    u();
    ("use strict");
    Ci.__esModule = !0;
    Ci.default = void 0;
    Ci.unescapeValue = Ho;
    var Ei = Wo(Jt()),
      K_ = Wo(hs()),
      X_ = Wo(bs()),
      Z_ = xe(),
      Vo;
    function Wo(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function Vh(t, e) {
      for (var r = 0; r < e.length; r++) {
        var i = e[r];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(t, i.key, i);
      }
    }
    function eT(t, e, r) {
      return (
        e && Vh(t.prototype, e),
        r && Vh(t, r),
        Object.defineProperty(t, "prototype", { writable: !1 }),
        t
      );
    }
    function tT(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        Go(t, e);
    }
    function Go(t, e) {
      return (
        (Go = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        Go(t, e)
      );
    }
    var Ai = Uo(),
      rT = /^('|")([^]*)\1$/,
      iT = Ai(function () {},
      "Assigning an attribute a value containing characters that might need to be escaped is deprecated. Call attribute.setValue() instead."),
      nT = Ai(function () {},
      "Assigning attr.quoted is deprecated and has no effect. Assign to attr.quoteMark instead."),
      sT = Ai(function () {},
      "Constructing an Attribute selector with a value without specifying quoteMark is deprecated. Note: The value should be unescaped now.");
    function Ho(t) {
      var e = !1,
        r = null,
        i = t,
        n = i.match(rT);
      return (
        n && ((r = n[1]), (i = n[2])),
        (i = (0, K_.default)(i)),
        i !== t && (e = !0),
        { deprecatedUsage: e, unescaped: i, quoteMark: r }
      );
    }
    function aT(t) {
      if (t.quoteMark !== void 0 || t.value === void 0) return t;
      sT();
      var e = Ho(t.value),
        r = e.quoteMark,
        i = e.unescaped;
      return (
        t.raws || (t.raws = {}),
        t.raws.value === void 0 && (t.raws.value = t.value),
        (t.value = i),
        (t.quoteMark = r),
        t
      );
    }
    var xs = (function (t) {
      tT(e, t);
      function e(i) {
        var n;
        return (
          i === void 0 && (i = {}),
          (n = t.call(this, aT(i)) || this),
          (n.type = Z_.ATTRIBUTE),
          (n.raws = n.raws || {}),
          Object.defineProperty(n.raws, "unquoted", {
            get: Ai(function () {
              return n.value;
            }, "attr.raws.unquoted is deprecated. Call attr.value instead."),
            set: Ai(function () {
              return n.value;
            }, "Setting attr.raws.unquoted is deprecated and has no effect. attr.value is unescaped by default now."),
          }),
          (n._constructed = !0),
          n
        );
      }
      var r = e.prototype;
      return (
        (r.getQuotedValue = function (n) {
          n === void 0 && (n = {});
          var a = this._determineQuoteMark(n),
            s = Yo[a],
            o = (0, Ei.default)(this._value, s);
          return o;
        }),
        (r._determineQuoteMark = function (n) {
          return n.smart ? this.smartQuoteMark(n) : this.preferredQuoteMark(n);
        }),
        (r.setValue = function (n, a) {
          a === void 0 && (a = {}),
            (this._value = n),
            (this._quoteMark = this._determineQuoteMark(a)),
            this._syncRawValue();
        }),
        (r.smartQuoteMark = function (n) {
          var a = this.value,
            s = a.replace(/[^']/g, "").length,
            o = a.replace(/[^"]/g, "").length;
          if (s + o === 0) {
            var l = (0, Ei.default)(a, { isIdentifier: !0 });
            if (l === a) return e.NO_QUOTE;
            var c = this.preferredQuoteMark(n);
            if (c === e.NO_QUOTE) {
              var f = this.quoteMark || n.quoteMark || e.DOUBLE_QUOTE,
                p = Yo[f],
                h = (0, Ei.default)(a, p);
              if (h.length < l.length) return f;
            }
            return c;
          } else
            return o === s
              ? this.preferredQuoteMark(n)
              : o < s
              ? e.DOUBLE_QUOTE
              : e.SINGLE_QUOTE;
        }),
        (r.preferredQuoteMark = function (n) {
          var a = n.preferCurrentQuoteMark ? this.quoteMark : n.quoteMark;
          return (
            a === void 0 &&
              (a = n.preferCurrentQuoteMark ? n.quoteMark : this.quoteMark),
            a === void 0 && (a = e.DOUBLE_QUOTE),
            a
          );
        }),
        (r._syncRawValue = function () {
          var n = (0, Ei.default)(this._value, Yo[this.quoteMark]);
          n === this._value
            ? this.raws && delete this.raws.value
            : (this.raws.value = n);
        }),
        (r._handleEscapes = function (n, a) {
          if (this._constructed) {
            var s = (0, Ei.default)(a, { isIdentifier: !0 });
            s !== a ? (this.raws[n] = s) : delete this.raws[n];
          }
        }),
        (r._spacesFor = function (n) {
          var a = { before: "", after: "" },
            s = this.spaces[n] || {},
            o = (this.raws.spaces && this.raws.spaces[n]) || {};
          return Object.assign(a, s, o);
        }),
        (r._stringFor = function (n, a, s) {
          a === void 0 && (a = n), s === void 0 && (s = Wh);
          var o = this._spacesFor(a);
          return s(this.stringifyProperty(n), o);
        }),
        (r.offsetOf = function (n) {
          var a = 1,
            s = this._spacesFor("attribute");
          if (((a += s.before.length), n === "namespace" || n === "ns"))
            return this.namespace ? a : -1;
          if (
            n === "attributeNS" ||
            ((a += this.namespaceString.length),
            this.namespace && (a += 1),
            n === "attribute")
          )
            return a;
          (a += this.stringifyProperty("attribute").length),
            (a += s.after.length);
          var o = this._spacesFor("operator");
          a += o.before.length;
          var l = this.stringifyProperty("operator");
          if (n === "operator") return l ? a : -1;
          (a += l.length), (a += o.after.length);
          var c = this._spacesFor("value");
          a += c.before.length;
          var f = this.stringifyProperty("value");
          if (n === "value") return f ? a : -1;
          (a += f.length), (a += c.after.length);
          var p = this._spacesFor("insensitive");
          return (
            (a += p.before.length),
            n === "insensitive" && this.insensitive ? a : -1
          );
        }),
        (r.toString = function () {
          var n = this,
            a = [this.rawSpaceBefore, "["];
          return (
            a.push(this._stringFor("qualifiedAttribute", "attribute")),
            this.operator &&
              (this.value || this.value === "") &&
              (a.push(this._stringFor("operator")),
              a.push(this._stringFor("value")),
              a.push(
                this._stringFor(
                  "insensitiveFlag",
                  "insensitive",
                  function (s, o) {
                    return (
                      s.length > 0 &&
                        !n.quoted &&
                        o.before.length === 0 &&
                        !(n.spaces.value && n.spaces.value.after) &&
                        (o.before = " "),
                      Wh(s, o)
                    );
                  }
                )
              )),
            a.push("]"),
            a.push(this.rawSpaceAfter),
            a.join("")
          );
        }),
        eT(e, [
          {
            key: "quoted",
            get: function () {
              var n = this.quoteMark;
              return n === "'" || n === '"';
            },
            set: function (n) {
              nT();
            },
          },
          {
            key: "quoteMark",
            get: function () {
              return this._quoteMark;
            },
            set: function (n) {
              if (!this._constructed) {
                this._quoteMark = n;
                return;
              }
              this._quoteMark !== n &&
                ((this._quoteMark = n), this._syncRawValue());
            },
          },
          {
            key: "qualifiedAttribute",
            get: function () {
              return this.qualifiedName(this.raws.attribute || this.attribute);
            },
          },
          {
            key: "insensitiveFlag",
            get: function () {
              return this.insensitive ? "i" : "";
            },
          },
          {
            key: "value",
            get: function () {
              return this._value;
            },
            set: function (n) {
              if (this._constructed) {
                var a = Ho(n),
                  s = a.deprecatedUsage,
                  o = a.unescaped,
                  l = a.quoteMark;
                if ((s && iT(), o === this._value && l === this._quoteMark))
                  return;
                (this._value = o), (this._quoteMark = l), this._syncRawValue();
              } else this._value = n;
            },
          },
          {
            key: "insensitive",
            get: function () {
              return this._insensitive;
            },
            set: function (n) {
              n ||
                ((this._insensitive = !1),
                this.raws &&
                  (this.raws.insensitiveFlag === "I" ||
                    this.raws.insensitiveFlag === "i") &&
                  (this.raws.insensitiveFlag = void 0)),
                (this._insensitive = n);
            },
          },
          {
            key: "attribute",
            get: function () {
              return this._attribute;
            },
            set: function (n) {
              this._handleEscapes("attribute", n), (this._attribute = n);
            },
          },
        ]),
        e
      );
    })(X_.default);
    Ci.default = xs;
    xs.NO_QUOTE = null;
    xs.SINGLE_QUOTE = "'";
    xs.DOUBLE_QUOTE = '"';
    var Yo =
      ((Vo = {
        "'": { quotes: "single", wrap: !0 },
        '"': { quotes: "double", wrap: !0 },
      }),
      (Vo[null] = { isIdentifier: !0 }),
      Vo);
    function Wh(t, e) {
      return "" + e.before + t + e.after;
    }
  });
  var Ko = k((Pi, Gh) => {
    u();
    ("use strict");
    Pi.__esModule = !0;
    Pi.default = void 0;
    var oT = uT(bs()),
      lT = xe();
    function uT(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function fT(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        Jo(t, e);
    }
    function Jo(t, e) {
      return (
        (Jo = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        Jo(t, e)
      );
    }
    var cT = (function (t) {
      fT(e, t);
      function e(r) {
        var i;
        return (
          (i = t.call(this, r) || this),
          (i.type = lT.UNIVERSAL),
          (i.value = "*"),
          i
        );
      }
      return e;
    })(oT.default);
    Pi.default = cT;
    Gh.exports = Pi.default;
  });
  var Zo = k((Ii, Hh) => {
    u();
    ("use strict");
    Ii.__esModule = !0;
    Ii.default = void 0;
    var pT = hT(dt()),
      dT = xe();
    function hT(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function mT(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        Xo(t, e);
    }
    function Xo(t, e) {
      return (
        (Xo = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        Xo(t, e)
      );
    }
    var gT = (function (t) {
      mT(e, t);
      function e(r) {
        var i;
        return (i = t.call(this, r) || this), (i.type = dT.COMBINATOR), i;
      }
      return e;
    })(pT.default);
    Ii.default = gT;
    Hh.exports = Ii.default;
  });
  var tl = k((qi, Yh) => {
    u();
    ("use strict");
    qi.__esModule = !0;
    qi.default = void 0;
    var yT = vT(dt()),
      wT = xe();
    function vT(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function bT(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        el(t, e);
    }
    function el(t, e) {
      return (
        (el = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        el(t, e)
      );
    }
    var xT = (function (t) {
      bT(e, t);
      function e(r) {
        var i;
        return (
          (i = t.call(this, r) || this),
          (i.type = wT.NESTING),
          (i.value = "&"),
          i
        );
      }
      return e;
    })(yT.default);
    qi.default = xT;
    Yh.exports = qi.default;
  });
  var Jh = k((ks, Qh) => {
    u();
    ("use strict");
    ks.__esModule = !0;
    ks.default = kT;
    function kT(t) {
      return t.sort(function (e, r) {
        return e - r;
      });
    }
    Qh.exports = ks.default;
  });
  var rl = k((M) => {
    u();
    ("use strict");
    M.__esModule = !0;
    M.word =
      M.tilde =
      M.tab =
      M.str =
      M.space =
      M.slash =
      M.singleQuote =
      M.semicolon =
      M.plus =
      M.pipe =
      M.openSquare =
      M.openParenthesis =
      M.newline =
      M.greaterThan =
      M.feed =
      M.equals =
      M.doubleQuote =
      M.dollar =
      M.cr =
      M.comment =
      M.comma =
      M.combinator =
      M.colon =
      M.closeSquare =
      M.closeParenthesis =
      M.caret =
      M.bang =
      M.backslash =
      M.at =
      M.asterisk =
      M.ampersand =
        void 0;
    var ST = 38;
    M.ampersand = ST;
    var _T = 42;
    M.asterisk = _T;
    var TT = 64;
    M.at = TT;
    var OT = 44;
    M.comma = OT;
    var ET = 58;
    M.colon = ET;
    var AT = 59;
    M.semicolon = AT;
    var CT = 40;
    M.openParenthesis = CT;
    var PT = 41;
    M.closeParenthesis = PT;
    var IT = 91;
    M.openSquare = IT;
    var qT = 93;
    M.closeSquare = qT;
    var DT = 36;
    M.dollar = DT;
    var RT = 126;
    M.tilde = RT;
    var BT = 94;
    M.caret = BT;
    var MT = 43;
    M.plus = MT;
    var LT = 61;
    M.equals = LT;
    var FT = 124;
    M.pipe = FT;
    var NT = 62;
    M.greaterThan = NT;
    var zT = 32;
    M.space = zT;
    var Kh = 39;
    M.singleQuote = Kh;
    var $T = 34;
    M.doubleQuote = $T;
    var jT = 47;
    M.slash = jT;
    var UT = 33;
    M.bang = UT;
    var VT = 92;
    M.backslash = VT;
    var WT = 13;
    M.cr = WT;
    var GT = 12;
    M.feed = GT;
    var HT = 10;
    M.newline = HT;
    var YT = 9;
    M.tab = YT;
    var QT = Kh;
    M.str = QT;
    var JT = -1;
    M.comment = JT;
    var KT = -2;
    M.word = KT;
    var XT = -3;
    M.combinator = XT;
  });
  var em = k((Di) => {
    u();
    ("use strict");
    Di.__esModule = !0;
    Di.FIELDS = void 0;
    Di.default = sO;
    var I = ZT(rl()),
      hr,
      K;
    function Xh(t) {
      if (typeof WeakMap != "function") return null;
      var e = new WeakMap(),
        r = new WeakMap();
      return (Xh = function (n) {
        return n ? r : e;
      })(t);
    }
    function ZT(t, e) {
      if (!e && t && t.__esModule) return t;
      if (t === null || (typeof t != "object" && typeof t != "function"))
        return { default: t };
      var r = Xh(e);
      if (r && r.has(t)) return r.get(t);
      var i = {},
        n = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var a in t)
        if (a !== "default" && Object.prototype.hasOwnProperty.call(t, a)) {
          var s = n ? Object.getOwnPropertyDescriptor(t, a) : null;
          s && (s.get || s.set)
            ? Object.defineProperty(i, a, s)
            : (i[a] = t[a]);
        }
      return (i.default = t), r && r.set(t, i), i;
    }
    var eO =
        ((hr = {}),
        (hr[I.tab] = !0),
        (hr[I.newline] = !0),
        (hr[I.cr] = !0),
        (hr[I.feed] = !0),
        hr),
      tO =
        ((K = {}),
        (K[I.space] = !0),
        (K[I.tab] = !0),
        (K[I.newline] = !0),
        (K[I.cr] = !0),
        (K[I.feed] = !0),
        (K[I.ampersand] = !0),
        (K[I.asterisk] = !0),
        (K[I.bang] = !0),
        (K[I.comma] = !0),
        (K[I.colon] = !0),
        (K[I.semicolon] = !0),
        (K[I.openParenthesis] = !0),
        (K[I.closeParenthesis] = !0),
        (K[I.openSquare] = !0),
        (K[I.closeSquare] = !0),
        (K[I.singleQuote] = !0),
        (K[I.doubleQuote] = !0),
        (K[I.plus] = !0),
        (K[I.pipe] = !0),
        (K[I.tilde] = !0),
        (K[I.greaterThan] = !0),
        (K[I.equals] = !0),
        (K[I.dollar] = !0),
        (K[I.caret] = !0),
        (K[I.slash] = !0),
        K),
      il = {},
      Zh = "0123456789abcdefABCDEF";
    for (Ss = 0; Ss < Zh.length; Ss++) il[Zh.charCodeAt(Ss)] = !0;
    var Ss;
    function rO(t, e) {
      var r = e,
        i;
      do {
        if (((i = t.charCodeAt(r)), tO[i])) return r - 1;
        i === I.backslash ? (r = iO(t, r) + 1) : r++;
      } while (r < t.length);
      return r - 1;
    }
    function iO(t, e) {
      var r = e,
        i = t.charCodeAt(r + 1);
      if (!eO[i])
        if (il[i]) {
          var n = 0;
          do r++, n++, (i = t.charCodeAt(r + 1));
          while (il[i] && n < 6);
          n < 6 && i === I.space && r++;
        } else r++;
      return r;
    }
    var nO = {
      TYPE: 0,
      START_LINE: 1,
      START_COL: 2,
      END_LINE: 3,
      END_COL: 4,
      START_POS: 5,
      END_POS: 6,
    };
    Di.FIELDS = nO;
    function sO(t) {
      var e = [],
        r = t.css.valueOf(),
        i = r,
        n = i.length,
        a = -1,
        s = 1,
        o = 0,
        l = 0,
        c,
        f,
        p,
        h,
        m,
        b,
        S,
        v,
        w,
        _,
        T,
        O,
        E;
      function F(z, N) {
        if (t.safe) (r += N), (w = r.length - 1);
        else throw t.error("Unclosed " + z, s, o - a, o);
      }
      for (; o < n; ) {
        switch (
          ((c = r.charCodeAt(o)), c === I.newline && ((a = o), (s += 1)), c)
        ) {
          case I.space:
          case I.tab:
          case I.newline:
          case I.cr:
          case I.feed:
            w = o;
            do
              (w += 1),
                (c = r.charCodeAt(w)),
                c === I.newline && ((a = w), (s += 1));
            while (
              c === I.space ||
              c === I.newline ||
              c === I.tab ||
              c === I.cr ||
              c === I.feed
            );
            (E = I.space), (h = s), (p = w - a - 1), (l = w);
            break;
          case I.plus:
          case I.greaterThan:
          case I.tilde:
          case I.pipe:
            w = o;
            do (w += 1), (c = r.charCodeAt(w));
            while (
              c === I.plus ||
              c === I.greaterThan ||
              c === I.tilde ||
              c === I.pipe
            );
            (E = I.combinator), (h = s), (p = o - a), (l = w);
            break;
          case I.asterisk:
          case I.ampersand:
          case I.bang:
          case I.comma:
          case I.equals:
          case I.dollar:
          case I.caret:
          case I.openSquare:
          case I.closeSquare:
          case I.colon:
          case I.semicolon:
          case I.openParenthesis:
          case I.closeParenthesis:
            (w = o), (E = c), (h = s), (p = o - a), (l = w + 1);
            break;
          case I.singleQuote:
          case I.doubleQuote:
            (O = c === I.singleQuote ? "'" : '"'), (w = o);
            do
              for (
                m = !1,
                  w = r.indexOf(O, w + 1),
                  w === -1 && F("quote", O),
                  b = w;
                r.charCodeAt(b - 1) === I.backslash;

              )
                (b -= 1), (m = !m);
            while (m);
            (E = I.str), (h = s), (p = o - a), (l = w + 1);
            break;
          default:
            c === I.slash && r.charCodeAt(o + 1) === I.asterisk
              ? ((w = r.indexOf("*/", o + 2) + 1),
                w === 0 && F("comment", "*/"),
                (f = r.slice(o, w + 1)),
                (v = f.split(`
`)),
                (S = v.length - 1),
                S > 0
                  ? ((_ = s + S), (T = w - v[S].length))
                  : ((_ = s), (T = a)),
                (E = I.comment),
                (s = _),
                (h = _),
                (p = w - T))
              : c === I.slash
              ? ((w = o), (E = c), (h = s), (p = o - a), (l = w + 1))
              : ((w = rO(r, o)), (E = I.word), (h = s), (p = w - a)),
              (l = w + 1);
            break;
        }
        e.push([E, s, o - a, h, p, o, l]), T && ((a = T), (T = null)), (o = l);
      }
      return e;
    }
  });
  var lm = k((Ri, om) => {
    u();
    ("use strict");
    Ri.__esModule = !0;
    Ri.default = void 0;
    var aO = Fe(Oo()),
      nl = Fe(Ao()),
      oO = Fe(Io()),
      tm = Fe(Do()),
      lO = Fe(Bo()),
      uO = Fe(Fo()),
      sl = Fe(zo()),
      fO = Fe(jo()),
      rm = _s(Qo()),
      cO = Fe(Ko()),
      al = Fe(Zo()),
      pO = Fe(tl()),
      dO = Fe(Jh()),
      C = _s(em()),
      D = _s(rl()),
      hO = _s(xe()),
      ae = mi(),
      Kt,
      ol;
    function im(t) {
      if (typeof WeakMap != "function") return null;
      var e = new WeakMap(),
        r = new WeakMap();
      return (im = function (n) {
        return n ? r : e;
      })(t);
    }
    function _s(t, e) {
      if (!e && t && t.__esModule) return t;
      if (t === null || (typeof t != "object" && typeof t != "function"))
        return { default: t };
      var r = im(e);
      if (r && r.has(t)) return r.get(t);
      var i = {},
        n = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var a in t)
        if (a !== "default" && Object.prototype.hasOwnProperty.call(t, a)) {
          var s = n ? Object.getOwnPropertyDescriptor(t, a) : null;
          s && (s.get || s.set)
            ? Object.defineProperty(i, a, s)
            : (i[a] = t[a]);
        }
      return (i.default = t), r && r.set(t, i), i;
    }
    function Fe(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function nm(t, e) {
      for (var r = 0; r < e.length; r++) {
        var i = e[r];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(t, i.key, i);
      }
    }
    function mO(t, e, r) {
      return (
        e && nm(t.prototype, e),
        r && nm(t, r),
        Object.defineProperty(t, "prototype", { writable: !1 }),
        t
      );
    }
    var ll =
        ((Kt = {}),
        (Kt[D.space] = !0),
        (Kt[D.cr] = !0),
        (Kt[D.feed] = !0),
        (Kt[D.newline] = !0),
        (Kt[D.tab] = !0),
        Kt),
      gO = Object.assign({}, ll, ((ol = {}), (ol[D.comment] = !0), ol));
    function sm(t) {
      return { line: t[C.FIELDS.START_LINE], column: t[C.FIELDS.START_COL] };
    }
    function am(t) {
      return { line: t[C.FIELDS.END_LINE], column: t[C.FIELDS.END_COL] };
    }
    function Xt(t, e, r, i) {
      return { start: { line: t, column: e }, end: { line: r, column: i } };
    }
    function mr(t) {
      return Xt(
        t[C.FIELDS.START_LINE],
        t[C.FIELDS.START_COL],
        t[C.FIELDS.END_LINE],
        t[C.FIELDS.END_COL]
      );
    }
    function ul(t, e) {
      if (!!t)
        return Xt(
          t[C.FIELDS.START_LINE],
          t[C.FIELDS.START_COL],
          e[C.FIELDS.END_LINE],
          e[C.FIELDS.END_COL]
        );
    }
    function gr(t, e) {
      var r = t[e];
      if (typeof r == "string")
        return (
          r.indexOf("\\") !== -1 &&
            ((0, ae.ensureObject)(t, "raws"),
            (t[e] = (0, ae.unesc)(r)),
            t.raws[e] === void 0 && (t.raws[e] = r)),
          t
        );
    }
    function fl(t, e) {
      for (var r = -1, i = []; (r = t.indexOf(e, r + 1)) !== -1; ) i.push(r);
      return i;
    }
    function yO() {
      var t = Array.prototype.concat.apply([], arguments);
      return t.filter(function (e, r) {
        return r === t.indexOf(e);
      });
    }
    var wO = (function () {
      function t(r, i) {
        i === void 0 && (i = {}),
          (this.rule = r),
          (this.options = Object.assign({ lossy: !1, safe: !1 }, i)),
          (this.position = 0),
          (this.css =
            typeof this.rule == "string" ? this.rule : this.rule.selector),
          (this.tokens = (0, C.default)({
            css: this.css,
            error: this._errorGenerator(),
            safe: this.options.safe,
          }));
        var n = ul(this.tokens[0], this.tokens[this.tokens.length - 1]);
        (this.root = new aO.default({ source: n })),
          (this.root.errorGenerator = this._errorGenerator());
        var a = new nl.default({ source: { start: { line: 1, column: 1 } } });
        this.root.append(a), (this.current = a), this.loop();
      }
      var e = t.prototype;
      return (
        (e._errorGenerator = function () {
          var i = this;
          return function (n, a) {
            return typeof i.rule == "string"
              ? new Error(n)
              : i.rule.error(n, a);
          };
        }),
        (e.attribute = function () {
          var i = [],
            n = this.currToken;
          for (
            this.position++;
            this.position < this.tokens.length &&
            this.currToken[C.FIELDS.TYPE] !== D.closeSquare;

          )
            i.push(this.currToken), this.position++;
          if (this.currToken[C.FIELDS.TYPE] !== D.closeSquare)
            return this.expected(
              "closing square bracket",
              this.currToken[C.FIELDS.START_POS]
            );
          var a = i.length,
            s = {
              source: Xt(n[1], n[2], this.currToken[3], this.currToken[4]),
              sourceIndex: n[C.FIELDS.START_POS],
            };
          if (a === 1 && !~[D.word].indexOf(i[0][C.FIELDS.TYPE]))
            return this.expected("attribute", i[0][C.FIELDS.START_POS]);
          for (var o = 0, l = "", c = "", f = null, p = !1; o < a; ) {
            var h = i[o],
              m = this.content(h),
              b = i[o + 1];
            switch (h[C.FIELDS.TYPE]) {
              case D.space:
                if (((p = !0), this.options.lossy)) break;
                if (f) {
                  (0, ae.ensureObject)(s, "spaces", f);
                  var S = s.spaces[f].after || "";
                  s.spaces[f].after = S + m;
                  var v =
                    (0, ae.getProp)(s, "raws", "spaces", f, "after") || null;
                  v && (s.raws.spaces[f].after = v + m);
                } else (l = l + m), (c = c + m);
                break;
              case D.asterisk:
                if (b[C.FIELDS.TYPE] === D.equals)
                  (s.operator = m), (f = "operator");
                else if ((!s.namespace || (f === "namespace" && !p)) && b) {
                  l &&
                    ((0, ae.ensureObject)(s, "spaces", "attribute"),
                    (s.spaces.attribute.before = l),
                    (l = "")),
                    c &&
                      ((0, ae.ensureObject)(s, "raws", "spaces", "attribute"),
                      (s.raws.spaces.attribute.before = l),
                      (c = "")),
                    (s.namespace = (s.namespace || "") + m);
                  var w = (0, ae.getProp)(s, "raws", "namespace") || null;
                  w && (s.raws.namespace += m), (f = "namespace");
                }
                p = !1;
                break;
              case D.dollar:
                if (f === "value") {
                  var _ = (0, ae.getProp)(s, "raws", "value");
                  (s.value += "$"), _ && (s.raws.value = _ + "$");
                  break;
                }
              case D.caret:
                b[C.FIELDS.TYPE] === D.equals &&
                  ((s.operator = m), (f = "operator")),
                  (p = !1);
                break;
              case D.combinator:
                if (
                  (m === "~" &&
                    b[C.FIELDS.TYPE] === D.equals &&
                    ((s.operator = m), (f = "operator")),
                  m !== "|")
                ) {
                  p = !1;
                  break;
                }
                b[C.FIELDS.TYPE] === D.equals
                  ? ((s.operator = m), (f = "operator"))
                  : !s.namespace && !s.attribute && (s.namespace = !0),
                  (p = !1);
                break;
              case D.word:
                if (
                  b &&
                  this.content(b) === "|" &&
                  i[o + 2] &&
                  i[o + 2][C.FIELDS.TYPE] !== D.equals &&
                  !s.operator &&
                  !s.namespace
                )
                  (s.namespace = m), (f = "namespace");
                else if (!s.attribute || (f === "attribute" && !p)) {
                  l &&
                    ((0, ae.ensureObject)(s, "spaces", "attribute"),
                    (s.spaces.attribute.before = l),
                    (l = "")),
                    c &&
                      ((0, ae.ensureObject)(s, "raws", "spaces", "attribute"),
                      (s.raws.spaces.attribute.before = c),
                      (c = "")),
                    (s.attribute = (s.attribute || "") + m);
                  var T = (0, ae.getProp)(s, "raws", "attribute") || null;
                  T && (s.raws.attribute += m), (f = "attribute");
                } else if (
                  (!s.value && s.value !== "") ||
                  (f === "value" && !(p || s.quoteMark))
                ) {
                  var O = (0, ae.unesc)(m),
                    E = (0, ae.getProp)(s, "raws", "value") || "",
                    F = s.value || "";
                  (s.value = F + O),
                    (s.quoteMark = null),
                    (O !== m || E) &&
                      ((0, ae.ensureObject)(s, "raws"),
                      (s.raws.value = (E || F) + m)),
                    (f = "value");
                } else {
                  var z = m === "i" || m === "I";
                  (s.value || s.value === "") && (s.quoteMark || p)
                    ? ((s.insensitive = z),
                      (!z || m === "I") &&
                        ((0, ae.ensureObject)(s, "raws"),
                        (s.raws.insensitiveFlag = m)),
                      (f = "insensitive"),
                      l &&
                        ((0, ae.ensureObject)(s, "spaces", "insensitive"),
                        (s.spaces.insensitive.before = l),
                        (l = "")),
                      c &&
                        ((0, ae.ensureObject)(
                          s,
                          "raws",
                          "spaces",
                          "insensitive"
                        ),
                        (s.raws.spaces.insensitive.before = c),
                        (c = "")))
                    : (s.value || s.value === "") &&
                      ((f = "value"),
                      (s.value += m),
                      s.raws.value && (s.raws.value += m));
                }
                p = !1;
                break;
              case D.str:
                if (!s.attribute || !s.operator)
                  return this.error(
                    "Expected an attribute followed by an operator preceding the string.",
                    { index: h[C.FIELDS.START_POS] }
                  );
                var N = (0, rm.unescapeValue)(m),
                  fe = N.unescaped,
                  Se = N.quoteMark;
                (s.value = fe),
                  (s.quoteMark = Se),
                  (f = "value"),
                  (0, ae.ensureObject)(s, "raws"),
                  (s.raws.value = m),
                  (p = !1);
                break;
              case D.equals:
                if (!s.attribute)
                  return this.expected("attribute", h[C.FIELDS.START_POS], m);
                if (s.value)
                  return this.error(
                    'Unexpected "=" found; an operator was already defined.',
                    { index: h[C.FIELDS.START_POS] }
                  );
                (s.operator = s.operator ? s.operator + m : m),
                  (f = "operator"),
                  (p = !1);
                break;
              case D.comment:
                if (f)
                  if (
                    p ||
                    (b && b[C.FIELDS.TYPE] === D.space) ||
                    f === "insensitive"
                  ) {
                    var Te = (0, ae.getProp)(s, "spaces", f, "after") || "",
                      Me =
                        (0, ae.getProp)(s, "raws", "spaces", f, "after") || Te;
                    (0, ae.ensureObject)(s, "raws", "spaces", f),
                      (s.raws.spaces[f].after = Me + m);
                  } else {
                    var pe = s[f] || "",
                      ve = (0, ae.getProp)(s, "raws", f) || pe;
                    (0, ae.ensureObject)(s, "raws"), (s.raws[f] = ve + m);
                  }
                else c = c + m;
                break;
              default:
                return this.error('Unexpected "' + m + '" found.', {
                  index: h[C.FIELDS.START_POS],
                });
            }
            o++;
          }
          gr(s, "attribute"),
            gr(s, "namespace"),
            this.newNode(new rm.default(s)),
            this.position++;
        }),
        (e.parseWhitespaceEquivalentTokens = function (i) {
          i < 0 && (i = this.tokens.length);
          var n = this.position,
            a = [],
            s = "",
            o = void 0;
          do
            if (ll[this.currToken[C.FIELDS.TYPE]])
              this.options.lossy || (s += this.content());
            else if (this.currToken[C.FIELDS.TYPE] === D.comment) {
              var l = {};
              s && ((l.before = s), (s = "")),
                (o = new tm.default({
                  value: this.content(),
                  source: mr(this.currToken),
                  sourceIndex: this.currToken[C.FIELDS.START_POS],
                  spaces: l,
                })),
                a.push(o);
            }
          while (++this.position < i);
          if (s) {
            if (o) o.spaces.after = s;
            else if (!this.options.lossy) {
              var c = this.tokens[n],
                f = this.tokens[this.position - 1];
              a.push(
                new sl.default({
                  value: "",
                  source: Xt(
                    c[C.FIELDS.START_LINE],
                    c[C.FIELDS.START_COL],
                    f[C.FIELDS.END_LINE],
                    f[C.FIELDS.END_COL]
                  ),
                  sourceIndex: c[C.FIELDS.START_POS],
                  spaces: { before: s, after: "" },
                })
              );
            }
          }
          return a;
        }),
        (e.convertWhitespaceNodesToSpace = function (i, n) {
          var a = this;
          n === void 0 && (n = !1);
          var s = "",
            o = "";
          i.forEach(function (c) {
            var f = a.lossySpace(c.spaces.before, n),
              p = a.lossySpace(c.rawSpaceBefore, n);
            (s += f + a.lossySpace(c.spaces.after, n && f.length === 0)),
              (o +=
                f +
                c.value +
                a.lossySpace(c.rawSpaceAfter, n && p.length === 0));
          }),
            o === s && (o = void 0);
          var l = { space: s, rawSpace: o };
          return l;
        }),
        (e.isNamedCombinator = function (i) {
          return (
            i === void 0 && (i = this.position),
            this.tokens[i + 0] &&
              this.tokens[i + 0][C.FIELDS.TYPE] === D.slash &&
              this.tokens[i + 1] &&
              this.tokens[i + 1][C.FIELDS.TYPE] === D.word &&
              this.tokens[i + 2] &&
              this.tokens[i + 2][C.FIELDS.TYPE] === D.slash
          );
        }),
        (e.namedCombinator = function () {
          if (this.isNamedCombinator()) {
            var i = this.content(this.tokens[this.position + 1]),
              n = (0, ae.unesc)(i).toLowerCase(),
              a = {};
            n !== i && (a.value = "/" + i + "/");
            var s = new al.default({
              value: "/" + n + "/",
              source: Xt(
                this.currToken[C.FIELDS.START_LINE],
                this.currToken[C.FIELDS.START_COL],
                this.tokens[this.position + 2][C.FIELDS.END_LINE],
                this.tokens[this.position + 2][C.FIELDS.END_COL]
              ),
              sourceIndex: this.currToken[C.FIELDS.START_POS],
              raws: a,
            });
            return (this.position = this.position + 3), s;
          } else this.unexpected();
        }),
        (e.combinator = function () {
          var i = this;
          if (this.content() === "|") return this.namespace();
          var n = this.locateNextMeaningfulToken(this.position);
          if (n < 0 || this.tokens[n][C.FIELDS.TYPE] === D.comma) {
            var a = this.parseWhitespaceEquivalentTokens(n);
            if (a.length > 0) {
              var s = this.current.last;
              if (s) {
                var o = this.convertWhitespaceNodesToSpace(a),
                  l = o.space,
                  c = o.rawSpace;
                c !== void 0 && (s.rawSpaceAfter += c), (s.spaces.after += l);
              } else
                a.forEach(function (E) {
                  return i.newNode(E);
                });
            }
            return;
          }
          var f = this.currToken,
            p = void 0;
          n > this.position && (p = this.parseWhitespaceEquivalentTokens(n));
          var h;
          if (
            (this.isNamedCombinator()
              ? (h = this.namedCombinator())
              : this.currToken[C.FIELDS.TYPE] === D.combinator
              ? ((h = new al.default({
                  value: this.content(),
                  source: mr(this.currToken),
                  sourceIndex: this.currToken[C.FIELDS.START_POS],
                })),
                this.position++)
              : ll[this.currToken[C.FIELDS.TYPE]] || p || this.unexpected(),
            h)
          ) {
            if (p) {
              var m = this.convertWhitespaceNodesToSpace(p),
                b = m.space,
                S = m.rawSpace;
              (h.spaces.before = b), (h.rawSpaceBefore = S);
            }
          } else {
            var v = this.convertWhitespaceNodesToSpace(p, !0),
              w = v.space,
              _ = v.rawSpace;
            _ || (_ = w);
            var T = {},
              O = { spaces: {} };
            w.endsWith(" ") && _.endsWith(" ")
              ? ((T.before = w.slice(0, w.length - 1)),
                (O.spaces.before = _.slice(0, _.length - 1)))
              : w.startsWith(" ") && _.startsWith(" ")
              ? ((T.after = w.slice(1)), (O.spaces.after = _.slice(1)))
              : (O.value = _),
              (h = new al.default({
                value: " ",
                source: ul(f, this.tokens[this.position - 1]),
                sourceIndex: f[C.FIELDS.START_POS],
                spaces: T,
                raws: O,
              }));
          }
          return (
            this.currToken &&
              this.currToken[C.FIELDS.TYPE] === D.space &&
              ((h.spaces.after = this.optionalSpace(this.content())),
              this.position++),
            this.newNode(h)
          );
        }),
        (e.comma = function () {
          if (this.position === this.tokens.length - 1) {
            (this.root.trailingComma = !0), this.position++;
            return;
          }
          this.current._inferEndPosition();
          var i = new nl.default({
            source: { start: sm(this.tokens[this.position + 1]) },
          });
          this.current.parent.append(i), (this.current = i), this.position++;
        }),
        (e.comment = function () {
          var i = this.currToken;
          this.newNode(
            new tm.default({
              value: this.content(),
              source: mr(i),
              sourceIndex: i[C.FIELDS.START_POS],
            })
          ),
            this.position++;
        }),
        (e.error = function (i, n) {
          throw this.root.error(i, n);
        }),
        (e.missingBackslash = function () {
          return this.error("Expected a backslash preceding the semicolon.", {
            index: this.currToken[C.FIELDS.START_POS],
          });
        }),
        (e.missingParenthesis = function () {
          return this.expected(
            "opening parenthesis",
            this.currToken[C.FIELDS.START_POS]
          );
        }),
        (e.missingSquareBracket = function () {
          return this.expected(
            "opening square bracket",
            this.currToken[C.FIELDS.START_POS]
          );
        }),
        (e.unexpected = function () {
          return this.error(
            "Unexpected '" +
              this.content() +
              "'. Escaping special characters with \\ may help.",
            this.currToken[C.FIELDS.START_POS]
          );
        }),
        (e.unexpectedPipe = function () {
          return this.error(
            "Unexpected '|'.",
            this.currToken[C.FIELDS.START_POS]
          );
        }),
        (e.namespace = function () {
          var i = (this.prevToken && this.content(this.prevToken)) || !0;
          if (this.nextToken[C.FIELDS.TYPE] === D.word)
            return this.position++, this.word(i);
          if (this.nextToken[C.FIELDS.TYPE] === D.asterisk)
            return this.position++, this.universal(i);
          this.unexpectedPipe();
        }),
        (e.nesting = function () {
          if (this.nextToken) {
            var i = this.content(this.nextToken);
            if (i === "|") {
              this.position++;
              return;
            }
          }
          var n = this.currToken;
          this.newNode(
            new pO.default({
              value: this.content(),
              source: mr(n),
              sourceIndex: n[C.FIELDS.START_POS],
            })
          ),
            this.position++;
        }),
        (e.parentheses = function () {
          var i = this.current.last,
            n = 1;
          if ((this.position++, i && i.type === hO.PSEUDO)) {
            var a = new nl.default({
                source: { start: sm(this.tokens[this.position - 1]) },
              }),
              s = this.current;
            for (
              i.append(a), this.current = a;
              this.position < this.tokens.length && n;

            )
              this.currToken[C.FIELDS.TYPE] === D.openParenthesis && n++,
                this.currToken[C.FIELDS.TYPE] === D.closeParenthesis && n--,
                n
                  ? this.parse()
                  : ((this.current.source.end = am(this.currToken)),
                    (this.current.parent.source.end = am(this.currToken)),
                    this.position++);
            this.current = s;
          } else {
            for (
              var o = this.currToken, l = "(", c;
              this.position < this.tokens.length && n;

            )
              this.currToken[C.FIELDS.TYPE] === D.openParenthesis && n++,
                this.currToken[C.FIELDS.TYPE] === D.closeParenthesis && n--,
                (c = this.currToken),
                (l += this.parseParenthesisToken(this.currToken)),
                this.position++;
            i
              ? i.appendToPropertyAndEscape("value", l, l)
              : this.newNode(
                  new sl.default({
                    value: l,
                    source: Xt(
                      o[C.FIELDS.START_LINE],
                      o[C.FIELDS.START_COL],
                      c[C.FIELDS.END_LINE],
                      c[C.FIELDS.END_COL]
                    ),
                    sourceIndex: o[C.FIELDS.START_POS],
                  })
                );
          }
          if (n)
            return this.expected(
              "closing parenthesis",
              this.currToken[C.FIELDS.START_POS]
            );
        }),
        (e.pseudo = function () {
          for (
            var i = this, n = "", a = this.currToken;
            this.currToken && this.currToken[C.FIELDS.TYPE] === D.colon;

          )
            (n += this.content()), this.position++;
          if (!this.currToken)
            return this.expected(
              ["pseudo-class", "pseudo-element"],
              this.position - 1
            );
          if (this.currToken[C.FIELDS.TYPE] === D.word)
            this.splitWord(!1, function (s, o) {
              (n += s),
                i.newNode(
                  new fO.default({
                    value: n,
                    source: ul(a, i.currToken),
                    sourceIndex: a[C.FIELDS.START_POS],
                  })
                ),
                o > 1 &&
                  i.nextToken &&
                  i.nextToken[C.FIELDS.TYPE] === D.openParenthesis &&
                  i.error("Misplaced parenthesis.", {
                    index: i.nextToken[C.FIELDS.START_POS],
                  });
            });
          else
            return this.expected(
              ["pseudo-class", "pseudo-element"],
              this.currToken[C.FIELDS.START_POS]
            );
        }),
        (e.space = function () {
          var i = this.content();
          this.position === 0 ||
          this.prevToken[C.FIELDS.TYPE] === D.comma ||
          this.prevToken[C.FIELDS.TYPE] === D.openParenthesis ||
          this.current.nodes.every(function (n) {
            return n.type === "comment";
          })
            ? ((this.spaces = this.optionalSpace(i)), this.position++)
            : this.position === this.tokens.length - 1 ||
              this.nextToken[C.FIELDS.TYPE] === D.comma ||
              this.nextToken[C.FIELDS.TYPE] === D.closeParenthesis
            ? ((this.current.last.spaces.after = this.optionalSpace(i)),
              this.position++)
            : this.combinator();
        }),
        (e.string = function () {
          var i = this.currToken;
          this.newNode(
            new sl.default({
              value: this.content(),
              source: mr(i),
              sourceIndex: i[C.FIELDS.START_POS],
            })
          ),
            this.position++;
        }),
        (e.universal = function (i) {
          var n = this.nextToken;
          if (n && this.content(n) === "|")
            return this.position++, this.namespace();
          var a = this.currToken;
          this.newNode(
            new cO.default({
              value: this.content(),
              source: mr(a),
              sourceIndex: a[C.FIELDS.START_POS],
            }),
            i
          ),
            this.position++;
        }),
        (e.splitWord = function (i, n) {
          for (
            var a = this, s = this.nextToken, o = this.content();
            s &&
            ~[D.dollar, D.caret, D.equals, D.word].indexOf(s[C.FIELDS.TYPE]);

          ) {
            this.position++;
            var l = this.content();
            if (((o += l), l.lastIndexOf("\\") === l.length - 1)) {
              var c = this.nextToken;
              c &&
                c[C.FIELDS.TYPE] === D.space &&
                ((o += this.requiredSpace(this.content(c))), this.position++);
            }
            s = this.nextToken;
          }
          var f = fl(o, ".").filter(function (b) {
              var S = o[b - 1] === "\\",
                v = /^\d+\.\d+%$/.test(o);
              return !S && !v;
            }),
            p = fl(o, "#").filter(function (b) {
              return o[b - 1] !== "\\";
            }),
            h = fl(o, "#{");
          h.length &&
            (p = p.filter(function (b) {
              return !~h.indexOf(b);
            }));
          var m = (0, dO.default)(yO([0].concat(f, p)));
          m.forEach(function (b, S) {
            var v = m[S + 1] || o.length,
              w = o.slice(b, v);
            if (S === 0 && n) return n.call(a, w, m.length);
            var _,
              T = a.currToken,
              O = T[C.FIELDS.START_POS] + m[S],
              E = Xt(T[1], T[2] + b, T[3], T[2] + (v - 1));
            if (~f.indexOf(b)) {
              var F = { value: w.slice(1), source: E, sourceIndex: O };
              _ = new oO.default(gr(F, "value"));
            } else if (~p.indexOf(b)) {
              var z = { value: w.slice(1), source: E, sourceIndex: O };
              _ = new lO.default(gr(z, "value"));
            } else {
              var N = { value: w, source: E, sourceIndex: O };
              gr(N, "value"), (_ = new uO.default(N));
            }
            a.newNode(_, i), (i = null);
          }),
            this.position++;
        }),
        (e.word = function (i) {
          var n = this.nextToken;
          return n && this.content(n) === "|"
            ? (this.position++, this.namespace())
            : this.splitWord(i);
        }),
        (e.loop = function () {
          for (; this.position < this.tokens.length; ) this.parse(!0);
          return this.current._inferEndPosition(), this.root;
        }),
        (e.parse = function (i) {
          switch (this.currToken[C.FIELDS.TYPE]) {
            case D.space:
              this.space();
              break;
            case D.comment:
              this.comment();
              break;
            case D.openParenthesis:
              this.parentheses();
              break;
            case D.closeParenthesis:
              i && this.missingParenthesis();
              break;
            case D.openSquare:
              this.attribute();
              break;
            case D.dollar:
            case D.caret:
            case D.equals:
            case D.word:
              this.word();
              break;
            case D.colon:
              this.pseudo();
              break;
            case D.comma:
              this.comma();
              break;
            case D.asterisk:
              this.universal();
              break;
            case D.ampersand:
              this.nesting();
              break;
            case D.slash:
            case D.combinator:
              this.combinator();
              break;
            case D.str:
              this.string();
              break;
            case D.closeSquare:
              this.missingSquareBracket();
            case D.semicolon:
              this.missingBackslash();
            default:
              this.unexpected();
          }
        }),
        (e.expected = function (i, n, a) {
          if (Array.isArray(i)) {
            var s = i.pop();
            i = i.join(", ") + " or " + s;
          }
          var o = /^[aeiou]/.test(i[0]) ? "an" : "a";
          return a
            ? this.error(
                "Expected " + o + " " + i + ', found "' + a + '" instead.',
                { index: n }
              )
            : this.error("Expected " + o + " " + i + ".", { index: n });
        }),
        (e.requiredSpace = function (i) {
          return this.options.lossy ? " " : i;
        }),
        (e.optionalSpace = function (i) {
          return this.options.lossy ? "" : i;
        }),
        (e.lossySpace = function (i, n) {
          return this.options.lossy ? (n ? " " : "") : i;
        }),
        (e.parseParenthesisToken = function (i) {
          var n = this.content(i);
          return i[C.FIELDS.TYPE] === D.space ? this.requiredSpace(n) : n;
        }),
        (e.newNode = function (i, n) {
          return (
            n &&
              (/^ +$/.test(n) &&
                (this.options.lossy || (this.spaces = (this.spaces || "") + n),
                (n = !0)),
              (i.namespace = n),
              gr(i, "namespace")),
            this.spaces &&
              ((i.spaces.before = this.spaces), (this.spaces = "")),
            this.current.append(i)
          );
        }),
        (e.content = function (i) {
          return (
            i === void 0 && (i = this.currToken),
            this.css.slice(i[C.FIELDS.START_POS], i[C.FIELDS.END_POS])
          );
        }),
        (e.locateNextMeaningfulToken = function (i) {
          i === void 0 && (i = this.position + 1);
          for (var n = i; n < this.tokens.length; )
            if (gO[this.tokens[n][C.FIELDS.TYPE]]) {
              n++;
              continue;
            } else return n;
          return -1;
        }),
        mO(t, [
          {
            key: "currToken",
            get: function () {
              return this.tokens[this.position];
            },
          },
          {
            key: "nextToken",
            get: function () {
              return this.tokens[this.position + 1];
            },
          },
          {
            key: "prevToken",
            get: function () {
              return this.tokens[this.position - 1];
            },
          },
        ]),
        t
      );
    })();
    Ri.default = wO;
    om.exports = Ri.default;
  });
  var fm = k((Bi, um) => {
    u();
    ("use strict");
    Bi.__esModule = !0;
    Bi.default = void 0;
    var vO = bO(lm());
    function bO(t) {
      return t && t.__esModule ? t : { default: t };
    }
    var xO = (function () {
      function t(r, i) {
        (this.func = r || function () {}),
          (this.funcRes = null),
          (this.options = i);
      }
      var e = t.prototype;
      return (
        (e._shouldUpdateSelector = function (i, n) {
          n === void 0 && (n = {});
          var a = Object.assign({}, this.options, n);
          return a.updateSelector === !1 ? !1 : typeof i != "string";
        }),
        (e._isLossy = function (i) {
          i === void 0 && (i = {});
          var n = Object.assign({}, this.options, i);
          return n.lossless === !1;
        }),
        (e._root = function (i, n) {
          n === void 0 && (n = {});
          var a = new vO.default(i, this._parseOptions(n));
          return a.root;
        }),
        (e._parseOptions = function (i) {
          return { lossy: this._isLossy(i) };
        }),
        (e._run = function (i, n) {
          var a = this;
          return (
            n === void 0 && (n = {}),
            new Promise(function (s, o) {
              try {
                var l = a._root(i, n);
                Promise.resolve(a.func(l))
                  .then(function (c) {
                    var f = void 0;
                    return (
                      a._shouldUpdateSelector(i, n) &&
                        ((f = l.toString()), (i.selector = f)),
                      { transform: c, root: l, string: f }
                    );
                  })
                  .then(s, o);
              } catch (c) {
                o(c);
                return;
              }
            })
          );
        }),
        (e._runSync = function (i, n) {
          n === void 0 && (n = {});
          var a = this._root(i, n),
            s = this.func(a);
          if (s && typeof s.then == "function")
            throw new Error(
              "Selector processor returned a promise to a synchronous call."
            );
          var o = void 0;
          return (
            n.updateSelector &&
              typeof i != "string" &&
              ((o = a.toString()), (i.selector = o)),
            { transform: s, root: a, string: o }
          );
        }),
        (e.ast = function (i, n) {
          return this._run(i, n).then(function (a) {
            return a.root;
          });
        }),
        (e.astSync = function (i, n) {
          return this._runSync(i, n).root;
        }),
        (e.transform = function (i, n) {
          return this._run(i, n).then(function (a) {
            return a.transform;
          });
        }),
        (e.transformSync = function (i, n) {
          return this._runSync(i, n).transform;
        }),
        (e.process = function (i, n) {
          return this._run(i, n).then(function (a) {
            return a.string || a.root.toString();
          });
        }),
        (e.processSync = function (i, n) {
          var a = this._runSync(i, n);
          return a.string || a.root.toString();
        }),
        t
      );
    })();
    Bi.default = xO;
    um.exports = Bi.default;
  });
  var cm = k((te) => {
    u();
    ("use strict");
    te.__esModule = !0;
    te.universal =
      te.tag =
      te.string =
      te.selector =
      te.root =
      te.pseudo =
      te.nesting =
      te.id =
      te.comment =
      te.combinator =
      te.className =
      te.attribute =
        void 0;
    var kO = Ne(Qo()),
      SO = Ne(Io()),
      _O = Ne(Zo()),
      TO = Ne(Do()),
      OO = Ne(Bo()),
      EO = Ne(tl()),
      AO = Ne(jo()),
      CO = Ne(Oo()),
      PO = Ne(Ao()),
      IO = Ne(zo()),
      qO = Ne(Fo()),
      DO = Ne(Ko());
    function Ne(t) {
      return t && t.__esModule ? t : { default: t };
    }
    var RO = function (e) {
      return new kO.default(e);
    };
    te.attribute = RO;
    var BO = function (e) {
      return new SO.default(e);
    };
    te.className = BO;
    var MO = function (e) {
      return new _O.default(e);
    };
    te.combinator = MO;
    var LO = function (e) {
      return new TO.default(e);
    };
    te.comment = LO;
    var FO = function (e) {
      return new OO.default(e);
    };
    te.id = FO;
    var NO = function (e) {
      return new EO.default(e);
    };
    te.nesting = NO;
    var zO = function (e) {
      return new AO.default(e);
    };
    te.pseudo = zO;
    var $O = function (e) {
      return new CO.default(e);
    };
    te.root = $O;
    var jO = function (e) {
      return new PO.default(e);
    };
    te.selector = jO;
    var UO = function (e) {
      return new IO.default(e);
    };
    te.string = UO;
    var VO = function (e) {
      return new qO.default(e);
    };
    te.tag = VO;
    var WO = function (e) {
      return new DO.default(e);
    };
    te.universal = WO;
  });
  var mm = k((H) => {
    u();
    ("use strict");
    H.__esModule = !0;
    H.isComment = H.isCombinator = H.isClassName = H.isAttribute = void 0;
    H.isContainer = iE;
    H.isIdentifier = void 0;
    H.isNamespace = nE;
    H.isNesting = void 0;
    H.isNode = cl;
    H.isPseudo = void 0;
    H.isPseudoClass = rE;
    H.isPseudoElement = hm;
    H.isUniversal = H.isTag = H.isString = H.isSelector = H.isRoot = void 0;
    var oe = xe(),
      Ae,
      GO =
        ((Ae = {}),
        (Ae[oe.ATTRIBUTE] = !0),
        (Ae[oe.CLASS] = !0),
        (Ae[oe.COMBINATOR] = !0),
        (Ae[oe.COMMENT] = !0),
        (Ae[oe.ID] = !0),
        (Ae[oe.NESTING] = !0),
        (Ae[oe.PSEUDO] = !0),
        (Ae[oe.ROOT] = !0),
        (Ae[oe.SELECTOR] = !0),
        (Ae[oe.STRING] = !0),
        (Ae[oe.TAG] = !0),
        (Ae[oe.UNIVERSAL] = !0),
        Ae);
    function cl(t) {
      return typeof t == "object" && GO[t.type];
    }
    function ze(t, e) {
      return cl(e) && e.type === t;
    }
    var pm = ze.bind(null, oe.ATTRIBUTE);
    H.isAttribute = pm;
    var HO = ze.bind(null, oe.CLASS);
    H.isClassName = HO;
    var YO = ze.bind(null, oe.COMBINATOR);
    H.isCombinator = YO;
    var QO = ze.bind(null, oe.COMMENT);
    H.isComment = QO;
    var JO = ze.bind(null, oe.ID);
    H.isIdentifier = JO;
    var KO = ze.bind(null, oe.NESTING);
    H.isNesting = KO;
    var pl = ze.bind(null, oe.PSEUDO);
    H.isPseudo = pl;
    var XO = ze.bind(null, oe.ROOT);
    H.isRoot = XO;
    var ZO = ze.bind(null, oe.SELECTOR);
    H.isSelector = ZO;
    var eE = ze.bind(null, oe.STRING);
    H.isString = eE;
    var dm = ze.bind(null, oe.TAG);
    H.isTag = dm;
    var tE = ze.bind(null, oe.UNIVERSAL);
    H.isUniversal = tE;
    function hm(t) {
      return (
        pl(t) &&
        t.value &&
        (t.value.startsWith("::") ||
          t.value.toLowerCase() === ":before" ||
          t.value.toLowerCase() === ":after" ||
          t.value.toLowerCase() === ":first-letter" ||
          t.value.toLowerCase() === ":first-line")
      );
    }
    function rE(t) {
      return pl(t) && !hm(t);
    }
    function iE(t) {
      return !!(cl(t) && t.walk);
    }
    function nE(t) {
      return pm(t) || dm(t);
    }
  });
  var gm = k((Je) => {
    u();
    ("use strict");
    Je.__esModule = !0;
    var dl = xe();
    Object.keys(dl).forEach(function (t) {
      t === "default" ||
        t === "__esModule" ||
        (t in Je && Je[t] === dl[t]) ||
        (Je[t] = dl[t]);
    });
    var hl = cm();
    Object.keys(hl).forEach(function (t) {
      t === "default" ||
        t === "__esModule" ||
        (t in Je && Je[t] === hl[t]) ||
        (Je[t] = hl[t]);
    });
    var ml = mm();
    Object.keys(ml).forEach(function (t) {
      t === "default" ||
        t === "__esModule" ||
        (t in Je && Je[t] === ml[t]) ||
        (Je[t] = ml[t]);
    });
  });
  var it = k((Mi, wm) => {
    u();
    ("use strict");
    Mi.__esModule = !0;
    Mi.default = void 0;
    var sE = lE(fm()),
      aE = oE(gm());
    function ym(t) {
      if (typeof WeakMap != "function") return null;
      var e = new WeakMap(),
        r = new WeakMap();
      return (ym = function (n) {
        return n ? r : e;
      })(t);
    }
    function oE(t, e) {
      if (!e && t && t.__esModule) return t;
      if (t === null || (typeof t != "object" && typeof t != "function"))
        return { default: t };
      var r = ym(e);
      if (r && r.has(t)) return r.get(t);
      var i = {},
        n = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var a in t)
        if (a !== "default" && Object.prototype.hasOwnProperty.call(t, a)) {
          var s = n ? Object.getOwnPropertyDescriptor(t, a) : null;
          s && (s.get || s.set)
            ? Object.defineProperty(i, a, s)
            : (i[a] = t[a]);
        }
      return (i.default = t), r && r.set(t, i), i;
    }
    function lE(t) {
      return t && t.__esModule ? t : { default: t };
    }
    var gl = function (e) {
      return new sE.default(e);
    };
    Object.assign(gl, aE);
    delete gl.__esModule;
    var uE = gl;
    Mi.default = uE;
    wm.exports = Mi.default;
  });
  function mt(t) {
    return ["fontSize", "outline"].includes(t)
      ? (e) => (
          typeof e == "function" && (e = e({})),
          Array.isArray(e) && (e = e[0]),
          e
        )
      : t === "fontFamily"
      ? (e) => {
          typeof e == "function" && (e = e({}));
          let r = Array.isArray(e) && be(e[1]) ? e[0] : e;
          return Array.isArray(r) ? r.join(", ") : r;
        }
      : [
          "boxShadow",
          "transitionProperty",
          "transitionDuration",
          "transitionDelay",
          "transitionTimingFunction",
          "backgroundImage",
          "backgroundSize",
          "backgroundColor",
          "cursor",
          "animation",
        ].includes(t)
      ? (e) => (
          typeof e == "function" && (e = e({})),
          Array.isArray(e) && (e = e.join(", ")),
          e
        )
      : ["gridTemplateColumns", "gridTemplateRows", "objectPosition"].includes(
          t
        )
      ? (e) => (
          typeof e == "function" && (e = e({})),
          typeof e == "string" && (e = J.list.comma(e).join(" ")),
          e
        )
      : (e, r = {}) => (typeof e == "function" && (e = e(r)), e);
  }
  var Li = A(() => {
    u();
    qt();
    ar();
  });
  var Tm = k((i8, xl) => {
    u();
    var { Rule: vm, AtRule: fE } = Re(),
      bm = it();
    function yl(t, e) {
      let r;
      try {
        bm((i) => {
          r = i;
        }).processSync(t);
      } catch (i) {
        throw t.includes(":")
          ? e
            ? e.error("Missed semicolon")
            : i
          : e
          ? e.error(i.message)
          : i;
      }
      return r.at(0);
    }
    function xm(t, e) {
      let r = !1;
      return (
        t.each((i) => {
          if (i.type === "nesting") {
            let n = e.clone({});
            i.value !== "&"
              ? i.replaceWith(yl(i.value.replace("&", n.toString())))
              : i.replaceWith(n),
              (r = !0);
          } else "nodes" in i && i.nodes && xm(i, e) && (r = !0);
        }),
        r
      );
    }
    function km(t, e) {
      let r = [];
      return (
        t.selectors.forEach((i) => {
          let n = yl(i, t);
          e.selectors.forEach((a) => {
            if (!a) return;
            let s = yl(a, e);
            xm(s, n) ||
              (s.prepend(bm.combinator({ value: " " })),
              s.prepend(n.clone({}))),
              r.push(s.toString());
          });
        }),
        r
      );
    }
    function Ts(t, e) {
      let r = t.prev();
      for (e.after(t); r && r.type === "comment"; ) {
        let i = r.prev();
        e.after(r), (r = i);
      }
      return t;
    }
    function cE(t) {
      return function e(r, i, n, a = n) {
        let s = [];
        if (
          (i.each((o) => {
            o.type === "rule" && n
              ? a && (o.selectors = km(r, o))
              : o.type === "atrule" && o.nodes
              ? t[o.name]
                ? e(r, o, a)
                : i[vl] !== !1 && s.push(o)
              : s.push(o);
          }),
          n && s.length)
        ) {
          let o = r.clone({ nodes: [] });
          for (let l of s) o.append(l);
          i.prepend(o);
        }
      };
    }
    function wl(t, e, r) {
      let i = new vm({ selector: t, nodes: [] });
      return i.append(e), r.after(i), i;
    }
    function Sm(t, e) {
      let r = {};
      for (let i of t) r[i] = !0;
      if (e) for (let i of e) r[i.replace(/^@/, "")] = !0;
      return r;
    }
    function pE(t) {
      t = t.trim();
      let e = t.match(/^\((.*)\)$/);
      if (!e) return { type: "basic", selector: t };
      let r = e[1].match(/^(with(?:out)?):(.+)$/);
      if (r) {
        let i = r[1] === "with",
          n = Object.fromEntries(
            r[2]
              .trim()
              .split(/\s+/)
              .map((s) => [s, !0])
          );
        if (i && n.all) return { type: "noop" };
        let a = (s) => !!n[s];
        return (
          n.all ? (a = () => !0) : i && (a = (s) => (s === "all" ? !1 : !n[s])),
          { type: "withrules", escapes: a }
        );
      }
      return { type: "unknown" };
    }
    function dE(t) {
      let e = [],
        r = t.parent;
      for (; r && r instanceof fE; ) e.push(r), (r = r.parent);
      return e;
    }
    function hE(t) {
      let e = t[_m];
      if (!e) t.after(t.nodes);
      else {
        let r = t.nodes,
          i,
          n = -1,
          a,
          s,
          o,
          l = dE(t);
        if (
          (l.forEach((c, f) => {
            if (e(c.name)) (i = c), (n = f), (s = o);
            else {
              let p = o;
              (o = c.clone({ nodes: [] })), p && o.append(p), (a = a || o);
            }
          }),
          i ? (s ? (a.append(r), i.after(s)) : i.after(r)) : t.after(r),
          t.next() && i)
        ) {
          let c;
          l.slice(0, n + 1).forEach((f, p, h) => {
            let m = c;
            (c = f.clone({ nodes: [] })), m && c.append(m);
            let b = [],
              v = (h[p - 1] || t).next();
            for (; v; ) b.push(v), (v = v.next());
            c.append(b);
          }),
            c && (s || r[r.length - 1]).after(c);
        }
      }
      t.remove();
    }
    var vl = Symbol("rootRuleMergeSel"),
      _m = Symbol("rootRuleEscapes");
    function mE(t) {
      let { params: e } = t,
        { type: r, selector: i, escapes: n } = pE(e);
      if (r === "unknown")
        throw t.error(`Unknown @${t.name} parameter ${JSON.stringify(e)}`);
      if (r === "basic" && i) {
        let a = new vm({ selector: i, nodes: t.nodes });
        t.removeAll(), t.append(a);
      }
      (t[_m] = n), (t[vl] = n ? !n("all") : r === "noop");
    }
    var bl = Symbol("hasRootRule");
    xl.exports = (t = {}) => {
      let e = Sm(["media", "supports", "layer", "container"], t.bubble),
        r = cE(e),
        i = Sm(
          [
            "document",
            "font-face",
            "keyframes",
            "-webkit-keyframes",
            "-moz-keyframes",
          ],
          t.unwrap
        ),
        n = (t.rootRuleName || "at-root").replace(/^@/, ""),
        a = t.preserveEmpty;
      return {
        postcssPlugin: "postcss-nested",
        Once(s) {
          s.walkAtRules(n, (o) => {
            mE(o), (s[bl] = !0);
          });
        },
        Rule(s) {
          let o = !1,
            l = s,
            c = !1,
            f = [];
          s.each((p) => {
            p.type === "rule"
              ? (f.length && ((l = wl(s.selector, f, l)), (f = [])),
                (c = !0),
                (o = !0),
                (p.selectors = km(s, p)),
                (l = Ts(p, l)))
              : p.type === "atrule"
              ? (f.length && ((l = wl(s.selector, f, l)), (f = [])),
                p.name === n
                  ? ((o = !0), r(s, p, !0, p[vl]), (l = Ts(p, l)))
                  : e[p.name]
                  ? ((c = !0), (o = !0), r(s, p, !0), (l = Ts(p, l)))
                  : i[p.name]
                  ? ((c = !0), (o = !0), r(s, p, !1), (l = Ts(p, l)))
                  : c && f.push(p))
              : p.type === "decl" && c && f.push(p);
          }),
            f.length && (l = wl(s.selector, f, l)),
            o &&
              a !== !0 &&
              ((s.raws.semicolon = !0), s.nodes.length === 0 && s.remove());
        },
        RootExit(s) {
          s[bl] && (s.walkAtRules(n, hE), (s[bl] = !1));
        },
      };
    };
    xl.exports.postcss = !0;
  });
  var Cm = k((n8, Am) => {
    u();
    ("use strict");
    var Om = /-(\w|$)/g,
      Em = (t, e) => e.toUpperCase(),
      gE = (t) => (
        (t = t.toLowerCase()),
        t === "float"
          ? "cssFloat"
          : t.startsWith("-ms-")
          ? t.substr(1).replace(Om, Em)
          : t.replace(Om, Em)
      );
    Am.exports = gE;
  });
  var _l = k((s8, Pm) => {
    u();
    var yE = Cm(),
      wE = {
        boxFlex: !0,
        boxFlexGroup: !0,
        columnCount: !0,
        flex: !0,
        flexGrow: !0,
        flexPositive: !0,
        flexShrink: !0,
        flexNegative: !0,
        fontWeight: !0,
        lineClamp: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        tabSize: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
        fillOpacity: !0,
        strokeDashoffset: !0,
        strokeOpacity: !0,
        strokeWidth: !0,
      };
    function kl(t) {
      return typeof t.nodes == "undefined" ? !0 : Sl(t);
    }
    function Sl(t) {
      let e,
        r = {};
      return (
        t.each((i) => {
          if (i.type === "atrule")
            (e = "@" + i.name),
              i.params && (e += " " + i.params),
              typeof r[e] == "undefined"
                ? (r[e] = kl(i))
                : Array.isArray(r[e])
                ? r[e].push(kl(i))
                : (r[e] = [r[e], kl(i)]);
          else if (i.type === "rule") {
            let n = Sl(i);
            if (r[i.selector]) for (let a in n) r[i.selector][a] = n[a];
            else r[i.selector] = n;
          } else if (i.type === "decl") {
            (i.prop[0] === "-" && i.prop[1] === "-") ||
            (i.parent && i.parent.selector === ":export")
              ? (e = i.prop)
              : (e = yE(i.prop));
            let n = i.value;
            !isNaN(i.value) && wE[e] && (n = parseFloat(i.value)),
              i.important && (n += " !important"),
              typeof r[e] == "undefined"
                ? (r[e] = n)
                : Array.isArray(r[e])
                ? r[e].push(n)
                : (r[e] = [r[e], n]);
          }
        }),
        r
      );
    }
    Pm.exports = Sl;
  });
  var Os = k((a8, Rm) => {
    u();
    var Fi = Re(),
      Im = /\s*!important\s*$/i,
      vE = {
        "box-flex": !0,
        "box-flex-group": !0,
        "column-count": !0,
        flex: !0,
        "flex-grow": !0,
        "flex-positive": !0,
        "flex-shrink": !0,
        "flex-negative": !0,
        "font-weight": !0,
        "line-clamp": !0,
        "line-height": !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        "tab-size": !0,
        widows: !0,
        "z-index": !0,
        zoom: !0,
        "fill-opacity": !0,
        "stroke-dashoffset": !0,
        "stroke-opacity": !0,
        "stroke-width": !0,
      };
    function bE(t) {
      return t
        .replace(/([A-Z])/g, "-$1")
        .replace(/^ms-/, "-ms-")
        .toLowerCase();
    }
    function qm(t, e, r) {
      r === !1 ||
        r === null ||
        (e.startsWith("--") || (e = bE(e)),
        typeof r == "number" &&
          (r === 0 || vE[e] ? (r = r.toString()) : (r += "px")),
        e === "css-float" && (e = "float"),
        Im.test(r)
          ? ((r = r.replace(Im, "")),
            t.push(Fi.decl({ prop: e, value: r, important: !0 })))
          : t.push(Fi.decl({ prop: e, value: r })));
    }
    function Dm(t, e, r) {
      let i = Fi.atRule({ name: e[1], params: e[3] || "" });
      typeof r == "object" && ((i.nodes = []), Tl(r, i)), t.push(i);
    }
    function Tl(t, e) {
      let r, i, n;
      for (r in t)
        if (((i = t[r]), !(i === null || typeof i == "undefined")))
          if (r[0] === "@") {
            let a = r.match(/@(\S+)(\s+([\W\w]*)\s*)?/);
            if (Array.isArray(i)) for (let s of i) Dm(e, a, s);
            else Dm(e, a, i);
          } else if (Array.isArray(i)) for (let a of i) qm(e, r, a);
          else
            typeof i == "object"
              ? ((n = Fi.rule({ selector: r })), Tl(i, n), e.push(n))
              : qm(e, r, i);
    }
    Rm.exports = function (t) {
      let e = Fi.root();
      return Tl(t, e), e;
    };
  });
  var Ol = k((o8, Bm) => {
    u();
    var xE = _l();
    Bm.exports = function (e) {
      return (
        console &&
          console.warn &&
          e.warnings().forEach((r) => {
            let i = r.plugin || "PostCSS";
            console.warn(i + ": " + r.text);
          }),
        xE(e.root)
      );
    };
  });
  var Lm = k((l8, Mm) => {
    u();
    var kE = Re(),
      SE = Ol(),
      _E = Os();
    Mm.exports = function (e) {
      let r = kE(e);
      return async (i) => {
        let n = await r.process(i, { parser: _E, from: void 0 });
        return SE(n);
      };
    };
  });
  var Nm = k((u8, Fm) => {
    u();
    var TE = Re(),
      OE = Ol(),
      EE = Os();
    Fm.exports = function (t) {
      let e = TE(t);
      return (r) => {
        let i = e.process(r, { parser: EE, from: void 0 });
        return OE(i);
      };
    };
  });
  var $m = k((f8, zm) => {
    u();
    var AE = _l(),
      CE = Os(),
      PE = Lm(),
      IE = Nm();
    zm.exports = { objectify: AE, parse: CE, async: PE, sync: IE };
  });
  var yr,
    jm,
    c8,
    p8,
    d8,
    h8,
    Um = A(() => {
      u();
      (yr = ce($m())),
        (jm = yr.default),
        (c8 = yr.default.objectify),
        (p8 = yr.default.parse),
        (d8 = yr.default.async),
        (h8 = yr.default.sync);
    });
  function wr(t) {
    return Array.isArray(t)
      ? t.flatMap(
          (e) =>
            J([(0, Vm.default)({ bubble: ["screen"] })]).process(e, {
              parser: jm,
            }).root.nodes
        )
      : wr([t]);
  }
  var Vm,
    El = A(() => {
      u();
      qt();
      Vm = ce(Tm());
      Um();
    });
  function vr(t, e, r = !1) {
    if (t === "") return e;
    let i = typeof e == "string" ? (0, Wm.default)().astSync(e) : e;
    return (
      i.walkClasses((n) => {
        let a = n.value,
          s = r && a.startsWith("-");
        n.value = s ? `-${t}${a.slice(1)}` : `${t}${a}`;
      }),
      typeof e == "string" ? i.toString() : i
    );
  }
  var Wm,
    Es = A(() => {
      u();
      Wm = ce(it());
    });
  function Ce(t) {
    let e = Gm.default.className();
    return (e.value = t), Gt(e?.raws?.value ?? e.value);
  }
  var Gm,
    br = A(() => {
      u();
      Gm = ce(it());
      Bn();
    });
  function Al(t) {
    return Gt(`.${Ce(t)}`);
  }
  function As(t, e) {
    return Al(Ni(t, e));
  }
  function Ni(t, e) {
    return e === "DEFAULT"
      ? t
      : e === "-" || e === "-DEFAULT"
      ? `-${t}`
      : e.startsWith("-")
      ? `-${t}${e}`
      : e.startsWith("/")
      ? `${t}${e}`
      : `${t}-${e}`;
  }
  var Cl = A(() => {
    u();
    br();
    Bn();
  });
  function B(t, e = [[t, [t]]], { filterDefault: r = !1, ...i } = {}) {
    let n = mt(t);
    return function ({ matchUtilities: a, theme: s }) {
      for (let o of e) {
        let l = Array.isArray(o[0]) ? o : [o];
        a(
          l.reduce(
            (c, [f, p]) =>
              Object.assign(c, {
                [f]: (h) =>
                  p.reduce(
                    (m, b) =>
                      Array.isArray(b)
                        ? Object.assign(m, { [b[0]]: b[1] })
                        : Object.assign(m, { [b]: n(h) }),
                    {}
                  ),
              }),
            {}
          ),
          {
            ...i,
            values: r
              ? Object.fromEntries(
                  Object.entries(s(t) ?? {}).filter(([c]) => c !== "DEFAULT")
                )
              : s(t),
          }
        );
      }
    };
  }
  var Hm = A(() => {
    u();
    Li();
  });
  function Dt(t) {
    return (
      (t = Array.isArray(t) ? t : [t]),
      t
        .map((e) => {
          let r = e.values.map((i) =>
            i.raw !== void 0
              ? i.raw
              : [
                  i.min && `(min-width: ${i.min})`,
                  i.max && `(max-width: ${i.max})`,
                ]
                  .filter(Boolean)
                  .join(" and ")
          );
          return e.not ? `not all and ${r}` : r;
        })
        .join(", ")
    );
  }
  var Cs = A(() => {
    u();
  });
  function Pl(t) {
    return t.split(FE).map((r) => {
      let i = r.trim(),
        n = { value: i },
        a = i.split(NE),
        s = new Set();
      for (let o of a)
        !s.has("DIRECTIONS") && qE.has(o)
          ? ((n.direction = o), s.add("DIRECTIONS"))
          : !s.has("PLAY_STATES") && DE.has(o)
          ? ((n.playState = o), s.add("PLAY_STATES"))
          : !s.has("FILL_MODES") && RE.has(o)
          ? ((n.fillMode = o), s.add("FILL_MODES"))
          : !s.has("ITERATION_COUNTS") && (BE.has(o) || zE.test(o))
          ? ((n.iterationCount = o), s.add("ITERATION_COUNTS"))
          : (!s.has("TIMING_FUNCTION") && ME.has(o)) ||
            (!s.has("TIMING_FUNCTION") && LE.some((l) => o.startsWith(`${l}(`)))
          ? ((n.timingFunction = o), s.add("TIMING_FUNCTION"))
          : !s.has("DURATION") && Ym.test(o)
          ? ((n.duration = o), s.add("DURATION"))
          : !s.has("DELAY") && Ym.test(o)
          ? ((n.delay = o), s.add("DELAY"))
          : s.has("NAME")
          ? (n.unknown || (n.unknown = []), n.unknown.push(o))
          : ((n.name = o), s.add("NAME"));
      return n;
    });
  }
  var qE,
    DE,
    RE,
    BE,
    ME,
    LE,
    FE,
    NE,
    Ym,
    zE,
    Qm = A(() => {
      u();
      (qE = new Set(["normal", "reverse", "alternate", "alternate-reverse"])),
        (DE = new Set(["running", "paused"])),
        (RE = new Set(["none", "forwards", "backwards", "both"])),
        (BE = new Set(["infinite"])),
        (ME = new Set([
          "linear",
          "ease",
          "ease-in",
          "ease-out",
          "ease-in-out",
          "step-start",
          "step-end",
        ])),
        (LE = ["cubic-bezier", "steps"]),
        (FE = /\,(?![^(]*\))/g),
        (NE = /\ +(?![^(]*\))/g),
        (Ym = /^(-?[\d.]+m?s)$/),
        (zE = /^(\d+)$/);
    });
  var Jm,
    we,
    Km = A(() => {
      u();
      (Jm = (t) =>
        Object.assign(
          {},
          ...Object.entries(t ?? {}).flatMap(([e, r]) =>
            typeof r == "object"
              ? Object.entries(Jm(r)).map(([i, n]) => ({
                  [e + (i === "DEFAULT" ? "" : `-${i}`)]: n,
                }))
              : [{ [`${e}`]: r }]
          )
        )),
        (we = Jm);
    });
  var Zm,
    Xm = A(() => {
      Zm = "3.4.5";
    });
  function Rt(t, e = !0) {
    return Array.isArray(t)
      ? t.map((r) => {
          if (e && Array.isArray(r))
            throw new Error("The tuple syntax is not supported for `screens`.");
          if (typeof r == "string")
            return {
              name: r.toString(),
              not: !1,
              values: [{ min: r, max: void 0 }],
            };
          let [i, n] = r;
          return (
            (i = i.toString()),
            typeof n == "string"
              ? { name: i, not: !1, values: [{ min: n, max: void 0 }] }
              : Array.isArray(n)
              ? { name: i, not: !1, values: n.map((a) => tg(a)) }
              : { name: i, not: !1, values: [tg(n)] }
          );
        })
      : Rt(Object.entries(t ?? {}), !1);
  }
  function Ps(t) {
    return t.values.length !== 1
      ? { result: !1, reason: "multiple-values" }
      : t.values[0].raw !== void 0
      ? { result: !1, reason: "raw-values" }
      : t.values[0].min !== void 0 && t.values[0].max !== void 0
      ? { result: !1, reason: "min-and-max" }
      : { result: !0, reason: null };
  }
  function eg(t, e, r) {
    let i = Is(e, t),
      n = Is(r, t),
      a = Ps(i),
      s = Ps(n);
    if (a.reason === "multiple-values" || s.reason === "multiple-values")
      throw new Error(
        "Attempted to sort a screen with multiple values. This should never happen. Please open a bug report."
      );
    if (a.reason === "raw-values" || s.reason === "raw-values")
      throw new Error(
        "Attempted to sort a screen with raw values. This should never happen. Please open a bug report."
      );
    if (a.reason === "min-and-max" || s.reason === "min-and-max")
      throw new Error(
        "Attempted to sort a screen with both min and max values. This should never happen. Please open a bug report."
      );
    let { min: o, max: l } = i.values[0],
      { min: c, max: f } = n.values[0];
    e.not && ([o, l] = [l, o]),
      r.not && ([c, f] = [f, c]),
      (o = o === void 0 ? o : parseFloat(o)),
      (l = l === void 0 ? l : parseFloat(l)),
      (c = c === void 0 ? c : parseFloat(c)),
      (f = f === void 0 ? f : parseFloat(f));
    let [p, h] = t === "min" ? [o, c] : [f, l];
    return p - h;
  }
  function Is(t, e) {
    return typeof t == "object"
      ? t
      : { name: "arbitrary-screen", values: [{ [e]: t }] };
  }
  function tg({ "min-width": t, min: e = t, max: r, raw: i } = {}) {
    return { min: e, max: r, raw: i };
  }
  var qs = A(() => {
    u();
  });
  function Ds(t, e) {
    t.walkDecls((r) => {
      if (e.includes(r.prop)) {
        r.remove();
        return;
      }
      for (let i of e)
        r.value.includes(`/ var(${i})`) &&
          (r.value = r.value.replace(`/ var(${i})`, ""));
    });
  }
  var rg = A(() => {
    u();
  });
  var re,
    Ke,
    nt,
    de,
    ig,
    ng = A(() => {
      u();
      ft();
      Yt();
      qt();
      Hm();
      Cs();
      br();
      Qm();
      Km();
      Kr();
      Ya();
      ar();
      Li();
      Xm();
      Qe();
      qs();
      $a();
      rg();
      ct();
      ei();
      zi();
      (re = {
        childVariant: ({ addVariant: t }) => {
          t("*", "& > *");
        },
        pseudoElementVariants: ({ addVariant: t }) => {
          t("first-letter", "&::first-letter"),
            t("first-line", "&::first-line"),
            t("marker", [
              ({ container: e }) => (
                Ds(e, ["--tw-text-opacity"]), "& *::marker"
              ),
              ({ container: e }) => (Ds(e, ["--tw-text-opacity"]), "&::marker"),
            ]),
            t("selection", ["& *::selection", "&::selection"]),
            t("file", "&::file-selector-button"),
            t("placeholder", "&::placeholder"),
            t("backdrop", "&::backdrop"),
            t(
              "before",
              ({ container: e }) => (
                e.walkRules((r) => {
                  let i = !1;
                  r.walkDecls("content", () => {
                    i = !0;
                  }),
                    i ||
                      r.prepend(
                        J.decl({ prop: "content", value: "var(--tw-content)" })
                      );
                }),
                "&::before"
              )
            ),
            t(
              "after",
              ({ container: e }) => (
                e.walkRules((r) => {
                  let i = !1;
                  r.walkDecls("content", () => {
                    i = !0;
                  }),
                    i ||
                      r.prepend(
                        J.decl({ prop: "content", value: "var(--tw-content)" })
                      );
                }),
                "&::after"
              )
            );
        },
        pseudoClassVariants: ({
          addVariant: t,
          matchVariant: e,
          config: r,
          prefix: i,
        }) => {
          let n = [
            ["first", "&:first-child"],
            ["last", "&:last-child"],
            ["only", "&:only-child"],
            ["odd", "&:nth-child(odd)"],
            ["even", "&:nth-child(even)"],
            "first-of-type",
            "last-of-type",
            "only-of-type",
            [
              "visited",
              ({ container: s }) => (
                Ds(s, [
                  "--tw-text-opacity",
                  "--tw-border-opacity",
                  "--tw-bg-opacity",
                ]),
                "&:visited"
              ),
            ],
            "target",
            ["open", "&[open]"],
            "default",
            "checked",
            "indeterminate",
            "placeholder-shown",
            "autofill",
            "optional",
            "required",
            "valid",
            "invalid",
            "in-range",
            "out-of-range",
            "read-only",
            "empty",
            "focus-within",
            [
              "hover",
              he(r(), "hoverOnlyWhenSupported")
                ? "@media (hover: hover) and (pointer: fine) { &:hover }"
                : "&:hover",
            ],
            "focus",
            "focus-visible",
            "active",
            "enabled",
            "disabled",
          ].map((s) => (Array.isArray(s) ? s : [s, `&:${s}`]));
          for (let [s, o] of n)
            t(s, (l) => (typeof o == "function" ? o(l) : o));
          let a = {
            group: (s, { modifier: o }) =>
              o
                ? [`:merge(${i(".group")}\\/${Ce(o)})`, " &"]
                : [`:merge(${i(".group")})`, " &"],
            peer: (s, { modifier: o }) =>
              o
                ? [`:merge(${i(".peer")}\\/${Ce(o)})`, " ~ &"]
                : [`:merge(${i(".peer")})`, " ~ &"],
          };
          for (let [s, o] of Object.entries(a))
            e(
              s,
              (l = "", c) => {
                let f = W(typeof l == "function" ? l(c) : l);
                f.includes("&") || (f = "&" + f);
                let [p, h] = o("", c),
                  m = null,
                  b = null,
                  S = 0;
                for (let v = 0; v < f.length; ++v) {
                  let w = f[v];
                  w === "&"
                    ? (m = v)
                    : w === "'" || w === '"'
                    ? (S += 1)
                    : m !== null && w === " " && !S && (b = v);
                }
                return (
                  m !== null && b === null && (b = f.length),
                  f.slice(0, m) + p + f.slice(m + 1, b) + h + f.slice(b)
                );
              },
              { values: Object.fromEntries(n), [Bt]: { respectPrefix: !1 } }
            );
        },
        directionVariants: ({ addVariant: t }) => {
          t("ltr", '&:where([dir="ltr"], [dir="ltr"] *)'),
            t("rtl", '&:where([dir="rtl"], [dir="rtl"] *)');
        },
        reducedMotionVariants: ({ addVariant: t }) => {
          t("motion-safe", "@media (prefers-reduced-motion: no-preference)"),
            t("motion-reduce", "@media (prefers-reduced-motion: reduce)");
        },
        darkVariants: ({ config: t, addVariant: e }) => {
          let [r, i = ".dark"] = [].concat(t("darkMode", "media"));
          if (
            (r === !1 &&
              ((r = "media"),
              V.warn("darkmode-false", [
                "The `darkMode` option in your Tailwind CSS configuration is set to `false`, which now behaves the same as `media`.",
                "Change `darkMode` to `media` or remove it entirely.",
                "https://tailwindcss.com/docs/upgrade-guide#remove-dark-mode-configuration",
              ])),
            r === "variant")
          ) {
            let n;
            if (
              (Array.isArray(i) || typeof i == "function"
                ? (n = i)
                : typeof i == "string" && (n = [i]),
              Array.isArray(n))
            )
              for (let a of n)
                a === ".dark"
                  ? ((r = !1),
                    V.warn("darkmode-variant-without-selector", [
                      "When using `variant` for `darkMode`, you must provide a selector.",
                      'Example: `darkMode: ["variant", ".your-selector &"]`',
                    ]))
                  : a.includes("&") ||
                    ((r = !1),
                    V.warn("darkmode-variant-without-ampersand", [
                      "When using `variant` for `darkMode`, your selector must contain `&`.",
                      'Example `darkMode: ["variant", ".your-selector &"]`',
                    ]));
            i = n;
          }
          r === "selector"
            ? e("dark", `&:where(${i}, ${i} *)`)
            : r === "media"
            ? e("dark", "@media (prefers-color-scheme: dark)")
            : r === "variant"
            ? e("dark", i)
            : r === "class" && e("dark", `&:is(${i} *)`);
        },
        printVariant: ({ addVariant: t }) => {
          t("print", "@media print");
        },
        screenVariants: ({ theme: t, addVariant: e, matchVariant: r }) => {
          let i = t("screens") ?? {},
            n = Object.values(i).every((w) => typeof w == "string"),
            a = Rt(t("screens")),
            s = new Set([]);
          function o(w) {
            return w.match(/(\D+)$/)?.[1] ?? "(none)";
          }
          function l(w) {
            w !== void 0 && s.add(o(w));
          }
          function c(w) {
            return l(w), s.size === 1;
          }
          for (let w of a) for (let _ of w.values) l(_.min), l(_.max);
          let f = s.size <= 1;
          function p(w) {
            return Object.fromEntries(
              a
                .filter((_) => Ps(_).result)
                .map((_) => {
                  let { min: T, max: O } = _.values[0];
                  if (w === "min" && T !== void 0) return _;
                  if (w === "min" && O !== void 0) return { ..._, not: !_.not };
                  if (w === "max" && O !== void 0) return _;
                  if (w === "max" && T !== void 0) return { ..._, not: !_.not };
                })
                .map((_) => [_.name, _])
            );
          }
          function h(w) {
            return (_, T) => eg(w, _.value, T.value);
          }
          let m = h("max"),
            b = h("min");
          function S(w) {
            return (_) => {
              if (n)
                if (f) {
                  if (typeof _ == "string" && !c(_))
                    return (
                      V.warn("minmax-have-mixed-units", [
                        "The `min-*` and `max-*` variants are not supported with a `screens` configuration containing mixed units.",
                      ]),
                      []
                    );
                } else
                  return (
                    V.warn("mixed-screen-units", [
                      "The `min-*` and `max-*` variants are not supported with a `screens` configuration containing mixed units.",
                    ]),
                    []
                  );
              else
                return (
                  V.warn("complex-screen-config", [
                    "The `min-*` and `max-*` variants are not supported with a `screens` configuration containing objects.",
                  ]),
                  []
                );
              return [`@media ${Dt(Is(_, w))}`];
            };
          }
          r("max", S("max"), { sort: m, values: n ? p("max") : {} });
          let v = "min-screens";
          for (let w of a)
            e(w.name, `@media ${Dt(w)}`, {
              id: v,
              sort: n && f ? b : void 0,
              value: w,
            });
          r("min", S("min"), { id: v, sort: b });
        },
        supportsVariants: ({ matchVariant: t, theme: e }) => {
          t(
            "supports",
            (r = "") => {
              let i = W(r),
                n = /^\w*\s*\(/.test(i);
              return (
                (i = n ? i.replace(/\b(and|or|not)\b/g, " $1 ") : i),
                n
                  ? `@supports ${i}`
                  : (i.includes(":") || (i = `${i}: var(--tw)`),
                    (i.startsWith("(") && i.endsWith(")")) || (i = `(${i})`),
                    `@supports ${i}`)
              );
            },
            { values: e("supports") ?? {} }
          );
        },
        hasVariants: ({ matchVariant: t, prefix: e }) => {
          t("has", (r) => `&:has(${W(r)})`, {
            values: {},
            [Bt]: { respectPrefix: !1 },
          }),
            t(
              "group-has",
              (r, { modifier: i }) =>
                i
                  ? `:merge(${e(".group")}\\/${i}):has(${W(r)}) &`
                  : `:merge(${e(".group")}):has(${W(r)}) &`,
              { values: {}, [Bt]: { respectPrefix: !1 } }
            ),
            t(
              "peer-has",
              (r, { modifier: i }) =>
                i
                  ? `:merge(${e(".peer")}\\/${i}):has(${W(r)}) ~ &`
                  : `:merge(${e(".peer")}):has(${W(r)}) ~ &`,
              { values: {}, [Bt]: { respectPrefix: !1 } }
            );
        },
        ariaVariants: ({ matchVariant: t, theme: e }) => {
          t("aria", (r) => `&[aria-${W(r)}]`, { values: e("aria") ?? {} }),
            t(
              "group-aria",
              (r, { modifier: i }) =>
                i
                  ? `:merge(.group\\/${i})[aria-${W(r)}] &`
                  : `:merge(.group)[aria-${W(r)}] &`,
              { values: e("aria") ?? {} }
            ),
            t(
              "peer-aria",
              (r, { modifier: i }) =>
                i
                  ? `:merge(.peer\\/${i})[aria-${W(r)}] ~ &`
                  : `:merge(.peer)[aria-${W(r)}] ~ &`,
              { values: e("aria") ?? {} }
            );
        },
        dataVariants: ({ matchVariant: t, theme: e }) => {
          t("data", (r) => `&[data-${W(r)}]`, { values: e("data") ?? {} }),
            t(
              "group-data",
              (r, { modifier: i }) =>
                i
                  ? `:merge(.group\\/${i})[data-${W(r)}] &`
                  : `:merge(.group)[data-${W(r)}] &`,
              { values: e("data") ?? {} }
            ),
            t(
              "peer-data",
              (r, { modifier: i }) =>
                i
                  ? `:merge(.peer\\/${i})[data-${W(r)}] ~ &`
                  : `:merge(.peer)[data-${W(r)}] ~ &`,
              { values: e("data") ?? {} }
            );
        },
        orientationVariants: ({ addVariant: t }) => {
          t("portrait", "@media (orientation: portrait)"),
            t("landscape", "@media (orientation: landscape)");
        },
        prefersContrastVariants: ({ addVariant: t }) => {
          t("contrast-more", "@media (prefers-contrast: more)"),
            t("contrast-less", "@media (prefers-contrast: less)");
        },
        forcedColorsVariants: ({ addVariant: t }) => {
          t("forced-colors", "@media (forced-colors: active)");
        },
      }),
        (Ke = [
          "translate(var(--tw-translate-x), var(--tw-translate-y))",
          "rotate(var(--tw-rotate))",
          "skewX(var(--tw-skew-x))",
          "skewY(var(--tw-skew-y))",
          "scaleX(var(--tw-scale-x))",
          "scaleY(var(--tw-scale-y))",
        ].join(" ")),
        (nt = [
          "var(--tw-blur)",
          "var(--tw-brightness)",
          "var(--tw-contrast)",
          "var(--tw-grayscale)",
          "var(--tw-hue-rotate)",
          "var(--tw-invert)",
          "var(--tw-saturate)",
          "var(--tw-sepia)",
          "var(--tw-drop-shadow)",
        ].join(" ")),
        (de = [
          "var(--tw-backdrop-blur)",
          "var(--tw-backdrop-brightness)",
          "var(--tw-backdrop-contrast)",
          "var(--tw-backdrop-grayscale)",
          "var(--tw-backdrop-hue-rotate)",
          "var(--tw-backdrop-invert)",
          "var(--tw-backdrop-opacity)",
          "var(--tw-backdrop-saturate)",
          "var(--tw-backdrop-sepia)",
        ].join(" ")),
        (ig = {
          preflight: ({ addBase: t }) => {
            let e = J.parse(
              `*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:theme('borderColor.DEFAULT', currentColor)}::after,::before{--tw-content:''}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:theme('fontFamily.sans', ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");font-feature-settings:theme('fontFamily.sans[1].fontFeatureSettings', normal);font-variation-settings:theme('fontFamily.sans[1].fontVariationSettings', normal);-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:theme('fontFamily.mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);font-feature-settings:theme('fontFamily.mono[1].fontFeatureSettings', normal);font-variation-settings:theme('fontFamily.mono[1].fontVariationSettings', normal);font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:theme('colors.gray.4', #9ca3af)}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}`
            );
            t([
              J.comment({
                text: `! tailwindcss v${Zm} | MIT License | https://tailwindcss.com`,
              }),
              ...e.nodes,
            ]);
          },
          container: (() => {
            function t(r = []) {
              return r
                .flatMap((i) => i.values.map((n) => n.min))
                .filter((i) => i !== void 0);
            }
            function e(r, i, n) {
              if (typeof n == "undefined") return [];
              if (!(typeof n == "object" && n !== null))
                return [{ screen: "DEFAULT", minWidth: 0, padding: n }];
              let a = [];
              n.DEFAULT &&
                a.push({ screen: "DEFAULT", minWidth: 0, padding: n.DEFAULT });
              for (let s of r)
                for (let o of i)
                  for (let { min: l } of o.values)
                    l === s && a.push({ minWidth: s, padding: n[o.name] });
              return a;
            }
            return function ({ addComponents: r, theme: i }) {
              let n = Rt(i("container.screens", i("screens"))),
                a = t(n),
                s = e(a, n, i("container.padding")),
                o = (c) => {
                  let f = s.find((p) => p.minWidth === c);
                  return f
                    ? { paddingRight: f.padding, paddingLeft: f.padding }
                    : {};
                },
                l = Array.from(
                  new Set(a.slice().sort((c, f) => parseInt(c) - parseInt(f)))
                ).map((c) => ({
                  [`@media (min-width: ${c})`]: {
                    ".container": { "max-width": c, ...o(c) },
                  },
                }));
              r([
                {
                  ".container": Object.assign(
                    { width: "100%" },
                    i("container.center", !1)
                      ? { marginRight: "auto", marginLeft: "auto" }
                      : {},
                    o(0)
                  ),
                },
                ...l,
              ]);
            };
          })(),
          accessibility: ({ addUtilities: t }) => {
            t({
              ".sr-only": {
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: "0",
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                borderWidth: "0",
              },
              ".not-sr-only": {
                position: "static",
                width: "auto",
                height: "auto",
                padding: "0",
                margin: "0",
                overflow: "visible",
                clip: "auto",
                whiteSpace: "normal",
              },
            });
          },
          pointerEvents: ({ addUtilities: t }) => {
            t({
              ".pointer-events-none": { "pointer-events": "none" },
              ".pointer-events-auto": { "pointer-events": "auto" },
            });
          },
          visibility: ({ addUtilities: t }) => {
            t({
              ".visible": { visibility: "visible" },
              ".invisible": { visibility: "hidden" },
              ".collapse": { visibility: "collapse" },
            });
          },
          position: ({ addUtilities: t }) => {
            t({
              ".static": { position: "static" },
              ".fixed": { position: "fixed" },
              ".absolute": { position: "absolute" },
              ".relative": { position: "relative" },
              ".sticky": { position: "sticky" },
            });
          },
          inset: B(
            "inset",
            [
              ["inset", ["inset"]],
              [
                ["inset-x", ["left", "right"]],
                ["inset-y", ["top", "bottom"]],
              ],
              [
                ["start", ["inset-inline-start"]],
                ["end", ["inset-inline-end"]],
                ["top", ["top"]],
                ["right", ["right"]],
                ["bottom", ["bottom"]],
                ["left", ["left"]],
              ],
            ],
            { supportsNegativeValues: !0 }
          ),
          isolation: ({ addUtilities: t }) => {
            t({
              ".isolate": { isolation: "isolate" },
              ".isolation-auto": { isolation: "auto" },
            });
          },
          zIndex: B("zIndex", [["z", ["zIndex"]]], {
            supportsNegativeValues: !0,
          }),
          order: B("order", void 0, { supportsNegativeValues: !0 }),
          gridColumn: B("gridColumn", [["col", ["gridColumn"]]]),
          gridColumnStart: B(
            "gridColumnStart",
            [["col-start", ["gridColumnStart"]]],
            { supportsNegativeValues: !0 }
          ),
          gridColumnEnd: B("gridColumnEnd", [["col-end", ["gridColumnEnd"]]], {
            supportsNegativeValues: !0,
          }),
          gridRow: B("gridRow", [["row", ["gridRow"]]]),
          gridRowStart: B("gridRowStart", [["row-start", ["gridRowStart"]]], {
            supportsNegativeValues: !0,
          }),
          gridRowEnd: B("gridRowEnd", [["row-end", ["gridRowEnd"]]], {
            supportsNegativeValues: !0,
          }),
          float: ({ addUtilities: t }) => {
            t({
              ".float-start": { float: "inline-start" },
              ".float-end": { float: "inline-end" },
              ".float-right": { float: "right" },
              ".float-left": { float: "left" },
              ".float-none": { float: "none" },
            });
          },
          clear: ({ addUtilities: t }) => {
            t({
              ".clear-start": { clear: "inline-start" },
              ".clear-end": { clear: "inline-end" },
              ".clear-left": { clear: "left" },
              ".clear-right": { clear: "right" },
              ".clear-both": { clear: "both" },
              ".clear-none": { clear: "none" },
            });
          },
          margin: B(
            "margin",
            [
              ["m", ["margin"]],
              [
                ["mx", ["margin-left", "margin-right"]],
                ["my", ["margin-top", "margin-bottom"]],
              ],
              [
                ["ms", ["margin-inline-start"]],
                ["me", ["margin-inline-end"]],
                ["mt", ["margin-top"]],
                ["mr", ["margin-right"]],
                ["mb", ["margin-bottom"]],
                ["ml", ["margin-left"]],
              ],
            ],
            { supportsNegativeValues: !0 }
          ),
          boxSizing: ({ addUtilities: t }) => {
            t({
              ".box-border": { "box-sizing": "border-box" },
              ".box-content": { "box-sizing": "content-box" },
            });
          },
          lineClamp: ({ matchUtilities: t, addUtilities: e, theme: r }) => {
            t(
              {
                "line-clamp": (i) => ({
                  overflow: "hidden",
                  display: "-webkit-box",
                  "-webkit-box-orient": "vertical",
                  "-webkit-line-clamp": `${i}`,
                }),
              },
              { values: r("lineClamp") }
            ),
              e({
                ".line-clamp-none": {
                  overflow: "visible",
                  display: "block",
                  "-webkit-box-orient": "horizontal",
                  "-webkit-line-clamp": "none",
                },
              });
          },
          display: ({ addUtilities: t }) => {
            t({
              ".block": { display: "block" },
              ".inline-block": { display: "inline-block" },
              ".inline": { display: "inline" },
              ".flex": { display: "flex" },
              ".inline-flex": { display: "inline-flex" },
              ".table": { display: "table" },
              ".inline-table": { display: "inline-table" },
              ".table-caption": { display: "table-caption" },
              ".table-cell": { display: "table-cell" },
              ".table-column": { display: "table-column" },
              ".table-column-group": { display: "table-column-group" },
              ".table-footer-group": { display: "table-footer-group" },
              ".table-header-group": { display: "table-header-group" },
              ".table-row-group": { display: "table-row-group" },
              ".table-row": { display: "table-row" },
              ".flow-root": { display: "flow-root" },
              ".grid": { display: "grid" },
              ".inline-grid": { display: "inline-grid" },
              ".contents": { display: "contents" },
              ".list-item": { display: "list-item" },
              ".hidden": { display: "none" },
            });
          },
          aspectRatio: B("aspectRatio", [["aspect", ["aspect-ratio"]]]),
          size: B("size", [["size", ["width", "height"]]]),
          height: B("height", [["h", ["height"]]]),
          maxHeight: B("maxHeight", [["max-h", ["maxHeight"]]]),
          minHeight: B("minHeight", [["min-h", ["minHeight"]]]),
          width: B("width", [["w", ["width"]]]),
          minWidth: B("minWidth", [["min-w", ["minWidth"]]]),
          maxWidth: B("maxWidth", [["max-w", ["maxWidth"]]]),
          flex: B("flex"),
          flexShrink: B("flexShrink", [
            ["flex-shrink", ["flex-shrink"]],
            ["shrink", ["flex-shrink"]],
          ]),
          flexGrow: B("flexGrow", [
            ["flex-grow", ["flex-grow"]],
            ["grow", ["flex-grow"]],
          ]),
          flexBasis: B("flexBasis", [["basis", ["flex-basis"]]]),
          tableLayout: ({ addUtilities: t }) => {
            t({
              ".table-auto": { "table-layout": "auto" },
              ".table-fixed": { "table-layout": "fixed" },
            });
          },
          captionSide: ({ addUtilities: t }) => {
            t({
              ".caption-top": { "caption-side": "top" },
              ".caption-bottom": { "caption-side": "bottom" },
            });
          },
          borderCollapse: ({ addUtilities: t }) => {
            t({
              ".border-collapse": { "border-collapse": "collapse" },
              ".border-separate": { "border-collapse": "separate" },
            });
          },
          borderSpacing: ({ addDefaults: t, matchUtilities: e, theme: r }) => {
            t("border-spacing", {
              "--tw-border-spacing-x": 0,
              "--tw-border-spacing-y": 0,
            }),
              e(
                {
                  "border-spacing": (i) => ({
                    "--tw-border-spacing-x": i,
                    "--tw-border-spacing-y": i,
                    "@defaults border-spacing": {},
                    "border-spacing":
                      "var(--tw-border-spacing-x) var(--tw-border-spacing-y)",
                  }),
                  "border-spacing-x": (i) => ({
                    "--tw-border-spacing-x": i,
                    "@defaults border-spacing": {},
                    "border-spacing":
                      "var(--tw-border-spacing-x) var(--tw-border-spacing-y)",
                  }),
                  "border-spacing-y": (i) => ({
                    "--tw-border-spacing-y": i,
                    "@defaults border-spacing": {},
                    "border-spacing":
                      "var(--tw-border-spacing-x) var(--tw-border-spacing-y)",
                  }),
                },
                { values: r("borderSpacing") }
              );
          },
          transformOrigin: B("transformOrigin", [
            ["origin", ["transformOrigin"]],
          ]),
          translate: B(
            "translate",
            [
              [
                [
                  "translate-x",
                  [
                    ["@defaults transform", {}],
                    "--tw-translate-x",
                    ["transform", Ke],
                  ],
                ],
                [
                  "translate-y",
                  [
                    ["@defaults transform", {}],
                    "--tw-translate-y",
                    ["transform", Ke],
                  ],
                ],
              ],
            ],
            { supportsNegativeValues: !0 }
          ),
          rotate: B(
            "rotate",
            [
              [
                "rotate",
                [["@defaults transform", {}], "--tw-rotate", ["transform", Ke]],
              ],
            ],
            { supportsNegativeValues: !0 }
          ),
          skew: B(
            "skew",
            [
              [
                [
                  "skew-x",
                  [
                    ["@defaults transform", {}],
                    "--tw-skew-x",
                    ["transform", Ke],
                  ],
                ],
                [
                  "skew-y",
                  [
                    ["@defaults transform", {}],
                    "--tw-skew-y",
                    ["transform", Ke],
                  ],
                ],
              ],
            ],
            { supportsNegativeValues: !0 }
          ),
          scale: B(
            "scale",
            [
              [
                "scale",
                [
                  ["@defaults transform", {}],
                  "--tw-scale-x",
                  "--tw-scale-y",
                  ["transform", Ke],
                ],
              ],
              [
                [
                  "scale-x",
                  [
                    ["@defaults transform", {}],
                    "--tw-scale-x",
                    ["transform", Ke],
                  ],
                ],
                [
                  "scale-y",
                  [
                    ["@defaults transform", {}],
                    "--tw-scale-y",
                    ["transform", Ke],
                  ],
                ],
              ],
            ],
            { supportsNegativeValues: !0 }
          ),
          transform: ({ addDefaults: t, addUtilities: e }) => {
            t("transform", {
              "--tw-translate-x": "0",
              "--tw-translate-y": "0",
              "--tw-rotate": "0",
              "--tw-skew-x": "0",
              "--tw-skew-y": "0",
              "--tw-scale-x": "1",
              "--tw-scale-y": "1",
            }),
              e({
                ".transform": { "@defaults transform": {}, transform: Ke },
                ".transform-cpu": { transform: Ke },
                ".transform-gpu": {
                  transform: Ke.replace(
                    "translate(var(--tw-translate-x), var(--tw-translate-y))",
                    "translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)"
                  ),
                },
                ".transform-none": { transform: "none" },
              });
          },
          animation: ({ matchUtilities: t, theme: e, config: r }) => {
            let i = (a) => Ce(r("prefix") + a),
              n = Object.fromEntries(
                Object.entries(e("keyframes") ?? {}).map(([a, s]) => [
                  a,
                  { [`@keyframes ${i(a)}`]: s },
                ])
              );
            t(
              {
                animate: (a) => {
                  let s = Pl(a);
                  return [
                    ...s.flatMap((o) => n[o.name]),
                    {
                      animation: s
                        .map(({ name: o, value: l }) =>
                          o === void 0 || n[o] === void 0
                            ? l
                            : l.replace(o, i(o))
                        )
                        .join(", "),
                    },
                  ];
                },
              },
              { values: e("animation") }
            );
          },
          cursor: B("cursor"),
          touchAction: ({ addDefaults: t, addUtilities: e }) => {
            t("touch-action", {
              "--tw-pan-x": " ",
              "--tw-pan-y": " ",
              "--tw-pinch-zoom": " ",
            });
            let r = "var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)";
            e({
              ".touch-auto": { "touch-action": "auto" },
              ".touch-none": { "touch-action": "none" },
              ".touch-pan-x": {
                "@defaults touch-action": {},
                "--tw-pan-x": "pan-x",
                "touch-action": r,
              },
              ".touch-pan-left": {
                "@defaults touch-action": {},
                "--tw-pan-x": "pan-left",
                "touch-action": r,
              },
              ".touch-pan-right": {
                "@defaults touch-action": {},
                "--tw-pan-x": "pan-right",
                "touch-action": r,
              },
              ".touch-pan-y": {
                "@defaults touch-action": {},
                "--tw-pan-y": "pan-y",
                "touch-action": r,
              },
              ".touch-pan-up": {
                "@defaults touch-action": {},
                "--tw-pan-y": "pan-up",
                "touch-action": r,
              },
              ".touch-pan-down": {
                "@defaults touch-action": {},
                "--tw-pan-y": "pan-down",
                "touch-action": r,
              },
              ".touch-pinch-zoom": {
                "@defaults touch-action": {},
                "--tw-pinch-zoom": "pinch-zoom",
                "touch-action": r,
              },
              ".touch-manipulation": { "touch-action": "manipulation" },
            });
          },
          userSelect: ({ addUtilities: t }) => {
            t({
              ".select-none": { "user-select": "none" },
              ".select-text": { "user-select": "text" },
              ".select-all": { "user-select": "all" },
              ".select-auto": { "user-select": "auto" },
            });
          },
          resize: ({ addUtilities: t }) => {
            t({
              ".resize-none": { resize: "none" },
              ".resize-y": { resize: "vertical" },
              ".resize-x": { resize: "horizontal" },
              ".resize": { resize: "both" },
            });
          },
          scrollSnapType: ({ addDefaults: t, addUtilities: e }) => {
            t("scroll-snap-type", {
              "--tw-scroll-snap-strictness": "proximity",
            }),
              e({
                ".snap-none": { "scroll-snap-type": "none" },
                ".snap-x": {
                  "@defaults scroll-snap-type": {},
                  "scroll-snap-type": "x var(--tw-scroll-snap-strictness)",
                },
                ".snap-y": {
                  "@defaults scroll-snap-type": {},
                  "scroll-snap-type": "y var(--tw-scroll-snap-strictness)",
                },
                ".snap-both": {
                  "@defaults scroll-snap-type": {},
                  "scroll-snap-type": "both var(--tw-scroll-snap-strictness)",
                },
                ".snap-mandatory": {
                  "--tw-scroll-snap-strictness": "mandatory",
                },
                ".snap-proximity": {
                  "--tw-scroll-snap-strictness": "proximity",
                },
              });
          },
          scrollSnapAlign: ({ addUtilities: t }) => {
            t({
              ".snap-start": { "scroll-snap-align": "start" },
              ".snap-end": { "scroll-snap-align": "end" },
              ".snap-center": { "scroll-snap-align": "center" },
              ".snap-align-none": { "scroll-snap-align": "none" },
            });
          },
          scrollSnapStop: ({ addUtilities: t }) => {
            t({
              ".snap-normal": { "scroll-snap-stop": "normal" },
              ".snap-always": { "scroll-snap-stop": "always" },
            });
          },
          scrollMargin: B(
            "scrollMargin",
            [
              ["scroll-m", ["scroll-margin"]],
              [
                ["scroll-mx", ["scroll-margin-left", "scroll-margin-right"]],
                ["scroll-my", ["scroll-margin-top", "scroll-margin-bottom"]],
              ],
              [
                ["scroll-ms", ["scroll-margin-inline-start"]],
                ["scroll-me", ["scroll-margin-inline-end"]],
                ["scroll-mt", ["scroll-margin-top"]],
                ["scroll-mr", ["scroll-margin-right"]],
                ["scroll-mb", ["scroll-margin-bottom"]],
                ["scroll-ml", ["scroll-margin-left"]],
              ],
            ],
            { supportsNegativeValues: !0 }
          ),
          scrollPadding: B("scrollPadding", [
            ["scroll-p", ["scroll-padding"]],
            [
              ["scroll-px", ["scroll-padding-left", "scroll-padding-right"]],
              ["scroll-py", ["scroll-padding-top", "scroll-padding-bottom"]],
            ],
            [
              ["scroll-ps", ["scroll-padding-inline-start"]],
              ["scroll-pe", ["scroll-padding-inline-end"]],
              ["scroll-pt", ["scroll-padding-top"]],
              ["scroll-pr", ["scroll-padding-right"]],
              ["scroll-pb", ["scroll-padding-bottom"]],
              ["scroll-pl", ["scroll-padding-left"]],
            ],
          ]),
          listStylePosition: ({ addUtilities: t }) => {
            t({
              ".list-inside": { "list-style-position": "inside" },
              ".list-outside": { "list-style-position": "outside" },
            });
          },
          listStyleType: B("listStyleType", [["list", ["listStyleType"]]]),
          listStyleImage: B("listStyleImage", [
            ["list-image", ["listStyleImage"]],
          ]),
          appearance: ({ addUtilities: t }) => {
            t({
              ".appearance-none": { appearance: "none" },
              ".appearance-auto": { appearance: "auto" },
            });
          },
          columns: B("columns", [["columns", ["columns"]]]),
          breakBefore: ({ addUtilities: t }) => {
            t({
              ".break-before-auto": { "break-before": "auto" },
              ".break-before-avoid": { "break-before": "avoid" },
              ".break-before-all": { "break-before": "all" },
              ".break-before-avoid-page": { "break-before": "avoid-page" },
              ".break-before-page": { "break-before": "page" },
              ".break-before-left": { "break-before": "left" },
              ".break-before-right": { "break-before": "right" },
              ".break-before-column": { "break-before": "column" },
            });
          },
          breakInside: ({ addUtilities: t }) => {
            t({
              ".break-inside-auto": { "break-inside": "auto" },
              ".break-inside-avoid": { "break-inside": "avoid" },
              ".break-inside-avoid-page": { "break-inside": "avoid-page" },
              ".break-inside-avoid-column": { "break-inside": "avoid-column" },
            });
          },
          breakAfter: ({ addUtilities: t }) => {
            t({
              ".break-after-auto": { "break-after": "auto" },
              ".break-after-avoid": { "break-after": "avoid" },
              ".break-after-all": { "break-after": "all" },
              ".break-after-avoid-page": { "break-after": "avoid-page" },
              ".break-after-page": { "break-after": "page" },
              ".break-after-left": { "break-after": "left" },
              ".break-after-right": { "break-after": "right" },
              ".break-after-column": { "break-after": "column" },
            });
          },
          gridAutoColumns: B("gridAutoColumns", [
            ["auto-cols", ["gridAutoColumns"]],
          ]),
          gridAutoFlow: ({ addUtilities: t }) => {
            t({
              ".grid-flow-row": { gridAutoFlow: "row" },
              ".grid-flow-col": { gridAutoFlow: "column" },
              ".grid-flow-dense": { gridAutoFlow: "dense" },
              ".grid-flow-row-dense": { gridAutoFlow: "row dense" },
              ".grid-flow-col-dense": { gridAutoFlow: "column dense" },
            });
          },
          gridAutoRows: B("gridAutoRows", [["auto-rows", ["gridAutoRows"]]]),
          gridTemplateColumns: B("gridTemplateColumns", [
            ["grid-cols", ["gridTemplateColumns"]],
          ]),
          gridTemplateRows: B("gridTemplateRows", [
            ["grid-rows", ["gridTemplateRows"]],
          ]),
          flexDirection: ({ addUtilities: t }) => {
            t({
              ".flex-row": { "flex-direction": "row" },
              ".flex-row-reverse": { "flex-direction": "row-reverse" },
              ".flex-col": { "flex-direction": "column" },
              ".flex-col-reverse": { "flex-direction": "column-reverse" },
            });
          },
          flexWrap: ({ addUtilities: t }) => {
            t({
              ".flex-wrap": { "flex-wrap": "wrap" },
              ".flex-wrap-reverse": { "flex-wrap": "wrap-reverse" },
              ".flex-nowrap": { "flex-wrap": "nowrap" },
            });
          },
          placeContent: ({ addUtilities: t }) => {
            t({
              ".place-content-center": { "place-content": "center" },
              ".place-content-start": { "place-content": "start" },
              ".place-content-end": { "place-content": "end" },
              ".place-content-between": { "place-content": "space-between" },
              ".place-content-around": { "place-content": "space-around" },
              ".place-content-evenly": { "place-content": "space-evenly" },
              ".place-content-baseline": { "place-content": "baseline" },
              ".place-content-stretch": { "place-content": "stretch" },
            });
          },
          placeItems: ({ addUtilities: t }) => {
            t({
              ".place-items-start": { "place-items": "start" },
              ".place-items-end": { "place-items": "end" },
              ".place-items-center": { "place-items": "center" },
              ".place-items-baseline": { "place-items": "baseline" },
              ".place-items-stretch": { "place-items": "stretch" },
            });
          },
          alignContent: ({ addUtilities: t }) => {
            t({
              ".content-normal": { "align-content": "normal" },
              ".content-center": { "align-content": "center" },
              ".content-start": { "align-content": "flex-start" },
              ".content-end": { "align-content": "flex-end" },
              ".content-between": { "align-content": "space-between" },
              ".content-around": { "align-content": "space-around" },
              ".content-evenly": { "align-content": "space-evenly" },
              ".content-baseline": { "align-content": "baseline" },
              ".content-stretch": { "align-content": "stretch" },
            });
          },
          alignItems: ({ addUtilities: t }) => {
            t({
              ".items-start": { "align-items": "flex-start" },
              ".items-end": { "align-items": "flex-end" },
              ".items-center": { "align-items": "center" },
              ".items-baseline": { "align-items": "baseline" },
              ".items-stretch": { "align-items": "stretch" },
            });
          },
          justifyContent: ({ addUtilities: t }) => {
            t({
              ".justify-normal": { "justify-content": "normal" },
              ".justify-start": { "justify-content": "flex-start" },
              ".justify-end": { "justify-content": "flex-end" },
              ".justify-center": { "justify-content": "center" },
              ".justify-between": { "justify-content": "space-between" },
              ".justify-around": { "justify-content": "space-around" },
              ".justify-evenly": { "justify-content": "space-evenly" },
              ".justify-stretch": { "justify-content": "stretch" },
            });
          },
          justifyItems: ({ addUtilities: t }) => {
            t({
              ".justify-items-start": { "justify-items": "start" },
              ".justify-items-end": { "justify-items": "end" },
              ".justify-items-center": { "justify-items": "center" },
              ".justify-items-stretch": { "justify-items": "stretch" },
            });
          },
          gap: B("gap", [
            ["gap", ["gap"]],
            [
              ["gap-x", ["columnGap"]],
              ["gap-y", ["rowGap"]],
            ],
          ]),
          space: ({ matchUtilities: t, addUtilities: e, theme: r }) => {
            t(
              {
                "space-x": (i) => (
                  (i = i === "0" ? "0px" : i),
                  {
                    "& > :not([hidden]) ~ :not([hidden])": {
                      "--tw-space-x-reverse": "0",
                      "margin-right": `calc(${i} * var(--tw-space-x-reverse))`,
                      "margin-left": `calc(${i} * calc(1 - var(--tw-space-x-reverse)))`,
                    },
                  }
                ),
                "space-y": (i) => (
                  (i = i === "0" ? "0px" : i),
                  {
                    "& > :not([hidden]) ~ :not([hidden])": {
                      "--tw-space-y-reverse": "0",
                      "margin-top": `calc(${i} * calc(1 - var(--tw-space-y-reverse)))`,
                      "margin-bottom": `calc(${i} * var(--tw-space-y-reverse))`,
                    },
                  }
                ),
              },
              { values: r("space"), supportsNegativeValues: !0 }
            ),
              e({
                ".space-y-reverse > :not([hidden]) ~ :not([hidden])": {
                  "--tw-space-y-reverse": "1",
                },
                ".space-x-reverse > :not([hidden]) ~ :not([hidden])": {
                  "--tw-space-x-reverse": "1",
                },
              });
          },
          divideWidth: ({ matchUtilities: t, addUtilities: e, theme: r }) => {
            t(
              {
                "divide-x": (i) => (
                  (i = i === "0" ? "0px" : i),
                  {
                    "& > :not([hidden]) ~ :not([hidden])": {
                      "@defaults border-width": {},
                      "--tw-divide-x-reverse": "0",
                      "border-right-width": `calc(${i} * var(--tw-divide-x-reverse))`,
                      "border-left-width": `calc(${i} * calc(1 - var(--tw-divide-x-reverse)))`,
                    },
                  }
                ),
                "divide-y": (i) => (
                  (i = i === "0" ? "0px" : i),
                  {
                    "& > :not([hidden]) ~ :not([hidden])": {
                      "@defaults border-width": {},
                      "--tw-divide-y-reverse": "0",
                      "border-top-width": `calc(${i} * calc(1 - var(--tw-divide-y-reverse)))`,
                      "border-bottom-width": `calc(${i} * var(--tw-divide-y-reverse))`,
                    },
                  }
                ),
              },
              {
                values: r("divideWidth"),
                type: ["line-width", "length", "any"],
              }
            ),
              e({
                ".divide-y-reverse > :not([hidden]) ~ :not([hidden])": {
                  "@defaults border-width": {},
                  "--tw-divide-y-reverse": "1",
                },
                ".divide-x-reverse > :not([hidden]) ~ :not([hidden])": {
                  "@defaults border-width": {},
                  "--tw-divide-x-reverse": "1",
                },
              });
          },
          divideStyle: ({ addUtilities: t }) => {
            t({
              ".divide-solid > :not([hidden]) ~ :not([hidden])": {
                "border-style": "solid",
              },
              ".divide-dashed > :not([hidden]) ~ :not([hidden])": {
                "border-style": "dashed",
              },
              ".divide-dotted > :not([hidden]) ~ :not([hidden])": {
                "border-style": "dotted",
              },
              ".divide-double > :not([hidden]) ~ :not([hidden])": {
                "border-style": "double",
              },
              ".divide-none > :not([hidden]) ~ :not([hidden])": {
                "border-style": "none",
              },
            });
          },
          divideColor: ({ matchUtilities: t, theme: e, corePlugins: r }) => {
            t(
              {
                divide: (i) =>
                  r("divideOpacity")
                    ? {
                        ["& > :not([hidden]) ~ :not([hidden])"]: _e({
                          color: i,
                          property: "border-color",
                          variable: "--tw-divide-opacity",
                        }),
                      }
                    : {
                        ["& > :not([hidden]) ~ :not([hidden])"]: {
                          "border-color": G(i),
                        },
                      },
              },
              {
                values: (({ DEFAULT: i, ...n }) => n)(we(e("divideColor"))),
                type: ["color", "any"],
              }
            );
          },
          divideOpacity: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                "divide-opacity": (r) => ({
                  ["& > :not([hidden]) ~ :not([hidden])"]: {
                    "--tw-divide-opacity": r,
                  },
                }),
              },
              { values: e("divideOpacity") }
            );
          },
          placeSelf: ({ addUtilities: t }) => {
            t({
              ".place-self-auto": { "place-self": "auto" },
              ".place-self-start": { "place-self": "start" },
              ".place-self-end": { "place-self": "end" },
              ".place-self-center": { "place-self": "center" },
              ".place-self-stretch": { "place-self": "stretch" },
            });
          },
          alignSelf: ({ addUtilities: t }) => {
            t({
              ".self-auto": { "align-self": "auto" },
              ".self-start": { "align-self": "flex-start" },
              ".self-end": { "align-self": "flex-end" },
              ".self-center": { "align-self": "center" },
              ".self-stretch": { "align-self": "stretch" },
              ".self-baseline": { "align-self": "baseline" },
            });
          },
          justifySelf: ({ addUtilities: t }) => {
            t({
              ".justify-self-auto": { "justify-self": "auto" },
              ".justify-self-start": { "justify-self": "start" },
              ".justify-self-end": { "justify-self": "end" },
              ".justify-self-center": { "justify-self": "center" },
              ".justify-self-stretch": { "justify-self": "stretch" },
            });
          },
          overflow: ({ addUtilities: t }) => {
            t({
              ".overflow-auto": { overflow: "auto" },
              ".overflow-hidden": { overflow: "hidden" },
              ".overflow-clip": { overflow: "clip" },
              ".overflow-visible": { overflow: "visible" },
              ".overflow-scroll": { overflow: "scroll" },
              ".overflow-x-auto": { "overflow-x": "auto" },
              ".overflow-y-auto": { "overflow-y": "auto" },
              ".overflow-x-hidden": { "overflow-x": "hidden" },
              ".overflow-y-hidden": { "overflow-y": "hidden" },
              ".overflow-x-clip": { "overflow-x": "clip" },
              ".overflow-y-clip": { "overflow-y": "clip" },
              ".overflow-x-visible": { "overflow-x": "visible" },
              ".overflow-y-visible": { "overflow-y": "visible" },
              ".overflow-x-scroll": { "overflow-x": "scroll" },
              ".overflow-y-scroll": { "overflow-y": "scroll" },
            });
          },
          overscrollBehavior: ({ addUtilities: t }) => {
            t({
              ".overscroll-auto": { "overscroll-behavior": "auto" },
              ".overscroll-contain": { "overscroll-behavior": "contain" },
              ".overscroll-none": { "overscroll-behavior": "none" },
              ".overscroll-y-auto": { "overscroll-behavior-y": "auto" },
              ".overscroll-y-contain": { "overscroll-behavior-y": "contain" },
              ".overscroll-y-none": { "overscroll-behavior-y": "none" },
              ".overscroll-x-auto": { "overscroll-behavior-x": "auto" },
              ".overscroll-x-contain": { "overscroll-behavior-x": "contain" },
              ".overscroll-x-none": { "overscroll-behavior-x": "none" },
            });
          },
          scrollBehavior: ({ addUtilities: t }) => {
            t({
              ".scroll-auto": { "scroll-behavior": "auto" },
              ".scroll-smooth": { "scroll-behavior": "smooth" },
            });
          },
          textOverflow: ({ addUtilities: t }) => {
            t({
              ".truncate": {
                overflow: "hidden",
                "text-overflow": "ellipsis",
                "white-space": "nowrap",
              },
              ".overflow-ellipsis": { "text-overflow": "ellipsis" },
              ".text-ellipsis": { "text-overflow": "ellipsis" },
              ".text-clip": { "text-overflow": "clip" },
            });
          },
          hyphens: ({ addUtilities: t }) => {
            t({
              ".hyphens-none": { hyphens: "none" },
              ".hyphens-manual": { hyphens: "manual" },
              ".hyphens-auto": { hyphens: "auto" },
            });
          },
          whitespace: ({ addUtilities: t }) => {
            t({
              ".whitespace-normal": { "white-space": "normal" },
              ".whitespace-nowrap": { "white-space": "nowrap" },
              ".whitespace-pre": { "white-space": "pre" },
              ".whitespace-pre-line": { "white-space": "pre-line" },
              ".whitespace-pre-wrap": { "white-space": "pre-wrap" },
              ".whitespace-break-spaces": { "white-space": "break-spaces" },
            });
          },
          textWrap: ({ addUtilities: t }) => {
            t({
              ".text-wrap": { "text-wrap": "wrap" },
              ".text-nowrap": { "text-wrap": "nowrap" },
              ".text-balance": { "text-wrap": "balance" },
              ".text-pretty": { "text-wrap": "pretty" },
            });
          },
          wordBreak: ({ addUtilities: t }) => {
            t({
              ".break-normal": {
                "overflow-wrap": "normal",
                "word-break": "normal",
              },
              ".break-words": { "overflow-wrap": "break-word" },
              ".break-all": { "word-break": "break-all" },
              ".break-keep": { "word-break": "keep-all" },
            });
          },
          borderRadius: B("borderRadius", [
            ["rounded", ["border-radius"]],
            [
              [
                "rounded-s",
                ["border-start-start-radius", "border-end-start-radius"],
              ],
              [
                "rounded-e",
                ["border-start-end-radius", "border-end-end-radius"],
              ],
              [
                "rounded-t",
                ["border-top-left-radius", "border-top-right-radius"],
              ],
              [
                "rounded-r",
                ["border-top-right-radius", "border-bottom-right-radius"],
              ],
              [
                "rounded-b",
                ["border-bottom-right-radius", "border-bottom-left-radius"],
              ],
              [
                "rounded-l",
                ["border-top-left-radius", "border-bottom-left-radius"],
              ],
            ],
            [
              ["rounded-ss", ["border-start-start-radius"]],
              ["rounded-se", ["border-start-end-radius"]],
              ["rounded-ee", ["border-end-end-radius"]],
              ["rounded-es", ["border-end-start-radius"]],
              ["rounded-tl", ["border-top-left-radius"]],
              ["rounded-tr", ["border-top-right-radius"]],
              ["rounded-br", ["border-bottom-right-radius"]],
              ["rounded-bl", ["border-bottom-left-radius"]],
            ],
          ]),
          borderWidth: B(
            "borderWidth",
            [
              ["border", [["@defaults border-width", {}], "border-width"]],
              [
                [
                  "border-x",
                  [
                    ["@defaults border-width", {}],
                    "border-left-width",
                    "border-right-width",
                  ],
                ],
                [
                  "border-y",
                  [
                    ["@defaults border-width", {}],
                    "border-top-width",
                    "border-bottom-width",
                  ],
                ],
              ],
              [
                [
                  "border-s",
                  [["@defaults border-width", {}], "border-inline-start-width"],
                ],
                [
                  "border-e",
                  [["@defaults border-width", {}], "border-inline-end-width"],
                ],
                [
                  "border-t",
                  [["@defaults border-width", {}], "border-top-width"],
                ],
                [
                  "border-r",
                  [["@defaults border-width", {}], "border-right-width"],
                ],
                [
                  "border-b",
                  [["@defaults border-width", {}], "border-bottom-width"],
                ],
                [
                  "border-l",
                  [["@defaults border-width", {}], "border-left-width"],
                ],
              ],
            ],
            { type: ["line-width", "length"] }
          ),
          borderStyle: ({ addUtilities: t }) => {
            t({
              ".border-solid": { "border-style": "solid" },
              ".border-dashed": { "border-style": "dashed" },
              ".border-dotted": { "border-style": "dotted" },
              ".border-double": { "border-style": "double" },
              ".border-hidden": { "border-style": "hidden" },
              ".border-none": { "border-style": "none" },
            });
          },
          borderColor: ({ matchUtilities: t, theme: e, corePlugins: r }) => {
            t(
              {
                border: (i) =>
                  r("borderOpacity")
                    ? _e({
                        color: i,
                        property: "border-color",
                        variable: "--tw-border-opacity",
                      })
                    : { "border-color": G(i) },
              },
              {
                values: (({ DEFAULT: i, ...n }) => n)(we(e("borderColor"))),
                type: ["color", "any"],
              }
            ),
              t(
                {
                  "border-x": (i) =>
                    r("borderOpacity")
                      ? _e({
                          color: i,
                          property: ["border-left-color", "border-right-color"],
                          variable: "--tw-border-opacity",
                        })
                      : {
                          "border-left-color": G(i),
                          "border-right-color": G(i),
                        },
                  "border-y": (i) =>
                    r("borderOpacity")
                      ? _e({
                          color: i,
                          property: ["border-top-color", "border-bottom-color"],
                          variable: "--tw-border-opacity",
                        })
                      : {
                          "border-top-color": G(i),
                          "border-bottom-color": G(i),
                        },
                },
                {
                  values: (({ DEFAULT: i, ...n }) => n)(we(e("borderColor"))),
                  type: ["color", "any"],
                }
              ),
              t(
                {
                  "border-s": (i) =>
                    r("borderOpacity")
                      ? _e({
                          color: i,
                          property: "border-inline-start-color",
                          variable: "--tw-border-opacity",
                        })
                      : { "border-inline-start-color": G(i) },
                  "border-e": (i) =>
                    r("borderOpacity")
                      ? _e({
                          color: i,
                          property: "border-inline-end-color",
                          variable: "--tw-border-opacity",
                        })
                      : { "border-inline-end-color": G(i) },
                  "border-t": (i) =>
                    r("borderOpacity")
                      ? _e({
                          color: i,
                          property: "border-top-color",
                          variable: "--tw-border-opacity",
                        })
                      : { "border-top-color": G(i) },
                  "border-r": (i) =>
                    r("borderOpacity")
                      ? _e({
                          color: i,
                          property: "border-right-color",
                          variable: "--tw-border-opacity",
                        })
                      : { "border-right-color": G(i) },
                  "border-b": (i) =>
                    r("borderOpacity")
                      ? _e({
                          color: i,
                          property: "border-bottom-color",
                          variable: "--tw-border-opacity",
                        })
                      : { "border-bottom-color": G(i) },
                  "border-l": (i) =>
                    r("borderOpacity")
                      ? _e({
                          color: i,
                          property: "border-left-color",
                          variable: "--tw-border-opacity",
                        })
                      : { "border-left-color": G(i) },
                },
                {
                  values: (({ DEFAULT: i, ...n }) => n)(we(e("borderColor"))),
                  type: ["color", "any"],
                }
              );
          },
          borderOpacity: B("borderOpacity", [
            ["border-opacity", ["--tw-border-opacity"]],
          ]),
          backgroundColor: ({
            matchUtilities: t,
            theme: e,
            corePlugins: r,
          }) => {
            t(
              {
                bg: (i) =>
                  r("backgroundOpacity")
                    ? _e({
                        color: i,
                        property: "background-color",
                        variable: "--tw-bg-opacity",
                      })
                    : { "background-color": G(i) },
              },
              { values: we(e("backgroundColor")), type: ["color", "any"] }
            );
          },
          backgroundOpacity: B("backgroundOpacity", [
            ["bg-opacity", ["--tw-bg-opacity"]],
          ]),
          backgroundImage: B(
            "backgroundImage",
            [["bg", ["background-image"]]],
            { type: ["lookup", "image", "url"] }
          ),
          gradientColorStops: (() => {
            function t(e) {
              return et(e, 0, "rgb(255 255 255 / 0)");
            }
            return function ({ matchUtilities: e, theme: r, addDefaults: i }) {
              i("gradient-color-stops", {
                "--tw-gradient-from-position": " ",
                "--tw-gradient-via-position": " ",
                "--tw-gradient-to-position": " ",
              });
              let n = {
                  values: we(r("gradientColorStops")),
                  type: ["color", "any"],
                },
                a = {
                  values: r("gradientColorStopPositions"),
                  type: ["length", "percentage"],
                };
              e(
                {
                  from: (s) => {
                    let o = t(s);
                    return {
                      "@defaults gradient-color-stops": {},
                      "--tw-gradient-from": `${G(
                        s
                      )} var(--tw-gradient-from-position)`,
                      "--tw-gradient-to": `${o} var(--tw-gradient-to-position)`,
                      "--tw-gradient-stops":
                        "var(--tw-gradient-from), var(--tw-gradient-to)",
                    };
                  },
                },
                n
              ),
                e({ from: (s) => ({ "--tw-gradient-from-position": s }) }, a),
                e(
                  {
                    via: (s) => {
                      let o = t(s);
                      return {
                        "@defaults gradient-color-stops": {},
                        "--tw-gradient-to": `${o}  var(--tw-gradient-to-position)`,
                        "--tw-gradient-stops": `var(--tw-gradient-from), ${G(
                          s
                        )} var(--tw-gradient-via-position), var(--tw-gradient-to)`,
                      };
                    },
                  },
                  n
                ),
                e({ via: (s) => ({ "--tw-gradient-via-position": s }) }, a),
                e(
                  {
                    to: (s) => ({
                      "@defaults gradient-color-stops": {},
                      "--tw-gradient-to": `${G(
                        s
                      )} var(--tw-gradient-to-position)`,
                    }),
                  },
                  n
                ),
                e({ to: (s) => ({ "--tw-gradient-to-position": s }) }, a);
            };
          })(),
          boxDecorationBreak: ({ addUtilities: t }) => {
            t({
              ".decoration-slice": { "box-decoration-break": "slice" },
              ".decoration-clone": { "box-decoration-break": "clone" },
              ".box-decoration-slice": { "box-decoration-break": "slice" },
              ".box-decoration-clone": { "box-decoration-break": "clone" },
            });
          },
          backgroundSize: B("backgroundSize", [["bg", ["background-size"]]], {
            type: ["lookup", "length", "percentage", "size"],
          }),
          backgroundAttachment: ({ addUtilities: t }) => {
            t({
              ".bg-fixed": { "background-attachment": "fixed" },
              ".bg-local": { "background-attachment": "local" },
              ".bg-scroll": { "background-attachment": "scroll" },
            });
          },
          backgroundClip: ({ addUtilities: t }) => {
            t({
              ".bg-clip-border": { "background-clip": "border-box" },
              ".bg-clip-padding": { "background-clip": "padding-box" },
              ".bg-clip-content": { "background-clip": "content-box" },
              ".bg-clip-text": { "background-clip": "text" },
            });
          },
          backgroundPosition: B(
            "backgroundPosition",
            [["bg", ["background-position"]]],
            { type: ["lookup", ["position", { preferOnConflict: !0 }]] }
          ),
          backgroundRepeat: ({ addUtilities: t }) => {
            t({
              ".bg-repeat": { "background-repeat": "repeat" },
              ".bg-no-repeat": { "background-repeat": "no-repeat" },
              ".bg-repeat-x": { "background-repeat": "repeat-x" },
              ".bg-repeat-y": { "background-repeat": "repeat-y" },
              ".bg-repeat-round": { "background-repeat": "round" },
              ".bg-repeat-space": { "background-repeat": "space" },
            });
          },
          backgroundOrigin: ({ addUtilities: t }) => {
            t({
              ".bg-origin-border": { "background-origin": "border-box" },
              ".bg-origin-padding": { "background-origin": "padding-box" },
              ".bg-origin-content": { "background-origin": "content-box" },
            });
          },
          fill: ({ matchUtilities: t, theme: e }) => {
            t(
              { fill: (r) => ({ fill: G(r) }) },
              { values: we(e("fill")), type: ["color", "any"] }
            );
          },
          stroke: ({ matchUtilities: t, theme: e }) => {
            t(
              { stroke: (r) => ({ stroke: G(r) }) },
              { values: we(e("stroke")), type: ["color", "url", "any"] }
            );
          },
          strokeWidth: B("strokeWidth", [["stroke", ["stroke-width"]]], {
            type: ["length", "number", "percentage"],
          }),
          objectFit: ({ addUtilities: t }) => {
            t({
              ".object-contain": { "object-fit": "contain" },
              ".object-cover": { "object-fit": "cover" },
              ".object-fill": { "object-fit": "fill" },
              ".object-none": { "object-fit": "none" },
              ".object-scale-down": { "object-fit": "scale-down" },
            });
          },
          objectPosition: B("objectPosition", [
            ["object", ["object-position"]],
          ]),
          padding: B("padding", [
            ["p", ["padding"]],
            [
              ["px", ["padding-left", "padding-right"]],
              ["py", ["padding-top", "padding-bottom"]],
            ],
            [
              ["ps", ["padding-inline-start"]],
              ["pe", ["padding-inline-end"]],
              ["pt", ["padding-top"]],
              ["pr", ["padding-right"]],
              ["pb", ["padding-bottom"]],
              ["pl", ["padding-left"]],
            ],
          ]),
          textAlign: ({ addUtilities: t }) => {
            t({
              ".text-left": { "text-align": "left" },
              ".text-center": { "text-align": "center" },
              ".text-right": { "text-align": "right" },
              ".text-justify": { "text-align": "justify" },
              ".text-start": { "text-align": "start" },
              ".text-end": { "text-align": "end" },
            });
          },
          textIndent: B("textIndent", [["indent", ["text-indent"]]], {
            supportsNegativeValues: !0,
          }),
          verticalAlign: ({ addUtilities: t, matchUtilities: e }) => {
            t({
              ".align-baseline": { "vertical-align": "baseline" },
              ".align-top": { "vertical-align": "top" },
              ".align-middle": { "vertical-align": "middle" },
              ".align-bottom": { "vertical-align": "bottom" },
              ".align-text-top": { "vertical-align": "text-top" },
              ".align-text-bottom": { "vertical-align": "text-bottom" },
              ".align-sub": { "vertical-align": "sub" },
              ".align-super": { "vertical-align": "super" },
            }),
              e({ align: (r) => ({ "vertical-align": r }) });
          },
          fontFamily: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                font: (r) => {
                  let [i, n = {}] = Array.isArray(r) && be(r[1]) ? r : [r],
                    { fontFeatureSettings: a, fontVariationSettings: s } = n;
                  return {
                    "font-family": Array.isArray(i) ? i.join(", ") : i,
                    ...(a === void 0 ? {} : { "font-feature-settings": a }),
                    ...(s === void 0 ? {} : { "font-variation-settings": s }),
                  };
                },
              },
              {
                values: e("fontFamily"),
                type: ["lookup", "generic-name", "family-name"],
              }
            );
          },
          fontSize: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                text: (r, { modifier: i }) => {
                  let [n, a] = Array.isArray(r) ? r : [r];
                  if (i) return { "font-size": n, "line-height": i };
                  let {
                    lineHeight: s,
                    letterSpacing: o,
                    fontWeight: l,
                  } = be(a) ? a : { lineHeight: a };
                  return {
                    "font-size": n,
                    ...(s === void 0 ? {} : { "line-height": s }),
                    ...(o === void 0 ? {} : { "letter-spacing": o }),
                    ...(l === void 0 ? {} : { "font-weight": l }),
                  };
                },
              },
              {
                values: e("fontSize"),
                modifiers: e("lineHeight"),
                type: [
                  "absolute-size",
                  "relative-size",
                  "length",
                  "percentage",
                ],
              }
            );
          },
          fontWeight: B("fontWeight", [["font", ["fontWeight"]]], {
            type: ["lookup", "number", "any"],
          }),
          textTransform: ({ addUtilities: t }) => {
            t({
              ".uppercase": { "text-transform": "uppercase" },
              ".lowercase": { "text-transform": "lowercase" },
              ".capitalize": { "text-transform": "capitalize" },
              ".normal-case": { "text-transform": "none" },
            });
          },
          fontStyle: ({ addUtilities: t }) => {
            t({
              ".italic": { "font-style": "italic" },
              ".not-italic": { "font-style": "normal" },
            });
          },
          fontVariantNumeric: ({ addDefaults: t, addUtilities: e }) => {
            let r =
              "var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)";
            t("font-variant-numeric", {
              "--tw-ordinal": " ",
              "--tw-slashed-zero": " ",
              "--tw-numeric-figure": " ",
              "--tw-numeric-spacing": " ",
              "--tw-numeric-fraction": " ",
            }),
              e({
                ".normal-nums": { "font-variant-numeric": "normal" },
                ".ordinal": {
                  "@defaults font-variant-numeric": {},
                  "--tw-ordinal": "ordinal",
                  "font-variant-numeric": r,
                },
                ".slashed-zero": {
                  "@defaults font-variant-numeric": {},
                  "--tw-slashed-zero": "slashed-zero",
                  "font-variant-numeric": r,
                },
                ".lining-nums": {
                  "@defaults font-variant-numeric": {},
                  "--tw-numeric-figure": "lining-nums",
                  "font-variant-numeric": r,
                },
                ".oldstyle-nums": {
                  "@defaults font-variant-numeric": {},
                  "--tw-numeric-figure": "oldstyle-nums",
                  "font-variant-numeric": r,
                },
                ".proportional-nums": {
                  "@defaults font-variant-numeric": {},
                  "--tw-numeric-spacing": "proportional-nums",
                  "font-variant-numeric": r,
                },
                ".tabular-nums": {
                  "@defaults font-variant-numeric": {},
                  "--tw-numeric-spacing": "tabular-nums",
                  "font-variant-numeric": r,
                },
                ".diagonal-fractions": {
                  "@defaults font-variant-numeric": {},
                  "--tw-numeric-fraction": "diagonal-fractions",
                  "font-variant-numeric": r,
                },
                ".stacked-fractions": {
                  "@defaults font-variant-numeric": {},
                  "--tw-numeric-fraction": "stacked-fractions",
                  "font-variant-numeric": r,
                },
              });
          },
          lineHeight: B("lineHeight", [["leading", ["lineHeight"]]]),
          letterSpacing: B("letterSpacing", [["tracking", ["letterSpacing"]]], {
            supportsNegativeValues: !0,
          }),
          textColor: ({ matchUtilities: t, theme: e, corePlugins: r }) => {
            t(
              {
                text: (i) =>
                  r("textOpacity")
                    ? _e({
                        color: i,
                        property: "color",
                        variable: "--tw-text-opacity",
                      })
                    : { color: G(i) },
              },
              { values: we(e("textColor")), type: ["color", "any"] }
            );
          },
          textOpacity: B("textOpacity", [
            ["text-opacity", ["--tw-text-opacity"]],
          ]),
          textDecoration: ({ addUtilities: t }) => {
            t({
              ".underline": { "text-decoration-line": "underline" },
              ".overline": { "text-decoration-line": "overline" },
              ".line-through": { "text-decoration-line": "line-through" },
              ".no-underline": { "text-decoration-line": "none" },
            });
          },
          textDecorationColor: ({ matchUtilities: t, theme: e }) => {
            t(
              { decoration: (r) => ({ "text-decoration-color": G(r) }) },
              { values: we(e("textDecorationColor")), type: ["color", "any"] }
            );
          },
          textDecorationStyle: ({ addUtilities: t }) => {
            t({
              ".decoration-solid": { "text-decoration-style": "solid" },
              ".decoration-double": { "text-decoration-style": "double" },
              ".decoration-dotted": { "text-decoration-style": "dotted" },
              ".decoration-dashed": { "text-decoration-style": "dashed" },
              ".decoration-wavy": { "text-decoration-style": "wavy" },
            });
          },
          textDecorationThickness: B(
            "textDecorationThickness",
            [["decoration", ["text-decoration-thickness"]]],
            { type: ["length", "percentage"] }
          ),
          textUnderlineOffset: B(
            "textUnderlineOffset",
            [["underline-offset", ["text-underline-offset"]]],
            { type: ["length", "percentage", "any"] }
          ),
          fontSmoothing: ({ addUtilities: t }) => {
            t({
              ".antialiased": {
                "-webkit-font-smoothing": "antialiased",
                "-moz-osx-font-smoothing": "grayscale",
              },
              ".subpixel-antialiased": {
                "-webkit-font-smoothing": "auto",
                "-moz-osx-font-smoothing": "auto",
              },
            });
          },
          placeholderColor: ({
            matchUtilities: t,
            theme: e,
            corePlugins: r,
          }) => {
            t(
              {
                placeholder: (i) =>
                  r("placeholderOpacity")
                    ? {
                        "&::placeholder": _e({
                          color: i,
                          property: "color",
                          variable: "--tw-placeholder-opacity",
                        }),
                      }
                    : { "&::placeholder": { color: G(i) } },
              },
              { values: we(e("placeholderColor")), type: ["color", "any"] }
            );
          },
          placeholderOpacity: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                "placeholder-opacity": (r) => ({
                  ["&::placeholder"]: { "--tw-placeholder-opacity": r },
                }),
              },
              { values: e("placeholderOpacity") }
            );
          },
          caretColor: ({ matchUtilities: t, theme: e }) => {
            t(
              { caret: (r) => ({ "caret-color": G(r) }) },
              { values: we(e("caretColor")), type: ["color", "any"] }
            );
          },
          accentColor: ({ matchUtilities: t, theme: e }) => {
            t(
              { accent: (r) => ({ "accent-color": G(r) }) },
              { values: we(e("accentColor")), type: ["color", "any"] }
            );
          },
          opacity: B("opacity", [["opacity", ["opacity"]]]),
          backgroundBlendMode: ({ addUtilities: t }) => {
            t({
              ".bg-blend-normal": { "background-blend-mode": "normal" },
              ".bg-blend-multiply": { "background-blend-mode": "multiply" },
              ".bg-blend-screen": { "background-blend-mode": "screen" },
              ".bg-blend-overlay": { "background-blend-mode": "overlay" },
              ".bg-blend-darken": { "background-blend-mode": "darken" },
              ".bg-blend-lighten": { "background-blend-mode": "lighten" },
              ".bg-blend-color-dodge": {
                "background-blend-mode": "color-dodge",
              },
              ".bg-blend-color-burn": { "background-blend-mode": "color-burn" },
              ".bg-blend-hard-light": { "background-blend-mode": "hard-light" },
              ".bg-blend-soft-light": { "background-blend-mode": "soft-light" },
              ".bg-blend-difference": { "background-blend-mode": "difference" },
              ".bg-blend-exclusion": { "background-blend-mode": "exclusion" },
              ".bg-blend-hue": { "background-blend-mode": "hue" },
              ".bg-blend-saturation": { "background-blend-mode": "saturation" },
              ".bg-blend-color": { "background-blend-mode": "color" },
              ".bg-blend-luminosity": { "background-blend-mode": "luminosity" },
            });
          },
          mixBlendMode: ({ addUtilities: t }) => {
            t({
              ".mix-blend-normal": { "mix-blend-mode": "normal" },
              ".mix-blend-multiply": { "mix-blend-mode": "multiply" },
              ".mix-blend-screen": { "mix-blend-mode": "screen" },
              ".mix-blend-overlay": { "mix-blend-mode": "overlay" },
              ".mix-blend-darken": { "mix-blend-mode": "darken" },
              ".mix-blend-lighten": { "mix-blend-mode": "lighten" },
              ".mix-blend-color-dodge": { "mix-blend-mode": "color-dodge" },
              ".mix-blend-color-burn": { "mix-blend-mode": "color-burn" },
              ".mix-blend-hard-light": { "mix-blend-mode": "hard-light" },
              ".mix-blend-soft-light": { "mix-blend-mode": "soft-light" },
              ".mix-blend-difference": { "mix-blend-mode": "difference" },
              ".mix-blend-exclusion": { "mix-blend-mode": "exclusion" },
              ".mix-blend-hue": { "mix-blend-mode": "hue" },
              ".mix-blend-saturation": { "mix-blend-mode": "saturation" },
              ".mix-blend-color": { "mix-blend-mode": "color" },
              ".mix-blend-luminosity": { "mix-blend-mode": "luminosity" },
              ".mix-blend-plus-darker": { "mix-blend-mode": "plus-darker" },
              ".mix-blend-plus-lighter": { "mix-blend-mode": "plus-lighter" },
            });
          },
          boxShadow: (() => {
            let t = mt("boxShadow"),
              e = [
                "var(--tw-ring-offset-shadow, 0 0 #0000)",
                "var(--tw-ring-shadow, 0 0 #0000)",
                "var(--tw-shadow)",
              ].join(", ");
            return function ({ matchUtilities: r, addDefaults: i, theme: n }) {
              i("box-shadow", {
                "--tw-ring-offset-shadow": "0 0 #0000",
                "--tw-ring-shadow": "0 0 #0000",
                "--tw-shadow": "0 0 #0000",
                "--tw-shadow-colored": "0 0 #0000",
              }),
                r(
                  {
                    shadow: (a) => {
                      a = t(a);
                      let s = Ln(a);
                      for (let o of s)
                        !o.valid || (o.color = "var(--tw-shadow-color)");
                      return {
                        "@defaults box-shadow": {},
                        "--tw-shadow": a === "none" ? "0 0 #0000" : a,
                        "--tw-shadow-colored":
                          a === "none" ? "0 0 #0000" : bp(s),
                        "box-shadow": e,
                      };
                    },
                  },
                  { values: n("boxShadow"), type: ["shadow"] }
                );
            };
          })(),
          boxShadowColor: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                shadow: (r) => ({
                  "--tw-shadow-color": G(r),
                  "--tw-shadow": "var(--tw-shadow-colored)",
                }),
              },
              { values: we(e("boxShadowColor")), type: ["color", "any"] }
            );
          },
          outlineStyle: ({ addUtilities: t }) => {
            t({
              ".outline-none": {
                outline: "2px solid transparent",
                "outline-offset": "2px",
              },
              ".outline": { "outline-style": "solid" },
              ".outline-dashed": { "outline-style": "dashed" },
              ".outline-dotted": { "outline-style": "dotted" },
              ".outline-double": { "outline-style": "double" },
            });
          },
          outlineWidth: B("outlineWidth", [["outline", ["outline-width"]]], {
            type: ["length", "number", "percentage"],
          }),
          outlineOffset: B(
            "outlineOffset",
            [["outline-offset", ["outline-offset"]]],
            {
              type: ["length", "number", "percentage", "any"],
              supportsNegativeValues: !0,
            }
          ),
          outlineColor: ({ matchUtilities: t, theme: e }) => {
            t(
              { outline: (r) => ({ "outline-color": G(r) }) },
              { values: we(e("outlineColor")), type: ["color", "any"] }
            );
          },
          ringWidth: ({
            matchUtilities: t,
            addDefaults: e,
            addUtilities: r,
            theme: i,
            config: n,
          }) => {
            let a = (() => {
              if (he(n(), "respectDefaultRingColorOpacity"))
                return i("ringColor.DEFAULT");
              let s = i("ringOpacity.DEFAULT", "0.5");
              return i("ringColor")?.DEFAULT
                ? et(i("ringColor")?.DEFAULT, s, `rgb(147 197 253 / ${s})`)
                : `rgb(147 197 253 / ${s})`;
            })();
            e("ring-width", {
              "--tw-ring-inset": " ",
              "--tw-ring-offset-width": i("ringOffsetWidth.DEFAULT", "0px"),
              "--tw-ring-offset-color": i("ringOffsetColor.DEFAULT", "#fff"),
              "--tw-ring-color": a,
              "--tw-ring-offset-shadow": "0 0 #0000",
              "--tw-ring-shadow": "0 0 #0000",
              "--tw-shadow": "0 0 #0000",
              "--tw-shadow-colored": "0 0 #0000",
            }),
              t(
                {
                  ring: (s) => ({
                    "@defaults ring-width": {},
                    "--tw-ring-offset-shadow":
                      "var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
                    "--tw-ring-shadow": `var(--tw-ring-inset) 0 0 0 calc(${s} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
                    "box-shadow": [
                      "var(--tw-ring-offset-shadow)",
                      "var(--tw-ring-shadow)",
                      "var(--tw-shadow, 0 0 #0000)",
                    ].join(", "),
                  }),
                },
                { values: i("ringWidth"), type: "length" }
              ),
              r({
                ".ring-inset": {
                  "@defaults ring-width": {},
                  "--tw-ring-inset": "inset",
                },
              });
          },
          ringColor: ({ matchUtilities: t, theme: e, corePlugins: r }) => {
            t(
              {
                ring: (i) =>
                  r("ringOpacity")
                    ? _e({
                        color: i,
                        property: "--tw-ring-color",
                        variable: "--tw-ring-opacity",
                      })
                    : { "--tw-ring-color": G(i) },
              },
              {
                values: Object.fromEntries(
                  Object.entries(we(e("ringColor"))).filter(
                    ([i]) => i !== "DEFAULT"
                  )
                ),
                type: ["color", "any"],
              }
            );
          },
          ringOpacity: (t) => {
            let { config: e } = t;
            return B("ringOpacity", [["ring-opacity", ["--tw-ring-opacity"]]], {
              filterDefault: !he(e(), "respectDefaultRingColorOpacity"),
            })(t);
          },
          ringOffsetWidth: B(
            "ringOffsetWidth",
            [["ring-offset", ["--tw-ring-offset-width"]]],
            { type: "length" }
          ),
          ringOffsetColor: ({ matchUtilities: t, theme: e }) => {
            t(
              { "ring-offset": (r) => ({ "--tw-ring-offset-color": G(r) }) },
              { values: we(e("ringOffsetColor")), type: ["color", "any"] }
            );
          },
          blur: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                blur: (r) => ({
                  "--tw-blur": r.trim() === "" ? " " : `blur(${r})`,
                  "@defaults filter": {},
                  filter: nt,
                }),
              },
              { values: e("blur") }
            );
          },
          brightness: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                brightness: (r) => ({
                  "--tw-brightness": `brightness(${r})`,
                  "@defaults filter": {},
                  filter: nt,
                }),
              },
              { values: e("brightness") }
            );
          },
          contrast: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                contrast: (r) => ({
                  "--tw-contrast": `contrast(${r})`,
                  "@defaults filter": {},
                  filter: nt,
                }),
              },
              { values: e("contrast") }
            );
          },
          dropShadow: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                "drop-shadow": (r) => ({
                  "--tw-drop-shadow": Array.isArray(r)
                    ? r.map((i) => `drop-shadow(${i})`).join(" ")
                    : `drop-shadow(${r})`,
                  "@defaults filter": {},
                  filter: nt,
                }),
              },
              { values: e("dropShadow") }
            );
          },
          grayscale: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                grayscale: (r) => ({
                  "--tw-grayscale": `grayscale(${r})`,
                  "@defaults filter": {},
                  filter: nt,
                }),
              },
              { values: e("grayscale") }
            );
          },
          hueRotate: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                "hue-rotate": (r) => ({
                  "--tw-hue-rotate": `hue-rotate(${r})`,
                  "@defaults filter": {},
                  filter: nt,
                }),
              },
              { values: e("hueRotate"), supportsNegativeValues: !0 }
            );
          },
          invert: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                invert: (r) => ({
                  "--tw-invert": `invert(${r})`,
                  "@defaults filter": {},
                  filter: nt,
                }),
              },
              { values: e("invert") }
            );
          },
          saturate: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                saturate: (r) => ({
                  "--tw-saturate": `saturate(${r})`,
                  "@defaults filter": {},
                  filter: nt,
                }),
              },
              { values: e("saturate") }
            );
          },
          sepia: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                sepia: (r) => ({
                  "--tw-sepia": `sepia(${r})`,
                  "@defaults filter": {},
                  filter: nt,
                }),
              },
              { values: e("sepia") }
            );
          },
          filter: ({ addDefaults: t, addUtilities: e }) => {
            t("filter", {
              "--tw-blur": " ",
              "--tw-brightness": " ",
              "--tw-contrast": " ",
              "--tw-grayscale": " ",
              "--tw-hue-rotate": " ",
              "--tw-invert": " ",
              "--tw-saturate": " ",
              "--tw-sepia": " ",
              "--tw-drop-shadow": " ",
            }),
              e({
                ".filter": { "@defaults filter": {}, filter: nt },
                ".filter-none": { filter: "none" },
              });
          },
          backdropBlur: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                "backdrop-blur": (r) => ({
                  "--tw-backdrop-blur": r.trim() === "" ? " " : `blur(${r})`,
                  "@defaults backdrop-filter": {},
                  "-webkit-backdrop-filter": de,
                  "backdrop-filter": de,
                }),
              },
              { values: e("backdropBlur") }
            );
          },
          backdropBrightness: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                "backdrop-brightness": (r) => ({
                  "--tw-backdrop-brightness": `brightness(${r})`,
                  "@defaults backdrop-filter": {},
                  "-webkit-backdrop-filter": de,
                  "backdrop-filter": de,
                }),
              },
              { values: e("backdropBrightness") }
            );
          },
          backdropContrast: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                "backdrop-contrast": (r) => ({
                  "--tw-backdrop-contrast": `contrast(${r})`,
                  "@defaults backdrop-filter": {},
                  "-webkit-backdrop-filter": de,
                  "backdrop-filter": de,
                }),
              },
              { values: e("backdropContrast") }
            );
          },
          backdropGrayscale: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                "backdrop-grayscale": (r) => ({
                  "--tw-backdrop-grayscale": `grayscale(${r})`,
                  "@defaults backdrop-filter": {},
                  "-webkit-backdrop-filter": de,
                  "backdrop-filter": de,
                }),
              },
              { values: e("backdropGrayscale") }
            );
          },
          backdropHueRotate: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                "backdrop-hue-rotate": (r) => ({
                  "--tw-backdrop-hue-rotate": `hue-rotate(${r})`,
                  "@defaults backdrop-filter": {},
                  "-webkit-backdrop-filter": de,
                  "backdrop-filter": de,
                }),
              },
              { values: e("backdropHueRotate"), supportsNegativeValues: !0 }
            );
          },
          backdropInvert: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                "backdrop-invert": (r) => ({
                  "--tw-backdrop-invert": `invert(${r})`,
                  "@defaults backdrop-filter": {},
                  "-webkit-backdrop-filter": de,
                  "backdrop-filter": de,
                }),
              },
              { values: e("backdropInvert") }
            );
          },
          backdropOpacity: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                "backdrop-opacity": (r) => ({
                  "--tw-backdrop-opacity": `opacity(${r})`,
                  "@defaults backdrop-filter": {},
                  "-webkit-backdrop-filter": de,
                  "backdrop-filter": de,
                }),
              },
              { values: e("backdropOpacity") }
            );
          },
          backdropSaturate: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                "backdrop-saturate": (r) => ({
                  "--tw-backdrop-saturate": `saturate(${r})`,
                  "@defaults backdrop-filter": {},
                  "-webkit-backdrop-filter": de,
                  "backdrop-filter": de,
                }),
              },
              { values: e("backdropSaturate") }
            );
          },
          backdropSepia: ({ matchUtilities: t, theme: e }) => {
            t(
              {
                "backdrop-sepia": (r) => ({
                  "--tw-backdrop-sepia": `sepia(${r})`,
                  "@defaults backdrop-filter": {},
                  "-webkit-backdrop-filter": de,
                  "backdrop-filter": de,
                }),
              },
              { values: e("backdropSepia") }
            );
          },
          backdropFilter: ({ addDefaults: t, addUtilities: e }) => {
            t("backdrop-filter", {
              "--tw-backdrop-blur": " ",
              "--tw-backdrop-brightness": " ",
              "--tw-backdrop-contrast": " ",
              "--tw-backdrop-grayscale": " ",
              "--tw-backdrop-hue-rotate": " ",
              "--tw-backdrop-invert": " ",
              "--tw-backdrop-opacity": " ",
              "--tw-backdrop-saturate": " ",
              "--tw-backdrop-sepia": " ",
            }),
              e({
                ".backdrop-filter": {
                  "@defaults backdrop-filter": {},
                  "-webkit-backdrop-filter": de,
                  "backdrop-filter": de,
                },
                ".backdrop-filter-none": {
                  "-webkit-backdrop-filter": "none",
                  "backdrop-filter": "none",
                },
              });
          },
          transitionProperty: ({ matchUtilities: t, theme: e }) => {
            let r = e("transitionTimingFunction.DEFAULT"),
              i = e("transitionDuration.DEFAULT");
            t(
              {
                transition: (n) => ({
                  "transition-property": n,
                  ...(n === "none"
                    ? {}
                    : {
                        "transition-timing-function": r,
                        "transition-duration": i,
                      }),
                }),
              },
              { values: e("transitionProperty") }
            );
          },
          transitionDelay: B("transitionDelay", [
            ["delay", ["transitionDelay"]],
          ]),
          transitionDuration: B(
            "transitionDuration",
            [["duration", ["transitionDuration"]]],
            { filterDefault: !0 }
          ),
          transitionTimingFunction: B(
            "transitionTimingFunction",
            [["ease", ["transitionTimingFunction"]]],
            { filterDefault: !0 }
          ),
          willChange: B("willChange", [["will-change", ["will-change"]]]),
          contain: ({ addDefaults: t, addUtilities: e }) => {
            let r =
              "var(--tw-contain-size) var(--tw-contain-layout) var(--tw-contain-paint) var(--tw-contain-style)";
            t("contain", {
              "--tw-contain-size": " ",
              "--tw-contain-layout": " ",
              "--tw-contain-paint": " ",
              "--tw-contain-style": " ",
            }),
              e({
                ".contain-none": { contain: "none" },
                ".contain-content": { contain: "content" },
                ".contain-strict": { contain: "strict" },
                ".contain-size": {
                  "@defaults contain": {},
                  "--tw-contain-size": "size",
                  contain: r,
                },
                ".contain-inline-size": {
                  "@defaults contain": {},
                  "--tw-contain-size": "inline-size",
                  contain: r,
                },
                ".contain-layout": {
                  "@defaults contain": {},
                  "--tw-contain-layout": "layout",
                  contain: r,
                },
                ".contain-paint": {
                  "@defaults contain": {},
                  "--tw-contain-paint": "paint",
                  contain: r,
                },
                ".contain-style": {
                  "@defaults contain": {},
                  "--tw-contain-style": "style",
                  contain: r,
                },
              });
          },
          content: B("content", [
            ["content", ["--tw-content", ["content", "var(--tw-content)"]]],
          ]),
          forcedColorAdjust: ({ addUtilities: t }) => {
            t({
              ".forced-color-adjust-auto": { "forced-color-adjust": "auto" },
              ".forced-color-adjust-none": { "forced-color-adjust": "none" },
            });
          },
        });
    });
  function jE(t) {
    if (t === void 0) return !1;
    if (t === "true" || t === "1") return !0;
    if (t === "false" || t === "0") return !1;
    if (t === "*") return !0;
    let e = t.split(",").map((r) => r.split(":")[0]);
    return e.includes("-tailwindcss") ? !1 : !!e.includes("tailwindcss");
  }
  var Xe,
    sg,
    ag,
    Rs,
    Il,
    gt,
    $i,
    Mt = A(() => {
      u();
      (Xe =
        typeof g != "undefined"
          ? { NODE_ENV: "production", DEBUG: jE(g.env.DEBUG) }
          : { NODE_ENV: "production", DEBUG: !1 }),
        (sg = new Map()),
        (ag = new Map()),
        (Rs = new Map()),
        (Il = new Map()),
        (gt = new String("*")),
        ($i = Symbol("__NONE__"));
    });
  function xr(t) {
    let e = [],
      r = !1;
    for (let i = 0; i < t.length; i++) {
      let n = t[i];
      if (n === ":" && !r && e.length === 0) return !1;
      if (
        (UE.has(n) && t[i - 1] !== "\\" && (r = !r), !r && t[i - 1] !== "\\")
      ) {
        if (og.has(n)) e.push(n);
        else if (lg.has(n)) {
          let a = lg.get(n);
          if (e.length <= 0 || e.pop() !== a) return !1;
        }
      }
    }
    return !(e.length > 0);
  }
  var og,
    lg,
    UE,
    ql = A(() => {
      u();
      (og = new Map([
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
      ])),
        (lg = new Map(Array.from(og.entries()).map(([t, e]) => [e, t]))),
        (UE = new Set(['"', "'", "`"]));
    });
  function kr(t) {
    let [e] = ug(t);
    return (
      e.forEach(([r, i]) => r.removeChild(i)),
      t.nodes.push(...e.map(([, r]) => r)),
      t
    );
  }
  function ug(t) {
    let e = [],
      r = null;
    for (let i of t.nodes)
      if (i.type === "combinator")
        (e = e.filter(([, n]) => Rl(n).includes("jumpable"))), (r = null);
      else if (i.type === "pseudo") {
        VE(i)
          ? ((r = i), e.push([t, i, null]))
          : r && WE(i, r)
          ? e.push([t, i, r])
          : (r = null);
        for (let n of i.nodes ?? []) {
          let [a, s] = ug(n);
          (r = s || r), e.push(...a);
        }
      }
    return [e, r];
  }
  function fg(t) {
    return t.value.startsWith("::") || Dl[t.value] !== void 0;
  }
  function VE(t) {
    return fg(t) && Rl(t).includes("terminal");
  }
  function WE(t, e) {
    return t.type !== "pseudo" || fg(t) ? !1 : Rl(e).includes("actionable");
  }
  function Rl(t) {
    return Dl[t.value] ?? Dl.__default__;
  }
  var Dl,
    Bs = A(() => {
      u();
      Dl = {
        "::after": ["terminal", "jumpable"],
        "::backdrop": ["terminal", "jumpable"],
        "::before": ["terminal", "jumpable"],
        "::cue": ["terminal"],
        "::cue-region": ["terminal"],
        "::first-letter": ["terminal", "jumpable"],
        "::first-line": ["terminal", "jumpable"],
        "::grammar-error": ["terminal"],
        "::marker": ["terminal", "jumpable"],
        "::part": ["terminal", "actionable"],
        "::placeholder": ["terminal", "jumpable"],
        "::selection": ["terminal", "jumpable"],
        "::slotted": ["terminal"],
        "::spelling-error": ["terminal"],
        "::target-text": ["terminal"],
        "::file-selector-button": ["terminal", "actionable"],
        "::deep": ["actionable"],
        "::v-deep": ["actionable"],
        "::ng-deep": ["actionable"],
        ":after": ["terminal", "jumpable"],
        ":before": ["terminal", "jumpable"],
        ":first-letter": ["terminal", "jumpable"],
        ":first-line": ["terminal", "jumpable"],
        ":where": [],
        ":is": [],
        ":has": [],
        __default__: ["terminal", "actionable"],
      };
    });
  function Sr(t, { context: e, candidate: r }) {
    let i = e?.tailwindConfig.prefix ?? "",
      n = t.map((s) => {
        let o = (0, st.default)().astSync(s.format);
        return { ...s, ast: s.respectPrefix ? vr(i, o) : o };
      }),
      a = st.default.root({
        nodes: [
          st.default.selector({
            nodes: [st.default.className({ value: Ce(r) })],
          }),
        ],
      });
    for (let { ast: s } of n)
      ([a, s] = HE(a, s)),
        s.walkNesting((o) => o.replaceWith(...a.nodes[0].nodes)),
        (a = s);
    return a;
  }
  function pg(t) {
    let e = [];
    for (; t.prev() && t.prev().type !== "combinator"; ) t = t.prev();
    for (; t && t.type !== "combinator"; ) e.push(t), (t = t.next());
    return e;
  }
  function GE(t) {
    return (
      t.sort((e, r) =>
        e.type === "tag" && r.type === "class"
          ? -1
          : e.type === "class" && r.type === "tag"
          ? 1
          : e.type === "class" &&
            r.type === "pseudo" &&
            r.value.startsWith("::")
          ? -1
          : e.type === "pseudo" &&
            e.value.startsWith("::") &&
            r.type === "class"
          ? 1
          : t.index(e) - t.index(r)
      ),
      t
    );
  }
  function Ml(t, e) {
    let r = !1;
    t.walk((i) => {
      if (i.type === "class" && i.value === e) return (r = !0), !1;
    }),
      r || t.remove();
  }
  function Ms(t, e, { context: r, candidate: i, base: n }) {
    let a = r?.tailwindConfig?.separator ?? ":";
    n = n ?? ye(i, a).pop();
    let s = (0, st.default)().astSync(t);
    if (
      (s.walkClasses((f) => {
        f.raws &&
          f.value.includes(n) &&
          (f.raws.value = Ce((0, cg.default)(f.raws.value)));
      }),
      s.each((f) => Ml(f, n)),
      s.length === 0)
    )
      return null;
    let o = Array.isArray(e) ? Sr(e, { context: r, candidate: i }) : e;
    if (o === null) return s.toString();
    let l = st.default.comment({ value: "/*__simple__*/" }),
      c = st.default.comment({ value: "/*__simple__*/" });
    return (
      s.walkClasses((f) => {
        if (f.value !== n) return;
        let p = f.parent,
          h = o.nodes[0].nodes;
        if (p.nodes.length === 1) {
          f.replaceWith(...h);
          return;
        }
        let m = pg(f);
        p.insertBefore(m[0], l), p.insertAfter(m[m.length - 1], c);
        for (let S of h) p.insertBefore(m[0], S.clone());
        f.remove(), (m = pg(l));
        let b = p.index(l);
        p.nodes.splice(
          b,
          m.length,
          ...GE(st.default.selector({ nodes: m })).nodes
        ),
          l.remove(),
          c.remove();
      }),
      s.walkPseudos((f) => {
        f.value === Bl && f.replaceWith(f.nodes);
      }),
      s.each((f) => kr(f)),
      s.toString()
    );
  }
  function HE(t, e) {
    let r = [];
    return (
      t.walkPseudos((i) => {
        i.value === Bl && r.push({ pseudo: i, value: i.nodes[0].toString() });
      }),
      e.walkPseudos((i) => {
        if (i.value !== Bl) return;
        let n = i.nodes[0].toString(),
          a = r.find((c) => c.value === n);
        if (!a) return;
        let s = [],
          o = i.next();
        for (; o && o.type !== "combinator"; ) s.push(o), (o = o.next());
        let l = o;
        a.pseudo.parent.insertAfter(
          a.pseudo,
          st.default.selector({ nodes: s.map((c) => c.clone()) })
        ),
          i.remove(),
          s.forEach((c) => c.remove()),
          l && l.type === "combinator" && l.remove();
      }),
      [t, e]
    );
  }
  var st,
    cg,
    Bl,
    Ll = A(() => {
      u();
      (st = ce(it())), (cg = ce(hs()));
      br();
      Es();
      Bs();
      Ht();
      Bl = ":merge";
    });
  function Ls(t, e) {
    let r = (0, Fl.default)().astSync(t);
    return (
      r.each((i) => {
        (i.nodes[0].type === "pseudo" &&
          i.nodes[0].value === ":is" &&
          i.nodes.every((a) => a.type !== "combinator")) ||
          (i.nodes = [Fl.default.pseudo({ value: ":is", nodes: [i.clone()] })]),
          kr(i);
      }),
      `${e} ${r.toString()}`
    );
  }
  var Fl,
    Nl = A(() => {
      u();
      Fl = ce(it());
      Bs();
    });
  function zl(t) {
    return YE.transformSync(t);
  }
  function* QE(t) {
    let e = 1 / 0;
    for (; e >= 0; ) {
      let r,
        i = !1;
      if (e === 1 / 0 && t.endsWith("]")) {
        let s = t.indexOf("[");
        t[s - 1] === "-"
          ? (r = s - 1)
          : t[s - 1] === "/"
          ? ((r = s - 1), (i = !0))
          : (r = -1);
      } else
        e === 1 / 0 && t.includes("/")
          ? ((r = t.lastIndexOf("/")), (i = !0))
          : (r = t.lastIndexOf("-", e));
      if (r < 0) break;
      let n = t.slice(0, r),
        a = t.slice(i ? r : r + 1);
      (e = r - 1), !(n === "" || a === "/") && (yield [n, a]);
    }
  }
  function JE(t, e) {
    if (t.length === 0 || e.tailwindConfig.prefix === "") return t;
    for (let r of t) {
      let [i] = r;
      if (i.options.respectPrefix) {
        let n = J.root({ nodes: [r[1].clone()] }),
          a = r[1].raws.tailwind.classCandidate;
        n.walkRules((s) => {
          let o = a.startsWith("-");
          s.selector = vr(e.tailwindConfig.prefix, s.selector, o);
        }),
          (r[1] = n.nodes[0]);
      }
    }
    return t;
  }
  function KE(t, e) {
    if (t.length === 0) return t;
    let r = [];
    function i(n) {
      return (
        n.parent && n.parent.type === "atrule" && n.parent.name === "keyframes"
      );
    }
    for (let [n, a] of t) {
      let s = J.root({ nodes: [a.clone()] });
      s.walkRules((o) => {
        if (i(o)) return;
        let l = (0, Fs.default)().astSync(o.selector);
        l.each((c) => Ml(c, e)),
          qp(l, (c) => (c === e ? `!${c}` : c)),
          (o.selector = l.toString()),
          o.walkDecls((c) => (c.important = !0));
      }),
        r.push([{ ...n, important: !0 }, s.nodes[0]]);
    }
    return r;
  }
  function XE(t, e, r) {
    if (e.length === 0) return e;
    let i = { modifier: null, value: $i };
    {
      let [n, ...a] = ye(t, "/");
      if (
        (a.length > 1 &&
          ((n = n + "/" + a.slice(0, -1).join("/")), (a = a.slice(-1))),
        a.length &&
          !r.variantMap.has(t) &&
          ((t = n),
          (i.modifier = a[0]),
          !he(r.tailwindConfig, "generalizedModifiers")))
      )
        return [];
    }
    if (t.endsWith("]") && !t.startsWith("[")) {
      let n = /(.)(-?)\[(.*)\]/g.exec(t);
      if (n) {
        let [, a, s, o] = n;
        if (a === "@" && s === "-") return [];
        if (a !== "@" && s === "") return [];
        (t = t.replace(`${s}[${o}]`, "")), (i.value = o);
      }
    }
    if (Ul(t) && !r.variantMap.has(t)) {
      let n = r.offsets.recordVariant(t),
        a = W(t.slice(1, -1)),
        s = ye(a, ",");
      if (s.length > 1) return [];
      if (!s.every(js)) return [];
      let o = s.map((l, c) => [
        r.offsets.applyParallelOffset(n, c),
        ji(l.trim()),
      ]);
      r.variantMap.set(t, o);
    }
    if (r.variantMap.has(t)) {
      let n = Ul(t),
        a = r.variantOptions.get(t)?.[Bt] ?? {},
        s = r.variantMap.get(t).slice(),
        o = [],
        l = (() => !(n || a.respectPrefix === !1))();
      for (let [c, f] of e) {
        if (c.layer === "user") continue;
        let p = J.root({ nodes: [f.clone()] });
        for (let [h, m, b] of s) {
          let w = function () {
              S.raws.neededBackup ||
                ((S.raws.neededBackup = !0),
                S.walkRules((E) => (E.raws.originalSelector = E.selector)));
            },
            _ = function (E) {
              return (
                w(),
                S.each((F) => {
                  F.type === "rule" &&
                    (F.selectors = F.selectors.map((z) =>
                      E({
                        get className() {
                          return zl(z);
                        },
                        selector: z,
                      })
                    ));
                }),
                S
              );
            },
            S = (b ?? p).clone(),
            v = [],
            T = m({
              get container() {
                return w(), S;
              },
              separator: r.tailwindConfig.separator,
              modifySelectors: _,
              wrap(E) {
                let F = S.nodes;
                S.removeAll(), E.append(F), S.append(E);
              },
              format(E) {
                v.push({ format: E, respectPrefix: l });
              },
              args: i,
            });
          if (Array.isArray(T)) {
            for (let [E, F] of T.entries())
              s.push([r.offsets.applyParallelOffset(h, E), F, S.clone()]);
            continue;
          }
          if (
            (typeof T == "string" && v.push({ format: T, respectPrefix: l }),
            T === null)
          )
            continue;
          S.raws.neededBackup &&
            (delete S.raws.neededBackup,
            S.walkRules((E) => {
              let F = E.raws.originalSelector;
              if (!F || (delete E.raws.originalSelector, F === E.selector))
                return;
              let z = E.selector,
                N = (0, Fs.default)((fe) => {
                  fe.walkClasses((Se) => {
                    Se.value = `${t}${r.tailwindConfig.separator}${Se.value}`;
                  });
                }).processSync(F);
              v.push({ format: z.replace(N, "&"), respectPrefix: l }),
                (E.selector = F);
            })),
            (S.nodes[0].raws.tailwind = {
              ...S.nodes[0].raws.tailwind,
              parentLayer: c.layer,
            });
          let O = [
            {
              ...c,
              sort: r.offsets.applyVariantOffset(
                c.sort,
                h,
                Object.assign(i, r.variantOptions.get(t))
              ),
              collectedFormats: (c.collectedFormats ?? []).concat(v),
            },
            S.nodes[0],
          ];
          o.push(O);
        }
      }
      return o;
    }
    return [];
  }
  function $l(t, e, r = {}) {
    return !be(t) && !Array.isArray(t)
      ? [[t], r]
      : Array.isArray(t)
      ? $l(t[0], e, t[1])
      : (e.has(t) || e.set(t, wr(t)), [e.get(t), r]);
  }
  function eA(t) {
    return ZE.test(t);
  }
  function tA(t) {
    if (!t.includes("://")) return !1;
    try {
      let e = new URL(t);
      return e.scheme !== "" && e.host !== "";
    } catch (e) {
      return !1;
    }
  }
  function dg(t) {
    let e = !0;
    return (
      t.walkDecls((r) => {
        if (!hg(r.prop, r.value)) return (e = !1), !1;
      }),
      e
    );
  }
  function hg(t, e) {
    if (tA(`${t}:${e}`)) return !1;
    try {
      return J.parse(`a{${t}:${e}}`).toResult(), !0;
    } catch (r) {
      return !1;
    }
  }
  function rA(t, e) {
    let [, r, i] = t.match(/^\[([a-zA-Z0-9-_]+):(\S+)\]$/) ?? [];
    if (i === void 0 || !eA(r) || !xr(i)) return null;
    let n = W(i, { property: r });
    return hg(r, n)
      ? [
          [
            {
              sort: e.offsets.arbitraryProperty(t),
              layer: "utilities",
              options: { respectImportant: !0 },
            },
            () => ({ [Al(t)]: { [r]: n } }),
          ],
        ]
      : null;
  }
  function* iA(t, e) {
    e.candidateRuleMap.has(t) && (yield [e.candidateRuleMap.get(t), "DEFAULT"]),
      yield* (function* (o) {
        o !== null && (yield [o, "DEFAULT"]);
      })(rA(t, e));
    let r = t,
      i = !1,
      n = e.tailwindConfig.prefix,
      a = n.length,
      s = r.startsWith(n) || r.startsWith(`-${n}`);
    r[a] === "-" && s && ((i = !0), (r = n + r.slice(a + 1))),
      i &&
        e.candidateRuleMap.has(r) &&
        (yield [e.candidateRuleMap.get(r), "-DEFAULT"]);
    for (let [o, l] of QE(r))
      e.candidateRuleMap.has(o) &&
        (yield [e.candidateRuleMap.get(o), i ? `-${l}` : l]);
  }
  function nA(t, e) {
    return t === gt ? [gt] : ye(t, e);
  }
  function* sA(t, e) {
    for (let r of t)
      (r[1].raws.tailwind = {
        ...r[1].raws.tailwind,
        classCandidate: e,
        preserveSource: r[0].options?.preserveSource ?? !1,
      }),
        yield r;
  }
  function* jl(t, e) {
    let r = e.tailwindConfig.separator,
      [i, ...n] = nA(t, r).reverse(),
      a = !1;
    i.startsWith("!") && ((a = !0), (i = i.slice(1)));
    for (let s of iA(i, e)) {
      let o = [],
        l = new Map(),
        [c, f] = s,
        p = c.length === 1;
      for (let [h, m] of c) {
        let b = [];
        if (typeof m == "function")
          for (let S of [].concat(m(f, { isOnlyPlugin: p }))) {
            let [v, w] = $l(S, e.postCssNodeCache);
            for (let _ of v)
              b.push([{ ...h, options: { ...h.options, ...w } }, _]);
          }
        else if (f === "DEFAULT" || f === "-DEFAULT") {
          let S = m,
            [v, w] = $l(S, e.postCssNodeCache);
          for (let _ of v)
            b.push([{ ...h, options: { ...h.options, ...w } }, _]);
        }
        if (b.length > 0) {
          let S = Array.from(
            Ha(h.options?.types ?? [], f, h.options ?? {}, e.tailwindConfig)
          ).map(([v, w]) => w);
          S.length > 0 && l.set(b, S), o.push(b);
        }
      }
      if (Ul(f)) {
        if (o.length > 1) {
          let b = function (v) {
              return v.length === 1
                ? v[0]
                : v.find((w) => {
                    let _ = l.get(w);
                    return w.some(([{ options: T }, O]) =>
                      dg(O)
                        ? T.types.some(
                            ({ type: E, preferOnConflict: F }) =>
                              _.includes(E) && F
                          )
                        : !1
                    );
                  });
            },
            [h, m] = o.reduce(
              (v, w) => (
                w.some(([{ options: T }]) =>
                  T.types.some(({ type: O }) => O === "any")
                )
                  ? v[0].push(w)
                  : v[1].push(w),
                v
              ),
              [[], []]
            ),
            S = b(m) ?? b(h);
          if (S) o = [S];
          else {
            let v = o.map((_) => new Set([...(l.get(_) ?? [])]));
            for (let _ of v)
              for (let T of _) {
                let O = !1;
                for (let E of v) _ !== E && E.has(T) && (E.delete(T), (O = !0));
                O && _.delete(T);
              }
            let w = [];
            for (let [_, T] of v.entries())
              for (let O of T) {
                let E = o[_].map(([, F]) => F)
                  .flat()
                  .map((F) =>
                    F.toString()
                      .split(
                        `
`
                      )
                      .slice(1, -1)
                      .map((z) => z.trim())
                      .map((z) => `      ${z}`).join(`
`)
                  ).join(`

`);
                w.push(
                  `  Use \`${t.replace("[", `[${O}:`)}\` for \`${E.trim()}\``
                );
                break;
              }
            V.warn([
              `The class \`${t}\` is ambiguous and matches multiple utilities.`,
              ...w,
              `If this is content and not a class, replace it with \`${t
                .replace("[", "&lsqb;")
                .replace("]", "&rsqb;")}\` to silence this warning.`,
            ]);
            continue;
          }
        }
        o = o.map((h) => h.filter((m) => dg(m[1])));
      }
      (o = o.flat()),
        (o = Array.from(sA(o, i))),
        (o = JE(o, e)),
        a && (o = KE(o, i));
      for (let h of n) o = XE(h, o, e);
      for (let h of o)
        (h[1].raws.tailwind = { ...h[1].raws.tailwind, candidate: t }),
          (h = aA(h, { context: e, candidate: t })),
          h !== null && (yield h);
    }
  }
  function aA(t, { context: e, candidate: r }) {
    if (!t[0].collectedFormats) return t;
    let i = !0,
      n;
    try {
      n = Sr(t[0].collectedFormats, { context: e, candidate: r });
    } catch {
      return null;
    }
    let a = J.root({ nodes: [t[1].clone()] });
    return (
      a.walkRules((s) => {
        if (!Ns(s))
          try {
            let o = Ms(s.selector, n, { candidate: r, context: e });
            if (o === null) {
              s.remove();
              return;
            }
            s.selector = o;
          } catch {
            return (i = !1), !1;
          }
      }),
      !i || a.nodes.length === 0 ? null : ((t[1] = a.nodes[0]), t)
    );
  }
  function Ns(t) {
    return (
      t.parent && t.parent.type === "atrule" && t.parent.name === "keyframes"
    );
  }
  function oA(t) {
    if (t === !0)
      return (e) => {
        Ns(e) ||
          e.walkDecls((r) => {
            r.parent.type === "rule" && !Ns(r.parent) && (r.important = !0);
          });
      };
    if (typeof t == "string")
      return (e) => {
        Ns(e) || (e.selectors = e.selectors.map((r) => Ls(r, t)));
      };
  }
  function zs(t, e, r = !1) {
    let i = [],
      n = oA(e.tailwindConfig.important);
    for (let a of t) {
      if (e.notClassCache.has(a)) continue;
      if (e.candidateRuleCache.has(a)) {
        i = i.concat(Array.from(e.candidateRuleCache.get(a)));
        continue;
      }
      let s = Array.from(jl(a, e));
      if (s.length === 0) {
        e.notClassCache.add(a);
        continue;
      }
      e.classCache.set(a, s);
      let o = e.candidateRuleCache.get(a) ?? new Set();
      e.candidateRuleCache.set(a, o);
      for (let l of s) {
        let [{ sort: c, options: f }, p] = l;
        if (f.respectImportant && n) {
          let m = J.root({ nodes: [p.clone()] });
          m.walkRules(n), (p = m.nodes[0]);
        }
        let h = [c, r ? p.clone() : p];
        o.add(h), e.ruleCache.add(h), i.push(h);
      }
    }
    return i;
  }
  function Ul(t) {
    return t.startsWith("[") && t.endsWith("]");
  }
  var Fs,
    YE,
    ZE,
    $s = A(() => {
      u();
      qt();
      Fs = ce(it());
      El();
      ar();
      Es();
      ti();
      Qe();
      Mt();
      Ll();
      Cl();
      ei();
      zi();
      ql();
      Ht();
      ct();
      Nl();
      YE = (0, Fs.default)(
        (t) => t.first.filter(({ type: e }) => e === "class").pop().value
      );
      ZE = /^[a-z_-]/;
    });
  var mg,
    gg = A(() => {
      u();
      mg = {};
    });
  function lA(t) {
    try {
      return mg.createHash("md5").update(t, "utf-8").digest("binary");
    } catch (e) {
      return "";
    }
  }
  function yg(t, e) {
    let r = e.toString();
    if (!r.includes("@tailwind")) return !1;
    let i = Il.get(t),
      n = lA(r),
      a = i !== n;
    return Il.set(t, n), a;
  }
  var wg = A(() => {
    u();
    gg();
    Mt();
  });
  function Us(t) {
    return (t > 0n) - (t < 0n);
  }
  var vg = A(() => {
    u();
  });
  function bg(t, e) {
    let r = 0n,
      i = 0n;
    for (let [n, a] of e) t & n && ((r = r | n), (i = i | a));
    return (t & ~r) | i;
  }
  var xg = A(() => {
    u();
  });
  function kg(t) {
    let e = null;
    for (let r of t) (e = e ?? r), (e = e > r ? e : r);
    return e;
  }
  function uA(t, e) {
    let r = t.length,
      i = e.length,
      n = r < i ? r : i;
    for (let a = 0; a < n; a++) {
      let s = t.charCodeAt(a) - e.charCodeAt(a);
      if (s !== 0) return s;
    }
    return r - i;
  }
  var Vl,
    Sg = A(() => {
      u();
      vg();
      xg();
      Vl = class {
        constructor() {
          (this.offsets = {
            defaults: 0n,
            base: 0n,
            components: 0n,
            utilities: 0n,
            variants: 0n,
            user: 0n,
          }),
            (this.layerPositions = {
              defaults: 0n,
              base: 1n,
              components: 2n,
              utilities: 3n,
              user: 4n,
              variants: 5n,
            }),
            (this.reservedVariantBits = 0n),
            (this.variantOffsets = new Map());
        }
        create(e) {
          return {
            layer: e,
            parentLayer: e,
            arbitrary: 0n,
            variants: 0n,
            parallelIndex: 0n,
            index: this.offsets[e]++,
            propertyOffset: 0n,
            property: "",
            options: [],
          };
        }
        arbitraryProperty(e) {
          return { ...this.create("utilities"), arbitrary: 1n, property: e };
        }
        forVariant(e, r = 0) {
          let i = this.variantOffsets.get(e);
          if (i === void 0)
            throw new Error(`Cannot find offset for unknown variant ${e}`);
          return { ...this.create("variants"), variants: i << BigInt(r) };
        }
        applyVariantOffset(e, r, i) {
          return (
            (i.variant = r.variants),
            {
              ...e,
              layer: "variants",
              parentLayer: e.layer === "variants" ? e.parentLayer : e.layer,
              variants: e.variants | r.variants,
              options: i.sort ? [].concat(i, e.options) : e.options,
              parallelIndex: kg([e.parallelIndex, r.parallelIndex]),
            }
          );
        }
        applyParallelOffset(e, r) {
          return { ...e, parallelIndex: BigInt(r) };
        }
        recordVariants(e, r) {
          for (let i of e) this.recordVariant(i, r(i));
        }
        recordVariant(e, r = 1) {
          return (
            this.variantOffsets.set(e, 1n << this.reservedVariantBits),
            (this.reservedVariantBits += BigInt(r)),
            { ...this.create("variants"), variants: this.variantOffsets.get(e) }
          );
        }
        compare(e, r) {
          if (e.layer !== r.layer)
            return this.layerPositions[e.layer] - this.layerPositions[r.layer];
          if (e.parentLayer !== r.parentLayer)
            return (
              this.layerPositions[e.parentLayer] -
              this.layerPositions[r.parentLayer]
            );
          for (let i of e.options)
            for (let n of r.options) {
              if (i.id !== n.id || !i.sort || !n.sort) continue;
              let a = kg([i.variant, n.variant]) ?? 0n,
                s = ~(a | (a - 1n)),
                o = e.variants & s,
                l = r.variants & s;
              if (o !== l) continue;
              let c = i.sort(
                { value: i.value, modifier: i.modifier },
                { value: n.value, modifier: n.modifier }
              );
              if (c !== 0) return c;
            }
          return e.variants !== r.variants
            ? e.variants - r.variants
            : e.parallelIndex !== r.parallelIndex
            ? e.parallelIndex - r.parallelIndex
            : e.arbitrary !== r.arbitrary
            ? e.arbitrary - r.arbitrary
            : e.propertyOffset !== r.propertyOffset
            ? e.propertyOffset - r.propertyOffset
            : e.index - r.index;
        }
        recalculateVariantOffsets() {
          let e = Array.from(this.variantOffsets.entries())
              .filter(([n]) => n.startsWith("["))
              .sort(([n], [a]) => uA(n, a)),
            r = e.map(([, n]) => n).sort((n, a) => Us(n - a));
          return e.map(([, n], a) => [n, r[a]]).filter(([n, a]) => n !== a);
        }
        remapArbitraryVariantOffsets(e) {
          let r = this.recalculateVariantOffsets();
          return r.length === 0
            ? e
            : e.map((i) => {
                let [n, a] = i;
                return (n = { ...n, variants: bg(n.variants, r) }), [n, a];
              });
        }
        sortArbitraryProperties(e) {
          let r = new Set();
          for (let [s] of e) s.arbitrary === 1n && r.add(s.property);
          if (r.size === 0) return e;
          let i = Array.from(r).sort(),
            n = new Map(),
            a = 1n;
          for (let s of i) n.set(s, a++);
          return e.map((s) => {
            let [o, l] = s;
            return (
              (o = { ...o, propertyOffset: n.get(o.property) ?? 0n }), [o, l]
            );
          });
        }
        sort(e) {
          return (
            (e = this.remapArbitraryVariantOffsets(e)),
            (e = this.sortArbitraryProperties(e)),
            e.sort(([r], [i]) => Us(this.compare(r, i)))
          );
        }
      };
    });
  function Yl(t, e) {
    let r = t.tailwindConfig.prefix;
    return typeof r == "function" ? r(e) : r + e;
  }
  function Tg({ type: t = "any", ...e }) {
    let r = [].concat(t);
    return {
      ...e,
      types: r.map((i) =>
        Array.isArray(i)
          ? { type: i[0], ...i[1] }
          : { type: i, preferOnConflict: !1 }
      ),
    };
  }
  function fA(t) {
    let e = [],
      r = "",
      i = 0;
    for (let n = 0; n < t.length; n++) {
      let a = t[n];
      if (a === "\\") r += "\\" + t[++n];
      else if (a === "{") ++i, e.push(r.trim()), (r = "");
      else if (a === "}") {
        if (--i < 0) throw new Error("Your { and } are unbalanced.");
        e.push(r.trim()), (r = "");
      } else r += a;
    }
    return r.length > 0 && e.push(r.trim()), (e = e.filter((n) => n !== "")), e;
  }
  function cA(t, e, { before: r = [] } = {}) {
    if (((r = [].concat(r)), r.length <= 0)) {
      t.push(e);
      return;
    }
    let i = t.length - 1;
    for (let n of r) {
      let a = t.indexOf(n);
      a !== -1 && (i = Math.min(i, a));
    }
    t.splice(i, 0, e);
  }
  function Og(t) {
    return Array.isArray(t)
      ? t.flatMap((e) => (!Array.isArray(e) && !be(e) ? e : wr(e)))
      : Og([t]);
  }
  function pA(t, e) {
    return (0, Wl.default)((i) => {
      let n = [];
      return (
        e && e(i),
        i.walkClasses((a) => {
          n.push(a.value);
        }),
        n
      );
    }).transformSync(t);
  }
  function dA(t) {
    t.walkPseudos((e) => {
      e.value === ":not" && e.remove();
    });
  }
  function hA(t, e = { containsNonOnDemandable: !1 }, r = 0) {
    let i = [],
      n = [];
    t.type === "rule"
      ? n.push(...t.selectors)
      : t.type === "atrule" && t.walkRules((a) => n.push(...a.selectors));
    for (let a of n) {
      let s = pA(a, dA);
      s.length === 0 && (e.containsNonOnDemandable = !0);
      for (let o of s) i.push(o);
    }
    return r === 0 ? [e.containsNonOnDemandable || i.length === 0, i] : i;
  }
  function Vs(t) {
    return Og(t).flatMap((e) => {
      let r = new Map(),
        [i, n] = hA(e);
      return (
        i && n.unshift(gt),
        n.map((a) => (r.has(e) || r.set(e, e), [a, r.get(e)]))
      );
    });
  }
  function js(t) {
    return t.startsWith("@") || t.includes("&");
  }
  function ji(t) {
    t = t
      .replace(/\n+/g, "")
      .replace(/\s{1,}/g, " ")
      .trim();
    let e = fA(t)
      .map((r) => {
        if (!r.startsWith("@")) return ({ format: a }) => a(r);
        let [, i, n] = /@(\S*)( .+|[({].*)?/g.exec(r);
        return ({ wrap: a }) =>
          a(J.atRule({ name: i, params: n?.trim() ?? "" }));
      })
      .reverse();
    return (r) => {
      for (let i of e) i(r);
    };
  }
  function mA(
    t,
    e,
    { variantList: r, variantMap: i, offsets: n, classList: a }
  ) {
    function s(h, m) {
      return h ? (0, _g.default)(t, h, m) : t;
    }
    function o(h) {
      return vr(t.prefix, h);
    }
    function l(h, m) {
      return h === gt ? gt : m.respectPrefix ? e.tailwindConfig.prefix + h : h;
    }
    function c(h, m, b = {}) {
      let S = Ot(h),
        v = s(["theme", ...S], m);
      return mt(S[0])(v, b);
    }
    let f = 0,
      p = {
        postcss: J,
        prefix: o,
        e: Ce,
        config: s,
        theme: c,
        corePlugins: (h) =>
          Array.isArray(t.corePlugins)
            ? t.corePlugins.includes(h)
            : s(["corePlugins", h], !0),
        variants: () => [],
        addBase(h) {
          for (let [m, b] of Vs(h)) {
            let S = l(m, {}),
              v = n.create("base");
            e.candidateRuleMap.has(S) || e.candidateRuleMap.set(S, []),
              e.candidateRuleMap.get(S).push([{ sort: v, layer: "base" }, b]);
          }
        },
        addDefaults(h, m) {
          let b = { [`@defaults ${h}`]: m };
          for (let [S, v] of Vs(b)) {
            let w = l(S, {});
            e.candidateRuleMap.has(w) || e.candidateRuleMap.set(w, []),
              e.candidateRuleMap
                .get(w)
                .push([{ sort: n.create("defaults"), layer: "defaults" }, v]);
          }
        },
        addComponents(h, m) {
          m = Object.assign(
            {},
            { preserveSource: !1, respectPrefix: !0, respectImportant: !1 },
            Array.isArray(m) ? {} : m
          );
          for (let [S, v] of Vs(h)) {
            let w = l(S, m);
            a.add(w),
              e.candidateRuleMap.has(w) || e.candidateRuleMap.set(w, []),
              e.candidateRuleMap
                .get(w)
                .push([
                  {
                    sort: n.create("components"),
                    layer: "components",
                    options: m,
                  },
                  v,
                ]);
          }
        },
        addUtilities(h, m) {
          m = Object.assign(
            {},
            { preserveSource: !1, respectPrefix: !0, respectImportant: !0 },
            Array.isArray(m) ? {} : m
          );
          for (let [S, v] of Vs(h)) {
            let w = l(S, m);
            a.add(w),
              e.candidateRuleMap.has(w) || e.candidateRuleMap.set(w, []),
              e.candidateRuleMap
                .get(w)
                .push([
                  {
                    sort: n.create("utilities"),
                    layer: "utilities",
                    options: m,
                  },
                  v,
                ]);
          }
        },
        matchUtilities: function (h, m) {
          m = Tg({
            ...{ respectPrefix: !0, respectImportant: !0, modifiers: !1 },
            ...m,
          });
          let S = n.create("utilities");
          for (let v in h) {
            let T = function (E, { isOnlyPlugin: F }) {
                let [z, N, fe] = Ga(m.types, E, m, t);
                if (z === void 0) return [];
                if (!m.types.some(({ type: pe }) => pe === N))
                  if (F)
                    V.warn([
                      `Unnecessary typehint \`${N}\` in \`${v}-${E}\`.`,
                      `You can safely update it to \`${v}-${E.replace(
                        N + ":",
                        ""
                      )}\`.`,
                    ]);
                  else return [];
                if (!xr(z)) return [];
                let Se = {
                    get modifier() {
                      return (
                        m.modifiers ||
                          V.warn(`modifier-used-without-options-for-${v}`, [
                            "Your plugin must set `modifiers: true` in its options to support modifiers.",
                          ]),
                        fe
                      );
                    },
                  },
                  Te = he(t, "generalizedModifiers");
                return []
                  .concat(Te ? _(z, Se) : _(z))
                  .filter(Boolean)
                  .map((pe) => ({ [As(v, E)]: pe }));
              },
              w = l(v, m),
              _ = h[v];
            a.add([w, m]);
            let O = [{ sort: S, layer: "utilities", options: m }, T];
            e.candidateRuleMap.has(w) || e.candidateRuleMap.set(w, []),
              e.candidateRuleMap.get(w).push(O);
          }
        },
        matchComponents: function (h, m) {
          m = Tg({
            ...{ respectPrefix: !0, respectImportant: !1, modifiers: !1 },
            ...m,
          });
          let S = n.create("components");
          for (let v in h) {
            let T = function (E, { isOnlyPlugin: F }) {
                let [z, N, fe] = Ga(m.types, E, m, t);
                if (z === void 0) return [];
                if (!m.types.some(({ type: pe }) => pe === N))
                  if (F)
                    V.warn([
                      `Unnecessary typehint \`${N}\` in \`${v}-${E}\`.`,
                      `You can safely update it to \`${v}-${E.replace(
                        N + ":",
                        ""
                      )}\`.`,
                    ]);
                  else return [];
                if (!xr(z)) return [];
                let Se = {
                    get modifier() {
                      return (
                        m.modifiers ||
                          V.warn(`modifier-used-without-options-for-${v}`, [
                            "Your plugin must set `modifiers: true` in its options to support modifiers.",
                          ]),
                        fe
                      );
                    },
                  },
                  Te = he(t, "generalizedModifiers");
                return []
                  .concat(Te ? _(z, Se) : _(z))
                  .filter(Boolean)
                  .map((pe) => ({ [As(v, E)]: pe }));
              },
              w = l(v, m),
              _ = h[v];
            a.add([w, m]);
            let O = [{ sort: S, layer: "components", options: m }, T];
            e.candidateRuleMap.has(w) || e.candidateRuleMap.set(w, []),
              e.candidateRuleMap.get(w).push(O);
          }
        },
        addVariant(h, m, b = {}) {
          (m = [].concat(m).map((S) => {
            if (typeof S != "string")
              return (v = {}) => {
                let {
                    args: w,
                    modifySelectors: _,
                    container: T,
                    separator: O,
                    wrap: E,
                    format: F,
                  } = v,
                  z = S(
                    Object.assign(
                      { modifySelectors: _, container: T, separator: O },
                      b.type === Gl.MatchVariant && {
                        args: w,
                        wrap: E,
                        format: F,
                      }
                    )
                  );
                if (typeof z == "string" && !js(z))
                  throw new Error(
                    `Your custom variant \`${h}\` has an invalid format string. Make sure it's an at-rule or contains a \`&\` placeholder.`
                  );
                return Array.isArray(z)
                  ? z.filter((N) => typeof N == "string").map((N) => ji(N))
                  : z && typeof z == "string" && ji(z)(v);
              };
            if (!js(S))
              throw new Error(
                `Your custom variant \`${h}\` has an invalid format string. Make sure it's an at-rule or contains a \`&\` placeholder.`
              );
            return ji(S);
          })),
            cA(r, h, b),
            i.set(h, m),
            e.variantOptions.set(h, b);
        },
        matchVariant(h, m, b) {
          let S = b?.id ?? ++f,
            v = h === "@",
            w = he(t, "generalizedModifiers");
          for (let [T, O] of Object.entries(b?.values ?? {}))
            T !== "DEFAULT" &&
              p.addVariant(
                v ? `${h}${T}` : `${h}-${T}`,
                ({ args: E, container: F }) =>
                  m(
                    O,
                    w
                      ? { modifier: E?.modifier, container: F }
                      : { container: F }
                  ),
                {
                  ...b,
                  value: O,
                  id: S,
                  type: Gl.MatchVariant,
                  variantInfo: Hl.Base,
                }
              );
          let _ = "DEFAULT" in (b?.values ?? {});
          p.addVariant(
            h,
            ({ args: T, container: O }) =>
              T?.value === $i && !_
                ? null
                : m(
                    T?.value === $i
                      ? b.values.DEFAULT
                      : T?.value ?? (typeof T == "string" ? T : ""),
                    w
                      ? { modifier: T?.modifier, container: O }
                      : { container: O }
                  ),
            { ...b, id: S, type: Gl.MatchVariant, variantInfo: Hl.Dynamic }
          );
        },
      };
    return p;
  }
  function Ws(t) {
    return Ql.has(t) || Ql.set(t, new Map()), Ql.get(t);
  }
  function Eg(t, e) {
    let r = !1,
      i = new Map();
    for (let n of t) {
      if (!n) continue;
      let a = Za.parse(n),
        s = a.hash ? a.href.replace(a.hash, "") : a.href;
      s = a.search ? s.replace(a.search, "") : s;
      let o = ge.statSync(decodeURIComponent(s), {
        throwIfNoEntry: !1,
      })?.mtimeMs;
      !o || ((!e.has(n) || o > e.get(n)) && (r = !0), i.set(n, o));
    }
    return [r, i];
  }
  function Ag(t) {
    t.walkAtRules((e) => {
      ["responsive", "variants"].includes(e.name) &&
        (Ag(e), e.before(e.nodes), e.remove());
    });
  }
  function gA(t) {
    let e = [];
    return (
      t.each((r) => {
        r.type === "atrule" &&
          ["responsive", "variants"].includes(r.name) &&
          ((r.name = "layer"), (r.params = "utilities"));
      }),
      t.walkAtRules("layer", (r) => {
        if ((Ag(r), r.params === "base")) {
          for (let i of r.nodes)
            e.push(function ({ addBase: n }) {
              n(i, { respectPrefix: !1 });
            });
          r.remove();
        } else if (r.params === "components") {
          for (let i of r.nodes)
            e.push(function ({ addComponents: n }) {
              n(i, { respectPrefix: !1, preserveSource: !0 });
            });
          r.remove();
        } else if (r.params === "utilities") {
          for (let i of r.nodes)
            e.push(function ({ addUtilities: n }) {
              n(i, { respectPrefix: !1, preserveSource: !0 });
            });
          r.remove();
        }
      }),
      e
    );
  }
  function yA(t, e) {
    let r = Object.entries({ ...re, ...ig })
        .map(([l, c]) => (t.tailwindConfig.corePlugins.includes(l) ? c : null))
        .filter(Boolean),
      i = t.tailwindConfig.plugins.map(
        (l) => (
          l.__isOptionsFunction && (l = l()),
          typeof l == "function" ? l : l.handler
        )
      ),
      n = gA(e),
      a = [
        re.childVariant,
        re.pseudoElementVariants,
        re.pseudoClassVariants,
        re.hasVariants,
        re.ariaVariants,
        re.dataVariants,
      ],
      s = [
        re.supportsVariants,
        re.reducedMotionVariants,
        re.prefersContrastVariants,
        re.screenVariants,
        re.orientationVariants,
        re.directionVariants,
        re.darkVariants,
        re.forcedColorsVariants,
        re.printVariant,
      ];
    return (
      (t.tailwindConfig.darkMode === "class" ||
        (Array.isArray(t.tailwindConfig.darkMode) &&
          t.tailwindConfig.darkMode[0] === "class")) &&
        (s = [
          re.supportsVariants,
          re.reducedMotionVariants,
          re.prefersContrastVariants,
          re.darkVariants,
          re.screenVariants,
          re.orientationVariants,
          re.directionVariants,
          re.forcedColorsVariants,
          re.printVariant,
        ]),
      [...r, ...a, ...i, ...s, ...n]
    );
  }
  function wA(t, e) {
    let r = [],
      i = new Map();
    e.variantMap = i;
    let n = new Vl();
    e.offsets = n;
    let a = new Set(),
      s = mA(e.tailwindConfig, e, {
        variantList: r,
        variantMap: i,
        offsets: n,
        classList: a,
      });
    for (let f of t)
      if (Array.isArray(f)) for (let p of f) p(s);
      else f?.(s);
    n.recordVariants(r, (f) => i.get(f).length);
    for (let [f, p] of i.entries())
      e.variantMap.set(
        f,
        p.map((h, m) => [n.forVariant(f, m), h])
      );
    let o = (e.tailwindConfig.safelist ?? []).filter(Boolean);
    if (o.length > 0) {
      let f = [];
      for (let p of o) {
        if (typeof p == "string") {
          e.changedContent.push({ content: p, extension: "html" });
          continue;
        }
        if (p instanceof RegExp) {
          V.warn("root-regex", [
            "Regular expressions in `safelist` work differently in Tailwind CSS v3.0.",
            "Update your `safelist` configuration to eliminate this warning.",
            "https://tailwindcss.com/docs/content-configuration#safelisting-classes",
          ]);
          continue;
        }
        f.push(p);
      }
      if (f.length > 0) {
        let p = new Map(),
          h = e.tailwindConfig.prefix.length,
          m = f.some((b) => b.pattern.source.includes("!"));
        for (let b of a) {
          let S = Array.isArray(b)
            ? (() => {
                let [v, w] = b,
                  T = Object.keys(w?.values ?? {}).map((O) => Ni(v, O));
                return (
                  w?.supportsNegativeValues &&
                    ((T = [...T, ...T.map((O) => "-" + O)]),
                    (T = [
                      ...T,
                      ...T.map((O) => O.slice(0, h) + "-" + O.slice(h)),
                    ])),
                  w.types.some(({ type: O }) => O === "color") &&
                    (T = [
                      ...T,
                      ...T.flatMap((O) =>
                        Object.keys(e.tailwindConfig.theme.opacity).map(
                          (E) => `${O}/${E}`
                        )
                      ),
                    ]),
                  m &&
                    w?.respectImportant &&
                    (T = [...T, ...T.map((O) => "!" + O)]),
                  T
                );
              })()
            : [b];
          for (let v of S)
            for (let { pattern: w, variants: _ = [] } of f)
              if (((w.lastIndex = 0), p.has(w) || p.set(w, 0), !!w.test(v))) {
                p.set(w, p.get(w) + 1),
                  e.changedContent.push({ content: v, extension: "html" });
                for (let T of _)
                  e.changedContent.push({
                    content: T + e.tailwindConfig.separator + v,
                    extension: "html",
                  });
              }
        }
        for (let [b, S] of p.entries())
          S === 0 &&
            V.warn([
              `The safelist pattern \`${b}\` doesn't match any Tailwind CSS classes.`,
              "Fix this pattern or remove it from your `safelist` configuration.",
              "https://tailwindcss.com/docs/content-configuration#safelisting-classes",
            ]);
      }
    }
    let l = [].concat(e.tailwindConfig.darkMode ?? "media")[1] ?? "dark",
      c = [Yl(e, l), Yl(e, "group"), Yl(e, "peer")];
    (e.getClassOrder = function (p) {
      let h = [...p].sort((v, w) => (v === w ? 0 : v < w ? -1 : 1)),
        m = new Map(h.map((v) => [v, null])),
        b = zs(new Set(h), e, !0);
      b = e.offsets.sort(b);
      let S = BigInt(c.length);
      for (let [, v] of b) {
        let w = v.raws.tailwind.candidate;
        m.set(w, m.get(w) ?? S++);
      }
      return p.map((v) => {
        let w = m.get(v) ?? null,
          _ = c.indexOf(v);
        return w === null && _ !== -1 && (w = BigInt(_)), [v, w];
      });
    }),
      (e.getClassList = function (p = {}) {
        let h = [];
        for (let m of a)
          if (Array.isArray(m)) {
            let [b, S] = m,
              v = [],
              w = Object.keys(S?.modifiers ?? {});
            S?.types?.some(({ type: O }) => O === "color") &&
              w.push(...Object.keys(e.tailwindConfig.theme.opacity ?? {}));
            let _ = { modifiers: w },
              T = p.includeMetadata && w.length > 0;
            for (let [O, E] of Object.entries(S?.values ?? {})) {
              if (E == null) continue;
              let F = Ni(b, O);
              if (
                (h.push(T ? [F, _] : F), S?.supportsNegativeValues && Tt(E))
              ) {
                let z = Ni(b, `-${O}`);
                v.push(T ? [z, _] : z);
              }
            }
            h.push(...v);
          } else h.push(m);
        return h;
      }),
      (e.getVariants = function () {
        let p = Math.random().toString(36).substring(7).toUpperCase(),
          h = [];
        for (let [m, b] of e.variantOptions.entries())
          b.variantInfo !== Hl.Base &&
            h.push({
              name: m,
              isArbitrary: b.type === Symbol.for("MATCH_VARIANT"),
              values: Object.keys(b.values ?? {}),
              hasDash: m !== "@",
              selectors({ modifier: S, value: v } = {}) {
                let w = `TAILWINDPLACEHOLDER${p}`,
                  _ = J.rule({ selector: `.${w}` }),
                  T = J.root({ nodes: [_.clone()] }),
                  O = T.toString(),
                  E = (e.variantMap.get(m) ?? []).flatMap(([ve, qe]) => qe),
                  F = [];
                for (let ve of E) {
                  let qe = [],
                    Tn = {
                      args: { modifier: S, value: b.values?.[v] ?? v },
                      separator: e.tailwindConfig.separator,
                      modifySelectors(Ge) {
                        return (
                          T.each((qa) => {
                            qa.type === "rule" &&
                              (qa.selectors = qa.selectors.map((Kc) =>
                                Ge({
                                  get className() {
                                    return zl(Kc);
                                  },
                                  selector: Kc,
                                })
                              ));
                          }),
                          T
                        );
                      },
                      format(Ge) {
                        qe.push(Ge);
                      },
                      wrap(Ge) {
                        qe.push(`@${Ge.name} ${Ge.params} { & }`);
                      },
                      container: T,
                    },
                    On = ve(Tn);
                  if ((qe.length > 0 && F.push(qe), Array.isArray(On)))
                    for (let Ge of On) (qe = []), Ge(Tn), F.push(qe);
                }
                let z = [],
                  N = T.toString();
                O !== N &&
                  (T.walkRules((ve) => {
                    let qe = ve.selector,
                      Tn = (0, Wl.default)((On) => {
                        On.walkClasses((Ge) => {
                          Ge.value = `${m}${e.tailwindConfig.separator}${Ge.value}`;
                        });
                      }).processSync(qe);
                    z.push(qe.replace(Tn, "&").replace(w, "&"));
                  }),
                  T.walkAtRules((ve) => {
                    z.push(`@${ve.name} (${ve.params}) { & }`);
                  }));
                let fe = !(v in (b.values ?? {})),
                  Se = b[Bt] ?? {},
                  Te = (() => !(fe || Se.respectPrefix === !1))();
                (F = F.map((ve) =>
                  ve.map((qe) => ({ format: qe, respectPrefix: Te }))
                )),
                  (z = z.map((ve) => ({ format: ve, respectPrefix: Te })));
                let Me = { candidate: w, context: e },
                  pe = F.map((ve) =>
                    Ms(`.${w}`, Sr(ve, Me), Me)
                      .replace(`.${w}`, "&")
                      .replace("{ & }", "")
                      .trim()
                  );
                return (
                  z.length > 0 &&
                    pe.push(Sr(z, Me).toString().replace(`.${w}`, "&")),
                  pe
                );
              },
            });
        return h;
      });
  }
  function Cg(t, e) {
    !t.classCache.has(e) ||
      (t.notClassCache.add(e),
      t.classCache.delete(e),
      t.applyClassCache.delete(e),
      t.candidateRuleMap.delete(e),
      t.candidateRuleCache.delete(e),
      (t.stylesheetCache = null));
  }
  function vA(t, e) {
    let r = e.raws.tailwind.candidate;
    if (!!r) {
      for (let i of t.ruleCache)
        i[1].raws.tailwind.candidate === r && t.ruleCache.delete(i);
      Cg(t, r);
    }
  }
  function Jl(t, e = [], r = J.root()) {
    let i = {
        disposables: [],
        ruleCache: new Set(),
        candidateRuleCache: new Map(),
        classCache: new Map(),
        applyClassCache: new Map(),
        notClassCache: new Set(t.blocklist ?? []),
        postCssNodeCache: new Map(),
        candidateRuleMap: new Map(),
        tailwindConfig: t,
        changedContent: e,
        variantMap: new Map(),
        stylesheetCache: null,
        variantOptions: new Map(),
        markInvalidUtilityCandidate: (a) => Cg(i, a),
        markInvalidUtilityNode: (a) => vA(i, a),
      },
      n = yA(i, r);
    return wA(n, i), i;
  }
  function Pg(t, e, r, i, n, a) {
    let s = e.opts.from,
      o = i !== null;
    Xe.DEBUG && console.log("Source path:", s);
    let l;
    if (o && _r.has(s)) l = _r.get(s);
    else if (Ui.has(n)) {
      let h = Ui.get(n);
      Lt.get(h).add(s), _r.set(s, h), (l = h);
    }
    let c = yg(s, t);
    if (l) {
      let [h, m] = Eg([...a], Ws(l));
      if (!h && !c) return [l, !1, m];
    }
    if (_r.has(s)) {
      let h = _r.get(s);
      if (Lt.has(h) && (Lt.get(h).delete(s), Lt.get(h).size === 0)) {
        Lt.delete(h);
        for (let [m, b] of Ui) b === h && Ui.delete(m);
        for (let m of h.disposables.splice(0)) m(h);
      }
    }
    Xe.DEBUG && console.log("Setting up new context...");
    let f = Jl(r, [], t);
    Object.assign(f, { userConfigPath: i });
    let [, p] = Eg([...a], Ws(f));
    return (
      Ui.set(n, f),
      _r.set(s, f),
      Lt.has(f) || Lt.set(f, new Set()),
      Lt.get(f).add(s),
      [f, !0, p]
    );
  }
  var _g,
    Wl,
    Bt,
    Gl,
    Hl,
    Ql,
    _r,
    Ui,
    Lt,
    zi = A(() => {
      u();
      ft();
      eo();
      qt();
      (_g = ce(So())), (Wl = ce(it()));
      Li();
      El();
      Es();
      ar();
      br();
      Cl();
      ti();
      ng();
      Mt();
      Mt();
      qn();
      Qe();
      Cn();
      ql();
      $s();
      wg();
      Sg();
      ct();
      Ll();
      (Bt = Symbol()),
        (Gl = {
          AddVariant: Symbol.for("ADD_VARIANT"),
          MatchVariant: Symbol.for("MATCH_VARIANT"),
        }),
        (Hl = { Base: 1 << 0, Dynamic: 1 << 1 });
      Ql = new WeakMap();
      (_r = sg), (Ui = ag), (Lt = Rs);
    });
  function Kl(t) {
    return t.ignore
      ? []
      : t.glob
      ? g.env.ROLLUP_WATCH === "true"
        ? [{ type: "dependency", file: t.base }]
        : [{ type: "dir-dependency", dir: t.base, glob: t.glob }]
      : [{ type: "dependency", file: t.base }];
  }
  var Ig = A(() => {
    u();
  });
  function qg(t, e) {
    return { handler: t, config: e };
  }
  var Dg,
    Rg = A(() => {
      u();
      qg.withOptions = function (t, e = () => ({})) {
        let r = function (i) {
          return { __options: i, handler: t(i), config: e(i) };
        };
        return (
          (r.__isOptionsFunction = !0),
          (r.__pluginFunction = t),
          (r.__configFunction = e),
          r
        );
      };
      Dg = qg;
    });
  var Vi = {};
  He(Vi, { default: () => bA });
  var bA,
    Wi = A(() => {
      u();
      Rg();
      bA = Dg;
    });
  var Mg = k((lN, Bg) => {
    u();
    var xA = (Wi(), Vi).default,
      kA = {
        overflow: "hidden",
        display: "-webkit-box",
        "-webkit-box-orient": "vertical",
      },
      SA = xA(
        function ({
          matchUtilities: t,
          addUtilities: e,
          theme: r,
          variants: i,
        }) {
          let n = r("lineClamp");
          t(
            { "line-clamp": (a) => ({ ...kA, "-webkit-line-clamp": `${a}` }) },
            { values: n }
          ),
            e(
              [{ ".line-clamp-none": { "-webkit-line-clamp": "unset" } }],
              i("lineClamp")
            );
        },
        {
          theme: {
            lineClamp: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6" },
          },
          variants: { lineClamp: ["responsive"] },
        }
      );
    Bg.exports = SA;
  });
  function Xl(t) {
    t.content.files.length === 0 &&
      V.warn("content-problems", [
        "The `content` option in your Tailwind CSS configuration is missing or empty.",
        "Configure your content sources or your generated CSS will be missing styles.",
        "https://tailwindcss.com/docs/content-configuration",
      ]);
    try {
      let e = Mg();
      t.plugins.includes(e) &&
        (V.warn("line-clamp-in-core", [
          "As of Tailwind CSS v3.3, the `@tailwindcss/line-clamp` plugin is now included by default.",
          "Remove it from the `plugins` array in your configuration to eliminate this warning.",
        ]),
        (t.plugins = t.plugins.filter((r) => r !== e)));
    } catch {}
    return t;
  }
  var Lg = A(() => {
    u();
    Qe();
  });
  var Fg,
    Ng = A(() => {
      u();
      Fg = () => !1;
    });
  var Gs,
    zg = A(() => {
      u();
      Gs = {
        sync: (t) => [].concat(t),
        generateTasks: (t) => [
          {
            dynamic: !1,
            base: ".",
            negative: [],
            positive: [].concat(t),
            patterns: [].concat(t),
          },
        ],
        escapePath: (t) => t,
      };
    });
  var Zl,
    $g = A(() => {
      u();
      Zl = (t) => t;
    });
  var jg,
    Ug = A(() => {
      u();
      jg = () => "";
    });
  function Vg(t) {
    let e = t,
      r = jg(t);
    return (
      r !== "." &&
        ((e = t.substr(r.length)), e.charAt(0) === "/" && (e = e.substr(1))),
      e.substr(0, 2) === "./"
        ? (e = e.substr(2))
        : e.charAt(0) === "/" && (e = e.substr(1)),
      { base: r, glob: e }
    );
  }
  var Wg = A(() => {
    u();
    Ug();
  });
  function Gg(t, e) {
    let r = e.content.files;
    (r = r.filter((o) => typeof o == "string")), (r = r.map(Zl));
    let i = Gs.generateTasks(r),
      n = [],
      a = [];
    for (let o of i)
      n.push(...o.positive.map((l) => Hg(l, !1))),
        a.push(...o.negative.map((l) => Hg(l, !0)));
    let s = [...n, ...a];
    return (s = TA(t, s)), (s = s.flatMap(OA)), (s = s.map(_A)), s;
  }
  function Hg(t, e) {
    let r = { original: t, base: t, ignore: e, pattern: t, glob: null };
    return Fg(t) && Object.assign(r, Vg(t)), r;
  }
  function _A(t) {
    let e = Zl(t.base);
    return (
      (e = Gs.escapePath(e)),
      (t.pattern = t.glob ? `${e}/${t.glob}` : e),
      (t.pattern = t.ignore ? `!${t.pattern}` : t.pattern),
      t
    );
  }
  function TA(t, e) {
    let r = [];
    return (
      t.userConfigPath &&
        t.tailwindConfig.content.relative &&
        (r = [me.dirname(t.userConfigPath)]),
      e.map((i) => ((i.base = me.resolve(...r, i.base)), i))
    );
  }
  function OA(t) {
    let e = [t];
    try {
      let r = ge.realpathSync(t.base);
      r !== t.base && e.push({ ...t, base: r });
    } catch {}
    return e;
  }
  function Yg(t, e, r) {
    let i = t.tailwindConfig.content.files
        .filter((s) => typeof s.raw == "string")
        .map(({ raw: s, extension: o = "html" }) => ({
          content: s,
          extension: o,
        })),
      [n, a] = EA(e, r);
    for (let s of n) {
      let o = me.extname(s).slice(1);
      i.push({ file: s, extension: o });
    }
    return [i, a];
  }
  function EA(t, e) {
    let r = t.map((s) => s.pattern),
      i = new Map(),
      n = new Set();
    Xe.DEBUG && console.time("Finding changed files");
    let a = Gs.sync(r, { absolute: !0 });
    for (let s of a) {
      let o = e.get(s) || -1 / 0,
        l = ge.statSync(s).mtimeMs;
      l > o && (n.add(s), i.set(s, l));
    }
    return Xe.DEBUG && console.timeEnd("Finding changed files"), [n, i];
  }
  var Qg = A(() => {
    u();
    ft();
    Yt();
    Ng();
    zg();
    $g();
    Wg();
    Mt();
  });
  function Jg() {}
  var Kg = A(() => {
    u();
  });
  function IA(t, e) {
    for (let r of e) {
      let i = `${t}${r}`;
      if (ge.existsSync(i) && ge.statSync(i).isFile()) return i;
    }
    for (let r of e) {
      let i = `${t}/index${r}`;
      if (ge.existsSync(i)) return i;
    }
    return null;
  }
  function* Xg(t, e, r, i = me.extname(t)) {
    let n = IA(me.resolve(e, t), AA.includes(i) ? CA : PA);
    if (n === null || r.has(n)) return;
    r.add(n), yield n, (e = me.dirname(n)), (i = me.extname(n));
    let a = ge.readFileSync(n, "utf-8");
    for (let s of [
      ...a.matchAll(/import[\s\S]*?['"](.{3,}?)['"]/gi),
      ...a.matchAll(/import[\s\S]*from[\s\S]*?['"](.{3,}?)['"]/gi),
      ...a.matchAll(/require\(['"`](.+)['"`]\)/gi),
    ])
      !s[1].startsWith(".") || (yield* Xg(s[1], e, r, i));
  }
  function eu(t) {
    return t === null ? new Set() : new Set(Xg(t, me.dirname(t), new Set()));
  }
  var AA,
    CA,
    PA,
    Zg = A(() => {
      u();
      ft();
      Yt();
      (AA = [".js", ".cjs", ".mjs"]),
        (CA = [
          "",
          ".js",
          ".cjs",
          ".mjs",
          ".ts",
          ".cts",
          ".mts",
          ".jsx",
          ".tsx",
        ]),
        (PA = [
          "",
          ".ts",
          ".cts",
          ".mts",
          ".tsx",
          ".js",
          ".cjs",
          ".mjs",
          ".jsx",
        ]);
    });
  function qA(t, e) {
    if (tu.has(t)) return tu.get(t);
    let r = Gg(t, e);
    return tu.set(t, r).get(t);
  }
  function DA(t) {
    let e = Xa(t);
    if (e !== null) {
      let [i, n, a, s] = ty.get(e) || [],
        o = eu(e),
        l = !1,
        c = new Map();
      for (let h of o) {
        let m = ge.statSync(h).mtimeMs;
        c.set(h, m), (!s || !s.has(h) || m > s.get(h)) && (l = !0);
      }
      if (!l) return [i, e, n, a];
      for (let h of o) delete Zc.cache[h];
      let f = Xl(ii(Jg(e))),
        p = An(f);
      return ty.set(e, [f, p, o, c]), [f, e, p, o];
    }
    let r = ii(t?.config ?? t ?? {});
    return (r = Xl(r)), [r, null, An(r), []];
  }
  function ru(t) {
    return ({ tailwindDirectives: e, registerDependency: r }) =>
      (i, n) => {
        let [a, s, o, l] = DA(t),
          c = new Set(l);
        if (e.size > 0) {
          c.add(n.opts.from);
          for (let b of n.messages) b.type === "dependency" && c.add(b.file);
        }
        let [f, , p] = Pg(i, n, a, s, o, c),
          h = Ws(f),
          m = qA(f, a);
        if (e.size > 0) {
          for (let v of m) for (let w of Kl(v)) r(w);
          let [b, S] = Yg(f, m, h);
          for (let v of b) f.changedContent.push(v);
          for (let [v, w] of S.entries()) p.set(v, w);
        }
        for (let b of l) r({ type: "dependency", file: b });
        for (let [b, S] of p.entries()) h.set(b, S);
        return f;
      };
  }
  var ey,
    ty,
    tu,
    ry = A(() => {
      u();
      ft();
      ey = ce(Da());
      np();
      Ka();
      Gp();
      zi();
      Ig();
      Lg();
      Qg();
      Kg();
      Zg();
      (ty = new ey.default({ maxSize: 100 })), (tu = new WeakMap());
    });
  function iu(t) {
    let e = new Set(),
      r = new Set(),
      i = new Set();
    if (
      (t.walkAtRules((n) => {
        n.name === "apply" && i.add(n),
          n.name === "import" &&
            (n.params === '"tailwindcss/base"' ||
            n.params === "'tailwindcss/base'"
              ? ((n.name = "tailwind"), (n.params = "base"))
              : n.params === '"tailwindcss/components"' ||
                n.params === "'tailwindcss/components'"
              ? ((n.name = "tailwind"), (n.params = "components"))
              : n.params === '"tailwindcss/utilities"' ||
                n.params === "'tailwindcss/utilities'"
              ? ((n.name = "tailwind"), (n.params = "utilities"))
              : (n.params === '"tailwindcss/screens"' ||
                  n.params === "'tailwindcss/screens'" ||
                  n.params === '"tailwindcss/variants"' ||
                  n.params === "'tailwindcss/variants'") &&
                ((n.name = "tailwind"), (n.params = "variants"))),
          n.name === "tailwind" &&
            (n.params === "screens" && (n.params = "variants"),
            e.add(n.params)),
          ["layer", "responsive", "variants"].includes(n.name) &&
            (["responsive", "variants"].includes(n.name) &&
              V.warn(`${n.name}-at-rule-deprecated`, [
                `The \`@${n.name}\` directive has been deprecated in Tailwind CSS v3.0.`,
                "Use `@layer utilities` or `@layer components` instead.",
                "https://tailwindcss.com/docs/upgrade-guide#replace-variants-with-layer",
              ]),
            r.add(n));
      }),
      !e.has("base") || !e.has("components") || !e.has("utilities"))
    ) {
      for (let n of r)
        if (
          n.name === "layer" &&
          ["base", "components", "utilities"].includes(n.params)
        ) {
          if (!e.has(n.params))
            throw n.error(
              `\`@layer ${n.params}\` is used but no matching \`@tailwind ${n.params}\` directive is present.`
            );
        } else if (n.name === "responsive") {
          if (!e.has("utilities"))
            throw n.error(
              "`@responsive` is used but `@tailwind utilities` is missing."
            );
        } else if (n.name === "variants" && !e.has("utilities"))
          throw n.error(
            "`@variants` is used but `@tailwind utilities` is missing."
          );
    }
    return { tailwindDirectives: e, applyDirectives: i };
  }
  var iy = A(() => {
    u();
    Qe();
  });
  function Zt(t, e = void 0, r = void 0) {
    return t.map((i) => {
      let n = i.clone();
      return (
        r !== void 0 && (n.raws.tailwind = { ...n.raws.tailwind, ...r }),
        e !== void 0 &&
          ny(n, (a) => {
            if (a.raws.tailwind?.preserveSource === !0 && a.source) return !1;
            a.source = e;
          }),
        n
      );
    });
  }
  function ny(t, e) {
    e(t) !== !1 && t.each?.((r) => ny(r, e));
  }
  var sy = A(() => {
    u();
  });
  function nu(t) {
    return (
      (t = Array.isArray(t) ? t : [t]),
      (t = t.map((e) => (e instanceof RegExp ? e.source : e))),
      t.join("")
    );
  }
  function Be(t) {
    return new RegExp(nu(t), "g");
  }
  function Ft(t) {
    return `(?:${t.map(nu).join("|")})`;
  }
  function su(t) {
    return `(?:${nu(t)})?`;
  }
  function oy(t) {
    return t && RA.test(t) ? t.replace(ay, "\\$&") : t || "";
  }
  var ay,
    RA,
    ly = A(() => {
      u();
      (ay = /[\\^$.*+?()[\]{}|]/g), (RA = RegExp(ay.source));
    });
  function uy(t) {
    let e = Array.from(BA(t));
    return (r) => {
      let i = [];
      for (let n of e) for (let a of r.match(n) ?? []) i.push(FA(a));
      for (let n of i.slice()) {
        let a = ye(n, ".");
        for (let s = 0; s < a.length; s++) {
          let o = a[s];
          if (s >= a.length - 1) {
            i.push(o);
            continue;
          }
          let l = parseInt(a[s + 1]);
          isNaN(l) ? i.push(o) : s++;
        }
      }
      return i;
    };
  }
  function* BA(t) {
    let e = t.tailwindConfig.separator,
      r =
        t.tailwindConfig.prefix !== ""
          ? su(Be([/-?/, oy(t.tailwindConfig.prefix)]))
          : "",
      i = Ft([
        /\[[^\s:'"`]+:[^\s\[\]]+\]/,
        /\[[^\s:'"`\]]+:[^\s]+?\[[^\s]+\][^\s]+?\]/,
        Be([
          Ft([/-?(?:\w+)/, /@(?:\w+)/]),
          su(
            Ft([
              Be([
                Ft([
                  /-(?:\w+-)*\['[^\s]+'\]/,
                  /-(?:\w+-)*\["[^\s]+"\]/,
                  /-(?:\w+-)*\[`[^\s]+`\]/,
                  /-(?:\w+-)*\[(?:[^\s\[\]]+\[[^\s\[\]]+\])*[^\s:\[\]]+\]/,
                ]),
                /(?![{([]])/,
                /(?:\/[^\s'"`\\><$]*)?/,
              ]),
              Be([
                Ft([
                  /-(?:\w+-)*\['[^\s]+'\]/,
                  /-(?:\w+-)*\["[^\s]+"\]/,
                  /-(?:\w+-)*\[`[^\s]+`\]/,
                  /-(?:\w+-)*\[(?:[^\s\[\]]+\[[^\s\[\]]+\])*[^\s\[\]]+\]/,
                ]),
                /(?![{([]])/,
                /(?:\/[^\s'"`\\$]*)?/,
              ]),
              /[-\/][^\s'"`\\$={><]*/,
            ])
          ),
        ]),
      ]),
      n = [
        Ft([
          Be([/@\[[^\s"'`]+\](\/[^\s"'`]+)?/, e]),
          Be([/([^\s"'`\[\\]+-)?\[[^\s"'`]+\]\/[\w_-]+/, e]),
          Be([/([^\s"'`\[\\]+-)?\[[^\s"'`]+\]/, e]),
          Be([/[^\s"'`\[\\]+/, e]),
        ]),
        Ft([
          Be([/([^\s"'`\[\\]+-)?\[[^\s`]+\]\/[\w_-]+/, e]),
          Be([/([^\s"'`\[\\]+-)?\[[^\s`]+\]/, e]),
          Be([/[^\s`\[\\]+/, e]),
        ]),
      ];
    for (let a of n) yield Be(["((?=((", a, ")+))\\2)?", /!?/, r, i]);
  }
  function FA(t) {
    if (!t.includes("-[")) return t;
    let e = 0,
      r = [],
      i = t.matchAll(MA);
    i = Array.from(i).flatMap((n) => {
      let [, ...a] = n;
      return a.map((s, o) =>
        Object.assign([], n, { index: n.index + o, 0: s })
      );
    });
    for (let n of i) {
      let a = n[0],
        s = r[r.length - 1];
      if (
        (a === s ? r.pop() : (a === "'" || a === '"' || a === "`") && r.push(a),
        !s)
      ) {
        if (a === "[") {
          e++;
          continue;
        } else if (a === "]") {
          e--;
          continue;
        }
        if (e < 0) return t.substring(0, n.index - 1);
        if (e === 0 && !LA.test(a)) return t.substring(0, n.index);
      }
    }
    return t;
  }
  var MA,
    LA,
    fy = A(() => {
      u();
      ly();
      Ht();
      (MA = /([\[\]'"`])([^\[\]'"`])?/g), (LA = /[^"'`\s<>\]]+/);
    });
  function NA(t, e) {
    let r = t.tailwindConfig.content.extract;
    return r[e] || r.DEFAULT || py[e] || py.DEFAULT(t);
  }
  function zA(t, e) {
    let r = t.content.transform;
    return r[e] || r.DEFAULT || dy[e] || dy.DEFAULT;
  }
  function $A(t, e, r, i) {
    Gi.has(e) || Gi.set(e, new cy.default({ maxSize: 25e3 }));
    for (let n of t.split(`
`))
      if (((n = n.trim()), !i.has(n)))
        if ((i.add(n), Gi.get(e).has(n)))
          for (let a of Gi.get(e).get(n)) r.add(a);
        else {
          let a = e(n).filter((o) => o !== "!*"),
            s = new Set(a);
          for (let o of s) r.add(o);
          Gi.get(e).set(n, s);
        }
  }
  function jA(t, e) {
    let r = e.offsets.sort(t),
      i = {
        base: new Set(),
        defaults: new Set(),
        components: new Set(),
        utilities: new Set(),
        variants: new Set(),
      };
    for (let [n, a] of r) i[n.layer].add(a);
    return i;
  }
  function au(t) {
    return async (e) => {
      let r = { base: null, components: null, utilities: null, variants: null };
      if (
        (e.walkAtRules((v) => {
          v.name === "tailwind" &&
            Object.keys(r).includes(v.params) &&
            (r[v.params] = v);
        }),
        Object.values(r).every((v) => v === null))
      )
        return e;
      let i = new Set([...(t.candidates ?? []), gt]),
        n = new Set();
      yt.DEBUG && console.time("Reading changed files");
      let a = [];
      for (let v of t.changedContent) {
        let w = zA(t.tailwindConfig, v.extension),
          _ = NA(t, v.extension);
        a.push([v, { transformer: w, extractor: _ }]);
      }
      let s = 500;
      for (let v = 0; v < a.length; v += s) {
        let w = a.slice(v, v + s);
        await Promise.all(
          w.map(
            async ([
              { file: _, content: T },
              { transformer: O, extractor: E },
            ]) => {
              (T = _ ? await ge.promises.readFile(_, "utf8") : T),
                $A(O(T), E, i, n);
            }
          )
        );
      }
      yt.DEBUG && console.timeEnd("Reading changed files");
      let o = t.classCache.size;
      yt.DEBUG && console.time("Generate rules"),
        yt.DEBUG && console.time("Sorting candidates");
      let l = new Set([...i].sort((v, w) => (v === w ? 0 : v < w ? -1 : 1)));
      yt.DEBUG && console.timeEnd("Sorting candidates"),
        zs(l, t),
        yt.DEBUG && console.timeEnd("Generate rules"),
        yt.DEBUG && console.time("Build stylesheet"),
        (t.stylesheetCache === null || t.classCache.size !== o) &&
          (t.stylesheetCache = jA([...t.ruleCache], t)),
        yt.DEBUG && console.timeEnd("Build stylesheet");
      let {
        defaults: c,
        base: f,
        components: p,
        utilities: h,
        variants: m,
      } = t.stylesheetCache;
      r.base &&
        (r.base.before(Zt([...f, ...c], r.base.source, { layer: "base" })),
        r.base.remove()),
        r.components &&
          (r.components.before(
            Zt([...p], r.components.source, { layer: "components" })
          ),
          r.components.remove()),
        r.utilities &&
          (r.utilities.before(
            Zt([...h], r.utilities.source, { layer: "utilities" })
          ),
          r.utilities.remove());
      let b = Array.from(m).filter((v) => {
        let w = v.raws.tailwind?.parentLayer;
        return w === "components"
          ? r.components !== null
          : w === "utilities"
          ? r.utilities !== null
          : !0;
      });
      r.variants
        ? (r.variants.before(Zt(b, r.variants.source, { layer: "variants" })),
          r.variants.remove())
        : b.length > 0 && e.append(Zt(b, e.source, { layer: "variants" })),
        (e.source.end = e.source.end ?? e.source.start);
      let S = b.some((v) => v.raws.tailwind?.parentLayer === "utilities");
      r.utilities &&
        h.size === 0 &&
        !S &&
        V.warn("content-problems", [
          "No utility classes were detected in your source files. If this is unexpected, double-check the `content` option in your Tailwind CSS configuration.",
          "https://tailwindcss.com/docs/content-configuration",
        ]),
        yt.DEBUG &&
          (console.log("Potential classes: ", i.size),
          console.log("Active contexts: ", Rs.size)),
        (t.changedContent = []),
        e.walkAtRules("layer", (v) => {
          Object.keys(r).includes(v.params) && v.remove();
        });
    };
  }
  var cy,
    yt,
    py,
    dy,
    Gi,
    hy = A(() => {
      u();
      ft();
      cy = ce(Da());
      Mt();
      $s();
      Qe();
      sy();
      fy();
      (yt = Xe),
        (py = { DEFAULT: uy }),
        (dy = {
          DEFAULT: (t) => t,
          svelte: (t) => t.replace(/(?:^|\s)class:/g, " "),
        });
      Gi = new WeakMap();
    });
  function Ys(t) {
    let e = new Map();
    J.root({ nodes: [t.clone()] }).walkRules((a) => {
      (0, Hs.default)((s) => {
        s.walkClasses((o) => {
          let l = o.parent.toString(),
            c = e.get(l);
          c || e.set(l, (c = new Set())), c.add(o.value);
        });
      }).processSync(a.selector);
    });
    let i = Array.from(e.values(), (a) => Array.from(a)),
      n = i.flat();
    return Object.assign(n, { groups: i });
  }
  function ou(t) {
    return UA.astSync(t);
  }
  function my(t, e) {
    let r = new Set();
    for (let i of t) r.add(i.split(e).pop());
    return Array.from(r);
  }
  function gy(t, e) {
    let r = t.tailwindConfig.prefix;
    return typeof r == "function" ? r(e) : r + e;
  }
  function* yy(t) {
    for (yield t; t.parent; ) yield t.parent, (t = t.parent);
  }
  function VA(t, e = {}) {
    let r = t.nodes;
    t.nodes = [];
    let i = t.clone(e);
    return (t.nodes = r), i;
  }
  function WA(t) {
    for (let e of yy(t))
      if (t !== e) {
        if (e.type === "root") break;
        t = VA(e, { nodes: [t] });
      }
    return t;
  }
  function GA(t, e) {
    let r = new Map();
    return (
      t.walkRules((i) => {
        for (let s of yy(i)) if (s.raws.tailwind?.layer !== void 0) return;
        let n = WA(i),
          a = e.offsets.create("user");
        for (let s of Ys(i)) {
          let o = r.get(s) || [];
          r.set(s, o), o.push([{ layer: "user", sort: a, important: !1 }, n]);
        }
      }),
      r
    );
  }
  function HA(t, e) {
    for (let r of t) {
      if (e.notClassCache.has(r) || e.applyClassCache.has(r)) continue;
      if (e.classCache.has(r)) {
        e.applyClassCache.set(
          r,
          e.classCache.get(r).map(([n, a]) => [n, a.clone()])
        );
        continue;
      }
      let i = Array.from(jl(r, e));
      if (i.length === 0) {
        e.notClassCache.add(r);
        continue;
      }
      e.applyClassCache.set(r, i);
    }
    return e.applyClassCache;
  }
  function YA(t) {
    let e = null;
    return {
      get: (r) => ((e = e || t()), e.get(r)),
      has: (r) => ((e = e || t()), e.has(r)),
    };
  }
  function QA(t) {
    return {
      get: (e) => t.flatMap((r) => r.get(e) || []),
      has: (e) => t.some((r) => r.has(e)),
    };
  }
  function wy(t) {
    let e = t.split(/[\s\t\n]+/g);
    return e[e.length - 1] === "!important" ? [e.slice(0, -1), !0] : [e, !1];
  }
  function vy(t, e, r) {
    let i = new Set(),
      n = [];
    if (
      (t.walkAtRules("apply", (l) => {
        let [c] = wy(l.params);
        for (let f of c) i.add(f);
        n.push(l);
      }),
      n.length === 0)
    )
      return;
    let a = QA([r, HA(i, e)]);
    function s(l, c, f) {
      let p = ou(l),
        h = ou(c),
        b = ou(`.${Ce(f)}`).nodes[0].nodes[0];
      return (
        p.each((S) => {
          let v = new Set();
          h.each((w) => {
            let _ = !1;
            (w = w.clone()),
              w.walkClasses((T) => {
                T.value === b.value &&
                  (_ ||
                    (T.replaceWith(...S.nodes.map((O) => O.clone())),
                    v.add(w),
                    (_ = !0)));
              });
          });
          for (let w of v) {
            let _ = [[]];
            for (let T of w.nodes)
              T.type === "combinator"
                ? (_.push(T), _.push([]))
                : _[_.length - 1].push(T);
            w.nodes = [];
            for (let T of _)
              Array.isArray(T) &&
                T.sort((O, E) =>
                  O.type === "tag" && E.type === "class"
                    ? -1
                    : O.type === "class" && E.type === "tag"
                    ? 1
                    : O.type === "class" &&
                      E.type === "pseudo" &&
                      E.value.startsWith("::")
                    ? -1
                    : O.type === "pseudo" &&
                      O.value.startsWith("::") &&
                      E.type === "class"
                    ? 1
                    : 0
                ),
                (w.nodes = w.nodes.concat(T));
          }
          S.replaceWith(...v);
        }),
        p.toString()
      );
    }
    let o = new Map();
    for (let l of n) {
      let [c] = o.get(l.parent) || [[], l.source];
      o.set(l.parent, [c, l.source]);
      let [f, p] = wy(l.params);
      if (l.parent.type === "atrule") {
        if (l.parent.name === "screen") {
          let h = l.parent.params;
          throw l.error(
            `@apply is not supported within nested at-rules like @screen. We suggest you write this as @apply ${f
              .map((m) => `${h}:${m}`)
              .join(" ")} instead.`
          );
        }
        throw l.error(
          `@apply is not supported within nested at-rules like @${l.parent.name}. You can fix this by un-nesting @${l.parent.name}.`
        );
      }
      for (let h of f) {
        if ([gy(e, "group"), gy(e, "peer")].includes(h))
          throw l.error(`@apply should not be used with the '${h}' utility`);
        if (!a.has(h))
          throw l.error(
            `The \`${h}\` class does not exist. If \`${h}\` is a custom class, make sure it is defined within a \`@layer\` directive.`
          );
        let m = a.get(h);
        for (let [, b] of m)
          b.type !== "atrule" &&
            b.walkRules(() => {
              throw l.error(
                [
                  `The \`${h}\` class cannot be used with \`@apply\` because \`@apply\` does not currently support nested CSS.`,
                  "Rewrite the selector without nesting or configure the `tailwindcss/nesting` plugin:",
                  "https://tailwindcss.com/docs/using-with-preprocessors#nesting",
                ].join(`
`)
              );
            });
        c.push([h, p, m]);
      }
    }
    for (let [l, [c, f]] of o) {
      let p = [];
      for (let [m, b, S] of c) {
        let v = [m, ...my([m], e.tailwindConfig.separator)];
        for (let [w, _] of S) {
          let T = Ys(l),
            O = Ys(_);
          if (
            ((O = O.groups
              .filter((N) => N.some((fe) => v.includes(fe)))
              .flat()),
            (O = O.concat(my(O, e.tailwindConfig.separator))),
            T.some((N) => O.includes(N)))
          )
            throw _.error(
              `You cannot \`@apply\` the \`${m}\` utility here because it creates a circular dependency.`
            );
          let F = J.root({ nodes: [_.clone()] });
          F.walk((N) => {
            N.source = f;
          }),
            (_.type !== "atrule" ||
              (_.type === "atrule" && _.name !== "keyframes")) &&
              F.walkRules((N) => {
                if (!Ys(N).some((pe) => pe === m)) {
                  N.remove();
                  return;
                }
                let fe =
                    typeof e.tailwindConfig.important == "string"
                      ? e.tailwindConfig.important
                      : null,
                  Te =
                    l.raws.tailwind !== void 0 &&
                    fe &&
                    l.selector.indexOf(fe) === 0
                      ? l.selector.slice(fe.length)
                      : l.selector;
                Te === "" && (Te = l.selector),
                  (N.selector = s(Te, N.selector, m)),
                  fe && Te !== l.selector && (N.selector = Ls(N.selector, fe)),
                  N.walkDecls((pe) => {
                    pe.important = w.important || b;
                  });
                let Me = (0, Hs.default)().astSync(N.selector);
                Me.each((pe) => kr(pe)), (N.selector = Me.toString());
              }),
            !!F.nodes[0] && p.push([w.sort, F.nodes[0]]);
        }
      }
      let h = e.offsets.sort(p).map((m) => m[1]);
      l.after(h);
    }
    for (let l of n) l.parent.nodes.length > 1 ? l.remove() : l.parent.remove();
    vy(t, e, r);
  }
  function lu(t) {
    return (e) => {
      let r = YA(() => GA(e, t));
      vy(e, t, r);
    };
  }
  var Hs,
    UA,
    by = A(() => {
      u();
      qt();
      Hs = ce(it());
      $s();
      br();
      Nl();
      Bs();
      UA = (0, Hs.default)();
    });
  var xy = k((az, Qs) => {
    u();
    (function () {
      "use strict";
      function t(i, n, a) {
        if (!i) return null;
        t.caseSensitive || (i = i.toLowerCase());
        var s = t.threshold === null ? null : t.threshold * i.length,
          o = t.thresholdAbsolute,
          l;
        s !== null && o !== null
          ? (l = Math.min(s, o))
          : s !== null
          ? (l = s)
          : o !== null
          ? (l = o)
          : (l = null);
        var c,
          f,
          p,
          h,
          m,
          b = n.length;
        for (m = 0; m < b; m++)
          if (
            ((f = n[m]),
            a && (f = f[a]),
            !!f &&
              (t.caseSensitive ? (p = f) : (p = f.toLowerCase()),
              (h = r(i, p, l)),
              (l === null || h < l) &&
                ((l = h),
                a && t.returnWinningObject ? (c = n[m]) : (c = f),
                t.returnFirstMatch)))
          )
            return c;
        return c || t.nullResultValue;
      }
      (t.threshold = 0.4),
        (t.thresholdAbsolute = 20),
        (t.caseSensitive = !1),
        (t.nullResultValue = null),
        (t.returnWinningObject = null),
        (t.returnFirstMatch = !1),
        typeof Qs != "undefined" && Qs.exports
          ? (Qs.exports = t)
          : (window.didYouMean = t);
      var e = Math.pow(2, 32) - 1;
      function r(i, n, a) {
        a = a || a === 0 ? a : e;
        var s = i.length,
          o = n.length;
        if (s === 0) return Math.min(a + 1, o);
        if (o === 0) return Math.min(a + 1, s);
        if (Math.abs(s - o) > a) return a + 1;
        var l = [],
          c,
          f,
          p,
          h,
          m;
        for (c = 0; c <= o; c++) l[c] = [c];
        for (f = 0; f <= s; f++) l[0][f] = f;
        for (c = 1; c <= o; c++) {
          for (
            p = e,
              h = 1,
              c > a && (h = c - a),
              m = o + 1,
              m > a + c && (m = a + c),
              f = 1;
            f <= s;
            f++
          )
            f < h || f > m
              ? (l[c][f] = a + 1)
              : n.charAt(c - 1) === i.charAt(f - 1)
              ? (l[c][f] = l[c - 1][f - 1])
              : (l[c][f] = Math.min(
                  l[c - 1][f - 1] + 1,
                  Math.min(l[c][f - 1] + 1, l[c - 1][f] + 1)
                )),
              l[c][f] < p && (p = l[c][f]);
          if (p > a) return a + 1;
        }
        return l[o][s];
      }
    })();
  });
  var Sy = k((oz, ky) => {
    u();
    var uu = "(".charCodeAt(0),
      fu = ")".charCodeAt(0),
      Js = "'".charCodeAt(0),
      cu = '"'.charCodeAt(0),
      pu = "\\".charCodeAt(0),
      Tr = "/".charCodeAt(0),
      du = ",".charCodeAt(0),
      hu = ":".charCodeAt(0),
      Ks = "*".charCodeAt(0),
      JA = "u".charCodeAt(0),
      KA = "U".charCodeAt(0),
      XA = "+".charCodeAt(0),
      ZA = /^[a-f0-9?-]+$/i;
    ky.exports = function (t) {
      for (
        var e = [],
          r = t,
          i,
          n,
          a,
          s,
          o,
          l,
          c,
          f,
          p = 0,
          h = r.charCodeAt(p),
          m = r.length,
          b = [{ nodes: e }],
          S = 0,
          v,
          w = "",
          _ = "",
          T = "";
        p < m;

      )
        if (h <= 32) {
          i = p;
          do (i += 1), (h = r.charCodeAt(i));
          while (h <= 32);
          (s = r.slice(p, i)),
            (a = e[e.length - 1]),
            h === fu && S
              ? (T = s)
              : a && a.type === "div"
              ? ((a.after = s), (a.sourceEndIndex += s.length))
              : h === du ||
                h === hu ||
                (h === Tr &&
                  r.charCodeAt(i + 1) !== Ks &&
                  (!v || (v && v.type === "function" && !1)))
              ? (_ = s)
              : e.push({
                  type: "space",
                  sourceIndex: p,
                  sourceEndIndex: i,
                  value: s,
                }),
            (p = i);
        } else if (h === Js || h === cu) {
          (i = p),
            (n = h === Js ? "'" : '"'),
            (s = { type: "string", sourceIndex: p, quote: n });
          do
            if (((o = !1), (i = r.indexOf(n, i + 1)), ~i))
              for (l = i; r.charCodeAt(l - 1) === pu; ) (l -= 1), (o = !o);
            else (r += n), (i = r.length - 1), (s.unclosed = !0);
          while (o);
          (s.value = r.slice(p + 1, i)),
            (s.sourceEndIndex = s.unclosed ? i : i + 1),
            e.push(s),
            (p = i + 1),
            (h = r.charCodeAt(p));
        } else if (h === Tr && r.charCodeAt(p + 1) === Ks)
          (i = r.indexOf("*/", p)),
            (s = { type: "comment", sourceIndex: p, sourceEndIndex: i + 2 }),
            i === -1 &&
              ((s.unclosed = !0), (i = r.length), (s.sourceEndIndex = i)),
            (s.value = r.slice(p + 2, i)),
            e.push(s),
            (p = i + 2),
            (h = r.charCodeAt(p));
        else if ((h === Tr || h === Ks) && v && v.type === "function")
          (s = r[p]),
            e.push({
              type: "word",
              sourceIndex: p - _.length,
              sourceEndIndex: p + s.length,
              value: s,
            }),
            (p += 1),
            (h = r.charCodeAt(p));
        else if (h === Tr || h === du || h === hu)
          (s = r[p]),
            e.push({
              type: "div",
              sourceIndex: p - _.length,
              sourceEndIndex: p + s.length,
              value: s,
              before: _,
              after: "",
            }),
            (_ = ""),
            (p += 1),
            (h = r.charCodeAt(p));
        else if (uu === h) {
          i = p;
          do (i += 1), (h = r.charCodeAt(i));
          while (h <= 32);
          if (
            ((f = p),
            (s = {
              type: "function",
              sourceIndex: p - w.length,
              value: w,
              before: r.slice(f + 1, i),
            }),
            (p = i),
            w === "url" && h !== Js && h !== cu)
          ) {
            i -= 1;
            do
              if (((o = !1), (i = r.indexOf(")", i + 1)), ~i))
                for (l = i; r.charCodeAt(l - 1) === pu; ) (l -= 1), (o = !o);
              else (r += ")"), (i = r.length - 1), (s.unclosed = !0);
            while (o);
            c = i;
            do (c -= 1), (h = r.charCodeAt(c));
            while (h <= 32);
            f < c
              ? (p !== c + 1
                  ? (s.nodes = [
                      {
                        type: "word",
                        sourceIndex: p,
                        sourceEndIndex: c + 1,
                        value: r.slice(p, c + 1),
                      },
                    ])
                  : (s.nodes = []),
                s.unclosed && c + 1 !== i
                  ? ((s.after = ""),
                    s.nodes.push({
                      type: "space",
                      sourceIndex: c + 1,
                      sourceEndIndex: i,
                      value: r.slice(c + 1, i),
                    }))
                  : ((s.after = r.slice(c + 1, i)), (s.sourceEndIndex = i)))
              : ((s.after = ""), (s.nodes = [])),
              (p = i + 1),
              (s.sourceEndIndex = s.unclosed ? i : p),
              (h = r.charCodeAt(p)),
              e.push(s);
          } else
            (S += 1),
              (s.after = ""),
              (s.sourceEndIndex = p + 1),
              e.push(s),
              b.push(s),
              (e = s.nodes = []),
              (v = s);
          w = "";
        } else if (fu === h && S)
          (p += 1),
            (h = r.charCodeAt(p)),
            (v.after = T),
            (v.sourceEndIndex += T.length),
            (T = ""),
            (S -= 1),
            (b[b.length - 1].sourceEndIndex = p),
            b.pop(),
            (v = b[S]),
            (e = v.nodes);
        else {
          i = p;
          do h === pu && (i += 1), (i += 1), (h = r.charCodeAt(i));
          while (
            i < m &&
            !(
              h <= 32 ||
              h === Js ||
              h === cu ||
              h === du ||
              h === hu ||
              h === Tr ||
              h === uu ||
              (h === Ks && v && v.type === "function" && !0) ||
              (h === Tr && v.type === "function" && !0) ||
              (h === fu && S)
            )
          );
          (s = r.slice(p, i)),
            uu === h
              ? (w = s)
              : (JA === s.charCodeAt(0) || KA === s.charCodeAt(0)) &&
                XA === s.charCodeAt(1) &&
                ZA.test(s.slice(2))
              ? e.push({
                  type: "unicode-range",
                  sourceIndex: p,
                  sourceEndIndex: i,
                  value: s,
                })
              : e.push({
                  type: "word",
                  sourceIndex: p,
                  sourceEndIndex: i,
                  value: s,
                }),
            (p = i);
        }
      for (p = b.length - 1; p; p -= 1)
        (b[p].unclosed = !0), (b[p].sourceEndIndex = r.length);
      return b[0].nodes;
    };
  });
  var Ty = k((lz, _y) => {
    u();
    _y.exports = function t(e, r, i) {
      var n, a, s, o;
      for (n = 0, a = e.length; n < a; n += 1)
        (s = e[n]),
          i || (o = r(s, n, e)),
          o !== !1 &&
            s.type === "function" &&
            Array.isArray(s.nodes) &&
            t(s.nodes, r, i),
          i && r(s, n, e);
    };
  });
  var Cy = k((uz, Ay) => {
    u();
    function Oy(t, e) {
      var r = t.type,
        i = t.value,
        n,
        a;
      return e && (a = e(t)) !== void 0
        ? a
        : r === "word" || r === "space"
        ? i
        : r === "string"
        ? ((n = t.quote || ""), n + i + (t.unclosed ? "" : n))
        : r === "comment"
        ? "/*" + i + (t.unclosed ? "" : "*/")
        : r === "div"
        ? (t.before || "") + i + (t.after || "")
        : Array.isArray(t.nodes)
        ? ((n = Ey(t.nodes, e)),
          r !== "function"
            ? n
            : i +
              "(" +
              (t.before || "") +
              n +
              (t.after || "") +
              (t.unclosed ? "" : ")"))
        : i;
    }
    function Ey(t, e) {
      var r, i;
      if (Array.isArray(t)) {
        for (r = "", i = t.length - 1; ~i; i -= 1) r = Oy(t[i], e) + r;
        return r;
      }
      return Oy(t, e);
    }
    Ay.exports = Ey;
  });
  var Iy = k((fz, Py) => {
    u();
    var Xs = "-".charCodeAt(0),
      Zs = "+".charCodeAt(0),
      mu = ".".charCodeAt(0),
      eC = "e".charCodeAt(0),
      tC = "E".charCodeAt(0);
    function rC(t) {
      var e = t.charCodeAt(0),
        r;
      if (e === Zs || e === Xs) {
        if (((r = t.charCodeAt(1)), r >= 48 && r <= 57)) return !0;
        var i = t.charCodeAt(2);
        return r === mu && i >= 48 && i <= 57;
      }
      return e === mu
        ? ((r = t.charCodeAt(1)), r >= 48 && r <= 57)
        : e >= 48 && e <= 57;
    }
    Py.exports = function (t) {
      var e = 0,
        r = t.length,
        i,
        n,
        a;
      if (r === 0 || !rC(t)) return !1;
      for (
        i = t.charCodeAt(e), (i === Zs || i === Xs) && e++;
        e < r && ((i = t.charCodeAt(e)), !(i < 48 || i > 57));

      )
        e += 1;
      if (
        ((i = t.charCodeAt(e)),
        (n = t.charCodeAt(e + 1)),
        i === mu && n >= 48 && n <= 57)
      )
        for (e += 2; e < r && ((i = t.charCodeAt(e)), !(i < 48 || i > 57)); )
          e += 1;
      if (
        ((i = t.charCodeAt(e)),
        (n = t.charCodeAt(e + 1)),
        (a = t.charCodeAt(e + 2)),
        (i === eC || i === tC) &&
          ((n >= 48 && n <= 57) ||
            ((n === Zs || n === Xs) && a >= 48 && a <= 57)))
      )
        for (
          e += n === Zs || n === Xs ? 3 : 2;
          e < r && ((i = t.charCodeAt(e)), !(i < 48 || i > 57));

        )
          e += 1;
      return { number: t.slice(0, e), unit: t.slice(e) };
    };
  });
  var By = k((cz, Ry) => {
    u();
    var iC = Sy(),
      qy = Ty(),
      Dy = Cy();
    function Nt(t) {
      return this instanceof Nt ? ((this.nodes = iC(t)), this) : new Nt(t);
    }
    Nt.prototype.toString = function () {
      return Array.isArray(this.nodes) ? Dy(this.nodes) : "";
    };
    Nt.prototype.walk = function (t, e) {
      return qy(this.nodes, t, e), this;
    };
    Nt.unit = Iy();
    Nt.walk = qy;
    Nt.stringify = Dy;
    Ry.exports = Nt;
  });
  function yu(t) {
    return typeof t == "object" && t !== null;
  }
  function nC(t, e) {
    let r = Ot(e);
    do if ((r.pop(), (0, Hi.default)(t, r) !== void 0)) break;
    while (r.length);
    return r.length ? r : void 0;
  }
  function Or(t) {
    return typeof t == "string"
      ? t
      : t.reduce(
          (e, r, i) =>
            r.includes(".") ? `${e}[${r}]` : i === 0 ? r : `${e}.${r}`,
          ""
        );
  }
  function Ly(t) {
    return t.map((e) => `'${e}'`).join(", ");
  }
  function Fy(t) {
    return Ly(Object.keys(t));
  }
  function wu(t, e, r, i = {}) {
    let n = Array.isArray(e) ? Or(e) : e.replace(/^['"]+|['"]+$/g, ""),
      a = Array.isArray(e) ? e : Ot(n),
      s = (0, Hi.default)(t.theme, a, r);
    if (s === void 0) {
      let l = `'${n}' does not exist in your theme config.`,
        c = a.slice(0, -1),
        f = (0, Hi.default)(t.theme, c);
      if (yu(f)) {
        let p = Object.keys(f).filter((m) => wu(t, [...c, m]).isValid),
          h = (0, My.default)(a[a.length - 1], p);
        h
          ? (l += ` Did you mean '${Or([...c, h])}'?`)
          : p.length > 0 &&
            (l += ` '${Or(c)}' has the following valid keys: ${Ly(p)}`);
      } else {
        let p = nC(t.theme, n);
        if (p) {
          let h = (0, Hi.default)(t.theme, p);
          yu(h)
            ? (l += ` '${Or(p)}' has the following keys: ${Fy(h)}`)
            : (l += ` '${Or(p)}' is not an object.`);
        } else
          l += ` Your theme has the following top-level keys: ${Fy(t.theme)}`;
      }
      return { isValid: !1, error: l };
    }
    if (
      !(
        typeof s == "string" ||
        typeof s == "number" ||
        typeof s == "function" ||
        s instanceof String ||
        s instanceof Number ||
        Array.isArray(s)
      )
    ) {
      let l = `'${n}' was found but does not resolve to a string.`;
      if (yu(s)) {
        let c = Object.keys(s).filter((f) => wu(t, [...a, f]).isValid);
        c.length &&
          (l += ` Did you mean something like '${Or([...a, c[0]])}'?`);
      }
      return { isValid: !1, error: l };
    }
    let [o] = a;
    return { isValid: !0, value: mt(o)(s, i) };
  }
  function sC(t, e, r) {
    e = e.map((n) => Ny(t, n, r));
    let i = [""];
    for (let n of e)
      n.type === "div" && n.value === ","
        ? i.push("")
        : (i[i.length - 1] += gu.default.stringify(n));
    return i;
  }
  function Ny(t, e, r) {
    if (e.type === "function" && r[e.value] !== void 0) {
      let i = sC(t, e.nodes, r);
      (e.type = "word"), (e.value = r[e.value](t, ...i));
    }
    return e;
  }
  function aC(t, e, r) {
    return Object.keys(r).some((n) => e.includes(`${n}(`))
      ? (0, gu.default)(e)
          .walk((n) => {
            Ny(t, n, r);
          })
          .toString()
      : e;
  }
  function* lC(t) {
    t = t.replace(/^['"]+|['"]+$/g, "");
    let e = t.match(/^([^\s]+)(?![^\[]*\])(?:\s*\/\s*([^\/\s]+))$/),
      r;
    yield [t, void 0], e && ((t = e[1]), (r = e[2]), yield [t, r]);
  }
  function uC(t, e, r) {
    let i = Array.from(lC(e)).map(([n, a]) =>
      Object.assign(wu(t, n, r, { opacityValue: a }), {
        resolvedPath: n,
        alpha: a,
      })
    );
    return i.find((n) => n.isValid) ?? i[0];
  }
  function zy(t) {
    let e = t.tailwindConfig,
      r = {
        theme: (i, n, ...a) => {
          let {
            isValid: s,
            value: o,
            error: l,
            alpha: c,
          } = uC(e, n, a.length ? a : void 0);
          if (!s) {
            let h = i.parent,
              m = h?.raws.tailwind?.candidate;
            if (h && m !== void 0) {
              t.markInvalidUtilityNode(h),
                h.remove(),
                V.warn("invalid-theme-key-in-class", [
                  `The utility \`${m}\` contains an invalid theme value and was not generated.`,
                ]);
              return;
            }
            throw i.error(l);
          }
          let f = or(o),
            p = f !== void 0 && typeof f == "function";
          return (
            (c !== void 0 || p) && (c === void 0 && (c = 1), (o = et(f, c, f))),
            o
          );
        },
        screen: (i, n) => {
          n = n.replace(/^['"]+/g, "").replace(/['"]+$/g, "");
          let s = Rt(e.theme.screens).find(({ name: o }) => o === n);
          if (!s)
            throw i.error(`The '${n}' screen does not exist in your theme.`);
          return Dt(s);
        },
      };
    return (i) => {
      i.walk((n) => {
        let a = oC[n.type];
        a !== void 0 && (n[a] = aC(n, n[a], r));
      });
    };
  }
  var Hi,
    My,
    gu,
    oC,
    $y = A(() => {
      u();
      (Hi = ce(So())), (My = ce(xy()));
      Li();
      gu = ce(By());
      qs();
      Cs();
      qn();
      Kr();
      ti();
      Qe();
      oC = { atrule: "params", decl: "value" };
    });
  function jy({ tailwindConfig: { theme: t } }) {
    return function (e) {
      e.walkAtRules("screen", (r) => {
        let i = r.params,
          a = Rt(t.screens).find(({ name: s }) => s === i);
        if (!a) throw r.error(`No \`${i}\` screen found.`);
        (r.name = "media"), (r.params = Dt(a));
      });
    };
  }
  var Uy = A(() => {
    u();
    qs();
    Cs();
  });
  function fC(t) {
    let e = t
        .filter((o) =>
          o.type !== "pseudo" || o.nodes.length > 0
            ? !0
            : o.value.startsWith("::") ||
              [":before", ":after", ":first-line", ":first-letter"].includes(
                o.value
              )
        )
        .reverse(),
      r = new Set(["tag", "class", "id", "attribute"]),
      i = e.findIndex((o) => r.has(o.type));
    if (i === -1) return e.reverse().join("").trim();
    let n = e[i],
      a = Vy[n.type] ? Vy[n.type](n) : n;
    e = e.slice(0, i);
    let s = e.findIndex((o) => o.type === "combinator" && o.value === ">");
    return (
      s !== -1 && (e.splice(0, s), e.unshift(ea.default.universal())),
      [a, ...e.reverse()].join("").trim()
    );
  }
  function pC(t) {
    return vu.has(t) || vu.set(t, cC.transformSync(t)), vu.get(t);
  }
  function bu({ tailwindConfig: t }) {
    return (e) => {
      let r = new Map(),
        i = new Set();
      if (
        (e.walkAtRules("defaults", (n) => {
          if (n.nodes && n.nodes.length > 0) {
            i.add(n);
            return;
          }
          let a = n.params;
          r.has(a) || r.set(a, new Set()), r.get(a).add(n.parent), n.remove();
        }),
        he(t, "optimizeUniversalDefaults"))
      )
        for (let n of i) {
          let a = new Map(),
            s = r.get(n.params) ?? [];
          for (let o of s)
            for (let l of pC(o.selector)) {
              let c =
                  l.includes(":-") || l.includes("::-") || l.includes(":has")
                    ? l
                    : "__DEFAULT__",
                f = a.get(c) ?? new Set();
              a.set(c, f), f.add(l);
            }
          if (he(t, "optimizeUniversalDefaults")) {
            if (a.size === 0) {
              n.remove();
              continue;
            }
            for (let [, o] of a) {
              let l = J.rule({ source: n.source });
              (l.selectors = [...o]),
                l.append(n.nodes.map((c) => c.clone())),
                n.before(l);
            }
          }
          n.remove();
        }
      else if (i.size) {
        let n = J.rule({ selectors: ["*", "::before", "::after"] });
        for (let s of i)
          n.append(s.nodes),
            n.parent || s.before(n),
            n.source || (n.source = s.source),
            s.remove();
        let a = n.clone({ selectors: ["::backdrop"] });
        n.after(a);
      }
    };
  }
  var ea,
    Vy,
    cC,
    vu,
    Wy = A(() => {
      u();
      qt();
      ea = ce(it());
      ct();
      Vy = {
        id(t) {
          return ea.default.attribute({
            attribute: "id",
            operator: "=",
            value: t.value,
            quoteMark: '"',
          });
        },
      };
      (cC = (0, ea.default)((t) =>
        t.map((e) => {
          let r = e
            .split((i) => i.type === "combinator" && i.value === " ")
            .pop();
          return fC(r);
        })
      )),
        (vu = new Map());
    });
  function xu() {
    function t(e) {
      let r = null;
      e.each((i) => {
        if (!dC.has(i.type)) {
          r = null;
          return;
        }
        if (r === null) {
          r = i;
          return;
        }
        let n = Gy[i.type];
        i.type === "atrule" && i.name === "font-face"
          ? (r = i)
          : n.every(
              (a) =>
                (i[a] ?? "").replace(/\s+/g, " ") ===
                (r[a] ?? "").replace(/\s+/g, " ")
            )
          ? (i.nodes && r.append(i.nodes), i.remove())
          : (r = i);
      }),
        e.each((i) => {
          i.type === "atrule" && t(i);
        });
    }
    return (e) => {
      t(e);
    };
  }
  var Gy,
    dC,
    Hy = A(() => {
      u();
      (Gy = { atrule: ["name", "params"], rule: ["selector"] }),
        (dC = new Set(Object.keys(Gy)));
    });
  function ku() {
    return (t) => {
      t.walkRules((e) => {
        let r = new Map(),
          i = new Set([]),
          n = new Map();
        e.walkDecls((a) => {
          if (a.parent === e) {
            if (r.has(a.prop)) {
              if (r.get(a.prop).value === a.value) {
                i.add(r.get(a.prop)), r.set(a.prop, a);
                return;
              }
              n.has(a.prop) || n.set(a.prop, new Set()),
                n.get(a.prop).add(r.get(a.prop)),
                n.get(a.prop).add(a);
            }
            r.set(a.prop, a);
          }
        });
        for (let a of i) a.remove();
        for (let a of n.values()) {
          let s = new Map();
          for (let o of a) {
            let l = mC(o.value);
            l !== null && (s.has(l) || s.set(l, new Set()), s.get(l).add(o));
          }
          for (let o of s.values()) {
            let l = Array.from(o).slice(0, -1);
            for (let c of l) c.remove();
          }
        }
      });
    };
  }
  function mC(t) {
    let e = /^-?\d*.?\d+([\w%]+)?$/g.exec(t);
    return e ? e[1] ?? hC : null;
  }
  var hC,
    Yy = A(() => {
      u();
      hC = Symbol("unitless-number");
    });
  function gC(t) {
    if (!t.walkAtRules) return;
    let e = new Set();
    if (
      (t.walkAtRules("apply", (r) => {
        e.add(r.parent);
      }),
      e.size !== 0)
    )
      for (let r of e) {
        let i = [],
          n = [];
        for (let a of r.nodes)
          a.type === "atrule" && a.name === "apply"
            ? (n.length > 0 && (i.push(n), (n = [])), i.push([a]))
            : n.push(a);
        if ((n.length > 0 && i.push(n), i.length !== 1)) {
          for (let a of [...i].reverse()) {
            let s = r.clone({ nodes: [] });
            s.append(a), r.after(s);
          }
          r.remove();
        }
      }
  }
  function ta() {
    return (t) => {
      gC(t);
    };
  }
  var Qy = A(() => {
    u();
  });
  function ra(t) {
    return async function (e, r) {
      let { tailwindDirectives: i, applyDirectives: n } = iu(e);
      ta()(e, r);
      let a = t({
        tailwindDirectives: i,
        applyDirectives: n,
        registerDependency(s) {
          r.messages.push({ plugin: "tailwindcss", parent: r.opts.from, ...s });
        },
        createContext(s, o) {
          return Jl(s, o, e);
        },
      })(e, r);
      if (a.tailwindConfig.separator === "-")
        throw new Error(
          "The '-' character cannot be used as a custom separator in JIT mode due to parsing ambiguity. Please use another character like '_' instead."
        );
      hp(a.tailwindConfig),
        await au(a)(e, r),
        ta()(e, r),
        lu(a)(e, r),
        zy(a)(e, r),
        jy(a)(e, r),
        bu(a)(e, r),
        xu(a)(e, r),
        ku(a)(e, r);
    };
  }
  var Jy = A(() => {
    u();
    iy();
    hy();
    by();
    $y();
    Uy();
    Wy();
    Hy();
    Yy();
    Qy();
    zi();
    ct();
  });
  function Ky(t, e) {
    let r = null,
      i = null;
    return (
      t.walkAtRules("config", (n) => {
        if (((i = n.source?.input.file ?? e.opts.from ?? null), i === null))
          throw n.error(
            "The `@config` directive cannot be used without setting `from` in your PostCSS config."
          );
        if (r)
          throw n.error("Only one `@config` directive is allowed per file.");
        let a = n.params.match(/(['"])(.*?)\1/);
        if (!a)
          throw n.error(
            "A path is required when using the `@config` directive."
          );
        let s = a[2];
        if (me.isAbsolute(s))
          throw n.error(
            "The `@config` directive cannot be used with an absolute path."
          );
        if (((r = me.resolve(me.dirname(i), s)), !ge.existsSync(r)))
          throw n.error(
            `The config file at "${s}" does not exist. Make sure the path is correct and the file exists.`
          );
        n.remove();
      }),
      r || null
    );
  }
  var Xy = A(() => {
    u();
    ft();
    Yt();
  });
  var Zy = k((Yz, Su) => {
    u();
    ry();
    Jy();
    Mt();
    Xy();
    Su.exports = function (e) {
      return {
        postcssPlugin: "tailwindcss",
        plugins: [
          Xe.DEBUG &&
            function (r) {
              return (
                console.log(`
`),
                console.time("JIT TOTAL"),
                r
              );
            },
          async function (r, i) {
            e = Ky(r, i) ?? e;
            let n = ru(e);
            if (r.type === "document") {
              let a = r.nodes.filter((s) => s.type === "root");
              for (let s of a) s.type === "root" && (await ra(n)(s, i));
              return;
            }
            await ra(n)(r, i);
          },
          Xe.DEBUG &&
            function (r) {
              return (
                console.timeEnd("JIT TOTAL"),
                console.log(`
`),
                r
              );
            },
        ].filter(Boolean),
      };
    };
    Su.exports.postcss = !0;
  });
  var t0 = k((Qz, e0) => {
    u();
    e0.exports = Zy();
  });
  var _u = k((Jz, r0) => {
    u();
    r0.exports = () => [
      "and_chr 114",
      "and_uc 15.5",
      "chrome 114",
      "chrome 113",
      "chrome 109",
      "edge 114",
      "firefox 114",
      "ios_saf 16.5",
      "ios_saf 16.4",
      "ios_saf 16.3",
      "ios_saf 16.1",
      "opera 99",
      "safari 16.5",
      "samsung 21",
    ];
  });
  var ia = {};
  He(ia, { agents: () => yC, feature: () => wC });
  function wC() {
    return {
      status: "cr",
      title: "CSS Feature Queries",
      stats: {
        ie: { 6: "n", 7: "n", 8: "n", 9: "n", 10: "n", 11: "n", 5.5: "n" },
        edge: {
          12: "y",
          13: "y",
          14: "y",
          15: "y",
          16: "y",
          17: "y",
          18: "y",
          79: "y",
          80: "y",
          81: "y",
          83: "y",
          84: "y",
          85: "y",
          86: "y",
          87: "y",
          88: "y",
          89: "y",
          90: "y",
          91: "y",
          92: "y",
          93: "y",
          94: "y",
          95: "y",
          96: "y",
          97: "y",
          98: "y",
          99: "y",
          100: "y",
          101: "y",
          102: "y",
          103: "y",
          104: "y",
          105: "y",
          106: "y",
          107: "y",
          108: "y",
          109: "y",
          110: "y",
          111: "y",
          112: "y",
          113: "y",
          114: "y",
        },
        firefox: {
          2: "n",
          3: "n",
          4: "n",
          5: "n",
          6: "n",
          7: "n",
          8: "n",
          9: "n",
          10: "n",
          11: "n",
          12: "n",
          13: "n",
          14: "n",
          15: "n",
          16: "n",
          17: "n",
          18: "n",
          19: "n",
          20: "n",
          21: "n",
          22: "y",
          23: "y",
          24: "y",
          25: "y",
          26: "y",
          27: "y",
          28: "y",
          29: "y",
          30: "y",
          31: "y",
          32: "y",
          33: "y",
          34: "y",
          35: "y",
          36: "y",
          37: "y",
          38: "y",
          39: "y",
          40: "y",
          41: "y",
          42: "y",
          43: "y",
          44: "y",
          45: "y",
          46: "y",
          47: "y",
          48: "y",
          49: "y",
          50: "y",
          51: "y",
          52: "y",
          53: "y",
          54: "y",
          55: "y",
          56: "y",
          57: "y",
          58: "y",
          59: "y",
          60: "y",
          61: "y",
          62: "y",
          63: "y",
          64: "y",
          65: "y",
          66: "y",
          67: "y",
          68: "y",
          69: "y",
          70: "y",
          71: "y",
          72: "y",
          73: "y",
          74: "y",
          75: "y",
          76: "y",
          77: "y",
          78: "y",
          79: "y",
          80: "y",
          81: "y",
          82: "y",
          83: "y",
          84: "y",
          85: "y",
          86: "y",
          87: "y",
          88: "y",
          89: "y",
          90: "y",
          91: "y",
          92: "y",
          93: "y",
          94: "y",
          95: "y",
          96: "y",
          97: "y",
          98: "y",
          99: "y",
          100: "y",
          101: "y",
          102: "y",
          103: "y",
          104: "y",
          105: "y",
          106: "y",
          107: "y",
          108: "y",
          109: "y",
          110: "y",
          111: "y",
          112: "y",
          113: "y",
          114: "y",
          115: "y",
          116: "y",
          117: "y",
          3.5: "n",
          3.6: "n",
        },
        chrome: {
          4: "n",
          5: "n",
          6: "n",
          7: "n",
          8: "n",
          9: "n",
          10: "n",
          11: "n",
          12: "n",
          13: "n",
          14: "n",
          15: "n",
          16: "n",
          17: "n",
          18: "n",
          19: "n",
          20: "n",
          21: "n",
          22: "n",
          23: "n",
          24: "n",
          25: "n",
          26: "n",
          27: "n",
          28: "y",
          29: "y",
          30: "y",
          31: "y",
          32: "y",
          33: "y",
          34: "y",
          35: "y",
          36: "y",
          37: "y",
          38: "y",
          39: "y",
          40: "y",
          41: "y",
          42: "y",
          43: "y",
          44: "y",
          45: "y",
          46: "y",
          47: "y",
          48: "y",
          49: "y",
          50: "y",
          51: "y",
          52: "y",
          53: "y",
          54: "y",
          55: "y",
          56: "y",
          57: "y",
          58: "y",
          59: "y",
          60: "y",
          61: "y",
          62: "y",
          63: "y",
          64: "y",
          65: "y",
          66: "y",
          67: "y",
          68: "y",
          69: "y",
          70: "y",
          71: "y",
          72: "y",
          73: "y",
          74: "y",
          75: "y",
          76: "y",
          77: "y",
          78: "y",
          79: "y",
          80: "y",
          81: "y",
          83: "y",
          84: "y",
          85: "y",
          86: "y",
          87: "y",
          88: "y",
          89: "y",
          90: "y",
          91: "y",
          92: "y",
          93: "y",
          94: "y",
          95: "y",
          96: "y",
          97: "y",
          98: "y",
          99: "y",
          100: "y",
          101: "y",
          102: "y",
          103: "y",
          104: "y",
          105: "y",
          106: "y",
          107: "y",
          108: "y",
          109: "y",
          110: "y",
          111: "y",
          112: "y",
          113: "y",
          114: "y",
          115: "y",
          116: "y",
          117: "y",
        },
        safari: {
          4: "n",
          5: "n",
          6: "n",
          7: "n",
          8: "n",
          9: "y",
          10: "y",
          11: "y",
          12: "y",
          13: "y",
          14: "y",
          15: "y",
          17: "y",
          9.1: "y",
          10.1: "y",
          11.1: "y",
          12.1: "y",
          13.1: "y",
          14.1: "y",
          15.1: "y",
          "15.2-15.3": "y",
          15.4: "y",
          15.5: "y",
          15.6: "y",
          "16.0": "y",
          16.1: "y",
          16.2: "y",
          16.3: "y",
          16.4: "y",
          16.5: "y",
          16.6: "y",
          TP: "y",
          3.1: "n",
          3.2: "n",
          5.1: "n",
          6.1: "n",
          7.1: "n",
        },
        opera: {
          9: "n",
          11: "n",
          12: "n",
          15: "y",
          16: "y",
          17: "y",
          18: "y",
          19: "y",
          20: "y",
          21: "y",
          22: "y",
          23: "y",
          24: "y",
          25: "y",
          26: "y",
          27: "y",
          28: "y",
          29: "y",
          30: "y",
          31: "y",
          32: "y",
          33: "y",
          34: "y",
          35: "y",
          36: "y",
          37: "y",
          38: "y",
          39: "y",
          40: "y",
          41: "y",
          42: "y",
          43: "y",
          44: "y",
          45: "y",
          46: "y",
          47: "y",
          48: "y",
          49: "y",
          50: "y",
          51: "y",
          52: "y",
          53: "y",
          54: "y",
          55: "y",
          56: "y",
          57: "y",
          58: "y",
          60: "y",
          62: "y",
          63: "y",
          64: "y",
          65: "y",
          66: "y",
          67: "y",
          68: "y",
          69: "y",
          70: "y",
          71: "y",
          72: "y",
          73: "y",
          74: "y",
          75: "y",
          76: "y",
          77: "y",
          78: "y",
          79: "y",
          80: "y",
          81: "y",
          82: "y",
          83: "y",
          84: "y",
          85: "y",
          86: "y",
          87: "y",
          88: "y",
          89: "y",
          90: "y",
          91: "y",
          92: "y",
          93: "y",
          94: "y",
          95: "y",
          96: "y",
          97: "y",
          98: "y",
          99: "y",
          100: "y",
          12.1: "y",
          "9.5-9.6": "n",
          "10.0-10.1": "n",
          10.5: "n",
          10.6: "n",
          11.1: "n",
          11.5: "n",
          11.6: "n",
        },
        ios_saf: {
          8: "n",
          17: "y",
          "9.0-9.2": "y",
          9.3: "y",
          "10.0-10.2": "y",
          10.3: "y",
          "11.0-11.2": "y",
          "11.3-11.4": "y",
          "12.0-12.1": "y",
          "12.2-12.5": "y",
          "13.0-13.1": "y",
          13.2: "y",
          13.3: "y",
          "13.4-13.7": "y",
          "14.0-14.4": "y",
          "14.5-14.8": "y",
          "15.0-15.1": "y",
          "15.2-15.3": "y",
          15.4: "y",
          15.5: "y",
          15.6: "y",
          "16.0": "y",
          16.1: "y",
          16.2: "y",
          16.3: "y",
          16.4: "y",
          16.5: "y",
          16.6: "y",
          3.2: "n",
          "4.0-4.1": "n",
          "4.2-4.3": "n",
          "5.0-5.1": "n",
          "6.0-6.1": "n",
          "7.0-7.1": "n",
          "8.1-8.4": "n",
        },
        op_mini: { all: "y" },
        android: {
          3: "n",
          4: "n",
          114: "y",
          4.4: "y",
          "4.4.3-4.4.4": "y",
          2.1: "n",
          2.2: "n",
          2.3: "n",
          4.1: "n",
          "4.2-4.3": "n",
        },
        bb: { 7: "n", 10: "n" },
        op_mob: {
          10: "n",
          11: "n",
          12: "n",
          73: "y",
          11.1: "n",
          11.5: "n",
          12.1: "n",
        },
        and_chr: { 114: "y" },
        and_ff: { 115: "y" },
        ie_mob: { 10: "n", 11: "n" },
        and_uc: { 15.5: "y" },
        samsung: {
          4: "y",
          20: "y",
          21: "y",
          "5.0-5.4": "y",
          "6.2-6.4": "y",
          "7.2-7.4": "y",
          8.2: "y",
          9.2: "y",
          10.1: "y",
          "11.1-11.2": "y",
          "12.0": "y",
          "13.0": "y",
          "14.0": "y",
          "15.0": "y",
          "16.0": "y",
          "17.0": "y",
          "18.0": "y",
          "19.0": "y",
        },
        and_qq: { 13.1: "y" },
        baidu: { 13.18: "y" },
        kaios: { 2.5: "y", "3.0-3.1": "y" },
      },
    };
  }
  var yC,
    na = A(() => {
      u();
      yC = {
        ie: { prefix: "ms" },
        edge: {
          prefix: "webkit",
          prefix_exceptions: {
            12: "ms",
            13: "ms",
            14: "ms",
            15: "ms",
            16: "ms",
            17: "ms",
            18: "ms",
          },
        },
        firefox: { prefix: "moz" },
        chrome: { prefix: "webkit" },
        safari: { prefix: "webkit" },
        opera: {
          prefix: "webkit",
          prefix_exceptions: {
            9: "o",
            11: "o",
            12: "o",
            "9.5-9.6": "o",
            "10.0-10.1": "o",
            10.5: "o",
            10.6: "o",
            11.1: "o",
            11.5: "o",
            11.6: "o",
            12.1: "o",
          },
        },
        ios_saf: { prefix: "webkit" },
        op_mini: { prefix: "o" },
        android: { prefix: "webkit" },
        bb: { prefix: "webkit" },
        op_mob: { prefix: "o", prefix_exceptions: { 73: "webkit" } },
        and_chr: { prefix: "webkit" },
        and_ff: { prefix: "moz" },
        ie_mob: { prefix: "ms" },
        and_uc: { prefix: "webkit", prefix_exceptions: { 15.5: "webkit" } },
        samsung: { prefix: "webkit" },
        and_qq: { prefix: "webkit" },
        baidu: { prefix: "webkit" },
        kaios: { prefix: "moz" },
      };
    });
  var i0 = k(() => {
    u();
  });
  var Oe = k((Zz, zt) => {
    u();
    var { list: Tu } = Re();
    zt.exports.error = function (t) {
      let e = new Error(t);
      throw ((e.autoprefixer = !0), e);
    };
    zt.exports.uniq = function (t) {
      return [...new Set(t)];
    };
    zt.exports.removeNote = function (t) {
      return t.includes(" ") ? t.split(" ")[0] : t;
    };
    zt.exports.escapeRegexp = function (t) {
      return t.replace(/[$()*+-.?[\\\]^{|}]/g, "\\$&");
    };
    zt.exports.regexp = function (t, e = !0) {
      return (
        e && (t = this.escapeRegexp(t)),
        new RegExp(`(^|[\\s,(])(${t}($|[\\s(,]))`, "gi")
      );
    };
    zt.exports.editList = function (t, e) {
      let r = Tu.comma(t),
        i = e(r, []);
      if (r === i) return t;
      let n = t.match(/,\s*/);
      return (n = n ? n[0] : ", "), i.join(n);
    };
    zt.exports.splitSelector = function (t) {
      return Tu.comma(t).map((e) =>
        Tu.space(e).map((r) => r.split(/(?=\.|#)/g))
      );
    };
  });
  var $t = k((e9, a0) => {
    u();
    var vC = _u(),
      n0 = (na(), ia).agents,
      bC = Oe(),
      s0 = class {
        static prefixes() {
          if (this.prefixesCache) return this.prefixesCache;
          this.prefixesCache = [];
          for (let e in n0) this.prefixesCache.push(`-${n0[e].prefix}-`);
          return (
            (this.prefixesCache = bC
              .uniq(this.prefixesCache)
              .sort((e, r) => r.length - e.length)),
            this.prefixesCache
          );
        }
        static withPrefix(e) {
          return (
            this.prefixesRegexp ||
              (this.prefixesRegexp = new RegExp(this.prefixes().join("|"))),
            this.prefixesRegexp.test(e)
          );
        }
        constructor(e, r, i, n) {
          (this.data = e),
            (this.options = i || {}),
            (this.browserslistOpts = n || {}),
            (this.selected = this.parse(r));
        }
        parse(e) {
          let r = {};
          for (let i in this.browserslistOpts) r[i] = this.browserslistOpts[i];
          return (r.path = this.options.from), vC(e, r);
        }
        prefix(e) {
          let [r, i] = e.split(" "),
            n = this.data[r],
            a = n.prefix_exceptions && n.prefix_exceptions[i];
          return a || (a = n.prefix), `-${a}-`;
        }
        isSelected(e) {
          return this.selected.includes(e);
        }
      };
    a0.exports = s0;
  });
  var Yi = k((t9, o0) => {
    u();
    o0.exports = {
      prefix(t) {
        let e = t.match(/^(-\w+-)/);
        return e ? e[0] : "";
      },
      unprefixed(t) {
        return t.replace(/^-\w+-/, "");
      },
    };
  });
  var Er = k((r9, u0) => {
    u();
    var xC = $t(),
      l0 = Yi(),
      kC = Oe();
    function Ou(t, e) {
      let r = new t.constructor();
      for (let i of Object.keys(t || {})) {
        let n = t[i];
        i === "parent" && typeof n == "object"
          ? e && (r[i] = e)
          : i === "source" || i === null
          ? (r[i] = n)
          : Array.isArray(n)
          ? (r[i] = n.map((a) => Ou(a, r)))
          : i !== "_autoprefixerPrefix" &&
            i !== "_autoprefixerValues" &&
            i !== "proxyCache" &&
            (typeof n == "object" && n !== null && (n = Ou(n, r)), (r[i] = n));
      }
      return r;
    }
    var sa = class {
      static hack(e) {
        return (
          this.hacks || (this.hacks = {}),
          e.names.map((r) => ((this.hacks[r] = e), this.hacks[r]))
        );
      }
      static load(e, r, i) {
        let n = this.hacks && this.hacks[e];
        return n ? new n(e, r, i) : new this(e, r, i);
      }
      static clone(e, r) {
        let i = Ou(e);
        for (let n in r) i[n] = r[n];
        return i;
      }
      constructor(e, r, i) {
        (this.prefixes = r), (this.name = e), (this.all = i);
      }
      parentPrefix(e) {
        let r;
        return (
          typeof e._autoprefixerPrefix != "undefined"
            ? (r = e._autoprefixerPrefix)
            : e.type === "decl" && e.prop[0] === "-"
            ? (r = l0.prefix(e.prop))
            : e.type === "root"
            ? (r = !1)
            : e.type === "rule" &&
              e.selector.includes(":-") &&
              /:(-\w+-)/.test(e.selector)
            ? (r = e.selector.match(/:(-\w+-)/)[1])
            : e.type === "atrule" && e.name[0] === "-"
            ? (r = l0.prefix(e.name))
            : (r = this.parentPrefix(e.parent)),
          xC.prefixes().includes(r) || (r = !1),
          (e._autoprefixerPrefix = r),
          e._autoprefixerPrefix
        );
      }
      process(e, r) {
        if (!this.check(e)) return;
        let i = this.parentPrefix(e),
          n = this.prefixes.filter((s) => !i || i === kC.removeNote(s)),
          a = [];
        for (let s of n) this.add(e, s, a.concat([s]), r) && a.push(s);
        return a;
      }
      clone(e, r) {
        return sa.clone(e, r);
      }
    };
    u0.exports = sa;
  });
  var j = k((i9, p0) => {
    u();
    var SC = Er(),
      _C = $t(),
      f0 = Oe(),
      c0 = class extends SC {
        check() {
          return !0;
        }
        prefixed(e, r) {
          return r + e;
        }
        normalize(e) {
          return e;
        }
        otherPrefixes(e, r) {
          for (let i of _C.prefixes()) if (i !== r && e.includes(i)) return !0;
          return !1;
        }
        set(e, r) {
          return (e.prop = this.prefixed(e.prop, r)), e;
        }
        needCascade(e) {
          return (
            e._autoprefixerCascade ||
              (e._autoprefixerCascade =
                this.all.options.cascade !== !1 &&
                e.raw("before").includes(`
`)),
            e._autoprefixerCascade
          );
        }
        maxPrefixed(e, r) {
          if (r._autoprefixerMax) return r._autoprefixerMax;
          let i = 0;
          for (let n of e)
            (n = f0.removeNote(n)), n.length > i && (i = n.length);
          return (r._autoprefixerMax = i), r._autoprefixerMax;
        }
        calcBefore(e, r, i = "") {
          let a = this.maxPrefixed(e, r) - f0.removeNote(i).length,
            s = r.raw("before");
          return a > 0 && (s += Array(a).fill(" ").join("")), s;
        }
        restoreBefore(e) {
          let r = e.raw("before").split(`
`),
            i = r[r.length - 1];
          this.all.group(e).up((n) => {
            let a = n.raw("before").split(`
`),
              s = a[a.length - 1];
            s.length < i.length && (i = s);
          }),
            (r[r.length - 1] = i),
            (e.raws.before = r.join(`
`));
        }
        insert(e, r, i) {
          let n = this.set(this.clone(e), r);
          if (
            !(
              !n ||
              e.parent.some((s) => s.prop === n.prop && s.value === n.value)
            )
          )
            return (
              this.needCascade(e) && (n.raws.before = this.calcBefore(i, e, r)),
              e.parent.insertBefore(e, n)
            );
        }
        isAlready(e, r) {
          let i = this.all.group(e).up((n) => n.prop === r);
          return i || (i = this.all.group(e).down((n) => n.prop === r)), i;
        }
        add(e, r, i, n) {
          let a = this.prefixed(e.prop, r);
          if (!(this.isAlready(e, a) || this.otherPrefixes(e.value, r)))
            return this.insert(e, r, i, n);
        }
        process(e, r) {
          if (!this.needCascade(e)) {
            super.process(e, r);
            return;
          }
          let i = super.process(e, r);
          !i ||
            !i.length ||
            (this.restoreBefore(e), (e.raws.before = this.calcBefore(i, e)));
        }
        old(e, r) {
          return [this.prefixed(e, r)];
        }
      };
    p0.exports = c0;
  });
  var h0 = k((n9, d0) => {
    u();
    d0.exports = function t(e) {
      return {
        mul: (r) => new t(e * r),
        div: (r) => new t(e / r),
        simplify: () => new t(e),
        toString: () => e.toString(),
      };
    };
  });
  var y0 = k((s9, g0) => {
    u();
    var TC = h0(),
      OC = Er(),
      Eu = Oe(),
      EC = /(min|max)-resolution\s*:\s*\d*\.?\d+(dppx|dpcm|dpi|x)/gi,
      AC = /(min|max)-resolution(\s*:\s*)(\d*\.?\d+)(dppx|dpcm|dpi|x)/i,
      m0 = class extends OC {
        prefixName(e, r) {
          return e === "-moz-"
            ? r + "--moz-device-pixel-ratio"
            : e + r + "-device-pixel-ratio";
        }
        prefixQuery(e, r, i, n, a) {
          return (
            (n = new TC(n)),
            a === "dpi"
              ? (n = n.div(96))
              : a === "dpcm" && (n = n.mul(2.54).div(96)),
            (n = n.simplify()),
            e === "-o-" && (n = n.n + "/" + n.d),
            this.prefixName(e, r) + i + n
          );
        }
        clean(e) {
          if (!this.bad) {
            this.bad = [];
            for (let r of this.prefixes)
              this.bad.push(this.prefixName(r, "min")),
                this.bad.push(this.prefixName(r, "max"));
          }
          e.params = Eu.editList(e.params, (r) =>
            r.filter((i) => this.bad.every((n) => !i.includes(n)))
          );
        }
        process(e) {
          let r = this.parentPrefix(e),
            i = r ? [r] : this.prefixes;
          e.params = Eu.editList(e.params, (n, a) => {
            for (let s of n) {
              if (
                !s.includes("min-resolution") &&
                !s.includes("max-resolution")
              ) {
                a.push(s);
                continue;
              }
              for (let o of i) {
                let l = s.replace(EC, (c) => {
                  let f = c.match(AC);
                  return this.prefixQuery(o, f[1], f[2], f[3], f[4]);
                });
                a.push(l);
              }
              a.push(s);
            }
            return Eu.uniq(a);
          });
        }
      };
    g0.exports = m0;
  });
  var v0 = k((a9, w0) => {
    u();
    var Au = "(".charCodeAt(0),
      Cu = ")".charCodeAt(0),
      aa = "'".charCodeAt(0),
      Pu = '"'.charCodeAt(0),
      Iu = "\\".charCodeAt(0),
      Ar = "/".charCodeAt(0),
      qu = ",".charCodeAt(0),
      Du = ":".charCodeAt(0),
      oa = "*".charCodeAt(0),
      CC = "u".charCodeAt(0),
      PC = "U".charCodeAt(0),
      IC = "+".charCodeAt(0),
      qC = /^[a-f0-9?-]+$/i;
    w0.exports = function (t) {
      for (
        var e = [],
          r = t,
          i,
          n,
          a,
          s,
          o,
          l,
          c,
          f,
          p = 0,
          h = r.charCodeAt(p),
          m = r.length,
          b = [{ nodes: e }],
          S = 0,
          v,
          w = "",
          _ = "",
          T = "";
        p < m;

      )
        if (h <= 32) {
          i = p;
          do (i += 1), (h = r.charCodeAt(i));
          while (h <= 32);
          (s = r.slice(p, i)),
            (a = e[e.length - 1]),
            h === Cu && S
              ? (T = s)
              : a && a.type === "div"
              ? ((a.after = s), (a.sourceEndIndex += s.length))
              : h === qu ||
                h === Du ||
                (h === Ar &&
                  r.charCodeAt(i + 1) !== oa &&
                  (!v || (v && v.type === "function" && v.value !== "calc")))
              ? (_ = s)
              : e.push({
                  type: "space",
                  sourceIndex: p,
                  sourceEndIndex: i,
                  value: s,
                }),
            (p = i);
        } else if (h === aa || h === Pu) {
          (i = p),
            (n = h === aa ? "'" : '"'),
            (s = { type: "string", sourceIndex: p, quote: n });
          do
            if (((o = !1), (i = r.indexOf(n, i + 1)), ~i))
              for (l = i; r.charCodeAt(l - 1) === Iu; ) (l -= 1), (o = !o);
            else (r += n), (i = r.length - 1), (s.unclosed = !0);
          while (o);
          (s.value = r.slice(p + 1, i)),
            (s.sourceEndIndex = s.unclosed ? i : i + 1),
            e.push(s),
            (p = i + 1),
            (h = r.charCodeAt(p));
        } else if (h === Ar && r.charCodeAt(p + 1) === oa)
          (i = r.indexOf("*/", p)),
            (s = { type: "comment", sourceIndex: p, sourceEndIndex: i + 2 }),
            i === -1 &&
              ((s.unclosed = !0), (i = r.length), (s.sourceEndIndex = i)),
            (s.value = r.slice(p + 2, i)),
            e.push(s),
            (p = i + 2),
            (h = r.charCodeAt(p));
        else if (
          (h === Ar || h === oa) &&
          v &&
          v.type === "function" &&
          v.value === "calc"
        )
          (s = r[p]),
            e.push({
              type: "word",
              sourceIndex: p - _.length,
              sourceEndIndex: p + s.length,
              value: s,
            }),
            (p += 1),
            (h = r.charCodeAt(p));
        else if (h === Ar || h === qu || h === Du)
          (s = r[p]),
            e.push({
              type: "div",
              sourceIndex: p - _.length,
              sourceEndIndex: p + s.length,
              value: s,
              before: _,
              after: "",
            }),
            (_ = ""),
            (p += 1),
            (h = r.charCodeAt(p));
        else if (Au === h) {
          i = p;
          do (i += 1), (h = r.charCodeAt(i));
          while (h <= 32);
          if (
            ((f = p),
            (s = {
              type: "function",
              sourceIndex: p - w.length,
              value: w,
              before: r.slice(f + 1, i),
            }),
            (p = i),
            w === "url" && h !== aa && h !== Pu)
          ) {
            i -= 1;
            do
              if (((o = !1), (i = r.indexOf(")", i + 1)), ~i))
                for (l = i; r.charCodeAt(l - 1) === Iu; ) (l -= 1), (o = !o);
              else (r += ")"), (i = r.length - 1), (s.unclosed = !0);
            while (o);
            c = i;
            do (c -= 1), (h = r.charCodeAt(c));
            while (h <= 32);
            f < c
              ? (p !== c + 1
                  ? (s.nodes = [
                      {
                        type: "word",
                        sourceIndex: p,
                        sourceEndIndex: c + 1,
                        value: r.slice(p, c + 1),
                      },
                    ])
                  : (s.nodes = []),
                s.unclosed && c + 1 !== i
                  ? ((s.after = ""),
                    s.nodes.push({
                      type: "space",
                      sourceIndex: c + 1,
                      sourceEndIndex: i,
                      value: r.slice(c + 1, i),
                    }))
                  : ((s.after = r.slice(c + 1, i)), (s.sourceEndIndex = i)))
              : ((s.after = ""), (s.nodes = [])),
              (p = i + 1),
              (s.sourceEndIndex = s.unclosed ? i : p),
              (h = r.charCodeAt(p)),
              e.push(s);
          } else
            (S += 1),
              (s.after = ""),
              (s.sourceEndIndex = p + 1),
              e.push(s),
              b.push(s),
              (e = s.nodes = []),
              (v = s);
          w = "";
        } else if (Cu === h && S)
          (p += 1),
            (h = r.charCodeAt(p)),
            (v.after = T),
            (v.sourceEndIndex += T.length),
            (T = ""),
            (S -= 1),
            (b[b.length - 1].sourceEndIndex = p),
            b.pop(),
            (v = b[S]),
            (e = v.nodes);
        else {
          i = p;
          do h === Iu && (i += 1), (i += 1), (h = r.charCodeAt(i));
          while (
            i < m &&
            !(
              h <= 32 ||
              h === aa ||
              h === Pu ||
              h === qu ||
              h === Du ||
              h === Ar ||
              h === Au ||
              (h === oa && v && v.type === "function" && v.value === "calc") ||
              (h === Ar && v.type === "function" && v.value === "calc") ||
              (h === Cu && S)
            )
          );
          (s = r.slice(p, i)),
            Au === h
              ? (w = s)
              : (CC === s.charCodeAt(0) || PC === s.charCodeAt(0)) &&
                IC === s.charCodeAt(1) &&
                qC.test(s.slice(2))
              ? e.push({
                  type: "unicode-range",
                  sourceIndex: p,
                  sourceEndIndex: i,
                  value: s,
                })
              : e.push({
                  type: "word",
                  sourceIndex: p,
                  sourceEndIndex: i,
                  value: s,
                }),
            (p = i);
        }
      for (p = b.length - 1; p; p -= 1)
        (b[p].unclosed = !0), (b[p].sourceEndIndex = r.length);
      return b[0].nodes;
    };
  });
  var x0 = k((o9, b0) => {
    u();
    b0.exports = function t(e, r, i) {
      var n, a, s, o;
      for (n = 0, a = e.length; n < a; n += 1)
        (s = e[n]),
          i || (o = r(s, n, e)),
          o !== !1 &&
            s.type === "function" &&
            Array.isArray(s.nodes) &&
            t(s.nodes, r, i),
          i && r(s, n, e);
    };
  });
  var T0 = k((l9, _0) => {
    u();
    function k0(t, e) {
      var r = t.type,
        i = t.value,
        n,
        a;
      return e && (a = e(t)) !== void 0
        ? a
        : r === "word" || r === "space"
        ? i
        : r === "string"
        ? ((n = t.quote || ""), n + i + (t.unclosed ? "" : n))
        : r === "comment"
        ? "/*" + i + (t.unclosed ? "" : "*/")
        : r === "div"
        ? (t.before || "") + i + (t.after || "")
        : Array.isArray(t.nodes)
        ? ((n = S0(t.nodes, e)),
          r !== "function"
            ? n
            : i +
              "(" +
              (t.before || "") +
              n +
              (t.after || "") +
              (t.unclosed ? "" : ")"))
        : i;
    }
    function S0(t, e) {
      var r, i;
      if (Array.isArray(t)) {
        for (r = "", i = t.length - 1; ~i; i -= 1) r = k0(t[i], e) + r;
        return r;
      }
      return k0(t, e);
    }
    _0.exports = S0;
  });
  var E0 = k((u9, O0) => {
    u();
    var la = "-".charCodeAt(0),
      ua = "+".charCodeAt(0),
      Ru = ".".charCodeAt(0),
      DC = "e".charCodeAt(0),
      RC = "E".charCodeAt(0);
    function BC(t) {
      var e = t.charCodeAt(0),
        r;
      if (e === ua || e === la) {
        if (((r = t.charCodeAt(1)), r >= 48 && r <= 57)) return !0;
        var i = t.charCodeAt(2);
        return r === Ru && i >= 48 && i <= 57;
      }
      return e === Ru
        ? ((r = t.charCodeAt(1)), r >= 48 && r <= 57)
        : e >= 48 && e <= 57;
    }
    O0.exports = function (t) {
      var e = 0,
        r = t.length,
        i,
        n,
        a;
      if (r === 0 || !BC(t)) return !1;
      for (
        i = t.charCodeAt(e), (i === ua || i === la) && e++;
        e < r && ((i = t.charCodeAt(e)), !(i < 48 || i > 57));

      )
        e += 1;
      if (
        ((i = t.charCodeAt(e)),
        (n = t.charCodeAt(e + 1)),
        i === Ru && n >= 48 && n <= 57)
      )
        for (e += 2; e < r && ((i = t.charCodeAt(e)), !(i < 48 || i > 57)); )
          e += 1;
      if (
        ((i = t.charCodeAt(e)),
        (n = t.charCodeAt(e + 1)),
        (a = t.charCodeAt(e + 2)),
        (i === DC || i === RC) &&
          ((n >= 48 && n <= 57) ||
            ((n === ua || n === la) && a >= 48 && a <= 57)))
      )
        for (
          e += n === ua || n === la ? 3 : 2;
          e < r && ((i = t.charCodeAt(e)), !(i < 48 || i > 57));

        )
          e += 1;
      return { number: t.slice(0, e), unit: t.slice(e) };
    };
  });
  var fa = k((f9, P0) => {
    u();
    var MC = v0(),
      A0 = x0(),
      C0 = T0();
    function jt(t) {
      return this instanceof jt ? ((this.nodes = MC(t)), this) : new jt(t);
    }
    jt.prototype.toString = function () {
      return Array.isArray(this.nodes) ? C0(this.nodes) : "";
    };
    jt.prototype.walk = function (t, e) {
      return A0(this.nodes, t, e), this;
    };
    jt.unit = E0();
    jt.walk = A0;
    jt.stringify = C0;
    P0.exports = jt;
  });
  var B0 = k((c9, R0) => {
    u();
    var { list: LC } = Re(),
      I0 = fa(),
      FC = $t(),
      q0 = Yi(),
      D0 = class {
        constructor(e) {
          (this.props = ["transition", "transition-property"]),
            (this.prefixes = e);
        }
        add(e, r) {
          let i,
            n,
            a = this.prefixes.add[e.prop],
            s = this.ruleVendorPrefixes(e),
            o = s || (a && a.prefixes) || [],
            l = this.parse(e.value),
            c = l.map((m) => this.findProp(m)),
            f = [];
          if (c.some((m) => m[0] === "-")) return;
          for (let m of l) {
            if (((n = this.findProp(m)), n[0] === "-")) continue;
            let b = this.prefixes.add[n];
            if (!(!b || !b.prefixes))
              for (i of b.prefixes) {
                if (s && !s.some((v) => i.includes(v))) continue;
                let S = this.prefixes.prefixed(n, i);
                S !== "-ms-transform" &&
                  !c.includes(S) &&
                  (this.disabled(n, i) || f.push(this.clone(n, S, m)));
              }
          }
          l = l.concat(f);
          let p = this.stringify(l),
            h = this.stringify(this.cleanFromUnprefixed(l, "-webkit-"));
          if (
            (o.includes("-webkit-") &&
              this.cloneBefore(e, `-webkit-${e.prop}`, h),
            this.cloneBefore(e, e.prop, h),
            o.includes("-o-"))
          ) {
            let m = this.stringify(this.cleanFromUnprefixed(l, "-o-"));
            this.cloneBefore(e, `-o-${e.prop}`, m);
          }
          for (i of o)
            if (i !== "-webkit-" && i !== "-o-") {
              let m = this.stringify(this.cleanOtherPrefixes(l, i));
              this.cloneBefore(e, i + e.prop, m);
            }
          p !== e.value &&
            !this.already(e, e.prop, p) &&
            (this.checkForWarning(r, e), e.cloneBefore(), (e.value = p));
        }
        findProp(e) {
          let r = e[0].value;
          if (/^\d/.test(r)) {
            for (let [i, n] of e.entries())
              if (i !== 0 && n.type === "word") return n.value;
          }
          return r;
        }
        already(e, r, i) {
          return e.parent.some((n) => n.prop === r && n.value === i);
        }
        cloneBefore(e, r, i) {
          this.already(e, r, i) || e.cloneBefore({ prop: r, value: i });
        }
        checkForWarning(e, r) {
          if (r.prop !== "transition-property") return;
          let i = !1,
            n = !1;
          r.parent.each((a) => {
            if (a.type !== "decl" || a.prop.indexOf("transition-") !== 0)
              return;
            let s = LC.comma(a.value);
            if (a.prop === "transition-property") {
              s.forEach((o) => {
                let l = this.prefixes.add[o];
                l && l.prefixes && l.prefixes.length > 0 && (i = !0);
              });
              return;
            }
            return (n = n || s.length > 1), !1;
          }),
            i &&
              n &&
              r.warn(
                e,
                "Replace transition-property to transition, because Autoprefixer could not support any cases of transition-property and other transition-*"
              );
        }
        remove(e) {
          let r = this.parse(e.value);
          r = r.filter((s) => {
            let o = this.prefixes.remove[this.findProp(s)];
            return !o || !o.remove;
          });
          let i = this.stringify(r);
          if (e.value === i) return;
          if (r.length === 0) {
            e.remove();
            return;
          }
          let n = e.parent.some((s) => s.prop === e.prop && s.value === i),
            a = e.parent.some(
              (s) => s !== e && s.prop === e.prop && s.value.length > i.length
            );
          if (n || a) {
            e.remove();
            return;
          }
          e.value = i;
        }
        parse(e) {
          let r = I0(e),
            i = [],
            n = [];
          for (let a of r.nodes)
            n.push(a),
              a.type === "div" && a.value === "," && (i.push(n), (n = []));
          return i.push(n), i.filter((a) => a.length > 0);
        }
        stringify(e) {
          if (e.length === 0) return "";
          let r = [];
          for (let i of e)
            i[i.length - 1].type !== "div" && i.push(this.div(e)),
              (r = r.concat(i));
          return (
            r[0].type === "div" && (r = r.slice(1)),
            r[r.length - 1].type === "div" &&
              (r = r.slice(0, -2 + 1 || void 0)),
            I0.stringify({ nodes: r })
          );
        }
        clone(e, r, i) {
          let n = [],
            a = !1;
          for (let s of i)
            !a && s.type === "word" && s.value === e
              ? (n.push({ type: "word", value: r }), (a = !0))
              : n.push(s);
          return n;
        }
        div(e) {
          for (let r of e)
            for (let i of r) if (i.type === "div" && i.value === ",") return i;
          return { type: "div", value: ",", after: " " };
        }
        cleanOtherPrefixes(e, r) {
          return e.filter((i) => {
            let n = q0.prefix(this.findProp(i));
            return n === "" || n === r;
          });
        }
        cleanFromUnprefixed(e, r) {
          let i = e
              .map((a) => this.findProp(a))
              .filter((a) => a.slice(0, r.length) === r)
              .map((a) => this.prefixes.unprefixed(a)),
            n = [];
          for (let a of e) {
            let s = this.findProp(a),
              o = q0.prefix(s);
            !i.includes(s) && (o === r || o === "") && n.push(a);
          }
          return n;
        }
        disabled(e, r) {
          let i = ["order", "justify-content", "align-self", "align-content"];
          if (e.includes("flex") || i.includes(e)) {
            if (this.prefixes.options.flexbox === !1) return !0;
            if (this.prefixes.options.flexbox === "no-2009")
              return r.includes("2009");
          }
        }
        ruleVendorPrefixes(e) {
          let { parent: r } = e;
          if (r.type !== "rule") return !1;
          if (!r.selector.includes(":-")) return !1;
          let i = FC.prefixes().filter((n) => r.selector.includes(":" + n));
          return i.length > 0 ? i : !1;
        }
      };
    R0.exports = D0;
  });
  var Cr = k((p9, L0) => {
    u();
    var NC = Oe(),
      M0 = class {
        constructor(e, r, i, n) {
          (this.unprefixed = e),
            (this.prefixed = r),
            (this.string = i || r),
            (this.regexp = n || NC.regexp(r));
        }
        check(e) {
          return e.includes(this.string) ? !!e.match(this.regexp) : !1;
        }
      };
    L0.exports = M0;
  });
  var $e = k((d9, N0) => {
    u();
    var zC = Er(),
      $C = Cr(),
      jC = Yi(),
      UC = Oe(),
      F0 = class extends zC {
        static save(e, r) {
          let i = r.prop,
            n = [];
          for (let a in r._autoprefixerValues) {
            let s = r._autoprefixerValues[a];
            if (s === r.value) continue;
            let o,
              l = jC.prefix(i);
            if (l === "-pie-") continue;
            if (l === a) {
              (o = r.value = s), n.push(o);
              continue;
            }
            let c = e.prefixed(i, a),
              f = r.parent;
            if (!f.every((b) => b.prop !== c)) {
              n.push(o);
              continue;
            }
            let p = s.replace(/\s+/, " ");
            if (
              f.some(
                (b) => b.prop === r.prop && b.value.replace(/\s+/, " ") === p
              )
            ) {
              n.push(o);
              continue;
            }
            let m = this.clone(r, { value: s });
            (o = r.parent.insertBefore(r, m)), n.push(o);
          }
          return n;
        }
        check(e) {
          let r = e.value;
          return r.includes(this.name) ? !!r.match(this.regexp()) : !1;
        }
        regexp() {
          return this.regexpCache || (this.regexpCache = UC.regexp(this.name));
        }
        replace(e, r) {
          return e.replace(this.regexp(), `$1${r}$2`);
        }
        value(e) {
          return e.raws.value && e.raws.value.value === e.value
            ? e.raws.value.raw
            : e.value;
        }
        add(e, r) {
          e._autoprefixerValues || (e._autoprefixerValues = {});
          let i = e._autoprefixerValues[r] || this.value(e),
            n;
          do if (((n = i), (i = this.replace(i, r)), i === !1)) return;
          while (i !== n);
          e._autoprefixerValues[r] = i;
        }
        old(e) {
          return new $C(this.name, e + this.name);
        }
      };
    N0.exports = F0;
  });
  var Ut = k((h9, z0) => {
    u();
    z0.exports = {};
  });
  var Mu = k((m9, U0) => {
    u();
    var $0 = fa(),
      VC = $e(),
      WC = Ut().insertAreas,
      GC = /(^|[^-])linear-gradient\(\s*(top|left|right|bottom)/i,
      HC = /(^|[^-])radial-gradient\(\s*\d+(\w*|%)\s+\d+(\w*|%)\s*,/i,
      YC = /(!\s*)?autoprefixer:\s*ignore\s+next/i,
      QC = /(!\s*)?autoprefixer\s*grid:\s*(on|off|(no-)?autoplace)/i,
      JC = [
        "width",
        "height",
        "min-width",
        "max-width",
        "min-height",
        "max-height",
        "inline-size",
        "min-inline-size",
        "max-inline-size",
        "block-size",
        "min-block-size",
        "max-block-size",
      ];
    function Bu(t) {
      return t.parent.some(
        (e) => e.prop === "grid-template" || e.prop === "grid-template-areas"
      );
    }
    function KC(t) {
      let e = t.parent.some((i) => i.prop === "grid-template-rows"),
        r = t.parent.some((i) => i.prop === "grid-template-columns");
      return e && r;
    }
    var j0 = class {
      constructor(e) {
        this.prefixes = e;
      }
      add(e, r) {
        let i = this.prefixes.add["@resolution"],
          n = this.prefixes.add["@keyframes"],
          a = this.prefixes.add["@viewport"],
          s = this.prefixes.add["@supports"];
        e.walkAtRules((f) => {
          if (f.name === "keyframes") {
            if (!this.disabled(f, r)) return n && n.process(f);
          } else if (f.name === "viewport") {
            if (!this.disabled(f, r)) return a && a.process(f);
          } else if (f.name === "supports") {
            if (this.prefixes.options.supports !== !1 && !this.disabled(f, r))
              return s.process(f);
          } else if (
            f.name === "media" &&
            f.params.includes("-resolution") &&
            !this.disabled(f, r)
          )
            return i && i.process(f);
        }),
          e.walkRules((f) => {
            if (!this.disabled(f, r))
              return this.prefixes.add.selectors.map((p) => p.process(f, r));
          });
        function o(f) {
          return f.parent.nodes.some((p) => {
            if (p.type !== "decl") return !1;
            let h = p.prop === "display" && /(inline-)?grid/.test(p.value),
              m = p.prop.startsWith("grid-template"),
              b = /^grid-([A-z]+-)?gap/.test(p.prop);
            return h || m || b;
          });
        }
        function l(f) {
          return f.parent.some(
            (p) => p.prop === "display" && /(inline-)?flex/.test(p.value)
          );
        }
        let c =
          this.gridStatus(e, r) &&
          this.prefixes.add["grid-area"] &&
          this.prefixes.add["grid-area"].prefixes;
        return (
          e.walkDecls((f) => {
            if (this.disabledDecl(f, r)) return;
            let p = f.parent,
              h = f.prop,
              m = f.value;
            if (h === "grid-row-span") {
              r.warn(
                "grid-row-span is not part of final Grid Layout. Use grid-row.",
                { node: f }
              );
              return;
            } else if (h === "grid-column-span") {
              r.warn(
                "grid-column-span is not part of final Grid Layout. Use grid-column.",
                { node: f }
              );
              return;
            } else if (h === "display" && m === "box") {
              r.warn(
                "You should write display: flex by final spec instead of display: box",
                { node: f }
              );
              return;
            } else if (h === "text-emphasis-position")
              (m === "under" || m === "over") &&
                r.warn(
                  "You should use 2 values for text-emphasis-position For example, `under left` instead of just `under`.",
                  { node: f }
                );
            else if (/^(align|justify|place)-(items|content)$/.test(h) && l(f))
              (m === "start" || m === "end") &&
                r.warn(
                  `${m} value has mixed support, consider using flex-${m} instead`,
                  { node: f }
                );
            else if (h === "text-decoration-skip" && m === "ink")
              r.warn(
                "Replace text-decoration-skip: ink to text-decoration-skip-ink: auto, because spec had been changed",
                { node: f }
              );
            else {
              if (c && this.gridStatus(f, r))
                if (
                  (f.value === "subgrid" &&
                    r.warn("IE does not support subgrid", { node: f }),
                  /^(align|justify|place)-items$/.test(h) && o(f))
                ) {
                  let S = h.replace("-items", "-self");
                  r.warn(
                    `IE does not support ${h} on grid containers. Try using ${S} on child elements instead: ${f.parent.selector} > * { ${S}: ${f.value} }`,
                    { node: f }
                  );
                } else if (/^(align|justify|place)-content$/.test(h) && o(f))
                  r.warn(`IE does not support ${f.prop} on grid containers`, {
                    node: f,
                  });
                else if (h === "display" && f.value === "contents") {
                  r.warn(
                    "Please do not use display: contents; if you have grid setting enabled",
                    { node: f }
                  );
                  return;
                } else if (f.prop === "grid-gap") {
                  let S = this.gridStatus(f, r);
                  S === "autoplace" && !KC(f) && !Bu(f)
                    ? r.warn(
                        "grid-gap only works if grid-template(-areas) is being used or both rows and columns have been declared and cells have not been manually placed inside the explicit grid",
                        { node: f }
                      )
                    : (S === !0 || S === "no-autoplace") &&
                      !Bu(f) &&
                      r.warn(
                        "grid-gap only works if grid-template(-areas) is being used",
                        { node: f }
                      );
                } else if (h === "grid-auto-columns") {
                  r.warn("grid-auto-columns is not supported by IE", {
                    node: f,
                  });
                  return;
                } else if (h === "grid-auto-rows") {
                  r.warn("grid-auto-rows is not supported by IE", { node: f });
                  return;
                } else if (h === "grid-auto-flow") {
                  let S = p.some((w) => w.prop === "grid-template-rows"),
                    v = p.some((w) => w.prop === "grid-template-columns");
                  Bu(f)
                    ? r.warn("grid-auto-flow is not supported by IE", {
                        node: f,
                      })
                    : m.includes("dense")
                    ? r.warn("grid-auto-flow: dense is not supported by IE", {
                        node: f,
                      })
                    : !S &&
                      !v &&
                      r.warn(
                        "grid-auto-flow works only if grid-template-rows and grid-template-columns are present in the same rule",
                        { node: f }
                      );
                  return;
                } else if (m.includes("auto-fit")) {
                  r.warn("auto-fit value is not supported by IE", {
                    node: f,
                    word: "auto-fit",
                  });
                  return;
                } else if (m.includes("auto-fill")) {
                  r.warn("auto-fill value is not supported by IE", {
                    node: f,
                    word: "auto-fill",
                  });
                  return;
                } else
                  h.startsWith("grid-template") &&
                    m.includes("[") &&
                    r.warn(
                      "Autoprefixer currently does not support line names. Try using grid-template-areas instead.",
                      { node: f, word: "[" }
                    );
              if (m.includes("radial-gradient"))
                if (HC.test(f.value))
                  r.warn(
                    "Gradient has outdated direction syntax. New syntax is like `closest-side at 0 0` instead of `0 0, closest-side`.",
                    { node: f }
                  );
                else {
                  let S = $0(m);
                  for (let v of S.nodes)
                    if (v.type === "function" && v.value === "radial-gradient")
                      for (let w of v.nodes)
                        w.type === "word" &&
                          (w.value === "cover"
                            ? r.warn(
                                "Gradient has outdated direction syntax. Replace `cover` to `farthest-corner`.",
                                { node: f }
                              )
                            : w.value === "contain" &&
                              r.warn(
                                "Gradient has outdated direction syntax. Replace `contain` to `closest-side`.",
                                { node: f }
                              ));
                }
              m.includes("linear-gradient") &&
                GC.test(m) &&
                r.warn(
                  "Gradient has outdated direction syntax. New syntax is like `to left` instead of `right`.",
                  { node: f }
                );
            }
            JC.includes(f.prop) &&
              (f.value.includes("-fill-available") ||
                (f.value.includes("fill-available")
                  ? r.warn(
                      "Replace fill-available to stretch, because spec had been changed",
                      { node: f }
                    )
                  : f.value.includes("fill") &&
                    $0(m).nodes.some(
                      (v) => v.type === "word" && v.value === "fill"
                    ) &&
                    r.warn(
                      "Replace fill to stretch, because spec had been changed",
                      { node: f }
                    )));
            let b;
            if (f.prop === "transition" || f.prop === "transition-property")
              return this.prefixes.transition.add(f, r);
            if (f.prop === "align-self") {
              if (
                (this.displayType(f) !== "grid" &&
                  this.prefixes.options.flexbox !== !1 &&
                  ((b = this.prefixes.add["align-self"]),
                  b && b.prefixes && b.process(f)),
                this.gridStatus(f, r) !== !1 &&
                  ((b = this.prefixes.add["grid-row-align"]), b && b.prefixes))
              )
                return b.process(f, r);
            } else if (f.prop === "justify-self") {
              if (
                this.gridStatus(f, r) !== !1 &&
                ((b = this.prefixes.add["grid-column-align"]), b && b.prefixes)
              )
                return b.process(f, r);
            } else if (f.prop === "place-self") {
              if (
                ((b = this.prefixes.add["place-self"]),
                b && b.prefixes && this.gridStatus(f, r) !== !1)
              )
                return b.process(f, r);
            } else if (((b = this.prefixes.add[f.prop]), b && b.prefixes))
              return b.process(f, r);
          }),
          this.gridStatus(e, r) && WC(e, this.disabled),
          e.walkDecls((f) => {
            if (this.disabledValue(f, r)) return;
            let p = this.prefixes.unprefixed(f.prop),
              h = this.prefixes.values("add", p);
            if (Array.isArray(h)) for (let m of h) m.process && m.process(f, r);
            VC.save(this.prefixes, f);
          })
        );
      }
      remove(e, r) {
        let i = this.prefixes.remove["@resolution"];
        e.walkAtRules((n, a) => {
          this.prefixes.remove[`@${n.name}`]
            ? this.disabled(n, r) || n.parent.removeChild(a)
            : n.name === "media" &&
              n.params.includes("-resolution") &&
              i &&
              i.clean(n);
        });
        for (let n of this.prefixes.remove.selectors)
          e.walkRules((a, s) => {
            n.check(a) && (this.disabled(a, r) || a.parent.removeChild(s));
          });
        return e.walkDecls((n, a) => {
          if (this.disabled(n, r)) return;
          let s = n.parent,
            o = this.prefixes.unprefixed(n.prop);
          if (
            ((n.prop === "transition" || n.prop === "transition-property") &&
              this.prefixes.transition.remove(n),
            this.prefixes.remove[n.prop] && this.prefixes.remove[n.prop].remove)
          ) {
            let l = this.prefixes
              .group(n)
              .down((c) => this.prefixes.normalize(c.prop) === o);
            if (
              (o === "flex-flow" && (l = !0), n.prop === "-webkit-box-orient")
            ) {
              let c = { "flex-direction": !0, "flex-flow": !0 };
              if (!n.parent.some((f) => c[f.prop])) return;
            }
            if (l && !this.withHackValue(n)) {
              n.raw("before").includes(`
`) && this.reduceSpaces(n),
                s.removeChild(a);
              return;
            }
          }
          for (let l of this.prefixes.values("remove", o)) {
            if (!l.check || !l.check(n.value)) continue;
            if (
              ((o = l.unprefixed),
              this.prefixes.group(n).down((f) => f.value.includes(o)))
            ) {
              s.removeChild(a);
              return;
            }
          }
        });
      }
      withHackValue(e) {
        return e.prop === "-webkit-background-clip" && e.value === "text";
      }
      disabledValue(e, r) {
        return (this.gridStatus(e, r) === !1 &&
          e.type === "decl" &&
          e.prop === "display" &&
          e.value.includes("grid")) ||
          (this.prefixes.options.flexbox === !1 &&
            e.type === "decl" &&
            e.prop === "display" &&
            e.value.includes("flex")) ||
          (e.type === "decl" && e.prop === "content")
          ? !0
          : this.disabled(e, r);
      }
      disabledDecl(e, r) {
        if (
          this.gridStatus(e, r) === !1 &&
          e.type === "decl" &&
          (e.prop.includes("grid") || e.prop === "justify-items")
        )
          return !0;
        if (this.prefixes.options.flexbox === !1 && e.type === "decl") {
          let i = ["order", "justify-content", "align-items", "align-content"];
          if (e.prop.includes("flex") || i.includes(e.prop)) return !0;
        }
        return this.disabled(e, r);
      }
      disabled(e, r) {
        if (!e) return !1;
        if (e._autoprefixerDisabled !== void 0) return e._autoprefixerDisabled;
        if (e.parent) {
          let n = e.prev();
          if (n && n.type === "comment" && YC.test(n.text))
            return (
              (e._autoprefixerDisabled = !0),
              (e._autoprefixerSelfDisabled = !0),
              !0
            );
        }
        let i = null;
        if (e.nodes) {
          let n;
          e.each((a) => {
            a.type === "comment" &&
              /(!\s*)?autoprefixer:\s*(off|on)/i.test(a.text) &&
              (typeof n != "undefined"
                ? r.warn(
                    "Second Autoprefixer control comment was ignored. Autoprefixer applies control comment to whole block, not to next rules.",
                    { node: a }
                  )
                : (n = /on/i.test(a.text)));
          }),
            n !== void 0 && (i = !n);
        }
        if (!e.nodes || i === null)
          if (e.parent) {
            let n = this.disabled(e.parent, r);
            e.parent._autoprefixerSelfDisabled === !0 ? (i = !1) : (i = n);
          } else i = !1;
        return (e._autoprefixerDisabled = i), i;
      }
      reduceSpaces(e) {
        let r = !1;
        if ((this.prefixes.group(e).up(() => ((r = !0), !0)), r)) return;
        let i = e.raw("before").split(`
`),
          n = i[i.length - 1].length,
          a = !1;
        this.prefixes.group(e).down((s) => {
          i = s.raw("before").split(`
`);
          let o = i.length - 1;
          i[o].length > n &&
            (a === !1 && (a = i[o].length - n),
            (i[o] = i[o].slice(0, -a)),
            (s.raws.before = i.join(`
`)));
        });
      }
      displayType(e) {
        for (let r of e.parent.nodes)
          if (r.prop === "display") {
            if (r.value.includes("flex")) return "flex";
            if (r.value.includes("grid")) return "grid";
          }
        return !1;
      }
      gridStatus(e, r) {
        if (!e) return !1;
        if (e._autoprefixerGridStatus !== void 0)
          return e._autoprefixerGridStatus;
        let i = null;
        if (e.nodes) {
          let n;
          e.each((a) => {
            if (a.type === "comment" && QC.test(a.text)) {
              let s = /:\s*autoplace/i.test(a.text),
                o = /no-autoplace/i.test(a.text);
              typeof n != "undefined"
                ? r.warn(
                    "Second Autoprefixer grid control comment was ignored. Autoprefixer applies control comments to the whole block, not to the next rules.",
                    { node: a }
                  )
                : s
                ? (n = "autoplace")
                : o
                ? (n = !0)
                : (n = /on/i.test(a.text));
            }
          }),
            n !== void 0 && (i = n);
        }
        if (e.type === "atrule" && e.name === "supports") {
          let n = e.params;
          n.includes("grid") && n.includes("auto") && (i = !1);
        }
        if (!e.nodes || i === null)
          if (e.parent) {
            let n = this.gridStatus(e.parent, r);
            e.parent._autoprefixerSelfDisabled === !0 ? (i = !1) : (i = n);
          } else
            typeof this.prefixes.options.grid != "undefined"
              ? (i = this.prefixes.options.grid)
              : typeof g.env.AUTOPREFIXER_GRID != "undefined"
              ? g.env.AUTOPREFIXER_GRID === "autoplace"
                ? (i = "autoplace")
                : (i = !0)
              : (i = !1);
        return (e._autoprefixerGridStatus = i), i;
      }
    };
    U0.exports = j0;
  });
  var W0 = k((g9, V0) => {
    u();
    V0.exports = {
      A: {
        A: { 2: "K E F G A B JC" },
        B: {
          1: "C L M H N D O P Q R S T U V W X Y Z a b c d e f g h i j n o p q r s t u v w x y z I",
        },
        C: {
          1: "2 3 4 5 6 7 8 9 AB BB CB DB EB FB GB HB IB JB KB LB MB NB OB PB QB RB SB TB UB VB WB XB YB ZB aB bB cB 0B dB 1B eB fB gB hB iB jB kB lB mB nB oB m pB qB rB sB tB P Q R 2B S T U V W X Y Z a b c d e f g h i j n o p q r s t u v w x y z I uB 3B 4B",
          2: "0 1 KC zB J K E F G A B C L M H N D O k l LC MC",
        },
        D: {
          1: "8 9 AB BB CB DB EB FB GB HB IB JB KB LB MB NB OB PB QB RB SB TB UB VB WB XB YB ZB aB bB cB 0B dB 1B eB fB gB hB iB jB kB lB mB nB oB m pB qB rB sB tB P Q R S T U V W X Y Z a b c d e f g h i j n o p q r s t u v w x y z I uB 3B 4B",
          2: "0 1 2 3 4 5 6 7 J K E F G A B C L M H N D O k l",
        },
        E: {
          1: "G A B C L M H D RC 6B vB wB 7B SC TC 8B 9B xB AC yB BC CC DC EC FC GC UC",
          2: "0 J K E F NC 5B OC PC QC",
        },
        F: {
          1: "1 2 3 4 5 6 7 8 9 H N D O k l AB BB CB DB EB FB GB HB IB JB KB LB MB NB OB PB QB RB SB TB UB VB WB XB YB ZB aB bB cB dB eB fB gB hB iB jB kB lB mB nB oB m pB qB rB sB tB P Q R 2B S T U V W X Y Z a b c d e f g h i j wB",
          2: "G B C VC WC XC YC vB HC ZC",
        },
        G: {
          1: "D fC gC hC iC jC kC lC mC nC oC pC qC rC sC tC 8B 9B xB AC yB BC CC DC EC FC GC",
          2: "F 5B aC IC bC cC dC eC",
        },
        H: { 1: "uC" },
        I: { 1: "I zC 0C", 2: "zB J vC wC xC yC IC" },
        J: { 2: "E A" },
        K: { 1: "m", 2: "A B C vB HC wB" },
        L: { 1: "I" },
        M: { 1: "uB" },
        N: { 2: "A B" },
        O: { 1: "xB" },
        P: { 1: "J k l 1C 2C 3C 4C 5C 6B 6C 7C 8C 9C AD yB BD CD DD" },
        Q: { 1: "7B" },
        R: { 1: "ED" },
        S: { 1: "FD GD" },
      },
      B: 4,
      C: "CSS Feature Queries",
    };
  });
  var Q0 = k((y9, Y0) => {
    u();
    function G0(t) {
      return t[t.length - 1];
    }
    var H0 = {
      parse(t) {
        let e = [""],
          r = [e];
        for (let i of t) {
          if (i === "(") {
            (e = [""]), G0(r).push(e), r.push(e);
            continue;
          }
          if (i === ")") {
            r.pop(), (e = G0(r)), e.push("");
            continue;
          }
          e[e.length - 1] += i;
        }
        return r[0];
      },
      stringify(t) {
        let e = "";
        for (let r of t) {
          if (typeof r == "object") {
            e += `(${H0.stringify(r)})`;
            continue;
          }
          e += r;
        }
        return e;
      },
    };
    Y0.exports = H0;
  });
  var ew = k((w9, Z0) => {
    u();
    var XC = W0(),
      { feature: ZC } = (na(), ia),
      { parse: eP } = Re(),
      tP = $t(),
      Lu = Q0(),
      rP = $e(),
      iP = Oe(),
      J0 = ZC(XC),
      K0 = [];
    for (let t in J0.stats) {
      let e = J0.stats[t];
      for (let r in e) {
        let i = e[r];
        /y/.test(i) && K0.push(t + " " + r);
      }
    }
    var X0 = class {
      constructor(e, r) {
        (this.Prefixes = e), (this.all = r);
      }
      prefixer() {
        if (this.prefixerCache) return this.prefixerCache;
        let e = this.all.browsers.selected.filter((i) => K0.includes(i)),
          r = new tP(this.all.browsers.data, e, this.all.options);
        return (
          (this.prefixerCache = new this.Prefixes(
            this.all.data,
            r,
            this.all.options
          )),
          this.prefixerCache
        );
      }
      parse(e) {
        let r = e.split(":"),
          i = r[0],
          n = r[1];
        return n || (n = ""), [i.trim(), n.trim()];
      }
      virtual(e) {
        let [r, i] = this.parse(e),
          n = eP("a{}").first;
        return n.append({ prop: r, value: i, raws: { before: "" } }), n;
      }
      prefixed(e) {
        let r = this.virtual(e);
        if (this.disabled(r.first)) return r.nodes;
        let i = { warn: () => null },
          n = this.prefixer().add[r.first.prop];
        n && n.process && n.process(r.first, i);
        for (let a of r.nodes) {
          for (let s of this.prefixer().values("add", r.first.prop))
            s.process(a);
          rP.save(this.all, a);
        }
        return r.nodes;
      }
      isNot(e) {
        return typeof e == "string" && /not\s*/i.test(e);
      }
      isOr(e) {
        return typeof e == "string" && /\s*or\s*/i.test(e);
      }
      isProp(e) {
        return (
          typeof e == "object" && e.length === 1 && typeof e[0] == "string"
        );
      }
      isHack(e, r) {
        return !new RegExp(`(\\(|\\s)${iP.escapeRegexp(r)}:`).test(e);
      }
      toRemove(e, r) {
        let [i, n] = this.parse(e),
          a = this.all.unprefixed(i),
          s = this.all.cleaner();
        if (s.remove[i] && s.remove[i].remove && !this.isHack(r, a)) return !0;
        for (let o of s.values("remove", a)) if (o.check(n)) return !0;
        return !1;
      }
      remove(e, r) {
        let i = 0;
        for (; i < e.length; ) {
          if (
            !this.isNot(e[i - 1]) &&
            this.isProp(e[i]) &&
            this.isOr(e[i + 1])
          ) {
            if (this.toRemove(e[i][0], r)) {
              e.splice(i, 2);
              continue;
            }
            i += 2;
            continue;
          }
          typeof e[i] == "object" && (e[i] = this.remove(e[i], r)), (i += 1);
        }
        return e;
      }
      cleanBrackets(e) {
        return e.map((r) =>
          typeof r != "object"
            ? r
            : r.length === 1 && typeof r[0] == "object"
            ? this.cleanBrackets(r[0])
            : this.cleanBrackets(r)
        );
      }
      convert(e) {
        let r = [""];
        for (let i of e) r.push([`${i.prop}: ${i.value}`]), r.push(" or ");
        return (r[r.length - 1] = ""), r;
      }
      normalize(e) {
        if (typeof e != "object") return e;
        if (((e = e.filter((r) => r !== "")), typeof e[0] == "string")) {
          let r = e[0].trim();
          if (r.includes(":") || r === "selector" || r === "not selector")
            return [Lu.stringify(e)];
        }
        return e.map((r) => this.normalize(r));
      }
      add(e, r) {
        return e.map((i) => {
          if (this.isProp(i)) {
            let n = this.prefixed(i[0]);
            return n.length > 1 ? this.convert(n) : i;
          }
          return typeof i == "object" ? this.add(i, r) : i;
        });
      }
      process(e) {
        let r = Lu.parse(e.params);
        (r = this.normalize(r)),
          (r = this.remove(r, e.params)),
          (r = this.add(r, e.params)),
          (r = this.cleanBrackets(r)),
          (e.params = Lu.stringify(r));
      }
      disabled(e) {
        if (
          !this.all.options.grid &&
          ((e.prop === "display" && e.value.includes("grid")) ||
            e.prop.includes("grid") ||
            e.prop === "justify-items")
        )
          return !0;
        if (this.all.options.flexbox === !1) {
          if (e.prop === "display" && e.value.includes("flex")) return !0;
          let r = ["order", "justify-content", "align-items", "align-content"];
          if (e.prop.includes("flex") || r.includes(e.prop)) return !0;
        }
        return !1;
      }
    };
    Z0.exports = X0;
  });
  var iw = k((v9, rw) => {
    u();
    var tw = class {
      constructor(e, r) {
        (this.prefix = r),
          (this.prefixed = e.prefixed(this.prefix)),
          (this.regexp = e.regexp(this.prefix)),
          (this.prefixeds = e
            .possible()
            .map((i) => [e.prefixed(i), e.regexp(i)])),
          (this.unprefixed = e.name),
          (this.nameRegexp = e.regexp());
      }
      isHack(e) {
        let r = e.parent.index(e) + 1,
          i = e.parent.nodes;
        for (; r < i.length; ) {
          let n = i[r].selector;
          if (!n) return !0;
          if (n.includes(this.unprefixed) && n.match(this.nameRegexp))
            return !1;
          let a = !1;
          for (let [s, o] of this.prefixeds)
            if (n.includes(s) && n.match(o)) {
              a = !0;
              break;
            }
          if (!a) return !0;
          r += 1;
        }
        return !0;
      }
      check(e) {
        return !(
          !e.selector.includes(this.prefixed) ||
          !e.selector.match(this.regexp) ||
          this.isHack(e)
        );
      }
    };
    rw.exports = tw;
  });
  var Pr = k((b9, sw) => {
    u();
    var { list: nP } = Re(),
      sP = iw(),
      aP = Er(),
      oP = $t(),
      lP = Oe(),
      nw = class extends aP {
        constructor(e, r, i) {
          super(e, r, i);
          this.regexpCache = new Map();
        }
        check(e) {
          return e.selector.includes(this.name)
            ? !!e.selector.match(this.regexp())
            : !1;
        }
        prefixed(e) {
          return this.name.replace(/^(\W*)/, `$1${e}`);
        }
        regexp(e) {
          if (!this.regexpCache.has(e)) {
            let r = e ? this.prefixed(e) : this.name;
            this.regexpCache.set(
              e,
              new RegExp(`(^|[^:"'=])${lP.escapeRegexp(r)}`, "gi")
            );
          }
          return this.regexpCache.get(e);
        }
        possible() {
          return oP.prefixes();
        }
        prefixeds(e) {
          if (e._autoprefixerPrefixeds) {
            if (e._autoprefixerPrefixeds[this.name])
              return e._autoprefixerPrefixeds;
          } else e._autoprefixerPrefixeds = {};
          let r = {};
          if (e.selector.includes(",")) {
            let n = nP.comma(e.selector).filter((a) => a.includes(this.name));
            for (let a of this.possible())
              r[a] = n.map((s) => this.replace(s, a)).join(", ");
          } else
            for (let i of this.possible()) r[i] = this.replace(e.selector, i);
          return (
            (e._autoprefixerPrefixeds[this.name] = r), e._autoprefixerPrefixeds
          );
        }
        already(e, r, i) {
          let n = e.parent.index(e) - 1;
          for (; n >= 0; ) {
            let a = e.parent.nodes[n];
            if (a.type !== "rule") return !1;
            let s = !1;
            for (let o in r[this.name]) {
              let l = r[this.name][o];
              if (a.selector === l) {
                if (i === o) return !0;
                s = !0;
                break;
              }
            }
            if (!s) return !1;
            n -= 1;
          }
          return !1;
        }
        replace(e, r) {
          return e.replace(this.regexp(), `$1${this.prefixed(r)}`);
        }
        add(e, r) {
          let i = this.prefixeds(e);
          if (this.already(e, i, r)) return;
          let n = this.clone(e, { selector: i[this.name][r] });
          e.parent.insertBefore(e, n);
        }
        old(e) {
          return new sP(this, e);
        }
      };
    sw.exports = nw;
  });
  var lw = k((x9, ow) => {
    u();
    var uP = Er(),
      aw = class extends uP {
        add(e, r) {
          let i = r + e.name;
          if (e.parent.some((s) => s.name === i && s.params === e.params))
            return;
          let a = this.clone(e, { name: i });
          return e.parent.insertBefore(e, a);
        }
        process(e) {
          let r = this.parentPrefix(e);
          for (let i of this.prefixes) (!r || r === i) && this.add(e, i);
        }
      };
    ow.exports = aw;
  });
  var fw = k((k9, uw) => {
    u();
    var fP = Pr(),
      Fu = class extends fP {
        prefixed(e) {
          return e === "-webkit-"
            ? ":-webkit-full-screen"
            : e === "-moz-"
            ? ":-moz-full-screen"
            : `:${e}fullscreen`;
        }
      };
    Fu.names = [":fullscreen"];
    uw.exports = Fu;
  });
  var pw = k((S9, cw) => {
    u();
    var cP = Pr(),
      Nu = class extends cP {
        possible() {
          return super.possible().concat(["-moz- old", "-ms- old"]);
        }
        prefixed(e) {
          return e === "-webkit-"
            ? "::-webkit-input-placeholder"
            : e === "-ms-"
            ? "::-ms-input-placeholder"
            : e === "-ms- old"
            ? ":-ms-input-placeholder"
            : e === "-moz- old"
            ? ":-moz-placeholder"
            : `::${e}placeholder`;
        }
      };
    Nu.names = ["::placeholder"];
    cw.exports = Nu;
  });
  var hw = k((_9, dw) => {
    u();
    var pP = Pr(),
      zu = class extends pP {
        prefixed(e) {
          return e === "-ms-"
            ? ":-ms-input-placeholder"
            : `:${e}placeholder-shown`;
        }
      };
    zu.names = [":placeholder-shown"];
    dw.exports = zu;
  });
  var gw = k((T9, mw) => {
    u();
    var dP = Pr(),
      hP = Oe(),
      $u = class extends dP {
        constructor(e, r, i) {
          super(e, r, i);
          this.prefixes &&
            (this.prefixes = hP.uniq(this.prefixes.map((n) => "-webkit-")));
        }
        prefixed(e) {
          return e === "-webkit-"
            ? "::-webkit-file-upload-button"
            : `::${e}file-selector-button`;
        }
      };
    $u.names = ["::file-selector-button"];
    mw.exports = $u;
  });
  var Pe = k((O9, yw) => {
    u();
    yw.exports = function (t) {
      let e;
      return (
        t === "-webkit- 2009" || t === "-moz-"
          ? (e = 2009)
          : t === "-ms-"
          ? (e = 2012)
          : t === "-webkit-" && (e = "final"),
        t === "-webkit- 2009" && (t = "-webkit-"),
        [e, t]
      );
    };
  });
  var xw = k((E9, bw) => {
    u();
    var ww = Re().list,
      vw = Pe(),
      mP = j(),
      Ir = class extends mP {
        prefixed(e, r) {
          let i;
          return (
            ([i, r] = vw(r)), i === 2009 ? r + "box-flex" : super.prefixed(e, r)
          );
        }
        normalize() {
          return "flex";
        }
        set(e, r) {
          let i = vw(r)[0];
          if (i === 2009)
            return (
              (e.value = ww.space(e.value)[0]),
              (e.value = Ir.oldValues[e.value] || e.value),
              super.set(e, r)
            );
          if (i === 2012) {
            let n = ww.space(e.value);
            n.length === 3 &&
              n[2] === "0" &&
              (e.value = n.slice(0, 2).concat("0px").join(" "));
          }
          return super.set(e, r);
        }
      };
    Ir.names = ["flex", "box-flex"];
    Ir.oldValues = { auto: "1", none: "0" };
    bw.exports = Ir;
  });
  var _w = k((A9, Sw) => {
    u();
    var kw = Pe(),
      gP = j(),
      ju = class extends gP {
        prefixed(e, r) {
          let i;
          return (
            ([i, r] = kw(r)),
            i === 2009
              ? r + "box-ordinal-group"
              : i === 2012
              ? r + "flex-order"
              : super.prefixed(e, r)
          );
        }
        normalize() {
          return "order";
        }
        set(e, r) {
          return kw(r)[0] === 2009 && /\d/.test(e.value)
            ? ((e.value = (parseInt(e.value) + 1).toString()), super.set(e, r))
            : super.set(e, r);
        }
      };
    ju.names = ["order", "flex-order", "box-ordinal-group"];
    Sw.exports = ju;
  });
  var Ow = k((C9, Tw) => {
    u();
    var yP = j(),
      Uu = class extends yP {
        check(e) {
          let r = e.value;
          return (
            !r.toLowerCase().includes("alpha(") &&
            !r.includes("DXImageTransform.Microsoft") &&
            !r.includes("data:image/svg+xml")
          );
        }
      };
    Uu.names = ["filter"];
    Tw.exports = Uu;
  });
  var Aw = k((P9, Ew) => {
    u();
    var wP = j(),
      Vu = class extends wP {
        insert(e, r, i, n) {
          if (r !== "-ms-") return super.insert(e, r, i);
          let a = this.clone(e),
            s = e.prop.replace(/end$/, "start"),
            o = r + e.prop.replace(/end$/, "span");
          if (!e.parent.some((l) => l.prop === o)) {
            if (((a.prop = o), e.value.includes("span")))
              a.value = e.value.replace(/span\s/i, "");
            else {
              let l;
              if (
                (e.parent.walkDecls(s, (c) => {
                  l = c;
                }),
                l)
              ) {
                let c = Number(e.value) - Number(l.value) + "";
                a.value = c;
              } else e.warn(n, `Can not prefix ${e.prop} (${s} is not found)`);
            }
            e.cloneBefore(a);
          }
        }
      };
    Vu.names = ["grid-row-end", "grid-column-end"];
    Ew.exports = Vu;
  });
  var Pw = k((I9, Cw) => {
    u();
    var vP = j(),
      Wu = class extends vP {
        check(e) {
          return !e.value.split(/\s+/).some((r) => {
            let i = r.toLowerCase();
            return i === "reverse" || i === "alternate-reverse";
          });
        }
      };
    Wu.names = ["animation", "animation-direction"];
    Cw.exports = Wu;
  });
  var qw = k((q9, Iw) => {
    u();
    var bP = Pe(),
      xP = j(),
      Gu = class extends xP {
        insert(e, r, i) {
          let n;
          if ((([n, r] = bP(r)), n !== 2009)) return super.insert(e, r, i);
          let a = e.value
            .split(/\s+/)
            .filter((p) => p !== "wrap" && p !== "nowrap" && "wrap-reverse");
          if (
            a.length === 0 ||
            e.parent.some(
              (p) =>
                p.prop === r + "box-orient" || p.prop === r + "box-direction"
            )
          )
            return;
          let o = a[0],
            l = o.includes("row") ? "horizontal" : "vertical",
            c = o.includes("reverse") ? "reverse" : "normal",
            f = this.clone(e);
          return (
            (f.prop = r + "box-orient"),
            (f.value = l),
            this.needCascade(e) && (f.raws.before = this.calcBefore(i, e, r)),
            e.parent.insertBefore(e, f),
            (f = this.clone(e)),
            (f.prop = r + "box-direction"),
            (f.value = c),
            this.needCascade(e) && (f.raws.before = this.calcBefore(i, e, r)),
            e.parent.insertBefore(e, f)
          );
        }
      };
    Gu.names = ["flex-flow", "box-direction", "box-orient"];
    Iw.exports = Gu;
  });
  var Rw = k((D9, Dw) => {
    u();
    var kP = Pe(),
      SP = j(),
      Hu = class extends SP {
        normalize() {
          return "flex";
        }
        prefixed(e, r) {
          let i;
          return (
            ([i, r] = kP(r)),
            i === 2009
              ? r + "box-flex"
              : i === 2012
              ? r + "flex-positive"
              : super.prefixed(e, r)
          );
        }
      };
    Hu.names = ["flex-grow", "flex-positive"];
    Dw.exports = Hu;
  });
  var Mw = k((R9, Bw) => {
    u();
    var _P = Pe(),
      TP = j(),
      Yu = class extends TP {
        set(e, r) {
          if (_P(r)[0] !== 2009) return super.set(e, r);
        }
      };
    Yu.names = ["flex-wrap"];
    Bw.exports = Yu;
  });
  var Fw = k((B9, Lw) => {
    u();
    var OP = j(),
      qr = Ut(),
      Qu = class extends OP {
        insert(e, r, i, n) {
          if (r !== "-ms-") return super.insert(e, r, i);
          let a = qr.parse(e),
            [s, o] = qr.translate(a, 0, 2),
            [l, c] = qr.translate(a, 1, 3);
          [
            ["grid-row", s],
            ["grid-row-span", o],
            ["grid-column", l],
            ["grid-column-span", c],
          ].forEach(([f, p]) => {
            qr.insertDecl(e, f, p);
          }),
            qr.warnTemplateSelectorNotFound(e, n),
            qr.warnIfGridRowColumnExists(e, n);
        }
      };
    Qu.names = ["grid-area"];
    Lw.exports = Qu;
  });
  var zw = k((M9, Nw) => {
    u();
    var EP = j(),
      Qi = Ut(),
      Ju = class extends EP {
        insert(e, r, i) {
          if (r !== "-ms-") return super.insert(e, r, i);
          if (e.parent.some((s) => s.prop === "-ms-grid-row-align")) return;
          let [[n, a]] = Qi.parse(e);
          a
            ? (Qi.insertDecl(e, "grid-row-align", n),
              Qi.insertDecl(e, "grid-column-align", a))
            : (Qi.insertDecl(e, "grid-row-align", n),
              Qi.insertDecl(e, "grid-column-align", n));
        }
      };
    Ju.names = ["place-self"];
    Nw.exports = Ju;
  });
  var jw = k((L9, $w) => {
    u();
    var AP = j(),
      Ku = class extends AP {
        check(e) {
          let r = e.value;
          return !r.includes("/") || r.includes("span");
        }
        normalize(e) {
          return e.replace("-start", "");
        }
        prefixed(e, r) {
          let i = super.prefixed(e, r);
          return r === "-ms-" && (i = i.replace("-start", "")), i;
        }
      };
    Ku.names = ["grid-row-start", "grid-column-start"];
    $w.exports = Ku;
  });
  var Ww = k((F9, Vw) => {
    u();
    var Uw = Pe(),
      CP = j(),
      Dr = class extends CP {
        check(e) {
          return (
            e.parent &&
            !e.parent.some((r) => r.prop && r.prop.startsWith("grid-"))
          );
        }
        prefixed(e, r) {
          let i;
          return (
            ([i, r] = Uw(r)),
            i === 2012 ? r + "flex-item-align" : super.prefixed(e, r)
          );
        }
        normalize() {
          return "align-self";
        }
        set(e, r) {
          let i = Uw(r)[0];
          if (i === 2012)
            return (
              (e.value = Dr.oldValues[e.value] || e.value), super.set(e, r)
            );
          if (i === "final") return super.set(e, r);
        }
      };
    Dr.names = ["align-self", "flex-item-align"];
    Dr.oldValues = { "flex-end": "end", "flex-start": "start" };
    Vw.exports = Dr;
  });
  var Hw = k((N9, Gw) => {
    u();
    var PP = j(),
      IP = Oe(),
      Xu = class extends PP {
        constructor(e, r, i) {
          super(e, r, i);
          this.prefixes &&
            (this.prefixes = IP.uniq(
              this.prefixes.map((n) => (n === "-ms-" ? "-webkit-" : n))
            ));
        }
      };
    Xu.names = ["appearance"];
    Gw.exports = Xu;
  });
  var Jw = k((z9, Qw) => {
    u();
    var Yw = Pe(),
      qP = j(),
      Zu = class extends qP {
        normalize() {
          return "flex-basis";
        }
        prefixed(e, r) {
          let i;
          return (
            ([i, r] = Yw(r)),
            i === 2012 ? r + "flex-preferred-size" : super.prefixed(e, r)
          );
        }
        set(e, r) {
          let i;
          if ((([i, r] = Yw(r)), i === 2012 || i === "final"))
            return super.set(e, r);
        }
      };
    Zu.names = ["flex-basis", "flex-preferred-size"];
    Qw.exports = Zu;
  });
  var Xw = k(($9, Kw) => {
    u();
    var DP = j(),
      ef = class extends DP {
        normalize() {
          return this.name.replace("box-image", "border");
        }
        prefixed(e, r) {
          let i = super.prefixed(e, r);
          return r === "-webkit-" && (i = i.replace("border", "box-image")), i;
        }
      };
    ef.names = [
      "mask-border",
      "mask-border-source",
      "mask-border-slice",
      "mask-border-width",
      "mask-border-outset",
      "mask-border-repeat",
      "mask-box-image",
      "mask-box-image-source",
      "mask-box-image-slice",
      "mask-box-image-width",
      "mask-box-image-outset",
      "mask-box-image-repeat",
    ];
    Kw.exports = ef;
  });
  var ev = k((j9, Zw) => {
    u();
    var RP = j(),
      at = class extends RP {
        insert(e, r, i) {
          let n = e.prop === "mask-composite",
            a;
          n ? (a = e.value.split(",")) : (a = e.value.match(at.regexp) || []),
            (a = a.map((c) => c.trim()).filter((c) => c));
          let s = a.length,
            o;
          if (
            (s &&
              ((o = this.clone(e)),
              (o.value = a.map((c) => at.oldValues[c] || c).join(", ")),
              a.includes("intersect") && (o.value += ", xor"),
              (o.prop = r + "mask-composite")),
            n)
          )
            return s
              ? (this.needCascade(e) &&
                  (o.raws.before = this.calcBefore(i, e, r)),
                e.parent.insertBefore(e, o))
              : void 0;
          let l = this.clone(e);
          return (
            (l.prop = r + l.prop),
            s && (l.value = l.value.replace(at.regexp, "")),
            this.needCascade(e) && (l.raws.before = this.calcBefore(i, e, r)),
            e.parent.insertBefore(e, l),
            s
              ? (this.needCascade(e) &&
                  (o.raws.before = this.calcBefore(i, e, r)),
                e.parent.insertBefore(e, o))
              : e
          );
        }
      };
    at.names = ["mask", "mask-composite"];
    at.oldValues = {
      add: "source-over",
      subtract: "source-out",
      intersect: "source-in",
      exclude: "xor",
    };
    at.regexp = new RegExp(
      `\\s+(${Object.keys(at.oldValues).join("|")})\\b(?!\\))\\s*(?=[,])`,
      "ig"
    );
    Zw.exports = at;
  });
  var iv = k((U9, rv) => {
    u();
    var tv = Pe(),
      BP = j(),
      Rr = class extends BP {
        prefixed(e, r) {
          let i;
          return (
            ([i, r] = tv(r)),
            i === 2009
              ? r + "box-align"
              : i === 2012
              ? r + "flex-align"
              : super.prefixed(e, r)
          );
        }
        normalize() {
          return "align-items";
        }
        set(e, r) {
          let i = tv(r)[0];
          return (
            (i === 2009 || i === 2012) &&
              (e.value = Rr.oldValues[e.value] || e.value),
            super.set(e, r)
          );
        }
      };
    Rr.names = ["align-items", "flex-align", "box-align"];
    Rr.oldValues = { "flex-end": "end", "flex-start": "start" };
    rv.exports = Rr;
  });
  var sv = k((V9, nv) => {
    u();
    var MP = j(),
      tf = class extends MP {
        set(e, r) {
          return (
            r === "-ms-" && e.value === "contain" && (e.value = "element"),
            super.set(e, r)
          );
        }
        insert(e, r, i) {
          if (!(e.value === "all" && r === "-ms-"))
            return super.insert(e, r, i);
        }
      };
    tf.names = ["user-select"];
    nv.exports = tf;
  });
  var lv = k((W9, ov) => {
    u();
    var av = Pe(),
      LP = j(),
      rf = class extends LP {
        normalize() {
          return "flex-shrink";
        }
        prefixed(e, r) {
          let i;
          return (
            ([i, r] = av(r)),
            i === 2012 ? r + "flex-negative" : super.prefixed(e, r)
          );
        }
        set(e, r) {
          let i;
          if ((([i, r] = av(r)), i === 2012 || i === "final"))
            return super.set(e, r);
        }
      };
    rf.names = ["flex-shrink", "flex-negative"];
    ov.exports = rf;
  });
  var fv = k((G9, uv) => {
    u();
    var FP = j(),
      nf = class extends FP {
        prefixed(e, r) {
          return `${r}column-${e}`;
        }
        normalize(e) {
          return e.includes("inside")
            ? "break-inside"
            : e.includes("before")
            ? "break-before"
            : "break-after";
        }
        set(e, r) {
          return (
            ((e.prop === "break-inside" && e.value === "avoid-column") ||
              e.value === "avoid-page") &&
              (e.value = "avoid"),
            super.set(e, r)
          );
        }
        insert(e, r, i) {
          if (e.prop !== "break-inside") return super.insert(e, r, i);
          if (!(/region/i.test(e.value) || /page/i.test(e.value)))
            return super.insert(e, r, i);
        }
      };
    nf.names = [
      "break-inside",
      "page-break-inside",
      "column-break-inside",
      "break-before",
      "page-break-before",
      "column-break-before",
      "break-after",
      "page-break-after",
      "column-break-after",
    ];
    uv.exports = nf;
  });
  var pv = k((H9, cv) => {
    u();
    var NP = j(),
      sf = class extends NP {
        prefixed(e, r) {
          return r + "print-color-adjust";
        }
        normalize() {
          return "color-adjust";
        }
      };
    sf.names = ["color-adjust", "print-color-adjust"];
    cv.exports = sf;
  });
  var hv = k((Y9, dv) => {
    u();
    var zP = j(),
      Br = class extends zP {
        insert(e, r, i) {
          if (r === "-ms-") {
            let n = this.set(this.clone(e), r);
            this.needCascade(e) && (n.raws.before = this.calcBefore(i, e, r));
            let a = "ltr";
            return (
              e.parent.nodes.forEach((s) => {
                s.prop === "direction" &&
                  (s.value === "rtl" || s.value === "ltr") &&
                  (a = s.value);
              }),
              (n.value = Br.msValues[a][e.value] || e.value),
              e.parent.insertBefore(e, n)
            );
          }
          return super.insert(e, r, i);
        }
      };
    Br.names = ["writing-mode"];
    Br.msValues = {
      ltr: {
        "horizontal-tb": "lr-tb",
        "vertical-rl": "tb-rl",
        "vertical-lr": "tb-lr",
      },
      rtl: {
        "horizontal-tb": "rl-tb",
        "vertical-rl": "bt-rl",
        "vertical-lr": "bt-lr",
      },
    };
    dv.exports = Br;
  });
  var gv = k((Q9, mv) => {
    u();
    var $P = j(),
      af = class extends $P {
        set(e, r) {
          return (
            (e.value = e.value.replace(/\s+fill(\s)/, "$1")), super.set(e, r)
          );
        }
      };
    af.names = ["border-image"];
    mv.exports = af;
  });
  var vv = k((J9, wv) => {
    u();
    var yv = Pe(),
      jP = j(),
      Mr = class extends jP {
        prefixed(e, r) {
          let i;
          return (
            ([i, r] = yv(r)),
            i === 2012 ? r + "flex-line-pack" : super.prefixed(e, r)
          );
        }
        normalize() {
          return "align-content";
        }
        set(e, r) {
          let i = yv(r)[0];
          if (i === 2012)
            return (
              (e.value = Mr.oldValues[e.value] || e.value), super.set(e, r)
            );
          if (i === "final") return super.set(e, r);
        }
      };
    Mr.names = ["align-content", "flex-line-pack"];
    Mr.oldValues = {
      "flex-end": "end",
      "flex-start": "start",
      "space-between": "justify",
      "space-around": "distribute",
    };
    wv.exports = Mr;
  });
  var xv = k((K9, bv) => {
    u();
    var UP = j(),
      je = class extends UP {
        prefixed(e, r) {
          return r === "-moz-"
            ? r + (je.toMozilla[e] || e)
            : super.prefixed(e, r);
        }
        normalize(e) {
          return je.toNormal[e] || e;
        }
      };
    je.names = ["border-radius"];
    je.toMozilla = {};
    je.toNormal = {};
    for (let t of ["top", "bottom"])
      for (let e of ["left", "right"]) {
        let r = `border-${t}-${e}-radius`,
          i = `border-radius-${t}${e}`;
        je.names.push(r),
          je.names.push(i),
          (je.toMozilla[r] = i),
          (je.toNormal[i] = r);
      }
    bv.exports = je;
  });
  var Sv = k((X9, kv) => {
    u();
    var VP = j(),
      of = class extends VP {
        prefixed(e, r) {
          return e.includes("-start")
            ? r + e.replace("-block-start", "-before")
            : r + e.replace("-block-end", "-after");
        }
        normalize(e) {
          return e.includes("-before")
            ? e.replace("-before", "-block-start")
            : e.replace("-after", "-block-end");
        }
      };
    of.names = [
      "border-block-start",
      "border-block-end",
      "margin-block-start",
      "margin-block-end",
      "padding-block-start",
      "padding-block-end",
      "border-before",
      "border-after",
      "margin-before",
      "margin-after",
      "padding-before",
      "padding-after",
    ];
    kv.exports = of;
  });
  var Tv = k((Z9, _v) => {
    u();
    var WP = j(),
      {
        parseTemplate: GP,
        warnMissedAreas: HP,
        getGridGap: YP,
        warnGridGap: QP,
        inheritGridGap: JP,
      } = Ut(),
      lf = class extends WP {
        insert(e, r, i, n) {
          if (r !== "-ms-") return super.insert(e, r, i);
          if (e.parent.some((m) => m.prop === "-ms-grid-rows")) return;
          let a = YP(e),
            s = JP(e, a),
            { rows: o, columns: l, areas: c } = GP({ decl: e, gap: s || a }),
            f = Object.keys(c).length > 0,
            p = Boolean(o),
            h = Boolean(l);
          return (
            QP({ gap: a, hasColumns: h, decl: e, result: n }),
            HP(c, e, n),
            ((p && h) || f) &&
              e.cloneBefore({ prop: "-ms-grid-rows", value: o, raws: {} }),
            h &&
              e.cloneBefore({ prop: "-ms-grid-columns", value: l, raws: {} }),
            e
          );
        }
      };
    lf.names = ["grid-template"];
    _v.exports = lf;
  });
  var Ev = k((e$, Ov) => {
    u();
    var KP = j(),
      uf = class extends KP {
        prefixed(e, r) {
          return r + e.replace("-inline", "");
        }
        normalize(e) {
          return e.replace(
            /(margin|padding|border)-(start|end)/,
            "$1-inline-$2"
          );
        }
      };
    uf.names = [
      "border-inline-start",
      "border-inline-end",
      "margin-inline-start",
      "margin-inline-end",
      "padding-inline-start",
      "padding-inline-end",
      "border-start",
      "border-end",
      "margin-start",
      "margin-end",
      "padding-start",
      "padding-end",
    ];
    Ov.exports = uf;
  });
  var Cv = k((t$, Av) => {
    u();
    var XP = j(),
      ff = class extends XP {
        check(e) {
          return !e.value.includes("flex-") && e.value !== "baseline";
        }
        prefixed(e, r) {
          return r + "grid-row-align";
        }
        normalize() {
          return "align-self";
        }
      };
    ff.names = ["grid-row-align"];
    Av.exports = ff;
  });
  var Iv = k((r$, Pv) => {
    u();
    var ZP = j(),
      Lr = class extends ZP {
        keyframeParents(e) {
          let { parent: r } = e;
          for (; r; ) {
            if (r.type === "atrule" && r.name === "keyframes") return !0;
            ({ parent: r } = r);
          }
          return !1;
        }
        contain3d(e) {
          if (e.prop === "transform-origin") return !1;
          for (let r of Lr.functions3d)
            if (e.value.includes(`${r}(`)) return !0;
          return !1;
        }
        set(e, r) {
          return (
            (e = super.set(e, r)),
            r === "-ms-" && (e.value = e.value.replace(/rotatez/gi, "rotate")),
            e
          );
        }
        insert(e, r, i) {
          if (r === "-ms-") {
            if (!this.contain3d(e) && !this.keyframeParents(e))
              return super.insert(e, r, i);
          } else if (r === "-o-") {
            if (!this.contain3d(e)) return super.insert(e, r, i);
          } else return super.insert(e, r, i);
        }
      };
    Lr.names = ["transform", "transform-origin"];
    Lr.functions3d = [
      "matrix3d",
      "translate3d",
      "translateZ",
      "scale3d",
      "scaleZ",
      "rotate3d",
      "rotateX",
      "rotateY",
      "perspective",
    ];
    Pv.exports = Lr;
  });
  var Rv = k((i$, Dv) => {
    u();
    var qv = Pe(),
      e5 = j(),
      cf = class extends e5 {
        normalize() {
          return "flex-direction";
        }
        insert(e, r, i) {
          let n;
          if ((([n, r] = qv(r)), n !== 2009)) return super.insert(e, r, i);
          if (
            e.parent.some(
              (f) =>
                f.prop === r + "box-orient" || f.prop === r + "box-direction"
            )
          )
            return;
          let s = e.value,
            o,
            l;
          s === "inherit" || s === "initial" || s === "unset"
            ? ((o = s), (l = s))
            : ((o = s.includes("row") ? "horizontal" : "vertical"),
              (l = s.includes("reverse") ? "reverse" : "normal"));
          let c = this.clone(e);
          return (
            (c.prop = r + "box-orient"),
            (c.value = o),
            this.needCascade(e) && (c.raws.before = this.calcBefore(i, e, r)),
            e.parent.insertBefore(e, c),
            (c = this.clone(e)),
            (c.prop = r + "box-direction"),
            (c.value = l),
            this.needCascade(e) && (c.raws.before = this.calcBefore(i, e, r)),
            e.parent.insertBefore(e, c)
          );
        }
        old(e, r) {
          let i;
          return (
            ([i, r] = qv(r)),
            i === 2009
              ? [r + "box-orient", r + "box-direction"]
              : super.old(e, r)
          );
        }
      };
    cf.names = ["flex-direction", "box-direction", "box-orient"];
    Dv.exports = cf;
  });
  var Mv = k((n$, Bv) => {
    u();
    var t5 = j(),
      pf = class extends t5 {
        check(e) {
          return e.value === "pixelated";
        }
        prefixed(e, r) {
          return r === "-ms-" ? "-ms-interpolation-mode" : super.prefixed(e, r);
        }
        set(e, r) {
          return r !== "-ms-"
            ? super.set(e, r)
            : ((e.prop = "-ms-interpolation-mode"),
              (e.value = "nearest-neighbor"),
              e);
        }
        normalize() {
          return "image-rendering";
        }
        process(e, r) {
          return super.process(e, r);
        }
      };
    pf.names = ["image-rendering", "interpolation-mode"];
    Bv.exports = pf;
  });
  var Fv = k((s$, Lv) => {
    u();
    var r5 = j(),
      i5 = Oe(),
      df = class extends r5 {
        constructor(e, r, i) {
          super(e, r, i);
          this.prefixes &&
            (this.prefixes = i5.uniq(
              this.prefixes.map((n) => (n === "-ms-" ? "-webkit-" : n))
            ));
        }
      };
    df.names = ["backdrop-filter"];
    Lv.exports = df;
  });
  var zv = k((a$, Nv) => {
    u();
    var n5 = j(),
      s5 = Oe(),
      hf = class extends n5 {
        constructor(e, r, i) {
          super(e, r, i);
          this.prefixes &&
            (this.prefixes = s5.uniq(
              this.prefixes.map((n) => (n === "-ms-" ? "-webkit-" : n))
            ));
        }
        check(e) {
          return e.value.toLowerCase() === "text";
        }
      };
    hf.names = ["background-clip"];
    Nv.exports = hf;
  });
  var jv = k((o$, $v) => {
    u();
    var a5 = j(),
      o5 = [
        "none",
        "underline",
        "overline",
        "line-through",
        "blink",
        "inherit",
        "initial",
        "unset",
      ],
      mf = class extends a5 {
        check(e) {
          return e.value.split(/\s+/).some((r) => !o5.includes(r));
        }
      };
    mf.names = ["text-decoration"];
    $v.exports = mf;
  });
  var Wv = k((l$, Vv) => {
    u();
    var Uv = Pe(),
      l5 = j(),
      Fr = class extends l5 {
        prefixed(e, r) {
          let i;
          return (
            ([i, r] = Uv(r)),
            i === 2009
              ? r + "box-pack"
              : i === 2012
              ? r + "flex-pack"
              : super.prefixed(e, r)
          );
        }
        normalize() {
          return "justify-content";
        }
        set(e, r) {
          let i = Uv(r)[0];
          if (i === 2009 || i === 2012) {
            let n = Fr.oldValues[e.value] || e.value;
            if (((e.value = n), i !== 2009 || n !== "distribute"))
              return super.set(e, r);
          } else if (i === "final") return super.set(e, r);
        }
      };
    Fr.names = ["justify-content", "flex-pack", "box-pack"];
    Fr.oldValues = {
      "flex-end": "end",
      "flex-start": "start",
      "space-between": "justify",
      "space-around": "distribute",
    };
    Vv.exports = Fr;
  });
  var Hv = k((u$, Gv) => {
    u();
    var u5 = j(),
      gf = class extends u5 {
        set(e, r) {
          let i = e.value.toLowerCase();
          return (
            r === "-webkit-" &&
              !i.includes(" ") &&
              i !== "contain" &&
              i !== "cover" &&
              (e.value = e.value + " " + e.value),
            super.set(e, r)
          );
        }
      };
    gf.names = ["background-size"];
    Gv.exports = gf;
  });
  var Qv = k((f$, Yv) => {
    u();
    var f5 = j(),
      yf = Ut(),
      wf = class extends f5 {
        insert(e, r, i) {
          if (r !== "-ms-") return super.insert(e, r, i);
          let n = yf.parse(e),
            [a, s] = yf.translate(n, 0, 1);
          n[0] &&
            n[0].includes("span") &&
            (s = n[0].join("").replace(/\D/g, "")),
            [
              [e.prop, a],
              [`${e.prop}-span`, s],
            ].forEach(([l, c]) => {
              yf.insertDecl(e, l, c);
            });
        }
      };
    wf.names = ["grid-row", "grid-column"];
    Yv.exports = wf;
  });
  var Xv = k((c$, Kv) => {
    u();
    var c5 = j(),
      {
        prefixTrackProp: Jv,
        prefixTrackValue: p5,
        autoplaceGridItems: d5,
        getGridGap: h5,
        inheritGridGap: m5,
      } = Ut(),
      g5 = Mu(),
      vf = class extends c5 {
        prefixed(e, r) {
          return r === "-ms-"
            ? Jv({ prop: e, prefix: r })
            : super.prefixed(e, r);
        }
        normalize(e) {
          return e.replace(/^grid-(rows|columns)/, "grid-template-$1");
        }
        insert(e, r, i, n) {
          if (r !== "-ms-") return super.insert(e, r, i);
          let { parent: a, prop: s, value: o } = e,
            l = s.includes("rows"),
            c = s.includes("columns"),
            f = a.some(
              (_) =>
                _.prop === "grid-template" || _.prop === "grid-template-areas"
            );
          if (f && l) return !1;
          let p = new g5({ options: {} }),
            h = p.gridStatus(a, n),
            m = h5(e);
          m = m5(e, m) || m;
          let b = l ? m.row : m.column;
          (h === "no-autoplace" || h === !0) && !f && (b = null);
          let S = p5({ value: o, gap: b });
          e.cloneBefore({ prop: Jv({ prop: s, prefix: r }), value: S });
          let v = a.nodes.find((_) => _.prop === "grid-auto-flow"),
            w = "row";
          if (
            (v && !p.disabled(v, n) && (w = v.value.trim()), h === "autoplace")
          ) {
            let _ = a.nodes.find((O) => O.prop === "grid-template-rows");
            if (!_ && f) return;
            if (!_ && !f) {
              e.warn(
                n,
                "Autoplacement does not work without grid-template-rows property"
              );
              return;
            }
            !a.nodes.find((O) => O.prop === "grid-template-columns") &&
              !f &&
              e.warn(
                n,
                "Autoplacement does not work without grid-template-columns property"
              ),
              c && !f && d5(e, n, m, w);
          }
        }
      };
    vf.names = [
      "grid-template-rows",
      "grid-template-columns",
      "grid-rows",
      "grid-columns",
    ];
    Kv.exports = vf;
  });
  var eb = k((p$, Zv) => {
    u();
    var y5 = j(),
      bf = class extends y5 {
        check(e) {
          return !e.value.includes("flex-") && e.value !== "baseline";
        }
        prefixed(e, r) {
          return r + "grid-column-align";
        }
        normalize() {
          return "justify-self";
        }
      };
    bf.names = ["grid-column-align"];
    Zv.exports = bf;
  });
  var rb = k((d$, tb) => {
    u();
    var w5 = j(),
      xf = class extends w5 {
        prefixed(e, r) {
          return r + "scroll-chaining";
        }
        normalize() {
          return "overscroll-behavior";
        }
        set(e, r) {
          return (
            e.value === "auto"
              ? (e.value = "chained")
              : (e.value === "none" || e.value === "contain") &&
                (e.value = "none"),
            super.set(e, r)
          );
        }
      };
    xf.names = ["overscroll-behavior", "scroll-chaining"];
    tb.exports = xf;
  });
  var sb = k((h$, nb) => {
    u();
    var v5 = j(),
      {
        parseGridAreas: b5,
        warnMissedAreas: x5,
        prefixTrackProp: k5,
        prefixTrackValue: ib,
        getGridGap: S5,
        warnGridGap: _5,
        inheritGridGap: T5,
      } = Ut();
    function O5(t) {
      return t
        .trim()
        .slice(1, -1)
        .split(/["']\s*["']?/g);
    }
    var kf = class extends v5 {
      insert(e, r, i, n) {
        if (r !== "-ms-") return super.insert(e, r, i);
        let a = !1,
          s = !1,
          o = e.parent,
          l = S5(e);
        (l = T5(e, l) || l),
          o.walkDecls(/-ms-grid-rows/, (p) => p.remove()),
          o.walkDecls(/grid-template-(rows|columns)/, (p) => {
            if (p.prop === "grid-template-rows") {
              s = !0;
              let { prop: h, value: m } = p;
              p.cloneBefore({
                prop: k5({ prop: h, prefix: r }),
                value: ib({ value: m, gap: l.row }),
              });
            } else a = !0;
          });
        let c = O5(e.value);
        a &&
          !s &&
          l.row &&
          c.length > 1 &&
          e.cloneBefore({
            prop: "-ms-grid-rows",
            value: ib({ value: `repeat(${c.length}, auto)`, gap: l.row }),
            raws: {},
          }),
          _5({ gap: l, hasColumns: a, decl: e, result: n });
        let f = b5({ rows: c, gap: l });
        return x5(f, e, n), e;
      }
    };
    kf.names = ["grid-template-areas"];
    nb.exports = kf;
  });
  var ob = k((m$, ab) => {
    u();
    var E5 = j(),
      Sf = class extends E5 {
        set(e, r) {
          return (
            r === "-webkit-" &&
              (e.value = e.value.replace(/\s*(right|left)\s*/i, "")),
            super.set(e, r)
          );
        }
      };
    Sf.names = ["text-emphasis-position"];
    ab.exports = Sf;
  });
  var ub = k((g$, lb) => {
    u();
    var A5 = j(),
      _f = class extends A5 {
        set(e, r) {
          return e.prop === "text-decoration-skip-ink" && e.value === "auto"
            ? ((e.prop = r + "text-decoration-skip"), (e.value = "ink"), e)
            : super.set(e, r);
        }
      };
    _f.names = ["text-decoration-skip-ink", "text-decoration-skip"];
    lb.exports = _f;
  });
  var mb = k((y$, hb) => {
    u();
    ("use strict");
    hb.exports = {
      wrap: fb,
      limit: cb,
      validate: pb,
      test: Tf,
      curry: C5,
      name: db,
    };
    function fb(t, e, r) {
      var i = e - t;
      return ((((r - t) % i) + i) % i) + t;
    }
    function cb(t, e, r) {
      return Math.max(t, Math.min(e, r));
    }
    function pb(t, e, r, i, n) {
      if (!Tf(t, e, r, i, n))
        throw new Error(r + " is outside of range [" + t + "," + e + ")");
      return r;
    }
    function Tf(t, e, r, i, n) {
      return !(r < t || r > e || (n && r === e) || (i && r === t));
    }
    function db(t, e, r, i) {
      return (r ? "(" : "[") + t + "," + e + (i ? ")" : "]");
    }
    function C5(t, e, r, i) {
      var n = db.bind(null, t, e, r, i);
      return {
        wrap: fb.bind(null, t, e),
        limit: cb.bind(null, t, e),
        validate: function (a) {
          return pb(t, e, a, r, i);
        },
        test: function (a) {
          return Tf(t, e, a, r, i);
        },
        toString: n,
        name: n,
      };
    }
  });
  var wb = k((w$, yb) => {
    u();
    var Of = fa(),
      P5 = mb(),
      I5 = Cr(),
      q5 = $e(),
      D5 = Oe(),
      gb = /top|left|right|bottom/gi,
      wt = class extends q5 {
        replace(e, r) {
          let i = Of(e);
          for (let n of i.nodes)
            if (n.type === "function" && n.value === this.name)
              if (
                ((n.nodes = this.newDirection(n.nodes)),
                (n.nodes = this.normalize(n.nodes)),
                r === "-webkit- old")
              ) {
                if (!this.oldWebkit(n)) return !1;
              } else
                (n.nodes = this.convertDirection(n.nodes)),
                  (n.value = r + n.value);
          return i.toString();
        }
        replaceFirst(e, ...r) {
          return r
            .map((n) =>
              n === " "
                ? { type: "space", value: n }
                : { type: "word", value: n }
            )
            .concat(e.slice(1));
        }
        normalizeUnit(e, r) {
          return `${(parseFloat(e) / r) * 360}deg`;
        }
        normalize(e) {
          if (!e[0]) return e;
          if (/-?\d+(.\d+)?grad/.test(e[0].value))
            e[0].value = this.normalizeUnit(e[0].value, 400);
          else if (/-?\d+(.\d+)?rad/.test(e[0].value))
            e[0].value = this.normalizeUnit(e[0].value, 2 * Math.PI);
          else if (/-?\d+(.\d+)?turn/.test(e[0].value))
            e[0].value = this.normalizeUnit(e[0].value, 1);
          else if (e[0].value.includes("deg")) {
            let r = parseFloat(e[0].value);
            (r = P5.wrap(0, 360, r)), (e[0].value = `${r}deg`);
          }
          return (
            e[0].value === "0deg"
              ? (e = this.replaceFirst(e, "to", " ", "top"))
              : e[0].value === "90deg"
              ? (e = this.replaceFirst(e, "to", " ", "right"))
              : e[0].value === "180deg"
              ? (e = this.replaceFirst(e, "to", " ", "bottom"))
              : e[0].value === "270deg" &&
                (e = this.replaceFirst(e, "to", " ", "left")),
            e
          );
        }
        newDirection(e) {
          if (e[0].value === "to" || ((gb.lastIndex = 0), !gb.test(e[0].value)))
            return e;
          e.unshift(
            { type: "word", value: "to" },
            { type: "space", value: " " }
          );
          for (let r = 2; r < e.length && e[r].type !== "div"; r++)
            e[r].type === "word" &&
              (e[r].value = this.revertDirection(e[r].value));
          return e;
        }
        isRadial(e) {
          let r = "before";
          for (let i of e)
            if (r === "before" && i.type === "space") r = "at";
            else if (r === "at" && i.value === "at") r = "after";
            else {
              if (r === "after" && i.type === "space") return !0;
              if (i.type === "div") break;
              r = "before";
            }
          return !1;
        }
        convertDirection(e) {
          return (
            e.length > 0 &&
              (e[0].value === "to"
                ? this.fixDirection(e)
                : e[0].value.includes("deg")
                ? this.fixAngle(e)
                : this.isRadial(e) && this.fixRadial(e)),
            e
          );
        }
        fixDirection(e) {
          e.splice(0, 2);
          for (let r of e) {
            if (r.type === "div") break;
            r.type === "word" && (r.value = this.revertDirection(r.value));
          }
        }
        fixAngle(e) {
          let r = e[0].value;
          (r = parseFloat(r)),
            (r = Math.abs(450 - r) % 360),
            (r = this.roundFloat(r, 3)),
            (e[0].value = `${r}deg`);
        }
        fixRadial(e) {
          let r = [],
            i = [],
            n,
            a,
            s,
            o,
            l;
          for (o = 0; o < e.length - 2; o++)
            if (
              ((n = e[o]),
              (a = e[o + 1]),
              (s = e[o + 2]),
              n.type === "space" && a.value === "at" && s.type === "space")
            ) {
              l = o + 3;
              break;
            } else r.push(n);
          let c;
          for (o = l; o < e.length; o++)
            if (e[o].type === "div") {
              c = e[o];
              break;
            } else i.push(e[o]);
          e.splice(0, o, ...i, c, ...r);
        }
        revertDirection(e) {
          return wt.directions[e.toLowerCase()] || e;
        }
        roundFloat(e, r) {
          return parseFloat(e.toFixed(r));
        }
        oldWebkit(e) {
          let { nodes: r } = e,
            i = Of.stringify(e.nodes);
          if (
            this.name !== "linear-gradient" ||
            (r[0] && r[0].value.includes("deg")) ||
            i.includes("px") ||
            i.includes("-corner") ||
            i.includes("-side")
          )
            return !1;
          let n = [[]];
          for (let a of r)
            n[n.length - 1].push(a),
              a.type === "div" && a.value === "," && n.push([]);
          this.oldDirection(n), this.colorStops(n), (e.nodes = []);
          for (let a of n) e.nodes = e.nodes.concat(a);
          return (
            e.nodes.unshift(
              { type: "word", value: "linear" },
              this.cloneDiv(e.nodes)
            ),
            (e.value = "-webkit-gradient"),
            !0
          );
        }
        oldDirection(e) {
          let r = this.cloneDiv(e[0]);
          if (e[0][0].value !== "to")
            return e.unshift([
              { type: "word", value: wt.oldDirections.bottom },
              r,
            ]);
          {
            let i = [];
            for (let a of e[0].slice(2))
              a.type === "word" && i.push(a.value.toLowerCase());
            i = i.join(" ");
            let n = wt.oldDirections[i] || i;
            return (e[0] = [{ type: "word", value: n }, r]), e[0];
          }
        }
        cloneDiv(e) {
          for (let r of e) if (r.type === "div" && r.value === ",") return r;
          return { type: "div", value: ",", after: " " };
        }
        colorStops(e) {
          let r = [];
          for (let i = 0; i < e.length; i++) {
            let n,
              a = e[i],
              s;
            if (i === 0) continue;
            let o = Of.stringify(a[0]);
            a[1] && a[1].type === "word"
              ? (n = a[1].value)
              : a[2] && a[2].type === "word" && (n = a[2].value);
            let l;
            i === 1 && (!n || n === "0%")
              ? (l = `from(${o})`)
              : i === e.length - 1 && (!n || n === "100%")
              ? (l = `to(${o})`)
              : n
              ? (l = `color-stop(${n}, ${o})`)
              : (l = `color-stop(${o})`);
            let c = a[a.length - 1];
            (e[i] = [{ type: "word", value: l }]),
              c.type === "div" && c.value === "," && (s = e[i].push(c)),
              r.push(s);
          }
          return r;
        }
        old(e) {
          if (e === "-webkit-") {
            let r = this.name === "linear-gradient" ? "linear" : "radial",
              i = "-gradient",
              n = D5.regexp(`-webkit-(${r}-gradient|gradient\\(\\s*${r})`, !1);
            return new I5(this.name, e + this.name, i, n);
          } else return super.old(e);
        }
        add(e, r) {
          let i = e.prop;
          if (i.includes("mask")) {
            if (r === "-webkit-" || r === "-webkit- old")
              return super.add(e, r);
          } else if (
            i === "list-style" ||
            i === "list-style-image" ||
            i === "content"
          ) {
            if (r === "-webkit-" || r === "-webkit- old")
              return super.add(e, r);
          } else return super.add(e, r);
        }
      };
    wt.names = [
      "linear-gradient",
      "repeating-linear-gradient",
      "radial-gradient",
      "repeating-radial-gradient",
    ];
    wt.directions = {
      top: "bottom",
      left: "right",
      bottom: "top",
      right: "left",
    };
    wt.oldDirections = {
      top: "left bottom, left top",
      left: "right top, left top",
      bottom: "left top, left bottom",
      right: "left top, right top",
      "top right": "left bottom, right top",
      "top left": "right bottom, left top",
      "right top": "left bottom, right top",
      "right bottom": "left top, right bottom",
      "bottom right": "left top, right bottom",
      "bottom left": "right top, left bottom",
      "left top": "right bottom, left top",
      "left bottom": "right top, left bottom",
    };
    yb.exports = wt;
  });
  var xb = k((v$, bb) => {
    u();
    var R5 = Cr(),
      B5 = $e();
    function vb(t) {
      return new RegExp(`(^|[\\s,(])(${t}($|[\\s),]))`, "gi");
    }
    var Ef = class extends B5 {
      regexp() {
        return (
          this.regexpCache || (this.regexpCache = vb(this.name)),
          this.regexpCache
        );
      }
      isStretch() {
        return (
          this.name === "stretch" ||
          this.name === "fill" ||
          this.name === "fill-available"
        );
      }
      replace(e, r) {
        return r === "-moz-" && this.isStretch()
          ? e.replace(this.regexp(), "$1-moz-available$3")
          : r === "-webkit-" && this.isStretch()
          ? e.replace(this.regexp(), "$1-webkit-fill-available$3")
          : super.replace(e, r);
      }
      old(e) {
        let r = e + this.name;
        return (
          this.isStretch() &&
            (e === "-moz-"
              ? (r = "-moz-available")
              : e === "-webkit-" && (r = "-webkit-fill-available")),
          new R5(this.name, r, r, vb(r))
        );
      }
      add(e, r) {
        if (!(e.prop.includes("grid") && r !== "-webkit-"))
          return super.add(e, r);
      }
    };
    Ef.names = [
      "max-content",
      "min-content",
      "fit-content",
      "fill",
      "fill-available",
      "stretch",
    ];
    bb.exports = Ef;
  });
  var _b = k((b$, Sb) => {
    u();
    var kb = Cr(),
      M5 = $e(),
      Af = class extends M5 {
        replace(e, r) {
          return r === "-webkit-"
            ? e.replace(this.regexp(), "$1-webkit-optimize-contrast")
            : r === "-moz-"
            ? e.replace(this.regexp(), "$1-moz-crisp-edges")
            : super.replace(e, r);
        }
        old(e) {
          return e === "-webkit-"
            ? new kb(this.name, "-webkit-optimize-contrast")
            : e === "-moz-"
            ? new kb(this.name, "-moz-crisp-edges")
            : super.old(e);
        }
      };
    Af.names = ["pixelated"];
    Sb.exports = Af;
  });
  var Ob = k((x$, Tb) => {
    u();
    var L5 = $e(),
      Cf = class extends L5 {
        replace(e, r) {
          let i = super.replace(e, r);
          return (
            r === "-webkit-" &&
              (i = i.replace(/("[^"]+"|'[^']+')(\s+\d+\w)/gi, "url($1)$2")),
            i
          );
        }
      };
    Cf.names = ["image-set"];
    Tb.exports = Cf;
  });
  var Ab = k((k$, Eb) => {
    u();
    var F5 = Re().list,
      N5 = $e(),
      Pf = class extends N5 {
        replace(e, r) {
          return F5.space(e)
            .map((i) => {
              if (i.slice(0, +this.name.length + 1) !== this.name + "(")
                return i;
              let n = i.lastIndexOf(")"),
                a = i.slice(n + 1),
                s = i.slice(this.name.length + 1, n);
              if (r === "-webkit-") {
                let o = s.match(/\d*.?\d+%?/);
                o
                  ? ((s = s.slice(o[0].length).trim()), (s += `, ${o[0]}`))
                  : (s += ", 0.5");
              }
              return r + this.name + "(" + s + ")" + a;
            })
            .join(" ");
        }
      };
    Pf.names = ["cross-fade"];
    Eb.exports = Pf;
  });
  var Pb = k((S$, Cb) => {
    u();
    var z5 = Pe(),
      $5 = Cr(),
      j5 = $e(),
      If = class extends j5 {
        constructor(e, r) {
          super(e, r);
          e === "display-flex" && (this.name = "flex");
        }
        check(e) {
          return e.prop === "display" && e.value === this.name;
        }
        prefixed(e) {
          let r, i;
          return (
            ([r, e] = z5(e)),
            r === 2009
              ? this.name === "flex"
                ? (i = "box")
                : (i = "inline-box")
              : r === 2012
              ? this.name === "flex"
                ? (i = "flexbox")
                : (i = "inline-flexbox")
              : r === "final" && (i = this.name),
            e + i
          );
        }
        replace(e, r) {
          return this.prefixed(r);
        }
        old(e) {
          let r = this.prefixed(e);
          if (!!r) return new $5(this.name, r);
        }
      };
    If.names = ["display-flex", "inline-flex"];
    Cb.exports = If;
  });
  var qb = k((_$, Ib) => {
    u();
    var U5 = $e(),
      qf = class extends U5 {
        constructor(e, r) {
          super(e, r);
          e === "display-grid" && (this.name = "grid");
        }
        check(e) {
          return e.prop === "display" && e.value === this.name;
        }
      };
    qf.names = ["display-grid", "inline-grid"];
    Ib.exports = qf;
  });
  var Rb = k((T$, Db) => {
    u();
    var V5 = $e(),
      Df = class extends V5 {
        constructor(e, r) {
          super(e, r);
          e === "filter-function" && (this.name = "filter");
        }
      };
    Df.names = ["filter", "filter-function"];
    Db.exports = Df;
  });
  var Fb = k((O$, Lb) => {
    u();
    var Bb = Yi(),
      U = j(),
      Mb = y0(),
      W5 = B0(),
      G5 = Mu(),
      H5 = ew(),
      Rf = $t(),
      Nr = Pr(),
      Y5 = lw(),
      ot = $e(),
      zr = Oe(),
      Q5 = fw(),
      J5 = pw(),
      K5 = hw(),
      X5 = gw(),
      Z5 = xw(),
      e4 = _w(),
      t4 = Ow(),
      r4 = Aw(),
      i4 = Pw(),
      n4 = qw(),
      s4 = Rw(),
      a4 = Mw(),
      o4 = Fw(),
      l4 = zw(),
      u4 = jw(),
      f4 = Ww(),
      c4 = Hw(),
      p4 = Jw(),
      d4 = Xw(),
      h4 = ev(),
      m4 = iv(),
      g4 = sv(),
      y4 = lv(),
      w4 = fv(),
      v4 = pv(),
      b4 = hv(),
      x4 = gv(),
      k4 = vv(),
      S4 = xv(),
      _4 = Sv(),
      T4 = Tv(),
      O4 = Ev(),
      E4 = Cv(),
      A4 = Iv(),
      C4 = Rv(),
      P4 = Mv(),
      I4 = Fv(),
      q4 = zv(),
      D4 = jv(),
      R4 = Wv(),
      B4 = Hv(),
      M4 = Qv(),
      L4 = Xv(),
      F4 = eb(),
      N4 = rb(),
      z4 = sb(),
      $4 = ob(),
      j4 = ub(),
      U4 = wb(),
      V4 = xb(),
      W4 = _b(),
      G4 = Ob(),
      H4 = Ab(),
      Y4 = Pb(),
      Q4 = qb(),
      J4 = Rb();
    Nr.hack(Q5);
    Nr.hack(J5);
    Nr.hack(K5);
    Nr.hack(X5);
    U.hack(Z5);
    U.hack(e4);
    U.hack(t4);
    U.hack(r4);
    U.hack(i4);
    U.hack(n4);
    U.hack(s4);
    U.hack(a4);
    U.hack(o4);
    U.hack(l4);
    U.hack(u4);
    U.hack(f4);
    U.hack(c4);
    U.hack(p4);
    U.hack(d4);
    U.hack(h4);
    U.hack(m4);
    U.hack(g4);
    U.hack(y4);
    U.hack(w4);
    U.hack(v4);
    U.hack(b4);
    U.hack(x4);
    U.hack(k4);
    U.hack(S4);
    U.hack(_4);
    U.hack(T4);
    U.hack(O4);
    U.hack(E4);
    U.hack(A4);
    U.hack(C4);
    U.hack(P4);
    U.hack(I4);
    U.hack(q4);
    U.hack(D4);
    U.hack(R4);
    U.hack(B4);
    U.hack(M4);
    U.hack(L4);
    U.hack(F4);
    U.hack(N4);
    U.hack(z4);
    U.hack($4);
    U.hack(j4);
    ot.hack(U4);
    ot.hack(V4);
    ot.hack(W4);
    ot.hack(G4);
    ot.hack(H4);
    ot.hack(Y4);
    ot.hack(Q4);
    ot.hack(J4);
    var Bf = new Map(),
      Ji = class {
        constructor(e, r, i = {}) {
          (this.data = e),
            (this.browsers = r),
            (this.options = i),
            ([this.add, this.remove] = this.preprocess(this.select(this.data))),
            (this.transition = new W5(this)),
            (this.processor = new G5(this));
        }
        cleaner() {
          if (this.cleanerCache) return this.cleanerCache;
          if (this.browsers.selected.length) {
            let e = new Rf(this.browsers.data, []);
            this.cleanerCache = new Ji(this.data, e, this.options);
          } else return this;
          return this.cleanerCache;
        }
        select(e) {
          let r = { add: {}, remove: {} };
          for (let i in e) {
            let n = e[i],
              a = n.browsers.map((l) => {
                let c = l.split(" ");
                return { browser: `${c[0]} ${c[1]}`, note: c[2] };
              }),
              s = a
                .filter((l) => l.note)
                .map((l) => `${this.browsers.prefix(l.browser)} ${l.note}`);
            (s = zr.uniq(s)),
              (a = a
                .filter((l) => this.browsers.isSelected(l.browser))
                .map((l) => {
                  let c = this.browsers.prefix(l.browser);
                  return l.note ? `${c} ${l.note}` : c;
                })),
              (a = this.sort(zr.uniq(a))),
              this.options.flexbox === "no-2009" &&
                (a = a.filter((l) => !l.includes("2009")));
            let o = n.browsers.map((l) => this.browsers.prefix(l));
            n.mistakes && (o = o.concat(n.mistakes)),
              (o = o.concat(s)),
              (o = zr.uniq(o)),
              a.length
                ? ((r.add[i] = a),
                  a.length < o.length &&
                    (r.remove[i] = o.filter((l) => !a.includes(l))))
                : (r.remove[i] = o);
          }
          return r;
        }
        sort(e) {
          return e.sort((r, i) => {
            let n = zr.removeNote(r).length,
              a = zr.removeNote(i).length;
            return n === a ? i.length - r.length : a - n;
          });
        }
        preprocess(e) {
          let r = { selectors: [], "@supports": new H5(Ji, this) };
          for (let n in e.add) {
            let a = e.add[n];
            if (n === "@keyframes" || n === "@viewport")
              r[n] = new Y5(n, a, this);
            else if (n === "@resolution") r[n] = new Mb(n, a, this);
            else if (this.data[n].selector)
              r.selectors.push(Nr.load(n, a, this));
            else {
              let s = this.data[n].props;
              if (s) {
                let o = ot.load(n, a, this);
                for (let l of s)
                  r[l] || (r[l] = { values: [] }), r[l].values.push(o);
              } else {
                let o = (r[n] && r[n].values) || [];
                (r[n] = U.load(n, a, this)), (r[n].values = o);
              }
            }
          }
          let i = { selectors: [] };
          for (let n in e.remove) {
            let a = e.remove[n];
            if (this.data[n].selector) {
              let s = Nr.load(n, a);
              for (let o of a) i.selectors.push(s.old(o));
            } else if (n === "@keyframes" || n === "@viewport")
              for (let s of a) {
                let o = `@${s}${n.slice(1)}`;
                i[o] = { remove: !0 };
              }
            else if (n === "@resolution") i[n] = new Mb(n, a, this);
            else {
              let s = this.data[n].props;
              if (s) {
                let o = ot.load(n, [], this);
                for (let l of a) {
                  let c = o.old(l);
                  if (c)
                    for (let f of s)
                      i[f] || (i[f] = {}),
                        i[f].values || (i[f].values = []),
                        i[f].values.push(c);
                }
              } else
                for (let o of a) {
                  let l = this.decl(n).old(n, o);
                  if (n === "align-self") {
                    let c = r[n] && r[n].prefixes;
                    if (c) {
                      if (o === "-webkit- 2009" && c.includes("-webkit-"))
                        continue;
                      if (o === "-webkit-" && c.includes("-webkit- 2009"))
                        continue;
                    }
                  }
                  for (let c of l) i[c] || (i[c] = {}), (i[c].remove = !0);
                }
            }
          }
          return [r, i];
        }
        decl(e) {
          return Bf.has(e) || Bf.set(e, U.load(e)), Bf.get(e);
        }
        unprefixed(e) {
          let r = this.normalize(Bb.unprefixed(e));
          return r === "flex-direction" && (r = "flex-flow"), r;
        }
        normalize(e) {
          return this.decl(e).normalize(e);
        }
        prefixed(e, r) {
          return (e = Bb.unprefixed(e)), this.decl(e).prefixed(e, r);
        }
        values(e, r) {
          let i = this[e],
            n = i["*"] && i["*"].values,
            a = i[r] && i[r].values;
          return n && a ? zr.uniq(n.concat(a)) : n || a || [];
        }
        group(e) {
          let r = e.parent,
            i = r.index(e),
            { length: n } = r.nodes,
            a = this.unprefixed(e.prop),
            s = (o, l) => {
              for (i += o; i >= 0 && i < n; ) {
                let c = r.nodes[i];
                if (c.type === "decl") {
                  if (
                    (o === -1 && c.prop === a && !Rf.withPrefix(c.value)) ||
                    this.unprefixed(c.prop) !== a
                  )
                    break;
                  if (l(c) === !0) return !0;
                  if (o === 1 && c.prop === a && !Rf.withPrefix(c.value)) break;
                }
                i += o;
              }
              return !1;
            };
          return {
            up(o) {
              return s(-1, o);
            },
            down(o) {
              return s(1, o);
            },
          };
        }
      };
    Lb.exports = Ji;
  });
  var zb = k((E$, Nb) => {
    u();
    Nb.exports = {
      "backdrop-filter": {
        feature: "css-backdrop-filter",
        browsers: [
          "ios_saf 16.1",
          "ios_saf 16.3",
          "ios_saf 16.4",
          "ios_saf 16.5",
          "safari 16.5",
        ],
      },
      element: {
        props: [
          "background",
          "background-image",
          "border-image",
          "mask",
          "list-style",
          "list-style-image",
          "content",
          "mask-image",
        ],
        feature: "css-element-function",
        browsers: ["firefox 114"],
      },
      "user-select": {
        mistakes: ["-khtml-"],
        feature: "user-select-none",
        browsers: [
          "ios_saf 16.1",
          "ios_saf 16.3",
          "ios_saf 16.4",
          "ios_saf 16.5",
          "safari 16.5",
        ],
      },
      "background-clip": {
        feature: "background-clip-text",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      hyphens: {
        feature: "css-hyphens",
        browsers: [
          "ios_saf 16.1",
          "ios_saf 16.3",
          "ios_saf 16.4",
          "ios_saf 16.5",
          "safari 16.5",
        ],
      },
      fill: {
        props: [
          "width",
          "min-width",
          "max-width",
          "height",
          "min-height",
          "max-height",
          "inline-size",
          "min-inline-size",
          "max-inline-size",
          "block-size",
          "min-block-size",
          "max-block-size",
          "grid",
          "grid-template",
          "grid-template-rows",
          "grid-template-columns",
          "grid-auto-columns",
          "grid-auto-rows",
        ],
        feature: "intrinsic-width",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      "fill-available": {
        props: [
          "width",
          "min-width",
          "max-width",
          "height",
          "min-height",
          "max-height",
          "inline-size",
          "min-inline-size",
          "max-inline-size",
          "block-size",
          "min-block-size",
          "max-block-size",
          "grid",
          "grid-template",
          "grid-template-rows",
          "grid-template-columns",
          "grid-auto-columns",
          "grid-auto-rows",
        ],
        feature: "intrinsic-width",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      stretch: {
        props: [
          "width",
          "min-width",
          "max-width",
          "height",
          "min-height",
          "max-height",
          "inline-size",
          "min-inline-size",
          "max-inline-size",
          "block-size",
          "min-block-size",
          "max-block-size",
          "grid",
          "grid-template",
          "grid-template-rows",
          "grid-template-columns",
          "grid-auto-columns",
          "grid-auto-rows",
        ],
        feature: "intrinsic-width",
        browsers: ["firefox 114"],
      },
      "fit-content": {
        props: [
          "width",
          "min-width",
          "max-width",
          "height",
          "min-height",
          "max-height",
          "inline-size",
          "min-inline-size",
          "max-inline-size",
          "block-size",
          "min-block-size",
          "max-block-size",
          "grid",
          "grid-template",
          "grid-template-rows",
          "grid-template-columns",
          "grid-auto-columns",
          "grid-auto-rows",
        ],
        feature: "intrinsic-width",
        browsers: ["firefox 114"],
      },
      "text-decoration-style": {
        feature: "text-decoration",
        browsers: [
          "ios_saf 16.1",
          "ios_saf 16.3",
          "ios_saf 16.4",
          "ios_saf 16.5",
        ],
      },
      "text-decoration-color": {
        feature: "text-decoration",
        browsers: [
          "ios_saf 16.1",
          "ios_saf 16.3",
          "ios_saf 16.4",
          "ios_saf 16.5",
        ],
      },
      "text-decoration-line": {
        feature: "text-decoration",
        browsers: [
          "ios_saf 16.1",
          "ios_saf 16.3",
          "ios_saf 16.4",
          "ios_saf 16.5",
        ],
      },
      "text-decoration": {
        feature: "text-decoration",
        browsers: [
          "ios_saf 16.1",
          "ios_saf 16.3",
          "ios_saf 16.4",
          "ios_saf 16.5",
        ],
      },
      "text-decoration-skip": {
        feature: "text-decoration",
        browsers: [
          "ios_saf 16.1",
          "ios_saf 16.3",
          "ios_saf 16.4",
          "ios_saf 16.5",
        ],
      },
      "text-decoration-skip-ink": {
        feature: "text-decoration",
        browsers: [
          "ios_saf 16.1",
          "ios_saf 16.3",
          "ios_saf 16.4",
          "ios_saf 16.5",
        ],
      },
      "text-size-adjust": {
        feature: "text-size-adjust",
        browsers: [
          "ios_saf 16.1",
          "ios_saf 16.3",
          "ios_saf 16.4",
          "ios_saf 16.5",
        ],
      },
      "mask-clip": {
        feature: "css-masks",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      "mask-composite": {
        feature: "css-masks",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      "mask-image": {
        feature: "css-masks",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      "mask-origin": {
        feature: "css-masks",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      "mask-repeat": {
        feature: "css-masks",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      "mask-border-repeat": {
        feature: "css-masks",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      "mask-border-source": {
        feature: "css-masks",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      mask: {
        feature: "css-masks",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      "mask-position": {
        feature: "css-masks",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      "mask-size": {
        feature: "css-masks",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      "mask-border": {
        feature: "css-masks",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      "mask-border-outset": {
        feature: "css-masks",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      "mask-border-width": {
        feature: "css-masks",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      "mask-border-slice": {
        feature: "css-masks",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      "clip-path": { feature: "css-clip-path", browsers: ["samsung 21"] },
      "box-decoration-break": {
        feature: "css-boxdecorationbreak",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "ios_saf 16.1",
          "ios_saf 16.3",
          "ios_saf 16.4",
          "ios_saf 16.5",
          "opera 99",
          "safari 16.5",
          "samsung 21",
        ],
      },
      appearance: { feature: "css-appearance", browsers: ["samsung 21"] },
      "image-set": {
        props: [
          "background",
          "background-image",
          "border-image",
          "cursor",
          "mask",
          "mask-image",
          "list-style",
          "list-style-image",
          "content",
        ],
        feature: "css-image-set",
        browsers: ["and_uc 15.5", "chrome 109", "samsung 21"],
      },
      "cross-fade": {
        props: [
          "background",
          "background-image",
          "border-image",
          "mask",
          "list-style",
          "list-style-image",
          "content",
          "mask-image",
        ],
        feature: "css-cross-fade",
        browsers: [
          "and_chr 114",
          "and_uc 15.5",
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
          "samsung 21",
        ],
      },
      isolate: {
        props: ["unicode-bidi"],
        feature: "css-unicode-bidi",
        browsers: [
          "ios_saf 16.1",
          "ios_saf 16.3",
          "ios_saf 16.4",
          "ios_saf 16.5",
          "safari 16.5",
        ],
      },
      "color-adjust": {
        feature: "css-color-adjust",
        browsers: [
          "chrome 109",
          "chrome 113",
          "chrome 114",
          "edge 114",
          "opera 99",
        ],
      },
    };
  });
  var jb = k((A$, $b) => {
    u();
    $b.exports = {};
  });
  var Gb = k((C$, Wb) => {
    u();
    var K4 = _u(),
      { agents: X4 } = (na(), ia),
      Mf = i0(),
      Z4 = $t(),
      e3 = Fb(),
      t3 = zb(),
      r3 = jb(),
      Ub = { browsers: X4, prefixes: t3 },
      Vb = `
  Replace Autoprefixer \`browsers\` option to Browserslist config.
  Use \`browserslist\` key in \`package.json\` or \`.browserslistrc\` file.

  Using \`browsers\` option can cause errors. Browserslist config can
  be used for Babel, Autoprefixer, postcss-normalize and other tools.

  If you really need to use option, rename it to \`overrideBrowserslist\`.

  Learn more at:
  https://github.com/browserslist/browserslist#readme
  https://twitter.com/browserslist

`;
    function i3(t) {
      return Object.prototype.toString.apply(t) === "[object Object]";
    }
    var Lf = new Map();
    function n3(t, e) {
      e.browsers.selected.length !== 0 &&
        (e.add.selectors.length > 0 ||
          Object.keys(e.add).length > 2 ||
          t.warn(`Autoprefixer target browsers do not need any prefixes.You do not need Autoprefixer anymore.
Check your Browserslist config to be sure that your targets are set up correctly.

  Learn more at:
  https://github.com/postcss/autoprefixer#readme
  https://github.com/browserslist/browserslist#readme

`));
    }
    Wb.exports = $r;
    function $r(...t) {
      let e;
      if (
        (t.length === 1 && i3(t[0])
          ? ((e = t[0]), (t = void 0))
          : t.length === 0 || (t.length === 1 && !t[0])
          ? (t = void 0)
          : t.length <= 2 && (Array.isArray(t[0]) || !t[0])
          ? ((e = t[1]), (t = t[0]))
          : typeof t[t.length - 1] == "object" && (e = t.pop()),
        e || (e = {}),
        e.browser)
      )
        throw new Error(
          "Change `browser` option to `overrideBrowserslist` in Autoprefixer"
        );
      if (e.browserslist)
        throw new Error(
          "Change `browserslist` option to `overrideBrowserslist` in Autoprefixer"
        );
      e.overrideBrowserslist
        ? (t = e.overrideBrowserslist)
        : e.browsers &&
          (typeof console != "undefined" &&
            console.warn &&
            (Mf.red
              ? console.warn(
                  Mf.red(
                    Vb.replace(/`[^`]+`/g, (n) => Mf.yellow(n.slice(1, -1)))
                  )
                )
              : console.warn(Vb)),
          (t = e.browsers));
      let r = {
        ignoreUnknownVersions: e.ignoreUnknownVersions,
        stats: e.stats,
        env: e.env,
      };
      function i(n) {
        let a = Ub,
          s = new Z4(a.browsers, t, n, r),
          o = s.selected.join(", ") + JSON.stringify(e);
        return Lf.has(o) || Lf.set(o, new e3(a.prefixes, s, e)), Lf.get(o);
      }
      return {
        postcssPlugin: "autoprefixer",
        prepare(n) {
          let a = i({ from: n.opts.from, env: e.env });
          return {
            OnceExit(s) {
              n3(n, a),
                e.remove !== !1 && a.processor.remove(s, n),
                e.add !== !1 && a.processor.add(s, n);
            },
          };
        },
        info(n) {
          return (n = n || {}), (n.from = n.from || g.cwd()), r3(i(n));
        },
        options: e,
        browsers: t,
      };
    }
    $r.postcss = !0;
    $r.data = Ub;
    $r.defaults = K4.defaults;
    $r.info = () => $r().info();
  });
  var Yb = k((P$, Hb) => {
    u();
    Hb.exports = {
      aqua: /#00ffff(ff)?(?!\w)|#0ff(f)?(?!\w)/gi,
      azure: /#f0ffff(ff)?(?!\w)/gi,
      beige: /#f5f5dc(ff)?(?!\w)/gi,
      bisque: /#ffe4c4(ff)?(?!\w)/gi,
      black: /#000000(ff)?(?!\w)|#000(f)?(?!\w)/gi,
      blue: /#0000ff(ff)?(?!\w)|#00f(f)?(?!\w)/gi,
      brown: /#a52a2a(ff)?(?!\w)/gi,
      coral: /#ff7f50(ff)?(?!\w)/gi,
      cornsilk: /#fff8dc(ff)?(?!\w)/gi,
      crimson: /#dc143c(ff)?(?!\w)/gi,
      cyan: /#00ffff(ff)?(?!\w)|#0ff(f)?(?!\w)/gi,
      darkblue: /#00008b(ff)?(?!\w)/gi,
      darkcyan: /#008b8b(ff)?(?!\w)/gi,
      darkgrey: /#a9a9a9(ff)?(?!\w)/gi,
      darkred: /#8b0000(ff)?(?!\w)/gi,
      deeppink: /#ff1493(ff)?(?!\w)/gi,
      dimgrey: /#696969(ff)?(?!\w)/gi,
      gold: /#ffd700(ff)?(?!\w)/gi,
      green: /#008000(ff)?(?!\w)/gi,
      grey: /#808080(ff)?(?!\w)/gi,
      honeydew: /#f0fff0(ff)?(?!\w)/gi,
      hotpink: /#ff69b4(ff)?(?!\w)/gi,
      indigo: /#4b0082(ff)?(?!\w)/gi,
      ivory: /#fffff0(ff)?(?!\w)/gi,
      khaki: /#f0e68c(ff)?(?!\w)/gi,
      lavender: /#e6e6fa(ff)?(?!\w)/gi,
      lime: /#00ff00(ff)?(?!\w)|#0f0(f)?(?!\w)/gi,
      linen: /#faf0e6(ff)?(?!\w)/gi,
      maroon: /#800000(ff)?(?!\w)/gi,
      moccasin: /#ffe4b5(ff)?(?!\w)/gi,
      navy: /#000080(ff)?(?!\w)/gi,
      oldlace: /#fdf5e6(ff)?(?!\w)/gi,
      olive: /#808000(ff)?(?!\w)/gi,
      orange: /#ffa500(ff)?(?!\w)/gi,
      orchid: /#da70d6(ff)?(?!\w)/gi,
      peru: /#cd853f(ff)?(?!\w)/gi,
      pink: /#ffc0cb(ff)?(?!\w)/gi,
      plum: /#dda0dd(ff)?(?!\w)/gi,
      purple: /#800080(ff)?(?!\w)/gi,
      red: /#ff0000(ff)?(?!\w)|#f00(f)?(?!\w)/gi,
      salmon: /#fa8072(ff)?(?!\w)/gi,
      seagreen: /#2e8b57(ff)?(?!\w)/gi,
      seashell: /#fff5ee(ff)?(?!\w)/gi,
      sienna: /#a0522d(ff)?(?!\w)/gi,
      silver: /#c0c0c0(ff)?(?!\w)/gi,
      skyblue: /#87ceeb(ff)?(?!\w)/gi,
      snow: /#fffafa(ff)?(?!\w)/gi,
      tan: /#d2b48c(ff)?(?!\w)/gi,
      teal: /#008080(ff)?(?!\w)/gi,
      thistle: /#d8bfd8(ff)?(?!\w)/gi,
      tomato: /#ff6347(ff)?(?!\w)/gi,
      violet: /#ee82ee(ff)?(?!\w)/gi,
      wheat: /#f5deb3(ff)?(?!\w)/gi,
      white: /#ffffff(ff)?(?!\w)|#fff(f)?(?!\w)/gi,
    };
  });
  var Jb = k((I$, Qb) => {
    u();
    var Ff = Yb(),
      Nf = { whitespace: /\s+/g, urlHexPairs: /%[\dA-F]{2}/g, quotes: /"/g };
    function s3(t) {
      return t.trim().replace(Nf.whitespace, " ");
    }
    function a3(t) {
      return encodeURIComponent(t).replace(Nf.urlHexPairs, l3);
    }
    function o3(t) {
      return (
        Object.keys(Ff).forEach(function (e) {
          Ff[e].test(t) && (t = t.replace(Ff[e], e));
        }),
        t
      );
    }
    function l3(t) {
      switch (t) {
        case "%20":
          return " ";
        case "%3D":
          return "=";
        case "%3A":
          return ":";
        case "%2F":
          return "/";
        default:
          return t.toLowerCase();
      }
    }
    function zf(t) {
      if (typeof t != "string")
        throw new TypeError("Expected a string, but received " + typeof t);
      t.charCodeAt(0) === 65279 && (t = t.slice(1));
      var e = o3(s3(t)).replace(Nf.quotes, "'");
      return "data:image/svg+xml," + a3(e);
    }
    zf.toSrcset = function (e) {
      return zf(e).replace(/ /g, "%20");
    };
    Qb.exports = zf;
  });
  var $f = {};
  He($f, { default: () => u3 });
  var Kb,
    u3,
    jf = A(() => {
      u();
      Rn();
      (Kb = ce(Nn())), (u3 = Et(Kb.default.theme));
    });
  var r1 = k((D$, t1) => {
    u();
    var ca = Jb(),
      f3 = (Wi(), Vi).default,
      Xb = (jf(), $f).default,
      Vt = (Qr(), In).default,
      [c3, { lineHeight: p3 }] = Xb.fontSize.base,
      { spacing: vt, borderWidth: Zb, borderRadius: e1 } = Xb;
    function Wt(t, e) {
      return t.replace("<alpha-value>", `var(${e}, 1)`);
    }
    var d3 = f3.withOptions(function (t = { strategy: void 0 }) {
      return function ({ addBase: e, addComponents: r, theme: i }) {
        let n = t.strategy === void 0 ? ["base", "class"] : [t.strategy],
          a = [
            {
              base: [
                "[type='text']",
                "input:where(:not([type]))",
                "[type='email']",
                "[type='url']",
                "[type='password']",
                "[type='number']",
                "[type='date']",
                "[type='datetime-local']",
                "[type='month']",
                "[type='search']",
                "[type='tel']",
                "[type='time']",
                "[type='week']",
                "[multiple]",
                "textarea",
                "select",
              ],
              class: [
                ".form-input",
                ".form-textarea",
                ".form-select",
                ".form-multiselect",
              ],
              styles: {
                appearance: "none",
                "background-color": "#fff",
                "border-color": Wt(
                  i("colors.gray.500", Vt.gray[500]),
                  "--tw-border-opacity"
                ),
                "border-width": Zb.DEFAULT,
                "border-radius": e1.none,
                "padding-top": vt[2],
                "padding-right": vt[3],
                "padding-bottom": vt[2],
                "padding-left": vt[3],
                "font-size": c3,
                "line-height": p3,
                "--tw-shadow": "0 0 #0000",
                "&:focus": {
                  outline: "2px solid transparent",
                  "outline-offset": "2px",
                  "--tw-ring-inset": "var(--tw-empty,/*!*/ /*!*/)",
                  "--tw-ring-offset-width": "0px",
                  "--tw-ring-offset-color": "#fff",
                  "--tw-ring-color": Wt(
                    i("colors.blue.600", Vt.blue[600]),
                    "--tw-ring-opacity"
                  ),
                  "--tw-ring-offset-shadow":
                    "var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
                  "--tw-ring-shadow":
                    "var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)",
                  "box-shadow":
                    "var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
                  "border-color": Wt(
                    i("colors.blue.600", Vt.blue[600]),
                    "--tw-border-opacity"
                  ),
                },
              },
            },
            {
              base: ["input::placeholder", "textarea::placeholder"],
              class: [
                ".form-input::placeholder",
                ".form-textarea::placeholder",
              ],
              styles: {
                color: Wt(
                  i("colors.gray.500", Vt.gray[500]),
                  "--tw-text-opacity"
                ),
                opacity: "1",
              },
            },
            {
              base: ["::-webkit-datetime-edit-fields-wrapper"],
              class: [".form-input::-webkit-datetime-edit-fields-wrapper"],
              styles: { padding: "0" },
            },
            {
              base: ["::-webkit-date-and-time-value"],
              class: [".form-input::-webkit-date-and-time-value"],
              styles: { "min-height": "1.5em" },
            },
            {
              base: ["::-webkit-date-and-time-value"],
              class: [".form-input::-webkit-date-and-time-value"],
              styles: { "text-align": "inherit" },
            },
            {
              base: ["::-webkit-datetime-edit"],
              class: [".form-input::-webkit-datetime-edit"],
              styles: { display: "inline-flex" },
            },
            {
              base: [
                "::-webkit-datetime-edit",
                "::-webkit-datetime-edit-year-field",
                "::-webkit-datetime-edit-month-field",
                "::-webkit-datetime-edit-day-field",
                "::-webkit-datetime-edit-hour-field",
                "::-webkit-datetime-edit-minute-field",
                "::-webkit-datetime-edit-second-field",
                "::-webkit-datetime-edit-millisecond-field",
                "::-webkit-datetime-edit-meridiem-field",
              ],
              class: [
                ".form-input::-webkit-datetime-edit",
                ".form-input::-webkit-datetime-edit-year-field",
                ".form-input::-webkit-datetime-edit-month-field",
                ".form-input::-webkit-datetime-edit-day-field",
                ".form-input::-webkit-datetime-edit-hour-field",
                ".form-input::-webkit-datetime-edit-minute-field",
                ".form-input::-webkit-datetime-edit-second-field",
                ".form-input::-webkit-datetime-edit-millisecond-field",
                ".form-input::-webkit-datetime-edit-meridiem-field",
              ],
              styles: { "padding-top": 0, "padding-bottom": 0 },
            },
            {
              base: ["select"],
              class: [".form-select"],
              styles: {
                "background-image": `url("${ca(
                  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="${Wt(
                    i("colors.gray.500", Vt.gray[500]),
                    "--tw-stroke-opacity"
                  )}" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/></svg>`
                )}")`,
                "background-position": `right ${vt[2]} center`,
                "background-repeat": "no-repeat",
                "background-size": "1.5em 1.5em",
                "padding-right": vt[10],
                "print-color-adjust": "exact",
              },
            },
            {
              base: ["[multiple]", '[size]:where(select:not([size="1"]))'],
              class: ['.form-select:where([size]:not([size="1"]))'],
              styles: {
                "background-image": "initial",
                "background-position": "initial",
                "background-repeat": "unset",
                "background-size": "initial",
                "padding-right": vt[3],
                "print-color-adjust": "unset",
              },
            },
            {
              base: ["[type='checkbox']", "[type='radio']"],
              class: [".form-checkbox", ".form-radio"],
              styles: {
                appearance: "none",
                padding: "0",
                "print-color-adjust": "exact",
                display: "inline-block",
                "vertical-align": "middle",
                "background-origin": "border-box",
                "user-select": "none",
                "flex-shrink": "0",
                height: vt[4],
                width: vt[4],
                color: Wt(
                  i("colors.blue.600", Vt.blue[600]),
                  "--tw-text-opacity"
                ),
                "background-color": "#fff",
                "border-color": Wt(
                  i("colors.gray.500", Vt.gray[500]),
                  "--tw-border-opacity"
                ),
                "border-width": Zb.DEFAULT,
                "--tw-shadow": "0 0 #0000",
              },
            },
            {
              base: ["[type='checkbox']"],
              class: [".form-checkbox"],
              styles: { "border-radius": e1.none },
            },
            {
              base: ["[type='radio']"],
              class: [".form-radio"],
              styles: { "border-radius": "100%" },
            },
            {
              base: ["[type='checkbox']:focus", "[type='radio']:focus"],
              class: [".form-checkbox:focus", ".form-radio:focus"],
              styles: {
                outline: "2px solid transparent",
                "outline-offset": "2px",
                "--tw-ring-inset": "var(--tw-empty,/*!*/ /*!*/)",
                "--tw-ring-offset-width": "2px",
                "--tw-ring-offset-color": "#fff",
                "--tw-ring-color": Wt(
                  i("colors.blue.600", Vt.blue[600]),
                  "--tw-ring-opacity"
                ),
                "--tw-ring-offset-shadow":
                  "var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
                "--tw-ring-shadow":
                  "var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)",
                "box-shadow":
                  "var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
              },
            },
            {
              base: ["[type='checkbox']:checked", "[type='radio']:checked"],
              class: [".form-checkbox:checked", ".form-radio:checked"],
              styles: {
                "border-color": "transparent",
                "background-color": "currentColor",
                "background-size": "100% 100%",
                "background-position": "center",
                "background-repeat": "no-repeat",
              },
            },
            {
              base: ["[type='checkbox']:checked"],
              class: [".form-checkbox:checked"],
              styles: {
                "background-image": `url("${ca(
                  '<svg viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"/></svg>'
                )}")`,
                "@media (forced-colors: active) ": { appearance: "auto" },
              },
            },
            {
              base: ["[type='radio']:checked"],
              class: [".form-radio:checked"],
              styles: {
                "background-image": `url("${ca(
                  '<svg viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3"/></svg>'
                )}")`,
                "@media (forced-colors: active) ": { appearance: "auto" },
              },
            },
            {
              base: [
                "[type='checkbox']:checked:hover",
                "[type='checkbox']:checked:focus",
                "[type='radio']:checked:hover",
                "[type='radio']:checked:focus",
              ],
              class: [
                ".form-checkbox:checked:hover",
                ".form-checkbox:checked:focus",
                ".form-radio:checked:hover",
                ".form-radio:checked:focus",
              ],
              styles: {
                "border-color": "transparent",
                "background-color": "currentColor",
              },
            },
            {
              base: ["[type='checkbox']:indeterminate"],
              class: [".form-checkbox:indeterminate"],
              styles: {
                "background-image": `url("${ca(
                  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h8"/></svg>'
                )}")`,
                "border-color": "transparent",
                "background-color": "currentColor",
                "background-size": "100% 100%",
                "background-position": "center",
                "background-repeat": "no-repeat",
                "@media (forced-colors: active) ": { appearance: "auto" },
              },
            },
            {
              base: [
                "[type='checkbox']:indeterminate:hover",
                "[type='checkbox']:indeterminate:focus",
              ],
              class: [
                ".form-checkbox:indeterminate:hover",
                ".form-checkbox:indeterminate:focus",
              ],
              styles: {
                "border-color": "transparent",
                "background-color": "currentColor",
              },
            },
            {
              base: ["[type='file']"],
              class: null,
              styles: {
                background: "unset",
                "border-color": "inherit",
                "border-width": "0",
                "border-radius": "0",
                padding: "0",
                "font-size": "unset",
                "line-height": "inherit",
              },
            },
            {
              base: ["[type='file']:focus"],
              class: null,
              styles: {
                outline: [
                  "1px solid ButtonText",
                  "1px auto -webkit-focus-ring-color",
                ],
              },
            },
          ],
          s = (o) =>
            a
              .map((l) => (l[o] === null ? null : { [l[o]]: l.styles }))
              .filter(Boolean);
        n.includes("base") && e(s("base")),
          n.includes("class") && r(s("class"));
      };
    });
    t1.exports = d3;
  });
  var I1 = k((tn, Vr) => {
    u();
    var h3 = 200,
      i1 = "__lodash_hash_undefined__",
      m3 = 800,
      g3 = 16,
      n1 = 9007199254740991,
      s1 = "[object Arguments]",
      y3 = "[object Array]",
      w3 = "[object AsyncFunction]",
      v3 = "[object Boolean]",
      b3 = "[object Date]",
      x3 = "[object Error]",
      a1 = "[object Function]",
      k3 = "[object GeneratorFunction]",
      S3 = "[object Map]",
      _3 = "[object Number]",
      T3 = "[object Null]",
      o1 = "[object Object]",
      O3 = "[object Proxy]",
      E3 = "[object RegExp]",
      A3 = "[object Set]",
      C3 = "[object String]",
      P3 = "[object Undefined]",
      I3 = "[object WeakMap]",
      q3 = "[object ArrayBuffer]",
      D3 = "[object DataView]",
      R3 = "[object Float32Array]",
      B3 = "[object Float64Array]",
      M3 = "[object Int8Array]",
      L3 = "[object Int16Array]",
      F3 = "[object Int32Array]",
      N3 = "[object Uint8Array]",
      z3 = "[object Uint8ClampedArray]",
      $3 = "[object Uint16Array]",
      j3 = "[object Uint32Array]",
      U3 = /[\\^$.*+?()[\]{}|]/g,
      V3 = /^\[object .+?Constructor\]$/,
      W3 = /^(?:0|[1-9]\d*)$/,
      se = {};
    se[R3] =
      se[B3] =
      se[M3] =
      se[L3] =
      se[F3] =
      se[N3] =
      se[z3] =
      se[$3] =
      se[j3] =
        !0;
    se[s1] =
      se[y3] =
      se[q3] =
      se[v3] =
      se[D3] =
      se[b3] =
      se[x3] =
      se[a1] =
      se[S3] =
      se[_3] =
      se[o1] =
      se[E3] =
      se[A3] =
      se[C3] =
      se[I3] =
        !1;
    var l1 =
        typeof global == "object" &&
        global &&
        global.Object === Object &&
        global,
      G3 = typeof self == "object" && self && self.Object === Object && self,
      Ki = l1 || G3 || Function("return this")(),
      u1 = typeof tn == "object" && tn && !tn.nodeType && tn,
      Xi = u1 && typeof Vr == "object" && Vr && !Vr.nodeType && Vr,
      f1 = Xi && Xi.exports === u1,
      Uf = f1 && l1.process,
      c1 = (function () {
        try {
          var t = Xi && Xi.require && Xi.require("util").types;
          return t || (Uf && Uf.binding && Uf.binding("util"));
        } catch (e) {}
      })(),
      p1 = c1 && c1.isTypedArray;
    function H3(t, e, r) {
      switch (r.length) {
        case 0:
          return t.call(e);
        case 1:
          return t.call(e, r[0]);
        case 2:
          return t.call(e, r[0], r[1]);
        case 3:
          return t.call(e, r[0], r[1], r[2]);
      }
      return t.apply(e, r);
    }
    function Y3(t, e) {
      for (var r = -1, i = Array(t); ++r < t; ) i[r] = e(r);
      return i;
    }
    function Q3(t) {
      return function (e) {
        return t(e);
      };
    }
    function J3(t, e) {
      return t == null ? void 0 : t[e];
    }
    function K3(t, e) {
      return function (r) {
        return t(e(r));
      };
    }
    var X3 = Array.prototype,
      Z3 = Function.prototype,
      pa = Object.prototype,
      Vf = Ki["__core-js_shared__"],
      da = Z3.toString,
      bt = pa.hasOwnProperty,
      d1 = (function () {
        var t = /[^.]+$/.exec((Vf && Vf.keys && Vf.keys.IE_PROTO) || "");
        return t ? "Symbol(src)_1." + t : "";
      })(),
      h1 = pa.toString,
      eI = da.call(Object),
      tI = RegExp(
        "^" +
          da
            .call(bt)
            .replace(U3, "\\$&")
            .replace(
              /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
              "$1.*?"
            ) +
          "$"
      ),
      ha = f1 ? Ki.Buffer : void 0,
      m1 = Ki.Symbol,
      g1 = Ki.Uint8Array,
      y1 = ha ? ha.allocUnsafe : void 0,
      w1 = K3(Object.getPrototypeOf, Object),
      v1 = Object.create,
      rI = pa.propertyIsEnumerable,
      iI = X3.splice,
      er = m1 ? m1.toStringTag : void 0,
      ma = (function () {
        try {
          var t = Hf(Object, "defineProperty");
          return t({}, "", {}), t;
        } catch (e) {}
      })(),
      nI = ha ? ha.isBuffer : void 0,
      b1 = Math.max,
      sI = Date.now,
      x1 = Hf(Ki, "Map"),
      Zi = Hf(Object, "create"),
      aI = (function () {
        function t() {}
        return function (e) {
          if (!rr(e)) return {};
          if (v1) return v1(e);
          t.prototype = e;
          var r = new t();
          return (t.prototype = void 0), r;
        };
      })();
    function tr(t) {
      var e = -1,
        r = t == null ? 0 : t.length;
      for (this.clear(); ++e < r; ) {
        var i = t[e];
        this.set(i[0], i[1]);
      }
    }
    function oI() {
      (this.__data__ = Zi ? Zi(null) : {}), (this.size = 0);
    }
    function lI(t) {
      var e = this.has(t) && delete this.__data__[t];
      return (this.size -= e ? 1 : 0), e;
    }
    function uI(t) {
      var e = this.__data__;
      if (Zi) {
        var r = e[t];
        return r === i1 ? void 0 : r;
      }
      return bt.call(e, t) ? e[t] : void 0;
    }
    function fI(t) {
      var e = this.__data__;
      return Zi ? e[t] !== void 0 : bt.call(e, t);
    }
    function cI(t, e) {
      var r = this.__data__;
      return (
        (this.size += this.has(t) ? 0 : 1),
        (r[t] = Zi && e === void 0 ? i1 : e),
        this
      );
    }
    tr.prototype.clear = oI;
    tr.prototype.delete = lI;
    tr.prototype.get = uI;
    tr.prototype.has = fI;
    tr.prototype.set = cI;
    function xt(t) {
      var e = -1,
        r = t == null ? 0 : t.length;
      for (this.clear(); ++e < r; ) {
        var i = t[e];
        this.set(i[0], i[1]);
      }
    }
    function pI() {
      (this.__data__ = []), (this.size = 0);
    }
    function dI(t) {
      var e = this.__data__,
        r = ga(e, t);
      if (r < 0) return !1;
      var i = e.length - 1;
      return r == i ? e.pop() : iI.call(e, r, 1), --this.size, !0;
    }
    function hI(t) {
      var e = this.__data__,
        r = ga(e, t);
      return r < 0 ? void 0 : e[r][1];
    }
    function mI(t) {
      return ga(this.__data__, t) > -1;
    }
    function gI(t, e) {
      var r = this.__data__,
        i = ga(r, t);
      return i < 0 ? (++this.size, r.push([t, e])) : (r[i][1] = e), this;
    }
    xt.prototype.clear = pI;
    xt.prototype.delete = dI;
    xt.prototype.get = hI;
    xt.prototype.has = mI;
    xt.prototype.set = gI;
    function jr(t) {
      var e = -1,
        r = t == null ? 0 : t.length;
      for (this.clear(); ++e < r; ) {
        var i = t[e];
        this.set(i[0], i[1]);
      }
    }
    function yI() {
      (this.size = 0),
        (this.__data__ = {
          hash: new tr(),
          map: new (x1 || xt)(),
          string: new tr(),
        });
    }
    function wI(t) {
      var e = wa(this, t).delete(t);
      return (this.size -= e ? 1 : 0), e;
    }
    function vI(t) {
      return wa(this, t).get(t);
    }
    function bI(t) {
      return wa(this, t).has(t);
    }
    function xI(t, e) {
      var r = wa(this, t),
        i = r.size;
      return r.set(t, e), (this.size += r.size == i ? 0 : 1), this;
    }
    jr.prototype.clear = yI;
    jr.prototype.delete = wI;
    jr.prototype.get = vI;
    jr.prototype.has = bI;
    jr.prototype.set = xI;
    function Ur(t) {
      var e = (this.__data__ = new xt(t));
      this.size = e.size;
    }
    function kI() {
      (this.__data__ = new xt()), (this.size = 0);
    }
    function SI(t) {
      var e = this.__data__,
        r = e.delete(t);
      return (this.size = e.size), r;
    }
    function _I(t) {
      return this.__data__.get(t);
    }
    function TI(t) {
      return this.__data__.has(t);
    }
    function OI(t, e) {
      var r = this.__data__;
      if (r instanceof xt) {
        var i = r.__data__;
        if (!x1 || i.length < h3 - 1)
          return i.push([t, e]), (this.size = ++r.size), this;
        r = this.__data__ = new jr(i);
      }
      return r.set(t, e), (this.size = r.size), this;
    }
    Ur.prototype.clear = kI;
    Ur.prototype.delete = SI;
    Ur.prototype.get = _I;
    Ur.prototype.has = TI;
    Ur.prototype.set = OI;
    function EI(t, e) {
      var r = Jf(t),
        i = !r && Qf(t),
        n = !r && !i && O1(t),
        a = !r && !i && !n && A1(t),
        s = r || i || n || a,
        o = s ? Y3(t.length, String) : [],
        l = o.length;
      for (var c in t)
        (e || bt.call(t, c)) &&
          !(
            s &&
            (c == "length" ||
              (n && (c == "offset" || c == "parent")) ||
              (a &&
                (c == "buffer" || c == "byteLength" || c == "byteOffset")) ||
              _1(c, l))
          ) &&
          o.push(c);
      return o;
    }
    function Wf(t, e, r) {
      ((r !== void 0 && !va(t[e], r)) || (r === void 0 && !(e in t))) &&
        Gf(t, e, r);
    }
    function AI(t, e, r) {
      var i = t[e];
      (!(bt.call(t, e) && va(i, r)) || (r === void 0 && !(e in t))) &&
        Gf(t, e, r);
    }
    function ga(t, e) {
      for (var r = t.length; r--; ) if (va(t[r][0], e)) return r;
      return -1;
    }
    function Gf(t, e, r) {
      e == "__proto__" && ma
        ? ma(t, e, { configurable: !0, enumerable: !0, value: r, writable: !0 })
        : (t[e] = r);
    }
    var CI = jI();
    function ya(t) {
      return t == null
        ? t === void 0
          ? P3
          : T3
        : er && er in Object(t)
        ? UI(t)
        : QI(t);
    }
    function k1(t) {
      return en(t) && ya(t) == s1;
    }
    function PI(t) {
      if (!rr(t) || HI(t)) return !1;
      var e = Xf(t) ? tI : V3;
      return e.test(ZI(t));
    }
    function II(t) {
      return en(t) && E1(t.length) && !!se[ya(t)];
    }
    function qI(t) {
      if (!rr(t)) return YI(t);
      var e = T1(t),
        r = [];
      for (var i in t)
        (i == "constructor" && (e || !bt.call(t, i))) || r.push(i);
      return r;
    }
    function S1(t, e, r, i, n) {
      t !== e &&
        CI(
          e,
          function (a, s) {
            if ((n || (n = new Ur()), rr(a))) DI(t, e, s, r, S1, i, n);
            else {
              var o = i ? i(Yf(t, s), a, s + "", t, e, n) : void 0;
              o === void 0 && (o = a), Wf(t, s, o);
            }
          },
          C1
        );
    }
    function DI(t, e, r, i, n, a, s) {
      var o = Yf(t, r),
        l = Yf(e, r),
        c = s.get(l);
      if (c) {
        Wf(t, r, c);
        return;
      }
      var f = a ? a(o, l, r + "", t, e, s) : void 0,
        p = f === void 0;
      if (p) {
        var h = Jf(l),
          m = !h && O1(l),
          b = !h && !m && A1(l);
        (f = l),
          h || m || b
            ? Jf(o)
              ? (f = o)
              : e6(o)
              ? (f = NI(o))
              : m
              ? ((p = !1), (f = MI(l, !0)))
              : b
              ? ((p = !1), (f = FI(l, !0)))
              : (f = [])
            : t6(l) || Qf(l)
            ? ((f = o), Qf(o) ? (f = r6(o)) : (!rr(o) || Xf(o)) && (f = VI(l)))
            : (p = !1);
      }
      p && (s.set(l, f), n(f, l, i, a, s), s.delete(l)), Wf(t, r, f);
    }
    function RI(t, e) {
      return KI(JI(t, e, P1), t + "");
    }
    var BI = ma
      ? function (t, e) {
          return ma(t, "toString", {
            configurable: !0,
            enumerable: !1,
            value: n6(e),
            writable: !0,
          });
        }
      : P1;
    function MI(t, e) {
      if (e) return t.slice();
      var r = t.length,
        i = y1 ? y1(r) : new t.constructor(r);
      return t.copy(i), i;
    }
    function LI(t) {
      var e = new t.constructor(t.byteLength);
      return new g1(e).set(new g1(t)), e;
    }
    function FI(t, e) {
      var r = e ? LI(t.buffer) : t.buffer;
      return new t.constructor(r, t.byteOffset, t.length);
    }
    function NI(t, e) {
      var r = -1,
        i = t.length;
      for (e || (e = Array(i)); ++r < i; ) e[r] = t[r];
      return e;
    }
    function zI(t, e, r, i) {
      var n = !r;
      r || (r = {});
      for (var a = -1, s = e.length; ++a < s; ) {
        var o = e[a],
          l = i ? i(r[o], t[o], o, r, t) : void 0;
        l === void 0 && (l = t[o]), n ? Gf(r, o, l) : AI(r, o, l);
      }
      return r;
    }
    function $I(t) {
      return RI(function (e, r) {
        var i = -1,
          n = r.length,
          a = n > 1 ? r[n - 1] : void 0,
          s = n > 2 ? r[2] : void 0;
        for (
          a = t.length > 3 && typeof a == "function" ? (n--, a) : void 0,
            s && WI(r[0], r[1], s) && ((a = n < 3 ? void 0 : a), (n = 1)),
            e = Object(e);
          ++i < n;

        ) {
          var o = r[i];
          o && t(e, o, i, a);
        }
        return e;
      });
    }
    function jI(t) {
      return function (e, r, i) {
        for (var n = -1, a = Object(e), s = i(e), o = s.length; o--; ) {
          var l = s[t ? o : ++n];
          if (r(a[l], l, a) === !1) break;
        }
        return e;
      };
    }
    function wa(t, e) {
      var r = t.__data__;
      return GI(e) ? r[typeof e == "string" ? "string" : "hash"] : r.map;
    }
    function Hf(t, e) {
      var r = J3(t, e);
      return PI(r) ? r : void 0;
    }
    function UI(t) {
      var e = bt.call(t, er),
        r = t[er];
      try {
        t[er] = void 0;
        var i = !0;
      } catch (a) {}
      var n = h1.call(t);
      return i && (e ? (t[er] = r) : delete t[er]), n;
    }
    function VI(t) {
      return typeof t.constructor == "function" && !T1(t) ? aI(w1(t)) : {};
    }
    function _1(t, e) {
      var r = typeof t;
      return (
        (e = e ?? n1),
        !!e &&
          (r == "number" || (r != "symbol" && W3.test(t))) &&
          t > -1 &&
          t % 1 == 0 &&
          t < e
      );
    }
    function WI(t, e, r) {
      if (!rr(r)) return !1;
      var i = typeof e;
      return (
        i == "number" ? Kf(r) && _1(e, r.length) : i == "string" && e in r
      )
        ? va(r[e], t)
        : !1;
    }
    function GI(t) {
      var e = typeof t;
      return e == "string" || e == "number" || e == "symbol" || e == "boolean"
        ? t !== "__proto__"
        : t === null;
    }
    function HI(t) {
      return !!d1 && d1 in t;
    }
    function T1(t) {
      var e = t && t.constructor,
        r = (typeof e == "function" && e.prototype) || pa;
      return t === r;
    }
    function YI(t) {
      var e = [];
      if (t != null) for (var r in Object(t)) e.push(r);
      return e;
    }
    function QI(t) {
      return h1.call(t);
    }
    function JI(t, e, r) {
      return (
        (e = b1(e === void 0 ? t.length - 1 : e, 0)),
        function () {
          for (
            var i = arguments, n = -1, a = b1(i.length - e, 0), s = Array(a);
            ++n < a;

          )
            s[n] = i[e + n];
          n = -1;
          for (var o = Array(e + 1); ++n < e; ) o[n] = i[n];
          return (o[e] = r(s)), H3(t, this, o);
        }
      );
    }
    function Yf(t, e) {
      if (
        !(e === "constructor" && typeof t[e] == "function") &&
        e != "__proto__"
      )
        return t[e];
    }
    var KI = XI(BI);
    function XI(t) {
      var e = 0,
        r = 0;
      return function () {
        var i = sI(),
          n = g3 - (i - r);
        if (((r = i), n > 0)) {
          if (++e >= m3) return arguments[0];
        } else e = 0;
        return t.apply(void 0, arguments);
      };
    }
    function ZI(t) {
      if (t != null) {
        try {
          return da.call(t);
        } catch (e) {}
        try {
          return t + "";
        } catch (e) {}
      }
      return "";
    }
    function va(t, e) {
      return t === e || (t !== t && e !== e);
    }
    var Qf = k1(
        (function () {
          return arguments;
        })()
      )
        ? k1
        : function (t) {
            return en(t) && bt.call(t, "callee") && !rI.call(t, "callee");
          },
      Jf = Array.isArray;
    function Kf(t) {
      return t != null && E1(t.length) && !Xf(t);
    }
    function e6(t) {
      return en(t) && Kf(t);
    }
    var O1 = nI || s6;
    function Xf(t) {
      if (!rr(t)) return !1;
      var e = ya(t);
      return e == a1 || e == k3 || e == w3 || e == O3;
    }
    function E1(t) {
      return typeof t == "number" && t > -1 && t % 1 == 0 && t <= n1;
    }
    function rr(t) {
      var e = typeof t;
      return t != null && (e == "object" || e == "function");
    }
    function en(t) {
      return t != null && typeof t == "object";
    }
    function t6(t) {
      if (!en(t) || ya(t) != o1) return !1;
      var e = w1(t);
      if (e === null) return !0;
      var r = bt.call(e, "constructor") && e.constructor;
      return typeof r == "function" && r instanceof r && da.call(r) == eI;
    }
    var A1 = p1 ? Q3(p1) : II;
    function r6(t) {
      return zI(t, C1(t));
    }
    function C1(t) {
      return Kf(t) ? EI(t, !0) : qI(t);
    }
    var i6 = $I(function (t, e, r) {
      S1(t, e, r);
    });
    function n6(t) {
      return function () {
        return t;
      };
    }
    function P1(t) {
      return t;
    }
    function s6() {
      return !1;
    }
    Vr.exports = i6;
  });
  var D1 = k((R$, q1) => {
    u();
    function a6() {
      if (!arguments.length) return [];
      var t = arguments[0];
      return o6(t) ? t : [t];
    }
    var o6 = Array.isArray;
    q1.exports = a6;
  });
  var B1 = k((B$, R1) => {
    u();
    var x = (Qr(), In).default,
      $ = (t) =>
        t
          .toFixed(7)
          .replace(/(\.[0-9]+?)0+$/, "$1")
          .replace(/\.0$/, ""),
      Ee = (t) => `${$(t / 16)}rem`,
      d = (t, e) => `${$(t / e)}em`,
      lt = (t) => {
        (t = t.replace("#", "")),
          (t = t.length === 3 ? t.replace(/./g, "$&$&") : t);
        let e = parseInt(t.substring(0, 2), 16),
          r = parseInt(t.substring(2, 4), 16),
          i = parseInt(t.substring(4, 6), 16);
        return `${e} ${r} ${i}`;
      },
      Zf = {
        sm: {
          css: [
            {
              fontSize: Ee(14),
              lineHeight: $(24 / 14),
              p: { marginTop: d(16, 14), marginBottom: d(16, 14) },
              '[class~="lead"]': {
                fontSize: d(18, 14),
                lineHeight: $(28 / 18),
                marginTop: d(16, 18),
                marginBottom: d(16, 18),
              },
              blockquote: {
                marginTop: d(24, 18),
                marginBottom: d(24, 18),
                paddingInlineStart: d(20, 18),
              },
              h1: {
                fontSize: d(30, 14),
                marginTop: "0",
                marginBottom: d(24, 30),
                lineHeight: $(36 / 30),
              },
              h2: {
                fontSize: d(20, 14),
                marginTop: d(32, 20),
                marginBottom: d(16, 20),
                lineHeight: $(28 / 20),
              },
              h3: {
                fontSize: d(18, 14),
                marginTop: d(28, 18),
                marginBottom: d(8, 18),
                lineHeight: $(28 / 18),
              },
              h4: {
                marginTop: d(20, 14),
                marginBottom: d(8, 14),
                lineHeight: $(20 / 14),
              },
              img: { marginTop: d(24, 14), marginBottom: d(24, 14) },
              picture: { marginTop: d(24, 14), marginBottom: d(24, 14) },
              "picture > img": { marginTop: "0", marginBottom: "0" },
              video: { marginTop: d(24, 14), marginBottom: d(24, 14) },
              kbd: {
                fontSize: d(12, 14),
                borderRadius: Ee(5),
                paddingTop: d(2, 14),
                paddingInlineEnd: d(5, 14),
                paddingBottom: d(2, 14),
                paddingInlineStart: d(5, 14),
              },
              code: { fontSize: d(12, 14) },
              "h2 code": { fontSize: d(18, 20) },
              "h3 code": { fontSize: d(16, 18) },
              pre: {
                fontSize: d(12, 14),
                lineHeight: $(20 / 12),
                marginTop: d(20, 12),
                marginBottom: d(20, 12),
                borderRadius: Ee(4),
                paddingTop: d(8, 12),
                paddingInlineEnd: d(12, 12),
                paddingBottom: d(8, 12),
                paddingInlineStart: d(12, 12),
              },
              ol: {
                marginTop: d(16, 14),
                marginBottom: d(16, 14),
                paddingInlineStart: d(22, 14),
              },
              ul: {
                marginTop: d(16, 14),
                marginBottom: d(16, 14),
                paddingInlineStart: d(22, 14),
              },
              li: { marginTop: d(4, 14), marginBottom: d(4, 14) },
              "ol > li": { paddingInlineStart: d(6, 14) },
              "ul > li": { paddingInlineStart: d(6, 14) },
              "> ul > li p": { marginTop: d(8, 14), marginBottom: d(8, 14) },
              "> ul > li > p:first-child": { marginTop: d(16, 14) },
              "> ul > li > p:last-child": { marginBottom: d(16, 14) },
              "> ol > li > p:first-child": { marginTop: d(16, 14) },
              "> ol > li > p:last-child": { marginBottom: d(16, 14) },
              "ul ul, ul ol, ol ul, ol ol": {
                marginTop: d(8, 14),
                marginBottom: d(8, 14),
              },
              dl: { marginTop: d(16, 14), marginBottom: d(16, 14) },
              dt: { marginTop: d(16, 14) },
              dd: { marginTop: d(4, 14), paddingInlineStart: d(22, 14) },
              hr: { marginTop: d(40, 14), marginBottom: d(40, 14) },
              "hr + *": { marginTop: "0" },
              "h2 + *": { marginTop: "0" },
              "h3 + *": { marginTop: "0" },
              "h4 + *": { marginTop: "0" },
              table: { fontSize: d(12, 14), lineHeight: $(18 / 12) },
              "thead th": {
                paddingInlineEnd: d(12, 12),
                paddingBottom: d(8, 12),
                paddingInlineStart: d(12, 12),
              },
              "thead th:first-child": { paddingInlineStart: "0" },
              "thead th:last-child": { paddingInlineEnd: "0" },
              "tbody td, tfoot td": {
                paddingTop: d(8, 12),
                paddingInlineEnd: d(12, 12),
                paddingBottom: d(8, 12),
                paddingInlineStart: d(12, 12),
              },
              "tbody td:first-child, tfoot td:first-child": {
                paddingInlineStart: "0",
              },
              "tbody td:last-child, tfoot td:last-child": {
                paddingInlineEnd: "0",
              },
              figure: { marginTop: d(24, 14), marginBottom: d(24, 14) },
              "figure > *": { marginTop: "0", marginBottom: "0" },
              figcaption: {
                fontSize: d(12, 14),
                lineHeight: $(16 / 12),
                marginTop: d(8, 12),
              },
            },
            {
              "> :first-child": { marginTop: "0" },
              "> :last-child": { marginBottom: "0" },
            },
          ],
        },
        base: {
          css: [
            {
              fontSize: Ee(16),
              lineHeight: $(28 / 16),
              p: { marginTop: d(20, 16), marginBottom: d(20, 16) },
              '[class~="lead"]': {
                fontSize: d(20, 16),
                lineHeight: $(32 / 20),
                marginTop: d(24, 20),
                marginBottom: d(24, 20),
              },
              blockquote: {
                marginTop: d(32, 20),
                marginBottom: d(32, 20),
                paddingInlineStart: d(20, 20),
              },
              h1: {
                fontSize: d(36, 16),
                marginTop: "0",
                marginBottom: d(32, 36),
                lineHeight: $(40 / 36),
              },
              h2: {
                fontSize: d(24, 16),
                marginTop: d(48, 24),
                marginBottom: d(24, 24),
                lineHeight: $(32 / 24),
              },
              h3: {
                fontSize: d(20, 16),
                marginTop: d(32, 20),
                marginBottom: d(12, 20),
                lineHeight: $(32 / 20),
              },
              h4: {
                marginTop: d(24, 16),
                marginBottom: d(8, 16),
                lineHeight: $(24 / 16),
              },
              img: { marginTop: d(32, 16), marginBottom: d(32, 16) },
              picture: { marginTop: d(32, 16), marginBottom: d(32, 16) },
              "picture > img": { marginTop: "0", marginBottom: "0" },
              video: { marginTop: d(32, 16), marginBottom: d(32, 16) },
              kbd: {
                fontSize: d(14, 16),
                borderRadius: Ee(5),
                paddingTop: d(3, 16),
                paddingInlineEnd: d(6, 16),
                paddingBottom: d(3, 16),
                paddingInlineStart: d(6, 16),
              },
              code: { fontSize: d(14, 16) },
              "h2 code": { fontSize: d(21, 24) },
              "h3 code": { fontSize: d(18, 20) },
              pre: {
                fontSize: d(14, 16),
                lineHeight: $(24 / 14),
                marginTop: d(24, 14),
                marginBottom: d(24, 14),
                borderRadius: Ee(6),
                paddingTop: d(12, 14),
                paddingInlineEnd: d(16, 14),
                paddingBottom: d(12, 14),
                paddingInlineStart: d(16, 14),
              },
              ol: {
                marginTop: d(20, 16),
                marginBottom: d(20, 16),
                paddingInlineStart: d(26, 16),
              },
              ul: {
                marginTop: d(20, 16),
                marginBottom: d(20, 16),
                paddingInlineStart: d(26, 16),
              },
              li: { marginTop: d(8, 16), marginBottom: d(8, 16) },
              "ol > li": { paddingInlineStart: d(6, 16) },
              "ul > li": { paddingInlineStart: d(6, 16) },
              "> ul > li p": { marginTop: d(12, 16), marginBottom: d(12, 16) },
              "> ul > li > p:first-child": { marginTop: d(20, 16) },
              "> ul > li > p:last-child": { marginBottom: d(20, 16) },
              "> ol > li > p:first-child": { marginTop: d(20, 16) },
              "> ol > li > p:last-child": { marginBottom: d(20, 16) },
              "ul ul, ul ol, ol ul, ol ol": {
                marginTop: d(12, 16),
                marginBottom: d(12, 16),
              },
              dl: { marginTop: d(20, 16), marginBottom: d(20, 16) },
              dt: { marginTop: d(20, 16) },
              dd: { marginTop: d(8, 16), paddingInlineStart: d(26, 16) },
              hr: { marginTop: d(48, 16), marginBottom: d(48, 16) },
              "hr + *": { marginTop: "0" },
              "h2 + *": { marginTop: "0" },
              "h3 + *": { marginTop: "0" },
              "h4 + *": { marginTop: "0" },
              table: { fontSize: d(14, 16), lineHeight: $(24 / 14) },
              "thead th": {
                paddingInlineEnd: d(8, 14),
                paddingBottom: d(8, 14),
                paddingInlineStart: d(8, 14),
              },
              "thead th:first-child": { paddingInlineStart: "0" },
              "thead th:last-child": { paddingInlineEnd: "0" },
              "tbody td, tfoot td": {
                paddingTop: d(8, 14),
                paddingInlineEnd: d(8, 14),
                paddingBottom: d(8, 14),
                paddingInlineStart: d(8, 14),
              },
              "tbody td:first-child, tfoot td:first-child": {
                paddingInlineStart: "0",
              },
              "tbody td:last-child, tfoot td:last-child": {
                paddingInlineEnd: "0",
              },
              figure: { marginTop: d(32, 16), marginBottom: d(32, 16) },
              "figure > *": { marginTop: "0", marginBottom: "0" },
              figcaption: {
                fontSize: d(14, 16),
                lineHeight: $(20 / 14),
                marginTop: d(12, 14),
              },
            },
            {
              "> :first-child": { marginTop: "0" },
              "> :last-child": { marginBottom: "0" },
            },
          ],
        },
        lg: {
          css: [
            {
              fontSize: Ee(18),
              lineHeight: $(32 / 18),
              p: { marginTop: d(24, 18), marginBottom: d(24, 18) },
              '[class~="lead"]': {
                fontSize: d(22, 18),
                lineHeight: $(32 / 22),
                marginTop: d(24, 22),
                marginBottom: d(24, 22),
              },
              blockquote: {
                marginTop: d(40, 24),
                marginBottom: d(40, 24),
                paddingInlineStart: d(24, 24),
              },
              h1: {
                fontSize: d(48, 18),
                marginTop: "0",
                marginBottom: d(40, 48),
                lineHeight: $(48 / 48),
              },
              h2: {
                fontSize: d(30, 18),
                marginTop: d(56, 30),
                marginBottom: d(32, 30),
                lineHeight: $(40 / 30),
              },
              h3: {
                fontSize: d(24, 18),
                marginTop: d(40, 24),
                marginBottom: d(16, 24),
                lineHeight: $(36 / 24),
              },
              h4: {
                marginTop: d(32, 18),
                marginBottom: d(8, 18),
                lineHeight: $(28 / 18),
              },
              img: { marginTop: d(32, 18), marginBottom: d(32, 18) },
              picture: { marginTop: d(32, 18), marginBottom: d(32, 18) },
              "picture > img": { marginTop: "0", marginBottom: "0" },
              video: { marginTop: d(32, 18), marginBottom: d(32, 18) },
              kbd: {
                fontSize: d(16, 18),
                borderRadius: Ee(5),
                paddingTop: d(4, 18),
                paddingInlineEnd: d(8, 18),
                paddingBottom: d(4, 18),
                paddingInlineStart: d(8, 18),
              },
              code: { fontSize: d(16, 18) },
              "h2 code": { fontSize: d(26, 30) },
              "h3 code": { fontSize: d(21, 24) },
              pre: {
                fontSize: d(16, 18),
                lineHeight: $(28 / 16),
                marginTop: d(32, 16),
                marginBottom: d(32, 16),
                borderRadius: Ee(6),
                paddingTop: d(16, 16),
                paddingInlineEnd: d(24, 16),
                paddingBottom: d(16, 16),
                paddingInlineStart: d(24, 16),
              },
              ol: {
                marginTop: d(24, 18),
                marginBottom: d(24, 18),
                paddingInlineStart: d(28, 18),
              },
              ul: {
                marginTop: d(24, 18),
                marginBottom: d(24, 18),
                paddingInlineStart: d(28, 18),
              },
              li: { marginTop: d(12, 18), marginBottom: d(12, 18) },
              "ol > li": { paddingInlineStart: d(8, 18) },
              "ul > li": { paddingInlineStart: d(8, 18) },
              "> ul > li p": { marginTop: d(16, 18), marginBottom: d(16, 18) },
              "> ul > li > p:first-child": { marginTop: d(24, 18) },
              "> ul > li > p:last-child": { marginBottom: d(24, 18) },
              "> ol > li > p:first-child": { marginTop: d(24, 18) },
              "> ol > li > p:last-child": { marginBottom: d(24, 18) },
              "ul ul, ul ol, ol ul, ol ol": {
                marginTop: d(16, 18),
                marginBottom: d(16, 18),
              },
              dl: { marginTop: d(24, 18), marginBottom: d(24, 18) },
              dt: { marginTop: d(24, 18) },
              dd: { marginTop: d(12, 18), paddingInlineStart: d(28, 18) },
              hr: { marginTop: d(56, 18), marginBottom: d(56, 18) },
              "hr + *": { marginTop: "0" },
              "h2 + *": { marginTop: "0" },
              "h3 + *": { marginTop: "0" },
              "h4 + *": { marginTop: "0" },
              table: { fontSize: d(16, 18), lineHeight: $(24 / 16) },
              "thead th": {
                paddingInlineEnd: d(12, 16),
                paddingBottom: d(12, 16),
                paddingInlineStart: d(12, 16),
              },
              "thead th:first-child": { paddingInlineStart: "0" },
              "thead th:last-child": { paddingInlineEnd: "0" },
              "tbody td, tfoot td": {
                paddingTop: d(12, 16),
                paddingInlineEnd: d(12, 16),
                paddingBottom: d(12, 16),
                paddingInlineStart: d(12, 16),
              },
              "tbody td:first-child, tfoot td:first-child": {
                paddingInlineStart: "0",
              },
              "tbody td:last-child, tfoot td:last-child": {
                paddingInlineEnd: "0",
              },
              figure: { marginTop: d(32, 18), marginBottom: d(32, 18) },
              "figure > *": { marginTop: "0", marginBottom: "0" },
              figcaption: {
                fontSize: d(16, 18),
                lineHeight: $(24 / 16),
                marginTop: d(16, 16),
              },
            },
            {
              "> :first-child": { marginTop: "0" },
              "> :last-child": { marginBottom: "0" },
            },
          ],
        },
        xl: {
          css: [
            {
              fontSize: Ee(20),
              lineHeight: $(36 / 20),
              p: { marginTop: d(24, 20), marginBottom: d(24, 20) },
              '[class~="lead"]': {
                fontSize: d(24, 20),
                lineHeight: $(36 / 24),
                marginTop: d(24, 24),
                marginBottom: d(24, 24),
              },
              blockquote: {
                marginTop: d(48, 30),
                marginBottom: d(48, 30),
                paddingInlineStart: d(32, 30),
              },
              h1: {
                fontSize: d(56, 20),
                marginTop: "0",
                marginBottom: d(48, 56),
                lineHeight: $(56 / 56),
              },
              h2: {
                fontSize: d(36, 20),
                marginTop: d(56, 36),
                marginBottom: d(32, 36),
                lineHeight: $(40 / 36),
              },
              h3: {
                fontSize: d(30, 20),
                marginTop: d(48, 30),
                marginBottom: d(20, 30),
                lineHeight: $(40 / 30),
              },
              h4: {
                marginTop: d(36, 20),
                marginBottom: d(12, 20),
                lineHeight: $(32 / 20),
              },
              img: { marginTop: d(40, 20), marginBottom: d(40, 20) },
              picture: { marginTop: d(40, 20), marginBottom: d(40, 20) },
              "picture > img": { marginTop: "0", marginBottom: "0" },
              video: { marginTop: d(40, 20), marginBottom: d(40, 20) },
              kbd: {
                fontSize: d(18, 20),
                borderRadius: Ee(5),
                paddingTop: d(5, 20),
                paddingInlineEnd: d(8, 20),
                paddingBottom: d(5, 20),
                paddingInlineStart: d(8, 20),
              },
              code: { fontSize: d(18, 20) },
              "h2 code": { fontSize: d(31, 36) },
              "h3 code": { fontSize: d(27, 30) },
              pre: {
                fontSize: d(18, 20),
                lineHeight: $(32 / 18),
                marginTop: d(36, 18),
                marginBottom: d(36, 18),
                borderRadius: Ee(8),
                paddingTop: d(20, 18),
                paddingInlineEnd: d(24, 18),
                paddingBottom: d(20, 18),
                paddingInlineStart: d(24, 18),
              },
              ol: {
                marginTop: d(24, 20),
                marginBottom: d(24, 20),
                paddingInlineStart: d(32, 20),
              },
              ul: {
                marginTop: d(24, 20),
                marginBottom: d(24, 20),
                paddingInlineStart: d(32, 20),
              },
              li: { marginTop: d(12, 20), marginBottom: d(12, 20) },
              "ol > li": { paddingInlineStart: d(8, 20) },
              "ul > li": { paddingInlineStart: d(8, 20) },
              "> ul > li p": { marginTop: d(16, 20), marginBottom: d(16, 20) },
              "> ul > li > p:first-child": { marginTop: d(24, 20) },
              "> ul > li > p:last-child": { marginBottom: d(24, 20) },
              "> ol > li > p:first-child": { marginTop: d(24, 20) },
              "> ol > li > p:last-child": { marginBottom: d(24, 20) },
              "ul ul, ul ol, ol ul, ol ol": {
                marginTop: d(16, 20),
                marginBottom: d(16, 20),
              },
              dl: { marginTop: d(24, 20), marginBottom: d(24, 20) },
              dt: { marginTop: d(24, 20) },
              dd: { marginTop: d(12, 20), paddingInlineStart: d(32, 20) },
              hr: { marginTop: d(56, 20), marginBottom: d(56, 20) },
              "hr + *": { marginTop: "0" },
              "h2 + *": { marginTop: "0" },
              "h3 + *": { marginTop: "0" },
              "h4 + *": { marginTop: "0" },
              table: { fontSize: d(18, 20), lineHeight: $(28 / 18) },
              "thead th": {
                paddingInlineEnd: d(12, 18),
                paddingBottom: d(16, 18),
                paddingInlineStart: d(12, 18),
              },
              "thead th:first-child": { paddingInlineStart: "0" },
              "thead th:last-child": { paddingInlineEnd: "0" },
              "tbody td, tfoot td": {
                paddingTop: d(16, 18),
                paddingInlineEnd: d(12, 18),
                paddingBottom: d(16, 18),
                paddingInlineStart: d(12, 18),
              },
              "tbody td:first-child, tfoot td:first-child": {
                paddingInlineStart: "0",
              },
              "tbody td:last-child, tfoot td:last-child": {
                paddingInlineEnd: "0",
              },
              figure: { marginTop: d(40, 20), marginBottom: d(40, 20) },
              "figure > *": { marginTop: "0", marginBottom: "0" },
              figcaption: {
                fontSize: d(18, 20),
                lineHeight: $(28 / 18),
                marginTop: d(18, 18),
              },
            },
            {
              "> :first-child": { marginTop: "0" },
              "> :last-child": { marginBottom: "0" },
            },
          ],
        },
        "2xl": {
          css: [
            {
              fontSize: Ee(24),
              lineHeight: $(40 / 24),
              p: { marginTop: d(32, 24), marginBottom: d(32, 24) },
              '[class~="lead"]': {
                fontSize: d(30, 24),
                lineHeight: $(44 / 30),
                marginTop: d(32, 30),
                marginBottom: d(32, 30),
              },
              blockquote: {
                marginTop: d(64, 36),
                marginBottom: d(64, 36),
                paddingInlineStart: d(40, 36),
              },
              h1: {
                fontSize: d(64, 24),
                marginTop: "0",
                marginBottom: d(56, 64),
                lineHeight: $(64 / 64),
              },
              h2: {
                fontSize: d(48, 24),
                marginTop: d(72, 48),
                marginBottom: d(40, 48),
                lineHeight: $(52 / 48),
              },
              h3: {
                fontSize: d(36, 24),
                marginTop: d(56, 36),
                marginBottom: d(24, 36),
                lineHeight: $(44 / 36),
              },
              h4: {
                marginTop: d(40, 24),
                marginBottom: d(16, 24),
                lineHeight: $(36 / 24),
              },
              img: { marginTop: d(48, 24), marginBottom: d(48, 24) },
              picture: { marginTop: d(48, 24), marginBottom: d(48, 24) },
              "picture > img": { marginTop: "0", marginBottom: "0" },
              video: { marginTop: d(48, 24), marginBottom: d(48, 24) },
              kbd: {
                fontSize: d(20, 24),
                borderRadius: Ee(6),
                paddingTop: d(6, 24),
                paddingInlineEnd: d(8, 24),
                paddingBottom: d(6, 24),
                paddingInlineStart: d(8, 24),
              },
              code: { fontSize: d(20, 24) },
              "h2 code": { fontSize: d(42, 48) },
              "h3 code": { fontSize: d(32, 36) },
              pre: {
                fontSize: d(20, 24),
                lineHeight: $(36 / 20),
                marginTop: d(40, 20),
                marginBottom: d(40, 20),
                borderRadius: Ee(8),
                paddingTop: d(24, 20),
                paddingInlineEnd: d(32, 20),
                paddingBottom: d(24, 20),
                paddingInlineStart: d(32, 20),
              },
              ol: {
                marginTop: d(32, 24),
                marginBottom: d(32, 24),
                paddingInlineStart: d(38, 24),
              },
              ul: {
                marginTop: d(32, 24),
                marginBottom: d(32, 24),
                paddingInlineStart: d(38, 24),
              },
              li: { marginTop: d(12, 24), marginBottom: d(12, 24) },
              "ol > li": { paddingInlineStart: d(10, 24) },
              "ul > li": { paddingInlineStart: d(10, 24) },
              "> ul > li p": { marginTop: d(20, 24), marginBottom: d(20, 24) },
              "> ul > li > p:first-child": { marginTop: d(32, 24) },
              "> ul > li > p:last-child": { marginBottom: d(32, 24) },
              "> ol > li > p:first-child": { marginTop: d(32, 24) },
              "> ol > li > p:last-child": { marginBottom: d(32, 24) },
              "ul ul, ul ol, ol ul, ol ol": {
                marginTop: d(16, 24),
                marginBottom: d(16, 24),
              },
              dl: { marginTop: d(32, 24), marginBottom: d(32, 24) },
              dt: { marginTop: d(32, 24) },
              dd: { marginTop: d(12, 24), paddingInlineStart: d(38, 24) },
              hr: { marginTop: d(72, 24), marginBottom: d(72, 24) },
              "hr + *": { marginTop: "0" },
              "h2 + *": { marginTop: "0" },
              "h3 + *": { marginTop: "0" },
              "h4 + *": { marginTop: "0" },
              table: { fontSize: d(20, 24), lineHeight: $(28 / 20) },
              "thead th": {
                paddingInlineEnd: d(12, 20),
                paddingBottom: d(16, 20),
                paddingInlineStart: d(12, 20),
              },
              "thead th:first-child": { paddingInlineStart: "0" },
              "thead th:last-child": { paddingInlineEnd: "0" },
              "tbody td, tfoot td": {
                paddingTop: d(16, 20),
                paddingInlineEnd: d(12, 20),
                paddingBottom: d(16, 20),
                paddingInlineStart: d(12, 20),
              },
              "tbody td:first-child, tfoot td:first-child": {
                paddingInlineStart: "0",
              },
              "tbody td:last-child, tfoot td:last-child": {
                paddingInlineEnd: "0",
              },
              figure: { marginTop: d(48, 24), marginBottom: d(48, 24) },
              "figure > *": { marginTop: "0", marginBottom: "0" },
              figcaption: {
                fontSize: d(20, 24),
                lineHeight: $(32 / 20),
                marginTop: d(20, 20),
              },
            },
            {
              "> :first-child": { marginTop: "0" },
              "> :last-child": { marginBottom: "0" },
            },
          ],
        },
        slate: {
          css: {
            "--tw-prose-body": x.slate[700],
            "--tw-prose-headings": x.slate[900],
            "--tw-prose-lead": x.slate[600],
            "--tw-prose-links": x.slate[900],
            "--tw-prose-bold": x.slate[900],
            "--tw-prose-counters": x.slate[500],
            "--tw-prose-bullets": x.slate[300],
            "--tw-prose-hr": x.slate[200],
            "--tw-prose-quotes": x.slate[900],
            "--tw-prose-quote-borders": x.slate[200],
            "--tw-prose-captions": x.slate[500],
            "--tw-prose-kbd": x.slate[900],
            "--tw-prose-kbd-shadows": lt(x.slate[900]),
            "--tw-prose-code": x.slate[900],
            "--tw-prose-pre-code": x.slate[200],
            "--tw-prose-pre-bg": x.slate[800],
            "--tw-prose-th-borders": x.slate[300],
            "--tw-prose-td-borders": x.slate[200],
            "--tw-prose-invert-body": x.slate[300],
            "--tw-prose-invert-headings": x.white,
            "--tw-prose-invert-lead": x.slate[400],
            "--tw-prose-invert-links": x.white,
            "--tw-prose-invert-bold": x.white,
            "--tw-prose-invert-counters": x.slate[400],
            "--tw-prose-invert-bullets": x.slate[600],
            "--tw-prose-invert-hr": x.slate[700],
            "--tw-prose-invert-quotes": x.slate[100],
            "--tw-prose-invert-quote-borders": x.slate[700],
            "--tw-prose-invert-captions": x.slate[400],
            "--tw-prose-invert-kbd": x.white,
            "--tw-prose-invert-kbd-shadows": lt(x.white),
            "--tw-prose-invert-code": x.white,
            "--tw-prose-invert-pre-code": x.slate[300],
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": x.slate[600],
            "--tw-prose-invert-td-borders": x.slate[700],
          },
        },
        gray: {
          css: {
            "--tw-prose-body": x.gray[700],
            "--tw-prose-headings": x.gray[900],
            "--tw-prose-lead": x.gray[600],
            "--tw-prose-links": x.gray[900],
            "--tw-prose-bold": x.gray[900],
            "--tw-prose-counters": x.gray[500],
            "--tw-prose-bullets": x.gray[300],
            "--tw-prose-hr": x.gray[200],
            "--tw-prose-quotes": x.gray[900],
            "--tw-prose-quote-borders": x.gray[200],
            "--tw-prose-captions": x.gray[500],
            "--tw-prose-kbd": x.gray[900],
            "--tw-prose-kbd-shadows": lt(x.gray[900]),
            "--tw-prose-code": x.gray[900],
            "--tw-prose-pre-code": x.gray[200],
            "--tw-prose-pre-bg": x.gray[800],
            "--tw-prose-th-borders": x.gray[300],
            "--tw-prose-td-borders": x.gray[200],
            "--tw-prose-invert-body": x.gray[300],
            "--tw-prose-invert-headings": x.white,
            "--tw-prose-invert-lead": x.gray[400],
            "--tw-prose-invert-links": x.white,
            "--tw-prose-invert-bold": x.white,
            "--tw-prose-invert-counters": x.gray[400],
            "--tw-prose-invert-bullets": x.gray[600],
            "--tw-prose-invert-hr": x.gray[700],
            "--tw-prose-invert-quotes": x.gray[100],
            "--tw-prose-invert-quote-borders": x.gray[700],
            "--tw-prose-invert-captions": x.gray[400],
            "--tw-prose-invert-kbd": x.white,
            "--tw-prose-invert-kbd-shadows": lt(x.white),
            "--tw-prose-invert-code": x.white,
            "--tw-prose-invert-pre-code": x.gray[300],
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": x.gray[600],
            "--tw-prose-invert-td-borders": x.gray[700],
          },
        },
        zinc: {
          css: {
            "--tw-prose-body": x.zinc[700],
            "--tw-prose-headings": x.zinc[900],
            "--tw-prose-lead": x.zinc[600],
            "--tw-prose-links": x.zinc[900],
            "--tw-prose-bold": x.zinc[900],
            "--tw-prose-counters": x.zinc[500],
            "--tw-prose-bullets": x.zinc[300],
            "--tw-prose-hr": x.zinc[200],
            "--tw-prose-quotes": x.zinc[900],
            "--tw-prose-quote-borders": x.zinc[200],
            "--tw-prose-captions": x.zinc[500],
            "--tw-prose-kbd": x.zinc[900],
            "--tw-prose-kbd-shadows": lt(x.zinc[900]),
            "--tw-prose-code": x.zinc[900],
            "--tw-prose-pre-code": x.zinc[200],
            "--tw-prose-pre-bg": x.zinc[800],
            "--tw-prose-th-borders": x.zinc[300],
            "--tw-prose-td-borders": x.zinc[200],
            "--tw-prose-invert-body": x.zinc[300],
            "--tw-prose-invert-headings": x.white,
            "--tw-prose-invert-lead": x.zinc[400],
            "--tw-prose-invert-links": x.white,
            "--tw-prose-invert-bold": x.white,
            "--tw-prose-invert-counters": x.zinc[400],
            "--tw-prose-invert-bullets": x.zinc[600],
            "--tw-prose-invert-hr": x.zinc[700],
            "--tw-prose-invert-quotes": x.zinc[100],
            "--tw-prose-invert-quote-borders": x.zinc[700],
            "--tw-prose-invert-captions": x.zinc[400],
            "--tw-prose-invert-kbd": x.white,
            "--tw-prose-invert-kbd-shadows": lt(x.white),
            "--tw-prose-invert-code": x.white,
            "--tw-prose-invert-pre-code": x.zinc[300],
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": x.zinc[600],
            "--tw-prose-invert-td-borders": x.zinc[700],
          },
        },
        neutral: {
          css: {
            "--tw-prose-body": x.neutral[700],
            "--tw-prose-headings": x.neutral[900],
            "--tw-prose-lead": x.neutral[600],
            "--tw-prose-links": x.neutral[900],
            "--tw-prose-bold": x.neutral[900],
            "--tw-prose-counters": x.neutral[500],
            "--tw-prose-bullets": x.neutral[300],
            "--tw-prose-hr": x.neutral[200],
            "--tw-prose-quotes": x.neutral[900],
            "--tw-prose-quote-borders": x.neutral[200],
            "--tw-prose-captions": x.neutral[500],
            "--tw-prose-kbd": x.neutral[900],
            "--tw-prose-kbd-shadows": lt(x.neutral[900]),
            "--tw-prose-code": x.neutral[900],
            "--tw-prose-pre-code": x.neutral[200],
            "--tw-prose-pre-bg": x.neutral[800],
            "--tw-prose-th-borders": x.neutral[300],
            "--tw-prose-td-borders": x.neutral[200],
            "--tw-prose-invert-body": x.neutral[300],
            "--tw-prose-invert-headings": x.white,
            "--tw-prose-invert-lead": x.neutral[400],
            "--tw-prose-invert-links": x.white,
            "--tw-prose-invert-bold": x.white,
            "--tw-prose-invert-counters": x.neutral[400],
            "--tw-prose-invert-bullets": x.neutral[600],
            "--tw-prose-invert-hr": x.neutral[700],
            "--tw-prose-invert-quotes": x.neutral[100],
            "--tw-prose-invert-quote-borders": x.neutral[700],
            "--tw-prose-invert-captions": x.neutral[400],
            "--tw-prose-invert-kbd": x.white,
            "--tw-prose-invert-kbd-shadows": lt(x.white),
            "--tw-prose-invert-code": x.white,
            "--tw-prose-invert-pre-code": x.neutral[300],
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": x.neutral[600],
            "--tw-prose-invert-td-borders": x.neutral[700],
          },
        },
        stone: {
          css: {
            "--tw-prose-body": x.stone[700],
            "--tw-prose-headings": x.stone[900],
            "--tw-prose-lead": x.stone[600],
            "--tw-prose-links": x.stone[900],
            "--tw-prose-bold": x.stone[900],
            "--tw-prose-counters": x.stone[500],
            "--tw-prose-bullets": x.stone[300],
            "--tw-prose-hr": x.stone[200],
            "--tw-prose-quotes": x.stone[900],
            "--tw-prose-quote-borders": x.stone[200],
            "--tw-prose-captions": x.stone[500],
            "--tw-prose-kbd": x.stone[900],
            "--tw-prose-kbd-shadows": lt(x.stone[900]),
            "--tw-prose-code": x.stone[900],
            "--tw-prose-pre-code": x.stone[200],
            "--tw-prose-pre-bg": x.stone[800],
            "--tw-prose-th-borders": x.stone[300],
            "--tw-prose-td-borders": x.stone[200],
            "--tw-prose-invert-body": x.stone[300],
            "--tw-prose-invert-headings": x.white,
            "--tw-prose-invert-lead": x.stone[400],
            "--tw-prose-invert-links": x.white,
            "--tw-prose-invert-bold": x.white,
            "--tw-prose-invert-counters": x.stone[400],
            "--tw-prose-invert-bullets": x.stone[600],
            "--tw-prose-invert-hr": x.stone[700],
            "--tw-prose-invert-quotes": x.stone[100],
            "--tw-prose-invert-quote-borders": x.stone[700],
            "--tw-prose-invert-captions": x.stone[400],
            "--tw-prose-invert-kbd": x.white,
            "--tw-prose-invert-kbd-shadows": lt(x.white),
            "--tw-prose-invert-code": x.white,
            "--tw-prose-invert-pre-code": x.stone[300],
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": x.stone[600],
            "--tw-prose-invert-td-borders": x.stone[700],
          },
        },
        red: {
          css: {
            "--tw-prose-links": x.red[600],
            "--tw-prose-invert-links": x.red[500],
          },
        },
        orange: {
          css: {
            "--tw-prose-links": x.orange[600],
            "--tw-prose-invert-links": x.orange[500],
          },
        },
        amber: {
          css: {
            "--tw-prose-links": x.amber[600],
            "--tw-prose-invert-links": x.amber[500],
          },
        },
        yellow: {
          css: {
            "--tw-prose-links": x.yellow[600],
            "--tw-prose-invert-links": x.yellow[500],
          },
        },
        lime: {
          css: {
            "--tw-prose-links": x.lime[600],
            "--tw-prose-invert-links": x.lime[500],
          },
        },
        green: {
          css: {
            "--tw-prose-links": x.green[600],
            "--tw-prose-invert-links": x.green[500],
          },
        },
        emerald: {
          css: {
            "--tw-prose-links": x.emerald[600],
            "--tw-prose-invert-links": x.emerald[500],
          },
        },
        teal: {
          css: {
            "--tw-prose-links": x.teal[600],
            "--tw-prose-invert-links": x.teal[500],
          },
        },
        cyan: {
          css: {
            "--tw-prose-links": x.cyan[600],
            "--tw-prose-invert-links": x.cyan[500],
          },
        },
        sky: {
          css: {
            "--tw-prose-links": x.sky[600],
            "--tw-prose-invert-links": x.sky[500],
          },
        },
        blue: {
          css: {
            "--tw-prose-links": x.blue[600],
            "--tw-prose-invert-links": x.blue[500],
          },
        },
        indigo: {
          css: {
            "--tw-prose-links": x.indigo[600],
            "--tw-prose-invert-links": x.indigo[500],
          },
        },
        violet: {
          css: {
            "--tw-prose-links": x.violet[600],
            "--tw-prose-invert-links": x.violet[500],
          },
        },
        purple: {
          css: {
            "--tw-prose-links": x.purple[600],
            "--tw-prose-invert-links": x.purple[500],
          },
        },
        fuchsia: {
          css: {
            "--tw-prose-links": x.fuchsia[600],
            "--tw-prose-invert-links": x.fuchsia[500],
          },
        },
        pink: {
          css: {
            "--tw-prose-links": x.pink[600],
            "--tw-prose-invert-links": x.pink[500],
          },
        },
        rose: {
          css: {
            "--tw-prose-links": x.rose[600],
            "--tw-prose-invert-links": x.rose[500],
          },
        },
        invert: {
          css: {
            "--tw-prose-body": "var(--tw-prose-invert-body)",
            "--tw-prose-headings": "var(--tw-prose-invert-headings)",
            "--tw-prose-lead": "var(--tw-prose-invert-lead)",
            "--tw-prose-links": "var(--tw-prose-invert-links)",
            "--tw-prose-bold": "var(--tw-prose-invert-bold)",
            "--tw-prose-counters": "var(--tw-prose-invert-counters)",
            "--tw-prose-bullets": "var(--tw-prose-invert-bullets)",
            "--tw-prose-hr": "var(--tw-prose-invert-hr)",
            "--tw-prose-quotes": "var(--tw-prose-invert-quotes)",
            "--tw-prose-quote-borders": "var(--tw-prose-invert-quote-borders)",
            "--tw-prose-captions": "var(--tw-prose-invert-captions)",
            "--tw-prose-kbd": "var(--tw-prose-invert-kbd)",
            "--tw-prose-kbd-shadows": "var(--tw-prose-invert-kbd-shadows)",
            "--tw-prose-code": "var(--tw-prose-invert-code)",
            "--tw-prose-pre-code": "var(--tw-prose-invert-pre-code)",
            "--tw-prose-pre-bg": "var(--tw-prose-invert-pre-bg)",
            "--tw-prose-th-borders": "var(--tw-prose-invert-th-borders)",
            "--tw-prose-td-borders": "var(--tw-prose-invert-td-borders)",
          },
        },
      };
    R1.exports = {
      DEFAULT: {
        css: [
          {
            color: "var(--tw-prose-body)",
            maxWidth: "65ch",
            p: {},
            '[class~="lead"]': { color: "var(--tw-prose-lead)" },
            a: {
              color: "var(--tw-prose-links)",
              textDecoration: "underline",
              fontWeight: "500",
            },
            strong: { color: "var(--tw-prose-bold)", fontWeight: "600" },
            "a strong": { color: "inherit" },
            "blockquote strong": { color: "inherit" },
            "thead th strong": { color: "inherit" },
            ol: { listStyleType: "decimal" },
            'ol[type="A"]': { listStyleType: "upper-alpha" },
            'ol[type="a"]': { listStyleType: "lower-alpha" },
            'ol[type="A" s]': { listStyleType: "upper-alpha" },
            'ol[type="a" s]': { listStyleType: "lower-alpha" },
            'ol[type="I"]': { listStyleType: "upper-roman" },
            'ol[type="i"]': { listStyleType: "lower-roman" },
            'ol[type="I" s]': { listStyleType: "upper-roman" },
            'ol[type="i" s]': { listStyleType: "lower-roman" },
            'ol[type="1"]': { listStyleType: "decimal" },
            ul: { listStyleType: "disc" },
            "ol > li::marker": {
              fontWeight: "400",
              color: "var(--tw-prose-counters)",
            },
            "ul > li::marker": { color: "var(--tw-prose-bullets)" },
            dt: { color: "var(--tw-prose-headings)", fontWeight: "600" },
            hr: { borderColor: "var(--tw-prose-hr)", borderTopWidth: 1 },
            blockquote: {
              fontWeight: "500",
              fontStyle: "italic",
              color: "var(--tw-prose-quotes)",
              borderInlineStartWidth: "0.25rem",
              borderInlineStartColor: "var(--tw-prose-quote-borders)",
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
            },
            "blockquote p:first-of-type::before": { content: "open-quote" },
            "blockquote p:last-of-type::after": { content: "close-quote" },
            h1: { color: "var(--tw-prose-headings)", fontWeight: "800" },
            "h1 strong": { fontWeight: "900", color: "inherit" },
            h2: { color: "var(--tw-prose-headings)", fontWeight: "700" },
            "h2 strong": { fontWeight: "800", color: "inherit" },
            h3: { color: "var(--tw-prose-headings)", fontWeight: "600" },
            "h3 strong": { fontWeight: "700", color: "inherit" },
            h4: { color: "var(--tw-prose-headings)", fontWeight: "600" },
            "h4 strong": { fontWeight: "700", color: "inherit" },
            img: {},
            picture: { display: "block" },
            video: {},
            kbd: {
              fontWeight: "500",
              fontFamily: "inherit",
              color: "var(--tw-prose-kbd)",
              boxShadow:
                "0 0 0 1px rgb(var(--tw-prose-kbd-shadows) / 10%), 0 3px 0 rgb(var(--tw-prose-kbd-shadows) / 10%)",
            },
            code: { color: "var(--tw-prose-code)", fontWeight: "600" },
            "code::before": { content: '"`"' },
            "code::after": { content: '"`"' },
            "a code": { color: "inherit" },
            "h1 code": { color: "inherit" },
            "h2 code": { color: "inherit" },
            "h3 code": { color: "inherit" },
            "h4 code": { color: "inherit" },
            "blockquote code": { color: "inherit" },
            "thead th code": { color: "inherit" },
            pre: {
              color: "var(--tw-prose-pre-code)",
              backgroundColor: "var(--tw-prose-pre-bg)",
              overflowX: "auto",
              fontWeight: "400",
            },
            "pre code": {
              backgroundColor: "transparent",
              borderWidth: "0",
              borderRadius: "0",
              padding: "0",
              fontWeight: "inherit",
              color: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
              lineHeight: "inherit",
            },
            "pre code::before": { content: "none" },
            "pre code::after": { content: "none" },
            table: {
              width: "100%",
              tableLayout: "auto",
              textAlign: "start",
              marginTop: d(32, 16),
              marginBottom: d(32, 16),
            },
            thead: {
              borderBottomWidth: "1px",
              borderBottomColor: "var(--tw-prose-th-borders)",
            },
            "thead th": {
              color: "var(--tw-prose-headings)",
              fontWeight: "600",
              verticalAlign: "bottom",
            },
            "tbody tr": {
              borderBottomWidth: "1px",
              borderBottomColor: "var(--tw-prose-td-borders)",
            },
            "tbody tr:last-child": { borderBottomWidth: "0" },
            "tbody td": { verticalAlign: "baseline" },
            tfoot: {
              borderTopWidth: "1px",
              borderTopColor: "var(--tw-prose-th-borders)",
            },
            "tfoot td": { verticalAlign: "top" },
            "figure > *": {},
            figcaption: { color: "var(--tw-prose-captions)" },
          },
          Zf.gray.css,
          ...Zf.base.css,
        ],
      },
      ...Zf,
    };
  });
  var N1 = k((M$, F1) => {
    u();
    var l6 = "[object Object]";
    function u6(t) {
      var e = !1;
      if (t != null && typeof t.toString != "function")
        try {
          e = !!(t + "");
        } catch (r) {}
      return e;
    }
    function f6(t, e) {
      return function (r) {
        return t(e(r));
      };
    }
    var c6 = Function.prototype,
      M1 = Object.prototype,
      L1 = c6.toString,
      p6 = M1.hasOwnProperty,
      d6 = L1.call(Object),
      h6 = M1.toString,
      m6 = f6(Object.getPrototypeOf, Object);
    function g6(t) {
      return !!t && typeof t == "object";
    }
    function y6(t) {
      if (!g6(t) || h6.call(t) != l6 || u6(t)) return !1;
      var e = m6(t);
      if (e === null) return !0;
      var r = p6.call(e, "constructor") && e.constructor;
      return typeof r == "function" && r instanceof r && L1.call(r) == d6;
    }
    F1.exports = y6;
  });
  var ec = k((ba, z1) => {
    u();
    ("use strict");
    ba.__esModule = !0;
    ba.default = b6;
    function w6(t) {
      for (
        var e = t.toLowerCase(), r = "", i = !1, n = 0;
        n < 6 && e[n] !== void 0;
        n++
      ) {
        var a = e.charCodeAt(n),
          s = (a >= 97 && a <= 102) || (a >= 48 && a <= 57);
        if (((i = a === 32), !s)) break;
        r += e[n];
      }
      if (r.length !== 0) {
        var o = parseInt(r, 16),
          l = o >= 55296 && o <= 57343;
        return l || o === 0 || o > 1114111
          ? ["\uFFFD", r.length + (i ? 1 : 0)]
          : [String.fromCodePoint(o), r.length + (i ? 1 : 0)];
      }
    }
    var v6 = /\\/;
    function b6(t) {
      var e = v6.test(t);
      if (!e) return t;
      for (var r = "", i = 0; i < t.length; i++) {
        if (t[i] === "\\") {
          var n = w6(t.slice(i + 1, i + 7));
          if (n !== void 0) {
            (r += n[0]), (i += n[1]);
            continue;
          }
          if (t[i + 1] === "\\") {
            (r += "\\"), i++;
            continue;
          }
          t.length === i + 1 && (r += t[i]);
          continue;
        }
        r += t[i];
      }
      return r;
    }
    z1.exports = ba.default;
  });
  var j1 = k((xa, $1) => {
    u();
    ("use strict");
    xa.__esModule = !0;
    xa.default = x6;
    function x6(t) {
      for (
        var e = arguments.length, r = new Array(e > 1 ? e - 1 : 0), i = 1;
        i < e;
        i++
      )
        r[i - 1] = arguments[i];
      for (; r.length > 0; ) {
        var n = r.shift();
        if (!t[n]) return;
        t = t[n];
      }
      return t;
    }
    $1.exports = xa.default;
  });
  var V1 = k((ka, U1) => {
    u();
    ("use strict");
    ka.__esModule = !0;
    ka.default = k6;
    function k6(t) {
      for (
        var e = arguments.length, r = new Array(e > 1 ? e - 1 : 0), i = 1;
        i < e;
        i++
      )
        r[i - 1] = arguments[i];
      for (; r.length > 0; ) {
        var n = r.shift();
        t[n] || (t[n] = {}), (t = t[n]);
      }
    }
    U1.exports = ka.default;
  });
  var G1 = k((Sa, W1) => {
    u();
    ("use strict");
    Sa.__esModule = !0;
    Sa.default = S6;
    function S6(t) {
      for (var e = "", r = t.indexOf("/*"), i = 0; r >= 0; ) {
        e = e + t.slice(i, r);
        var n = t.indexOf("*/", r + 2);
        if (n < 0) return e;
        (i = n + 2), (r = t.indexOf("/*", i));
      }
      return (e = e + t.slice(i)), e;
    }
    W1.exports = Sa.default;
  });
  var rn = k((ut) => {
    u();
    ("use strict");
    ut.__esModule = !0;
    ut.stripComments = ut.ensureObject = ut.getProp = ut.unesc = void 0;
    var _6 = _a(ec());
    ut.unesc = _6.default;
    var T6 = _a(j1());
    ut.getProp = T6.default;
    var O6 = _a(V1());
    ut.ensureObject = O6.default;
    var E6 = _a(G1());
    ut.stripComments = E6.default;
    function _a(t) {
      return t && t.__esModule ? t : { default: t };
    }
  });
  var kt = k((nn, Q1) => {
    u();
    ("use strict");
    nn.__esModule = !0;
    nn.default = void 0;
    var H1 = rn();
    function Y1(t, e) {
      for (var r = 0; r < e.length; r++) {
        var i = e[r];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(t, i.key, i);
      }
    }
    function A6(t, e, r) {
      return e && Y1(t.prototype, e), r && Y1(t, r), t;
    }
    var C6 = function t(e, r) {
        if (typeof e != "object" || e === null) return e;
        var i = new e.constructor();
        for (var n in e)
          if (!!e.hasOwnProperty(n)) {
            var a = e[n],
              s = typeof a;
            n === "parent" && s === "object"
              ? r && (i[n] = r)
              : a instanceof Array
              ? (i[n] = a.map(function (o) {
                  return t(o, i);
                }))
              : (i[n] = t(a, i));
          }
        return i;
      },
      P6 = (function () {
        function t(r) {
          r === void 0 && (r = {}),
            Object.assign(this, r),
            (this.spaces = this.spaces || {}),
            (this.spaces.before = this.spaces.before || ""),
            (this.spaces.after = this.spaces.after || "");
        }
        var e = t.prototype;
        return (
          (e.remove = function () {
            return (
              this.parent && this.parent.removeChild(this),
              (this.parent = void 0),
              this
            );
          }),
          (e.replaceWith = function () {
            if (this.parent) {
              for (var i in arguments)
                this.parent.insertBefore(this, arguments[i]);
              this.remove();
            }
            return this;
          }),
          (e.next = function () {
            return this.parent.at(this.parent.index(this) + 1);
          }),
          (e.prev = function () {
            return this.parent.at(this.parent.index(this) - 1);
          }),
          (e.clone = function (i) {
            i === void 0 && (i = {});
            var n = C6(this);
            for (var a in i) n[a] = i[a];
            return n;
          }),
          (e.appendToPropertyAndEscape = function (i, n, a) {
            this.raws || (this.raws = {});
            var s = this[i],
              o = this.raws[i];
            (this[i] = s + n),
              o || a !== n
                ? (this.raws[i] = (o || s) + a)
                : delete this.raws[i];
          }),
          (e.setPropertyAndEscape = function (i, n, a) {
            this.raws || (this.raws = {}), (this[i] = n), (this.raws[i] = a);
          }),
          (e.setPropertyWithoutEscape = function (i, n) {
            (this[i] = n), this.raws && delete this.raws[i];
          }),
          (e.isAtPosition = function (i, n) {
            if (this.source && this.source.start && this.source.end)
              return !(
                this.source.start.line > i ||
                this.source.end.line < i ||
                (this.source.start.line === i &&
                  this.source.start.column > n) ||
                (this.source.end.line === i && this.source.end.column < n)
              );
          }),
          (e.stringifyProperty = function (i) {
            return (this.raws && this.raws[i]) || this[i];
          }),
          (e.valueToString = function () {
            return String(this.stringifyProperty("value"));
          }),
          (e.toString = function () {
            return [
              this.rawSpaceBefore,
              this.valueToString(),
              this.rawSpaceAfter,
            ].join("");
          }),
          A6(t, [
            {
              key: "rawSpaceBefore",
              get: function () {
                var i =
                  this.raws && this.raws.spaces && this.raws.spaces.before;
                return (
                  i === void 0 && (i = this.spaces && this.spaces.before),
                  i || ""
                );
              },
              set: function (i) {
                (0, H1.ensureObject)(this, "raws", "spaces"),
                  (this.raws.spaces.before = i);
              },
            },
            {
              key: "rawSpaceAfter",
              get: function () {
                var i = this.raws && this.raws.spaces && this.raws.spaces.after;
                return i === void 0 && (i = this.spaces.after), i || "";
              },
              set: function (i) {
                (0, H1.ensureObject)(this, "raws", "spaces"),
                  (this.raws.spaces.after = i);
              },
            },
          ]),
          t
        );
      })();
    nn.default = P6;
    Q1.exports = nn.default;
  });
  var ke = k((ie) => {
    u();
    ("use strict");
    ie.__esModule = !0;
    ie.UNIVERSAL =
      ie.ATTRIBUTE =
      ie.CLASS =
      ie.COMBINATOR =
      ie.COMMENT =
      ie.ID =
      ie.NESTING =
      ie.PSEUDO =
      ie.ROOT =
      ie.SELECTOR =
      ie.STRING =
      ie.TAG =
        void 0;
    var I6 = "tag";
    ie.TAG = I6;
    var q6 = "string";
    ie.STRING = q6;
    var D6 = "selector";
    ie.SELECTOR = D6;
    var R6 = "root";
    ie.ROOT = R6;
    var B6 = "pseudo";
    ie.PSEUDO = B6;
    var M6 = "nesting";
    ie.NESTING = M6;
    var L6 = "id";
    ie.ID = L6;
    var F6 = "comment";
    ie.COMMENT = F6;
    var N6 = "combinator";
    ie.COMBINATOR = N6;
    var z6 = "class";
    ie.CLASS = z6;
    var $6 = "attribute";
    ie.ATTRIBUTE = $6;
    var j6 = "universal";
    ie.UNIVERSAL = j6;
  });
  var Ta = k((sn, Z1) => {
    u();
    ("use strict");
    sn.__esModule = !0;
    sn.default = void 0;
    var U6 = W6(kt()),
      St = V6(ke());
    function J1() {
      if (typeof WeakMap != "function") return null;
      var t = new WeakMap();
      return (
        (J1 = function () {
          return t;
        }),
        t
      );
    }
    function V6(t) {
      if (t && t.__esModule) return t;
      if (t === null || (typeof t != "object" && typeof t != "function"))
        return { default: t };
      var e = J1();
      if (e && e.has(t)) return e.get(t);
      var r = {},
        i = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var n in t)
        if (Object.prototype.hasOwnProperty.call(t, n)) {
          var a = i ? Object.getOwnPropertyDescriptor(t, n) : null;
          a && (a.get || a.set)
            ? Object.defineProperty(r, n, a)
            : (r[n] = t[n]);
        }
      return (r.default = t), e && e.set(t, r), r;
    }
    function W6(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function G6(t, e) {
      var r;
      if (typeof Symbol == "undefined" || t[Symbol.iterator] == null) {
        if (
          Array.isArray(t) ||
          (r = H6(t)) ||
          (e && t && typeof t.length == "number")
        ) {
          r && (t = r);
          var i = 0;
          return function () {
            return i >= t.length ? { done: !0 } : { done: !1, value: t[i++] };
          };
        }
        throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      return (r = t[Symbol.iterator]()), r.next.bind(r);
    }
    function H6(t, e) {
      if (!!t) {
        if (typeof t == "string") return K1(t, e);
        var r = Object.prototype.toString.call(t).slice(8, -1);
        if (
          (r === "Object" && t.constructor && (r = t.constructor.name),
          r === "Map" || r === "Set")
        )
          return Array.from(t);
        if (
          r === "Arguments" ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
        )
          return K1(t, e);
      }
    }
    function K1(t, e) {
      (e == null || e > t.length) && (e = t.length);
      for (var r = 0, i = new Array(e); r < e; r++) i[r] = t[r];
      return i;
    }
    function X1(t, e) {
      for (var r = 0; r < e.length; r++) {
        var i = e[r];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(t, i.key, i);
      }
    }
    function Y6(t, e, r) {
      return e && X1(t.prototype, e), r && X1(t, r), t;
    }
    function Q6(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        tc(t, e);
    }
    function tc(t, e) {
      return (
        (tc =
          Object.setPrototypeOf ||
          function (i, n) {
            return (i.__proto__ = n), i;
          }),
        tc(t, e)
      );
    }
    var J6 = (function (t) {
      Q6(e, t);
      function e(i) {
        var n;
        return (n = t.call(this, i) || this), n.nodes || (n.nodes = []), n;
      }
      var r = e.prototype;
      return (
        (r.append = function (n) {
          return (n.parent = this), this.nodes.push(n), this;
        }),
        (r.prepend = function (n) {
          return (n.parent = this), this.nodes.unshift(n), this;
        }),
        (r.at = function (n) {
          return this.nodes[n];
        }),
        (r.index = function (n) {
          return typeof n == "number" ? n : this.nodes.indexOf(n);
        }),
        (r.removeChild = function (n) {
          (n = this.index(n)),
            (this.at(n).parent = void 0),
            this.nodes.splice(n, 1);
          var a;
          for (var s in this.indexes)
            (a = this.indexes[s]), a >= n && (this.indexes[s] = a - 1);
          return this;
        }),
        (r.removeAll = function () {
          for (var n = G6(this.nodes), a; !(a = n()).done; ) {
            var s = a.value;
            s.parent = void 0;
          }
          return (this.nodes = []), this;
        }),
        (r.empty = function () {
          return this.removeAll();
        }),
        (r.insertAfter = function (n, a) {
          a.parent = this;
          var s = this.index(n);
          this.nodes.splice(s + 1, 0, a), (a.parent = this);
          var o;
          for (var l in this.indexes)
            (o = this.indexes[l]), s <= o && (this.indexes[l] = o + 1);
          return this;
        }),
        (r.insertBefore = function (n, a) {
          a.parent = this;
          var s = this.index(n);
          this.nodes.splice(s, 0, a), (a.parent = this);
          var o;
          for (var l in this.indexes)
            (o = this.indexes[l]), o <= s && (this.indexes[l] = o + 1);
          return this;
        }),
        (r._findChildAtPosition = function (n, a) {
          var s = void 0;
          return (
            this.each(function (o) {
              if (o.atPosition) {
                var l = o.atPosition(n, a);
                if (l) return (s = l), !1;
              } else if (o.isAtPosition(n, a)) return (s = o), !1;
            }),
            s
          );
        }),
        (r.atPosition = function (n, a) {
          if (this.isAtPosition(n, a))
            return this._findChildAtPosition(n, a) || this;
        }),
        (r._inferEndPosition = function () {
          this.last &&
            this.last.source &&
            this.last.source.end &&
            ((this.source = this.source || {}),
            (this.source.end = this.source.end || {}),
            Object.assign(this.source.end, this.last.source.end));
        }),
        (r.each = function (n) {
          this.lastEach || (this.lastEach = 0),
            this.indexes || (this.indexes = {}),
            this.lastEach++;
          var a = this.lastEach;
          if (((this.indexes[a] = 0), !!this.length)) {
            for (
              var s, o;
              this.indexes[a] < this.length &&
              ((s = this.indexes[a]), (o = n(this.at(s), s)), o !== !1);

            )
              this.indexes[a] += 1;
            if ((delete this.indexes[a], o === !1)) return !1;
          }
        }),
        (r.walk = function (n) {
          return this.each(function (a, s) {
            var o = n(a, s);
            if ((o !== !1 && a.length && (o = a.walk(n)), o === !1)) return !1;
          });
        }),
        (r.walkAttributes = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === St.ATTRIBUTE) return n.call(a, s);
          });
        }),
        (r.walkClasses = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === St.CLASS) return n.call(a, s);
          });
        }),
        (r.walkCombinators = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === St.COMBINATOR) return n.call(a, s);
          });
        }),
        (r.walkComments = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === St.COMMENT) return n.call(a, s);
          });
        }),
        (r.walkIds = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === St.ID) return n.call(a, s);
          });
        }),
        (r.walkNesting = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === St.NESTING) return n.call(a, s);
          });
        }),
        (r.walkPseudos = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === St.PSEUDO) return n.call(a, s);
          });
        }),
        (r.walkTags = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === St.TAG) return n.call(a, s);
          });
        }),
        (r.walkUniversals = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === St.UNIVERSAL) return n.call(a, s);
          });
        }),
        (r.split = function (n) {
          var a = this,
            s = [];
          return this.reduce(function (o, l, c) {
            var f = n.call(a, l);
            return (
              s.push(l),
              f ? (o.push(s), (s = [])) : c === a.length - 1 && o.push(s),
              o
            );
          }, []);
        }),
        (r.map = function (n) {
          return this.nodes.map(n);
        }),
        (r.reduce = function (n, a) {
          return this.nodes.reduce(n, a);
        }),
        (r.every = function (n) {
          return this.nodes.every(n);
        }),
        (r.some = function (n) {
          return this.nodes.some(n);
        }),
        (r.filter = function (n) {
          return this.nodes.filter(n);
        }),
        (r.sort = function (n) {
          return this.nodes.sort(n);
        }),
        (r.toString = function () {
          return this.map(String).join("");
        }),
        Y6(e, [
          {
            key: "first",
            get: function () {
              return this.at(0);
            },
          },
          {
            key: "last",
            get: function () {
              return this.at(this.length - 1);
            },
          },
          {
            key: "length",
            get: function () {
              return this.nodes.length;
            },
          },
        ]),
        e
      );
    })(U6.default);
    sn.default = J6;
    Z1.exports = sn.default;
  });
  var ic = k((an, tx) => {
    u();
    ("use strict");
    an.__esModule = !0;
    an.default = void 0;
    var K6 = Z6(Ta()),
      X6 = ke();
    function Z6(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function ex(t, e) {
      for (var r = 0; r < e.length; r++) {
        var i = e[r];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(t, i.key, i);
      }
    }
    function eq(t, e, r) {
      return e && ex(t.prototype, e), r && ex(t, r), t;
    }
    function tq(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        rc(t, e);
    }
    function rc(t, e) {
      return (
        (rc =
          Object.setPrototypeOf ||
          function (i, n) {
            return (i.__proto__ = n), i;
          }),
        rc(t, e)
      );
    }
    var rq = (function (t) {
      tq(e, t);
      function e(i) {
        var n;
        return (n = t.call(this, i) || this), (n.type = X6.ROOT), n;
      }
      var r = e.prototype;
      return (
        (r.toString = function () {
          var n = this.reduce(function (a, s) {
            return a.push(String(s)), a;
          }, []).join(",");
          return this.trailingComma ? n + "," : n;
        }),
        (r.error = function (n, a) {
          return this._error ? this._error(n, a) : new Error(n);
        }),
        eq(e, [
          {
            key: "errorGenerator",
            set: function (n) {
              this._error = n;
            },
          },
        ]),
        e
      );
    })(K6.default);
    an.default = rq;
    tx.exports = an.default;
  });
  var sc = k((on, rx) => {
    u();
    ("use strict");
    on.__esModule = !0;
    on.default = void 0;
    var iq = sq(Ta()),
      nq = ke();
    function sq(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function aq(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        nc(t, e);
    }
    function nc(t, e) {
      return (
        (nc =
          Object.setPrototypeOf ||
          function (i, n) {
            return (i.__proto__ = n), i;
          }),
        nc(t, e)
      );
    }
    var oq = (function (t) {
      aq(e, t);
      function e(r) {
        var i;
        return (i = t.call(this, r) || this), (i.type = nq.SELECTOR), i;
      }
      return e;
    })(iq.default);
    on.default = oq;
    rx.exports = on.default;
  });
  var oc = k((ln, sx) => {
    u();
    ("use strict");
    ln.__esModule = !0;
    ln.default = void 0;
    var lq = ix(Jt()),
      uq = rn(),
      fq = ix(kt()),
      cq = ke();
    function ix(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function nx(t, e) {
      for (var r = 0; r < e.length; r++) {
        var i = e[r];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(t, i.key, i);
      }
    }
    function pq(t, e, r) {
      return e && nx(t.prototype, e), r && nx(t, r), t;
    }
    function dq(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        ac(t, e);
    }
    function ac(t, e) {
      return (
        (ac =
          Object.setPrototypeOf ||
          function (i, n) {
            return (i.__proto__ = n), i;
          }),
        ac(t, e)
      );
    }
    var hq = (function (t) {
      dq(e, t);
      function e(i) {
        var n;
        return (
          (n = t.call(this, i) || this),
          (n.type = cq.CLASS),
          (n._constructed = !0),
          n
        );
      }
      var r = e.prototype;
      return (
        (r.valueToString = function () {
          return "." + t.prototype.valueToString.call(this);
        }),
        pq(e, [
          {
            key: "value",
            get: function () {
              return this._value;
            },
            set: function (n) {
              if (this._constructed) {
                var a = (0, lq.default)(n, { isIdentifier: !0 });
                a !== n
                  ? ((0, uq.ensureObject)(this, "raws"), (this.raws.value = a))
                  : this.raws && delete this.raws.value;
              }
              this._value = n;
            },
          },
        ]),
        e
      );
    })(fq.default);
    ln.default = hq;
    sx.exports = ln.default;
  });
  var uc = k((un, ax) => {
    u();
    ("use strict");
    un.__esModule = !0;
    un.default = void 0;
    var mq = yq(kt()),
      gq = ke();
    function yq(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function wq(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        lc(t, e);
    }
    function lc(t, e) {
      return (
        (lc =
          Object.setPrototypeOf ||
          function (i, n) {
            return (i.__proto__ = n), i;
          }),
        lc(t, e)
      );
    }
    var vq = (function (t) {
      wq(e, t);
      function e(r) {
        var i;
        return (i = t.call(this, r) || this), (i.type = gq.COMMENT), i;
      }
      return e;
    })(mq.default);
    un.default = vq;
    ax.exports = un.default;
  });
  var cc = k((fn, ox) => {
    u();
    ("use strict");
    fn.__esModule = !0;
    fn.default = void 0;
    var bq = kq(kt()),
      xq = ke();
    function kq(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function Sq(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        fc(t, e);
    }
    function fc(t, e) {
      return (
        (fc =
          Object.setPrototypeOf ||
          function (i, n) {
            return (i.__proto__ = n), i;
          }),
        fc(t, e)
      );
    }
    var _q = (function (t) {
      Sq(e, t);
      function e(i) {
        var n;
        return (n = t.call(this, i) || this), (n.type = xq.ID), n;
      }
      var r = e.prototype;
      return (
        (r.valueToString = function () {
          return "#" + t.prototype.valueToString.call(this);
        }),
        e
      );
    })(bq.default);
    fn.default = _q;
    ox.exports = fn.default;
  });
  var Oa = k((cn, fx) => {
    u();
    ("use strict");
    cn.__esModule = !0;
    cn.default = void 0;
    var Tq = lx(Jt()),
      Oq = rn(),
      Eq = lx(kt());
    function lx(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function ux(t, e) {
      for (var r = 0; r < e.length; r++) {
        var i = e[r];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(t, i.key, i);
      }
    }
    function Aq(t, e, r) {
      return e && ux(t.prototype, e), r && ux(t, r), t;
    }
    function Cq(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        pc(t, e);
    }
    function pc(t, e) {
      return (
        (pc =
          Object.setPrototypeOf ||
          function (i, n) {
            return (i.__proto__ = n), i;
          }),
        pc(t, e)
      );
    }
    var Pq = (function (t) {
      Cq(e, t);
      function e() {
        return t.apply(this, arguments) || this;
      }
      var r = e.prototype;
      return (
        (r.qualifiedName = function (n) {
          return this.namespace ? this.namespaceString + "|" + n : n;
        }),
        (r.valueToString = function () {
          return this.qualifiedName(t.prototype.valueToString.call(this));
        }),
        Aq(e, [
          {
            key: "namespace",
            get: function () {
              return this._namespace;
            },
            set: function (n) {
              if (n === !0 || n === "*" || n === "&") {
                (this._namespace = n), this.raws && delete this.raws.namespace;
                return;
              }
              var a = (0, Tq.default)(n, { isIdentifier: !0 });
              (this._namespace = n),
                a !== n
                  ? ((0, Oq.ensureObject)(this, "raws"),
                    (this.raws.namespace = a))
                  : this.raws && delete this.raws.namespace;
            },
          },
          {
            key: "ns",
            get: function () {
              return this._namespace;
            },
            set: function (n) {
              this.namespace = n;
            },
          },
          {
            key: "namespaceString",
            get: function () {
              if (this.namespace) {
                var n = this.stringifyProperty("namespace");
                return n === !0 ? "" : n;
              } else return "";
            },
          },
        ]),
        e
      );
    })(Eq.default);
    cn.default = Pq;
    fx.exports = cn.default;
  });
  var hc = k((pn, cx) => {
    u();
    ("use strict");
    pn.__esModule = !0;
    pn.default = void 0;
    var Iq = Dq(Oa()),
      qq = ke();
    function Dq(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function Rq(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        dc(t, e);
    }
    function dc(t, e) {
      return (
        (dc =
          Object.setPrototypeOf ||
          function (i, n) {
            return (i.__proto__ = n), i;
          }),
        dc(t, e)
      );
    }
    var Bq = (function (t) {
      Rq(e, t);
      function e(r) {
        var i;
        return (i = t.call(this, r) || this), (i.type = qq.TAG), i;
      }
      return e;
    })(Iq.default);
    pn.default = Bq;
    cx.exports = pn.default;
  });
  var gc = k((dn, px) => {
    u();
    ("use strict");
    dn.__esModule = !0;
    dn.default = void 0;
    var Mq = Fq(kt()),
      Lq = ke();
    function Fq(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function Nq(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        mc(t, e);
    }
    function mc(t, e) {
      return (
        (mc =
          Object.setPrototypeOf ||
          function (i, n) {
            return (i.__proto__ = n), i;
          }),
        mc(t, e)
      );
    }
    var zq = (function (t) {
      Nq(e, t);
      function e(r) {
        var i;
        return (i = t.call(this, r) || this), (i.type = Lq.STRING), i;
      }
      return e;
    })(Mq.default);
    dn.default = zq;
    px.exports = dn.default;
  });
  var wc = k((hn, dx) => {
    u();
    ("use strict");
    hn.__esModule = !0;
    hn.default = void 0;
    var $q = Uq(Ta()),
      jq = ke();
    function Uq(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function Vq(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        yc(t, e);
    }
    function yc(t, e) {
      return (
        (yc =
          Object.setPrototypeOf ||
          function (i, n) {
            return (i.__proto__ = n), i;
          }),
        yc(t, e)
      );
    }
    var Wq = (function (t) {
      Vq(e, t);
      function e(i) {
        var n;
        return (n = t.call(this, i) || this), (n.type = jq.PSEUDO), n;
      }
      var r = e.prototype;
      return (
        (r.toString = function () {
          var n = this.length ? "(" + this.map(String).join(",") + ")" : "";
          return [
            this.rawSpaceBefore,
            this.stringifyProperty("value"),
            n,
            this.rawSpaceAfter,
          ].join("");
        }),
        e
      );
    })($q.default);
    hn.default = Wq;
    dx.exports = hn.default;
  });
  var _c = k((yn) => {
    u();
    ("use strict");
    yn.__esModule = !0;
    yn.unescapeValue = kc;
    yn.default = void 0;
    var mn = bc(Jt()),
      Gq = bc(ec()),
      Hq = bc(Oa()),
      Yq = ke(),
      vc;
    function bc(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function hx(t, e) {
      for (var r = 0; r < e.length; r++) {
        var i = e[r];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(t, i.key, i);
      }
    }
    function Qq(t, e, r) {
      return e && hx(t.prototype, e), r && hx(t, r), t;
    }
    function Jq(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        xc(t, e);
    }
    function xc(t, e) {
      return (
        (xc =
          Object.setPrototypeOf ||
          function (i, n) {
            return (i.__proto__ = n), i;
          }),
        xc(t, e)
      );
    }
    var gn = Uo(),
      Kq = /^('|")([^]*)\1$/,
      Xq = gn(function () {},
      "Assigning an attribute a value containing characters that might need to be escaped is deprecated. Call attribute.setValue() instead."),
      Zq = gn(function () {},
      "Assigning attr.quoted is deprecated and has no effect. Assign to attr.quoteMark instead."),
      eD = gn(function () {},
      "Constructing an Attribute selector with a value without specifying quoteMark is deprecated. Note: The value should be unescaped now.");
    function kc(t) {
      var e = !1,
        r = null,
        i = t,
        n = i.match(Kq);
      return (
        n && ((r = n[1]), (i = n[2])),
        (i = (0, Gq.default)(i)),
        i !== t && (e = !0),
        { deprecatedUsage: e, unescaped: i, quoteMark: r }
      );
    }
    function tD(t) {
      if (t.quoteMark !== void 0 || t.value === void 0) return t;
      eD();
      var e = kc(t.value),
        r = e.quoteMark,
        i = e.unescaped;
      return (
        t.raws || (t.raws = {}),
        t.raws.value === void 0 && (t.raws.value = t.value),
        (t.value = i),
        (t.quoteMark = r),
        t
      );
    }
    var Ea = (function (t) {
      Jq(e, t);
      function e(i) {
        var n;
        return (
          i === void 0 && (i = {}),
          (n = t.call(this, tD(i)) || this),
          (n.type = Yq.ATTRIBUTE),
          (n.raws = n.raws || {}),
          Object.defineProperty(n.raws, "unquoted", {
            get: gn(function () {
              return n.value;
            }, "attr.raws.unquoted is deprecated. Call attr.value instead."),
            set: gn(function () {
              return n.value;
            }, "Setting attr.raws.unquoted is deprecated and has no effect. attr.value is unescaped by default now."),
          }),
          (n._constructed = !0),
          n
        );
      }
      var r = e.prototype;
      return (
        (r.getQuotedValue = function (n) {
          n === void 0 && (n = {});
          var a = this._determineQuoteMark(n),
            s = Sc[a],
            o = (0, mn.default)(this._value, s);
          return o;
        }),
        (r._determineQuoteMark = function (n) {
          return n.smart ? this.smartQuoteMark(n) : this.preferredQuoteMark(n);
        }),
        (r.setValue = function (n, a) {
          a === void 0 && (a = {}),
            (this._value = n),
            (this._quoteMark = this._determineQuoteMark(a)),
            this._syncRawValue();
        }),
        (r.smartQuoteMark = function (n) {
          var a = this.value,
            s = a.replace(/[^']/g, "").length,
            o = a.replace(/[^"]/g, "").length;
          if (s + o === 0) {
            var l = (0, mn.default)(a, { isIdentifier: !0 });
            if (l === a) return e.NO_QUOTE;
            var c = this.preferredQuoteMark(n);
            if (c === e.NO_QUOTE) {
              var f = this.quoteMark || n.quoteMark || e.DOUBLE_QUOTE,
                p = Sc[f],
                h = (0, mn.default)(a, p);
              if (h.length < l.length) return f;
            }
            return c;
          } else
            return o === s
              ? this.preferredQuoteMark(n)
              : o < s
              ? e.DOUBLE_QUOTE
              : e.SINGLE_QUOTE;
        }),
        (r.preferredQuoteMark = function (n) {
          var a = n.preferCurrentQuoteMark ? this.quoteMark : n.quoteMark;
          return (
            a === void 0 &&
              (a = n.preferCurrentQuoteMark ? n.quoteMark : this.quoteMark),
            a === void 0 && (a = e.DOUBLE_QUOTE),
            a
          );
        }),
        (r._syncRawValue = function () {
          var n = (0, mn.default)(this._value, Sc[this.quoteMark]);
          n === this._value
            ? this.raws && delete this.raws.value
            : (this.raws.value = n);
        }),
        (r._handleEscapes = function (n, a) {
          if (this._constructed) {
            var s = (0, mn.default)(a, { isIdentifier: !0 });
            s !== a ? (this.raws[n] = s) : delete this.raws[n];
          }
        }),
        (r._spacesFor = function (n) {
          var a = { before: "", after: "" },
            s = this.spaces[n] || {},
            o = (this.raws.spaces && this.raws.spaces[n]) || {};
          return Object.assign(a, s, o);
        }),
        (r._stringFor = function (n, a, s) {
          a === void 0 && (a = n), s === void 0 && (s = mx);
          var o = this._spacesFor(a);
          return s(this.stringifyProperty(n), o);
        }),
        (r.offsetOf = function (n) {
          var a = 1,
            s = this._spacesFor("attribute");
          if (((a += s.before.length), n === "namespace" || n === "ns"))
            return this.namespace ? a : -1;
          if (
            n === "attributeNS" ||
            ((a += this.namespaceString.length),
            this.namespace && (a += 1),
            n === "attribute")
          )
            return a;
          (a += this.stringifyProperty("attribute").length),
            (a += s.after.length);
          var o = this._spacesFor("operator");
          a += o.before.length;
          var l = this.stringifyProperty("operator");
          if (n === "operator") return l ? a : -1;
          (a += l.length), (a += o.after.length);
          var c = this._spacesFor("value");
          a += c.before.length;
          var f = this.stringifyProperty("value");
          if (n === "value") return f ? a : -1;
          (a += f.length), (a += c.after.length);
          var p = this._spacesFor("insensitive");
          return (
            (a += p.before.length),
            n === "insensitive" && this.insensitive ? a : -1
          );
        }),
        (r.toString = function () {
          var n = this,
            a = [this.rawSpaceBefore, "["];
          return (
            a.push(this._stringFor("qualifiedAttribute", "attribute")),
            this.operator &&
              (this.value || this.value === "") &&
              (a.push(this._stringFor("operator")),
              a.push(this._stringFor("value")),
              a.push(
                this._stringFor(
                  "insensitiveFlag",
                  "insensitive",
                  function (s, o) {
                    return (
                      s.length > 0 &&
                        !n.quoted &&
                        o.before.length === 0 &&
                        !(n.spaces.value && n.spaces.value.after) &&
                        (o.before = " "),
                      mx(s, o)
                    );
                  }
                )
              )),
            a.push("]"),
            a.push(this.rawSpaceAfter),
            a.join("")
          );
        }),
        Qq(e, [
          {
            key: "quoted",
            get: function () {
              var n = this.quoteMark;
              return n === "'" || n === '"';
            },
            set: function (n) {
              Zq();
            },
          },
          {
            key: "quoteMark",
            get: function () {
              return this._quoteMark;
            },
            set: function (n) {
              if (!this._constructed) {
                this._quoteMark = n;
                return;
              }
              this._quoteMark !== n &&
                ((this._quoteMark = n), this._syncRawValue());
            },
          },
          {
            key: "qualifiedAttribute",
            get: function () {
              return this.qualifiedName(this.raws.attribute || this.attribute);
            },
          },
          {
            key: "insensitiveFlag",
            get: function () {
              return this.insensitive ? "i" : "";
            },
          },
          {
            key: "value",
            get: function () {
              return this._value;
            },
            set: function (n) {
              if (this._constructed) {
                var a = kc(n),
                  s = a.deprecatedUsage,
                  o = a.unescaped,
                  l = a.quoteMark;
                if ((s && Xq(), o === this._value && l === this._quoteMark))
                  return;
                (this._value = o), (this._quoteMark = l), this._syncRawValue();
              } else this._value = n;
            },
          },
          {
            key: "attribute",
            get: function () {
              return this._attribute;
            },
            set: function (n) {
              this._handleEscapes("attribute", n), (this._attribute = n);
            },
          },
        ]),
        e
      );
    })(Hq.default);
    yn.default = Ea;
    Ea.NO_QUOTE = null;
    Ea.SINGLE_QUOTE = "'";
    Ea.DOUBLE_QUOTE = '"';
    var Sc =
      ((vc = {
        "'": { quotes: "single", wrap: !0 },
        '"': { quotes: "double", wrap: !0 },
      }),
      (vc[null] = { isIdentifier: !0 }),
      vc);
    function mx(t, e) {
      return "" + e.before + t + e.after;
    }
  });
  var Oc = k((wn, gx) => {
    u();
    ("use strict");
    wn.__esModule = !0;
    wn.default = void 0;
    var rD = nD(Oa()),
      iD = ke();
    function nD(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function sD(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        Tc(t, e);
    }
    function Tc(t, e) {
      return (
        (Tc =
          Object.setPrototypeOf ||
          function (i, n) {
            return (i.__proto__ = n), i;
          }),
        Tc(t, e)
      );
    }
    var aD = (function (t) {
      sD(e, t);
      function e(r) {
        var i;
        return (
          (i = t.call(this, r) || this),
          (i.type = iD.UNIVERSAL),
          (i.value = "*"),
          i
        );
      }
      return e;
    })(rD.default);
    wn.default = aD;
    gx.exports = wn.default;
  });
  var Ac = k((vn, yx) => {
    u();
    ("use strict");
    vn.__esModule = !0;
    vn.default = void 0;
    var oD = uD(kt()),
      lD = ke();
    function uD(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function fD(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        Ec(t, e);
    }
    function Ec(t, e) {
      return (
        (Ec =
          Object.setPrototypeOf ||
          function (i, n) {
            return (i.__proto__ = n), i;
          }),
        Ec(t, e)
      );
    }
    var cD = (function (t) {
      fD(e, t);
      function e(r) {
        var i;
        return (i = t.call(this, r) || this), (i.type = lD.COMBINATOR), i;
      }
      return e;
    })(oD.default);
    vn.default = cD;
    yx.exports = vn.default;
  });
  var Pc = k((bn, wx) => {
    u();
    ("use strict");
    bn.__esModule = !0;
    bn.default = void 0;
    var pD = hD(kt()),
      dD = ke();
    function hD(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function mD(t, e) {
      (t.prototype = Object.create(e.prototype)),
        (t.prototype.constructor = t),
        Cc(t, e);
    }
    function Cc(t, e) {
      return (
        (Cc =
          Object.setPrototypeOf ||
          function (i, n) {
            return (i.__proto__ = n), i;
          }),
        Cc(t, e)
      );
    }
    var gD = (function (t) {
      mD(e, t);
      function e(r) {
        var i;
        return (
          (i = t.call(this, r) || this),
          (i.type = dD.NESTING),
          (i.value = "&"),
          i
        );
      }
      return e;
    })(pD.default);
    bn.default = gD;
    wx.exports = bn.default;
  });
  var bx = k((Aa, vx) => {
    u();
    ("use strict");
    Aa.__esModule = !0;
    Aa.default = yD;
    function yD(t) {
      return t.sort(function (e, r) {
        return e - r;
      });
    }
    vx.exports = Aa.default;
  });
  var Ic = k((L) => {
    u();
    ("use strict");
    L.__esModule = !0;
    L.combinator =
      L.word =
      L.comment =
      L.str =
      L.tab =
      L.newline =
      L.feed =
      L.cr =
      L.backslash =
      L.bang =
      L.slash =
      L.doubleQuote =
      L.singleQuote =
      L.space =
      L.greaterThan =
      L.pipe =
      L.equals =
      L.plus =
      L.caret =
      L.tilde =
      L.dollar =
      L.closeSquare =
      L.openSquare =
      L.closeParenthesis =
      L.openParenthesis =
      L.semicolon =
      L.colon =
      L.comma =
      L.at =
      L.asterisk =
      L.ampersand =
        void 0;
    var wD = 38;
    L.ampersand = wD;
    var vD = 42;
    L.asterisk = vD;
    var bD = 64;
    L.at = bD;
    var xD = 44;
    L.comma = xD;
    var kD = 58;
    L.colon = kD;
    var SD = 59;
    L.semicolon = SD;
    var _D = 40;
    L.openParenthesis = _D;
    var TD = 41;
    L.closeParenthesis = TD;
    var OD = 91;
    L.openSquare = OD;
    var ED = 93;
    L.closeSquare = ED;
    var AD = 36;
    L.dollar = AD;
    var CD = 126;
    L.tilde = CD;
    var PD = 94;
    L.caret = PD;
    var ID = 43;
    L.plus = ID;
    var qD = 61;
    L.equals = qD;
    var DD = 124;
    L.pipe = DD;
    var RD = 62;
    L.greaterThan = RD;
    var BD = 32;
    L.space = BD;
    var xx = 39;
    L.singleQuote = xx;
    var MD = 34;
    L.doubleQuote = MD;
    var LD = 47;
    L.slash = LD;
    var FD = 33;
    L.bang = FD;
    var ND = 92;
    L.backslash = ND;
    var zD = 13;
    L.cr = zD;
    var $D = 12;
    L.feed = $D;
    var jD = 10;
    L.newline = jD;
    var UD = 9;
    L.tab = UD;
    var VD = xx;
    L.str = VD;
    var WD = -1;
    L.comment = WD;
    var GD = -2;
    L.word = GD;
    var HD = -3;
    L.combinator = HD;
  });
  var _x = k((xn) => {
    u();
    ("use strict");
    xn.__esModule = !0;
    xn.default = eR;
    xn.FIELDS = void 0;
    var q = YD(Ic()),
      Wr,
      X;
    function kx() {
      if (typeof WeakMap != "function") return null;
      var t = new WeakMap();
      return (
        (kx = function () {
          return t;
        }),
        t
      );
    }
    function YD(t) {
      if (t && t.__esModule) return t;
      if (t === null || (typeof t != "object" && typeof t != "function"))
        return { default: t };
      var e = kx();
      if (e && e.has(t)) return e.get(t);
      var r = {},
        i = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var n in t)
        if (Object.prototype.hasOwnProperty.call(t, n)) {
          var a = i ? Object.getOwnPropertyDescriptor(t, n) : null;
          a && (a.get || a.set)
            ? Object.defineProperty(r, n, a)
            : (r[n] = t[n]);
        }
      return (r.default = t), e && e.set(t, r), r;
    }
    var QD =
        ((Wr = {}),
        (Wr[q.tab] = !0),
        (Wr[q.newline] = !0),
        (Wr[q.cr] = !0),
        (Wr[q.feed] = !0),
        Wr),
      JD =
        ((X = {}),
        (X[q.space] = !0),
        (X[q.tab] = !0),
        (X[q.newline] = !0),
        (X[q.cr] = !0),
        (X[q.feed] = !0),
        (X[q.ampersand] = !0),
        (X[q.asterisk] = !0),
        (X[q.bang] = !0),
        (X[q.comma] = !0),
        (X[q.colon] = !0),
        (X[q.semicolon] = !0),
        (X[q.openParenthesis] = !0),
        (X[q.closeParenthesis] = !0),
        (X[q.openSquare] = !0),
        (X[q.closeSquare] = !0),
        (X[q.singleQuote] = !0),
        (X[q.doubleQuote] = !0),
        (X[q.plus] = !0),
        (X[q.pipe] = !0),
        (X[q.tilde] = !0),
        (X[q.greaterThan] = !0),
        (X[q.equals] = !0),
        (X[q.dollar] = !0),
        (X[q.caret] = !0),
        (X[q.slash] = !0),
        X),
      qc = {},
      Sx = "0123456789abcdefABCDEF";
    for (Ca = 0; Ca < Sx.length; Ca++) qc[Sx.charCodeAt(Ca)] = !0;
    var Ca;
    function KD(t, e) {
      var r = e,
        i;
      do {
        if (((i = t.charCodeAt(r)), JD[i])) return r - 1;
        i === q.backslash ? (r = XD(t, r) + 1) : r++;
      } while (r < t.length);
      return r - 1;
    }
    function XD(t, e) {
      var r = e,
        i = t.charCodeAt(r + 1);
      if (!QD[i])
        if (qc[i]) {
          var n = 0;
          do r++, n++, (i = t.charCodeAt(r + 1));
          while (qc[i] && n < 6);
          n < 6 && i === q.space && r++;
        } else r++;
      return r;
    }
    var ZD = {
      TYPE: 0,
      START_LINE: 1,
      START_COL: 2,
      END_LINE: 3,
      END_COL: 4,
      START_POS: 5,
      END_POS: 6,
    };
    xn.FIELDS = ZD;
    function eR(t) {
      var e = [],
        r = t.css.valueOf(),
        i = r,
        n = i.length,
        a = -1,
        s = 1,
        o = 0,
        l = 0,
        c,
        f,
        p,
        h,
        m,
        b,
        S,
        v,
        w,
        _,
        T,
        O,
        E;
      function F(z, N) {
        if (t.safe) (r += N), (w = r.length - 1);
        else throw t.error("Unclosed " + z, s, o - a, o);
      }
      for (; o < n; ) {
        switch (
          ((c = r.charCodeAt(o)), c === q.newline && ((a = o), (s += 1)), c)
        ) {
          case q.space:
          case q.tab:
          case q.newline:
          case q.cr:
          case q.feed:
            w = o;
            do
              (w += 1),
                (c = r.charCodeAt(w)),
                c === q.newline && ((a = w), (s += 1));
            while (
              c === q.space ||
              c === q.newline ||
              c === q.tab ||
              c === q.cr ||
              c === q.feed
            );
            (E = q.space), (h = s), (p = w - a - 1), (l = w);
            break;
          case q.plus:
          case q.greaterThan:
          case q.tilde:
          case q.pipe:
            w = o;
            do (w += 1), (c = r.charCodeAt(w));
            while (
              c === q.plus ||
              c === q.greaterThan ||
              c === q.tilde ||
              c === q.pipe
            );
            (E = q.combinator), (h = s), (p = o - a), (l = w);
            break;
          case q.asterisk:
          case q.ampersand:
          case q.bang:
          case q.comma:
          case q.equals:
          case q.dollar:
          case q.caret:
          case q.openSquare:
          case q.closeSquare:
          case q.colon:
          case q.semicolon:
          case q.openParenthesis:
          case q.closeParenthesis:
            (w = o), (E = c), (h = s), (p = o - a), (l = w + 1);
            break;
          case q.singleQuote:
          case q.doubleQuote:
            (O = c === q.singleQuote ? "'" : '"'), (w = o);
            do
              for (
                m = !1,
                  w = r.indexOf(O, w + 1),
                  w === -1 && F("quote", O),
                  b = w;
                r.charCodeAt(b - 1) === q.backslash;

              )
                (b -= 1), (m = !m);
            while (m);
            (E = q.str), (h = s), (p = o - a), (l = w + 1);
            break;
          default:
            c === q.slash && r.charCodeAt(o + 1) === q.asterisk
              ? ((w = r.indexOf("*/", o + 2) + 1),
                w === 0 && F("comment", "*/"),
                (f = r.slice(o, w + 1)),
                (v = f.split(`
`)),
                (S = v.length - 1),
                S > 0
                  ? ((_ = s + S), (T = w - v[S].length))
                  : ((_ = s), (T = a)),
                (E = q.comment),
                (s = _),
                (h = _),
                (p = w - T))
              : c === q.slash
              ? ((w = o), (E = c), (h = s), (p = o - a), (l = w + 1))
              : ((w = KD(r, o)), (E = q.word), (h = s), (p = w - a)),
              (l = w + 1);
            break;
        }
        e.push([E, s, o - a, h, p, o, l]), T && ((a = T), (T = null)), (o = l);
      }
      return e;
    }
  });
  var qx = k((kn, Ix) => {
    u();
    ("use strict");
    kn.__esModule = !0;
    kn.default = void 0;
    var tR = Ue(ic()),
      Dc = Ue(sc()),
      rR = Ue(oc()),
      Tx = Ue(uc()),
      iR = Ue(cc()),
      nR = Ue(hc()),
      Rc = Ue(gc()),
      sR = Ue(wc()),
      Ox = Pa(_c()),
      aR = Ue(Oc()),
      Bc = Ue(Ac()),
      oR = Ue(Pc()),
      lR = Ue(bx()),
      P = Pa(_x()),
      R = Pa(Ic()),
      uR = Pa(ke()),
      le = rn(),
      ir,
      Mc;
    function Ex() {
      if (typeof WeakMap != "function") return null;
      var t = new WeakMap();
      return (
        (Ex = function () {
          return t;
        }),
        t
      );
    }
    function Pa(t) {
      if (t && t.__esModule) return t;
      if (t === null || (typeof t != "object" && typeof t != "function"))
        return { default: t };
      var e = Ex();
      if (e && e.has(t)) return e.get(t);
      var r = {},
        i = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var n in t)
        if (Object.prototype.hasOwnProperty.call(t, n)) {
          var a = i ? Object.getOwnPropertyDescriptor(t, n) : null;
          a && (a.get || a.set)
            ? Object.defineProperty(r, n, a)
            : (r[n] = t[n]);
        }
      return (r.default = t), e && e.set(t, r), r;
    }
    function Ue(t) {
      return t && t.__esModule ? t : { default: t };
    }
    function Ax(t, e) {
      for (var r = 0; r < e.length; r++) {
        var i = e[r];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(t, i.key, i);
      }
    }
    function fR(t, e, r) {
      return e && Ax(t.prototype, e), r && Ax(t, r), t;
    }
    var Lc =
        ((ir = {}),
        (ir[R.space] = !0),
        (ir[R.cr] = !0),
        (ir[R.feed] = !0),
        (ir[R.newline] = !0),
        (ir[R.tab] = !0),
        ir),
      cR = Object.assign({}, Lc, ((Mc = {}), (Mc[R.comment] = !0), Mc));
    function Cx(t) {
      return { line: t[P.FIELDS.START_LINE], column: t[P.FIELDS.START_COL] };
    }
    function Px(t) {
      return { line: t[P.FIELDS.END_LINE], column: t[P.FIELDS.END_COL] };
    }
    function nr(t, e, r, i) {
      return { start: { line: t, column: e }, end: { line: r, column: i } };
    }
    function Gr(t) {
      return nr(
        t[P.FIELDS.START_LINE],
        t[P.FIELDS.START_COL],
        t[P.FIELDS.END_LINE],
        t[P.FIELDS.END_COL]
      );
    }
    function Fc(t, e) {
      if (!!t)
        return nr(
          t[P.FIELDS.START_LINE],
          t[P.FIELDS.START_COL],
          e[P.FIELDS.END_LINE],
          e[P.FIELDS.END_COL]
        );
    }
    function Hr(t, e) {
      var r = t[e];
      if (typeof r == "string")
        return (
          r.indexOf("\\") !== -1 &&
            ((0, le.ensureObject)(t, "raws"),
            (t[e] = (0, le.unesc)(r)),
            t.raws[e] === void 0 && (t.raws[e] = r)),
          t
        );
    }
    function Nc(t, e) {
      for (var r = -1, i = []; (r = t.indexOf(e, r + 1)) !== -1; ) i.push(r);
      return i;
    }
    function pR() {
      var t = Array.prototype.concat.apply([], arguments);
      return t.filter(function (e, r) {
        return r === t.indexOf(e);
      });
    }
    var dR = (function () {
      function t(r, i) {
        i === void 0 && (i = {}),
          (this.rule = r),
          (this.options = Object.assign({ lossy: !1, safe: !1 }, i)),
          (this.position = 0),
          (this.css =
            typeof this.rule == "string" ? this.rule : this.rule.selector),
          (this.tokens = (0, P.default)({
            css: this.css,
            error: this._errorGenerator(),
            safe: this.options.safe,
          }));
        var n = Fc(this.tokens[0], this.tokens[this.tokens.length - 1]);
        (this.root = new tR.default({ source: n })),
          (this.root.errorGenerator = this._errorGenerator());
        var a = new Dc.default({ source: { start: { line: 1, column: 1 } } });
        this.root.append(a), (this.current = a), this.loop();
      }
      var e = t.prototype;
      return (
        (e._errorGenerator = function () {
          var i = this;
          return function (n, a) {
            return typeof i.rule == "string"
              ? new Error(n)
              : i.rule.error(n, a);
          };
        }),
        (e.attribute = function () {
          var i = [],
            n = this.currToken;
          for (
            this.position++;
            this.position < this.tokens.length &&
            this.currToken[P.FIELDS.TYPE] !== R.closeSquare;

          )
            i.push(this.currToken), this.position++;
          if (this.currToken[P.FIELDS.TYPE] !== R.closeSquare)
            return this.expected(
              "closing square bracket",
              this.currToken[P.FIELDS.START_POS]
            );
          var a = i.length,
            s = {
              source: nr(n[1], n[2], this.currToken[3], this.currToken[4]),
              sourceIndex: n[P.FIELDS.START_POS],
            };
          if (a === 1 && !~[R.word].indexOf(i[0][P.FIELDS.TYPE]))
            return this.expected("attribute", i[0][P.FIELDS.START_POS]);
          for (var o = 0, l = "", c = "", f = null, p = !1; o < a; ) {
            var h = i[o],
              m = this.content(h),
              b = i[o + 1];
            switch (h[P.FIELDS.TYPE]) {
              case R.space:
                if (((p = !0), this.options.lossy)) break;
                if (f) {
                  (0, le.ensureObject)(s, "spaces", f);
                  var S = s.spaces[f].after || "";
                  s.spaces[f].after = S + m;
                  var v =
                    (0, le.getProp)(s, "raws", "spaces", f, "after") || null;
                  v && (s.raws.spaces[f].after = v + m);
                } else (l = l + m), (c = c + m);
                break;
              case R.asterisk:
                if (b[P.FIELDS.TYPE] === R.equals)
                  (s.operator = m), (f = "operator");
                else if ((!s.namespace || (f === "namespace" && !p)) && b) {
                  l &&
                    ((0, le.ensureObject)(s, "spaces", "attribute"),
                    (s.spaces.attribute.before = l),
                    (l = "")),
                    c &&
                      ((0, le.ensureObject)(s, "raws", "spaces", "attribute"),
                      (s.raws.spaces.attribute.before = l),
                      (c = "")),
                    (s.namespace = (s.namespace || "") + m);
                  var w = (0, le.getProp)(s, "raws", "namespace") || null;
                  w && (s.raws.namespace += m), (f = "namespace");
                }
                p = !1;
                break;
              case R.dollar:
                if (f === "value") {
                  var _ = (0, le.getProp)(s, "raws", "value");
                  (s.value += "$"), _ && (s.raws.value = _ + "$");
                  break;
                }
              case R.caret:
                b[P.FIELDS.TYPE] === R.equals &&
                  ((s.operator = m), (f = "operator")),
                  (p = !1);
                break;
              case R.combinator:
                if (
                  (m === "~" &&
                    b[P.FIELDS.TYPE] === R.equals &&
                    ((s.operator = m), (f = "operator")),
                  m !== "|")
                ) {
                  p = !1;
                  break;
                }
                b[P.FIELDS.TYPE] === R.equals
                  ? ((s.operator = m), (f = "operator"))
                  : !s.namespace && !s.attribute && (s.namespace = !0),
                  (p = !1);
                break;
              case R.word:
                if (
                  b &&
                  this.content(b) === "|" &&
                  i[o + 2] &&
                  i[o + 2][P.FIELDS.TYPE] !== R.equals &&
                  !s.operator &&
                  !s.namespace
                )
                  (s.namespace = m), (f = "namespace");
                else if (!s.attribute || (f === "attribute" && !p)) {
                  l &&
                    ((0, le.ensureObject)(s, "spaces", "attribute"),
                    (s.spaces.attribute.before = l),
                    (l = "")),
                    c &&
                      ((0, le.ensureObject)(s, "raws", "spaces", "attribute"),
                      (s.raws.spaces.attribute.before = c),
                      (c = "")),
                    (s.attribute = (s.attribute || "") + m);
                  var T = (0, le.getProp)(s, "raws", "attribute") || null;
                  T && (s.raws.attribute += m), (f = "attribute");
                } else if (
                  (!s.value && s.value !== "") ||
                  (f === "value" && !p)
                ) {
                  var O = (0, le.unesc)(m),
                    E = (0, le.getProp)(s, "raws", "value") || "",
                    F = s.value || "";
                  (s.value = F + O),
                    (s.quoteMark = null),
                    (O !== m || E) &&
                      ((0, le.ensureObject)(s, "raws"),
                      (s.raws.value = (E || F) + m)),
                    (f = "value");
                } else {
                  var z = m === "i" || m === "I";
                  (s.value || s.value === "") && (s.quoteMark || p)
                    ? ((s.insensitive = z),
                      (!z || m === "I") &&
                        ((0, le.ensureObject)(s, "raws"),
                        (s.raws.insensitiveFlag = m)),
                      (f = "insensitive"),
                      l &&
                        ((0, le.ensureObject)(s, "spaces", "insensitive"),
                        (s.spaces.insensitive.before = l),
                        (l = "")),
                      c &&
                        ((0, le.ensureObject)(
                          s,
                          "raws",
                          "spaces",
                          "insensitive"
                        ),
                        (s.raws.spaces.insensitive.before = c),
                        (c = "")))
                    : (s.value || s.value === "") &&
                      ((f = "value"),
                      (s.value += m),
                      s.raws.value && (s.raws.value += m));
                }
                p = !1;
                break;
              case R.str:
                if (!s.attribute || !s.operator)
                  return this.error(
                    "Expected an attribute followed by an operator preceding the string.",
                    { index: h[P.FIELDS.START_POS] }
                  );
                var N = (0, Ox.unescapeValue)(m),
                  fe = N.unescaped,
                  Se = N.quoteMark;
                (s.value = fe),
                  (s.quoteMark = Se),
                  (f = "value"),
                  (0, le.ensureObject)(s, "raws"),
                  (s.raws.value = m),
                  (p = !1);
                break;
              case R.equals:
                if (!s.attribute)
                  return this.expected("attribute", h[P.FIELDS.START_POS], m);
                if (s.value)
                  return this.error(
                    'Unexpected "=" found; an operator was already defined.',
                    { index: h[P.FIELDS.START_POS] }
                  );
                (s.operator = s.operator ? s.operator + m : m),
                  (f = "operator"),
                  (p = !1);
                break;
              case R.comment:
                if (f)
                  if (
                    p ||
                    (b && b[P.FIELDS.TYPE] === R.space) ||
                    f === "insensitive"
                  ) {
                    var Te = (0, le.getProp)(s, "spaces", f, "after") || "",
                      Me =
                        (0, le.getProp)(s, "raws", "spaces", f, "after") || Te;
                    (0, le.ensureObject)(s, "raws", "spaces", f),
                      (s.raws.spaces[f].after = Me + m);
                  } else {
                    var pe = s[f] || "",
                      ve = (0, le.getProp)(s, "raws", f) || pe;
                    (0, le.ensureObject)(s, "raws"), (s.raws[f] = ve + m);
                  }
                else c = c + m;
                break;
              default:
                return this.error('Unexpected "' + m + '" found.', {
                  index: h[P.FIELDS.START_POS],
                });
            }
            o++;
          }
          Hr(s, "attribute"),
            Hr(s, "namespace"),
            this.newNode(new Ox.default(s)),
            this.position++;
        }),
        (e.parseWhitespaceEquivalentTokens = function (i) {
          i < 0 && (i = this.tokens.length);
          var n = this.position,
            a = [],
            s = "",
            o = void 0;
          do
            if (Lc[this.currToken[P.FIELDS.TYPE]])
              this.options.lossy || (s += this.content());
            else if (this.currToken[P.FIELDS.TYPE] === R.comment) {
              var l = {};
              s && ((l.before = s), (s = "")),
                (o = new Tx.default({
                  value: this.content(),
                  source: Gr(this.currToken),
                  sourceIndex: this.currToken[P.FIELDS.START_POS],
                  spaces: l,
                })),
                a.push(o);
            }
          while (++this.position < i);
          if (s) {
            if (o) o.spaces.after = s;
            else if (!this.options.lossy) {
              var c = this.tokens[n],
                f = this.tokens[this.position - 1];
              a.push(
                new Rc.default({
                  value: "",
                  source: nr(
                    c[P.FIELDS.START_LINE],
                    c[P.FIELDS.START_COL],
                    f[P.FIELDS.END_LINE],
                    f[P.FIELDS.END_COL]
                  ),
                  sourceIndex: c[P.FIELDS.START_POS],
                  spaces: { before: s, after: "" },
                })
              );
            }
          }
          return a;
        }),
        (e.convertWhitespaceNodesToSpace = function (i, n) {
          var a = this;
          n === void 0 && (n = !1);
          var s = "",
            o = "";
          i.forEach(function (c) {
            var f = a.lossySpace(c.spaces.before, n),
              p = a.lossySpace(c.rawSpaceBefore, n);
            (s += f + a.lossySpace(c.spaces.after, n && f.length === 0)),
              (o +=
                f +
                c.value +
                a.lossySpace(c.rawSpaceAfter, n && p.length === 0));
          }),
            o === s && (o = void 0);
          var l = { space: s, rawSpace: o };
          return l;
        }),
        (e.isNamedCombinator = function (i) {
          return (
            i === void 0 && (i = this.position),
            this.tokens[i + 0] &&
              this.tokens[i + 0][P.FIELDS.TYPE] === R.slash &&
              this.tokens[i + 1] &&
              this.tokens[i + 1][P.FIELDS.TYPE] === R.word &&
              this.tokens[i + 2] &&
              this.tokens[i + 2][P.FIELDS.TYPE] === R.slash
          );
        }),
        (e.namedCombinator = function () {
          if (this.isNamedCombinator()) {
            var i = this.content(this.tokens[this.position + 1]),
              n = (0, le.unesc)(i).toLowerCase(),
              a = {};
            n !== i && (a.value = "/" + i + "/");
            var s = new Bc.default({
              value: "/" + n + "/",
              source: nr(
                this.currToken[P.FIELDS.START_LINE],
                this.currToken[P.FIELDS.START_COL],
                this.tokens[this.position + 2][P.FIELDS.END_LINE],
                this.tokens[this.position + 2][P.FIELDS.END_COL]
              ),
              sourceIndex: this.currToken[P.FIELDS.START_POS],
              raws: a,
            });
            return (this.position = this.position + 3), s;
          } else this.unexpected();
        }),
        (e.combinator = function () {
          var i = this;
          if (this.content() === "|") return this.namespace();
          var n = this.locateNextMeaningfulToken(this.position);
          if (n < 0 || this.tokens[n][P.FIELDS.TYPE] === R.comma) {
            var a = this.parseWhitespaceEquivalentTokens(n);
            if (a.length > 0) {
              var s = this.current.last;
              if (s) {
                var o = this.convertWhitespaceNodesToSpace(a),
                  l = o.space,
                  c = o.rawSpace;
                c !== void 0 && (s.rawSpaceAfter += c), (s.spaces.after += l);
              } else
                a.forEach(function (E) {
                  return i.newNode(E);
                });
            }
            return;
          }
          var f = this.currToken,
            p = void 0;
          n > this.position && (p = this.parseWhitespaceEquivalentTokens(n));
          var h;
          if (
            (this.isNamedCombinator()
              ? (h = this.namedCombinator())
              : this.currToken[P.FIELDS.TYPE] === R.combinator
              ? ((h = new Bc.default({
                  value: this.content(),
                  source: Gr(this.currToken),
                  sourceIndex: this.currToken[P.FIELDS.START_POS],
                })),
                this.position++)
              : Lc[this.currToken[P.FIELDS.TYPE]] || p || this.unexpected(),
            h)
          ) {
            if (p) {
              var m = this.convertWhitespaceNodesToSpace(p),
                b = m.space,
                S = m.rawSpace;
              (h.spaces.before = b), (h.rawSpaceBefore = S);
            }
          } else {
            var v = this.convertWhitespaceNodesToSpace(p, !0),
              w = v.space,
              _ = v.rawSpace;
            _ || (_ = w);
            var T = {},
              O = { spaces: {} };
            w.endsWith(" ") && _.endsWith(" ")
              ? ((T.before = w.slice(0, w.length - 1)),
                (O.spaces.before = _.slice(0, _.length - 1)))
              : w.startsWith(" ") && _.startsWith(" ")
              ? ((T.after = w.slice(1)), (O.spaces.after = _.slice(1)))
              : (O.value = _),
              (h = new Bc.default({
                value: " ",
                source: Fc(f, this.tokens[this.position - 1]),
                sourceIndex: f[P.FIELDS.START_POS],
                spaces: T,
                raws: O,
              }));
          }
          return (
            this.currToken &&
              this.currToken[P.FIELDS.TYPE] === R.space &&
              ((h.spaces.after = this.optionalSpace(this.content())),
              this.position++),
            this.newNode(h)
          );
        }),
        (e.comma = function () {
          if (this.position === this.tokens.length - 1) {
            (this.root.trailingComma = !0), this.position++;
            return;
          }
          this.current._inferEndPosition();
          var i = new Dc.default({
            source: { start: Cx(this.tokens[this.position + 1]) },
          });
          this.current.parent.append(i), (this.current = i), this.position++;
        }),
        (e.comment = function () {
          var i = this.currToken;
          this.newNode(
            new Tx.default({
              value: this.content(),
              source: Gr(i),
              sourceIndex: i[P.FIELDS.START_POS],
            })
          ),
            this.position++;
        }),
        (e.error = function (i, n) {
          throw this.root.error(i, n);
        }),
        (e.missingBackslash = function () {
          return this.error("Expected a backslash preceding the semicolon.", {
            index: this.currToken[P.FIELDS.START_POS],
          });
        }),
        (e.missingParenthesis = function () {
          return this.expected(
            "opening parenthesis",
            this.currToken[P.FIELDS.START_POS]
          );
        }),
        (e.missingSquareBracket = function () {
          return this.expected(
            "opening square bracket",
            this.currToken[P.FIELDS.START_POS]
          );
        }),
        (e.unexpected = function () {
          return this.error(
            "Unexpected '" +
              this.content() +
              "'. Escaping special characters with \\ may help.",
            this.currToken[P.FIELDS.START_POS]
          );
        }),
        (e.namespace = function () {
          var i = (this.prevToken && this.content(this.prevToken)) || !0;
          if (this.nextToken[P.FIELDS.TYPE] === R.word)
            return this.position++, this.word(i);
          if (this.nextToken[P.FIELDS.TYPE] === R.asterisk)
            return this.position++, this.universal(i);
        }),
        (e.nesting = function () {
          if (this.nextToken) {
            var i = this.content(this.nextToken);
            if (i === "|") {
              this.position++;
              return;
            }
          }
          var n = this.currToken;
          this.newNode(
            new oR.default({
              value: this.content(),
              source: Gr(n),
              sourceIndex: n[P.FIELDS.START_POS],
            })
          ),
            this.position++;
        }),
        (e.parentheses = function () {
          var i = this.current.last,
            n = 1;
          if ((this.position++, i && i.type === uR.PSEUDO)) {
            var a = new Dc.default({
                source: { start: Cx(this.tokens[this.position - 1]) },
              }),
              s = this.current;
            for (
              i.append(a), this.current = a;
              this.position < this.tokens.length && n;

            )
              this.currToken[P.FIELDS.TYPE] === R.openParenthesis && n++,
                this.currToken[P.FIELDS.TYPE] === R.closeParenthesis && n--,
                n
                  ? this.parse()
                  : ((this.current.source.end = Px(this.currToken)),
                    (this.current.parent.source.end = Px(this.currToken)),
                    this.position++);
            this.current = s;
          } else {
            for (
              var o = this.currToken, l = "(", c;
              this.position < this.tokens.length && n;

            )
              this.currToken[P.FIELDS.TYPE] === R.openParenthesis && n++,
                this.currToken[P.FIELDS.TYPE] === R.closeParenthesis && n--,
                (c = this.currToken),
                (l += this.parseParenthesisToken(this.currToken)),
                this.position++;
            i
              ? i.appendToPropertyAndEscape("value", l, l)
              : this.newNode(
                  new Rc.default({
                    value: l,
                    source: nr(
                      o[P.FIELDS.START_LINE],
                      o[P.FIELDS.START_COL],
                      c[P.FIELDS.END_LINE],
                      c[P.FIELDS.END_COL]
                    ),
                    sourceIndex: o[P.FIELDS.START_POS],
                  })
                );
          }
          if (n)
            return this.expected(
              "closing parenthesis",
              this.currToken[P.FIELDS.START_POS]
            );
        }),
        (e.pseudo = function () {
          for (
            var i = this, n = "", a = this.currToken;
            this.currToken && this.currToken[P.FIELDS.TYPE] === R.colon;

          )
            (n += this.content()), this.position++;
          if (!this.currToken)
            return this.expected(
              ["pseudo-class", "pseudo-element"],
              this.position - 1
            );
          if (this.currToken[P.FIELDS.TYPE] === R.word)
            this.splitWord(!1, function (s, o) {
              (n += s),
                i.newNode(
                  new sR.default({
                    value: n,
                    source: Fc(a, i.currToken),
                    sourceIndex: a[P.FIELDS.START_POS],
                  })
                ),
                o > 1 &&
                  i.nextToken &&
                  i.nextToken[P.FIELDS.TYPE] === R.openParenthesis &&
                  i.error("Misplaced parenthesis.", {
                    index: i.nextToken[P.FIELDS.START_POS],
                  });
            });
          else
            return this.expected(
              ["pseudo-class", "pseudo-element"],
              this.currToken[P.FIELDS.START_POS]
            );
        }),
        (e.space = function () {
          var i = this.content();
          this.position === 0 ||
          this.prevToken[P.FIELDS.TYPE] === R.comma ||
          this.prevToken[P.FIELDS.TYPE] === R.openParenthesis ||
          this.current.nodes.every(function (n) {
            return n.type === "comment";
          })
            ? ((this.spaces = this.optionalSpace(i)), this.position++)
            : this.position === this.tokens.length - 1 ||
              this.nextToken[P.FIELDS.TYPE] === R.comma ||
              this.nextToken[P.FIELDS.TYPE] === R.closeParenthesis
            ? ((this.current.last.spaces.after = this.optionalSpace(i)),
              this.position++)
            : this.combinator();
        }),
        (e.string = function () {
          var i = this.currToken;
          this.newNode(
            new Rc.default({
              value: this.content(),
              source: Gr(i),
              sourceIndex: i[P.FIELDS.START_POS],
            })
          ),
            this.position++;
        }),
        (e.universal = function (i) {
          var n = this.nextToken;
          if (n && this.content(n) === "|")
            return this.position++, this.namespace();
          var a = this.currToken;
          this.newNode(
            new aR.default({
              value: this.content(),
              source: Gr(a),
              sourceIndex: a[P.FIELDS.START_POS],
            }),
            i
          ),
            this.position++;
        }),
        (e.splitWord = function (i, n) {
          for (
            var a = this, s = this.nextToken, o = this.content();
            s &&
            ~[R.dollar, R.caret, R.equals, R.word].indexOf(s[P.FIELDS.TYPE]);

          ) {
            this.position++;
            var l = this.content();
            if (((o += l), l.lastIndexOf("\\") === l.length - 1)) {
              var c = this.nextToken;
              c &&
                c[P.FIELDS.TYPE] === R.space &&
                ((o += this.requiredSpace(this.content(c))), this.position++);
            }
            s = this.nextToken;
          }
          var f = Nc(o, ".").filter(function (b) {
              var S = o[b - 1] === "\\",
                v = /^\d+\.\d+%$/.test(o);
              return !S && !v;
            }),
            p = Nc(o, "#").filter(function (b) {
              return o[b - 1] !== "\\";
            }),
            h = Nc(o, "#{");
          h.length &&
            (p = p.filter(function (b) {
              return !~h.indexOf(b);
            }));
          var m = (0, lR.default)(pR([0].concat(f, p)));
          m.forEach(function (b, S) {
            var v = m[S + 1] || o.length,
              w = o.slice(b, v);
            if (S === 0 && n) return n.call(a, w, m.length);
            var _,
              T = a.currToken,
              O = T[P.FIELDS.START_POS] + m[S],
              E = nr(T[1], T[2] + b, T[3], T[2] + (v - 1));
            if (~f.indexOf(b)) {
              var F = { value: w.slice(1), source: E, sourceIndex: O };
              _ = new rR.default(Hr(F, "value"));
            } else if (~p.indexOf(b)) {
              var z = { value: w.slice(1), source: E, sourceIndex: O };
              _ = new iR.default(Hr(z, "value"));
            } else {
              var N = { value: w, source: E, sourceIndex: O };
              Hr(N, "value"), (_ = new nR.default(N));
            }
            a.newNode(_, i), (i = null);
          }),
            this.position++;
        }),
        (e.word = function (i) {
          var n = this.nextToken;
          return n && this.content(n) === "|"
            ? (this.position++, this.namespace())
            : this.splitWord(i);
        }),
        (e.loop = function () {
          for (; this.position < this.tokens.length; ) this.parse(!0);
          return this.current._inferEndPosition(), this.root;
        }),
        (e.parse = function (i) {
          switch (this.currToken[P.FIELDS.TYPE]) {
            case R.space:
              this.space();
              break;
            case R.comment:
              this.comment();
              break;
            case R.openParenthesis:
              this.parentheses();
              break;
            case R.closeParenthesis:
              i && this.missingParenthesis();
              break;
            case R.openSquare:
              this.attribute();
              break;
            case R.dollar:
            case R.caret:
            case R.equals:
            case R.word:
              this.word();
              break;
            case R.colon:
              this.pseudo();
              break;
            case R.comma:
              this.comma();
              break;
            case R.asterisk:
              this.universal();
              break;
            case R.ampersand:
              this.nesting();
              break;
            case R.slash:
            case R.combinator:
              this.combinator();
              break;
            case R.str:
              this.string();
              break;
            case R.closeSquare:
              this.missingSquareBracket();
            case R.semicolon:
              this.missingBackslash();
            default:
              this.unexpected();
          }
        }),
        (e.expected = function (i, n, a) {
          if (Array.isArray(i)) {
            var s = i.pop();
            i = i.join(", ") + " or " + s;
          }
          var o = /^[aeiou]/.test(i[0]) ? "an" : "a";
          return a
            ? this.error(
                "Expected " + o + " " + i + ', found "' + a + '" instead.',
                { index: n }
              )
            : this.error("Expected " + o + " " + i + ".", { index: n });
        }),
        (e.requiredSpace = function (i) {
          return this.options.lossy ? " " : i;
        }),
        (e.optionalSpace = function (i) {
          return this.options.lossy ? "" : i;
        }),
        (e.lossySpace = function (i, n) {
          return this.options.lossy ? (n ? " " : "") : i;
        }),
        (e.parseParenthesisToken = function (i) {
          var n = this.content(i);
          return i[P.FIELDS.TYPE] === R.space ? this.requiredSpace(n) : n;
        }),
        (e.newNode = function (i, n) {
          return (
            n &&
              (/^ +$/.test(n) &&
                (this.options.lossy || (this.spaces = (this.spaces || "") + n),
                (n = !0)),
              (i.namespace = n),
              Hr(i, "namespace")),
            this.spaces &&
              ((i.spaces.before = this.spaces), (this.spaces = "")),
            this.current.append(i)
          );
        }),
        (e.content = function (i) {
          return (
            i === void 0 && (i = this.currToken),
            this.css.slice(i[P.FIELDS.START_POS], i[P.FIELDS.END_POS])
          );
        }),
        (e.locateNextMeaningfulToken = function (i) {
          i === void 0 && (i = this.position + 1);
          for (var n = i; n < this.tokens.length; )
            if (cR[this.tokens[n][P.FIELDS.TYPE]]) {
              n++;
              continue;
            } else return n;
          return -1;
        }),
        fR(t, [
          {
            key: "currToken",
            get: function () {
              return this.tokens[this.position];
            },
          },
          {
            key: "nextToken",
            get: function () {
              return this.tokens[this.position + 1];
            },
          },
          {
            key: "prevToken",
            get: function () {
              return this.tokens[this.position - 1];
            },
          },
        ]),
        t
      );
    })();
    kn.default = dR;
    Ix.exports = kn.default;
  });
  var Rx = k((Sn, Dx) => {
    u();
    ("use strict");
    Sn.__esModule = !0;
    Sn.default = void 0;
    var hR = mR(qx());
    function mR(t) {
      return t && t.__esModule ? t : { default: t };
    }
    var gR = (function () {
      function t(r, i) {
        (this.func = r || function () {}),
          (this.funcRes = null),
          (this.options = i);
      }
      var e = t.prototype;
      return (
        (e._shouldUpdateSelector = function (i, n) {
          n === void 0 && (n = {});
          var a = Object.assign({}, this.options, n);
          return a.updateSelector === !1 ? !1 : typeof i != "string";
        }),
        (e._isLossy = function (i) {
          i === void 0 && (i = {});
          var n = Object.assign({}, this.options, i);
          return n.lossless === !1;
        }),
        (e._root = function (i, n) {
          n === void 0 && (n = {});
          var a = new hR.default(i, this._parseOptions(n));
          return a.root;
        }),
        (e._parseOptions = function (i) {
          return { lossy: this._isLossy(i) };
        }),
        (e._run = function (i, n) {
          var a = this;
          return (
            n === void 0 && (n = {}),
            new Promise(function (s, o) {
              try {
                var l = a._root(i, n);
                Promise.resolve(a.func(l))
                  .then(function (c) {
                    var f = void 0;
                    return (
                      a._shouldUpdateSelector(i, n) &&
                        ((f = l.toString()), (i.selector = f)),
                      { transform: c, root: l, string: f }
                    );
                  })
                  .then(s, o);
              } catch (c) {
                o(c);
                return;
              }
            })
          );
        }),
        (e._runSync = function (i, n) {
          n === void 0 && (n = {});
          var a = this._root(i, n),
            s = this.func(a);
          if (s && typeof s.then == "function")
            throw new Error(
              "Selector processor returned a promise to a synchronous call."
            );
          var o = void 0;
          return (
            n.updateSelector &&
              typeof i != "string" &&
              ((o = a.toString()), (i.selector = o)),
            { transform: s, root: a, string: o }
          );
        }),
        (e.ast = function (i, n) {
          return this._run(i, n).then(function (a) {
            return a.root;
          });
        }),
        (e.astSync = function (i, n) {
          return this._runSync(i, n).root;
        }),
        (e.transform = function (i, n) {
          return this._run(i, n).then(function (a) {
            return a.transform;
          });
        }),
        (e.transformSync = function (i, n) {
          return this._runSync(i, n).transform;
        }),
        (e.process = function (i, n) {
          return this._run(i, n).then(function (a) {
            return a.string || a.root.toString();
          });
        }),
        (e.processSync = function (i, n) {
          var a = this._runSync(i, n);
          return a.string || a.root.toString();
        }),
        t
      );
    })();
    Sn.default = gR;
    Dx.exports = Sn.default;
  });
  var Bx = k((ne) => {
    u();
    ("use strict");
    ne.__esModule = !0;
    ne.universal =
      ne.tag =
      ne.string =
      ne.selector =
      ne.root =
      ne.pseudo =
      ne.nesting =
      ne.id =
      ne.comment =
      ne.combinator =
      ne.className =
      ne.attribute =
        void 0;
    var yR = Ve(_c()),
      wR = Ve(oc()),
      vR = Ve(Ac()),
      bR = Ve(uc()),
      xR = Ve(cc()),
      kR = Ve(Pc()),
      SR = Ve(wc()),
      _R = Ve(ic()),
      TR = Ve(sc()),
      OR = Ve(gc()),
      ER = Ve(hc()),
      AR = Ve(Oc());
    function Ve(t) {
      return t && t.__esModule ? t : { default: t };
    }
    var CR = function (e) {
      return new yR.default(e);
    };
    ne.attribute = CR;
    var PR = function (e) {
      return new wR.default(e);
    };
    ne.className = PR;
    var IR = function (e) {
      return new vR.default(e);
    };
    ne.combinator = IR;
    var qR = function (e) {
      return new bR.default(e);
    };
    ne.comment = qR;
    var DR = function (e) {
      return new xR.default(e);
    };
    ne.id = DR;
    var RR = function (e) {
      return new kR.default(e);
    };
    ne.nesting = RR;
    var BR = function (e) {
      return new SR.default(e);
    };
    ne.pseudo = BR;
    var MR = function (e) {
      return new _R.default(e);
    };
    ne.root = MR;
    var LR = function (e) {
      return new TR.default(e);
    };
    ne.selector = LR;
    var FR = function (e) {
      return new OR.default(e);
    };
    ne.string = FR;
    var NR = function (e) {
      return new ER.default(e);
    };
    ne.tag = NR;
    var zR = function (e) {
      return new AR.default(e);
    };
    ne.universal = zR;
  });
  var Nx = k((Y) => {
    u();
    ("use strict");
    Y.__esModule = !0;
    Y.isNode = zc;
    Y.isPseudoElement = Fx;
    Y.isPseudoClass = KR;
    Y.isContainer = XR;
    Y.isNamespace = ZR;
    Y.isUniversal =
      Y.isTag =
      Y.isString =
      Y.isSelector =
      Y.isRoot =
      Y.isPseudo =
      Y.isNesting =
      Y.isIdentifier =
      Y.isComment =
      Y.isCombinator =
      Y.isClassName =
      Y.isAttribute =
        void 0;
    var ue = ke(),
      Ie,
      $R =
        ((Ie = {}),
        (Ie[ue.ATTRIBUTE] = !0),
        (Ie[ue.CLASS] = !0),
        (Ie[ue.COMBINATOR] = !0),
        (Ie[ue.COMMENT] = !0),
        (Ie[ue.ID] = !0),
        (Ie[ue.NESTING] = !0),
        (Ie[ue.PSEUDO] = !0),
        (Ie[ue.ROOT] = !0),
        (Ie[ue.SELECTOR] = !0),
        (Ie[ue.STRING] = !0),
        (Ie[ue.TAG] = !0),
        (Ie[ue.UNIVERSAL] = !0),
        Ie);
    function zc(t) {
      return typeof t == "object" && $R[t.type];
    }
    function We(t, e) {
      return zc(e) && e.type === t;
    }
    var Mx = We.bind(null, ue.ATTRIBUTE);
    Y.isAttribute = Mx;
    var jR = We.bind(null, ue.CLASS);
    Y.isClassName = jR;
    var UR = We.bind(null, ue.COMBINATOR);
    Y.isCombinator = UR;
    var VR = We.bind(null, ue.COMMENT);
    Y.isComment = VR;
    var WR = We.bind(null, ue.ID);
    Y.isIdentifier = WR;
    var GR = We.bind(null, ue.NESTING);
    Y.isNesting = GR;
    var $c = We.bind(null, ue.PSEUDO);
    Y.isPseudo = $c;
    var HR = We.bind(null, ue.ROOT);
    Y.isRoot = HR;
    var YR = We.bind(null, ue.SELECTOR);
    Y.isSelector = YR;
    var QR = We.bind(null, ue.STRING);
    Y.isString = QR;
    var Lx = We.bind(null, ue.TAG);
    Y.isTag = Lx;
    var JR = We.bind(null, ue.UNIVERSAL);
    Y.isUniversal = JR;
    function Fx(t) {
      return (
        $c(t) &&
        t.value &&
        (t.value.startsWith("::") ||
          t.value.toLowerCase() === ":before" ||
          t.value.toLowerCase() === ":after" ||
          t.value.toLowerCase() === ":first-letter" ||
          t.value.toLowerCase() === ":first-line")
      );
    }
    function KR(t) {
      return $c(t) && !Fx(t);
    }
    function XR(t) {
      return !!(zc(t) && t.walk);
    }
    function ZR(t) {
      return Mx(t) || Lx(t);
    }
  });
  var zx = k((Ze) => {
    u();
    ("use strict");
    Ze.__esModule = !0;
    var jc = ke();
    Object.keys(jc).forEach(function (t) {
      t === "default" ||
        t === "__esModule" ||
        (t in Ze && Ze[t] === jc[t]) ||
        (Ze[t] = jc[t]);
    });
    var Uc = Bx();
    Object.keys(Uc).forEach(function (t) {
      t === "default" ||
        t === "__esModule" ||
        (t in Ze && Ze[t] === Uc[t]) ||
        (Ze[t] = Uc[t]);
    });
    var Vc = Nx();
    Object.keys(Vc).forEach(function (t) {
      t === "default" ||
        t === "__esModule" ||
        (t in Ze && Ze[t] === Vc[t]) ||
        (Ze[t] = Vc[t]);
    });
  });
  var Ux = k((_n, jx) => {
    u();
    ("use strict");
    _n.__esModule = !0;
    _n.default = void 0;
    var eB = iB(Rx()),
      tB = rB(zx());
    function $x() {
      if (typeof WeakMap != "function") return null;
      var t = new WeakMap();
      return (
        ($x = function () {
          return t;
        }),
        t
      );
    }
    function rB(t) {
      if (t && t.__esModule) return t;
      if (t === null || (typeof t != "object" && typeof t != "function"))
        return { default: t };
      var e = $x();
      if (e && e.has(t)) return e.get(t);
      var r = {},
        i = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var n in t)
        if (Object.prototype.hasOwnProperty.call(t, n)) {
          var a = i ? Object.getOwnPropertyDescriptor(t, n) : null;
          a && (a.get || a.set)
            ? Object.defineProperty(r, n, a)
            : (r[n] = t[n]);
        }
      return (r.default = t), e && e.set(t, r), r;
    }
    function iB(t) {
      return t && t.__esModule ? t : { default: t };
    }
    var Wc = function (e) {
      return new eB.default(e);
    };
    Object.assign(Wc, tB);
    delete Wc.__esModule;
    var nB = Wc;
    _n.default = nB;
    jx.exports = _n.default;
  });
  var Gx = k((W$, Wx) => {
    u();
    var sB = N1(),
      Vx = Ux(),
      aB = Vx();
    Wx.exports = {
      isUsableColor(t, e) {
        return sB(e) && t !== "gray" && e[600];
      },
      commonTrailingPseudos(t) {
        let e = aB.astSync(t),
          r = [];
        for (let [n, a] of e.nodes.entries())
          for (let [s, o] of [...a.nodes].reverse().entries()) {
            if (o.type !== "pseudo" || !o.value.startsWith("::")) break;
            (r[s] = r[s] || []), (r[s][n] = o);
          }
        let i = Vx.selector();
        for (let n of r) {
          if (!n) continue;
          if (new Set([...n.map((s) => s.value)]).size > 1) break;
          n.forEach((s) => s.remove()), i.prepend(n[0]);
        }
        return i.nodes.length ? [i.toString(), e.toString()] : [null, t];
      },
    };
  });
  var Jx = k((G$, Qx) => {
    u();
    var oB = (Wi(), Vi).default,
      lB = I1(),
      uB = D1(),
      fB = B1(),
      { commonTrailingPseudos: cB } = Gx(),
      Hx = {};
    function Gc(t, { className: e, modifier: r, prefix: i }) {
      let n = i(`.not-${e}`).slice(1),
        a = t.startsWith(">")
          ? `${r === "DEFAULT" ? `.${e}` : `.${e}-${r}`} `
          : "",
        [s, o] = cB(t);
      return s
        ? `:where(${a}${o}):not(:where([class~="${n}"],[class~="${n}"] *))${s}`
        : `:where(${a}${t}):not(:where([class~="${n}"],[class~="${n}"] *))`;
    }
    function Yx(t) {
      return typeof t == "object" && t !== null;
    }
    function pB(t = {}, { target: e, className: r, modifier: i, prefix: n }) {
      function a(s, o) {
        return e === "legacy"
          ? [s, o]
          : Array.isArray(o)
          ? [s, o]
          : Yx(o)
          ? Object.values(o).some(Yx)
            ? [
                Gc(s, { className: r, modifier: i, prefix: n }),
                o,
                Object.fromEntries(Object.entries(o).map(([c, f]) => a(c, f))),
              ]
            : [Gc(s, { className: r, modifier: i, prefix: n }), o]
          : [s, o];
      }
      return Object.fromEntries(
        Object.entries(
          lB(
            {},
            ...Object.keys(t)
              .filter((s) => Hx[s])
              .map((s) => Hx[s](t[s])),
            ...uB(t.css || {})
          )
        ).map(([s, o]) => a(s, o))
      );
    }
    Qx.exports = oB.withOptions(
      ({ className: t = "prose", target: e = "modern" } = {}) =>
        function ({ addVariant: r, addComponents: i, theme: n, prefix: a }) {
          let s = n("typography"),
            o = { className: t, prefix: a };
          for (let [l, ...c] of [
            ["headings", "h1", "h2", "h3", "h4", "h5", "h6", "th"],
            ["h1"],
            ["h2"],
            ["h3"],
            ["h4"],
            ["h5"],
            ["h6"],
            ["p"],
            ["a"],
            ["blockquote"],
            ["figure"],
            ["figcaption"],
            ["strong"],
            ["em"],
            ["kbd"],
            ["code"],
            ["pre"],
            ["ol"],
            ["ul"],
            ["li"],
            ["table"],
            ["thead"],
            ["tr"],
            ["th"],
            ["td"],
            ["img"],
            ["video"],
            ["hr"],
            ["lead", '[class~="lead"]'],
          ]) {
            c = c.length === 0 ? [l] : c;
            let f = e === "legacy" ? c.map((p) => `& ${p}`) : c.join(", ");
            r(`${t}-${l}`, e === "legacy" ? f : `& :is(${Gc(f, o)})`);
          }
          i(
            Object.keys(s).map((l) => ({
              [l === "DEFAULT" ? `.${t}` : `.${t}-${l}`]: pB(s[l], {
                target: e,
                className: t,
                modifier: l,
                prefix: a,
              }),
            }))
          );
        },
      () => ({ theme: { typography: fB } })
    );
  });
  var Kx = {};
  He(Kx, { default: () => dB });
  var dB,
    Xx = A(() => {
      u();
      dB = [r1(), Jx()];
    });
  var ek = {};
  He(ek, { default: () => hB });
  var Zx,
    hB,
    tk = A(() => {
      u();
      Rn();
      (Zx = ce(Nn())), (hB = Et(Zx.default));
    });
  u();
  ("use strict");
  var mB = _t(t0()),
    gB = _t(Re()),
    yB = _t(Gb()),
    wB = _t((Xx(), Kx)),
    vB = _t((jf(), $f)),
    bB = _t((tk(), ek)),
    xB = _t((Qr(), In)),
    kB = _t((Wi(), Vi)),
    SB = _t((Ka(), Up));
  function _t(t) {
    return t && t.__esModule ? t : { default: t };
  }
  console.warn(
    "cdn.tailwindcss.com should not be used in production. To use Tailwind CSS in production, install it as a PostCSS plugin or use the Tailwind CLI: https://tailwindcss.com/docs/installation"
  );
  var Ia = "tailwind",
    Hc = "text/tailwindcss",
    rk = "/template.html",
    sr,
    ik = !0,
    nk = 0,
    Yc = new Set(),
    Qc,
    sk = "",
    ak = (t = !1) => ({
      get(e, r) {
        return (!t || r === "config") &&
          typeof e[r] == "object" &&
          e[r] !== null
          ? new Proxy(e[r], ak())
          : e[r];
      },
      set(e, r, i) {
        return (e[r] = i), (!t || r === "config") && Jc(!0), !0;
      },
    });
  window[Ia] = new Proxy(
    {
      config: {},
      defaultTheme: vB.default,
      defaultConfig: bB.default,
      colors: xB.default,
      plugin: kB.default,
      resolveConfig: SB.default,
    },
    ak(!0)
  );
  function ok(t) {
    Qc.observe(t, {
      attributes: !0,
      attributeFilter: ["type"],
      characterData: !0,
      subtree: !0,
      childList: !0,
    });
  }
  new MutationObserver(async (t) => {
    let e = !1;
    if (!Qc) {
      Qc = new MutationObserver(async () => await Jc(!0));
      for (let r of document.querySelectorAll(`style[type="${Hc}"]`)) ok(r);
    }
    for (let r of t)
      for (let i of r.addedNodes)
        i.nodeType === 1 &&
          i.tagName === "STYLE" &&
          i.getAttribute("type") === Hc &&
          (ok(i), (e = !0));
    await Jc(e);
  }).observe(document.documentElement, {
    attributes: !0,
    attributeFilter: ["class"],
    childList: !0,
    subtree: !0,
  });
  async function Jc(t = !1) {
    t && (nk++, Yc.clear());
    let e = "";
    for (let i of document.querySelectorAll(`style[type="${Hc}"]`))
      e += i.textContent;
    let r = new Set();
    for (let i of document.querySelectorAll("[class]"))
      for (let n of i.classList) Yc.has(n) || r.add(n);
    if (
      document.body &&
      (ik || r.size > 0 || e !== sk || !sr || !sr.isConnected)
    ) {
      for (let n of r) Yc.add(n);
      (ik = !1), (sk = e), (self[rk] = Array.from(r).join(" "));
      let { css: i } = await (0, gB.default)([
        (0, mB.default)({
          ...window[Ia].config,
          _hash: nk,
          content: { files: [rk], extract: { html: (n) => n.split(" ") } },
          plugins: [
            ...wB.default,
            ...(Array.isArray(window[Ia].config.plugins)
              ? window[Ia].config.plugins
              : []),
          ],
        }),
        (0, yB.default)({ remove: !1 }),
      ]).process(
        `@tailwind base;@tailwind components;@tailwind utilities;${e}`
      );
      (!sr || !sr.isConnected) &&
        ((sr = document.createElement("style")), document.head.append(sr)),
        (sr.textContent = i);
    }
  }
})();
/*! https://mths.be/cssesc v3.0.0 by @mathias */
