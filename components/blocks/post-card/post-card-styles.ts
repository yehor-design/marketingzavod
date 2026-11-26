const styles = {
  art: "art block [aspect-ratio:16_/_9] overflow-hidden bg-background [filter:brightness(0.7)] [&_canvas]:w-full [&_canvas]:h-full [&_canvas]:object-cover [&_svg]:w-full [&_svg]:h-full",
  feature:
    "feature flex flex-col min-w-0 h-full text-foreground bg-background [grid-column:1_/_-1] [&:hover_.art]:[filter:brightness(1)] [&:focus-visible_.art]:[filter:brightness(1)] [&_.copy]:gap-[20px] [&_.copy_h3]:max-w-[500px] [&_.copy_h3]:[font-size:1.6rem] [&_.copy_h3]:leading-[1.2] [&_.date]:[font-size:14px] [&_.date]:leading-[1.5] max-[809.98px]:[&_.art]:[filter:brightness(1)] max-[809.98px]:[&_.copy]:[padding:24px] max-[809.98px]:[&_.copy]:gap-[20px] min-[1200px]:[&_.text]:[transform:translateX(16px)] min-[1200px]:[&_.tagRow]:[transform:translate(22px,_7.38px)] min-[1200px]:[&_.date]:[transform:translate(16px,_6.47px)]",
  small:
    "small flex flex-col min-w-0 h-full text-foreground bg-background [&:hover_.art]:[filter:brightness(1)] [&:focus-visible_.art]:[filter:brightness(1)] [&_.copy_h3]:max-w-[400px] [&_.copy_h3]:[font-size:1.4rem] [&_.copy_h3]:leading-[1.3] max-[809.98px]:[&_.art]:[filter:brightness(1)] max-[809.98px]:[&_.copy]:[padding:24px] max-[809.98px]:[&_.copy]:gap-[12px] max-[809.98px]:[&_.tagRow]:min-h-[20px] max-[809.98px]:[&_.tag]:h-[20px] max-[809.98px]:[&_.text]:min-h-[52px] max-[809.98px]:[&_.date]:min-h-[34px] max-[809.98px]:[&_.copy_h3]:[font-size:14px] max-[809.98px]:[&_.copy_h3]:leading-[21px] max-[809.98px]:[&_.copy_h3]:tracking-[-0.01em]",
  copy: "copy [&_h3]:m-0 [&_h3]:font-[1000] [&_h3]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] flex flex-1 flex-col items-start gap-[14px] [padding:36px_34px_34px] [&_h3]:tracking-[-0.01em] max-[809.98px]:[padding:24px]",
  tagRow: "tagRow flex items-center min-h-[34px]",
  text: "text flex flex-col gap-[14px]",
  desc: "desc text-muted-foreground font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] max-w-[450px] m-0 [font-size:16px] leading-[1.5]",
  date: "date flex items-center min-h-[34px] tracking-normal text-muted-foreground font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_450] [font-size:12px] leading-[1.6]",
} as const;

export type PostCardClassKey = keyof typeof styles;

export function cx(...keys: Array<PostCardClassKey | string | false | null | undefined>) {
  return keys
    .filter((key): key is string => Boolean(key))
    .map((key) => (key in styles ? styles[key as PostCardClassKey] : key))
    .join(" ");
}

export default styles;
