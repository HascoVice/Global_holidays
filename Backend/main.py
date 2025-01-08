from typing import Union

from fastapi import FastAPI
import uvicorn
from api.endpoints import holidays, passengers

app = FastAPI()

# Inclusion des routers
app.include_router(holidays.router)
app.include_router(passengers.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Travel API"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)