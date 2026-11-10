# Embeddings

`POST /v1/embeddings` turns text into vectors, in the same request and response
shape as OpenAI's Embeddings API.

## A request

```bash
curl https://api.thatch.cloud/v1/embeddings \
  -H "Authorization: Bearer $THATCH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<embedding-model-id>",
    "input": ["fn a() {}", "struct B;"]
  }'
```

```json
{
  "object": "list",
  "data": [
    { "object": "embedding", "index": 0, "embedding": [0.012, -0.031, …] },
    { "object": "embedding", "index": 1, "embedding": [-0.004, 0.017, …] }
  ],
  "model": "<embedding-model-id>",
  "usage": { "prompt_tokens": 9, "total_tokens": 9 }
}
```

## Fields

| Field | Notes |
| --- | --- |
| `model` | An `id` from [`GET /v1/models`](models.md) whose `task` is `embed`. A chat model, or a missing `model`, answers `404` with the code `model_not_found`. |
| `input` | A string, or an array of strings. Each array item gets its own vector, at the same `index`. An empty array, or an array item that is not a string, is a `400`. Arrays of token IDs are not supported. |
| `encoding_format` | `float` (the default) or `base64`. |

Other fields, such as `dimensions`, are not applied: you get the model's native
vector size.

The length of each input is bounded by the model's context window —
`max_model_len` in [`GET /v1/models`](models.md).

## Usage

Embeddings are metered on their input tokens, reported in `usage.prompt_tokens`.
See [Usage & metering](../account/usage.md).
