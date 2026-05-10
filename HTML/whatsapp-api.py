x = input("enter phone number: ")

text = input("enter message: ")

link = (f"https://api.whatsapp.com/send/?phone=91{x}&text={text}&type=phone_number&app_absent=0")

new_link = link.replace(" ", "+")

print(new_link)


# Hi%2C+I+am+interested+in+your+listing%3A+Broken+Samsung+Galaxy+S21+Ultra+-+Needs+Repair