FROM python:3.13.1-alpine

WORKDIR /app

COPY Backend/requirements/requirements.txt /requirements/requirements.txt

COPY --chown=yakumo:yakumo . .

RUN apk update

RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r /requirements/requirements.txt
RUN pip freeze > /requirements/requirements.txt

RUN pip install "fastapi[standard]"

COPY Backend .


CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]