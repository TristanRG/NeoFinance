import os
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

@csrf_exempt
def chat(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_message = data.get("message")

            client = OpenAI(
                api_key=os.getenv("OPENROUTER_API_KEY"),
                base_url="https://openrouter.ai/api/v1"
            )

            completion = client.chat.completions.create(
                model="deepseek/deepseek-r1:free",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are Emmanuel, a friendly and expert financial assistant "
                            "working for NeoFinance that helps users manage money wisely. "
                            "Keep answers clear, supportive, and smart."
                        )
                    },
                    {
                        "role": "user",
                        "content": user_message
                    }
                ],
                extra_headers={
                    "HTTP-Referer": "http://localhost:3000",  
                    "X-Title": "NeoFinance Assistant"
                }
            )

            response_message = completion.choices[0].message.content
            return JsonResponse({"response": response_message})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid method"}, status=405)
