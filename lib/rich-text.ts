export type RichTextFragment =
  | { readonly text: string }
  | { readonly text: string; readonly href: string }
  | { readonly text: string; readonly strong: true };

export type RichTextContent = string | readonly RichTextFragment[];

export type RichCtaAction = {
  readonly href: string;
  readonly text: string;
  readonly variant?: "primary" | "secondary";
  readonly location?: string;
};

/**
 * Joins structured inline fragments into plain text without inserting extra spaces.
 * Used by CR-A3 verbatim tests to verify that a rich paragraph matches the source text.
 */
export function inlineToPlainText(content: RichTextContent): string {
  if (typeof content === "string") {
    return content;
  }
  return content.map((fragment) => fragment.text).join("");
}

/** True for external http(s) and protocol-relative URLs that require rel="noopener noreferrer". */
export function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//i.test(href);
}

/** True for same-origin application paths that should navigate through next/link. */
export function isInternalPath(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}
