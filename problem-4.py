import os

path = "/"

contents = os.listdir(path)

print("Contents of directory:", path)
for item in contents:
    print(item)
