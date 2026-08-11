import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";

const IDLE_DURATIONS = [900, 180, 180, 180, 240, 320, 240, 180, 180, 180, 240, 1400];
const ACTION_DURATIONS = [900, 260, 260, 280, 320, 700, 420, 340, 320, 320, 420, 1500];

export const WIZY_CLIPS = {
  "calm-idle": { frames: 12, durations: IDLE_DURATIONS, pose: "Ready", line: "Let’s get you interview-ready." },
  "think-lightbulb": { frames: 12, durations: ACTION_DURATIONS, pose: "Thinking", line: "I’m shaping a useful next step." },
  "computer-search": { frames: 12, durations: ACTION_DURATIONS, pose: "Searching", line: "Let’s explore the strongest opportunities." },
  "job-match": { frames: 12, durations: ACTION_DURATIONS, pose: "Matching", line: "I found something worth a closer look." },
};

const actionOrder = ["think-lightbulb", "computer-search", "job-match"];
const framePath = (clip, frame) => `/assets/wizy-v2/${clip}/${String(frame + 1).padStart(2, "0")}.png`;
const quickPrompts = ["Practice an interview", "Improve my CV", "Find matching jobs"];

export function WizyPet() {
  const [frame, setFrame] = useState(0);
  const [clip, setClip] = useState("calm-idle");
  const [idleLoops, setIdleLoops] = useState(0);
  const [nextAction, setNextAction] = useState(0);
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [userMinimized, setUserMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [messages, setMessages] = useState([{ from: "wizzy", text: "Hi! I’m Wizy, your job-search coach. What should we work on?" }]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    Object.entries(WIZY_CLIPS).forEach(([name, settings]) => {
      for (let index = 0; index < settings.frames; index += 1) new Image().src = framePath(name, index);
    });
  }, []);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "end" });
  }, [messages, open, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const settings = WIZY_CLIPS[clip];
    const timer = window.setTimeout(() => {
      if (frame < settings.frames - 1) {
        setFrame((value) => value + 1);
        return;
      }
      if (clip !== "calm-idle") {
        setClip("calm-idle");
        setFrame(0);
        setIdleLoops(0);
        return;
      }
      if (idleLoops < 1) {
        setIdleLoops((value) => value + 1);
        setFrame(0);
        return;
      }
      setClip(actionOrder[nextAction]);
      setNextAction((value) => (value + 1) % actionOrder.length);
      setIdleLoops(0);
      setFrame(0);
    }, settings.durations[frame]);
    return () => window.clearTimeout(timer);
  }, [clip, frame, idleLoops, nextAction, reducedMotion]);

  const play = (name) => {
    setClip(name);
    setFrame(0);
    setIdleLoops(0);
  };

  const playRandomAction = () => {
    const choices = actionOrder.filter((name) => name !== clip);
    play(choices[Math.floor(Math.random() * choices.length)]);
  };

  const reply = (prompt) => {
    const clean = prompt.trim();
    if (!clean) return;
    const lower = clean.toLowerCase();
    const response = lower.includes("cv")
      ? "Let’s sharpen your CV. Start with one achievement you’re proud of, including a measurable result."
      : lower.includes("match")
        ? "I’ll help you focus the search. Which role, location, and work mode are you targeting?"
        : "Great—let’s rehearse. Tell me about a project where you solved a difficult problem.";
    setMessages((items) => [...items, { from: "user", text: clean }, { from: "wizzy", text: response }]);
    setInput("");
    if (lower.includes("match") || lower.includes("job")) play("job-match");
    else if (lower.includes("cv") || lower.includes("search")) play("computer-search");
    else play("think-lightbulb");
  };

  useEffect(() => {
    const updateDocking = (event) => {
      if (open) return;
      if (userMinimized) {
        setMinimized(true);
        return;
      }
      const hubView = event?.detail?.view || new URLSearchParams(window.location.search).get("hub") || "explore";
      const insideHub = window.location.pathname.includes("explore-jobs");
      if (!insideHub) {
        setMinimized(true);
        return;
      }
      if (insideHub && window.innerWidth <= 820) {
        setMinimized(true);
        return;
      }
      if (insideHub && hubView !== "explore") {
        setMinimized(true);
        return;
      }
      if (window.innerWidth <= 820 && window.scrollY > 160) setMinimized(true);
      else if (window.scrollY < 48) setMinimized(false);
    };
    updateDocking();
    window.addEventListener("scroll", updateDocking, { passive: true });
    window.addEventListener("resize", updateDocking);
    window.addEventListener("popstate", updateDocking);
    window.addEventListener("wizjobs:hub-view", updateDocking);
    return () => {
      window.removeEventListener("scroll", updateDocking);
      window.removeEventListener("resize", updateDocking);
      window.removeEventListener("popstate", updateDocking);
      window.removeEventListener("wizjobs:hub-view", updateDocking);
    };
  }, [open, userMinimized]);

  const current = WIZY_CLIPS[clip];

  return (
    <aside className={`wizzy-coach ${open ? "chat-open" : ""} ${minimized ? "minimized" : ""}`} aria-label="Wizy job coach" data-clip={clip} data-frame={frame + 1}>
      <div className="wizzy-nudge" aria-hidden={open}><strong>{current.pose}</strong><span>{current.line}</span></div>
      {open && (
        <section className="wizzy-chat" aria-label="Chat with Wizy">
          <header><span className="wizzy-status-dot" /><div><strong>Wizy</strong><small>Interview coach · Online</small></div><button type="button" onClick={() => setOpen(false)} aria-label="Close chat"><X /></button></header>
          <div className="wizzy-messages" aria-live="polite">{messages.map((message, index) => <p key={`${message.from}-${index}`} className={message.from}>{message.text}</p>)}<span ref={messagesEndRef} aria-hidden="true" /></div>
          <div className="wizzy-prompts">{quickPrompts.map((prompt) => <button key={prompt} onClick={() => reply(prompt)}>{prompt}</button>)}</div>
          <form onSubmit={(event) => { event.preventDefault(); reply(input); }}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask Wizy anything…" aria-label="Message Wizy" />
            <button aria-label="Send message" type="submit"><Send /></button>
          </form>
        </section>
      )}
      {open && <button type="button" className="wizzy-minimize-control" onClick={() => { setUserMinimized(true); setOpen(false); setMinimized(true); }} aria-label="Minimize Wizy">Minimize Wizy</button>}
      <div className="wizzy-pet">
        <button
          className="wizzy-character-button"
          onClick={() => {
            if (minimized) {
              setUserMinimized(false);
              setMinimized(false);
              setOpen(true);
              play("computer-search");
              return;
            }
            setOpen((value) => !value);
            if (!open) play("computer-search");
            else playRandomAction();
          }}
          aria-label={minimized ? "Restore Wizy chat" : open ? "Close Wizy chat" : "Open Wizy chat"}
          aria-expanded={open}
        >
          <span className="wizzy-stage">
            <img className="wizzy-frame active" src={framePath(clip, reducedMotion ? 0 : frame)} alt={`Wizy ${current.pose.toLowerCase()}`} />
          </span>
        </button>
      </div>
    </aside>
  );
}
