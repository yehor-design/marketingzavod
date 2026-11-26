import type { ReactNode } from "react";
import { CornerMarks } from "@/components/motion/corner-marks";
import { cx } from "@/components/blocks/benefits/benefits-styles";

export type BenefitItem = {
  title: string;
  body: string;
  icon?: ReactNode;
};

export type BenefitsProps = {
  id?: string;
  titleId?: string;
  title: string;
  description: ReactNode;
  items: readonly BenefitItem[];
  className?: string;
};

export function BenefitsHighlight({ children }: { children: ReactNode }) {
  return <span className={cx("bright")}>{children}</span>;
}

export function Benefits({
  id = "benefits",
  titleId = "benefits-title",
  title,
  description,
  items,
  className,
}: BenefitsProps) {
  return (
    <section
      className={cx("frame", "benefits", "scroll-mt-[80px]", className)}
      id={id}
      aria-labelledby={titleId}
      data-block="benefits"
    >
      <div className={cx("benefitsHead")}>
        <h2 id={titleId}>{title}</h2>
        <p>{description}</p>
      </div>
      <ul className={cx("benefitGrid")}>
        {items.map((item) => (
          <li key={item.title} className="corner-host">
            <CornerMarks />
            {item.icon}
            <div>
              <h3>{item.title}</h3>
              <div className={cx("benefitReveal")}>
                <p>{item.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
