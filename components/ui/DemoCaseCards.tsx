"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/ui/shared.module.css";

interface DemoCase {
  key: string;
  label: string;
  description: string;
}

export function DemoCaseCards({ demos }: { demos: DemoCase[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadDemo(key: string) {
    setLoading(key);
    setError(null);
    try {
      const res = await fetch("/api/demo/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Fehler beim Laden");
        return;
      }
      router.push(`/evaluations/${data.evaluation.id}`);
    } catch {
      setError("Netzwerkfehler beim Laden des Demo-Falls");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      {error && <p style={{ color: "var(--color-danger)", marginBottom: "1rem" }}>{error}</p>}
      <div className={styles.grid}>
        {demos.map((demo) => (
          <div key={demo.key} className={styles.card}>
            <span className={`${styles.badge} ${styles.badgeDemo}`}>Demo</span>
            <h3>{demo.label}</h3>
            <p>{demo.description}</p>
            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={loading === demo.key}
                onClick={() => loadDemo(demo.key)}
              >
                {loading === demo.key ? "Wird geladen…" : "Demo starten"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
