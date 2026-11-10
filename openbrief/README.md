# OpenBrief — Assessment Passport (community draft 0.1)

**Status: experimental pilot. Not an adopted standard.**

OpenBrief is a proposed open format for recording the terms and lifecycle of a hiring assessment. The first reference implementation is candidate-first: it gives a candidate immediate private utility without requiring an employer, applicant-tracking system, or assessment vendor to integrate.

## The problem this pilot tests

Hiring assessments can ask candidates to invest substantial time, while important terms may be unclear: what is being tested, what “done” means, how work is evaluated, whether AI tools are allowed, whether the work is paid, who owns it, how submissions are retained, and when candidates will hear back.

OpenBrief makes those terms explicit and portable. It is not a review site, job board, proctoring product, or employer blacklist.

## First release

The reference app currently supports:

- Create and edit a structured assessment record.
- Track 12 terms: nine assessment disclosures plus expected effort, submission window and deadline, and clearly show which are missing.
- Paste an assessment brief or load a text-based `.txt`, `.md` or `.html` file for local keyword-assisted extraction.
- Review exact source excerpts matched to purpose, deliverables, rubric, AI/tool policy, compensation, IP/reuse, data use, feedback and contact fields; select which passages to use before they enter the record.
- Keep **expected active work effort**, **submission window**, and **exact deadline** in separate fields. Preserve range/approximate wording such as “3–4 focused hours” or “submit within 48–72 hours”; do not silently convert it to a single precise number or date.
- Handle Indian hiring vocabulary such as ₹ / INR / Rs., stipend, per-month pay, take-home task, live exercise, case study, work sample, NDA, IP assignment, repository links and AI coding-tool policies.
- Label imported passages as `candidate_transcribed`, not employer-certified facts. The parser is heuristic, not an AI model, and may miss or misclassify passages.
- Record candidate work sessions and elapsed time.
- Record candidate-reported submission, receipt acknowledgement, feedback, and outcome milestones. These are not treated as employer-verified events.
- See a suggested next step based on the current assessment lifecycle.
- Export one record or the full passport as JSON; import a backup without overwriting records already in the browser.
- Copy a clarification request for missing terms and a follow-up message after submission.
- Accept only HTTP(S) brief links and validate imported records before adding them.
- Store data locally in the browser. Brief text is processed client-side and is not uploaded by this feature; no login, analytics, server sync, or employer access.

Brief importer limits: only pasted text and `.txt`, `.md` or `.html` files are supported. PDF and DOCX extraction are not included. The parser uses keyword patterns on text in the browser; candidates must review each excerpt and correct any false match. It does not follow brief links, crawl websites, summarise content with AI, or prove that a passage came from the employer. Avoid confidential instructions, personal data or material you are not permitted to copy. The app does not upload the pasted/file text or work product.

## Candidate pilot

A voluntary 15–20 minute candidate feedback flow is available at `pilot-feedback.html`. It exports a consented JSON report locally and does not transmit feedback to a server. The facilitator protocol, invitation copy and aggregation script are in `pilot/`.

The first cohort target is 8–10 candidates across technical and non-technical assessment types. Compare manual entry and importer-assisted entry with the same sanitised brief, counterbalance the order, and collect elapsed times plus candidate-reviewed extraction accuracy. Never request confidential briefs or raw assessment submissions.

Run the feedback analysis script against a folder of consented JSON reports:

```bash
node openbrief/pilot/analyse-feedback.js openbrief/pilot/feedback-files
```

## Parser regression benchmark

Run the local tests from the repository root with:

```bash
node --test openbrief/tests/brief-parser.test.js
```

The regression set contains **30 paraphrased examples** based on public Indian internship hiring pages and task specifications across engineering, QA, AI/ML, product, design, data, operations, content and legal roles. It includes public task repositories, published hiring-process descriptions, a negative example where a company states it has no take-home, and a schedule-hours negative control. Source URLs and source-type labels are in `tests/public-benchmark.cases.json`.

This is a **public-process regression corpus, not a permissioned collection of 30 full employer briefs**. Most source pages describe a hiring process rather than disclose the complete assignment. One linked task artifact was shared publicly by a candidate and is explicitly labelled as such, not employer-authorised. Inputs in the test set are paraphrased for regression testing; they are not presented as original company documents. Obtain explicit permission before adding private employer briefs or candidate-submitted confidential assignments to a future gold-standard dataset.

**Backup note:** use Export all data to create a JSON backup and Import backup to restore it in another browser profile. Import adds records with new IDs and skips duplicate IDs; it does not replace existing records. Keep an additional copy somewhere secure because browser storage can be cleared.

## Core disclosure vocabulary

The draft tracks: purpose/skill tested; scope and deliverables; expected effort; deadline; evaluation criteria; permitted tools and AI policy; compensation; intellectual-property and reuse rights; data use and automated evaluation; feedback/decision timeline; and a clarification contact.

A missing field means **not disclosed in this record**. It is not proof that an employer did not disclose the information elsewhere. Values transcribed by a candidate must not be represented as independently employer-certified. The reference app asks the candidate to classify entered terms as copied from an employer-provided source, inferred/paraphrased, or unknown; this is still a candidate-selected provenance label, not an employer attestation.

## Provenance model

| Label | Meaning |
|---|---|
| `employer_declared` | A term published or explicitly stated by the employer. A compatible employer system should identify the source. |
| `candidate_transcribed` | The candidate copied the term from an employer-provided source. |
| `candidate_reported` | The candidate recorded an action or a statement they received. |
| `candidate_device` | A timestamp generated by the candidate's browser/device. Not independently verified. |
| `third_party_verified` | An independent verifier attested to the event or claim. Not implemented in this pilot. |
| `unknown` | Provenance cannot be established. |

Do not collapse these labels into a single “verified” flag.

## Event vocabulary

`assessment_created`, `disclosure_updated`, `work_started`, `work_stopped`, `time_logged`, `submission_sent`, `employer_acknowledgment_recorded`, `feedback_received`, and `outcome_received`.

An event records both `happened_at` and `recorded_at`. The pilot's browser-generated values are self-reported device timestamps, not a trusted timestamping service. A future compatible employer system may emit a separately attributable acknowledgement.

## Protocol design principles

1. **Candidate control:** records should be exportable and deletable by their owner.
2. **Source clarity:** an employer-declared fact, candidate transcription, self-report, and third-party attestation remain distinguishable.
3. **Progressive adoption:** the candidate passport works without platform permission; employer/ATS integrations can be added later.
4. **Minimal disclosure:** no public profile or public employer score is required.
5. **Interoperability:** JSON is the first exchange format; future adapters may map to existing credential and assessment standards rather than reinventing them.

## Non-goals for 0.1

- No public employer ratings or blacklists.
- No independent verification or tamper-proof claims.
- No candidate ranking, CV scoring, or job matching.
- No automated judgement of whether an assessment is fair.
- No collection or redistribution of candidate work product.
- No employer dashboard, ATS integration, or analytics backend.

## Validation plan

Before claiming product-market fit or promoting this as a standard:

1. Collect 30 real assessment briefs with permission; redact personal and confidential content.
2. Interview 20 candidates about missing terms and real time spent.
3. Ask 5 recruiters or hiring managers which disclosures they can publish and why.
4. Test whether 10 candidates use an exported passport on a real assessment.
5. Seek 3 employers willing to publish a structured brief or acknowledge receipt.

Measure missing-field frequency, expected-vs-actual effort, repeat use, clarification response, and willingness to adopt. Publish sample sizes and limitations. If candidates do not reuse the passport, revisit the problem before adding integrations.

## Files

- `index.html` — local-first reference application with a candidate-reviewed brief importer.
- `brief-parser.js` — separately testable local keyword parser.
- `pilot-feedback.html` — local-only candidate feedback export page.
- `pilot/README.md` — consent, recruitment, session protocol and metrics.
- `pilot/invitation.md` — candidate invitation copy.
- `pilot/analyse-feedback.js` — summary analysis for consented JSON feedback files.
- `tests/brief-parser.test.js` — Node.js regression tests.
- `tests/public-benchmark.cases.json` — 30 paraphrased public-source test cases and source links.
- `openbrief-assessment.schema.json` — JSON Schema draft 0.1.

## License

No license has been selected yet. This repository is a private pilot branch at the time of this draft; choose an explicit open-source license before inviting external contributions.
