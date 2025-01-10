from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from api.endpoints import holidays, passengers
from api.data_manager import data_manager

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add the frontend URL here
    allow_credentials=True,  # Allow cookies and authentication headers
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all request headers
)

# Initialize data
data_manager.initialize_data()

# Include routers
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
