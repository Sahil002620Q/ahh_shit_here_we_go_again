import socket
import threading


def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    finally:
        s.close()
    return ip


def handle_client(client_socket, target_host, target_port):
    target = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    target.connect((target_host, target_port))

    while True:
        data = client_socket.recv(4096)
        if not data:
            break

        target.sendall(data)
        response = target.recv(4096)
        client_socket.sendall(response)

    client_socket.close()
    target.close()


# Detect local IP automatically
detected_ip = get_local_ip()
print(f"Detected local IP: {detected_ip}")

listen_ip = input("Enter IP to listen on (press Enter to use detected IP): ")
if listen_ip == "":
    listen_ip = detected_ip

listen_port = int(input("Enter port to OPEN (forward from): "))

target_ip = input("Enter target IP (where traffic should go): ")
target_port = int(input("Enter target PORT: "))


server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((listen_ip, listen_port))
server.listen(5)

print(f"\nForwarding {listen_ip}:{listen_port}  →  {target_ip}:{target_port}\n")

while True:
    client, addr = server.accept()
    print(f"Connection from {addr}")

    thread = threading.Thread(
        target=handle_client,
        args=(client, target_ip, target_port)
    )
    thread.start()  