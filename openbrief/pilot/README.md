# OpenBrief candidate pilot — v0.4

## Purpose

Test whether the Assessment Passport helps real internship applicants understand and record assessment terms faster and more accurately than manual entry. This is a usability and extraction-quality pilot, not evidence of employer adoption, hiring fairness or industry validation.

## Who to recruit

Start with **8–10 candidates** who have completed or received an internship/job assessment in the last 12 months. Aim for a mix rather than only software engineers:

- 3–4 software / engineering / QA
- 1–2 data / AI / analytics
- 1–2 design / product
- 1–2 content / operations / research / business

Recruit through personal student networks, college groups, hackathon peers and candidate communities. Ask people individually or through a moderator; do not mass-message strangers or post confidential assignment content. The first cohort is for finding usability problems, not estimating population-wide outcomes.

## What a participant needs

- A desktop or laptop browser.
- A public, past or current assessment brief they are allowed to discuss. A paraphrase or synthetic example is fine.
- 15–20 minutes.
- A stopwatch.
- The OpenBrief app and the separate feedback page.

Links:
- App: https://openbrief-passport-im-prakashs-projects.vercel.app/
- Feedback: https://openbrief-passport-im-prakashs-projects.vercel.app/pilot-feedback.html

## Consent and privacy rules

1. Participation is voluntary and unrelated to any employer's hiring decision.
2. Never ask a participant to break an NDA, policy or confidentiality promise. Do not accept private employer documents, candidate personal data, assessment answers, source code, names, email addresses or screenshots.
3. Prefer public briefs or paraphrased terms. If a participant uses a current/past brief, ask them to redact employer and personal identifiers and use only material they are permitted to process.
4. The app stores assessment records in the participant's browser localStorage. The importer parses pasted/file text in the browser. Do not ask participants to export their passport records.
5. The feedback page does not transmit responses. Participants explicitly export a JSON feedback file and choose whether to share it.
6. Assign each participant an anonymous code such as P01. Keep contact details, if separately provided for scheduling, away from feedback data. Do not put company names or source brief URLs into feedback.
7. Delete test records after the session if the participant does not wish to keep them. Explain that clearing browser data can remove their records.

## 15–20 minute session protocol

### Before the task (2 minutes)

- Explain the purpose and privacy rules above.
- Assign a participant code (P01, P02…); do not record their legal name in the feedback JSON.
- Counterbalance order: odd-numbered participants do manual entry first; even-numbered participants use the importer first. They will use the same sanitised brief for both runs.
- Ask them not to share the brief text with the facilitator.

### Run A and Run B (5–7 minutes each)

Use the same brief for both runs. Start the stopwatch when the participant opens the chosen workflow; stop when a complete passport record has been saved.

**Manual run:** choose “Add assessment”, enter the terms they can identify, and save the record.

**Importer run:** choose “Import from brief”, paste the same sanitised brief, scan, review every suggestion, select only supported excerpts, finish the form and save the record.

Before the second run, delete the temporary first record (or use a fresh browser profile). Do not reuse the first record as the second one. Note that the same-brief crossover can create a memory effect; counterbalancing the order reduces but does not remove it.

### Accuracy review

Using the source brief on the participant's own screen, ask them to count:
- **Suggestions shown:** all disclosure and timing suggestions produced.
- **Accurate and useful:** suggestions that faithfully represent a clearly stated term.
- **Wrong or misleading:** suggestions that misstate a term, assign it to the wrong category or imply something the source does not say.
- **Clearly stated terms missed:** relevant terms explicitly present in the source but not suggested.
- **Substantially corrected:** suggestions needing a material rewrite before saving.

Do not count a genuinely absent term as a parser error. “Not disclosed” is the correct state where the source is silent.

### Feedback (3–4 minutes)

Open the feedback page, enter timing and counts, rate usefulness, clarity, trust after review and likelihood of reuse. Export the JSON only with the participant's consent. Ask them to send the JSON file to the person who invited them. Do not ask them to send the original assessment brief.

## What to measure

For each participant:
- Time saved (minutes) = manual entry minutes − importer-assisted minutes.
- Time reduction (%) = time saved ÷ manual entry minutes × 100. Omit when manual time is zero.
- Suggestion precision = accurate and useful ÷ (accurate and useful + wrong or misleading). Omit when denominator is zero.
- Suggestion recall proxy = accurate and useful ÷ (accurate and useful + clearly stated terms missed). This is a small, human-counted proxy, not a formal information-retrieval benchmark.
- Substantial correction count and participant ratings.

Aggregate medians as well as counts. Show role mix and missing responses. Do not pool unlike assessment types without reporting the mix.

## Early decision gates (proposed, not industry standards)

After 8–10 sessions, continue to a wider pilot only if:
- Median importer time is at least 20% lower than manual entry, without a large accuracy drop.
- Median usefulness and clarity ratings are at least 4/5.
- No repeated high-impact errors in effort, submission window, compensation, candidate AI-tool policy, employer AI evaluation, IP/confidentiality or data retention.
- Candidates understand that the output is candidate-owned and not employer-verified.
- At least half say they would use it on another assessment (rating 4 or 5).

If these are missed, fix the largest observed problem before adding features. A small convenience gain is not enough to justify incorrect hiring terms.

## Analyse feedback files

Save only consented JSON feedback exports in a local folder, for example `pilot/feedback-files/`. Then run:

```bash
node openbrief/pilot/analyse-feedback.js openbrief/pilot/feedback-files
```

The script ignores files without `consent_to_share: true`, validates the version, and reports medians/averages without printing free-text comments. Keep the feedback files private; they are not a public leaderboard.

## Limitations

- This is a small convenience sample recruited through the founder's networks.
- The same-brief crossover has a possible recall/order effect.
- Self-rated accuracy is not independent annotation.
- Public process examples are not a permissioned dataset of full employer briefs.
- A successful candidate pilot does not prove employer demand or protocol adoption.
