'use client';
import { useState, useEffect } from 'react';
import { db } from '@/app/das/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [heroData, setHeroData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [aboutMeContent, setAboutMeContent] = useState('');

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

    if (authenticated) {
      fetchData();
    }
  }, [authenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      setAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
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

  if (!authenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  if (!heroData || !footerData) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: '20px' }}>
        <h2>Hero Section</h2>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={heroData.name}
          onChange={handleHeroChange}
          style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <h3>Social Links</h3>
        {Object.keys(heroData.socials).map((key) => (
            <div key={key}>
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                <input
                type="text"
                name={key}
                value={heroData.socials[key]}
                onChange={handleSocialChange}
                style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
                />
            </div>
        ))}
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: '20px' }}>
        <h2>About Me Section</h2>
        <textarea
          value={aboutMeContent}
          onChange={handleAboutMeChange}
          style={{ width: '100%', height: '300px', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: '20px' }}>
        <h2>Footer Section</h2>
        <h3>Poetry</h3>
        <label>Line 1:</label>
        <input
          type="text"
          name="line1"
          value={footerData.poetry.line1}
          onChange={handleFooterChange}
          style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <label>Line 2:</label>
        <input
          type="text"
          name="line2"
          value={footerData.poetry.line2}
          onChange={handleFooterChange}
          style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      <button onClick={saveChanges} style={{ marginTop: '20px', padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save Changes</button>
    </div>
  );
}
