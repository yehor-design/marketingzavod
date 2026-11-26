import Link from "next/link";
import { Chevron } from "@/components/careers/icons";
import { Badge } from "@/components/ui/badge";
import { cx } from "@/components/blocks/open-roles/open-roles-styles";

export type OpenRoleItem = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  tags?: readonly string[];
  href?: string;
};

export type OpenRolesProps = {
  id?: string;
  titleId?: string;
  title: string;
  description?: string;
  items: readonly OpenRoleItem[];
  className?: string;
};

export function OpenRoles({
  id = "open-roles",
  titleId = "roles-title",
  title,
  description,
  items,
  className,
}: OpenRolesProps) {
  return (
    <section
      className={cx("frame", "scroll-mt-[80px]", className)}
      id={id}
      aria-labelledby={titleId}
      data-block="open-roles"
    >
      <div className={cx("roles")}>
        <div className={cx("rolesIntro")}>
          <h2 id={titleId}>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        <ul className={cx("roleList")}>
          {items.map((item) => {
            const inner = (
              <>
                <span className={cx("roleName")}>
                  <span className={cx("roleTitle")}>{item.title}</span>
                  {item.subtitle ? (
                    <>
                      <span aria-hidden="true">/</span>
                      <span className={cx("roleDept")}>{item.subtitle}</span>
                    </>
                  ) : null}
                </span>
                {item.meta ? <span className={cx("roleLocation")}>{item.meta}</span> : null}
                {item.tags && item.tags.length > 0 ? (
                  <span className={cx("roleTags")}>
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className={cx("roleTag")}>
                        {tag}
                      </Badge>
                    ))}
                  </span>
                ) : null}
                {item.href ? (
                  <span className={cx("roleArrow")} aria-hidden="true">
                    <Chevron direction="right" />
                  </span>
                ) : null}
              </>
            );

            return (
              <li key={item.id}>
                {item.href ? (
                  <Link href={item.href}>{inner}</Link>
                ) : (
                  <div className={cx("roleStatic")}>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
