"""
Python Syntax Reference and Revision Guide
============================================
This file contains Python syntax from basic to advanced concepts.
Each section has explanatory comments for easy revision.
Author: Created for revision purposes
Date: 2026-01-25
"""

# ============================================================================
# SECTION 1: BASICS - Variables and Data Types
# ============================================================================

# Variables - no declaration needed, dynamically typed
# Naming convention: lowercase with underscores (snake_case)
name = "Sahil"  # String
age = 25  # Integer
height = 5.9  # Float
is_student = True  # Boolean
nothing_value = None  # None type (like NULL in C)

# Multiple assignment
x, y, z = 10, 20, 30

# Same value to multiple variables
a = b = c = 100

# Print function - output to console
print("Hello, World!")  # Basic print
print("Name:", name, "Age:", age)  # Multiple values
print(f"My name is {name} and I'm {age} years old")  # f-string (formatted string)

# ============================================================================
# SECTION 2: BASIC DATA TYPES
# ============================================================================

# Integers - whole numbers
num1 = 42
num2 = -15
big_num = 1_000_000  # Underscores for readability

# Floats - decimal numbers
pi = 3.14159
scientific = 2.5e-3  # Scientific notation: 0.0025

# Strings - text data (immutable)
single_quote = 'Hello'
double_quote = "World"
multiline = """This is
a multiline
string"""

# String operations
greeting = "Hello"
subject = "Python"
full_greeting = greeting + " " + subject  # Concatenation
repeated = "Ha" * 3  # Repetition: "HaHaHa"
length = len(greeting)  # Length of string

# String methods
upper_case = greeting.upper()  # "HELLO"
lower_case = greeting.lower()  # "hello"
replaced = "Hello World".replace("World", "Python")  # "Hello Python"
split_words = "apple,banana,cherry".split(",")  # ['apple', 'banana', 'cherry']
stripped = "  spaces  ".strip()  # Remove whitespace

# String indexing and slicing (0-based indexing)
first_char = greeting[0]  # 'H'
last_char = greeting[-1]  # 'o' (negative index from end)
substring = greeting[1:4]  # 'ell' (from index 1 to 3)
every_second = greeting[::2]  # 'Hlo' (step of 2)

# Boolean - True or False (case-sensitive)
is_valid = True
is_empty = False

# Type conversion (casting)
str_to_int = int("123")  # String to integer
int_to_str = str(456)  # Integer to string
str_to_float = float("3.14")  # String to float
int_to_bool = bool(1)  # Non-zero is True, 0 is False

# ============================================================================
# SECTION 3: OPERATORS
# ============================================================================

# Arithmetic operators
addition = 10 + 5  # 15
subtraction = 10 - 5  # 5
multiplication = 10 * 5  # 50
division = 10 / 3  # 3.333... (always returns float)
floor_division = 10 // 3  # 3 (integer division)
modulus = 10 % 3  # 1 (remainder)
exponentiation = 2 ** 3  # 8 (2 to the power of 3)

# Comparison operators (return boolean)
equal = (5 == 5)  # True
not_equal = (5 != 3)  # True
greater = (10 > 5)  # True
less = (5 < 10)  # True
greater_equal = (10 >= 10)  # True
less_equal = (5 <= 10)  # True

# Logical operators
and_operator = (True and False)  # False
or_operator = (True or False)  # True
not_operator = not True  # False

# Assignment operators
num = 10
num += 5  # num = num + 5 (same for -=, *=, /=, //=, %=, **=)

# Identity operators
list1 = [1, 2, 3]
list2 = [1, 2, 3]
list3 = list1
same_object = (list1 is list3)  # True (same object in memory)
same_value = (list1 == list2)  # True (same values)

# Membership operators
fruits = ["apple", "banana", "cherry"]
has_apple = "apple" in fruits  # True
no_grape = "grape" not in fruits  # True

# ============================================================================
# SECTION 4: CONTROL FLOW - Conditionals
# ============================================================================

# if statement - basic conditional
score = 85
if score >= 90:
    print("Grade: A")
elif score >= 80:  # else if
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: F")

# Ternary operator (conditional expression)
status = "Pass" if score >= 60 else "Fail"

# Nested if statements
age = 20
has_license = True
if age >= 18:
    if has_license:
        print("Can drive")
    else:
        print("Need license")
else:
    print("Too young")

# Multiple conditions
temperature = 25
is_sunny = True
if temperature > 20 and is_sunny:
    print("Great day for a picnic!")

# ============================================================================
# SECTION 5: LOOPS
# ============================================================================

# for loop - iterate over sequences
# Range: range(start, stop, step)
for i in range(5):  # 0 to 4
    print(i)

for i in range(2, 10, 2):  # 2, 4, 6, 8 (even numbers)
    print(i)

# Iterate over list
colors = ["red", "green", "blue"]
for color in colors:
    print(color)

# Enumerate - get index and value
for index, color in enumerate(colors):
    print(f"Index {index}: {color}")

# while loop - repeat while condition is true
count = 0
while count < 5:
    print(count)
    count += 1

# Loop control statements
for i in range(10):
    if i == 3:
        continue  # Skip rest of iteration, go to next
    if i == 7:
        break  # Exit loop completely
    print(i)

# else clause in loops (executes if loop completes normally)
for i in range(5):
    print(i)
else:
    print("Loop completed normally")

# Nested loops
for i in range(3):
    for j in range(3):
        print(f"({i}, {j})")

# ============================================================================
# SECTION 6: DATA STRUCTURES - Lists
# ============================================================================

# Lists - ordered, mutable, allow duplicates
numbers = [1, 2, 3, 4, 5]
mixed_list = [1, "hello", 3.14, True]  # Can hold different types
nested_list = [[1, 2], [3, 4], [5, 6]]

# List operations
numbers.append(6)  # Add to end: [1, 2, 3, 4, 5, 6]
numbers.insert(0, 0)  # Insert at index: [0, 1, 2, 3, 4, 5, 6]
numbers.remove(3)  # Remove first occurrence of 3
popped = numbers.pop()  # Remove and return last element
popped_index = numbers.pop(0)  # Remove and return element at index 0
numbers.extend([7, 8, 9])  # Add multiple elements
numbers.clear()  # Remove all elements

# List methods
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
numbers.sort()  # Sort in place: [1, 1, 2, 3, 4, 5, 6, 9]
numbers.reverse()  # Reverse in place
count_ones = numbers.count(1)  # Count occurrences of 1
index_of_4 = numbers.index(4)  # Find index of first 4

# List comprehension - concise way to create lists
squares = [x**2 for x in range(10)]  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
evens = [x for x in range(20) if x % 2 == 0]  # Even numbers
matrix = [[i*j for j in range(3)] for i in range(3)]  # 2D list

# List slicing
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
first_five = numbers[:5]  # [0, 1, 2, 3, 4]
last_five = numbers[-5:]  # [5, 6, 7, 8, 9]
middle = numbers[3:7]  # [3, 4, 5, 6]
reversed_list = numbers[::-1]  # Reverse the list

# ============================================================================
# SECTION 7: DATA STRUCTURES - Tuples
# ============================================================================

# Tuples - ordered, immutable, allow duplicates
coordinates = (10, 20)
single_element = (42,)  # Note the comma for single element
mixed_tuple = (1, "hello", 3.14)

# Tuple operations (limited since immutable)
x, y = coordinates  # Unpacking
first = coordinates[0]  # Indexing
count_10 = coordinates.count(10)  # Count occurrences
index_20 = coordinates.index(20)  # Find index

# Tuple advantages: faster than lists, can be used as dictionary keys

# ============================================================================
# SECTION 8: DATA STRUCTURES - Sets
# ============================================================================

# Sets - unordered, mutable, NO duplicates
unique_numbers = {1, 2, 3, 4, 5}
unique_from_list = set([1, 2, 2, 3, 3, 3])  # {1, 2, 3}

# Set operations
unique_numbers.add(6)  # Add element
unique_numbers.remove(3)  # Remove element (raises error if not found)
unique_numbers.discard(10)  # Remove if exists (no error)
popped_element = unique_numbers.pop()  # Remove and return arbitrary element
unique_numbers.clear()  # Remove all

# Set mathematical operations
set_a = {1, 2, 3, 4, 5}
set_b = {4, 5, 6, 7, 8}

union = set_a | set_b  # {1, 2, 3, 4, 5, 6, 7, 8}
intersection = set_a & set_b  # {4, 5}
difference = set_a - set_b  # {1, 2, 3}
symmetric_diff = set_a ^ set_b  # {1, 2, 3, 6, 7, 8}

# Set comprehension
even_squares = {x**2 for x in range(10) if x % 2 == 0}

# ============================================================================
# SECTION 9: DATA STRUCTURES - Dictionaries
# ============================================================================

# Dictionaries - key-value pairs, unordered (ordered from Python 3.7+), mutable
student = {
    "name": "Sahil",
    "age": 25,
    "courses": ["Math", "Physics"]
}

# Dictionary operations
name = student["name"]  # Access value by key
age = student.get("age")  # Safe access (returns None if key doesn't exist)
default_value = student.get("grade", "N/A")  # With default value

student["age"] = 26  # Update value
student["grade"] = "A"  # Add new key-value pair
del student["courses"]  # Delete key-value pair
removed_value = student.pop("grade")  # Remove and return value

# Dictionary methods
keys = student.keys()  # Get all keys
values = student.values()  # Get all values
items = student.items()  # Get all key-value pairs as tuples

# Iterate over dictionary
for key in student:
    print(f"{key}: {student[key]}")

for key, value in student.items():
    print(f"{key}: {value}")

# Dictionary comprehension
squares_dict = {x: x**2 for x in range(5)}  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Nested dictionaries
students = {
    "student1": {"name": "Alice", "age": 20},
    "student2": {"name": "Bob", "age": 22}
}

# ============================================================================
# SECTION 10: FUNCTIONS - Basics
# ============================================================================

# Function definition
def greet():
    """This is a docstring - describes what the function does"""
    print("Hello!")

# Function with parameters
def greet_person(name):
    print(f"Hello, {name}!")

# Function with return value
def add(a, b):
    return a + b

# Function with default parameters
def greet_with_title(name, title="Mr."):
    return f"Hello, {title} {name}"

# Function with multiple return values (actually returns a tuple)
def get_min_max(numbers):
    return min(numbers), max(numbers)

minimum, maximum = get_min_max([1, 5, 3, 9, 2])

# Keyword arguments
def describe_pet(animal, name):
    print(f"I have a {animal} named {name}")

describe_pet(animal="dog", name="Buddy")  # Order doesn't matter
describe_pet(name="Whiskers", animal="cat")

# *args - variable number of positional arguments
def sum_all(*numbers):
    total = 0
    for num in numbers:
        total += num
    return total

result = sum_all(1, 2, 3, 4, 5)  # Can pass any number of arguments

# **kwargs - variable number of keyword arguments
def print_info(**info):
    for key, value in info.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25, city="New York")

# Lambda functions - anonymous, one-line functions
square = lambda x: x**2
add = lambda x, y: x + y
result = square(5)  # 25

# Lambda with map, filter, reduce
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))  # [1, 4, 9, 16, 25]
evens = list(filter(lambda x: x % 2 == 0, numbers))  # [2, 4]

# ============================================================================
# SECTION 11: FUNCTIONS - Advanced
# ============================================================================

# Scope - LEGB Rule (Local, Enclosing, Global, Built-in)
global_var = "I'm global"

def outer():
    enclosing_var = "I'm in enclosing scope"
    
    def inner():
        local_var = "I'm local"
        print(local_var)
        print(enclosing_var)
        print(global_var)
    
    inner()

# Global keyword - modify global variable
counter = 0

def increment():
    global counter
    counter += 1

# Nonlocal keyword - modify enclosing scope variable
def outer_function():
    count = 0
    
    def inner_function():
        nonlocal count
        count += 1
        return count
    
    return inner_function

# Recursion - function calling itself
def factorial(n):
    """Calculate factorial using recursion"""
    if n == 0 or n == 1:  # Base case
        return 1
    else:
        return n * factorial(n - 1)  # Recursive case

def fibonacci(n):
    """Calculate nth Fibonacci number"""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Closures - inner function remembering enclosing scope
def make_multiplier(factor):
    def multiply(number):
        return number * factor
    return multiply

times_3 = make_multiplier(3)
result = times_3(10)  # 30

# Decorators - modify function behavior
def uppercase_decorator(func):
    """Decorator that converts function output to uppercase"""
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper()
    return wrapper

@uppercase_decorator
def greet_lower(name):
    return f"hello, {name}"

print(greet_lower("alice"))  # "HELLO, ALICE"

# Decorator with arguments
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def say_hello():
    print("Hello!")

# ============================================================================
# SECTION 12: FILE HANDLING
# ============================================================================

# Writing to a file
# 'w' - write (overwrites), 'a' - append, 'r' - read, 'r+' - read and write
with open("example.txt", "w") as file:
    file.write("Hello, World!\n")
    file.write("This is a new line.\n")

# Reading from a file
with open("example.txt", "r") as file:
    content = file.read()  # Read entire file
    print(content)

# Read line by line
with open("example.txt", "r") as file:
    for line in file:
        print(line.strip())  # strip() removes newline character

# Read all lines into a list
with open("example.txt", "r") as file:
    lines = file.readlines()  # Returns list of lines

# Appending to a file
with open("example.txt", "a") as file:
    file.write("Appended line\n")

# File operations with error handling
try:
    with open("nonexistent.txt", "r") as file:
        content = file.read()
except FileNotFoundError:
    print("File not found!")

# Working with CSV files (requires csv module)
import csv

# Writing CSV
data = [
    ["Name", "Age", "City"],
    ["Alice", 25, "New York"],
    ["Bob", 30, "Los Angeles"]
]

with open("data.csv", "w", newline='') as file:
    writer = csv.writer(file)
    writer.writerows(data)

# Reading CSV
with open("data.csv", "r") as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# ============================================================================
# SECTION 13: EXCEPTION HANDLING
# ============================================================================

# Basic try-except
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")

# Multiple except blocks
try:
    number = int("abc")
except ValueError:
    print("Invalid number format!")
except TypeError:
    print("Type error occurred!")

# Catch multiple exceptions
try:
    # Some code
    pass
except (ValueError, TypeError) as e:
    print(f"Error: {e}")

# else clause - executes if no exception
try:
    result = 10 / 2
except ZeroDivisionError:
    print("Error!")
else:
    print("Success! Result:", result)

# finally clause - always executes
try:
    file = open("file.txt", "r")
    # Do something
except FileNotFoundError:
    print("File not found!")
finally:
    print("This always executes")

# Raising exceptions
def validate_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative!")
    if age > 150:
        raise ValueError("Age seems unrealistic!")
    return True

# Custom exceptions
class CustomError(Exception):
    """Custom exception class"""
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

def check_positive(number):
    if number < 0:
        raise CustomError("Number must be positive!")

# ============================================================================
# SECTION 14: OBJECT-ORIENTED PROGRAMMING - Classes
# ============================================================================

# Basic class definition
class Dog:
    """A simple class representing a dog"""
    
    # Class variable (shared by all instances)
    species = "Canis familiaris"
    
    # Constructor (initializer)
    def __init__(self, name, age):
        # Instance variables (unique to each instance)
        self.name = name
        self.age = age
    
    # Instance method
    def bark(self):
        return f"{self.name} says Woof!"
    
    # Method with parameters
    def have_birthday(self):
        self.age += 1
        return f"{self.name} is now {self.age} years old"
    
    # String representation
    def __str__(self):
        return f"{self.name} is {self.age} years old"

# Creating instances (objects)
dog1 = Dog("Buddy", 3)
dog2 = Dog("Max", 5)

print(dog1.bark())  # "Buddy says Woof!"
print(dog1)  # Uses __str__ method

# Inheritance - creating child classes
class GoldenRetriever(Dog):
    """Child class inheriting from Dog"""
    
    def __init__(self, name, age, color):
        super().__init__(name, age)  # Call parent constructor
        self.color = color
    
    # Override parent method
    def bark(self):
        return f"{self.name} says Woof Woof! (friendly golden bark)"
    
    # New method specific to GoldenRetriever
    def fetch(self):
        return f"{self.name} fetches the ball!"

golden = GoldenRetriever("Charlie", 2, "golden")
print(golden.bark())  # Uses overridden method
print(golden.fetch())  # Uses new method

# Multiple inheritance
class Swimmer:
    def swim(self):
        return "Swimming..."

class Flyer:
    def fly(self):
        return "Flying..."

class Duck(Swimmer, Flyer):
    def quack(self):
        return "Quack!"

duck = Duck()
print(duck.swim())  # From Swimmer
print(duck.fly())   # From Flyer
print(duck.quack()) # From Duck

# ============================================================================
# SECTION 15: OOP - Advanced Features
# ============================================================================

# Encapsulation - private and protected members
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner  # Public
        self._balance = balance  # Protected (convention: single underscore)
        self.__account_number = "123456"  # Private (name mangling: double underscore)
    
    # Getter method
    def get_balance(self):
        return self._balance
    
    # Setter method
    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            return True
        return False
    
    def withdraw(self, amount):
        if 0 < amount <= self._balance:
            self._balance -= amount
            return True
        return False

# Property decorator - pythonic way to use getters/setters
class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius
    
    @property
    def celsius(self):
        """Getter for celsius"""
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        """Setter for celsius with validation"""
        if value < -273.15:
            raise ValueError("Temperature below absolute zero!")
        self._celsius = value
    
    @property
    def fahrenheit(self):
        """Computed property"""
        return (self.celsius * 9/5) + 32

temp = Temperature(25)
print(temp.celsius)  # 25
print(temp.fahrenheit)  # 77.0
temp.celsius = 30  # Uses setter

# Class methods and static methods
class MathOperations:
    pi = 3.14159
    
    def __init__(self, value):
        self.value = value
    
    # Regular instance method (has access to self)
    def square(self):
        return self.value ** 2
    
    # Class method (has access to cls, not self)
    @classmethod
    def from_string(cls, string_value):
        """Alternative constructor"""
        return cls(int(string_value))
    
    # Static method (no access to self or cls)
    @staticmethod
    def add(a, b):
        """Utility function"""
        return a + b

obj = MathOperations(5)
obj2 = MathOperations.from_string("10")  # Using class method
result = MathOperations.add(3, 4)  # Using static method

# Magic/Dunder methods
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __str__(self):
        """String representation for print()"""
        return f"Vector({self.x}, {self.y})"
    
    def __repr__(self):
        """Official representation for debugging"""
        return f"Vector({self.x}, {self.y})"
    
    def __add__(self, other):
        """Override + operator"""
        return Vector(self.x + other.x, self.y + other.y)
    
    def __eq__(self, other):
        """Override == operator"""
        return self.x == other.x and self.y == other.y
    
    def __len__(self):
        """Override len()"""
        return int((self.x**2 + self.y**2)**0.5)
    
    def __getitem__(self, index):
        """Enable indexing"""
        if index == 0:
            return self.x
        elif index == 1:
            return self.y
        raise IndexError("Index out of range")

v1 = Vector(2, 3)
v2 = Vector(4, 5)
v3 = v1 + v2  # Uses __add__
print(v3)  # Uses __str__

# Abstract base classes
from abc import ABC, abstractmethod

class Shape(ABC):
    """Abstract base class"""
    
    @abstractmethod
    def area(self):
        """Must be implemented by child classes"""
        pass
    
    @abstractmethod
    def perimeter(self):
        """Must be implemented by child classes"""
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)

# ============================================================================
# SECTION 16: MODULES AND PACKAGES
# ============================================================================

# Importing modules
import math  # Import entire module
from datetime import datetime  # Import specific class/function
from random import randint, choice  # Import multiple items
import numpy as np  # Import with alias (if numpy is installed)

# Using imported modules
result = math.sqrt(16)  # 4.0
pi = math.pi  # 3.141592653589793
current_time = datetime.now()
random_number = randint(1, 100)

# Creating your own module
# Save this in a file called my_module.py:
"""
def greet(name):
    return f"Hello, {name}!"

def add(a, b):
    return a + b

PI = 3.14159
"""

# Then import it:
# from my_module import greet, add, PI

# dir() - see all attributes of a module
# print(dir(math))

# ============================================================================
# SECTION 17: ITERATORS AND GENERATORS
# ============================================================================

# Iterator protocol - __iter__() and __next__()
class Counter:
    def __init__(self, start, end):
        self.current = start
        self.end = end
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.current > self.end:
            raise StopIteration
        self.current += 1
        return self.current - 1

counter = Counter(1, 5)
for num in counter:
    print(num)  # 1, 2, 3, 4, 5

# Generator functions - use yield instead of return
def countdown(n):
    """Generator that counts down from n to 1"""
    while n > 0:
        yield n
        n -= 1

for num in countdown(5):
    print(num)  # 5, 4, 3, 2, 1

# Generator expressions - like list comprehensions but with ()
squares_gen = (x**2 for x in range(10))  # Generator object
squares_list = [x**2 for x in range(10)]  # List

# Generators are memory efficient
def fibonacci_generator():
    """Infinite Fibonacci sequence generator"""
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Use with next() or in a loop
fib = fibonacci_generator()
print(next(fib))  # 0
print(next(fib))  # 1
print(next(fib))  # 1

# Generator pipeline
def read_large_file(file_path):
    """Memory-efficient file reading"""
    with open(file_path, 'r') as file:
        for line in file:
            yield line.strip()

# ============================================================================
# SECTION 18: COMPREHENSIONS - Advanced
# ============================================================================

# List comprehension with conditions
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = [x for x in numbers if x % 2 == 0]
odd_squares = [x**2 for x in numbers if x % 2 != 0]

# List comprehension with if-else
labels = ["even" if x % 2 == 0 else "odd" for x in numbers]

# Nested list comprehension
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Dictionary comprehension
squares_dict = {x: x**2 for x in range(1, 6)}  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
swapped = {value: key for key, value in squares_dict.items()}  # Swap keys and values

# Dictionary comprehension with condition
even_squares = {x: x**2 for x in range(10) if x % 2 == 0}

# Set comprehension
unique_lengths = {len(word) for word in ["hello", "world", "python", "code"]}

# ============================================================================
# SECTION 19: FUNCTIONAL PROGRAMMING
# ============================================================================

# map() - apply function to all items
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
strings = list(map(str, numbers))  # Convert to strings

# Multiple iterables with map
numbers1 = [1, 2, 3]
numbers2 = [4, 5, 6]
sums = list(map(lambda x, y: x + y, numbers1, numbers2))  # [5, 7, 9]

# filter() - filter items based on condition
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = list(filter(lambda x: x % 2 == 0, numbers))  # [2, 4, 6, 8, 10]
greater_than_5 = list(filter(lambda x: x > 5, numbers))

# reduce() - reduce sequence to single value
from functools import reduce
numbers = [1, 2, 3, 4, 5]
sum_all = reduce(lambda x, y: x + y, numbers)  # 15
product = reduce(lambda x, y: x * y, numbers)  # 120

# zip() - combine multiple iterables
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]
cities = ["New York", "LA", "Chicago"]
combined = list(zip(names, ages, cities))  # [('Alice', 25, 'New York'), ...]

# Unzip using zip with *
pairs = [(1, 'a'), (2, 'b'), (3, 'c')]
numbers, letters = zip(*pairs)  # numbers = (1, 2, 3), letters = ('a', 'b', 'c')

# any() and all()
numbers = [2, 4, 6, 8]
has_even = any(x % 2 == 0 for x in numbers)  # True
all_even = all(x % 2 == 0 for x in numbers)  # True

# sorted() with key function
students = [
    {"name": "Alice", "grade": 85},
    {"name": "Bob", "grade": 92},
    {"name": "Charlie", "grade": 78}
]
sorted_students = sorted(students, key=lambda x: x["grade"], reverse=True)

# ============================================================================
# SECTION 20: ADVANCED TOPICS
# ============================================================================

# Context managers - manage resources
class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        """Called when entering with block"""
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Called when exiting with block"""
        if self.file:
            self.file.close()

# Using context manager
with FileManager("test.txt", "w") as f:
    f.write("Hello!")

# Decorators with functools
from functools import wraps

def timer_decorator(func):
    """Decorator that times function execution"""
    @wraps(func)  # Preserves original function metadata
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timer_decorator
def slow_function():
    import time
    time.sleep(1)
    return "Done"

# Type hints (Python 3.5+)
def greet_typed(name: str, age: int) -> str:
    return f"Hello {name}, you are {age} years old"

from typing import List, Dict, Tuple, Optional, Union

def process_numbers(numbers: List[int]) -> Dict[str, int]:
    return {
        "sum": sum(numbers),
        "count": len(numbers)
    }

def find_user(user_id: int) -> Optional[str]:
    """Returns username or None if not found"""
    users = {1: "Alice", 2: "Bob"}
    return users.get(user_id)

# Argparse - command-line argument parsing
import argparse

def setup_argparse():
    parser = argparse.ArgumentParser(description="Example script")
    parser.add_argument("name", help="Your name")
    parser.add_argument("-a", "--age", type=int, default=0, help="Your age")
    parser.add_argument("-v", "--verbose", action="store_true", help="Verbose output")
    return parser

# Regular expressions
import re

text = "My email is example@email.com and phone is 123-456-7890"
email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
phone_pattern = r'\d{3}-\d{3}-\d{4}'

email = re.search(email_pattern, text)  # Find first match
phones = re.findall(phone_pattern, text)  # Find all matches
replaced = re.sub(r'\d', 'X', text)  # Replace all digits with X

# Collections module - specialized data structures
from collections import Counter, defaultdict, namedtuple, deque

# Counter - count occurrences
words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
word_count = Counter(words)  # Counter({'apple': 3, 'banana': 2, 'cherry': 1})
most_common = word_count.most_common(2)  # [('apple', 3), ('banana', 2)]

# defaultdict - dictionary with default values
from collections import defaultdict
grades = defaultdict(list)  # Default value is empty list
grades["Alice"].append(90)  # No KeyError even though 'Alice' didn't exist

# namedtuple - tuple with named fields
Point = namedtuple('Point', ['x', 'y'])
p = Point(10, 20)
print(p.x, p.y)  # Access by name

# deque - double-ended queue
from collections import deque
queue = deque([1, 2, 3])
queue.append(4)  # Add to right
queue.appendleft(0)  # Add to left
queue.pop()  # Remove from right
queue.popleft()  # Remove from left

# Datetime module
from datetime import datetime, timedelta, date, time

now = datetime.now()  # Current date and time
today = date.today()  # Current date
current_time = datetime.now().time()  # Current time

# String formatting
formatted = now.strftime("%Y-%m-%d %H:%M:%S")  # Format to string
parsed = datetime.strptime("2026-01-25", "%Y-%m-%d")  # Parse from string

# Timedelta - time differences
tomorrow = now + timedelta(days=1)
week_ago = now - timedelta(weeks=1)
difference = tomorrow - now

# JSON handling
import json

# Python dict to JSON string
data = {"name": "Alice", "age": 25, "courses": ["Math", "Physics"]}
json_string = json.dumps(data, indent=2)  # Convert to JSON string

# JSON string to Python dict
parsed_data = json.loads(json_string)

# Write to JSON file
with open("data.json", "w") as f:
    json.dump(data, f, indent=2)

# Read from JSON file
with open("data.json", "r") as f:
    loaded_data = json.load(f)

# ============================================================================
# END OF PYTHON REVISION GUIDE
# ============================================================================

# Additional practice problems (commented out)
"""
PRACTICE EXERCISES:

1. Write a function to check if a string is a palindrome
2. Implement bubble sort algorithm
3. Create a class for a simple calculator
4. Write a decorator that caches function results
5. Implement binary search
6. Create a generator for prime numbers
7. Write a function to flatten nested lists
8. Implement a stack using a class
9. Create a function to find the longest word in a sentence
10. Write a program to count word frequency in a text file
"""

print("\n" + "="*70)
print("Python Revision Guide - Complete!")
print("This file covers Python from basics to advanced concepts.")
print("="*70)
