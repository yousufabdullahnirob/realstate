from django.db import connection

class DatabaseConnection:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
            # Ensure connection is established
            if not connection.connection:
                connection.connect()
            cls._instance.connection = connection
        return cls._instance

    @property
    def get_connection(self):
        return self.connection
