import { notFound } from "next/navigation";
import { getSystem } from "@/server/application/evaluations/service";
import { QuestionnaireForm } from "@/features/questionnaire/QuestionnaireForm";
import type { QuestionnaireInput } from "@/lib/validation/questionnaire";
import styles from "@/components/ui/shared.module.css";

function systemToForm(
  system: NonNullable<Awaited<ReturnType<typeof getSystem>>>
): QuestionnaireInput {
  return {
    name: system.name,
    description: system.description,
    department: system.department,
    status: system.status as QuestionnaireInput["status"],
    purpose: system.purpose,
    process: system.process,
    aiType: system.aiType as QuestionnaireInput["aiType"],
    provider: system.provider,
    model: system.model ?? undefined,
    usageType: system.usageType as QuestionnaireInput["usageType"],
    affectedPersons: JSON.parse(system.affectedPersons),
    decisionType: system.decisionType as QuestionnaireInput["decisionType"],
    dataCategories: JSON.parse(system.dataCategories),
    dataTransferredToExternal:
      system.dataTransferredToExternal as QuestionnaireInput["dataTransferredToExternal"],
    humanReview: system.humanReview as QuestionnaireInput["humanReview"],
    approvalProcess: system.approvalProcess as QuestionnaireInput["approvalProcess"],
    outputControl: system.outputControl as QuestionnaireInput["outputControl"],
    logging: system.logging as QuestionnaireInput["logging"],
    interventionAvailable:
      system.interventionAvailable as QuestionnaireInput["interventionAvailable"],
    escalationProcess:
      system.escalationProcess as QuestionnaireInput["escalationProcess"],
    directHumanInteraction:
      system.directHumanInteraction as QuestionnaireInput["directHumanInteraction"],
    aiUsageNotice: system.aiUsageNotice as QuestionnaireInput["aiUsageNotice"],
    aiGeneratedContentPublished:
      system.aiGeneratedContentPublished as QuestionnaireInput["aiGeneratedContentPublished"],
    contentHumanReviewed:
      system.contentHumanReviewed as QuestionnaireInput["contentHumanReviewed"],
    responsibleRole: system.responsibleRole ?? undefined,
    trainingProvided: system.trainingProvided as QuestionnaireInput["trainingProvided"],
    usageRulesDefined:
      system.usageRulesDefined as QuestionnaireInput["usageRulesDefined"],
    recruitmentScenario: system.recruitmentScenario,
    candidatePrioritisation: system.candidatePrioritisation,
    candidateSelection: system.candidateSelection,
    qualityChecks: system.qualityChecks as QuestionnaireInput["qualityChecks"],
    biasChecks: system.biasChecks as QuestionnaireInput["biasChecks"],
    providerApproval:
      system.providerApproval as QuestionnaireInput["providerApproval"],
    isDemo: system.isDemo,
    demoKey: system.demoKey ?? undefined,
  };
}

export default async function ReassessPage({
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
        <h1>Neubewertung: {system.name}</h1>
        <p>
          Passen Sie die Angaben an und führen Sie eine neue Bewertung durch.
          Die bisherigen Ergebnisse bleiben erhalten.
        </p>
      </section>
      <QuestionnaireForm
        initialData={systemToForm(system)}
        systemId={system.id}
        submitLabel="Neu bewerten"
      />
    </div>
  );
}
