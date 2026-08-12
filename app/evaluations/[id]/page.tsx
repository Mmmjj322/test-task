import { notFound } from "next/navigation";
import { getEvaluation } from "@/server/application/evaluations/service";
import { ResultView } from "@/features/results/ResultView";
import type { LlmAssessmentResult } from "@/server/domain/types";
import styles from "@/components/ui/shared.module.css";

export default async function EvaluationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const evaluation = await getEvaluation(id);
  if (!evaluation) notFound();

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>Bewertungsergebnis</h1>
        <p>
          Regelbasierte Einschätzung mit optionaler KI-Erklärung. Was ist das
          Thema, warum ist es wichtig, was sollten Sie als Nächstes tun?
        </p>
      </section>
      <ResultView
        systemName={evaluation.aiSystem.name}
        systemId={evaluation.aiSystemId}
        evaluationId={evaluation.id}
        evaluatedAt={evaluation.evaluatedAt.toISOString()}
        ruleAssessment={evaluation.ruleAssessment}
        llmAssessment={evaluation.llmAssessment as LlmAssessmentResult | null}
        llmStatus={evaluation.llmStatus}
        professionalReviewRequired={
          evaluation.professionalReviewRequired === "YES"
        }
      />
    </div>
  );
}
