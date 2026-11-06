# Research & Experimental Work

**Prakash Chand Jain** · B.Tech Information Technology · Bharati Vidyapeeth (Deemed to be University), College of Engineering, Pune

I am interested in empirical evaluation of intelligent systems: how models behave, where they fail, how learning generalises, and whether performance claims survive careful baselines and reproducible experiments.

My current interests include reliable language models, representation probing, scientific computing, workload-aware optimization, and robot learning.

This page is an index of selected work. Project status and limitations are stated explicitly; exploratory results should not be read as peer-reviewed findings.

---

## 1. Answer-correctness probing in Qwen3-0.6B

**Question:** Can residual-stream representations help predict whether a multiple-choice answer is correct, and do they provide information beyond the model's answer-choice confidence?

**Setup**
- 200 subject-balanced MMLU questions across 57 subjects.
- Residual-stream activations from 28 layers of Qwen3-0.6B.
- Layer-wise logistic-regression probes.
- Five-fold stratified cross-validation.
- Baseline: maximum probability across the four answer choices.

**Preliminary result**

| Method | AUROC |
|---|---:|
| Best-layer residual-stream probe | 0.6022 |
| Maximum answer-choice probability | 0.6568 |

The probe did not outperform the simpler confidence baseline. This is an exploratory pilot, not evidence that internal activations provide a reliable correctness detector.

**Next steps:** increase the sample size, quantify uncertainty, audit split construction, compare stronger confidence and calibration baselines, and test transfer across model sizes.

- [Full research note](./qwen3-correctness-probing.md)

---

## 2. VoxelPool Explorer: reproducible workload benchmarking

**Question:** Can workload characteristics help predict which voxel-pooling accumulation strategy performs best on a held-out workload?

VoxelPool Explorer is a CPU-first research prototype combining an interactive dashboard with a FastAPI benchmark service. It compares a sequential reference, NumPy scatter accumulation, and sort-based segmented reduction. Candidate outputs are checked against the reference before timing results are treated as valid.

**Exploratory experiment**
- 72 cases: 36 workload configurations × two deterministic seeds.
- Uniform, hotspot, and unique destination patterns.
- Five measured repetitions per strategy after warm-up.
- Configuration-level holdout: 24 training configurations and 12 held-out configurations.
- 3-nearest-neighbour workload-aware strategy selector.

| Metric | Selector | Best fixed-strategy baseline |
|---|---:|---:|
| Strategy-selection accuracy | 75.00% | 58.33% |
| Mean performance regret | 2.793% | 17.467% |

These are preliminary results from a small held-out set, synthetic workloads, and one CPU environment. They do not establish generalization or GPU/accelerator performance. Repeated grouped splits, larger held-out sets, real workload traces, and stronger baselines are needed.

- [Repository and implementation](https://github.com/Prakash-codeMaker/voxelpool-explorer)
- [Full experiment report](https://github.com/Prakash-codeMaker/voxelpool-explorer/blob/main/research-results/RESEARCH_REPORT.md)
- [Research notes and limitations](https://github.com/Prakash-codeMaker/voxelpool-explorer/blob/main/RESEARCH_NOTES.md)

---

## 3. Robot learning and imitation learning

**Research experience:** ThinkSwiss Research Scholarship · IDSIA / SUPSI · December 2025–January 2026

Work included preparing and augmenting robot-demonstration data for imitation-learning workflows and applying imitation learning to train a robotic-arm policy. I also independently explored Vision-Language-Action (VLA) architectures and their relevance to robot learning.

My interests here include how demonstration quality and diversity affect learned policies, how policies generalize beyond familiar demonstrations, and how visual and language context can be connected to action.

This section describes research experience and areas of exploration; it does not claim a published result.

---

## 4. LLM safety evaluation

Built an LLM-as-a-Judge evaluation workflow for classifying responses from multiple model providers against adversarial prompts. The project includes multi-provider routing, judge-based scoring, and automated evaluation reports.

The reported 85% safe/unsafe classification accuracy is measured on the project's own test set. It is not an external benchmark result and should not be compared directly with published safety evaluations.

---

## Working principles

- Establish simple, transparent baselines before proposing a more complex method.
- Separate measured results from hypotheses and interpretations.
- Check correctness before comparing performance.
- Preserve configurations, seeds, raw measurements, and environment metadata.
- Report negative results and limitations alongside positive findings.
- Avoid generalizing beyond the tested models, workloads, and hardware.

## Contact and code

- [GitHub profile](https://github.com/Prakash-codeMaker)
- [LinkedIn](https://www.linkedin.com/in/prakash-chand-jain-coder015675328/)
- [Portfolio](https://prakash-portfolio.vercel.app/)

*This page is a living index of exploratory and applied work. It is not a list of peer-reviewed publications.*
