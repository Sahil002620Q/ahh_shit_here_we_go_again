import random
x = random.randint(1,100)
guess = int(input('make a guess : '))

while True:
    if guess < x:
        print('small')
        guess = int(input('make another guess : '))

    elif guess > x:
        print('large')
        guess = int(input('make another guess : '))

    # elif guess+10 < x:
    #     print('thoda kam ')
    #     guess = int(input('make another guess : '))

    # elif guess+10 > x:
    #     print('thoda zada')
    #     guess = int(input('make another guess : '))

    elif guess == x:
        print(f'you guessed it right ,it was {x}')
        break

#without ai