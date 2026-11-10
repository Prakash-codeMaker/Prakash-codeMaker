#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const dir = process.argv[2];
if (!dir) {
  console.error("Usage: node openbrief/pilot/analyse-feedback.js <folder-of-feedback-json>");
  process.exit(2);
}
if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
  console.error("Feedback folder does not exist: " + dir);
  process.exit(2);
}

const files = fs.readdirSync(dir).filter(name => name.toLowerCase().endsWith(".json"));
const rows = [];
const skipped = [];
for (const name of files) {
  const full = path.join(dir, name);
  try {
    const item = JSON.parse(fs.readFileSync(full, "utf8"));
    if (item.openbrief_pilot_feedback_version !== "0.4" || item.consent_to_share !== true) {
      skipped.push(name);
      continue;
    }
    const m = item.method_comparison || {};
    const e = item.extraction_review || {};
    const r = item.ratings || {};
    const finite = value => Number.isFinite(Number(value)) ? Number(value) : null;
    const manual = finite(m.manual_entry_minutes);
    const imported = finite(m.importer_assisted_minutes);
    const correct = finite(e.accurate_and_useful);
    const wrong = finite(e.wrong_or_misleading);
    const missed = finite(e.clearly_stated_terms_missed);
    const precisionDenom = correct == null || wrong == null ? 0 : correct + wrong;
    const recallDenom = correct == null || missed == null ? 0 : correct + missed;
    rows.push({
      role: item.assessment_context && item.assessment_context.role_area || "Unknown",
      type: item.assessment_context && item.assessment_context.assessment_type || "Unknown",
      manual,
      importer: imported,
      saved: manual == null || imported == null ? null : manual - imported,
      reduction: manual == null || imported == null || manual <= 0 ? null : (manual - imported) / manual * 100,
      precision: precisionDenom ? correct / precisionDenom * 100 : null,
      recallProxy: recallDenom ? correct / recallDenom * 100 : null,
      wrong,
      missed,
      edited: finite(e.substantially_corrected),
      usefulness: finite(r.usefulness),
      clarity: finite(r.clarity_of_missing_terms),
      trust: finite(r.trust_after_human_review),
      reuse: finite(r.likelihood_of_reuse)
    });
  } catch (error) {
    skipped.push(name + " (invalid JSON)");
  }
}
const median = values => {
  const x = values.filter(v => Number.isFinite(v)).sort((a,b)=>a-b);
  if (!x.length) return null;
  const mid = Math.floor(x.length / 2);
  return x.length % 2 ? x[mid] : (x[mid-1] + x[mid]) / 2;
};
const average = values => {
  const x = values.filter(v => Number.isFinite(v));
  return x.length ? x.reduce((a,b)=>a+b,0) / x.length : null;
};
const metric = key => rows.map(row=>row[key]).filter(v=>v!=null);
const ratingKeys = ["usefulness","clarity","trust","reuse"];
const output = {
  note: "Exploratory convenience-sample results. Not population estimates or employer validation.",
  consentedResponses: rows.length,
  skippedFiles: skipped,
  roleMix: rows.reduce((out,row)=>{out[row.role]=(out[row.role]||0)+1;return out;},{}),
  medianManualMinutes: median(metric("manual")),
  medianImporterMinutes: median(metric("importer")),
  medianMinutesSaved: median(metric("saved")),
  medianTimeReductionPercent: median(metric("reduction")),
  medianSuggestionPrecisionPercent: median(metric("precision")),
  medianSuggestionRecallProxyPercent: median(metric("recallProxy")),
  averageWrongSuggestions: average(metric("wrong")),
  averageMissedTerms: average(metric("missed")),
  averageSubstantialCorrections: average(metric("edited")),
  averageRatings: Object.fromEntries(ratingKeys.map(key=>[key,average(metric(key))]))
};
console.log(JSON.stringify(output,null,2));
