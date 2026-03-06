import os

while True:
    cmd = input("my-terminal$ ")

    if cmd.lower() in ["exit", "quit"]:
        print("Exiting terminal...")
        break

    os.system(cmd)  