"use client";

import Image from "next/image";
import { useState } from "react";
import { Button, CtaLink } from "@/components/ui/button";
import { cx } from "@/components/blocks/founder-card/founder-card-styles";

export type FounderCardPhoto = {
  readonly webp?: string;
  readonly jpg: string;
  readonly alt: string;
  readonly aspect?: "1/1" | "4/5";
  readonly width?: number;
  readonly height?: number;
  readonly loading?: "eager" | "lazy";
};

export type FounderCardAction = {
  readonly label: string;
  readonly href: string;
  readonly variant?: "primary" | "secondary";
  readonly external?: boolean;
  readonly location?: string;
};

export type FounderCardProps = {
  id?: string;
  titleId?: string;
  eyebrow?: string;
  title: string;
  headingAs?: "h2" | "h3";
  bio: string | readonly string[];
  photo: FounderCardPhoto;
  actions?: readonly FounderCardAction[];
  className?: string;
};

function assertSafeFounderAsset(path: string | undefined) {
  if (path && path.includes("-original.")) {
    throw new Error(`Original uncropped founder photo must not be rendered: "${path}"`);
  }
}

export function FounderCard({
  id,
  titleId = "founder-card-title",
  eyebrow,
  title,
  headingAs = "h2",
  bio,
  photo,
  actions = [],
  className,
}: FounderCardProps) {
  assertSafeFounderAsset(photo.webp);
  assertSafeFounderAsset(photo.jpg);

  const [src, setSrc] = useState(photo.webp ?? photo.jpg);
  const aspect = photo.aspect ?? "1/1";
  const width = photo.width ?? (aspect === "4/5" ? 960 : 800);
  const height = photo.height ?? (aspect === "4/5" ? 1200 : 800);
  const paragraphs = typeof bio === "string" ? [bio] : bio;
  const Heading = headingAs;

  return (
    <section
      className={cx("section", className)}
      id={id}
      aria-labelledby={titleId}
      data-block="founder-card"
    >
      <div className={cx("frame", "dash", "grid")}>
        <div className={cx("photoFrame", aspect === "4/5" ? "ratio45" : "ratio11")}>
          <Image
            src={src}
            alt={photo.alt}
            width={width}
            height={height}
            loading={photo.loading}
            sizes="(max-width: 809.98px) calc(100vw - 32px), 380px"
            className={cx("photoImg")}
            onError={() => {
              if (src !== photo.jpg) {
                setSrc(photo.jpg);
              }
            }}
          />
        </div>

        <div className={cx("copy")}>
          {eyebrow ? <p className={cx("eyebrow")}>{eyebrow}</p> : null}
          <Heading id={titleId} className={cx("heading")}>
            {title}
          </Heading>
          <div className={cx("bioWrap")}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className={cx("bio")}>
                {paragraph}
              </p>
            ))}
          </div>

          {actions.length > 0 ? (
            <div className={cx("actions")}>
              {actions.map((action) => {
                const variant = action.variant ?? "primary";
                const isContactOrExternal =
                  action.external ||
                  action.href.startsWith("mailto:") ||
                  action.href.startsWith("tel:") ||
                  /^https?:\/\//.test(action.href);

                if (isContactOrExternal) {
                  const openNewTab = action.external ?? /^https?:\/\//.test(action.href);
                  return (
                    <Button
                      key={`${action.href}-${action.label}`}
                      variant={variant}
                      nativeButton={false}
                      render={
                        <a
                          href={action.href}
                          target={openNewTab ? "_blank" : undefined}
                          rel={openNewTab ? "noopener" : undefined}
                        />
                      }
                    >
                      {action.label}
                    </Button>
                  );
                }

                return (
                  <CtaLink
                    key={`${action.href}-${action.label}`}
                    href={action.href}
                    text={action.label}
                    variant={variant}
                    location={action.location ?? "founder_card"}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
