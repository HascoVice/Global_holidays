import pandas as pd
import logging
import os
from pathlib import Path
import sys
sys.path.append('/app')
from scripts.data_cleaning import clean_data

# Configuration des logs avec plus de détails
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DataManager:
    _instance = None
    holidays_df = None
    passengers_df = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def initialize_data(self):
        try:
            logger.info("Début de l'initialisation des données")
            
            processed_dir = '/app/data/processed'
            holidays_path = f'{processed_dir}/clean_global_holidays.csv'
            passengers_path = f'{processed_dir}/clean_monthly_passengers.csv'
            
            clean_data()
            
            self.holidays_df = pd.read_csv(holidays_path)
            self.passengers_df = pd.read_csv(passengers_path)
            
            logger.info(f"Holidays DataFrame chargé : {len(self.holidays_df)} lignes")
            logger.info(f"Passengers DataFrame chargé : {len(self.passengers_df)} lignes")
            
        except Exception as e:
            logger.error(f"Erreur lors de l'initialisation des données : {str(e)}")
            raise

data_manager = DataManager.get_instance() 