from flask import jsonify, request
from models.user_model import UserModel

class UserController:

    @staticmethod
    def get_all_users():
        users = UserModel.get_all_users()
        current_user_id = int(request.user_id)

        # Remove current user from list (optional)
        users = [u for u in users if u['id'] != current_user_id]

        return jsonify({'users': users}), 200
