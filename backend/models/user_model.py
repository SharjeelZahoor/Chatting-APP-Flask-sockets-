from utills.db_helpers import get_db_connection, close_db_connection
import hashlib

class UserModel:
    @staticmethod
    def create_user(username, email, password_hash):
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            query = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"
            cursor.execute(query, (username, email, password_hash))


            connection.commit()
            return True
        except Exception as e:
            print("Error creating user:", e)
            return False
        finally:
            close_db_connection(connection, cursor)

    @staticmethod
    def find_by_email(email):
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            return cursor.fetchone()
        finally:
            close_db_connection(connection, cursor)

    @staticmethod
    def find_by_id(user_id):
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            return cursor.fetchone()
        finally:
            close_db_connection(connection, cursor)

    @staticmethod
    def get_all_users():
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            cursor.execute("SELECT id, username, is_online FROM users")
            return cursor.fetchall()
        finally:
            close_db_connection(connection, cursor)
