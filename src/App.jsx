import { useEffect, useMemo, useState } from "react";
import { WizyPet } from "./components/WizyPet";
import { ExploreJobs, jobs as hubJobs } from "./components/ExploreJobs";
import HomeV2 from "./components/HomeV2";
import ProfileSummaryV2 from "./components/ProfileSummaryV2";
import AnalyticsV2 from "./components/AnalyticsV2";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  ClipboardList,
  Clock3,
  FileText,
  Filter,
  Flag,
  GraduationCap,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Phone,
  Plus,
  RotateCcw,
  Send,
  ShieldCheck,
  Sun,
  Upload,
  Eye,
  X,
} from "lucide-react";

const ROUTES = {
  home: "/jobs-dashboard/",
  profile: "/profile-summary/",
  analytics: "/analytics/",
  explore: "/explore-jobs/",
  settings: "/profile-settings/",
  login: "/login/",
  cv: "/cv-preview/",
};

const experiences = [
  ["TECHNICAL ART DIRECTOR", "Entourage Marketing & Events", "2024-09-01 - Present", "1 year 11 months"],
  ["ARCHITECTURAL VISUALIZER", "Ambient Studio", "2024-03-01 - 2024-08-31", "6 months"],
  ["SENIOR 3D ARTIST", "OD Event", "2022-09-01 - 2024-02-29", "1 year 6 months"],
  ["SELF-EMPLOYED DESIGNER", "InDesign", "2012-01-01 - 2021-12-31", "10 years"],
];

const skills = [
  ["Photorealistic Rendering", "Expert", 5, 1, "green"],
  ["V-Ray", "Expert", 5, 1, "green"],
  ["3ds Max", "Expert", 5, 1, "green"],
  ["After Effects", "Competent", 3, 5, "orange"],
  ["Cross-Functional Collaboration", "Mid-level", 2, 5, "orange"],
  ["Environment Design", "Mid-level", 2, 5, "orange"],
  ["Exhibition Design", "Mid-level", 2, 5, "orange"],
  ["Architectural Visualization", "Basic", 1, 5, "red"],
  ["3D Animation", "Basic", 1, 4, "red"],
  ["Production Supervision", "Basic", 1, 4, "red"],
  ["AI-Powered Presentation Development", "Basic", 1, 4, "red"],
  ["Technical Art Direction", "Basic", 1, 4, "red"],
  ["Stage Design", "Basic", 1, 3, "red"],
  ["Lighting and Look Development", "Basic", 1, 3, "red"],
  ["Client Presentation", "Basic", 1, 2, "red"],
  ["Generative AI Workflow Automation", "Basic", 1, 2, "red"],
  ["AutoCAD", "Basic", 1, 2, "red"],
  ["Blender", "Basic", 1, 1, "red"],
  ["Unreal Engine 5", "Basic", 1, 1, "red"],
];

const countries = ["Senghapoure", "Egypt", "Qatar", "United Arab Emirates", "Saudi Arabia"];
const suggestionSkills = [
  "Reporting & Filing Management",
  "Multitasking",
  "Industry Research",
  "Media Planning Support & Documentation",
  "Project Planning",
  "Event Operations",
  "Business Strategy",
  "Marketing Strategy",
  "JavaScript (ES6+)",
  "Financial Modeling",
];

function routeFromPath() {
  const pathname = window.location.pathname;
  const found = Object.entries(ROUTES).find(([, value]) => pathname === value || pathname.startsWith(value));
  return found?.[0] || "home";
}

function Avatar({ size = 40, className = "" }) {
  return (
    <span className={`avatar ${className}`} style={{ width: size, height: size }}>
      <img src="/assets/profile-aries-v2.png" alt="ARIES BLACK" />
    </span>
  );
}

function Header({ route, navigate, theme, toggleTheme }) {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [language, setLanguage] = useState("English");

  const go = (next) => {
    setDrawerOpen(false);
    setAccountOpen(false);
    navigate(next);
  };

  const nav = [
    ["home", "Home"],
    ["profile", "Profile Summary"],
    ["analytics", "Analytics"],
    ["explore", "Hub"],
  ];

  return (
    <>
      <nav className="candidate-navbar">
        <div className="candidate-navbar-container">
          <button className="brand-button" aria-label="Wiz Jobs" onClick={() => go("home")}>
            <img src="/assets/brand/logo.svg" alt="WizJobs" />
          </button>

          <div className="desktop-nav">
            {nav.map(([key, label]) => (
              <button key={key} className={`nav-link ${route === key ? "active" : ""}`} onClick={() => go(key)}>
                {label}
              </button>
            ))}
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
            <div className="menu-wrap language-wrap">
              <button
                className={`language-button ${languageOpen ? "open" : ""}`}
                onClick={() => {
                  setLanguageOpen((value) => !value);
                  setAccountOpen(false);
                }}
              >
                <img src="/assets/us-flag.svg" alt="English flag" />
                <span className="language-long">{language}</span>
                <span className="language-short">EN</span>
                <ChevronDown size={16} />
              </button>
              <div className={`dropdown language-menu ${languageOpen ? "show" : ""}`}>
                {["English", "العربية (UAE)", "العربية (KSA)"].map((item) => (
                  <button
                    key={item}
                    className={language === item ? "selected" : ""}
                    onClick={() => {
                      setLanguage(item);
                      setLanguageOpen(false);
                    }}
                  >
                    {item === "English" && <img src="/assets/us-flag.svg" alt="" />}
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="menu-wrap account-wrap">
              <button
                className="avatar-button"
                aria-label="Open account menu"
                onClick={() => {
                  setAccountOpen((value) => !value);
                  setLanguageOpen(false);
                }}
              >
                <Avatar />
              </button>
              <div className={`dropdown account-menu ${accountOpen ? "show" : ""}`}>
                <div className="account-heading">
                  <Avatar size={40} />
                  <span>
                    <strong>ARIES BLACK</strong>
                    <small>unrealdesigns.ae@gmail.com</small>
                  </span>
                </div>
                <button onClick={() => go("settings")}>Profile Settings</button>
                <button onClick={() => go("login")}>Logout</button>
              </div>
            </div>

            <button className="mobile-menu-button" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
              <Menu />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <button aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
            <ArrowRight />
          </button>
        </div>
        <img className="drawer-logo" src="/assets/brand/logo.svg" alt="WizJobs" />
        <div className="drawer-items">
          {nav.map(([key, label]) => (
            <button key={key} className={route === key ? "active" : ""} onClick={() => go(key)}>
              {label}
            </button>
          ))}
          <hr />
          <button className={route === "settings" ? "active" : ""} onClick={() => go("settings")}>Profile Settings</button>
          <button onClick={() => go("login")}>Logout</button>
        </div>
      </div>
    </>
  );
}

function ProfileCard() {
  const previewCv = () => window.open(ROUTES.cv, "_blank", "noopener,noreferrer");

  return (
    <aside className="profile-column">
      <section className="profile-card">
        <Avatar size={124} className="profile-avatar" />
        <h2>ARIES BLACK</h2>
        <p>TECHNICAL ART DIRECTOR</p>
        <img className="gauge" src="/assets/profile-gauge.svg" alt="Practitioner, level 2 of 6" />
        <div className="level-track">
          <span className="level-start" />
          <span className="level-bubble">level<br />strength</span>
        </div>
        <div className="level-numbers">{[1, 2, 3, 4, 5, 6, 7].map((number) => <span key={number}>{number}</span>)}</div>
        <div className="profile-divider" />
        <a href="mailto:unrealdesigns.ae@gmail.com"><Mail />unrealdesigns.ae@gmail.com</a>
        <a href="tel:567502350"><Phone />567 502 350</a>
        <a href="https://www.linkedin.com/in/ariesblack" target="_blank" rel="noreferrer"><Linkedin />linkedinProfile</a>
        <div className="profile-divider" />
        <button className="preview-cv" onClick={previewCv}><FileText /> Preview CV</button>
      </section>
      <InfoTile icon={<GraduationCap />} title="Education">
        <p>GEORGETOWN UNIVERSITY</p>
        <span>-</span>
      </InfoTile>
      <InfoTile icon={<BriefcaseBusiness />} title="Work Type">
        <div className="work-type-grid">
          <span><small>JOB TYPE</small>Full Time</span>
          <span><small>WORK MODE</small>Onsite</span>
        </div>
      </InfoTile>
    </aside>
  );
}

function InfoTile({ icon, title, children }) {
  return (
    <section className="info-tile">
      <div className="tile-icon">{icon}</div>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function EmptyJobs({ title = "Jobs are almost here" }) {
  return (
    <div className="empty-jobs">
      <img src="/assets/empty-jobs.svg" alt="Jobs search illustration" />
      <h3>{title}</h3>
      <p>Employers will start posting soon—stay tuned!</p>
      <strong>Boost your chances by:</strong>
      <span>Completing your profile to increase your score</span>
      <span>Taking assessments to highlight your strengths</span>
      <span>Keeping your profile updated and active</span>
    </div>
  );
}

function LoadingCards() {
  return (
    <div className="loading-card-row">
      {[1, 2, 3].map((value) => (
        <div className="loading-job-card" key={value}>
          <img src="/assets/brand/w-mark.svg" alt="" />
        </div>
      ))}
    </div>
  );
}

function HomePage() {
  const [jobTab, setJobTab] = useState("Matched");
  const [filterOpen, setFilterOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  const selectTab = (tab) => {
    setJobTab(tab);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 900);
  };

  const heading = {
    Matched: "Jobs matching your profile - 0",
    Potential: "Potential opportunities - 0",
    Applied: "Your applications - 0",
    Saved: "Saved jobs - 0",
  }[jobTab];

  const insights = [
    ["Matched", "mint"],
    ["Potential", "slate"],
    ["Applied jobs", "amber"],
    ["Submitted", "violet"],
    ["Shortlisted", "mint"],
    ["Rejected", "coral"],
  ];

  return (
    <main className="page-shell dashboard-page">
      <ProfileCard />
      <section className="dashboard-main">
        <h2 className="section-kicker">Jobs Insights</h2>
        <div className="insight-grid">
          {insights.map(([label, tone]) => (
            <article className="insight-card" key={label}>
              <span className={`insight-ring ${tone}`}>0</span>
              <p>{label}</p>
            </article>
          ))}
        </div>

        <div className="job-tab-bar">
          {["Matched", "Potential", "Applied", "Saved"].map((tab) => (
            <button className={jobTab === tab ? "active" : ""} key={tab} onClick={() => selectTab(tab)}>{tab} (0)</button>
          ))}
        </div>

        {jobTab === "Matched" && (
          <div className="filter-line">
            <button className={`filter-toggle ${filterOpen ? "open" : ""}`} onClick={() => setFilterOpen((value) => !value)}>
              <Filter size={14} />Filter{filterOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        )}

        <div className={`filter-panel ${filterOpen && jobTab === "Matched" ? "open" : ""}`}>
          <div className="filter-location">
            <label><MapPin /> LOCATION</label>
            <div className="filter-row">
              <div className="select-wrap country-select">
                <button className="select-field" onClick={() => setCountryOpen((value) => !value)}>
                  <span>{country || "Select Country"}</span>{country ? <X size={16} onClick={(event) => { event.stopPropagation(); setCountry(""); }} /> : null}
                </button>
                <div className={`option-menu ${countryOpen ? "show" : ""}`}>
                  {countries.map((item) => <button key={item} onClick={() => { setCountry(item); setCountryOpen(false); setLoading(true); window.setTimeout(() => setLoading(false), 850); }}>{item}</button>)}
                </div>
              </div>
              <button className="select-field disabled" disabled>{country ? "Select City" : "Please select a country first"}</button>
            </div>
            <label><CircleAlert /> EXPERIENCE LEVEL</label>
            <div className="filter-row">
              <select defaultValue=""><option value="" disabled>Minimum Experience</option>{[0, 1, 2, 3, 5, 10].map((value) => <option key={value}>{value} years</option>)}</select>
              <select defaultValue=""><option value="" disabled>Maximum Experience</option>{[1, 2, 3, 5, 10, 15].map((value) => <option key={value}>{value} years</option>)}</select>
            </div>
          </div>
          <div className="filter-chips">
            <FilterChipGroup title="JOB TYPE" items={["Internship", "Part Time", "Contract", "Full Time", "Freelance"]} />
            <FilterChipGroup title="WORK MODE" items={["Remote", "On-site", "Hybrid"]} />
            {country && <button className="reset-filter" onClick={() => setCountry("")}><RotateCcw />Reset</button>}
          </div>
        </div>

        <h2 className="jobs-heading">{heading}</h2>
        {loading ? <LoadingCards /> : <EmptyJobs />}
      </section>
    </main>
  );
}

function FilterChipGroup({ title, items }) {
  const [active, setActive] = useState([]);
  return (
    <div className="filter-chip-group">
      <label>{title}</label>
      <div>{items.map((item) => <button key={item} className={active.includes(item) ? "selected" : ""} onClick={() => setActive((values) => values.includes(item) ? values.filter((value) => value !== item) : [...values, item])}>{item}</button>)}</div>
    </div>
  );
}

function ExperienceCard() {
  return (
    <section className="content-card experience-card">
      <header><ClipboardList /><span><h2>Experience</h2><p>13 years of experience</p></span></header>
      <div className="experience-list">
        {experiences.map(([role, company, dates, duration]) => (
          <article key={`${role}-${company}`}>
            <span className="experience-icon"><Building2 /></span>
            <div>
              <h3>{role} <b>|</b> <span>{company}</span></h3>
              <p>{dates}<i>•</i>{duration}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SkillsCard({ onVerify }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? skills : skills.slice(0, 5);
  return (
    <section className="content-card skills-card">
      <header><ClipboardList /><h2>Skills</h2></header>
      <div className="skills-list">
        {visible.map(([name, rank, dots, level, tone]) => (
          <article key={name}>
            <span className="skill-name">{name}</span>
            <button className="verify-skill" onClick={() => onVerify(name)}><ArrowRight /> Verify Skill</button>
            <span className={`skill-dots ${tone}`}>{[0, 1, 2, 3, 4].map((dot) => <i className={dot < dots ? "filled" : ""} key={dot} />)}</span>
            <span className={`skill-rank ${tone}`}>{rank}</span>
            <span className={`skill-level level-${level}`}><i /> Level {level}</span>
          </article>
        ))}
      </div>
      <button className="show-skills" onClick={() => setExpanded((value) => !value)}>{expanded ? <>Show less <ChevronUp /></> : <>Show more 14 <ChevronDown /></>}</button>
    </section>
  );
}

const profileStages = [
  ["CV", "cvIcon.svg"],
  ["LinkedIn", "linkedInIcon.svg"],
  ["Certificates", "certificateIcon.svg"],
  ["Skills", "skillsIcon.svg"],
  ["Complete", "notCompleteIcon.svg"],
];

function ProfileStepper({ stage, setStage, expanded, setExpanded, openModal }) {
  const content = {
    CV: { title: "Upload Your CV", note: "Last uploaded: 10-08-2026 • 11:28 AM", desc: "Upload your CV to showcase your experience and get matched with jobs.", tip: "Accurate CV, Fair Score", icon: <FileText /> },
    LinkedIn: { title: "Upload Your LinkedIn file", note: "", desc: "Extract your LinkedIn full profile to enrich your professional details and strengthen your profile.", tip: "Enhance Profile Visibility", icon: <Upload /> },
    Certificates: { title: "Add certificate", note: "", desc: "Add certificates to prove your qualifications and stand out.", tip: "Highlight Verified Qualifications", icon: <Plus /> },
    Skills: { title: "Manage Your Skills", note: "Last uploaded: 10-08-2026 • 11:30 AM", desc: "Update your skills to improve matching, including adding new ones beyond your CV.", tip: "More Verified Skills, More Matches", icon: <ClipboardList /> },
  }[stage] || {};

  const mainAction = () => {
    if (stage === "Certificates") openModal("certificate");
    if (stage === "Skills") openModal("skills");
  };

  return (
    <section className={`profile-stepper ${expanded ? "expanded" : "collapsed"}`}>
      <div className="stepper-steps">
        {profileStages.map(([label, icon]) => (
          <button key={label} className={`${stage === label ? "active" : ""} ${label === "Complete" ? "disabled" : ""}`} disabled={label === "Complete"} onClick={() => setStage(label)}>
            <span><img src={`/assets/stepper/${icon}`} alt="" />{["CV", "Skills"].includes(label) && <b><Check /></b>}</span>
            {label}
          </button>
        ))}
        <button className="stepper-toggle" aria-label={expanded ? "Collapse stepper" : "Expand stepper"} onClick={() => setExpanded((value) => !value)}>
          <img src={`/assets/stepper/${expanded ? "collapseIcon.svg" : "expandIcon.svg"}`} alt="" />
        </button>
      </div>
      <div className="stepper-action-area">
        <button className={`stepper-main-action ${["Certificates", "Skills"].includes(stage) ? "solid" : "icon-only"}`} onClick={mainAction} aria-label={content.title}>
          {content.icon}{["Certificates", "Skills"].includes(stage) && <span>{content.title}</span>}
        </button>
        {content.note && <small>{content.note}</small>}
      </div>
      <div className="stepper-message"><strong>{content.desc}</strong><span><Lightbulb />{content.tip}</span></div>
    </section>
  );
}

function ProfilePage() {
  const [stage, setStage] = useState("CV");
  const [expanded, setExpanded] = useState(true);
  const [modal, setModal] = useState(null);
  const [verifySkill, setVerifySkill] = useState("");

  const openAssessment = (skill) => {
    setVerifySkill(skill);
    setModal("assessment");
  };

  return (
    <main className="profile-summary-page">
      <ProfileStepper stage={stage} setStage={setStage} expanded={expanded} setExpanded={setExpanded} openModal={setModal} />
      <div className="page-shell profile-content">
        <ProfileCard />
        <div className="profile-main-column">
          <ExperienceCard />
          <SkillsCard onVerify={openAssessment} />
        </div>
      </div>
      {modal === "assessment" && <AssessmentModal skill={verifySkill} close={() => setModal(null)} />}
      {modal === "skills" && <ManageSkillsModal close={() => setModal(null)} />}
      {modal === "certificate" && <CertificateModal close={() => setModal(null)} />}
    </main>
  );
}

function ModalFrame({ children, close, label }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-label={label}>
        <button className="modal-close" aria-label={`Close ${label}`} onClick={close}><X /></button>
        {children}
      </div>
    </div>
  );
}

function AssessmentModal({ skill, close }) {
  const [started, setStarted] = useState(false);
  return (
    <ModalFrame close={close} label="assessment dialog">
      {!started ? (
        <>
          <h2>Verify Your Skill</h2>
          <p className="modal-intro">Take a short assessment to verify your proficiency in <strong>{skill}</strong> and improve your visibility to employers.</p>
          <div className="benefit-list">
            {["Earn a verified skill badge", "Improve job matching accuracy", "Increase employer confidence", "Stand out from other candidates"].map((item) => <p key={item}><Check />{item}</p>)}
          </div>
          <button className="primary-modal-button" onClick={() => setStarted(true)}>Start</button>
        </>
      ) : (
        <div className="mock-assessment">
          <ShieldCheck />
          <h2>Assessment Ready</h2>
          <p>This visual prototype keeps the original assessment launch behavior without creating a real attempt.</p>
          <button className="primary-modal-button" onClick={close}>Done</button>
        </div>
      )}
    </ModalFrame>
  );
}

function ManageSkillsModal({ close }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(skills.map(([name]) => name));
  const remove = (name) => setSelected((items) => items.filter((item) => item !== name));
  return (
    <ModalFrame close={close} label="manage skills">
      <h2>Manage Your Skills</h2>
      <div className="skill-search-wrap">
        <input placeholder="Search and select skills..." value={query} onChange={(event) => setQuery(event.target.value)} />
        {query && (
          <div className="skill-suggestions">
            {suggestionSkills.filter((item) => item.toLowerCase().includes(query.toLowerCase())).map((item) => (
              <button key={item} onClick={() => { setSelected((items) => items.includes(item) ? items : [...items, item]); setQuery(""); }}>{item}</button>
            ))}
          </div>
        )}
      </div>
      <h3>Your Current Skills</h3>
      <div className="selected-skills">
        {selected.map((name) => <span key={name}>{name}<button title="Remove skill" onClick={() => remove(name)}><X /></button></span>)}
      </div>
      <button className="primary-modal-button" disabled={selected.length === skills.length} onClick={close}>Confirm</button>
    </ModalFrame>
  );
}

function CertificateModal({ close }) {
  return (
    <ModalFrame close={close} label="certificate dialog">
      <h2>Add Certificate</h2>
      <input className="modal-input" placeholder="Title *" />
      <input className="modal-input" placeholder="Enter certificate URL" />
      <label className="certificate-label">Certificate File (optional)</label>
      <button className="upload-area"><span><Upload /></span><strong>Upload file</strong><small>Drag &amp; drop or click to browse (PNG, JPG, JPEG, PDF)</small></button>
      <button className="primary-modal-button" onClick={close}>Add</button>
      <p className="certificate-tip">Any skill related to this license or certification — it'll show up in your Skills section too</p>
    </ModalFrame>
  );
}

function LegacyAnalyticsPage() {
  const [viewTab, setViewTab] = useState("Titles");
  return (
    <main className="analytics-page">
      <div className="analytics-grid">
        <section className="analytics-card lost-card">
          <AnalyticsHeader title="Lost Opportunities" />
          <div className="lost-content"><div><strong>0</strong><span>Number of Lost Jobs</span></div><p>No matching positions found.</p></div>
          <hr /><p className="muted">No score levels available.</p>
        </section>
        <section className="analytics-card score-card">
          <h2>Profile Score</h2>
          <div className="score-row">
            <div className="score-donut"><span><strong>2724</strong>Score</span></div>
            <div className="score-legend">
              <p><i className="overall" />Overall<strong>2724</strong></p>
              <p><i className="experience" />Experience<strong>189</strong></p>
              <p><i className="skills" />Skills<strong>2535</strong></p>
            </div>
          </div>
          <hr />
          <h3>Top Skills</h3><p className="muted">No matched skills found.</p>
          <h3>Skills Required To Increase Opportunities</h3><p className="muted">No missing skills detected.</p>
        </section>
        <section className="analytics-card views-card">
          <AnalyticsHeader title="Profile Views" />
          <div className="views-tabs">{["Titles", "Companies", "Positions", "Keywords"].map((tab) => <button key={tab} className={viewTab === tab ? "active" : ""} onClick={() => setViewTab(tab)}>{tab}</button>)}</div>
          <p className="muted">No aggregate data available.</p>
        </section>
        <section className="analytics-card location-card">
          <div className="location-heading"><strong>Location</strong><strong>Opened Vacancies</strong></div>
          {["United Arab Emirates", "Saudi Arabia", "Egypt", "Qatar"].map((country) => <p key={country}><span>{country}</span><b>0</b></p>)}
        </section>
      </div>
    </main>
  );
}

function AnalyticsPage({ navigate }) {
  const [period, setPeriod] = useState("30 days");
  const factor = period === "7 days" ? .45 : period === "90 days" ? 2.4 : 1;
  const metric = (value) => Math.round(value * factor);
  const trend = [31, 46, 38, 58, 54, 73, 67, 82, 78, 91, 86, 100];
  const openHub = (view = "explore") => {
    window.history.pushState({}, "", `/explore-jobs/?hub=${view}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  const kpis = [
    { label: "Search appearances", value: metric(642), delta: "+12%", Icon: Eye, note: "How often recruiters discovered you" },
    { label: "Profile views", value: metric(128), delta: "+18%", Icon: BadgeCheck, note: "Recruiters who opened your profile" },
    { label: "CV downloads", value: metric(17), delta: "+6", Icon: FileText, note: "Portfolio and CV downloads" },
    { label: "Recruiter messages", value: metric(6), delta: "+2", Icon: MessageCircle, note: "New hiring conversations" },
  ];
  return (
    <main className="career-analytics-page">
      <header className="career-analytics-header"><div><span>Career performance</span><h1>Your job-search analytics</h1><p>Mock insights across visibility, matches, applications, recruiter conversations, and outcomes.</p></div><div className="analytics-period" aria-label="Analytics period">{["7 days", "30 days", "90 days"].map((item) => <button type="button" key={item} className={period === item ? "active" : ""} onClick={() => setPeriod(item)}>{item}</button>)}</div></header>
      <section className="career-kpis">{kpis.map(({ label, value, delta, Icon, note }, index) => <article key={label} style={{ "--delay": `${index * 90}ms` }}><span><Icon /></span><div><small>{label}</small><strong>{value.toLocaleString()}</strong><p>{note}</p></div><b>{delta}</b></article>)}</section>
      <section className="career-analytics-grid">
        <article className="analytics-panel visibility-panel"><header><div><span>Visibility trend</span><h2>Recruiter discovery is growing</h2></div><strong>+18.4%</strong></header><div className="analytics-chart-legend"><span><i />Profile views</span><span><i />Search appearances</span></div><div className="analytics-trend-bars" key={period}>{trend.map((height, index) => <div key={index} style={{ "--bar": `${height}%`, "--delay": `${index * 45}ms` }}><span style={{ height: `${Math.max(18, height * .68)}%` }} /><i style={{ height: `${height}%` }} /><small>{index % 2 === 0 ? `${index + 1}` : ""}</small></div>)}</div><footer><span>1 {period === "7 days" ? "Aug" : "Jul"}</span><span>11 Aug</span></footer></article>
        <article className="analytics-panel profile-health-panel"><header><div><span>Profile strength</span><h2>Ready to be discovered</h2></div></header><div className="profile-health"><div className="profile-health-ring" style={{ "--score": "82%" }}><span><strong>82%</strong>complete</span></div><div><p><span>Experience</span><b>96%</b></p><p><span>Skills</span><b>78%</b></p><p><span>Portfolio</span><b>72%</b></p></div></div><button type="button" onClick={() => navigate("profile")}>Strengthen profile <ArrowRight /></button></article>
        <article className="analytics-panel funnel-panel"><header><div><span>Opportunity funnel</span><h2>From discovery to offer</h2></div><button type="button" onClick={() => openHub("applications")}>Open applications</button></header><div className="conversion-funnel" key={`funnel-${period}`}>{[["Matched",32],["Saved",3],["Applied",6],["Interview",2],["Offer",1]].map(([label,value], index) => <div key={label}><span>{label}<small>{index ? `${Math.round(value / 32 * 100)}% of matches` : "Best-fit roles"}</small></span><div><i style={{ width: `${Math.max(12, value / 32 * 100)}%`, "--delay": `${index * 90}ms` }} /></div><strong>{metric(value)}</strong></div>)}</div></article>
        <article className="analytics-panel response-panel"><header><div><span>Recruiter engagement</span><h2>Conversation health</h2></div></header><div className="response-metrics"><div><MessageCircle /><strong>{metric(6)}</strong><span>Active threads</span></div><div><Clock3 /><strong>3h 12m</strong><span>Avg. response</span></div><div><Check /><strong>83%</strong><span>Reply rate</span></div></div><div className="response-callout"><span><CalendarDays /></span><div><strong>Intro call tomorrow</strong><small>Mosaic Events · 10:30</small></div><button type="button" onClick={() => openHub("messages")}>Prepare</button></div></article>
        <article className="analytics-panel market-panel"><header><div><span>Market fit</span><h2>Where your strongest roles are</h2></div></header><div className="market-columns"><div className="market-list"><strong>Top locations</strong>{[["Dubai",18],["Abu Dhabi",7],["Remote",5],["Sharjah",2]].map(([name,count]) => <p key={name}><span>{name}</span><i><b style={{ width: `${count / 18 * 100}%` }} /></i><em>{count}</em></p>)}</div><div className="market-list"><strong>Top role families</strong>{[["3D & Realtime",12],["Creative Tech",9],["Experiential",7],["Motion",4]].map(([name,count]) => <p key={name}><span>{name}</span><i><b style={{ width: `${count / 12 * 100}%` }} /></i><em>{count}</em></p>)}</div></div></article>
        <article className="analytics-panel skills-panel"><header><div><span>Skill alignment</span><h2>Skills driving your matches</h2></div></header><div className="skill-insight-list">{[["3D visualization",94],["Realtime workflows",88],["Creative direction",82],["Client presentation",71]].map(([skill,score]) => <div key={skill}><span>{skill}<b>{score}%</b></span><i><b style={{ width: `${score}%` }} /></i></div>)}</div><div className="analytics-recommendation"><Lightbulb /><div><strong>Best next move</strong><p>Add two measurable realtime-project outcomes to increase alignment for 7 high-fit roles.</p></div></div></article>
      </section>
      <section className="analytics-job-preview"><header><div><span>High-signal opportunities</span><h2>Roles responding to your profile</h2></div><button type="button" onClick={() => openHub("daily")}>See daily matches <ArrowRight /></button></header><div>{hubJobs.slice(0,3).map((job) => <button type="button" key={job.id} onClick={() => { window.history.pushState({}, "", `/explore-jobs/?hub=job&job=${job.id}`); window.dispatchEvent(new PopStateEvent("popstate")); }}><img src={job.image} alt="" /><span><strong>{job.role}</strong><small>{job.company} · {job.location}</small><em>{job.match}% match</em></span><ArrowRight /></button>)}</div></section>
      <p className="analytics-source-note">Prototype data · Updated 11 Aug 2026 · Metrics are illustrative and designed to connect to live platform events later.</p>
    </main>
  );
}

function AnalyticsHeader({ title }) {
  return (
    <header className="analytics-header">
      <h2>{title}</h2>
      <div className="date-range"><label>From<input type="date" /></label><i /> <label>To<input type="date" /></label></div>
    </header>
  );
}

function SettingsPage() {
  const [open, setOpen] = useState({ profile: true, contacts: true, blocks: false });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  const toggleSection = (name) => (next) => setOpen((current) => ({ ...current, [name]: next === name }));

  return (
    <main className="settings-page">
      <h1>Account Settings</h1>
      <SettingsAccordion title="Profile information" name="profile" open={open} setOpen={toggleSection("profile")}>
        {loading ? <SettingsSkeleton /> : <ProfileInformation />}
      </SettingsAccordion>
      <SettingsAccordion title="Contacts Info" name="contacts" open={open} setOpen={toggleSection("contacts")}><ContactsInfo /></SettingsAccordion>
      <SettingsAccordion title="Block and reports" name="blocks" open={open} setOpen={toggleSection("blocks")}><BlockReports /></SettingsAccordion>
    </main>
  );
}

function SettingsAccordion({ title, name, open, setOpen, children }) {
  const active = Boolean(open[name]);
  return (
    <section className={`settings-accordion ${active ? "open" : ""}`}>
      <button className="accordion-heading" onClick={() => setOpen(active ? "" : name)}><span>{title}</span>{active ? <span className="minus">−</span> : <Plus />}</button>
      <div className="accordion-content">{children}</div>
    </section>
  );
}

function SettingsSkeleton() {
  return <div className="settings-skeleton"><img src="/assets/brand/w-mark.svg" alt="" /></div>;
}

function ProfileInformation() {
  const [fullTime, setFullTime] = useState(true);
  const [onsite, setOnsite] = useState(true);
  const [relocation, setRelocation] = useState(false);
  return (
    <div className="profile-information">
      <Avatar size={140} /><h2>ARIES BLACK</h2>
      <div className="settings-form-grid">
        <input defaultValue="ARIES BLACK" aria-label="Full name" />
        <input defaultValue="https://www.linkedin.com/in/ariesblack" disabled aria-label="Linkedin" />
        <select defaultValue="United Arab Emirates"><option>United Arab Emirates</option><option>Saudi Arabia</option></select>
        <select defaultValue="Dubai"><option>Dubai</option><option>Abu Dhabi</option></select>
      </div>
      <label className="relocation-row">Relocation willingness<button className={`switch ${relocation ? "on" : ""}`} onClick={() => setRelocation((value) => !value)}><span /></button></label>
      <div className="settings-pills-grid">
        <div><label>Job type</label><div>{["Internship", "Part Time", "Contract", "Full Time", "Freelance"].map((item) => <button key={item} className={item === "Full Time" && fullTime ? "active" : ""} onClick={() => item === "Full Time" && setFullTime((value) => !value)}>{item}</button>)}</div></div>
        <div><label>Job mode</label><div>{["Onsite", "Remote", "Hybrid"].map((item) => <button key={item} className={item === "Onsite" && onsite ? "active" : ""} onClick={() => item === "Onsite" && setOnsite((value) => !value)}>{item}</button>)}</div></div>
      </div>
      <button className="update-button" disabled>Update</button>
    </div>
  );
}

function ContactsInfo() {
  return (
    <div className="contacts-info">
      <label>Email</label><div className="verified-input"><input value="unrealdesigns.ae@gmail.com" readOnly /><BadgeCheck /></div>
      <label>Mobile number</label><div className="phone-input"><span><Flag /> +971 <ChevronDown /></span><input value="567502350" readOnly /><CircleAlert /></div>
      <button>Verify</button>
    </div>
  );
}

function BlockReports() {
  return (
    <div className="block-reports">
      <label>Add to block list</label><input placeholder="Company" />
      <div>No blocked companies</div>
    </div>
  );
}

function LoginPage({ navigate }) {
  const [mode, setMode] = useState("login");
  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <img src="/assets/brand/w-mark.svg" alt="" />
        <h1>Genuine<br />Talent.<br />Intelligently.</h1>
      </section>
      <section className="login-form-panel">
        <button className="login-language"><span>EN</span><img src="/assets/us-flag.svg" alt="English" /></button>
        <img className="login-logo" src="/assets/brand/logo.svg" alt="WizJobs" />
        <div className="login-form">
          {mode === "login" && (
            <>
              <button className="google-button"><img src="/assets/google-icon.svg" alt="" />Continue with Google</button>
              <div className="or-line"><span>Sign In by Email</span></div>
              <input type="email" placeholder="Email" />
              <div className="password-field"><input type="password" placeholder="Password" /><Eye /></div>
              <button className="text-link left" onClick={() => setMode("forgot")}>Forgot Password?</button>
              <button className="login-primary" onClick={() => navigate("home")}>Sign In</button>
              <p>Don't have an account? <button className="text-link" onClick={() => setMode("signup")}>Sign Up</button></p>
            </>
          )}
          {mode === "signup" && (
            <>
              <h2>Create your account</h2><input placeholder="Full name" /><input type="email" placeholder="Email" /><input type="password" placeholder="Password" /><button className="login-primary" onClick={() => navigate("home")}>Sign Up</button><button className="text-link" onClick={() => setMode("login")}>Back to Sign In</button>
            </>
          )}
          {mode === "forgot" && (
            <>
              <h2>Reset your password</h2><p>Enter your email and we'll send you recovery instructions.</p><input type="email" placeholder="Email" /><button className="login-primary">Send Link</button><button className="text-link" onClick={() => setMode("login")}>Back to Sign In</button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function CvPreview() {
  return (
    <main className="cv-preview-page">
      <article>
        <header><Avatar size={88} /><div><h1>ARIES BLACK</h1><p>TECHNICAL ART DIRECTOR</p></div></header>
        <section><h2>Profile</h2><p>Technical Art Director and architectural visualization specialist with 13 years of creative production experience.</p></section>
        <section><h2>Experience</h2>{experiences.map(([role, company, dates]) => <div key={role}><strong>{role}</strong><span>{company}</span><small>{dates}</small></div>)}</section>
        <section><h2>Core Skills</h2><p>{skills.slice(0, 8).map(([name]) => name).join(" • ")}</p></section>
      </article>
    </main>
  );
}

const coachMoments = [
  { pose: "Ready", line: "Let’s get you interview-ready." },
  { pose: "Thinking", line: "Give me a second—I’m shaping your strongest answer." },
  { pose: "Presenting", line: "Lead with the result, then explain how you achieved it." },
  { pose: "Listening", line: "That’s a good start. What changed because of your work?" },
  { pose: "Encouraging", line: "You’ve got this. Keep the answer clear and specific." },
  { pose: "Celebrating", line: "Excellent answer! That sounded confident." },
];

const WIZY_CLIPS = {
  "idle-breathe": { fps: 10, moment: 0, next: "idle-glance" },
  "idle-glance": { fps: 10, moment: 0, next: "idle-shift" },
  "idle-shift": { fps: 10, moment: 0, next: "idle-breathe" },
  "greet-pop": { fps: 12, moment: 5, next: "greet-wave" },
  "greet-wave": { fps: 12, moment: 5, next: "listen-tilt" },
  "listen-lean": { fps: 10, moment: 3, next: "listen-tilt" },
  "listen-tilt": { fps: 10, moment: 3, next: "idle-breathe" },
  "think-idea": { fps: 10, moment: 1, next: "coach-explain" },
  "coach-explain": { fps: 12, moment: 2, next: "idle-breathe" },
  "coach-point": { fps: 12, moment: 2, next: "idle-breathe" },
  "coach-thumb": { fps: 12, moment: 4, next: "idle-breathe" },
  "celebrate-clap": { fps: 12, moment: 5, next: "celebrate-hop" },
  "celebrate-hop": { fps: 12, moment: 5, next: "idle-breathe" },
  "playful-tap": { fps: 10, moment: 0, next: "playful-stumble" },
  "playful-stumble": { fps: 12, moment: 0, next: "idle-breathe" },
};

const WIZY_CLIP_NAMES = Object.keys(WIZY_CLIPS);
const wizyFramePath = (clip, frame) => `/assets/wizy/clips/${clip}/${String(frame + 1).padStart(2, "0")}.webp`;

const quickPrompts = ["Practice an interview", "Improve my CV", "Find matching jobs"];

function WizyCoach() {
  const [clip, setClip] = useState("idle-breathe");
  const [frame, setFrame] = useState(0);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [messages, setMessages] = useState([
    { from: "wizzy", text: "Hi! I’m Wizy, your job-search coach. What should we work on?" },
  ]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    WIZY_CLIP_NAMES.forEach((name) => {
      for (let index = 0; index < 8; index += 1) new Image().src = wizyFramePath(name, index);
    });
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = window.setTimeout(() => {
      if (frame < 7) {
        setFrame((value) => value + 1);
        return;
      }
      setClip(WIZY_CLIPS[clip].next);
      setFrame(0);
    }, 1000 / WIZY_CLIPS[clip].fps);
    return () => window.clearTimeout(timer);
  }, [clip, frame, reducedMotion]);

  const playClip = (name) => {
    setClip(name);
    setFrame(0);
  };

  useEffect(() => {
    if (open || reducedMotion) return undefined;
    const playfulTimer = window.setTimeout(() => playClip("playful-tap"), 18000);
    return () => window.clearTimeout(playfulTimer);
  }, [open, reducedMotion]);

  const reply = (prompt) => {
    const clean = prompt.trim();
    if (!clean) return;
    setMessages((items) => [
      ...items,
      { from: "user", text: clean },
      { from: "wizzy", text: clean.toLowerCase().includes("cv")
        ? "Let’s sharpen your CV. Start with one achievement you’re proud of, including a measurable result."
        : clean.toLowerCase().includes("match")
          ? "I’ll help you focus the search. Which role, location, and work mode are you targeting?"
          : "Great—let’s rehearse. Tell me about a project where you solved a difficult problem." },
    ]);
    setInput("");
    const lower = clean.toLowerCase();
    if (["offer", "hired", "success", "passed", "great news"].some((word) => lower.includes(word))) playClip("celebrate-clap");
    else if (lower.includes("match")) playClip("coach-point");
    else if (lower.includes("cv")) playClip("coach-explain");
    else if (["thanks", "thank you", "got it"].some((word) => lower.includes(word))) playClip("coach-thumb");
    else playClip("think-idea");
  };

  const currentMoment = coachMoments[WIZY_CLIPS[clip].moment];

  return (
    <aside className={`wizzy-coach ${open ? "chat-open" : ""}`} aria-label="Wizy job coach">
      <div className="wizzy-nudge" aria-hidden={open}>
        <strong>{currentMoment.pose}</strong>
        <span>{currentMoment.line}</span>
      </div>

      {open && (
        <section className="wizzy-chat" aria-label="Chat with Wizy">
          <header>
            <span className="wizzy-status-dot" />
            <div><strong>Wizy</strong><small>Interview coach · Online</small></div>
            <button onClick={() => setOpen(false)} aria-label="Close chat"><X /></button>
          </header>
          <div className="wizzy-messages" aria-live="polite">
            {messages.map((message, index) => <p key={`${message.from}-${index}`} className={message.from}>{message.text}</p>)}
          </div>
          <div className="wizzy-prompts">
            {quickPrompts.map((prompt) => <button key={prompt} onClick={() => reply(prompt)}>{prompt}</button>)}
          </div>
          <form onSubmit={(event) => { event.preventDefault(); reply(input); }}>
            <input value={input} onFocus={() => playClip("listen-lean")} onChange={(event) => { setInput(event.target.value); if (event.target.value.length === 1) playClip("listen-lean"); }} placeholder="Ask Wizy anything…" aria-label="Message Wizy" />
            <button aria-label="Send message" type="submit"><Send /></button>
          </form>
        </section>
      )}

      <button className="wizzy-pet" onClick={() => { setOpen((value) => !value); playClip(open ? "idle-breathe" : "greet-pop"); }} aria-label={open ? "Close Wizy chat" : "Open Wizy chat"}>
        <span className="wizzy-stage">
          <img className="wizzy-frame active" src={wizyFramePath(clip, reducedMotion ? 0 : frame)} alt={`Wizy ${currentMoment.pose.toLowerCase()}`} />
        </span>
        <span className="wizzy-chat-icon"><MessageCircle /></span>
      </button>
    </aside>
  );
}

export function App() {
  const [route, setRoute] = useState(routeFromPath);
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem("wizjobs-theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("wizjobs-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onPop = () => setRoute(routeFromPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (next) => {
    const path = ROUTES[next] || ROUTES.home;
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
    setRoute(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (route === "login") return <LoginPage navigate={navigate} />;
  if (route === "cv") return <CvPreview />;

  return (
    <div className={`app-shell v2-route-${route}`}>
      <Header route={route} navigate={navigate} theme={theme} toggleTheme={() => setTheme((value) => value === "dark" ? "light" : "dark")} />
      {route === "home" && <HomeV2 navigate={navigate} />}
      {route === "profile" && <ProfileSummaryV2 navigate={navigate} />}
      {route === "analytics" && <AnalyticsV2 navigate={navigate} />}
      {route === "explore" && <ExploreJobs />}
      {route === "settings" && <SettingsPage />}
      <WizyPet />
    </div>
  );
}
