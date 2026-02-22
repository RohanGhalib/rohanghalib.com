"use client";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/app/das/firebase';

const Footer = dynamic(() => import('@/sections/Footer'), { loading: () => <p>Loading...</p> });

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
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

    fetchProjects();
  }, []);

  return (
    <>
      <div className="container mt-5">
        <h1><Link style={{ textDecoration: 'none', color: 'inherit' }} href={"./"}> <i className="bi bi-arrow-left-circle-fill"></i> </Link>Projects</h1>
        <div className="row mt-5">
          {loading ? (
            <div className="col-12 text-center mt-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="col-lg-3 mt-3">
                <div
                  onClick={() => window.location.href = project.url}
                  className={`card-project ${project.cssClass}`}
                >
                  <h2 className={project.headingClass}>
                    {project.icon && <i className={`bi ${project.icon} me-2`}></i>}
                    {project.title}
                  </h2>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
