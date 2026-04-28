# GHL Webhook Email Template Setup

Esportiko sends form submissions to four GHL webhooks. To make sure
emails to the owner contain all submission data, every workflow's
"Send Email" action must use the standardized merge tags below.

## The bulletproof template

For any form submission email, use this as the email body:

```
{{inboundWebhookRequest.body.formSummary}}
```

That single merge tag pulls in a fully formatted summary of every
field the customer submitted. No need to map fields one by one.

## Optional: more polished template using individual fields

If you want a custom email layout, reference fields like:

- `{{inboundWebhookRequest.body.firstName}}`
- `{{inboundWebhookRequest.body.lastName}}`
- `{{inboundWebhookRequest.body.email}}`
- `{{inboundWebhookRequest.body.phone}}`
- `{{inboundWebhookRequest.body.formType}}`
- Any custom field you set up — e.g.,
  `{{inboundWebhookRequest.body.organizationName}}`,
  `{{inboundWebhookRequest.body.sport}}`,
  `{{inboundWebhookRequest.body.deadline}}`

Always include `{{inboundWebhookRequest.body.formSummary}}` at the
bottom as a safety net in case any individual merge tag is misnamed.

## Subject line suggestion

```
New {{inboundWebhookRequest.body.formType}} submission from {{inboundWebhookRequest.body.firstName}} {{inboundWebhookRequest.body.lastName}}
```

## To verify a workflow is set up correctly

1. Submit a test from the live site
2. In GHL, go to the workflow → execution history → find the run
3. Inspect the inbound webhook payload — confirm `formSummary` is present
4. Check the resulting email — confirm body is not blank
