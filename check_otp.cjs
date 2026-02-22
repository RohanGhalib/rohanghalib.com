const { getFirestore, query, collection, orderBy, limit, getDocs } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');

// Must match the config used by the Next.js app 
const firebaseConfig = {
    apiKey: "AIzaSyC5iRanMTNkHYzdaTT7RPK5Y11Zz_Gi5Qs",
    authDomain: "primal-hybrid-312109.firebaseapp.com",
    projectId: "primal-hybrid-312109",
    storageBucket: "primal-hybrid-312109.appspot.com",
    messagingSenderId: "965041353877",
    appId: "1:965041353877:web:562f8912fd6d2f1c4ed79c",
    measurementId: "G-BDTB2EQX29"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkOTP() {
    console.log("Checking Firestore for recent OTPs...");
    try {
        const q = query(collection(db, 'admin_otps')); // Removed orderBy to see all first
        const docs = await getDocs(q);

        if (docs.empty) {
            console.log("No OTPs found in admin_otps collection.");
        }

        docs.forEach(doc => {
            console.log(`Document ID: ${doc.id}`);
            console.log('OTP Data:', doc.data());
            console.log('------------------------');
        });
    } catch (err) {
        console.error("Error fetching OTPs:", err);
    }
    process.exit(0);
}

checkOTP();
