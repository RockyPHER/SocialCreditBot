from typing import Union
from fastapi import FastAPI
from controllers.lemmatize import lemmatize_text


app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/lemmatize")
def lemmatize(item: Union[str, list[str]]):
    return lemmatize_text(item)