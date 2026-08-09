import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Search,
  Star,
  Sun,
  Moon,
  X,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Static reference data                                              */
/* ------------------------------------------------------------------ */

// currency code -> { name, country } — country drives the flag emoji.
// "XX" codes (supranational / basket currencies) fall back to a generic glyph.
const CURRENCY_META = {
  USD: { name: "US Dollar", c: "US" },
  EUR: { name: "Euro", c: "EU" },
  GBP: { name: "British Pound", c: "GB" },
  JPY: { name: "Japanese Yen", c: "JP" },
  CHF: { name: "Swiss Franc", c: "CH" },
  CAD: { name: "Canadian Dollar", c: "CA" },
  AUD: { name: "Australian Dollar", c: "AU" },
  NZD: { name: "New Zealand Dollar", c: "NZ" },
  CNY: { name: "Chinese Yuan", c: "CN" },
  HKD: { name: "Hong Kong Dollar", c: "HK" },
  SGD: { name: "Singapore Dollar", c: "SG" },
  INR: { name: "Indian Rupee", c: "IN" },
  KRW: { name: "South Korean Won", c: "KR" },
  MXN: { name: "Mexican Peso", c: "MX" },
  BRL: { name: "Brazilian Real", c: "BR" },
  ZAR: { name: "South African Rand", c: "ZA" },
  RUB: { name: "Russian Ruble", c: "RU" },
  TRY: { name: "Turkish Lira", c: "TR" },
  SEK: { name: "Swedish Krona", c: "SE" },
  NOK: { name: "Norwegian Krone", c: "NO" },
  DKK: { name: "Danish Krone", c: "DK" },
  PLN: { name: "Polish Zloty", c: "PL" },
  THB: { name: "Thai Baht", c: "TH" },
  IDR: { name: "Indonesian Rupiah", c: "ID" },
  MYR: { name: "Malaysian Ringgit", c: "MY" },
  PHP: { name: "Philippine Peso", c: "PH" },
  VND: { name: "Vietnamese Dong", c: "VN" },
  AED: { name: "UAE Dirham", c: "AE" },
  SAR: { name: "Saudi Riyal", c: "SA" },
  ILS: { name: "Israeli Shekel", c: "IL" },
  EGP: { name: "Egyptian Pound", c: "EG" },
  NGN: { name: "Nigerian Naira", c: "NG" },
  KES: { name: "Kenyan Shilling", c: "KE" },
  GHS: { name: "Ghanaian Cedi", c: "GH" },
  PKR: { name: "Pakistani Rupee", c: "PK" },
  BDT: { name: "Bangladeshi Taka", c: "BD" },
  LKR: { name: "Sri Lankan Rupee", c: "LK" },
  UAH: { name: "Ukrainian Hryvnia", c: "UA" },
  CZK: { name: "Czech Koruna", c: "CZ" },
  HUF: { name: "Hungarian Forint", c: "HU" },
  RON: { name: "Romanian Leu", c: "RO" },
  BGN: { name: "Bulgarian Lev", c: "BG" },
  ISK: { name: "Icelandic Krona", c: "IS" },
  CLP: { name: "Chilean Peso", c: "CL" },
  COP: { name: "Colombian Peso", c: "CO" },
  PEN: { name: "Peruvian Sol", c: "PE" },
  ARS: { name: "Argentine Peso", c: "AR" },
  UYU: { name: "Uruguayan Peso", c: "UY" },
  BOB: { name: "Bolivian Boliviano", c: "BO" },
  PYG: { name: "Paraguayan Guarani", c: "PY" },
  DOP: { name: "Dominican Peso", c: "DO" },
  JMD: { name: "Jamaican Dollar", c: "JM" },
  TTD: { name: "Trinidad & Tobago Dollar", c: "TT" },
  QAR: { name: "Qatari Riyal", c: "QA" },
  KWD: { name: "Kuwaiti Dinar", c: "KW" },
  BHD: { name: "Bahraini Dinar", c: "BH" },
  OMR: { name: "Omani Rial", c: "OM" },
  JOD: { name: "Jordanian Dinar", c: "JO" },
  LBP: { name: "Lebanese Pound", c: "LB" },
  IQD: { name: "Iraqi Dinar", c: "IQ" },
  IRR: { name: "Iranian Rial", c: "IR" },
  AFN: { name: "Afghan Afghani", c: "AF" },
  NPR: { name: "Nepalese Rupee", c: "NP" },
  MMK: { name: "Myanmar Kyat", c: "MM" },
  KHR: { name: "Cambodian Riel", c: "KH" },
  LAK: { name: "Lao Kip", c: "LA" },
  MOP: { name: "Macanese Pataca", c: "MO" },
  TWD: { name: "New Taiwan Dollar", c: "TW" },
  MAD: { name: "Moroccan Dirham", c: "MA" },
  DZD: { name: "Algerian Dinar", c: "DZ" },
  TND: { name: "Tunisian Dinar", c: "TN" },
  LYD: { name: "Libyan Dinar", c: "LY" },
  ETB: { name: "Ethiopian Birr", c: "ET" },
  UGX: { name: "Ugandan Shilling", c: "UG" },
  TZS: { name: "Tanzanian Shilling", c: "TZ" },
  ZMW: { name: "Zambian Kwacha", c: "ZM" },
  MZN: { name: "Mozambican Metical", c: "MZ" },
  FJD: { name: "Fijian Dollar", c: "FJ" },
  PGK: { name: "Papua New Guinean Kina", c: "PG" },
  WST: { name: "Samoan Tala", c: "WS" },
  TOP: { name: "Tongan Pa'anga", c: "TO" },
  VUV: { name: "Vanuatu Vatu", c: "VU" },
  SBD: { name: "Solomon Islands Dollar", c: "SB" },
  KZT: { name: "Kazakhstani Tenge", c: "KZ" },
  UZS: { name: "Uzbekistani Som", c: "UZ" },
  TJS: { name: "Tajikistani Somoni", c: "TJ" },
  KGS: { name: "Kyrgystani Som", c: "KG" },
  TMT: { name: "Turkmenistani Manat", c: "TM" },
  GEL: { name: "Georgian Lari", c: "GE" },
  AMD: { name: "Armenian Dram", c: "AM" },
  AZN: { name: "Azerbaijani Manat", c: "AZ" },
  BYN: { name: "Belarusian Ruble", c: "BY" },
  MDL: { name: "Moldovan Leu", c: "MD" },
  ALL: { name: "Albanian Lek", c: "AL" },
  MKD: { name: "Macedonian Denar", c: "MK" },
  RSD: { name: "Serbian Dinar", c: "RS" },
  BAM: { name: "Bosnia-Herzegovina Mark", c: "BA" },
  XOF: { name: "West African CFA Franc", c: "XX" },
  XAF: { name: "Central African CFA Franc", c: "XX" },
  XCD: { name: "East Caribbean Dollar", c: "XX" },
  BND: { name: "Brunei Dollar", c: "BN" },
  MVR: { name: "Maldivian Rufiyaa", c: "MV" },
  BTN: { name: "Bhutanese Ngultrum", c: "BT" },
  MUR: { name: "Mauritian Rupee", c: "MU" },
  SCR: { name: "Seychellois Rupee", c: "SC" },
  NAD: { name: "Namibian Dollar", c: "NA" },
  BWP: { name: "Botswana Pula", c: "BW" },
  MWK: { name: "Malawian Kwacha", c: "MW" },
  RWF: { name: "Rwandan Franc", c: "RW" },
  XPF: { name: "CFP Franc", c: "XX" },
  HTG: { name: "Haitian Gourde", c: "HT" },
  HNL: { name: "Honduran Lempira", c: "HN" },
  GTQ: { name: "Guatemalan Quetzal", c: "GT" },
  NIO: { name: "Nicaraguan Cordoba", c: "NI" },
  CRC: { name: "Costa Rican Colon", c: "CR" },
  PAB: { name: "Panamanian Balboa", c: "PA" },
  BZD: { name: "Belize Dollar", c: "BZ" },
  BSD: { name: "Bahamian Dollar", c: "BS" },
  BBD: { name: "Barbadian Dollar", c: "BB" },
  KYD: { name: "Cayman Islands Dollar", c: "KY" },
  GYD: { name: "Guyanese Dollar", c: "GY" },
  SRD: { name: "Surinamese Dollar", c: "SR" },
  YER: { name: "Yemeni Rial", c: "YE" },
  SYP: { name: "Syrian Pound", c: "SY" },
  SDG: { name: "Sudanese Pound", c: "SD" },
  SOS: { name: "Somali Shilling", c: "SO" },
  MGA: { name: "Malagasy Ariary", c: "MG" },
  DJF: { name: "Djiboutian Franc", c: "DJ" },
  CDF: { name: "Congolese Franc", c: "CD" },
  AOA: { name: "Angolan Kwanza", c: "AO" },
  XDR: { name: "IMF Special Drawing Rights", c: "XX" },
};

const FALLBACK_FLAG = "\u{1F4B1}"; // currency exchange glyph

function countryToFlag(cc) {
  if (!cc || cc === "XX") return FALLBACK_FLAG;
  const codePoints = cc
    .toUpperCase()
    .split("")
    .map((ch) => 127397 + ch.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function currencyLabel(code) {
  return CURRENCY_META[code]?.name || code;
}

function currencyFlag(code) {
  return countryToFlag(CURRENCY_META[code]?.c);
}

const FIAT_API = "https://open.er-api.com/v6/latest/USD";
const CRYPTO_API =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h";

const POLL_MS = 60000;
const MAX_HISTORY = 60;
const STORAGE_KEY = "favorites";

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */

function formatNumber(n, opts = {}) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const abs = Math.abs(n);
  const maximumFractionDigits =
    opts.maximumFractionDigits ?? (abs >= 100 ? 2 : abs >= 1 ? 4 : 6);
  return n.toLocaleString(undefined, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  });
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/*  Error boundary                                                     */
/* ------------------------------------------------------------------ */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("CurrencyTracker crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen w-full flex items-center justify-center p-6"
          style={{ background: "#0E1116", color: "#E8EAED" }}
        >
          <div className="max-w-md w-full text-center space-y-4">
            <AlertCircle className="mx-auto" size={40} style={{ color: "#F87171" }} />
            <h1 className="text-lg font-semibold">Something broke on the board</h1>
            <p className="text-sm" style={{ color: "#8B95A1" }}>
              The tracker hit an unexpected error and stopped rendering. Reloading
              usually clears it.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 rounded-md text-sm font-medium"
              style={{ background: "#FFB020", color: "#12151A" }}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ------------------------------------------------------------------ */
/*  Theme                                                               */
/* ------------------------------------------------------------------ */

const THEMES = {
  dark: {
    bg: "#0E1116",
    bgElevated: "#161B22",
    bgInset: "#1C222B",
    border: "#262B33",
    borderStrong: "#333A45",
    textPrimary: "#E8EAED",
    textSecondary: "#8B95A1",
    textMuted: "#5B6470",
    accent: "#FFB020",
    accentText: "#12151A",
    positive: "#34D399",
    negative: "#F87171",
  },
  light: {
    bg: "#EEF1F0",
    bgElevated: "#FFFFFF",
    bgInset: "#F5F6F5",
    border: "#DADFDD",
    borderStrong: "#C2C9C6",
    textPrimary: "#12151A",
    textSecondary: "#5B6470",
    textMuted: "#8B95A1",
    accent: "#B36A00",
    accentText: "#FFFFFF",
    positive: "#0D8F5F",
    negative: "#C93B3B",
  },
};

function useCssVars(mode) {
  const t = THEMES[mode];
  return {
    "--bg": t.bg,
    "--bg-elevated": t.bgElevated,
    "--bg-inset": t.bgInset,
    "--border": t.border,
    "--border-strong": t.borderStrong,
    "--text-primary": t.textPrimary,
    "--text-secondary": t.textSecondary,
    "--text-muted": t.textMuted,
    "--accent": t.accent,
    "--accent-text": t.accentText,
    "--positive": t.positive,
    "--negative": t.negative,
    "--font-display":
      "'Space Grotesk', 'Arial Narrow', 'Helvetica Neue', sans-serif",
    "--font-mono":
      "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  };
}

/* ------------------------------------------------------------------ */
/*  Persistent favorites (Artifact key/value storage, not localStorage) */
/* ------------------------------------------------------------------ */

function useFavorites() {
  const [favorites, setFavorites] = useState(() => new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (window.storage) {
          const res = await window.storage.get(STORAGE_KEY, false);
          if (!cancelled && res?.value) {
            const arr = JSON.parse(res.value);
            setFavorites(new Set(arr));
          }
        }
      } catch (e) {
        // key doesn't exist yet on first run — that's fine
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (nextSet) => {
    try {
      if (window.storage) {
        await window.storage.set(STORAGE_KEY, JSON.stringify([...nextSet]), false);
      }
    } catch (e) {
      console.warn("Could not persist favorites:", e);
    }
  }, []);

  const toggleFavorite = useCallback(
    (id) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  return { favorites, toggleFavorite, ready };
}

/* ------------------------------------------------------------------ */
/*  Data hooks — fiat + crypto polling                                 */
/* ------------------------------------------------------------------ */

function useFiatData() {
  const [rates, setRates] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [errorMsg, setErrorMsg] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const historyRef = useRef({}); // code -> [{t, v}]
  const [historyTick, setHistoryTick] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch(FIAT_API);
      if (!res.ok) throw new Error(`Fiat API responded with ${res.status}`);
      const data = await res.json();
      if (data.result !== "success" || !data.rates) {
        throw new Error("Fiat API returned an unexpected payload");
      }
      const t = Date.now();
      Object.entries(data.rates).forEach(([code, v]) => {
        const arr = historyRef.current[code] || [];
        arr.push({ t, v });
        if (arr.length > MAX_HISTORY) arr.shift();
        historyRef.current[code] = arr;
      });
      setRates(data.rates);
      setLastUpdated(t);
      setStatus("ok");
      setErrorMsg("");
      setHistoryTick((n) => n + 1);
    } catch (e) {
      setStatus("error");
      setErrorMsg(e.message || "Could not reach the exchange rate service");
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  return { rates, status, errorMsg, lastUpdated, historyRef, historyTick, reload: load };
}

function useCryptoData() {
  const [coins, setCoins] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(CRYPTO_API);
      if (!res.ok) throw new Error(`Crypto API responded with ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Crypto API returned an unexpected payload");
      setCoins(data);
      setLastUpdated(Date.now());
      setStatus("ok");
      setErrorMsg("");
    } catch (e) {
      setStatus("error");
      setErrorMsg(e.message || "Could not reach the crypto market service");
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  return { coins, status, errorMsg, lastUpdated, reload: load };
}

/* ------------------------------------------------------------------ */
/*  Presentational bits                                                */
/* ------------------------------------------------------------------ */

function ChangeBadge({ pct }) {
  if (pct === null || pct === undefined || Number.isNaN(pct)) {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded"
        style={{ color: "var(--text-muted)" }}
      >
        <Minus size={11} /> —
      </span>
    );
  }
  const positive = pct > 0;
  const flat = Math.abs(pct) < 0.005;
  const color = flat ? "var(--text-muted)" : positive ? "var(--positive)" : "var(--negative)";
  const Icon = flat ? Minus : positive ? TrendingUp : TrendingDown;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color, fontFamily: "var(--font-mono)" }}>
      <Icon size={12} />
      {flat ? "0.00%" : `${positive ? "+" : ""}${pct.toFixed(2)}%`}
    </span>
  );
}

function Sparkline({ points, color }) {
  if (!points || points.length < 2) {
    return <div className="w-20 h-8" />;
  }
  const w = 84;
  const h = 32;
  const vals = points.map((p) => p.v ?? p);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const step = w / (vals.length - 1);
  const d = vals
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(h - ((v - min) / range) * h).toFixed(1)}`)
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TickerHero({ inrRate, status, lastUpdated, onRefresh }) {
  return (
    <div
      className="w-full border-b px-4 py-5 sm:px-6"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div
            className="text-[11px] uppercase tracking-widest font-semibold mb-1"
            style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
          >
            Live board · USD → INR
          </div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span
              key={inrRate ?? "loading"}
              className="text-4xl sm:text-5xl font-bold tabular-nums"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--text-primary)",
                animation: "flapIn 320ms ease-out",
              }}
            >
              {inrRate ? formatNumber(inrRate, { maximumFractionDigits: 3 }) : "----.--"}
            </span>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              INR per 1 USD
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-right" style={{ color: "var(--text-muted)" }}>
            {status === "ok" && lastUpdated && <>Updated {formatTime(lastUpdated)}</>}
            {status === "loading" && <>Fetching rates…</>}
            {status === "error" && <span style={{ color: "var(--negative)" }}>Fiat feed offline</span>}
          </div>
          <button
            onClick={onRefresh}
            className="p-2 rounded-md border transition-transform active:scale-95"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-secondary)" }}
            aria-label="Refresh rates"
          >
            <RefreshCw size={16} className={status === "loading" ? "animate-spin" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CurrencyRow({ item, isFavorite, onToggleFavorite, onSelect }) {
  const positive = item.changePct > 0;
  const color =
    item.changePct === null || item.changePct === undefined || Math.abs(item.changePct) < 0.005
      ? "var(--text-muted)"
      : positive
      ? "var(--positive)"
      : "var(--negative)";
  return (
    <button
      onClick={() => onSelect(item)}
      className="w-full flex items-center gap-3 px-3 py-3 sm:px-4 border-b text-left transition-colors hover:bg-opacity-60"
      style={{ borderColor: "var(--border)" }}
    >
      <span className="text-xl w-7 text-center shrink-0" aria-hidden="true">
        {item.flag}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className="font-semibold text-sm tracking-wide"
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}
          >
            {item.code}
          </span>
          <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
            {item.name}
          </span>
        </div>
      </div>
      <Sparkline points={item.sparkline} color={color} />
      <div className="text-right w-24 shrink-0">
        <div
          className="text-sm font-semibold tabular-nums"
          style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}
        >
          {item.priceLabel}
        </div>
        <ChangeBadge pct={item.changePct} />
      </div>
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(item.id);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }
        }}
        aria-label={isFavorite ? `Remove ${item.code} from favorites` : `Add ${item.code} to favorites`}
        className="shrink-0 p-1"
      >
        <Star
          size={18}
          fill={isFavorite ? "var(--accent)" : "none"}
          color={isFavorite ? "var(--accent)" : "var(--text-muted)"}
        />
      </span>
    </button>
  );
}

function DetailPanel({ item, onClose, history }) {
  const chartData = useMemo(() => {
    if (!history || history.length === 0) return [];
    return history.map((p) => ({
      t: p.t,
      label:
        history.length > 40
          ? new Date(p.t).toLocaleDateString(undefined, { month: "short", day: "numeric" })
          : formatTime(p.t),
      v: p.v,
    }));
  }, [history]);

  const t = useMemo(() => THEMES, []);

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name} details`}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.45)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full sm:w-[420px] h-full overflow-y-auto border-l"
        style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
      >
        <div
          className="sticky top-0 flex items-center gap-3 px-4 py-4 border-b"
          style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
        >
          <button onClick={onClose} className="sm:hidden p-1" aria-label="Back">
            <ArrowLeft size={18} style={{ color: "var(--text-secondary)" }} />
          </button>
          <span className="text-2xl" aria-hidden="true">
            {item.flag}
          </span>
          <div className="min-w-0 flex-1">
            <div
              className="font-semibold text-sm"
              style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}
            >
              {item.code}
            </div>
            <div className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
              {item.name}
            </div>
          </div>
          <button onClick={onClose} className="hidden sm:block p-1" aria-label="Close">
            <X size={18} style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>

        <div className="px-4 py-5 space-y-5">
          <div>
            <div
              className="text-2xl font-bold tabular-nums"
              style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}
            >
              {item.priceLabel}
            </div>
            <div className="mt-1">
              <ChangeBadge pct={item.changePct} />
              <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
                {item.type === "crypto" ? "24h" : "since app opened"}
              </span>
            </div>
          </div>

          <div className="h-56 -mx-2">
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 6, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                    minTickGap={30}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-inset)",
                      border: `1px solid var(--border)`,
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "var(--text-secondary)" }}
                    formatter={(v) => [formatNumber(v, { maximumFractionDigits: 6 }), item.code]}
                  />
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div
                className="h-full flex items-center justify-center text-center text-xs px-6"
                style={{ color: "var(--text-muted)" }}
              >
                Building trend data as the app keeps polling live rates. Check back in a
                minute or two.
              </div>
            )}
          </div>

          {item.type === "crypto" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-md border" style={{ borderColor: "var(--border)" }}>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Market cap
                </div>
                <div
                  className="text-sm font-semibold tabular-nums mt-0.5"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}
                >
                  ${formatNumber(item.marketCap, { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div className="p-3 rounded-md border" style={{ borderColor: "var(--border)" }}>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Symbol
                </div>
                <div
                  className="text-sm font-semibold uppercase mt-0.5"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}
                >
                  {item.symbol}
                </div>
              </div>
            </div>
          )}

          {item.type === "fiat" && (
            <div className="p-3 rounded-md border text-xs leading-relaxed" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
              Rate is quoted against 1 USD, refreshed automatically about once a minute.
              The chart above accumulates from live polling since this session started —
              free rate feeds don't expose deep history without a paid key.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div
      className="max-w-6xl mx-auto mx-4 sm:mx-auto mt-3 flex items-center gap-3 px-3 py-2.5 rounded-md border text-sm"
      style={{ borderColor: "var(--negative)", color: "var(--negative)", background: "var(--bg-inset)" }}
    >
      <AlertCircle size={16} className="shrink-0" />
      <span className="flex-1">{message}</span>
      <button
        onClick={onRetry}
        className="text-xs font-semibold underline underline-offset-2 shrink-0"
      >
        Retry
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main app                                                            */
/* ------------------------------------------------------------------ */

const COMMON_FIAT = [
  "USD","INR","EUR","GBP","JPY","AUD","CAD","CHF","CNY","HKD","SGD","NZD","SEK","NOK","DKK",
  "KRW","MXN","BRL","ZAR","RUB","TRY","PLN","THB","IDR","MYR","PHP","VND","AED","SAR","ILS",
];

function AppInner() {
  const [mode, setMode] = useState("dark");
  const cssVars = useCssVars(mode);

  const [tab, setTab] = useState("fiat"); // fiat | crypto | favorites
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null); // unified item

  const { rates, status: fiatStatus, errorMsg: fiatError, lastUpdated: fiatUpdated, historyRef, historyTick, reload: reloadFiat } = useFiatData();
  const { coins, status: cryptoStatus, errorMsg: cryptoError, reload: reloadCrypto } = useCryptoData();
  const { favorites, toggleFavorite, ready: favReady } = useFavorites();

  // Build unified fiat list
  const fiatItems = useMemo(() => {
    if (!rates) return [];
    const codes = Object.keys(rates);
    return codes.map((code) => {
      const rate = rates[code];
      const hist = historyRef.current[code] || [];
      const first = hist[0]?.v;
      const changePct = first && first !== 0 ? ((rate - first) / first) * 100 : null;
      return {
        id: `fiat:${code}`,
        type: "fiat",
        code,
        name: currencyLabel(code),
        flag: currencyFlag(code),
        rawValue: rate,
        priceLabel: `${formatNumber(rate)} ₹?`.replace(" ₹?", ""), // placeholder replaced below
        changePct,
        sparkline: hist,
        common: COMMON_FIAT.includes(code),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rates, historyTick]);

  // fix priceLabel properly (avoid awkward template above)
  const fiatItemsFinal = useMemo(
    () =>
      fiatItems.map((it) => ({
        ...it,
        priceLabel: `${formatNumber(it.rawValue)} USD⁻¹`,
      })),
    [fiatItems]
  );

  const cryptoItems = useMemo(() => {
    if (!coins) return [];
    return coins.map((c) => ({
      id: `crypto:${c.id}`,
      type: "crypto",
      code: c.symbol.toUpperCase(),
      symbol: c.symbol.toUpperCase(),
      name: c.name,
      flag: "◎",
      rawValue: c.current_price,
      priceLabel: `$${formatNumber(c.current_price)}`,
      changePct: c.price_change_percentage_24h,
      marketCap: c.market_cap,
      sparkline: (c.sparkline_in_7d?.price || []).map((v, i) => ({ t: i, v })),
    }));
  }, [coins]);

  const allItems = useMemo(() => [...fiatItemsFinal, ...cryptoItems], [fiatItemsFinal, cryptoItems]);

  const activeList = useMemo(() => {
    let list;
    if (tab === "fiat") list = fiatItemsFinal;
    else if (tab === "crypto") list = cryptoItems;
    else list = allItems.filter((it) => favorites.has(it.id));

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (it) => it.code.toLowerCase().includes(q) || it.name.toLowerCase().includes(q)
      );
    }

    if (tab === "fiat" && !query.trim()) {
      list = [...list].sort((a, b) => {
        if (a.common !== b.common) return a.common ? -1 : 1;
        return a.code.localeCompare(b.code);
      });
    }
    return list;
  }, [tab, query, fiatItemsFinal, cryptoItems, allItems, favorites]);

  const selectedLive = useMemo(() => {
    if (!selected) return null;
    return allItems.find((it) => it.id === selected.id) || selected;
  }, [selected, allItems]);

  const selectedHistory = useMemo(() => {
    if (!selectedLive) return [];
    if (selectedLive.type === "fiat") {
      return historyRef.current[selectedLive.code] || [];
    }
    return selectedLive.sparkline || [];
  }, [selectedLive, historyTick]);

  const inrRate = rates?.INR ?? null;

  const isLoadingFirstFiat = fiatStatus === "loading" && !rates;
  const isLoadingFirstCrypto = cryptoStatus === "loading" && !coins;

  return (
    <div
      className="min-h-screen w-full"
      style={{ ...cssVars, background: "var(--bg)", color: "var(--text-primary)", fontFamily: "var(--font-body, system-ui, sans-serif)" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes flapIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .ct-tab { transition: color 150ms ease, border-color 150ms ease; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 4px; }
      `}</style>

      <TickerHero
        inrRate={inrRate}
        status={fiatStatus}
        lastUpdated={fiatUpdated}
        onRefresh={() => {
          reloadFiat();
          reloadCrypto();
        }}
      />

      {fiatStatus === "error" && <ErrorBanner message={`Fiat rates: ${fiatError}`} onRetry={reloadFiat} />}
      {cryptoStatus === "error" && <ErrorBanner message={`Crypto prices: ${cryptoError}`} onRetry={reloadCrypto} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        {/* Controls row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
          <div className="flex gap-1 p-1 rounded-md border w-full sm:w-auto" style={{ borderColor: "var(--border)", background: "var(--bg-inset)" }}>
            {[
              { id: "fiat", label: "Fiat" },
              { id: "crypto", label: "Crypto" },
              { id: "favorites", label: `Favorites (${favorites.size})` },
            ].map((tItem) => (
              <button
                key={tItem.id}
                onClick={() => setTab(tItem.id)}
                className="ct-tab flex-1 sm:flex-none px-3 py-1.5 rounded text-xs font-semibold"
                style={{
                  background: tab === tItem.id ? "var(--accent)" : "transparent",
                  color: tab === tItem.id ? "var(--accent-text)" : "var(--text-secondary)",
                }}
              >
                {tItem.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by code or name…"
              className="w-full pl-9 pr-9 py-2 rounded-md border text-sm outline-none"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-inset)",
                color: "var(--text-primary)",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label="Clear search"
              >
                <X size={14} style={{ color: "var(--text-muted)" }} />
              </button>
            )}
          </div>

          <button
            onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
            className="p-2 rounded-md border shrink-0"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            aria-label="Toggle dark and light mode"
          >
            {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
          {activeList.length} {activeList.length === 1 ? "result" : "results"}
          {!favReady && tab === "favorites" ? " · loading saved favorites…" : ""}
        </div>
      </div>

      {/* List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-md border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
          {tab === "fiat" && isLoadingFirstFiat && <ListSkeleton />}
          {tab === "crypto" && isLoadingFirstCrypto && <ListSkeleton />}

          {tab === "favorites" && activeList.length === 0 && favReady && (
            <div className="p-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>
              No favorites yet. Tap the star on any currency to pin it here.
            </div>
          )}

          {((tab !== "fiat" && tab !== "crypto") || (!isLoadingFirstFiat && tab === "fiat") || (!isLoadingFirstCrypto && tab === "crypto")) &&
            activeList.length === 0 &&
            tab !== "favorites" && (
              <div className="p-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                No matches for "{query}".
              </div>
            )}

          {activeList.map((item) => (
            <CurrencyRow
              key={item.id}
              item={item}
              isFavorite={favorites.has(item.id)}
              onToggleFavorite={toggleFavorite}
              onSelect={setSelected}
            />
          ))}
        </div>

        <p className="text-[11px] mt-4 text-center" style={{ color: "var(--text-muted)" }}>
          Fiat rates via open.er-api.com · crypto prices via CoinGecko · refreshes every 60s ·
          all state lives in your browser session
        </p>
      </div>

      {selectedLive && (
        <DetailPanel item={selectedLive} onClose={() => setSelected(null)} history={selectedHistory} />
      )}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="w-7 h-7 rounded-full animate-pulse" style={{ background: "var(--bg-inset)" }} />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-16 rounded animate-pulse" style={{ background: "var(--bg-inset)" }} />
            <div className="h-2.5 w-28 rounded animate-pulse" style={{ background: "var(--bg-inset)" }} />
          </div>
          <div className="h-8 w-20 rounded animate-pulse" style={{ background: "var(--bg-inset)" }} />
        </div>
      ))}
    </div>
  );
}

export default function CurrencyTracker() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
