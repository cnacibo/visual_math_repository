from django import forms
from .models import Presentation, Slide

class PresentationForm(forms.ModelForm):
    class Meta:
        model = Presentation
        fields = ['title']

class SlideForm(forms.ModelForm):
    class Meta:
        model = Slide
        fields = ['content', 'order']


class CreatePresentationForm(forms.ModelForm):
    class Meta:
        model = Presentation
        fields = ['title', 'subject']
        widgets = {
            'title': forms.TextInput(attrs={'placeholder': 'Название лекции:', 'class': 'form-control'}),
            'subject': forms.Select(attrs={'class': 'form-control'}),
        }

