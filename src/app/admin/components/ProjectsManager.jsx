'use client';
import { useState, useEffect } from 'react';
import { db } from '@/app/das/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Modal, Button, Form } from 'react-bootstrap';

export default function ProjectsManager() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        url: '',
        cssClass: 'card-pink', // default options
        headingClass: 'card-heading-light',
        icon: '',
        order: 0
    });

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'projects'), orderBy('order'));
            const querySnapshot = await getDocs(q);
            const projectsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(projectsData);
        } catch (error) {
            console.error("Error fetching projects: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleShowModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                id: project.id,
                title: project.title || '',
                url: project.url || '',
                cssClass: project.cssClass || 'card-pink',
                headingClass: project.headingClass || 'card-heading-light',
                icon: project.icon || '',
                order: project.order || 0
            });
        } else {
            setEditingProject(null);
            setFormData({
                id: '',
                title: '',
                url: '',
                cssClass: 'card-pink',
                headingClass: 'card-heading-light',
                icon: '',
                order: projects.length + 1
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const docId = editingProject ? editingProject.id : formData.id || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            if (!docId) {
                alert("Valid ID or Title is required.");
                return;
            }

            const projectData = {
                title: formData.title,
                url: formData.url,
                cssClass: formData.cssClass,
                headingClass: formData.headingClass,
                icon: formData.icon,
                order: Number(formData.order) || 0
            };

            await setDoc(doc(db, 'projects', docId), projectData, { merge: true });
            await fetchProjects();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving project: ", error);
            alert("Failed to save project.");
        }
    };

    const handleDelete = async (id) => {
        if (confirm(`Are you sure you want to delete project ${id}?`)) {
            try {
                await deleteDoc(doc(db, 'projects', id));
                await fetchProjects();
            } catch (error) {
                console.error("Error deleting project: ", error);
                alert("Failed to delete project.");
            }
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Projects Manager</h2>
                <Button variant="dark" onClick={() => handleShowModal()}>Add New Project</Button>
            </div>

            {loading ? (
                <p>Loading projects...</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Order</th>
                                <th>Title / ID</th>
                                <th>URL</th>
                                <th>Styles</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id}>
                                    <td>{project.order}</td>
                                    <td><strong>{project.title}</strong><br /><small className="text-muted">{project.id}</small></td>
                                    <td><a href={project.url} target="_blank" rel="noopener noreferrer">{project.url?.substring(0, 30)}...</a></td>
                                    <td><small>Bg: {project.cssClass}<br />Text: {project.headingClass}</small></td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(project)}>Edit</Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(project.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && (
                                <tr><td colSpan="5" className="text-center">No projects found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit/Create Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingProject ? 'Edit Project' : 'Create New Project'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSave}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Project ID (Slug)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.id}
                                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                        disabled={!!editingProject}
                                        placeholder="e.g. teenverse"
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Display Order</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-12 mb-3">
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
                                    <Form.Label>Target URL</Form.Label>
                                    <Form.Control
                                        type="url"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Background CSS Class</Form.Label>
                                    <Form.Select
                                        value={formData.cssClass}
                                        onChange={(e) => setFormData({ ...formData, cssClass: e.target.value })}
                                    >
                                        <option value="card-drivebags">Green (DriveBags)</option>
                                        <option value="card-introtaps">Military (IntroTaps)</option>
                                        <option value="card-pink">Pink Gradient</option>
                                        <option value="card-publicnotepad">Yellow Gradient</option>
                                        <option value="card-das">Navy Blue Gradient</option>
                                        <option value="card-green">Lime Green</option>
                                        <option value="card-keyboard">Dark Grey</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Heading Color Class</Form.Label>
                                    <Form.Select
                                        value={formData.headingClass}
                                        onChange={(e) => setFormData({ ...formData, headingClass: e.target.value })}
                                    >
                                        <option value="card-heading-light">Light Text</option>
                                        <option value="card-heading-dark">Dark Text</option>
                                        <option value="card-heading-light urdutext">Light Text (Urdu Font)</option>
                                        <option value="card-heading-dark urdutext">Dark Text (Urdu Font)</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-12 mb-3">
                                <Form.Group>
                                    <Form.Label>Bootstrap Icon Class (optional)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        placeholder="e.g. bi-notepad"
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
