# Models

`GET /v1/models` lists the models Thatch is serving right now. Use an `id` from
it as the `model` in a request.

```bash
curl https://api.thatch.cloud/v1/models \
  -H "Authorization: Bearer $THATCH_API_KEY"
```

```json
{
  "object": "list",
  "data": [
    {
      "id": "<model-id>",
      "object": "model",
      "created": 0,
      "owned_by": "thatch",
      "task": "chat",
      "display_name": "…",
      "max_model_len": 65536,
      "region": "…",
      "residency": "…"
    }
  ]
}
```

## Fields

| Field | Meaning |
| --- | --- |
| `id` | What you pass as `model`. IDs are case-sensitive and can contain `/` and `:` — copy them exactly. |
| `task` | `chat` for [chat completions](chat-completions.md), `embed` for [embeddings](embeddings.md). Calling a model on the wrong endpoint answers `404` `model_not_found`. |
| `display_name` | A human-readable name, when one is set. |
| `max_model_len` | The model's context window in tokens, when known: the prompt and the completion together must fit inside it. |
| `region`, `residency` | Informational labels about where the model is being served. They are not a residency commitment — see [Data residency](../account/residency.md). |
| `created`, `owned_by` | Present for OpenAI compatibility. `created` is always `0`. |

## What the list tells you

**It is live.** A model is listed only while at least one healthy machine is
serving it, so a model can drop out of the list during maintenance or an
incident and come back afterwards. While it is out, requests for it answer `503`
with the code `backend_unavailable` — retry after `Retry-After`. An ID Thatch
does not serve at all answers `404` with the code `model_not_found`. Look models
up rather than hard-coding a list.

**It is not filtered to your key.** Thatch can restrict an API key to particular
models. The list still shows every model being served; a request from a
restricted key for any other model answers `403` with the code
`model_not_allowed`. See [API keys](../account/api-keys.md#restricting-a-key-to-particular-models).

<!-- TODO: per-model prices. /v1/models does not carry them, and there is no
     published price list yet — see Usage & metering. -->
