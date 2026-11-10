# SDKs

There is no Thatch-specific SDK. The API is OpenAI-compatible, so use the
official OpenAI SDKs — or any OpenAI-compatible client — with the base URL set
to Thatch and your Thatch API key.

The base URL is `https://api.thatch.cloud/v1`, ending at `/v1`. The SDKs add the
endpoint path themselves; a base URL that already includes
`/chat/completions` makes every call a `404`.

## Python

```bash
pip install openai
```

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.thatch.cloud/v1",
    api_key=os.environ["THATCH_API_KEY"],
)

response = client.chat.completions.create(
    model="<model-id>",
    messages=[{"role": "user", "content": "Hello"}],
)
print(response.choices[0].message.content)
```

## Node.js and TypeScript

```bash
npm install openai
```

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.thatch.cloud/v1",
  apiKey: process.env.THATCH_API_KEY,
});

const response = await client.chat.completions.create({
  model: "<model-id>",
  messages: [{ role: "user", content: "Hello" }],
});
console.log(response.choices[0].message.content);
```

## Other clients

Anything that lets you set an OpenAI base URL and API key works the same way —
set the base URL to `https://api.thatch.cloud/v1` and the key to your
`thatch_sk_` key. Pick model IDs from [`GET /v1/models`](models.md), and check
[OpenAI compatibility](openai-compatibility.md) for the endpoints and features
the client will use.

Fields Thatch adds to responses, such as `reasoning_content` on reasoning models,
are not part of the SDKs' types. In Python they are still readable as attributes
of the response objects; in TypeScript, read them through a cast.
