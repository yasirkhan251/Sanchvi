# from django.test import TestCase

# Create your tests here.
import requests
import hashlib
import base64
import json

# PhonePe sandbox credentials
merchant_id = "M1IAOFE2DA7E"  # Sandbox Merchant ID
salt_key = "3198c311-52bf-4697-8d98-b1c1489a804a"  # Sandbox Salt Key (from PhonePe sandbox dashboard)
salt_index = "1"  # Salt index for sandbox (usually 1)
payment_url = "https://api.phonepe.com/apis/hermes/pg/v1/pay"  # Sandbox API URL

# Example payload
payload = {
    "merchantId": merchant_id,
    "merchantTransactionId": "MT9w",  # Unique transaction ID
    "merchantUserId": "U1234567890",  # Unique user ID (e.g., your user’s ID)
    "amount": 2,  # Amount in paise (100.00 INR)
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
endpoint = "/pg/v1/pay"
combined_string = base64_request + endpoint + salt_key
x_verify = hashlib.sha256(combined_string.encode()).hexdigest() + "###" + salt_index

# Prepare headers
headers = {
    "Content-Type": "application/json",
    "X-VERIFY": x_verify
}

# Send request to PhonePe API (sandbox)
response = requests.post(payment_url, headers=headers, json={"request": base64_request})

# Log and print the response
print("Status Code:", response.status_code)
print("Response Text:", response.text)
