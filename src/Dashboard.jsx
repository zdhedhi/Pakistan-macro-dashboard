import React, { useState, useMemo } from 'react'

const COLORS = {
  bg: '#0a0c10',
  card: '#111318',
  cardAlt: '#181c24',
  border: '#1f2430',
  borderLight: '#2a3040',
  green: '#27c26b',
  red: '#e8404a',
  amber: '#f5a623',
  blue: '#4a9eff',
  gold: '#c9a227',
  textMain: '#e0e0e0',
  textDim: '#7a8090',
  textBright: '#ffffff',
  textMid: '#5a6070',
}

const SCORECARD = [
  { label: '✓ IMF On Track', verdict: '3rd review complete; $4.8B disbursed; on track', signal: 'green' },
  { label: '✓ Reserves Growing', verdict: '$22.7B total; 2.7mo import cover; growing', signal: 'green' },
  { label: '✓ Valuation Cheap', verdict: 'P/E 8.3x, DY 6.1%; deep discount to peers', signal: 'green' },
  { label: '✓ Remittances Strong', verdict: 'Record $4.25B; FY26 on track for $41B+', signal: 'green' },
  { label: '✓ Real Economy', verdict: 'GDP 3.7%; LSM +6.4%; auto +48% YoY', signal: 'green' },
  { label: '✓ External Sector', verdict: '+$459M surplus May; 11M cumulative +$255M', signal: 'green' },
  { label: '✓ Fiscal Discipline', verdict: 'Primary surplus 2.5% GDP; deficit 0.7% (9M)', signal: 'green' },
  { label: '~ Rates On Hold', verdict: 'Rate hiked to 11.5%; real rate negative at −0.2%', signal: 'amber' },
  { label: '~ REER Overvalued', verdict: 'Stable at 278 but REER 106 = overvalued', signal: 'amber' },
  { label: '~ Energy / Oil', verdict: 'Brent $75, pre-war levels; still +12% YoY', signal: 'amber' },
  { label: '✗ Inflation Rising', verdict: '11.7% & rising; above 5–7% target band', signal: 'red' },
  { label: '~ Geopolitical', verdict: 'US–Iran deal signed; Hormuz reopening; fragile', signal: 'amber' },
]

const MACRO_TIMELINE = [
  { period: 'Jun\'23', kse100: 42000, change: 0, pkrUsd: 285, fxReserves: 9.5, fwdPE: 5.5, reer: 96, cad: -1.0, inflation: 29.4, regime: 'IMF crisis', assessment: 'Peak crisis' },
  { period: 'Dec\'23', kse100: 62000, change: 47.6, pkrUsd: 282, fxReserves: 8.0, fwdPE: 6.0, reer: 98, cad: -0.7, inflation: 28.3, regime: 'IMF crisis', assessment: 'Crisis lows' },
  { period: 'Jun\'24', kse100: 78000, change: 25.8, pkrUsd: 278, fxReserves: 9.5, fwdPE: 6.5, reer: 100, cad: -0.6, inflation: 12.6, regime: 'IMF EFF', assessment: 'IMF deal hope' },
  { period: 'Dec\'24', kse100: 116000, change: 48.7, pkrUsd: 278, fxReserves: 12.0, fwdPE: 7.0, reer: 101, cad: -0.4, inflation: 4.1, regime: 'Stable band', assessment: 'Bull run' },
  { period: 'Jan\'25', kse100: 125000, change: 7.8, pkrUsd: 283, fxReserves: 14.5, fwdPE: 7.2, reer: 103, cad: 0, inflation: 3.5, regime: 'Managed float', assessment: 'Consolidation' },
  { period: 'Jun\'25', kse100: 162994, change: -11.4, pkrUsd: 279, fxReserves: 15.9, fwdPE: 7.5, reer: 104, cad: 0.2, inflation: 4.0, regime: 'Stable band', assessment: 'Correction' },
  { period: 'Jan\'26', kse100: 171074, change: 36.9, pkrUsd: 279, fxReserves: 16.0, fwdPE: 8.0, reer: 104, cad: 0.2, inflation: 7.3, regime: 'Overvalued', assessment: 'Holding tight' },
  { period: 'Apr\'26', kse100: 173963, change: 6.7, pkrUsd: 278, fxReserves: 17.2, fwdPE: 8.0, reer: 106, cad: 0.2, inflation: 11.7, regime: 'Overvalued', assessment: 'Inflation surging' },
  { period: 'May\'26', kse100: 179571, change: 3.2, pkrUsd: 278, fxReserves: 17.2, fwdPE: 8.3, reer: 106, cad: 0.2, inflation: 11.7, regime: 'Post-deal', assessment: 'Bull run accelerates' },
]

const EXTERNAL_SECTOR = [
  { period: 'Jun\'23', fxReserves: 8.0, remittances: 2.4, exports: 2.8, cadGdp: -0.7, assessment: 'Crisis' },
  { period: 'Dec\'23', fxReserves: 9.5, remittances: 2.2, exports: 2.5, cadGdp: -1.0, assessment: 'Crisis' },
  { period: 'Jun\'24', fxReserves: 9.5, remittances: 2.5, exports: 2.6, cadGdp: -0.6, assessment: 'Improving' },
  { period: 'Dec\'24', fxReserves: 12.0, remittances: 2.8, exports: 2.7, cadGdp: -0.4, assessment: 'Improving' },
  { period: 'Jan\'25', fxReserves: 14.5, remittances: 3.2, exports: 2.9, cadGdp: 0, assessment: 'Balanced' },
  { period: 'Jun\'25', fxReserves: 15.9, remittances: 3.5, exports: 2.6, cadGdp: -0.1, assessment: 'Balanced' },
  { period: 'Jan\'26', fxReserves: 16.0, remittances: 3.1, exports: 2.8, cadGdp: 0.2, assessment: 'Surplus' },
  { period: 'Apr\'26', fxReserves: 17.2, remittances: 4.1, exports: 2.6, cadGdp: 0.3, assessment: 'Surplus' },
  { period: 'May\'26', fxReserves: 17.2, remittances: 4.25, exports: 2.37, cadGdp: 0.2, assessment: 'Surplus' },
]

const MONETARY_TIMELINE = [
  { period: 'Jun\'23', policyRate: 22.0, cpi: 29.4, realRate: -7.4, assessment: 'Peak crisis' },
  { period: 'Dec\'23', policyRate: 22.0, cpi: 28.3, realRate: -6.3, assessment: 'Hiked on oil shock' },
  { period: 'Jun\'24', policyRate: 20.5, cpi: 12.6, realRate: 7.9, assessment: 'Cut cycle begins' },
  { period: 'Dec\'24', policyRate: 12.0, cpi: 2.9, realRate: 9.1, assessment: 'Aggressive cuts' },
  { period: 'Jan\'25', policyRate: 10.5, cpi: 4.0, realRate: 6.5, assessment: 'Accommodative' },
  { period: 'Jun\'25', policyRate: 10.5, cpi: 3.5, realRate: 7.0, assessment: 'Accommodative' },
  { period: 'Jan\'26', policyRate: 11.5, cpi: 10.9, realRate: 0.6, assessment: 'Hiked on inflation' },
  { period: 'Apr\'26', policyRate: 11.5, cpi: 11.7, realRate: -0.2, assessment: 'Negative real rate' },
  { period: 'May\'26', policyRate: 11.5, cpi: 11.7, realRate: -0.2, assessment: 'Holding tight' },
]

const REAL_ECONOMY = [
  { period: 'Jun\'23', gdp: 2.6, autoYoY: 30, cementYoY: 8, remittances: 2.8, lsmYoY: 3.0, signal: 'OVERWEIGHT' },
  { period: 'Dec\'23', gdp: 2.6, autoYoY: -15, cementYoY: -5, remittances: 2.5, lsmYoY: -0.7, signal: 'UNDERWEIGHT' },
  { period: 'Jun\'24', gdp: 3.2, autoYoY: 45, cementYoY: 12, remittances: 3.2, lsmYoY: 5.0, signal: 'OVERWEIGHT' },
  { period: 'Dec\'24', gdp: 3.5, autoYoY: 60, cementYoY: 10, remittances: 3.0, lsmYoY: 6.0, signal: 'OVERWEIGHT' },
  { period: 'Jan\'25', gdp: 3.6, autoYoY: 55, cementYoY: 8, remittances: 3.1, lsmYoY: 6.5, signal: 'OVERWEIGHT' },
  { period: 'Jun\'25', gdp: 3.7, autoYoY: 108, cementYoY: -5, remittances: 4.1, lsmYoY: 11.1, signal: 'OVERWEIGHT' },
  { period: 'Jan\'26', gdp: 3.7, autoYoY: 117, cementYoY: -8, remittances: 3.5, lsmYoY: 6.1, signal: 'OVERWEIGHT' },
  { period: 'Apr\'26', gdp: 3.7, autoYoY: 19, cementYoY: -21, remittances: 4.25, lsmYoY: 6.0, signal: 'NEUTRAL' },
  { period: 'May\'26', gdp: 3.7, autoYoY: 19, cementYoY: -21, remittances: 4.25, lsmYoY: 6.0, signal: 'NEUTRAL' },
]

const BULL_TRAJECTORY = [
  { period: 'Dec\'23', bullPct: 25, bullCount: 3, neutralCount: 4, bearCount: 5 },
  { period: 'Jun\'24', bullPct: 50, bullCount: 6, neutralCount: 3, bearCount: 3 },
  { period: 'Dec\'24', bullPct: 75, bullCount: 9, neutralCount: 2, bearCount: 1 },
  { period: 'Jun\'25', bullPct: 83, bullCount: 10, neutralCount: 2, bearCount: 0 },
  { period: 'Jan\'26', bullPct: 75, bullCount: 9, neutralCount: 2, bearCount: 1 },
  { period: 'Apr\'26', bullPct: 67, bullCount: 8, neutralCount: 2, bearCount: 2 },
  { period: 'May\'26', bullPct: 67, bullCount: 8, neutralCount: 2, bearCount: 2 },
]

const CREDIT_RATINGS = [
  { agency: "Moody's", rating: 'Caa1', outlook: 'Stable', action: 'Upgraded from Caa2', date: 'Aug 13, 2025', color: COLORS.amber },
  { agency: "S&P", rating: 'B-', outlook: 'Stable', action: 'Upgraded from CCC+', date: 'Jul 24, 2025', color: COLORS.amber },
  { agency: 'Fitch', rating: 'B-', outlook: 'Stable', action: 'Affirmed', date: 'Recent', color: COLORS.amber },
]

const IMF_PROGRAM = [
  { label: 'Program Size', value: '$7B', detail: '37 months' },
  { label: 'EFF Disbursed', value: '$4.8B', detail: '3 reviews complete' },
  { label: 'RSF Facility', value: '$1.4B', detail: 'Climate resilience' },
  { label: '3rd Review', value: 'Complete', detail: 'May 8, 2026' },
  { label: 'Primary Surplus', value: '2.5% GDP', detail: 'FY26 (target 1.6%)' },
  { label: 'Reserves', value: '$17.2B', detail: 'vs $16B Dec target' },
  { label: 'FBR Target FY27', value: 'Rs15.26T', detail: '+13.7% YoY' },
  { label: 'Petroleum Levy', value: 'Rs1.73T', detail: '+18% YoY' },
]

const FISCAL_FRAMEWORK = [
  { label: 'Federal Revenue FY27', value: 'Rs17.145T', change: '+13.5%' },
  { label: 'FBR Target FY27', value: 'Rs15.264T', change: '+13.7%' },
  { label: 'Petroleum Levy FY27', value: 'Rs1.73T', change: '+18%' },
  { label: 'Fiscal Deficit FY27', value: '3.6% GDP', change: 'Target' },
  { label: 'Primary Surplus FY27', value: '2.0% GDP', change: 'Target' },
  { label: 'Primary Surplus FY26', value: '2.5% GDP', detail: 'vs 1.6% target' },
  { label: 'GDP Growth FY26', value: '3.7%', detail: 'vs 3.5% target' },
  { label: 'GDP Growth FY27', value: '3.5%', detail: 'Projection' },
  { label: 'Inflation FY27', value: '8.0%', detail: 'Projection' },
  { label: 'Interest/Revenue', value: '39.1%', detail: 'vs B-peer 12.1%' },
]

const MARKET_DATA = [
  { label: 'KSE-100 Index', value: '179,571', change: '+3.2%', positive: true },
  { label: 'Fwd P/E', value: '8.3x', detail: 'Deep discount' },
  { label: 'Dividend Yield', value: '6.1%', detail: 'Attractive' },
  { label: 'PKR/USD', value: '278', detail: 'Stable band' },
  { label: 'SBP Policy Rate', value: '11.5%', detail: 'Held' },
  { label: 'CPI Inflation', value: '11.7%', change: 'Rising', positive: false },
  { label: 'FX Reserves', value: '$17.2B', detail: 'Growing' },
  { label: 'REER Index', value: '106', detail: 'Overvalued' },
]

const BROKER_TARGETS = [
  { broker: 'AHL Research', target: 210000, upside: 16.9 },
  { broker: 'AKD Securities', target: 205000, upside: 14.1 },
  { broker: 'Topline Securities', target: 200000, upside: 11.3 },
  { broker: 'JS Global', target: 195000, upside: 8.6 },
  { broker: 'Arif Habib', target: 220000, upside: 22.5 },
]

const SCENARIOS = [
  {
    name: 'Bull — PKR Holds',
    probability: '50%',
    color: COLORS.green,
    conditions: 'Brent ≤ $80, IMF on track, FBR meets target',
    kseRange: '200K–220K',
    pkrRange: '275–282',
    outcome: 'Bull run accelerates. CPI eases, rate cuts resume H2 FY27.',
  },
  {
    name: 'Neutral — Range Bound',
    probability: '35%',
    color: COLORS.amber,
    conditions: 'Brent $80–90, IMF on track, FBR misses modestly',
    kseRange: '170K–195K',
    pkrRange: '278–290',
    outcome: 'Consolidation. Rates on hold until CPI falls below 8%.',
  },
  {
    name: 'Bear — Sharp Depreciation',
    probability: '15%',
    color: COLORS.red,
    conditions: 'Brent above $90, IMF stalled, PKR above 300',
    kseRange: '140K–160K',
    pkrRange: '295–320',
    outcome: 'Crisis mode. IMF program at risk, capital controls possible.',
  },
]

const GEOPOLITICAL_THEMES = [
  {
    title: 'US-Iran Peace Deal',
    impact: 'Positive',
    color: COLORS.green,
    detail: 'Pakistan played key mediation role, hosting talks in Islamabad. Oil prices fallen to pre-war levels (~$74 Brent). Strait of Hormuz gradually reopening for LNG tankers. Three Qatari LNG tankers arrived at Port Qasim since May 9. Single most positive near-term catalyst.',
  },
  {
    title: 'India Relations',
    impact: 'Fragile',
    color: COLORS.amber,
    detail: 'Post-Operation Sindoor tensions de-escalated but remain fragile. Pakistan\'s diplomatic relevance elevated through mediation role. No direct military confrontation since May 2025. Relationship remains transactional. Water treaty disputes continue.',
  },
  {
    title: 'China & Saudi Security',
    impact: 'Constructive',
    color: COLORS.green,
    detail: 'Pakistan\'s closeness to China and new Saudi security partnership add strategic depth. CPEC continues. Saudi security partnership signed. Multilateral debt from WB, ADB totals $42.48B (46% of external debt stock).',
  },
  {
    title: 'Energy Security',
    impact: 'Cautious',
    color: COLORS.amber,
    detail: 'LNG supply disruptions resolved with Iranian-approved transit. Brent at $75 (pre-war) but petrol/diesel still 48%/38% above pre-crisis. Managed dependency, not energy security. Hormuz could close again.',
  },
  {
    title: 'Power Sector Reform',
    impact: 'Critical',
    color: COLORS.red,
    detail: 'Circular debt at Rs3.1 trillion. Chinese IPPs refused late payment surcharge waivers. DISCO privatization key IMF reform priority. Every Rs1/kWh tariff increase adds Rs85B to consumer bills. LNG at $17-20/MMBtu remains luxury.',
  },
  {
    title: 'World Bank / Multilateral',
    impact: 'Constructive',
    color: COLORS.green,
    detail: 'Country Partnership Framework supports climate resilience, education expansion, energy sector viability, SOE reform. WBGI ranking at 22nd percentile remains a rating constraint per Fitch.',
  },
]

const RECOMMENDATION = {
  verdict: 'Constructive',
  score: '66.7% Bull',
  summary: 'Pakistan\'s macro fundamentals are solidly constructive with 66.7% bull scorecard. Strong reserves ($22.7B), record remittances ($4.25B/mo), IMF compliance, and deeply discounted KSE-100 (8.3x P/E, 6.1% DY) outweigh near-term inflation concern (11.7%) and negative real rate. US-Iran peace deal is a key positive catalyst.',
  action: 'Selective accumulation on dips. Overweight banks, E&P, fertilizer, and technology.',
  watch: 'Inflation trajectory, oil prices, REER overvaluation for signs of deterioration.',
}

function Card({ title, subtitle, children, style }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: 20,
      ...style,
    }}>
      {title && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: COLORS.blue, textTransform: 'uppercase' }}>
            {title}
          </div>
          {subtitle && <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 4 }}>{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

function SignalBadge({ signal }) {
  const colorMap = { green: COLORS.green, amber: COLORS.amber, red: COLORS.red }
  const c = colorMap[signal] || COLORS.textDim
  return (
    <div style={{
      display: 'inline-block',
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: c,
      boxShadow: `0 0 8px ${c}80`,
      flexShrink: 0,
    }} />
  )
}

function MiniBarChart({ data, dataKey, color, height = 80, formatVal }) {
  const max = Math.max(...data.map(d => Math.abs(d[dataKey])))
  const min = Math.min(...data.map(d => d[dataKey]))
  const range = max - min || 1
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height, width: '100%' }}>
      {data.map((d, i) => {
        const h = ((d[dataKey] - min) / range) * (height - 20) + 8
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: '100%',
              maxWidth: 32,
              height: h,
              background: color,
              borderRadius: '3px 3px 0 0',
              opacity: i === data.length - 1 ? 1 : 0.5 + (i / data.length) * 0.5,
              transition: 'opacity 0.3s',
            }} />
            <div style={{ fontSize: 8, color: COLORS.textDim, whiteSpace: 'nowrap' }}>
              {formatVal ? formatVal(d[dataKey]) : d[dataKey]}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LineChart({ data, keys, colors, height = 160, formatY }) {
  const padding = { top: 10, right: 10, bottom: 20, left: 35 }
  const w = 100
  const h = height
  const allValues = data.flatMap(d => keys.map(k => d[k]))
  const max = Math.max(...allValues)
  const min = Math.min(...allValues, 0)
  const range = max - min || 1

  const xStep = (w - padding.left - padding.right) / (data.length - 1)
  const yScale = (val) => h - padding.bottom - ((val - min) / range) * (h - padding.top - padding.bottom)

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = padding.top + t * (h - padding.top - padding.bottom)
        const val = max - t * range
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={w - padding.right} y2={y} stroke={COLORS.border} strokeWidth={0.3} />
            <text x={padding.left - 3} y={y + 2} fontSize={5} fill={COLORS.textDim} textAnchor="end">
              {formatY ? formatY(val) : val.toFixed(0)}
            </text>
          </g>
        )
      })}
      {keys.map((key, ki) => {
        const points = data.map((d, i) => `${padding.left + i * xStep},${yScale(d[key])}`).join(' ')
        return (
          <g key={ki}>
            <polyline points={points} fill="none" stroke={colors[ki]} strokeWidth={1.2} strokeLinejoin="round" />
            {data.map((d, i) => (
              <circle key={i} cx={padding.left + i * xStep} cy={yScale(d[key])} r={1.2} fill={colors[ki]} />
            ))}
          </g>
        )
      })}
      {data.map((d, i) => (
        <text key={i} x={padding.left + i * xStep} y={h - 6} fontSize={4.5} fill={COLORS.textDim} textAnchor="middle">
          {d.period}
        </text>
      ))}
    </svg>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'scorecard', label: 'Scorecard' },
    { id: 'imf', label: 'IMF Program' },
    { id: 'external', label: 'External Sector' },
    { id: 'fiscal', label: 'Fiscal' },
    { id: 'monetary', label: 'Monetary' },
    { id: 'real', label: 'Real Economy' },
    { id: 'geopolitical', label: 'Geopolitical' },
    { id: 'markets', label: 'Markets' },
  ]

  const bullCount = SCORECARD.filter(s => s.signal === 'green').length
  const neutralCount = SCORECARD.filter(s => s.signal === 'amber').length
  const bearCount = SCORECARD.filter(s => s.signal === 'red').length
  const bullPct = Math.round((bullCount / SCORECARD.length) * 100)

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, color: COLORS.textMain, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: `linear-gradient(180deg, ${COLORS.card} 0%, ${COLORS.card}EE 100%)`,
        borderBottom: `1px solid ${COLORS.border}`,
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: COLORS.textBright, margin: 0, letterSpacing: -0.5 }}>
              Pakistan Macro Intelligence
            </h1>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>
              Real-time macro dashboard · Updated May 2026
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: 1 }}>Bull Score</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: bullPct >= 65 ? COLORS.green : bullPct >= 50 ? COLORS.amber : COLORS.red }}>
                {bullPct}%
              </div>
            </div>
            <div style={{ width: 1, height: 36, background: COLORS.border }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ background: `${COLORS.green}20`, border: `1px solid ${COLORS.green}40`, borderRadius: 8, padding: '4px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.green }}>{bullCount}</div>
                <div style={{ fontSize: 8, color: COLORS.textDim, textTransform: 'uppercase' }}>Bull</div>
              </div>
              <div style={{ background: `${COLORS.amber}20`, border: `1px solid ${COLORS.amber}40`, borderRadius: 8, padding: '4px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.amber }}>{neutralCount}</div>
                <div style={{ fontSize: 8, color: COLORS.textDim, textTransform: 'uppercase' }}>Neutral</div>
              </div>
              <div style={{ background: `${COLORS.red}20`, border: `1px solid ${COLORS.red}40`, borderRadius: 8, padding: '4px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.red }}>{bearCount}</div>
                <div style={{ fontSize: 8, color: COLORS.textDim, textTransform: 'uppercase' }}>Bear</div>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? COLORS.blue + '15' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? `2px solid ${COLORS.blue}` : '2px solid transparent',
                color: activeTab === tab.id ? COLORS.blue : COLORS.textDim,
                padding: '10px 16px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
        {activeTab === 'overview' && <OverviewTab bullPct={bullPct} bullCount={bullCount} neutralCount={neutralCount} bearCount={bearCount} />}
        {activeTab === 'scorecard' && <ScorecardTab />}
        {activeTab === 'imf' && <IMFTab />}
        {activeTab === 'external' && <ExternalTab />}
        {activeTab === 'fiscal' && <FiscalTab />}
        {activeTab === 'monetary' && <MonetaryTab />}
        {activeTab === 'real' && <RealEconomyTab />}
        {activeTab === 'geopolitical' && <GeopoliticalTab />}
        {activeTab === 'markets' && <MarketsTab />}
      </main>
    </div>
  )
}

function OverviewTab({ bullPct, bullCount, neutralCount, bearCount }) {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Recommendation Banner */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            background: COLORS.green + '20',
            border: `1px solid ${COLORS.green}50`,
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: 14,
            fontWeight: 700,
            color: COLORS.green,
          }}>
            {RECOMMENDATION.verdict}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.textBright }}>
            {RECOMMENDATION.score}
          </div>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: COLORS.textMain, margin: '0 0 12px 0' }}>
          {RECOMMENDATION.summary}
        </p>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: 1 }}>Action</div>
            <div style={{ fontSize: 13, color: COLORS.green, marginTop: 2 }}>{RECOMMENDATION.action}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: 1 }}>Watch</div>
            <div style={{ fontSize: 13, color: COLORS.amber, marginTop: 2 }}>{RECOMMENDATION.watch}</div>
          </div>
        </div>
      </Card>

      {/* Key Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {MARKET_DATA.map((m, i) => (
          <div key={i} style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            padding: 16,
          }}>
            <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: 1 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.textBright, marginTop: 4 }}>
              {m.value}
              {m.change && (
                <span style={{ fontSize: 12, marginLeft: 8, color: m.positive === true ? COLORS.green : m.positive === false ? COLORS.red : COLORS.textDim }}>
                  {m.change}
                </span>
              )}
            </div>
            {m.detail && <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>{m.detail}</div>}
          </div>
        ))}
      </div>

      {/* Bull Trajectory */}
      <Card title="Bull % Trajectory — 6 Month Trend" subtitle="12-factor scorecard evolution">
        <LineChart
          data={BULL_TRAJECTORY}
          keys={['bullPct']}
          colors={[COLORS.green]}
          height={180}
          formatY={(v) => `${v.toFixed(0)}%`}
        />
        <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'center' }}>
          {BULL_TRAJECTORY.map((b, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: b.bullPct >= 65 ? COLORS.green : b.bullPct >= 50 ? COLORS.amber : COLORS.red }}>
                {b.bullPct}%
              </div>
              <div style={{ fontSize: 9, color: COLORS.textDim }}>{b.period}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Scenarios */}
      <Card title="Scenario Analysis" subtitle="Bull / Neutral / Bear outlook">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {SCENARIOS.map((s, i) => (
            <div key={i} style={{
              background: COLORS.cardAlt,
              border: `1px solid ${s.color}40`,
              borderRadius: 10,
              padding: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.name}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.probability}</div>
              </div>
              <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 8 }}>{s.conditions}</div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 9, color: COLORS.textDim, textTransform: 'uppercase' }}>KSE-100</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMain }}>{s.kseRange}</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: COLORS.textDim, textTransform: 'uppercase' }}>PKR/USD</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMain }}>{s.pkrRange}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: COLORS.textMid, lineHeight: 1.5 }}>{s.outcome}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Credit Ratings */}
      <Card title="Sovereign Credit Ratings" subtitle="All three major agencies at Stable outlook">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {CREDIT_RATINGS.map((r, i) => (
            <div key={i} style={{
              background: COLORS.cardAlt,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              padding: 16,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 11, color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: 1 }}>{r.agency}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: r.color, margin: '4px 0' }}>{r.rating}</div>
              <div style={{ fontSize: 12, color: COLORS.textMain }}>{r.outlook}</div>
              <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 4 }}>{r.action} · {r.date}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function ScorecardTab() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Card title="Scorecard — 12 Factor Analysis" subtitle="Bullish / Neutral / Bearish signal per indicator">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
          {SCORECARD.map((s, i) => (
            <div key={i} style={{
              background: COLORS.cardAlt,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              padding: 14,
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}>
              <SignalBadge signal={s.signal} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textBright }}>{s.label}</div>
                <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 4, lineHeight: 1.4 }}>{s.verdict}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Bull % Summary" subtitle="Aggregate scorecard trajectory">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          {BULL_TRAJECTORY.map((b, i) => {
            const c = b.bullPct >= 65 ? COLORS.green : b.bullPct >= 50 ? COLORS.amber : COLORS.red
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: c }}>{b.bullPct}%</div>
                <div style={{ fontSize: 10, color: COLORS.textDim }}>{b.period}</div>
                <div style={{ fontSize: 9, color: COLORS.textMid, marginTop: 2 }}>
                  {b.bullCount}B {b.neutralCount}N {b.bearCount}Bear
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

function IMFTab() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Card title="IMF EFF Status" subtitle="$7B Extended Fund Facility — 3rd review complete">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {IMF_PROGRAM.map((item, i) => (
            <div key={i} style={{
              background: COLORS.cardAlt,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              padding: 14,
            }}>
              <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.green, marginTop: 4 }}>{item.value}</div>
              <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>{item.detail}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="IMF Program Compliance" subtitle="Quantitative performance criteria">
        <div style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textMain }}>
          <p>Pakistan has met all quantitative performance criteria including primary surplus (2.5% GDP in FY26 vs 1.6% target), zero SBP borrowing from government, and reserve building ($17.2B vs $16B Dec target).</p>
          <p>FY27 budget targets are aligned with IMF framework: FBR Rs15.26T, petroleum levy Rs1.73T, fiscal deficit 3.6% GDP. Key risks: FBR tax underperformance (0.7pp of GDP below target in FY26), capital expenditure compression, and provincial surplus achievement.</p>
          <p style={{ color: COLORS.green, fontWeight: 600 }}>EFF remains on track with the 3rd review completed May 8, 2026. Total disbursements now stand at $4.8B.</p>
        </div>
      </Card>

      <Card title="IMF / SBP / WB" subtitle="Multilateral engagement">
        <div style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textMain }}>
          <p>The World Bank supports Pakistan under its Country Partnership Framework. Key areas include climate resilience (RSF-linked), education spending expansion, energy sector viability restoration, and SOE reform.</p>
          <p>Multilateral debt from WB, ADB, and others totals <strong style={{ color: COLORS.gold }}>$42.48B (46% of external debt stock)</strong>. The WB supports Pakistan's anti-corruption efforts and human capital development under the EFF structural benchmarks.</p>
          <p>Pakistan's WBGI ranking at <strong style={{ color: COLORS.amber }}>22nd percentile</strong> remains a rating constraint per Fitch.</p>
        </div>
      </Card>
    </div>
  )
}

function ExternalTab() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Card title="External Sector Data Table" subtitle="Reserves | Remittances | Exports | CAD (% GDP)">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>Period</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>FX Reserves ($B)</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>Remittances ($B)</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>Exports ($B)</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>CAD (% GDP)</th>
                <th style={{ textAlign: 'center', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>Assessment</th>
              </tr>
            </thead>
            <tbody>
              {EXTERNAL_SECTOR.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '8px 12px', color: COLORS.textMain, fontWeight: 600 }}>{row.period}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: COLORS.green }}>{row.fxReserves.toFixed(1)}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: COLORS.textMain }}>{row.remittances.toFixed(1)}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: COLORS.textMain }}>{row.exports.toFixed(1)}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: row.cadGdp >= 0 ? COLORS.green : COLORS.red }}>{row.cadGdp > 0 ? '+' : ''}{row.cadGdp.toFixed(1)}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                    <span style={{ fontSize: 10, color: row.cadGdp >= 0 ? COLORS.green : COLORS.amber }}>{row.assessment}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <Card title="FX Reserves ($B)" subtitle="SBP + commercial banks">
          <MiniBarChart data={EXTERNAL_SECTOR} dataKey="fxReserves" color={COLORS.green} formatVal={(v) => v.toFixed(0)} />
        </Card>
        <Card title="Remittances ($B)" subtitle="Monthly inflows">
          <MiniBarChart data={EXTERNAL_SECTOR} dataKey="remittances" color={COLORS.blue} formatVal={(v) => v.toFixed(1)} />
        </Card>
      </div>

      <Card title="Remittances Detail" subtitle="Record $4.25B in May 2026">
        <div style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textMain }}>
          <p>11MFY26 cumulative at <strong style={{ color: COLORS.green }}>$38.1B (+9.2% YoY)</strong>, on track to exceed $41B for the first time ever.</p>
          <p>Saudi Arabia ($1.03B) and UAE ($1.01B) were top sources in May, followed by UK ($646M) and US ($350M). EU countries contributed $466M.</p>
          <p>The 11MFY26 average run-rate is $3.5B/month vs $3.2B last year. IT exports also growing, supporting the technology sector on PSX. Strong remittance inflows are the primary driver of the current account surplus.</p>
        </div>
      </Card>
    </div>
  )
}

function FiscalTab() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Card title="Fiscal Framework — Key Metrics" subtitle="Budget FY27 targets & FY26 outturn">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {FISCAL_FRAMEWORK.map((f, i) => (
            <div key={i} style={{
              background: COLORS.cardAlt,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              padding: 14,
            }}>
              <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: 1 }}>{f.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.textBright, marginTop: 4 }}>{f.value}</div>
              {f.change && <div style={{ fontSize: 11, color: COLORS.green, marginTop: 2 }}>{f.change}</div>}
              {f.detail && <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>{f.detail}</div>}
            </div>
          ))}
        </div>
      </Card>

      <Card title="Budget FY27 Analysis" subtitle="IMF-aligned fiscal framework">
        <div style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textMain }}>
          <p>IMF has set FY27 federal revenue target at <strong>Rs17.145T (+13.5%)</strong>, FBR target at <strong>Rs15.264T (+13.7%)</strong>, petroleum levy at <strong>Rs1.73T (+18%)</strong>.</p>
          <p>Fitch's review of the FY27 budget noted primary surplus target of 2% GDP and overall deficit of 3.6% GDP. However, Fitch warned that spending cuts, particularly capital expenditure compression, could weigh on medium-term growth.</p>
          <p style={{ color: COLORS.amber }}>Interest/revenue ratio at 39.1% is substantially above B-rated peer median of 12.1%.</p>
          <p>FBR tax target Rs15.26T is ambitious — 13.7% growth vs FY26 miss. FBR performance and provincial surplus are key watch items.</p>
        </div>
      </Card>
    </div>
  )
}

function MonetaryTab() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Card title="Monetary Policy Timeline" subtitle="Policy Rate | CPI | Real Rate | Assessment">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>Period</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>Policy Rate</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>CPI</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>Real Rate</th>
                <th style={{ textAlign: 'center', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>Assessment</th>
              </tr>
            </thead>
            <tbody>
              {MONETARY_TIMELINE.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '8px 12px', color: COLORS.textMain, fontWeight: 600 }}>{row.period}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: COLORS.blue }}>{row.policyRate.toFixed(1)}%</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: row.cpi > 10 ? COLORS.red : COLORS.green }}>{row.cpi.toFixed(1)}%</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: row.realRate < 0 ? COLORS.red : COLORS.green }}>{row.realRate > 0 ? '+' : ''}{row.realRate.toFixed(1)}%</td>
                  <td style={{ padding: '8px 12px', textAlign: 'center', fontSize: 10, color: COLORS.textDim }}>{row.assessment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <Card title="CPI Inflation YoY (%)" subtitle="vs SBP Target Band (5-7%)">
          <LineChart
            data={MONETARY_TIMELINE}
            keys={['cpi']}
            colors={[COLORS.red]}
            height={160}
            formatY={(v) => v.toFixed(0) + '%'}
          />
        </Card>
        <Card title="Policy Rate vs Real Rate" subtitle="Monetary policy stance">
          <LineChart
            data={MONETARY_TIMELINE}
            keys={['policyRate', 'realRate']}
            colors={[COLORS.blue, COLORS.green]}
            height={160}
            formatY={(v) => v.toFixed(0) + '%'}
          />
        </Card>
      </div>

      <Card title="CPI Inflation | Real Rate | Assessment" subtitle="Current monetary stance">
        <div style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textMain }}>
          <p>CPI inflation at <strong style={{ color: COLORS.red }}>11.7%</strong> and rising — well above 5-7% SBP target band. Pakistan CPI at 11.7% vs trading partners ~3-4%. Inflation differential of ~8pp puts persistent depreciation pressure. Expected to persist through FY27.</p>
          <p>Monetary Policy Committee held the policy rate at 11.5%. Real rate is negative at −0.2%. CPI est 6.9% FY26, 8.0% FY27. Policy rate avg 10.5% FY26, 10.0% FY27.</p>
          <p style={{ color: COLORS.amber }}>If CPI falls below 8% by Sep, rate cut catalyst triggers.</p>
        </div>
      </Card>
    </div>
  )
}

function RealEconomyTab() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Card title="Real Economy Indicators" subtitle="GDP | Auto Sales | Cement | Remittances | LSM | Signal">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>Period</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>GDP</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>Auto YoY</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>Cement YoY</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>Remitt.</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>LSM YoY</th>
                <th style={{ textAlign: 'center', padding: '8px 12px', color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase' }}>Signal</th>
              </tr>
            </thead>
            <tbody>
              {REAL_ECONOMY.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '8px 12px', color: COLORS.textMain, fontWeight: 600 }}>{row.period}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: COLORS.green }}>{row.gdp.toFixed(1)}%</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: row.autoYoY >= 0 ? COLORS.green : COLORS.red }}>{row.autoYoY > 0 ? '+' : ''}{row.autoYoY}%</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: row.cementYoY >= 0 ? COLORS.green : COLORS.red }}>{row.cementYoY > 0 ? '+' : ''}{row.cementYoY}%</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: COLORS.textMain }}>${row.remittances.toFixed(1)}B</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: row.lsmYoY >= 0 ? COLORS.green : COLORS.red }}>{row.lsmYoY > 0 ? '+' : ''}{row.lsmYoY}%</td>
                  <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: row.signal === 'OVERWEIGHT' ? COLORS.green + '20' : row.signal === 'UNDERWEIGHT' ? COLORS.red + '20' : COLORS.amber + '20',
                      color: row.signal === 'OVERWEIGHT' ? COLORS.green : row.signal === 'UNDERWEIGHT' ? COLORS.red : COLORS.amber,
                    }}>
                      {row.signal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Real Economy Summary" subtitle="GDP 3.7% | LSM +6.4% | Auto +48% YoY">
        <div style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textMain }}>
          <p>GDP growth at 3.7% for FY26, exceeding the 3.5% target. Large Scale Manufacturing (LSM) growing at 6.4% YoY. Auto sales surged 48% YoY (though decelerating from 117% peak).</p>
          <p>Cement dispatches turned negative at -21% YoY, indicating construction sector weakness. This is a watch item as it may signal broader economic slowdown.</p>
          <p>Remittances at record $4.25B/month continue to support consumption and the current account surplus.</p>
        </div>
      </Card>
    </div>
  )
}

function GeopoliticalTab() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Card title="Geopolitical Risks & Macro Themes" subtitle="Key geopolitical drivers and structural themes">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
          {GEOPOLITICAL_THEMES.map((theme, i) => (
            <div key={i} style={{
              background: COLORS.cardAlt,
              border: `1px solid ${theme.color}40`,
              borderRadius: 10,
              padding: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textBright }}>{theme.title}</div>
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: theme.color + '20',
                  color: theme.color,
                }}>
                  {theme.impact}
                </div>
              </div>
              <div style={{ fontSize: 11, color: COLORS.textDim, lineHeight: 1.5 }}>{theme.detail}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Bearish Risks" subtitle="Key downside catalysts">
        <div style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textMain }}>
          <p><strong style={{ color: COLORS.red }}>Geopolitical fragility</strong> — US-Iran deal could unravel. Hormuz could close again if diplomatic value shifts. Any escalation would be a major risk to markets and the IMF program.</p>
          <p><strong style={{ color: COLORS.red }}>FBR underperformance</strong> — FBR missed target by 0.7pp of GDP in FY26. FY27 target of Rs15.26T (+13.7%) is ambitious. Tax underperformance risks fiscal slippage.</p>
          <p><strong style={{ color: COLORS.red }}>Inflation persistence</strong> — CPI at 11.7% and rising. If inflation doesn't ease below 8% by Sep, rate cuts delayed, negative real rate persists, depreciation pressure builds.</p>
          <p><strong style={{ color: COLORS.red }}>Power sector</strong> — Circular debt at Rs3.1T. Chinese IPPs refusing waivers. Every 1% increase in electricity tariffs cascades through CPI.</p>
        </div>
      </Card>
    </div>
  )
}

function MarketsTab() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Card title="KSE-100 Index" subtitle="Pakistan Stock Exchange — current 179,571">
        <LineChart
          data={MACRO_TIMELINE}
          keys={['kse100']}
          colors={[COLORS.green]}
          height={200}
          formatY={(v) => (v / 1000).toFixed(0) + 'K'}
        />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <Card title="Valuation Metrics" subtitle="KSE-100 deep value">
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ color: COLORS.textDim, fontSize: 12 }}>Forward P/E</span>
              <span style={{ color: COLORS.green, fontWeight: 700, fontSize: 14 }}>8.3x</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ color: COLORS.textDim, fontSize: 12 }}>Dividend Yield</span>
              <span style={{ color: COLORS.green, fontWeight: 700, fontSize: 14 }}>6.1%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ color: COLORS.textDim, fontSize: 12 }}>All-Time High</span>
              <span style={{ color: COLORS.textMain, fontWeight: 700, fontSize: 14 }}>191,033</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ color: COLORS.textDim, fontSize: 12 }}>Current</span>
              <span style={{ color: COLORS.textBright, fontWeight: 700, fontSize: 14 }}>179,571</span>
            </div>
          </div>
        </Card>

        <Card title="Broker Targets" subtitle="12-month KSE-100 consensus">
          <div style={{ display: 'grid', gap: 10 }}>
            {BROKER_TARGETS.map((b, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ color: COLORS.textMain, fontSize: 12 }}>{b.broker}</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: COLORS.textBright, fontWeight: 700, fontSize: 13 }}>{b.target.toLocaleString()}</div>
                  <div style={{ color: COLORS.green, fontSize: 10 }}>+{b.upside}% upside</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Market Recommendation" subtitle="Pakistan equities positioning">
        <div style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textMain }}>
          <p>The market offers <strong style={{ color: COLORS.green }}>deep value (8.3x P/E, 6.1% DY)</strong> with strong macro tailwinds (reserves, remittances, IMF compliance) but faces near-term headwinds (elevated inflation, negative real rate, REER overvaluation).</p>
          <p style={{ color: COLORS.green, fontWeight: 600 }}>Position for medium-term recovery as inflation eases and rate cuts resume in H2 FY27.</p>
          <p><strong>Sector positioning:</strong> Overweight banks (NIMs stable, asset quality improving), E&P (oil price recovery), fertilizer (gas availability), and technology (IT exports growing).</p>
        </div>
      </Card>
    </div>
  )
}

export default function Dashboard() {
  return <App />
}
