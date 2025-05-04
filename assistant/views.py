import os
import csv
import io
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

@csrf_exempt
def chat(request):
    """
    POST /chat/ with JSON { message: "..." }
    Returns assistant reply based on text only.
    """
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    try:
        data = json.loads(request.body)
        user_message = data.get("message", "")

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
                {"role": "user", "content": user_message}
            ],
            extra_headers={
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "NeoFinance Assistant"
            }
        )
        return JsonResponse({"response": completion.choices[0].message.content})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def summarize_csv_file(uploaded_file, max_rows=20):
    """
    Read the uploaded CSV, parse into dicts, and produce
    a short textual summary (first N rows).
    """
    decoded = uploaded_file.read().decode('utf-8')
    reader = csv.DictReader(io.StringIO(decoded))
    rows = list(reader)[:max_rows]

    summary_lines = []
    for row in rows:
        date = row.get('Date', row.get('date', ''))
        desc = row.get('Description', row.get('description', ''))
        amt  = row.get('Amount', row.get('amount', ''))
        typ  = row.get('Type', row.get('type', ''))
        cat  = row.get('Category', row.get('category', ''))
        summary_lines.append(f"{date} | {desc} | {amt} | {typ} | {cat}")

    if len(rows) > max_rows:
        summary_lines.append(f"...and {len(rows) - max_rows} more rows omitted.")
    return "\n".join(summary_lines)


@csrf_exempt
def chat_with_csv(request):
    """
    POST /chat/csv/ multipart/form-data:
      - file: the CSV file
      - message: (optional) follow-up prompt
    Returns assistant reply that incorporates the CSV content.
    """
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    uploaded_file = request.FILES.get('file')
    if not uploaded_file:
        return JsonResponse({"error": "No CSV file provided"}, status=400)

    user_message = request.POST.get("message", "").strip()

    try:
        csv_summary = summarize_csv_file(uploaded_file)
    except Exception as e:
        return JsonResponse({"error": f"Failed to parse CSV: {str(e)}"}, status=400)

    system_prompt = (
        "You are Emmanuel, a friendly and expert financial assistant "
        "working for NeoFinance that helps users manage money wisely. "
        "Keep answers clear, supportive, and smart."
    )
    combined_content = (
        "Here is a summary of my recent transactions (first 20 rows):\n"
        f"{csv_summary}\n\n"
        + (f"Additional question: {user_message}" if user_message else "")
    )

    try:
        client = OpenAI(
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1"
        )
        completion = client.chat.completions.create(
            model="deepseek/deepseek-r1:free",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": combined_content},
            ],
            extra_headers={
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "NeoFinance Assistant"
            }
        )
        return JsonResponse({"response": completion.choices[0].message.content})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)