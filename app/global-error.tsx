"use client";

import NextError from "next/error";
import { useEffect } from "react";
import { ui } from "@/content/ui";
import { EDITION, isBg } from "@/lib/edition";

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  // The digest ties the browser error to the server log line in Vercel.
  useEffect(() => {
    console.error(error);
  }, [error]);

  if (isBg) {
    return (
      <html
        lang={ui.globalError.lang}
        data-edition={EDITION}
        className="dark bg-background text-[125%] scheme-dark max-[809.98px]:text-[87.5%] min-[810px]:max-[1199.98px]:text-[112.5%]"
      >
        <body className="m-0 min-h-screen bg-background font-sans text-foreground">
          <main className="mx-auto flex min-h-screen w-[min(1200px,_calc(100%_-_32px))] flex-col items-center justify-center gap-[20px] py-[64px] text-center">
            <h1 className="m-0 font-display text-h1 text-foreground">{ui.globalError.title}</h1>
            <p className="m-0 max-w-[460px] text-[16px] leading-[1.5] text-muted-foreground">
              {ui.globalError.body}
            </p>
            <button
              type="button"
              onClick={() => reset()}
              className="mt-[8px] inline-flex h-[36px] cursor-pointer items-center justify-center rounded-nav border-0 bg-foreground px-[18px] font-display text-[12px] font-medium text-background"
            >
              {ui.globalError.reload}
            </button>
          </main>
        </body>
      </html>
    );
  }

  return (
    <html lang={ui.globalError.lang}>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
