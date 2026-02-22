const { initializeApp } = require('firebase/app');
const { getFirestore, collection, writeBatch, doc } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

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

const projectsData = [
    { id: 'drivebags', title: 'DriveBags', url: 'https://drivebags.rohanghalib.com', cssClass: 'card-drivebags', headingClass: 'card-heading-dark' },
    { id: 'introtaps', title: 'IntroTaps', url: 'https://introtaps.com', cssClass: 'card-introtaps', headingClass: 'card-heading-dark' },
    { id: 'deevan', title: 'دیوان غالب', url: 'https://deevan.rohanghalib.com/', cssClass: 'card-pink', headingClass: 'card-heading-light urdutext' },
    { id: 'publicnotepad', title: 'PublicNotePad', url: 'https://rohanghalib.com/publicnotepad', cssClass: 'card-publicnotepad', headingClass: 'card-heading-dark', icon: 'bi-notepad' },
    { id: 'das', title: 'Dar-e-Arqam Reporting', url: 'https://rohanghalib.com/das', cssClass: 'card-das', headingClass: 'card-heading-light', icon: 'bi-notepad' },
    { id: 'teenverse', title: 'teenVerse', url: 'https://teenverse.org', cssClass: 'card-green', headingClass: 'card-heading-light' },
    { id: 'sr-u2764', title: 'SR-U2764', url: 'https://github.com/RohanGhalib/SR-U2764', cssClass: 'card-keyboard', headingClass: 'card-heading-light', icon: 'bi-notepad' },
    { id: 'routefast', title: 'RouteFast', url: 'https://github.com/RohanGhalib/ghalibroutes', cssClass: 'card-publicnotepad', headingClass: 'card-heading-dark', icon: 'bi-notepad' },
    { id: 'khushkhush', title: 'KhushKhush', url: 'https://khushkhush.com', cssClass: 'card-publicnotepad', headingClass: 'card-heading-dark', icon: 'bi-notepad' }
];

async function migrate() {
    console.log('Starting migration...');
    const batch = writeBatch(db);

    // Using a counter so they appear in a certain order by default if needed
    let order = 0;
    for (const project of projectsData) {
        order++;
        const { id, ...data } = project;
        const ref = doc(db, 'projects', id);
        batch.set(ref, { ...data, order });
    }

    await batch.commit();
    console.log('Migration completed successfully!');
    process.exit(0);
}

migrate().catch(console.error);
