from rest_framework import serializers
from .models import Presentation, Slide

class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide
        fields = ['id', 'slide_type', 'content', 'image']

class PresentationSerializer(serializers.ModelSerializer):
    slides = SlideSerializer(many=True)

    class Meta:
        model = Presentation
        fields = ['id', 'title', 'subject', 'slides']
