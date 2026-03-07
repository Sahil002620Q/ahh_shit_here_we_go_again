import socket
import time

# Common ports dictionary
common_ports = {
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    3306: "MySQL"
}

target = input("Enter target IP: ")

print(f"\nScanning target: {target}")
print("-" * 40)

start_time = time.time()

for port in common_ports.keys():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1)

    try:
        s.connect((target, port))
        print(f"[+] Port {port} is OPEN ({common_ports[port]})")

        try:
            banner = s.recv(1024).decode().strip()
            if banner:
                print(f"    Banner: {banner}")
        except:
            pass

    except:
        pass

    finally:
        s.close()

end_time = time.time()
print("\nScan completed in", round(end_time - start_time, 2), "seconds")