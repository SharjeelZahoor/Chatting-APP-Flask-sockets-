import pymysql
from config import Config

def get_db_connection():
    """
    Create and return a new MySQL database connection using PyMySQL.
    """
    connection = pymysql.connect(
        host=Config.MYSQL_HOST,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB,
        cursorclass=pymysql.cursors.DictCursor
    )
    return connection
  
def close_db_connection(connection, cursor):
    if cursor:
        cursor.close()
    if connection:
        connection.close()