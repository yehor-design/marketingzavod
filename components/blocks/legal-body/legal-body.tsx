import type { LegalBlock, RichText } from "@/lib/legal";
import { cx } from "@/components/blocks/legal-body/legal-body-styles";

function Rich({ content }: { content: readonly RichText[] }) {
  return content.map((part, index) =>
    "href" in part ? (
      <a key={`${part.href}-${index}`} href={part.href} rel="noopener">
        {part.text}
      </a>
    ) : (
      <span key={`${part.text}-${index}`}>{part.text}</span>
    ),
  );
}

export type LegalBodyProps = {
  blocks: readonly LegalBlock[];
  className?: string;
};

export function LegalBody({ blocks, className }: LegalBodyProps) {
  return (
    <div className={cx("body", className)} data-block="legal-body">
      {blocks.map((block, index) => {
        if (block.kind === "h2") {
          return (
            <h2 key={`${block.text}-${index}`} id={block.id}>
              {block.text}
            </h2>
          );
        }
        if (block.kind === "list") {
          return (
            <ul key={`list-${index}`}>
              {block.items.map((item) => (
                <li key={item}>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={`p-${index}`}>
            <Rich content={block.content} />
          </p>
        );
      })}
    </div>
  );
}
