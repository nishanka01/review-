export async function streamExplanation({
  code,
  issue,
  language,
  onDelta,
  onDone,
  onError,
}: {
  code: string;
  issue: string;
  language: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      onError("OpenAI API key is missing. Add VITE_OPENAI_API_KEY to your .env file.");
      return;
    }

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a senior software engineer performing code review. You specialize in ${language || "multiple languages"}. 
When given a code snippet and a detected issue, provide:
1. **What's Wrong**: A clear explanation of the issue
2. **Why It Matters**: Impact on code quality, performance, or correctness
3. **Suggested Fix**: The corrected code with explanation
4. **Best Practice**: A relevant best practice tip

Be concise but thorough. Use markdown formatting.`,
        },
        {
          role: "user",
          content: `Review this ${language || ""} code:\n\`\`\`\n${code}\n\`\`\`\n\nDetected issue: ${issue}`,
        },
      ],
      stream: true,
    };

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Request failed" }));
      onError(err.error?.message || err.error || `Error ${resp.status}`);
      return;
    }

    if (!resp.body) {
      onError("No response body");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx: number;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") {
          onDone();
          return;
        }
        try {
          const parsed = JSON.parse(json);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          // Incomplete fragment, wait for more data
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
    onDone();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Unknown error");
  }
}
