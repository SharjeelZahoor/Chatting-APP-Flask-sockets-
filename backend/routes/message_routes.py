from flask import Blueprint
from controllers.message_controller import MessageController
from utills.jwt_helpers import login_required

message_bp = Blueprint('message_bp', __name__)

message_bp.route('/messages', methods=['GET'])(login_required()(MessageController.get_messages))
