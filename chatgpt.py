import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Initialize the OpenAI client
client = OpenAI()

def askgpt(question, chat_log=None):
    """
    Generates a response from the GPT-3 AI based on a given question and an optional chat log.

    Parameters:
    question (str): The user's question to be answered by the AI.
    chat_log (list, optional): The history of the conversation, used to maintain context.

    Returns:
    tuple: The AI-generated response and the updated chat log.
    """
    try:
        # Initialize chat log if not provided
        if chat_log is None:
            chat_log = [{'role': 'system', 'content': 'You are a helpful, upbeat and funny assistant.'}]

        # Append the user's question to the chat log
        chat_log.append({'role': 'user', 'content': question})

        # Generate a response using the OpenAI API
        response = client.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=chat_log
        )

        # Extract the response content
        answer = response.choices[0].message['content'] if 'content' in response.choices[0].message else response.choices[0].message

        # Append the AI's response to the chat log
        chat_log.append({'role': 'assistant', 'content': answer})

        return answer, chat_log

    except Exception as e:
        print(f"An error occurred: {e}")
        # Return a placeholder response and the current state of chat_log in case of an error
        return "An error occurred.", chat_log

# # Example usage
# try:
#     response, updated_chat_log = askgpt("Why did the chicken cross the road?")
#     print(response)
# except ValueError as e:
#     print(f"ValueError: {e}")
