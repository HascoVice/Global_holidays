import pandas as pd

global_holidays = pd.read_csv('/app/data/raw/global_holidays.csv')
monthly_passengers = pd.read_csv('/app/data/raw/monthly_passengers.csv')


print(global_holidays.info())
print(global_holidays.head())

print(global_holidays.isnull().sum())

global_holidays['Date'] = pd.to_datetime(global_holidays['Date'], errors='coerce')

print(global_holidays.duplicated().sum())

global_holidays = global_holidays.drop_duplicates()

print(global_holidays['Type'].unique())

global_holidays['Type'] = global_holidays['Type'].str.strip().str.lower()


print(monthly_passengers.info())

print(monthly_passengers.head())

print(monthly_passengers.isnull().sum())

monthly_passengers['Total'] = monthly_passengers['Total'].fillna(monthly_passengers['Total'].median())

monthly_passengers['Domestic'] = monthly_passengers['Domestic'].fillna(0)
monthly_passengers['International'] = monthly_passengers['International'].fillna(0)

print(monthly_passengers.duplicated().sum())

monthly_passengers = monthly_passengers.drop_duplicates()

monthly_passengers['Year'] = monthly_passengers['Year'].astype(int)
monthly_passengers['Month'] = monthly_passengers['Month'].astype(int)


global_holidays.to_csv('data/processed/clean_global_holidays.csv', index=False)
monthly_passengers.to_csv('data/processed/clean_monthly_passengers.csv', index=False)