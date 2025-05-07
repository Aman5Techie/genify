import os

import requests
from app.config import Config
from ai21 import AI21Client
from ai21.models.chat import UserMessage, SystemMessage
from logger.logging import custom_logger


SYSTEM_MESSAGE = """
You are a Manim code expert. Your task is to generate the Manim code based solely on the prompt provided. 
Do not provide any explanations or additional comments. The code you generate must only use features and methods 
available in Manim. Do not include any libraries, functions, or components that do not exist in Manim. The main class 
you generate should always be named GenerateFromUser. Any code that references non-existent features or methods 
will be considered incorrect. Your output should only be the code—nothing else.
"""


def clean_manim_code(raw_code):
    """
    Remove Markdown code block markers and extra whitespace.
    """
    if raw_code.startswith("```"):
        raw_code = "\n".join(line for line in raw_code.splitlines() if not line.strip().startswith("```"))
    
    
    return raw_code.strip()


def write_code_to_file(code: str, filename: str) -> None:
    """
    Write the generated code to a file only if the environment variable 'IS_LOCAL' is set to 'True'.
    """
    is_local = os.getenv("IS_LOCAL", "False")  # Default to "False" if not set
    
    if is_local == "True":
        with open(filename, "w") as file:
            file.write(code)
        custom_logger.info(f"Code written to {filename}")
    else:
        custom_logger.info("Not running in local environment. Code not written to file.")


def generate_code_via_ai21(prompt : str) -> str:
    """
    Given a user prompt and context, generate
    """
    custom_logger.info(f"Generating Manim code for prompt")
    
    try:
        client = AI21Client(api_key=Config.AI21_API_KEY)
        messages = [
            SystemMessage(content=SYSTEM_MESSAGE),
            UserMessage(content=prompt),
        ]
        response = client.chat.completions.create(
            model='jamba-large',
            messages=messages,)
        
        completion_text = response.choices[0].message.content   
        custom_logger.info(f"Response from AI21: {completion_text}")
        return clean_manim_code(completion_text)
    except Exception as e:
        custom_logger.error(f"Error generating Manim code: {e}")
        raise Exception("Error generating Manim code. Please try again.")



def generate_code_via_sulu(prompt: str) -> str:
    """
    Given a user prompt, generate Manim code using the Sulu API.
    """

    custom_logger.info("Generating Manim code for prompt")

    url = "https://o3-mini.p.sulu.sh/v1/chat/completions"
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {os.getenv('SULU_API_KEY')}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "o3-mini",
        "messages": [
            {"role": "system", "content": SYSTEM_MESSAGE},
            {"role": "user", "content": prompt}
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()

        completion_text = result["choices"][0]["message"]["content"]
        custom_logger.info(f"Response from Sulu API: {completion_text}")
        return clean_manim_code(completion_text)

    except Exception as e:
        custom_logger.error(f"Error generating Manim code via Sulu: {e}")
        raise Exception("Error generating Manim code. Please try again.")



