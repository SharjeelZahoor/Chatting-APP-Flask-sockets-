from flask import request, jsonify
from models.message_model import MessageModel

class MessageController:

    @staticmethod
    def get_messages():
        sender_id = request.user_id
        receiver_id = request.args.get('receiver_id')
        if not receiver_id:
            return jsonify({'message': 'receiver_id is required'}), 400
        messages = MessageModel.get_chat_history(sender_id, receiver_id)
        return jsonify({'messages': messages}), 200
