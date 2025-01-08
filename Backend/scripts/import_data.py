import mysql.connector
import pandas as pd

db_config = {
    "host": "db",
    "user": "root",
    "password": "password",
    "database": "python_mysql"
}

def import_data():
    try:
        # Lire les CSV
        holidays_df = pd.read_csv('/app/data/processed/clean_global_holidays.csv')
        passengers_df = pd.read_csv('/app/data/processed/clean_monthly_passengers.csv')
        
        # Connexion à la base de données
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Vider les tables avant l'import
        cursor.execute("TRUNCATE TABLE holidays")
        cursor.execute("TRUNCATE TABLE monthly_passengers")
        
        # Importer holidays
        for _, row in holidays_df.iterrows():
            sql = """INSERT INTO holidays 
                    (Country_name, Country_code, Date, Travel_reason, Type_of_travel)
                    VALUES (%s, %s, %s, %s, %s)"""
            values = (row['Country_name'], row['Country_code'], row['Date'],
                     row['Travel_reason'], row['Type_of_travel'])
            cursor.execute(sql, values)
            
        # Importer monthly_passengers
        for _, row in passengers_df.iterrows():
            sql = """INSERT INTO monthly_passengers 
                    (Country_code, Year, Month, Total_passenger, 
                     Domestic, International, Total_OS)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)"""
            values = (row['Country_code'], row['Year'], row['Month'],
                     row['Total_passenger'], row['Domestic'],
                     row['International'], row['Total_OS'])
            cursor.execute(sql, values)
            
        conn.commit()
        print("Données importées avec succès!")
        
    except mysql.connector.Error as err:
        print(f"Erreur: {err}")
        
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()
            print("Connexion fermée")

if __name__ == "__main__":
    import_data() 