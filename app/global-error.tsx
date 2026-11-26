"use client";

import NextError from "next/error";
import { useEffect } from "react";
import { ui } from "@/content/ui";
import { isBg } from "@/lib/edition";

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

  return (
    <html lang={ui.globalError.lang}>
      <body>
        {isBg ? (
          <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center text-foreground">
            <h1>{ui.globalError.title}</h1>
            <p className="text-muted-foreground">{ui.globalError.body}</p>
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-button bg-primary px-5 py-2.5 text-sm text-primary-foreground"
            >
              {ui.globalError.reload}
            </button>
          </main>
        ) : (
          <NextError statusCode={0} />
        )}
      </body>
    </html>
  );
}
