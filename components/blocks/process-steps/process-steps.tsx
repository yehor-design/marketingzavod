"use client";

import type { ReactNode } from "react";
import { PhosphorIcon, type PhosphorIconName } from "@/components/home/phosphor-icon";
import { cx } from "@/components/blocks/process-steps/process-steps-styles";

export type ProcessStepItem = {
  title: string;
  body: string;
  icon?: PhosphorIconName | ReactNode;
};

export type ProcessStepsProps = {
  id?: string;
  titleId?: string;
  title: string;
  steps: readonly ProcessStepItem[];
  className?: string;
};

const PHOSPHOR_NAMES = new Set<string>(["link", "wand", "rocket", "bolt", "broom", "chart", "bell"]);

function renderStepIcon(icon: ProcessStepItem["icon"], index: number) {
  if (typeof icon === "string" && PHOSPHOR_NAMES.has(icon)) {
    return <PhosphorIcon name={icon as PhosphorIconName} />;
  }
  if (icon !== undefined) {
    return icon;
  }
  return <span className={cx("stepNumber")}>{String(index + 1).padStart(2, "0")}</span>;
}

export function ProcessSteps({
  id,
  titleId = "process-title",
  title,
  steps,
  className,
}: ProcessStepsProps) {
  return (
    <section
      className={cx("section", className)}
      id={id}
      aria-labelledby={titleId}
      data-block="process-steps"
    >
      <div className={cx("frame", "dash")}>
        <div className={cx("bandHead")}>
          <h2 id={titleId}>{title}</h2>
        </div>
        <ol className={cx("steps")}>
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className={cx("stepIcon")}>{renderStepIcon(step.icon, index)}</span>
              <div className={cx("stepText")}>
                <p className={cx("stepTitle")}>{step.title}</p>
                <p className={cx("stepBody")}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
