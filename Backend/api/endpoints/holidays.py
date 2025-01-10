from fastapi import APIRouter, HTTPException, Query
from typing import List
from ..data_manager import data_manager

router = APIRouter()

@router.get("/holidays/", response_model=List[dict])
def get_holidays(skip: int = Query(0, ge=0), limit: int = Query(100, gt=0)):
    """
    Retrieve a paginated list of holidays.
    """
    if data_manager.holidays_df is None:
        raise HTTPException(status_code=500, detail="Data not initialized")

    # Slice the DataFrame based on skip and limit
    holidays = data_manager.holidays_df.iloc[skip: skip + limit]
    if holidays.empty:
        raise HTTPException(status_code=404, detail="No data found")
    return holidays.to_dict('records')

@router.get("/holidays/{country_code}", response_model=List[dict])
def get_holidays_by_country(country_code: str, skip: int = Query(0, ge=0), limit: int = Query(100, gt=0)):
    """
    Retrieve a paginated list of holidays for a specific country.
    """
    if data_manager.holidays_df is None:
        raise HTTPException(status_code=500, detail="Data not initialized")

    # Filter by country code
    country_holidays = data_manager.holidays_df[data_manager.holidays_df['Country_code'] == country_code]
    if country_holidays.empty:
        raise HTTPException(status_code=404, detail="Country not found")

    # Apply pagination
    paginated_holidays = country_holidays.iloc[skip: skip + limit]
    return paginated_holidays.to_dict('records')
