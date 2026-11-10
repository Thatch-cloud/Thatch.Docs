# Chat completions

`POST /v1/chat/completions` generates a response to a conversation. It takes the
same request and returns the same response as OpenAI's Chat Completions API, so
existing clients and SDKs work unchanged. This page covers how to call it and
the places where Thatch's behaviour is worth knowing about.

## A request

```bash
curl https://api.thatch.cloud/v1/chat/completions \
  -H "Authorization: Bearer $THATCH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "messages": [
      { "role": "user", "content": "In two sentences, what is a kea?" }
    ],
    "max_tokens": 400
  }'
```

`model` is an `id` from [`GET /v1/models`](models.md) whose `task` is `chat`.

```json
{
  "id": "chatcmpl-3f0beab069884baa9fae445fc8d70b2b",
  "object": "chat.completion",
  "created": 1790549743,
  "model": "<model-id>",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "content": "A kea is a large, intelligent parrot native to the alpine regions of New Zealand's South Island. …",
        "reasoning_content": "…"
      }
    }
  ],
  "usage": {
    "prompt_tokens": 62,
    "completion_tokens": 99,
    "total_tokens": 161,
    "reasoning_tokens": 57
  }
}
```

## Parameters

The usual chat parameters are passed to the model: `messages`, `max_tokens` or
`max_completion_tokens`, `temperature`, `top_p`, `stop`, `seed`, `n`,
`presence_penalty`, `frequency_penalty`, `logit_bias`, `logprobs` and
`top_logprobs`, `tools`, `tool_choice` and `parallel_tool_calls`,
`response_format`, `reasoning_effort`, and `stream` and `stream_options`.

Not every model honours every parameter. Two response headers report what
happened to the ones that were not used as sent:

| Header | Lists |
| --- | --- |
| `x-thatch-ignored-params` | Parameters that were accepted but had no effect — OpenAI account-side fields such as `store`, `metadata`, `user` and `service_tier`, or a sampling setting the model does not support. |
| `x-thatch-unrecognised-params` | Parameters Thatch does not recognise. They are passed to the model as sent. |

A parameter the model cannot accept is refused with `400` and the code
`unsupported_parameter`. A parameter that reaches into the serving engine itself,
rather than the model, is refused with `400` and `forbidden_parameter`. Either
way the error's `param` names it — see [Errors](errors.md).

### System messages

If a conversation starts with more than one `system` or `developer` message,
they are merged into a single `system` message before the model sees them.

A `system` or `developer` message later in the conversation is handled
differently from OpenAI's API: it reaches the model as a note, prefixed
`[system note]`, inside a user turn (or appended to the preceding tool result).
The `x-thatch-system-notes` response header counts how many were converted.

### Tool calling

`tools` and `tool_choice` work as they do in OpenAI's API, on models that
support tool calling. When the model calls a tool, the choice's `finish_reason`
is `tool_calls` and the calls are in `message.tool_calls`.

### Reasoning

Models that reason before answering return that reasoning in
`message.reasoning_content` (`delta.reasoning_content` when streaming),
separately from `content`. Reasoning tokens are counted in `completion_tokens`
and metered as output — see [Usage & metering](../account/usage.md). Some models
also report a separate reasoning-token count in `usage`.

On models that support it, `reasoning_effort` controls how much the model
reasons, and `"none"` turns reasoning off.

## Streaming

Set `"stream": true` to receive the response as server-sent events
(`text/event-stream`):

- Each event is a `data:` line carrying a `chat.completion.chunk` object, and
  the stream always ends with `data: [DONE]`.
- Set `"stream_options": { "include_usage": true }` to receive one final chunk,
  with an empty `choices` array and the request's `usage`, just before `[DONE]`.
- Lines starting with `:` are keep-alive comments sent while the model is
  working. SSE clients, including the OpenAI SDKs, ignore them.

```
data: {"id":"chatcmpl-…","object":"chat.completion.chunk","created":1790549743,"model":"<model-id>","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}

data: {"id":"chatcmpl-…","object":"chat.completion.chunk","created":1790549743,"model":"<model-id>","choices":[{"index":0,"delta":{"content":" plumage."},"finish_reason":null}]}

data: {"id":"chatcmpl-…","object":"chat.completion.chunk","created":1790549743,"model":"<model-id>","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: {"id":"chatcmpl-…","object":"chat.completion.chunk","created":1790549743,"model":"<model-id>","choices":[],"usage":{"prompt_tokens":62,"completion_tokens":99,"total_tokens":161,"reasoning_tokens":57}}

data: [DONE]
```

### Errors during a stream

Once a stream has started, its `200` status has already been sent. A failure
after that point arrives as an event carrying an
[error object](errors.md#error-response-format) and the request ID, followed by
`data: [DONE]`:

```
data: {"error":{"message":"…","type":"…","code":"…"},"request_id":"…"}
```

If a stream is cut short — by an error, or because your client disconnected —
the tokens generated up to that point are still metered.

## Long requests without streaming

A request without `stream` that has not finished about 15 seconds after it
arrives — time spent waiting for capacity counts — has its `200` status sent
early, with the header `x-thatch-status-deferred: true`, to keep the connection
alive. This applies to every non-streamed request on the chat, Responses and
legacy completions endpoints. While the model works, the body is padded with
whitespace, which JSON parsers ignore.

Because the status has already been sent, a failure after that point arrives as
a `200` whose body is the usual [error object](errors.md#error-response-format).
When a response carries `x-thatch-status-deferred: true`, check the body for
`error` before reading `choices`. For long generations, streaming is simpler.
