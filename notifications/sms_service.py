import requests
import os


def send_sms(phone_number, message):
    """
    Send SMS to one or multiple phone numbers.

    If phone_number is provided, it will be used.
    Otherwise, numbers from SAFETY_AUTHORITY_PHONES in .env
    will be used.
    """

    url = os.getenv("AAKASH_SMS_URL")
    auth_token = os.getenv("AAKASH_SMS_AUTH_TOKEN")

    # If no specific phone number is provided,
    # get all safety authority numbers from .env
    if not phone_number:
        phone_numbers = os.getenv("SAFETY_AUTHORITY_PHONES", "")

        recipients = [
            number.strip()
            for number in phone_numbers.split(",")
            if number.strip()
        ]
    else:
        recipients = [phone_number]

    if not recipients:
        print("No recipient phone numbers configured.")
        return None

    responses = []

    # Send SMS to every recipient
    for recipient in recipients:

        data = {
            "auth_token": auth_token,
            "to": recipient,
            "text": message,
        }

        try:
            response = requests.post(
                url,
                data=data,
                timeout=10
            )

            print(f"SMS to {recipient}")
            print("SMS status:", response.status_code)
            print("SMS response:", response.text)

            responses.append(response)

        except requests.RequestException as e:

            print(f"SMS sending failed for {recipient}:", e)

            responses.append(None)

    return responses