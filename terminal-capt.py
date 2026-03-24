import subprocess
try:
    x = subprocess.run(
        ["git","statusd"],capture_output=True ,
        text=True ,
        check=True)
    print(x.stdout)

except subprocess.CalledProcessError as e:
    print("error occured (wrong command)\n",e.stderr)