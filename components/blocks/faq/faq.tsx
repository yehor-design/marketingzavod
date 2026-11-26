"use client";

import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cx } from "@/components/blocks/faq/faq-styles";

export const faqSpring = { type: "spring" as const, duration: 0.4, bounce: 0 };

export type FaqItem = {
  question: string;
  answer: ReactNode;
  trackQuestion?: string;
};

export type FaqProps = {
  id?: string;
  titleId?: string;
  title: string;
  items: readonly FaqItem[];
  defaultOpenIndex?: number | null;
  className?: string;
};

export function Faq({
  id,
  titleId = "faq-title",
  title,
  items,
  defaultOpenIndex = null,
  className,
}: FaqProps) {
  const reduced = usePrefersReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(defaultOpenIndex);

  return (
    <section
      className={cx("section", className)}
      id={id}
      aria-labelledby={titleId}
      data-block="faq"
    >
      <div className={cx("frame", "dash", "faqGrid")}>
        <h2 id={titleId}>
          <span>{title}</span>
        </h2>
        <Accordion
          value={openFaq === null ? [] : [String(openFaq)]}
          onValueChange={(next) => setOpenFaq(next.length > 0 ? Number(next[0]) : null)}
        >
          {items.map((item, index) => {
            const open = openFaq === index;
            return (
              <AccordionItem
                key={item.question}
                value={String(index)}
                className="border-b-0"
                render={
                  <motion.div
                    className={cx("faqItem", open && "faqOpen")}
                    initial={false}
                    animate={{
                      backgroundColor: open ? "var(--color-secondary)" : "var(--color-transparent)",
                    }}
                    whileHover={{
                      backgroundColor: open ? "var(--color-secondary)" : "var(--color-card-30)",
                    }}
                    whileFocus={{
                      backgroundColor: open ? "var(--color-secondary)" : "var(--color-card-30)",
                    }}
                    transition={reduced === false ? faqSpring : { duration: 0 }}
                  />
                }
              >
                <AccordionTrigger
                  hideIcon
                  className="rounded-none border-0 py-0 hover:no-underline focus-visible:ring-0"
                  render={
                    <motion.button
                      type="button"
                      data-track="faq_open"
                      data-track-if="collapsed"
                      data-track-question={item.trackQuestion ?? item.question}
                      initial={false}
                      animate={{ paddingBottom: open ? 12 : 28 }}
                      transition={reduced === false ? faqSpring : { duration: 0 }}
                    />
                  }
                >
                  <span>{item.question}</span>
                  <motion.span
                    className={cx("plus")}
                    aria-hidden="true"
                    initial={false}
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={reduced === false ? faqSpring : { duration: 0 }}
                  />
                </AccordionTrigger>
                <AccordionContent
                  keepMounted
                  className="p-0"
                  render={
                    <motion.div
                      className={cx("faqAnswer")}
                      initial={false}
                      animate={{ height: open ? "auto" : 0 }}
                      transition={reduced === false ? faqSpring : { duration: 0 }}
                    />
                  }
                >
                  <p>{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
