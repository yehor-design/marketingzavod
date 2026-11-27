import type { LegalBlock } from "@/lib/legal";
import { inlineToPlainText } from "@/lib/rich-text";
import { RichTextRuns } from "@/components/blocks/rich-text";
import { CtaLink } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cx } from "@/components/blocks/legal-body/legal-body-styles";

export type LegalBodyProps = {
  blocks: readonly LegalBlock[];
  className?: string;
};

export function LegalBody({ blocks, className }: LegalBodyProps) {
  return (
    <div className={cx("body", className)} data-block="legal-body">
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;
        if (block.kind === "h2") {
          return (
            <h2 key={`${block.text}-${index}`} id={block.id}>
              {block.text}
            </h2>
          );
        }
        if (block.kind === "h3") {
          return (
            <h3 key={`${block.text}-${index}`} id={block.id}>
              {block.text}
            </h3>
          );
        }
        if (block.kind === "lead") {
          return (
            <p key={key} className={cx("lead")}>
              <RichTextRuns content={block.content} />
            </p>
          );
        }
        if (block.kind === "list") {
          return (
            <ul key={`list-${index}`}>
              {block.items.map((item, itemIndex) => (
                <li key={`${inlineToPlainText(item)}-${itemIndex}`}>
                  <p>
                    <RichTextRuns content={item} />
                  </p>
                </li>
              ))}
            </ul>
          );
        }
        if (block.kind === "ol") {
          return (
            <ol key={key}>
              {block.items.map((item, itemIndex) => (
                <li key={`${inlineToPlainText(item)}-${itemIndex}`}>
                  <p>
                    <RichTextRuns content={item} />
                  </p>
                </li>
              ))}
            </ol>
          );
        }
        if (block.kind === "table") {
          return (
            <div key={key} className={cx("tableWrap")}>
              <Table>
                {block.caption ? <TableCaption>{block.caption}</TableCaption> : null}
                <TableHeader>
                  <TableRow className="border-0 hover:bg-transparent">
                    {block.headers.map((header) => (
                      <TableHead
                        key={header}
                        scope="col"
                        className="whitespace-normal text-muted-foreground"
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {block.rows.map((row, rowIndex) => (
                    <TableRow
                      key={`${row.map(inlineToPlainText).join("|")}-${rowIndex}`}
                      className="border-0 hover:bg-transparent"
                    >
                      {row.map((cell, cellIndex) => (
                        <TableCell
                          key={`${inlineToPlainText(cell)}-${cellIndex}`}
                          className="whitespace-normal"
                        >
                          <RichTextRuns content={cell} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          );
        }
        if (block.kind === "cta") {
          return (
            <div key={key} className={cx("cta")} data-block-kind="cta">
              {block.title ? <p className={cx("ctaTitle")}>{block.title}</p> : null}
              <p className={cx("ctaText")}>
                <RichTextRuns content={block.text} />
              </p>
              {block.actions.length > 0 ? (
                <div className={cx("ctaActions")}>
                  {block.actions.map((action, actionIndex) => (
                    <CtaLink
                      key={`${action.href}-${action.text}-${actionIndex}`}
                      href={action.href}
                      text={action.text}
                      variant={action.variant ?? (actionIndex === 0 ? "primary" : "secondary")}
                      location={action.location ?? "legal_cta"}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        }
        if (block.kind === "methodology") {
          return (
            <div key={key} className={cx("methodology")} data-block-kind="methodology">
              {block.title ? <h2 className={cx("metaHeading")}>{block.title}</h2> : null}
              {block.text ? (
                <p className={cx("metaText")}>
                  <RichTextRuns content={block.text} />
                </p>
              ) : null}
              {block.items && block.items.length > 0 ? (
                <ul className={cx("metaList")}>
                  {block.items.map((item, itemIndex) => (
                    <li key={`${inlineToPlainText(item)}-${itemIndex}`}>
                      <RichTextRuns content={item} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        }
        if (block.kind === "sources") {
          return (
            <div key={key} className={cx("sources")} data-block-kind="sources">
              {block.title ? <h2 className={cx("metaHeading")}>{block.title}</h2> : null}
              <ul className={cx("metaList")}>
                {block.items.map((item, itemIndex) => (
                  <li key={`${inlineToPlainText(item)}-${itemIndex}`}>
                    <RichTextRuns content={item} />
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        return (
          <p key={`p-${index}`}>
            <RichTextRuns content={block.content} />
          </p>
        );
      })}
    </div>
  );
}
