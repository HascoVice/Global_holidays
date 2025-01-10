from fastapi import APIRouter, HTTPException, Query
from typing import List
from ..data_manager import data_manager

router = APIRouter()

@router.get("/passengers/", response_model=List[dict])
def get_passengers(skip: int = Query(0, ge=0), limit: int = Query(100, gt=0)):
    """
    Retrieve a paginated list of passengers.
    """
    if data_manager.passengers_df is None:
        raise HTTPException(status_code=500, detail="Data not initialized")

    # Slice the DataFrame based on skip and limit
    passengers = data_manager.passengers_df.iloc[skip: skip + limit]
    if passengers.empty:
        raise HTTPException(status_code=404, detail="No data found")
    return passengers.to_dict('records')

@router.get("/passengers/{country_code}", response_model=List[dict])
def get_passengers_by_country(country_code: str, skip: int = Query(0, ge=0), limit: int = Query(100, gt=0)):
    """
    Retrieve a paginated list of passengers for a specific country.
    """
    if data_manager.passengers_df is None:
        raise HTTPException(status_code=500, detail="Data not initialized")

    # Filter by country code
    country_passengers = data_manager.passengers_df[data_manager.passengers_df['Country_code'] == country_code]
    if country_passengers.empty:
        raise HTTPException(status_code=404, detail="Country not found")

    # Apply pagination
    paginated_passengers = country_passengers.iloc[skip: skip + limit]
    return paginated_passengers.to_dict('records')
