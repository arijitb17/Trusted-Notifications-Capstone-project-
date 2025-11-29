# SYSTEM_DESIGN.md

# Trusted Notifications – High Level System Design

## 1. Introduction
Trusted Notifications is a centralized platform designed to deliver reliable, safe, and timely notifications across multiple channels including SMS, Email, Push, and In-App inbox. The system ensures end‑to‑end security, template enforcement, auditability, and vendor failover, making it suitable for banking and fintech environments.

## 2. Goals of the System
- **Reliable delivery** with retries and failover.
- **Zero spoofing** through verified sender IDs and payload signing.
- **Unified routing logic** for all event types.
- **User preference–aware delivery**.
- **Monitoring, analytics & audit logs** for compliance and risk teams.
- **Scalable event ingestion** via Event Bus.

## 3. High-Level Architecture
```
Event Producers
      ↓
Event Bus (Kafka / RabbitMQ / PubSub)
      ↓
Notification Orchestrator
      ↓
Security & Anti-Spoof Layer
      ↓
Channel Adapters
      ↓
Delivery Providers
      ↓
Monitoring & Analytics → Operations / Risk Teams
```

## 4. Detailed Flow
1. Event Producers generate an event (OTP, Debit Alert, Login OTP).
2. Event Bus forwards it to the Notification Orchestrator.
3. Event Classifier identifies type & criticality.
4. Routing Engine selects channels based on rules.
5. Preferences Resolver applies user channel preferences.
6. Template Engine loads approved templates.
7. Security Layer signs payload + validates safe links.
8. Channel Adapters send the message.
9. Failover Manager retries alternate vendors/channels on failure.
10. Monitoring captures delivery metrics, SLAs, anomalies.

## 5. Data Stores
- **Notification DB** – tracks events, attempts, statuses.
- **Template Store** – stores approved templates.
- **Preference Store** – user channel preferences.

## 6. Key Guarantees
- Delivery reliability
- Anti-spoofing
- Real-time monitoring
- High throughput using decoupled architecture
