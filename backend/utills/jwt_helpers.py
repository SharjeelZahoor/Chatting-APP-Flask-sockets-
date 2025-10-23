import datetime
import jwt
from flask import request, jsonify
from functools import wraps
from config import Config


def encode_jwt(user_id, role):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
        'iat': datetime.datetime.utcnow(),
        'sub': str(user_id),
        'role': role
    }
    token = jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')
    return token

def decode_jwt(token):
    try:
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


# Decorator to protect routes
def login_required(role=None):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            token = request.headers.get('Authorization')

            if not token:
                return jsonify({'message': 'Token is missing'}), 401

            if token.startswith("Bearer "):
                token = token.split(" ")[1]

            payload = decode_jwt(token)
            if not payload:
                return jsonify({'message': 'Invalid or expired token'}), 401

            # Check role if needed
            if role and payload.get('role') != role:
                return jsonify({'message': 'Permission denied'}), 403

            request.user_id = payload['sub']
            request.user_role = payload['role']

            return f(*args, **kwargs)
        return wrapper
    return decorator
