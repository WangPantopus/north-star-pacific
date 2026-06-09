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
  { label: "What we do", href: "#capabilities" },
  { label: "How it works", href: "#process" },
  { label: "AI Audit", href: "#audit" },
  { label: "Why us", href: "#trust" },
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const capabilityCards: CardContent[] = [
  {
    title: "AI Opportunity & Readiness",
    copy: "Map high-value use cases across product and operations. Rank them by impact, effort, risk, data readiness, and adoption requirements, with honest buy / build / wait recommendations.",
    icon: <CompassIcon />,
    delay: ".05s",
  },
  {
    title: "Team AI Enablement",
    copy: "Give each team approved tools, role-specific training, playbooks, guardrails, and human-review practices so AI becomes a repeatable capability instead of individual experimentation.",
    icon: <MedalIcon />,
    delay: ".11s",
  },
  {
    title: "AI Workflow Automation",
    copy: "Automate repetitive work in sales, service, intake, operations, reporting, proposals, documents, and back-office processes, connected to the tools your team already uses.",
    icon: <AutomationIcon />,
    delay: ".17s",
  },
  {
    title: "Custom AI & Business Software",
    copy: "Build copilots, knowledge assistants, search, recommendations, customer features, internal tools, portals, and apps when off-the-shelf products are not enough.",
    icon: <AiIcon />,
    delay: ".05s",
  },
  {
    title: "Data, Integrations & Modernization",
    copy: "Connect systems, improve data access, modernize outdated apps, and remove technical bottlenecks that prevent AI and automation from working reliably.",
    icon: <RefreshIcon />,
    delay: ".11s",
  },
  {
    title: "Production Launch & Optimization",
    copy: "Take ideas and pilots into dependable use with testing, security controls, documentation, team rollout, adoption tracking, KPI measurement, and ongoing improvement.",
    icon: <DashboardIcon />,
    delay: ".17s",
  },
];

const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    copy: "We map business goals, workflows, current AI usage, tools, data, and constraints.",
    delay: ".05s",
  },
  {
    number: "02",
    title: "Prioritize",
    copy: "We score opportunities by business impact, effort, risk, readiness, and adoption, then recommend buy, build, or wait.",
    delay: ".14s",
  },
  {
    number: "03",
    title: "Enable",
    copy: "We establish approved tools, guardrails, ownership, role-specific training, and practical playbooks.",
    delay: ".23s",
  },
  {
    number: "04",
    title: "Implement",
    copy: "We integrate or build the highest-value workflow or system and make it dependable for real use.",
    delay: ".32s",
  },
  {
    number: "05",
    title: "Launch & measure",
    copy: "We support rollout, establish baselines, track adoption and business results, and improve from there.",
    delay: ".41s",
  },
];

const trustCards: CardContent[] = [
  {
    title: "Founder-led production engineering",
    copy: "Led by an engineer with production software experience at the U.S. Army, Expedia, Meta, Apple, and LinkedIn, focused on reliable systems rather than flashy demos.",
    icon: <MedalIcon />,
    delay: ".12s",
  },
  {
    title: "Advice that can become working software",
    copy: "We can assess, train, integrate, modernize, and build, so the roadmap does not stop at a slide deck.",
    icon: <CompassIcon />,
    delay: ".19s",
  },
  {
    title: "Designed for adoption and results",
    copy: "Every engagement includes clear ownership, documentation, guardrails, team enablement, and success measures. You keep the work either way.",
    icon: <DocumentIcon />,
    delay: ".26s",
  },
];

const deliverables = [
  "A map of current AI usage, tools, workflows, data, and bottlenecks",
  "The 1–3 highest-value AI opportunities, ranked by impact, effort, risk, and readiness",
  "An honest buy / build / wait recommendation for each priority",
  "A concrete implementation plan for the top opportunity",
  "Team enablement, governance, and adoption requirements",
  "Success metrics, budget range, timeline, and a 30- and 90-day roadmap",
];

const priceRows: PriceRow[] = [
  {
    name: "AI Opportunity Audit",
    description:
      "A focused opportunity, readiness, and implementation roadmap for one business area.",
    price: "$2,500",
    flag: "The front door",
    featured: true,
  },
  {
    name: "AI Team Enablement Sprint",
    description:
      "Role-based training, approved tools, playbooks, guardrails, and first repeatable workflows.",
    price: "$5,000",
  },
  {
    name: "AI Workflow Quick Build",
    description:
      "One focused automation, assistant, integration, or AI feature shipped into real use.",
    price: "$8,000",
  },
  {
    name: "AI Implementation Sprint",
    description:
      "A meaningful AI system or modernization project across workflows, apps, data, and integrations.",
    price: "$20,000",
  },
  {
    name: "Custom AI / Business System",
    description:
      "A substantial production system, customer feature, internal platform, or app rebuild.",
    price: "$40,000",
  },
  {
    name: "AI Operating Partner",
    description:
      "Ongoing enablement, implementation, governance, monitoring, optimization, and support.",
    price: "$5,000",
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
            <span className="cta-full">Book an AI Opportunity Call</span>
            <span className="cta-short">Book an AI Opportunity Call</span>
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
            Book an AI Opportunity Call
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
            AI enablement + implementation for growing companies
          </span>

          <h1 className="headline reveal" style={delay(".25s")}>
            Turn AI from scattered experiments into a{" "}
            <span className="grow">working part of your business.</span>
          </h1>

          <p className="subhead reveal" style={delay(".45s")}>
            North Star Pacific helps growing companies find high-value AI
            opportunities, train teams, automate workflows, and build production
            systems that improve revenue, productivity, and customer
            experience. When existing apps, data, or integrations stand in the
            way, we modernize those too.
          </p>

          <div className="cta-row reveal" style={delay(".6s")}>
            <a className="btn btn-primary" href="#book">
              Book an AI Opportunity Call
            </a>
            <a className="btn btn-ghost" href="#capabilities">
              See how we help <span className="arr">→</span>
            </a>
          </div>

          <div className="microcopy reveal" style={delay(".75s")}>
            <span>Clear priorities before any build.</span>
            <span className="sep">/</span>
            <span>Honest buy, build, or wait advice.</span>
            <span className="sep">/</span>
            <span>Training, implementation, and measurement.</span>
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
            Most companies do not have an AI tool problem. They have an adoption
            and implementation problem.
          </h2>

          <div className="maybes">
            <p className="maybe scroll-reveal" style={delay(".15s")}>
              Your employees are experimenting, but useful practices are not
              spreading.
            </p>
            <p className="maybe scroll-reveal" style={delay(".25s")}>
              Promising ideas are stuck in pilots, prompt documents, or one
              person&rsquo;s account.
            </p>
            <p className="maybe scroll-reveal" style={delay(".35s")}>
              Important workflows still depend on repetitive work and
              disconnected tools.
            </p>
            <p className="maybe scroll-reveal" style={delay(".45s")}>
              Your existing apps and data are not ready for the AI experience you
              want.
            </p>
            <p className="maybe scroll-reveal" style={delay(".55s")}>
              Leadership cannot see which AI efforts create value, introduce
              risk, or deserve investment.
            </p>
          </div>

          <p className="closing scroll-reveal" style={delay(".65s")}>
            We close the gap between{" "}
            <span className="accent-cyan">&ldquo;we should use AI&rdquo;</span>{" "}
            and{" "}
            <span className="accent-cyan">
              &ldquo;our team uses it, it works, and we can measure the
              result.&rdquo;
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
      data-screen-label="What we do"
    >
      <div className="cap-inner">
        <SectionTag number="01" label="What we do" delayValue="0s" />

        <h2 className="trust-lead scroll-reveal" style={delay(".05s")}>
          From opportunity to adoption to production.
        </h2>
        <p className="about-body scroll-reveal" style={delay(".1s")}>
          We help you choose the right use cases, prepare your people and
          systems, and implement what is worth doing. AI is the wedge, but the
          work may include training, automation, integrations, app
          modernization, data improvements, and custom software.
        </p>

        <div className="cap-grid">
          {capabilityCards.map((card) => (
            <FeatureCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

const useCaseExamples = [
  {
    title: "Sales & marketing",
    copy: "Research, proposal drafts, lead qualification, CRM updates, campaign and follow-up workflows",
  },
  {
    title: "Customer service",
    copy: "Knowledge assistants, ticket triage, response drafts, onboarding, and support automation",
  },
  {
    title: "Operations",
    copy: "Intake, document processing, approvals, scheduling, status updates, and reporting",
  },
  {
    title: "Company knowledge",
    copy: "Secure search across policies, SOPs, documents, and internal systems",
  },
  {
    title: "Product & software",
    copy: "Copilots, semantic search, recommendations, generation, and agent-assisted workflows",
  },
  {
    title: "Leadership & data",
    copy: "Natural-language analysis, recurring summaries, anomaly detection, and decision support",
  },
];

function UseCases() {
  return (
    <section
      className="capabilities use-cases"
      id="use-cases"
      data-screen-label="Common use cases"
    >
      <div className="cap-inner">
        <h2 className="trust-lead scroll-reveal" style={delay(".05s")}>
          Common places we put AI to work
        </h2>

        <div className="cap-grid">
          {useCaseExamples.map((item, index) => (
            <article
              className="card scroll-reveal"
              style={delay(`${(0.05 + index * 0.06).toFixed(2)}s`)}
              key={item.title}
            >
              <CornerTicks />
              <h3 className="card-title">{item.title}</h3>
              <p className="card-copy">{item.copy}</p>
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
          label="How AI becomes business capability"
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
          AI advice is easy.{" "}
          <span className="accent-cyan">
            Making it work inside a real business is harder.
          </span>
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
            <span className="sl-main">See the AI Opportunity Audit</span>
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
    sub: "Meta · Apple · LinkedIn · U.S. Army · TuSimple · Expedia · Nike · Futu",
  },
  {
    title: "North Star Pacific",
    sub: "AI enablement, workflow automation, and production implementation",
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
              Built by an engineer who knows the difference between a demo and a{" "}
              <span className="accent-cyan">dependable system.</span>
            </h2>
            <p className="about-body scroll-reveal" style={delay(".12s")}>
              I began in planetary science, researching NASA&rsquo;s Dawn mission
              and the dwarf planet Ceres. Then I taught myself software
              engineering and started building production systems.
            </p>
            <p className="about-body scroll-reveal" style={delay(".18s")}>
              Since then, I have worked on software and data systems across
              organizations including Meta, Apple, LinkedIn, the U.S. Army,
              TuSimple, Expedia, Nike, and Futu. North Star Pacific brings that
              engineering discipline to AI adoption: find the real business
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
                Find where AI can create measurable value, and what it will take
                to{" "}
                <span className="audit-em">make it work.</span>
              </h2>

              <p className="audit-body">
                In one focused engagement, we review your goals, workflows, tools,
                data, current AI usage, and team readiness. We rank the
                opportunities, give honest buy / build / wait recommendations,
                and create a practical plan for the best first move.
              </p>

              <div className="audit-price">
                <span className="audit-price-label">The AI Opportunity Audit</span>
                <span className="audit-price-figure">
                  From <span className="num">{AUDIT_PRICE}</span>
                </span>
              </div>

              <p className="audit-body audit-scope-note">
                The {AUDIT_PRICE} starting scope covers one business function or
                another clearly bounded area. Multi-department and company-wide
                assessments are quoted separately.
              </p>

              <a className="btn btn-gold" href="#book">
                Discuss your AI Opportunity Audit <span className="arr">→</span>
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
          Starting prices reflect common scopes. Final pricing depends on the
          business area, number of stakeholders, data and integrations, security
          requirements, production criticality, timeline, and adoption support.
          The AI Opportunity Audit is how we establish the right first scope
          before you commit to a larger build.
        </p>
      </div>
    </section>
  );
}

const faqItems = [
  {
    q: "Do you only work on AI?",
    a: "AI enablement and implementation is our primary focus. We also modernize apps, connect systems, build custom software, improve data access, and automate operations when those capabilities are needed to make AI or another high-value workflow succeed.",
  },
  {
    q: "What if we do not know where AI belongs in our business?",
    a: "That is exactly what the AI Opportunity Audit is for. We review your goals, workflows, tools, data, and current AI usage, then rank the best opportunities and give an honest buy / build / wait recommendation for each priority.",
  },
  {
    q: "Do you only advise, or do you also build?",
    a: "We do both. We can identify opportunities, create the roadmap, train your team, configure existing products, integrate your systems, modernize software, and build production AI or custom business tools when off-the-shelf options are not enough.",
  },
  {
    q: "Can you train our team and improve AI adoption?",
    a: "Yes. We provide role-specific training, approved-tool guidance, practical playbooks, reusable workflows, human-review standards, and rollout support so useful AI practices spread beyond a few early adopters.",
  },
  {
    q: "Can you improve an app, system, or AI pilot we already have?",
    a: "Yes. We can review, redesign, modernize, integrate, or rebuild existing apps and internal tools. We can also take an AI prototype or pilot through the reliability, data, security, adoption, and measurement work required for production use.",
  },
  {
    q: "How do you handle data security and AI risk?",
    a: "We begin with a review of data, access, and tool requirements. We minimize permissions, prefer client-owned and business-grade accounts, define what information may or may not be sent to AI systems, document human-review requirements, and scope any industry-specific security or compliance needs before implementation.",
  },
  {
    q: "How do you measure whether the work is valuable?",
    a: "We establish a baseline and success measures before implementation. Depending on the workflow, that may include time saved, cycle time, response speed, conversion, cost per task, backlog, error or rework rate, team adoption, customer satisfaction, or incremental revenue.",
  },
  {
    q: "How much does it cost?",
    a: "The AI Opportunity Audit starts at $2,500 for one clearly bounded business area. Team enablement starts at $5,000, focused AI builds at $8,000, implementation sprints at $20,000, and substantial custom systems at $40,000. Final scope and pricing are confirmed before work begins.",
  },
  {
    q: "How long does it take?",
    a: "A focused AI Opportunity Audit typically takes 7 to 10 business days after the necessary interviews and access are scheduled. Enablement and build timelines depend on scope and are confirmed in a written Statement of Work before work begins.",
  },
  {
    q: "Do you provide ongoing support?",
    a: "Yes. AI Operating Partner engagements can include continued training, new workflow implementation, system monitoring, evaluation, governance updates, cost control, maintenance, and ongoing optimization.",
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
          Not sure where AI will actually pay off in your business?
        </h2>
        <p className="cta-body">
          Start with a short conversation. If there is a real opportunity, the
          AI Opportunity Audit will identify the one to three places worth
          pursuing and give you a practical plan to implement them.
        </p>
        <div className="cta-row cta-center">
          <a className="btn btn-primary" href="#book">
            Book an AI Opportunity Call
          </a>
          <a className="btn btn-ghost" href="#audit">
            See the AI Opportunity Audit <span className="arr">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

const NEED_OPTIONS = [
  "Find and prioritize AI opportunities",
  "Train our team and improve AI adoption",
  "Automate a business workflow",
  "Build an AI feature or internal tool",
  "Move an AI prototype into production",
  "Connect data and existing systems",
  "Modernize or rebuild an existing app",
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
                  Book an AI Opportunity Call <span className="arr">→</span>
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
                    Book an AI Opportunity Call
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
              AI enablement and implementation for growing companies. We find the
              opportunity, enable the team, build the system, and measure what
              changed.
            </p>
          </div>

          <nav className="footer-nav" aria-label="Footer">
            <a href="#capabilities">What we do</a>
            <a href="#process">How it works</a>
            <a href="#trust">Why us</a>
            <a href="#about">About</a>
            <a href="#pricing">Pricing</a>
            <a href="#audit">AI Opportunity Audit</a>
            <a href="/privacy.html">Privacy</a>
            <a href="/terms.html">Terms</a>
          </nav>
        </div>

        <div className="footer-bottom">
          <span className="copyright">© 2026 North Star Pacific</span>
          <span className="footer-tagline">
            FIND THE OPPORTUNITY · ENABLE THE TEAM · BUILD WHAT MATTERS
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
