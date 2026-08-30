from pathlib import Path
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

PROJECT_ROOT = Path(__file__).resolve().parents[1]
VECTOR_DB_PATH = PROJECT_ROOT / "rag" / "chroma_db"

# Same embedding model used during ingestion
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Load existing vector database
db = Chroma(
    persist_directory=str(VECTOR_DB_PATH),
    embedding_function=embeddings
)

def retrieve_context(query: str, k: int = 3):
    """
    Search the knowledge base and return the top-k relevant chunks.
    """
    results = db.similarity_search(query, k=k)

    context = []

    for doc in results:
        context.append({
            "source": doc.metadata.get("source", "Unknown"),
            "content": doc.page_content
        })

    return context


if __name__ == "__main__":
    question = "Where is authentication implemented?"

    docs = retrieve_context(question)

    print("\nTop Retrieved Context:\n")

    for i, doc in enumerate(docs, start=1):
        print(f"Result {i}")
        print("Source:", doc["source"])
        print(doc["content"][:250], "...\n")