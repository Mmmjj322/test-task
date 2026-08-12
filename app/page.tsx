import Link from "next/link";
import { listSystems } from "@/server/application/evaluations/service";
import { listDemoCases } from "@/demo/cases";
import { DemoCaseCards } from "@/components/ui/DemoCaseCards";
import styles from "@/components/ui/shared.module.css";
import { STATUS_LABELS, type OverallStatus } from "@/server/domain/types";
export const dynamic = "force-dynamic";

function StatusBadge({ status }: { status: string | undefined }) {
  if (!status) return null;
  const label = STATUS_LABELS[status as OverallStatus] ?? status;
  const className =
    status === "UNAUFFÄLLIG"
      ? styles.badgeUnauffaellig
      : status === "HANDLUNGSBEDARF"
        ? styles.badgeHandlung
        : styles.badgePruefung;

  return (
    <span className={`${styles.badge} ${className}`}>
      {status === "PRÜFUNG_ERFORDERLICH" && "⚠ "}
      {status === "HANDLUNGSBEDARF" && "● "}
      {status === "UNAUFFÄLLIG" && "✓ "}
      {label}
    </span>
  );
}

export default async function HomePage() {
  const systems = await listSystems();
  const demos = listDemoCases();

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>KI-System-Check</h1>
        <p>
          Erfassen und bewerten Sie einzelne KI-Systeme. Erhalten Sie eine
          regelbasierte Ersteinschätzung mit konkreten nächsten Schritten —
          verständlich für Entscheider, ohne Rechtsberatung zu ersetzen.
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Demo-Fälle</h2>
        <DemoCaseCards demos={demos} />
      </section>

      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
            Ihre KI-Systeme
          </h2>
          <Link href="/systems/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            + Neues System
          </Link>
        </div>

        {systems.length === 0 ? (
          <div className={styles.empty}>
            <p>Noch keine KI-Systeme erfasst.</p>
            <p style={{ marginTop: "0.5rem" }}>
              Starten Sie mit einem Demo-Fall oder legen Sie ein neues System an.
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {systems.map((system) => {
              const latestEval = system.evaluations[0];
              return (
                <div key={system.id} className={styles.card}>
                  <div className={styles.cardMeta}>
                    {system.isDemo && (
                      <span className={`${styles.badge} ${styles.badgeDemo}`}>Demo</span>
                    )}
                    <StatusBadge status={latestEval?.overallStatus} />
                  </div>
                  <h3>{system.name}</h3>
                  <p>{system.description}</p>
                  <div className={styles.actions}>
                    <Link
                      href={`/systems/${system.id}`}
                      className={`${styles.btn} ${styles.btnSecondary}`}
                    >
                      Details
                    </Link>
                    {latestEval && (
                      <Link
                        href={`/evaluations/${latestEval.id}`}
                        className={`${styles.btn} ${styles.btnPrimary}`}
                      >
                        Letzte Bewertung
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className={styles.disclaimer}>
        Dieses Tool dient der frühen Risiko- und Governance-Einschätzung. Es
        stellt keine Rechtsberatung dar und behauptet keine verbindliche
        Konformität.
      </div>
    </div>
  );
}
