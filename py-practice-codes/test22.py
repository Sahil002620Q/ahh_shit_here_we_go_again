import time
x = 'hello world'

for ch in x :
    print(ch , end='', flush=True)     #end='' means don't move to nest line after printing "h"
    time.sleep(0.1)
print()

print('hello',end='')          #end means line is not ended so nwxt line will attatch to it

print('world')