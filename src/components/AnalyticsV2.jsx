import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  Clock3,
  Download,
  Eye,
  FileText,
  Gauge,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
  X,
} from "lucide-react";
import "../analytics-v2.css";

const PERIODS = {
  7: {
    label: "Last 7 days",
    search: 48,
    views: 17,
    recruiterActions: 3,
    matches: 8,
    applications: 2,
    interviews: 1,
    offers: 0,
    visibility: [
      ["5 Aug", 4, 8], ["6 Aug", 6, 13], ["7 Aug", 5, 12], ["8 Aug", 8, 17],
      ["9 Aug", 10, 24], ["10 Aug", 9, 21], ["11 Aug", 12, 28],
    ],
  },
  30: {
    label: "Last 30 days",
    search: 148,
    views: 43,
    recruiterActions: 12,
    matches: 32,
    applications: 6,
    interviews: 2,
    offers: 1,
    visibility: [
      ["13 Jul", 5, 20], ["17 Jul", 8, 42], ["20 Jul", 13, 60], ["23 Jul", 10, 46],
      ["27 Jul", 16, 74], ["30 Jul", 12, 55], ["2 Aug", 19, 86], ["5 Aug", 15, 68],
      ["7 Aug", 23, 105], ["9 Aug", 17, 78], ["10 Aug", 24, 111], ["11 Aug", 22, 100],
    ],
  },
  90: {
    label: "Last 90 days",
    search: 431,
    views: 126,
    recruiterActions: 31,
    matches: 88,
    applications: 18,
    interviews: 7,
    offers: 3,
    visibility: [
      ["May", 12, 41], ["14 May", 17, 58], ["28 May", 24, 82], ["Jun", 19, 71],
      ["14 Jun", 29, 104], ["28 Jun", 27, 96], ["Jul", 35, 121], ["14 Jul", 32, 115],
      ["28 Jul", 41, 139], ["4 Aug", 38, 132], ["8 Aug", 46, 154], ["11 Aug", 43, 148],
    ],
  },
};

const HIGH_SIGNAL_JOBS = [
  {
    id: 2,
    role: "Technical Art Director",
    company: "Pixel Forge",
    location: "Business Bay",
    match: 93,
    insight: "Your realtime leadership work was viewed twice",
    image: "/assets/hub-jobs/job-02.png",
  },
  {
    id: 1,
    role: "Senior 3D Visualizer",
    company: "Northstar Studio",
    location: "Dubai Design District",
    match: 96,
    insight: "Strong match for rendering and client presentation",
    image: "/assets/hub-jobs/job-01.png",
  },
  {
    id: 4,
    role: "Experiential Designer",
    company: "Mosaic Events",
    location: "Al Quoz",
    match: 87,
    insight: "Recruiter activity increased in the past 48 hours",
    image: "/assets/hub-jobs/job-04.png",
  },
];

const MARKET_SKILLS = [
  ["Unreal Engine", "High", 94],
  ["3ds Max", "High", 89],
  ["Pipeline Development", "Rising", 76],
  ["After Effects", "Rising", 68],
  ["C++", "Emerging", 54],
];

const LOCATIONS = [
  ["Dubai", 18],
  ["Abu Dhabi", 7],
  ["Remote UAE", 5],
  ["Sharjah", 2],
];

const SKILL_ALIGNMENT = [
  ["Technical", 90],
  ["Leadership", 80],
  ["Portfolio", 88],
  ["Rendering", 92],
  ["Communication", 75],
];

const REPORT_COPY = {
  visibility: {
    eyebrow: "Visibility report",
    title: "How recruiters discover your profile",
    copy: "Search appearances measure reach; profile views indicate deeper interest. Your strongest discovery days were Monday and Thursday, with most visits coming from creative-technology searches.",
  },
  funnel: {
    eyebrow: "Opportunity report",
    title: "Where candidates convert — and where they pause",
    copy: "Your match-to-application rate is healthy. The highest-leverage improvement is shortening the time between saving a role and applying from 2.4 days to under 24 hours.",
  },
  recruiter: {
    eyebrow: "Recruiter activity report",
    title: "Signals from people reviewing your work",
    copy: "Portfolio opens and direct messages are the strongest signals. Pixel Forge and Mosaic Events generated the most meaningful activity this period.",
  },
  applications: {
    eyebrow: "Application report",
    title: "Progress across your active opportunities",
    copy: "Six active applications produced two interviews and one offer. Roles with portfolio evidence moved 1.8 days faster than applications without a linked project.",
  },
  market: {
    eyebrow: "Market report",
    title: "Where demand overlaps your strongest skills",
    copy: "Dubai continues to lead for senior visualization roles. Realtime workflow and pipeline skills are rising fastest across the UAE creative-technology market.",
  },
  skills: {
    eyebrow: "Skill alignment report",
    title: "Evidence that improves your fit score",
    copy: "Your technical and rendering scores are strong. Adding two measurable leadership outcomes could lift alignment for seven high-fit roles.",
  },
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

function useAnimatedNumber(value, delay = 0) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);
  const previous = useRef(0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      previous.current = value;
      return undefined;
    }

    let animationFrame = 0;
    let timeout = 0;
    const startValue = previous.current;
    const duration = 760;
    const startAnimation = () => {
      const startedAt = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(startValue + (value - startValue) * eased));
        if (progress < 1) animationFrame = requestAnimationFrame(tick);
        else previous.current = value;
      };
      animationFrame = requestAnimationFrame(tick);
    };
    timeout = window.setTimeout(startAnimation, delay);
    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [delay, reduced, value]);

  return display;
}

function AnimatedValue({ value, suffix = "", delay = 0 }) {
  const display = useAnimatedNumber(value, delay);
  return <>{display.toLocaleString()}{suffix}</>;
}

function linePath(points, key, width = 600, height = 190, max = 160) {
  return points.map((point, index) => {
    const x = 26 + (index * (width - 52)) / Math.max(1, points.length - 1);
    const y = height - 20 - (point[key] / max) * (height - 48);
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function ReportButton({ report, onOpen }) {
  return (
    <button type="button" className="av2-report-button" onClick={() => onOpen(report)}>
      View full report <ArrowRight aria-hidden="true" />
    </button>
  );
}

function ReportDialog({ report, onClose, onAction }) {
  const data = REPORT_COPY[report];

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!data) return null;
  return (
    <div className="av2-dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="av2-dialog" role="dialog" aria-modal="true" aria-labelledby="av2-dialog-title">
        <button type="button" className="av2-icon-button" aria-label="Close report" onClick={onClose}><X /></button>
        <span className="av2-eyebrow">{data.eyebrow}</span>
        <h2 id="av2-dialog-title">{data.title}</h2>
        <p>{data.copy}</p>
        <div className="av2-dialog-insight">
          <TrendingUp aria-hidden="true" />
          <div><strong>Recommended focus</strong><span>Turn this insight into a clear next step while recruiter interest is active.</span></div>
        </div>
        <footer>
          <button type="button" className="av2-secondary-button" onClick={onClose}>Close</button>
          <button type="button" className="av2-primary-button" onClick={() => onAction(report)}>Take action <ArrowRight /></button>
        </footer>
      </section>
    </div>
  );
}

export default function AnalyticsV2({ navigate }) {
  const [period, setPeriod] = useState(30);
  const [visibilityMetric, setVisibilityMetric] = useState("both");
  const [recruiterMetric, setRecruiterMetric] = useState("actions");
  const [funnelView, setFunnelView] = useState("volume");
  const [report, setReport] = useState(null);
  const [toast, setToast] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const sectionHighlightTimeoutRef = useRef(null);
  const data = PERIODS[period];

  const visibility = useMemo(() => data.visibility.map(([label, profile, search]) => ({ label, profile, search })), [data]);
  const maxVisibility = useMemo(() => Math.max(40, ...visibility.flatMap((item) => [item.profile, item.search])) * 1.12, [visibility]);
  const profilePath = linePath(visibility, "profile", 600, 190, maxVisibility);
  const searchPath = linePath(visibility, "search", 600, 190, maxVisibility);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openHub = (view = "explore", jobId) => {
    const query = jobId ? `?hub=job&job=${jobId}` : `?hub=${view}`;
    window.history.pushState({}, "", `/explore-jobs/${query}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const go = (route) => {
    if (typeof navigate === "function") navigate(route);
    else {
      const paths = { home: "/jobs-dashboard/", profile: "/profile-summary/", analytics: "/analytics/" };
      window.history.pushState({}, "", paths[route] || paths.analytics);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  const focusSection = (id) => {
    setActiveSection(id);
    const target = document.getElementById(`av2-${id}`);
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    target?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    if (target && !reduced) {
      window.clearTimeout(sectionHighlightTimeoutRef.current);
      target.classList.remove("av2-section-highlight");
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => target.classList.add("av2-section-highlight"));
      });
      sectionHighlightTimeoutRef.current = window.setTimeout(() => target.classList.remove("av2-section-highlight"), 760);
    }
  };

  const handleReportAction = (reportName) => {
    setReport(null);
    if (reportName === "applications" || reportName === "funnel") openHub("applications");
    else if (reportName === "recruiter") openHub("messages");
    else if (reportName === "skills") go("profile");
    else if (reportName === "market") openHub("explore");
    else focusSection("visibility");
  };

  const downloadSummary = () => {
    const rows = [
      ["WizJobs analytics summary", data.label],
      ["Metric", "Value"],
      ["Search appearances", data.search],
      ["Profile views", data.views],
      ["Recruiter actions", data.recruiterActions],
      ["Matches", data.matches],
      ["Applications", data.applications],
      ["Interviews", data.interviews],
      ["Offers", data.offers],
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = `wizjobs-analytics-${period}-days.csv`;
    document.body.appendChild(link);
    link.click();
    window.setTimeout(() => link.remove(), 30000);
    setToast("Analytics summary downloaded");
  };

  const funnel = [
    ["Impressions", data.search + Math.round(data.search * 1.1)],
    ["Profile views", data.views],
    ["Matches", data.matches],
    ["Applications", data.applications],
    ["Interviews", data.interviews],
    ["Offers", data.offers],
  ];
  const topFunnel = Math.max(1, funnel[0][1]);
  const conversion = data.applications ? Math.round((data.interviews / data.applications) * 100) : 0;
  const recruiterValues = recruiterMetric === "actions"
    ? [["Profile views", Math.max(1, data.recruiterActions - 4)], ["Messages", Math.max(1, Math.round(data.recruiterActions * .34))], ["Saves", Math.max(1, Math.round(data.recruiterActions * .2))]]
    : [["Pixel Forge", 5], ["Mosaic Events", 4], ["Northstar", 3]];
  const recruiterTotal = recruiterValues.reduce((sum, item) => sum + item[1], 0);

  return (
    <main className="av2-page" aria-label="Job-search analytics dashboard">
      <aside className="av2-sidebar" aria-label="Analytics sections">
        <div className="av2-profile-card">
          <img src="/assets/profile-aries-v2.png" alt="Aries Black" />
          <strong>Aries Black</strong>
          <span>Technical Art Director</span>
          <small><MapPin aria-hidden="true" /> Dubai, UAE</small>
        </div>
        <div className="av2-profile-health">
          <div className="av2-mini-ring" aria-label="Profile strength 78 out of 100">
            <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18" pathLength="100" /><circle className="value" cx="24" cy="24" r="18" pathLength="100" /></svg>
            <span><b>78</b><small>/100</small></span>
          </div>
          <div className="av2-strength-copy">
            <span>Profile strength</span>
            <b>Strong</b>
            <p>Keep going. You’re almost at Expert level.</p>
          </div>
          <button type="button" onClick={() => go("profile")}>Improve profile</button>
        </div>
        <div className="av2-period-card">
          <span>Date range</span>
          <div>{[7, 30, 90].map((value) => <button type="button" key={value} className={period === value ? "active" : ""} onClick={() => setPeriod(value)}>{value}d</button>)}</div>
          <small>{data.label}</small>
        </div>
        <nav className="av2-section-nav">
          {[
            ["overview", BarChart3, "Overview"],
            ["visibility", Eye, "Visibility"],
            ["opportunities", Target, "Opportunities"],
            ["applications", BriefcaseBusiness, "Applications"],
            ["recruiter", UsersRound, "Recruiter activity"],
            ["market", Gauge, "Skills & market"],
          ].map(([id, Icon, label]) => (
            <button type="button" key={id} className={activeSection === id ? "active" : ""} onClick={() => focusSection(id)} aria-current={activeSection === id ? "location" : undefined}>
              <Icon aria-hidden="true" /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="av2-download-card">
          <button type="button" className="av2-download-button" onClick={downloadSummary}><Download /> Export summary</button>
        </div>
      </aside>

      <div className="av2-content" id="av2-overview">
        <header className="av2-page-header">
          <div><span className="av2-eyebrow">Career performance</span><h1>Your job-search analytics</h1><p>Understand what is working, where opportunities move, and what to do next.</p></div>
          <div className="av2-period-switcher" aria-label="Report period">
            {[7, 30, 90].map((value) => <button type="button" key={value} className={period === value ? "active" : ""} onClick={() => setPeriod(value)}>{value} days</button>)}
          </div>
        </header>

        <section className="av2-overview-strip" aria-label="Key performance indicators">
          {[
            [Search, "Search appearances", data.search, "+12%", "Reach"],
            [Eye, "Profile views", data.views, "+10%", "Interest"],
            [MessageCircle, "Recruiter actions", data.recruiterActions, "+33%", "Engagement"],
            [Target, "Matches", data.matches, "+25%", "Opportunity"],
          ].map(([Icon, label, value, delta, descriptor], index) => (
            <article key={label} className="av2-sequence" style={{ "--av2-order": index }}>
              <span><Icon aria-hidden="true" /></span>
              <div><small>{label}</small><strong><AnimatedValue value={value} delay={index * 100 + 180} /></strong><em>{descriptor}</em></div>
              <b className={delta.startsWith("-") ? "negative" : "positive"}>{delta.startsWith("-") ? "↓" : "↑"} {delta.replace(/^[+-]/, "")}</b>
            </article>
          ))}
        </section>

        <section className="av2-report-grid">
          <article className="av2-panel av2-panel-wide av2-sequence" id="av2-visibility" style={{ "--av2-order": 4 }}>
            <header className="av2-panel-header">
              <div><span className="av2-eyebrow">Profile visibility</span><h2>More recruiters are finding you</h2><p>Reach compared with deeper profile interest.</p></div>
              <ReportButton report="visibility" onOpen={setReport} />
            </header>
            <div className="av2-panel-controls" aria-label="Visibility chart series">
              {[['both', 'Both'], ['profile', 'Profile views'], ['search', 'Search appearances']].map(([value, label]) => <button type="button" key={value} className={visibilityMetric === value ? "active" : ""} onClick={() => setVisibilityMetric(value)}>{label}</button>)}
            </div>
            <div className="av2-visibility-summary">
              <div><small>Profile views</small><strong><AnimatedValue value={data.views} delay={620} /></strong><span>↑ 10%</span></div>
              <div><small>Search appearances</small><strong><AnimatedValue value={data.search} delay={700} /></strong><span>↑ 12%</span></div>
            </div>
            <figure className="av2-line-chart" role="img" aria-label={`Profile visibility over the ${data.label.toLowerCase()}`}>
              <svg viewBox="0 0 600 220" preserveAspectRatio="none" aria-hidden="true">
                {[0, 1, 2, 3].map((line) => <line key={line} x1="26" x2="574" y1={28 + line * 48} y2={28 + line * 48} />)}
                {(visibilityMetric === "both" || visibilityMetric === "search") && <path className="search-line" d={searchPath} pathLength="1" />}
                {(visibilityMetric === "both" || visibilityMetric === "profile") && <path className="profile-line" d={profilePath} pathLength="1" />}
              </svg>
              <figcaption>{visibility.filter((_, index) => index === 0 || index === visibility.length - 1 || index === Math.floor(visibility.length / 2)).map((item) => <span key={item.label}>{item.label}</span>)}</figcaption>
              <ul className="av2-sr-only">{visibility.map((item) => <li key={item.label}>{item.label}: {item.profile} profile views, {item.search} search appearances</li>)}</ul>
            </figure>
          </article>

          <article className="av2-panel av2-sequence" id="av2-opportunities" style={{ "--av2-order": 5 }}>
            <header className="av2-panel-header"><div><span className="av2-eyebrow">Opportunity funnel</span><h2>Your journey to offers</h2><p>How each stage converts.</p></div><ReportButton report="funnel" onOpen={setReport} /></header>
            <div className="av2-panel-controls"><button type="button" className={funnelView === "volume" ? "active" : ""} onClick={() => setFunnelView("volume")}>Volume</button><button type="button" className={funnelView === "conversion" ? "active" : ""} onClick={() => setFunnelView("conversion")}>Conversion</button></div>
            <div className="av2-funnel" key={`${period}-${funnelView}`}>
              {funnel.map(([label, value], index) => {
                const displayValue = funnelView === "conversion" ? Math.round((value / topFunnel) * 100) : value;
                return <div key={label} style={{ "--funnel-width": `${Math.max(22, 100 - index * 12)}%`, "--av2-delay": `${index * 90}ms` }}><span>{label}</span><strong><AnimatedValue value={displayValue} suffix={funnelView === "conversion" ? "%" : ""} delay={700 + index * 80} /></strong></div>;
              })}
            </div>
          </article>

          <article className="av2-panel av2-sequence" id="av2-recruiter" style={{ "--av2-order": 6 }}>
            <header className="av2-panel-header"><div><span className="av2-eyebrow">Recruiter activity</span><h2>Actions taken on your profile</h2><p>High-intent signals from hiring teams.</p></div><ReportButton report="recruiter" onOpen={setReport} /></header>
            <div className="av2-panel-controls"><button type="button" className={recruiterMetric === "actions" ? "active" : ""} onClick={() => setRecruiterMetric("actions")}>By action</button><button type="button" className={recruiterMetric === "companies" ? "active" : ""} onClick={() => setRecruiterMetric("companies")}>By company</button></div>
            <div className="av2-recruiter-content">
              <div className="av2-donut" aria-label={`${recruiterTotal} recruiter actions`}>
                <svg viewBox="0 0 120 120" aria-hidden="true"><circle className="track" cx="60" cy="60" r="42" /><circle className="segment first" cx="60" cy="60" r="42" pathLength="100" /><circle className="segment second" cx="60" cy="60" r="42" pathLength="100" /><circle className="segment third" cx="60" cy="60" r="42" pathLength="100" /></svg>
                <span><strong><AnimatedValue value={recruiterTotal} delay={820} /></strong>actions</span>
              </div>
              <div className="av2-donut-legend">{recruiterValues.map(([label, value], index) => <button type="button" key={label} onClick={() => setToast(`${label}: ${value} recruiter signals`)}><i className={`tone-${index + 1}`} /><span>{label}</span><b>{value}</b></button>)}</div>
            </div>
          </article>

          <article className="av2-panel av2-sequence" id="av2-applications" style={{ "--av2-order": 7 }}>
            <header className="av2-panel-header"><div><span className="av2-eyebrow">Application progress</span><h2>{conversion}% interview conversion</h2><p>{data.interviews} interviews from {data.applications} active applications.</p></div><ReportButton report="applications" onOpen={setReport} /></header>
            <div className="av2-stage-list" key={`stages-${period}`}>
              {[
                ["Applied", data.applications, "blue"],
                ["Shortlisted", Math.max(data.interviews + 1, 1), "cyan"],
                ["Interview", data.interviews, "orange"],
                ["Offer", data.offers, "green"],
              ].map(([label, value, tone], index) => <button type="button" key={label} onClick={() => openHub("applications")}><span>{label}</span><i><b className={tone} style={{ "--stage-width": `${Math.max(value ? 18 : 0, data.applications ? value / data.applications * 100 : 0)}%`, "--av2-delay": `${index * 100}ms` }} /></i><strong>{value}</strong></button>)}
            </div>
            <div className="av2-timing"><Clock3 /><div><strong>3.4 days</strong><span>Average time from application to first response</span></div></div>
          </article>

          <article className="av2-panel av2-sequence" id="av2-market" style={{ "--av2-order": 8 }}>
            <header className="av2-panel-header"><div><span className="av2-eyebrow">Market demand</span><h2>Demand for your skills</h2><p>Signals across your preferred markets.</p></div><ReportButton report="market" onOpen={setReport} /></header>
            <div className="av2-market-layout">
              <div className="av2-demand-list">{MARKET_SKILLS.map(([skill, level, score]) => <button type="button" key={skill} onClick={() => setToast(`${skill}: ${level.toLowerCase()} demand, ${score} signal score`)}><span>{skill}</span><i><b style={{ "--demand": `${score}%` }} /></i><em className={level.toLowerCase()}>{level}</em></button>)}</div>
              <div className="av2-location-list"><strong>Top locations</strong>{LOCATIONS.map(([location, count]) => <button type="button" key={location} onClick={() => openHub("explore")}><MapPin /><span>{location}</span><b>{count} roles</b><ArrowRight /></button>)}</div>
            </div>
          </article>

          <article className="av2-panel av2-sequence" style={{ "--av2-order": 9 }}>
            <header className="av2-panel-header"><div><span className="av2-eyebrow">Skill alignment</span><h2>Your evidence matches 85%</h2><p>How your profile supports target roles.</p></div><ReportButton report="skills" onOpen={setReport} /></header>
            <div className="av2-alignment-layout">
              <div className="av2-alignment-score"><strong><AnimatedValue value={85} suffix="%" delay={980} /></strong><span>Overall alignment</span><small>Great match</small></div>
              <figure className="av2-radar" role="img" aria-label="Skill alignment radar chart">
                <svg viewBox="0 0 220 190" aria-hidden="true">
                  <polygon className="grid outer" points="110,14 198,78 164,176 56,176 22,78" />
                  <polygon className="grid middle" points="110,43 168,85 146,150 74,150 52,85" />
                  <polygon className="grid inner" points="110,72 139,93 128,125 92,125 81,93" />
                  <polygon className="value" points="110,27 180,83 153,161 63,154 46,85" />
                  {["110,14 110,176", "22,78 198,78", "56,176 168,85", "164,176 52,85"].map((points) => { const [start, end] = points.split(" "); const [x1, y1] = start.split(","); const [x2, y2] = end.split(","); return <line key={points} x1={x1} y1={y1} x2={x2} y2={y2} />; })}
                </svg>
                <figcaption>{SKILL_ALIGNMENT.map(([skill, score]) => <span key={skill}>{skill}<b>{score}%</b></span>)}</figcaption>
              </figure>
            </div>
          </article>
        </section>

        <section className="av2-actions av2-sequence" style={{ "--av2-order": 10 }}>
          <header><div><span className="av2-eyebrow">Recommended next actions</span><h2>Small steps with measurable impact</h2><p>Personalized from your current profile and opportunity signals.</p></div></header>
          <div>
            <button type="button" onClick={() => go("profile")}><span className="green"><Check /></span><div><strong>Add 2 verified skills</strong><p>Build visibility and strengthen seven high-fit matches.</p><em>Add skills <ArrowRight /></em></div></button>
            <button type="button" onClick={() => openHub("daily")}><span className="blue"><Target /></span><div><strong>Apply to 3 new matches</strong><p>Act while recruiter interest is active this week.</p><em>View matches <ArrowRight /></em></div></button>
            <button type="button" onClick={() => go("profile")}><span className="orange"><FileText /></span><div><strong>Complete your portfolio</strong><p>Add project outcomes to improve leadership alignment.</p><em>Add evidence <ArrowRight /></em></div></button>
          </div>
        </section>

        <section className="av2-jobs av2-sequence" style={{ "--av2-order": 11 }}>
          <header><div><span className="av2-eyebrow">High-signal opportunities</span><h2>Roles responding to your profile</h2><p>Mock roles prioritized by match quality and recruiter intent.</p></div><button type="button" onClick={() => openHub("daily")}>See all matches <ArrowRight /></button></header>
          <div className="av2-job-grid">
            {HIGH_SIGNAL_JOBS.map((job) => <article key={job.id}>
              <img src={job.image} alt="" />
              <div><span>{job.match}% match</span><h3>{job.role}</h3><p>{job.company} · {job.location}</p><small>{job.insight}</small></div>
              <button type="button" aria-label={`View ${job.role} at ${job.company}`} onClick={() => openHub("job", job.id)}><ArrowRight /></button>
            </article>)}
          </div>
        </section>

        <footer className="av2-source-note"><Sparkles /><span>Prototype data · Updated 11 August 2026 · Metrics are illustrative and ready to connect to live platform events.</span></footer>
      </div>

      {toast && <div className="av2-toast" role="status"><Check />{toast}</div>}
      {report && <ReportDialog report={report} onClose={() => setReport(null)} onAction={handleReportAction} />}
    </main>
  );
}
