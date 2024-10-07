# from django.test import TestCase

# Create your tests here.
import random
import string

def generate_unique_alphanumeric(length):
    """Generate a unique and random alphanumeric string of specified length."""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

# Example usage
unique_alphanumeric = generate_unique_alphanumeric(134442351)
print(unique_alphanumeric)
