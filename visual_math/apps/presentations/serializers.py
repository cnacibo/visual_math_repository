from rest_framework import serializers
from .models import Presentation, Slide

class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide
        fields = '__all__'

class PresentationSerializer(serializers.ModelSerializer):
    slides = SlideSerializer(many=True)

    class Meta:
        model = Presentation
        fields = '__all__'

    def create(self, validated_data):
        slides_data = validated_data.pop('slides', [])
        presentation = Presentation.objects.create(**validated_data)
        for slide_data in slides_data:
            Slide.objects.create(presentation=presentation, **slide_data)
        return presentation

    def update(self, instance, validated_data):
        slides_data = validated_data.pop('slides', [])
        instance.title = validated_data.get('title', instance.title)
        instance.subject = validated_data.get('subject', instance.subject)
        instance.save()

        # Обновляем или создаем слайды
        instance.slides.all().delete()
        for slide_data in slides_data:
            Slide.objects.create(presentation=instance, **slide_data)

        return instance
