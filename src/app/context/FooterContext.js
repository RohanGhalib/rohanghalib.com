'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/app/das/firebase';
import { doc, getDoc } from 'firebase/firestore';

const FooterContext = createContext();

export function FooterProvider({ children }) {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      const docRef = doc(db, 'siteContent', 'content');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFooterData(docSnap.data().footer);
      } else {
        console.log("No such document!");
      }
    };

    fetchFooterData();
  }, []);

  return (
    <FooterContext.Provider value={footerData}>
      {children}
    </FooterContext.Provider>
  );
}

export function useFooterData() {
  return useContext(FooterContext);
}
