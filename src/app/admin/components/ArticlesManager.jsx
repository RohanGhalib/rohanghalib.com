'use client';
import { useState, useEffect } from 'react';
import { db } from '@/app/das/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Modal, Button, Form } from 'react-bootstrap';

export default function ArticlesManager() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        content: '',
        published_at: null
    });

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'articles'));
            const articlesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setArticles(articlesData);
        } catch (error) {
            console.error("Error fetching articles: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleShowModal = (article = null) => {
        if (article) {
            setEditingArticle(article);
            setFormData({
                id: article.id,
                title: article.title || '',
                description: article.description || '',
                content: article.content || '',
                published_at: article.published_at?.seconds
                    ? new Date(article.published_at.seconds * 1000).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0]
            });
        } else {
            setEditingArticle(null);
            setFormData({
                id: '',
                title: '',
                description: '',
                content: '',
                published_at: new Date().toISOString().split('T')[0]
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const docId = editingArticle ? editingArticle.id : formData.id || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            if (!docId) {
                alert("Valid ID or Title is required.");
                return;
            }

            const publishDate = new Date(formData.published_at);

            const articleData = {
                title: formData.title,
                description: formData.description,
                content: formData.content,
                published_at: { seconds: Math.floor(publishDate.getTime() / 1000), nanoseconds: 0 },
                created_at: editingArticle?.created_at || { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
                updated_at: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
            };

            await setDoc(doc(db, 'articles', docId), articleData, { merge: true });
            await fetchArticles();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving article: ", error);
            alert("Failed to save article.");
        }
    };

    const handleDelete = async (id) => {
        if (confirm(`Are you sure you want to delete article ${id}?`)) {
            try {
                await deleteDoc(doc(db, 'articles', id));
                await fetchArticles();
            } catch (error) {
                console.error("Error deleting article: ", error);
                alert("Failed to delete article.");
            }
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Articles Manager</h2>
                <Button variant="dark" onClick={() => handleShowModal()}>Add New Article</Button>
            </div>

            {loading ? (
                <p>Loading articles...</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Published</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map((article) => (
                                <tr key={article.id}>
                                    <td><strong>{article.title}</strong><br /><small className="text-muted">{article.id}</small></td>
                                    <td>{article.description?.substring(0, 50)}...</td>
                                    <td>{article.published_at?.seconds ? new Date(article.published_at.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(article)}>Edit</Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(article.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                            {articles.length === 0 && (
                                <tr><td colSpan="4" className="text-center">No articles found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit/Create Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>{editingArticle ? 'Edit Article' : 'Create New Article'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSave}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Article ID (URL Slug)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.id}
                                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                        disabled={!!editingArticle}
                                        placeholder="e.g. my-first-article"
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12 mb-3">
                                <Form.Group>
                                    <Form.Label>Short Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12 mb-3">
                                <Form.Group>
                                    <Form.Label>Markdown Content</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={15}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        required
                                        style={{ fontFamily: 'monospace' }}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Publish Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.published_at}
                                        onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button variant="dark" type="submit">Save Changes</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
