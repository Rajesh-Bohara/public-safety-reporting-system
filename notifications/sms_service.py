import requests
import os


def send_sms(phone_number, message):

    url = os.getenv("AAKASH_SMS_URL")
    auth_token = os.getenv("AAKASH_SMS_AUTH_TOKEN")

    data = {
        "auth_token": auth_token,
        "to": phone_number,
        "text": message,
    }

    try:
        response = requests.post(
            url,
            data=data,
            timeout=10
        )

        print("SMS status:", response.status_code)
        print("SMS response:", response.text)

        return response

    except requests.RequestException as e:

        print("SMS sending failed:", e)

        return None