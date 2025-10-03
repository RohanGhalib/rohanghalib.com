"use client";
import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./style.css";

function App() {
  const today = new Date().toISOString().slice(0, 10);
     // A lookup table for special options
  const specialOptions = {
    SPECIAL: "پارے کی تیاری ⌚",
    LONG: "پارے کا ٹیسٹ 📃",
    REVISION: "غیرحاظر ⚠️",
    HOLIDAY: "کچھ نہیں سنایا ❌",
  };
  // rows: { name, sabaq, sabqi, manzil, mutala, arqam }
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState("a"); // default section
  const [authenticated, setAuthenticated] = useState(false);
  const [tier, setTier] = useState(null);

  // Helper defaults
  const defaultRowForName = (name) => ({
    name,
    sabaq: "✅",
    sabqi: "✅",
    manzil: "✅",
    mutala: "✅",
    arqam: "✅",
  });

  useEffect(() => {
    const username = prompt("Enter username:");
    const password = prompt("Enter password to access the Hifz report:");

    // Tier 1: full access
    if (username === "das" && password === "das2024") {
      setAuthenticated(true);
      setTier(1);
      return;
    }

    // Tier 2: section-limited access
    const tier2Users = {
      "userb": { password: "b2024", section: "b" },
      "userc": { password: "c2024", section: "c" },
      "userd": { password: "d2024", section: "d" },
      "usere": { password: "e2024", section: "e" },
      "userf": { password: "f2024", section: "f" },
    };
 

    if (
      tier2Users[username] &&
      password === tier2Users[username].password
    ) {
      setAuthenticated(true);
      setTier(2);
      setSection(tier2Users[username].section);
      return;
    }
    alert("Incorrect username or password. Access denied.");
    window.location.href = "https://rohanghalib.com";
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
          // convert names to rows with defaults
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



  // Save PNG
  const saveAsImage = () => {
    const reportTable = document.getElementById("reportTable");

    html2canvas(reportTable, {
      backgroundColor: "#ffffff",
      scale: 4, // high resolution
      padding: 20
    }).then(async (canvas) => {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `hifz-report-${today}.png`, { type: "image/png" });

        const link = document.createElement("a");
        link.download = file.name;
        link.href = URL.createObjectURL(file);
        link.click();

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: "Hifz Report",
              text: "Here is the Hifz report 📄",
              files: [file],
            });
            console.log("Shared successfully");
          } catch (err) {
            console.error("Sharing cancelled or failed:", err);
          }
        } else {
          const imageURL = link.href;
          const whatsappURL = "https://wa.me/?text=" + encodeURIComponent("Check this Hifz report 👇\n" + imageURL);
          window.open(whatsappURL, "_blank");
        }
      });
    });
  };

  // Open CSV editor (edit names only)
  const openEditor = () => {
    setEditing(true);
    setCsvText(rows.map(r => r.name).join("\n"));
  };

  // Save CSV (names only to Firestore), then rebuild rows with defaults
  const saveCsv = async () => {
    const newNames = csvText.split("\n").map(n => n.trim()).filter(Boolean);

    setEditing(false);
    setLoading(true);

    try {
      await setDoc(doc(db, "data", section), { names: newNames });

      // refresh rows from saved names
      const snap = await getDoc(doc(db, "data", section));
      if (snap.exists()) {
        const names = snap.data().names || [];
        setRows(names.map(n => defaultRowForName(n)));
      }

      console.log("Saved ✅");
    } catch (err) {
      alert("Save failed ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <select
        value={section}
        onChange={e => setSection(e.target.value)}
        disabled={tier === 2}
        style={{ marginBottom: 16, padding: "6px 12px", fontSize: 16, borderRadius: 6 }}
      >
        <option value="a">Section A</option>
        <option value="b">Section B</option>
        <option value="c">Section C</option>
        <option value="d">Section D</option>
        <option value="e">Section E</option>
        <option value="f">Section F</option>
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
          سیکشن "{section}" کی رپورٹ: &nbsp;&nbsp;&nbsp;&nbsp; &nbsp; تاریخ: {today}
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
      value={row.sabaq}   // ✅ This makes it controlled
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
          {/* Sabaq select with all options */}
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

          {/* Normal other columns */}
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

export default App;
