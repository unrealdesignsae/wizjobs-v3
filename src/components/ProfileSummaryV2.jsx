import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleUserRound,
  ExternalLink,
  FileCheck2,
  FileText,
  FolderKanban,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Medal,
  Pencil,
  Plus,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import "../profile-summary-v2.css";

const INITIAL_EXPERIENCE = [
  {
    id: "entourage",
    role: "Technical Art Director",
    company: "Entourage Marketing & Events",
    dates: "Sep 2024 – Present",
    duration: "1 year 11 months",
    summary: "Leading technical art direction for large-scale events, realtime content, and immersive experiences.",
  },
  {
    id: "ambient",
    role: "Architectural Visualizer",
    company: "Ambient Studio",
    dates: "Mar 2024 – Aug 2024",
    duration: "6 months",
    summary: "Created photorealistic visualizations and presentation-ready spatial narratives for client teams.",
  },
  {
    id: "od-event",
    role: "Senior 3D Artist",
    company: "OD Event",
    dates: "Sep 2022 – Feb 2024",
    duration: "1 year 6 months",
    summary: "Built production-ready 3D assets and environments for live events and branded experiences.",
  },
  {
    id: "indesign",
    role: "Self-employed Designer",
    company: "InDesign",
    dates: "Jan 2012 – Dec 2021",
    duration: "10 years",
    summary: "Delivered visualization, design, and creative direction work for a global client portfolio.",
  },
];

const INITIAL_SKILLS = [
  { id: "rendering", name: "Photorealistic Rendering", rank: "Expert", score: 5, evidence: "3 portfolio pieces", verified: true },
  { id: "vray", name: "V-Ray", rank: "Expert", score: 5, evidence: "2 portfolio pieces", verified: true },
  { id: "max", name: "3ds Max", rank: "Expert", score: 5, evidence: "2 portfolio pieces", verified: true },
  { id: "after-effects", name: "After Effects", rank: "Competent", score: 3, evidence: "1 portfolio piece", verified: false },
  { id: "collaboration", name: "Cross-Functional Collaboration", rank: "Mid-level", score: 2, evidence: "1 certificate", verified: false },
  { id: "environment", name: "Environment Design", rank: "Mid-level", score: 2, evidence: "2 project mentions", verified: false },
];

const INITIAL_PORTFOLIO = [
  {
    id: "pavilion",
    title: "Realtime Pavilion Experience",
    type: "Immersive environment",
    image: "/assets/hub-jobs/job-01.png",
    detail: "Realtime look development, lighting, and visual systems for a large-format visitor experience.",
  },
  {
    id: "launch",
    title: "Dubai Brand Launch",
    type: "Technical art direction",
    image: "/assets/hub-jobs/job-05.png",
    detail: "A production toolkit that connected concept art, 3D visualization, motion, and on-site playback.",
  },
  {
    id: "visualization",
    title: "Architectural Storytelling",
    type: "Visualization series",
    image: "/assets/hub-jobs/job-09.png",
    detail: "Photorealistic environments designed to communicate material, light, and visitor flow.",
  },
];

const INITIAL_CERTIFICATES = [
  { id: "autodesk", name: "3ds Max Professional", issuer: "Autodesk", year: "2025", verified: true },
  { id: "unreal", name: "Realtime Visualization Foundations", issuer: "Epic Games", year: "2024", verified: true },
];

const SECTION_ITEMS = [
  ["overview", "Overview", CircleUserRound],
  ["experience", "Experience", BriefcaseBusiness],
  ["skills", "Skills", ShieldCheck],
  ["portfolio", "Portfolio", FolderKanban],
  ["certificates", "Certificates", Award],
  ["education", "Education", GraduationCap],
];

function useCountUp(target, duration = 760) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return undefined;
    }

    let frame = 0;
    let startedAt = 0;
    const tick = (time) => {
      if (!startedAt) startedAt = time;
      const progress = Math.min(1, (time - startedAt) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [duration, target]);

  return value;
}

function Reveal({ order, className = "", children, ...props }) {
  return (
    <div className={`pv2-reveal ${className}`} style={{ "--pv2-order": order }} {...props}>
      {children}
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <header className="pv2-section-heading">
      <div>
        {eyebrow && <span>{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  );
}

export default function ProfileSummaryV2({ navigate }) {
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);
  const dialogOpenRef = useRef(false);
  const highlightTimeoutRef = useRef(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [editor, setEditor] = useState(null);
  const [toast, setToast] = useState("");
  const [storyExpanded, setStoryExpanded] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [profile, setProfile] = useState({
    title: "Technical Art Director",
    location: "Dubai, UAE",
    workMode: "On-site",
    story:
      "Technical Art Director with 13+ years leading art pipelines, teams, and frames for AAA games, films, events, and immersive experiences. I bridge art and technology to create ambitious work that teams can actually deliver.",
  });
  const [experience, setExperience] = useState(INITIAL_EXPERIENCE);
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [portfolio, setPortfolio] = useState(INITIAL_PORTFOLIO);
  const [certificates, setCertificates] = useState(INITIAL_CERTIFICATES);
  const [education, setEducation] = useState({
    school: "Georgetown University",
    program: "Continuing Studies — Creative Direction",
    period: "2010 – 2012",
  });
  const health = useCountUp(78);
  const years = useCountUp(13, 640);
  const verifiedCount = useMemo(() => skills.filter((skill) => skill.verified).length, [skills]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const isOpen = Boolean(editor || selectedPortfolio);

    if (isOpen && !dialogOpenRef.current) {
      returnFocusRef.current = document.activeElement;
      window.requestAnimationFrame(() => {
        dialogRef.current?.querySelector("button, input, textarea, select, a[href]")?.focus();
      });
    }

    if (!isOpen && dialogOpenRef.current) {
      window.requestAnimationFrame(() => returnFocusRef.current?.focus?.());
      returnFocusRef.current = null;
    }

    dialogOpenRef.current = isOpen;
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const manageDialogKeys = (event) => {
      if (event.key === "Escape") {
        setEditor(null);
        setSelectedPortfolio(null);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = [...dialogRef.current.querySelectorAll("button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]")]
        .filter((element) => element.getClientRects().length > 0);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", manageDialogKeys);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", manageDialogKeys);
    };
  }, [editor, selectedPortfolio]);

  const jumpTo = (id) => {
    setActiveSection(id);
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const target = document.getElementById(`pv2-${id}`);
    target?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    if (target && !reduced) {
      window.clearTimeout(highlightTimeoutRef.current);
      target.classList.remove("pv2-section-highlight");
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => target.classList.add("pv2-section-highlight"));
      });
      highlightTimeoutRef.current = window.setTimeout(() => target.classList.remove("pv2-section-highlight"), 760);
    }
  };

  const previewCv = () => window.open("/cv-preview/", "_blank", "noopener,noreferrer");

  const verifySkill = (id) => {
    setSkills((current) => current.map((skill) => (skill.id === id ? { ...skill, verified: true } : skill)));
    setToast("Skill evidence verified and added to your profile.");
  };

  const submitEditor = (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));

    if (editor === "profile") {
      setProfile((current) => ({ ...current, ...values }));
      setToast("Professional story updated.");
    }
    if (editor === "experience") {
      setExperience((current) => [
        {
          id: `experience-${Date.now()}`,
          role: values.role,
          company: values.company,
          dates: values.dates,
          duration: values.duration,
          summary: values.summary,
        },
        ...current,
      ]);
      setToast("Experience added to your timeline.");
    }
    if (editor === "portfolio") {
      setPortfolio((current) => [
        ...current,
        {
          id: `portfolio-${Date.now()}`,
          title: values.title,
          type: values.type,
          detail: values.detail,
          image: "/assets/hub-jobs/job-10.png",
        },
      ]);
      setToast("Portfolio project added.");
    }
    if (editor === "certificate") {
      setCertificates((current) => [
        ...current,
        { id: `certificate-${Date.now()}`, name: values.name, issuer: values.issuer, year: values.year, verified: false },
      ]);
      setToast("Certificate added and queued for verification.");
    }
    if (editor === "education") {
      setEducation(values);
      setToast("Education details updated.");
    }
    setEditor(null);
  };

  const editorTitle = {
    profile: "Edit professional story",
    experience: "Add experience",
    portfolio: "Add portfolio project",
    certificate: "Add certificate",
    education: "Edit education",
  }[editor];

  const visibleSkills = showAllSkills ? skills : skills.slice(0, 5);
  const afterEffectsVerified = skills.find((skill) => skill.id === "after-effects")?.verified;

  return (
    <main className="profile-v2" aria-label="Profile summary">
      <div className="pv2-shell">
        <aside className="pv2-sidebar" aria-label="Profile navigation">
          <Reveal order={0} className="pv2-identity-card">
            <img src="/assets/profile-aries-v2.png" alt="Aries Black" className="pv2-avatar" width="124" height="148" />
            <h1>Aries Black</h1>
            <p>{profile.title}</p>
            <span><MapPin /> {profile.location}</span>
          </Reveal>

          <Reveal order={1} className="pv2-health-card">
            <div className="pv2-strength-ring" aria-label={`Profile strength ${health} out of 100`}>
              <span><strong>{health}</strong><small>/100</small></span>
            </div>
            <div className="pv2-strength-copy">
              <span>Profile strength</span>
              <b>Strong</b>
              <p>Keep going. You’re almost at Expert level.</p>
            </div>
            <button type="button" className="pv2-button pv2-button-secondary" onClick={() => jumpTo("skills")}>
              Improve profile <ArrowRight />
            </button>
          </Reveal>

          <Reveal order={2} className="pv2-section-nav">
            {SECTION_ITEMS.map(([id, label, Icon]) => (
              <button
                type="button"
                key={id}
                className={activeSection === id ? "active" : ""}
                onClick={() => jumpTo(id)}
                aria-current={activeSection === id ? "location" : undefined}
              >
                <Icon /> <span>{label}</span>
              </button>
            ))}
          </Reveal>

          <Reveal order={3} className="pv2-sidebar-actions">
            <button type="button" className="pv2-button pv2-button-primary" onClick={previewCv}>
              <FileText /> Preview CV
            </button>
            <div className="pv2-contact-links">
              <a href="mailto:unrealdesigns.ae@gmail.com"><Mail /><span>Email Aries</span></a>
              <a href="https://www.linkedin.com/in/ariesblack" target="_blank" rel="noreferrer"><Linkedin /><span>LinkedIn</span><ExternalLink /></a>
            </div>
          </Reveal>
        </aside>

        <div className="pv2-main-column">
          <Reveal
            order={4}
            className="pv2-story-card pv2-section"
            id="pv2-overview"
            data-profile-section="overview"
          >
            <SectionHeading
              eyebrow="Profile summary"
              title="Your Professional Story"
              description="Tell your story. Showcase your value."
              action={(
                <button type="button" className="pv2-button pv2-button-secondary" onClick={() => setEditor("profile")}>
                  <Pencil /> Edit profile
                </button>
              )}
            />
            <div className="pv2-story-layout">
              <div className="pv2-story-copy">
                <dl className="pv2-profile-facts">
                  <div><dt>Current title</dt><dd>{profile.title}</dd></div>
                  <div><dt>Experience</dt><dd>{years} years</dd></div>
                  <div><dt>Location</dt><dd>{profile.location}</dd></div>
                  <div><dt>Work mode</dt><dd>{profile.workMode}</dd></div>
                </dl>
                <div className="pv2-about">
                  <span>About you</span>
                  <p className={storyExpanded ? "expanded" : ""}>{profile.story}</p>
                  <button type="button" aria-expanded={storyExpanded} onClick={() => setStoryExpanded((value) => !value)}>
                    {storyExpanded ? "Show less" : "View more"} <ChevronDown className={storyExpanded ? "rotated" : ""} />
                  </button>
                </div>
              </div>
              <div className="pv2-story-media" aria-label="Featured portfolio snapshots">
                {portfolio.slice(0, 3).map((item, index) => (
                  <button type="button" key={item.id} onClick={() => setSelectedPortfolio(item)} aria-label={`View ${item.title}`}>
                    <img src={item.image} alt="" width="112" height="112" />
                    <span>{index + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal
            order={5}
            className="pv2-card pv2-section"
            id="pv2-experience"
            data-profile-section="experience"
          >
            <SectionHeading
              eyebrow="Career history"
              title="Experience"
              description={`${years} years of experience across ${experience.length} roles`}
              action={(
                <button type="button" className="pv2-button pv2-button-secondary" onClick={() => setEditor("experience")}>
                  <Plus /> Add experience
                </button>
              )}
            />
            <div className="pv2-timeline">
              {experience.map((item, index) => (
                <article key={item.id} className="pv2-timeline-item" style={{ "--pv2-item": index }}>
                  <span className="pv2-timeline-icon"><Building2 /></span>
                  <div>
                    <h3>{item.role} <small>{item.company}</small></h3>
                    <p>{item.summary}</p>
                    <footer><CalendarDays /> {item.dates} <i /> {item.duration}</footer>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal
            order={6}
            className="pv2-card pv2-section"
            id="pv2-skills"
            data-profile-section="skills"
          >
            <SectionHeading
              eyebrow="Proof of capability"
              title="Skills & Evidence"
              description={`${verifiedCount} verified skills currently strengthen your matches`}
              action={(
                <button
                  type="button"
                  className="pv2-button pv2-button-secondary"
                  aria-expanded={showAllSkills}
                  aria-controls="pv2-skills-table"
                  onClick={() => setShowAllSkills((value) => !value)}
                >
                  <ShieldCheck /> {showAllSkills ? "Show core skills" : "Manage skills"}
                </button>
              )}
            />
            <div id="pv2-skills-table" className="pv2-skills-table" role="table" aria-label="Skills and evidence">
              <div className="pv2-skills-header" role="row">
                <span role="columnheader">Skill</span><span role="columnheader">Level</span><span role="columnheader">Evidence</span><span role="columnheader">Status</span>
              </div>
              {visibleSkills.map((skill) => (
                <div className="pv2-skill-row" role="row" key={skill.id}>
                  <strong role="cell">{skill.name}</strong>
                  <span role="cell" className="pv2-level-cell">
                    <b>{skill.rank}</b>
                    <i aria-label={`${skill.score} out of 5 proficiency`}>
                      {[1, 2, 3, 4, 5].map((dot) => <em key={dot} className={dot <= skill.score ? "filled" : ""} />)}
                    </i>
                  </span>
                  <span role="cell">{skill.evidence}</span>
                  <span role="cell">
                    {skill.verified ? (
                      <span className="pv2-verified"><BadgeCheck /> Verified</span>
                    ) : (
                      <button type="button" className="pv2-verify-button" onClick={() => verifySkill(skill.id)}>Verify skill</button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal
            order={7}
            className="pv2-card pv2-section"
            id="pv2-portfolio"
            data-profile-section="portfolio"
          >
            <SectionHeading
              eyebrow="Selected work"
              title="Portfolio"
              description="Show hiring teams the craft behind your profile."
              action={(
                <button type="button" className="pv2-button pv2-button-secondary" onClick={() => setEditor("portfolio")}>
                  <Plus /> Add project
                </button>
              )}
            />
            <div className="pv2-portfolio-grid">
              {portfolio.map((item) => (
                <button type="button" className="pv2-portfolio-card" key={item.id} onClick={() => setSelectedPortfolio(item)}>
                  <img src={item.image} alt="" width="400" height="240" loading="lazy" />
                  <span><small>{item.type}</small><strong>{item.title}</strong><em>View project <ArrowRight /></em></span>
                </button>
              ))}
            </div>
          </Reveal>

          <div className="pv2-module-grid">
            <Reveal
              order={8}
              className="pv2-card pv2-section pv2-compact-module"
              id="pv2-certificates"
              data-profile-section="certificates"
            >
              <SectionHeading
                eyebrow="Credentials"
                title="Certificates"
                action={<button type="button" className="pv2-icon-button" aria-label="Add certificate" onClick={() => setEditor("certificate")}><Plus /></button>}
              />
              <div className="pv2-credential-list">
                {certificates.map((certificate) => (
                  <article key={certificate.id}>
                    <span><Medal /></span>
                    <div><strong>{certificate.name}</strong><small>{certificate.issuer} · {certificate.year}</small></div>
                    {certificate.verified ? <BadgeCheck aria-label="Verified" /> : <button type="button" onClick={() => setToast("Certificate submitted for verification.")}>Verify</button>}
                  </article>
                ))}
              </div>
            </Reveal>

            <Reveal
              order={9}
              className="pv2-card pv2-section pv2-compact-module"
              id="pv2-education"
              data-profile-section="education"
            >
              <SectionHeading
                eyebrow="Learning"
                title="Education"
                action={<button type="button" className="pv2-icon-button" aria-label="Edit education" onClick={() => setEditor("education")}><Pencil /></button>}
              />
              <article className="pv2-education-entry">
                <span><GraduationCap /></span>
                <div><strong>{education.school}</strong><p>{education.program}</p><small>{education.period}</small></div>
              </article>
              <button type="button" className="pv2-text-action" onClick={() => navigate?.("analytics")}>
                See profile insights <ArrowRight />
              </button>
            </Reveal>
          </div>

          <Reveal order={10} className="pv2-completion-card">
            <span><Sparkles /></span>
            <div><strong>One strong next step</strong><p>Verify After Effects to raise your evidence score and improve alignment with 7 current roles.</p></div>
            <button
              type="button"
              className="pv2-button pv2-button-primary"
              disabled={afterEffectsVerified}
              onClick={() => verifySkill("after-effects")}
            >
              {afterEffectsVerified ? <><Check /> Verified</> : "Verify now"}
            </button>
          </Reveal>
        </div>
      </div>

      {toast && <div className="pv2-toast" role="status"><Check /> {toast}</div>}

      {(editor || selectedPortfolio) && (
        <div className="pv2-dialog-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setEditor(null);
            setSelectedPortfolio(null);
          }
        }}>
          <section ref={dialogRef} className="pv2-dialog" role="dialog" aria-modal="true" aria-labelledby="pv2-dialog-title">
            <header>
              <div><span>{selectedPortfolio ? "Portfolio project" : "Profile editor"}</span><h2 id="pv2-dialog-title">{selectedPortfolio?.title || editorTitle}</h2></div>
              <button type="button" aria-label="Close" onClick={() => { setEditor(null); setSelectedPortfolio(null); }}><X /></button>
            </header>

            {selectedPortfolio ? (
              <div className="pv2-project-detail">
                <img src={selectedPortfolio.image} alt="" width="600" height="280" />
                <span>{selectedPortfolio.type}</span>
                <p>{selectedPortfolio.detail}</p>
                <button type="button" className="pv2-button pv2-button-primary" onClick={() => { setSelectedPortfolio(null); setToast("Project link copied for sharing."); }}>
                  <ExternalLink /> Share project
                </button>
              </div>
            ) : (
              <form onSubmit={submitEditor}>
                {editor === "profile" && (
                  <>
                    <label>Current title<input name="title" defaultValue={profile.title} required /></label>
                    <div className="pv2-form-row">
                      <label>Location<input name="location" defaultValue={profile.location} required /></label>
                      <label>Work mode<select name="workMode" defaultValue={profile.workMode}><option>On-site</option><option>Hybrid</option><option>Remote</option></select></label>
                    </div>
                    <label>About you<textarea name="story" defaultValue={profile.story} rows="5" required /></label>
                  </>
                )}
                {editor === "experience" && (
                  <>
                    <div className="pv2-form-row"><label>Role<input name="role" placeholder="Creative Technology Lead" required /></label><label>Company<input name="company" placeholder="Company name" required /></label></div>
                    <div className="pv2-form-row"><label>Dates<input name="dates" placeholder="Aug 2026 – Present" required /></label><label>Duration<input name="duration" placeholder="Current" required /></label></div>
                    <label>Impact summary<textarea name="summary" rows="4" placeholder="Describe the work and its impact." required /></label>
                  </>
                )}
                {editor === "portfolio" && (
                  <>
                    <label>Project title<input name="title" placeholder="Project name" required /></label>
                    <label>Project type<input name="type" placeholder="Realtime environment" required /></label>
                    <label>Project summary<textarea name="detail" rows="4" placeholder="Explain your contribution and outcome." required /></label>
                  </>
                )}
                {editor === "certificate" && (
                  <>
                    <label>Certificate name<input name="name" placeholder="Certificate name" required /></label>
                    <div className="pv2-form-row"><label>Issuer<input name="issuer" placeholder="Issuer" required /></label><label>Year<input name="year" inputMode="numeric" placeholder="2026" required /></label></div>
                  </>
                )}
                {editor === "education" && (
                  <>
                    <label>School<input name="school" defaultValue={education.school} required /></label>
                    <label>Program<input name="program" defaultValue={education.program} required /></label>
                    <label>Period<input name="period" defaultValue={education.period} required /></label>
                  </>
                )}
                <footer>
                  <button type="button" className="pv2-button pv2-button-secondary" onClick={() => setEditor(null)}>Cancel</button>
                  <button type="submit" className="pv2-button pv2-button-primary"><FileCheck2 /> Save changes</button>
                </footer>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
