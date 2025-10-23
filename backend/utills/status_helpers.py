from models.user_model import UserModel

connected_users = {}

def set_user_online(user_id):
    UserModel.update_status(user_id, 'online')
    connected_users[user_id] = None 

def set_user_offline(user_id):
    UserModel.update_status(user_id, 'offline')
    if user_id in connected_users:
        del connected_users[user_id]
