"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuestionnaireInput } from "@/lib/validation/questionnaire";
import styles from "./QuestionnaireForm.module.css";
import btnStyles from "@/components/ui/shared.module.css";

const DEFAULT_VALUES: QuestionnaireInput = {
  name: "",
  description: "",
  department: "",
  status: "IDEA",
  purpose: "",
  process: "",
  aiType: "UNKNOWN",
  provider: "",
  model: "",
  usageType: "UNKNOWN",
  affectedPersons: [],
  decisionType: "UNKNOWN",
  dataCategories: [],
  dataTransferredToExternal: "UNKNOWN",
  humanReview: "UNKNOWN",
  approvalProcess: "UNKNOWN",
  outputControl: "UNKNOWN",
  logging: "UNKNOWN",
  interventionAvailable: "UNKNOWN",
  escalationProcess: "UNKNOWN",
  directHumanInteraction: "UNKNOWN",
  aiUsageNotice: "UNKNOWN",
  aiGeneratedContentPublished: "UNKNOWN",
  contentHumanReviewed: "UNKNOWN",
  responsibleRole: "",
  trainingProvided: "UNKNOWN",
  usageRulesDefined: "UNKNOWN",
  recruitmentScenario: false,
  candidatePrioritisation: false,
  candidateSelection: false,
  qualityChecks: "UNKNOWN",
  biasChecks: "UNKNOWN",
  providerApproval: "UNKNOWN",
};

interface Props {
  initialData?: QuestionnaireInput;
  systemId?: string;
  submitLabel?: string;
}

function TriStateSelect({
  label,
  value,
  onChange,
  includeNA,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  includeNA?: boolean;
}) {
  const options = includeNA
    ? ["YES", "NO", "UNKNOWN", "NOT_APPLICABLE"]
    : ["YES", "NO", "UNKNOWN"];
  const labels: Record<string, string> = {
    YES: "Ja",
    NO: "Nein",
    UNKNOWN: "Unbekannt",
    NOT_APPLICABLE: "Nicht zutreffend",
  };
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {labels[o]}
          </option>
        ))}
      </select>
    </div>
  );
}

export function QuestionnaireForm({
  initialData,
  systemId,
  submitLabel = "Bewerten",
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState<QuestionnaireInput>({
    ...DEFAULT_VALUES,
    ...initialData,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof QuestionnaireInput>(
    key: K,
    value: QuestionnaireInput[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArrayItem(
    key: "affectedPersons" | "dataCategories",
    item: string
  ) {
    setForm((prev) => {
      const arr = prev[key] as string[];
      if (arr.includes(item)) {
        return { ...prev, [key]: arr.filter((i) => i !== item) };
      }
      return { ...prev, [key]: [...arr, item] };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = systemId
        ? `/api/systems/${systemId}/evaluations`
        : "/api/systems";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Bewertung fehlgeschlagen");
        return;
      }
      router.push(`/evaluations/${data.evaluation.id}`);
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setLoading(false);
    }
  }

  const showAiDisclosure = form.directHumanInteraction === "YES";
  const showRecruitment =
    form.affectedPersons.includes("APPLICANTS") || form.recruitmentScenario;
  const showExternalData =
    form.dataTransferredToExternal === "YES" ||
    (form.provider !== "Internal" &&
      form.provider !== "" &&
      form.usageType !== "INTERNAL");
  const showHumanOversight =
    form.decisionType !== "INFORMATION_ONLY" &&
    form.decisionType !== "UNKNOWN";

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.formError}>{error}</div>}

      <section className={styles.section}>
        <h2>Grunddaten</h2>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Name *</label>
            <input
              className={styles.input}
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Fachbereich *</label>
            <input
              className={styles.input}
              required
              value={form.department}
              onChange={(e) => update("department", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select
              className={styles.select}
              value={form.status}
              onChange={(e) =>
                update("status", e.target.value as QuestionnaireInput["status"])
              }
            >
              <option value="IDEA">Idee</option>
              <option value="PILOT">Pilot</option>
              <option value="PRODUCTION">Produktiv</option>
            </select>
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>Beschreibung *</label>
            <textarea
              className={styles.textarea}
              required
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Zweck</h2>
        <div className={styles.fieldGrid}>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>Welches Problem löst das System? *</label>
            <textarea
              className={styles.textarea}
              required
              value={form.purpose}
              onChange={(e) => update("purpose", e.target.value)}
            />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label}>Welchen Prozess unterstützt es? *</label>
            <textarea
              className={styles.textarea}
              required
              value={form.process}
              onChange={(e) => update("process", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>KI-Einsatz</h2>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Art der KI</label>
            <select
              className={styles.select}
              value={form.aiType}
              onChange={(e) =>
                update("aiType", e.target.value as QuestionnaireInput["aiType"])
              }
            >
              <option value="GENERATIVE">Generative KI</option>
              <option value="PREDICTIVE">Predictive</option>
              <option value="CLASSIFICATION">Klassifikation</option>
              <option value="RECOMMENDATION">Empfehlung</option>
              <option value="CONVERSATIONAL">Konversation</option>
              <option value="OTHER">Sonstige</option>
              <option value="UNKNOWN">Unbekannt</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Anbieter *</label>
            <input
              className={styles.input}
              required
              value={form.provider}
              onChange={(e) => update("provider", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Modell</label>
            <input
              className={styles.input}
              value={form.model ?? ""}
              onChange={(e) => update("model", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Nutzungsart</label>
            <select
              className={styles.select}
              value={form.usageType}
              onChange={(e) =>
                update(
                  "usageType",
                  e.target.value as QuestionnaireInput["usageType"]
                )
              }
            >
              <option value="INTERNAL">Intern</option>
              <option value="EXTERNAL">Extern</option>
              <option value="BOTH">Beides</option>
              <option value="UNKNOWN">Unbekannt</option>
            </select>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Betroffene Personen</h2>
        <div className={styles.checkboxGroup}>
          {[
            ["EMPLOYEES", "Mitarbeiter"],
            ["CUSTOMERS", "Kunden"],
            ["APPLICANTS", "Bewerber"],
            ["PUBLIC", "Öffentlichkeit"],
            ["NONE", "Keine externen Personen"],
          ].map(([value, label]) => (
            <label key={value} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.affectedPersons.includes(
                  value as QuestionnaireInput["affectedPersons"][number]
                )}
                onChange={() =>
                  toggleArrayItem("affectedPersons", value)
                }
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Entscheidung</h2>
        <div className={styles.field}>
          <label className={styles.label}>Entscheidungseinfluss</label>
          <select
            className={styles.select}
            value={form.decisionType}
            onChange={(e) =>
              update(
                "decisionType",
                e.target.value as QuestionnaireInput["decisionType"]
              )
            }
          >
            <option value="INFORMATION_ONLY">Informiert nur</option>
            <option value="DECISION_SUPPORT">Unterstützt Entscheidungen</option>
            <option value="PRIORITIZATION">Priorisiert / sortiert</option>
            <option value="PARTIALLY_AUTOMATED">Teilweise automatisiert</option>
            <option value="FULLY_AUTOMATED">Vollständig automatisiert</option>
            <option value="UNKNOWN">Unbekannt</option>
          </select>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Daten</h2>
        <div className={styles.checkboxGroup}>
          {[
            ["NO_PERSONAL_DATA", "Keine personenbezogenen Daten"],
            ["PERSONAL_DATA", "Personenbezogene Daten"],
            ["SPECIAL_CATEGORY_DATA", "Besonders schützenswerte Daten"],
            ["CONFIDENTIAL_BUSINESS_DATA", "Vertrauliche Unternehmensdaten"],
          ].map(([value, label]) => (
            <label key={value} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.dataCategories.includes(
                  value as QuestionnaireInput["dataCategories"][number]
                )}
                onChange={() => toggleArrayItem("dataCategories", value)}
              />
              {label}
            </label>
          ))}
        </div>
        <div className={styles.conditional}>
          <TriStateSelect
            label="Datenübertragung an externen Anbieter?"
            value={form.dataTransferredToExternal}
            onChange={(v) =>
              update(
                "dataTransferredToExternal",
                v as QuestionnaireInput["dataTransferredToExternal"]
              )
            }
          />
        </div>
        {showExternalData && (
          <div className={styles.conditional}>
            <TriStateSelect
              label="Anbieterfreigabe dokumentiert?"
              value={form.providerApproval}
              onChange={(v) =>
                update(
                  "providerApproval",
                  v as QuestionnaireInput["providerApproval"]
                )
              }
            />
          </div>
        )}
      </section>

      {showHumanOversight && (
        <section className={styles.section}>
          <h2>Menschliche Kontrolle</h2>
          <div className={styles.fieldGrid}>
            <TriStateSelect
              label="Menschliche Prüfung"
              value={form.humanReview}
              onChange={(v) =>
                update("humanReview", v as QuestionnaireInput["humanReview"])
              }
            />
            <TriStateSelect
              label="Freigabeprozess"
              value={form.approvalProcess}
              onChange={(v) =>
                update(
                  "approvalProcess",
                  v as QuestionnaireInput["approvalProcess"]
                )
              }
            />
            <TriStateSelect
              label="Output-Kontrolle"
              value={form.outputControl}
              onChange={(v) =>
                update("outputControl", v as QuestionnaireInput["outputControl"])
              }
            />
            <TriStateSelect
              label="Protokollierung"
              value={form.logging}
              onChange={(v) =>
                update("logging", v as QuestionnaireInput["logging"])
              }
            />
            <TriStateSelect
              label="Eingriffsmöglichkeit"
              value={form.interventionAvailable}
              onChange={(v) =>
                update(
                  "interventionAvailable",
                  v as QuestionnaireInput["interventionAvailable"]
                )
              }
            />
            <TriStateSelect
              label="Eskalationsweg"
              value={form.escalationProcess}
              onChange={(v) =>
                update(
                  "escalationProcess",
                  v as QuestionnaireInput["escalationProcess"]
                )
              }
            />
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2>Transparenz</h2>
        <div className={styles.fieldGrid}>
          <TriStateSelect
            label="Direkte Interaktion mit KI?"
            value={form.directHumanInteraction}
            onChange={(v) =>
              update(
                "directHumanInteraction",
                v as QuestionnaireInput["directHumanInteraction"]
              )
            }
          />
          {showAiDisclosure && (
            <TriStateSelect
              label="Hinweis auf KI-Nutzung vorhanden?"
              value={form.aiUsageNotice}
              onChange={(v) =>
                update("aiUsageNotice", v as QuestionnaireInput["aiUsageNotice"])
              }
              includeNA
            />
          )}
          <TriStateSelect
            label="KI-Inhalte werden veröffentlicht?"
            value={form.aiGeneratedContentPublished}
            onChange={(v) =>
              update(
                "aiGeneratedContentPublished",
                v as QuestionnaireInput["aiGeneratedContentPublished"]
              )
            }
          />
          {form.aiGeneratedContentPublished === "YES" && (
            <TriStateSelect
              label="Inhalte vor Veröffentlichung geprüft?"
              value={form.contentHumanReviewed}
              onChange={(v) =>
                update(
                  "contentHumanReviewed",
                  v as QuestionnaireInput["contentHumanReviewed"]
                )
              }
              includeNA
            />
          )}
        </div>
      </section>

      {showRecruitment && (
        <section className={styles.section}>
          <h2>Recruiting-Szenario</h2>
          <div className={styles.fieldGrid}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.recruitmentScenario}
                onChange={(e) => update("recruitmentScenario", e.target.checked)}
              />
              Recruiting-Anwendungsfall
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.candidatePrioritisation}
                onChange={(e) =>
                  update("candidatePrioritisation", e.target.checked)
                }
              />
              Bewerbungen werden priorisiert
            </label>
            <TriStateSelect
              label="Qualitätskontrollen dokumentiert?"
              value={form.qualityChecks}
              onChange={(v) =>
                update("qualityChecks", v as QuestionnaireInput["qualityChecks"])
              }
            />
            <TriStateSelect
              label="Bias-Kontrollen dokumentiert?"
              value={form.biasChecks}
              onChange={(v) =>
                update("biasChecks", v as QuestionnaireInput["biasChecks"])
              }
            />
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2>Verantwortung</h2>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Verantwortliche Rolle</label>
            <input
              className={styles.input}
              value={form.responsibleRole ?? ""}
              onChange={(e) => update("responsibleRole", e.target.value)}
              placeholder="z.B. KI-Produktowner"
            />
          </div>
          <TriStateSelect
            label="Schulungen vorhanden?"
            value={form.trainingProvided}
            onChange={(v) =>
              update(
                "trainingProvided",
                v as QuestionnaireInput["trainingProvided"]
              )
            }
          />
          <TriStateSelect
            label="Nutzungsregeln definiert?"
            value={form.usageRulesDefined}
            onChange={(v) =>
              update(
                "usageRulesDefined",
                v as QuestionnaireInput["usageRulesDefined"]
              )
            }
          />
        </div>
      </section>

      <div className={styles.actions}>
        <button
          type="submit"
          className={`${btnStyles.btn} ${btnStyles.btnPrimary}`}
          disabled={loading}
        >
          {loading ? "Wird bewertet…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
