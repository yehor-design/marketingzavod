"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { DitherImage } from "@/components/home/dither-image";
import { CornerMarks } from "@/components/motion/corner-marks";
import { Button, CtaLink } from "@/components/ui/button";
import { cx } from "@/components/blocks/team-member/team-member-styles";

export type DitherPreset = ComponentProps<typeof DitherImage>["preset"];

export type TeamGridPerson = {
  name: string;
  role: string;
  image: string;
  href?: string;
};

export type PortraitPhoto = {
  webp?: string;
  jpg: string;
  alt: string;
  aspect?: "4/5" | "1/1";
  loading?: "eager" | "lazy";
};

export type TeamMemberAction = {
  href: string;
  text: string;
  variant?: "primary" | "secondary";
  location: string;
  external?: boolean;
};

export type SinglePersonConfig = {
  title: string;
  eyebrow?: string;
  photo: PortraitPhoto;
  bio: ReactNode;
  actions?: readonly TeamMemberAction[];
};

export type TeamMemberProps =
  | {
      mode?: "grid";
      id?: string;
      titleId?: string;
      title: string;
      description?: string;
      people: readonly TeamGridPerson[];
      ditherPreset: DitherPreset;
      ditherHoverPreset: DitherPreset;
      footerBanner?: {
        heading: ReactNode;
        cta: { href: string; text: string; location: string };
      };
      className?: string;
    }
  | {
      mode: "single";
      id?: string;
      titleId?: string;
      person: SinglePersonConfig;
      className?: string;
    };

export function TeamHighlight({ children }: { children: ReactNode }) {
  return <span className={cx("bright")}>{children}</span>;
}

export function PortraitPicture({ photo, className }: { photo: PortraitPhoto; className?: string }) {
  const ratio = photo.aspect === "1/1" ? "portraitRatio11" : "portraitRatio45";
  return (
    <div className={cx("portraitFrame", ratio, className)}>
      <picture>
        {photo.webp ? <source srcSet={photo.webp} type="image/webp" /> : null}
        <img src={photo.jpg} alt={photo.alt} className={cx("portraitImg")} loading={photo.loading} />
      </picture>
    </div>
  );
}

function GridPortrait({
  person,
  ditherPreset,
  ditherHoverPreset,
}: {
  person: TeamGridPerson;
  ditherPreset: DitherPreset;
  ditherHoverPreset: DitherPreset;
}) {
  const [hot, setHot] = useState(false);

  return (
    <a
      href={person.href ?? "https://x.com"}
      className="corner-host"
      target="_blank"
      rel="noreferrer"
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
    >
      <CornerMarks />
      <span className={cx("photo")}>
        <DitherImage
          src={person.image}
          label={`Portrait of ${person.name}`}
          preset={hot ? ditherHoverPreset : ditherPreset}
        />
      </span>
      <div className={cx("caption")}>
        <h3>{person.name}</h3>
        <p className={cx("role")}>
          <span className={cx("roleLine")}>
            <span className={cx("slash")} aria-hidden="true">
              /
            </span>
            <span className={cx("roleText")}>{person.role}</span>
          </span>
        </p>
      </div>
    </a>
  );
}

export function TeamMember(props: TeamMemberProps) {
  const titleId = props.titleId ?? "team-title";

  if (props.mode === "single") {
    const { person, id, className } = props;
    return (
      <section
        className={cx("block", className)}
        id={id}
        aria-labelledby={titleId}
        data-block="team-member"
      >
        <div className={cx("frame", "singleGrid")}>
          <PortraitPicture photo={person.photo} />
          <div className={cx("singleCopy")}>
            {person.eyebrow ? <p className={cx("singleMeta")}>{person.eyebrow}</p> : null}
            <h2 id={titleId}>{person.title}</h2>
            <div>{person.bio}</div>
            {person.actions && person.actions.length > 0 ? (
              <div className={cx("singleActions")}>
                {person.actions.map((action) =>
                  action.external ? (
                    <Button
                      key={`${action.href}-${action.text}`}
                      variant={action.variant}
                      nativeButton={false}
                      render={
                        <a
                          href={action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-track="cta_click"
                          data-track-cta-text={action.text}
                          data-track-cta-location={action.location}
                        />
                      }
                    >
                      {action.text}
                    </Button>
                  ) : (
                    <CtaLink
                      key={`${action.href}-${action.text}`}
                      href={action.href}
                      text={action.text}
                      variant={action.variant}
                      location={action.location}
                    />
                  ),
                )}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cx("block", props.className)}
      id={props.id}
      aria-labelledby={titleId}
      data-block="team-member"
    >
      <div className={cx("frame")}>
        <div className={cx("teamHead")}>
          <h2 id={titleId}>{props.title}</h2>
          {props.description ? <p>{props.description}</p> : null}
        </div>
        <ul className={cx("team")}>
          {props.people.map((person) => (
            <li key={person.name}>
              <GridPortrait
                person={person}
                ditherPreset={props.ditherPreset}
                ditherHoverPreset={props.ditherHoverPreset}
              />
            </li>
          ))}
        </ul>
        {props.footerBanner ? (
          <div className={cx("hiring")}>
            <h2>{props.footerBanner.heading}</h2>
            <CtaLink
              href={props.footerBanner.cta.href}
              text={props.footerBanner.cta.text}
              location={props.footerBanner.cta.location}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
