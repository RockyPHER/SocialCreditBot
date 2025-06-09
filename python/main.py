from typing import Union, List
from fastapi import FastAPI
from pydantic import BaseModel
from controllers.lemmatize import lemmatize_text

app = FastAPI()

class LemmatizeRequest(BaseModel):
    text: Union[str, List[str]]

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.post("/lemmatize")
def lemmatize(request: LemmatizeRequest):
    return lemmatize_text(request.text)
