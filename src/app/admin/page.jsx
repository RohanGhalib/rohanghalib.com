'use client';
import { useState, useEffect } from 'react';
import { db } from '@/app/das/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Tabs, Tab, Button } from 'react-bootstrap';
import ArticlesManager from './components/ArticlesManager';
import ProjectsManager from './components/ProjectsManager';
import { logoutAdmin } from '@/app/actions/adminAuth';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function Admin() {
  const [heroData, setHeroData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [aboutMeContent, setAboutMeContent] = useState('');
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'siteContent', 'content');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHeroData(data.hero);
        setFooterData(data.footer);
        setAboutMeContent(data.aboutMe || '');
      } else {
        console.log("No such document!");
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
    router.refresh();
  };

  const handleHeroChange = (e) => {
    const { name, value } = e.target;
    setHeroData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setHeroData((prevData) => ({
      ...prevData,
      socials: {
        ...prevData.socials,
        [name]: value,
      }
    }));
  };

  const handleFooterChange = (e) => {
    const { name, value } = e.target;
    setFooterData((prevData) => ({
      ...prevData,
      poetry: {
        ...prevData.poetry,
        [name]: value,
      },
    }));
  };

  const handleAboutMeChange = (e) => {
    setAboutMeContent(e.target.value);
  };

  const saveChanges = async () => {
    try {
      const docRef = doc(db, 'siteContent', 'content');
      await setDoc(docRef, {
        hero: heroData,
        footer: footerData,
        aboutMe: aboutMeContent,
      }, { merge: true });
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes');
    }
  };

  if (!heroData || !footerData) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mt-5 mb-5" data-bs-theme={theme === 'dark' ? 'dark' : 'light'}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
      </div>

      <Tabs defaultActiveKey="content" id="admin-tabs" className="mb-4">

        <Tab eventKey="content" title="Site Content">
          <div className="admin-panel">
            <h2>Hero Section</h2>
            <label className="mt-2">Name:</label>
            <input
              type="text"
              name="name"
              value={heroData.name}
              onChange={handleHeroChange}
              className="form-control mb-3 mt-1"
            />

            <h3 className="mt-4">Social Links</h3>
            {Object.keys(heroData.socials).map((key) => (
              <div key={key}>
                <label className="mt-2">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                <input
                  type="text"
                  name={key}
                  value={heroData.socials[key]}
                  onChange={handleSocialChange}
                  className="form-control mb-3 mt-1"
                />
              </div>
            ))}
          </div>

          <div className="admin-panel">
            <h2>About Me Section</h2>
            <textarea
              value={aboutMeContent}
              onChange={handleAboutMeChange}
              className="form-control mb-3 mt-2"
              rows="8"
            />
          </div>

          <div className="admin-panel">
            <h2>Footer Section</h2>
            <h3 className="mt-3">Poetry</h3>
            <label className="mt-2">Line 1:</label>
            <input
              type="text"
              name="line1"
              value={footerData.poetry.line1}
              onChange={handleFooterChange}
              className="form-control mb-3 mt-1"
            />
            <label className="mt-2">Line 2:</label>
            <input
              type="text"
              name="line2"
              value={footerData.poetry.line2}
              onChange={handleFooterChange}
              className="form-control mb-3 mt-1"
            />
          </div>

          <Button onClick={saveChanges} variant="success" className="mt-4 mb-4">Save Site Content Changes</Button>
        </Tab>

        <Tab eventKey="articles" title="Articles">
          <div className="admin-panel">
            <ArticlesManager />
          </div>
        </Tab>

        <Tab eventKey="projects" title="Projects">
          <div className="admin-panel">
            <ProjectsManager />
          </div>
        </Tab>

      </Tabs>

    </div>
  );
}
