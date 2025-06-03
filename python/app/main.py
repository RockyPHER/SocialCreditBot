from fastapi import FastAPI, Query
from app.lemmatizer import lemmatize_text

app = FastAPI()

@app.get("/lemmatize")
def lemmatize(q: str = Query(..., description="Texto a ser lematizado")):
    lemmas = lemmatize_text(q)
    return {"lemmas": lemmas}
