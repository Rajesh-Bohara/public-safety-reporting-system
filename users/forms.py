from django import forms
from django.contrib.auth.models import User

from .models import Profile


class ProfileForm(forms.ModelForm):

    username = forms.CharField(
        max_length=150,
        required=True,
        label="Username"
    )

    class Meta:
        model = Profile
        fields = [
            "username",
            "mobile_number",
            "profile_photo",
        ]

    def __init__(self, *args, **kwargs):

        super().__init__(*args, **kwargs)

        if self.instance and self.instance.user:
            self.fields["username"].initial = (
                self.instance.user.username
            )

    def clean_username(self):

        username = self.cleaned_data["username"].strip()

        if not username:
            raise forms.ValidationError(
                "Username cannot be empty."
            )

        existing_user = User.objects.filter(
            username__iexact=username
        ).exclude(
            pk=self.instance.user.pk
        ).first()

        if existing_user:
            raise forms.ValidationError(
                "This username is already taken."
            )

        return username

    def save(self, commit=True):

        profile = super().save(commit=False)

        username = self.cleaned_data["username"]

        # Update Django User username
        profile.user.username = username

        if commit:
            profile.user.save()
            profile.save()

        return profile