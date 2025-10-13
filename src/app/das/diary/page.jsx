"use client";

import React, { useState, useRef, useEffect } from 'react';

// NOTE FOR YOUR LOCAL PROJECT:
// The two lines below were removed to fix a preview environment error.
// Please ADD THEM BACK in your local 'DailyDiaryGenerator.jsx' file:
 import html2canvas from 'html2canvas';
 import './style.css';


const SchoolIcon = () => (
 <img src="/sd.jpg" height={50} alt="" />
);

const TrashIcon = () => <i className="bi bi-trash3"></i>;

export default function DailyDiaryGenerator() {
  const schoolName = 'Dar-e-Arqam';
  const classOptions = [
   "Nursery",
   "Prep",
   "One",
   "Two",
   "Three",
   "Four",
   "Five",
   "Six",
   "Seven",
   "Eight",
   "Nine",
   "Ten",
   "Level B",
   "Level C",
   "Level D",
   "Level E",
   "Level F",

  ];
  const quotes = [
   "Jack of all trades is master of none, but oftentimes better than master of one.",
   "Education is the most powerful weapon which you can use to change the world.",

  ];
  const predefinedSubjects = ['English', 'Urdu', 'Maths', 'Science', 'Islamiat', 'Quran', 'Custom'];

  const [className, setClassName] = useState(classOptions[4]);
  const [date] = useState(new Date().toISOString().slice(0, 10));
  const [subjects, setSubjects] = useState([]);
  const [announcements, setAnnouncements] = useState('');
  
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'
  
  const [selectedSubject, setSelectedSubject] = useState(predefinedSubjects[0]);
  const [customSubjectName, setCustomSubjectName] = useState('');

  const diaryRef = useRef(null);
  const tabContainerRef = useRef(null);
  const touchStartRef = useRef(null);

  useEffect(() => {
    const tabContainer = tabContainerRef.current;
    if (!tabContainer) return;
    
    const activePill = tabContainer.querySelector('.nav-link.active');
    if(activePill) {
        // This effect runs when activeTab changes, triggering the CSS transition.
        tabContainer.style.setProperty('--pill-width', `${activePill.offsetWidth}px`);
        tabContainer.style.setProperty('--pill-offset', `${activePill.offsetLeft}px`);
    }
  }, [activeTab]);


  const handleSubjectChange = (id, field, value) => {
    setSubjects(subjects.map(sub => sub.id === id ? { ...sub, [field]: value } : sub));
  };

  const addSubject = () => {
    const subjectName = selectedSubject === 'Custom' ? customSubjectName.trim() : selectedSubject;
    if (subjectName && !subjects.some(s => s.name === subjectName)) {
        const newId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
        setSubjects([...subjects, { id: newId, name: subjectName, homework: '' }]);
        setCustomSubjectName('');
        setSelectedSubject(predefinedSubjects[0]);
    } else if (subjectName) {
        alert(`"${subjectName}" has already been added.`);
    }
  };

  const removeSubject = (id) => {
    setSubjects(subjects.filter(sub => sub.id !== id));
  };
  
  const handleTouchStart = (e) => {
    // Record the starting X position of the touch.
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    // We no longer update the pill's position here, preventing the "loose" feeling.
  };

  const handleTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const swipeDistance = touchStartRef.current - touchEnd;
    const swipeThreshold = 50; // User must swipe at least 50px for it to register.

    if (swipeDistance > swipeThreshold) {
      // If swiped left far enough, switch to the preview tab.
      setActiveTab('preview');
    } else if (swipeDistance < -swipeThreshold) {
      // If swiped right far enough, switch to the edit tab.
      setActiveTab('edit');
    }
    
    // Reset the starting touch position.
    touchStartRef.current = null;
  };

  const downloadDiaryAsImage = () => {
   if (typeof html2canvas === 'undefined') {
     alert("Image generation library is not available.");
     return;
   }

   if (!diaryRef.current) {
     console.error("Diary reference not found.");
     return;
   }
   const originalTab = activeTab;
   // Temporarily switch to the preview tab to ensure it's rendered for the screenshot.
   setActiveTab('preview');

   // Use a short timeout to allow the DOM to update before taking the screenshot.
   setTimeout(() => {
     html2canvas(diaryRef.current, {
       scale: 2.5,
       padding: 10, // Higher scale for better image quality
       useCORS: true,
       backgroundColor: '#ffffff'
     }).then(canvas => {
       const link = document.createElement('a');
       link.download = `diary-${className.replace(/\s/g, '_')}-${date}.png`;
       link.href = canvas.toDataURL('image/png');
       link.click();
     }).catch(err => {
       console.error("Image generation failed!", err);
     }).finally(() => {
       // Switch back to the original tab after the process is complete.
       setActiveTab(originalTab);
     });
   }, 100);
  };

  return (
   <div className="app-container">
    <div className="container py-4">
     <header className="text-center mb-4">
      <h1 className="fw-bold display-6">Diary</h1>
     </header>

     <ul ref={tabContainerRef} className="nav nav-pills nav-fluid nav-fill mb-4" id="pills-tab" role="tablist">
      <li className="nav-item" role="presentation">
       <button
        className={`nav-link ${activeTab === 'edit' ? 'active' : ''}`}
        onClick={() => setActiveTab('edit')}
       >
        <i className="bi bi-pencil-square me-2"></i>Edit Diary
       </button>
      </li>
      <li className="nav-item" role="presentation">
       <button
        className={`nav-link ${activeTab === 'preview' ? 'active' : ''}`}
        onClick={() => setActiveTab('preview')}
       >
        <i className="bi bi-eye-fill me-2"></i>Preview
       </button>
      </li>
     </ul>

     <div
      className="tab-content"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
     >
      <div className={`tab-pane fade ${activeTab === 'edit' ? 'show active' : ''}`}>
       <div className="card-form">
        <div className="mb-4">
         <label htmlFor="class-select" className="form-label fw-medium">
          Class
         </label>
         <select
          id="class-select"
          value={className}
          onChange={e => setClassName(e.target.value)}
          className="form-select form-select-lg"
         >
          {classOptions.map(option => (
           <option key={option} value={option}>
            {option}
           </option>
          ))}
         </select>
        </div>

        <div className="mb-4">
         <h3 className="form-section-title">Subjects</h3>
         {subjects.map(subject => (
          <div key={subject.id} className="subject-item">
           <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="fw-semibold text-primary">{subject.name}</label>
            <button
             onClick={() => removeSubject(subject.id)}
             className="btn btn-sm btn-outline-danger"
            >
             <TrashIcon />
            </button>
           </div>
           <textarea
            value={subject.homework}
            onChange={e => handleSubjectChange(subject.id, 'homework', e.target.value)}
            rows="3"
            className="form-control"
            placeholder="Diary...."
           ></textarea>
          </div>
         ))}
         <div className="add-subject-section">
          <div className="row g-2">
           <div className={selectedSubject === 'Custom' ? 'col-6' : 'col-12'}>
            <select
             value={selectedSubject}
             onChange={e => setSelectedSubject(e.target.value)}
             className="form-select"
            >
             {predefinedSubjects.map(sub => (
              <option key={sub} value={sub}>
               {sub}
              </option>
             ))}
            </select>
           </div>
           {selectedSubject === 'Custom' && (
            <div className="col-6">
             <input
              type="text"
              value={customSubjectName}
              onChange={e => setCustomSubjectName(e.target.value)}
              placeholder="Custom Subject"
              className="form-control"
             />
            </div>
           )}
          </div>
          <button onClick={addSubject} className="btn btn-secondary w-100 mt-2">
           Add Subject
          </button>
         </div>
        </div>

        <div>
         <h3 className="form-section-title">Announcements</h3>
         <textarea
          value={announcements}
          onChange={e => setAnnouncements(e.target.value)}
          rows="4"
          className="form-control"
          placeholder="Any special notes..."
         ></textarea>
        </div>
       </div>
      </div>

      <div className={`tab-pane fade ${activeTab === 'preview' ? 'show active' : ''}`}>
       <div ref={diaryRef} className="diary-preview-content">
        <header className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-4">
         <div className="d-flex align-items-center gap-3">
          <SchoolIcon />
          <div>
           <h2 className="h5 fw-bold mb-0">{schoolName}</h2>
           <p className="text-muted mb-0 small">Satellite Town Campus</p>
          </div>
         </div>
         <div className="text-end">
          <p className="fw-semibold mb-0">{className}</p>
          <p className="text-muted mb-0 small">
           {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
           })}
          </p>
         </div>
        </header>
        <div className="table-responsive">
         <table className="table table-bordered diary-table">
          <thead>
           <tr>
            <th>Subject</th>
            <th>Homework</th>
           </tr>
          </thead>
          <tbody>
           {subjects.length > 0 ? (
            subjects.map(sub => (
             <tr key={sub.id}>
              <td className="fw-semibold">{sub.name}</td>
              <td>{sub.homework}</td>
             </tr>
            ))
           ) : (
            <tr>
             <td colSpan="2" className="text-center text-muted p-4">
              No subjects have been added for today.
             </td>
            </tr>
           )}
          </tbody>
         </table>
        </div>
        {announcements && (
         <div className="mt-4">
          <h3 className="h6 fw-semibold border-bottom pb-2 mb-2">Announcements & Notes</h3>
          <p className="announcement-box">{announcements}</p>
         </div>
        )}
        <footer className="text-center mt-4 pt-3 border-top text-muted small"></footer>
       </div>
      </div>
     </div>

     <div className="d-grid mt-4">
      <button onClick={downloadDiaryAsImage} className="btn btn-download btn-lg">
       <i className="bi bi-download me-2"></i>Download as Image
      </button>
     </div>
    </div>
   </div>
  );
}

