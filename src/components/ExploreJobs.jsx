import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../hub-v2-polish.css";
import {
  AlertCircle, Archive, ArrowLeft, ArrowUpRight, Bell, Bookmark, BriefcaseBusiness,
  CalendarClock, CheckCircle2, ChevronDown, ChevronRight, Clock3, FileText, Filter,
  HelpCircle, Inbox, LayoutGrid, ListFilter, MapPin, MessageCircle, MoreHorizontal,
  Menu, Paperclip, RotateCcw, Search, Send, Settings, SlidersHorizontal, Smile, Sparkles,
  Star, Tag, X,
} from "lucide-react";

export const jobs = [
  { id: 1, role: "Senior 3D Visualizer", company: "Northstar Studio", location: "Dubai Design District", salary: "AED 18–22K", mode: "On-site", type: "Full-time", match: 96, age: "18 min", initials: "NS", logo: "/assets/job-people/01.jpg", image: "/assets/hub-jobs/job-01.png", lat: 25.2227, lng: 55.2840 },
  { id: 2, role: "Technical Art Director", company: "Pixel Forge", location: "Business Bay", salary: "AED 24–29K", mode: "Hybrid", type: "Full-time", match: 93, age: "42 min", initials: "PF", logo: "/assets/job-people/02.jpg", image: "/assets/hub-jobs/job-02.png", lat: 25.1860, lng: 55.2630 },
  { id: 3, role: "Unreal Engine Artist", company: "Frame Lab", location: "Dubai Media City", salary: "AED 15–19K", mode: "Hybrid", type: "Contract", match: 89, age: "1 hr", initials: "FL", logo: "/assets/job-people/03.jpg", image: "/assets/hub-jobs/job-03.png", lat: 25.0950, lng: 55.1570 },
  { id: 4, role: "Experiential Designer", company: "Mosaic Events", location: "Al Quoz", salary: "AED 16–20K", mode: "On-site", type: "Full-time", match: 87, age: "2 hrs", initials: "ME", logo: "/assets/job-people/04.jpg", image: "/assets/hub-jobs/job-04.png", lat: 25.1420, lng: 55.2220 },
  { id: 5, role: "Creative Technology Lead", company: "Future Works", location: "DIFC", salary: "AED 26–32K", mode: "Remote", type: "Full-time", match: 84, age: "Today", initials: "FW", logo: "/assets/job-people/05.jpg", image: "/assets/hub-jobs/job-05.png", lat: 25.2110, lng: 55.2790 },
  { id: 6, role: "Motion Design Specialist", company: "Blue Orbit", location: "JLT", salary: "AED 13–17K", mode: "Remote", type: "Part-time", match: 81, age: "Today", initials: "BO", logo: "/assets/job-people/06.jpg", image: "/assets/hub-jobs/job-06.png", lat: 25.0690, lng: 55.1420 },
  { id: 7, role: "Digital Experience Designer", company: "Northstar Studio", location: "Downtown Dubai", salary: "AED 17–21K", mode: "Hybrid", type: "Full-time", match: 91, age: "Today", initials: "NS", logo: "/assets/job-people/01.jpg", image: "/assets/hub-jobs/job-07.png", lat: 25.1972, lng: 55.2744 },
  { id: 8, role: "Realtime VFX Artist", company: "Pixel Forge", location: "Dubai Internet City", salary: "AED 14–18K", mode: "On-site", type: "Full-time", match: 88, age: "Today", initials: "PF", logo: "/assets/job-people/02.jpg", image: "/assets/hub-jobs/job-08.png", lat: 25.1020, lng: 55.1690 },
  { id: 9, role: "Creative Producer", company: "Frame Lab", location: "Dubai Hills", salary: "AED 16–20K", mode: "Hybrid", type: "Contract", match: 85, age: "Yesterday", initials: "FL", logo: "/assets/job-people/03.jpg", image: "/assets/hub-jobs/job-09.png", lat: 25.1120, lng: 55.2450 },
  { id: 10, role: "Immersive Media Lead", company: "Mosaic Events", location: "Expo City Dubai", salary: "AED 22–27K", mode: "On-site", type: "Full-time", match: 83, age: "Yesterday", initials: "ME", logo: "/assets/job-people/04.jpg", image: "/assets/hub-jobs/job-10.png", lat: 24.9580, lng: 55.1500 },
  { id: 11, role: "Brand Motion Director", company: "Future Works", location: "Dubai Creek Harbour", salary: "AED 23–28K", mode: "Remote", type: "Full-time", match: 80, age: "2 days", initials: "FW", logo: "/assets/job-people/05.jpg", image: "/assets/hub-jobs/job-11.png", lat: 25.2050, lng: 55.3450 },
  { id: 12, role: "3D Generalist", company: "Blue Orbit", location: "Deira", salary: "AED 12–16K", mode: "On-site", type: "Part-time", match: 78, age: "2 days", initials: "BO", logo: "/assets/job-people/06.jpg", image: "/assets/hub-jobs/job-12.png", lat: 25.2720, lng: 55.3100 },
];

const messages = [
  { company: "Pixel Forge", person: "Maya — Talent Partner", image: "/assets/hub-people/maya.png", text: "Your portfolio feels aligned with our real-time work.", summary: "Maya reviewed your portfolio and invited you to discuss the Technical Art Director role.", nextAction: "Reply with availability", category: "Follow-up", time: "09:42", unread: true },
  { company: "Northstar Studio", person: "Daniel — Creative Director", image: "/assets/hub-people/daniel.png", text: "Could you share availability for a short call?", summary: "Daniel wants to schedule a 20-minute introductory call this week.", nextAction: "Choose interview time", category: "Interview", time: "Yesterday", unread: true },
  { company: "Frame Lab", person: "Recruitment Team", image: "/assets/hub-people/recruiter.png", text: "Thanks for applying. We’re reviewing your profile.", summary: "Your application is under review; no action is required right now.", nextAction: "Remind me Friday", category: "Application", time: "Mon", unread: false },
];

const EMOJI_SETS = {
  Faces: ["\u{1F642}", "\u{1F60A}", "\u{1F604}", "\u{1F606}", "\u{1F602}", "\u{1F929}", "\u{1F60D}", "\u{1F914}", "\u{1F973}", "\u{1F60C}", "\u{1F917}", "\u{1F609}"],
  Work: ["\u{1F4BC}", "\u{1F4C5}", "\u{1F4CE}", "\u{1F4C4}", "\u{1F4CA}", "\u{1F4C8}", "\u{1F4A1}", "\u{1F3AF}", "\u{1F680}", "\u{1F4BB}", "\u{1F4DD}", "\u{1F50D}"],
  Actions: ["\u{1F91D}", "\u{1F44D}", "\u{1F44F}", "\u{1F64C}", "\u{1F64F}", "\u{1F44B}", "\u{1F4AA}", "\u{1F389}", "\u{1F525}", "\u{2705}", "\u{1F4AC}", "\u{1F514}"],
  Symbols: ["\u{2728}", "\u{2B50}", "\u{1F499}", "\u{1F49A}", "\u{1F7E2}", "\u{1F535}", "\u{1F4CD}", "\u{23F0}", "\u{1F3C6}", "\u{1F3A8}", "\u{1F4AB}", "\u{1F31F}"],
};

function JobAvatar({ job, small = false, photo = false }) {
  return <span className={`job-avatar ${small ? "small" : ""} ${photo ? "photo" : ""}`}><img src={photo ? job.image : job.logo} alt="" /></span>;
}

function JobCard({ job, selected, saved, onSelect, onSave }) {
  return (
    <article className={`map-job-card ${selected ? "selected" : ""}`} onClick={() => onSelect(job)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(job); } }} role="button" tabIndex="0" aria-label={`View ${job.role} at ${job.company}`}>
      <JobAvatar job={job} photo />
      <div className="map-job-copy">
        <div><strong>{job.role}</strong><span>{job.match}% match</span></div>
        <p>{job.company} · {job.location}</p>
        <small>{job.mode} · {job.type} · {job.age}</small>
      </div>
      <button type="button" className={saved ? "saved" : ""} onClick={(event) => { event.stopPropagation(); onSave(job.id, job); }} aria-label={saved ? "Remove saved job" : "Save job"}><Bookmark /></button>
    </article>
  );
}

const jobCities = [
  { id: "dubai", name: "Dubai", country: "United Arab Emirates", count: 128, lat: 25.19, lng: 55.255, zoom: 11 },
  { id: "london", name: "London", country: "United Kingdom", count: 84, lat: 51.5072, lng: -0.1276, zoom: 11 },
  { id: "new-york", name: "New York", country: "United States", count: 76, lat: 40.7128, lng: -74.006, zoom: 11 },
  { id: "singapore", name: "Singapore", country: "Singapore", count: 63, lat: 1.3521, lng: 103.8198, zoom: 11 },
  { id: "berlin", name: "Berlin", country: "Germany", count: 51, lat: 52.52, lng: 13.405, zoom: 11 },
  { id: "toronto", name: "Toronto", country: "Canada", count: 47, lat: 43.6532, lng: -79.3832, zoom: 11 },
  { id: "sydney", name: "Sydney", country: "Australia", count: 42, lat: -33.8688, lng: 151.2093, zoom: 11 },
  { id: "riyadh", name: "Riyadh", country: "Saudi Arabia", count: 36, lat: 24.7136, lng: 46.6753, zoom: 11 },
];
const cityOffsets = [[.018,.012],[-.012,.018],[.007,-.02],[-.02,-.008],[.026,-.015],[-.028,.016],[.014,.028],[-.01,-.03],[.032,.004],[-.034,-.004],[.022,.035],[-.024,-.036]];
const jobsForCity = (city) => jobs.map((job, index) => ({
  ...job,
  cityId: city.id,
  id: city.id === "dubai" ? job.id : ((jobCities.indexOf(city) + 1) * 100) + job.id,
  location: city.id === "dubai" ? job.location : `${city.name} creative district`,
  lat: city.id === "dubai" ? job.lat : city.lat + cityOffsets[index][0],
  lng: city.id === "dubai" ? job.lng : city.lng + cityOffsets[index][1],
}));

function DubaiJobMap({ selectedJob, setSelectedJob, openJob, onNotify }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const jobLayerRef = useRef(null);
  const cityLayerRef = useRef(null);
  const activeJobsRef = useRef(jobs);
  const [mapMode, setMapMode] = useState("city");
  const [selectedCity, setSelectedCity] = useState(() => jobCities.find((city) => city.id === selectedJob?.cityId) || jobCities[0]);
  const [visibleJobs, setVisibleJobs] = useState(jobs.slice(0, 5));
  const [query, setQuery] = useState("");
  const [utilityPanel, setUtilityPanel] = useState("");
  const [highMatchesOnly, setHighMatchesOnly] = useState(false);
  const cityJobs = useMemo(() => jobsForCity(selectedCity), [selectedCity]);
  const filteredCityJobs = useMemo(() => cityJobs.filter((job) => `${job.role} ${job.company} ${job.location}`.toLowerCase().includes(query.toLowerCase())).filter((job) => !highMatchesOnly || job.match >= 90), [cityJobs, highMatchesOnly, query]);
  const shownJobs = visibleJobs.filter((job) => `${job.role} ${job.company} ${job.location}`.toLowerCase().includes(query.toLowerCase())).filter((job) => !highMatchesOnly || job.match >= 90).slice(0, 5);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;
    const map = L.map(containerRef.current, { zoomControl: false, minZoom: 2, maxZoom: 15, worldCopyJump: true }).setView([25.19, 55.255], 11);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap &copy; CARTO",
      maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: "bottomleft" }).addTo(map);
    jobLayerRef.current = L.layerGroup().addTo(map);
    cityLayerRef.current = L.layerGroup().addTo(map);
    const updateVisible = () => {
      const bounds = map.getBounds().pad(-0.04);
      const center = map.getCenter();
      const activeJobs = activeJobsRef.current;
      const ranked = activeJobs
        .filter((job) => bounds.contains([job.lat, job.lng]))
        .sort((a, b) => center.distanceTo([a.lat, a.lng]) - center.distanceTo([b.lat, b.lng]));
      const fallback = [...activeJobs].sort((a, b) => center.distanceTo([a.lat, a.lng]) - center.distanceTo([b.lat, b.lng]));
      setVisibleJobs((ranked.length ? ranked : fallback).slice(0, 6));
    };
    map.on("moveend zoomend", updateVisible);
    updateVisible();
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, [openJob]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !jobLayerRef.current || !cityLayerRef.current) return;
    jobLayerRef.current.clearLayers();
    cityLayerRef.current.clearLayers();
    if (mapMode === "world") {
      activeJobsRef.current = [];
      setVisibleJobs([]);
      jobCities.filter((city) => `${city.name} ${city.country}`.toLowerCase().includes(query.toLowerCase())).forEach((city, index) => {
        const icon = L.divIcon({ className: "world-city-marker", html: `<span>${city.count}</span><strong>${city.name}</strong>`, iconSize: [88, 50], iconAnchor: [44, 25] });
        const marker = L.marker([city.lat, city.lng], { icon }).addTo(cityLayerRef.current).on("click", () => { setSelectedCity(city); setMapMode("city"); setUtilityPanel(""); onNotify(`Exploring ${city.count} mock opportunities in ${city.name}.`); });
        marker.getElement()?.style.setProperty("--marker-index", index);
      });
      return;
    }
    activeJobsRef.current = filteredCityJobs;
    setVisibleJobs(filteredCityJobs.slice(0, 6));
    filteredCityJobs.forEach((job, index) => {
      const icon = L.divIcon({ className: "company-map-marker", html: `<img src="${job.logo}" alt=""><span>${job.match}%</span>`, iconSize: [54, 42], iconAnchor: [21, 21] });
      const marker = L.marker([job.lat, job.lng], { icon }).addTo(jobLayerRef.current).on("click", () => openJob(job));
      marker.getElement()?.style.setProperty("--marker-index", index);
    });
  }, [filteredCityJobs, mapMode, onNotify, openJob, query]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (mapMode === "world") map.setView([20, 16], 2, { animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches, duration: .6 });
    else map.setView([selectedCity.lat, selectedCity.lng], selectedCity.zoom, { animate: true, duration: .55 });
  }, [mapMode, selectedCity]);

  useEffect(() => {
    const jobCity = selectedJob?.cityId || "dubai";
    if (mapMode === "city" && mapRef.current && selectedJob && jobCity === selectedCity.id) mapRef.current.panTo([selectedJob.lat, selectedJob.lng], { animate: true, duration: .45 });
  }, [mapMode, selectedCity, selectedJob]);

  return (
      <section className="jobs-map-panel reference-map" aria-label="Interactive job map of Dubai" data-tour="map">
      <div ref={containerRef} className="dubai-leaflet-map" />
      <div className="map-search-bar">
        <label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label={mapMode === "world" ? "Search cities or countries" : "Search jobs, skills or companies"} placeholder={mapMode === "world" ? "Search cities or countries" : "Search jobs, skills or companies"} /></label>
        <button type="button" aria-label="Notifications" aria-expanded={utilityPanel === "notifications"} onClick={() => setUtilityPanel((value) => value === "notifications" ? "" : "notifications")}><Bell /></button>
        <button type="button" aria-label="Map settings" aria-expanded={utilityPanel === "settings"} onClick={() => setUtilityPanel((value) => value === "settings" ? "" : "settings")}><Settings /></button>
        <button type="button" className="map-account-avatar" aria-label="Open account menu" aria-expanded={utilityPanel === "account"} onClick={() => setUtilityPanel((value) => value === "account" ? "" : "account")}><img src="/assets/profile-aries-v2.png" alt="Aries Black" /></button>
      </div>
      <div className="map-toolbar"><button type="button" aria-expanded={utilityPanel === "city"} onClick={() => setUtilityPanel((value) => value === "city" ? "" : "city")}><MapPin /><span><small>{mapMode === "world" ? "World job map" : "Searching near"}</small>{mapMode === "world" ? "Choose country or city" : `${selectedCity.name}, ${selectedCity.country}`}</span><ChevronDown /></button></div>
      {utilityPanel && <aside className={`map-utility-panel ${utilityPanel}`}>
        <header><strong>{utilityPanel === "notifications" ? "Job alerts" : utilityPanel === "settings" ? "Map preferences" : utilityPanel === "city" ? "Choose country or city" : "Aries Black"}</strong><button type="button" onClick={() => setUtilityPanel("")} aria-label="Close panel"><X /></button></header>
        {utilityPanel === "notifications" && <div className="map-alert-list"><button type="button" onClick={() => openJob(jobs[0])}><span><Sparkles /></span><div><strong>New 96% match nearby</strong><small>Senior 3D Visualizer · 18 min ago</small></div><ChevronRight /></button><button type="button" onClick={() => openJob(jobs[1])}><span><Bell /></span><div><strong>Pixel Forge posted a role</strong><small>Technical Art Director · 42 min ago</small></div><ChevronRight /></button></div>}
        {utilityPanel === "settings" && <div className="map-preferences"><label><span><strong>High matches only</strong><small>Show roles scoring 90% or above</small></span><input type="checkbox" checked={highMatchesOnly} onChange={(event) => setHighMatchesOnly(event.target.checked)} /></label><button type="button" onClick={() => { setHighMatchesOnly(false); setQuery(""); onNotify("Map filters reset."); }}>Reset map filters</button></div>}
        {utilityPanel === "city" && <div className="city-picker"><div className="map-scope-toggle"><button type="button" className={mapMode === "world" ? "active" : ""} onClick={() => { setMapMode("world"); setUtilityPanel(""); setQuery(""); }}>World map</button><button type="button" className={mapMode === "city" ? "active" : ""} onClick={() => { setMapMode("city"); setUtilityPanel(""); }}>City view</button></div><div className="city-list">{jobCities.map((city) => <button type="button" key={city.id} className={mapMode === "city" && selectedCity.id === city.id ? "active" : ""} onClick={() => { setSelectedCity(city); setMapMode("city"); setUtilityPanel(""); setQuery(""); onNotify(`Now exploring ${city.name}.`); }}><span><strong>{city.name}</strong><small>{city.country}</small></span><b>{city.count} posts</b><ChevronRight /></button>)}</div></div>}
        {utilityPanel === "account" && <div className="map-account-menu"><div><img src="/assets/profile-aries-v2.png" alt="" /><span><strong>Aries Black</strong><small>Technical Art Director</small></span></div><button type="button" onClick={() => onNotify("Profile Summary is available from the main navigation.")}>View profile summary <ChevronRight /></button><button type="button" onClick={() => onNotify("Account preferences are available from Settings.")}>Account preferences <ChevronRight /></button></div>}
      </aside>}
      <div className="map-job-rail">
        {mapMode === "city" && shownJobs.map((job) => <button type="button" key={job.id} className={selectedJob.id === job.id ? "active" : ""} onClick={() => openJob(job)}><JobAvatar job={job} photo /><span><strong>{job.role}</strong><span>{job.company}</span><small>{job.mode} · {job.type}</small></span><b>{job.match}%</b></button>)}
        {mapMode === "city" && !shownJobs.length && <p>No visible jobs match that search.</p>}
        {mapMode === "world" && <div className="world-map-caption"><strong>Explore creative work worldwide</strong><span>Select a city marker to open its local job map.</span></div>}
      </div>
    </section>
  );
}

function ExploreView({ selectedJob, setSelectedJob, saved, toggleSaved, setView, openJob, onNotify, applicationsCount }) {
  const hiringCompanies = [...new Map(jobs.map((job) => [job.company, job])).values()];
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredPaused, setFeaturedPaused] = useState(false);
  const featuredJobs = jobs.slice(0, 6);
  const featuredJob = featuredJobs[featuredIndex % featuredJobs.length];
  useEffect(() => {
    if (featuredPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => setFeaturedIndex((index) => (index + 1) % featuredJobs.length), 3000);
    return () => window.clearInterval(timer);
  }, [featuredJobs.length, featuredPaused]);
  return (
    <div className="jobs-explore-layout reference-layout">
      <section className="jobs-discovery-panel reference-discovery">
        <div className="jobs-intro reference-intro">
          <h1>Let’s find your<br />perfect match.</h1>
        </div>
        <div className="discovery-card-grid">
          <button type="button" className="discovery-card wide applications-card" data-tour="applications-card" onClick={() => setView("applications")}><span className="discovery-copy"><strong>Applications</strong><small>{applicationsCount} active applications</small></span></button>
          <button type="button" className="discovery-card daily-card" data-tour="daily-card" onClick={() => setView("daily")}><span className="discovery-copy"><strong>Daily matches</strong><small>12 curated roles</small></span></button>
          <button type="button" className="discovery-card messages-card" data-tour="messages-card" onClick={() => setView("messages")}><span className="discovery-copy"><strong>Messages</strong><small>2 new conversations</small></span></button>
        </div>
        <div className="hiring-companies">
          <div><strong>Companies hiring</strong></div>
          <div>{hiringCompanies.map((job) => <button type="button" key={job.company} onClick={() => { setSelectedJob(job); const index = featuredJobs.findIndex((item) => item.company === job.company); if (index >= 0) setFeaturedIndex(index); }} className={selectedJob.company === job.company ? "active" : ""} aria-label={`Show jobs from ${job.company}`} title={job.company}><JobAvatar job={job} small /></button>)}</div>
        </div>
        <div className="featured-role-wrap" onMouseEnter={() => setFeaturedPaused(true)} onMouseLeave={() => setFeaturedPaused(false)}>
          <article className="featured-role-card" key={featuredJob.id} style={{ backgroundImage: `url(${featuredJob.image})` }} aria-live="polite">
            <span className="featured-role-badge">Featured role <b>{featuredIndex + 1}/{featuredJobs.length}</b></span>
            <button type="button" className={saved.has(featuredJob.id) ? "saved" : ""} onClick={() => toggleSaved(featuredJob.id, featuredJob)} aria-label={saved.has(featuredJob.id) ? "Remove saved job" : "Save job"}><Bookmark /></button>
            <JobAvatar job={featuredJob} />
            <strong>{featuredJob.company}</strong>
            <span>{featuredJob.role}</span>
            <p>{featuredJob.location}</p>
            <div>
              <small>{featuredJob.match}% match</small>
              <small>{featuredJob.mode}</small>
              <small>{featuredJob.type}</small>
              <small>{featuredJob.salary}</small>
            </div>
            <button type="button" onClick={() => openJob(featuredJob)}>View job <ArrowUpRight /></button>
          </article>
          <div className="featured-role-dots" aria-label="Featured role slides">{featuredJobs.map((job, index) => <button type="button" key={job.id} className={featuredIndex === index ? "active" : ""} onClick={() => setFeaturedIndex(index)} aria-label={`Show featured role ${index + 1}: ${job.role}`} />)}</div>
        </div>
      </section>

      <DubaiJobMap selectedJob={selectedJob} setSelectedJob={setSelectedJob} openJob={openJob} onNotify={onNotify} />
    </div>
  );
}

function ApplicationsView({ applications, allJobs, openJob, onNotify }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [stageFilter, setStageFilter] = useState("All");
  const stages = [
    { name: "Applied", Icon: CheckCircle2, items: allJobs.filter((job) => applications.get(job.id) === "Applied") },
    { name: "Interview", Icon: MessageCircle, items: allJobs.filter((job) => applications.get(job.id) === "Interview") },
    { name: "Offer", Icon: BriefcaseBusiness, items: allJobs.filter((job) => applications.get(job.id) === "Offer") },
  ];
  const visibleStages = stageFilter === "All" ? stages : stages.filter((stage) => stage.name === stageFilter);
  return <section className="jobs-inner-view applications-view"><header><div><span>Application tracker</span><h1>Keep every opportunity moving.</h1></div><div className="application-filter-wrap"><button type="button" className={filterOpen ? "active" : ""} onClick={() => setFilterOpen((value) => !value)}><Filter /> {stageFilter === "All" ? "Filter" : stageFilter}</button>{filterOpen && <div className="application-filter-menu" role="menu" aria-label="Filter applications by stage">{["All", "Applied", "Interview", "Offer"].map((item) => <button type="button" role="menuitem" className={stageFilter === item ? "active" : ""} key={item} onClick={() => { setStageFilter(item); setFilterOpen(false); onNotify(item === "All" ? "Showing every application stage." : `Showing ${item.toLowerCase()} applications.`); }}>{item}<span>{item === "All" ? applications.size : stages.find((stage) => stage.name === item)?.items.length}</span></button>)}</div>}</div></header><div className={`application-board ${stageFilter !== "All" ? "filtered" : ""}`}>{visibleStages.map(({ name, Icon, items }) => <div className={`application-stage stage-${name.toLowerCase()}`} key={name}><div className="stage-heading"><div><span className="stage-icon"><Icon /></span><strong>{name}</strong></div><span>{items.length}</span></div>{items.map((job) => <article key={job.id}><div><JobAvatar job={job} small /><span><strong>{job.role}</strong><small>{job.company}</small></span></div><p><Clock3 /> Updated {job.age}</p><button type="button" onClick={() => openJob(job)}>Open application <ChevronRight /></button></article>)}</div>)}</div></section>;
}

function DailyMatchesView({ selectedJob, saved, toggleSaved, goExplore, openJob }) {
  const [activeGroups, setActiveGroups] = useState(() => new Set());
  const groups = [
    { title: "Best fit", description: "Highest profile match", Icon: Sparkles, items: [jobs[0], jobs[1], jobs[6], jobs[2]] },
    { title: "Near you", description: "Closest to central Dubai", Icon: MapPin, items: [jobs[3], jobs[4], jobs[8], jobs[10]] },
    { title: "Time-sensitive", description: "Fresh roles worth acting on", Icon: CalendarClock, items: [jobs[5], jobs[7], jobs[9], jobs[11]] },
  ];
  const toggleGroup = (title) => setActiveGroups((current) => { const next = new Set(current); next.has(title) ? next.delete(title) : next.add(title); return next; });
  const visibleGroups = activeGroups.size ? groups.filter((group) => activeGroups.has(group.title)) : groups;
  return (
    <section className="jobs-inner-view daily-matches-view">
      <header><div><span>Fresh matches for your profile</span><h1>Today’s job matches</h1></div><button type="button" onClick={goExplore}><MapPin /> Back to map</button></header>
      <div className="match-filter-bar"><div><Filter /><span><strong>Filter match groups</strong><small>Select one or combine several categories.</small></span></div><button type="button" className={!activeGroups.size ? "active" : ""} onClick={() => setActiveGroups(new Set())}>Show all</button></div>
      <div className="match-category-summary">{groups.map(({ title, description, Icon, items }) => <button type="button" className={activeGroups.has(title) ? "active" : ""} aria-pressed={activeGroups.has(title)} onClick={() => toggleGroup(title)} key={title}><Icon /><span><strong>{title}</strong><small>{items.length} roles · {description}</small></span><CheckCircle2 /></button>)}</div>
      <div className="daily-match-sections">{visibleGroups.map(({ title, description, Icon, items }) => <section id={`match-${title.toLowerCase().replaceAll(" ", "-")}`} key={title}><header><span><Icon /></span><div><h2>{title}</h2><p>{description}</p></div><b>{items.length}</b></header><div className="daily-matches-grid">{items.map((job) => <JobCard key={job.id} job={job} selected={selectedJob.id === job.id} saved={saved.has(job.id)} onSave={toggleSaved} onSelect={openJob} />)}</div></section>)}</div>
    </section>
  );
}

const hiringStageNames = ["Profile review", "Intro call", "Portfolio conversation", "Final decision"];
const hiringStageDurations = ["2–3 business days", "20 minutes", "45 minutes", "Within one week"];

function hiringScheduleFor(job) {
  const numericId = Number(job.id) || 1;
  const currentStage = (numericId - 1) % hiringStageNames.length;
  const baseDay = 12 + ((numericId * 2) % 9);
  const offsets = [0, 3, 7, 13];
  const formatDate = (offset) => new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(2026, 7, baseDay + offset));
  return {
    currentStage,
    steps: hiringStageNames.map((name, index) => ({
      name,
      duration: hiringStageDurations[index],
      date: formatDate(offsets[index]),
      state: index < currentStage ? "complete" : index === currentStage ? "current" : "upcoming",
    })),
  };
}

function JobDetailView({ job, saved, toggleSaved, applied, toggleApplied, onBack }) {
  const schedule = hiringScheduleFor(job);
  return (
    <section className="jobs-inner-view job-detail-view">
      <header><div><span>Opportunity details</span><h1>{job.role}</h1></div><button type="button" onClick={onBack}><ArrowLeft /> Back</button></header>
      <div className="job-detail-layout">
        <div className="job-detail-main">
          <div className="job-detail-hero-wrap"><img className="job-detail-hero" src={job.image} alt={`${job.role} workplace`} /><span>{job.mode}</span></div>
          <div className="job-detail-heading"><JobAvatar job={job} /><div><span>{job.match}% profile match</span><h2>{job.role}</h2><p>{job.company} · {job.location}</p></div><button type="button" onClick={() => toggleSaved(job.id, job)} aria-label={saved ? "Remove saved job" : "Save job"}><Bookmark /></button></div>
          <div className="job-quick-facts"><div><strong>3–5 years</strong><span>Experience</span></div><div><strong>7 people</strong><span>Creative team</span></div><div><strong>72</strong><span>Applicants</span></div><div><strong>Portfolio</strong><span>Required</span></div></div>
          <section><h3>About the role</h3><p>Join {job.company} to shape ambitious creative-technology work in {job.location}. You’ll collaborate with design, production, and engineering partners to turn strong ideas into polished experiences for regional and international clients.</p><p>This is a {job.type.toLowerCase()} {job.mode.toLowerCase()} position with room to influence both the creative output and the team’s day-to-day workflow.</p></section>
          <section><h3>What you’ll do</h3><ul><li>Own high-quality {job.role.toLowerCase()} work from early concept through final delivery.</li><li>Translate briefs and references into clear visual directions, prototypes, and production-ready work.</li><li>Partner with cross-functional teams and communicate creative decisions clearly.</li><li>Present work to stakeholders, respond to feedback, and protect the core idea.</li><li>Improve creative workflows while maintaining a strong craft and documentation standard.</li></ul></section>
          <section><h3>What we’re looking for</h3><ul><li>A strong portfolio showing relevant professional projects and your contribution to each.</li><li>3+ years of hands-on experience in a fast-moving studio, agency, or product environment.</li><li>Confident written and verbal communication in English.</li><li>Comfort balancing independent craft with close team collaboration.</li></ul></section>
          <section><h3>Skills that stand out</h3><div className="job-skill-tags"><span>Creative technology</span><span>Collaboration</span><span>Production craft</span><span>Portfolio storytelling</span><span>Client presentation</span><span>Realtime workflows</span></div></section>
          <section><h3>Benefits</h3><div className="job-benefits"><span>Flexible working</span><span>Annual learning budget</span><span>Health coverage</span><span>Creative tools allowance</span></div></section>
          <section className="hiring-process-section"><div className="hiring-process-heading"><div><h3>Hiring process</h3><p>Mock timeline · Current stage: <strong>{hiringStageNames[schedule.currentStage]}</strong></p></div><span>{schedule.currentStage + 1} of 4</span></div><ol className="hiring-steps">{schedule.steps.map((step, index) => <li className={step.state} key={step.name}><span>{step.state === "complete" ? <CheckCircle2 /> : index + 1}</span><div><strong>{step.name}</strong><small>{step.date}</small><em>{step.duration}</em></div></li>)}</ol></section>
        </div>
        <aside className="job-detail-summary">
          <div className="match-score"><strong>{job.match}%</strong><span>Profile match</span></div>
          <dl><div><dt>Salary</dt><dd>{job.salary}</dd></div><div><dt>Work mode</dt><dd>{job.mode}</dd></div><div><dt>Employment</dt><dd>{job.type}</dd></div><div><dt>Posted</dt><dd>{job.age}</dd></div></dl>
          <p className={`application-status ${applied ? "applied" : ""}`}><CheckCircle2 />{applied ? "Application submitted" : "Ready to apply"}</p>
          <button type="button" className="primary" onClick={() => toggleApplied(job.id)}>{applied ? "Withdraw application" : "Apply now"}</button>
          <button type="button" onClick={() => toggleSaved(job.id, job)}><Bookmark />{saved ? "Saved" : "Save job"}</button>
          <div className="job-detail-company"><JobAvatar job={job} /><div><strong>{job.company}</strong><span>Creative technology studio</span></div></div>
          <small>Mock opportunity · Application data is for prototype demonstration.</small>
        </aside>
      </div>
    </section>
  );
}

function MessagesView({ conversations, setConversations, openJob, onNotify }) {
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [sentMessages, setSentMessages] = useState({});
  const [attached, setAttached] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState("Faces");
  const relatedJob = jobs.find((job) => job.company === conversations[active].company) || jobs[0];
  const filtered = conversations.map((message, index) => ({ ...message, index }))
    .filter((message) => filter === "All" || (filter === "Unread" && message.unread) || message.category === filter)
    .filter((message) => `${message.person} ${message.company} ${message.text}`.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    if (filtered.length && !filtered.some((message) => message.index === active)) setActive(filtered[0].index);
  }, [active, filter, query]);
  const generateReply = (tone = "Professional") => {
    const replies = {
      Professional: "Thanks for reaching out. I’m available this week and would be glad to discuss the role and share relevant work.",
      Shorter: "Thanks, I’m available this week and happy to discuss the role.",
      Friendly: "Thanks so much for reaching out! I’d love to chat and can share a few relevant projects.",
      "Follow-up": "Hi, I wanted to follow up and confirm whether you need anything else from me before the next step.",
    };
    setDraft(replies[tone]);
    setAiOpen(false);
  };
  const sendMessage = (event) => {
    event.preventDefault();
    const clean = draft.trim();
    if (!clean && !attached) return;
    setSentMessages((items) => ({ ...items, [active]: [...(items[active] || []), clean || "Portfolio.pdf"] }));
    setDraft("");
    setAttached(false);
  };
  return (
    <section className="jobs-inner-view messages-view">
      <header><div><h1>Recruiter messages</h1><p>Keep every hiring conversation and next step in one place.</p></div><label className="message-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search conversations" aria-label="Search conversations" /></label></header>
      <div className="message-action-strip"><span><AlertCircle /></span><div><strong>Two conversations need your attention</strong><small>Daniel is waiting for interview availability; Maya asked for relevant portfolio work.</small></div><button type="button" onClick={() => setFilter("Unread")}>Review unread</button></div>
      <div className="message-filter-row" aria-label="Message filters">{["All", "Unread", "Interview", "Follow-up"].map((item) => <button type="button" key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item === "All" ? <Inbox /> : item === "Unread" ? <Bell /> : item === "Interview" ? <CalendarClock /> : <RotateCcw />}{item}</button>)}</div>
      <div className="messages-layout">
        <div className="conversation-list">{filtered.map((message) => <button type="button" key={message.company} className={active === message.index ? "active" : ""} onClick={() => { setActive(message.index); setConversations((items) => items.map((item, index) => index === message.index ? { ...item, unread: false } : item)); }}><img className="message-person-avatar" src={message.image} alt={`${message.person} portrait`} /><span><strong>{message.person}</strong><small>{message.text}</small><em>{message.category}</em></span><time>{message.time}</time>{message.unread && <i />}</button>)}{!filtered.length && <div className="message-empty"><Search /><strong>No conversations found</strong><small>Try another filter or search term.</small></div>}</div>
        <div className="conversation-panel">
          <div className="conversation-person"><img className="message-person-avatar" src={conversations[active].image} alt={`${conversations[active].person} portrait`} /><div><strong>{conversations[active].person}</strong><small>{conversations[active].company} · Usually replies within a day</small></div><button type="button" onClick={() => openJob(relatedJob)}><BriefcaseBusiness /> View job</button><button type="button" aria-label="More conversation options" onClick={() => onNotify("Conversation options: mute, mark unread, archive, or report.")}><MoreHorizontal /></button></div>
          <div className="ai-summary-bar"><div><strong>Summary</strong><ul><li>{conversations[active].summary}</li><li>Suggested next step: {conversations[active].nextAction}</li></ul><div className="summary-replies"><span>Suggested replies</span><button type="button" onClick={() => generateReply("Professional")}>Share availability</button><button type="button" onClick={() => generateReply("Shorter")}>Quick reply</button><button type="button" onClick={() => generateReply("Follow-up")}>Follow up</button></div></div></div>
          <div className="conversation-body"><span>Today</span><p className="received">Hi Aries, {conversations[active].text}</p><p className="sent">Thanks for reaching out. I’d be happy to discuss the role and share relevant work.</p>{(sentMessages[active] || []).map((item, index) => <p className="sent new-message" key={`${item}-${index}`}>{item}</p>)}<span>Messages are stored locally in this prototype.</span></div>
          {attached && <div className="message-attachment"><FileText /><span><strong>Portfolio.pdf</strong><small>2.4 MB · Ready to send</small></span><button type="button" onClick={() => setAttached(false)} aria-label="Remove attachment"><X /></button></div>}
          <form className="message-composer" onSubmit={sendMessage}>
            <div className="composer-tools"><button type="button" onClick={() => setAttached(true)} aria-label="Attach portfolio"><Paperclip /></button><button type="button" aria-label="Open emoji picker" aria-expanded={emojiOpen} onClick={() => { setEmojiOpen((value) => !value); setAiOpen(false); }}><Smile /></button>{emojiOpen && <div className="emoji-picker" role="dialog" aria-label="Choose an emoji"><header><strong>Choose an emoji</strong><button type="button" onClick={() => setEmojiOpen(false)} aria-label="Close emoji picker"><X /></button></header><nav aria-label="Emoji categories">{Object.keys(EMOJI_SETS).map((category) => <button type="button" key={category} className={emojiCategory === category ? "active" : ""} onClick={() => setEmojiCategory(category)}>{category}</button>)}</nav><div>{EMOJI_SETS[emojiCategory].map((emoji) => <button type="button" key={emoji} onClick={() => setDraft((value) => `${value}${value ? " " : ""}${emoji}`)} aria-label={`Add ${emoji}`}>{emoji}</button>)}</div></div>}<button type="button" className="ai-compose-button" aria-expanded={aiOpen} onClick={() => { setAiOpen((value) => !value); setEmojiOpen(false); }}><MessageCircle /><span>Prepare a reply</span><ChevronDown /></button>{aiOpen && <div className="ai-reply-menu"><header><div><strong>Prepare a reply</strong><small>Choose a tone and edit before sending.</small></div><button type="button" onClick={() => setAiOpen(false)} aria-label="Close reply suggestions"><X /></button></header>{["Professional", "Shorter", "Friendly", "Follow-up"].map((tone) => <button type="button" key={tone} onClick={() => generateReply(tone)}><span>{tone}</span><ChevronRight /></button>)}</div>}</div>
            <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message…" aria-label="Message recruiter" rows="2" />
            <button type="submit" className="message-send" aria-label="Send message"><Send /></button>
          </form>
        </div>
      </div>
    </section>
  );
}

function SavedView({ saved, jobRegistry, toggleSaved, openJob }) {
  const [collection, setCollection] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Match score");
  const [sortOpen, setSortOpen] = useState(false);
  useEffect(() => {
    if (!sortOpen) return undefined;
    const close = (event) => { if (event.key === "Escape") setSortOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [sortOpen]);
  const savedJobs = useMemo(() => [...saved].map((id) => jobRegistry[id]).filter(Boolean), [jobRegistry, saved]);
  const collections = [
    { name: "All", Icon: Bookmark, count: savedJobs.length },
    { name: "High match", Icon: Star, count: savedJobs.filter((job) => job.match >= 90).length },
    { name: "Remote", Icon: MapPin, count: savedJobs.filter((job) => job.mode === "Remote").length },
    { name: "Recently saved", Icon: Clock3, count: Math.min(savedJobs.length, 2) },
    { name: "Interview prep", Icon: Tag, count: 0 },
    { name: "Archived", Icon: Archive, count: 0 },
  ];
  const visible = [...savedJobs]
    .filter((job) => collection === "All" || (collection === "High match" && job.match >= 90) || (collection === "Remote" && job.mode === "Remote") || collection === "Recently saved")
    .filter((job) => collection !== "Recently saved" || savedJobs.indexOf(job) < 2)
    .filter((job) => `${job.role} ${job.company} ${job.location}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === "Match score" ? b.match - a.match : sort === "Newest" ? a.id - b.id : a.company.localeCompare(b.company));
  const highMatchCount = savedJobs.filter((job) => job.match >= 90).length;
  return (
    <section className="jobs-inner-view saved-view">
      <header><div><h1>Saved opportunities</h1><p>Organize promising roles and return when you’re ready to act.</p></div><strong>{savedJobs.length} saved roles</strong></header>
      <div className="saved-overview"><button type="button" onClick={() => setCollection("All")}><Bookmark /><span><strong>{savedJobs.length}</strong><small>Saved roles</small></span></button><button type="button" onClick={() => setCollection("High match")}><Star /><span><strong>{highMatchCount}</strong><small>High-match roles</small></span></button><button type="button" onClick={() => setCollection("Recently saved")}><CalendarClock /><span><strong>{Math.min(savedJobs.length, 2)}</strong><small>Worth reviewing today</small></span></button></div>
      <div className="saved-toolbar"><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search saved roles" aria-label="Search saved roles" /></label><div className="saved-sort"><button type="button" aria-haspopup="menu" aria-expanded={sortOpen} onClick={() => setSortOpen((value) => !value)}><ListFilter /><span>{sort}</span><ChevronDown /></button>{sortOpen && <div className="saved-sort-menu" role="menu" aria-label="Sort saved roles">{["Match score", "Newest", "Company"].map((option) => <button type="button" role="menuitemradio" aria-checked={sort === option} className={sort === option ? "active" : ""} key={option} onClick={() => { setSort(option); setSortOpen(false); }}>{option}{sort === option && <CheckCircle2 />}</button>)}</div>}</div></div>
      <div className="saved-collections" aria-label="Saved job collections">{collections.map(({ name, Icon, count }) => <button type="button" key={name} className={collection === name ? "active" : ""} onClick={() => setCollection(name)}><Icon /><span>{name}</span><b>{count}</b></button>)}</div>
      {visible.length ? <div className="saved-jobs-grid">{visible.map((job) => <JobCard key={job.id} job={job} saved onSave={toggleSaved} onSelect={openJob} />)}</div> : <div className="saved-empty"><Bookmark /><h2>No roles in this view</h2><p>Try another collection or save a role from Explore.</p><button type="button" onClick={() => { setCollection("All"); setQuery(""); }}>Show all saved roles</button></div>}
    </section>
  );
}

function LegacyJobAlertsView({ goExplore, openJob, onNotify }) {
  const [alerts, setAlerts] = useState([
    { id: 1, title: "Creative technology in Dubai", query: "Realtime, 3D, experiential", location: "Dubai", frequency: "Daily", matches: 12, enabled: true },
    { id: 2, title: "Senior hybrid roles", query: "Art direction, design systems", location: "UAE", frequency: "Twice weekly", matches: 7, enabled: true },
    { id: 3, title: "Remote motion opportunities", query: "Motion design, VFX", location: "Worldwide", frequency: "Weekly", matches: 5, enabled: false },
  ]);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(1);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [draftAlert, setDraftAlert] = useState({ title: "Experience designer", query: "Experiential, spatial, interactive", location: "Dubai, UAE", frequency: "Daily" });
  const toggleAlert = (id) => setAlerts((items) => items.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item));
  const startCreate = () => { setEditingId(null); setDraftAlert({ title: "Experience designer", query: "Experiential, spatial, interactive", location: "Dubai, UAE", frequency: "Daily" }); setCreating(true); };
  const startEdit = (alert) => { setEditingId(alert.id); setDraftAlert({ title: alert.title, query: alert.query, location: alert.location, frequency: alert.frequency }); setCreating(true); };
  const saveAlert = (event) => {
    event.preventDefault();
    if (editingId) setAlerts((items) => items.map((item) => item.id === editingId ? { ...item, ...draftAlert } : item));
    else setAlerts((items) => [...items, { id: Date.now(), ...draftAlert, matches: 0, enabled: true }]);
    onNotify(editingId ? "Mock job alert updated." : "New mock job alert created.");
    setCreating(false);
    setEditingId(null);
  };
  const alertJobs = jobs.slice(((alerts.findIndex((item) => item.id === selectedAlert) + alerts.length) % alerts.length) * 3 % jobs.length, ((((alerts.findIndex((item) => item.id === selectedAlert) + alerts.length) % alerts.length) * 3) % jobs.length) + 3);
  return (
    <section className="jobs-inner-view alerts-view">
      <header><div><span>Personal job radar</span><h1>Job alerts</h1><p>Get notified when strong-fit roles appear in the markets you care about.</p></div><button type="button" onClick={goExplore}><MapPin /> Back to map</button></header>
      <div className="alerts-hero"><div><span><Bell /></span><div><strong>24 fresh roles</strong><small>Across {alerts.length} saved searches this week</small></div></div><button type="button" onClick={() => creating ? setCreating(false) : startCreate()}>{creating ? "Close form" : "Create alert"}</button></div>
      {creating && <form className="alert-create-form" onSubmit={saveAlert}><label><span>Alert name</span><input value={draftAlert.title} onChange={(event) => setDraftAlert((item) => ({ ...item, title: event.target.value }))} required /></label><label><span>Skills or keywords</span><input value={draftAlert.query} onChange={(event) => setDraftAlert((item) => ({ ...item, query: event.target.value }))} required /></label><label><span>Location</span><input value={draftAlert.location} onChange={(event) => setDraftAlert((item) => ({ ...item, location: event.target.value }))} required /></label><label><span>Frequency</span><select value={draftAlert.frequency} onChange={(event) => setDraftAlert((item) => ({ ...item, frequency: event.target.value }))}><option>Daily</option><option>Twice weekly</option><option>Weekly</option></select></label><button type="submit">{editingId ? "Update alert" : "Save alert"}</button></form>}
      <div className="alert-stats"><button type="button" onClick={() => onNotify("Showing all active job alerts.")}><CheckCircle2 /><span><strong>{alerts.filter((item) => item.enabled).length}</strong><small>Active alerts</small></span></button><button type="button" onClick={() => onNotify("Showing roles discovered in the last seven days.")}><Sparkles /><span><strong>24</strong><small>New this week</small></span></button><button type="button" onClick={() => onNotify("Alert quality uses your profile match and preferences.")}><Star /><span><strong>91%</strong><small>Average fit</small></span></button></div>
      <div className="alert-list"><div className="alert-list-heading"><div><h2>Your alerts</h2><p>Fine-tune each search or pause notifications at any time.</p></div><button type="button" className={preferencesOpen ? "active" : ""} onClick={() => setPreferencesOpen((value) => !value)}><SlidersHorizontal /> Preferences</button></div>{preferencesOpen && <div className="alert-preferences"><label><input type="checkbox" defaultChecked /> Email digest</label><label><input type="checkbox" defaultChecked /> Push notifications</label><label><input type="checkbox" /> Weekly summary only</label></div>}{alerts.map((alert) => <article key={alert.id} className={`${alert.enabled ? "active" : "paused"} ${selectedAlert === alert.id ? "selected" : ""}`}><span className="alert-card-icon"><BriefcaseBusiness /></span><div><div><strong>{alert.title}</strong><span>{alert.matches} matches</span></div><p>{alert.query}</p><small><MapPin /> {alert.location}<Clock3 /> {alert.frequency}</small></div><button type="button" className={`alert-toggle ${alert.enabled ? "on" : ""}`} aria-pressed={alert.enabled} aria-label={`${alert.enabled ? "Pause" : "Enable"} ${alert.title}`} onClick={() => toggleAlert(alert.id)}><span /></button><div className="alert-actions"><button type="button" onClick={() => setSelectedAlert(alert.id)}>View matches</button><button type="button" onClick={() => startEdit(alert)}>Edit</button></div></article>)}</div>
      <section className="alert-results"><header><div><span>Latest alert results</span><h2>{alerts.find((item) => item.id === selectedAlert)?.title || "Your newest alert"}</h2></div><button type="button" onClick={goExplore}>View on map <ArrowUpRight /></button></header><div>{alertJobs.map((job) => <JobCard key={job.id} job={job} saved={false} onSave={() => onNotify(`${job.role} saved from alerts.`)} onSelect={openJob} />)}</div></section>
    </section>
  );
}

function JobAlertsView({ goExplore, openJob, onOpenMessages, onNotify }) {
  const activity = [
    { id: 1, group: "Applications", Icon: CheckCircle2, title: "You moved to the interview stage", company: "Pixel Forge", role: "Technical Art Director", detail: "Maya invited you to a 20-minute introduction call. Three time slots are available.", time: "10 min ago", action: "Choose a time", jobId: 2, unread: true, priority: "high" },
    { id: 2, group: "Offers", Icon: BriefcaseBusiness, title: "You received an offer", company: "Blue Orbit", role: "Motion Design Specialist", detail: "Your offer is ready to review, including compensation, start date, and response deadline.", time: "1 hr ago", action: "Review offer", jobId: 6, unread: true, priority: "offer" },
    { id: 3, group: "Profile", Icon: FileText, title: "Your CV was viewed", company: "Northstar Studio", role: "Senior 3D Visualizer", detail: "A recruiter viewed your profile and downloaded the latest version of your portfolio.", time: "2 hrs ago", action: "View role", jobId: 1, unread: true },
    { id: 4, group: "Interviews", Icon: CalendarClock, title: "Intro call tomorrow at 10:30", company: "Mosaic Events", role: "Experiential Designer", detail: "Your call with the Design Lead is confirmed. Prepare two projects that show collaboration and delivery.", time: "Today", action: "Open messages", jobId: 4, unread: true },
    { id: 5, group: "Applications", Icon: Clock3, title: "Application is under review", company: "Frame Lab", role: "Unreal Engine Artist", detail: "The hiring team is reviewing your application. No action is needed right now.", time: "Yesterday", action: "View application", jobId: 3, unread: false },
    { id: 6, group: "Profile", Icon: Star, title: "Profile match increased to 91%", company: "Future Works", role: "Creative Technology Lead", detail: "Your updated skills now align with three more requirements in this role.", time: "Yesterday", action: "View role", jobId: 5, unread: false },
  ];
  const [filter, setFilter] = useState("All");
  const [readIds, setReadIds] = useState(() => new Set(activity.filter((item) => !item.unread).map((item) => item.id)));
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const visible = filter === "All" ? activity : activity.filter((item) => item.group === filter);
  const unread = activity.filter((item) => !readIds.has(item.id)).length;
  const openActivity = (item) => {
    setReadIds((current) => new Set([...current, item.id]));
    if (item.action === "Open messages") onOpenMessages();
    else openJob(jobs.find((job) => job.id === item.jobId) || jobs[0]);
  };
  return (
    <section className="jobs-inner-view notification-view">
      <header><div><span>Hiring activity</span><h1>Alerts</h1><p>Important updates from your applications, interviews, offers, and profile activity.</p></div><button type="button" onClick={goExplore}><MapPin /> Back to Hub</button></header>
      <div className="notification-summary"><article><span><Bell /></span><div><strong>{unread} updates need your attention</strong><p>Interview invitations, recruiter activity, and application changes are collected here.</p></div><button type="button" onClick={() => setReadIds(new Set(activity.map((item) => item.id)))}>Mark all read</button></article><button type="button" onClick={() => setFilter("Interviews")}><CalendarClock /><span><strong>1</strong><small>Upcoming call</small></span></button><button type="button" onClick={() => setFilter("Offers")}><BriefcaseBusiness /><span><strong>1</strong><small>Offer to review</small></span></button></div>
      <div className="notification-toolbar"><div className="notification-filters" aria-label="Alert filters">{["All", "Applications", "Interviews", "Offers", "Profile"].map((item) => <button type="button" key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}<span>{item === "All" ? activity.length : activity.filter((entry) => entry.group === item).length}</span></button>)}</div><button type="button" className={preferencesOpen ? "active" : ""} onClick={() => setPreferencesOpen((value) => !value)}><Settings /> Preferences</button></div>
      {preferencesOpen && <div className="notification-preferences"><div><strong>Notification preferences</strong><small>Choose how prototype alerts reach you.</small></div><label><input type="checkbox" defaultChecked /> Interview and offer updates</label><label><input type="checkbox" defaultChecked /> Recruiter profile views</label><label><input type="checkbox" /> Weekly email digest only</label></div>}
      <div className="notification-layout"><section className="notification-feed"><header><div><h2>{filter === "All" ? "Recent activity" : filter}</h2><p>{visible.length} updates in this view</p></div></header>{visible.map((item) => { const isRead = readIds.has(item.id); return <article className={`${isRead ? "read" : "unread"} ${item.priority || ""}`} key={item.id}><span className="notification-icon"><item.Icon /></span><div><div><span>{item.group}</span><time>{item.time}</time></div><h3>{item.title}</h3><p><strong>{item.company}</strong> · {item.role}</p><small>{item.detail}</small><div className="notification-actions"><button type="button" onClick={() => openActivity(item)}>{item.action}<ChevronRight /></button>{!isRead && <button type="button" onClick={() => setReadIds((current) => new Set([...current, item.id]))}>Mark read</button>}</div></div>{!isRead && <i aria-label="Unread" />}</article>; })}</section><aside className="notification-next"><span><CalendarClock /></span><small>Next scheduled step</small><h2>Intro call with Mosaic Events</h2><p>Tomorrow · 10:30–10:50<br />Google Meet</p><div><strong>Suggested preparation</strong><ul><li>Select two portfolio projects.</li><li>Prepare your availability.</li><li>Review the role requirements.</li></ul></div><button type="button" onClick={onOpenMessages}>Open conversation</button></aside></div>
    </section>
  );
}

const tourSteps = [
  { view: "explore", selector: "[data-tour='hub-nav']", title: "Your job-search command center", body: "Move between discovery, daily matches, applications, recruiter messages, and saved roles without losing context." },
  { view: "explore", selector: "[data-tour='map']", title: "Explore jobs across Dubai", body: "Pan and zoom the map. The result rail updates to roles closest to the area you are viewing." },
  { view: "explore", selector: "[data-tour='daily-card']", title: "Start with twelve curated matches", body: "Best Fit, Near You, and Time-Sensitive groups help you choose where to focus first." },
  { view: "explore", selector: "[data-tour='applications-card']", title: "Keep every application moving", body: "See applied, interview, and offer stages with the next useful action for each role." },
  { view: "explore", selector: "[data-tour='messages-card']", title: "Stay close to recruiters", body: "Conversation summaries, attachments, and mock AI reply tools keep follow-ups clear and timely." },
  { view: "explore", selector: "[data-tour='saved-nav']", title: "Build a focused shortlist", body: "Save promising opportunities, organize them, and return when you are ready to act." },
  { view: "explore", selector: "[data-tour='job-alerts']", title: "Keep up with every important update", body: "See interview invitations, offers, recruiter profile views, scheduled calls, and application changes in one place." },
  { view: "explore", selector: ".wizzy-character-button", title: "Meet Wizy", body: "Tap Wizy to open your job-search coach, ask a question, or trigger one of his calm animations." },
];

function HubTour({ open, onClose, setView }) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const cardRef = useRef(null);
  const current = tourSteps[step];
  useEffect(() => {
    if (!open) return undefined;
    setView(current.view);
    const mobileToggle = document.querySelector(".hub-mobile-menu-toggle");
    if (window.innerWidth <= 820) {
      const needsMenu = current.selector === "[data-tour='job-alerts']";
      if (needsMenu && mobileToggle?.getAttribute("aria-expanded") === "false") mobileToggle.click();
      if (!needsMenu && mobileToggle?.getAttribute("aria-expanded") === "true") mobileToggle.click();
    }
    const update = () => {
      const selector = current.selector === "[data-tour='job-alerts']" && window.innerWidth <= 820 ? "[data-tour='job-alerts-mobile']" : current.selector;
      const target = document.querySelector(selector);
      if (target) setTargetRect(target.getBoundingClientRect());
    };
    const timer = window.setTimeout(update, 80);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => { window.clearTimeout(timer); window.removeEventListener("resize", update); window.removeEventListener("scroll", update, true); };
  }, [current, open, setView]);
  useEffect(() => {
    if (!open) return undefined;
    cardRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose("skipped");
      if (event.key === "ArrowRight" && step < tourSteps.length - 1) setStep((value) => value + 1);
      if (event.key === "ArrowLeft" && step > 0) setStep((value) => value - 1);
      if (event.key === "Tab" && cardRef.current) {
        const focusable = [...cardRef.current.querySelectorAll("button")];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, open, step]);
  useEffect(() => { if (!open) setStep(0); }, [open]);
  if (!open || !targetRect) return null;
  const width = Math.min(360, window.innerWidth - 32);
  const isMobile = window.innerWidth < 700;
  let left = targetRect.right + 18;
  if (left + width > window.innerWidth - 16) left = Math.max(16, targetRect.left - width - 18);
  let top = Math.max(16, Math.min(targetRect.top, window.innerHeight - 330));
  if (isMobile) { left = 16; top = window.innerHeight - 278; }
  const spotLeft = Math.max(0, targetRect.left - 8);
  const spotTop = Math.max(0, targetRect.top - 8);
  const spotWidth = Math.min(targetRect.width + 16, window.innerWidth - spotLeft);
  const spotHeight = Math.min(targetRect.height + 16, window.innerHeight - spotTop);
  return (
    <div className="hub-tour-layer" aria-live="polite">
      <div className="tour-spotlight" style={{ left: spotLeft, top: spotTop, width: spotWidth, height: spotHeight }} />
      <section className="hub-tour-card" ref={cardRef} tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="tour-title" style={{ left, top, width }}>
        <header><span>{step + 1} of {tourSteps.length}</span><button type="button" onClick={() => onClose("skipped")} aria-label="Close product tour"><X /></button></header>
        <div className="tour-progress" aria-hidden="true"><span style={{ width: `${((step + 1) / tourSteps.length) * 100}%` }} /></div>
        <div className="tour-icon"><Sparkles /></div><h2 id="tour-title">{current.title}</h2><p>{current.body}</p>
        <footer><button type="button" className="tour-skip" onClick={() => onClose("skipped")}>Skip tour</button><div>{step > 0 && <button type="button" onClick={() => setStep((value) => value - 1)}>Back</button>}<button type="button" className="tour-next" onClick={() => step === tourSteps.length - 1 ? onClose("completed") : setStep((value) => value + 1)}>{step === tourSteps.length - 1 ? "Finish" : "Next"}<ChevronRight /></button></div></footer>
      </section>
    </div>
  );
}

export function ExploreJobs() {
  const [view, setView] = useState(() => {
    const requested = new URLSearchParams(window.location.search).get("hub");
    return ["explore", "daily", "applications", "messages", "saved", "alerts", "job"].includes(requested) ? requested : "explore";
  });
  const [revealRun, setRevealRun] = useState(0);
  const [previousView, setPreviousView] = useState("explore");
  const [selectedJob, setSelectedJob] = useState(() => jobs.find((job) => String(job.id) === new URLSearchParams(window.location.search).get("job")) || jobs[0]);
  const [saved, setSaved] = useState(() => new Set([1, 3, 5]));
  const [jobRegistry, setJobRegistry] = useState(() => Object.fromEntries(jobs.map((job) => [job.id, job])));
  const [conversations, setConversations] = useState(messages);
  const [applications, setApplications] = useState(() => new Map([[1, "Applied"], [2, "Applied"], [3, "Applied"], [4, "Interview"], [5, "Interview"], [6, "Offer"]]));
  const [tourOpen, setTourOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [status, setStatus] = useState("");
  const notify = useCallback((message) => setStatus(message), []);
  useEffect(() => { if (!status) return undefined; const timer = window.setTimeout(() => setStatus(""), 3200); return () => window.clearTimeout(timer); }, [status]);
  const toggleSaved = (id, job = jobRegistry[id]) => { if (job) setJobRegistry((current) => current[id] === job ? current : { ...current, [id]: job }); setSaved((current) => { const next = new Set(current); const removing = next.has(id); removing ? next.delete(id) : next.add(id); setStatus(removing ? "Removed from saved opportunities." : "Saved to your opportunities."); return next; }); };
  const toggleApplied = (id) => setApplications((current) => { const next = new Map(current); const withdrawing = next.has(id); withdrawing ? next.delete(id) : next.set(id, "Applied"); setStatus(withdrawing ? "Application withdrawn in this prototype." : "Application submitted successfully and added to Applied."); return next; });
  const activateView = useCallback((next) => { const url = new URL(window.location.href); if (next !== "job") url.searchParams.delete("job"); if (url.searchParams.get("hub") !== next || window.location.href !== url.href) { url.searchParams.set("hub", next); window.history.pushState({ hub: next }, "", url); } setMobileNavOpen(false); setView(next); setRevealRun((value) => value + 1); window.dispatchEvent(new CustomEvent("wizjobs:hub-view", { detail: { view: next } })); }, []);
  const openJob = useCallback((job) => { const url = new URL(window.location.href); url.searchParams.set("hub", "job"); url.searchParams.set("job", job.id); window.history.pushState({ hub: "job", job: job.id }, "", url); setMobileNavOpen(false); setJobRegistry((current) => current[job.id] === job ? current : { ...current, [job.id]: job }); setSelectedJob(job); setPreviousView(view); setView("job"); setRevealRun((value) => value + 1); window.dispatchEvent(new CustomEvent("wizjobs:hub-view", { detail: { view: "job" } })); }, [view]);
  const closeTour = useCallback(() => { window.localStorage.setItem("wizjobs-hub-tour", "done"); setTourOpen(false); }, []);
  const tabs = [["explore", "Explore", Search], ["daily", "Daily matches", Sparkles], ["applications", "Applications", CheckCircle2], ["messages", "Messages", MessageCircle], ["saved", "Saved", Bookmark]];
  useEffect(() => { window.scrollTo({ top: 0 }); }, [view]);
  useEffect(() => { const onPopState = () => { const params = new URLSearchParams(window.location.search); const requested = params.get("hub"); if (requested === "job") setSelectedJob(jobRegistry[params.get("job")] || jobs[0]); setMobileNavOpen(false); setView(["explore", "daily", "applications", "messages", "saved", "alerts", "job"].includes(requested) ? requested : "explore"); setRevealRun((value) => value + 1); }; window.addEventListener("popstate", onPopState); return () => window.removeEventListener("popstate", onPopState); }, [jobRegistry]);
  useEffect(() => {
    if (window.localStorage.getItem("wizjobs-hub-tour") === "done") return undefined;
    const timer = window.setTimeout(() => setTourOpen(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="jobs-hub-page">
      <nav className={`jobs-hub-nav ${mobileNavOpen ? "mobile-open" : ""}`} data-tour="hub-nav">
        <div><span className="jobs-hub-mark"><BriefcaseBusiness /></span><strong>WizJobs Hub</strong></div>
        <div className="hub-view-tabs" id="hub-view-menu">{tabs.map(([key, label, Icon]) => { const unreadCount = conversations.filter((message) => message.unread).length; return <button type="button" key={key} data-tour={key === "saved" ? "saved-nav" : undefined} className={view === key || (view === "job" && previousView === key) ? "active" : ""} onClick={() => activateView(key)}><Icon />{label}{key === "messages" && unreadCount > 0 && <i>{unreadCount}</i>}</button>; })}<button type="button" className={`hub-mobile-alert-link ${view === "alerts" ? "active" : ""}`} data-tour="job-alerts-mobile" onClick={() => activateView("alerts")}><Bell /> Alerts<i>4</i></button></div>
        <button type="button" className="hub-mobile-menu-toggle" aria-expanded={mobileNavOpen} aria-controls="hub-view-menu" onClick={() => setMobileNavOpen((open) => !open)}><Menu /><span><small>WizJobs Hub</small><strong>{view === "job" ? "Job details" : view === "alerts" ? "Alerts" : tabs.find(([key]) => key === view)?.[1]}</strong></span><ChevronDown /></button>
        <button type="button" className="hub-tour-replay" onClick={() => { activateView("explore"); setTourOpen(true); }} aria-label="Replay feature tour" title="Replay feature tour"><HelpCircle /></button>
        <button type="button" className={`jobs-alert-button ${view === "alerts" ? "active" : ""}`} data-tour="job-alerts" onClick={() => activateView("alerts")}><Bell /> Alerts<i>4</i></button>
      </nav>
      <Fragment key={`${view}-${revealRun}`}>
        {view === "explore" && <ExploreView selectedJob={selectedJob} setSelectedJob={setSelectedJob} saved={saved} toggleSaved={toggleSaved} setView={activateView} openJob={openJob} onNotify={notify} applicationsCount={applications.size} />}
        {view === "daily" && <DailyMatchesView selectedJob={selectedJob} saved={saved} toggleSaved={toggleSaved} goExplore={() => activateView("explore")} openJob={openJob} />}
        {view === "job" && <JobDetailView job={selectedJob} saved={saved.has(selectedJob.id)} toggleSaved={toggleSaved} applied={applications.has(selectedJob.id)} toggleApplied={toggleApplied} onBack={() => activateView(previousView === "job" ? "explore" : previousView)} />}
        {view === "applications" && <ApplicationsView applications={applications} allJobs={Object.values(jobRegistry)} openJob={openJob} onNotify={notify} />}
        {view === "messages" && <MessagesView conversations={conversations} setConversations={setConversations} openJob={openJob} onNotify={notify} />}
        {view === "saved" && <SavedView saved={saved} jobRegistry={jobRegistry} toggleSaved={toggleSaved} openJob={openJob} />}
        {view === "alerts" && <JobAlertsView goExplore={() => activateView("explore")} openJob={openJob} onOpenMessages={() => activateView("messages")} onNotify={notify} />}
      </Fragment>
      <HubTour open={tourOpen} onClose={closeTour} setView={setView} />
      {status && <div className="hub-status-toast" role="status"><CheckCircle2 /><span>{status}</span></div>}
    </main>
  );
}
