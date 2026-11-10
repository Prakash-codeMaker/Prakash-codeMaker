const test = require("node:test");
const assert = require("node:assert/strict");
const { extractBriefTerms } = require("../brief-parser");
const cases = require("./public-benchmark.cases.json");

function find(proposals, kind) {
  return proposals.find((item) => item.kind === kind);
}

test("public benchmark contains 30 labelled examples", () => {
  assert.equal(cases.length, 30);
  for (const item of cases) {
    assert.ok(item.id && item.source_url && item.source_type && item.text && item.expected);
  }
});

for (const example of cases) {
  test(example.id, () => {
    const proposals = extractBriefTerms(example.text);
    const actualKeys = proposals
      .filter((item) => item.kind === "disclosure")
      .map((item) => item.key)
      .sort();
    const expectedKeys = [...example.expected.disclosures].sort();

    assert.deepEqual(
      actualKeys,
      expectedKeys,
      "Disclosure matches did not match the expected fields"
    );

    const effort = find(proposals, "effort");
    if (example.expected.effort === null) {
      assert.equal(effort, undefined, "Unexpected effort estimate");
    } else if (typeof example.expected.effort === "object") {
      assert.ok(effort, "Expected a numeric effort estimate");
      assert.equal(effort.hours, example.expected.effort.hours);
    } else if (example.expected.effort === "range" ||
               example.expected.effort === "upper-bound" ||
               example.expected.effort === "approximate" ||
               example.expected.effort === "vague") {
      assert.ok(effort, "Expected an effort note");
      assert.equal(effort.hours, null, "Non-exact duration must not become a precise number");
      assert.equal(effort.range, true, "Range, approximation or upper bound needs manual review");
    }

    const window = find(proposals, "window");
    if (example.expected.window === null) {
      assert.equal(window, undefined, "Unexpected submission-window extraction");
    } else {
      assert.ok(window, "Expected a submission-window note");
      assert.equal(window.unit, example.expected.window.unit);
      assert.equal(window.amount, example.expected.window.amount);
      assert.equal(window.range, example.expected.window.range);
    }

    for (const excluded of (example.expected.exclude || [])) {
      assert.equal(find(proposals, excluded), undefined, "Unexpected excluded proposal");
    }
  });
}

test("a monthly work schedule is not mistaken for assignment effort", () => {
  const proposals = extractBriefTerms(
    "The internship schedule is four hours per day and five days each week. Working hours are flexible and the role is part-time."
  );
  assert.equal(find(proposals, "effort"), undefined);
  assert.equal(find(proposals, "window"), undefined);
});

test("a feedback response window is not mistaken for a submission window", () => {
  const proposals = extractBriefTerms(
    "Candidates receive feedback within 5 working days after the interview."
  );
  assert.equal(find(proposals, "window"), undefined);
});

test("an employer's AI evaluation is not confused with candidate AI-tool permission", () => {
  const proposals = extractBriefTerms(
    "We retain candidate data for 90 days and do not use automated AI evaluation."
  );
  assert.equal(find(proposals, "disclosure")?.key, undefined);
  assert.equal(proposals.some((item) => item.key === "ai_policy"), false);
  assert.equal(proposals.some((item) => item.key === "data_use"), true);
});
