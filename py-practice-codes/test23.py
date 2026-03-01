import time
def lineanime(text):

    
    for ch in text :
        print(ch,end="",flush = True)
        time.sleep(0.1)
    print('\r')

if __name__ == "__main__":
    lineanime("hello, mysef sahil")
    lineanime("how can i help you ")