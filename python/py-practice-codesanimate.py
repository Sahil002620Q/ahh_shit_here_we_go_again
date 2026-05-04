import time
lines = "hello \r sahil\r"
for ch in lines:
    print(ch,end='',flush=True)
    time.sleep(0.2)
print('\r')

lines = "     \r"
for ch in lines:
    print(ch,end='',flush=True)
    time.sleep(0.2)
lines = "yesss"
for ch in lines:
    print(ch,end='',flush=True)
    time.sleep(0.2)
