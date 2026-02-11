'use server';

export async function getSecretArticle(query) {
    const secretPhrase = process.env.data_secret_phrase;
    const secretData = process.env.data_secret_article_json;

    if (!secretPhrase || !secretData) {
        console.warn("Secret environment variables are not set.");
        return null;
    }

    // Normalize query and phrase for comparison (optional, but good for UX)
    // user asked for "exact", so maybe strict equality is better.
    // "rohanlovessaliha" to be exact.

    if (query === secretPhrase) {
        try {
            return JSON.parse(secretData);
        } catch (error) {
            console.error("Failed to parse secret article JSON:", error);
            return null;
        }
    }

    return null;
}

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/das/firebase";

export async function searchArticles(query) {
    if (!query) return [];

    try {
        const normalize = (text) => text ? text.toLowerCase() : '';
        const start = Date.now();
        const articlesCol = collection(db, "articles");
        const articleSnapshot = await getDocs(articlesCol);

        // In-memory full-text search (scalable for portfolio size)
        const lowerQuery = normalize(query);

        const matches = articleSnapshot.docs
            .map(doc => {
                const data = doc.data();
                return { id: doc.id, ...data };
            })
            .filter(article => {
                // We already search title/desc on client, but good to double check or find 
                // matches ONLY in content that weren't in title/desc.
                const titleMatch = normalize(article.title).includes(lowerQuery);
                const descMatch = normalize(article.description).includes(lowerQuery);
                const contentMatch = normalize(article.content).includes(lowerQuery);

                return titleMatch || descMatch || contentMatch;
            })
            .map(article => {
                // Generate Snippet if content matched
                let snippet = null;
                const normContent = normalize(article.content);
                const matchIndex = normContent.indexOf(lowerQuery);

                if (matchIndex !== -1) {
                    // Strip HTML tags for clean snippet (basic regex)
                    const plainText = article.content.replace(/<[^>]+>/g, ' ');
                    const normPlainText = normalize(plainText);
                    const plainMatchIndex = normPlainText.indexOf(lowerQuery);

                    if (plainMatchIndex !== -1) {
                        const start = Math.max(0, plainMatchIndex - 60);
                        const end = Math.min(plainText.length, plainMatchIndex + lowerQuery.length + 60);
                        snippet = "..." + plainText.slice(start, end) + "...";
                    }
                }

                // Strip content before sending back and serialize timestamps
                const { content, ...rest } = article;

                const serializedRest = {
                    ...rest,
                    published_at: rest.published_at?.seconds ? rest.published_at.seconds * 1000 : null,
                    created_at: rest.created_at?.seconds ? rest.created_at.seconds * 1000 : null,
                    updated_at: rest.updated_at?.seconds ? rest.updated_at.seconds * 1000 : null,
                    snippet
                };

                return serializedRest;
            });

        return matches;
    } catch (error) {
        console.error("Error searching articles:", error);
        return [];
    }
}
