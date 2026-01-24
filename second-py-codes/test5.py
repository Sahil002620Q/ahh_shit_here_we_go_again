x = "isn't my name is sahil!"
print(len(x))

# check string using in
y = "my name is sahil"
print("name" in y)

# checking that the word is in string or not using if else
# check string using if
z = "you are great"
if "great" in z:
    print("you are great for sure")
else:
    print('you are dumb for sure')

# to cheack the particular word is not in the string
# check if not
a = 'hello'
if 'world' not in a:
    print("where is your world") 

# if you print some part of text if have starting and ending n value
x = 'hello my self sahil'
print(x[6:19])

# slice form start
x = 'pip install python3'
print(x[:6])

# slice form end 
x = 'sudo apt auto remove'
print(x[8:])

# negative indexing
x = 'cd Camphish '
print(x[-9:-2])

# practise  again have txt and print desired word like ing in coding
txt = "Hello World"       #it means 2 to 4 , real in start -1 in end 
x = txt[2:5]
print(x)

# uppercase string
x = 'bash camphish.sh'
print(x.upper())

# lowercase string 
x = 'CURL ipinfo.sh/IP ADDRESS'
print(x.lower())

# remove whitespace
x = '  dirb ip address    '
print(x)
print(x.strip())

