# Architecture Overview

This document describes the internal components of the **Trusted Notifications Orchestrator**.

## Components

1. **Unified Event API (Express)**
   - Single entrypoint: `POST /api/events`
   - Validates payload and enforces idempotency by `messageId`.
   - Persists a `NotificationEvent` and delegates to the orchestrator.

2. **Orchestrator Core**
   - Implements a routing matrix per `eventType` (OTP, HIGH_VALUE_DEBIT, etc.).
   - Looks up user preferences before attempting a channel.
   - For each chosen channel, creates a `Notification` record and calls the corresponding adapter.
   - Updates status, vendor, and attempt count on success/failure.

3. **Channel Adapters**
   - Encapsulate integration with external delivery providers.
   - In this project, they simulate random success/failure to demonstrate retries.
   - Designed to be swapped with real SMS/Email/Push SDKs later.

4. **Data Storage (MongoDB)**
   - `NotificationEvent` – Represents one logical business event.
   - `Notification` – Represents one attempt on a given channel/vendor.
   - `UserPreference` – Controls per-user allowed channels.
   - `Template` – Stores approved message bodies.
   - `Vendor` – Stores channel-specific vendor priority and health flags.

5. **Monitoring & Observability**
   - `GET /api/stats` exposes aggregates for total events, sent, failed and success rate.
   - Frontend dashboard calls this periodically for a near-real-time view.
   - `GET /api/notifications` acts as a lightweight timeline for debugging.

## Logical Flow

1. **Producer** (e.g. core banking system) calls `POST /api/events` with event details.
2. The API:
   - Ensures non-empty `eventType`, `userId`, `messageId`.
   - Checks idempotency and early-returns for duplicates.
   - Saves a `NotificationEvent` in MongoDB.
3. **Orchestrator** reads the routing matrix for that event type.
4. It fetches **UserPreference** for the `userId` and filters out disabled channels.
5. For each remaining channel in order:
   - Creates a `Notification` document (status PENDING).
   - Invokes the channel adapter, which may succeed or throw.
   - On success: marks status SENT and breaks out (no more fallbacks).
   - On failure: marks status FAILED and continues to the next channel (failover).
6. Statistics & logs update automatically because they are derived from stored documents.

This entire design matches the “trusted, reliable and safe notifications” theme required in the presentation.
