# client.py

import socket
import threading

server_ip = input("Enter server IP: ")
PORT = 5000

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect((server_ip, PORT))

print("=================================")
print("        LAN CHAT CLIENT")
print("=================================")
print("Connected to server\n")

def receive_messages():
	while True:
		try:
			message = client.recv(1024).decode()
			if message:
				print(f"\nServer: {message}")
				print("You: ", end="")
		except:
			print("\nConnection closed.")
			break

thread = threading.Thread(target=receive_messages)
thread.start()

while True:
	message = input("You: ")
	client.send(message.encode())
