// Do I Need a Jacket? — Übersicht Widget
// Uses wttr.in (free, no API key needed).
// Edit CITY below to change location.

const CITY = "Ithaca,NY";
const REFRESH_MINUTES = 30;

export const command = `curl -sf "https://wttr.in/?format=j1" 2>/dev/null || echo '{"error":true}'`;
export const refreshFrequency = REFRESH_MINUTES * 60 * 1000;

// --- Position on screen ---
export const className = `
  top: 490px;
  left: 40px;
  width: 300px;
  font-family: Source Han Code JP, Helvetica Neue;
  -webkit-font-smoothing: antialiased;
`;

// --- Jacket verdict logic ---
function getVerdict(tempF, rainChance, isSnow) {
  if (isSnow || tempF < 38)  return { label: "yes — heavy coat",   color: "#185FA5", bg: "rgba(24,95,165,0.12)", icon: "coat"   };
  if (tempF < 52)             return { label: "yes — jacket",       color: "#854F0B", bg: "rgba(133,79,11,0.12)", icon: "jacket" };
  if (tempF < 65 || rainChance >= 50)
                              return { label: "maybe bring one",    color: "#3B6D11", bg: "rgba(59,109,17,0.12)", icon: "light"  };
  if (rainChance >= 25)       return { label: "light layer, maybe", color: "#3B6D11", bg: "rgba(59,109,17,0.08)", icon: "light"  };
  return                             { label: "nope, you're good",  color: "#0F6E56", bg: "rgba(15,110,86,0.10)", icon: "none"   };
}

// --- SVG icons (jacket, coat, light layer, none) ---
function JacketIcon({ type, color }) {
  const c = color;
  if (type === "coat") return (
    <svg width="34" height="34" viewBox="0 0 44 44" fill="none">
      <rect x="15" y="4"  width="14" height="18" rx="7"  fill={c} opacity="0.85"/>
      <rect x="11" y="18" width="22" height="18" rx="3"  fill={c}/>
      <rect x="4"  y="18" width="9"  height="14" rx="2"  fill={c} opacity="0.7"/>
      <rect x="31" y="18" width="9"  height="14" rx="2"  fill={c} opacity="0.7"/>
      <rect x="15" y="35" width="6"  height="6"  rx="1.5" fill={c} opacity="0.8"/>
      <rect x="23" y="35" width="6"  height="6"  rx="1.5" fill={c} opacity="0.8"/>
      <rect x="20" y="18" width="4"  height="18" rx="1"  fill={c} opacity="0.25"/>
    </svg>
  );
  if (type === "jacket") return (
    <svg width="34" height="34" viewBox="0 0 44 44" fill="none">
      <rect x="16" y="5"  width="12" height="16" rx="6"  fill={c} opacity="0.85"/>
      <rect x="12" y="19" width="20" height="16" rx="3"  fill={c}/>
      <rect x="5"  y="19" width="9"  height="12" rx="2"  fill={c} opacity="0.7"/>
      <rect x="30" y="19" width="9"  height="12" rx="2"  fill={c} opacity="0.7"/>
      <rect x="16" y="34" width="5"  height="5"  rx="1"  fill={c} opacity="0.8"/>
      <rect x="23" y="34" width="5"  height="5"  rx="1"  fill={c} opacity="0.8"/>
    </svg>
  );
  if (type === "light") return (
    <svg width="34" height="34" viewBox="0 0 44 44" fill="none">
      <rect x="16" y="6"  width="12" height="15" rx="6"  fill={c} opacity="0.7"/>
      <rect x="13" y="19" width="18" height="14" rx="2"  fill={c} opacity="0.7"/>
      <rect x="6"  y="19" width="9"  height="11" rx="2"  fill={c} opacity="0.5"/>
      <rect x="29" y="19" width="9"  height="11" rx="2"  fill={c} opacity="0.5"/>
    </svg>
  );
  // none
  return (
    <svg width="34" height="34" viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="16" stroke={c} strokeWidth="2" fill="none" opacity="0.4"/>
      <line x1="12" y1="12" x2="32" y2="32" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

// --- Weather condition icon (cloud / sun / rain / snow) ---
function ConditionIcon({ code, isDay }) {
  const sunny = isDay && [113].includes(code);
  const cloudy = [116,119,122,143].includes(code);
  const rainy  = code >= 176 && code < 395 && code !== 179 && code !== 182 && code !== 185 && code !== 371 && code !== 374 && code !== 377;
  const snowy  = [179,182,185,227,230,323,326,329,332,335,338,350,368,371,374,377].includes(code);
  const foggy  = [143,248,260].includes(code);
  const gray = "#888780";
  const blue = "#378ADD";
  const amber = "#EF9F27";
  const white = "rgba(255,255,255,0.9)";

  if (sunny) return (
    <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="10" fill={amber}/>
      {[0,45,90,135,180,225,270,315].map(a => {
        const r = a * Math.PI / 180;
        return <line key={a} x1={24+15*Math.cos(r)} y1={24+15*Math.sin(r)} x2={24+19*Math.cos(r)} y2={24+19*Math.sin(r)} stroke={amber} strokeWidth="2.5" strokeLinecap="round"/>;
      })}
    </svg>
  );
  if (snowy) return (
    <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
      <rect x="10" y="22" width="28" height="8" rx="4" fill={gray}/>
      <rect x="14" y="16" width="20" height="12" rx="6" fill={gray} opacity="0.7"/>
      {[16,22,28,34].map(x => <circle key={x} cx={x} cy={36} r="2" fill={blue} opacity="0.7"/>)}
    </svg>
  );
  if (rainy) return (
    <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
      <rect x="9"  y="18" width="30" height="9"  rx="4.5" fill={gray}/>
      <rect x="13" y="12" width="22" height="12" rx="6"   fill={gray} opacity="0.7"/>
      {[14,20,26,32].map(x => <line key={x} x1={x} y1={33} x2={x-2} y2={40} stroke={blue} strokeWidth="2" strokeLinecap="round"/>)}
    </svg>
  );
  if (foggy) return (
    <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
      {[18,25,32].map((y,i) => <rect key={y} x={8+(i%2)*4} y={y} width={32-(i%2)*8} height="3.5" rx="1.75" fill={gray} opacity={0.5-i*0.1}/>)}
    </svg>
  );
  // cloudy / default
  return (
    <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
      <rect x="9"  y="22" width="30" height="9"  rx="4.5" fill={gray}/>
      <rect x="13" y="14" width="22" height="14" rx="7"   fill={gray} opacity="0.75"/>
      {cloudy && isDay && <circle cx="34" cy="16" r="6" fill={amber} opacity="0.6"/>}
    </svg>
  );
}

// --- Day-of-week helper ---
function dayLabel(dateStr, idx) {
  if (idx === 0) return "today";
  const d = new Date(dateStr);
  return ["sun","mon","tue","wed","thu","fri","sat"][d.getUTCDay()];
}

// --- Hourly time label helper ---
// wttr.in hourly entries have time = "0", "300", "600" ... "2100"
function hourLabel(timeVal) {
  const h = Math.floor(parseInt(timeVal, 10) / 100);
  const ampm = h >= 12 ? "pm" : "am";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}${ampm}`;
}

// Pick the 5 upcoming hourly slots from wttr.in data
function getUpcomingHours(todayHourly, tomorrowHourly) {
  const nowH = new Date().getHours();
  // wttr.in gives 8 slots per day: 0,3,6,9,12,15,18,21
  const allSlots = [
    ...todayHourly.map(h => ({ ...h, _day: 0 })),
    ...tomorrowHourly.map(h => ({ ...h, _day: 1 })),
  ];
  // Filter to slots >= current hour, take next 5
  const upcoming = allSlots.filter(h => {
    const slotH = Math.floor(parseInt(h.time, 10) / 100);
    return h._day === 1 || slotH >= nowH;
  });
  return upcoming.slice(0, 5);
}

// --- Main render ---
export const render = ({ output }) => {
  let data;
  try { data = JSON.parse(output); } catch(e) { data = { error: true }; }

  const card = {
    width: "300px",
    boxSizing: "border-box",
    color: "#FFFFFF",
    fontFamily: "Source Han Code JP, Helvetica Neue",
    background: "rgba(0, 0, 0, 0.25)",
    borderRadius: "12px",
    padding: "12px 14px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  };

  if (!data || data.error || !data.current_condition) {
    return <div style={{ ...card, fontSize: "11px", color: "rgba(255,255,255,0.5)", textAlign: "center" }}>weather unavailable</div>;
  }

  const cur     = data.current_condition[0];
  const weather = data.weather || [];
  const tempF   = parseInt(cur.temp_F, 10);
  const code    = parseInt(cur.weatherCode, 10);

  const todayW   = weather[0] || {};
  const hourly   = todayW.hourly || [];
  const rainNow  = Math.max(...hourly.map(h => parseInt(h.chanceofrain || 0, 10)), 0);
  const snowNow  = Math.max(...hourly.map(h => parseInt(h.chanceofsnow || 0, 10)), 0);
  const isSnow   = snowNow > 30 || [179,182,185,227,230,323,326,329,332,335,338,350,368,371,374,377].includes(code);
  const verdict  = getVerdict(tempF, rainNow, isSnow);

  // 5 upcoming hourly slots
  const tomorrowHourly = (weather[1] || {}).hourly || [];
  const upcomingHours  = getUpcomingHours(hourly, tomorrowHourly);

  return (
    <div style={{ ...card, display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* Verdict row */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <JacketIcon type={verdict.icon} color="#FFFFFF"/>
        <div style={{ flex: "1", minWidth: 0 }}>
          <div style={{ fontSize: "15px", fontWeight: "bold", lineHeight: "1.2", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{verdict.label}</div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>
            {isSnow ? `snow ${snowNow}%` : `rain ${rainNow}%`}
          </div>
        </div>
        <div style={{ fontSize: "30px", fontWeight: "300", lineHeight: "1", letterSpacing: "-1px" }}>{tempF}°</div>
      </div>

      {/* Divider */}
      <div style={{ height: "0.5px", background: "rgba(255,255,255,0.15)" }}/>

      {/* Hourly strip */}
      <div style={{ display: "flex" }}>
        {upcomingHours.map((h, i) => {
          const t   = parseInt(h.tempF, 10);
          const r   = parseInt(h.chanceofrain || 0, 10);
          const s   = parseInt(h.chanceofsnow || 0, 10);
          const pct = s > r ? s : r;
          const pctColor = pct > 60 ? "#7ab8f5" : pct > 35 ? "#f5c36b" : "rgba(255,255,255,0.28)";
          const hCode = parseInt(h.weatherCode || 113, 10);
          const slotH = Math.floor(parseInt(h.time, 10) / 100);
          const isDaySlot = slotH >= 6 && slotH < 20;
          return (
            <div key={i} style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)" }}>{hourLabel(h.time)}</div>
              <ConditionIcon code={hCode} isDay={isDaySlot}/>
              <div style={{ fontSize: "12px", fontWeight: "bold", color: "#FFFFFF" }}>{t}°</div>
              <div style={{ fontSize: "9px", fontWeight: "500", color: pctColor }}>{pct > 0 ? `${pct}%` : "—"}</div>
            </div>
          );
        })}
      </div>

    </div>
  );
};