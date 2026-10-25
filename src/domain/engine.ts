export type ReviewEventType = "submission" | "review" | "author_response" | "decision";
export interface ReviewEvent { sequence: number; revision: number; type: ReviewEventType; actor: string }
export function auditReviewTimeline(events: readonly ReviewEvent[]): string[] {
  const issues: string[] = []; const submitted = new Set<number>(); const reviewed = new Set<number>(); let lastSequence = 0; let latestRevision = 0;
  for (const event of events) {
    if (event.sequence <= lastSequence) issues.push("sequence_not_increasing:" + event.sequence);
    lastSequence = Math.max(lastSequence,event.sequence);
    if (event.type === "submission") { if (event.revision <= latestRevision) issues.push("revision_not_new:" + event.revision); else { latestRevision=event.revision; submitted.add(event.revision); } continue; }
    if (!submitted.has(event.revision)) { issues.push("revision_not_submitted:" + event.revision); continue; }
    if (event.type === "review") reviewed.add(event.revision);
    if (event.type === "author_response" && !reviewed.has(event.revision)) issues.push("response_without_review:" + event.revision);
    if (event.type === "decision" && !reviewed.has(event.revision)) issues.push("decision_without_review:" + event.revision);
  }
  return issues;
}