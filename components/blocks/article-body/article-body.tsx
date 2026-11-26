import type { ReactNode } from "react";
import type { Block } from "@/lib/blog";
import { CoverImage, type CoverVisual } from "@/components/blocks/post-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cx } from "@/components/blocks/article-body/article-body-styles";

export type ArticleBodyProps = {
  blocks: readonly Block[];
  visual?: CoverVisual | ReactNode;
  className?: string;
};

function isCoverVisual(value: CoverVisual | ReactNode): value is CoverVisual {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    (value.kind === "dither" || value.kind === "custom")
  );
}

export function ArticleBody({ blocks, visual, className }: ArticleBodyProps) {
  return (
    <div className={cx("body", className)} data-block="article-body">
      {visual ? (
        <div className={cx("cover")}>
          {isCoverVisual(visual) ? <CoverImage visual={visual} /> : visual}
        </div>
      ) : null}
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;
        if (block.kind === "h2") {
          return <h2 key={key}>{block.text}</h2>;
        }
        if (block.kind === "h3") {
          return <h3 key={key}>{block.text}</h3>;
        }
        if (block.kind === "p") {
          return <p key={key}>{block.text}</p>;
        }
        if (block.kind === "quote") {
          return (
            <blockquote key={key} className={cx("quote")}>
              <p>{block.text}</p>
            </blockquote>
          );
        }
        if (block.kind === "list") {
          return (
            <ul key={key}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.kind === "table") {
          return (
            <div key={key} className={cx("tableWrap")}>
              <Table>
                <TableHeader>
                  <TableRow className="border-0 hover:bg-transparent">
                    {block.headers.map((header) => (
                      <TableHead key={header} scope="col" className="text-muted-foreground">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {block.rows.map((row) => (
                    <TableRow key={row.join("|")} className="border-0 hover:bg-transparent">
                      {row.map((cell, cellIndex) => (
                        <TableCell key={`${cell}-${cellIndex}`} className="whitespace-normal">
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          );
        }
        return (
          <div key={key} className={cx("code")}>
            <pre>
              <code>{block.text}</code>
            </pre>
          </div>
        );
      })}
    </div>
  );
}
