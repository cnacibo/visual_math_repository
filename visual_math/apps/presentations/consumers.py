import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PresentationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.presentation_id = self.scope["url_route"]["kwargs"]["presentation_id"]
        self.room_group_name = f"presentation_{self.presentation_id}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")

        if action == "change_slide":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "slide_update",
                    "slide": data["slide"]
                }
            )
        elif action == "end_presentation":
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "end_presentation"}
            )

    async def slide_update(self, event):
        await self.send(text_data=json.dumps({"action": "change_slide", "slide": event["slide"]}))

    async def end_presentation(self, event):
        await self.send(text_data=json.dumps({"action": "end_presentation"}))
