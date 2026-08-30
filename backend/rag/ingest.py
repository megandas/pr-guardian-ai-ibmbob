from pathlib import Path

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

# -----------------------------
# Paths
# -----------------------------
PROJECT_ROOT = Path(__file__).resolve().parents[1]

VECTOR_DB_PATH = PROJECT_ROOT / "rag" / "chroma_db"

# Files we want IBM Bob to learn
SOURCE_FOLDERS = [
    PROJECT_ROOT / "agents",
    PROJECT_ROOT / "services",
    PROJECT_ROOT / "prompts",
]

README_FILE = PROJECT_ROOT.parent / "README.md"

# -----------------------------
# Read project files
# -----------------------------
documents = []

# Read README
if README_FILE.exists():
    content = README_FILE.read_text(encoding="utf-8", errors="ignore")
    documents.append(
        Document(
            page_content=content,
            metadata={"source": "README.md"}
        )
    )

# Read Python files
for folder in SOURCE_FOLDERS:
    if folder.exists():
        for file in folder.rglob("*.py"):
            content = file.read_text(encoding="utf-8", errors="ignore")

            documents.append(
                Document(
                    page_content=content,
                    metadata={"source": str(file.relative_to(PROJECT_ROOT))}
                )
            )

print(f"Loaded {len(documents)} documents.")

# -----------------------------
# Split into chunks
# -----------------------------
splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=150
)

chunks = splitter.split_documents(documents)

print(f"Created {len(chunks)} chunks.")

# -----------------------------
# Create embeddings
# -----------------------------
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# -----------------------------
# Save Chroma vector DB
# -----------------------------
db = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory=str(VECTOR_DB_PATH)
)

db.persist()

print("Knowledge base created successfully!")
print(f"Saved at: {VECTOR_DB_PATH}")