'use client';
import { useState } from 'react';
import ArticleReplyModal from './ArticleReplyModal';

export default function ArticleReplyButton({ articleTitle }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="mt-4">
            <button
                className="socialbutton btn-connect"
                onClick={() => setShowModal(true)}
            >
                Reply to Article <i className="bi bi-chat-text-fill"></i>
            </button>
            <ArticleReplyModal
                show={showModal}
                onClose={() => setShowModal(false)}
                articleTitle={articleTitle}
            />
        </div>
    );
}
