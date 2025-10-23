from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.message_routes import message_bp
from flask_socketio import SocketIO, emit
from flask import request
from models.user_model import UserModel
from utills.jwt_helpers import encode_jwt, decode_jwt

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(message_bp, url_prefix='/api')


@app.route('/')
def home():
    return "Chat App Backend Running!"

# Dictionary to track connected users: user_id -> session_id
connected_users = {}

from utills.status_helpers import connected_users, set_user_online, set_user_offline

@socketio.on('connect')
def handle_connect():
    token = request.args.get('token')
    payload = decode_jwt(token)
    if payload:
        user_id = payload['sub']
        connected_users[user_id] = request.sid
        set_user_online(user_id)
        socketio.emit('user_status_update', {'user_id': user_id, 'status': 'online'})
        print(f"✅ User {user_id} connected (SID: {request.sid})")
    else:
        return False

@socketio.on('disconnect')
def handle_disconnect():
    sid_to_remove = None
    for user_id, socket_id in connected_users.items():
        if socket_id == request.sid:
            sid_to_remove = user_id
            break
    if sid_to_remove:
        set_user_offline(sid_to_remove)
        socketio.emit('user_status_update', {'user_id': sid_to_remove, 'status': 'offline'})




@socketio.on('send_message')
def handle_send_message(data):
    sender_id = str(data['sender_id'])
    receiver_id = str(data['receiver_id'])
    message = data['message']

    from models.message_model import MessageModel
    saved = MessageModel.save_message(sender_id, receiver_id, message)

    if not saved:
        print("❌ Message not saved to DB.")
        return

    print(f"💬 Message from {sender_id} to {receiver_id}: {message}")

    # Prepare payload
    payload = {
        'sender_id': sender_id,
        'receiver_id': receiver_id,
        'message': message
    }

    # Emit to receiver (if online)
    receiver_sid = connected_users.get(receiver_id)
    if receiver_sid:
        emit('receive_message', payload, to=receiver_sid)

    # Emit to sender (so it also shows in sender’s chat)
    sender_sid = connected_users.get(sender_id)
    if sender_sid:
        emit('receive_message', payload, to=sender_sid)

if __name__ == '__main__':
    socketio.run(app, debug=True)

