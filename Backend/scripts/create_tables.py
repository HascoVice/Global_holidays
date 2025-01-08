import mysql.connector

db_config = {
    "host": "db",
    "user": "root",           
    "password": "password",  
    "database": "python_mysql" 
}

def create_tables():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS holidays (
                id INT AUTO_INCREMENT PRIMARY KEY,
                Country_name VARCHAR(100),
                Country_code VARCHAR(10),
                Date DATE NOT NULL,
                Travel_reason TEXT,
                Type_of_travel VARCHAR(100)
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS monthly_passengers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                Country_code VARCHAR(10),
                Year INT NOT NULL,
                Month INT NOT NULL,
                Total_passenger FLOAT,
                Domestic FLOAT,
                International FLOAT,
                Total_OS FLOAT
            )
        """)
        
        print("Tables créées avec succès!")
        
    except mysql.connector.Error as err:
        print(f"Erreur: {err}")
        
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()
            print("Connexion fermée")

if __name__ == "__main__":
    create_tables() 