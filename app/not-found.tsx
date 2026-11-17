import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404 Page Not Found – Jet",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[50rem] flex-col items-center justify-end gap-6 px-4 pb-11 text-center text-foreground">
      <p className="w-60 text-muted-foreground">Sorry, we can&apos;t find the page you&apos;re looking for.</p>
      <div className="flex items-center justify-center gap-3">
        <Button variant="ghost" nativeButton={false} render={<Link href="/" />}>
          Back to home
        </Button>
        <Button variant="secondary" nativeButton={false} render={<Link href="/contact" />}>
          Let us know
        </Button>
      </div>
    </div>
  );
}
