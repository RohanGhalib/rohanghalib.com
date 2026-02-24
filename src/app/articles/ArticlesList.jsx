'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSecretArticle, searchArticles } from '@/app/actions';

const ArticlesList = ({ initialArticles = [] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredArticles, setFilteredArticles] = useState(initialArticles);
    const [secretArticle, setSecretArticle] = useState(null);
    const [isSearchingServer, setIsSearchingServer] = useState(false);

    useEffect(() => {
        let active = true; // To prevent race conditions

        const handleSearch = async () => {
            // 1. Immediate Client-Side Filtering (Title/Description)
            // This ensures "don't let the user wait"
            const lowerQuery = searchQuery.toLowerCase();

            let clientMatches = initialArticles;
            if (searchQuery) {
                clientMatches = initialArticles.filter(article =>
                    article.title.toLowerCase().includes(lowerQuery) ||
                    (article.description && article.description.toLowerCase().includes(lowerQuery))
                );
            }

            // Update UI immediately with client results
            setFilteredArticles(clientMatches);

            // Secret check
            if (searchQuery === 'rohanlovessaliha') {
                const secret = await getSecretArticle(searchQuery);
                if (active && secret) setSecretArticle(secret);
            } else {
                if (active) setSecretArticle(null);
            }

            // 2. Server-Side Deep Search (Content)
            // Only if there is a query, run the heavier server search
            if (searchQuery) {
                setIsSearchingServer(true);
                try {
                    const serverMatches = await searchArticles(searchQuery);

                    if (active) {
                        // Merge results: Client matches + Server matches (deduplicated)
                        setFilteredArticles(prevArticles => {
                            const existingIds = new Set(prevArticles.map(a => a.id));
                            const newMatches = serverMatches.filter(a => !existingIds.has(a.id));

                            // If there are new matches from deep search, append them
                            if (newMatches.length > 0) {
                                return [...prevArticles, ...newMatches];
                            }
                            return prevArticles;
                        });
                    }
                } catch (error) {
                    console.error("Server search failed", error);
                } finally {
                    if (active) setIsSearchingServer(false);
                }
            } else {
                setIsSearchingServer(false);
            }
        };

        const debounce = setTimeout(handleSearch, 300);
        return () => {
            clearTimeout(debounce);
            active = false;
        };
    }, [searchQuery, initialArticles]);

    // Helper to highlight text
    const highlightText = (text, query) => {
        if (!query || !text) return text;

        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === query.toLowerCase() ?
                        <span key={i} className="search-highlight">{part}</span> : part
                )}
            </>
        );
    };

    return (
        <>
            {/* Search Bar */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="search-wrapper">
                        <i className="bi bi-search search-icon"></i>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {isSearchingServer && (
                            <div className="spinner-border spinner-border-sm text-secondary ms-2" role="status">
                                <span className="visually-hidden">Search Loading...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
        .search-wrapper {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          border: 3px solid black;
          border-radius: 10px; /* Matches article-card */
          background-color: transparent;
          transition: 0.2s; /* Matches article-card transition */
          cursor: text;
        }

        .search-icon {
          font-size: 1.2rem;
          margin-right: 15px;
          color: black;
          transition: 0.2s;
        }

        .search-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 1.2rem;
          font-family: 'Outfit', sans-serif;
          color: black;
          outline: none;
          transition: 0.2s;
        }

        .search-input::placeholder {
          color: rgba(0, 0, 0, 0.6);
        }

        /* Hover & Focus Effect - Invert Colors */
        .search-wrapper:hover, .search-wrapper:focus-within {
          background-color: black;
          color: white;
        }

        .search-wrapper:hover .search-icon, .search-wrapper:focus-within .search-icon {
          color: white;
        }

        .search-wrapper:hover .search-input, .search-wrapper:focus-within .search-input {
           color: white;
        }
        
        .search-wrapper:hover .search-input::placeholder, .search-wrapper:focus-within .search-input::placeholder {
           color: rgba(255, 255, 255, 0.7);
        }

        /* Dark Mode Support */
        [data-theme="dark"] .search-wrapper {
          border-color: white;
        }

        [data-theme="dark"] .search-icon {
          color: white;
        }

        [data-theme="dark"] .search-input {
          color: white;
        }

        [data-theme="dark"] .search-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        /* Dark Mode Hover - Invert to White Background */
        [data-theme="dark"] .search-wrapper:hover, [data-theme="dark"] .search-wrapper:focus-within {
          background-color: white;
          color: black;
        }

        [data-theme="dark"] .search-wrapper:hover .search-icon, [data-theme="dark"] .search-wrapper:focus-within .search-icon {
          color: black;
        }

        [data-theme="dark"] .search-wrapper:hover .search-input, [data-theme="dark"] .search-wrapper:focus-within .search-input {
           color: black;
        }

        [data-theme="dark"] .search-wrapper:hover .search-input::placeholder, [data-theme="dark"] .search-wrapper:focus-within .search-input::placeholder {
           color: rgba(0, 0, 0, 0.7);
        }

        .search-highlight {
            background-color: #ffd700; /* Gold/Yellow highlight */
            color: black;
            padding: 0 2px;
            border-radius: 2px;
            font-weight: bold;
        }
        
        [data-theme="dark"] .search-highlight {
            background-color: #b8860b; /* Darker Gold for Dark Mode */
            color: white;
        }
      `}</style>

            {/* Secret Article Display */}
            {secretArticle && (
                <div className="row mb-4 justify-content-center">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', color: '#555' }}>
                            <div className="card-body p-5 text-center">
                                <h2 className="mb-3 ">❤️ {secretArticle.title} ❤️</h2>
                                <div dangerouslySetInnerHTML={{ __html: secretArticle.content }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Normal Articles List */}
            {!secretArticle && (
                <div className="row mt-2 d-flex justify-content-between">
                    {filteredArticles.length > 0 ? (
                        filteredArticles.map((article, idx) => (
                            <div
                                key={article.id || idx}
                                className="col-lg-4 mt-3 d-flex justify-content-start"
                                style={{ cursor: 'pointer' }}
                            >
                                <Link
                                    href={`/articles/id/${article.id || idx}`}
                                    style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                                    tabIndex={0}
                                    aria-label={`Read article: ${article.title}`}
                                >
                                    <div className="article-card">
                                        <h3>
                                            {highlightText(article.title, searchQuery)}
                                            <span className="arrow-icon float-end">
                                                <i className="bi bi-arrow-up-right-circle-fill"></i>
                                            </span>
                                        </h3>
                                        <p>
                                            {/* Show snippet if available (deep match), else description */}
                                            {article.snippet ? (
                                                <span className="text-muted small">
                                                    {highlightText(article.snippet, searchQuery)}
                                                </span>
                                            ) : (
                                                highlightText(
                                                    article.description && article.description.length > 110
                                                        ? article.description.slice(0, 110) + " ..."
                                                        : article.description,
                                                    searchQuery
                                                )
                                            )}
                                        </p>
                                        <span className='float-bottom'>
                                            <i>Published {article.published_at ? new Date(article.published_at).toLocaleDateString('en-GB') : 'Date unknown'}</i>
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center mt-5">
                            <p className="text-muted">No articles found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ArticlesList;
