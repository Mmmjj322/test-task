import { QuestionnaireForm } from "@/features/questionnaire/QuestionnaireForm";
import styles from "@/components/ui/shared.module.css";

export default function NewSystemPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>Neues KI-System erfassen</h1>
        <p>
          Beantworten Sie die Fragen zum KI-System. Relevante Folgefragen
          erscheinen automatisch.
        </p>
      </section>
      <QuestionnaireForm />
    </div>
  );
}
