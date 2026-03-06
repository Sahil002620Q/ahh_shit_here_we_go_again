# import subprocess
# print('[1] AI-research')
# print('[2] py-problems')
# print('[3] py-projects')
# print('[4] python-modules')
# print('[5] py-practice-codes')
# print('[6] Python-games')
# print('[7] c-practice-codes')
# print('[8] c-projects')
# print('[9] DSA')

# x = int(input('Enter choice : '))

# if x == 1:
#     subprocess.run("cd ahh_shit_here_we_go_again",shell=True)
#     # subprocess.run("cd AI-research",shell=True)
# elif x == 2:
#     subprocess.run("cd ahh_shit_here_we_go_again",shell=True)
#     subprocess.run("cd py-problems",shell=True)
# elif x == 3:
#     subprocess.run("cd ahh_shit_here_we_go_again",shell=True)
#     subprocess.run("cd py-projects",shell=True)
# elif x == 4:
#     subprocess.run("cd ahh_shit_here_we_go_again",shell=True)
#     subprocess.run("cd python-modules",shell=True)
# elif x == 5:
#     subprocess.run("cd ahh_shit_here_we_go_again",shell=True)
#     subprocess.run("cd py-practice-codes",shell=True)
# elif x == 6:
#     subprocess.run("cd ahh_shit_here_we_go_again",shell=True)
#     subprocess.run("cd Python-games",shell=True)
# elif x == 7:
#     subprocess.run("cd ahh_shit_here_we_go_again",shell=True)
#     subprocess.run("cd c-practice-codes",shell=True)
# elif x == 8:
#     subprocess.run("cd ahh_shit_here_we_go_again",shell=True)
#     subprocess.run("cd c-projects",shell=True)
# elif x == 9:
#     subprocess.run("cd ahh_shit_here_we_go_again",shell=True)
#     subprocess.run("cd DSA",shell=True)
# elif x == 10:
#     subprocess.run("cd ahh_shit_here_we_go_again",shell=True)
#     subprocess.run("cd ",shell=True)
# elif x == 11:
#     subprocess.run("cd ahh_shit_here_we_go_again",shell=True)
#     subprocess.run("cd ",shell=True)



import subprocess

folders = {
    1: "AI-research",
    2: "py-problems",
    3: "py-projects",
    4: "python-modules",
    5: "py-practice-codes",
    6: "Python-games",
    7: "c-practice-codes",
    8: "c-projects",
    9: "DSA"
}

print("Choose project:")

for k, v in folders.items():
    print(f"[{k}] {v}")

x = int(input("Enter choice: "))

base = "ahh_shit_here_we_go_again"

if x in folders:
    path = f"{base}/{folders[x]}"
    subprocess.run(["cmd", "/k", "cd", path])