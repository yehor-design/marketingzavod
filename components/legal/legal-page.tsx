import { LegalBody } from "@/components/blocks/legal-body";
import type { LegalDocument } from "@/lib/legal";
import styles from "@/components/legal/legal-styles";

export function LegalPage({ doc }: { doc: LegalDocument }) {
  return (
    <article className={styles.legal}>
      <div className={styles.meta}>
        <div className={styles.version}>
          <p>Version</p>
          <p>{doc.version}</p>
        </div>
        <p className={styles.date}>{doc.date}</p>
      </div>
      <div className={styles.column}>
        <header className={styles.heading}>
          <div className={styles.headingRow}>
            <h1 className={styles.quiet}>Legal</h1>
            <div className={styles.name}>
              <h1 className={styles.quiet}>/</h1>
              <h1>{doc.heading}</h1>
            </div>
          </div>
        </header>
        <LegalBody blocks={doc.blocks} />
      </div>
    </article>
  );
}
