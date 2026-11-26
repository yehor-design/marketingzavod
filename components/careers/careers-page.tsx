"use client";

import { Benefits, BenefitsHighlight, type BenefitItem } from "@/components/blocks/benefits";
import { OpenRoles, type OpenRoleItem } from "@/components/blocks/open-roles";
import { GodRays } from "@/components/motion";
import { BenefitIcon } from "@/components/careers/icons";
import { CtaLink } from "@/components/ui/button";
import { benefits, careers } from "@/lib/careers";
import styles from "@/components/careers/careers-styles";

const NBSP = "\u00A0";

const benefitItems: readonly BenefitItem[] = benefits.map((benefit) => ({
  title: benefit.title,
  body: benefit.body,
  icon: <BenefitIcon name={benefit.icon} />,
}));

const roleItems: readonly OpenRoleItem[] = careers.map((role) => ({
  id: role.slug,
  title: role.title,
  subtitle: role.department,
  meta: role.location,
  href: `/careers/${role.slug}`,
}));

export function CareersPage() {
  return (
    <div className={styles.careers}>
      <section className={styles.hero} aria-labelledby="careers-title">
        <div className={styles.band} aria-hidden="true">
          <div className={styles.bandRays}>
            <GodRays
              label=""
              shader
              speed={5}
              frequency={0.5}
              offsetY={0.96}
              spotty={0.05}
              density={0.87}
              centerIntensity={0}
              centerSize={1}
            />
            <div className={styles.grain} />
          </div>
        </div>
        <div className={styles.heroCopy}>
          <h1 id="careers-title">Build a faster web for everyone</h1>
          <p>
            At Jet, we’re on a mission to make the web lightning fast and accessible. We
            believe that every millisecond counts, and we’re building tools that empower
            creators, businesses, and agencies to deliver exceptional digital experiences,
            everywhere.
          </p>
          <div className={styles.actions}>
            <CtaLink href="/careers#benefits" text="Company" location="careers" />
            <CtaLink
              href="/careers#open-roles"
              text={`Open${NBSP}positions`}
              variant="secondary"
              location="careers"
            />
          </div>
        </div>
        <div className={styles.band} aria-hidden="true">
          <div className={styles.bandRays}>
            <GodRays
              label=""
              shader
              speed={5}
              frequency={0.5}
              offsetY={0.96}
              spotty={0.05}
              density={0.87}
              centerIntensity={0}
              centerSize={1}
            />
            <div className={styles.grain} />
          </div>
        </div>
      </section>

      <Benefits
        id="benefits"
        titleId="benefits-title"
        title="What drives us."
        description={
          <>
            <BenefitsHighlight>
              We move fast, optimize relentlessly, and always put the user first.
            </BenefitsHighlight>
            {
              " If you’re excited by performance, simplicity, and making a real impact on the web, you’ll thrive at Jet."
            }
          </>
        }
        items={benefitItems}
      />

      <OpenRoles
        id="open-roles"
        titleId="roles-title"
        title="Open roles."
        description="We’re always looking for talented people who care about speed, quality, and great user experiences."
        items={roleItems}
      />
    </div>
  );
}
