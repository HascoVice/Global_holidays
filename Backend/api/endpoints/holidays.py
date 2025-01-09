from fastapi import APIRouter, HTTPException
from typing import List
from ..data_manager import data_manager

router = APIRouter()

@router.get("/holidays/", response_model=List[dict])
def get_all_holidays():
    if data_manager.holidays_df is None:
        raise HTTPException(status_code=500, detail="Data not initialized")
    return data_manager.holidays_df.to_dict('records')

@router.get("/holidays/{country_code}")
def get_holidays_by_country(country_code: str):
    if data_manager.holidays_df is None:
        raise HTTPException(status_code=500, detail="Data not initialized")
    country_holidays = data_manager.holidays_df[data_manager.holidays_df['Country_code'] == country_code]
    if country_holidays.empty:
        raise HTTPException(status_code=404, detail="Country not found")
    return country_holidays.to_dict('records')

