const styles = {
  body: "body w-full max-w-[650px] [&_h2]:mt-[40px] [&_h2]:[font-size:1.6rem] [&_h2]:font-[1000] [&_h2]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:leading-[1.2] [&_h2]:tracking-[-0.01em] [&_h2]:text-balance [&_p]:mt-[24px] [&_p]:text-muted-foreground [&_p]:[font-size:16px] [&_p]:font-[1000] [&_p]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_p]:leading-[1.5] [&_p]:tracking-normal [&_>_p:first-child]:mt-0 [&_a]:text-foreground [&_a]:no-underline [&_a:hover]:underline [&_ul]:[margin:20px_0_0] [&_ul]:p-0 [&_ul]:list-none [&_li]:relative [&_li]:[padding-inline-start:2ch] [&_li]:text-muted-foreground [&_li]:[font-size:16px] [&_li]:font-[1000] [&_li]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_li]:leading-[1.5] [&_li::before]:[content:\"\u2022\"] [&_li::before]:absolute [&_li::before]:[inset-inline-start:0] [&_li_p]:m-0 [&_h2[id]]:[scroll-margin-top:calc(var(--header-height)_+_24px)]",
} as const;

export type LegalBodyClassKey = keyof typeof styles;

export function cx(...keys: Array<LegalBodyClassKey | string | false | null | undefined>) {
  return keys
    .filter((key): key is string => Boolean(key))
    .map((key) => (key in styles ? styles[key as LegalBodyClassKey] : key))
    .join(" ");
}

export default styles;
