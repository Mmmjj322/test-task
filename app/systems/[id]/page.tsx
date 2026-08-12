import { notFound } from "next/navigation";
import Link from "next/link";
import { getSystem } from "@/server/application/evaluations/service";
import styles from "@/components/ui/shared.module.css";
import { STATUS_LABELS, type OverallStatus } from "@/server/domain/types";

export default async function SystemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const system = await getSystem(id);
  if (!system) notFound();

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>{system.name}</h1>
        <p>{system.description}</p>
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link
            href={`/systems/${system.id}/reassess`}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            Neubewertung durchführen
          </Link>
          <Link
            href="/systems/new"
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            Neues System
          </Link>
        </div>
      </section>

      <section className={styles.sectionTitle}>
        <h2 className={styles.sectionTitle}>Bewertungshistorie</h2>
        {system.evaluations.length === 0 ? (
          <div className={styles.empty}>Noch keine Bewertungen.</div>
        ) : (
          <div className={styles.grid}>
            {system.evaluations.map((ev) => {
              const label =
                STATUS_LABELS[ev.overallStatus as OverallStatus] ??
                ev.overallStatus;
              return (
                <Link
                  key={ev.id}
                  href={`/evaluations/${ev.id}`}
                  className={styles.card}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className={styles.cardMeta}>
                    <span
                      className={`${styles.badge} ${
                        ev.overallStatus === "UNAUFFÄLLIG"
                          ? styles.badgeUnauffaellig
                          : ev.overallStatus === "HANDLUNGSBEDARF"
                            ? styles.badgeHandlung
                            : styles.badgePruefung
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                    {new Date(ev.evaluatedAt).toLocaleString("de-DE")}
                  </p>
                  <p style={{ fontSize: "0.85rem" }}>
                    Regelversion {ev.ruleVersion}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
