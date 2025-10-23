# controllers/user_controller.py
from flask import jsonify, request
from models.user_model import UserModel

class UserController:

    @staticmethod
    def get_all_users():
        users = UserModel.get_all_users()
        current_user_id = int(request.user_id)

        # Convert DB results into consistent format for frontend
        formatted_users = []
        for u in users:
            formatted_users.append({
                'id': u['id'],
                'username': u['username'],
                'status': u['status']
            })

        # Remove current user
        formatted_users = [u for u in formatted_users if u['id'] != current_user_id]

        return jsonify({'users': formatted_users}), 200