"use client";

import Link from "next/link";
import type {
  LlmAssessmentResult,
  OverallStatus,
  RuleAssessment,
} from "@/server/domain/types";
import { STATUS_LABELS } from "@/server/domain/types";
import styles from "./ResultView.module.css";
import btnStyles from "@/components/ui/shared.module.css";

interface Props {
  systemName: string;
  systemId: string;
  evaluationId: string;
  evaluatedAt: string;
  ruleAssessment: RuleAssessment;
  llmAssessment: LlmAssessmentResult | null;
  llmStatus: string;
  professionalReviewRequired: boolean;
}

function StatusDisplay({ status }: { status: OverallStatus }) {
  const label = STATUS_LABELS[status];
  const className =
    status === "UNAUFFÄLLIG"
      ? styles.statusUnauffaellig
      : status === "HANDLUNGSBEDARF"
        ? styles.statusHandlung
        : styles.statusPruefung;
  const icon =
    status === "UNAUFFÄLLIG" ? "✓" : status === "HANDLUNGSBEDARF" ? "●" : "⚠";

  return (
    <div className={`${styles.statusValue} ${className}`}>
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function PriorityLabel({ priority }: { priority: string }) {
  const cls =
    priority === "HIGH"
      ? styles.priorityHigh
      : priority === "MEDIUM"
        ? styles.priorityMedium
        : styles.priorityLow;
  const label =
    priority === "HIGH" ? "Hoch" : priority === "MEDIUM" ? "Mittel" : "Niedrig";
  return <span className={cls}>{label}</span>;
}

export function ResultView({
  systemName,
  systemId,
  evaluationId,
  evaluatedAt,
  ruleAssessment,
  llmAssessment,
  llmStatus,
  professionalReviewRequired,
}: Props) {
  const formattedDate = new Date(evaluatedAt).toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className={styles.result}>
      <div className={styles.topActions}>
        <Link
          href={`/systems/${systemId}`}
          className={`${btnStyles.btn} ${btnStyles.btnSecondary}`}
        >
          ← System
        </Link>
        <Link
          href={`/systems/${systemId}/reassess`}
          className={`${btnStyles.btn} ${btnStyles.btnPrimary}`}
        >
          Neubewertung
        </Link>
      </div>

      <div className={styles.statusCard}>
        <div className={styles.statusHeader}>
          <div>
            <div className={styles.statusTitle}>Gesamteinschätzung</div>
            <StatusDisplay status={ruleAssessment.status} />
          </div>
        </div>
        <p style={{ marginBottom: "0.75rem", color: "var(--color-text-muted)" }}>
          {systemName}
        </p>
        <div className={styles.meta}>
          <span>Regelversion: {ruleAssessment.ruleVersion}</span>
          <span>Bewertet am: {formattedDate}</span>
          <span>Bewertungs-ID: {evaluationId.slice(0, 8)}…</span>
        </div>
      </div>

      {professionalReviewRequired && (
        <div className={styles.reviewBanner}>
          <strong>Fachliche / rechtliche Prüfung empfohlen</strong>
          Die vorliegenden Informationen sprechen dafür, dass eine vertiefte
          fachliche oder rechtliche Prüfung sinnvoll ist. Dies ist keine
          Aussage über Rechtswidrigkeit oder Konformität.
        </div>
      )}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Wichtigste Gründe</h2>
          <span className={styles.provenance}>Regelbasiert</span>
        </div>
        {ruleAssessment.findings.length === 0 ? (
          <p className={styles.emptySection}>
            Keine signifikanten Hinweise durch die konfigurierten Regeln
            identifiziert.
          </p>
        ) : (
          <div className={styles.findingList}>
            {ruleAssessment.findings.map((f) => (
              <div key={f.ruleId} className={styles.finding}>
                <div className={styles.findingHeader}>
                  <div>
                    <div className={styles.findingTitle}>{f.title}</div>
                    <div className={styles.findingId}>{f.ruleId}</div>
                  </div>
                  <PriorityLabel
                    priority={
                      f.priority === "P0" || f.priority === "P1"
                        ? "HIGH"
                        : f.priority === "P2"
                          ? "MEDIUM"
                          : "LOW"
                    }
                  />
                </div>
                <p>{f.explanation}</p>
                {f.legalBasis && (
                  <div className={styles.legalBasis}>
                    Relevante Grundlage: {f.legalBasis.source},{" "}
                    {f.legalBasis.article}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Empfohlene nächste Schritte</h2>
          <span className={styles.provenance}>Regelbasiert</span>
        </div>
        {ruleAssessment.actions.length === 0 ? (
          <p className={styles.emptySection}>Keine Maßnahmen empfohlen.</p>
        ) : (
          <ul className={styles.actionList}>
            {ruleAssessment.actions.map((a) => (
              <li key={a.actionId} className={styles.actionItem}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.25rem",
                  }}
                >
                  <strong>{a.title}</strong>
                  <PriorityLabel priority={a.priority} />
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                  {a.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {(ruleAssessment.missingInformation.length > 0 ||
        ruleAssessment.contradictions.length > 0) && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Offene Informationen</h2>
            <span className={styles.provenance}>Regelbasiert</span>
          </div>
          {ruleAssessment.contradictions.map((c) => (
            <div key={c.contradictionId} className={styles.finding}>
              <strong>Widersprüchliche Angaben</strong>
              <p>{c.description}</p>
            </div>
          ))}
          {ruleAssessment.missingInformation.map((m) => (
            <div key={m.field} className={styles.finding}>
              <strong>
                {m.importance === "REQUIRED"
                  ? "Fehlende Pflichtangabe"
                  : "Unklare Angabe"}
              </strong>
              <p>{m.description}</p>
            </div>
          ))}
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>KI-gestützte Erklärung</h2>
          <span className={`${styles.provenance} ${styles.provenanceLlm}`}>
            LLM-unterstützt
          </span>
        </div>

        {llmStatus !== "SUCCESS" || !llmAssessment ? (
          <div className={styles.llmUnavailable}>
            <strong>LLM-Erklärung nicht verfügbar</strong>
            <p style={{ marginTop: "0.35rem" }}>
              Die regelbasierte Bewertung oben ist weiterhin gültig.
              {llmStatus === "SKIPPED" &&
                " Kein GEMINI_API_KEY konfiguriert — setzen Sie den Schlüssel in .env für LLM-Erklärungen."}
              {llmStatus === "FAILED" &&
                " Die LLM-Anfrage ist fehlgeschlagen oder lieferte ungültige Daten."}
            </p>
          </div>
        ) : (
          <>
            <p className={styles.summary}>{llmAssessment.summary}</p>

            {llmAssessment.keyRisks.length > 0 && (
              <div style={{ marginTop: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    marginBottom: "0.75rem",
                  }}
                >
                  Risikoerklärungen
                </h3>
                <div className={styles.findingList}>
                  {llmAssessment.keyRisks.map((r) => (
                    <div key={r.findingId} className={styles.finding}>
                      <div className={styles.findingId}>{r.findingId}</div>
                      <p>{r.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {llmAssessment.openQuestions.length > 0 && (
              <div style={{ marginTop: "1.25rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                  }}
                >
                  Offene Fragen
                </h3>
                <ul style={{ paddingLeft: "1.25rem" }}>
                  {llmAssessment.openQuestions.map((q, i) => (
                    <li key={i} style={{ marginBottom: "0.35rem" }}>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {llmAssessment.limitations.length > 0 && (
              <div
                style={{
                  marginTop: "1rem",
                  fontSize: "0.85rem",
                  color: "var(--color-text-muted)",
                }}
              >
                {llmAssessment.limitations.map((l, i) => (
                  <p key={i}>• {l}</p>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
