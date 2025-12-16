import os
from urllib.parse import urlparse
import psycopg2


def get_db_connection_params():
    database_url = os.environ.get('DATABASE_URL')
    if database_url:
        parsed = urlparse(database_url)
        return {
            'host': parsed.hostname or 'localhost',
            'port': parsed.port or 5432,
            'database': (parsed.path or '/').lstrip('/'),
            'user': parsed.username or 'postgres',
            'password': parsed.password,
        }
    return {
        'host': os.environ.get('DB_HOST', 'localhost'),
        'port': int(os.environ.get('DB_PORT', 5432)),
        'database': os.environ.get('DB_NAME', 'BlueMoon'),
        'user': os.environ.get('DB_USER', 'postgres'),
        'password': os.environ.get('DB_PASSWORD', '123456'),
    }

params = get_db_connection_params()
conn = psycopg2.connect(**params)
conn.autocommit = True
cur = conn.cursor()
try:
    print('Adding status column to invoices (if not exists)...')
    cur.execute("ALTER TABLE invoices ADD COLUMN IF NOT EXISTS status text DEFAULT 'unpaid';")
    print('Done.')
except Exception as e:
    print('Error:', e)
finally:
    cur.close()
    conn.close()
