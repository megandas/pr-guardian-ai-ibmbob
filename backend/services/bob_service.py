import os
from dotenv import load_dotenv

from ibm_watsonx_ai import Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams

load_dotenv()

# Read credentials from .env
IBM_API_KEY = os.getenv("IBM_API_KEY")
IBM_PROJECT_ID = os.getenv("IBM_PROJECT_ID")
IBM_ENDPOINT = os.getenv("IBM_ENDPOINT")

# Connect to IBM watsonx.ai
credentials = Credentials(
    api_key=IBM_API_KEY,
    url=IBM_ENDPOINT
)

# IBM Granite model (IBM Bob)
model = ModelInference(
    model_id="ibm/granite-4-h-small",
    credentials=credentials,
    project_id=IBM_PROJECT_ID,
    params={
        GenParams.MAX_NEW_TOKENS: 350,
        GenParams.TEMPERATURE: 0.2
    }
)


def bob_review(prompt: str):
    """
    Sends prompt to IBM Granite and returns only the answer.
    """

    print("🚀 Sending to IBM Bob...")

    final_prompt = f"""
You are PR Guardian AI, an AI code review assistant.

Answer the user's question using the provided context.
Return only the final answer.
Do not repeat instructions, prompts, rules, or context.

{prompt}
"""

    response = model.generate_text(prompt=final_prompt)

    print("✅ IBM Bob responded.")

    answer = response.strip()

    # Remove any leaked instruction text
    leak_markers = [
        "Do NOT",
        "IMPORTANT:",
        "Rules:",
        "Developer Question:",
        "PROJECT CONTEXT:",
        "Project Context:",
        "User Question:",
        "Your Task:"
    ]

    for marker in leak_markers:
        if marker in answer:
            answer = answer.split(marker)[0].strip()

    return answer