import { useState, useEffect, useRef, useCallback } from 'react'

const BASE_CURRENCIES = [
  // Major
  'USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY', 'INR', 'BRL',
  // Asia-Pacific
  'MXN', 'SGD', 'HKD', 'KRW', 'TWD', 'THB', 'MYR', 'IDR', 'PHP', 'VND', 'BDT', 'PKR', 'LKR', 'NPR', 'MMK', 'KHR', 'MNT',
  // Europe
  'NOK', 'SEK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RSD', 'ISK', 'UAH', 'GEL', 'AMD', 'AZN', 'BYN', 'MDL', 'MKD', 'BAM', 'ALL',
  // Middle East & Africa
  'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'ILS', 'EGP', 'MAD', 'TND', 'DZD', 'LYD', 'NGN', 'GHS', 'KES', 'TZS', 'UGX', 'ETB', 'ZMW', 'BWP', 'MUR', 'MZN', 'AOA', 'XOF', 'XAF',
  // Americas
  'ARS', 'CLP', 'COP', 'PEN', 'UYU', 'PYG', 'BOB', 'VES', 'GTQ', 'HNL', 'DOP', 'TTD', 'JMD', 'BBD', 'BSD', 'HTG', 'CRC', 'NIO', 'PAB',
  // Central Asia & Other
  'NZD', 'ZAR', 'TRY', 'KZT', 'UZS', 'TJS', 'KGS', 'AFN', 'IRR', 'IQD', 'SYP', 'LBP', 'YER', 'MVR', 'BTN'
]

const FLAG = {
  USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵', CHF: '🇨🇭', CAD: '🇨🇦', AUD: '🇦🇺', CNY: '🇨🇳', INR: '🇮🇳', BRL: '🇧🇷',
  MXN: '🇲🇽', SGD: '🇸🇬', HKD: '🇭🇰', KRW: '🇰🇷', TWD: '🇹🇼', THB: '🇹🇭', MYR: '🇲🇾', IDR: '🇮🇩', PHP: '🇵🇭', VND: '🇻🇳',
  BDT: '🇧🇩', PKR: '🇵🇰', LKR: '🇱🇰', NPR: '🇳🇵', MMK: '🇲🇲', KHR: '🇰🇭', MNT: '🇲🇳',
  NOK: '🇳🇴', SEK: '🇸🇪', DKK: '🇩🇰', PLN: '🇵🇱', CZK: '🇨🇿', HUF: '🇭🇺', RON: '🇷🇴', BGN: '🇧🇬', HRK: '🇭🇷', RSD: '🇷🇸',
  ISK: '🇮🇸', UAH: '🇺🇦', GEL: '🇬🇪', AMD: '🇦🇲', AZN: '🇦🇿', BYN: '🇧🇾', MDL: '🇲🇩', MKD: '🇲🇰', BAM: '🇧🇦', ALL: '🇦🇱',
  AED: '🇦🇪', SAR: '🇸🇦', QAR: '🇶🇦', KWD: '🇰🇼', BHD: '🇧🇭', OMR: '🇴🇲', JOD: '🇯🇴', ILS: '🇮🇱', EGP: '🇪🇬', MAD: '🇲🇦',
  TND: '🇹🇳', DZD: '🇩🇿', LYD: '🇱🇾', NGN: '🇳🇬', GHS: '🇬🇭', KES: '🇰🇪', TZS: '🇹🇿', UGX: '🇺🇬', ETB: '🇪🇹', ZMW: '🇿🇲',
  BWP: '🇧🇼', MUR: '🇲🇺', MZN: '🇲🇿', AOA: '🇦🇴', XOF: '🌍', XAF: '🌍',
  ARS: '🇦🇷', CLP: '🇨🇱', COP: '🇨🇴', PEN: '🇵🇪', UYU: '🇺🇾', PYG: '🇵🇾', BOB: '🇧🇴', VES: '🇻🇪', GTQ: '🇬🇹', HNL: '🇭🇳',
  DOP: '🇩🇴', TTD: '🇹🇹', JMD: '🇯🇲', BBD: '🇧🇧', BSD: '🇧🇸', HTG: '🇭🇹', CRC: '🇨🇷', NIO: '🇳🇮', PAB: '🇵🇦',
  NZD: '🇳🇿', ZAR: '🇿🇦', TRY: '🇹🇷', KZT: '🇰🇿', UZS: '🇺🇿', TJS: '🇹🇯', KGS: '🇰🇬', AFN: '🇦🇫', IRR: '🇮🇷', IQD: '🇮🇶',
  SYP: '🇸🇾', LBP: '🇱🇧', YER: '🇾🇪', MVR: '🇲🇻', BTN: '🇧🇹'
}

const CURRENCY_NAMES = {
  USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', JPY: 'Japanese Yen', CHF: 'Swiss Franc', CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar', CNY: 'Chinese Yuan', INR: 'Indian Rupee', BRL: 'Brazilian Real',
  MXN: 'Mexican Peso', SGD: 'Singapore Dollar', HKD: 'Hong Kong Dollar', KRW: 'South Korean Won', TWD: 'Taiwan Dollar',
  THB: 'Thai Baht', MYR: 'Malaysian Ringgit', IDR: 'Indonesian Rupiah', PHP: 'Philippine Peso', VND: 'Vietnamese Dong',
  BDT: 'Bangladeshi Taka', PKR: 'Pakistani Rupee', LKR: 'Sri Lankan Rupee', NPR: 'Nepalese Rupee', MMK: 'Myanmar Kyat',
  KHR: 'Cambodian Riel', MNT: 'Mongolian Tugrik',
  NOK: 'Norwegian Krone', SEK: 'Swedish Krona', DKK: 'Danish Krone', PLN: 'Polish Zloty', CZK: 'Czech Coruna',
  HUF: 'Hungarian Forint', RON: 'Romanian Leu', BGN: 'Bulgarian Lev', HRK: 'Croatian Kuna', RSD: 'Serbian Dinar',
  ISK: 'Icelandic Krona', UAH: 'Ukrainian Hryvnia', GEL: 'Georgian Lari', AMD: 'Armenian Dram', AZN: 'Azerbaijani Manat',
  BYN: 'Belarusian Ruble', MDL: 'Moldovan Leu', MKD: 'Macedonian Denar', BAM: 'Bosnian Mark', ALL: 'Albanian Lek',
  AED: 'UAE Dirham', SAR: 'Saudi Riyal', QAR: 'Qatari Riyal', KWD: 'Kuwaiti Dinar', BHD: 'Bahraini Dinar',
  OMR: 'Omani Rial', JOD: 'Jordanian Dinar', ILS: 'Israeli Shekel', EGP: 'Egyptian Pound', MAD: 'Moroccan Dirham',
  TND: 'Tunisian Dinar', DZD: 'Algerian Dinar', LYD: 'Libyan Dinar', NGN: 'Nigerian Naira', GHS: 'Ghanaian Cedi',
  KES: 'Kenyan Shilling', TZS: 'Tanzanian Shilling', UGX: 'Ugandan Shilling', ETB: 'Ethiopian Birr', ZMW: 'Zambian Kwacha',
  BWP: 'Botswana Pula', MUR: 'Mauritian Rupee', MZN: 'Mozambican Metical', AOA: 'Angolan Kwanza',
  XOF: 'West African CFA', XAF: 'Central African CFA',
  ARS: 'Argentine Peso', CLP: 'Chilean Peso', COP: 'Colombian Peso', PEN: 'Peruvian Sol', UYU: 'Uruguayan Peso',
  PYG: 'Paraguayan Guarani', BOB: 'Bolivian Boliviano', VES: 'Venezuelan Bolívar', GTQ: 'Guatemalan Quetzal',
  HNL: 'Honduran Lempira', DOP: 'Dominican Peso', TTD: 'Trinidad Dollar', JMD: 'Jamaican Dollar',
  BBD: 'Barbadian Dollar', BSD: 'Bahamian Dollar', HTG: 'Haitian Gourde', CRC: 'Costa Rican Colon',
  NIO: 'Nicaraguan Córdoba', PAB: 'Panamanian Balboa',
  NZD: 'New Zealand Dollar', ZAR: 'South African Rand', TRY: 'Turkish Lira', KZT: 'Kazakhstani Tenge',
  UZS: 'Uzbekistani Som', TJS: 'Tajikistani Somoni', KGS: 'Kyrgyzstani Som', AFN: 'Afghan Afghani',
  IRR: 'Iranian Rial', IQD: 'Iraqi Dinar', SYP: 'Syrian Pound', LBP: 'Lebanese Pound', YER: 'Yemeni Rial',
  MVR: 'Maldivian Rufiyaa', BTN: 'Bhutanese Ngultrum'
}

async function fetchRates(base) {
  const sources = [
    async () => {
      const r = await fetch(`https://open.er-api.com/v6/latest/${base}`)
      if (!r.ok) throw new Error('er-api failed')
      const d = await r.json()
      if (d.result !== 'success') throw new Error('er-api bad result')
      return d.rates
    },
    async () => {
      const r = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${BASE_CURRENCIES.filter(c => c !== base).join(',')}`)
      if (!r.ok) throw new Error('exchangerate.host failed')
      const d = await r.json()
      if (!d.success) throw new Error('exchangerate.host bad result')
      return d.rates
    },
    async () => {
      const r = await fetch(`https://api.frankfurter.app/latest?from=${base}`)
      if (!r.ok) throw new Error('frankfurter failed')
      const d = await r.json()
      return d.rates
    }
  ]

  let lastErr
  for (const src of sources) {
    try {
      const rates = await src()
      const filtered = {}
      for (const c of BASE_CURRENCIES) {
        if (c !== base && rates[c]) filtered[c] = rates[c]
      }
      if (Object.keys(filtered).length < 5) throw new Error('Too few currencies returned')
      return filtered
    } catch (e) {
      lastErr = e
    }
  }
  throw lastErr
}

function formatRate(rate, cur) {
  if (!rate) return '—'
  if (['JPY', 'KRW'].includes(cur)) return rate.toFixed(2)
  if (rate > 100) return rate.toFixed(2)
  if (rate > 1) return rate.toFixed(4)
  return rate.toFixed(6)
}

function useRates(base) {
  const [rates, setRates] = useState({})
  const [prevRates, setPrevRates] = useState({})
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('')

  const doFetch = useCallback(async () => {
    try {
      setError(null)
      const data = await fetchRates(base)
      setRates(prev => { setPrevRates(Object.keys(prev).length ? prev : data); return data })
      setLastUpdated(new Date())
      setSource('open.er-api.com')
    } catch (e) {
      setError('Could not reach any rate provider. Check your internet connection.')
      console.error('Rate fetch error:', e)
    } finally {
      setLoading(false)
    }
  }, [base])

  useEffect(() => {
    setLoading(true)
    setRates({})
    setPrevRates({})
    doFetch()
    const id = setInterval(doFetch, 60000)
    return () => clearInterval(id)
  }, [doFetch])

  return { rates, prevRates, lastUpdated, loading, error, source, refresh: doFetch }
}

function Ticker({ rates, prevRates, base }) {
  const pairs = Object.entries(rates).slice(0, 10)
  if (!pairs.length) return null
  return (
    <div style={{ overflow: 'hidden', borderBottom: '1px solid var(--border)', background: 'var(--bg-1)', height: 32 }}>
      <div style={{ display: 'flex', animation: 'marquee 50s linear infinite', width: 'max-content', height: '100%', alignItems: 'center' }}>
        {[...pairs, ...pairs].map(([cur, rate], i) => {
          const prev = prevRates[cur]
          const dir = prev ? (rate > prev ? 1 : rate < prev ? -1 : 0) : 0
          return (
            <span key={i} style={{
              padding: '0 18px', fontFamily: 'var(--font-mono)', fontSize: 11,
              color: dir === 1 ? 'var(--green)' : dir === -1 ? 'var(--red)' : 'var(--text-2)',
              borderRight: '1px solid var(--border)', whiteSpace: 'nowrap', letterSpacing: '0.04em'
            }}>
              {FLAG[cur]} {base}/{cur} {formatRate(rate, cur)}{dir === 1 ? ' ▲' : dir === -1 ? ' ▼' : ''}
            </span>
          )
        })}
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  )
}

function RateCard({ cur, rate, prevRate, base, selected, isPinned, onPinToggle, onClick, index }) {
  const dir = prevRate ? (rate > prevRate ? 1 : rate < prevRate ? -1 : 0) : 0
  const pct = prevRate ? ((rate - prevRate) / prevRate * 100) : 0

  return (
    <div
      onClick={onClick}
      style={{
        border: `1px solid ${selected ? 'var(--accent)' : dir === 1 ? 'rgba(0,255,136,0.25)' : dir === -1 ? 'rgba(255,51,85,0.25)' : 'var(--border)'}`,
        padding: '16px 18px', cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.3s',
        animation: `slideUp 0.35s ease-out ${Math.min(index * 0.025, 0.5)}s both`,
        position: 'relative',
        background: selected ? 'rgba(255,210,0,0.03)' : dir === 1 ? 'rgba(0,255,136,0.04)' : dir === -1 ? 'rgba(255,51,85,0.04)' : 'transparent',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = selected ? 'var(--accent)' : dir === 1 ? 'rgba(0,255,136,0.45)' : dir === -1 ? 'rgba(255,51,85,0.45)' : 'var(--border-bright)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = selected ? 'var(--accent)' : dir === 1 ? 'rgba(0,255,136,0.25)' : dir === -1 ? 'rgba(255,51,85,0.25)' : 'var(--border)'}
    >
      {selected && <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'var(--accent)' }} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{FLAG[cur] || '🏳️'}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, letterSpacing: '0.04em', color: dir === 1 ? 'var(--green)' : dir === -1 ? 'var(--red)' : 'var(--text)' }}>{cur}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPinToggle(cur);
                }}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, padding: '0 2px',
                  color: isPinned ? 'var(--accent)' : 'var(--text-3)', transition: 'color 0.15s, transform 0.1s'
                }}
                title={isPinned ? 'Unpin Currency' : 'Pin Currency'}
              >
                {isPinned ? '★' : '☆'}
              </button>
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', marginTop: 2 }}>{CURRENCY_NAMES[cur] || ''}</div>
          </div>
        </div>
        <div style={{
          fontSize: 9, fontFamily: 'var(--font-mono)', padding: '2px 6px',
          background: dir === 1 ? 'rgba(0,255,136,0.08)' : dir === -1 ? 'rgba(255,51,85,0.08)' : 'transparent',
          color: dir === 1 ? 'var(--green)' : dir === -1 ? 'var(--red)' : 'var(--text-3)',
          border: `1px solid ${dir === 1 ? 'rgba(0,255,136,0.2)' : dir === -1 ? 'rgba(255,51,85,0.2)' : 'var(--border)'}`,
        }}>
          {dir === 1 ? '+' : ''}{pct.toFixed(4)}%
        </div>
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em',
        color: dir === 1 ? 'var(--green)' : dir === -1 ? 'var(--red)' : 'var(--text)'
      }}>
        {formatRate(rate, cur)}
      </div>
      <div style={{ fontSize: 9, color: 'var(--text-3)', marginTop: 4 }}>per 1 {base}</div>
    </div>
  )
}

function MiniChart({ history, id = 'default' }) {
  if (!history || history.length < 2) return (
    <div style={{
      height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid var(--border)', fontSize: 10, color: 'var(--text-3)'
    }}>
      ACCUMULATING DATA...
    </div>
  )
  const vals = history.map(h => h.rate)
  const min = Math.min(...vals), max = Math.max(...vals)
  const range = max - min || 0.000001
  const w = 240, h = 52
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${h - ((v - min) / range) * (h - 6) - 3}`)
  const isUp = vals[vals.length - 1] >= vals[0]
  const col = isUp ? 'var(--green)' : 'var(--red)'
  const areaBottom = `${w},${h} 0,${h}`
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isUp ? '#00ff88' : '#ff3355'} stopOpacity="0.15" />
          <stop offset="100%" stopColor={isUp ? '#00ff88' : '#ff3355'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`${pts.join(' ')} ${areaBottom}`} fill={`url(#grad-${id})`} />
      <polyline points={pts.join(' ')} fill="none" stroke={col} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(',')[0]} cy={pts[pts.length - 1].split(',')[1]} r="3" fill={col} />
    </svg>
  )
}

function ConvertPanel({ rates, base, selectedCur }) {
  const [amount, setAmount] = useState('1')
  const [from, setFrom] = useState(base)
  const [to, setTo] = useState(selectedCur || 'EUR')

  useEffect(() => { if (selectedCur) setTo(selectedCur) }, [selectedCur])
  useEffect(() => { setFrom(base) }, [base])

  const allCurrencies = [base, ...Object.keys(rates)]

  const convert = (amt, f, t) => {
    const num = parseFloat(amt)
    if (!amt || isNaN(num)) return '—'
    if (f === t) return num.toFixed(6)
    if (f === base) return (num * (rates[t] || 1)).toFixed(6)
    if (t === base) return (num / (rates[f] || 1)).toFixed(6)
    return ((num / (rates[f] || 1)) * (rates[t] || 1)).toFixed(6)
  }

  const sel = {
    background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)',
    fontFamily: 'var(--font-mono)', fontSize: 12, padding: '10px 10px', cursor: 'pointer', outline: 'none'
  }
  const inp = {
    flex: 1, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)',
    fontFamily: 'var(--font-mono)', fontSize: 15, padding: '10px 14px', outline: 'none', transition: 'border-color 0.2s', minWidth: 0
  }

  return (
    <div style={{ border: '1px solid var(--border)', padding: 20, background: 'var(--bg-1)' }}>
      <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.15em', marginBottom: 16, fontFamily: 'var(--font-display)', fontWeight: 600 }}>CONVERTER</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={amount} onChange={e => setAmount(e.target.value)} style={inp}
            onFocus={e => e.target.style.borderColor = 'var(--border-bright)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          <select value={from} onChange={e => setFrom(e.target.value)} style={sel}>
            {allCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 16, lineHeight: 1 }}>⇅</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, background: 'var(--bg-3)', border: '1px solid var(--border-bright)',
            fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, padding: '10px 14px',
            color: 'var(--accent)', letterSpacing: '-0.01em', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {convert(amount, from, to)}
          </div>
          <select value={to} onChange={e => setTo(e.target.value)} style={sel}>
            {allCurrencies.filter(c => c !== from).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [base, setBase] = useState('USD')
  const [selectedCur, setSelectedCur] = useState(null)
  const [search, setSearch] = useState('')
  const [rateHistory, setRateHistory] = useState({})
  const [theme, setTheme] = useState('dark')

  // Pinned items state synced with localStorage persistence
  const [pinned, setPinned] = useState(() => {
    const saved = localStorage.getItem('fx_pinned_currencies')
    return saved ? JSON.parse(saved) : ['EUR', 'GBP', 'INR']
  })

  const { rates, prevRates, lastUpdated, loading, error, source, refresh } = useRates(base)

  useEffect(() => {
    if (Object.keys(rates).length > 0) {
      setRateHistory(h => {
        const next = { ...h }
        for (const [cur, rate] of Object.entries(rates)) {
          if (!next[cur]) next[cur] = []
          next[cur] = [...next[cur].slice(-29), { rate, time: Date.now() }]
        }
        return next
      })
    }
  }, [rates])

  // Handles adding or deleting items from the watchlist array setup
  const handlePinToggle = (currencyCode) => {
    setPinned(prev => {
      const next = prev.includes(currencyCode)
        ? prev.filter(c => c !== currencyCode)
        : [...prev, currencyCode]
      localStorage.setItem('fx_pinned_currencies', JSON.stringify(next))
      return next
    })
  }

  const filtered = Object.entries(rates).filter(([cur]) =>
    cur.toLowerCase().includes(search.toLowerCase()) ||
    (CURRENCY_NAMES[cur] || '').toLowerCase().includes(search.toLowerCase())
  )

  const btnBase = (c) => ({
    background: base === c ? 'var(--accent)' : 'var(--bg-2)',
    border: `1px solid ${base === c ? 'var(--accent)' : 'var(--border)'}`,
    color: base === c ? '#000' : 'var(--text-2)',
    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: base === c ? 700 : 400,
    padding: '5px 10px', cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.06em'
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', color: 'var(--text)' }}>

      <style>{`
        :root {
          --accent: #ffd200;
          --green: #00ff88;
          --red: #ff3355;
          --font-mono: 'Courier New', Courier, monospace;
          --font-display: sans-serif;
          
          ${theme === 'dark' ? `
            --bg: #0c0d12;
            --bg-1: #13151f;
            --bg-2: #1b1e2c;
            --bg-3: #222638;
            --border: #212536;
            --border-bright: #3a405a;
            --text: #ffffff;
            --text-2: #a2a9ca;
            --text-3: #5f6684;
          ` : `
            --bg: #f5f6fa;
            --bg-1: #ffffff;
            --bg-2: #edf0f7;
            --bg-3: #e1e6f0;
            --border: #dcdfe6;
            --border-bright: #b0b5c2;
            --text: #1a1d24;
            --text-2: #4a5064;
            --text-3: #8a92a6;
          `}
        }
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* Header */}
      <header style={{ padding: '18px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
            FX<span style={{ color: 'var(--accent)' }}>LIVE</span>
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>REAL-TIME RATES</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {loading && <span style={{ fontSize: 10, color: 'var(--text-3)', animation: 'pulse 1s infinite', fontFamily: 'var(--font-mono)' }}>FETCHING...</span>}
          {!loading && !error && lastUpdated && (
            <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
              ↻ {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          {!loading && error && (
            <span style={{ fontSize: 10, color: 'var(--red)', fontFamily: 'var(--font-mono)', maxWidth: 260 }}>{error}</span>
          )}

          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            style={{
              background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-2)',
              fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 12px', cursor: 'pointer',
              letterSpacing: '0.05em', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6
            }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--text-2)'; e.target.style.background = 'var(--bg-2)' }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'transparent' }}
          >
            {theme === 'dark' ? '☀️ LIGHT' : '🌙 DARK'}
          </button>

          <button onClick={refresh} style={{
            background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-2)',
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 14px', cursor: 'pointer',
            letterSpacing: '0.1em', transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-2)' }}>
            REFRESH
          </button>
        </div>
      </header>

      {!loading && Object.keys(rates).length > 0 && <Ticker rates={rates} prevRates={prevRates} base={base} />}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{ width: 250, borderRight: '1px solid var(--border)', padding: '20px 0', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '0 18px 18px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em', marginBottom: 10, fontFamily: 'var(--font-display)', fontWeight: 600 }}>BASE CURRENCY</div>

            <select
              value={base}
              onChange={(e) => { setBase(e.target.value); setSelectedCur(null); }}
              style={{
                width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)',
                fontFamily: 'var(--font-mono)', fontSize: 12, padding: '8px 10px', outline: 'none', cursor: 'pointer', marginBottom: 12,
                borderRadius: 0
              }}
              onFocus={e => e.target.style.borderColor = 'var(--border-bright)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            >
              {BASE_CURRENCIES.map(c => (
                <option key={c} value={c} style={{ background: 'var(--bg-1)', color: 'var(--text)' }}>
                  {FLAG[c] || '🏳️'} {c} — {CURRENCY_NAMES[c] || ''}
                </option>
              ))}
            </select>

            <div style={{ fontSize: 9, color: 'var(--text-3)', marginBottom: 6, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>QUICK SELECT</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CHF', 'CAD', 'AUD', 'CNY', 'BRL', 'SGD', 'KRW'].map(c => (
                <button key={c} onClick={() => { setBase(c); setSelectedCur(null) }} style={btnBase(c)}>{c}</button>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', padding: '16px 18px 0', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em', marginBottom: 10, fontFamily: 'var(--font-display)', fontWeight: 600 }}>ALL PAIRS</div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {BASE_CURRENCIES.filter(c => c !== base).map(c => {
                const r = rates[c], p = prevRates[c]
                const dir = r && p ? (r > p ? 1 : r < p ? -1 : 0) : 0
                return (
                  <div key={c} onClick={() => setSelectedCur(c === selectedCur ? null : c)} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 6px', cursor: 'pointer',
                    borderLeft: `2px solid ${selectedCur === c ? 'var(--accent)' : 'transparent'}`,
                    background: selectedCur === c ? 'rgba(255,210,0,0.03)' : 'transparent',
                    transition: 'all 0.15s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = selectedCur === c ? 'rgba(255,210,0,0.03)' : 'transparent'}
                  >
                    <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ fontSize: 15 }}>{FLAG[c]}</span>
                      <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: dir === 1 ? 'var(--green)' : dir === -1 ? 'var(--red)' : 'var(--text-2)' }}>{c}</span>
                          {pinned.includes(c) && <span style={{ color: 'var(--accent)', fontSize: 10 }}>★</span>}
                        </span>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--text-3)', fontWeight: 500 }}>{CURRENCY_NAMES[c] || ''}</span>
                      </span>
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: dir === 1 ? 'var(--green)' : dir === -1 ? 'var(--red)' : 'var(--text-3)' }}>
                      {r ? formatRate(r, c) : '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main style={{ flex: 1, padding: 22, overflowY: 'auto' }}>

          {/* ── PINNED RATES ROW BLOCK (ABOVE SEARCH CURRENCY BAR) ── */}
          {!loading && pinned.filter(c => c !== base && rates[c]).length > 0 && (
            <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.15em', fontWeight: 700, marginBottom: 12, fontFamily: 'var(--font-display)' }}>
                📌 PINNED WATCHLIST
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 8 }}>
                {pinned.filter(c => c !== base && rates[c]).map((cur, i) => (
                  <RateCard
                    key={`pinned-${cur}`}
                    cur={cur}
                    rate={rates[cur]}
                    prevRate={prevRates[cur]}
                    base={base}
                    selected={selectedCur === cur}
                    isPinned={true}
                    onPinToggle={handlePinToggle}
                    onClick={() => setSelectedCur(cur === selectedCur ? null : cur)}
                    index={i}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Search Box Currency Controls Row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 22, alignItems: 'center' }}>
            <input
              placeholder="SEARCH CURRENCY OR NAME..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, background: 'var(--bg-1)', border: '1px solid var(--border)', color: 'var(--text)',
                fontFamily: 'var(--font-mono)', fontSize: 12, padding: '9px 16px', outline: 'none',
                letterSpacing: '0.06em', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--border-bright)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
              {filtered.length} PAIRS
            </span>
          </div>

          {/* Market Grid Cards Block */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
              <div style={{ width: 40, height: 40, border: '2px solid var(--border)', borderTop: '2px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <div style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>LOADING RATES...</div>
            </div>
          ) : error && filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 16, border: '1px solid var(--border)', padding: 40 }}>
              <div style={{ fontSize: 32 }}>⚠</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--red)' }}>CONNECTION ERROR</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textAlign: 'center', maxWidth: 340, lineHeight: 1.7 }}>{error}</div>
              <button onClick={refresh} style={{
                background: 'var(--accent)', border: 'none', color: '#000', fontFamily: 'var(--font-mono)',
                fontSize: 12, fontWeight: 700, padding: '10px 24px', cursor: 'pointer', letterSpacing: '0.1em', marginTop: 8
              }}>
                RETRY
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 8 }}>
              {filtered.map(([cur, rate], i) => (
                <RateCard
                  key={`grid-${cur}`}
                  cur={cur}
                  rate={rate}
                  prevRate={prevRates[cur]}
                  base={base}
                  selected={selectedCur === cur}
                  isPinned={pinned.includes(cur)}
                  onPinToggle={handlePinToggle}
                  onClick={() => setSelectedCur(cur === selectedCur ? null : cur)}
                  index={i}
                />
              ))}
            </div>
          )}
        </main>

        {/* Detail Panel */}
        {selectedCur && rates[selectedCur] && (
          <aside style={{ width: 272, borderLeft: '1px solid var(--border)', padding: 22, flexShrink: 0, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{FLAG[selectedCur]}</span>{selectedCur}
              </div>
              <button onClick={() => setSelectedCur(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ marginBottom: 4, fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em' }}>1 {base} =</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--accent)', marginBottom: 4 }}>
              {formatRate(rates[selectedCur], selectedCur)} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-3)' }}>{selectedCur}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 22, fontFamily: 'var(--font-mono)' }}>
              1 {selectedCur} = {formatRate(1 / rates[selectedCur], base)} {base}
            </div>

            <div style={{ marginBottom: 6, fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em' }}>PRICE HISTORY ({rateHistory[selectedCur]?.length || 0} pts)</div>
            <MiniChart history={rateHistory[selectedCur]} id={selectedCur} />
            {rateHistory[selectedCur]?.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, marginBottom: 22 }}>
                <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                  L: {formatRate(Math.min(...rateHistory[selectedCur].map(h => h.rate)), selectedCur)}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                  H: {formatRate(Math.max(...rateHistory[selectedCur].map(h => h.rate)), selectedCur)}
                </span>
              </div>
            )}

            <ConvertPanel rates={rates} base={base} selectedCur={selectedCur} />
          </aside>
        )}
      </div>
    </div>
  )
}
