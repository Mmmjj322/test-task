import type { ActionPriority, OverallStatus, RulePriority } from "../types";

export const ACTION_PRIORITY_MAP: Record<RulePriority, ActionPriority> = {
  P0: "HIGH",
  P1: "HIGH",
  P2: "MEDIUM",
  P3: "LOW",
  P4: "LOW",
};

export function priorityToActionPriority(priority: RulePriority): ActionPriority {
  return ACTION_PRIORITY_MAP[priority];
}

const STATUS_RANK: Record<OverallStatus, number> = {
  UNAUFFÄLLIG: 0,
  HANDLUNGSBEDARF: 1,
  PRÜFUNG_ERFORDERLICH: 2,
};

export function statusPrecedence(
  current: OverallStatus,
  next: OverallStatus
): OverallStatus {
  return STATUS_RANK[next] > STATUS_RANK[current] ? next : current;
}
