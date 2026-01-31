num1 =int(input("enter first number : "))
print("first number is : ",num1)

num2 = int(input("enter second number : "))
print("second number is : ",num2)

opt = input("enter operator i.e +,-,*,/ : ")
print("your operator is : ",opt)

if opt == '*':
    print("sum is " ,num1 * num2)

elif opt == '+':
    print("sum is " ,num1 + num2)

elif opt == '-':
    print("sum is " ,num1 - num2)

elif opt == '/':
    print("sum is " ,num1 / num2)

else :
    print("encountered an unexpected error  ")
    print("kindly enter a valid operator")