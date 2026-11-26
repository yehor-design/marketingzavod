const styles = {
  page: "page text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h1]:font-[inherit] [&_h2]:font-[inherit] [&_p]:font-[inherit] [&_label]:font-[inherit] max-[809.98px]:mb-[-3px] min-[1200px]:pb-[1px]",
  frame:
    "frame flex flex-col [width:min(1200px,_calc(100%_-_32px))] mx-auto my-0 overflow-hidden [border:1px_dashed_var(--color-rule)] min-[1200px]:flex-row min-[1200px]:items-center min-[1200px]:min-h-[745px] min-[1200px]:mt-[1px] min-[1200px]:border-0 min-[1200px]:[outline:1px_dashed_var(--color-rule)] min-[1200px]:[outline-offset:-1px]",
  intro:
    "intro flex flex-col bg-background [&_h1]:m-0 [&_h1]:[font-size:2.2rem] [&_h1]:tracking-[-0.02em] [&_h1]:leading-[1.2] [&_p]:m-0 [&_p]:text-muted-foreground [&_p]:[font-size:16px] [&_p]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_p]:tracking-normal [&_p]:leading-[1.5] [&_p]:max-w-[400px] max-[809.98px]:[&_p]:whitespace-pre-wrap max-[809.98px]:[&_p]:break-words max-[809.98px]:[&_p]:[overflow-wrap:break-word] min-[1200px]:w-[600px] min-[1200px]:[flex:0_0_600px] min-[1200px]:[border-right:1px_dashed_var(--color-rule)] min-[1200px]:[&_h1]:[font-size:44px] min-[1200px]:[&_h1]:tracking-[-0.02em] min-[1200px]:[&_h1]:leading-[1.2]",
  introCopy:
    "introCopy flex flex-col gap-[24px] [padding:50px_24px] max-[809.98px]:pr-[23px] max-[809.98px]:pl-[23px] max-[809.98px]:text-center min-[810px]:[padding:28px_34px_36px] min-[1200px]:[padding:51px_33px_50px_34px]",
  panel:
    "panel bg-panel [border-top:1px_dashed_var(--color-rule)] min-[1200px]:w-[600px] min-[1200px]:[flex:0_0_600px] min-[1200px]:[border-top:0]",
  form: "form flex flex-col gap-[20px] items-start min-w-0 [padding:28px_20px_36px] max-[809.98px]:[padding:23px_23px_25px] min-[810px]:[padding:34px]",
} as const;

export type ContactFormClassKey = keyof typeof styles;

export function cx(...keys: Array<ContactFormClassKey | string | false | null | undefined>) {
  return keys
    .filter((key): key is string => Boolean(key))
    .map((key) => (key in styles ? styles[key as ContactFormClassKey] : key))
    .join(" ");
}

export default styles;
