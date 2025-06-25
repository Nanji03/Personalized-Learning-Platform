import os
from dotenv import load_dotenv
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

load_dotenv()  # Loads the .env file

def get_chroma_vectorstore():
    embeddings = OpenAIEmbeddings()
    return Chroma(
        persist_directory="./chroma_db",
        embedding_function=embeddings
    )