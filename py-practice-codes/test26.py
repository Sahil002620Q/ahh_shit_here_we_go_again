import time
list = ['hello',
        ,'myself sahil']
for line in list:
  for ch in line:
    print(ch,end='',flush=True)
          time.sleep(0.1)
  print()
