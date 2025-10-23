from utills.db_helpers import get_db_connection, close_db_connection

class MessageModel:
    @staticmethod
    def save_message(sender_id, receiver_id, message):
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            query = "INSERT INTO messages (sender_id, receiver_id, message) VALUES (%s, %s, %s)"
            cursor.execute(query, (sender_id, receiver_id, message))
            connection.commit()
            return True
        except Exception as e:
            print("Error saving message:", e)
            return False
        finally:
            close_db_connection(connection, cursor)



    @staticmethod
    def get_chat_history(sender_id, receiver_id):
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            query = """
                SELECT sender_id, receiver_id, message, timestamp
                FROM messages
                WHERE (sender_id = %s AND receiver_id = %s)
                   OR (sender_id = %s AND receiver_id = %s)
                ORDER BY timestamp ASC
            """
            cursor.execute(query, (sender_id, receiver_id, receiver_id, sender_id))
            return cursor.fetchall()
        finally:
            close_db_connection(connection, cursor)
