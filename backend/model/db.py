import sqlite3
from flask import request
import datetime


def get_db_connection():
    connection = sqlite3.connect('./db-presentation.sqlite3')
    connection.row_factory = sqlite3.Row
    return connection


def log_event(user_id, event_type, description):
    conn = get_db_connection()
    ip_address = request.remote_addr
    timestamp = datetime.datetime.now()

    conn.execute("""
        INSERT INTO AuditLogs (user_id, event_type, description, ip_address, timestamp)
        VALUES (?, ?, ?, ?, ?)
    """, (user_id, event_type, description, ip_address, timestamp))

    conn.commit()
    conn.close()
