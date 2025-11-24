"use client";

// 1. Check your imports! 
// If firebase.js is in the folder ABOVE this one, use "../firebase"
import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { db } from "./firebase"; // <--- CHANGE THIS if firebase is in a different folder
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import "./style.css"; // <--- Ensure this file exists in the same folder

// 2. Renamed function to 'Page' to satisfy Next.js conventions
export default function Page() {
  const today = new Date().toISOString().slice(0, 10);

  // --- CONFIGURATION ---
  const BOYS_PASSWORD = "das";   
  const GIRLS_PASSWORD = "girls"; 
  // ---------------------

  const specialOptions = {
    SPECIAL: "پارے کی تیاری ⌚",
    LONG: "پارے کا ٹیسٹ 📃",
    REVISION: "غیرحاظر ⚠️",
    HOLIDAY: "کچھ نہیں سنایا ❌",
    LEAVE: "رخصت پر ہیں 💊",
  };

  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableSections, setAvailableSections] = useState([]); 
  const [section, setSection] = useState(""); 
  const [authenticated, setAuthenticated] = useState(false);

  const defaultRowForName = (name) => ({
    name,
    sabaq: "✅",
    sabqi: "✅",
    manzil: "✅",
    mutala: "✅",
    arqam: "✅",
  });

  useEffect(() => {
    // Only run this in the browser
    if (typeof window === "undefined") return;

    const checkAuthAndLoad = async () => {
      // Small timeout to ensure React creates the UI before prompt blocks it
      await new Promise(r => setTimeout(r, 100));
      
      const password = window.prompt("Enter Access Password:");
      
      let isGirlsMode = false;

      if (password === GIRLS_PASSWORD) {
        isGirlsMode = true;
      } else if (password === BOYS_PASSWORD) {
        isGirlsMode = false;
      } else {
        alert("Incorrect password. Access denied.");
        window.location.href = "https://rohanghalib.com";
        return;
      }

      setAuthenticated(true);
      setLoading(true);

      try {
        const querySnapshot = await getDocs(collection(db, "data"));
        const validSections = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const isGirlSection = data.girl === true;
          const displayTitle = data.title || docSnap.id.toUpperCase(); 

          const sectionObj = {
            id: docSnap.id,
            title: displayTitle
          };

          if (isGirlsMode && isGirlSection) {
            validSections.push(sectionObj);
          } else if (!isGirlsMode && !isGirlSection) {
            validSections.push(sectionObj);
          }
        });

        validSections.sort((a, b) => a.title.localeCompare(b.title));
        setAvailableSections(validSections);

        if (validSections.length > 0) {
          setSection(validSections[0].id);
        }
      } catch (error) {
        console.error("Error loading sections:", error);
        alert("Error loading sections from database. Check console.");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoad();
  }, []);

  useEffect(() => {
    if (!section) return;

    const loadCsv = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "data", section);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const names = snap.data().names || [];
          setRows(names.map(n => defaultRowForName(n)));
        } else {
          setRows([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadCsv();
  }, [section]);

  const handleChange = (index, field, value) => {
    setRows((prev) => {
      const updated = [...prev];
      const row = { ...updated[index] };

      if (field === "sabaq") {
        row.sabaq = value;
        if (specialOptions[value]) {
          row.isSpecial = true;
          row.specialText = specialOptions[value];
        } else {
          row.isSpecial = false;
          row.specialText = null;
        }
      } else {
        row[field] = value;
      }

      updated[index] = row;
      return updated;
    });
  };

  const saveAsImage = () => {
    const reportTable = document.getElementById("reportTable");
    const currentSectionObj = availableSections.find(s => s.id === section);
    const fileNameTitle = currentSectionObj ? currentSectionObj.title : section;

    html2canvas(reportTable, {
      backgroundColor: "#ffffff",
      scale: 4, 
      padding: 50,
    }).then(async (canvas) => {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `hifz-report-${fileNameTitle}-${today}.png`, { type: "image/png" });
        const link = document.createElement("a");
        link.download = file.name;
        link.href = URL.createObjectURL(file);
        link.click();
        alert("Image Saved to Gallery!");
      });
    });
  };

  const openEditor = () => {
    setEditing(true);
    setCsvText(rows.map(r => r.name).join("\n"));
  };

  const saveCsv = async () => {
    const newNames = csvText.split("\n").map(n => n.trim()).filter(Boolean);
    setEditing(false);
    setLoading(true);

    try {
      const docRef = doc(db, "data", section);
      const snap = await getDoc(docRef);
      const currentData = snap.exists() ? snap.data() : {};
      
      await setDoc(docRef, { ...currentData, names: newNames });

      const names = newNames;
      setRows(names.map(n => defaultRowForName(n)));
      console.log("Saved ✅");
    } catch (err) {
      alert("Save failed ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSectionTitle = () => {
    const found = availableSections.find(s => s.id === section);
    return found ? found.title : section;
  };

  if (!authenticated) return <div className="loader" style={{margin:"50px auto"}}></div>;

  return (
    <div className="app-container">
      <select
        value={section}
        onChange={e => setSection(e.target.value)}
        style={{ marginBottom: 16, padding: "6px 12px", fontSize: 16, borderRadius: 6, textTransform: 'capitalize' }}
      >
        {availableSections.length === 0 && <option>No sections found</option>}
        {availableSections.map((secObj) => (
           <option key={secObj.id} value={secObj.id}>
             {secObj.title}
           </option>
        ))}
      </select>

      <button className="edit-btn" onClick={openEditor} style={{ marginLeft: 12, padding: "6px 16px", borderRadius: 6 }}>
        ✏️ ناموں کی فہرست ترمیم کریں
      </button>

      {editing && (
        <div className="csv-editor" style={{ margin: "20px 0", background: "#f9f9f9", padding: 16, borderRadius: 8 }}>
          <textarea
            className="csv-textarea"
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            style={{ width: "100%", minHeight: 120, fontSize: 16, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          ></textarea>
          <button className="save-btn" onClick={saveCsv} style={{ marginTop: 10, padding: "6px 16px", borderRadius: 6 }}>
            💾 فہرست محفوظ کریں
          </button>
        </div>
      )}

      <div className="table-wrapper" id="reportTable" style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #eee", padding: 2, marginTop: 24 }}>
        <img src="/daslogo.png" height={56} alt="" style={{ marginBottom: 12 }} />
        
        <h5 style={{ marginBottom: 18, fontWeight: 600, fontSize: 18 }}>
           {getCurrentSectionTitle()} کی رپورٹ: &nbsp;&nbsp;&nbsp;&nbsp; &nbsp; تاریخ: {today}
        </h5>
        
        {loading && <div className="loader"></div>}

        <table className="report-table" style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 16,
          background: "#fafcff",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 1px 4px #ddd"
        }}>
          <thead>
            <tr style={{ background: "#e3eafc" }}>
              <th style={{ padding: "10px 8px", border: "1px solid #dbeafe", fontWeight: 700 }}>#</th>
              <th style={{ padding: "10px 8px", border: "1px solid #dbeafe", fontWeight: 700 }}>نام</th>
              <th style={{ padding: "10px 8px", border: "1px solid #dbeafe", fontWeight: 700 }}>سبق</th>
              <th style={{ padding: "10px 8px", border: "1px solid #dbeafe", fontWeight: 700 }}>سبقی</th>
              <th style={{ padding: "10px 8px", border: "1px solid #dbeafe", fontWeight: 700 }}>منزل</th>
              <th style={{ padding: "10px 8px", border: "1px solid #dbeafe", fontWeight: 700 }}>مطالعہ</th>
              <th style={{ padding: "10px 8px", border: "1px solid #dbeafe", fontWeight: 700 }}>ارقم بک</th>
            </tr>
          </thead>

        <tbody>
  {rows.map((row, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{row.name}</td>

      {row.isSpecial ? (
        <td colSpan={5} style={{ textAlign: "center", fontWeight: "bold" }}>
    <select
      value={row.sabaq}   
      onChange={(e) => handleChange(index, "sabaq", e.target.value)}
    >
      {Object.keys(specialOptions).map((key) => (
        <option key={key} value={key}>
          {specialOptions[key]}
        </option>
      ))}
      <option value="✅">✅</option>
      <option value="❌">❌</option>
      <option value="❗">❗</option>
    </select>
  </td>
      ) : (
        <>
          <td>
            <select
              value={row.sabaq}
              onChange={(e) => handleChange(index, "sabaq", e.target.value)}
            >
              <option value="✅">✅</option>
              <option value="❌">❌</option>
              <option value="❗">❗</option>
              {Object.keys(specialOptions).map((key) => (
              <option key={specialOptions[key]} value={key}>
                {specialOptions[key]}
              </option>
            ))}
            </select>
          </td>

          <td>
            <select
              value={row.sabqi}
              onChange={(e) => handleChange(index, "sabqi", e.target.value)}
            >
              <option value="✅">✅</option>
              <option value="❌">❌</option>
              <option value="❗">❗</option>
            </select>
          </td>
          <td>
            <select
              value={row.manzil}
              onChange={(e) => handleChange(index, "manzil", e.target.value)}
            >
              <option value="✅">✅</option>
              <option value="❌">❌</option>
              <option value="❗">❗</option>
            </select>
          </td>
          <td>
            <select
              value={row.mutala}
              onChange={(e) => handleChange(index, "mutala", e.target.value)}
            >
              <option value="✅">✅</option>
              <option value="❌">❌</option>
              <option value="❗">❗</option>
            </select>
          </td>
          <td>
            <select
              value={row.arqam}
              onChange={(e) => handleChange(index, "arqam", e.target.value)}
            >
              <option value="✅">✅</option>
              <option value="❌">❌</option>
              <option value="❗">❗</option>
            </select>
          </td>
        </>
      )}
    </tr>
  ))}
</tbody>

        </table>

        <div style={{ marginTop: 12, fontSize: 15, color: "#555" }}>
          نوٹ: ✅ مکمل، ❌ نامکمل، ❗ بہتری کی ضرورت
        </div>
      </div>

      <button onClick={saveAsImage} className="save-btn" style={{ marginTop: 24, padding: "8px 20px", fontSize: 17, borderRadius: 8 }}>
        📥 Save Report
      </button>
    </div>
  );
}