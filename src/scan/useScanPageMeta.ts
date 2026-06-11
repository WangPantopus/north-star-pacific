import { useEffect } from "react";

const SCAN_TITLE = "What's your highest-leverage AI opportunity?";
const SCAN_DESCRIPTION =
  "A 5-minute scan that maps where AI will actually move your numbers.";
const SITE_NAME = "North Star Pacific";

function getSiteOrigin(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return "https://north-star-pacific.vercel.app";
}

function setMetaProperty(property: string, content: string): void {
  let element = document.querySelector(
    `meta[property="${property}"]`,
  ) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setMetaName(name: string, content: string): void {
  let element = document.querySelector(
    `meta[name="${name}"]`,
  ) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(href: string): void {
  let element = document.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = href;
}

export function useScanPageMeta(path = "/scan"): void {
  useEffect(() => {
    const origin = getSiteOrigin();
    const url = `${origin}${path}`;
    const ogImage = `${origin}/og.png`;

    document.title = `${SCAN_TITLE} — ${SITE_NAME}`;
    setMetaName("description", SCAN_DESCRIPTION);
    setCanonical(url);
    setMetaProperty("og:type", "website");
    setMetaProperty("og:site_name", SITE_NAME);
    setMetaProperty("og:title", SCAN_TITLE);
    setMetaProperty("og:description", SCAN_DESCRIPTION);
    setMetaProperty("og:url", url);
    setMetaProperty("og:image", ogImage);
    setMetaName("twitter:card", "summary_large_image");
    setMetaName("twitter:title", SCAN_TITLE);
    setMetaName("twitter:description", SCAN_DESCRIPTION);
    setMetaName("twitter:image", ogImage);

    return () => {
      document.title =
        "North Star Pacific — AI, built into your business and shipped";
      setMetaName(
        "description",
        "We build AI into funded startups and growing companies — wired into your real product, workflows, and data, and shipped to production. Start with an AI Opportunity Audit.",
      );
      setCanonical(`${origin}/`);
      setMetaProperty("og:title", "AI, built into your business — and shipped.");
      setMetaProperty(
        "og:description",
        "Working AI systems — not strategy decks — built by an engineer who's shipped at Meta, Apple, and LinkedIn.",
      );
      setMetaProperty("og:url", `${origin}/`);
      setMetaName("twitter:title", "AI, built into your business — and shipped.");
      setMetaName(
        "twitter:description",
        "Working AI systems — not strategy decks — built by an engineer who's shipped at Meta, Apple, and LinkedIn.",
      );
    };
  }, [path]);
}
