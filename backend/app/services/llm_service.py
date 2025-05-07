# /backend/app/services/llm_service.py

import openai
from app.config import Config
from ai21 import AI21Client
from ai21.models.chat import UserMessage, SystemMessage

# openai.api_key = Config.LLM_API_KEY


# def generate_manim_code(prompt):
#     """
#     Given a user prompt, generate the corresponding Manim code using the LLM.
#     """
#     try:
#         response = openai.Completion.create(
#             engine="text-davinci-003",  # You can switch to another model if needed
#             prompt=f"Generate Manim code for the following instruction: {prompt}",
#             max_tokens=1500,
#             temperature=0.7,
#         )

#         manim_code = response.choices[0].text.strip()
#         return manim_code

#     except Exception as e:
#         raise Exception(f"Error generating Manim code: {str(e)}")


def clean_manim_code(raw_code):
    """
    Remove Markdown code block markers and extra whitespace.
    """
    if raw_code.startswith("```"):
        raw_code = "\n".join(line for line in raw_code.splitlines() if not line.strip().startswith("```"))
    
    
    return raw_code.strip()


def generate_manim_code(prompt : str) -> str:
    """
    Given a user prompt and context, generate
    """
    SYSTEM_MESSAGE = "You are a manim code expert and your job is to generate the code as per the prompt. Only give the code not explanation and nothing only code. And always name the main class GenerateFromUser."
    # or pass it in directly

    client = AI21Client(api_key=Config.AI21_API_KEY)
    messages = [
        SystemMessage(content=SYSTEM_MESSAGE),
        UserMessage(content=prompt),
    ]
    response = client.chat.completions.create(
        model='jamba-large',
        messages=messages,)
    
    
    completion_text = response.choices[0].message.content   
    print(completion_text)
    return clean_manim_code(completion_text)



