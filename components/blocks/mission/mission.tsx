import type { ReactNode } from "react";
import { cx } from "@/components/blocks/mission/mission-styles";

export type MissionProps = {
  id?: string;
  titleId?: string;
  title: string;
  paragraphs: readonly ReactNode[];
  className?: string;
};

export function MissionHighlight({ children }: { children: ReactNode }) {
  return <span className={cx("bright")}>{children}</span>;
}

export function Mission({
  id,
  titleId = "mission-title",
  title,
  paragraphs,
  className,
}: MissionProps) {
  return (
    <section
      className={cx("block", className)}
      id={id}
      aria-labelledby={titleId}
      data-block="mission"
    >
      <div className={cx("frame", "mission")}>
        <h2 id={titleId}>{title}</h2>
        <div className={cx("missionCopy")}>
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
