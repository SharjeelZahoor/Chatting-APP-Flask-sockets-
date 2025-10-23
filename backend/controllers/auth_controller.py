from flask import request, jsonify
from models.user_model import UserModel
from utills.jwt_helpers import encode_jwt
from werkzeug.security import generate_password_hash, check_password_hash

class AuthController:

    @staticmethod
    def register():
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({'message': 'All fields are required'}), 400

        existing_user = UserModel.find_by_email(email)
        if existing_user:
            return jsonify({'message': 'Email already exists'}), 400

        password_hash = generate_password_hash(password)
        success = UserModel.create_user(username, email, password_hash)

        if success:
            return jsonify({'message': 'User registered successfully'}), 201
        else:
            return jsonify({'message': 'Registration failed'}), 500


    @staticmethod
    def login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'Email and password required'}), 400

        user = UserModel.find_by_email(email)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        if not check_password_hash(user['password'], password):
            return jsonify({'message': 'Invalid credentials'}), 401

        # Encode JWT (role optional for now)
        token = encode_jwt(user['id'], 'user')

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email']
            }
        }), 200
