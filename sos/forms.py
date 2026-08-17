from django import forms
from .models import SOSAlert


class SOSAlertForm(forms.ModelForm):

    class Meta:

        model = SOSAlert

        fields = [
            "emergency_type",
            "location",
            "latitude",
            "longitude",
            "message",
            "photo",
            "video",
            "audio",
        ]

        widgets = {

            "emergency_type": forms.Select(),

            "location": forms.TextInput(
                attrs={
                    "readonly": "readonly"
                }
            ),

            "latitude": forms.HiddenInput(),

            "longitude": forms.HiddenInput(),

            "message": forms.Textarea(
                attrs={
                    "rows": 4,
                    "placeholder": "Describe your emergency..."
                }
            ),

            "photo": forms.ClearableFileInput(
                attrs={
                    "accept": "image/*"
                }
            ),

            "video": forms.ClearableFileInput(
                attrs={
                    "accept": "video/*"
                }
            ),

            "audio": forms.ClearableFileInput(
                attrs={
                    "accept": "audio/*"
                }
            ),
        }