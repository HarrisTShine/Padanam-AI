import os
import logging
from typing import List, Dict, Any
from app.core.config import settings

logger = logging.getLogger("padanam_ai.rag")


class RAGService:
    def __init__(self):
        self.persist_dir = settings.CHROMA_PERSIST_DIR
        self._init_vector_db()

    def _init_vector_db(self):
        try:
            import chromadb
            self.client = chromadb.PersistentClient(path=self.persist_dir)
            self.collection = self.client.get_or_create_collection(
                name="scert_kerala_curriculum",
                metadata={"hnsw:space": "cosine"}
            )
            logger.info("ChromaDB vector store initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize ChromaDB ({e}). RAG running in fallback mode.")
            self.client = None
            self.collection = None

    def add_curriculum_chunk(
        self,
        chunk_id: str,
        content: str,
        metadata: Dict[str, Any]
    ):
        if not self.collection:
            return
        
        try:
            self.collection.add(
                ids=[chunk_id],
                documents=[content],
                metadatas=[metadata]
            )
        except Exception as e:
            logger.warning(f"Could not add chunk to ChromaDB: {e}")

    def retrieve_context(
        self,
        query: str,
        grade: int = 10,
        board: str = "SCERT_KERALA",
        language: str = "en",
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        if not self.collection:
            return self._fallback_retrieve(query)

        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=top_k
            )

            retrieved = []
            if results and "documents" in results and results["documents"]:
                docs = results["documents"][0]
                metas = results["metadatas"][0] if "metadatas" in results else [{}] * len(docs)
                for doc, meta in zip(docs, metas):
                    retrieved.append({
                        "content": doc,
                        "metadata": meta
                    })
            
            if not retrieved:
                return self._fallback_retrieve(query)
            return retrieved
        except Exception as e:
            logger.warning(f"RAG lookup error ({e}), using fallback.")
            return self._fallback_retrieve(query)

    def _fallback_retrieve(self, query: str) -> List[Dict[str, Any]]:
        return [{
            "content": (
                "SCERT Kerala State Board Class 10 Syllabus Overview:\n"
                "Physics Chapter 1: Wave Motion - Sound and Electromagnetic waves, frequency, wavelength, amplitude.\n"
                "Physics Chapter 2: Reflection & Refraction of Light - Mirror formula, Snell's law, refractive index.\n"
                "Mathematics Chapter 1: Arithmetic Sequences - Common difference, n-th term formula, sum of n terms."
            ),
            "metadata": {"subject": "General", "grade": 10, "board": "SCERT_KERALA"}
        }]


rag_service = RAGService()
