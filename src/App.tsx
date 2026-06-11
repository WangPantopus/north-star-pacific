import { type CSSProperties, type ReactNode, useRef, useState } from "react";
import { useScatter } from "./canvas/useScatter";
import { useSky } from "./canvas/useSky";
import { useScrollReveal } from "./useScrollReveal";
import {
  AUDIT_PRICE,
  BOOKING_URL,
  CONTACT_EMAIL,
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
  { label: "What We Do", href: "#capabilities" },
  { label: "The Audit", href: "#audit" },
  { label: "Process", href: "#process" },
  { label: "Work", href: "#work" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const capabilityCards: CardContent[] = [
  {
    title: "AI in your product",
    copy: "Ship AI features that work in production: copilots, search, recommendations, generation, agents — built into your real product, not a demo.",
    icon: <AiIcon />,
    delay: ".05s",
  },
  {
    title: "AI in your operations",
    copy: "Put AI on the busywork drowning your team: support, intake, ops, reporting, back-office — automated and wired into your tools.",
    icon: <AutomationIcon />,
    delay: ".11s",
  },
  {
    title: "AI for your customers",
    copy: "AI that handles customer conversations, support, and onboarding around the clock — accurate, on-brand, and safe with your data.",
    icon: <DocumentIcon />,
    delay: ".17s",
  },
  {
    title: "AI on your data",
    copy: "Turn the data you're sitting on into answers and decisions: dashboards, insights, and AI that actually understands your business.",
    icon: <DashboardIcon />,
    delay: ".05s",
  },
  {
    title: "Automations & integrations",
    copy: "Connect your stack and remove the manual handoffs, so AI and your existing tools run as one system.",
    icon: <RefreshIcon />,
    delay: ".11s",
  },
  {
    title: "From pilot to production",
    copy: "Have an AI prototype that never shipped? We take it the last mile — reliability, scale, security, and into real use.",
    icon: <CompassIcon />,
    delay: ".17s",
  },
];

const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Diagnose",
    copy: "We map where AI can move revenue, speed, or cost across your product and operations.",
    delay: ".05s",
  },
  {
    number: "02",
    title: "Prioritize",
    copy: "We score every opportunity by impact and effort, with an honest buy/build/wait call.",
    delay: ".14s",
  },
  {
    number: "03",
    title: "Build",
    copy: "We build the highest-leverage one into production, wired into your real tools and data.",
    delay: ".23s",
  },
  {
    number: "04",
    title: "Launch",
    copy: "We make it reliable, get your team using it, and put it in front of your customers.",
    delay: ".32s",
  },
  {
    number: "05",
    title: "Optimize",
    copy: "We measure what it moved, and improve from there.",
    delay: ".41s",
  },
];

const trustCards: CardContent[] = [
  {
    title: "Built by an engineer who's shipped at Meta, Apple & LinkedIn",
    copy: "Production AI built by someone who's shipped real software at scale, not a deck-and-prompts shop.",
    icon: <MedalIcon />,
    delay: ".12s",
  },
  {
    title: "We build and ship — we don't present",
    copy: "Most AI consultants hand you a strategy. We hand you a working system, wired into your business and live in production.",
    icon: <CompassIcon />,
    delay: ".19s",
  },
  {
    title: "Honest buy / build / wait advice",
    copy: "We'll tell you what's worth building, what to just buy, and what to skip. The roadmap is yours either way.",
    icon: <DocumentIcon />,
    delay: ".26s",
  },
];

const deliverables = [
  "A map of where AI can move revenue, speed, or cost across your business",
  "The 1–3 highest-leverage opportunities, ranked by impact and effort",
  "A concrete build plan for the top one — what we'd build, how it fits your stack, real cost and timeline",
  "An honest buy / build / wait call on each",
  "A 30- and 90-day roadmap",
];

const priceRows: PriceRow[] = [
  {
    name: "AI Opportunity Audit",
    description:
      "The 1–3 highest-leverage AI opportunities + a build plan — the front door",
    price: "$2,500",
    featured: true,
  },
  {
    name: "AI Quick Build",
    description:
      "One focused AI feature or automation, shipped to production",
    price: "$8,000",
  },
  {
    name: "AI Build Sprint",
    description:
      "A meaningful AI system built into your product or operations",
    price: "$20,000",
  },
  {
    name: "Custom AI Build",
    description:
      "A substantial, fully-integrated, production-grade AI capability",
    price: "$40,000",
  },
  {
    name: "AI Partner",
    description: "Ongoing AI building, optimization, and support",
    price: "$4,000",
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
        <UseCases />
        <Process />
        <Trust />
        <Work />
        <About />
        <ScanBanner />
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
  const headerCtaHref = BOOKING_URL || "#book";
  const headerCtaExternal = Boolean(BOOKING_URL);

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
          <a
            className="header-cta"
            href={headerCtaHref}
            onClick={closeMenu}
            {...(headerCtaExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <span className="cta-full">Book an AI Opportunity Audit</span>
            <span className="cta-short">Book an AI Opportunity Audit</span>
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
          <a
            className="mobile-nav-cta"
            href={headerCtaHref}
            onClick={closeMenu}
            {...(headerCtaExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            Book an AI Opportunity Audit
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
            AI, BUILT INTO YOUR BUSINESS — AND SHIPPED
          </span>

          <h1 className="headline reveal" style={delay(".25s")}>
            Put AI to work where it{" "}
            <span className="grow">actually moves</span> your revenue, speed,
            and cost.
          </h1>

          <p className="subhead reveal" style={delay(".45s")}>
            We build AI into funded startups and growing companies — wired into
            your real product, workflows, and data, and shipped to production.
            Not strategy decks. Not prompt packs. Working systems, built by an
            engineer who&rsquo;s shipped at Meta, Apple, and LinkedIn.
          </p>

          <div className="cta-row reveal" style={delay(".6s")}>
            <a className="btn btn-primary" href="#book">
              Book an AI Opportunity Audit
            </a>
            <a className="btn btn-ghost" href="/scan">
              Take the 5-minute Scan <span className="arr">→</span>
            </a>
          </div>

          <div className="microcopy reveal" style={delay(".75s")}>
            <span>A clear, prioritized plan before we build a thing.</span>
            <span className="sep">/</span>
            <span>Honest buy/build/wait advice.</span>
            <span className="sep">/</span>
            <span>No hype.</span>
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
            Most growing companies don&rsquo;t have an AI strategy problem. They
            have an AI shipping problem.
          </h2>

          <div className="maybes">
            <p className="maybe scroll-reveal" style={delay(".15s")}>
              There are decks. There are pilots. There&rsquo;s a Slack channel
              full of ideas — and almost nothing actually running in production,
              moving a real number.
            </p>
            <p className="maybe scroll-reveal" style={delay(".25s")}>
              Meanwhile your team is buried in work AI could absorb, and your
              competitors are starting to ship.
            </p>
          </div>

          <p className="closing scroll-reveal" style={delay(".35s")}>
            We close the gap between{" "}
            <span className="accent-gold">
              &ldquo;we should be using AI&rdquo;
            </span>{" "}
            and{" "}
            <span className="accent-gold">
              &ldquo;it&rsquo;s live, and it&rsquo;s working.&rdquo;
            </span>
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
      data-screen-label="What we build"
    >
      <div className="cap-inner">
        <SectionTag number="01" label="What we build" delayValue="0s" />

        <h2 className="trust-lead scroll-reveal" style={delay(".05s")}>
          What we build
        </h2>

        <div className="cap-grid">
          {capabilityCards.map((card) => (
            <FeatureCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

const useCaseStatements = [
  "Your team is slammed, and AI could absorb half the busywork — but no one has time to build it.",
  "You shipped an impressive AI demo, and it's still just a demo.",
  "Your competitors are shipping AI features while you're still trading slides.",
  "You're sitting on data you can't turn into decisions.",
  "You know AI belongs in your product and your ops — you just need someone who can actually build it.",
  "You've tried a few AI tools, but nothing's wired into how you really work.",
];

function UseCases() {
  return (
    <section
      className="capabilities use-cases"
      id="use-cases"
      data-screen-label="Is this you?"
    >
      <div className="cap-inner">
        <h2 className="trust-lead scroll-reveal" style={delay(".05s")}>
          Is this you?
        </h2>

        <div className="cap-grid">
          {useCaseStatements.map((statement, index) => (
            <article
              className="card scroll-reveal"
              style={delay(`${(0.05 + index * 0.06).toFixed(2)}s`)}
              key={statement}
            >
              <CornerTicks />
              <p className="card-copy">{statement}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section
      className="process"
      id="process"
      data-screen-label="How AI becomes business capability"
    >
      <div className="process-inner">
        <SectionTag
          number="02"
          label="HOW IT WORKS"
          delayValue="0s"
        />

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
          New name.{" "}
          <span className="accent-gold">The people behind it aren&rsquo;t.</span>
        </h2>

        <div className="trust-grid">
          {trustCards.map((card) => (
            <FeatureCard key={card.title} card={card} />
          ))}
        </div>

        <div className="trust-cta scroll-reveal" style={delay(".3s")}>
          <a className="sample-link" href="/sample-audit">
            <span className="sl-lead">See exactly what you get</span>
            <span className="sl-arr">→</span>
            <span className="sl-main">View a sample AI Opportunity Audit</span>
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
    title: "Production engineering",
    sub: "large-scale software, APIs, data systems, and cloud infrastructure",
  },
  {
    title: "Across industries",
    sub: "Meta · Apple · LinkedIn · TuSimple · Nike · Futu",
  },
  {
    title: "North Star Pacific",
    sub: "AI implementation, workflow automation, and production shipping",
  },
];

function Work() {
  return (
    <section className="work" id="work" data-screen-label="Work">
      <div className="work-inner">
        <SectionTag label="Work" delayValue="0s" />

        <p className="work-intro scroll-reveal" style={delay(".05s")}>
          We say we build and ship. Here&rsquo;s the proof, growing as we do.
        </p>

        <div className="work-grid">
          <article className="card work-card scroll-reveal" style={delay(".12s")}>
            <CornerTicks />
            <span className="work-card-tag">Shipped · Live</span>
            <h3 className="card-title">The AI Opportunity Scan</h3>
            <p className="card-copy">
              A self-serve assessment that maps a company&rsquo;s
              highest-leverage AI opportunities in five minutes — the same
              scoring model our audit uses, running in production on this site.
            </p>
            <a className="work-card-cta" href="/scan">
              Try it live <span className="arr">→</span>
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}

function ScanBanner() {
  return (
    <section
      className="scan-banner"
      id="scan-banner"
      data-screen-label="AI Opportunity Scan"
    >
      <div className="scan-banner-inner">
        <article className="card scan-banner-card scroll-reveal" style={delay(".05s")}>
          <CornerTicks />
          <p className="scan-banner-eyebrow">NOT READY FOR THE AUDIT?</p>
          <p className="scan-banner-line">
            Take the 5-minute AI Opportunity Scan — see your top AI
            opportunity, free.
          </p>
          <a className="btn btn-ghost scan-banner-cta" href="/scan">
            Take the scan <span className="arr">→</span>
          </a>
        </article>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about" id="about" data-screen-label="About">
      <div className="about-inner">
        <SectionTag label="Who’s behind it" delayValue="0s" />

        <div className="about-grid">
          <div className="about-lead">
            <h2 className="about-headline scroll-reveal" style={delay(".05s")}>
              Built by an engineer who knows the difference between a demo and a{" "}
              <span className="accent-gold">dependable system.</span>
            </h2>
            <p className="about-body scroll-reveal" style={delay(".12s")}>
              I began in planetary science, researching NASA&rsquo;s Dawn mission
              and the dwarf planet Ceres. Then I taught myself software
              engineering and started building production systems.
            </p>
            <p className="about-body scroll-reveal" style={delay(".18s")}>
              Since then, I have worked on software and data systems across
              organizations including Meta, Apple, LinkedIn, TuSimple, Nike, and
              Futu. North Star Pacific brings that
              engineering discipline to shipping AI: find the real business
              problem, choose the right tool, build what matters, and make sure
              people can actually use it.
            </p>
            <p className="about-quote scroll-reveal" style={delay(".24s")}>
              &ldquo;Find the real problem. Build the right system. Make it
              useful.&rdquo;
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
    <section className="audit" id="audit" data-screen-label="AI Opportunity Audit">
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
                Find the one to three places AI will{" "}
                <span className="audit-em">actually move your numbers</span> —
                with a real plan to build them.
              </h2>

              <p className="audit-body">
                Before anyone builds anything, we map where AI can genuinely pay
                off across your product and operations, score the opportunities
                by impact and effort, and give you an honest buy/build/wait call
                on each. You leave with a prioritized roadmap and a concrete
                build plan for the highest-leverage one — whether or not you
                build it with us.
              </p>

              <div className="audit-price">
                <span className="audit-price-figure">
                  From <span className="num">{AUDIT_PRICE}</span>
                </span>
              </div>

              <a className="btn btn-gold" href="#book">
                Book your AI Opportunity Audit <span className="arr">→</span>
              </a>
            </div>

            <div className="audit-deliverables">
              <span className="deliv-label">What you get</span>
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
          Final pricing depends on scope, integrations, data, timeline, and how
          production-critical the system is. The audit is how we scope it
          precisely — together, before you commit.
        </p>
      </div>
    </section>
  );
}

const faqItems = [
  {
    q: "Do you actually build, or just advise?",
    a: "We build. The audit produces the plan; the builds produce working systems wired into your product, tools, and data — live in production. If all you want is the plan, the audit stands on its own and the roadmap is yours.",
  },
  {
    q: "What exactly does the AI Opportunity Audit include?",
    a: "A map of where AI can move revenue, speed, or cost across your product and operations; the 1–3 highest-leverage opportunities scored by impact and effort; a concrete build plan for the top one with real cost and timeline; an honest buy/build/wait call on each; and a 30- and 90-day roadmap.",
  },
  {
    q: "What if we'd be better off buying a tool instead of building?",
    a: "Then that's what we'll tell you. Some problems are solved by an off-the-shelf product, and pretending otherwise would waste your money and our credibility. The buy/build/wait call is the core of the audit — and it's yours whether or not you build with us.",
  },
  {
    q: "Who actually does the work?",
    a: "An engineer who's shipped production software at Meta, Apple, and LinkedIn — not a strategy layer that hands the build to someone you've never met. You work directly with the person building your system.",
  },
  {
    q: "We have an AI prototype that never shipped. Can you finish it?",
    a: "Yes — that's one of the most common situations we see, and one of the fastest paths to production value. The expensive thinking is usually done; what's missing is reliability, integration, and the last mile into real use. That's exactly what we do.",
  },
  {
    q: "How do you handle our data and security?",
    a: "Your data stays in your systems and your accounts wherever possible; we build inside your stack, not on top of a copy of it. Access is scoped and revocable, sensitive data is handled under whatever compliance constraints you operate in, and we'll tell you plainly when a use case carries risk we think you shouldn't take.",
  },
  {
    q: "How fast can something be live?",
    a: "The audit takes days, not months. A focused Quick Build typically ships in weeks. Larger systems are scoped honestly in the audit — with a real timeline, before you commit.",
  },
  {
    q: "What stack do you work with?",
    a: "Yours. The point is AI wired into the tools, data, and product you already run — CRMs, helpdesks, databases, internal apps, your codebase. If something in your stack genuinely blocks the build, the audit will say so and price the fix.",
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
        <h2 className="cta-headline">
          Not sure where AI actually pays off in your business?
        </h2>
        <p className="cta-body">
          That&rsquo;s exactly what the audit is for. We&rsquo;ll find the one
          to three places worth building — and show you what it takes to ship
          them.
        </p>
        <div className="cta-row cta-center">
          <a className="btn btn-primary" href="#book">
            Book an AI Opportunity Audit
          </a>
          <a className="btn btn-ghost" href="#book">
            Talk through your AI goals <span className="arr">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

const NEED_OPTIONS = [
  "Find and prioritize AI opportunities",
  "Put AI to work across our team",
  "Automate a business workflow",
  "Build an AI feature or internal tool",
  "Move an AI prototype into production",
  "Connect data and existing systems",
  "Rebuild or upgrade an existing app",
  "Not sure yet — help me figure it out",
];

const AI_STAGE_OPTIONS = [
  "Not using AI yet",
  "Individuals are experimenting",
  "A few team workflows use AI",
  "We have one or more pilots",
  "We have AI in production",
  "Not sure",
];

const BUDGET_OPTIONS = [
  "AI Opportunity Audit only (from $2.5k)",
  "$5k–$10k",
  "$10k–$25k",
  "$25k–$50k",
  "$50k+",
  "Ongoing monthly partnership",
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
  aiStage: string;
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
  aiStage: "",
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
    const subject = `AI opportunity enquiry — ${form.name || "new lead"}`;
    const lines = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Business: ${form.business}`,
      `Needs help with: ${form.need}`,
      `Current AI stage: ${form.aiStage}`,
      `Budget: ${form.budget}`,
      `Timeline: ${form.timeline}`,
      `Current tools: ${form.tools}`,
      "",
      "Business problem or opportunity:",
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
    <section className="book" id="book" data-screen-label="Start a conversation">
      <span className="book-glow" aria-hidden="true" />
      <div className="book-inner">
        <SectionTag number="06" label="Start a conversation" delayValue="0s" />

        <div className="book-grid">
          <div className="book-lead scroll-reveal" style={delay(".06s")}>
            <h2 className="book-headline">
              Tell us where your business is trying to create value with AI.
            </h2>
            <p className="book-body">
              Share what is slow, repetitive, expensive, hard to scale, or stuck
              as an experiment. We will reply within one business day and tell
              you whether a short call, a focused audit, an off-the-shelf tool,
              or a build makes sense.
            </p>

            <ul className="book-points">
              <li className="book-point">
                <span className="check-mark" aria-hidden="true">
                  <CheckIcon />
                </span>
                <span>The founder reviews every message.</span>
              </li>
              <li className="book-point">
                <span className="check-mark" aria-hidden="true">
                  <CheckIcon />
                </span>
                <span>
                  The first call is about the business problem, not pushing a
                  predetermined solution.
                </span>
              </li>
              <li className="book-point">
                <span className="check-mark" aria-hidden="true">
                  <CheckIcon />
                </span>
                <span>
                  If an audit makes sense, we define the scope and price before
                  you commit.
                </span>
              </li>
            </ul>

            {BOOKING_URL ? (
              <div className="book-alt">
                <a
                  className="btn btn-ghost"
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("book_call_click")}
                >
                  Book an AI Opportunity Audit <span className="arr">→</span>
                </a>
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
                    Book an AI Opportunity Audit
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
                  <span className="field-label">Where are you today with AI?</span>
                  <select
                    className="field-input"
                    name="aiStage"
                    value={form.aiStage}
                    onChange={update("aiStage")}
                  >
                    <option value="">Select…</option>
                    {AI_STAGE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span className="field-label">
                    What business problem or opportunity should we understand?
                  </span>
                  <textarea
                    className="field-input field-textarea"
                    name="pain"
                    rows={3}
                    value={form.pain}
                    onChange={update("pain")}
                    placeholder="What is slow, repetitive, expensive, hard to scale, or stuck as a pilot? What result would matter?"
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
                    placeholder="ChatGPT, Copilot, Claude, Gemini, CRM, help desk, spreadsheets, data warehouse…"
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
                      Send and start the conversation{" "}
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
              AI, built into your business — and shipped.
            </p>
          </div>

          <nav className="footer-nav" aria-label="Footer">
            <a href="#capabilities">What We Do</a>
            <a href="#audit">The Audit</a>
            <a href="#process">Process</a>
            <a href="#work">Work</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href="/privacy.html">Privacy</a>
            <a href="/terms.html">Terms</a>
          </nav>
        </div>

        <div className="footer-bottom">
          <span className="copyright">© 2026 North Star Pacific</span>
          <span className="footer-tagline">
            FIND IT. BUILD IT. SHIP IT.
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
