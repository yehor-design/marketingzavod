"use client";

import Link from "next/link";
import { cx } from "@/components/blocks/mirror-questions/mirror-questions-styles";

export type MirrorQuestionsCta = {
  readonly label: string;
  readonly href: string;
  readonly location?: string;
};

export type MirrorQuestionsProps = {
  id?: string;
  titleId?: string;
  title: string;
  headingAs?: "h2" | "h3";
  questions: readonly string[];
  /** Optional supporting line rendered below the question cards inside the dashed frame. */
  note?: string;
  /** Optional link rendered below the question cards inside the dashed frame. */
  cta?: MirrorQuestionsCta;
  className?: string;
};

export function MirrorQuestions({
  id,
  titleId = "mirror-questions-title",
  title,
  headingAs = "h2",
  questions,
  note,
  cta,
  className,
}: MirrorQuestionsProps) {
  if (questions.length === 0) {
    return null;
  }

  const Heading = headingAs;
  const gridClass =
    questions.length === 5 ? "grid5" : questions.length === 3 ? "grid3" : "grid4";

  return (
    <section
      className={cx("section", className)}
      id={id}
      aria-labelledby={titleId}
      data-block="mirror-questions"
    >
      <div className={cx("frame", "dash")}>
        <div className={cx("bandHead")}>
          <Heading id={titleId} className={cx("heading")}>
            {title}
          </Heading>
        </div>

        <ul className={cx("grid", gridClass)} data-question-count={questions.length}>
          {questions.map((question) => (
            <li key={question}>
              <div className={cx("card")}>
                <p className={cx("question")}>{question}</p>
              </div>
            </li>
          ))}
        </ul>

        {note || cta ? (
          <div className={cx("footer")}>
            {note ? <p className={cx("note")}>{note}</p> : null}
            {cta ? (
              <Link
                href={cta.href}
                className={cx("ctaLink")}
                data-track="cta_click"
                data-track-cta-text={cta.label.replace(/\u00a0/g, " ")}
                data-track-cta-location={cta.location ?? "mirror_questions"}
              >
                {cta.label}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
