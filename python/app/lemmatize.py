import spacy

nlp = spacy.load("pt_core_news_sm")

def lemmatize_text(text: str):
    doc = nlp(text)
    return [token.lemma_ for token in doc if not token.is_punct and not token.is_space]
