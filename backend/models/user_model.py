from utills.db_helpers import get_db_connection, close_db_connection
import hashlib
class UserModel:
    @staticmethod
    def update_status(user_id, status):
        query = "UPDATE users SET status=%s WHERE id=%s"
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(query, (status, user_id))
        connection.commit()
        cursor.close()

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
            cursor.execute("SELECT id, username, status FROM users")
            return cursor.fetchall()
        finally:
            close_db_connection(connection, cursor)

            
    @staticmethod
    def update_status(user_id, status):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("UPDATE users SET status = %s WHERE id = %s", (status, user_id))
        conn.commit()
        cur.close()
        conn.close()

