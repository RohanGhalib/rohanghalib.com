'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const MarkdownRenderer = ({ content }) => {
    return (
        <div className="article-content">
            <style jsx global>{`
        .article-content img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
