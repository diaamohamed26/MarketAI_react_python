import os
import httpx

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

SYSTEM_PROMPT = """
You are MarketAI, an expert digital marketing assistant.

You help users with:
- Digital marketing strategies
- Social media marketing
- Advertising campaigns
- SEO optimization
- Email marketing
- Lead generation
- Content creation
- Marketing analytics

Give useful, clear and actionable answers.
Use headings and bullet points when appropriate.
"""


async def ask_ai(prompt: str) -> str:
    if not GROQ_API_KEY:
        return (
            "MarketAI Demo Mode\n\n"
            f"Your request: {prompt}\n\n"
            "Suggested marketing approach:\n"
            "1. Identify your target audience.\n"
            "2. Define a measurable marketing objective.\n"
            "3. Select the best marketing channel.\n"
            "4. Create engaging content.\n"
            "5. Measure results and optimize your strategy.\n\n"
            "Add GROQ_API_KEY to backend/.env to enable real AI responses."
        )

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload
        )

        if response.is_error:
            raise RuntimeError(
                f"AI provider returned HTTP {response.status_code}"
            )

        data = response.json()
        return data["choices"][0]["message"]["content"]
