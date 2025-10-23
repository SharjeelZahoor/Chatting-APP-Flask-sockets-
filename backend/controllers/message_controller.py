from flask import request, jsonify
from models.message_model import MessageModel
from utills.jwt_helpers import decode_jwt

class MessageController:

    @staticmethod
    def get_messages():
        # Read JWT from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'message': 'Authorization header missing'}), 401

        token = auth_header.split(" ")[1] if " " in auth_header else auth_header
        payload = decode_jwt(token)
        if not payload:
            return jsonify({'message': 'Invalid token'}), 401

        sender_id = payload['sub']  # Current logged-in user
        receiver_id = request.args.get('receiver_id')

        if not receiver_id:
            return jsonify({'message': 'receiver_id is required'}), 400

        messages = MessageModel.get_chat_history(sender_id, receiver_id)
        return jsonify({'messages': messages}), 200
