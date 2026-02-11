import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/das/firebase";

export default async function sitemap() {
    const baseUrl = 'https://rohanghalib.com';

    // Static routes
    const routes = [
        '',
        '/articles',
        // Add other static routes here if needed
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
    }));

    // Dynamic routes (Articles)
    try {
        const articlesCol = collection(db, "articles");
        const articleSnapshot = await getDocs(articlesCol);
        const articles = articleSnapshot.docs.map((doc) => ({
            url: `${baseUrl}/articles/id/${doc.id}`,
            lastModified: doc.data().published_at?.seconds
                ? new Date(doc.data().published_at.seconds * 1000)
                : new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        }));

        return [...routes, ...articles];
    } catch (error) {
        console.error("Error generating sitemap:", error);
        return routes;
    }
}
