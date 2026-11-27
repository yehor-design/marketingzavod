import Link from "next/link";
import { Fragment } from "react";
import {
  isExternalHref,
  isInternalPath,
  type RichTextContent,
} from "@/lib/rich-text";

/**
 * Renders structured inline fragments as plain React nodes (no raw HTML injection or runtime markdown parsing, ТП-06).
 */
export function RichTextRuns({ content }: { content: RichTextContent }) {
  if (typeof content === "string") {
    return <>{content}</>;
  }

  return (
    <>
      {content.map((part, index) => {
        if ("href" in part) {
          if (isInternalPath(part.href)) {
            return (
              <Link key={`${part.href}-${index}`} href={part.href}>
                {part.text}
              </Link>
            );
          }
          if (isExternalHref(part.href)) {
            return (
              <a
                key={`${part.href}-${index}`}
                href={part.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {part.text}
              </a>
            );
          }
          return (
            <a key={`${part.href}-${index}`} href={part.href} rel="noopener">
              {part.text}
            </a>
          );
        }

        if ("strong" in part && part.strong) {
          return <strong key={`${part.text}-${index}`}>{part.text}</strong>;
        }

        return <Fragment key={`${part.text}-${index}`}>{part.text}</Fragment>;
      })}
    </>
  );
}
