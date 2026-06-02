import { type CSSProperties, type ReactNode, useRef, useState } from "react";
import { useScatter } from "./canvas/useScatter";
import { useSky } from "./canvas/useSky";
import { useScrollReveal } from "./useScrollReveal";
import {
  AUDIT_PRICE,
  BOOKING_URL,
  CONTACT_EMAIL,
  PAYMENT_LINK,
} from "./config";
import { Analytics } from "@vercel/analytics/react";
import { track } from "@vercel/analytics";

type CardContent = {
  title: string;
  copy: string;
  icon: ReactNode;
  delay: string;
};

type ProcessStep = {
  number: string;
  title: string;
  copy: string;
  delay: string;
};

type PriceRow = {
  name: string;
  description: string;
  price: string;
  period?: string;
  flag?: string;
  featured?: boolean;
};

const delay = (value: string) => ({ "--d": value }) as CSSProperties;

const navItems = [
  { label: "What we do", href: "#capabilities" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#pricing" },
  { label: "Audit", href: "#audit" },
  { label: "FAQ", href: "#faq" },
];

const capabilityCards: CardContent[] = [
  {
    title: "Custom Apps & Software",
    copy: "Customer portals, staff tools, booking platforms, web and mobile apps — built around how your business actually works.",
    icon: <CodeIcon />,
    delay: ".05s",
  },
  {
    title: "App Rebuilds & Modernization",
    copy: "Turn slow, outdated, frustrating software into something fast, clear, and reliable.",
    icon: <RefreshIcon />,
    delay: ".11s",
  },
  {
    title: "Revenue & Marketing Tech",
    copy: "Lead capture, CRM, email and SMS follow-up, reviews, and conversion tracking — working together to bring in more business.",
    icon: <TrendIcon />,
    delay: ".17s",
  },
  {
    title: "Operations Automation",
    copy: "Scheduling, intake, approvals, reminders, documents, invoice follow-up — the repetitive work, handled automatically.",
    icon: <AutomationIcon />,
    delay: ".05s",
  },
  {
    title: "AI Tools & Assistants",
    copy: "Practical AI for support, intake, proposals, reporting, and admin — set up safely, with your data protected.",
    icon: <AiIcon />,
    delay: ".11s",
  },
  {
    title: "Data, Dashboards & Integrations",
    copy: "Connect your tools and finally see the numbers that matter, in one place you can trust.",
    icon: <DashboardIcon />,
    delay: ".17s",
  },
];

const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Diagnose",
    copy: "We map your tools, workflows, apps, data, and bottlenecks.",
    delay: ".05s",
  },
  {
    number: "02",
    title: "Prioritize",
    copy: "We score opportunities by revenue, time, risk, and effort.",
    delay: ".14s",
  },
  {
    number: "03",
    title: "Build",
    copy: "We put the single highest-value system in place first.",
    delay: ".23s",
  },
  {
    number: "04",
    title: "Train & launch",
    copy: "We document, test, train your team, and support the rollout.",
    delay: ".32s",
  },
  {
    number: "05",
    title: "Optimize",
    copy: "We measure and improve as your business changes.",
    delay: ".41s",
  },
];

const trustCards: CardContent[] = [
  {
    title: "Built by people from Meta, Apple & LinkedIn",
    copy: "The same caliber of software the biggest tech companies run on, focused entirely on your business.",
    icon: <MedalIcon />,
    delay: ".12s",
  },
  {
    title: "A roadmap before any build",
    copy: "We don't sell you software you don't need. The audit shows you what's worth doing — and what isn't — before you spend a dollar building.",
    icon: <CompassIcon />,
    delay: ".19s",
  },
  {
    title: "The work is yours either way",
    copy: "Clear scope, clear pricing, and a roadmap you keep whether or not you build with us.",
    icon: <DocumentIcon />,
    delay: ".26s",
  },
];

const deliverables = [
  "A map of your current tools and workflows",
  "A pain map — where revenue, time, and trust are leaking",
  "An opportunity scorecard, ranked by impact and effort",
  "Your recommended first project, with a real budget range",
  "A 30- and 90-day roadmap",
];

const priceRows: PriceRow[] = [
  {
    name: "Growth Audit",
    description: "Roadmap and first recommended project.",
    price: "$1,500",
    flag: "The front door",
    featured: true,
  },
  {
    name: "Quick Win System",
    description: "One focused automation, integration, dashboard, or tool.",
    price: "$2,500",
  },
  {
    name: "Improvement Sprint",
    description: "A meaningful upgrade to an existing app or workflow.",
    price: "$5,000",
  },
  {
    name: "Custom Build",
    description: "A custom app, portal, or integrated business system.",
    price: "$12,000",
  },
  {
    name: "Technology Partner",
    description: "Ongoing support, optimization, and improvement.",
    price: "$1,000",
    period: "/mo",
  },
];

function App() {
  const skyRef = useRef<HTMLCanvasElement | null>(null);
  const scatterRef = useRef<HTMLCanvasElement | null>(null);

  useSky(skyRef);
  useScatter(scatterRef);
  useScrollReveal();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="grain" />
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <Hero skyRef={skyRef} />
        <Problem scatterRef={scatterRef} />
        <Capabilities />
        <Process />
        <Trust />
        <About />
        <Audit />
        <Pricing />
        <Faq />
        <FinalCta />
        <BookAudit />
      </main>
      <Footer />
      <Analytics />
    </>
  );
}

function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`site-header${isMenuOpen ? " is-open" : ""}`}>
      <div className="header-shell">
        <a
          className="header-brand"
          href="#home"
          aria-label="North Star Pacific home"
          onClick={closeMenu}
        >
          <svg className="header-star" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 1 14.1 9.9 23 12 14.1 14.1 12 23 9.9 14.1 1 12 9.9 9.9Z" />
          </svg>
          <span>North Star Pacific</span>
        </a>

        <nav className="header-nav" aria-label="Primary">
          {navItems.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="header-cta" href="#book" onClick={closeMenu}>
            <span className="cta-full">Book audit</span>
            <span className="cta-short">Book</span>
          </a>
          <button
            className="header-menu"
            type="button"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <nav
          className={`mobile-nav${isMenuOpen ? " is-open" : ""}`}
          id="mobile-navigation"
          aria-label="Mobile"
          style={
            isMenuOpen
              ? {
                  maxHeight: "320px",
                  padding: "0.7rem",
                  borderColor: "rgba(234,241,251,0.12)",
                  opacity: 1,
                  transition: "none",
                  visibility: "visible",
                }
              : undefined
          }
        >
          {navItems.map((item) => (
            <a href={item.href} key={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <a className="mobile-nav-cta" href="#book" onClick={closeMenu}>
            Book a Business Technology Growth Audit
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero({
  skyRef,
}: {
  skyRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  return (
    <section className="hero" id="home" data-screen-label="Hero">
      <canvas ref={skyRef} id="sky" aria-hidden="true" />

      <span className="hud-corner tl" />
      <span className="hud-corner tr" />
      <span className="hud-corner bl" />
      <span className="hud-corner br" />

      <div className="hero-inner">
        <div className="hero-content">
          <span className="eyebrow reveal" style={delay(".1s")}>
            <span className="dot" />
            Business technology for growing businesses
          </span>

          <h1 className="headline reveal" style={delay(".25s")}>
            Build, improve, and automate the technology your business needs to{" "}
            <span className="grow">grow.</span>
          </h1>

          <p className="subhead reveal" style={delay(".45s")}>
            From custom apps and modernizing old systems to automating
            operations, sharpening your marketing, and putting AI to work — we
            help small and mid-sized businesses make more money, save time, and
            run better.
          </p>

          <div className="cta-row reveal" style={delay(".6s")}>
            <a className="btn btn-primary" href="#book">
              Book a Growth Audit — from $1,500
            </a>
            <a className="btn btn-ghost" href="#capabilities">
              See what we can do <span className="arr">→</span>
            </a>
          </div>

          <div className="microcopy reveal" style={delay(".75s")}>
            <span>Clear starting prices.</span>
            <span className="sep">/</span>
            <span>A practical roadmap before any project.</span>
            <span className="sep">/</span>
            <span>No tech overwhelm.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Problem({
  scatterRef,
}: {
  scatterRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  return (
    <section className="problem" id="problem" data-screen-label="Problem">
      <canvas ref={scatterRef} id="scatter" aria-hidden="true" />
      <div className="problem-inner">
        <div className="problem-block">
          <SectionTag label="The problem" delayValue="0s" />

          <h2 className="thesis scroll-reveal" style={delay(".1s")}>
            Most businesses don't need more tools. They need the right systems.
          </h2>

          <div className="maybes">
            <p className="maybe scroll-reveal" style={delay(".15s")}>
              Maybe your app is outdated.
            </p>
            <p className="maybe scroll-reveal" style={delay(".25s")}>
              Maybe your team repeats the same work by hand.
            </p>
            <p className="maybe scroll-reveal" style={delay(".35s")}>
              Maybe your marketing doesn't connect to your sales.
            </p>
            <p className="maybe scroll-reveal" style={delay(".45s")}>
              Maybe your reports live in five different places.
            </p>
            <p className="maybe scroll-reveal" style={delay(".55s")}>
              Maybe AI sounds useful, but nobody knows where to put it.
            </p>
          </div>

          <p className="closing scroll-reveal" style={delay(".65s")}>
            We help you find the{" "}
            <span className="accent-cyan">single highest-value opportunity</span>{" "}
            in your business — and put it to work the right way.
          </p>
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section
      className="capabilities"
      id="capabilities"
      data-screen-label="What we do"
    >
      <div className="cap-inner">
        <SectionTag number="01" label="What we do" delayValue="0s" />

        <div className="cap-grid">
          {capabilityCards.map((card) => (
            <FeatureCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="process" id="process" data-screen-label="How we work">
      <div className="process-inner">
        <SectionTag number="02" label="How we work" delayValue="0s" />

        <div className="process-strip">
          <span className="route" aria-hidden="true" />

          {processSteps.map((step) => (
            <div
              className="step scroll-reveal"
              style={delay(step.delay)}
              key={step.number}
            >
              <span className="step-node" />
              <span className="step-num">{step.number}</span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-copy">{step.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="trust" id="trust" data-screen-label="Why work with us">
      <div className="trust-inner">
        <SectionTag number="03" label="Why work with us" delayValue="0s" />

        <h2 className="trust-lead scroll-reveal" style={delay(".08s")}>
          New name. <span className="accent-cyan">People you can trust with it.</span>
        </h2>

        <div className="trust-grid">
          {trustCards.map((card) => (
            <FeatureCard key={card.title} card={card} />
          ))}
        </div>

        <div className="trust-cta scroll-reveal" style={delay(".3s")}>
          <a className="sample-link" href="#audit">
            <span className="sl-lead">See exactly what you get</span>
            <span className="sl-arr">→</span>
            <span className="sl-main">View a sample audit</span>
          </a>
        </div>
      </div>
    </section>
  );
}

const aboutPath = [
  {
    title: "Planetary science",
    sub: "NASA’s Dawn mission · the dwarf planet Ceres",
  },
  {
    title: "Self-taught engineer",
    sub: "then started shipping real products",
  },
  {
    title: "Eight industries",
    sub: "U.S. Army · Meta · Apple · LinkedIn · TuSimple · Expedia · Nike · Futu",
  },
  {
    title: "The frontier",
    sub: "building at the AI edge today",
  },
];

function About() {
  return (
    <section className="about" id="about" data-screen-label="About">
      <div className="about-inner">
        <SectionTag label="Who’s behind it" delayValue="0s" />

        <div className="about-grid">
          <div className="about-lead">
            <h2 className="about-headline scroll-reveal" style={delay(".05s")}>
              I’ve only ever wanted to do one thing —{" "}
              <span className="accent-cyan">go to the edge, and ship.</span>
            </h2>
            <p className="about-body scroll-reveal" style={delay(".12s")}>
              I got my start in planetary science — researching NASA’s Dawn
              mission and the dwarf planet Ceres. Then I taught myself to code.
            </p>
            <p className="about-body scroll-reveal" style={delay(".18s")}>
              Since then I’ve shipped products across eight industries. The job
              never changed: go where the technology is newest, find the real
              problem, and build something that works. Today I’m doing it at the
              AI frontier — including for growing businesses, through North Star
              Pacific.
            </p>
            <p className="about-quote scroll-reveal" style={delay(".24s")}>
              “Find the real problem. Build something that works.”
            </p>
          </div>

          <div className="about-panel scroll-reveal" style={delay(".1s")}>
            <CornerTicks />
            <span className="path-label">The path</span>
            <ul className="path">
              {aboutPath.map((step) => (
                <li className="path-item" key={step.title}>
                  <span className="path-node" aria-hidden="true" />
                  <span className="path-title">{step.title}</span>
                  <span className="path-sub">{step.sub}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Audit() {
  return (
    <section className="audit" id="audit" data-screen-label="Growth Audit">
      <span className="audit-glow" aria-hidden="true" />

      <div className="audit-inner">
        <div className="audit-panel scroll-reveal" style={delay(".05s")}>
          <CornerTicks />

          <div className="audit-grid">
            <div className="audit-lead">
              <span className="audit-tag">
                <span className="audit-spark" /> Start here
              </span>

              <h2 className="audit-headline">
                Find the highest-value technology opportunity in your business —{" "}
                <span className="audit-em">
                  before you spend a dollar building anything.
                </span>
              </h2>

              <p className="audit-body">
                You don't need to know the right answer before you talk to us. In
                one focused engagement, we map where technology can create the
                most value for you — then hand you a clear, prioritized roadmap
                and a first recommended project.
              </p>

              <div className="audit-price">
                <span className="audit-price-label">The Growth Audit</span>
                <span className="audit-price-figure">
                  From <span className="num">$1,500</span>
                </span>
              </div>

              <a className="btn btn-gold" href="#book">
                Book your audit <span className="arr">→</span>
              </a>
            </div>

            <div className="audit-deliverables">
              <span className="deliv-label">What you walk away with</span>
              <ul className="checklist">
                {deliverables.map((item) => (
                  <li className="check-item" key={item}>
                    <span className="check-mark" aria-hidden="true">
                      <CheckIcon />
                    </span>
                    <span className="check-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="pricing" id="pricing" data-screen-label="Pricing">
      <div className="pricing-inner">
        <SectionTag number="04" label="Pricing" delayValue="0s" />

        <div className="price-table scroll-reveal" style={delay(".08s")}>
          {priceRows.map((row) => (
            <div
              className={`price-row${row.featured ? " is-audit" : ""}`}
              key={row.name}
            >
              <div className="pr-name">
                {row.name}
                {row.flag ? <span className="pr-flag">{row.flag}</span> : null}
              </div>
              <div className="pr-desc">{row.description}</div>
              <div className="pr-price">
                <span className="pr-from">from</span>{" "}
                <span className="pr-fig">
                  {row.price}
                  {row.period ? <span className="pr-per">{row.period}</span> : null}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="price-note scroll-reveal" style={delay(".14s")}>
          Final pricing depends on complexity, integrations, custom needs, data,
          timeline, and support level. The audit is how we scope it precisely —
          together, before you commit.
        </p>
      </div>
    </section>
  );
}

const faqItems = [
  {
    q: "Do you only do automation?",
    a: "No. We build custom apps, rebuild and modernize old software, set up marketing and CRM systems, add AI tools, build dashboards and integrations, and automate operations. Automation is one of six things we do.",
  },
  {
    q: "What if I don’t know what we actually need?",
    a: "That’s exactly what the Growth Audit is for. We find the highest-value opportunity in your business before you commit to building anything — and you keep the roadmap either way.",
  },
  {
    q: "Can you improve an app or system we already have?",
    a: "Yes. We review, redesign, rebuild, modernize, or add features to existing apps, portals, internal tools, dashboards, and workflows — you don’t have to start from scratch.",
  },
  {
    q: "Do you publish your pricing?",
    a: "Yes. We publish starting prices because you deserve clarity up front. Final pricing depends on scope, integrations, data, timeline, and support level — which the audit pins down precisely.",
  },
  {
    q: "How long does it take?",
    a: "The Growth Audit typically takes 5 to 10 business days. Build timelines depend on scope and are confirmed in a written Statement of Work before any work starts.",
  },
  {
    q: "Is our data safe with you?",
    a: "Yes. We access only what’s needed, review access and data flows before touching sensitive systems, and hand over documentation and ownership of the work. Security is part of how we deliver, not an afterthought.",
  },
  {
    q: "Do you provide ongoing support?",
    a: "Yes. Our monthly Technology Partner plans cover maintenance, optimization, reporting, and continued improvements once your system is live.",
  },
];

function Faq() {
  return (
    <section className="faq" id="faq" data-screen-label="FAQ">
      <div className="faq-inner">
        <SectionTag number="05" label="Questions" delayValue="0s" />
        <h2 className="faq-lead scroll-reveal" style={delay(".06s")}>
          Answers, before you ask.
        </h2>
        <div className="faq-list">
          {faqItems.map((item, index) => (
            <details
              className="faq-item scroll-reveal"
              style={delay(`${(0.05 + index * 0.05).toFixed(2)}s`)}
              key={item.q}
            >
              <summary className="faq-q">
                <span>{item.q}</span>
                <span className="faq-icon" aria-hidden="true" />
              </summary>
              <div className="faq-a">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta" id="start" data-screen-label="Final CTA">
      <span className="cta-glow" aria-hidden="true" />
      <svg
        className="constellation"
        viewBox="0 0 640 380"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <g className="cn-lines">
          <polyline points="92,250 196,150 320,196 300,86 430,128 520,250 596,150" />
          <polyline points="320,196 360,300 470,318" />
          <polyline points="196,150 150,70" />
        </g>
        <g className="cn-stars">
          <circle cx="92" cy="250" r="1.6" />
          <circle className="bright" cx="196" cy="150" r="2.4" />
          <circle cx="320" cy="196" r="1.8" />
          <circle className="bright" cx="300" cy="86" r="2.6" />
          <circle cx="430" cy="128" r="1.7" />
          <circle cx="520" cy="250" r="2" />
          <circle cx="596" cy="150" r="1.5" />
          <circle cx="360" cy="300" r="1.6" />
          <circle className="bright" cx="470" cy="318" r="2.2" />
          <circle cx="150" cy="70" r="1.4" />
          <circle cx="60" cy="120" r="1.2" />
          <circle cx="560" cy="60" r="1.3" />
        </g>
      </svg>

      <div className="final-cta-inner scroll-reveal" style={delay(".05s")}>
        <h2 className="cta-headline">Not sure what your business needs first?</h2>
        <p className="cta-body">
          That's exactly what the audit is for. Start there, and we'll show you
          the one technology opportunity actually worth pursuing.
        </p>
        <div className="cta-row cta-center">
          <a className="btn btn-primary" href="#book">
            Book a Growth Audit — from $1,500
          </a>
          <a className="btn btn-ghost" href="#book">
            Talk through your problem <span className="arr">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

const NEED_OPTIONS = [
  "Build a new app or tool",
  "Improve or rebuild an existing app",
  "Automate manual / repetitive work",
  "Improve marketing & lead systems",
  "Add AI tools or assistants",
  "Connect tools / build dashboards",
  "Improve customer experience",
  "Not sure yet — help me figure it out",
];

const BUDGET_OPTIONS = [
  "Just the audit (from $1,500)",
  "$2.5k–$5k",
  "$5k–$15k",
  "$15k+",
  "Ongoing monthly support",
  "Not sure yet",
];

const TIMELINE_OPTIONS = [
  "Now",
  "Within 30 days",
  "Within 90 days",
  "Later / just exploring",
];

type LeadForm = {
  name: string;
  email: string;
  business: string;
  need: string;
  pain: string;
  tools: string;
  budget: string;
  timeline: string;
  company_website: string;
};

const emptyLead: LeadForm = {
  name: "",
  email: "",
  business: "",
  need: "",
  pain: "",
  tools: "",
  budget: "",
  timeline: "",
  company_website: "",
};

type LeadStatus = "idle" | "submitting" | "success" | "invalid" | "error";

function BookAudit() {
  const [form, setForm] = useState<LeadForm>(emptyLead);
  const [status, setStatus] = useState<LeadStatus>("idle");

  const update =
    (field: keyof LeadForm) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const mailtoHref = () => {
    const subject = `Growth Audit enquiry — ${form.name || "new lead"}`;
    const lines = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Business: ${form.business}`,
      `Needs help with: ${form.need}`,
      `Budget: ${form.budget}`,
      `Timeline: ${form.timeline}`,
      `Current tools: ${form.tools}`,
      "",
      "Biggest pain:",
      form.pain,
    ];
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailLooksValid = /.+@.+\..+/.test(form.email);
    if (!form.name.trim() || !emailLooksValid || !form.need) {
      setStatus("invalid");
      return;
    }
    setStatus("submitting");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }
      setStatus("success");
      track("lead_submitted", { need: form.need || "unspecified" });
    } catch {
      setStatus("error");
    }
  };

  const firstName = form.name.trim().split(" ")[0];

  return (
    <section className="book" id="book" data-screen-label="Book your audit">
      <span className="book-glow" aria-hidden="true" />
      <div className="book-inner">
        <SectionTag number="06" label="Book your audit" delayValue="0s" />

        <div className="book-grid">
          <div className="book-lead scroll-reveal" style={delay(".06s")}>
            <h2 className="book-headline">
              Tell us what&rsquo;s going on —{" "}
              <span className="accent-cyan">
                we&rsquo;ll reply within one business day.
              </span>
            </h2>
            <p className="book-body">
              Share a little about your business and where it hurts. No
              obligation, no pressure — and you&rsquo;ll leave the audit with a
              roadmap you keep either way.
            </p>

            <ul className="book-points">
              <li className="book-point">
                <span className="check-mark" aria-hidden="true">
                  <CheckIcon />
                </span>
                <span>
                  A real person reads every message — no bots, no call center.
                </span>
              </li>
              <li className="book-point">
                <span className="check-mark" aria-hidden="true">
                  <CheckIcon />
                </span>
                <span>
                  A clear next step: a short call to scope your {AUDIT_PRICE}{" "}
                  Growth Audit.
                </span>
              </li>
              <li className="book-point">
                <span className="check-mark" aria-hidden="true">
                  <CheckIcon />
                </span>
                <span>Your details stay private — never sold, never shared.</span>
              </li>
            </ul>

            {BOOKING_URL || PAYMENT_LINK ? (
              <div className="book-alt">
                {BOOKING_URL ? (
                  <a
                    className="btn btn-ghost"
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("book_call_click")}
                  >
                    Rather pick a time? Book a call{" "}
                    <span className="arr">→</span>
                  </a>
                ) : null}
                {PAYMENT_LINK ? (
                  <a
                    className="btn btn-gold"
                    href={PAYMENT_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("payment_click")}
                  >
                    Ready now? Start your audit ({AUDIT_PRICE})
                  </a>
                ) : null}
              </div>
            ) : null}

            <p className="book-direct">
              Prefer email?{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          </div>

          <div className="book-card">
            <CornerTicks />
            {status === "success" ? (
              <div className="book-success" role="status">
                <span className="book-success-mark" aria-hidden="true">
                  <CheckIcon />
                </span>
                <h3 className="book-success-title">Message received.</h3>
                <p className="book-success-body">
                  Thanks{firstName ? `, ${firstName}` : ""} — we&rsquo;ll be in
                  touch within one business day. Keep an eye on your inbox.
                </p>
                {BOOKING_URL ? (
                  <a
                    className="btn btn-primary"
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("book_call_click")}
                  >
                    Want to go faster? Book a time now
                  </a>
                ) : null}
              </div>
            ) : (
              <form className="book-form" onSubmit={handleSubmit} noValidate>
                <div className="field-row">
                  <label className="field">
                    <span className="field-label">
                      Your name <span className="req">*</span>
                    </span>
                    <input
                      className="field-input"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={update("name")}
                      autoComplete="name"
                      aria-required="true"
                    />
                  </label>
                  <label className="field">
                    <span className="field-label">
                      Email <span className="req">*</span>
                    </span>
                    <input
                      className="field-input"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={update("email")}
                      autoComplete="email"
                      aria-required="true"
                    />
                  </label>
                </div>

                <label className="field">
                  <span className="field-label">Business name</span>
                  <input
                    className="field-input"
                    type="text"
                    name="business"
                    value={form.business}
                    onChange={update("business")}
                    autoComplete="organization"
                  />
                </label>

                <label className="field">
                  <span className="field-label">
                    What do you need help with? <span className="req">*</span>
                  </span>
                  <select
                    className="field-input"
                    name="need"
                    value={form.need}
                    onChange={update("need")}
                    aria-required="true"
                  >
                    <option value="" disabled>
                      Select one…
                    </option>
                    {NEED_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span className="field-label">
                    What&rsquo;s the biggest pain right now?
                  </span>
                  <textarea
                    className="field-input field-textarea"
                    name="pain"
                    rows={3}
                    value={form.pain}
                    onChange={update("pain")}
                    placeholder="In your words — what's slow, broken, manual, or unclear?"
                  />
                </label>

                <div className="field-row">
                  <label className="field">
                    <span className="field-label">Budget comfort</span>
                    <select
                      className="field-input"
                      name="budget"
                      value={form.budget}
                      onChange={update("budget")}
                    >
                      <option value="">Select…</option>
                      {BUDGET_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span className="field-label">Timeline</span>
                    <select
                      className="field-input"
                      name="timeline"
                      value={form.timeline}
                      onChange={update("timeline")}
                    >
                      <option value="">Select…</option>
                      {TIMELINE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="field">
                  <span className="field-label">
                    Tools you use now{" "}
                    <span className="field-opt">(optional)</span>
                  </span>
                  <input
                    className="field-input"
                    type="text"
                    name="tools"
                    value={form.tools}
                    onChange={update("tools")}
                    placeholder="CRM, scheduling, spreadsheets, website…"
                  />
                </label>

                {/* honeypot — hidden from people, catches bots */}
                <input
                  className="hp-field"
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={form.company_website}
                  onChange={update("company_website")}
                />

                <button
                  className="btn btn-gold book-submit"
                  type="submit"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? (
                    "Sending…"
                  ) : (
                    <>
                      Send &amp; start the conversation{" "}
                      <span className="arr">→</span>
                    </>
                  )}
                </button>

                {status === "invalid" ? (
                  <p className="book-error" role="alert">
                    Please add your name, a valid email, and what you need help
                    with.
                  </p>
                ) : null}
                {status === "error" ? (
                  <p className="book-error" role="alert">
                    Couldn&rsquo;t submit automatically.{" "}
                    <a href={mailtoHref()}>Click here to email us instead</a> —
                    your answers come along.
                  </p>
                ) : null}

                <p className="book-fineprint">
                  By submitting, you agree to our{" "}
                  <a
                    href="/privacy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer" id="contact" data-screen-label="Footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="wordmark">
              <svg className="star-mark" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 1 14.1 9.9 23 12 14.1 14.1 12 23 9.9 14.1 1 12 9.9 9.9Z" />
              </svg>
              <span>North Star Pacific</span>
            </div>
            <p className="footer-line">
              Business technology for growing businesses. We find the gap, build
              the system, and move the business forward.
            </p>
          </div>

          <nav className="footer-nav" aria-label="Footer">
            <a href="#capabilities">What we do</a>
            <a href="#process">How we work</a>
            <a href="#trust">Why us</a>
            <a href="#about">About</a>
            <a href="#pricing">Pricing</a>
            <a href="#book">Book an audit</a>
            <a href="/privacy.html">Privacy</a>
            <a href="/terms.html">Terms</a>
          </nav>
        </div>

        <div className="footer-bottom">
          <span className="copyright">© 2026 North Star Pacific</span>
          <span className="footer-tagline">
            FIND THE GAP · BUILD THE SYSTEM · GROW WITH CLARITY
          </span>
        </div>
      </div>
    </footer>
  );
}

function SectionTag({
  number,
  label,
  delayValue,
}: {
  number?: string;
  label: string;
  delayValue: string;
}) {
  return (
    <span className="section-tag scroll-reveal" style={delay(delayValue)}>
      {number ? <span className="num">{number}</span> : null}
      <span className="tick" /> {label}
    </span>
  );
}

function FeatureCard({ card }: { card: CardContent }) {
  return (
    <article className="card scroll-reveal" style={delay(card.delay)}>
      <CornerTicks />
      <div className="card-icon" aria-hidden="true">
        {card.icon}
      </div>
      <h3 className="card-title">{card.title}</h3>
      <p className="card-copy">{card.copy}</p>
    </article>
  );
}

function CornerTicks() {
  return (
    <>
      <i className="ct tl" />
      <i className="ct tr" />
      <i className="ct bl" />
      <i className="ct br" />
    </>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <polyline points="8 7 3 12 8 17" />
      <polyline points="16 7 21 12 16 17" />
      <line x1="13.5" y1="5" x2="10.5" y2="19" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M3.5 12a8.5 8.5 0 0 1 14.4-6.2" />
      <polyline points="18.5 2.5 18.5 6 15 6" />
      <path d="M20.5 12a8.5 8.5 0 0 1-14.4 6.2" />
      <polyline points="5.5 21.5 5.5 18 9 18" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <polyline points="3 16 9 10 13 14 21 6" />
      <polyline points="15 6 21 6 21 12" />
    </svg>
  );
}

function AutomationIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3.2" />
      <line x1="12" y1="3.4" x2="12" y2="5.6" />
      <line x1="12" y1="18.4" x2="12" y2="20.6" />
      <line x1="3.4" y1="12" x2="5.6" y2="12" />
      <line x1="18.4" y1="12" x2="20.6" y2="12" />
      <line x1="5.9" y1="5.9" x2="7.5" y2="7.5" />
      <line x1="16.5" y1="16.5" x2="18.1" y2="18.1" />
      <line x1="18.1" y1="5.9" x2="16.5" y2="7.5" />
      <line x1="7.5" y1="16.5" x2="5.9" y2="18.1" />
    </svg>
  );
}

function AiIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="7.5" y="7.5" width="9" height="9" rx="1.6" />
      <rect x="10.2" y="10.2" width="3.6" height="3.6" rx="0.6" />
      <line x1="10" y1="7.5" x2="10" y2="5" />
      <line x1="14" y1="7.5" x2="14" y2="5" />
      <line x1="10" y1="19" x2="10" y2="16.5" />
      <line x1="14" y1="19" x2="14" y2="16.5" />
      <line x1="7.5" y1="10" x2="5" y2="10" />
      <line x1="7.5" y1="14" x2="5" y2="14" />
      <line x1="19" y1="10" x2="16.5" y2="10" />
      <line x1="19" y1="14" x2="16.5" y2="14" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <line x1="4" y1="20" x2="20" y2="20" />
      <rect x="6" y="12" width="3.2" height="6" />
      <rect x="10.4" y="8" width="3.2" height="10" />
      <rect x="14.8" y="14.5" width="3.2" height="3.5" />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="9" r="5" />
      <path d="M9 13.4 7.4 21 12 18.4 16.6 21 15 13.4" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <polygon points="15.6 8.4 10.8 10.8 8.4 15.6 13.2 13.2" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M14 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z" />
      <polyline points="14 3.5 14 8.5 19 8.5" />
      <polyline points="8.8 14.3 10.8 16.3 15 11.8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default App;
