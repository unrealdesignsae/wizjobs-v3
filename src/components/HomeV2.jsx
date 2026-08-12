import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CalendarCheck2,
  CircleUserRound,
  Eye,
  FileCheck2,
  FileText,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  UserRoundCheck,
} from "lucide-react";
import { jobs } from "./ExploreJobs";
import "../home-v2.css";
import "../analytics-v2.css";

const HOME_DESTINATIONS = {
  home: "/jobs-dashboard/",
  profile: "/profile-summary/",
  analytics: "/analytics/",
  explore: "/explore-jobs/",
};

/* Same KPI strip as AnalyticsV2 — do not invent a parallel card pattern. */
const metrics = [
  { label: "Search appearances", value: 148, Icon: Search, destination: { route: "analytics" }, detail: "Reach", trend: "+12%" },
  { label: "Profile views", value: 43, Icon: Eye, destination: { route: "analytics" }, detail: "Interest", trend: "+10%" },
  { label: "Recruiter actions", value: 12, Icon: MessageCircle, destination: { hub: "messages" }, detail: "Engagement", trend: "+33%" },
  { label: "Matches", value: 32, Icon: Target, destination: { hub: "daily" }, detail: "Opportunity", trend: "+25%" },
];

const guidedSteps = [
  {
    title: "Add 2 verified skills",
    detail: "Boost your visibility by showing proven skills.",
    action: "Add skills",
    Icon: ShieldCheck,
    destination: { route: "profile" },
  },
  {
    title: "Complete your profile",
    detail: "Profiles with work samples get more recruiter views.",
    action: "Add portfolio",
    Icon: FileText,
    destination: { route: "profile" },
  },
  {
    title: "Apply to 3 new matches",
    detail: "Three strong-fit roles were posted in the last day.",
    action: "View matches",
    Icon: Target,
    destination: { hub: "daily" },
  },
];

const launchCards = [
  {
    eyebrow: "Discover",
    title: "Daily matches",
    detail: "Twelve roles grouped by fit, distance, and urgency.",
    meta: "12 curated roles",
    image: "/assets/editorial/daily-matches.png",
    destination: { hub: "daily" },
    className: "daily",
  },
  {
    eyebrow: "Track",
    title: "Applications",
    detail: "Follow every role from applied through interview and offer.",
    meta: "6 active applications",
    image: "/assets/editorial/applications.png",
    destination: { hub: "applications" },
    className: "applications",
  },
  {
    eyebrow: "Connect",
    title: "Messages",
    detail: "Review recruiter summaries and prepare thoughtful replies.",
    meta: "2 new conversations",
    image: "/assets/editorial/messages.png",
    destination: { hub: "messages" },
    className: "messages",
  },
  {
    eyebrow: "Organize",
    title: "Saved roles",
    detail: "Keep a focused shortlist and return when you are ready.",
    meta: "3 saved roles",
    image: "/assets/editorial/saved.png",
    destination: { hub: "saved" },
    className: "saved",
  },
  {
    eyebrow: "Stay ready",
    title: "Alerts",
    detail: "See interview invites, offers, CV views, and application updates.",
    meta: "4 updates",
    image: "/assets/editorial/alerts.png",
    destination: { hub: "alerts" },
    className: "alerts",
  },
  {
    eyebrow: "Understand",
    title: "Analytics",
    detail: "See visibility, recruiter activity, and opportunity progress.",
    meta: "6 insights updated",
    image: "/assets/editorial/analytics.png",
    destination: { route: "analytics" },
    className: "analytics",
  },
  {
    eyebrow: "Stand out",
    title: "Profile summary",
    detail: "Refine your professional story, skills, and portfolio evidence.",
    meta: "78% profile strength",
    image: "/assets/editorial/profile-summary.png",
    destination: { route: "profile" },
    className: "profile",
  },
];

const activityItems = [
  { label: "Profile views", value: 43, change: "+10%", Icon: Eye, destination: { route: "analytics" } },
  { label: "Search appearances", value: 148, change: "+12%", Icon: Search, destination: { route: "analytics" } },
  { label: "Recruiter actions", value: 12, change: "+33%", Icon: UserRoundCheck, destination: { hub: "messages" } },
  { label: "New matches", value: 32, change: "+25%", Icon: Sparkles, destination: { hub: "daily" } },
];

const sidebarItems = [
  { label: "Daily matches", Icon: Sparkles, count: 12, destination: { hub: "daily" } },
  { label: "Applications", Icon: FileCheck2, count: 6, destination: { hub: "applications" } },
  { label: "Interviews", Icon: CalendarCheck2, count: 2, destination: { hub: "applications" } },
  { label: "Offers", Icon: BriefcaseBusiness, count: 1, destination: { hub: "applications" } },
  { label: "Messages", Icon: MessageCircle, count: 2, destination: { hub: "messages" } },
  { label: "Saved roles", Icon: Bookmark, count: 3, destination: { hub: "saved" } },
  { label: "Alerts", Icon: Bell, count: 4, destination: { hub: "alerts" } },
  { label: "Analytics", Icon: BarChart3, destination: { route: "analytics" } },
  { label: "Profile tools", Icon: CircleUserRound, destination: { route: "profile" } },
];

const reveal = (order) => ({ "--home-v2-order": order });

function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

function AnimatedNumber({ value, delay = 0, suffix = "" }) {
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (reducedMotion) {
      setShown(value);
      return undefined;
    }

    let frame;
    let startedAt;
    const duration = 780;
    const timer = window.setTimeout(() => {
      const update = (now) => {
        if (!startedAt) startedAt = now;
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setShown(Math.round(value * eased));
        if (progress < 1) frame = window.requestAnimationFrame(update);
      };
      frame = window.requestAnimationFrame(update);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [delay, reducedMotion, value]);

  return (
    <>
      <span className="home-v2-number" aria-hidden="true">{shown}{suffix}</span>
      <span className="home-v2-sr-only">{value}{suffix}</span>
    </>
  );
}

function SectionHeading({ eyebrow, title, id, action, onAction }) {
  return (
    <header className="home-v2-section-heading">
      <div>
        <span>{eyebrow}</span>
        <h2 id={id}>{title}</h2>
      </div>
      {action && (
        <button type="button" onClick={onAction}>
          {action}
          <ArrowRight aria-hidden="true" />
        </button>
      )}
    </header>
  );
}

function DestinationCard({ card, order, onOpen }) {
  return (
    <button
      type="button"
      className={`home-v2-launch-card home-v2-reveal ${card.className}`}
      style={reveal(order)}
      onClick={() => onOpen(card.destination)}
      aria-label={`Open ${card.title}`}
    >
      <span className="home-v2-launch-media">
        <img src={card.image} alt="" loading="lazy" />
      </span>
      <span className="home-v2-launch-copy">
        <small>{card.eyebrow}</small>
        <strong>{card.title}</strong>
        <span>{card.detail}</span>
        <b>{card.meta}<ArrowRight aria-hidden="true" /></b>
      </span>
    </button>
  );
}

function RecommendedJob({ job, order, onOpen }) {
  return (
    <article className="home-v2-job-card home-v2-reveal" style={reveal(order)}>
      <img src={job.image} alt="" loading="lazy" />
      <div className="home-v2-job-card-copy">
        <div>
          <span>{job.match}% match</span>
          <small>{job.age} ago</small>
        </div>
        <h3>{job.role}</h3>
        <p>{job.company} · {job.location}</p>
        <div className="home-v2-job-meta">
          <span>{job.mode}</span>
          <span>{job.type}</span>
          <span>{job.salary}</span>
        </div>
        <button type="button" onClick={() => onOpen({ hub: "job", job: job.id })}>
          View job
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export default function HomeV2({ navigate }) {
  const topJobs = useMemo(() => jobs.slice(0, 3), []);

  const openDestination = useCallback((destination) => {
    const scrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (destination?.hub) {
      const url = new URL(HOME_DESTINATIONS.explore, window.location.origin);
      url.searchParams.set("hub", destination.hub);
      if (destination.job) url.searchParams.set("job", String(destination.job));
      if (typeof navigate === "function") navigate("explore");
      window.history.replaceState(
        { hub: destination.hub, job: destination.job },
        "",
        `${url.pathname}${url.search}`,
      );
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo({ top: 0, behavior: scrollBehavior });
      return;
    }

    const route = destination?.route || "home";
    if (typeof navigate === "function") {
      navigate(route);
      window.scrollTo({ top: 0, behavior: scrollBehavior });
      return;
    }

    window.history.pushState({}, "", HOME_DESTINATIONS[route] || HOME_DESTINATIONS.home);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: scrollBehavior });
  }, [navigate]);

  return (
    <main className="home-v2" aria-labelledby="home-v2-title">
      <div className="home-v2-shell">
        <aside className="home-v2-sidebar home-v2-reveal" style={reveal(0)} aria-label="Candidate overview">
          <section className="home-v2-profile-card">
            <img src="/assets/profile-aries-v2.png" alt="Aries Black" />
            <div>
              <h2>Aries Black</h2>
              <p>Technical Art Director</p>
            </div>
            <span className="home-v2-profile-location"><MapPin aria-hidden="true" /> Dubai, UAE</span>
          </section>

          <section className="home-v2-health" aria-label="Profile strength: 78 percent">
            <div className="home-v2-strength-ring" aria-hidden="true">
              <span><strong>78</strong><small>/100</small></span>
            </div>
            <div className="home-v2-strength-copy">
              <span>Profile strength</span>
              <b>Strong</b>
              <p>Keep going. You’re almost at Expert level.</p>
            </div>
            <button type="button" onClick={() => openDestination({ route: "profile" })}>Improve profile</button>
          </section>

          <nav className="home-v2-side-nav" aria-label="Job search shortcuts">
            {sidebarItems.map(({ label, Icon, count, destination }) => (
              <button type="button" key={label} onClick={() => openDestination(destination)}>
                <Icon aria-hidden="true" />
                <span>{label}</span>
                {count != null && <b>{count}</b>}
                <ArrowRight aria-hidden="true" />
              </button>
            ))}
          </nav>
        </aside>

        <div className="home-v2-content">
          <section className="home-v2-welcome home-v2-reveal" style={reveal(1)}>
            <div>
              <span className="home-v2-kicker"><Sparkles aria-hidden="true" /> Your job-search overview</span>
              <h1 id="home-v2-title">Good morning, Aries.</h1>
              <p>Everything important is ready here—matches, applications, recruiter activity, and your next best action.</p>
            </div>
            <time dateTime="2026-08-11">Tuesday, August 11, 2026</time>
          </section>

          <section className="av2-overview-strip" aria-label="Key performance indicators">
            {metrics.map(({ label, value, Icon, destination, detail, trend }, index) => (
              <button
                type="button"
                key={label}
                className="av2-sequence"
                style={{ "--av2-order": index }}
                onClick={() => openDestination(destination)}
              >
                <span><Icon aria-hidden="true" /></span>
                <div>
                  <small>{label}</small>
                  <strong><AnimatedNumber value={value} delay={index * 100 + 180} /></strong>
                  <em>{detail}</em>
                </div>
                <b className={trend.startsWith("-") ? "negative" : "positive"}>
                  {trend.startsWith("-") ? "↓" : "↑"} {trend.replace(/^[+-]/, "")}
                </b>
              </button>
            ))}
          </section>

          <section className="home-v2-hero home-v2-reveal" style={reveal(2)}>
            <div className="home-v2-hero-copy">
              <span><Star aria-hidden="true" /> Today’s best next step</span>
              <h2>Your next opportunity could be a match.</h2>
              <p>We found fresh roles that closely align with your experience in technical art, 3D, and creative technology.</p>
              <div>
                <button type="button" onClick={() => openDestination({ hub: "daily" })}>View daily matches<ArrowRight aria-hidden="true" /></button>
                <button type="button" onClick={() => openDestination({ hub: "explore" })}>Explore the map<MapPin aria-hidden="true" /></button>
              </div>
            </div>
            <div className="home-v2-hero-visual">
              <img src="/assets/editorial/home-opportunity-hero.png" alt="Paper-cut illustration of a professional reviewing job opportunities at a laptop" />
              <button type="button" onClick={() => openDestination({ hub: "job", job: 1 })}>
                <span>Top match</span>
                <strong>Senior 3D Visualizer</strong>
                <small>Northstar Studio · 96% match</small>
              </button>
            </div>
          </section>

          <div className="home-v2-guidance-grid">
            <section className="home-v2-guided home-v2-reveal" style={reveal(9)}>
              <SectionHeading eyebrow="A little progress goes far" title="Your guided next steps" />
              <div className="home-v2-guided-list">
                {guidedSteps.map(({ title, detail, action, Icon, destination }, index) => (
                  <article key={title}>
                    <span><Icon aria-hidden="true" /></span>
                    <div><strong>{title}</strong><p>{detail}</p></div>
                    <button type="button" onClick={() => openDestination(destination)}>{action}<ArrowRight aria-hidden="true" /></button>
                  </article>
                ))}
              </div>
            </section>

            <section className="home-v2-activity home-v2-reveal" style={reveal(10)}>
              <SectionHeading eyebrow="Last 7 days" title="Activity snapshot" action="See analytics" onAction={() => openDestination({ route: "analytics" })} />
              <div>
                {activityItems.map(({ label, value, change, Icon, destination }, index) => (
                  <button type="button" key={label} onClick={() => openDestination(destination)}>
                    <span><Icon aria-hidden="true" /></span>
                    <div><small>{label}</small><strong><AnimatedNumber value={value} delay={1050 + index * 120} /></strong></div>
                    <b>{change}</b>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <section className="home-v2-launchpad home-v2-reveal" style={reveal(11)} aria-labelledby="home-v2-launchpad-title">
            <div>
              <SectionHeading eyebrow="Explore every feature" title="Your WizJobs launchpad" id="home-v2-launchpad-title" />
              <p>Choose a destination to continue exactly where you left off.</p>
            </div>
            <div className="home-v2-launch-grid">
              {launchCards.map((card, index) => (
                <DestinationCard key={card.title} card={card} order={12 + index} onOpen={openDestination} />
              ))}
            </div>
          </section>

          <section className="home-v2-recommended home-v2-reveal" style={reveal(19)} aria-labelledby="home-v2-recommended-title">
            <div>
              <SectionHeading
                eyebrow="Selected for your profile"
                title="Recommended for you"
                id="home-v2-recommended-title"
                action="View all matches"
                onAction={() => openDestination({ hub: "daily" })}
              />
              <p>Strong-fit roles based on your current skills and preferences.</p>
            </div>
            <div className="home-v2-job-grid">
              {topJobs.map((job, index) => (
                <RecommendedJob key={job.id} job={job} order={20 + index} onOpen={openDestination} />
              ))}
            </div>
          </section>

          <section className="home-v2-footer-cta home-v2-reveal" style={reveal(23)}>
            <div><Activity aria-hidden="true" /><span><strong>Ready for the next step?</strong><small>Review your visibility trends and turn insight into action.</small></span></div>
            <button type="button" onClick={() => openDestination({ route: "analytics" })}>Open analytics<ArrowRight aria-hidden="true" /></button>
          </section>
        </div>
      </div>
    </main>
  );
}
