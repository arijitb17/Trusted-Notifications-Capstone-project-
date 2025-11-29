# COMPONENTS_BREAKDOWN.md

# Components Breakdown

## 1. Event Producers
- Core banking system
- UPI/Payments switch
- Card engine
- CRM/Reminder systems
- Authentication/OTP service

## 2. Event Bus
Acts as the buffering and decoupling layer:
- Kafka / RabbitMQ / Redis Streams
- Handles back‑pressure
- Provides durability

## 3. Orchestrator Internal Modules

### 3.1 Event Classifier
Responsible for:
- Parsing event metadata
- Determining type (OTP, high‑value debit)
- Assigning routing profile
- Criticality tagging

### 3.2 Routing Engine
Core logic:
- Selects channels in order of priority
- Example routing:
  - OTP: SMS → Push → Email
  - High-Value Debit: Push → SMS → Email
  - CNP Alert: Push → SMS
  - Reminder: Push → In-App

### 3.3 Template Engine
Tasks:
- Fetch template
- Apply placeholders (`{{otp}}`, `{{amount}}`)
- Validate compliance rules

### 3.4 Preference Store + Resolver
Stores:
- User’s channel settings (SMS ON/OFF, Push ON/OFF)

Resolver:
- Removes disabled channels before routing.

### 3.5 SLA Controller
Tracks:
- Message latency
- Vendor health
- SLA violations

### 3.6 Retry & Failover Manager
- Handles vendor failures
- Rotates between multiple SMS vendors
- Cross‑channel fallback logic

## 4. Security Layer

### 4.1 Verified Sender IDs
Ensures all senders match regulatory/approved IDs.

### 4.2 Payload Signing
Prevents:
- Tampering
- Man‑in‑the‑middle modifications

### 4.3 Safe Link Allow‑list
URL domains are validated.

### 4.4 Template Registry
Workflow for registering & approving templates.

## 5. Channel Adapters

### Email Adapter
Delivers via SMTP or Email providers.

### Push Adapter
Uses FCM/APNs or Web Push.

### In‑App Inbox
Stores secure alerts inside the app.

### SMS Gateway Adapter
Supports:
- Multi-vendor setup
- Vendor prioritization
- Connectivity checks

## 6. Monitoring & Analytics

### Metrics Collector
Collects:
- Delivery success
- Latency per vendor
- SLA breaches

### Dashboards
Used by Ops teams.

### Alerting System
Alerts:
- Vendor outages
- Surge in failures
- Suspicious delivery patterns

## 7. Notification DB
Stores:
- Events
- Channel attempts
- Vendor-level logs
- User journey & audit trail
