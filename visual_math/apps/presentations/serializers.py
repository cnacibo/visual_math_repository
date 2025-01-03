from rest_framework import serializers
from .models import Presentation, Slide

class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide
        fields = ['id', 'content', 'order', 'presentation']

class PresentationSerializer(serializers.ModelSerializer):
    slides = SlideSerializer(many=True, read_only=True)

    class Meta:
        model = Presentation
        fields = ['id', 'title', 'user', 'slides']
