# OpenAI compatibility

Thatch serves the parts of OpenAI's API that inference clients rely on, in the
same shapes, so the official OpenAI SDKs and most OpenAI-compatible tools work by
changing the base URL and the key. This page lists what is covered, what is
not, and where the behaviour differs.

## Endpoints

| OpenAI endpoint | On Thatch |
| --- | --- |
| Chat Completions — `POST /v1/chat/completions` | Supported. See [Chat completions](chat-completions.md). |
| Embeddings — `POST /v1/embeddings` | Supported. See [Embeddings](embeddings.md). |
| Models — `GET /v1/models` | Supported, with extra fields. See [Models](models.md). |
| Responses — `POST /v1/responses` | Supported for stateless requests with function tools. See [Responses](#responses). |
| Completions — `POST /v1/completions` | An approximation on top of chat. See [Legacy completions](#legacy-completions). |
| Files and Batch — `/v1/files`, `/v1/batches` | Not yet supported for general use. [Contact support](../support/contact.md) if you need batch processing. |
| Audio, Images, Moderations, Assistants and Threads, Vector stores, Realtime, Fine-tuning | Not available. These paths answer `404` with the code `unknown_url`. |

<!-- TODO: document Files and Batch once they are supported for general use. -->

## Responses

`POST /v1/responses` accepts the Responses API request shape and runs it through
the same pipeline as chat completions, so the [Chat completions](chat-completions.md)
page applies. It returns a `response` object (ID prefixed `resp_`) whose
`output` holds the model's reasoning, its message, and any function calls, with
usage as `input_tokens` and `output_tokens`.

One difference from chat completions: a failure after the response has started
is reported the Responses way — a `response` with `status: "failed"`, or a
`response.failed` event when streaming — rather than as an error object.

It is **stateless**: each request carries the whole conversation. These are
refused with `400` and the code `unsupported_parameter`:

- Stored state — `previous_response_id`, `conversation`, `prompt`, `background`
  and `item_reference`.
- Hosted tools — web search, file search, code interpreter, computer use and MCP.
  Function tools work.
- File and audio inputs, and images referenced by `file_id`.
- `truncation: "auto"`, and `top_logprobs` above `0`.

`store`, `metadata` and `user` are accepted and ignored, and named in the
`x-thatch-ignored-params` header.

Streaming sends named `response.*` events, as OpenAI does. There is no
`data: [DONE]` line at the end of a Responses stream.

## Legacy completions

`POST /v1/completions` accepts the legacy request shape, but it is an
approximation: the `prompt` is sent to a chat model as a single user message,
with reasoning turned off. The model **answers** the prompt rather than
continuing it, so code that relies on raw text continuation will behave
differently. Prefer [chat completions](chat-completions.md) for new code.

It returns `text_completion` objects, and a stream ends with `data: [DONE]`.
`max_tokens` defaults to `16`, as in OpenAI's API. These are refused with `400`
and the code `unsupported_parameter`: `suffix`, `echo`, `logprobs`, `best_of`
above `1`, prompts given as token IDs, more than one prompt, and tools.

## Behaviour that differs

- **Error types.** Errors use OpenAI's envelope, but some `type` values are
  Thatch's own — `unauthorized`, `invalid_request`, `rate_limit_exceeded` and
  others. Branch on the HTTP status and `code`. See [Errors](errors.md).
- **No rate-limit headers.** There are no `x-ratelimit-*` headers; a `429` carries
  `Retry-After`. See [Rate limits & quotas](limits.md).
- **No idempotency keys.** An `Idempotency-Key` header has no effect: a retried
  request is a new request.
- **Unused parameters are reported.** See the `x-thatch-ignored-params` and
  `x-thatch-unrecognised-params` headers in
  [Chat completions](chat-completions.md#parameters).
- **Long non-streamed requests can answer `200` before they finish.** See
  [Long requests without streaming](chat-completions.md#long-requests-without-streaming).
- **No calls from your web pages.** The API does not allow cross-origin requests
  from your sites, so browsers block them. Call it from your server — which is
  where your API key belongs anyway.
