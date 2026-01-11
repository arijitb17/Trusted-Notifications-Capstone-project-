
Load Testing Guide – Trusted Notification Orchestrator

This document provides a clear and complete guide for performing load testing on the Trusted Notification Orchestrator. The objective of this test is to verify that the system can process thousands of incoming events reliably while maintaining routing accuracy, idempotency, failover behavior, and proper logging.

1. Purpose of Load Testing

The load-test validates the platform across multiple performance dimensions:

• API throughput when hit with thousands of incoming events
• Correct functioning of the routing engine under heavy load
• Validation of all event types including OTP, High-Value Debit, Card-Not-Present alerts, and Service Reminders
• Ensuring retry and failover logic works in real-time
• Testing idempotency by sending thousands of unique message IDs
• Checking how the stats API aggregates real traffic
• Measuring MongoDB Atlas durability and stability under pressure
• Ensuring the orchestrator remains responsive during peak volumes

This test simulates actual banking-scale workloads and is suitable for viva demonstrations or project evaluation.

2. Prerequisites

Before running the load test, ensure the following:

The backend server for the Notification Orchestrator is running and connected to MongoDB Atlas.

The system environment must have Node.js version 18 or higher so that the built-in fetch API works correctly.

The MongoDB Atlas cluster should be active and not in paused or maintenance state.

You must have the load testing script (loadtest.js) placed inside the backend folder.

If these conditions are met, the system is ready for load execution.

3. Description of the Load Test Script

The load-testing script does the following:

• Sends a total of 5000 events to the orchestrator.
• Each request randomly selects one of the supported event types:
– OTP
– HIGH_VALUE_DEBIT
– CARD_NOT_PRESENT
– SERVICE_REMINDER
• Every event is assigned a unique message ID to satisfy idempotency rules.
• Payloads are automatically generated based on the event category.
• A small delay is inserted between requests to avoid overwhelming MongoDB Atlas.
• Each request triggers the full orchestrator workflow including classification, routing, vendor selection, failover, and database logging.

This test ensures that the entire system is exercised in conditions similar to real production workloads.

4. Running the Load Test

To begin the load test:

Make sure your backend service is already running.

Execute the loadtest.js script from inside the backend project folder using Node.js.

The script will immediately begin sending 5000 mixed notification events.

You will see printed output indicating which events were accepted and processed.

During this time, the orchestrator will continuously write events and notification attempts into MongoDB and you can observe how the system behaves under sustained load.

5. What Happens Internally During the Test

During the execution of 5000 requests, the system processes a variety of workload patterns:

• OTP events routed primarily to SMS, Push, or Email
• High-Value Debit alerts routed to Push, then SMS
• Card-Not-Present events routed across Push and SMS
• Service Reminders routed into Push or In-App inbox

The failover logic is also tested when a simulated vendor failure occurs. Routing decisions, user preferences, and template retrieval are all exercised repeatedly. As the incoming volume increases, the MongoDB collections (events, notifications) grow accordingly, providing a realistic stress scenario.

6. Verifying System Behavior After Load Test

Once all events have been processed, the following areas should be reviewed:

Overall Stats

Use the statistics endpoint after the test to check:

• Total number of events received
• Total number of notification attempts
• Total successful deliveries
• Total failures
• Success percentage
• Latency trends

These numbers should reflect the 5000 events sent during the test.

Notification Logs

Review the notification logs to confirm:

• Correct channel selection
• Accurate vendor assignments
• Proper handling of failed attempts
• Sequential attempts in failover scenarios
• Time stamps for each attempt

The logs provide insight into whether the orchestrator behaved correctly under heavy load.

MongoDB Verification

Inspect the database to ensure that:

• NotificationEvent documents were created for each event
• Notification documents exist for each channel attempt
• Duplicate message processing did not occur (idempotency working)
• Timestamps and routing details were correctly saved

This ensures that the system persisted all information accurately.

7. Expected Outcomes

A successful load test demonstrates:

• The orchestrator can handle thousands of events
• All routing rules are correctly activated
• The system remains stable without crashing
• MongoDB Atlas maintains consistency under stress
• Notification processing remains accurate
• No duplicated events are processed
• Failover paths activate correctly
• Stats API reflects true counts
• The system recovers gracefully after test completion

Passing this test means the system is ready for evaluation, demonstration, and inclusion in your final submission.

8. Troubleshooting

If any issues occur during the load test, check the following:

• If MongoDB Atlas begins rate-limiting, increase the delay between requests.
• If Node process memory grows too large, reduce concurrency (avoid parallel load).
• Ensure the backend server is not restarting or crashing.
• If events stop being accepted, verify that the messageId values remain unique.
• Respond quickly to errors in the console for missing fields or malformed payloads.

These steps will help you maintain system stability while performing the test.

9. Conclusion

The load-testing procedure is an essential part of evaluating your Notification Orchestrator. Successfully completing the 5000-event test demonstrates that the system is robust, reliable, scalable, and ready for real-world conditions. It is an important piece of your project submission and validates the engineering design you have built.
