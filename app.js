const { useState, useEffect, useMemo, useRef, useCallback } = React;

/* =========================================================================
   ICONS — small inline SVGs, standing in for lucide-react so this page
   has zero external UI dependencies. Same size/color props API.
   ======================================================================= */
function Icon({ size = 18, color = "currentColor", style, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {children}
    </svg>
  );
}
const Flame = (p) => <Icon {...p}><path d="M12 2c1 4-4 5-4 9a4 4 0 0 0 8 0c0-2-1-3-1-3s1 1 1 3a6 6 0 1 1-9-5c0 0 1 3 2 3-1-3 1-5 3-7z" /></Icon>;
const TimerIcon = (p) => <Icon {...p}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l3 2" /><path d="M9 1h6M12 1v3" /></Icon>;
const TrendingUp = (p) => <Icon {...p}><polyline points="3 17 9 11 13 15 21 6" /><polyline points="15 6 21 6 21 12" /></Icon>;
const ChevronRight = (p) => <Icon {...p}><polyline points="9 18 15 12 9 6" /></Icon>;
const ChevronLeft = (p) => <Icon {...p}><polyline points="15 18 9 12 15 6" /></Icon>;
const CheckCircle2 = (p) => <Icon {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></Icon>;
const CalendarDays = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Icon>;
const Activity = (p) => <Icon {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Icon>;
const Settings = (p) => <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></Icon>;
const Plus = (p) => <Icon {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>;
const Minus = (p) => <Icon {...p}><line x1="5" y1="12" x2="19" y2="12" /></Icon>;
const Play = (p) => <Icon {...p}><polygon points="5 3 19 12 5 21 5 3" /></Icon>;
const Pause = (p) => <Icon {...p}><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></Icon>;
const RotateCcw = (p) => <Icon {...p}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></Icon>;
const ClipboardList = (p) => <Icon {...p}><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" /><line x1="8" y1="11" x2="16" y2="11" /><line x1="8" y1="15" x2="16" y2="15" /></Icon>;
const Trash2 = (p) => <Icon {...p}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></Icon>;
const HelpCircle = (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" /><line x1="12" y1="17" x2="12.01" y2="17" /></Icon>;

/* =========================================================================
   MINI LINE CHART — tiny dependency-free stand-in for recharts, just
   enough for the "main lifts over time" trend line.
   ======================================================================= */
function MiniLineChart({ data }) {
  const W = 560, H = 160, PAD = 28;
  if (!data || data.length < 2) return null;
  const series = [
    { key: "squat", color: "#FF5A1F" },
    { key: "swissBench", color: "#4FA3C7" },
    { key: "trapDeadlift", color: "#7FB069" },
    { key: "ohp", color: "#C79A4F" },
  ];
  const weeks = data.map((d) => d.week);
  const minW = Math.min(...weeks), maxW = Math.max(...weeks);
  const allVals = data.flatMap((d) => series.map((s) => d[s.key]).filter((v) => v != null));
  const minV = Math.min(...allVals), maxV = Math.max(...allVals);
  const x = (w) => PAD + ((w - minW) / Math.max(1, maxW - minW)) * (W - PAD * 2);
  const y = (v) => H - PAD - ((v - minV) / Math.max(1, maxV - minV || 1)) * (H - PAD * 2);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block" }}>
      {[0, 0.5, 1].map((t, i) => (
        <line key={i} x1={PAD} x2={W - PAD} y1={PAD + t * (H - PAD * 2)} y2={PAD + t * (H - PAD * 2)} stroke="#292D2F" strokeDasharray="3 3" />
      ))}
      {series.map((s) => {
        const pts = data.filter((d) => d[s.key] != null).map((d) => `${x(d.week)},${y(d[s.key])}`).join(" ");
        if (!pts) return null;
        return <polyline key={s.key} points={pts} fill="none" stroke={s.color} strokeWidth="2" />;
      })}
      <text x={PAD} y={H - 6} fill="#6B7275" fontSize="12" fontFamily="'JetBrains Mono', monospace">W{minW}</text>
      <text x={W - PAD} y={H - 6} textAnchor="end" fill="#6B7275" fontSize="12" fontFamily="'JetBrains Mono', monospace">W{maxW}</text>
    </svg>
  );
}

const RPE_SCALE = [
  { v: "10", d: "Max effort, could not have done another rep" },
  { v: "9", d: "Could maybe do 1 more rep" },
  { v: "8", d: "Could do 2 more reps" },
  { v: "7", d: "Could do 3 more reps" },
  { v: "≤6", d: "Comfortable, lots left in the tank" },
];

/* =========================================================================
   DESIGN TOKENS
   ======================================================================= */
const C = {
  bg: "#17191A", bgRaised: "#1F2224", bgCard: "#232628",
  line: "#33383B", lineFaint: "#292D2F",
  text: "#EDEBE6", textDim: "#9CA3A6", textFaint: "#6B7275",
  hazard: "#FF5A1F", hazardDim: "#7A3418",
  signal: "#4FA3C7", signalDim: "#274454",
  good: "#7FB069",
};
const FONT_DISPLAY = "'Oswald', sans-serif";
const FONT_BODY = "'Work Sans', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const FONT_IMPORT_URL =
  "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap";

const APP_ICON = "icon-192.png";

const QUOTES = [
  "The rep you don't want to do is the one that changes you.",
  "Pace is a decision, not a feeling. Make it early.",
  "Strong enough to lift it. Built to carry it further.",
  "Nobody rises to race day. You sink to the floor you built in training.",
  "The sled doesn't care about your excuses. Push.",
  "Fat loss is a side effect of showing up angry at the bar.",
  "Six months from now you'll wish you started today. So start today.",
  "Hyrox isn't won at the finish line. It's won in week three, on the days you didn't want to go.",
  "Comfort is the enemy of the compromised. Choose the harder set.",
  "You're not tired. You're undertrained for who you're becoming.",
  "Every station is just a rep you've already done a thousand times.",
  "Discipline is choosing between what you want now and what you want most.",
  "The engine is built in silence — zone 2, ski erg, nobody watching.",
  "Log the number. Beat the number. Repeat for 26 weeks.",
  "Slow is smooth on the sled push. Smooth is fast everywhere else.",
];
const TIPS = [
  "Shoulder flaring up? Drop the Swiss bar angle slightly and keep elbows tucked closer than a straight bar press.",
  "Trap bar deadlifts let you stay more upright — brace hard and drive through the whole foot, not just the heel.",
  "On sled work, shorter/faster steps beat long strides for keeping constant force on the sled.",
  "Ski erg power comes from the hip hinge, not the arms. Snap the hips, let the arms follow.",
  "Carry work: grip fails before legs. Train grip endurance, not just max hold.",
  "45-minute weekday sessions: cut rest on accessories to 60-75s so conditioning doesn't get squeezed.",
  "Deload weeks aren't optional — they're where the adaptation from the last 3 weeks actually locks in.",
  "Fuel the long Saturday session like a mini race day: carbs 2-3h before, water + electrolytes throughout.",
];

const KB_WEIGHTS = [12, 16, 20, 25];
const DB_ADJ_RANGE = [2, 36];
function nearestFrom(list, target) { return list.reduce((a, b) => (Math.abs(b - target) < Math.abs(a - target) ? b : a)); }
function roundBar(w) { return Math.max(0, Math.round(w / 1.25) * 1.25); }
function roundAdjDb(w) { const [lo, hi] = DB_ADJ_RANGE; return Math.min(hi, Math.max(lo, Math.round(w))); }
function fmtKg(w) { if (w == null) return ""; return (Math.round(w * 100) / 100).toString().replace(/\.0+$/, "").replace(/(\.\d)0$/, "$1"); }
function wKey(week) { return `w${week}`; }

/* =========================================================================
   PROGRAM ENGINE
   ======================================================================= */
const PHASES = [
  { id: "foundation", name: "Foundation", range: [1, 6], intensity: [0.62, 0.72], sets: 4, repsMain: "6-8", focus: "Strength base + aerobic engine" },
  { id: "build", name: "Hyrox Build", range: [7, 14], intensity: [0.70, 0.78], sets: 4, repsMain: "5-6", focus: "Strength-endurance, station skill" },
  { id: "intensify", name: "Intensify", range: [15, 20], intensity: [0.75, 0.85], sets: 5, repsMain: "3-5", focus: "Heavier strength, race-pace conditioning" },
  { id: "peak", name: "Peak", range: [21, 24], intensity: [0.82, 0.90], sets: 5, repsMain: "2-4", focus: "Sharpen, low-volume/high-quality" },
  { id: "race", name: "Taper & Race", range: [25, 26], intensity: [0.55, 0.65], sets: 2, repsMain: "3-5", focus: "Shakeout, freshness" },
];
function getPhase(week) { return PHASES.find((p) => week >= p.range[0] && week <= p.range[1]) || PHASES[0]; }
function isDeload(week) {
  const phase = getPhase(week);
  if (phase.id === "race") return week === 26;
  const idx = week - phase.range[0];
  return idx > 0 && (idx + 1) % 4 === 0 && phase.id !== "peak";
}
function weekIntensity(week) {
  const phase = getPhase(week);
  const [start, end] = phase.range;
  const [loI, hiI] = phase.intensity;
  const span = Math.max(1, end - start);
  const t = (week - start) / span;
  let pct = loI + (hiI - loI) * t;
  if (isDeload(week)) pct *= 0.85;
  return pct;
}
function allEntries(logs) {
  return Object.values(logs || {}).flatMap((day) =>
    Object.entries(day.entries || {}).map(([exId, e]) => ({ ...e, exId, week: day.week }))
  );
}
function allCompletedDays(logs) {
  return Object.values(logs || {}).flatMap((day) =>
    Object.entries(day.days || {}).filter(([, d]) => d.completedAt).map(([dayKey, d]) => ({ dayKey, week: day.week, ...d }))
  );
}
function adaptiveFactor(logs, liftKey) {
  const entries = allEntries(logs).filter((e) => e.liftKey === liftKey).sort((a, b) => b.week - a.week).slice(0, 2);
  if (entries.length === 0) return 1;
  const avgRpe = entries.reduce((s, e) => s + (e.rpe || 7), 0) / entries.length;
  if (avgRpe <= 6.5) return 1.03;
  if (avgRpe >= 8.7) return 0.95;
  return 1;
}
function mainLiftWeight(profile, logs, liftKey, week) {
  const oneRm = profile[liftKey];
  if (!oneRm) return null;
  return roundBar(oneRm * weekIntensity(week) * adaptiveFactor(logs, liftKey));
}
function getLastEntry(logs, exId, beforeWeek) {
  const matches = allEntries(logs).filter((e) => e.exId === exId && e.week < beforeWeek && e.weight != null);
  if (matches.length === 0) return null;
  return matches.sort((a, b) => b.week - a.week)[0];
}

const DAY_DEFS = [
  { key: "mon", label: "Monday", mins: 45 },
  { key: "tue", label: "Tuesday", mins: 45 },
  { key: "thu", label: "Thursday", mins: 45 },
  { key: "fri", label: "Friday", mins: 45 },
  { key: "sat", label: "Saturday", mins: 60 },
];

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seededShuffle(arr, seed) {
  const rand = mulberry32(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Auto-rotated pool sticks to indoor/limited-space moves (garage gym default).
// Sled is left out of the automatic rotation — it needs open space — but stays
// available as a manual pick via "Select New Workout" for days with room to set up outdoors.
// Rower/wall ball only join the pool once that equipment is switched on in Settings.
const BASE_AUTO_FINISHER_KEYS = ["ski", "rope", "kbSwing", "treadmill", "burpee"];
function getAutoFinisherKeys(equipment) {
  const extra = [];
  if (equipment?.rower) extra.push("row");
  if (equipment?.wallball) extra.push("wallball");
  return [...BASE_AUTO_FINISHER_KEYS, ...extra];
}
function getAllFinisherKeys(equipment) {
  return [...getAutoFinisherKeys(equipment), "sled"];
}
const FINISHER_META = {
  ski: { label: "Ski Erg intervals", space: "Minimal space — indoor friendly" },
  rope: { label: "Battle rope waves", space: "Minimal space — indoor friendly" },
  kbSwing: { label: "Kettlebell swings", space: "Minimal space — indoor friendly" },
  treadmill: { label: "Treadmill sprints", space: "Minimal space — indoor friendly" },
  burpee: { label: "Burpee broad jumps", space: "Small clear floor area" },
  sled: { label: "Sled push (Bulldog Saxon)", space: "Needs open space — garden/outdoors" },
  row: { label: "Rowing intervals", space: "Minimal space — indoor friendly" },
  wallball: { label: "Wall balls", space: "Needs ceiling height — indoor or garage" },
};
function condShort(week, style) {
  const bump = Math.min(3, Math.floor(week / 6));
  const blocks = {
    ski: [{ name: "Ski Erg intervals", detail: `${5 + bump} x 250m, 30s rest — hold pace, don't fade` }],
    sled: [{ name: "Sled push (Bulldog Saxon)", detail: `${4 + bump} x 20m, moderate load, 60s rest` }],
    rope: [{ name: "Battle rope waves", detail: `${5 + bump} x 30s on / 30s off, max effort` }],
    kbSwing: [{ name: `Kettlebell swings (${nearestFrom(KB_WEIGHTS, 16 + bump * 2)}kg)`, detail: `${4 + bump} x 20 reps, 45s rest` }],
    treadmill: [{ name: "Treadmill sprints", detail: `${4 + bump} x 200m hard, walk-back recovery` }],
    burpee: [{ name: "Burpee broad jumps", detail: `${3 + bump} x 10 reps, rest as needed` }],
    row: [{ name: "Rowing intervals", detail: `${5 + bump} x 250m, 30s rest — drive with the legs` }],
    wallball: [{ name: "Wall balls", detail: `${4 + bump} x 15 reps, rest as needed` }],
  };
  return blocks[style];
}
// Deterministic-but-varied weekly assignment: shuffles the auto pool with the
// week number as a seed, so it's different week to week but stable if you revisit a week.
function weeklyFinisherAssignment(week, equipment) {
  const order = seededShuffle(getAutoFinisherKeys(equipment), week * 97 + 13);
  const days = ["mon", "tue", "thu", "fri"];
  const map = {};
  days.forEach((d, i) => (map[d] = order[i % order.length]));
  return map;
}

function hyroxSimSession(week, equipment) {
  const phase = getPhase(week);
  const runM = { foundation: 400, build: 500, intensify: 600, peak: 600, race: 300 }[phase.id];
  const stations = phase.id === "foundation" ? 4 : phase.id === "build" ? 6 : phase.id === "race" ? 3 : 8;
  const kbSwingW = nearestFrom(KB_WEIGHTS, 16);
  const dbThrusterW = roundAdjDb(12);
  const rowStation = equipment?.rower
    ? { name: "Rowing — 1000m", detail: "Real Hyrox distance, steady power off the legs" }
    : { name: `KB swings (${kbSwingW}kg) — rowing sub`, detail: "No rower: max-effort KB swings for the same interval" };
  const wallballStation = equipment?.wallball
    ? { name: "Wall Balls — 100 reps", detail: "Real Hyrox rep count, break early rather than grind late" }
    : { name: `DB thrusters (${dbThrusterW}kg pair) — wall ball sub`, detail: "No wall ball: thrusters mimic leg-drive-to-overhead" };
  const pool = [
    { name: "Ski Erg", detail: "250-500m depending on station count" },
    { name: "Sled Push (Bulldog Saxon)", detail: "25m down, moderate-heavy load" },
    { name: "Sled Pull (Bulldog Saxon)", detail: "25m back, rope/strap pull" },
    { name: "Burpee broad jumps", detail: "15-20m worth of reps" },
    rowStation,
    { name: "Farmer's carry (trap bar or heavy DBs)", detail: "40-50m" },
    { name: "Weighted lunges (vest or dip belt)", detail: "40-50m, controlled depth" },
    wallballStation,
  ];
  return { title: `Hyrox Simulation — ${stations} station${stations > 1 ? "s" : ""}`, intro: `Run ${runM}m between every station, race-effort pace, station straight into the next run.`, stations: pool.slice(0, stations) };
}

// 5-minute dynamic warm-up, tailored to what each day asks of the body.
function dynamicWarmup(dayKey) {
  const sets = {
    mon: [
      { name: "Leg swings (front-back + side-side)", seconds: 60, detail: "10/leg each direction, hold wall/rack for balance" },
      { name: "Bodyweight squats", seconds: 60, detail: "Slow and controlled, full depth" },
      { name: "Walking lunges", seconds: 60, detail: "10 steps/leg, add a torso rotation at the bottom" },
      { name: "Glute bridges", seconds: 60, detail: "15 reps, squeeze at the top" },
      { name: "Empty bar good mornings", seconds: 60, detail: "10 reps, prime the hips and hamstrings" },
    ],
    tue: [
      { name: "Arm circles", seconds: 45, detail: "Small to large, both directions" },
      { name: "Band-free shoulder dislocates (broomstick/bar)", seconds: 60, detail: "Wide grip, slow pass over head" },
      { name: "Scapular pull-ups", seconds: 60, detail: "10 reps, hang and shrug without bending arms" },
      { name: "Push-up to downward dog", seconds: 60, detail: "8 reps, open the chest and shoulders" },
      { name: "Light Swiss bar bench (empty)", seconds: 75, detail: "2 sets x 8, groove the shoulder-friendly path" },
    ],
    thu: [
      { name: "Leg swings + hip circles", seconds: 60, detail: "10/leg each direction" },
      { name: "Cat-cow", seconds: 45, detail: "Slow spinal flexion/extension" },
      { name: "Bodyweight RDL pattern", seconds: 60, detail: "10 reps, feel the hamstring stretch" },
      { name: "Glute bridges", seconds: 60, detail: "15 reps" },
      { name: "Inchworms to hamstring stretch", seconds: 75, detail: "6 reps, walk hands out slow" },
    ],
    fri: [
      { name: "Jumping jacks", seconds: 60, detail: "Raise the heart rate" },
      { name: "High knees", seconds: 45, detail: "On the spot or 10m there-and-back" },
      { name: "Arm circles + band-free pass-throughs", seconds: 45, detail: "Loosen shoulders for the press" },
      { name: "Bodyweight squats", seconds: 60, detail: "12 reps" },
      { name: "Mountain climbers", seconds: 60, detail: "30s on, controlled pace" },
    ],
    sat: [
      { name: "Easy jog or row/ski erg", seconds: 90, detail: "Very light effort, just get blood moving" },
      { name: "Leg swings + walking lunges", seconds: 60, detail: "Loosen hips for running and carries" },
      { name: "Arm circles + scap pull-ups", seconds: 45, detail: "Prep shoulders for carries and presses" },
      { name: "2-3 build-up strides", seconds: 60, detail: "Easy to race-pace, short and sharp" },
      { name: "Ski erg primer", seconds: 45, detail: "Light pulls, groove the hip hinge" },
    ],
  };
  return sets[dayKey] || [];
}

function buildDaySession(dayKey, week, profile, logs, equipment) {
  const phase = getPhase(week);
  const deload = isDeload(week);
  const sets = deload ? Math.max(2, phase.sets - 1) : phase.sets;
  const finishers = weeklyFinisherAssignment(week, equipment);
  const warmup = dynamicWarmup(dayKey);
  const override = logs[wKey(week)]?.days?.[dayKey]?.finisherOverride;
  const finisherFor = (d) => override || finishers[d];

  const mkMain = (liftKey, name, equipment) => {
    const w = mainLiftWeight(profile, logs, liftKey, week);
    return { id: `${dayKey}-${liftKey}`, name, equipment, sets, reps: phase.repsMain, weightKg: w, liftKey, trackWeight: true, note: w == null ? "Set your 1RM in Setup for a weight recommendation" : undefined };
  };
  const mkAcc = (id, name, equipment, s, reps, weightKg) => ({ id: `${dayKey}-${id}`, name, equipment, sets: s, reps, weightKg: weightKg ?? null, trackWeight: true });

  if (dayKey === "mon") {
    const dl = mainLiftWeight(profile, logs, "trapDeadlift", week);
    return {
      dayType: "Lower Strength", warmup,
      strength: [
        mkMain("squat", "Back Squat", "20kg barbell + plates, squat rack"),
        mkAcc("speedpull", "Trap Bar Deadlift (light, speed pulls)", "25kg trap bar", 3, "5", dl ? roundBar(dl * 0.6) : null),
        mkAcc("stepup", "Weighted step-ups", "vest or dumbbells", 3, "10/leg"),
      ],
      conditioning: condShort(week, finisherFor("mon")), conditioningKey: finisherFor("mon"),
    };
  }
  if (dayKey === "tue") {
    const strength = [
      mkMain("swissBench", "Swiss Bar Bench Press (shoulder-friendly grip)", "28kg Swiss bar"),
      mkAcc("pullup", "Weighted pull-ups", "pull-up bar + dip belt", sets, "5-8"),
      mkAcc("dips", "Weighted dips", "dip bar + dip belt", 3, "8-10"),
    ];
    if (equipment?.adjustableBench) {
      strength.push(mkAcc("inclinebench", "Incline DB Bench Press", "adjustable bench + dumbbells", 3, "8-10"));
    }
    return {
      dayType: "Upper Push/Pull", warmup,
      strength,
      conditioning: condShort(week, finisherFor("tue")), conditioningKey: finisherFor("tue"),
    };
  }
  if (dayKey === "thu") {
    return {
      dayType: "Posterior Chain", warmup,
      strength: [
        mkMain("trapDeadlift", "Trap Bar Deadlift", "25kg trap bar"),
        mkAcc("rdl", "Single-leg RDL (DB)", "adjustable dumbbells", 3, "8/leg"),
        mkAcc("carry", "Farmer's carry", "trap bar or heavy dumbbells", 3, "40m"),
      ],
      conditioning: condShort(week, finisherFor("thu")), conditioningKey: finisherFor("thu"),
    };
  }
  if (dayKey === "fri") {
    return {
      dayType: "Hybrid + Engine", warmup,
      strength: [
        mkMain("ohp", "Standing Overhead Press", "20kg barbell"),
        mkAcc("lunge", "Weighted walking lunges", "vest or dip belt", 3, "12/leg"),
        mkAcc("goblet", "KB goblet squat", `${nearestFrom(KB_WEIGHTS, 20)}kg kettlebell`, 3, "10"),
      ],
      conditioning: condShort(week, finisherFor("fri")), conditioningKey: finisherFor("fri"),
    };
  }
  if (dayKey === "sat") return { dayType: "Hyrox Simulation", warmup, sim: hyroxSimSession(week, equipment) };
  return null;
}

/* =========================================================================
   STORAGE
   ======================================================================= */
async function loadKey(key, fallback) {
  try { const v = localStorage.getItem("mytrainer:" + key); return v != null ? JSON.parse(v) : fallback; } catch { return fallback; }
}
async function saveKey(key, value) {
  try { localStorage.setItem("mytrainer:" + key, JSON.stringify(value)); } catch (e) { console.error("save failed", key, e); }
}

/* =========================================================================
   SOUND
   ======================================================================= */
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) {
    try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
  }
  if (_audioCtx.state === "suspended") _audioCtx.resume().catch(() => {});
  return _audioCtx;
}
function beep(freq = 880, dur = 150, vol = 0.15) {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.frequency.value = freq; o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur / 1000);
    o.start(); o.stop(ctx.currentTime + dur / 1000 + 0.02);
  } catch (e) {}
}
// Short high pip — used for the 3-2-1 countdown cues.
function pip() { beep(1000, 90, 0.14); }
// Lower double-tone bell — used when a timer/phase hits zero.
function bell() { beep(440, 320, 0.18); setTimeout(() => beep(440, 380, 0.18), 260); }

/* =========================================================================
   SMALL UI PRIMITIVES
   ======================================================================= */
function Pill({ children, tone = "hazard" }) {
  const bg = tone === "hazard" ? C.hazardDim : tone === "signal" ? C.signalDim : C.lineFaint;
  const fg = tone === "hazard" ? C.hazard : tone === "signal" ? C.signal : C.textDim;
  return <span style={{ background: bg, color: fg, fontFamily: FONT_MONO, fontSize: 13, letterSpacing: 1, padding: "3px 8px", borderRadius: 3, textTransform: "uppercase", fontWeight: 700 }}>{children}</span>;
}
function PlateStack({ level }) {
  const n = Math.max(1, Math.min(5, level));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 28 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ width: 6, height: 8 + i * 5, background: i < n ? C.hazard : C.lineFaint, borderRadius: 1 }} />
      ))}
    </div>
  );
}
function fmtTime(totalSec) {
  const s = Math.max(0, Math.round(totalSec));
  const m = Math.floor(s / 60); const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
function fmtDuration(totalSec) {
  const s = Math.max(0, Math.round(totalSec));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
function ordinal(n) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
function fmtCompletedDate(iso) {
  const d = new Date(iso);
  const dayName = d.toLocaleDateString("en-GB", { weekday: "long" });
  const month = d.toLocaleDateString("en-GB", { month: "long" });
  return `${dayName} ${ordinal(d.getDate())} ${month}`;
}

/* =========================================================================
   ONBOARDING
   ======================================================================= */
function Onboarding({ onComplete }) {
  const [form, setForm] = useState({ squat: "", swissBench: "", trapDeadlift: "", ohp: "", bodyweight: "", startDate: new Date().toISOString().slice(0, 10) });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const fields = [
    { k: "squat", label: "Back Squat 1RM (kg)", hint: "Squat rack, 20kg barbell" },
    { k: "swissBench", label: "Swiss Bar Bench 1RM (kg)", hint: "Using Swiss bar — easier on your shoulder" },
    { k: "trapDeadlift", label: "Trap Bar Deadlift 1RM (kg)", hint: "25kg trap bar" },
    { k: "ohp", label: "Overhead Press 1RM (kg)", hint: "20kg barbell" },
    { k: "bodyweight", label: "Bodyweight (kg)", hint: "For carries & vest loading reference" },
  ];
  const canSubmit = form.squat && form.swissBench && form.trapDeadlift && form.ohp;
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 40px) 20px 40px" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <img src={APP_ICON} alt="My Trainer" style={{ width: 88, height: 88, borderRadius: 20 }} />
      </div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: FONT_MONO, color: C.hazard, fontSize: 14, letterSpacing: 2, marginBottom: 8 }}>SETUP · 01</div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 37, color: C.text, margin: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>Load your bar</h1>
        <p style={{ fontFamily: FONT_BODY, color: C.textDim, fontSize: 16, lineHeight: 1.6, marginTop: 10 }}>
          Enter your current best for each lift. The engine calculates every working weight for 26 weeks, and adjusts as you log sessions.
        </p>
      </div>
      {fields.map((f) => (
        <div key={f.k} style={{ marginBottom: 18 }}>
          <label style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.text, fontWeight: 600, display: "block", marginBottom: 4 }}>{f.label}</label>
          <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.textFaint, marginBottom: 6 }}>{f.hint}</div>
          <input type="number" inputMode="decimal" value={form[f.k]} onChange={set(f.k)}
            style={{ width: "100%", background: C.bgRaised, border: `1px solid ${C.line}`, borderRadius: 6, padding: "12px 14px", color: C.text, fontFamily: FONT_MONO, fontSize: 18, boxSizing: "border-box", outline: "none" }}
            onFocus={(e) => (e.target.style.borderColor = C.hazard)} onBlur={(e) => (e.target.style.borderColor = C.line)} placeholder="0" />
        </div>
      ))}
      <div style={{ marginBottom: 28 }}>
        <label style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.text, fontWeight: 600, display: "block", marginBottom: 4 }}>Program start date</label>
        <input type="date" value={form.startDate} onChange={set("startDate")}
          style={{ width: "100%", background: C.bgRaised, border: `1px solid ${C.line}`, borderRadius: 6, padding: "12px 14px", color: C.text, fontFamily: FONT_MONO, fontSize: 17, boxSizing: "border-box", outline: "none", colorScheme: "dark" }} />
      </div>
      <button disabled={!canSubmit}
        onClick={() => onComplete({ squat: parseFloat(form.squat), swissBench: parseFloat(form.swissBench), trapDeadlift: parseFloat(form.trapDeadlift), ohp: parseFloat(form.ohp), bodyweight: parseFloat(form.bodyweight) || null, startDate: form.startDate })}
        style={{ width: "100%", padding: "14px", borderRadius: 6, border: "none", background: canSubmit ? C.hazard : C.lineFaint, color: canSubmit ? "#1A1A1A" : C.textFaint, fontFamily: FONT_DISPLAY, fontSize: 18, letterSpacing: 1, textTransform: "uppercase", cursor: canSubmit ? "pointer" : "not-allowed", fontWeight: 600 }}>
        Build my program
      </button>
    </div>
  );
}

/* =========================================================================
   EXERCISE CARD — weight field, last-time reference, circular set tracker
   ======================================================================= */
// Suggests a rest duration: heavier/lower-rep main lifts get longer rest than accessory work.
function recommendRestSeconds(ex) {
  const low = parseInt(String(ex.reps || "8").split(/[-\/]/)[0], 10) || 8;
  if (ex.liftKey) {
    if (low <= 3) return 180;
    if (low <= 5) return 150;
    return 120;
  }
  return low <= 5 ? 90 : 60;
}

function parseTargetReps(reps) {
  const m = String(reps || "").match(/(\d+)(?!.*\d)/);
  return m ? m[1] : "";
}

function ExerciseCard({ ex, week, logs, dayType, onSave }) {
  const wk = wKey(week);
  const existing = logs[wk]?.entries?.[ex.id];
  const last = getLastEntry(logs, ex.id, week);
  const defaultReps = parseTargetReps(ex.reps);

  const [weight, setWeight] = useState(existing?.weight ?? ex.weightKg ?? last?.weight ?? "");
  const [rpe, setRpe] = useState(existing?.rpe ?? "");
  const [done, setDone] = useState(existing?.setsCompleted ?? Array(ex.sets).fill(false));
  const [repsPerSet, setRepsPerSet] = useState(existing?.repsPerSet ?? Array(ex.sets).fill(""));
  const [showScale, setShowScale] = useState(false);
  const [restRemaining, setRestRemaining] = useState(null);

  useEffect(() => {
    if (restRemaining == null) return;
    if (restRemaining <= 0) { bell(); setRestRemaining(null); return; }
    if (restRemaining <= 3) pip();
    const id = setTimeout(() => setRestRemaining((r) => (r == null ? null : r - 1)), 1000);
    return () => clearTimeout(id);
  }, [restRemaining]);

  useEffect(() => {
    // reset local state when navigating to a different week/exercise
    setWeight(existing?.weight ?? ex.weightKg ?? last?.weight ?? "");
    setRpe(existing?.rpe ?? "");
    setDone(existing?.setsCompleted ?? Array(ex.sets).fill(false));
    setRepsPerSet(existing?.repsPerSet ?? Array(ex.sets).fill(""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ex.id, week]);

  const persist = (nextDone, nextWeight, nextRpe, nextReps) => {
    onSave(ex.id, {
      name: ex.name, liftKey: ex.liftKey || null, dayType,
      weight: parseFloat(nextWeight) || null,
      rpe: parseFloat(nextRpe) || null,
      setsCompleted: nextDone, totalSets: ex.sets,
      repsPerSet: nextReps, date: new Date().toISOString(),
    });
  };

  const toggleSet = (i) => {
    const wasDone = done[i];
    const next = [...done]; next[i] = !next[i]; setDone(next);
    let nextReps = repsPerSet;
    if (!wasDone && next[i] && !repsPerSet[i]) {
      nextReps = [...repsPerSet]; nextReps[i] = defaultReps; setRepsPerSet(nextReps);
    }
    persist(next, weight, rpe, nextReps);
    if (!wasDone && next[i] && next.filter(Boolean).length < ex.sets) {
      setRestRemaining(recommendRestSeconds(ex));
    } else if (wasDone) {
      setRestRemaining(null); // un-checking a set cancels any running rest
    }
  };
  const setReps = (i, val) => {
    const next = [...repsPerSet]; next[i] = val; setRepsPerSet(next);
    persist(done, weight, rpe, next);
  };
  const completedCount = done.filter(Boolean).length;

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${completedCount === ex.sets ? C.hazardDim : C.line}`, borderRadius: 8, padding: 14, marginBottom: 10 }}>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 600, color: C.text, fontSize: 17 }}>{ex.name}</div>
      {ex.equipment && <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textFaint, marginTop: 2 }}>{ex.equipment}</div>}
      <div style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.textDim, marginTop: 6 }}>
        {ex.sets} × {ex.reps} {ex.weightKg != null ? `— target ${fmtKg(ex.weightKg)}kg` : ""}
      </div>
      {ex.note && <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.signal, marginTop: 4 }}>{ex.note}</div>}
      <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textFaint, marginTop: 4 }}>
        Last time: {last ? `${fmtKg(last.weight)}kg (week ${last.week})` : "—"}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.textFaint, marginBottom: 3 }}>WEIGHT (KG)</div>
          <input type="number" value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onBlur={() => persist(done, weight, rpe)}
            style={{ width: "100%", background: C.bgRaised, border: `1px solid ${C.line}`, borderRadius: 5, padding: "8px 10px", color: C.text, fontFamily: FONT_MONO, fontSize: 16, boxSizing: "border-box", outline: "none" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.textFaint }}>RPE (1-10)</div>
            <button onClick={() => setShowScale((s) => !s)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}>
              <HelpCircle size={12} color={showScale ? C.hazard : C.textFaint} />
            </button>
          </div>
          <input type="number" min="1" max="10" value={rpe}
            onChange={(e) => setRpe(e.target.value)}
            onBlur={() => persist(done, weight, rpe)}
            style={{ width: "100%", background: C.bgRaised, border: `1px solid ${C.line}`, borderRadius: 5, padding: "8px 10px", color: C.text, fontFamily: FONT_MONO, fontSize: 16, boxSizing: "border-box", outline: "none" }} />
        </div>
      </div>

      {showScale && (
        <div style={{ background: C.bgRaised, border: `1px solid ${C.line}`, borderRadius: 6, padding: "10px 12px", marginTop: 8 }}>
          {RPE_SCALE.map((r) => (
            <div key={r.v} style={{ display: "flex", gap: 8, padding: "3px 0" }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.hazard, fontWeight: 700, width: 24, flexShrink: 0 }}>{r.v}</span>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: C.textDim, lineHeight: 1.4 }}>{r.d}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.textFaint, marginBottom: 6 }}>SETS · {completedCount}/{ex.sets} DONE</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {done.map((d, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <button onClick={() => toggleSet(i)} style={{
                width: 34, height: 34, borderRadius: "50%", border: `2px solid ${d ? C.hazard : C.line}`,
                background: d ? C.hazard : "transparent", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT_MONO, fontSize: 15, color: d ? "#1A1A1A" : C.textDim, fontWeight: 700,
              }}>{i + 1}</button>
              <input type="number" value={repsPerSet[i]} onChange={(e) => setReps(i, e.target.value)} placeholder={defaultReps}
                title="Reps completed"
                style={{ width: 34, textAlign: "center", background: C.bgRaised, border: `1px solid ${C.line}`, borderRadius: 4, padding: "3px 0", color: C.textDim, fontFamily: FONT_MONO, fontSize: 11, outline: "none" }} />
            </div>
          ))}
        </div>
      </div>

      {restRemaining != null && (
        <div style={{ background: C.signalDim, border: `1px solid ${C.signal}`, borderRadius: 8, padding: 12, marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.signal, letterSpacing: 1 }}>REST</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, color: C.text }}>{fmtTime(restRemaining)}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setRestRemaining((r) => (r || 0) + 30)} style={{ background: C.bgCard, border: `1px solid ${C.line}`, borderRadius: 6, padding: "8px 12px", color: C.text, fontFamily: FONT_MONO, fontSize: 13, cursor: "pointer" }}>+30s</button>
            <button onClick={() => setRestRemaining(null)} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 6, padding: "8px 12px", color: C.textDim, fontFamily: FONT_MONO, fontSize: 13, cursor: "pointer" }}>Skip</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SimBlock({ sim }) {
  return (
    <div>
      <div style={{ background: C.signalDim, border: `1px solid ${C.signal}`, borderRadius: 8, padding: 14, marginBottom: 12 }}>
        <div style={{ fontFamily: FONT_DISPLAY, color: C.signal, fontSize: 18, textTransform: "uppercase", letterSpacing: 0.5 }}>{sim.title}</div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.text, marginTop: 6, lineHeight: 1.5 }}>{sim.intro}</div>
      </div>
      {sim.stations.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${C.lineFaint}` }}>
          <div style={{ fontFamily: FONT_MONO, color: C.textFaint, fontSize: 14, width: 20 }}>{i + 1}</div>
          <div>
            <div style={{ fontFamily: FONT_BODY, fontWeight: 600, color: C.text, fontSize: 16 }}>{s.name}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.textDim, marginTop: 2 }}>{s.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================================
   TIMER TAB — AMRAP / For Time / EMOM / Tabata / Mix
   ======================================================================= */
const TIMER_MODES = [
  { id: "amrap", label: "AMRAP" },
  { id: "fortime", label: "For Time" },
  { id: "emom", label: "EMOM" },
  { id: "tabata", label: "Tabata" },
  { id: "mix", label: "Mix Timer" },
];

function buildPhases(cfg) {
  if (cfg.mode === "amrap") return [{ label: "AMRAP", seconds: cfg.amrapMinutes * 60, kind: "work" }];
  if (cfg.mode === "emom") return Array.from({ length: cfg.emomRounds }, (_, i) => ({ label: `Round ${i + 1}/${cfg.emomRounds}`, seconds: cfg.emomIntervalSec, kind: "work" }));
  if (cfg.mode === "tabata") {
    const phases = [];
    for (let r = 1; r <= cfg.tabataRounds; r++) {
      phases.push({ label: `Work ${r}/${cfg.tabataRounds}`, seconds: cfg.tabataWorkSec, kind: "work" });
      phases.push({ label: `Rest ${r}/${cfg.tabataRounds}`, seconds: cfg.tabataRestSec, kind: "rest" });
    }
    return phases;
  }
  if (cfg.mode === "mix") {
    const phases = [];
    for (let r = 1; r <= cfg.mixRounds; r++) {
      cfg.mixIntervals.forEach((iv) => phases.push({ label: `${iv.label} (R${r}/${cfg.mixRounds})`, seconds: iv.seconds, kind: "work" }));
    }
    return phases;
  }
  return [];
}

function useTimerEngine() {
  const [cfg, setCfg] = useState({
    mode: "amrap", amrapMinutes: 12,
    emomIntervalSec: 60, emomRounds: 10,
    tabataWorkSec: 20, tabataRestSec: 10, tabataRounds: 8,
    mixRounds: 1, mixIntervals: [{ label: "Work", seconds: 40 }, { label: "Rest", seconds: 20 }],
    forTimeCapMinutes: 0, // 0 = no cap
  });
  const [running, setRunning] = useState(false);
  const [preCounting, setPreCounting] = useState(false);
  const [preRemaining, setPreRemaining] = useState(10);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseRemaining, setPhaseRemaining] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [reps, setReps] = useState(0);
  const [finished, setFinished] = useState(false);
  const phasesRef = useRef([]);

  const actuallyStart = () => {
    if (cfg.mode === "fortime") {
      setElapsed(0); setFinished(false); setRunning(true); bell(); return;
    }
    const phases = buildPhases(cfg);
    phasesRef.current = phases;
    setPhaseIdx(0);
    setPhaseRemaining(phases[0]?.seconds || 0);
    setElapsed(0); setRounds(0); setFinished(false); setRunning(true);
    bell();
  };

  // Public start(): kicks off a 10-second "get ready" countdown with 3-2-1 pips,
  // then hands off to actuallyStart() once it hits zero.
  const start = () => {
    getAudioCtx(); // unlock/create audio context inside this user-gesture tap
    setPreRemaining(10);
    setPreCounting(true);
  };
  const skipPreCountdown = () => { setPreCounting(false); actuallyStart(); };
  const pause = () => setRunning(false);
  const resume = () => setRunning(true);
  const reset = () => {
    setRunning(false); setPreCounting(false); setFinished(false); setElapsed(0); setRounds(0); setReps(0); setPhaseIdx(0);
    setPhaseRemaining((buildPhases(cfg)[0] || {}).seconds || 0);
  };

  // Pre-start countdown ticker
  useEffect(() => {
    if (!preCounting) return;
    if (preRemaining <= 0) { setPreCounting(false); actuallyStart(); return; }
    if (preRemaining <= 3) pip();
    const id = setTimeout(() => setPreRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preCounting, preRemaining]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (cfg.mode === "fortime") {
        setElapsed((e) => {
          const next = e + 1;
          const cap = cfg.forTimeCapMinutes > 0 ? cfg.forTimeCapMinutes * 60 : null;
          if (cap != null) {
            const remaining = cap - next;
            if (remaining > 0 && remaining <= 3) pip();
            if (remaining <= 0) { setRunning(false); setFinished(true); bell(); }
          }
          return next;
        });
        return;
      }
      setPhaseRemaining((r) => {
        if (r <= 1) {
          const phases = phasesRef.current;
          const nextIdx = phaseIdx + 1;
          bell();
          if (nextIdx >= phases.length) {
            setRunning(false); setFinished(true);
            return 0;
          }
          setPhaseIdx(nextIdx);
          return phases[nextIdx].seconds;
        }
        if (r <= 4) pip();
        return r - 1;
      });
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phaseIdx, cfg.mode]);

  const phases = cfg.mode === "fortime" ? [] : buildPhases(cfg);
  const currentPhase = phases[phaseIdx];

  return { cfg, setCfg, running, start, skipPreCountdown, pause, resume, reset, preCounting, preRemaining, phaseIdx, phaseRemaining, elapsed, rounds, setRounds, reps, setReps, finished, phases, currentPhase };
}

function MiniTimerBar({ engine, onOpen }) {
  const { cfg, running, elapsed, phaseRemaining, currentPhase, finished } = engine;
  if (!running && !finished) return null;
  const display = cfg.mode === "fortime" ? fmtTime(elapsed) : fmtTime(phaseRemaining);
  return (
    <button onClick={onOpen} style={{
      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
      background: finished ? C.hazardDim : C.signalDim, border: `1px solid ${finished ? C.hazard : C.signal}`,
      borderRadius: 8, padding: "10px 14px", marginBottom: 14, cursor: "pointer",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <TimerIcon size={16} color={finished ? C.hazard : C.signal} />
        <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.text, letterSpacing: 0.5 }}>
          {TIMER_MODES.find((m) => m.id === cfg.mode)?.label}{currentPhase ? ` · ${currentPhase.label}` : ""}{finished ? " · DONE" : ""}
        </span>
      </div>
      <span style={{ fontFamily: FONT_MONO, fontSize: 20, color: C.text, fontWeight: 700 }}>{display}</span>
    </button>
  );
}

function TimerTab({ engine, onLogResult, context, onClearContext }) {
  const { cfg, setCfg, running, start, skipPreCountdown, pause, resume, reset, preCounting, preRemaining, phaseRemaining, elapsed, rounds, setRounds, reps, setReps, finished, currentPhase } = engine;
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (context?.title) setLabel(context.title);
  }, [context]);

  const numInput = (val, onChange, w = 70) => (
    <input type="number" value={val} onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      style={{ width: w, background: C.bgRaised, border: `1px solid ${C.line}`, borderRadius: 5, padding: "8px 10px", color: C.text, fontFamily: FONT_MONO, fontSize: 16, textAlign: "center", outline: "none" }} />
  );

  const saveResult = () => {
    const result = cfg.mode === "fortime" ? fmtTime(elapsed) : cfg.mode === "amrap" ? `${rounds} rounds in ${fmtTime(cfg.amrapMinutes * 60)}` : fmtTime(elapsed);
    onLogResult({ mode: cfg.mode, label: label || TIMER_MODES.find((m) => m.id === cfg.mode)?.label, result, elapsedSeconds: elapsed, rounds: cfg.mode === "amrap" ? rounds : null, reps, date: new Date().toISOString() });
    setLabel("");
    reset();
  };

  const isIdle = !running && elapsed === 0 && !finished;

  const ContextCard = context ? (
    <div style={{ background: C.signalDim, border: `1px solid ${C.signal}`, borderRadius: 10, padding: 14, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontFamily: FONT_DISPLAY, color: C.signal, fontSize: 16, textTransform: "uppercase" }}>{context.title}</div>
        <button onClick={onClearContext} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><Trash2 size={14} color={C.textFaint} /></button>
      </div>
      {(context.items || []).map((it, i) => (
        <div key={i} style={{ padding: "6px 0", borderTop: i > 0 ? `1px solid ${C.lineFaint}` : "none" }}>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 600, color: C.text, fontSize: 14 }}>{it.name}</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.textDim, marginTop: 1 }}>{it.detail}</div>
        </div>
      ))}
    </div>
  ) : null;

  if (preCounting) {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 36px) 16px 100px", textAlign: "center" }}>
        <div style={{ fontFamily: FONT_MONO, color: C.signal, fontSize: 14, letterSpacing: 2, marginBottom: 10 }}>GET READY</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 120, color: C.text, lineHeight: 1 }}>{preRemaining}</div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textDim, marginTop: 12 }}>{TIMER_MODES.find((m) => m.id === cfg.mode)?.label} starts in a few seconds…</div>
        <button onClick={skipPreCountdown} style={{ marginTop: 28, background: "none", border: `1px solid ${C.line}`, borderRadius: 8, padding: "10px 22px", color: C.textDim, fontFamily: FONT_DISPLAY, fontSize: 15, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>Skip</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 36px) 16px 100px" }}>
      <div style={{ fontFamily: FONT_MONO, color: C.hazard, fontSize: 14, letterSpacing: 2, marginBottom: 4 }}>TIMER</div>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 31, color: C.text, margin: "0 0 16px", textTransform: "uppercase" }}>Work the clock</h1>

      {ContextCard}

      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {TIMER_MODES.map((m) => (
          <button key={m.id} disabled={running} onClick={() => { setCfg((c) => ({ ...c, mode: m.id })); reset(); }}
            style={{
              padding: "8px 12px", borderRadius: 6, border: `1px solid ${cfg.mode === m.id ? C.hazard : C.line}`,
              background: cfg.mode === m.id ? C.hazardDim : C.bgCard, color: cfg.mode === m.id ? C.hazard : C.textDim,
              fontFamily: FONT_MONO, fontSize: 14, letterSpacing: 0.5, cursor: running ? "default" : "pointer", opacity: running ? 0.6 : 1,
            }}>{m.label}</button>
        ))}
      </div>

      {isIdle && (
        <div style={{ background: C.bgCard, border: `1px solid ${C.line}`, borderRadius: 10, padding: 16, marginBottom: 18 }}>
          {cfg.mode === "amrap" && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textDim }}>Minutes</span>
              {numInput(cfg.amrapMinutes, (v) => setCfg((c) => ({ ...c, amrapMinutes: v })))}
            </div>
          )}
          {cfg.mode === "fortime" && (
            <div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textDim, marginBottom: 12 }}>Stopwatch counts up from zero. Stop it when you finish the work — great for benchmark Hyrox-style pieces.</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textDim }}>Time cap (optional)</span>
                {numInput(cfg.forTimeCapMinutes, (v) => setCfg((c) => ({ ...c, forTimeCapMinutes: v })))}
                <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textFaint }}>min, 0 = no cap</span>
              </div>
            </div>
          )}
          {cfg.mode === "emom" && (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div><div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textFaint, marginBottom: 4 }}>SECONDS/ROUND</div>{numInput(cfg.emomIntervalSec, (v) => setCfg((c) => ({ ...c, emomIntervalSec: v })))}</div>
              <div><div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textFaint, marginBottom: 4 }}>ROUNDS</div>{numInput(cfg.emomRounds, (v) => setCfg((c) => ({ ...c, emomRounds: v })))}</div>
            </div>
          )}
          {cfg.mode === "tabata" && (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div><div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textFaint, marginBottom: 4 }}>WORK (S)</div>{numInput(cfg.tabataWorkSec, (v) => setCfg((c) => ({ ...c, tabataWorkSec: v })))}</div>
              <div><div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textFaint, marginBottom: 4 }}>REST (S)</div>{numInput(cfg.tabataRestSec, (v) => setCfg((c) => ({ ...c, tabataRestSec: v })))}</div>
              <div><div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textFaint, marginBottom: 4 }}>ROUNDS</div>{numInput(cfg.tabataRounds, (v) => setCfg((c) => ({ ...c, tabataRounds: v })))}</div>
            </div>
          )}
          {cfg.mode === "mix" && (
            <div>
              {cfg.mixIntervals.map((iv, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <input value={iv.label} onChange={(e) => { const arr = [...cfg.mixIntervals]; arr[i] = { ...iv, label: e.target.value }; setCfg((c) => ({ ...c, mixIntervals: arr })); }}
                    placeholder="Label" style={{ flex: 1, background: C.bgRaised, border: `1px solid ${C.line}`, borderRadius: 5, padding: "8px 10px", color: C.text, fontFamily: FONT_BODY, fontSize: 15, outline: "none" }} />
                  {numInput(iv.seconds, (v) => { const arr = [...cfg.mixIntervals]; arr[i] = { ...iv, seconds: v }; setCfg((c) => ({ ...c, mixIntervals: arr })); })}
                  <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textFaint }}>sec</span>
                  <button onClick={() => setCfg((c) => ({ ...c, mixIntervals: c.mixIntervals.filter((_, idx) => idx !== i) }))} style={{ background: "none", border: "none", cursor: "pointer" }}><Trash2 size={15} color={C.textFaint} /></button>
                </div>
              ))}
              <button onClick={() => setCfg((c) => ({ ...c, mixIntervals: [...c.mixIntervals, { label: "Interval", seconds: 30 }] }))}
                style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: `1px dashed ${C.line}`, borderRadius: 6, padding: "6px 10px", color: C.textDim, fontFamily: FONT_MONO, fontSize: 14, cursor: "pointer", marginTop: 4 }}>
                <Plus size={13} /> Add interval
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textDim }}>Repeat sequence</span>
                {numInput(cfg.mixRounds, (v) => setCfg((c) => ({ ...c, mixRounds: v })), 50)}
                <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textDim }}>times</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* big display */}
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        {currentPhase && cfg.mode !== "fortime" && (
          <div style={{ fontFamily: FONT_MONO, color: currentPhase.kind === "rest" ? C.signal : C.hazard, fontSize: 15, letterSpacing: 2, marginBottom: 6 }}>{currentPhase.label.toUpperCase()}</div>
        )}
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 80, color: C.text, letterSpacing: 1 }}>
          {cfg.mode === "fortime" ? fmtTime(elapsed) : fmtTime(phaseRemaining)}
        </div>
        {finished && <div style={{ fontFamily: FONT_MONO, color: C.hazard, fontSize: 16, letterSpacing: 1, marginTop: 6 }}>FINISHED</div>}

        {cfg.mode === "amrap" && (running || elapsed > 0) && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 16 }}>
            <button onClick={() => setRounds((r) => Math.max(0, r - 1))} style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${C.line}`, background: C.bgCard, cursor: "pointer" }}><Minus size={16} color={C.text} style={{ margin: "auto" }} /></button>
            <div style={{ fontFamily: FONT_MONO, color: C.text, fontSize: 22 }}>{rounds} <span style={{ fontSize: 13, color: C.textFaint }}>ROUNDS</span></div>
            <button onClick={() => setRounds((r) => r + 1)} style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${C.line}`, background: C.bgCard, cursor: "pointer" }}><Plus size={16} color={C.text} style={{ margin: "auto" }} /></button>
          </div>
        )}
        {(running || elapsed > 0) && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 14 }}>
            <button onClick={() => setReps((r) => Math.max(0, r - 1))} style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${C.line}`, background: C.bgCard, cursor: "pointer" }}><Minus size={14} color={C.text} style={{ margin: "auto" }} /></button>
            <div style={{ fontFamily: FONT_MONO, color: C.text, fontSize: 18 }}>{reps} <span style={{ fontSize: 12, color: C.textFaint }}>REPS</span></div>
            <button onClick={() => setReps((r) => r + 1)} style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${C.line}`, background: C.bgCard, cursor: "pointer" }}><Plus size={14} color={C.text} style={{ margin: "auto" }} /></button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
        {!running && !finished && (
          <button onClick={start} style={{ display: "flex", alignItems: "center", gap: 6, background: C.hazard, border: "none", borderRadius: 8, padding: "12px 24px", color: "#1A1A1A", fontFamily: FONT_DISPLAY, fontSize: 17, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}><Play size={16} /> Start</button>
        )}
        {running && (
          <button onClick={pause} style={{ display: "flex", alignItems: "center", gap: 6, background: C.bgCard, border: `1px solid ${C.line}`, borderRadius: 8, padding: "12px 24px", color: C.text, fontFamily: FONT_DISPLAY, fontSize: 17, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}><Pause size={16} /> Pause</button>
        )}
        {!running && elapsed > 0 && !finished && (
          <button onClick={resume} style={{ display: "flex", alignItems: "center", gap: 6, background: C.hazard, border: "none", borderRadius: 8, padding: "12px 24px", color: "#1A1A1A", fontFamily: FONT_DISPLAY, fontSize: 17, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}><Play size={16} /> Resume</button>
        )}
        {(elapsed > 0 || finished) && (
          <button onClick={reset} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: `1px solid ${C.line}`, borderRadius: 8, padding: "12px 18px", color: C.textDim, fontFamily: FONT_DISPLAY, fontSize: 17, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}><RotateCcw size={16} /></button>
        )}
      </div>

      {(elapsed > 0 || finished) && (
        <div style={{ background: C.bgRaised, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textFaint, marginBottom: 8 }}>SAVE THIS RESULT TO YOUR LOG</div>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Saturday Hyrox sim, Ski Erg finisher…"
            style={{ width: "100%", background: C.bgCard, border: `1px solid ${C.line}`, borderRadius: 6, padding: "10px 12px", color: C.text, fontFamily: FONT_BODY, fontSize: 15, boxSizing: "border-box", outline: "none", marginBottom: 10 }} />
          <button onClick={saveResult} style={{ width: "100%", background: C.hazard, border: "none", borderRadius: 6, padding: "10px", color: "#1A1A1A", fontFamily: FONT_DISPLAY, fontSize: 16, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>Save to log</button>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   CALENDAR VIEW
   ======================================================================= */
function CalendarView({ completedDays }) {
  const [monthDate, setMonthDate] = useState(() => {
    if (completedDays.length) return new Date(completedDays[completedDays.length - 1].completedAt);
    return new Date();
  });
  const byDateKey = useMemo(() => {
    const map = {};
    completedDays.forEach((d) => {
      const key = new Date(d.completedAt).toDateString();
      if (!map[key]) map[key] = [];
      map[key].push(d);
    });
    return map;
  }, [completedDays]);

  const year = monthDate.getFullYear(), month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const monthLabel = monthDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const today = new Date();

  return (
    <div style={{ background: C.bgRaised, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <button onClick={() => setMonthDate(new Date(year, month - 1, 1))} style={{ background: C.bgCard, border: `1px solid ${C.line}`, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronLeft size={14} color={C.text} /></button>
        <div style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.text, letterSpacing: 1 }}>{monthLabel.toUpperCase()}</div>
        <button onClick={() => setMonthDate(new Date(year, month + 1, 1))} style={{ background: C.bgCard, border: `1px solid ${C.line}`, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronRight size={14} color={C.text} /></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontFamily: FONT_MONO, fontSize: 12, color: C.textFaint }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const dateObj = new Date(year, month, d);
          const key = dateObj.toDateString();
          const dayEntries = byDateKey[key];
          const isToday = dateObj.toDateString() === today.toDateString();
          return (
            <div key={i} title={dayEntries ? dayEntries.map((e) => e.dayType).join(", ") : undefined}
              style={{ aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, background: dayEntries ? C.hazardDim : "transparent", border: isToday ? `1px solid ${C.signal}` : "1px solid transparent" }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: dayEntries ? C.hazard : C.textDim, fontWeight: dayEntries ? 700 : 400 }}>{d}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   LOG TAB
   ======================================================================= */
function SingleLineChart({ points }) {
  const W = 560, H = 140, PAD = 28;
  if (!points || points.length < 2) return null;
  const weeks = points.map((p) => p.week);
  const vals = points.map((p) => p.weight);
  const minW = Math.min(...weeks), maxW = Math.max(...weeks);
  const minV = Math.min(...vals), maxV = Math.max(...vals);
  const x = (w) => PAD + ((w - minW) / Math.max(1, maxW - minW)) * (W - PAD * 2);
  const y = (v) => H - PAD - ((v - minV) / Math.max(1, maxV - minV || 1)) * (H - PAD * 2);
  const pts = points.map((p) => `${x(p.week)},${y(p.weight)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block" }}>
      {[0, 0.5, 1].map((t, i) => (
        <line key={i} x1={PAD} x2={W - PAD} y1={PAD + t * (H - PAD * 2)} y2={PAD + t * (H - PAD * 2)} stroke="#292D2F" strokeDasharray="3 3" />
      ))}
      <polyline points={pts} fill="none" stroke={C.hazard} strokeWidth="2" />
      {points.map((p, i) => <circle key={i} cx={x(p.week)} cy={y(p.weight)} r="3" fill={C.hazard} />)}
      <text x={PAD} y={H - 6} fill="#6B7275" fontSize="12" fontFamily="'JetBrains Mono', monospace">W{minW}</text>
      <text x={W - PAD} y={H - 6} textAnchor="end" fill="#6B7275" fontSize="12" fontFamily="'JetBrains Mono', monospace">W{maxW}</text>
    </svg>
  );
}

function LogTab({ logs, timerLogs }) {
  const completedDays = useMemo(() => allCompletedDays(logs), [logs]);
  const [expanded, setExpanded] = useState(null);

  const byExercise = useMemo(() => {
    const map = {};
    allEntries(logs).forEach((e) => {
      if (e.weight == null) return;
      if (!map[e.name]) map[e.name] = [];
      map[e.name].push(e);
    });
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.week - b.week));
    return map;
  }, [logs]);

  const chartData = useMemo(() => {
    const byWeek = {};
    allEntries(logs).forEach((e) => {
      if (!e.liftKey || e.weight == null) return;
      if (!byWeek[e.week]) byWeek[e.week] = { week: e.week };
      byWeek[e.week][e.liftKey] = e.weight;
    });
    return Object.values(byWeek).sort((a, b) => a.week - b.week);
  }, [logs]);

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 36px) 16px 100px" }}>
      <div style={{ fontFamily: FONT_MONO, color: C.hazard, fontSize: 14, letterSpacing: 2, marginBottom: 4 }}>LOG</div>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 31, color: C.text, margin: "0 0 16px", textTransform: "uppercase" }}>Your progress</h1>

      <CalendarView completedDays={completedDays} />

      {chartData.length > 1 && (
        <div style={{ background: C.bgRaised, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <TrendingUp size={14} color={C.hazard} />
            <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.text, letterSpacing: 1 }}>MAIN LIFTS</div>
          </div>
          <MiniLineChart data={chartData} />
        </div>
      )}

      <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textFaint, letterSpacing: 1, marginBottom: 10 }}>EXERCISE HISTORY</div>
      {Object.keys(byExercise).length === 0 && <div style={{ fontFamily: FONT_BODY, color: C.textFaint, fontSize: 15, marginBottom: 20 }}>Nothing logged yet — complete a session to see progression here.</div>}
      {Object.entries(byExercise).map(([name, arr]) => {
        const isOpen = expanded === name;
        const chartPoints = arr.map((e) => ({ week: e.week, weight: e.weight }));
        const tableRows = [...arr].reverse();
        return (
          <div key={name} style={{ background: C.bgCard, border: `1px solid ${C.line}`, borderRadius: 8, padding: 14, marginBottom: 10 }}>
            <button onClick={() => setExpanded(isOpen ? null : name)} style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: FONT_BODY, fontWeight: 600, color: C.text, fontSize: 16 }}>{name}</div>
              <ChevronRight size={16} color={C.textFaint} style={{ transform: isOpen ? "rotate(90deg)" : "none" }} />
            </button>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
              {arr.map((e, i) => (
                <span key={i} style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textDim, background: C.bgRaised, padding: "4px 8px", borderRadius: 4 }}>
                  W{e.week}: {fmtKg(e.weight)}kg
                </span>
              ))}
            </div>
            {isOpen && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.line}` }}>
                <SingleLineChart points={chartPoints} />
                <div style={{ marginTop: 12 }}>
                  {tableRows.map((e, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: i > 0 ? `1px solid ${C.lineFaint}` : "none" }}>
                      <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textDim }}>{e.date ? new Date(e.date).toLocaleDateString() : `Week ${e.week}`}</span>
                      <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.text, fontWeight: 700 }}>{fmtKg(e.weight)}kg</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textFaint, letterSpacing: 1, margin: "24px 0 10px" }}>CONDITIONING TIMES</div>
      {(!timerLogs || timerLogs.length === 0) && <div style={{ fontFamily: FONT_BODY, color: C.textFaint, fontSize: 15 }}>No timed sessions logged yet.</div>}
      {(timerLogs || []).slice().reverse().map((t, i) => (
        <div key={i} style={{ background: C.bgCard, border: `1px solid ${C.line}`, borderRadius: 8, padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: FONT_BODY, fontWeight: 600, color: C.text, fontSize: 15 }}>{t.label}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textFaint, marginTop: 2 }}>{TIMER_MODES.find((m) => m.id === t.mode)?.label} · {new Date(t.date).toLocaleDateString()}</div>
          </div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 17, color: C.hazard, fontWeight: 700 }}>{t.result}</div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================================
   WARM-UP BLOCK
   ======================================================================= */
function WarmupBlock({ warmup }) {
  if (!warmup || warmup.length === 0) return null;
  const totalSec = warmup.reduce((s, w) => s + w.seconds, 0);
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textFaint, letterSpacing: 1, marginBottom: 8 }}>
        WARM-UP · {Math.round(totalSec / 60)} MIN
      </div>
      {warmup.map((w, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: i < warmup.length - 1 ? `1px solid ${C.lineFaint}` : "none" }}>
          <div style={{ fontFamily: FONT_MONO, color: C.signal, fontSize: 13, width: 34, flexShrink: 0, paddingTop: 1 }}>{fmtTime(w.seconds)}</div>
          <div>
            <div style={{ fontFamily: FONT_BODY, fontWeight: 600, color: C.text, fontSize: 15 }}>{w.name}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: C.textDim, marginTop: 1 }}>{w.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================================
   PROGRAM TAB (dashboard + session)
   ======================================================================= */
const STALE_WORKOUT_SECONDS = 4 * 3600; // 4 hours — beyond this, it's almost certainly a forgotten Finish, not a real session

function LiveStopwatch({ startedAtIso, onReset }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const elapsed = Math.max(0, (now - new Date(startedAtIso).getTime()) / 1000);
  const stale = elapsed > STALE_WORKOUT_SECONDS;

  if (stale) {
    return (
      <div style={{ background: C.hazardDim, border: `1px solid ${C.hazard}`, borderRadius: 8, padding: 12, marginBottom: 14 }}>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 600, color: C.hazard, fontSize: 14 }}>This looks like an old, forgotten start</div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.textDim, marginTop: 4, lineHeight: 1.4 }}>
          Started {fmtDuration(elapsed)} ago — probably a session you forgot to finish. Reset it to start fresh.
        </div>
        <button onClick={onReset} style={{ marginTop: 10, background: C.hazard, border: "none", borderRadius: 6, padding: "8px 14px", color: "#1A1A1A", fontFamily: FONT_DISPLAY, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
          Reset now
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.hazard }} />
      <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textDim, letterSpacing: 1 }}>WORKOUT TIME</span>
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: C.text }}>{fmtDuration(elapsed)}</span>
    </div>
  );
}

function FinisherPicker({ activeKey, availableKeys, onSelect, onClose }) {
  return (
    <div style={{ background: C.bgRaised, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.textFaint, letterSpacing: 1, marginBottom: 10 }}>SWAP THIS FINISHER</div>
      {availableKeys.map((key) => {
        const meta = FINISHER_META[key];
        const isActive = key === activeKey;
        return (
          <button key={key} onClick={() => onSelect(key)} style={{
            width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center",
            background: isActive ? C.hazardDim : C.bgCard, border: `1px solid ${isActive ? C.hazard : C.line}`,
            borderRadius: 8, padding: "10px 12px", marginBottom: 8, cursor: "pointer",
          }}>
            <div>
              <div style={{ fontFamily: FONT_BODY, fontWeight: 600, color: isActive ? C.hazard : C.text, fontSize: 15 }}>{meta.label}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: key === "sled" ? C.signal : C.textFaint, marginTop: 2 }}>{meta.space}</div>
            </div>
            {isActive && <CheckCircle2 size={16} color={C.hazard} />}
          </button>
        );
      })}
      <button onClick={onClose} style={{ width: "100%", background: "none", border: "none", color: C.textDim, fontFamily: FONT_MONO, fontSize: 13, padding: "8px 0 0", cursor: "pointer" }}>Close</button>
    </div>
  );
}

function RepsStepper({ value, onChange, label = "REPS/ROUNDS" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
      <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textFaint, letterSpacing: 1 }}>{label}</span>
      <button onClick={() => onChange(Math.max(0, (value || 0) - 1))} style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${C.line}`, background: C.bgRaised, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={13} color={C.text} /></button>
      <span style={{ fontFamily: FONT_MONO, fontSize: 16, color: C.text, minWidth: 20, textAlign: "center" }}>{value || 0}</span>
      <button onClick={() => onChange((value || 0) + 1)} style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${C.line}`, background: C.bgRaised, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={13} color={C.text} /></button>
    </div>
  );
}

function ProgramTab({ profile, logs, equipment, saveEntry, saveDayMeta, week, setWeek, engine, onOpenTimer, onTimeWorkout }) {
  const [activeDay, setActiveDay] = useState(null);
  const [quoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [tipIdx] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [showFinisherPicker, setShowFinisherPicker] = useState(false);

  const phase = getPhase(week);
  const deload = isDeload(week);
  const phaseIdx = PHASES.findIndex((p) => p.id === phase.id);
  const sessions = useMemo(() => DAY_DEFS.map((d) => ({ ...d, session: buildDaySession(d.key, week, profile, logs, equipment) })), [week, profile, logs, equipment]);
  const active = activeDay ? sessions.find((s) => s.key === activeDay) : null;
  const wk = wKey(week);

  const openDay = (key) => { setActiveDay(key); setShowFinisherPicker(false); };
  const startWorkout = (key, dayType) => saveDayMeta(key, { startedAt: new Date().toISOString(), dayType, completedAt: null });
  const finishWorkout = (key, dayType) => saveDayMeta(key, { completedAt: new Date().toISOString(), dayType });
  const resetDay = (key) => {
    if (!window.confirm("Reset this day? This clears the start/finish time (your logged sets and weights stay).")) return;
    saveDayMeta(key, { startedAt: null, completedAt: null });
  };
  const resetDaySilent = (key) => saveDayMeta(key, { startedAt: null, completedAt: null });

  if (active) {
    const { session, label, mins } = active;
    const dayMeta = logs[wk]?.days?.[active.key];
    const started = !!dayMeta?.startedAt;
    const completed = !!dayMeta?.completedAt;
    const conditioningReps = dayMeta?.conditioningReps || {};
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 36px) 16px 100px" }}>
        <button onClick={() => setActiveDay(null)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: C.textDim, fontFamily: FONT_BODY, fontSize: 15, cursor: "pointer", padding: 0, marginBottom: 16 }}>
          <ChevronLeft size={16} /> Back to week {week}
        </button>
        <MiniTimerBar engine={engine} onOpen={onOpenTimer} />
        <div style={{ marginBottom: 6 }}><Pill tone={session?.sim ? "signal" : "hazard"}>{label} · {mins} min</Pill></div>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 31, color: C.text, margin: "6px 0 4px", textTransform: "uppercase" }}>{session.dayType}</h2>
        {deload && <div style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.signal, marginBottom: 8 }}>DELOAD WEEK — reduced load, same intent</div>}

        {completed && (
          <div style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.hazard, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <CheckCircle2 size={14} /> Completed {fmtCompletedDate(dayMeta.completedAt)}
            {dayMeta.startedAt && ` · ${fmtDuration((new Date(dayMeta.completedAt) - new Date(dayMeta.startedAt)) / 1000)}`}
          </div>
        )}
        {started && !completed && <LiveStopwatch startedAtIso={dayMeta.startedAt} onReset={() => resetDaySilent(active.key)} />}

        {!started && (
          <button onClick={() => startWorkout(active.key, session.dayType)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.hazard, border: "none", borderRadius: 8, padding: "14px", color: "#1A1A1A", fontFamily: FONT_DISPLAY, fontSize: 17, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", marginBottom: 16 }}>
            <Play size={18} /> Start Workout
          </button>
        )}

        <WarmupBlock warmup={session.warmup} />

        {session?.sim ? (
          <>
            <SimBlock sim={session.sim} />
            <button onClick={() => onTimeWorkout(session.sim.title, session.sim.stations)} style={{ marginTop: 14, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: C.signalDim, border: `1px solid ${C.signal}`, borderRadius: 8, padding: "12px", color: C.signal, fontFamily: FONT_DISPLAY, fontSize: 16, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
              <TimerIcon size={16} /> Time this session
            </button>
          </>
        ) : (
          <>
            <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textFaint, letterSpacing: 1, margin: "16px 0 8px" }}>STRENGTH</div>
            {session.strength.map((ex) => <ExerciseCard key={ex.id} ex={ex} week={week} logs={logs} dayType={session.dayType} onSave={saveEntry} />)}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0 8px" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textFaint, letterSpacing: 1 }}>CONDITIONING · 10-15 MIN</div>
              <button onClick={() => onTimeWorkout(`${session.dayType} Finisher`, session.conditioning)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: C.signal, fontFamily: FONT_MONO, fontSize: 13, cursor: "pointer" }}><TimerIcon size={13} /> Time it</button>
            </div>
            {session.conditioning.map((c, i) => (
              <div key={i} style={{ background: C.bgCard, border: `1px solid ${C.line}`, borderRadius: 8, padding: 14, marginBottom: 8 }}>
                <div style={{ fontFamily: FONT_BODY, fontWeight: 600, color: C.text, fontSize: 16 }}>{c.name}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.textDim, marginTop: 3 }}>{c.detail}</div>
                <RepsStepper value={conditioningReps[i]} onChange={(v) => saveDayMeta(active.key, { conditioningReps: { ...conditioningReps, [i]: v } })} />
              </div>
            ))}
            {showFinisherPicker ? (
              <FinisherPicker
                activeKey={session.conditioningKey}
                availableKeys={getAllFinisherKeys(equipment)}
                onSelect={(key) => { saveDayMeta(active.key, { finisherOverride: key }); setShowFinisherPicker(false); }}
                onClose={() => setShowFinisherPicker(false)}
              />
            ) : (
              <button onClick={() => setShowFinisherPicker(true)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "none", border: `1px dashed ${C.line}`, borderRadius: 8, padding: "10px", color: C.textDim, fontFamily: FONT_MONO, fontSize: 13, letterSpacing: 0.5, cursor: "pointer", marginBottom: 8 }}>
                <RotateCcw size={13} /> Select New Workout
              </button>
            )}
          </>
        )}

        {started && !completed && (
          <button onClick={() => finishWorkout(active.key, session.dayType)} style={{ marginTop: 20, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "none", border: `1px solid ${C.hazard}`, borderRadius: 8, padding: "14px", color: C.hazard, fontFamily: FONT_DISPLAY, fontSize: 17, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
            <CheckCircle2 size={18} /> Finish Workout
          </button>
        )}
        {started && (
          <button onClick={() => resetDay(active.key)} style={{ marginTop: 10, width: "100%", background: "none", border: "none", color: C.textFaint, fontFamily: FONT_MONO, fontSize: 12, padding: "6px 0", cursor: "pointer" }}>
            Reset (accidentally started?)
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 36px) 16px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={APP_ICON} alt="My Trainer" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: FONT_MONO, color: C.hazard, fontSize: 14, letterSpacing: 2 }}>MY TRAINER</div>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 33, color: C.text, margin: "2px 0 0", textTransform: "uppercase" }}>Week {week} <span style={{ color: C.textFaint, fontSize: 20 }}>/ 26</span></h1>
          </div>
        </div>
      </div>

      <MiniTimerBar engine={engine} onOpen={onOpenTimer} />

      <div style={{ background: `linear-gradient(135deg, ${C.hazardDim}, ${C.bgRaised})`, border: `1px solid ${C.hazardDim}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Flame size={16} color={C.hazard} style={{ marginTop: 2, flexShrink: 0 }} />
          <div style={{ fontFamily: FONT_BODY, fontStyle: "italic", color: C.text, fontSize: 16, lineHeight: 1.5 }}>"{QUOTES[quoteIdx]}"</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
        {PHASES.map((p, i) => (
          <div key={p.id} style={{ flex: p.range[1] - p.range[0] + 1, height: 5, borderRadius: 3, background: C.hazard, opacity: i === phaseIdx ? 1 : i < phaseIdx ? 0.5 : 0.2 }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.textDim }}>PHASE {phaseIdx + 1}/5 · <span style={{ color: C.text, fontWeight: 700 }}>{phase.name.toUpperCase()}</span> — {phase.focus}</div>
        <PlateStack level={phaseIdx + 1} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={() => setWeek(Math.max(1, week - 1))} disabled={week === 1} style={{ background: C.bgCard, border: `1px solid ${C.line}`, borderRadius: 6, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: week === 1 ? "default" : "pointer", opacity: week === 1 ? 0.4 : 1 }}><ChevronLeft size={16} color={C.text} /></button>
        <div style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.textDim }}>{deload ? <span style={{ color: C.signal, fontWeight: 700 }}>DELOAD</span> : "TRAINING WEEK"}</div>
        <button onClick={() => setWeek(Math.min(26, week + 1))} disabled={week === 26} style={{ background: C.bgCard, border: `1px solid ${C.line}`, borderRadius: 6, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: week === 26 ? "default" : "pointer", opacity: week === 26 ? 0.4 : 1 }}><ChevronRight size={16} color={C.text} /></button>
      </div>

      {sessions.map((s) => {
        const dayMeta = logs[wk]?.days?.[s.key];
        const complete = !!dayMeta?.completedAt;
        const inProgress = !!dayMeta?.startedAt && !complete;
        const duration = dayMeta?.completedAt && dayMeta?.startedAt ? fmtDuration((new Date(dayMeta.completedAt) - new Date(dayMeta.startedAt)) / 1000) : null;
        return (
          <button key={s.key} onClick={() => openDay(s.key)} style={{ width: "100%", textAlign: "left", background: C.bgCard, border: `1px solid ${complete ? C.hazardDim : inProgress ? C.signal : C.line}`, borderRadius: 10, padding: 14, marginBottom: 10, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.textFaint, letterSpacing: 1 }}>{s.label.toUpperCase()} · {s.mins} MIN</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: C.text, textTransform: "uppercase", marginTop: 2 }}>{s.session?.dayType}</div>
              {complete ? (
                <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.hazard, marginTop: 3 }}>
                  Completed {fmtCompletedDate(dayMeta.completedAt)}{duration ? ` · ${duration}` : ""}
                </div>
              ) : inProgress ? (
                <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.signal, marginTop: 3 }}>In progress…</div>
              ) : null}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {complete ? <CheckCircle2 size={18} color={C.hazard} /> : inProgress ? <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.signal }} /> : s.key === "sat" ? <Activity size={16} color={C.signal} /> : <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${C.textFaint}` }} />}
              <ChevronRight size={16} color={C.textFaint} />
            </div>
          </button>
        );
      })}

      <div style={{ background: C.bgRaised, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, marginTop: 8, marginBottom: 16 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.signal, letterSpacing: 1, marginBottom: 6 }}>COACH TIP</div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textDim, lineHeight: 1.5 }}>{TIPS[tipIdx]}</div>
      </div>
    </div>
  );
}

/* =========================================================================
   TAB BAR
   ======================================================================= */
function TabBar({ tab, setTab, timerActive }) {
  const tabs = [
    { id: "program", label: "Program", icon: CalendarDays },
    { id: "timer", label: "Timer", icon: TimerIcon },
    { id: "log", label: "Log", icon: ClipboardList },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.bgRaised, borderTop: `1px solid ${C.line}`, display: "flex", zIndex: 30, paddingBottom: "env(safe-area-inset-bottom)" }}>
      {tabs.map((t) => {
        const Icon = t.icon; const activeTab = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: "none", border: "none", padding: "10px 0 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", position: "relative" }}>
            <Icon size={20} color={activeTab ? C.hazard : C.textFaint} />
            <span style={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: 0.5, color: activeTab ? C.hazard : C.textFaint, textTransform: "uppercase" }}>{t.label}</span>
            {t.id === "timer" && timerActive && <span style={{ position: "absolute", top: 6, right: "32%", width: 7, height: 7, borderRadius: "50%", background: C.signal }} />}
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================================
   ROOT
   ======================================================================= */
function useWakeLock() {
  const lockRef = useRef(null);

  const requestLock = useCallback(async () => {
    if (!("wakeLock" in navigator)) return;
    try {
      lockRef.current = await navigator.wakeLock.request("screen");
    } catch (e) {
      // Wake Lock can be refused (e.g. low battery) — fail silently, screen will just sleep normally.
    }
  }, []);

  useEffect(() => {
    requestLock();
    const onVisibility = () => {
      // The lock is auto-released whenever the tab/app is backgrounded, so re-acquire on return.
      if (document.visibilityState === "visible") requestLock();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (lockRef.current) lockRef.current.release().catch(() => {});
    };
  }, [requestLock]);
}

const DEFAULT_EQUIPMENT = { adjustableBench: false, rower: false, wallball: false };

function SettingsModal({ equipment, onSaveEquipment, onReset, onClose }) {
  const [local, setLocal] = useState(equipment);
  const toggle = (key) => setLocal((l) => ({ ...l, [key]: !l[key] }));
  const items = [
    { key: "adjustableBench", label: "Adjustable Bench", detail: "Unlocks Incline DB Bench Press as a Tuesday accessory" },
    { key: "rower", label: "Rower", detail: "Adds Row as a finisher option, and swaps in real rowing on the Hyrox sim" },
    { key: "wallball", label: "Wall Ball", detail: "Adds Wall Balls as a finisher option, and swaps in real wall balls on the Hyrox sim" },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", zIndex: 50 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.bgRaised, width: "100%", maxHeight: "85vh", overflowY: "auto", borderRadius: "16px 16px 0 0", border: `1px solid ${C.line}`, borderBottom: "none", padding: "20px 18px calc(env(safe-area-inset-bottom) + 24px)" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: C.text, textTransform: "uppercase", marginBottom: 4 }}>Settings</div>

        <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.textFaint, letterSpacing: 1, margin: "18px 0 10px" }}>EQUIPMENT</div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.textDim, marginBottom: 12, lineHeight: 1.5 }}>
          Tell the agent what else you've got — it'll automatically work new options into your programming.
        </div>
        {items.map((it) => (
          <button key={it.key} onClick={() => toggle(it.key)} style={{
            width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center",
            background: local[it.key] ? C.hazardDim : C.bgCard, border: `1px solid ${local[it.key] ? C.hazard : C.line}`,
            borderRadius: 8, padding: "10px 12px", marginBottom: 8, cursor: "pointer",
          }}>
            <div>
              <div style={{ fontFamily: FONT_BODY, fontWeight: 600, color: local[it.key] ? C.hazard : C.text, fontSize: 15 }}>{it.label}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.textFaint, marginTop: 2 }}>{it.detail}</div>
            </div>
            <CheckCircle2 size={18} color={local[it.key] ? C.hazard : C.textFaint} />
          </button>
        ))}
        <button onClick={() => onSaveEquipment(local)} style={{ width: "100%", background: C.hazard, border: "none", borderRadius: 8, padding: "12px", color: "#1A1A1A", fontFamily: FONT_DISPLAY, fontSize: 15, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", marginTop: 4 }}>
          Save Equipment
        </button>

        <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.textFaint, letterSpacing: 1, margin: "26px 0 10px" }}>PROGRAM</div>
        <button onClick={onReset} style={{ width: "100%", background: "none", border: `1px solid ${C.hazard}`, borderRadius: 8, padding: "12px", color: C.hazard, fontFamily: FONT_DISPLAY, fontSize: 15, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
          Reset Program
        </button>

        <button onClick={onClose} style={{ width: "100%", background: "none", border: "none", color: C.textDim, fontFamily: FONT_MONO, fontSize: 13, padding: "16px 0 0", cursor: "pointer" }}>Close</button>
      </div>
    </div>
  );
}

function App() {
  const [profile, setProfile] = useState(undefined);
  const [logs, setLogs] = useState({});
  const [timerLogs, setTimerLogs] = useState([]);
  const [equipment, setEquipment] = useState(DEFAULT_EQUIPMENT);
  const [week, setWeek] = useState(1);
  const [tab, setTab] = useState("program");
  const [showSettings, setShowSettings] = useState(false);
  const [timerContext, setTimerContext] = useState(null);
  const engine = useTimerEngine();
  useWakeLock();

  useEffect(() => {
    (async () => {
      const p = await loadKey("profile", null);
      const l = await loadKey("logs", {});
      const tl = await loadKey("timerLogs", []);
      const eq = await loadKey("equipment", DEFAULT_EQUIPMENT);
      setProfile(p); setLogs(l || {}); setTimerLogs(tl || []); setEquipment({ ...DEFAULT_EQUIPMENT, ...(eq || {}) });
    })();
  }, []);

  const handleOnboard = async (p) => { setProfile(p); await saveKey("profile", p); };
  const handleReset = async () => {
    if (!window.confirm("Reset your program? This clears your 1RMs and logged sessions.")) return;
    setProfile(null); setLogs({}); setTimerLogs([]);
    await saveKey("profile", null); await saveKey("logs", {}); await saveKey("timerLogs", []);
    setShowSettings(false);
  };
  const handleSaveEquipment = async (eq) => {
    setEquipment(eq);
    await saveKey("equipment", eq);
    setShowSettings(false);
  };

  const saveEntry = useCallback((exId, entry) => {
    setLogs((prev) => {
      const wk = wKey(week);
      const day = prev[wk] || { week, entries: {} };
      const next = { ...prev, [wk]: { ...day, entries: { ...day.entries, [exId]: entry } } };
      saveKey("logs", next);
      return next;
    });
  }, [week]);

  const saveDayMeta = useCallback((dayKey, patch) => {
    setLogs((prev) => {
      const wk = wKey(week);
      const day = prev[wk] || { week, entries: {}, days: {} };
      const days = { ...(day.days || {}), [dayKey]: { ...(day.days?.[dayKey] || {}), ...patch } };
      const next = { ...prev, [wk]: { ...day, days } };
      saveKey("logs", next);
      return next;
    });
  }, [week]);

  const onLogTimerResult = (result) => {
    setTimerLogs((prev) => {
      const next = [...prev, { ...result, week }];
      saveKey("timerLogs", next);
      return next;
    });
    setTimerContext(null);
    setTab("program");
  };

  // Jumps to the Timer tab pre-loaded with the workout you were looking at,
  // so you can see the moves while the clock runs instead of flipping tabs.
  const onTimeWorkout = (title, items) => {
    setTimerContext({ title, items });
    if (!engine.running) engine.setCfg((c) => ({ ...c, mode: "amrap", amrapMinutes: 12 }));
    setTab("timer");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT_BODY }}>
      <style>{`
        @import url('${FONT_IMPORT_URL}');
        * { box-sizing: border-box; }
        body { margin: 0; }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
      `}</style>
      {profile === undefined ? (
        <div style={{ padding: 60, textAlign: "center" }}>
          <img src={APP_ICON} alt="My Trainer" style={{ width: 64, height: 64, borderRadius: 14, marginBottom: 14 }} />
          <div style={{ color: C.textFaint, fontFamily: FONT_MONO, fontSize: 14 }}>Loading…</div>
        </div>
      ) : !profile ? (
        <Onboarding onComplete={handleOnboard} />
      ) : (
        <>
          {tab === "program" && (
            <ProgramTab profile={profile} logs={logs} equipment={equipment} saveEntry={saveEntry} saveDayMeta={saveDayMeta} week={week} setWeek={setWeek} engine={engine} onOpenTimer={() => setTab("timer")} onTimeWorkout={onTimeWorkout} />
          )}
          {tab === "timer" && <TimerTab engine={engine} onLogResult={onLogTimerResult} context={timerContext} onClearContext={() => setTimerContext(null)} />}
          {tab === "log" && <LogTab logs={logs} timerLogs={timerLogs} />}
          <TabBar tab={tab} setTab={setTab} timerActive={engine.running} />
          <button onClick={() => setShowSettings(true)} title="Settings" style={{ position: "fixed", top: "calc(env(safe-area-inset-top) + 14px)", right: 14, background: C.bgRaised, border: `1px solid ${C.line}`, borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 25 }}>
            <Settings size={16} color={C.textFaint} />
          </button>
          {showSettings && <SettingsModal equipment={equipment} onSaveEquipment={handleSaveEquipment} onReset={handleReset} onClose={() => setShowSettings(false)} />}
        </>
      )}
    </div>
  );
}

const _root = ReactDOM.createRoot(document.getElementById("root"));
_root.render(<App />);
