'use client';

import { useState } from 'react';
import { sendContactEmail } from '@/app/actions/sendEmail';

const ContactModal = ({ show, onClose }) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [errorMessage, setErrorMessage] = useState('');

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('message', message);

    const result = await sendContactEmail(formData);

    if (result.success) {
      setStatus('success');
      setMessage('');
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 2000);
    } else {
      setStatus('error');
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Connect with Me</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        {status === 'success' ? (
          <div className="success-message">
            <i className="bi bi-check-circle-fill text-success fs-1 mb-3"></i>
            <p>Message sent successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="message" className="form-label">Send me an anonymous message:</label>
              <textarea
                id="message"
                className="form-control"
                rows="5"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            {status === 'error' && <p className="text-danger mt-2">{errorMessage}</p>}

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          backdrop-filter: blur(8px);
        }
        
        .modal-content {
          background: rgba(255, 255, 255, 0.85);
          color: black;
          padding: 2rem;
          border-radius: 24px; /* Matches photo-album-wrapper */
          border: 3px solid black; /* Matches article-card */
          width: 90%;
          max-width: 500px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 1051;
          backdrop-filter: blur(12px);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid rgba(0,0,0,0.1);
          padding-bottom: 1rem;
        }

        .modal-title {
          margin: 0;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 2rem;
          line-height: 1;
          cursor: pointer;
          color: inherit;
          transition: 0.2s;
        }
        
        .close-button:hover {
            transform: scale(1.1);
        }

        .form-control {
          background-color: transparent;
          border: 2px solid black;
          border-radius: 10px;
          color: black;
          resize: vertical;
          padding: 15px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: 0.2s;
        }

        .form-control:focus {
          background-color: rgba(255,255,255,0.5);
          border-color: black;
          box-shadow: none;
          outline: none;
          color: black; 
        }

        .modal-footer {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }
        
        .btn {
            font-weight: 600;
            padding: 0.2rem 1rem; /* Matches socialbutton roughly */
            border-radius: 5px;   /* Matches socialbutton */
            border: 1.7px solid black; /* Matches socialbutton */
            cursor: pointer;
            transition: 0.1s; /* Matches socialbutton */
            font-size: 1rem;
            background: transparent;
            color: black;
        }
        
        .btn:hover {
             background-color: black;
             color: white;
        }
        
        /* Secondary (Cancel) - same style, just needs to behave same */
        .btn-secondary {
            /* Inherits base .btn */
        }
        
        /* Primary (Send) - can start filled or outlined, but user asked for "existing button style" which is outlined -> hover filled */
        .btn-primary {
             /* Inherits base .btn */
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }
        
        /* Dark Mode */
        [data-theme="dark"] .modal-content {
            background: rgba(30, 30, 30, 0.85);
            color: white;
            border-color: white;
        }
        
        [data-theme="dark"] .modal-header {
             border-bottom-color: rgba(255,255,255,0.2);
        }

        [data-theme="dark"] .form-control {
             border-color: white;
             color: white;
        }
        
        [data-theme="dark"] .form-control::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }
        
        [data-theme="dark"] .form-control:focus {
            background-color: rgba(255,255,255,0.1);
        }
        
        [data-theme="dark"] .btn {
            color: white;
            border-color: white;
        }
        
        [data-theme="dark"] .btn:hover {
            background-color: white;
            color: black;
        }
      `}</style>
    </div>
  );
};

export default ContactModal;
