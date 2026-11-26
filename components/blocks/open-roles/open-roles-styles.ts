/** Tailwind utility map for the OpenRoles block (linked roles or static tagged rows). */
const styles = {
  frame:
    "frame [width:min(1200px,_calc(100%_-_32px))] mr-auto ml-auto [border:1px_dashed_var(--color-rule)] [&_+_.frame]:mt-[100px] text-foreground font-display font-[1000] [font-variation-settings:\"opsz\"_14,_\"wght\"_550] [&_h2]:font-[inherit] [&_p]:font-[inherit] [&_li]:font-[inherit]",
  roles: "roles min-[1200px]:grid min-[1200px]:[grid-template-columns:470px_minmax(0,_1fr)]",
  rolesIntro:
    "rolesIntro [&_p]:text-muted-foreground [&_p]:[font-size:16px] [&_p]:[font-variation-settings:\"opsz\"_14,_\"wght\"_450] [&_p]:tracking-[-0.01em] [&_p]:leading-[1.5] [padding:40px_24px] [&_h2]:m-0 [&_h2]:[font-size:1.6rem] [&_h2]:tracking-[-0.01em] [&_h2]:leading-[1.2] [&_p]:max-w-[400px] [&_p]:m-0 [border-bottom:1px_dashed_var(--color-rule)] [&_p]:mt-[16px] min-[810px]:[padding:50px_34px] min-[1200px]:pt-[34px] min-[1200px]:[max-width:none] min-[1200px]:[border-right:1px_dashed_var(--color-rule)] min-[1200px]:[border-bottom:0] min-[1200px]:[&_p]:max-w-[300px] max-[809.98px]:[padding:48px_23px_50px] max-[809.98px]:[&_p]:mt-[24px] min-[1200px]:pr-[33px] min-[1200px]:pl-[33px]",
  roleList:
    "roleList m-0 p-0 list-none [&_a]:relative [&_a]:flex [&_a]:flex-col [&_a]:gap-[4px] [&_a]:items-start [&_a]:min-h-[100px] [&_a]:[padding:24px_48px_24px_24px] [&_a]:[border-bottom:1px_dashed_var(--color-rule)] [&_li:last-child_a]:[border-bottom:0] [&_a:hover]:bg-wash min-[810px]:[&_a]:flex-row min-[810px]:[&_a]:gap-[20px] min-[810px]:[&_a]:items-center min-[810px]:[&_a]:min-h-[96px] min-[810px]:[&_a]:[padding:34px] max-[809.98px]:[&_a]:pl-[23px] max-[809.98px]:[&_a]:[padding:24px_60px_23px_24px] [&_li:last-child_.roleStatic]:[border-bottom:0]",
  roleStatic:
    "roleStatic relative flex flex-col gap-[10px] items-start min-h-[96px] [padding:24px] [border-bottom:1px_dashed_var(--color-rule)] min-[810px]:flex-row min-[810px]:gap-[20px] min-[810px]:items-center min-[810px]:justify-between min-[810px]:[padding:34px]",
  roleName:
    "roleName flex flex-wrap gap-[6px] items-baseline max-w-full [font-size:18px] tracking-[-0.01em] leading-[1.5] min-[810px]:flex-1 min-[810px]:min-w-0 max-[809.98px]:gap-y-0",
  roleTitle: "roleTitle overflow-visible whitespace-normal [overflow-wrap:break-word]",
  roleDept:
    "roleDept overflow-visible whitespace-normal [overflow-wrap:break-word] text-muted-foreground [font-variation-settings:\"opsz\"_14,_\"wght\"_450]",
  roleLocation:
    "roleLocation overflow-visible whitespace-normal [overflow-wrap:break-word] text-muted-foreground [font-variation-settings:\"opsz\"_14,_\"wght\"_450] order-[-1] [font-size:14px] tracking-[-0.01em] leading-[1.5] min-[810px]:order-0 min-[810px]:flex-none min-[810px]:[font-size:18px]",
  roleArrow:
    "roleArrow absolute top-[24px] right-[16px] inline-flex text-faint min-[810px]:static min-[810px]:flex-none",
  roleTags: "roleTags flex flex-wrap gap-[8px] items-center",
  roleTag:
    "roleTag inline-flex items-center h-[24px] [padding:0_8px] rounded-nav bg-secondary text-muted-foreground font-mono [font-size:12px] font-medium [font-variation-settings:normal] tracking-[0.02em] leading-[1.6]",
} as const;

export function cx(...names: Array<keyof typeof styles | string | false | null | undefined>) {
  return names
    .filter((name): name is string => Boolean(name))
    .map((name) => (name in styles ? styles[name as keyof typeof styles] : name))
    .join(" ");
}

export default styles;
