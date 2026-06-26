import { useState } from "react";

// ============================================================
// COLOR CONSTANTS
// ============================================================
const COLORS = {
  bg: "#0a0c10",
  surface: "#111318",
  surface2: "#181c24",
  border: "#1f2430",
  borderLight: "#2a3040",
  gold: "#c9a227",
  green: "#27c26b",
  red: "#e8404a",
  amber: "#f5a623",
  blue: "#4a9eff",
  text: "#e0e0e0",
  textDim: "#7a8090",
  textMuted: "#5a6070",
  white: "#ffffff",
};

// ============================================================
// DATA: KPI Cards (18 indicators)
// ============================================================
const KPIS = [
  { label: "KSE-100 INDEX", value: "179,571", change: "+1.06% / +46.3% YoY", sub: "ATH: 191,033 (Jan'26)", signal: "green" },
  { label: "SBP POLICY RATE", value: "11.50%", change: "Hold (Jun 15 MPC)", sub: "Raised 100bps Apr 27", signal: "amber" },
  { label: "CPI INFLATION YoY", value: "11.66%", change: "↑ from 10.9% (Apr)", sub: "11MFY26 avg: 6.69%", signal: "red" },
  { label: "CPI INFLATION MoM", value: "0.52%", change: "↓ from 2.5% (Apr)", sub: "Target band: 5–7%", signal: "amber" },
  { label: "PKR / USD", value: "278.30", change: "Stable | REER: 106.15", sub: "7-yr high REER (overvalued)", signal: "amber" },
  { label: "FX RESERVES (TOTAL)", value: "$22.74B", change: "+$70M WoW", sub: "SBP: $17.22B | Banks: $5.52B", signal: "green" },
  { label: "GDP GROWTH FY26", value: "3.7%", change: "Missed 4.2% target", sub: "Agr 2.9% | Ind 3.5% | Svcs 4.1%", signal: "green" },
  { label: "CURRENT ACCOUNT", value: "+$459M", change: "Surplus (May 2026)", sub: "11MFY26: +$255M surplus", signal: "green" },
  { label: "REMITTANCES", value: "$4.25B", change: "Record high | +20.2% MoM", sub: "11MFY26: $38.1B (+9.2%)", signal: "green" },
  { label: "LSM GROWTH", value: "+6.44%", change: "Jul–Apr FY26", sub: "Apr'26: +6.06% YoY", signal: "green" },
  { label: "AUTO SALES", value: "13,211", change: "+19% YoY | −24% MoM", sub: "11MFY26: 140,253 (+48%)", signal: "green" },
  { label: "CEMENT DISPATCHES", value: "3.84M T", change: "−21.0% YoY (May)", sub: "11MFY26: 46.26M T (+6.4%)", signal: "red" },
  { label: "6M T-BILL YIELD", value: "12.49%", change: "Cut-off (Jun 10)", sub: "Latest auction: 11.75%", signal: "amber" },
  { label: "BRENT CRUDE", value: "$75.06", change: "−22.4% MoM | +12.5% YoY", sub: "Back to pre-Iran-war levels", signal: "green" },
  { label: "M2 GROWTH", value: "15.1%", change: "YoY (Apr 2026)", sub: "Jul–Mar: +6.8% (period)", signal: "amber" },
  { label: "KSE-100 FWD P/E", value: "8.3x", change: "Below historical avg", sub: "DY: 6.1% | Discount to region", signal: "green" },
  { label: "EXTERNAL DEBT", value: "$137.6B", change: "↓ $0.5B QoQ (Mar'26)", sub: "Public external: $92.2B", signal: "amber" },
  { label: "IMF EFF STATUS", value: "3rd Review Done", change: "$1.32B disbursed (May)", sub: "Total: $4.8B of $7B", signal: "green" },
];

// ============================================================
// DATA: Investment Signal Scorecard (12 factors)
// ============================================================
const SCORECARD = [
  { name: "Monetary Policy", score: 50, color: COLORS.amber, verdict: "Rate hiked to 11.5%; real rate negative at −0.2%" },
  { name: "Inflation Trend", score: 25, color: COLORS.red, verdict: "11.7% & rising; above 5–7% target band" },
  { name: "FX Reserves", score: 80, color: COLORS.green, verdict: "$22.7B total; 2.7mo import cover; growing" },
  { name: "IMF Program", score: 85, color: COLORS.green, verdict: "3rd review complete; $4.8B disbursed; on track" },
  { name: "PKR Stability", score: 60, color: COLORS.amber, verdict: "Stable at 278 but REER 106 = overvalued" },
  { name: "KSE Valuation", score: 80, color: COLORS.green, verdict: "P/E 8.3x, DY 6.1%; deep discount to peers" },
  { name: "Real Economy", score: 70, color: COLORS.green, verdict: "GDP 3.7%; LSM +6.4%; auto +48% YoY" },
  { name: "Remittances", score: 85, color: COLORS.green, verdict: "Record $4.25B; FY26 on track for $41B+" },
  { name: "Fiscal Balance", score: 70, color: COLORS.green, verdict: "Primary surplus 2.5% GDP; deficit 0.7% (9M)" },
  { name: "Geopolitical Risk", score: 55, color: COLORS.amber, verdict: "US–Iran deal signed; Hormuz reopening; fragile" },
  { name: "Energy / Oil", score: 65, color: COLORS.amber, verdict: "Brent $75, pre-war levels; still +12% YoY" },
  { name: "Current Account", score: 75, color: COLORS.green, verdict: "+$459M surplus May; 11M cumulative +$255M" },
];

const AVG_SCORE = Math.round(SCORECARD.reduce((a, b) => a + b.score, 0) / SCORECARD.length);

// ============================================================
// DATA: Sector Allocation Signals
// ============================================================
const SECTORS = [
  { name: "🏦 Banks", signal: "OVERWEIGHT", color: COLORS.green, note: "High NIMs at 11.5% policy rate; strong deposit growth; Meezan, UBL, HBL top picks" },
  { name: "⛽ Energy E&P/OMC", signal: "OVERWEIGHT", color: COLORS.green, note: "Oil price recovery benefits E&P (OGDC, PPL); OMCs gain from volume recovery" },
  { name: "🌱 Fertilizer", signal: "OVERWEIGHT", color: COLORS.green, note: "Strong offtake +11.4%; gas availability stable; FFC, Engro top picks" },
  { name: "🚗 Automobiles", signal: "NEUTRAL", color: COLORS.amber, note: "Sales +48% YoY but MoM declining; pricing pressure from PKR/INR parts" },
  { name: "🏗️ Cement", signal: "UNDERWEIGHT", color: COLORS.red, note: "May dispatches −21% YoY; construction slowdown; energy cost pressure" },
  { name: "💻 Technology/IT", signal: "OVERWEIGHT", color: COLORS.green, note: "IT exports growing; SYS, TRG benefit from PKR depreciation tailwind" },
  { name: "⚡ Power/IPPs", signal: "UNDERWEIGHT", color: COLORS.red, note: "Circular debt Rs3.1T; IPP contract renegotiation risk" },
  { name: "🛒 Consumer Staples", signal: "NEUTRAL", color: COLORS.amber, note: "Inflation pressure on margins; volume growth stable; Nestlé, Unilever" },
  { name: "🏠 Real Estate", signal: "NEUTRAL", color: COLORS.amber, note: "Lower rates support demand; but cement/energy costs weigh on construction" },
];

// ============================================================
// DATA: Rate History (SBP Policy Rate & CPI)
// ============================================================
const RATE_HISTORY = [
  { period: "Jun'23", policyRate: 22.0, cpi: 29.4, realRate: -7.4, assessment: "Peak crisis", tagColor: COLORS.red },
  { period: "Sep'23", policyRate: 22.0, cpi: 31.4, realRate: -9.4, assessment: "Inflation surging", tagColor: COLORS.red },
  { period: "Jan'24", policyRate: 22.0, cpi: 28.3, realRate: -6.3, assessment: "Holding tight", tagColor: COLORS.red },
  { period: "Jun'24", policyRate: 20.5, cpi: 12.6, realRate: 7.9, assessment: "Cut cycle begins", tagColor: COLORS.amber },
  { period: "Sep'24", policyRate: 17.5, cpi: 6.9, realRate: 10.6, assessment: "Aggressive cuts", tagColor: COLORS.green },
  { period: "Jan'25", policyRate: 12.0, cpi: 2.9, realRate: 9.1, assessment: "Inflation collapses", tagColor: COLORS.green },
  { period: "Jun'25", policyRate: 10.5, cpi: 3.5, realRate: 7.0, assessment: "Accommodative", tagColor: COLORS.green },
  { period: "Jan'26", policyRate: 10.5, cpi: 4.0, realRate: 6.5, assessment: "Pre-war stability", tagColor: COLORS.green },
  { period: "Apr'26", policyRate: 11.5, cpi: 10.9, realRate: 0.6, assessment: "Hiked on oil shock", tagColor: COLORS.amber },
  { period: "May'26", policyRate: 11.5, cpi: 11.7, realRate: -0.2, assessment: "Negative real rate", tagColor: COLORS.red },
];

const FORWARD_GUIDANCE = [
  { horizon: "Jul MPC 2026", projection: "11.50%", range: "11.0–12.0%", consensus: "Hold", implication: "Watch oil & core inflation", tagColor: COLORS.amber },
  { horizon: "Sep MPC 2026", projection: "11.00%", range: "10.5–11.5%", consensus: "25–50bps cut", implication: "If oil stays low & CPI eases", tagColor: COLORS.green },
  { horizon: "Dec MPC 2026", projection: "10.50%", range: "10.0–11.0%", consensus: "Cut to 10.5%", implication: "AHL forecast: avg 10.5% FY26", tagColor: COLORS.green },
  { horizon: "FY27 avg", projection: "10.00%", range: "9.5–11.0%", consensus: "Gradual easing", implication: "AHL forecast: 10.0% FY27 avg", tagColor: COLORS.green },
];

// ============================================================
// DATA: Market History (KSE-100, PKR, Reserves)
// ============================================================
const MARKET_HISTORY = [
  { period: "Jun'23", kse100: 42000, change: 0, pkrUsd: 285, fxReserves: 9.5, fwdPE: 5.5, assessment: "Crisis lows", tagColor: COLORS.red },
  { period: "Dec'23", kse100: 62000, change: 47.6, pkrUsd: 282, fxReserves: 8.0, fwdPE: 6.0, assessment: "IMF deal hope", tagColor: COLORS.amber },
  { period: "Jun'24", kse100: 78000, change: 25.8, pkrUsd: 278, fxReserves: 9.5, fwdPE: 6.5, assessment: "Rate cuts begin", tagColor: COLORS.green },
  { period: "Dec'24", kse100: 116000, change: 48.7, pkrUsd: 278, fxReserves: 12.0, fwdPE: 7.0, assessment: "Bull run accelerates", tagColor: COLORS.green },
  { period: "Jun'25", kse100: 125000, change: 7.8, pkrUsd: 283, fxReserves: 14.5, fwdPE: 7.2, assessment: "Consolidation", tagColor: COLORS.amber },
  { period: "Dec'25", kse100: 171074, change: 36.9, pkrUsd: 279, fxReserves: 16.0, fwdPE: 8.0, assessment: "Record breaking", tagColor: COLORS.green },
  { period: "Jan'26", kse100: 184174, change: 7.7, pkrUsd: 279, fxReserves: 16.1, fwdPE: 8.0, assessment: "ATH 191,033", tagColor: COLORS.green },
  { period: "Apr'26", kse100: 162994, change: -11.4, pkrUsd: 279, fxReserves: 15.9, fwdPE: 7.5, assessment: "War correction", tagColor: COLORS.red },
  { period: "May'26", kse100: 173963, change: 6.7, pkrUsd: 278, fxReserves: 17.2, fwdPE: 8.0, assessment: "Recovery", tagColor: COLORS.green },
  { period: "Jun'26", kse100: 179571, change: 3.2, pkrUsd: 278, fxReserves: 17.2, fwdPE: 8.3, assessment: "Pre-budget rally", tagColor: COLORS.green },
];

// ============================================================
// DATA: Real Economy History
// ============================================================
const ECON_HISTORY = [
  { period: "Jun'24", gdp: 2.6, autoYoY: -15, cementYoY: -5, remittances: 2.5, lsmYoY: -0.7, signal: "red" },
  { period: "Dec'24", gdp: 2.6, autoYoY: 30, cementYoY: 8, remittances: 2.8, lsmYoY: 3.0, signal: "green" },
  { period: "Jun'25", gdp: 3.2, autoYoY: 45, cementYoY: 12, remittances: 3.2, lsmYoY: 5.0, signal: "green" },
  { period: "Sep'25", gdp: 3.5, autoYoY: 60, cementYoY: 10, remittances: 3.0, lsmYoY: 6.0, signal: "green" },
  { period: "Dec'25", gdp: 3.6, autoYoY: 55, cementYoY: 8, remittances: 3.1, lsmYoY: 6.5, signal: "green" },
  { period: "Mar'26", gdp: 3.7, autoYoY: 108, cementYoY: -5, remittances: 4.1, lsmYoY: 11.1, signal: "green" },
  { period: "Apr'26", gdp: 3.7, autoYoY: 117, cementYoY: -8, remittances: 3.5, lsmYoY: 6.1, signal: "amber" },
  { period: "May'26", gdp: 3.7, autoYoY: 19, cementYoY: -21, remittances: 4.25, lsmYoY: 6.0, signal: "amber" },
];

// ============================================================
// DATA: External Sector History
// ============================================================
const EXTERNAL_HISTORY = [
  { period: "Jun'23", fxReserves: 9.5, remittances: 2.2, exports: 2.5, cadGdp: -1.0, assessment: "Crisis", tagColor: COLORS.red },
  { period: "Dec'23", fxReserves: 8.0, remittances: 2.4, exports: 2.8, cadGdp: -0.7, assessment: "Stabilizing", tagColor: COLORS.amber },
  { period: "Jun'24", fxReserves: 9.5, remittances: 2.5, exports: 2.6, cadGdp: -0.6, assessment: "Improving", tagColor: COLORS.amber },
  { period: "Dec'24", fxReserves: 12.0, remittances: 2.8, exports: 2.7, cadGdp: -0.4, assessment: "Surplus trend", tagColor: COLORS.green },
  { period: "Jun'25", fxReserves: 14.5, remittances: 3.2, exports: 2.9, cadGdp: 0.0, assessment: "Balanced", tagColor: COLORS.green },
  { period: "Dec'25", fxReserves: 16.0, remittances: 3.1, exports: 2.8, cadGdp: 0.2, assessment: "Surplus", tagColor: COLORS.green },
  { period: "Mar'26", fxReserves: 16.0, remittances: 4.1, exports: 2.6, cadGdp: 0.3, assessment: "Strong surplus", tagColor: COLORS.green },
  { period: "Apr'26", fxReserves: 15.9, remittances: 3.5, exports: 2.6, cadGdp: -0.1, assessment: "War pressure", tagColor: COLORS.amber },
  { period: "May'26", fxReserves: 17.2, remittances: 4.25, exports: 2.37, cadGdp: 0.2, assessment: "Rebound surplus", tagColor: COLORS.green },
];

// ============================================================
// DATA: Broker Calls
// ============================================================
const BROKERS = [
  { firm: "Arif Habib Limited (AHL)", rating: "OVERWEIGHT", target: "208,000", upside: 15.9, verdict: "Constructive", color: COLORS.green,
    note: "KSE-100 to reach 208,000 by Dec'26 with 21.6% upside. CY26e P/E of 8.0x; earnings growth 5.9%. Key drivers: domestic liquidity, FX reserve rebuilding, PIA privatization, circular debt resolution. Avg CPI est 6.9% FY26, 8.0% FY27. Policy rate avg 10.5% FY26, 10.0% FY27." },
  { firm: "AKD Securities", rating: "BUY", target: "263,800", upside: 47.0, verdict: "Bullish", color: COLORS.green,
    note: "KSE-100 to reach 263,800 by Dec'26, implying 53% return (48.4% in USD). Market cap to hit historic $100B. Overweight Banks, E&P, Fertilizer, Cement, OMCs, Autos, Textile, Technology. Fwd P/E 7.0x. DY 6.2%. Driven by monetary easing, political stability, improving external account." },
  { firm: "Topline Securities", rating: "OVERWEIGHT", target: "205,000", upside: 14.2, verdict: "Positive", color: COLORS.green,
    note: "Constructive outlook with rate easing expected in H2 CY26. US-Iran deal reduces oil pressure. Focus on banks, E&P, and fertilizer. Near-term consolidation in 18k–19k range before next leg up." },
  { firm: "JS Global", rating: "OVERWEIGHT", target: "210,000", upside: 16.9, verdict: "Positive", color: COLORS.green,
    note: "FY26 remittances on track for $41B+. LSM growth robust at 6.4%. Current account surplus supports PKR stability. Banks and cement top sectoral picks. Dividend yield 6.1% attractive." },
  { firm: "IGI Securities", rating: "NEUTRAL", target: "195,000", upside: 8.6, verdict: "Cautious", color: COLORS.amber,
    note: "Near-term headwinds from elevated inflation (11.7%) and negative real rates. Rate cut timeline uncertain. But medium-term fundamentals strong with IMF anchor and reserve building." },
  { firm: "Al Habib Capital", rating: "OVERWEIGHT", target: "200,000", upside: 11.4, verdict: "Constructive", color: COLORS.green,
    note: "Valuation compelling at 8.3x fwd P/E vs 10-yr avg of 11x. Bank earnings robust. Budget FY27 positive for documentation. Oil decline post US-Iran deal is key catalyst." },
];

const BROKER_CONSENSUS = {
  avgTarget: "213,633",
  bullCount: 5,
  neutralCount: 1,
  bearCount: 0,
  currentKse: "179,571",
  fwdPE: "8.3x",
  divYield: "6.1%",
  keyCatalyst: "Oil decline + rate cut in Sep MPC",
};

// ============================================================
// DATA: Institutional Cards
// ============================================================
const INSTITUTIONAL = [
  {
    org: "IMF", icon: "🏛️", tag: "EFF 3rd Review Complete", tagColor: COLORS.green,
    headline: "$1.32B disbursed; total $4.8B of $7B program; FY27 federal revenue target Rs17.1T",
    body: "The IMF Executive Board completed the 3rd review of Pakistan's $7B EFF on May 8, 2026, approving disbursement of SDR 760M ($1.1B) under EFF and SDR 154M ($220M) under RSF. Total disbursements now stand at $4.8B. The Fund noted strong fiscal performance with primary surplus of 1.6% GDP expected in FY26, gross reserves at $16B at end-Dec (up from $14.5B at Jun'25). IMF has set FY27 federal revenue target at Rs17.145T (+13.5%), FBR target at Rs15.264T (+13.7%), petroleum levy at Rs1.73T (+18%). GDP growth projected at 3.5%, inflation at 8.4%. Program on track for completion.",
    metrics: [
      { label: "Program Size", value: "$7.0B", color: COLORS.blue },
      { label: "Disbursed", value: "$4.8B", color: COLORS.green },
      { label: "Duration", value: "37 months", color: COLORS.blue },
      { label: "Approval", value: "Sep 25, 2024", color: COLORS.textDim },
    ],
    impact: "Strong anchor for macro stability and external financing confidence",
    impactColor: COLORS.green,
  },
  {
    org: "World Bank", icon: "🌍", tag: "Active Engagement", tagColor: COLORS.green,
    headline: "Supporting climate resilience, education, and energy sector reforms",
    body: "The World Bank continues active engagement with Pakistan under its Country Partnership Framework. Key areas include climate resilience (RSF-linked), education spending expansion, energy sector viability restoration, and SOE reform. Multilateral debt from WB, ADB, and others totals $42.48B (46% of external debt stock). The WB supports Pakistan's anti-corruption efforts and human capital development under the EFF structural benchmarks. Pakistan's WBGI ranking at 22nd percentile remains a rating constraint per Fitch.",
    metrics: [
      { label: "Multilateral Debt", value: "$42.5B", color: COLORS.blue },
      { label: "Share of Ext. Debt", value: "46%", color: COLORS.amber },
      { label: "RSF Facility", value: "$1.4B", color: COLORS.green },
      { label: "WBGI Rank", value: "22nd pct", color: COLORS.red },
    ],
    impact: "Provides concessional financing and reform credibility",
    impactColor: COLORS.green,
  },
  {
    org: "SBP MPC", icon: "🏦", tag: "Rate Held at 11.5%", tagColor: COLORS.amber,
    headline: "MPC holds at 11.5%; inflation to remain in double digits near-term before easing",
    body: "The SBP Monetary Policy Committee held the policy rate at 11.5% on June 15, 2026, the 4th MPC of the year. The previous hike of 100bps on April 27 was in response to the Middle East conflict driving oil prices higher. The MPC noted headline inflation rose from 7.3% in March to 10.9% in April and 11.7% in May due to low base effect and energy price hikes. Core inflation rose to 8.7% in May. The US-Iran peace deal reduced oil price pressure, supporting the hold decision. The MPC assessed current stance as appropriate to guide inflation towards the 5–7% target over the medium term. Inflation projected to remain in double digits for the next few months before gradually easing.",
    metrics: [
      { label: "Policy Rate", value: "11.50%", color: COLORS.amber },
      { label: "Ceiling Rate", value: "12.50%", color: COLORS.red },
      { label: "Floor Rate", value: "10.50%", color: COLORS.green },
      { label: "Target Band", value: "5–7%", color: COLORS.blue },
    ],
    impact: "Cautious hold; rate cuts likely only if oil stays low and CPI eases",
    impactColor: COLORS.amber,
  },
  {
    org: "Rating Agencies", icon: "📊", tag: "All B-/Caa1 Stable", tagColor: COLORS.green,
    headline: "Moody's upgraded to Caa1; S&P and Fitch at B-; all Stable outlook",
    body: "Pakistan's sovereign credit ratings have stabilized with all three major agencies at Stable outlook. Moody's upgraded Pakistan to Caa1 from Caa2 (Positive → Stable) on August 13, 2025. S&P upgraded to B- from CCC+ on July 24, 2025 (Stable). Fitch affirmed at B- (Stable) following new sovereign rating criteria. Fitch's review of the FY27 budget noted primary surplus target of 2% GDP and overall deficit of 3.6% GDP. However, Fitch warned that spending cuts, particularly capital expenditure compression, could weigh on medium-term growth. Interest/revenue ratio at 39.1% is substantially above B-rated peer median of 12.1%.",
    metrics: [
      { label: "Moody's", value: "Caa1", color: COLORS.amber },
      { label: "S&P", value: "B-", color: COLORS.green },
      { label: "Fitch", value: "B-", color: COLORS.green },
      { label: "Outlook", value: "All Stable", color: COLORS.green },
    ],
    impact: "Upgrade trajectory; stable outlook supports Eurobond market access",
    impactColor: COLORS.green,
  },
];

// ============================================================
// DATA: Geopolitical Risk Cards
// ============================================================
const GEOPOLITICAL = [
  {
    icon: "🕊️", title: "US–Iran Peace Deal", tag: "De-escalating", type: COLORS.green,
    body: "A US-Iran framework agreement was signed on June 20, 2026, calling for immediate cessation of military operations. The 60-day negotiation period began June 17. Pakistan played a key mediation role, hosting talks in Islamabad. Oil prices have fallen to pre-war levels (~$74 Brent). Strait of Hormuz gradually reopening for LNG tankers. Three Qatari LNG tankers have arrived at Port Qasim since May 9 via Iranian-approved route. This is the single most positive near-term catalyst for Pakistan's macro outlook.",
    impact: "Major positive: oil down 22%, inflation to ease, Hormuz reopening",
    impactColor: COLORS.green,
  },
  {
    icon: "⚔️", title: "India–Pakistan Relations", tag: "Post-Crisis Calm", type: COLORS.amber,
    body: "Following the May 2025 India-Pakistan crisis (Operation Sindoor), tensions have de-escalated but remain fragile. Pakistan's diplomatic relevance was elevated through its mediation role in the US-Iran conflict. No direct military confrontation since May 2025. The relationship remains transactional with no structural improvement. Water treaty disputes continue. Pakistan's closeness to China and new Saudi security partnership add complexity. Any escalation would be a major risk to markets and the IMF program.",
    impact: "Calm but fragile; any escalation = severe risk to KSE and PKR",
    impactColor: COLORS.amber,
  },
  {
    icon: "🛢️", title: "Middle East / Hormuz / Oil", tag: "Improving", type: COLORS.green,
    body: "The US-Iran war (Feb 28 – Jun 20, 2026) disrupted Strait of Hormuz shipping, causing Brent to spike above $95. Iranian missile strikes on Ras Laffan damaged ~17% of Qatar's LNG export capacity (3-5 year repair). Pakistan faced LNG supply disruptions with QatarEnergy declaring force majeure. Pakistan secured Iranian-approved transit for Qatari LNG tankers. Brent has fallen to ~$75, back to pre-war levels. However, the arrangement is managed dependency, not energy security. Hormuz could close again if diplomatic value shifts.",
    impact: "Oil relief positive; but LNG/energy security structurally weak",
    impactColor: COLORS.amber,
  },
  {
    icon: "🏛️", title: "IMF Program Compliance", tag: "On Track", type: COLORS.green,
    body: "The $7B EFF remains on track with the 3rd review completed May 8, 2026. Pakistan has met all quantitative performance criteria including primary surplus (2.5% GDP in FY26 vs 1.6% target), zero SBP borrowing from government, and reserve building ($17.2B vs $16B Dec target). FY27 budget targets are aligned with IMF framework: FBR Rs15.26T, petroleum levy Rs1.73T, fiscal deficit 3.6% GDP. Key risks: FBR tax underperformance (0.7pp of GDP below target in FY26), capital expenditure compression, and provincial surplus achievement.",
    impact: "Strong anchor; but FBR revenue and provincial surplus are watch items",
    impactColor: COLORS.green,
  },
  {
    icon: "🌊", title: "Climate / Floods", tag: "Moderate Risk", type: COLORS.amber,
    body: "The 2025 floods (Aug-Sep) affected agricultural output but the sector showed resilience with 2.89% growth. Wheat production rose 4.3% to 29.61M tonnes, rice +2.8%, sugarcane +6.2%. Climate vulnerability remains high under the RSF ($1.4B) facility. The NAFSC and National Meat Sector Transformation Council have been established. Forestry and fishing posted moderate growth. Climate-related disruptions remain a recurring risk for the agricultural sector, which employs ~40% of the workforce.",
    impact: "Managed in FY26; recurring annual risk to agriculture and food inflation",
    impactColor: COLORS.amber,
  },
  {
    icon: "⚡", title: "Circular Debt / Energy", tag: "High Risk", type: COLORS.red,
    body: "Pakistan's power sector circular debt stands at Rs3.1 trillion. Chinese IPPs refused to waive late payment surcharges, delaying circular debt resolution despite Pakistani banks agreeing to lend below KIBOR. DISCO privatization/restructuring is a key reform priority under IMF. LNG costs at $17-20/MMBtu on spot market remain a luxury. Every Rs1/kWh tariff increase adds Rs85B annually to consumer bills. The government has preferred demand curtailment over spot buying, causing industrial shutdowns. Every 1% increase in electricity tariffs cascades through CPI.",
    impact: "Rs3.1T circular debt; structural risk to fiscal and inflation outlook",
    impactColor: COLORS.red,
  },
  {
    icon: "💼", title: "IT Exports / Remittances", tag: "Positive", type: COLORS.green,
    body: "Remittances hit a record $4.25B in May 2026 (+20.2% MoM, +15.4% YoY), the highest monthly inflow in Pakistan's history. 11MFY26 cumulative at $38.1B (+9.2% YoY), on track to exceed $41B for the first time ever. Saudi Arabia ($1.03B) and UAE ($1.01B) were top sources in May, followed by UK ($646M) and US ($350M). EU countries contributed $466M. The 11MFY26 average run-rate is $3.5B/month vs $3.2B last year. IT exports also growing, supporting the technology sector on PSX. Strong remittance inflows are the primary driver of the current account surplus.",
    impact: "Record remittances; $41B+ FY26 target achievable; key external buffer",
    impactColor: COLORS.green,
  },
  {
    icon: "📉", title: "Sovereign Debt / Eurobonds", tag: "Stable", type: COLORS.amber,
    body: "Total external debt and liabilities at $137.6B (Mar'26), down $0.5B QoQ. External public debt at $92.2B, with government external debt at $82.26B and IMF outstanding at $9.89B. Eurobonds and international Sukuk outstanding at $6.3B. Long-term debt dominates at $68.41B vs short-term $13.85B. Multilateral debt (WB, ADB) totals $42.48B (46%). Paris Club at $5.49B. The shift from short-term to longer-term financing continues. Credit rating upgrades (Moody's Caa1, S&P B-, Fitch B-) support market access. Debt-to-GDP at 33.4% (external) and ~75% (total public).",
    impact: "Stable but high; rating upgrades improve refinancing terms",
    impactColor: COLORS.amber,
  },
  {
    icon: "📋", title: "Budget FY27", tag: "IMF-Aligned", type: COLORS.amber,
    body: "The federal budget for FY2026-27 was presented on June 10/12, 2026. Total outlay approximately Rs17.1T. FBR tax target Rs15.264T (+13.7%), petroleum levy Rs1.73T (+18%), non-tax revenue Rs5.34T. Defence spending Rs2.665T, interest payments Rs7.8T, PSDP Rs986B. GDP growth target 4.1%, inflation target 8.4%. Fiscal deficit target 3.6% GDP, primary surplus 2% GDP. New tax measures of Rs430B committed. The budget is closely aligned with IMF framework. Fitch noted the interest/revenue ratio at 39.1% is well above B-rated peer median of 12.1%, limiting fiscal flexibility.",
    impact: "IMF-compliant; but revenue ambition high and capex compression continues",
    impactColor: COLORS.amber,
  },
];

// ============================================================
// DATA: Budget FY27
// ============================================================
const BUDGET_KPIS = [
  { label: "TOTAL BUDGET", value: "Rs17.1T", sub: "Federal outlay FY27", signal: "amber" },
  { label: "FBR TAX TARGET", value: "Rs15.26T", sub: "+13.7% vs FY26 revised", signal: "amber" },
  { label: "PETROLEUM LEVY", value: "Rs1.73T", sub: "+18% | ~Rs100/liter avg", signal: "amber" },
  { label: "PRIMARY SURPLUS", value: "2.0% GDP", sub: "Target (FY26: 2.5% est)", signal: "green" },
  { label: "FISCAL DEFICIT", value: "3.6% GDP", sub: "vs B-rated median 3.0%", signal: "amber" },
  { label: "GDP TARGET", value: "4.1%", sub: "vs FY26 actual 3.7%", signal: "green" },
  { label: "INFLATION PROJECTION", value: "8.4%", sub: "IMF estimate for FY27", signal: "amber" },
  { label: "DEFENCE", value: "Rs2.67T", sub: "+Rs100B vs FY26", signal: "amber" },
  { label: "INTEREST PAYMENTS", value: "Rs7.8T", sub: "45% of total outlay", signal: "red" },
  { label: "PSDP", value: "Rs986B", sub: "+Rs113B vs FY26 (Rs873B)", signal: "green" },
  { label: "NEW TAX MEASURES", value: "Rs430B", sub: "Committed to IMF", signal: "amber" },
  { label: "NON-TAX REVENUE", value: "Rs5.34T", sub: "SBP profits, petroleum levy", signal: "green" },
];

const BUDGET_PROPOSALS = [
  { title: "FBR Target Rs15.26T", desc: "13.7% growth target; 12% organic growth + reforms", psxImpact: "Positive for documentation; negative if over-taxation", signal: "amber" },
  { title: "Petroleum Levy Rs1.73T", desc: "Avg rate ~Rs100/liter; 18% increase", psxImpact: "Negative for OMCs (collection risk); positive for fiscal", signal: "amber" },
  { title: "Capital Gains Tax (CGT)", desc: "Potential changes to CGT structure on securities", psxImpact: "Mixed; simplification could boost volumes", signal: "amber" },
  { title: "Super Tax Adjustments", desc: "Possible relief or restructuring for corporates", psxImpact: "Positive if reduced; negative if maintained", signal: "green" },
  { title: "Salaried Class Relief", desc: "Potential tax relief for salaried individuals", psxImpact: "Positive for consumer spending / auto sectors", signal: "green" },
  { title: "EV Tax to 25%", desc: "Sales tax on electric vehicles raised to 25%", psxImpact: "Negative for EV adoption; neutral for traditional autos", signal: "red" },
  { title: "Digital Invoicing", desc: "Mandatory digital invoicing for broader tax base", psxImpact: "Positive for documentation economy; IT sector benefits", signal: "green" },
  { title: "Provincial Surplus", desc: "Rs1.1T provincial surplus target (FY26 exceeded)", psxImpact: "Critical for fiscal deficit target achievement", signal: "amber" },
  { title: "PSDP Increase", desc: "Rs986B federal PSDP (+13%)", psxImpact: "Positive for cement, steel, construction sectors", signal: "green" },
  { title: "Interest Payments Rs7.8T", desc: "45% of budget; above B-rated peer median", psxImpact: "Crowds out development spending", signal: "red" },
];

const BUDGET_SECTOR_IMPACT = [
  { sector: "Banks", impact: "Positive", risk: "Higher tax targets; CGT changes", signal: "green" },
  { sector: "Cement", impact: "Positive", risk: "PSDP increase supports demand", signal: "green" },
  { sector: "Fertilizer", impact: "Neutral", risk: "Gas pricing policy; subsidy changes", signal: "amber" },
  { sector: "Autos", impact: "Positive", risk: "Salaried tax relief; EV tax negative", signal: "green" },
  { sector: "Oil & Gas", impact: "Negative", risk: "Petroleum levy increase; price caps", signal: "red" },
  { sector: "Power/IPPs", impact: "Negative", risk: "Circular debt; tariff rationalization", signal: "red" },
  { sector: "Technology", impact: "Positive", risk: "Digital invoicing; IT export incentives", signal: "green" },
  { sector: "Consumer Staples", impact: "Neutral", risk: "GST changes; inflation impact", signal: "amber" },
];

const BUDGET_SCENARIOS = [
  { scenario: "Bull", probability: "20%", description: "FBR exceeds target, primary surplus >2.5%, rate cuts accelerate", kseRange: "195,000–210,000", color: COLORS.green },
  { scenario: "Base", probability: "55%", description: "FBR meets target with difficulty, primary surplus ~2.0%, gradual rate cuts", kseRange: "180,000–200,000", color: COLORS.amber },
  { scenario: "Bear", probability: "25%", description: "FBR misses target, fiscal slippage, oil re-escalation, rate hold extends", kseRange: "155,000–170,000", color: COLORS.red },
];

const IMF_FISCAL_FRAMEWORK = [
  { label: "Federal Revenue FY27", value: "Rs17.14T", color: COLORS.amber },
  { label: "FBR Target FY27", value: "Rs15.26T", color: COLORS.amber },
  { label: "Petroleum Levy FY27", value: "Rs1.73T", color: COLORS.red },
  { label: "Primary Surplus FY26", value: "2.5% GDP", color: COLORS.green },
  { label: "Primary Surplus FY27", value: "2.0% GDP", color: COLORS.green },
  { label: "Fiscal Deficit FY27", value: "3.6% GDP", color: COLORS.amber },
  { label: "GDP Growth FY27", value: "3.5% (IMF)", color: COLORS.blue },
  { label: "Inflation FY27", value: "8.4% (IMF)", color: COLORS.amber },
  { label: "Reserve Target FY27", value: "$18B+", color: COLORS.green },
];

// ============================================================
// DATA: Signal Trajectory (12 indicators × 6 months)
// ============================================================
const TRAJECTORY_MONTHS = ["Jan'26", "Feb'26", "Mar'26", "Apr'26", "May'26", "Jun'26"];

const TRAJECTORY_INDICATORS = [
  {
    name: "Monetary Policy", desc: "Rate ≤ 11% & easing", category: "macro",
    signals: [true, true, true, false, false, false],
    values: ["10.5%", "10.5%", "10.5%", "11.5%", "11.5%", "11.5%"],
    note: "Rate hiked 100bps in April due to oil shock; now on hold. Negative real rate at -0.2%.",
  },
  {
    name: "Inflation Trend", desc: "CPI YoY ≤ 7%", category: "macro",
    signals: [true, true, false, false, false, false],
    values: ["3.5%", "2.4%", "7.3%", "10.9%", "11.7%", "11.0%"],
    note: "Inflation surged from 2.4% to 11.7% due to oil shock and low base. Expected to ease from H2 FY27.",
  },
  {
    name: "FX Reserves", desc: "SBP reserves ≥ $14B", category: "external",
    signals: [true, true, true, true, true, true],
    values: ["$16.0B", "$16.5B", "$16.0B", "$15.9B", "$17.2B", "$17.2B"],
    note: "Reserves grew from $14.5B (Jun'25) to $17.2B with IMF disbursements and remittances. SBP target $18B.",
  },
  {
    name: "IMF Compliance", desc: "Program on track", category: "sentiment",
    signals: [true, true, true, true, true, true],
    values: ["On track", "On track", "Staff agmt", "Board approval", "$1.3B received", "Pre-budget OK"],
    note: "3rd review completed May 8. $4.8B disbursed of $7B. All quantitative criteria met.",
  },
  {
    name: "PKR Stability", desc: "MoM depreciation ≤ 1%", category: "external",
    signals: [true, true, true, true, true, true],
    values: ["279", "279", "279", "279", "278", "278"],
    note: "PKR remarkably stable at 278-279. REER at 106 (overvalued) but managed through administrative measures.",
  },
  {
    name: "KSE Valuation", desc: "Fwd P/E ≤ 9x", category: "markets",
    signals: [true, true, true, true, true, true],
    values: ["8.0x", "8.0x", "7.8x", "7.5x", "8.0x", "8.3x"],
    note: "P/E consistently below 9x; deep discount to regional peers (40.7% per AKD). DY 6.1%.",
  },
  {
    name: "LSM / Real Economy", desc: "LSM growth ≥ 5%", category: "activity",
    signals: [true, true, true, true, true, false],
    values: ["+6.0%", "+6.5%", "+11.1%", "+6.1%", "+6.0%", "+4.0%"],
    note: "LSM growth robust at 6.44% (Jul-Apr FY26) but slowing. Apr MoM -8.3%. Cement -21% YoY in May.",
  },
  {
    name: "Remittances", desc: "Monthly ≥ $2.5B", category: "external",
    signals: [true, true, true, true, true, true],
    values: ["$3.0B", "$3.1B", "$4.1B", "$3.5B", "$4.25B", "$3.8B"],
    note: "Record $4.25B in May. FY26 on track for $41B+. 9.2% YoY growth. Saudi/UAE largest sources.",
  },
  {
    name: "Fiscal Balance", desc: "Primary surplus ≥ 1% GDP", category: "macro",
    signals: [true, true, true, true, true, true],
    values: ["+2.0%", "+2.2%", "+2.5%", "+2.5%", "+2.5%", "+2.5%"],
    note: "Primary surplus 2.5% GDP in FY26 (9M), best in decades. FY27 target 2.0%. Provincial surplus 1.1%.",
  },
  {
    name: "Geopolitical Risk", desc: "No active conflict", category: "sentiment",
    signals: [true, false, false, false, true, true],
    values: ["Calm", "War starts", "Hormuz hit", "War ongoing", "Deal progress", "Deal signed"],
    note: "US-Iran war (Feb 28 - Jun 20) was the biggest shock. Peace deal signed Jun 20. Pakistan mediated.",
  },
  {
    name: "Energy Cost Pressure", desc: "Brent ≤ $80", category: "macro",
    signals: [true, true, false, false, false, true],
    values: ["$75", "$75", "$95", "$90", "$85", "$74"],
    note: "Oil spiked to $95+ during war. Now back to $74 pre-war levels. Still +12% YoY. Petrol 48% above pre-war.",
  },
  {
    name: "Current Account", desc: "Surplus or deficit ≤ $500M", category: "external",
    signals: [true, true, true, true, true, true],
    values: ["+$68M", "+$231M", "+$1.13B", "-$276M", "+$459M", "+$300M"],
    note: "11MFY26 cumulative +$255M surplus vs -$1.62B deficit last year. Turnaround driven by remittances.",
  },
];

// Calculate trajectory summary
const TRAJECTORY_SUMMARY = TRAJECTORY_MONTHS.map((month, i) => {
  const bullCount = TRAJECTORY_INDICATORS.filter(ind => ind.signals[i]).length;
  const bullPct = Math.round((bullCount / TRAJECTORY_INDICATORS.length) * 100);
  return { month, bullCount, bullPct, total: TRAJECTORY_INDICATORS.length };
});

// ============================================================
// DATA: PKR Outlook
// ============================================================
const PKR_KPIS = [
  { label: "PKR / USD SPOT", value: "278.30", sub: "Interbank (Jun 25, 2026)", signal: "amber" },
  { label: "REER INDEX", value: "106.15", sub: "7-yr high (overvalued)", signal: "red" },
  { label: "CURRENT ACCOUNT (MAY)", value: "+$459M", sub: "Surplus", signal: "green" },
  { label: "11MFY26 CAD", value: "+$255M", sub: "Surplus (vs -$1.62B last yr)", signal: "green" },
  { label: "TRADE DEFICIT (MAY)", value: "$3.32B", sub: "Exports $2.37B | Imports $5.69B", signal: "amber" },
  { label: "FX RESERVES (SBP)", value: "$17.22B", sub: "2.71 months import cover", signal: "green" },
  { label: "EXTERNAL DEBT", value: "$137.6B", sub: "Public external: $92.2B", signal: "amber" },
  { label: "REMITTANCES (MAY)", value: "$4.25B", sub: "Record high monthly", signal: "green" },
  { label: "SBP FX PURCHASES", value: "~$1.0B", sub: "Needed to reach $18B target", signal: "amber" },
  { label: "PARALLEL MARKET PREMIUM", value: "~1%", sub: "Minimal spread", signal: "green" },
];

const PKR_HISTORY = [
  { period: "Jun'23", pkrUsd: 285, reer: 96, fxReserves: 9.5, cad: -1.0, inflation: 29.4, regime: "IMF crisis", assessment: "Depreciation pressure", tagColor: COLORS.red },
  { period: "Dec'23", pkrUsd: 282, reer: 98, fxReserves: 8.0, cad: -0.7, inflation: 28.3, regime: "Managed float", assessment: "Stabilizing", tagColor: COLORS.amber },
  { period: "Jun'24", pkrUsd: 278, reer: 100, fxReserves: 9.5, cad: -0.6, inflation: 12.6, regime: "IMF EFF", assessment: "Improving", tagColor: COLORS.amber },
  { period: "Dec'24", pkrUsd: 278, reer: 101, fxReserves: 12.0, cad: -0.4, inflation: 4.1, regime: "Stable band", assessment: "Stable", tagColor: COLORS.green },
  { period: "Jun'25", pkrUsd: 283, reer: 103, fxReserves: 14.5, cad: 0.0, inflation: 3.5, regime: "Stable band", assessment: "Slight depreciation", tagColor: COLORS.green },
  { period: "Dec'25", pkrUsd: 279, reer: 104, fxReserves: 16.0, cad: 0.2, inflation: 4.0, regime: "Managed float", assessment: "Appreciation", tagColor: COLORS.green },
  { period: "Mar'26", pkrUsd: 279, reer: 104, fxReserves: 16.0, cad: 0.3, inflation: 7.3, regime: "War stress", assessment: "Held by SBP", tagColor: COLORS.amber },
  { period: "May'26", pkrUsd: 278, reer: 106, fxReserves: 17.2, cad: 0.2, inflation: 11.7, regime: "Overvalued", assessment: "REER concern", tagColor: COLORS.red },
  { period: "Jun'26", pkrUsd: 278, reer: 106, fxReserves: 17.2, cad: 0.2, inflation: 11.7, regime: "Post-deal", assessment: "Stable but overvalued", tagColor: COLORS.amber },
];

const PKR_FORECAST = [
  { horizon: "Current (Jun'26)", rate: "278.30", change: "—", source: "Interbank spot", tagColor: COLORS.blue },
  { horizon: "3M (Sep'26)", rate: "282", change: "+1.3%", source: "Consensus / SBP managed", tagColor: COLORS.amber },
  { horizon: "6M (Dec'26)", rate: "285", change: "+2.4%", source: "AHL / AKD base case", tagColor: COLORS.amber },
  { horizon: "1Y (Jun'27)", rate: "295", change: "+6.0%", source: "Trading Economics forecast", tagColor: COLORS.red },
  { horizon: "2Y (Jun'28)", rate: "315", change: "+13.2%", source: "Inflation differential model", tagColor: COLORS.red },
  { horizon: "5Y (Jun'31)", rate: "380", change: "+36.6%", source: "Long-term depreciation trend", tagColor: COLORS.red },
];

const PKR_RISK_SCORECARD = [
  { factor: "REER Overvaluation", score: 85, color: COLORS.red, text: "REER at 106.15, highest in 7+ years. 8.5% above 10-yr avg of 102.6. PKR significantly overvalued in real terms due to high inflation differential." },
  { factor: "Inflation Differential", score: 80, color: COLORS.red, text: "Pakistan CPI at 11.7% vs trading partners ~3-4%. Inflation differential of ~8pp puts persistent depreciation pressure. Expected to persist through FY27." },
  { factor: "External Debt", score: 65, color: COLORS.amber, text: "Total external debt $137.6B; public external $92.2B. Eurobonds/Sukuk $6.3B. Refinancing risk moderate with IMF anchor and rating upgrades." },
  { factor: "CAD Worsening Risk", score: 40, color: COLORS.amber, text: "Currently in surplus (+$255M 11MFY26). But oil import bill still elevated. Trade deficit $3.3B/month. War disruption could widen CAD." },
  { factor: "Oil Import Bill", score: 55, color: COLORS.amber, text: "Brent at $75 (pre-war levels) but petrol/diesel still 48%/38% above pre-war. Oil = ~30% of import bill. Any re-escalation = immediate PKR pressure." },
  { factor: "FX Reserves Buffer", score: 35, color: COLORS.green, text: "SBP reserves $17.2B (2.7 months cover). Target $18B by FY26 end. Adequate but not comfortable. IMF disbursements supporting buildup." },
  { factor: "Remittance Support", score: 25, color: COLORS.green, text: "Record $4.25B monthly. FY26 on track for $41B+. Strong structural support from 10M+ overseas Pakistanis. Reduces depreciation pressure." },
  { factor: "IMF Anchor", score: 30, color: COLORS.green, text: "EFF program on track. 3rd review complete. Provides $7B over 37 months. Strong conditionality prevents disorderly depreciation. Structural reform support." },
];

const PKR_SCENARIOS = [
  { scenario: "Bull — PKR Holds", probability: "15%", range: "275–282", description: "Oil stays below $75, remittances sustain $4B+/month, IMF stays on track, CAD surplus continues. REER normalizes as inflation falls.", color: COLORS.green },
  { scenario: "Base — Managed Depreciation", probability: "60%", range: "285–300", description: "Gradual 5-8% annual depreciation. SBP manages pace. Inflation differential persists. Reserves build to $18-20B. IMF program continues.", color: COLORS.amber },
  { scenario: "Bear — Sharp Depreciation", probability: "25%", range: "310–340", description: "Oil re-escalation, IMF program derailment, political instability, or reserves fall below $12B. Forced devaluation. REER correction sharp.", color: COLORS.red },
];

// ============================================================
// DATA: Recommendation
// ============================================================
const BULLISH_FACTORS = [
  "KSE-100 at 8.3x fwd P/E — 40.7% discount to regional peers (AKD)",
  "Dividend yield 6.1% — highest in emerging Asia",
  "Record remittances $4.25B/month; FY26 $41B+ trajectory",
  "FX reserves at $22.7B total; 2.7 months import cover; growing",
  "IMF EFF on track — 3rd review done, $4.8B disbursed of $7B",
  "GDP growth 3.7% FY26 — highest in 4 years; LSM +6.44%",
  "Current account surplus +$255M (11MFY26) vs -$1.62B deficit last year",
  "US-Iran peace deal — oil back to $74, Hormuz reopening",
  "Primary fiscal surplus 2.5% GDP — best in decades",
  "PKR remarkably stable at 278-279 for 12+ months",
  "Credit rating upgrades — Moody's Caa1, S&P B-, Fitch B- (all Stable)",
  "Broker consensus target 213,633 — avg 18.9% upside from current",
];

const BEARISH_RISKS = [
  "CPI inflation at 11.7% and rising — well above 5-7% SBP target",
  "Negative real interest rate at -0.2% — PKR depreciation pressure",
  "REER at 106.15 — 7-year high, PKR overvalued 6%+ in real terms",
  "Circular debt at Rs3.1T — structural fiscal and energy risk",
  "External debt $137.6B — 33.4% of GDP; refinancing risk",
  "Geopolitical fragility — US-Iran deal could unravel; India tension persists",
  "Cement dispatches -21% YoY — construction sector weakness",
  "Rate cut timeline uncertain — inflation may stay double-digit for months",
  "FBR tax target Rs15.26T ambitious — 13.7% growth vs FY26 miss",
  "Interest payments Rs7.8T = 45% of FY27 budget — fiscal rigidity",
  "LNG supply structurally weak — Qatar force majeure precedent",
  "Capital expenditure compression — Fitch warns on medium-term growth",
];

// ============================================================
// SHARED COMPONENTS
// ============================================================
function Signal({ color }) {
  return (
    <div style={{
      width: 8, height: 8, borderRadius: "50%",
      backgroundColor: color,
      boxShadow: `0 0 6px ${color}cc`,
      flexShrink: 0,
    }} />
  );
}

function Tag({ children, color }) {
  return (
    <span style={{
      display: "inline-block",
      fontFamily: "monospace",
      fontSize: 9,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      padding: "2px 7px",
      borderRadius: 3,
      backgroundColor: `${color}18`,
      color: color,
      border: `1px solid ${color}40`,
    }}>{children}</span>
  );
}

function KPICard({ label, value, change, sub, signal }) {
  const sigColor = signal === "green" ? COLORS.green : signal === "red" ? COLORS.red : signal === "amber" ? COLORS.amber : COLORS.blue;
  const valColor = signal === "green" ? COLORS.green : signal === "red" ? COLORS.red : signal === "amber" ? COLORS.amber : COLORS.white;
  return (
    <div style={{
      backgroundColor: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 6,
      padding: "14px 16px",
      position: "relative",
    }}>
      <div style={{ position: "absolute", top: 14, right: 14 }}><Signal color={sigColor} /></div>
      <div style={{
        fontFamily: "monospace", fontSize: 9.5, fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.1em",
        color: COLORS.textDim, marginBottom: 8, paddingRight: 16,
      }}>{label}</div>
      <div style={{
        fontFamily: "monospace", fontSize: 22, fontWeight: 700,
        color: valColor, marginBottom: 4,
      }}>{value}</div>
      <div style={{
        fontFamily: "monospace", fontSize: 10, color: COLORS.textDim, marginBottom: 2,
      }}>{change}</div>
      <div style={{ fontSize: 10, color: COLORS.textMuted }}>{sub}</div>
    </div>
  );
}

function LineChart({ data, keyName, color, maxVal, minVal, height, unit }) {
  const w = 760, h = height || 200, pad = 50;
  const vals = data.map(d => d[keyName]);
  const max = maxVal !== undefined ? maxVal : Math.max(...vals) * 1.1;
  const min = minVal !== undefined ? minVal : Math.min(...vals) * 0.9;
  const range = max - min || 1;
  const stepX = (w - pad * 2) / (data.length - 1);
  const points = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((d[keyName] - min) / range) * (h - pad * 2);
    return { x, y, val: d[keyName], label: d.period };
  });
  const polyline = points.map(p => `${p.x},${p.y}`).join(" ");
  const areaPath = `M ${points[0].x},${h - pad} ` + points.map(p => `L ${p.x},${p.y}`).join(" ") + ` L ${points[points.length-1].x},${h-pad} Z`;
  const gradId = `grad-${keyName}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = pad + t * (h - pad * 2);
        const v = (max - t * range).toFixed(1);
        return (
          <g key={i}>
            <line x1={pad} y1={y} x2={w - pad} y2={y} stroke={COLORS.border} strokeWidth="0.5" />
            <text x={pad - 8} y={y + 3} fontSize="9" fontFamily="monospace" fill={COLORS.textMuted} textAnchor="end">{v}{unit || ""}</text>
          </g>
        );
      })}
      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradId})`} />
      {/* Line */}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" />
      {/* Dots */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill={color} stroke={COLORS.surface} strokeWidth="1.5" />
          <text x={p.x} y={p.y - 10} fontSize="9" fontFamily="monospace" fill={color} textAnchor="middle" fontWeight="700">{typeof p.val === "number" ? p.val.toFixed(1) : p.val}</text>
          <text x={p.x} y={h - pad + 18} fontSize="9" fontFamily="monospace" fill={COLORS.textDim} textAnchor="middle">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

function MiniBar({ val, max, color, label }) {
  const h = 80;
  const barH = Math.max(2, (Math.abs(val) / max) * h);
  const isNeg = val < 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{
        fontFamily: "monospace", fontSize: 12, fontWeight: 700,
        color: isNeg ? COLORS.red : COLORS.green,
      }}>{val > 0 ? "+" : ""}{val}{label && label.includes("%") ? "%" : ""}</div>
      <div style={{ height: h, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
        <div style={{
          width: 36, height: barH, backgroundColor: color || (isNeg ? COLORS.red : COLORS.green),
          borderRadius: "3px 3px 0 0",
        }} />
      </div>
      <div style={{ fontFamily: "monospace", fontSize: 8, color: COLORS.textDim, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

function ScoreRow({ name, score, color, verdict }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
      <div style={{ width: 120, fontFamily: "monospace", fontSize: 10, color: COLORS.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>{name}</div>
      <div style={{ flex: 1, maxWidth: 110, height: 10, backgroundColor: COLORS.surface2, borderRadius: 5, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", backgroundColor: color, borderRadius: 5 }} />
      </div>
      <div style={{ width: 36, fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: color, textAlign: "right" }}>{score}%</div>
      <div style={{ flex: 1, fontFamily: "monospace", fontSize: 9.5, color: COLORS.textDim }}>{verdict}</div>
    </div>
  );
}

function GeoCard({ icon, title, tag, type, body, impact, impactColor }) {
  return (
    <div style={{
      backgroundColor: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 6,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 6,
          backgroundColor: `${type}18`, border: `1px solid ${type}40`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.white }}>{title}</div>
          <Tag color={type}>{tag}</Tag>
        </div>
      </div>
      <div style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.6 }}>{body}</div>
      <div style={{
        fontSize: 10, fontFamily: "monospace", color: impactColor,
        padding: "6px 10px", backgroundColor: `${impactColor}10`,
        borderLeft: `3px solid ${impactColor}`, borderRadius: "0 4px 4px 0",
      }}>{impact}</div>
    </div>
  );
}

function InstitutionalCard({ org, icon, tag, tagColor, headline, body, metrics, impact, impactColor }) {
  return (
    <div style={{
      backgroundColor: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderLeft: `4px solid ${impactColor}`,
      borderRadius: 6,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          backgroundColor: COLORS.surface2, border: `1px solid ${COLORS.borderLight}`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gold, fontFamily: "monospace" }}>{org}</div>
          <Tag color={tagColor}>{tag}</Tag>
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.white, lineHeight: 1.4 }}>{headline}</div>
      <div style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.6 }}>{body}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 4 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ backgroundColor: COLORS.surface2, borderRadius: 4, padding: "8px 6px", textAlign: "center" }}>
            <div style={{ fontFamily: "monospace", fontSize: 8, color: COLORS.textDim, textTransform: "uppercase", marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{
        fontSize: 10, fontFamily: "monospace", color: impactColor,
        padding: "6px 10px", backgroundColor: `${impactColor}10`,
        borderLeft: `3px solid ${impactColor}`, borderRadius: "0 4px 4px 0",
      }}>{impact}</div>
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <div style={{
      fontFamily: "monospace", fontSize: 9, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: "0.15em",
      color: COLORS.textDim, paddingBottom: 8, marginBottom: 12,
      borderBottom: `1px solid ${COLORS.border}`,
    }}>{children}</div>
  );
}

function PanelHeader({ children }) {
  return (
    <div style={{
      backgroundColor: COLORS.surface2,
      padding: "8px 14px", borderRadius: "6px 6px 0 0",
      fontFamily: "monospace", fontSize: 10, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: "0.1em",
      color: COLORS.gold,
      borderBottom: `1px solid ${COLORS.border}`,
    }}>{children}</div>
  );
}

function TH({ children, style }) {
  return (
    <th style={{
      fontFamily: "monospace", fontSize: 9, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: "0.05em",
      color: COLORS.textDim, padding: "8px 10px", textAlign: "left",
      borderBottom: `1px solid ${COLORS.border}`,
      ...style,
    }}>{children}</th>
  );
}

function TD({ children, style, color }) {
  return (
    <td style={{
      fontFamily: "monospace", fontSize: 11,
      color: color || COLORS.text, padding: "7px 10px",
      borderBottom: `1px solid ${COLORS.border}80`,
      ...style,
    }}>{children}</td>
  );
}

// ============================================================
// MAIN DASHBOARD COMPONENT
// ============================================================
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "OVERVIEW" },
    { id: "sbp", label: "SBP & RATES" },
    { id: "markets", label: "MARKETS" },
    { id: "economy", label: "REAL ECONOMY" },
    { id: "external", label: "EXTERNAL SECTOR" },
    { id: "brokers", label: "BROKER CALLS" },
    { id: "institutions", label: "IMF / SBP / WB" },
    { id: "risks", label: "RISKS & THEMES" },
    { id: "budget", label: "BUDGET FY27" },
    { id: "trajectory", label: "SIGNAL TRAJECTORY" },
    { id: "pkr", label: "PKR OUTLOOK" },
    { id: "recommendation", label: "RECOMMENDATION" },
  ];

  // Determine recommendation verdict
  const recVerdict = AVG_SCORE >= 75 ? "INVEST MORE — CONSTRUCTIVE" : AVG_SCORE >= 60 ? "INVEST MORE — CONSTRUCTIVE" : AVG_SCORE >= 45 ? "STAY INVESTED — SELECTIVE" : "CONSIDER LIQUIDATING";
  const recColor = AVG_SCORE >= 75 ? COLORS.green : AVG_SCORE >= 60 ? COLORS.green : AVG_SCORE >= 45 ? COLORS.amber : COLORS.red;

  const recTags = [
    { label: "✓ Valuation Cheap", color: COLORS.green },
    { label: "✓ IMF On Track", color: COLORS.green },
    { label: "✗ Inflation Rising", color: COLORS.red },
    { label: "~ Rates On Hold", color: COLORS.amber },
    { label: "✓ Reserves Growing", color: COLORS.green },
    { label: "~ REER Overvalued", color: COLORS.amber },
  ];

  return (
    <div style={{ backgroundColor: COLORS.bg, color: COLORS.text, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* ===== HEADER ===== */}
      <div style={{
        padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.surface,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: COLORS.gold, letterSpacing: "0.05em" }}>
              PAKISTAN MACRO INTELLIGENCE DASHBOARD
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 10, color: COLORS.textDim, marginTop: 4 }}>
              PSX / KSE-100 INVESTMENT DECISION FRAMEWORK | DATA AS OF JUN 25, 2026
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, fontFamily: "monospace", fontSize: 11 }}>
            <div><span style={{ color: COLORS.textDim }}>KSE-100:</span> <span style={{ color: COLORS.green, fontWeight: 700 }}>179,571</span></div>
            <div><span style={{ color: COLORS.textDim }}>SBP Rate:</span> <span style={{ color: COLORS.amber, fontWeight: 700 }}>11.50%</span></div>
            <div><span style={{ color: COLORS.textDim }}>CPI:</span> <span style={{ color: COLORS.red, fontWeight: 700 }}>11.66%</span></div>
            <div><span style={{ color: COLORS.textDim }}>PKR/USD:</span> <span style={{ color: COLORS.amber, fontWeight: 700 }}>278.30</span></div>
            <div><span style={{ color: COLORS.textDim }}>Score:</span> <span style={{ color: recColor, fontWeight: 700 }}>{AVG_SCORE}%</span></div>
          </div>
        </div>
      </div>

      {/* ===== RECOMMENDATION BANNER ===== */}
      <div style={{
        padding: "14px 24px",
        backgroundColor: `${recColor}10`,
        borderBottom: `1px solid ${COLORS.border}`,
        borderLeft: `4px solid ${recColor}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{
            fontFamily: "monospace", fontSize: 18, fontWeight: 700,
            color: recColor, letterSpacing: "0.03em",
          }}>{recVerdict}</div>
          <div style={{ fontSize: 12, color: COLORS.text, flex: 1, minWidth: 300, lineHeight: 1.5 }}>
            Pakistan's macro fundamentals are solidly constructive with 66.7% bull scorecard. Strong reserves ($22.7B), record remittances ($4.25B/mo), IMF compliance, and deeply discounted KSE-100 (8.3x P/E, 6.1% DY) outweigh near-term inflation concern (11.7%) and negative real rate. US-Iran peace deal is a key positive catalyst. Recommend selective accumulation on dips, overweight banks, E&P, fertilizer, and technology. Watch inflation trajectory, oil prices, and REER overvaluation for signs of deterioration.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          {recTags.map((t, i) => (
            <Tag key={i} color={t.color}>{t.label}</Tag>
          ))}
        </div>
      </div>

      {/* ===== TAB NAVIGATION ===== */}
      <div style={{
        display: "flex", gap: 0, overflowX: "auto",
        backgroundColor: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`,
        padding: "0 24px",
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "12px 16px", fontFamily: "monospace", fontSize: 10, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em",
              background: "none", border: "none", cursor: "pointer",
              color: activeTab === tab.id ? COLORS.gold : COLORS.textDim,
              borderBottom: activeTab === tab.id ? `2px solid ${COLORS.gold}` : "2px solid transparent",
              whiteSpace: "nowrap", transition: "color 0.2s",
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* ===== TAB CONTENT ===== */}
      <div style={{ padding: "20px 24px", maxWidth: 1400, margin: "0 auto" }}>

        {/* ===== TAB 1: OVERVIEW ===== */}
        {activeTab === "overview" && (
          <div>
            <SectionHeader>Key Performance Indicators — 18 Macro Variables</SectionHeader>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))",
              gap: 10, marginBottom: 24,
            }}>
              {KPIS.map((kpi, i) => (
                <KPICard key={i} {...kpi} />
              ))}
            </div>

            <SectionHeader>Investment Signal Scorecard — 12 Factor Analysis</SectionHeader>
            <div style={{
              backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
              borderRadius: 6, padding: 16, marginBottom: 24,
            }}>
              {SCORECARD.map((row, i) => (
                <ScoreRow key={i} {...row} />
              ))}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.border}`,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: COLORS.gold }}>
                  AVERAGE BULL SCORE
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: recColor }}>
                  {AVG_SCORE}%
                </div>
              </div>
            </div>

            <SectionHeader>PSX Sector Allocation Signal — 9 Sectors</SectionHeader>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 10, marginBottom: 24,
            }}>
              {SECTORS.map((sec, i) => (
                <div key={i} style={{
                  backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
                  borderRadius: 6, padding: 14,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.white }}>{sec.name}</div>
                    <Tag color={sec.color}>{sec.signal}</Tag>
                  </div>
                  <div style={{ fontSize: 10, color: COLORS.textDim, lineHeight: 1.5 }}>{sec.note}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== TAB 2: SBP & RATES ===== */}
        {activeTab === "sbp" && (
          <div>
            <SectionHeader>SBP Policy Rate Trajectory (%)</SectionHeader>
            <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16, marginBottom: 24 }}>
              <LineChart data={RATE_HISTORY} keyName="policyRate" color={COLORS.gold} minVal={0} maxVal={25} unit="%" height={220} />
            </div>

            <SectionHeader>CPI Inflation YoY (%) vs SBP Target Band</SectionHeader>
            <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16, marginBottom: 24 }}>
              <svg viewBox="0 0 760 220" style={{ width: "100%", height: "auto" }}>
                <defs>
                  <linearGradient id="cpiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.red} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={COLORS.red} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Target band 5-7% */}
                {(() => {
                  const pad = 50, h = 220, maxVal = 35, minVal = 0, range = maxVal - minVal;
                  const y5 = h - pad - ((5 - minVal) / range) * (h - pad * 2);
                  const y7 = h - pad - ((7 - minVal) / range) * (h - pad * 2);
                  return [
                    <line key="l1" x1={pad} y1={y5} x2={760-pad} y2={y5} stroke={COLORS.green} strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />,
                    <text key="t1" x={760-pad+5} y={y5+3} fontSize="9" fontFamily="monospace" fill={COLORS.green}>5%</text>,
                    <line key="l2" x1={pad} y1={y7} x2={760-pad} y2={y7} stroke={COLORS.green} strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />,
                    <text key="t2" x={760-pad+5} y={y7+3} fontSize="9" fontFamily="monospace" fill={COLORS.green}>7%</text>,
                  ];
                })()}
                {(() => {
                  const pad = 50, h = 220, maxVal = 35, minVal = 0, range = maxVal - minVal;
                  const stepX = (760 - pad * 2) / (RATE_HISTORY.length - 1);
                  const points = RATE_HISTORY.map((d, i) => ({
                    x: pad + i * stepX,
                    y: h - pad - ((d.cpi - minVal) / range) * (h - pad * 2),
                    val: d.cpi, label: d.period,
                  }));
                  const polyline = points.map(p => `${p.x},${p.y}`).join(" ");
                  const areaPath = `M ${points[0].x},${h-pad} ` + points.map(p => `L ${p.x},${p.y}`).join(" ") + ` L ${points[points.length-1].x},${h-pad} Z`;
                  return [
                    <path key="area" d={areaPath} fill="url(#cpiGrad)" />,
                    <polyline key="line" points={polyline} fill="none" stroke={COLORS.red} strokeWidth="2" />,
                    ...points.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="3.5" fill={COLORS.red} stroke={COLORS.surface} strokeWidth="1.5" />
                        <text x={p.x} y={p.y - 10} fontSize="9" fontFamily="monospace" fill={COLORS.red} textAnchor="middle" fontWeight="700">{p.val.toFixed(1)}</text>
                        <text x={p.x} y={h - pad + 18} fontSize="9" fontFamily="monospace" fill={COLORS.textDim} textAnchor="middle">{p.label}</text>
                      </g>
                    )),
                  ];
                })()}
              </svg>
            </div>

            <SectionHeader>Rate &amp; Inflation History</SectionHeader>
            <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, overflow: "hidden", marginBottom: 24 }}>
              <PanelHeader>Period | Policy Rate | CPI Inflation | Real Rate | Assessment</PanelHeader>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <TH>PERIOD</TH><TH>POLICY RATE</TH><TH>CPI INFLATION</TH><TH>REAL RATE</TH><TH>ASSESSMENT</TH>
                  </tr>
                </thead>
                <tbody>
                  {RATE_HISTORY.map((r, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "transparent" : `${COLORS.surface2}80` }}>
                      <TD>{r.period}</TD>
                      <TD color={COLORS.gold}>{r.policyRate.toFixed(1)}%</TD>
                      <TD color={r.cpi > 7 ? COLORS.red : COLORS.green}>{r.cpi.toFixed(1)}%</TD>
                      <TD color={r.realRate >= 0 ? COLORS.green : COLORS.red}>{r.realRate > 0 ? "+" : ""}{r.realRate.toFixed(1)}%</TD>
                      <TD><Tag color={r.tagColor}>{r.assessment}</Tag></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SectionHeader>Forward Guidance</SectionHeader>
            <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, overflow: "hidden", marginBottom: 24 }}>
              <PanelHeader>Horizon | Rate Projection | Range | Consensus | Implication</PanelHeader>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr><TH>HORIZON</TH><TH>PROJECTION</TH><TH>RANGE</TH><TH>CONSENSUS</TH><TH>IMPLICATION</TH></tr>
                </thead>
                <tbody>
                  {FORWARD_GUIDANCE.map((f, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "transparent" : `${COLORS.surface2}80` }}>
                      <TD color={COLORS.white}>{f.horizon}</TD>
                      <TD color={COLORS.gold}>{f.projection}</TD>
                      <TD color={COLORS.textDim}>{f.range}</TD>
                      <TD color={COLORS.blue}>{f.consensus}</TD>
                      <TD><Tag color={f.tagColor}>{f.implication}</Tag></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== TAB 3: MARKETS ===== */}
        {activeTab === "markets" && (
          <div>
            <SectionHeader>KSE-100 Index Trajectory</SectionHeader>
            <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16, marginBottom: 24 }}>
              <LineChart data={MARKET_HISTORY} keyName="kse100" color={COLORS.green} minVal={30000} maxVal={200000} height={220} />
            </div>

            <SectionHeader>FX Reserves Trajectory ($ Billion)</SectionHeader>
            <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16, marginBottom: 24 }}>
              <LineChart data={MARKET_HISTORY} keyName="fxReserves" color={COLORS.blue} minVal={5} maxVal={20} unit="B" height={220} />
            </div>

            <SectionHeader>Market Data History</SectionHeader>
            <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, overflow: "hidden", marginBottom: 24 }}>
              <PanelHeader>Period | KSE-100 | Change% | PKR/USD | FX Reserves | Fwd P/E | Assessment</PanelHeader>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                  <thead>
                    <tr><TH>PERIOD</TH><TH>KSE-100</TH><TH>CHANGE%</TH><TH>PKR/USD</TH><TH>FX RES.</TH><TH>FWD P/E</TH><TH>ASSESSMENT</TH></tr>
                  </thead>
                  <tbody>
                    {MARKET_HISTORY.map((r, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "transparent" : `${COLORS.surface2}80` }}>
                        <TD>{r.period}</TD>
                        <TD color={COLORS.white}>{r.kse100.toLocaleString()}</TD>
                        <TD color={r.change >= 0 ? COLORS.green : COLORS.red}>{r.change > 0 ? "+" : ""}{r.change.toFixed(1)}%</TD>
                        <TD color={COLORS.amber}>{r.pkrUsd}</TD>
                        <TD color={COLORS.blue}>${r.fxReserves.toFixed(1)}B</TD>
                        <TD color={COLORS.gold}>{r.fwdPE.toFixed(1)}x</TD>
                        <TD><Tag color={r.tagColor}>{r.assessment}</Tag></TD>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB 4: REAL ECONOMY ===== */}
        {activeTab === "economy" && (
          <div>
            <SectionHeader>Real Economy Activity Indicators</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { title: "Auto Sales YoY%", data: ECON_HISTORY.map(d => ({ period: d.period, autoYoY: d.autoYoY })), keyName: "autoYoY", max: 120 },
                { title: "LSM Index YoY%", data: ECON_HISTORY.map(d => ({ period: d.period, lsmYoY: d.lsmYoY })), keyName: "lsmYoY", max: 15 },
                { title: "Monthly Remittances ($B)", data: ECON_HISTORY.map(d => ({ period: d.period, remittances: d.remittances })), keyName: "remittances", max: 5 },
                { title: "Cement Dispatch YoY%", data: ECON_HISTORY.map(d => ({ period: d.period, cementYoY: d.cementYoY })), keyName: "cementYoY", max: 50 },
              ].map((chart, idx) => (
                <div key={idx} style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16 }}>
                  <PanelHeader>{chart.title}</PanelHeader>
                  <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 120, padding: "12px 0", overflowX: "auto" }}>
                    {chart.data.map((d, i) => {
                      const val = d[chart.keyName];
                      const barH = Math.max(2, (Math.abs(val) / chart.max) * 100);
                      const isNeg = val < 0;
                      return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 40 }}>
                          <div style={{ fontFamily: "monospace", fontSize: 8, color: isNeg ? COLORS.red : COLORS.green, fontWeight: 700 }}>
                            {val > 0 ? "+" : ""}{val}
                          </div>
                          <div style={{ height: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                            <div style={{
                              width: 28, height: barH,
                              backgroundColor: isNeg ? COLORS.red : COLORS.green,
                              borderRadius: "3px 3px 0 0",
                            }} />
                          </div>
                          <div style={{ fontFamily: "monospace", fontSize: 7, color: COLORS.textDim }}>{d.period}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <SectionHeader>Real Economy Data Table</SectionHeader>
            <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, overflow: "hidden", marginBottom: 24 }}>
              <PanelHeader>Period | GDP | Auto YoY | Cement YoY | Remittances | LSM YoY | Signal</PanelHeader>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                  <thead>
                    <tr><TH>PERIOD</TH><TH>GDP GROWTH</TH><TH>AUTO YoY</TH><TH>CEMENT YoY</TH><TH>REMITTANCES</TH><TH>LSM YoY</TH><TH>SIGNAL</TH></tr>
                  </thead>
                  <tbody>
                    {ECON_HISTORY.map((r, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "transparent" : `${COLORS.surface2}80` }}>
                        <TD>{r.period}</TD>
                        <TD color={COLORS.gold}>{r.gdp.toFixed(1)}%</TD>
                        <TD color={r.autoYoY >= 0 ? COLORS.green : COLORS.red}>{r.autoYoY > 0 ? "+" : ""}{r.autoYoY}%</TD>
                        <TD color={r.cementYoY >= 0 ? COLORS.green : COLORS.red}>{r.cementYoY > 0 ? "+" : ""}{r.cementYoY}%</TD>
                        <TD color={COLORS.blue}>${r.remittances.toFixed(1)}B</TD>
                        <TD color={r.lsmYoY >= 0 ? COLORS.green : COLORS.red}>{r.lsmYoY > 0 ? "+" : ""}{r.lsmYoY.toFixed(1)}%</TD>
                        <TD><Signal color={r.signal === "green" ? COLORS.green : r.signal === "red" ? COLORS.red : COLORS.amber} /></TD>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB 5: EXTERNAL SECTOR ===== */}
        {activeTab === "external" && (
          <div>
            <SectionHeader>Gross FX Reserves Trajectory ($B)</SectionHeader>
            <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16, marginBottom: 24 }}>
              <LineChart data={EXTERNAL_HISTORY} keyName="fxReserves" color={COLORS.blue} minVal={4} maxVal={20} unit="B" height={220} />
            </div>

            <SectionHeader>Monthly Remittances ($B)</SectionHeader>
            <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16, marginBottom: 24 }}>
              <LineChart data={EXTERNAL_HISTORY} keyName="remittances" color={COLORS.green} minVal={1} maxVal={5} unit="B" height={220} />
            </div>

            <SectionHeader>External Sector Data Table</SectionHeader>
            <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, overflow: "hidden", marginBottom: 24 }}>
              <PanelHeader>Period | FX Reserves | Remittances | Exports | CAD (% GDP) | Assessment</PanelHeader>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                  <thead>
                    <tr><TH>PERIOD</TH><TH>FX RESERVES</TH><TH>REMITTANCES</TH><TH>EXPORTS</TH><TH>CAD (% GDP)</TH><TH>ASSESSMENT</TH></tr>
                  </thead>
                  <tbody>
                    {EXTERNAL_HISTORY.map((r, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "transparent" : `${COLORS.surface2}80` }}>
                        <TD>{r.period}</TD>
                        <TD color={COLORS.blue}>${r.fxReserves.toFixed(1)}B</TD>
                        <TD color={COLORS.green}>${r.remittances.toFixed(1)}B</TD>
                        <TD color={COLORS.amber}>${r.exports.toFixed(1)}B</TD>
                        <TD color={r.cadGdp >= 0 ? COLORS.green : COLORS.red}>{r.cadGdp > 0 ? "+" : ""}{r.cadGdp.toFixed(1)}%</TD>
                        <TD><Tag color={r.tagColor}>{r.assessment}</Tag></TD>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB 6: BROKER CALLS ===== */}
        {activeTab === "brokers" && (
          <div>
            <SectionHeader>Analyst Coverage — Major Pakistan Brokerages</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 12, marginBottom: 24 }}>
              {BROKERS.map((b, i) => (
                <div key={i} style={{
                  backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
                  borderRadius: 6, padding: 16,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: COLORS.gold }}>{b.firm}</div>
                    <Tag color={b.color}>{b.rating}</Tag>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 9, color: COLORS.textDim, textTransform: "uppercase" }}>Target</div>
                      <div style={{ fontFamily: "monospace", fontSize: 24, fontWeight: 700, color: COLORS.green }}>{b.target}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 9, color: COLORS.textDim, textTransform: "uppercase" }}>Upside</div>
                      <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: COLORS.green }}>+{b.upside.toFixed(1)}%</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Tag color={b.color}>{b.verdict}</Tag>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.6 }}>{b.note}</div>
                </div>
              ))}
            </div>

            <SectionHeader>Consensus Summary</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, marginBottom: 24 }}>
              {[
                { label: "Avg Target", value: BROKER_CONSENSUS.avgTarget, color: COLORS.green },
                { label: "Bull / Neutral / Bear", value: `${BROKER_CONSENSUS.bullCount} / ${BROKER_CONSENSUS.neutralCount} / ${BROKER_CONSENSUS.bearCount}`, color: COLORS.green },
                { label: "Current KSE-100", value: BROKER_CONSENSUS.currentKse, color: COLORS.white },
                { label: "Fwd P/E", value: BROKER_CONSENSUS.fwdPE, color: COLORS.gold },
                { label: "Dividend Yield", value: BROKER_CONSENSUS.divYield, color: COLORS.green },
                { label: "Key Catalyst", value: BROKER_CONSENSUS.keyCatalyst, color: COLORS.blue },
              ].map((item, i) => (
                <div key={i} style={{
                  backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
                  borderRadius: 6, padding: 14,
                }}>
                  <div style={{ fontFamily: "monospace", fontSize: 9, color: COLORS.textDim, textTransform: "uppercase", marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== TAB 7: IMF / SBP / WB ===== */}
        {activeTab === "institutions" && (
          <div>
            <SectionHeader>Institutional Framework &amp; Guidance</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 12, marginBottom: 24 }}>
              {INSTITUTIONAL.map((inst, i) => (
                <InstitutionalCard key={i} {...inst} />
              ))}
            </div>
          </div>
        )}

        {/* ===== TAB 8: RISKS & THEMES ===== */}
        {activeTab === "risks" && (
          <div>
            <SectionHeader>Geopolitical Risks &amp; Macro Themes</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12, marginBottom: 24 }}>
              {GEOPOLITICAL.map((g, i) => (
                <GeoCard key={i} {...g} />
              ))}
            </div>
          </div>
        )}

        {/* ===== TAB 9: BUDGET FY27 ===== */}
        {activeTab === "budget" && (
          <div>
            <div style={{
              backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
              borderLeft: `4px solid ${COLORS.amber}`, borderRadius: 6, padding: 16, marginBottom: 24,
            }}>
              <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: COLORS.amber, marginBottom: 8 }}>
                BUDGET FY27 VERDICT: IMF-ALIGNED, FISCALLY DISCIPLINED, BUT REVENUE AMBITIOUS
              </div>
              <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6, marginBottom: 10 }}>
                The FY27 budget maintains fiscal discipline under the IMF EFF framework with a primary surplus target of 2.0% GDP and overall deficit of 3.6% GDP. FBR tax target of Rs15.26T (+13.7%) is ambitious given FY26's 0.7pp GDP shortfall. Interest payments consume 45% of the budget. PSDP increase (+13%) is positive for construction-linked sectors. Net assessment: market-neutral to slightly positive, contingent on FBR performance.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Tag color={COLORS.green}>PSDP +13%</Tag>
                <Tag color={COLORS.amber}>FBR +13.7%</Tag>
                <Tag color={COLORS.red}>Interest 45%</Tag>
                <Tag color={COLORS.amber}>Deficit 3.6%</Tag>
                <Tag color={COLORS.green}>Primary Surplus 2.0%</Tag>
              </div>
            </div>

            <SectionHeader>Budget FY27 — Key Metrics</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))", gap: 10, marginBottom: 24 }}>
              {BUDGET_KPIS.map((kpi, i) => <KPICard key={i} {...kpi} />)}
            </div>

            <SectionHeader>Key Budget Proposals &amp; PSX Impact</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10, marginBottom: 24 }}>
              {BUDGET_PROPOSALS.map((p, i) => (
                <div key={i} style={{
                  backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
                  borderLeft: `3px solid ${p.signal === "green" ? COLORS.green : p.signal === "red" ? COLORS.red : COLORS.amber}`,
                  borderRadius: 6, padding: 14,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.white, marginBottom: 6 }}>{p.title}</div>
                  <div style={{ fontSize: 10, color: COLORS.textDim, marginBottom: 6 }}>{p.desc}</div>
                  <div style={{ fontSize: 10, color: COLORS.text, marginBottom: 8 }}>{p.psxImpact}</div>
                  <Signal color={p.signal === "green" ? COLORS.green : p.signal === "red" ? COLORS.red : COLORS.amber} />
                </div>
              ))}
            </div>

            <SectionHeader>Sector Impact Matrix</SectionHeader>
            <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, overflow: "hidden", marginBottom: 24 }}>
              <PanelHeader>Sector | Impact | Key Risk/Catalyst | Signal</PanelHeader>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr><TH>SECTOR</TH><TH>IMPACT</TH><TH>RISK / CATALYST</TH><TH>SIGNAL</TH></tr>
                </thead>
                <tbody>
                  {BUDGET_SECTOR_IMPACT.map((s, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "transparent" : `${COLORS.surface2}80` }}>
                      <TD color={COLORS.white}>{s.sector}</TD>
                      <TD color={s.signal === "green" ? COLORS.green : s.signal === "red" ? COLORS.red : COLORS.amber}>{s.impact}</TD>
                      <TD>{s.risk}</TD>
                      <TD><Tag color={s.signal === "green" ? COLORS.green : s.signal === "red" ? COLORS.red : COLORS.amber}>{s.signal.toUpperCase()}</Tag></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SectionHeader>Budget Day Scenarios</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              {BUDGET_SCENARIOS.map((s, i) => (
                <div key={i} style={{
                  backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
                  borderTop: `3px solid ${s.color}`, borderRadius: 6, padding: 16,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: s.color }}>{s.scenario}</div>
                    <Tag color={s.color}>{s.probability}</Tag>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.text, marginBottom: 10, lineHeight: 1.5 }}>{s.description}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 9, color: COLORS.textDim, textTransform: "uppercase" }}>KSE-100 Range</div>
                  <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: s.color }}>{s.kseRange}</div>
                </div>
              ))}
            </div>

            <SectionHeader>IMF Fiscal Framework — Key Metrics</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, marginBottom: 24 }}>
              {IMF_FISCAL_FRAMEWORK.map((m, i) => (
                <div key={i} style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 14 }}>
                  <div style={{ fontFamily: "monospace", fontSize: 9, color: COLORS.textDim, textTransform: "uppercase", marginBottom: 6 }}>{m.label}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== TAB 10: SIGNAL TRAJECTORY ===== */}
        {activeTab === "trajectory" && (() => {
          const lastBullPct = TRAJECTORY_SUMMARY[TRAJECTORY_SUMMARY.length - 1].bullPct;
          const firstBullPct = TRAJECTORY_SUMMARY[0].bullPct;
          const totalChange = lastBullPct - firstBullPct;
          const trendDir = totalChange > 5 ? "IMPROVING" : totalChange < -5 ? "DETERIORATING" : "FLAT";
          const trendColor = totalChange > 5 ? COLORS.green : totalChange < -5 ? COLORS.red : COLORS.amber;

          const flippedBear = TRAJECTORY_INDICATORS.filter(ind => ind.signals[0] && !ind.signals[5]);
          const flippedBull = TRAJECTORY_INDICATORS.filter(ind => !ind.signals[0] && ind.signals[5]);
          const alwaysBull = TRAJECTORY_INDICATORS.filter(ind => ind.signals.every(s => s));
          const alwaysBear = TRAJECTORY_INDICATORS.filter(ind => !ind.signals.some(s => s));

          const categories = ["macro", "external", "markets", "activity", "sentiment"];
          const catBullPct = categories.map(cat => {
            const catInds = TRAJECTORY_INDICATORS.filter(ind => ind.category === cat);
            const bullCount = catInds.filter(ind => ind.signals[5]).length;
            return { cat, bullPct: Math.round((bullCount / catInds.length) * 100), total: catInds.length, bull: bullCount };
          });

          return (
            <div>
              {/* Summary strip */}
              <SectionHeader>Monthly Bull % Summary</SectionHeader>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 24 }}>
                {TRAJECTORY_SUMMARY.map((s, i) => {
                  const prevPct = i > 0 ? TRAJECTORY_SUMMARY[i - 1].bullPct : s.bullPct;
                  const moMChange = s.bullPct - prevPct;
                  const sColor = s.bullPct >= 65 ? COLORS.green : s.bullPct >= 50 ? COLORS.amber : COLORS.red;
                  return (
                    <div key={i} style={{
                      backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
                      borderRadius: 6, padding: 12, textAlign: "center",
                    }}>
                      <div style={{ fontFamily: "monospace", fontSize: 9, color: COLORS.textDim, textTransform: "uppercase" }}>{s.month}</div>
                      <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, color: sColor, margin: "4px 0" }}>{s.bullPct}%</div>
                      <div style={{ fontFamily: "monospace", fontSize: 9, color: COLORS.textDim }}>{s.bullCount}/{s.total} bull</div>
                      <div style={{ fontFamily: "monospace", fontSize: 9, color: moMChange > 0 ? COLORS.green : moMChange < 0 ? COLORS.red : COLORS.textDim }}>
                        {moMChange > 0 ? "+" : ""}{moMChange}pp MoM
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Trend verdict banner */}
              <div style={{
                backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
                borderLeft: `4px solid ${trendColor}`, borderRadius: 6, padding: 16, marginBottom: 24,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: trendColor, marginBottom: 8 }}>
                  6-MONTH TREND: {trendDir} ({totalChange > 0 ? "+" : ""}{totalChange}pp net change)
                </div>
                <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6 }}>
                  From January's peak bull score of {firstBullPct}% (all 12 indicators bullish), the trajectory deteriorated to {lastBullPct}% in June. The US-Iran war (Feb 28–Jun 20) caused the sharpest deterioration, pushing inflation to 11.7%, triggering a 100bps rate hike, and disrupting Hormuz/LNG supply. Recovery began in May with the US-Iran peace deal. <strong style={{ color: COLORS.amber }}>{flippedBear.length}</strong> indicators turned bearish, <strong style={{ color: COLORS.green }}>{flippedBull.length}</strong> turned bullish, <strong style={{ color: COLORS.green }}>{alwaysBull.length}</strong> stayed bullish throughout, and <strong style={{ color: COLORS.red }}>{alwaysBear.length}</strong> stayed bearish.
                </div>
              </div>

              {/* SVG trend line chart */}
              <SectionHeader>Bull % Trajectory — 6 Month Trend</SectionHeader>
              <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16, marginBottom: 24 }}>
                <svg viewBox="0 0 760 220" style={{ width: "100%", height: "auto" }}>
                  <defs>
                    <linearGradient id="trajGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.gold} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={COLORS.gold} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {(() => {
                    const pad = 50, h = 220, maxVal = 105, minVal = 40, range = maxVal - minVal;
                    const stepX = (760 - pad * 2) / (TRAJECTORY_SUMMARY.length - 1);
                    const points = TRAJECTORY_SUMMARY.map((s, i) => ({
                      x: pad + i * stepX,
                      y: h - pad - ((s.bullPct - minVal) / range) * (h - pad * 2),
                      val: s.bullPct, label: s.month,
                    }));
                    const polyline = points.map(p => `${p.x},${p.y}`).join(" ");
                    const areaPath = `M ${points[0].x},${h-pad} ` + points.map(p => `L ${p.x},${p.y}`).join(" ") + ` L ${points[points.length-1].x},${h-pad} Z`;
                    const y50 = h - pad - ((50 - minVal) / range) * (h - pad * 2);
                    const y65 = h - pad - ((65 - minVal) / range) * (h - pad * 2);
                    return [
                      <path key="area" d={areaPath} fill="url(#trajGrad)" />,
                      <line key="l50" x1={pad} y1={y50} x2={760-pad} y2={y50} stroke={COLORS.amber} strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />,
                      <text key="t50" x={760-pad+5} y={y50+3} fontSize="9" fontFamily="monospace" fill={COLORS.amber}>50%</text>,
                      <line key="l65" x1={pad} y1={y65} x2={760-pad} y2={y65} stroke={COLORS.green} strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />,
                      <text key="t65" x={760-pad+5} y={y65+3} fontSize="9" fontFamily="monospace" fill={COLORS.green}>65%</text>,
                      <polyline key="line" points={polyline} fill="none" stroke={COLORS.gold} strokeWidth="2.5" />,
                      ...points.map((p, i) => (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r="4" fill={COLORS.gold} stroke={COLORS.surface} strokeWidth="2" />
                          <text x={p.x} y={p.y - 12} fontSize="10" fontFamily="monospace" fill={COLORS.gold} textAnchor="middle" fontWeight="700">{p.val}%</text>
                          <text x={p.x} y={h - pad + 18} fontSize="9" fontFamily="monospace" fill={COLORS.textDim} textAnchor="middle">{p.label}</text>
                        </g>
                      )),
                    ];
                  })()}
                </svg>
              </div>

              {/* Per-indicator matrix table */}
              <SectionHeader>Per-Indicator Signal Matrix</SectionHeader>
              <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, overflow: "hidden", marginBottom: 24 }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                    <thead>
                      <tr>
                        <TH>INDICATOR</TH>
                        <TH>THRESHOLD</TH>
                        <TH>CATEGORY</TH>
                        {TRAJECTORY_MONTHS.map((m, i) => <TH key={i} style={{ textAlign: "center" }}>{m}</TH>)}
                        <TH style={{ textAlign: "center" }}>6M TREND</TH>
                      </tr>
                    </thead>
                    <tbody>
                      {TRAJECTORY_INDICATORS.map((ind, idx) => {
                        const startBull = ind.signals[0];
                        const endBull = ind.signals[5];
                        let trendLabel, trendColor;
                        if (startBull && endBull) { trendLabel = "STAY BULL"; trendColor = COLORS.green; }
                        else if (!startBull && !endBull) { trendLabel = "STAY BEAR"; trendColor = COLORS.red; }
                        else if (!startBull && endBull) { trendLabel = "FLIPPED BULL"; trendColor = COLORS.green; }
                        else { trendLabel = "FLIPPED BEAR"; trendColor = COLORS.red; }
                        return (
                          <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "transparent" : `${COLORS.surface2}80` }}>
                            <TD color={COLORS.white}>{ind.name}</TD>
                            <TD style={{ fontSize: 9 }} color={COLORS.textDim}>{ind.desc}</TD>
                            <TD><Tag color={COLORS.blue}>{ind.category}</Tag></TD>
                            {ind.signals.map((sig, i) => (
                              <TD key={i} style={{ textAlign: "center" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                                  <Signal color={sig ? COLORS.green : COLORS.red} />
                                  <span style={{ fontSize: 8, fontFamily: "monospace", color: sig ? COLORS.green : COLORS.red }}>{ind.values[i]}</span>
                                </div>
                              </TD>
                            ))}
                            <TD style={{ textAlign: "center" }}><Tag color={trendColor}>{trendLabel}</Tag></TD>
                          </tr>
                        );
                      })}
                      <tr style={{ backgroundColor: COLORS.surface2, borderTop: `2px solid ${COLORS.borderLight}` }}>
                        <TD color={COLORS.gold} style={{ fontWeight: 700 }}>BULL COUNT</TD>
                        <TD></TD><TD></TD>
                        {TRAJECTORY_SUMMARY.map((s, i) => (
                          <TD key={i} style={{ textAlign: "center" }} color={COLORS.gold}>{s.bullCount}/{s.total}</TD>
                        ))}
                        <TD></TD>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Insight panels */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div>
                  <SectionHeader>Turned Bearish</SectionHeader>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {flippedBear.length === 0 && <div style={{ fontSize: 11, color: COLORS.textDim }}>None</div>}
                    {flippedBear.map((ind, i) => (
                      <div key={i} style={{
                        backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
                        borderLeft: `3px solid ${COLORS.red}`, borderRadius: 6, padding: 12,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.white }}>{ind.name}</div>
                          <Tag color={COLORS.red}>BEAR</Tag>
                        </div>
                        <div style={{ fontFamily: "monospace", fontSize: 10, color: COLORS.textDim, marginBottom: 6 }}>
                          {ind.values[0]} → {ind.values[5]}
                        </div>
                        <div style={{ fontSize: 10, color: COLORS.text, lineHeight: 1.5 }}>{ind.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <SectionHeader>Turned Bullish / Always Bullish / Always Bearish</SectionHeader>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {flippedBull.map((ind, i) => (
                      <div key={i} style={{
                        backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
                        borderLeft: `3px solid ${COLORS.green}`, borderRadius: 6, padding: 12,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.white }}>{ind.name}</div>
                          <Tag color={COLORS.green}>FLIPPED BULL</Tag>
                        </div>
                        <div style={{ fontSize: 10, color: COLORS.textDim }}>{ind.values[0]} → {ind.values[5]}</div>
                      </div>
                    ))}
                    {alwaysBull.length > 0 && (
                      <div style={{
                        backgroundColor: `${COLORS.green}10`, border: `1px solid ${COLORS.green}40`,
                        borderRadius: 6, padding: 12,
                      }}>
                        <div style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: COLORS.green, marginBottom: 6 }}>ALWAYS BULLISH ({alwaysBull.length})</div>
                        {alwaysBull.map((ind, i) => (
                          <div key={i} style={{ fontSize: 11, color: COLORS.text, marginBottom: 3 }}>✓ {ind.name}</div>
                        ))}
                      </div>
                    )}
                    {alwaysBear.length > 0 && (
                      <div style={{
                        backgroundColor: `${COLORS.red}10`, border: `1px solid ${COLORS.red}40`,
                        borderRadius: 6, padding: 12,
                      }}>
                        <div style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: COLORS.red, marginBottom: 6 }}>ALWAYS BEARISH ({alwaysBear.length})</div>
                        {alwaysBear.map((ind, i) => (
                          <div key={i} style={{ fontSize: 11, color: COLORS.text, marginBottom: 3 }}>✗ {ind.name}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Category breakdown */}
              <SectionHeader>Category Breakdown — Latest Month Bull %</SectionHeader>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 24 }}>
                {catBullPct.map((c, i) => {
                  const cColor = c.bullPct >= 65 ? COLORS.green : c.bullPct >= 50 ? COLORS.amber : COLORS.red;
                  return (
                    <div key={i} style={{
                      backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
                      borderRadius: 6, padding: 14, textAlign: "center",
                    }}>
                      <div style={{ fontFamily: "monospace", fontSize: 9, color: COLORS.textDim, textTransform: "uppercase" }}>{c.cat}</div>
                      <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, color: cColor, margin: "4px 0" }}>{c.bullPct}%</div>
                      <div style={{ fontFamily: "monospace", fontSize: 9, color: COLORS.textDim }}>{c.bull}/{c.total} bull</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ===== TAB 11: PKR OUTLOOK ===== */}
        {activeTab === "pkr" && (
          <div>
            <div style={{
              backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
              borderLeft: `4px solid ${COLORS.red}`, borderRadius: 6, padding: 16, marginBottom: 24,
            }}>
              <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: COLORS.red, marginBottom: 8 }}>
                PKR VERDICT: MANAGED DEPRECIATION — GRADUAL CONVERT USD TO PKR IN TRANCHES
              </div>
              <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6 }}>
                PKR is overvalued with REER at 106.15 (7-year high) and negative real interest rate (-0.2%). Inflation differential of ~8pp with trading partners creates structural depreciation pressure. While reserves ($22.7B) and remittances ($4.25B/mo) provide near-term stability, the IMF-managed float suggests gradual 5-8% annual depreciation. <strong style={{ color: COLORS.amber }}>Recommend converting USD to PKR in 3 tranches</strong> to capture potential depreciation upside while maintaining USD exposure for external obligations.
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <Tag color={COLORS.red}>REER 106 Overvalued</Tag>
                <Tag color={COLORS.red}>Real Rate −0.2%</Tag>
                <Tag color={COLORS.amber}>Managed Float</Tag>
                <Tag color={COLORS.green}>Reserves $22.7B</Tag>
                <Tag color={COLORS.green}>Remittances $4.25B/mo</Tag>
                <Tag color={COLORS.green}>IMF Anchor</Tag>
              </div>
            </div>

            <SectionHeader>PKR Key Metrics</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))", gap: 10, marginBottom: 24 }}>
              {PKR_KPIS.map((kpi, i) => <KPICard key={i} {...kpi} />)}
            </div>

            <SectionHeader>Historical PKR Data</SectionHeader>
            <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, overflow: "hidden", marginBottom: 24 }}>
              <PanelHeader>Period | PKR/USD | REER | FX Reserves | CAD | Inflation | Regime | Assessment</PanelHeader>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                  <thead>
                    <tr><TH>PERIOD</TH><TH>PKR/USD</TH><TH>REER</TH><TH>FX RES.</TH><TH>CAD</TH><TH>CPI</TH><TH>REGIME</TH><TH>ASSESSMENT</TH></tr>
                  </thead>
                  <tbody>
                    {PKR_HISTORY.map((r, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "transparent" : `${COLORS.surface2}80` }}>
                        <TD>{r.period}</TD>
                        <TD color={COLORS.amber}>{r.pkrUsd}</TD>
                        <TD color={r.reer > 105 ? COLORS.red : r.reer < 100 ? COLORS.green : COLORS.amber}>{r.reer}</TD>
                        <TD color={COLORS.blue}>${r.fxReserves.toFixed(1)}B</TD>
                        <TD color={r.cad >= 0 ? COLORS.green : COLORS.red}>{r.cad > 0 ? "+" : ""}{r.cad.toFixed(1)}%</TD>
                        <TD color={r.inflation > 10 ? COLORS.red : COLORS.amber}>{r.inflation.toFixed(1)}%</TD>
                        <TD style={{ fontSize: 9 }} color={COLORS.textDim}>{r.regime}</TD>
                        <TD><Tag color={r.tagColor}>{r.assessment}</Tag></TD>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <SectionHeader>Forward PKR/USD Forecast</SectionHeader>
            <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, overflow: "hidden", marginBottom: 24 }}>
              <PanelHeader>Horizon | Rate | Change% | Source</PanelHeader>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr><TH>HORIZON</TH><TH>RATE (PKR/USD)</TH><TH>CHANGE%</TH><TH>SOURCE</TH></tr>
                </thead>
                <tbody>
                  {PKR_FORECAST.map((f, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "transparent" : `${COLORS.surface2}80` }}>
                      <TD color={COLORS.white}>{f.horizon}</TD>
                      <TD color={COLORS.gold}>{f.rate}</TD>
                      <TD color={f.change !== "—" && parseFloat(f.change) > 5 ? COLORS.red : f.change !== "—" && parseFloat(f.change) > 0 ? COLORS.amber : f.change !== "—" ? COLORS.green : COLORS.textDim}>{f.change}</TD>
                      <TD><Tag color={f.tagColor}>{f.source}</Tag></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SectionHeader>Depreciation Risk Scorecard</SectionHeader>
            <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16, marginBottom: 24 }}>
              {PKR_RISK_SCORECARD.map((r, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                    <div style={{ width: 140, fontFamily: "monospace", fontSize: 10, color: COLORS.text, textTransform: "uppercase" }}>{r.factor}</div>
                    <div style={{ flex: 1, maxWidth: 110, height: 10, backgroundColor: COLORS.surface2, borderRadius: 5, overflow: "hidden" }}>
                      <div style={{ width: `${r.score}%`, height: "100%", backgroundColor: r.color, borderRadius: 5 }} />
                    </div>
                    <div style={{ width: 30, fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: r.color, textAlign: "right" }}>{r.score}</div>
                  </div>
                  <div style={{ fontSize: 10, color: COLORS.textDim, lineHeight: 1.5, marginLeft: 152 }}>{r.text}</div>
                </div>
              ))}
            </div>

            <SectionHeader>PKR Scenarios</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              {PKR_SCENARIOS.map((s, i) => (
                <div key={i} style={{
                  backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
                  borderTop: `3px solid ${s.color}`, borderRadius: 6, padding: 16,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: s.color }}>{s.scenario}</div>
                    <Tag color={s.color}>{s.probability}</Tag>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.text, marginBottom: 10, lineHeight: 1.5 }}>{s.description}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 9, color: COLORS.textDim, textTransform: "uppercase" }}>PKR/USD Range</div>
                  <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: s.color }}>{s.range}</div>
                </div>
              ))}
            </div>

            <SectionHeader>USD → PKR Conversion Action Plan</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { tranche: "Tranche 1", amount: "30% of USD", trigger: "PKR at 278 or below", vehicle: "Convert to PKR / invest in KSE-100 bank stocks", color: COLORS.green },
                { tranche: "Tranche 2", amount: "40% of USD", trigger: "PKR at 290-295 (1Y forecast)", vehicle: "Convert to PKR / T-bills at 12% yield", color: COLORS.amber },
                { tranche: "Tranche 3", amount: "30% of USD", trigger: "PKR at 310+ or crisis event", vehicle: "Convert opportunistically / hold for external obligations", color: COLORS.red },
              ].map((t, i) => (
                <div key={i} style={{
                  backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
                  borderLeft: `3px solid ${t.color}`, borderRadius: 6, padding: 16,
                }}>
                  <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: t.color, marginBottom: 10 }}>{t.tranche}</div>
                  <div style={{ fontSize: 11, color: COLORS.text, marginBottom: 4 }}><strong>Amount:</strong> {t.amount}</div>
                  <div style={{ fontSize: 11, color: COLORS.text, marginBottom: 4 }}><strong>Trigger:</strong> {t.trigger}</div>
                  <div style={{ fontSize: 11, color: COLORS.text }}><strong>Vehicle:</strong> {t.vehicle}</div>
                </div>
              ))}
            </div>

            <div style={{
              backgroundColor: `${COLORS.red}10`, border: `1px solid ${COLORS.red}40`,
              borderRadius: 6, padding: 14, marginBottom: 24,
            }}>
              <div style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: COLORS.red, marginBottom: 6 }}>⚠ GUARDRAIL — DO NOT CONVERT IF:</div>
              <div style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.6 }}>
                Brent above $90 | IMF program stalled | PKR above 300 with no SBP intervention | Political crisis | SBP reserves below $12B | Parallel market premium above 5%. In any of these scenarios, maintain full USD exposure.
              </div>
            </div>

            <SectionHeader>10-Year PKR/USD Long-Term Depreciation Trend</SectionHeader>
            <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: 16, marginBottom: 24 }}>
              <LineChart
                data={[
                  { period: "2016", pkr: 105 }, { period: "2017", pkr: 110 }, { period: "2018", pkr: 139 },
                  { period: "2019", pkr: 155 }, { period: "2020", pkr: 160 }, { period: "2021", pkr: 176 },
                  { period: "2022", pkr: 226 }, { period: "2023", pkr: 285 }, { period: "2024", pkr: 278 },
                  { period: "2025", pkr: 279 }, { period: "2026", pkr: 278 },
                ]}
                keyName="pkr" color={COLORS.red} minVal={100} maxVal={300} height={220}
              />
            </div>
          </div>
        )}

        {/* ===== TAB 12: RECOMMENDATION ===== */}
        {activeTab === "recommendation" && (
          <div>
            <div style={{
              backgroundColor: `${recColor}10`, border: `1px solid ${COLORS.border}`,
              borderLeft: `4px solid ${recColor}`, borderRadius: 6, padding: 16, marginBottom: 24,
            }}>
              <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: recColor, marginBottom: 8 }}>
                {recVerdict}
              </div>
              <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6 }}>
                Based on a 12-factor scorecard averaging <strong style={{ color: recColor }}>{AVG_SCORE}% bull</strong>, the recommendation is to selectively add to Pakistan equities. The market offers deep value (8.3x P/E, 6.1% DY) with strong macro tailwinds (reserves, remittances, IMF compliance) but faces near-term headwinds (elevated inflation, negative real rate, REER overvaluation). Position for medium-term recovery as inflation eases and rate cuts resume in H2 FY27.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {/* Bullish Factors */}
              <div>
                <SectionHeader>Bullish Factors</SectionHeader>
                <div style={{
                  backgroundColor: `${COLORS.green}08`, border: `1px solid ${COLORS.green}30`,
                  borderRadius: 6, padding: 14,
                }}>
                  {BULLISH_FACTORS.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: 11, color: COLORS.text, lineHeight: 1.5 }}>
                      <span style={{ color: COLORS.green, fontWeight: 700, flexShrink: 0 }}>▲</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bearish Risks */}
              <div>
                <SectionHeader>Bearish Risks</SectionHeader>
                <div style={{
                  backgroundColor: `${COLORS.red}08`, border: `1px solid ${COLORS.red}30`,
                  borderRadius: 6, padding: 14,
                }}>
                  {BEARISH_RISKS.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: 11, color: COLORS.text, lineHeight: 1.5 }}>
                      <span style={{ color: COLORS.red, fontWeight: 700, flexShrink: 0 }}>▼</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Plan */}
              <div>
                <SectionHeader>Action Plan</SectionHeader>
                <div style={{
                  backgroundColor: `${COLORS.gold}08`, border: `1px solid ${COLORS.gold}30`,
                  borderRadius: 6, padding: 14,
                }}>
                  {[
                    { title: "MAINTAIN", desc: "Hold existing bank, E&P, and fertilizer positions. These are core structural plays benefiting from high rates, oil recovery, and agricultural demand.", color: COLORS.green },
                    { title: "ADD", desc: "Add to technology (SYS, TRG) and select autos (INDU, PSMC) on dips. IT exports growing; auto sales +48% YoY cumulative.", color: COLORS.green },
                    { title: "ACCUMULATE", desc: "Accumulate index ETFs and large-cap banks (MEEZAN, UBL, HBL) below 175,000 KSE-100 level. Dollar-cost average monthly.", color: COLORS.amber },
                    { title: "WATCH", desc: "Monitor cement (LUCK, FCCL) for turnaround signal. Watch inflation trajectory — if CPI falls below 8% by Sep, rate cut catalyst triggers.", color: COLORS.amber },
                    { title: "AVOID", desc: "Avoid IPPs/power sector (circular debt Rs3.1T, contract renegotiation risk) and highly leveraged consumer names vulnerable to inflation.", color: COLORS.red },
                  ].map((a, i) => (
                    <div key={i} style={{
                      marginBottom: 12, paddingBottom: 12,
                      borderBottom: i < 4 ? `1px solid ${COLORS.border}80` : "none",
                    }}>
                      <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: a.color, marginBottom: 4 }}>{a.title}</div>
                      <div style={{ fontSize: 10, color: COLORS.text, lineHeight: 1.5 }}>{a.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <SectionHeader>Key Metrics Summary</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, marginBottom: 24 }}>
              {[
                { label: "KSE-100", value: "179,571", color: COLORS.green },
                { label: "All-Time High", value: "191,033", color: COLORS.gold },
                { label: "Fwd P/E", value: "8.3x", color: COLORS.green },
                { label: "Dividend Yield", value: "6.1%", color: COLORS.green },
                { label: "Policy Rate", value: "11.50%", color: COLORS.amber },
                { label: "CPI Inflation", value: "11.66%", color: COLORS.red },
                { label: "FX Reserves", value: "$22.74B", color: COLORS.green },
                { label: "GDP Growth FY26", value: "3.7%", color: COLORS.green },
                { label: "IMF Status", value: "3rd Review ✓", color: COLORS.green },
                { label: "Broker Target", value: "213,633", color: COLORS.green },
                { label: "Remittances", value: "$4.25B/mo", color: COLORS.green },
                { label: "PKR/USD", value: "278.30", color: COLORS.amber },
              ].map((m, i) => (
                <div key={i} style={{
                  backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`,
                  borderRadius: 6, padding: 14,
                }}>
                  <div style={{ fontFamily: "monospace", fontSize: 9, color: COLORS.textDim, textTransform: "uppercase", marginBottom: 6 }}>{m.label}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ===== FOOTER ===== */}
      <div style={{
        padding: "16px 24px", borderTop: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.surface, marginTop: 24,
      }}>
        <div style={{ fontFamily: "monospace", fontSize: 9, color: COLORS.textMuted, lineHeight: 1.8, maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ color: COLORS.gold, fontWeight: 700, marginBottom: 6 }}>SOURCES</div>
          PSX (psx.com.pk) | SBP (sbp.org.pk) | PBS (pbs.gov.pk) | IMF (imf.org) | Trading Economics | Business Recorder | Dawn | Arab News PK | ProPakistani | AHL Research | AKD Securities | Topline Securities | JS Global | Fitch Ratings | Moody's | S&amp;P Global | APCMA | PAMA | Finance Division Pakistan | CEIC Data | Al Jazeera | The Friday Times
          <br /><br />
          <strong style={{ color: COLORS.amber }}>DISCLAIMER:</strong> This dashboard is for informational and educational purposes only. It does not constitute investment advice, recommendation, or solicitation to buy or sell any securities. All data is sourced from publicly available information and may be subject to revision. Past performance is not indicative of future results. Investors should conduct their own due diligence and consult with a licensed financial advisor before making investment decisions. Equity investments carry risk of capital loss.
          <br /><br />
          Generated: June 25, 2026 | Data as of latest available | Dashboard v1.0
        </div>
      </div>
    </div>
  );
}
