from utills.db_helpers import get_db_connection, close_db_connection

conn = get_db_connection()
if conn:
    print("✅ Database connection successful!")
    close_db_connection(conn, None)
else:
    print("❌ Connection failed.")
