/** Tailwind utilities for the shell, header, footer, and announcement. */
const chrome = {
  "site-header": "site-header fixed top-0 right-0 left-0 z-[9] [&.is-open]:flex [&.is-open]:flex-col [&.is-open]:h-[100dvh] [&.is-open]:overflow-hidden [&.is-open]:bg-nav [&.is-open]:[backdrop-filter:blur(var(--nav-blur))] [&.is-open_.menu-toggle_span:first-child]:[transform:translate(-50%,_-50%)_rotate(45deg)] [&.is-open_.menu-toggle_span:last-child]:[transform:translate(-50%,_-50%)_rotate(-45deg)] min-[1200px]:[&.is-open]:block min-[1200px]:[&.is-open]:h-auto min-[1200px]:[&.is-open]:overflow-visible min-[1200px]:[&.is-open]:bg-transparent min-[1200px]:[&.is-open]:[backdrop-filter:none]",
  "site-body": "site-body flex-1 [padding-top:var(--header-height)]",
  "checkout-shell": "checkout-shell flex items-center justify-center h-[100dvh] overflow-hidden",
  "shimmer-text": "shimmer-text relative inline-block",
  "mobile-cta": "mobile-cta font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] tracking-normal flex items-center justify-center h-[40px] rounded-button bg-foreground text-background [font-size:14px] leading-[1.7] [transition:color_300ms_linear]",
  "desktop-nav": "desktop-nav hidden [&_ul]:m-0 [&_ul]:p-0 [&_ul]:list-none [&_a]:font-display [&_a]:[font-variation-settings:\"opsz\"_14,_\"wght\"_500] min-[1200px]:flex min-[1200px]:items-center min-[1200px]:justify-center min-[1200px]:[&_ul]:flex min-[1200px]:[&_ul]:items-center min-[1200px]:[&_a]:box-border min-[1200px]:[&_a]:inline-flex min-[1200px]:[&_a]:gap-[5px] min-[1200px]:[&_a]:items-center min-[1200px]:[&_a]:[width:max-content] min-[1200px]:[&_a]:h-[30px] min-[1200px]:[&_a]:[padding:0_12px] min-[1200px]:[&_a]:text-muted-foreground min-[1200px]:[&_a]:font-display min-[1200px]:[&_a]:[font-size:12px] min-[1200px]:[&_a]:font-medium min-[1200px]:[&_a]:[font-variation-settings:\"opsz\"_14,_\"wght\"_500] min-[1200px]:[&_a]:leading-[1.6] min-[1200px]:[&_a]:tracking-normal min-[1200px]:[&_a]:[transition:padding_0.4s_cubic-bezier(0.22,_1,_0.36,_1)] min-[1200px]:[&_a:hover]:[padding:0_12px_4px] min-[1200px]:[&_a:hover]:text-foreground min-[1200px]:[&_a:focus-visible]:[padding:0_12px_4px] min-[1200px]:[&_a:focus-visible]:text-foreground min-[1200px]:[&_a:hover_.count-badge]:bg-brand min-[1200px]:[&_a:hover_.count-badge]:text-background min-[1200px]:[&_a:focus-visible_.count-badge]:bg-brand min-[1200px]:[&_a:focus-visible_.count-badge]:text-background",
  "nav-button-secondary": "nav-button-secondary bg-secondary text-foreground",
  "footer-cookie-settings": "footer-cookie-settings box-border flex items-center w-full h-[26px] min-h-[26px] [padding:0_12px_0_0] border-0 bg-none text-muted-foreground font-display [font-size:12px] font-medium [font-variation-settings:\"opsz\"_14,_\"wght\"_500] leading-[1.6] tracking-normal text-left cursor-pointer [transition:padding_0.4s_cubic-bezier(0.22,_1,_0.36,_1)] hover:pl-[4px] hover:text-foreground focus-visible:pl-[4px] focus-visible:text-foreground motion-reduce:transition-none",
  "copyright": "copyright m-0 text-faint font-display [font-size:12px] font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] leading-[1.6] tracking-normal",
  "footer-bottom": "footer-bottom flex flex-col items-start gap-[24px] pt-[50px] min-[810px]:flex-row min-[810px]:items-center min-[810px]:justify-between min-[1200px]:items-end min-[1200px]:h-[138px] min-[1200px]:pt-0",
  "count-badge": "count-badge inline-flex items-center justify-center w-[16px] h-[16px] rounded-badge bg-accent-tint shadow-badge text-brand [transition:background-color_0.4s_cubic-bezier(0.22,_1,_0.36,_1),_color_0.4s_cubic-bezier(0.22,_1,_0.36,_1)] font-mono [font-size:9px] font-medium [font-variation-settings:normal] leading-[1] tracking-normal",
  "desktop-actions": "desktop-actions hidden min-[1200px]:flex min-[1200px]:items-center min-[1200px]:justify-self-end min-[1200px]:justify-end min-[1200px]:gap-[8px]",
  "footer-column": "footer-column [&_ul]:m-0 [&_ul]:p-0 [&_ul]:list-none [&_a]:box-border [&_a]:flex [&_a]:gap-[8px] [&_a]:items-center [&_a]:w-full [&_a]:h-[26px] [&_a]:min-h-[26px] [&_a]:[padding:0_12px_0_0] [&_a]:text-muted-foreground [&_a]:font-display [&_a]:[font-size:12px] [&_a]:font-medium [&_a]:[font-variation-settings:\"opsz\"_14,_\"wght\"_500] [&_a]:leading-[1.6] [&_a]:tracking-normal [&_a]:[transition:padding_0.4s_cubic-bezier(0.22,_1,_0.36,_1)] [&_a:hover]:pl-[4px] [&_a:hover]:text-foreground [&_a:focus-visible]:pl-[4px] [&_a:focus-visible]:text-foreground min-[1200px]:w-[131px]",
  "footer-columns": "footer-columns flex flex-col gap-[24px] w-full min-[810px]:flex-row min-[810px]:gap-[44px] min-[810px]:justify-end min-[810px]:w-auto min-[1200px]:w-[480px] min-[1200px]:gap-[43px]",
  "site-footer": "site-footer [padding:100px_16px_67px] bg-background",
  "logo": "logo flex flex-none [&_img]:block min-[1200px]:justify-self-start",
  "site-main": "site-main w-full [padding:48px_20px_72px] min-[810px]:[padding:72px_32px_96px] min-[1200px]:pr-[48px] min-[1200px]:pl-[48px]",
  "nav-button-primary": "nav-button-primary bg-foreground text-background",
  "mobile-panel": "mobile-panel flex flex-1 flex-col gap-[30px] min-h-0 [padding:30px_36px_44px] overflow-y-auto min-[1200px]:hidden",
  "hiring-badge": "hiring-badge relative inline-block text-brand font-mono [font-size:12px] font-medium [font-variation-settings:normal] leading-[1.6] tracking-[0.02em]",
  "mobile-links": "mobile-links m-0 p-0 list-none flex flex-col gap-[12px] items-start [&_a]:font-display [&_a]:inline-flex [&_a]:gap-[10px] [&_a]:items-center [&_a]:min-h-[30px] [&_a]:[padding:0_12px_0_0] [&_a]:text-foreground [&_a]:[font-size:1.4rem] [&_a]:font-[1000] [&_a]:[font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_a]:leading-[1.3] [&_a]:tracking-[-0.01em] [&_a[aria-current=\"page\"]]:text-brand",
  "site-shell": "site-shell flex flex-col min-h-screen",
  "shimmer-text-glow": "shimmer-text-glow absolute inset-0 text-transparent pointer-events-none [background-image:linear-gradient(_100deg,_transparent_41%,_var(--color-shimmer)_50%,_transparent_59%_)] [background-repeat:no-repeat] [background-position:200%_center] [background-size:200%_100%] [-webkit-background-clip:text] [background-clip:text] [animation:text-shimmer_3s_linear_infinite]",
  "socials": "socials m-0 p-0 list-none flex [&_a]:relative [&_a]:inline-flex [&_a]:items-center [&_a]:justify-center [&_a]:w-[34px] [&_a]:h-[34px] [&_a]:text-muted-foreground [&_a]:[transition:color_300ms_linear] [&_a:hover]:text-foreground min-[810px]:ml-auto",
  "is-open": "is-open",
  "header-bar": "header-bar [height:var(--header-height)] bg-nav [backdrop-filter:blur(var(--nav-blur))] min-[1200px]:[padding:0_16px]",
  "footer-logo": "footer-logo [&_img]:block flex",
  "menu-toggle": "menu-toggle relative inline-flex flex-none w-[64px] h-[64px] p-0 border-0 bg-transparent cursor-pointer [&_span]:absolute [&_span]:top-[50%] [&_span]:left-[50%] [&_span]:w-[11px] [&_span]:h-[1px] [&_span]:bg-foreground [&_span:first-child]:[transform:translate(-50%,_-4px)] [&_span:last-child]:[transform:translate(-50%,_3px)] min-[1200px]:hidden",
  "nav-button": "nav-button font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] tracking-normal inline-flex items-center justify-center h-[30px] [padding:0_12px] rounded-nav [font-size:12px] leading-[1.8] [transition:color_300ms_linear]",
  "footer-title": "footer-title flex items-center h-[34px] m-0 text-foreground font-display [font-size:12px] font-medium [font-variation-settings:\"opsz\"_14,_\"wght\"_500] leading-[1.6] tracking-normal max-[809.98px]:items-start",
  "social-icon": "social-icon w-[16px] h-[16px] bg-current [-webkit-mask:var(--icon)_center_/_contain_no-repeat] [mask:var(--icon)_center_/_contain_no-repeat]",
  "header-inner": "header-inner flex items-center justify-between [height:var(--header-height)] [padding:0_16px_0_36px] min-[1200px]:grid min-[1200px]:[grid-template-columns:1fr_auto_1fr] min-[1200px]:w-full min-[1200px]:max-w-[1200px] min-[1200px]:mx-auto min-[1200px]:my-0 min-[1200px]:p-0",
  "announcement-icon": "announcement-icon inline-flex flex-none items-center justify-center w-[16px] h-[16px] rounded-pill bg-brand text-background",
  "announcement-wrap": "announcement-wrap hidden justify-center [padding:48px_16px_0]",
  "page-heading": "page-heading [max-width:14ch] m-0 font-sans [font-size:40px] font-medium tracking-[-0.045em] leading-[0.98] min-[810px]:[font-size:56px] min-[1200px]:[font-size:72px]",
  "footer-inner": "footer-inner flex flex-col gap-[50px] max-w-[1200px] mx-auto my-0 min-[1200px]:h-[250px] min-[1200px]:gap-0 min-[1200px]:justify-between",
  "announcement": "announcement inline-flex gap-[12px] items-center [padding:8px_5px_8px_10px] [border-radius:50px] bg-accent-tint text-brand font-mono [font-size:12px] font-medium leading-[1.6] tracking-[0.02em] [backdrop-filter:blur(4px)] [transition:color_300ms_linear]",
  "footer-top": "footer-top flex flex-col items-start gap-[30px] min-[810px]:flex-row min-[810px]:gap-0 min-[810px]:items-start min-[810px]:justify-between min-[1200px]:h-[112px] min-[1200px]:items-start"
} as const;

export function cx(...names: Array<string | false | null | undefined>) {
  return names
    .filter((name): name is string => Boolean(name))
    .map((name) => (name in chrome ? chrome[name as keyof typeof chrome] : name))
    .join(' ');
}
