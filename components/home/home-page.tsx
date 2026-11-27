"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CardGrid } from "@/components/blocks/card-grid";
import { CtaBand } from "@/components/blocks/cta-band";
import { Faq, type FaqItem } from "@/components/blocks/faq";
import { FeatureGrid, type FeatureGridItem } from "@/components/blocks/feature-grid";
import { FeatureSection } from "@/components/blocks/feature-section";
import { Hero } from "@/components/blocks/hero";
import { ProcessSteps } from "@/components/blocks/process-steps";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";
import { Announcement } from "@/components/announcement";
import { Halftone } from "@/components/home/halftone";
import styles from "@/components/home/home-styles";
import { isBg } from "@/lib/edition";

const NBSP = "\u00A0";

const heroActions = [
  { href: "/waitlist", text: `Join${NBSP}waitlist`, location: "hero" },
  { href: "/#benefits", text: "Learn more", variant: "secondary" as const, location: "hero" },
] as const;

const benefits: readonly FeatureGridItem[] = [
  {
    title: "Better user experience",
    body: "Load pages in milliseconds.\nKeep visitors coming back.",
    visual: {
      kind: "dither",
      src: "/home/benefit-wand.png",
      color: "#00e6c5",
      label: "Dithered version of web screen with a magic wand with random dithering applied",
    },
  },
  {
    title: "Improved SEO",
    body: "Rank higher on Google.\nStand out from competitors.",
    visual: {
      kind: "dither",
      src: "/home/benefit-podium.png",
      color: "#d85ce0",
      label: "Dithered version of podium with #1 text with random dithering applied",
    },
  },
  {
    title: "Increased conversion",
    body: "Turn visitors into customers.\nBoost your bottom line.",
    visual: {
      kind: "dither",
      src: "/home/benefit-lightning.png",
      color: "#29c2ff",
      label: "Dithered version of lightning with lines around with random dithering applied",
    },
  },
  {
    title: "Cost savings",
    body: "Reduce hosting expenses.\nEliminate performance headaches.",
    visual: {
      kind: "dither",
      src: "/home/benefit-coins.png",
      color: "#e0cd3a",
      label: "Dithered version of stacked coins with random dithering applied",
    },
  },
];

const steps = [
  {
    title: "Enter your URL",
    body: "Quick setup, ready to optimize",
    icon: "link",
  },
  {
    title: "Start optimiztaion",
    body: "Analyze and enhance your site",
    icon: "wand",
  },
  {
    title: "Speed takes off",
    body: "Faster loading, better results",
    icon: "rocket",
  },
] as const;

const features = [
  {
    eyebrow: "Image Optimization",
    color: "#00e6c5",
    title: "Images that load in miliseconds.",
    body: "Automatic optimization for every visual asset on your site.",
    points: [
      "Automatic image compression",
      "Next-gen format conversion (WebP, AVIF)",
      "Lazy loading implementation",
      "Responsive image sizing",
    ],
    src: "/home/feature-settings.png",
    label: "Dithered version of optimized settings with ordered dithering applied",
    flip: false,
  },
  {
    eyebrow: "Code Optimization",
    color: "#d85ce0",
    title: "Clean code that just runs faster.",
    body: "Smart optimization that improves performance instantly.",
    points: [
      "JavaScript and CSS minification",
      "HTML optimization",
      "Remove unused code",
      "Combine files automatically",
    ],
    src: "/home/feature-computer.png",
    label: "Dithered version of old computer device with ordered dithering applied",
    flip: true,
  },
  {
    eyebrow: "Speed Technologies",
    color: "#29c2ff",
    title: "Built for speed. Scaled for growth.",
    body: "Fast loading no matter how many visitors you have.",
    points: [
      "Global CDN integration",
      "Browser caching setup",
      "GZIP compression",
      "DNS pre-fetching",
    ],
    src: "/home/feature-rocket.png",
    label: "Dithered version of launching rocket with ordered dithering applied",
    flip: false,
  },
  {
    eyebrow: "Analytics & Monitoring",
    color: "#e0cd3a",
    title: "Performance data you can trust.",
    body: "Real-time insights that help you make better decisions.",
    points: [
      "Real-time speed monitoring",
      "Google PageSpeed integration",
      "Mobile vs Desktop insights",
      "Competitor comparison",
    ],
    src: "/home/feature-satellite.png",
    label: "Dithered version of monitoring satellite with ordered dithering applied",
    flip: true,
  },
] as const;

const tiles = [
  {
    title: "One-click optimize",
    body: "Make your site faster instantly",
    icon: "bolt",
  },
  {
    title: "Code cleanup",
    body: "Remove bloat for better performance",
    icon: "broom",
  },
  {
    title: "24/7 monitoring",
    body: "Always watching your site's performance",
    icon: "chart",
  },
  {
    title: "Real-time alerts",
    body: "Know about issues right away",
    icon: "bell",
  },
] as const;

type Person = {
  quote: string;
  name: string;
  role: string;
  image: string;
  tint: string;
};

const tom: Person = {
  quote: `“We${NBSP}saved on${NBSP}hosting and boosted conversions just by${NBSP}running Jet.”`,
  name: "Tom Sullivan",
  role: "Agency Lead",
  image: "/home/tom.jpg",
  tint: "#00e6c5",
};

const luca: Person = {
  quote: "“My shop now loads in under a second. Jet is the only tool I needed.”",
  name: "Luca Rossi",
  role: "E-commerce Owner",
  image: "/home/luca.jpg",
  tint: "#29c2ff",
};

const alex: Person = {
  quote: `“Jet transformed our entire workflow. We${NBSP}cut load times by${NBSP}80% and our development team couldn’t be${NBSP}happier.”`,
  name: "Alex Chen",
  role: "Founder @ Gropa",
  image: "/home/alex.jpg",
  tint: "#7d8cff",
};

const maya: Person = {
  quote: "“Click, done. Pagespeed jumped, bounce rates dropped. Killer ROI.”",
  name: "Maya Thompson",
  role: "Content Marketer",
  image: "/home/maya.jpg",
  tint: "#d85ce0",
};

const sarah: Person = {
  quote: `Our client websites went from sluggish to${NBSP}lightning-fast overnight. Jet’s optimization is${NBSP}pure magic for SEO rankings.”`,
  name: "Sarah Martinez",
  role: "Marketing Director",
  image: "/home/sarah.jpg",
  tint: "#ff5cab",
};

const nia: Person = {
  quote: "“No tech skills, no plugins. Jet just made my portfolio fast on any device.”",
  name: "Nia Patel",
  role: "Designer",
  image: "/home/nia.jpg",
  tint: "#e0cd3a",
};

const james: Person = {
  quote: `“I${NBSP}used to${NBSP}spend hours optimizing each site. With Jet, it’s automatic. My${NBSP}clients get amazing performance without the extra work.”`,
  name: "James Wilson",
  role: "Freelance Developer",
  image: "/home/james.jpg",
  tint: "#86ee02",
};

const featuredSlides: Person[] = [tom, luca, alex, luca];
const cardColumns: Person[][] = [
  [luca, alex, luca],
  [maya, sarah, maya],
  [nia, james, nia],
];

const phases = [
  { ms: 2500, cols: [0, 0, 0], featured: 0 },
  { ms: 100, cols: [1, 0, 0], featured: 0 },
  { ms: 100, cols: [1, 1, 0], featured: 0 },
  { ms: 5000, cols: [1, 1, 1], featured: 0 },
  { ms: 100, cols: [2, 1, 1], featured: 0 },
  { ms: 100, cols: [2, 2, 1], featured: 0 },
  { ms: 2500, cols: [0, 0, 0], featured: 0 },
] as const;

const faqs: readonly FaqItem[] = [
  {
    question: "Do I need coding skills?",
    answer: "Not at all—just enter your website URL and Jet handles the rest automatically.",
  },
  {
    question: "What platforms does Jet support?",
    answer: "All major website builders (WordPress, Shopify, Wix, Squarespace) and custom sites.",
  },
  {
    question: "Will my site stay optimized?",
    answer: "Jet runs 24/7, constantly monitoring and optimizing as your site and traffic change.",
  },
  {
    question: "Is it safe to use Jet?",
    answer: "Yes—we never modify your original files and can instantly reverse any changes if needed.",
  },
  {
    question: "How fast will I see results?",
    answer: "Most sites see improvement in seconds, with full optimization within 5 minutes.",
  },
];

const footerCtaActions = [
  { href: "/waitlist", text: `Join${NBSP}waitlist`, location: "footer_cta" },
] as const;

const logoColumns = [
  [
    { src: "/home/logo-1.svg", width: 127 },
    { src: "/home/logo-4.svg", width: 42 },
  ],
  [
    { src: "/home/logo-2.svg", width: 109 },
    { src: "/home/logo-5.svg", width: 78 },
  ],
  [
    { src: "/home/logo-3.svg", width: 88 },
    { src: "/home/logo-6.svg", width: 117 },
  ],
] as const;

const logoPhases = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [1, 1, 1],
  [0, 1, 1],
  [0, 0, 1],
  [0, 0, 0],
] as const;

const logoWaits = [1000, 100, 100, 2000, 100, 100, 1000];

const spring = { type: "spring" as const, duration: 0.6, bounce: 0 };
const logoSpring = { type: "spring" as const, duration: 0.6, bounce: 0 };

function LogoColumn({
  logos,
  showSecond,
  reduced,
}: {
  logos: (typeof logoColumns)[number];
  showSecond: boolean;
  reduced: boolean;
}) {
  const logo = logos[showSecond ? 1 : 0];

  return (
    <div className={styles.logoCol}>
      {reduced ? (
        <div className={styles.logoSlot}>
          <img src={logo.src} alt="" width={logo.width} height={20} />
        </div>
      ) : (
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={logo.src}
            className={styles.logoSlot}
            initial={{ y: 86, opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -86, opacity: 0, filter: "blur(6px)" }}
            transition={logoSpring}
          >
            <img src={logo.src} alt="" width={logo.width} height={20} />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function QuoteMark() {
  const bubble =
    "M0 6.988C0 6.926.006 6.866.016 6.807H0V6.698C0 2.999 2.999 0 6.698 0v2.687C4.824 2.687 3.291 4.145 3.17 5.988H6.698V13H0Z";
  return (
    <svg viewBox="0 0 24 24" width="68" height="68" aria-hidden="true" className={styles.mark}>
      <g transform="translate(4 5)" fill="#00e6c5">
        <path d={bubble} />
        <path d={bubble} transform="translate(9.302 0)" />
      </g>
    </svg>
  );
}

export function HomePage() {
  const reduced = usePrefersReducedMotion();
  const [logoPhase, setLogoPhase] = useState(0);
  const [phase, setPhase] = useState(0);
  const [logosPlaying, setLogosPlaying] = useState(false);
  const [quotesPlaying, setQuotesPlaying] = useState(false);
  const drag = useRef<{ x: number; id: number } | null>(null);
  const logoStageRef = useRef<HTMLDivElement>(null);
  const quotesRef = useRef<HTMLDivElement>(null);
  const active = phases[phase];

  useEffect(() => {
    const nodes: Array<[HTMLElement, (playing: boolean) => void]> = [];
    if (logoStageRef.current) {
      nodes.push([logoStageRef.current, setLogosPlaying]);
    }
    if (quotesRef.current) {
      nodes.push([quotesRef.current, setQuotesPlaying]);
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const update = nodes.find(([node]) => node === entry.target)?.[1];
        update?.(entry.isIntersecting);
      }
    });
    for (const [node] of nodes) {
      observer.observe(node);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced !== false || !logosPlaying) {
      return;
    }
    const timer = window.setTimeout(() => {
      setLogoPhase((current) => (current + 1) % logoPhases.length);
    }, logoWaits[logoPhase]);
    return () => window.clearTimeout(timer);
  }, [logoPhase, logosPlaying, reduced]);

  useEffect(() => {
    if (reduced !== false || !quotesPlaying) {
      return;
    }
    const timer = window.setTimeout(() => {
      setPhase((current) => (current + 1) % phases.length);
    }, active.ms);
    return () => window.clearTimeout(timer);
  }, [active.ms, phase, quotesPlaying, reduced]);

  function stepCarousel(direction: number) {
    setPhase((current) => (current + direction + phases.length) % phases.length);
  }

  const logos = logoPhases[logoPhase];

  return (
    <div className={styles.home}>
      <Hero
        title="Lightning fast sites. In a single click."
        description="No code, no hassle. Jet simply keeps your website blazing fast 24/7."
        announcement={isBg ? undefined : <Announcement />}
        actions={heroActions}
      />

      <section className={styles.social} aria-label="Trusted by some of the biggest companies">
        <div className={`${styles.frame} ${styles.dash} ${styles.socialFrame}`}>
          <p>Trusted by some of the biggest companies</p>
          <div className={styles.logoStage} ref={logoStageRef}>
            {logoColumns.map((column, index) => (
              <LogoColumn
                key={column[0].src}
                logos={column}
                showSecond={logos[index] === 1}
                reduced={reduced !== false}
              />
            ))}
          </div>
        </div>
      </section>

      <FeatureGrid
        id="benefits"
        titleId="benefits-title"
        title="Accelerate your website with Jet."
        items={benefits}
      />

      <ProcessSteps titleId="process-title" title="Get started in 3 simple steps." steps={steps} />

      <section className={styles.section} aria-label="Features">
        <div className={`${styles.frame} ${styles.dash}`}>
          {features.map((feature) => (
            <FeatureSection
              key={feature.eyebrow}
              eyebrow={feature.eyebrow}
              accentColor={feature.color}
              title={feature.title}
              body={feature.body}
              points={feature.points}
              visual={{ kind: "dither", src: feature.src, label: feature.label }}
              flip={feature.flip}
              embedded
            />
          ))}
          <CardGrid items={tiles} embedded headingAs="h2" />
        </div>
      </section>

      <section
        className={styles.section}
        aria-labelledby="quotes-title"
        onPointerDown={(event) => {
          drag.current = { x: event.clientX, id: event.pointerId };
        }}
        onPointerUp={(event) => {
          if (!drag.current || drag.current.id !== event.pointerId) {
            return;
          }
          const delta = event.clientX - drag.current.x;
          drag.current = null;
          if (Math.abs(delta) > 48) {
            stepCarousel(delta < 0 ? 1 : -1);
          }
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <div className={`${styles.frame} ${styles.dash}`} ref={quotesRef}>
        <div className={styles.bandHead}>
          <h2 id="quotes-title">Customers see instant results.</h2>
        </div>
        <div className={styles.featured}>
          <div className={styles.portrait}>
            <Halftone
              src={featuredSlides[active.featured].image}
              label={`Portrait of ${featuredSlides[active.featured].name}`}
            />
          </div>
          <div className={styles.featuredCopy}>
            <div className={styles.stack}>
              {featuredSlides.map((slide, index) => (
                <motion.div
                  key={`${slide.name}-${index}`}
                  className={index === active.featured ? styles.slideOn : styles.slideOff}
                  initial={false}
                  animate={{ opacity: index === active.featured ? 1 : 0 }}
                  transition={reduced === false ? spring : { duration: 0 }}
                  aria-hidden={index === active.featured ? undefined : true}
                >
                  <div className={styles.quoteTop}>
                    <QuoteMark />
                    <h3>{slide.quote}</h3>
                  </div>
                  <div>
                    <p className={styles.featuredName}>{slide.name}</p>
                    <p className={styles.featuredRole}>{slide.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.cards}>
          {cardColumns.map((column, columnIndex) => (
            <article className={styles.card} key={column[0].name}>
              <div className={styles.stack}>
                {column.map((slide, index) => (
                  <motion.div
                    key={`${slide.name}-${index}`}
                    className={index === active.cols[columnIndex] ? styles.slideOn : styles.slideOff}
                    initial={false}
                    animate={{ opacity: index === active.cols[columnIndex] ? 1 : 0 }}
                    transition={reduced === false ? spring : { duration: 0 }}
                    aria-hidden={index === active.cols[columnIndex] ? undefined : true}
                  >
                    <h3>{slide.quote}</h3>
                    <div className={styles.who}>
                      <span className={styles.avatar} style={{ background: slide.tint }}>
                        <img src={slide.image} alt="" width={40} height={40} />
                      </span>
                      <span>
                        <span className={styles.cardName}>{slide.name}</span>
                        <span className={styles.cardRole}>{slide.role}</span>
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </article>
          ))}
        </div>
        </div>
      </section>

      <Faq titleId="faq-title" title="Frequently asked questions." items={faqs} />

      <CtaBand
        titleId="cta-title"
        title="Boost your site speed today."
        description="Try Jet now—one click, instant performance. No risk, cancel anytime."
        actions={footerCtaActions}
        spacing="home"
      />
    </div>
  );
}
