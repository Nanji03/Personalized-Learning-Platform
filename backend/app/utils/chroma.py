import chromadb

# Create a persistent client (database will be saved in ./chroma_db)
client = chromadb.PersistentClient(path="./chroma_db")

def get_collection(collection_name="default"):
    # Returns a Chroma collection to store and query vectors
    return client.get_or_create_collection(collection_name)