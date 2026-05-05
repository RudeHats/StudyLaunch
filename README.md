# StudyLaunch

**The Next-Generation SaaS Platform for Elite University Admissions**

## Overview

StudyLaunch is an enterprise-grade ecosystem tailored for candidates navigating top-tier university admissions and funding. Built with Next.js App Router, the platform provides hyper-personalized matching, probabilistic admission scoring, and precise educational financing models, delivering a deterministic processing experience.

## Features & Modules

- **Navigator (Discovery):** AI-matched shortlist tuned to profile, budget, and goals.
- **Oracle (Probability):** Real-time admit probability with explainable factors and transparency.
- **LoanSense (Financing):** Co-signer-free loan options, EMI modeling, and DLG-ready offers.
- **Dashboard (Command):** Application tracking, deadline management, and secure document vault.
- **Essay Co-Pilot (Craft):** Statement of purpose drafting environment that preserves the applicant's unique voice.

## Architecture & Data Flow

### Conceptual DFD

Below is the conceptual Data Flow Diagram representing the core mechanisms of StudyLaunch.

```mermaid
%%{init: {'theme': 'forest', 'look': 'handDrawn'}}%%
flowchart TD
    A[Applicant Profile] --> B{StudyLaunch CoreEngine}
    B -->|Academic Data| C[Navigator Module]
    B -->|Financial Data| D[LoanSense Processing]
    C --> E[Oracle Probability]
    D --> F[Sanctioned Loan Offers]
    E --> G[Unified Student Workspace]
    F --> G
    H[Essay Co-Pilot Layer] --> G
```

### System Workflows

*Data Flow Diagrams detailing user interactions and algorithmic pipelines.*

![System Feature DFD 1](./app/assets/dfds/features-exp1.png)
![System Feature DFD 2](./app/assets/dfds/features-exp2.png)
![System Feature DFD 3](./app/assets/dfds/features-exp3.png)
![Sensor-Driven Perception](./app/assets/dfds/Sensor-Driven%20AI%20Perception-2026-05-04-195900.png)

## Documentation

- **Product Requirements Document (PRD):** Comprehensive specifications outlining feature sets, compliance standards (RBI & DPDP), and the deterministic modeling approaches used in our core AI engines.
- **Prototype Guides:** Live prototype documentation detailing the implementation of UI transitions, component orchestration, and native browser optimizations for the frontend architecture.

## Quick Setup Guide

### Prerequisites
- Node.js v18+ environment
- Package manager (npm or pnpm)

### Installation & Launch

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/StudyLaunch.git
   cd StudyLaunch
   ```

2. Install development dependencies:
   ```bash
   npm install
   ```

3. Launch the operational workspace:
   ```bash
   npm run dev
   ```

The dashboard and primary interfaces will be active at `http://localhost:3000`.

## Team

StudyLaunch is actively maintained and built by our core engineering group.

| Anshuman Pathak | Gaurav Shahi | Deepanshu Dwivedi |
| :---: | :---: | :---: |
| <img src="./public/assets/team/anshuman.jpg" width="150" height="150" alt="Anshuman Pathak"> | <img src="./public/assets/team/GauravShahi_.jpeg" width="150" height="150" alt="Gaurav Shahi"> | <img src="./public/assets/team/deepanshu.jpeg" width="150" height="150" alt="Deepanshu Dwivedi"> |
| Lead Frontend / Gen-AI | Full-Stack / Platform & API | SaaS Growth / Machine Learning |

*Engineered for the absolute pinnacle of technological orchestration. Built locally, scaled globally.*
