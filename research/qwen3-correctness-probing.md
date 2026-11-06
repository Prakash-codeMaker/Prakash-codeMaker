# Exploratory Research Note: Probing Answer Correctness in Qwen3-0.6B

**Status:** Exploratory undergraduate research; not peer-reviewed and not a published paper.

## Research question

Can intermediate Transformer representations help predict whether a multiple-choice answer is correct, and do they provide useful information beyond the model's own answer-choice confidence?

## Experimental snapshot

- **Model:** Qwen3-0.6B
- **Evaluation sample:** 200 subject-balanced MMLU questions
- **Representations:** Residual-stream activations collected across 28 model layers
- **Probe:** Logistic-regression classifiers trained to predict answer correctness
- **Evaluation:** Five-fold stratified cross-validation
- **Reference baseline:** Maximum probability assigned to the four answer choices

## Preliminary result

| Method | AUROC |
|---|---:|
| Best-layer residual-stream probe | **0.6022** |
| Maximum answer-choice probability baseline | **0.6568** |

The probe did **not** outperform the simpler confidence baseline in this experiment.

AUROC measures ranking discrimination; it is not classification accuracy. These values should be interpreted as preliminary results from a small sample and not as evidence that internal activations provide a reliable correctness detector.

## What this result does—and does not—show

The current experiment does not establish that residual-stream representations add predictive value beyond ordinary model confidence. It does provide a concrete baseline comparison and a reason to investigate the question more carefully.

The study is limited by its small sample size, single model, and single benchmark. Additional documentation is also needed before the experiment can be independently reproduced in full, including the exact activation extraction point, preprocessing, probe hyperparameters, random seeds, and split construction.

## Next experiments

1. Increase the evaluation sample and report uncertainty intervals.
2. Audit the data and cross-validation pipeline for leakage and subject imbalance.
3. Compare layer-wise probes against stronger confidence, logit-margin, and calibration baselines.
4. Report results by subject and question difficulty, not only as one aggregate score.
5. Test whether any signal transfers across model sizes or model families.
6. Publish the complete configuration, code, and reproducibility artifacts before making stronger claims.

## Research interests

Reliable language models, answer correctness estimation, interpretability, uncertainty quantification, and evaluation methodology.

## Author

**Prakash Chand Jain**  
B.Tech Information Technology, Bharati Vidyapeeth (Deemed to be University), College of Engineering, Pune, India.

- [GitHub profile](https://github.com/Prakash-codeMaker)
- [Portfolio](https://prakash-portfolio.vercel.app/)
- [LinkedIn](https://www.linkedin.com/in/prakash-chand-jain-coder015675328/)

---

*This is a research note describing an exploratory experiment. It is not a peer-reviewed publication, and the reported results should not be generalized beyond the setup described above.*