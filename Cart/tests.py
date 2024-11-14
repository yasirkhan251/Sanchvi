# from django.test import TestCase

# Create your tests here.
import hashlib
import base64
import json

# PhonePe sandbox credentials
merchant_id = "M1IAOFE2DA7E"  # Your sandbox merchant ID
salt_key = "3198c311-52bf-4697-8d98-b1c1489a804a"  # Your sandbox salt key
salt_index = "1"  # Your salt index (usually 1)

# Example payload
payload = {
    "merchantId": merchant_id,
    "merchantTransactionId": "MT12345678920",  # Unique transaction ID
    "merchantUserId": "U1234567890",  # Unique user ID (e.g., your user’s ID)
    "amount": 10000,  # Amount in paise (100.00 INR)
    "redirectUrl": "https://yourwebsite.com/payment-success",
    "callbackUrl": "https://yourwebsite.com/phonepe/callback",
    "mobileNumber": "9999999999",
    "paymentInstrument": {
        "type": "PAY_PAGE"
    }
}

# Convert payload to base64
payload_json = json.dumps(payload)
base64_request = base64.b64encode(payload_json.encode()).decode()

# Generate the X-VERIFY header
endpoint = "/pg/v1/pay"  # Endpoint for initiating payment
combined_string = base64_request + endpoint + salt_key
x_verify = hashlib.sha256(combined_string.encode()).hexdigest() + "###" + salt_index

# Print the X-VERIFY header
print("X-VERIFY:", x_verify)
