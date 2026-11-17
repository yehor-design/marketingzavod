import Link from "next/link";
import { Button } from "@ui-sdk/react/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "404 Page Not Found – Jet",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[50rem] flex-col items-center justify-end gap-6 px-4 pb-11 text-center text-foreground">
      <p className="w-60 text-muted-foreground">Sorry, we can&apos;t find the page you&apos;re looking for.</p>
      <div className="flex items-center justify-center gap-3">
        <Button className={cn(buttonVariants({ variant: "ghost" }))} render={<Link href="/" />}>
          Back to home
        </Button>
        <Button className={cn(buttonVariants({ variant: "secondary" }))} render={<Link href="/contact" />}>
          Let us know
        </Button>
      </div>
    </div>
  );
}
