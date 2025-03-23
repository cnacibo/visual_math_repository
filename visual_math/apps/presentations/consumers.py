import json
from channels.generic.websocket import AsyncWebsocketConsumer
from apps.presentations.models import Presentation
from django.core.cache import cache


class PresentationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.presentation_id = self.scope["url_route"]["kwargs"]["presentation_id"]
            self.room_group_name = f"presentation_{self.presentation_id}"

            # Получаем или создаем состояние презентации в кеше
            cache_key = f"presentation_{self.presentation_id}"
            presentation_state = cache.get(cache_key, {
                'is_active': False,
                'current_slide': 0,
                'slides': []
            })

            # Для преподавателя: активируем презентацию и загружаем слайды
            if self.scope["user"].role == 'teacher':
                presentation = await Presentation.objects.aget(id=self.presentation_id)
                presentation_state.update({
                    'is_active': True,
                    'slides': await self.get_slides_data(presentation),
                    'current_slide': presentation_state['current_slide']
                })

            cache.set(cache_key, presentation_state, 3600)

            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()

            # Отправляем начальное состояние
            await self.send(json.dumps({
                'type': 'init',
                'current_slide': presentation_state['current_slide'],
                'slides': presentation_state['slides']
            }))

        except Exception as e:
            print(f"Connection error: {str(e)}")
            await self.close()

    async def get_slides_data(self, presentation):
        return [
            {
                'slide_type': slide.slide_type,
                'content': slide.content,
                'image': slide.image.url if slide.image else '',
                'questions': slide.questions
            }
            async for slide in presentation.slides.all()
        ]

    async def disconnect(self, close_code):
        cache_key = f"presentation_{self.presentation_id}"
        presentation_state = cache.get(cache_key)

        if presentation_state and self.scope["user"].role == 'teacher':
            presentation_state['is_active'] = False
            cache.set(cache_key, presentation_state, 3600)

        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            # data = json.loads(text_data)
            # cache_key = f"presentation_{self.presentation_id}"
            # presentation_state = cache.get(cache_key)
            #
            # if data.get('action') == 'change_slide':
            #     # new_slide = data['slide']
            #     new_slide = int(data('slide'))  # get absolute index of slide
            #     total_slides = len(presentation_state['slides'])
            #     new_slide = max(0, min(new_slide, total_slides - 1))
            #     presentation_state['current_slide'] = new_slide
            #     cache.set(cache_key, presentation_state, 3600)
            #
            #     # if 0 <= new_slide < len(presentation_state['slides']):
            #     #     presentation_state['current_slide'] = new_slide
            #     #     cache.set(cache_key, presentation_state, 3600)
            #
            #     await self.channel_layer.group_send(
            #         self.room_group_name,
            #         {
            #             'type': 'broadcast.message',
            #             'data': {
            #                 'action': 'slide_changed',
            #                 'slide': new_slide,
            #                 'total_slides': total_slides
            #                 # 'slides': presentation_state['slides']
            #             }
            #         }
            #     )
            data = json.loads(text_data)
            cache_key = f"presentation_{self.presentation_id}"
            presentation_state = cache.get(cache_key)

            if data.get('action') == 'change_slide':
                # Исправлено: data['slide'] вместо data('slide')
                new_slide = int(data['slide'])
                total_slides = len(presentation_state['slides'])

                new_slide = max(0, min(new_slide, total_slides - 1))
                presentation_state['current_slide'] = new_slide
                cache.set(cache_key, presentation_state, 3600)

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'broadcast.message',
                        'data': {
                            'action': 'slide_changed',
                            'current_slide': new_slide,
                            'total_slides': total_slides,
                            'slides': presentation_state['slides']  # Добавляем слайды в сообщение
                        }
                    }
                )

        except Exception as e:
            print(f"Receive error: {str(e)}")

    async def broadcast_message(self, event):
        await self.send(text_data=json.dumps(event['data']))