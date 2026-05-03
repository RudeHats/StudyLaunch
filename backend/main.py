import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants & State
CHROMA_DB_DIR = "./chroma_db"
EMBEDDING_MODEL = "all-MiniLM-L6-v2" # Lightweight embedding[cite: 1]
LLM_MODEL = "phi3" # Lightweight LLM[cite: 1]
UPLOAD_DIR = "./uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

# Global variable to hold the active RAG chain
active_rag_chain = None

class ChatRequest(BaseModel):
    question: str

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    global active_rag_chain
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save the uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # 1. Parse PDF and Split Text[cite: 1]
        loader = PyPDFLoader(file_path)
        docs = loader.load()

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        splits = text_splitter.split_documents(docs)

        # 2. Initialize Embeddings and Chroma DB[cite: 1]
        embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
        
        # Clear existing DB to prevent cross-contamination between different resumes
        if os.path.exists(CHROMA_DB_DIR):
            shutil.rmtree(CHROMA_DB_DIR)

        vectorstore = Chroma.from_documents(
            documents=splits, 
            embedding=embeddings, 
            persist_directory=CHROMA_DB_DIR
        )
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

        # 3. Setup the Lightweight LLM (Temperature 0 for strictness)[cite: 1]
        llm = Ollama(model=LLM_MODEL, temperature=0.0)

        # 4. Strict Anti-Hallucination Prompt Template[cite: 1]
        strict_prompt = """
        You are an extremely strict and precise HR assistant. Your ONLY job is to extract information from the candidate's resume provided in the Context below.
        
        RULES:
        1. Answer the Question using ONLY the information in the Context.
        2. DO NOT use outside knowledge, assume, guess, or infer anything.
        3. If the Context does not contain the answer, reply EXACTLY with: "The provided resume does not contain this information."
        4. Keep your answer brief and professional.

        Context:
        {context}

        Question: {input}
        Answer:
        """
        prompt = PromptTemplate(template=strict_prompt, input_variables=["context", "input"])

        # 5. Build RAG Chain[cite: 1]
        question_answer_chain = create_stuff_documents_chain(llm, prompt)
        active_rag_chain = create_retrieval_chain(retriever, question_answer_chain)

        return {"message": "Resume processed and embedded successfully. Ready for questions."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(request: ChatRequest):
    global active_rag_chain
    
    if active_rag_chain is None:
        raise HTTPException(status_code=400, detail="Please upload a resume first.")

    try:
        response = active_rag_chain.invoke({"input": request.question})
        return {"answer": response["answer"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))