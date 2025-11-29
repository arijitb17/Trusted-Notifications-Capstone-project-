# ARCHITECTURE_OVERVIEW.md

# Architecture Overview

This documentation reflects the system architecture shown in the high-level design diagram.

## 1. Event Producers
These upstream systems generate notifications:
- Core Banking / Ledger (debits, credits)
- Payments / Cards / UPI
- Authentication service (login OTP)
- CRM systems (reminders, statements)

Producers push events to an **Event Bus** for buffering and reliability.

## 2. Event Bus
Supports:
- At-least-once delivery
- Partitioning and scaling
- Safe decoupling between upstream systems and the orchestrator

## 3. Notification Orchestrator Components

### 3.1 Event Classifier
- Identifies event type (OTP, high‑value debit).
- Determines priority, SLA, and the required security constraints.

### 3.2 Routing Engine
- Evaluates routing rules based on:
  - Event Type
  - User Preferences
  - Vendor health & SLA
  - Security policies

### 3.3 Retry & Failover Manager
- Handles retries for failed attempts.
- Switches between multiple SMS vendors.
- Falls back across channels (SMS → Push → Email).

### 3.4 Template Engine
- Applies standardized templates.
- Prevents spoofing & unauthorized text modifications.

### 3.5 Preference Resolver
- Reads user channel choices from Preference Store.
- Prevents sending unwanted notifications.

### 3.6 SLA Controller
- Monitors latency.
- Ensures important events meet regulatory timing.

## 4. Security & Anti‑Spoof Layer
### 4.1 Verified Sender IDs
Prevents attackers from imitating bank senders.

### 4.2 Payload Signing
Each outbound message includes an HMAC signature.

### 4.3 Safe Link Resolver
Ensures only allow‑listed domains appear in messages.

### 4.4 Template Registry
Compliance‑approved templates only.

## 5. Channel Adapters
- **Email Adapter** → Email Provider
- **Push Adapter** → Mobile/Web push receivers
- **In‑App Inbox** → Banking app secure inbox
- **SMS Gateway Adapter** → Multi‑vendor SMS aggregators

## 6. Monitoring & Analytics
- Metrics collector
- Delivery and latency dashboard
- Alerting & anomaly detection (fraud spikes, vendor failures)

## 7. Teams Supported
- Operations / Support
- Risk & Compliance
