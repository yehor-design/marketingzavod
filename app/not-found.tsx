import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ui } from "@/content/ui";

export const metadata = {
  title: ui.notFound.metaTitle,
};

export default function NotFound() {
  return (
    <div className="flex min-h-[50rem] flex-col items-center justify-end gap-6 px-4 pb-11 text-center text-foreground">
      <p className="w-60 text-muted-foreground">{ui.notFound.body}</p>
      <div className="flex items-center justify-center gap-3">
        <Button variant="tertiary" nativeButton={false} render={<Link href="/" />}>
          {ui.notFound.homeCta}
        </Button>
        <Button
          variant="secondary"
          nativeButton={false}
          render={<Link href={ui.notFound.contactHref} />}
        >
          {ui.notFound.contactCta}
        </Button>
      </div>
    </div>
  );
}
