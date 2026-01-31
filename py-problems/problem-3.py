#module installation
# import matplotlib.pyplot as plt
# from matplotlib.animation import FuncAnimation
# import numpy as np

# fig, ax = plt.subplots()
# line, = ax.plot([], [])

# def update(frame):
#     x = np.linspace(0, 10, 100)
#     y = np.sin(x + frame / 10)
#     line.set_data(x, y)
#     return line,

# ani = FuncAnimation(fig, update, frames=100, interval=50, blit=True)
# plt.show()   




import pyttsx3

# Initialize the engine
engine = pyttsx3.init()

# Set properties (optional)
engine.setProperty('rate', 125)     # Speed of speech
engine.setProperty('volume', 1.0)   # Volume level (0.0 to 1.0)
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[1].id)  # 0 for male, 1 for female

# Speak text
engine.say("Hello, it's me Sahil")
engine.runAndWait()   