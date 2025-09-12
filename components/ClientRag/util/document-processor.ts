import { DB } from "@/providers/pglite.provider";
import { embed, embedMany } from "ai";
import { transformersJS } from "@built-in-ai/transformers-js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export interface ProcessedDocument {
    content: string;
    metadata: {
        source: string;
        filename: string;
        fileType: 'pdf' | 'txt' | 'text';
        chunkIndex: number;
        totalChunks: number;
        originalSize: number;
        chunkSize: number;
        timestamp: string;
        page?: number; // For PDF pages
        [key: string]: any;
    };
}

export interface ProcessingProgress {
    stage: 'reading' | 'splitting' | 'embedding' | 'storing' | 'complete';
    current: number;
    total: number;
    message: string;
    filename?: string;
}

export interface StoredDocument {
    id: number;
    content: string;
    metadata: ProcessedDocument['metadata'];
    embedding: number[];
    created_at: string;
}

export interface SearchResult extends Omit<StoredDocument, 'embedding'> {
    similarity: number;
}

export class DocumentProcessor {

    private db: DB;

    private textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
        separators: ["\n\n", "\n", " ", ""],
        keepSeparator: false,
        lengthFunction: (text: string) => text.length
    });

    private embeddingModel = transformersJS.textEmbedding("Supabase/gte-small", {
        device: "webgpu", // Use WebGPU for acceleration
        dtype: "q8", // Quantization level
        normalize: true, // Normalize embeddings (default: true)
        pooling: "mean", // Pooling strategy: 'mean', 'cls', or 'max'
        maxTokens: 512, // Maximum input tokens
    });

    constructor(db: DB) {
        this.db = db;
        this.initVectorDatabase();
    }

    private async initVectorDatabase() {
        await this.db.exec('CREATE EXTENSION IF NOT EXISTS vector;');

        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS documents (
                id SERIAL PRIMARY KEY,
                content TEXT NOT NULL,
                metadata JSONB DEFAULT '{}',
                embedding vector(384),
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        // Create an index for vector similarity search
        await this.db.exec(`
            CREATE INDEX IF NOT EXISTS documents_embedding_idx 
            ON documents USING hnsw (embedding vector_cosine_ops);
        `);
    }

    async embedText(value: string) {
        const { embedding } = await embed({
            model: this.embeddingModel,
            value,
        });
        return embedding;
    }

    async embedMultipleText(values: string[]) {
        const { embeddings } = await embedMany({
            model: this.embeddingModel,
            values,
        });
        return embeddings;
    }

    async processTextFile(file: File): Promise<ProcessedDocument[]> {
        const text = await file.text();
        return this.splitText(text, {
            source: 'file_upload',
            filename: file.name,
            fileType: 'txt',
            originalSize: text.length,
            timestamp: new Date().toISOString()
        });
    }

    async processPdfFile(file: File): Promise<ProcessedDocument[]> {
        const pdfjsLib = (window as any).pdfjsLib as typeof import('pdfjs-dist/types/src/pdf')
        // point to the pre-built worker on a CDN (no webpack involved)
        pdfjsLib.GlobalWorkerOptions.workerSrc =
            `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;



        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';
        const pageTexts: Array<{ pageNumber: number; text: string }> = [];

        // Extract text from each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();

            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ')
                .trim();

            if (pageText) {
                pageTexts.push({ pageNumber: pageNum, text: pageText });
                fullText += pageText + '\n\n';
            }
        }

        // Split the full text into chunks
        const chunks = await this.splitText(fullText, {
            source: 'pdf_upload',
            filename: file.name,
            fileType: 'pdf',
            originalSize: fullText.length,
            timestamp: new Date().toISOString(),
            totalPages: pdf.numPages
        });

        // Try to map chunks back to pages
        return this.mapChunksToPages(chunks, pageTexts);
    }

    private mapChunksToPages(
        chunks: ProcessedDocument[],
        pageTexts: Array<{ pageNumber: number; text: string }>
    ): ProcessedDocument[] {
        return chunks.map(chunk => {
            let bestMatch = { pageNumber: 1, similarity: 0 };

            for (const pageInfo of pageTexts) {
                const similarity = this.calculateTextSimilarity(
                    chunk.content.substring(0, 200),
                    pageInfo.text.substring(0, 200)
                );

                if (similarity > bestMatch.similarity) {
                    bestMatch = { pageNumber: pageInfo.pageNumber, similarity };
                }
            }

            return {
                ...chunk,
                metadata: {
                    ...chunk.metadata,
                    page: bestMatch.similarity > 0.1 ? bestMatch.pageNumber : undefined
                }
            };
        });
    }

    /**
    * Calculate text similarity using Jaccard similarity
    */
    private calculateTextSimilarity(text1: string, text2: string): number {
        const words1 = Array.from(new Set(text1.toLowerCase().split(/\s+/)));
        const words2 = Array.from(new Set(text2.toLowerCase().split(/\s+/)));

        const intersection = words1.filter(word => words2.includes(word));
        const union = Array.from(new Set([...words1, ...words2]));

        return intersection.length / union.length;
    }


    private async splitText(text: string, baseMetadata: Partial<ProcessedDocument['metadata']>): Promise<ProcessedDocument[]> {
        if (!text.trim()) {
            throw new Error('Cannot process empty text');
        }

        const docs = await this.textSplitter.createDocuments([text]);

        return docs.map((doc, index) => ({
            content: doc.pageContent,
            metadata: {
                ...baseMetadata,
                chunkIndex: index,
                totalChunks: docs.length,
                chunkSize: doc.pageContent.length,
                source: baseMetadata.source || 'unknown',
                filename: baseMetadata.filename || 'unknown',
                fileType: baseMetadata.fileType || 'text',
                originalSize: baseMetadata.originalSize || text.length,
                timestamp: baseMetadata.timestamp || new Date().toISOString()
            } as ProcessedDocument['metadata']
        }));
    }


    getFileType(file: File): 'pdf' | 'txt' | 'unsupported' {
        const extension = file.name.toLowerCase().split('.').pop();
        const mimeType = file.type.toLowerCase();

        if (mimeType === 'application/pdf' || extension === 'pdf') {
            return 'pdf';
        }

        if (
            mimeType === 'text/plain' ||
            extension === 'txt' ||
            extension === 'md' ||
            extension === 'markdown'
        ) {
            return 'txt';
        }

        return 'unsupported';
    }

    private async storeProcessedDocuments(documents: ProcessedDocument[], embeddings: number[][]): Promise<void> {
        if (documents.length !== embeddings.length) {
            throw new Error("Documents and embeddings arrays must have the same length");
        }

        for (let i = 0; i < documents.length; i++) {
            const doc = documents[i];
            const embedding = embeddings[i];

            await this.db.query(
                `
                INSERT INTO documents (content, metadata, embedding) 
                VALUES ($1, $2, $3)
                `,
                [
                    doc.content,
                    JSON.stringify(doc.metadata),
                    `[${embedding.join(',')}]`
                ]
            );
        }
    }

    async processAndStoreFiles(
        files: File[] | FileList,
        onProgress?: (progress: ProcessingProgress) => void
    ): Promise<void> {
        const fileArray = Array.from(files);
        let totalProcessed = 0;

        for (let i = 0; i < fileArray.length; i++) {
            const file = fileArray[i];
            const fileType = this.getFileType(file);

            if (fileType === 'unsupported') {
                console.warn(`Skipping unsupported file: ${file.name}`);
                continue;
            }

            onProgress?.({
                stage: 'reading',
                current: i + 1,
                total: fileArray.length,
                message: `Reading ${file.name}...`,
                filename: file.name
            });

            let processedDocs: ProcessedDocument[] = [];

            if (fileType === 'pdf') {
                processedDocs = await this.processPdfFile(file);
            } else if (fileType === 'txt') {
                processedDocs = await this.processTextFile(file);
            }

            // Splitting stage
            onProgress?.({
                stage: 'splitting',
                current: i + 1,
                total: fileArray.length,
                message: `Split into ${processedDocs.length} chunks`,
                filename: file.name
            });

            // Embedding stage
            onProgress?.({
                stage: 'embedding',
                current: 0,
                total: processedDocs.length,
                message: `Generating embeddings...`,
                filename: file.name
            });

            // Generate embeddings in batches for better performance
            const batchSize = 10;
            const embeddings: number[][] = [];

            for (let j = 0; j < processedDocs.length; j += batchSize) {
                const batch = processedDocs.slice(j, j + batchSize);
                const batchTexts = batch.map(doc => doc.content);

                const batchEmbeddings = await this.embedMultipleText(batchTexts);
                embeddings.push(...batchEmbeddings);

                onProgress?.({
                    stage: 'embedding',
                    current: Math.min(j + batchSize, processedDocs.length),
                    total: processedDocs.length,
                    message: `Embedding batch ${Math.ceil((j + 1) / batchSize)}/${Math.ceil(processedDocs.length / batchSize)}`,
                    filename: file.name
                });
            }

            // Storing stage
            onProgress?.({
                stage: 'storing',
                current: 0,
                total: processedDocs.length,
                message: `Storing chunks...`,
                filename: file.name
            });

            // Store documents with embeddings
            await this.storeProcessedDocuments(processedDocs, embeddings);

            onProgress?.({
                stage: 'complete',
                current: i + 1,
                total: fileArray.length,
                message: `✅ Processed ${processedDocs.length} chunks`,
                filename: file.name
            });

            totalProcessed++;
        }
    }

    async searchSimilarDocuments(
        query: string,
        limit: number = 5,
        threshold: number = 0.7
    ): Promise<SearchResult[]> {
        try {
            const queryEmbedding = await this.embedText(query);

            const result = await this.db.query<SearchResult>(`
                SELECT 
                    id,
                    content,
                    metadata,
                    created_at,
                    1 - (embedding <=> $1) as similarity
                FROM documents
                WHERE 1 - (embedding <=> $1) > $2
                ORDER BY embedding <=> $1
                LIMIT $3
            `, [
                `[${queryEmbedding.join(',')}]`,
                threshold,
                limit
            ]);

            return result.rows.map(row => ({
                id: row.id,
                content: row.content,
                metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
                similarity: row.similarity,
                created_at: row.created_at
            }));
        } catch (error) {
            console.error("Error searching documents:", error);
            throw new Error("Failed to search documents");
        }
    }


    /**
    * Clear all documents
    */
    async clearDocuments(): Promise<void> {
        try {
            await this.db.exec('DELETE FROM documents');
        } catch (error) {
            console.error("Error clearing documents:", error);
            throw new Error("Failed to clear documents");
        }
    }
}