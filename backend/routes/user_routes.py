from flask import Blueprint
from controllers.user_controller import UserController
from utills.jwt_helpers import login_required

user_bp = Blueprint('user_bp', __name__)

user_bp.route('/users', methods=['GET'])(login_required()(UserController.get_all_users))
