import socket
import uuid
import requests
import psutil
import subprocess

print("----- NETWORK INFORMATION -----\n")

# Private IP
hostname = socket.gethostname()
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

print("\n----- MAC ADDRESSES -----")

for interface, addrs in psutil.net_if_addrs().items():
    for addr in addrs:
        if addr.family == psutil.AF_LINK:
            print(f"{interface}: {addr.address}")

print("\n----- OPEN PORTS -----")

connections = psutil.net_connections(kind="inet")
open_ports = set()

for conn in connections:
    if conn.status == "LISTEN":
        open_ports.add(conn.laddr.port)

for port in sorted(open_ports):
    print("Open port:", port)

print("\n----- PORT FORWARDING -----")

port = input("Enter port you want to forward: ")

try:
    port = int(port)

    # Try UPnP using Windows netsh
    subprocess.run(
        f'netsh interface portproxy add v4tov4 listenport={port} listenaddress=0.0.0.0 connectport={port} connectaddress={private_ip}',
        shell=True
    )

    print(f"\nPort {port} forwarded locally.")
    print(f"You can try accessing from another device on the same network:")
    print(f"http://{private_ip}:{port}")

except:
    print("Port forwarding failed.")

print("\nProgram finished.")