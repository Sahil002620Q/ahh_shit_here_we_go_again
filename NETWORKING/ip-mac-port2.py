import socket
import requests
import psutil
import subprocess

print("\n========== NETWORK INFORMATION ==========\n")

# Hostname
hostname = socket.gethostname()

# Private IP
private_ip = socket.gethostbyname(hostname)
print("Private IP:", private_ip)

# Localhost
localhost_ip = socket.gethostbyname("localhost")
print("Localhost IP:", localhost_ip)

# Public IP
try:
    public_ip = requests.get("https://api.ipify.org").text
    print("Public IP:", public_ip)
except:
    print("Public IP: Unable to fetch")

print("\n========== MAC ADDRESSES ==========\n")

for interface, addrs in psutil.net_if_addrs().items():
    for addr in addrs:
        if addr.family == psutil.AF_LINK:
            print(f"{interface} -> {addr.address}")

print("\n========== OPEN PORTS ==========\n")

connections = psutil.net_connections(kind="inet")
open_ports = set()

for conn in connections:
    if conn.status == "LISTEN":
        open_ports.add(conn.laddr.port)

for port in sorted(open_ports):
    print("Port:", port)

print("\n========== PORT CONFIGURATION ==========\n")

print("Choose IP to bind the port:")
print("1 -> Localhost (127.0.0.1)")
print("2 -> Private Network IP")

choice = input("Enter choice: ")

port = input("Enter port number: ")

try:
    port = int(port)

    if choice == "1":
        bind_ip = "127.0.0.1"
    elif choice == "2":
        bind_ip = private_ip
    else:
        print("Invalid choice")
        exit()

    print(f"\nBinding port {port} to {bind_ip}")

    subprocess.run(
        f'netsh interface portproxy add v4tov4 listenport={port} listenaddress={bind_ip} connectport={port} connectaddress={bind_ip}',
        shell=True
    )

    print("\nPort configured successfully.")

    print("\nAccess URLs:")

    if bind_ip == "127.0.0.1":
        print(f"http://127.0.0.1:{port}")
    else:
        print(f"http://{private_ip}:{port}")

except:
    print("Error configuring port.")