import { describe, expect, it } from "vitest";
import { auditReviewTimeline } from "../src/domain/engine.js";
describe("review timeline", () => {
  it("accepts a revision with review, response, and decision", () => { expect(auditReviewTimeline([{sequence:1,revision:1,type:"submission",actor:"author"},{sequence:2,revision:1,type:"review",actor:"reviewer"},{sequence:3,revision:1,type:"author_response",actor:"author"},{sequence:4,revision:1,type:"decision",actor:"editor"}])).toEqual([]); });
  it("flags a decision with no review", () => { expect(auditReviewTimeline([{sequence:1,revision:1,type:"submission",actor:"author"},{sequence:2,revision:1,type:"decision",actor:"editor"}])).toContain("decision_without_review:1"); });
});