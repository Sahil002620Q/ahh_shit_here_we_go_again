import os

# specify directory path
path = "/"

# list all files and folders inside the directory
contents = os.listdir(path)

# print contents of directory
print("Contents of directory:", path)
for item in contents:
    print(item)
#end of the code
