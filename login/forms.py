from django import forms
from django.contrib.auth.models import User


class RegisterForm(forms.Form):

    fullname = forms.CharField(
        max_length=100
    )

    email = forms.EmailField()

    password = forms.CharField(
        widget=forms.PasswordInput
    )

    confirm_password = forms.CharField(
        widget=forms.PasswordInput
    )

    def clean(self):

        cleaned_data = super().clean()

        email = cleaned_data.get("email")

        password = cleaned_data.get("password")

        confirm_password = cleaned_data.get("confirm_password")

        # Check if email already exists
        if User.objects.filter(email=email).exists():

            raise forms.ValidationError(
                "Email already registered."
            )

        # Password match
        if password != confirm_password:

            raise forms.ValidationError(
                "Passwords do not match."
            )

        return cleaned_data