const admin = require('firebase-admin');
// IMPORTANT: Replace with the path to your service account key json file
const serviceAccount = require('./primal-hybrid-312109-firebase-adminsdk-biu05-39bb132f92.json');
const data = require('./articles.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// The articles are in the 'data' property of the third object in the array
const articles = data[2].data;

articles.forEach(async (article) => {
  try {
    await db.collection('articles').add({
      title: article.title,
      description: article.description,
      content: article.content,
      // Adding a placeholder for published_at since it's not in the JSON
      published_at: new Date()
    });
    console.log(`Added article: ${article.title}`);
  } catch (error) {
    console.error(`Error adding article: ${article.title}`, error);
  }
});
