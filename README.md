# AI-Powered Parametric Insurance Platform for Gig Delivery Workers

## Table of Contents

- Overview
- Problem Statement
- Persona Scenario
- Application Workflow
- Weekly Premium Model
- Parametric Triggers
- Platform Choice
- AI / ML Integration
- Technology Stack
- Development Plan
- System Architecture
- Adversarial Defense & Anti-Spoofing Strategy
- Prototype and Future Enhancements

## Overview

This project proposes an **AI-enabled parametric insurance platform** designed to protect gig delivery workers from income loss caused by uncontrollable external disruptions such as extreme weather conditions or social restrictions.

Delivery workers in the gig economy rely heavily on continuous order completion for their income. However, environmental disruptions such as **heavy rainfall, floods, or curfews** can prevent them from working for several hours.

The proposed platform automatically detects such disruptions and compensates workers **without requiring manual claim submissions**.

The system combines:

- parametric trigger detection  
- environmental data monitoring  
- worker activity validation  
- automated payout processing  

to create a transparent and efficient income protection system.

---

# Problem Statement

Gig economy delivery workers face **income instability** due to external disruptions such as:

- heavy rainfall
- flooding
- curfews or movement restrictions
- extreme environmental conditions

These disruptions can prevent workers from completing deliveries and lead to income loss.

Currently, there is **no automated system** that provides immediate financial protection during such events.

This project proposes a **parametric insurance platform** that automatically compensates workers when disruption conditions occur.

---

# Persona Scenario

### Rahul – Food Delivery Partner

Rahul is a **food delivery rider** working with a platform such as **Swiggy** in **Bangalore**.

### Work Profile

- Work hours: **6 PM – 1 AM**  
- Average earnings: **₹120/hour**  
- Delivery zone: **Bangalore**

One evening, **heavy rainfall** hits the city and roads become unsafe for riding. Because of the weather conditions, Rahul is unable to complete deliveries for several hours and loses a portion of his daily income.

The proposed platform ensures that workers like Rahul receive **automatic financial protection** when disruptions prevent them from working.

---

# Application Workflow

## 1. Worker Registration
Workers create a profile on the platform by providing:

- full name  
- city  
- delivery platform (e.g., Swiggy, Zomato)  
- working hours (shift start and end)  
- average hourly earnings  
- identity verification details (ID type and ID number)  

This information is used to:
- estimate the worker's **risk exposure**  
- calculate **coverage and premium**  
- enable **basic identity verification for fraud prevention**  
---

## 2. Weekly Insurance Subscription
Workers subscribe to a **weekly insurance plan** that protects their earnings from disruption events.

The platform provides a **user-friendly slider interface** that allows workers to choose their premium amount based on affordability.

- minimum premium starts from a base value  
- users can increase coverage by adjusting the slider  
- coverage amount is dynamically calculated (e.g., up to 20× premium)  

Once the premium is selected and paid, coverage remains **active for the entire week**.

---

## 3. Continuous Disruption Monitoring
The platform continuously monitors environmental and social conditions using external APIs to detect disruption events.

- weather APIs for rainfall intensity monitoring  
- flood alerts from environmental data sources  
- government alerts for curfew or movement restrictions  

These inputs are used to identify **potential disruption scenarios** in the worker’s delivery zone.

In addition, the platform aligns detected disruptions with **claim categories available in the application** such as:
- heavy rain  
- flood  
- hailstorm  
- curfew  

This ensures that only **relevant and predefined disruption types** can trigger claims, maintaining consistency between system detection and user actions.

---

## 4. Parametric Trigger Detection
The system defines **parametric triggers** based on measurable, real-world data to identify disruption events.

Examples :
- rainfall intensity exceeding a predefined threshold
- official flood alerts issued for the delivery zone
- severe weather conditions such as hailstorms
- government-issued curfew or movement restrictions  

These triggers are continuously monitored using **real-time external APIs** (weather services, disaster alerts, and government notifications).

When a trigger condition is met, the system automatically identifies a **verified disruption event** affecting a specific geographic area.

This ensures transparent and reliable payout decisions aligned with the principles of **parametric insurance**.

---

## 5. Worker Activity Validation

To ensure fair payouts, the system validates whether the worker was **active during the disruption**.

Since real gig platform APIs are not publicly accessible, the prototype uses a **simulated delivery platform API** that provides:

- worker online status
- orders accepted
- orders completed
- delivery zone

---


## 6. Income Loss Estimation
The system estimates income loss based on the worker’s average hourly earnings and the duration of the disruption.

Base calculation:
Lost Income = Average Hourly Earnings × Disruption Duration  

Example:
₹120 × 3 hours = ₹360  

In the platform, the final payout is aligned with the **selected coverage plan**, where:
- coverage amount is proportional to the chosen premium  
- payouts are capped (e.g., up to 20× the weekly premium)


---

## 7. Automated Payout

Once disruption conditions and worker activity are validated, the platform automatically **processes the payout** to the worker.

---



# Weekly Premium Model - Explanation 

## Overview
The platform follows a **weekly subscription-based insurance model** designed for gig delivery workers.

Instead of fixed pricing, the system dynamically determines premium, coverage, and risk based on the worker’s income profile and selected plan.

---

## Premium Calculation
The weekly premium is determined using either:
- a **user-selected premium amount**, or  
- a **default calculation based on income**

Default formula:
Weekly Premium ≈ 5% of estimated weekly earnings  

Example:
If avg hourly income = ₹120  
Estimated weekly earnings ≈ 120 × 60 = ₹7200  
Weekly Premium ≈ 5% of 7200 = ₹360  

(In the prototype, this value is simplified and rounded)

---

## Coverage Model
Coverage is directly proportional to the selected premium:

Coverage Amount = Weekly Premium × 20  

Example:
Weekly Premium = ₹250  
Coverage = ₹250 × 20 = ₹5000  

This ensures:
- higher premium → higher protection  
- simple and transparent payout structure  

---

## Risk Score Calculation
The system assigns a **risk score** to each subscription:

- Base Risk = 80  
- Risk Reduction = min(Weekly Premium × 0.3, 50)  
- Final Risk Score = Base Risk − Risk Reduction  

This means:
- higher premium → lower risk score  
- lower premium → higher exposure risk  

---

## Interpretation
- Workers choosing higher premiums receive:
  - higher coverage and lower risk score  
- Workers choosing lower premiums:
  - pay less and receive lower coverage with higher relative risk  


---

The platform implements core insurance logic using structured calculations for premium, coverage, and risk scoring based on worker income and selected plan.

- premium is derived from estimated weekly earnings or user selection  
- coverage is directly proportional to the selected premium (e.g., up to 20× premium)  
- risk score is dynamically adjusted based on the chosen premium level  

These components are designed to be enhanced using:
- **machine learning models for risk prediction**  
- **real-time environmental data analysis**  

---

## Benefits of the Weekly Premium Model
- aligned with gig workers' earning cycles  
- fair and transparent pricing based on income and risk  
- scalable and sustainable insurance model  
- adaptable to changing environmental conditions  

---

# Parametric Triggers
Parametric insurance relies on **predefined, measurable external conditions** to determine when compensation should be issued.

The system continuously monitors **real-time environmental and regulatory data** using external APIs.

---

## 1. Heavy Rainfall
**Trigger Condition:**  
Rainfall intensity exceeds a predefined threshold (e.g., mm/hour)

**Data Source:**  
- weather APIs (e.g., OpenWeather)

---

## 2. Flood Alerts
**Trigger Condition:**  
Official flood alert issued in the delivery zone

**Data Source:**  
- disaster management systems  
- environmental monitoring APIs  

---

## 3. Curfew or Movement Restrictions
**Trigger Condition:**  
Government-issued curfew or movement restriction

**Data Source:**  
- government or municipal alerts  

---

## Trigger Evaluation
When a trigger condition is met, the system:

1. identifies a **verified disruption event** in the worker’s zone  
2. validates worker eligibility and activity  
3. estimates income loss  
4. initiates payout processing  

This ensures **objective, transparent, and automated claim handling**.

---

# Platform Choice

## Selected Platform: Web Application
The platform is implemented as a **web-based application**.

### Reasons

**1. Faster Development**  
Enables rapid iteration and deployment  

**2. Cross-Device Accessibility**  
Accessible across mobile, tablet, and desktop without installation  

**3. Simplified Integration**  
Facilitates integration with:
- weather and environmental APIs  
- backend services  
- delivery platform data sources  

**4. Effective System Representation**  
Allows clear representation of:
- worker onboarding  
- premium selection  
- disruption detection  
- payout processing  
---

# AI / ML Integration

AI and ML helps with the platform’s core decision-making capabilities, enabling accurate risk assessment, intelligent claim validation, and scalable payout estimation.

The system make use of AI/ML across these areas:

---

## 1. Risk Prediction for Premium Calculation
AI models analyze environmental and historical data to estimate the **probability of disruption events** in a given delivery zone.

**Input Data:**
- historical rainfall patterns  
- flood frequency  
- seasonal weather trends  
- disruption history  

**Output:**
- Risk Score representing likelihood of disruption  

**Models Used:**
- Random Forest  
- Gradient Boosting  
- Time-Series Forecasting  

This risk score is used to dynamically adjust premium pricing.

---

## 2. Fraud Detection
Machine learning models are used to identify **anomalous or suspicious claim patterns** and improve the reliability of payout decisions.

**Scenarios Considered:**
- worker inactivity during disruption  
- repeated or abnormal claim patterns  
- inconsistency between worker activity and disruption events  

**Approach:**
- anomaly detection models (e.g., Isolation Forest)  
- clustering techniques for pattern recognition  
- rule + model hybrid validation  

**Output:**
- fraud risk score  
- flagged or verified claims  

---

## 3. Income Loss Estimation
AI models enhance the accuracy of income loss estimation by learning from worker activity and earning patterns.

**Input Data:**
- average hourly earnings  
- working hours  
- delivery activity patterns  

**Approach:**
- regression models  
- time-series analysis  

**Output:**
- more accurate estimation of income loss during disruption periods  

---

## System Impact
- enables **data-driven premium pricing**  
- improves **fraud detection and claim reliability**  
- ensures **accurate and fair payout estimation**  
- supports **scalable and automated insurance operations**

---
# Technology Stack

## Frontend
- React (Vite-based setup)
- TypeScript
- Tailwind CSS

**Features Implemented:**
- worker registration and onboarding  
- insurance subscription with premium selection  
- disruption-specific claim pages (rain, flood, hailstorm, curfew)  
- dashboard for tracking claims and payouts  
- payout status and simulation interface  

---

## Backend
- Node.js with Express

**Architecture:**
- Controllers (business logic handling)
  - insurance.controller.js  
  - payout.controller.js  
  - trigger.controller.js  
  - worker.controller.js  

- Routes (API endpoints)
  - /insurance  
  - /payout  
  - /trigger  
  - /worker  

- Services (core logic layer)
  - risk.service.js  
  - trigger.service.js  
  - payout.service.js  

- Data Layer
  - in-memory database (db.js)  
  - user data (users.json)  

---

## Backend Responsibilities
- worker profile management  
- premium and coverage calculation  
- risk score computation  
- disruption trigger evaluation  
- payout processing  

---

### Example APIs

- **POST** `/worker/register` → Register worker  
- **POST** `/insurance/subscribe` → Create insurance subscription  
- **GET** `/insurance/:workerId` → Fetch subscription details  
- **POST** `/trigger/check` → Evaluate disruption conditions  
- **POST** `/payout/process` → Process payout  


---

## Database
- PostgreSQL

**Stored Data Includes:**
- worker profiles  
- insurance subscriptions and plans  
- disruption event records  
- payout history  

---

## AI Module
- Python  
- Scikit-learn  
- Pandas  
- NumPy  

Used for:
- risk prediction  
- anomaly detection  
- income estimation models  

---

## External Data Sources
- weather APIs (rainfall, storm conditions)  
- flood and disaster alert systems  
- government notifications for curfews and restrictions  

---

## Delivery Platform Data Integration
Due to the lack of publicly available gig platform APIs, the system uses a **controlled data interface** that represents delivery activity.

**Data Captured:**
- worker online status  
- orders accepted  
- orders completed  
- delivery zone  

This abstraction allows the platform to:
- validate worker activity  
- estimate income patterns  
- support automated decision-making  

---

# Development Plan

## Phase 1 – Ideation and Foundation
- researched challenges faced by gig delivery workers (income instability during disruptions)  
- designed end-to-end system architecture (frontend, backend, AI layer)  
- defined parametric triggers based on real-world environmental conditions  
- implemented core application workflows (registration, subscription, claims, payouts)  
- developed backend structure with controllers, services, and APIs  
- built frontend interface for onboarding, premium selection, and claim simulation    


**Deliverables:**
- complete idea document (README)  
- working system architecture  
- functional web application prototype (frontend + backend)  
- defined API structure and workflows  


---

## Phase 2 – Automation and Protection
- integrate real-time weather and environmental APIs  
- automate parametric trigger detection  
- implement real-time disruption monitoring  
- strengthen worker activity validation mechanisms  
- enhance backend automation for trigger → validation → payout flow  

**Deliverables:**
- automated disruption detection system  
- real-time trigger evaluation engine  
- improved validation and payout workflow  

---

## Phase 3 – AI Integration and Optimization
- implement ML-based risk scoring models  
- deploy anomaly detection for fraud prevention  
- optimize dynamic premium pricing using real data  
- build analytics dashboard for insights and monitoring  

**Deliverables:**
- AI-powered risk and fraud detection engine  
- adaptive premium pricing system  
- analytics and monitoring dashboard  

# System Architecture

Major components include:

- Web Application Interface
- Backend API Services
- AI Decision Engine
- Environmental Data Monitoring
- Simulated Delivery Platform API
- Parametric Trigger Engine
- Automated Payout System

---

# Future Enhancements

Potential improvements include:

- predictive disruption detection using weather forecasts
- mobile application integration
- advanced fraud detection models
- GPS-based worker activity validation

---

# Additional Innovation: Dynamic Risk-Based Premium Model

The platform introduces a **dynamic premium model** that combines risk-based pricing with a **user-controlled premium selection interface**.

Instead of enforcing a fixed premium, the system allows workers to **choose their premium using an intuitive slider**, making the system more accessible and user-friendly.

---

## Core Concept

Premium pricing is influenced by underlying risk factors such as:
- environmental disruption frequency  
- geographic delivery zone risk  
- seasonal weather patterns  
- worker activity profile  

These factors define the **baseline risk level** for a worker.

---

## User-Centric Premium Selection

To improve affordability and flexibility, the platform provides a **slider-based interface** where:

- workers can choose a premium within a reasonable range  
- coverage dynamically adjusts based on the selected premium  
- higher premium provides greater protection  
- lower premium ensures affordability with reduced coverage  

This approach balances **risk-based pricing** with **user affordability**.

---

## Benefits

- **affordable and flexible** for gig workers  
- **user empowerment** through choice of coverage  
- **risk-aware pricing** without complexity  
- **sustainable insurance pool** through balanced premiums  
- **intuitive UX** via slider-based interaction  

# Adversarial Defense & Anti-Spoofing Strategy

To ensure platform integrity and prevent coordinated fraud attacks, the system incorporates a multi-layered defense strategy that goes beyond basic GPS verification.

---

## 1. The Differentiation: Real vs Spoofed Worker

The system differentiates between genuine disruption cases and spoofed claims using multi-signal behavioral analysis rather than relying solely on location data.

Key differentiation factors include:

- **Activity Consistency:**  
  Genuine workers exhibit continuous delivery-related activity, while spoofed cases show inconsistent or idle patterns  

- **Temporal Alignment:**  
  Real disruptions align with environmental events and the worker’s active time window  

- **Behavioral Patterns:**  
  Sudden claim spikes without prior activity indicate potential spoofing  

- **Contextual Validation:**  
  Claims are evaluated against disruption severity and expected impact in that zone  

This ensures decisions are based on behavior, context, and consistency rather than just coordinates.

---

## 2. The Data: Beyond GPS Coordinates

To detect spoofing and coordinated fraud, the system analyzes multiple data layers:

### Worker Activity Data
- online/offline status  
- orders accepted and completed  
- session duration and activity patterns  

### Network & Device Signals
- IP location vs reported location consistency  
- session continuity and request patterns  

### External Environmental Data
- real-time weather conditions  
- flood alerts and disruption intensity  
- government-issued restrictions  

### Pattern & Cluster Analysis
- simultaneous claims from the same region  
- abnormal claim frequency spikes  
- correlation between multiple users’ activity patterns  

This enables detection of coordinated fraud patterns, not just individual anomalies.

---

## 3. The UX Balance: Fairness vs Fraud Prevention

The system handles flagged claims using a risk-based workflow:

### Low-Risk Claims
- automatically approved  
- instant payout  

### Medium-Risk Claims
- additional validation checks  
- processed with slight delay  

### High-Risk Claims
- flagged for deeper analysis  
- temporarily held for verification  

---

## Core Principle

The system follows a “verify before deny” approach:

- avoids unfair rejection of genuine users  
- minimizes false positives  
- maintains user trust  

---

## System Outcome

- prevents GPS spoofing-based fraud  
- detects coordinated attack patterns  
- ensures fair treatment of genuine workers  
- maintains sustainability of the insurance pool  


## Prototype Scope & Assumptions

In the prototype designed for demonstration:

- Payment processing is not integrated; premium payment is assumed for demonstration purposes  
- Delivery platform data is simulated due to lack of public APIs  
- AI/ML components are represented using rule-based logic in the current version  

Additionally, in the **actual system**, disruption detection and payouts are fully automated using:
- real-time external APIs (weather, flood alerts, government notifications)  
- AI-based validation and fraud detection models  

However, in this prototype, a simplified manual claim workflow is implemented:
- users select a disruption type  
- upload video evidence  
- basic validation checks are performed  
- payout is calculated using predefined logic after claim verification.
- In the actual system, payout will be automatically computed based on real-time disruption data and validated worker activity.
- This manual flow is included only to simulate system behavior in the absence of full API integrations and AI models.

All prototype components are designed to be replaced with **fully automated, AI-driven workflows** in future development phases.


