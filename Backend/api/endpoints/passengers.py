from fastapi import APIRouter, HTTPException
from typing import List
from ..data_manager import data_manager

router = APIRouter()

@router.get("/passengers/", response_model=List[dict])
def get_all_passengers():
    if data_manager.passengers_df is None:
        raise HTTPException(status_code=500, detail="Data not initialized")
    return data_manager.passengers_df.to_dict('records')

@router.get("/passengers/{country_code}")
def get_passengers_by_country(country_code: str):
    if data_manager.passengers_df is None:
        raise HTTPException(status_code=500, detail="Data not initialized")
    country_passengers = data_manager.passengers_df[data_manager.passengers_df['Country_code'] == country_code]
    if country_passengers.empty:
        raise HTTPException(status_code=404, detail="Country not found")
    return country_passengers.to_dict('records')
