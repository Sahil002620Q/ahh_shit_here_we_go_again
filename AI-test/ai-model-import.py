from transformers import pipeline

# load AI model
ai = pipeline("text-generation", model="gpt2")

# user input
prompt = input("Ask AI something: ")

# generate response
result = ai(prompt, max_length=50, num_return_sequences=1)

print("\nAI Response:")
print(result[0]['generated_text'])