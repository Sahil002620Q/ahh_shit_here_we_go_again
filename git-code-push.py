import socket
import threading

HOST = "0.0.0.0"
PORT = 5000

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((HOST, PORT))
server.listen()

print("=================================")
print("        LAN CHAT SERVER")
print("=================================")
print(f"Server running on port {PORT}")
print("Waiting for connection...\n")

conn, addr = server.accept()
print(f"Connected with {addr}\n")

def receive_messages():
    while True:
        try:
            message = conn.recv(1024).decode()
            if message:
                print(f"\nClient: {message}")
                print("You: ", end="")
        except:
            print("\nConnection closed.")
            break

thread = threading.Thread(target=receive_messages)
thread.start()

while True:
    message = input("You: ")
    conn.send(message.encode())