import time
import os

fruits = input("Enter fruits: ").split()  # take input in list one word space second word and so on


for line in fruits:
    for ch in line:
        print(ch, end="", flush=True)
        time.sleep(0.1)
    print()
    os.system("cls")





