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
  const schoolName = 'Dar-e-Arqam School';
  const classOptions = [
   "Prep",
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
  const section = [
    "Boys",
    "Girls"
  ]
const quotes = [
    // Original Quotes
    "Jack of all trades is a master of none, but oftentimes better than a master of one.",
    "Education is the most powerful weapon which you can use to change the world.",

    // New Quotes on Learning & Curiosity
    "The beautiful thing about learning is that no one can take it away from you.",
    "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    "The expert in anything was once a beginner.",
    "Curiosity is the wick in the candle of learning.",
    "Learning is a treasure that will follow its owner everywhere.",
    "The only stupid question is the one that is never asked.",
    "An investment in knowledge pays the best interest.",
    "Today a reader, tomorrow a leader.",
    "The world is a book and those who do not travel read only one page.",

    // New Quotes on Effort & Perseverance
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "It does not matter how slowly you go as long as you do not stop.",
    "The secret of getting ahead is getting started.",
    "Mistakes are proof that you are trying.",
    "I have not failed. I've just found 10,000 ways that won't work.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Don't let what you cannot do interfere with what you can do.",
    "It’s not what happens to you, but how you react to it that matters.",
    "Perseverance is failing 19 times and succeeding the 20th.",
    "Practice makes progress, not perfect.",
    
    // New Quotes on Character & Kindness
    "Be the reason someone smiles today.",
    "No act of kindness, no matter how small, is ever wasted.",
    "Integrity is doing the right thing, even when no one is watching.",
    "In a world where you can be anything, be kind.",
    "The true test of character is how you treat someone who can do nothing for you.",
    "Be silly, be honest, be kind.",
    "Kindness is a language which the deaf can hear and the blind can see.",
    "Treat everyone with politeness and kindness, not because they are nice, but because you are.",
    "Make each day your masterpiece.",

    // New Quotes on Mindset & Attitude
    "The day is what you make it! So why not make it a great one?",
    "Believe you can and you're halfway there.",
    "Your attitude, not your aptitude, will determine your altitude.",
    "The only person you are destined to become is the person you decide to be.",
    "Every day may not be good, but there is something good in every day.",
    "A positive mindset brings positive things.",
    "You are capable of more than you know.",
    "What you think, you become. What you feel, you attract. What you imagine, you create.",

    // New Quotes on Dreams & Creativity
    "The future belongs to those who believe in the beauty of their dreams.",
    "Creativity is intelligence having fun.",
    "You can't use up creativity. The more you use, the more you have.",
    "All our dreams can come true if we have the courage to pursue them.",
    "The best way to predict the future is to create it.",
    "Every accomplishment starts with the decision to try.",
    "Logic will get you from A to B. Imagination will take you everywhere.",
    "Do something today that your future self will thank you for.",
    "Little by little, a little becomes a lot."
];
  const RandomQuote = () => {
    const [selectedQuote, setSelectedQuote] = useState('');

    useEffect(() => {
      // Select a random quote when the component loads
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setSelectedQuote(quotes[randomIndex]);
    }, []); // The empty array ensures this effect runs only once on mount

    return <>{selectedQuote}</>;
  };
  const predefinedSubjects = ['English', 'Urdu', 'Maths', 'Science', 'Islamiat', 'Quran', 'Custom'];

  const [className, setClassName] = useState(classOptions[4]);
  const [sectionName, setSectionName] = useState(section[0]);
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
    if (e.touches && e.touches.length > 0) {
      touchStartRef.current = e.touches[0].clientX;
    }
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
 
   setActiveTab('preview');

   setTimeout(() => {
     html2canvas(diaryRef.current, {
       scale: 2.5,
       padding: 10, 
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
         <div className="row g-2 align-items-end">
          <div className="col-md-6">
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
          <div className="col-md-6">
           <label htmlFor="section-select" className="form-label fw-medium">
            Section
           </label>
           <select
            id="section-select"
            className="form-select form-select-lg"
            value={sectionName}
            onChange={e => setSectionName(e.target.value)}
           >
            {section.map(option => (
             <option key={option} value={option}>
              {option}
             </option>
            ))}
           </select>
          </div>
         </div>
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
           <h2 className="h6 fw-bold mb-0">{schoolName}</h2>
           <p className="text-muted mb-0 small">Satellite Town Campus</p>
          </div>
         </div>
         <div className="text-end">
          <p className="fw-semibold mb-0">Class {className}, {sectionName}</p>
          <p className="text-muted mb-0 small">
           Diary of {new Date(date + 'T00:00:00').toLocaleDateString('en-US')}
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
        <div className="mt-4">
        </div>
        <footer className="text-center mt-4 pt-3 border-top text-muted small">
          <p className="">"<RandomQuote />"</p>
     <h3 className="h6 fw-semibold border-bottom pb-2 mb-2">Quote Of The Day</h3>

        </footer>
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

