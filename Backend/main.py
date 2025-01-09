from typing import Union

from fastapi import FastAPI
import uvicorn
from api.endpoints import holidays, passengers
from api.data_manager import data_manager

app = FastAPI()

# Initialisation immédiate des données
data_manager.initialize_data()

# Inclusion des routers
app.include_router(holidays.router)
app.include_router(passengers.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Travel API"}

@app.get("/debug/data-info")
def get_data_info():
    return {
        "holidays_data": {
            "rows": len(data_manager.holidays_df) if data_manager.holidays_df is not None else 0,
            "columns": list(data_manager.holidays_df.columns) if data_manager.holidays_df is not None else [],
            "sample": data_manager.holidays_df.head(2).to_dict('records') if data_manager.holidays_df is not None else []
        },
        "passengers_data": {
            "rows": len(data_manager.passengers_df) if data_manager.passengers_df is not None else 0,
            "columns": list(data_manager.passengers_df.columns) if data_manager.passengers_df is not None else [],
            "sample": data_manager.passengers_df.head(2).to_dict('records') if data_manager.passengers_df is not None else []
        }
    }

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)