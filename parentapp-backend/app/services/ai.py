import httpx
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from ..config import OPENROUTER_API_KEY, OPENROUTER_MODEL, OPENROUTER_BASE_URL


async def stream_completion(messages: list, timeout: int = 60) -> StreamingResponse:
    api_key = OPENROUTER_API_KEY
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")

    payload = {"model": OPENROUTER_MODEL, "stream": True, "messages": messages}

    async def generate():
        async with httpx.AsyncClient(timeout=timeout) as client:
            async with client.stream(
                "POST",
                OPENROUTER_BASE_URL,
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json=payload,
            ) as response:
                async for line in response.aiter_lines():
                    if line:
                        yield f"{line}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


async def get_completion(messages: list, timeout: int = 30) -> str:
    api_key = OPENROUTER_API_KEY
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")

    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.post(
            OPENROUTER_BASE_URL,
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={"model": OPENROUTER_MODEL, "stream": False, "messages": messages},
        )
        response.raise_for_status()

    return response.json()["choices"][0]["message"]["content"]
