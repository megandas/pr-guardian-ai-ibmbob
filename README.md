# 🤖 PR Guardian AI

> AI-powered Pull Request Review Assistant built with **IBM watsonx Granite**, **FastAPI**, and a **VS Code Extension**.

## 🚀 Project Summary

### The problem we are solving

Code reviews are often slow, inconsistent, and require developers to manually inspect security issues, repository architecture, and testing coverage.

### Our solution

PR Guardian AI brings IBM Bob directly into VS Code to analyze pull requests, explain repository architecture, replay AI reasoning, identify security issues, and answer repository-specific questions.

### Key Features

* 🔍 AI-powered Pull Request Review
* 🎬 Replay AI Review Workflow
* 🛡 Security & Vulnerability Detection
* 🧠 IBM Bob Multi-Agent Review
* 📊 PR Health Score Dashboard
* 🗺 Interactive Code Impact Map
* 💬 Repository-aware IBM Bob Chat
* 📄 PR Document Understanding

---

## 🏗 Solution Architecture

Frontend (VS Code Extension)
│
▼
Repository Intelligence Dashboard
│
▼
FastAPI Backend
│
┌──────┼────────┐
▼      ▼        ▼
Security  Replay AI  IBM Granite
Agent     Engine      (watsonx.ai)
│
▼
RAG + ChromaDB

---

## 🛠 IBM watsonx Technologies Used

### IBM watsonx.ai

Used for repository-aware pull request review and conversational AI through IBM Granite models.

### IBM Granite

Powers IBM Bob's reasoning engine for:

* Security review
* Performance review
* Testing recommendations
* Repository Q&A

### Other IBM Technologies

* IBM Granite 4 Small
* IBM watsonx.ai Runtime API

---

## 💻 Tech Stack

| Layer         | Technology                    |
| ------------- | ----------------------------- |
| Frontend      | VS Code Extension, TypeScript |
| Backend       | FastAPI, Python               |
| AI            | IBM Granite (watsonx.ai)      |
| Retrieval     | LangChain + ChromaDB          |
| Embeddings    | HuggingFace Embeddings        |
| Visualization | HTML, CSS, JavaScript         |

---

## ✨ Features

### Replay AI Review

Visualizes how IBM Bob analyzes repository changes step by step.

### Repository Intelligence Dashboard

Shows architecture layers, repository insights, and impacted modules.

### IBM Bob Multi-Agent Workflow

* Security Agent
* Performance Agent
* Testing Agent
* IBM Bob Aggregator

### Interactive Code Impact Map

Highlights relationships between frontend, backend, AI layer, parser, and APIs.

### PR Document Understanding

Analyzes pull request requirements and validates merge readiness.

---

## 📸 Screenshots

Add screenshots inside `/docs`.

* Dashboard
* Replay AI
* Code Impact Map
* PR Document Understanding

---

## ⚙ Running the Project

### Backend

```bash
cd backend
python -m venv venv
pip install -r requirements.txt
uvicorn app:app --reload
```

### VS Code Extension

```bash
cd extension/pr-guardian-ai
npm install
npm run compile
```

Press **F5** inside VS Code.

---

## 🧪 Example Pull Request

Use a GitHub repository URL and review repository intelligence inside VS Code.

---

## 🗺 Future Roadmap

* GitHub API Integration
* Live PR Diff Parsing
* Automatic Test Generation
* Merge Risk Prediction
* CI/CD Review Comments

---

## 👩‍💻 Team

**Bob the Builder**

* Megan Das
* Sakshi Kumar
* Harsh Kumar

---

## 📜 License

MIT License.

