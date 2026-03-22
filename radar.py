#!/usr/bin/env python3
"""
Network Security Scanner v1.0
Built for 1st year hackathon - Uses nmap, netcat, socket
Detects: Open ports, device types, vulnerabilities
"""

import subprocess
import socket
import threading
import json
import sys
from datetime import datetime
import ipaddress

class NetworkScanner:
    def __init__(self, network="0.0.0.0/24"):
        self.network = ipaddress.IPv4Network(network)
        self.results = []
        self.live_hosts = []
    
    def scan_live_hosts(self):
        """Ping sweep to find live devices (Nmap style)"""
        print("🔍 Scanning live hosts...")
        cmd = ["nmap", "-sn", str(self.network)]
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        for line in result.stdout.split('\n'):
            if 'Nmap scan report' in line:
                ip = line.split()[-1]
                if ip != 'Nmap':
                    self.live_hosts.append(ip)
                    print(f"✅ LIVE: {ip}")
    
    def port_scan(self, target, ports=[21,22,23,80,443,3389,8080]):
        """Fast port scan using socket (like netcat)"""
        open_ports = []
        for port in ports:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex((target, port))
            if result == 0:
                open_ports.append(port)
                service = self.get_service_name(port)
                print(f"  🟢 {target}:{port} ({service})")
            sock.close()
        return open_ports
    
    def get_service_name(self, port):
        """Map ports to common services"""
        services = {
            21: "FTP", 22: "SSH", 23: "Telnet", 80: "HTTP",
            443: "HTTPS", 3389: "RDP", 8080: "HTTP-Alt",
            53: "DNS", 123: "NTP", 161: "SNMP"
        }
        return services.get(port, "Unknown")
    
    def check_vulnerabilities(self, ip, open_ports):
        """Basic vulnerability checks"""
        vulns = []
        
        # Check for dangerous open ports
        dangerous = [21, 23, 3389]  # FTP, Telnet, RDP
        for port in open_ports:
            if port in dangerous:
                vulns.append(f"🚨 DANGEROUS PORT {port} OPEN")
        
        # Banner grabbing (like netcat)
        if 80 in open_ports or 8080 in open_ports:
            try:
                sock = socket.socket()
                sock.settimeout(2)
                sock.connect((ip, 80))
                sock.send(b"HEAD / HTTP/1.0\r\n\r\n")
                banner = sock.recv(1024).decode()
                sock.close()
                if "Apache" in banner:
                    vulns.append("⚠️ Apache server detected")
                if "nginx" in banner:
                    vulns.append("⚠️ Nginx server detected")
            except:
                pass
        
        return vulns
    
    def dns_lookup(self, ip):
        """Reverse DNS lookup"""
        try:
            hostname = socket.gethostbyaddr(ip)[0]
            return hostname
        except:
            return "No DNS"
    
    def full_scan(self):
        """Main scanning logic"""
        self.scan_live_hosts()
        
        print(f"\n🔥 Full scan of {len(self.live_hosts)} live devices...")
        
        for ip in self.live_hosts:
            print(f"\n📡 Scanning {ip}...")
            
            # Port scan
            open_ports = self.port_scan(ip)
            
            # DNS lookup
            hostname = self.dns_lookup(ip)
            
            # Vulnerability check
            vulns = self.check_vulnerabilities(ip, open_ports)
            
            # Store results
            device = {
                "ip": ip,
                "hostname": hostname,
                "open_ports": open_ports,
                "vulnerabilities": vulns,
                "risk_level": self.calculate_risk(open_ports, vulns),
                "scanned_at": datetime.now().isoformat()
            }
            self.results.append(device)
        
        self.generate_report()
    
    def calculate_risk(self, ports, vulns):
        """Risk scoring logic (0-10)"""
        score = 0
        if len(ports) > 3: score += 3
        if 22 in ports: score += 1  # SSH good
        if 21 in ports or 23 in ports: score += 4  # FTP/Telnet BAD
        if len(vulns) > 0: score += 3
        return min(score, 10)
    
    def generate_report(self):
        """HTML Report Generation"""
        html = f"""
        <!DOCTYPE html>
        <html>
        <head><title>Network Security Report</title>
        <style>
            body {{ font-family: Arial; margin: 40px; }}
            .high {{ background: #ff4444; color: white; }}
            .medium {{ background: #ffaa00; }}
            .device {{ border: 1px solid #ccc; margin: 10px; padding: 15px; }}
            table {{ border-collapse: collapse; width: 100%; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; }}
        </style>
        </head>
        <body>
            <h1>🛡️ Network Security Scan Report</h1>
            <p>Network: {self.network} | Devices: {len(self.results)} | {datetime.now().strftime('%Y-%m-%d %H:%M')}</p>
            
            <h2>🚨 Critical Devices</h2>
        """
        
        critical = [d for d in self.results if d['risk_level'] >= 7]
        for device in critical:
            html += f"""
            <div class="device high">
                <h3>{device['ip']} ({device['hostname']}) - RISK: {device['risk_level']}/10</h3>
                <p><strong>Open Ports:</strong> {', '.join(map(str, device['open_ports']))}</p>
                <p><strong>Vulnerabilities:</strong><br>{'<br>'.join(device['vulnerabilities'])}</p>
            </div>
            """
        
        html += "</body></html>"
        
        with open("security_report.html", "w") as f:
            f.write(html)
        print("✅ Report saved: security_report.html")
        
        # JSON export
        with open("scan_results.json", "w") as f:
            json.dump(self.results, f, indent=2)
        print("✅ JSON saved: scan_results.json")

def main():
    if len(sys.argv) > 1:
        network = sys.argv[1]
    else:
        network = "192.168.1.0/24"  # Default college WiFi
    
    scanner = NetworkScanner(network)
    scanner.full_scan()

if __name__ == "__main__":
    main()