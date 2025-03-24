import json
from channels.generic.websocket import AsyncWebsocketConsumer
from apps.presentations.models import Presentation
from django.core.cache import cache
from channels.layers import get_channel_layer


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
                cache.set(f"teacher_channel_{self.presentation_id}", self.channel_name)

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
            print(f"Received data: {data}")
            # if 'action' not in data:
            #     print("Missing 'action' key in message")
            #     return
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

            if data.get('action') == 'update_questionnaire_stats':
                stats = data['stats']
                slide_index = data['slide_index']

                # Отправка статистики преподавателю
                await self.send_to_teacher(slide_index, stats)

            if data.get('action') == 'end_presentation':
                cache_key = f"presentation_{self.presentation_id}"
                presentation_state = cache.get(cache_key, {})

                # Обновляем состояние - презентация больше не активна
                presentation_state['is_active'] = False
                presentation_state['current_slide'] = 0  # Сбрасываем на первый слайд

                # Сохраняем обновленное состояние
                cache.set(cache_key, presentation_state, 3600)

                # Отправляем сообщение о завершении всем участникам
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'broadcast.message',
                        'data': {
                            'action': 'presentation_ended',
                            'message': 'Презентация завершена'
                        }
                    }
                )

                # Очищаем канал преподавателя (опционально)
                # cache.delete(f"teacher_channel_{self.presentation_id}")


        except Exception as e:
            print(f"Receive error: {str(e)}")


    async def broadcast_message(self, event):
        await self.send(text_data=json.dumps(event['data']))

    async def send_to_teacher(self, slide_index, stats):
        # Получаем канал преподавателя из кеша
        teacher_channel = cache.get(f"teacher_channel_{self.presentation_id}")

        data_to_send = {
            'type': 'update_questionnaire_stats',  # Этот тип должен быть обработан
            'data': {  # Add the 'data' key
                'action': 'update_questionnaire_stats',
                'slide_index': slide_index,
                'stats': stats
            }
        }

        print("Отправляемые данные:", data_to_send)

        if teacher_channel:
            # Отправляем данные на канал преподавателя
            await self.channel_layer.send(
                teacher_channel,
                data_to_send
            )

    async def update_questionnaire_stats(self, event):
        # Это обработчик для типа 'update_questionnaire_stats'
        await self.send(text_data=json.dumps(event['data']))
