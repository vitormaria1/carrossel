---
name: modal-deploy
description: Deploy execution scripts to Modal cloud. Use when user asks to deploy to Modal, push code to cloud, or update Modal functions.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Modal Cloud Deployment

## Goal
Deploy execution scripts to Modal for serverless cloud execution.

## Deploy Command
```bash
modal deploy execution/modal_webhook.py
```

## Key Endpoints

| Endpoint | Purpose |
|----------|---------|
| `directive` | Execute a directive by slug |
| `list_webhooks` | List available webhooks |
| `general_agent` | Run general agent tasks |
| `scrape_leads` | Lead scraping endpoint |
| `generate_proposal` | Proposal generation |
| `youtube_outliers` | YouTube outlier scraping |

## Adding New Functions

1. Add function to `execution/modal_webhook.py`
2. Decorate with `@app.function()` or `@app.function(schedule=modal.Cron(...))`
3. Deploy: `modal deploy execution/modal_webhook.py`

## Environment
Modal secrets are configured in the Modal dashboard, not local `.env`.

## Cron Jobs
```python
@app.function(schedule=modal.Cron("0 * * * *"))  # Every hour
def my_scheduled_function():
    pass
```
