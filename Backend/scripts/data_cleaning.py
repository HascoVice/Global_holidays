import pandas as pd
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def clean_data():
    try:
        # Création du dossier processed s'il n'existe pas
        os.makedirs('/app/data/processed', exist_ok=True)
        
        # Lecture des données brutes
        global_holidays = pd.read_csv('/app/data/raw/global_holidays.csv')
        monthly_passengers = pd.read_csv('/app/data/raw/monthly_passengers.csv')
        
        # Renommage des colonnes pour holidays
        global_holidays = global_holidays.rename(columns={
            'ADM_name': 'country_name',
            'ISO3': 'country_code',
            'Date': 'date',
            'Name': 'travel_reason',
            'Type': 'type_of_travel'
        })
        
        # Renommage des colonnes pour passengers
        monthly_passengers = monthly_passengers.rename(columns={
            'ISO3': 'country_code',
            'Year': 'year',
            'Month': 'month',
            'Total': 'total_passenger',
            'Domestic': 'domestic',
            'International': 'international',
            'Total_OS': 'total_OS'
        })
        
        # Nettoyage des données holidays
        global_holidays['date'] = pd.to_datetime(global_holidays['date'], errors='coerce')
        global_holidays = global_holidays.drop_duplicates()
        global_holidays['type_of_travel'] = global_holidays['type_of_travel'].str.strip().str.lower()
        
        # Nettoyage des données passengers
        monthly_passengers['total_passenger'] = monthly_passengers.groupby('country_code')['total_passenger'].transform(lambda x: x.fillna(x.median())
)
        monthly_passengers['domestic'] = monthly_passengers['domestic'].fillna(0)
        monthly_passengers['international'] = monthly_passengers['international'].fillna(0)
        monthly_passengers = monthly_passengers.drop_duplicates()
        monthly_passengers['year'] = monthly_passengers['year'].astype(int)
        monthly_passengers['month'] = monthly_passengers['month'].astype(int)
        
        # Sauvegarde des données nettoyées
        global_holidays.to_csv('/app/data/processed/clean_global_holidays.csv', index=False)
        monthly_passengers.to_csv('/app/data/processed/clean_monthly_passengers.csv', index=False)
        
        logger.info("Données nettoyées et sauvegardées avec succès")
        
    except FileNotFoundError as e:
        logger.error(f"Fichier non trouvé: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Erreur lors du nettoyage des données: {str(e)}")
        raise