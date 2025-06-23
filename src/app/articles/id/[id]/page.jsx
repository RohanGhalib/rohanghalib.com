export default function ArticlePage({ params }) {
  const { id } = params;

  return (
    <div className="container mt-5">
      <h1>Article ID: {id}</h1>
      <p>This is a placeholder for the article content.</p>
      <p>You can fetch and display the article details based on the ID here.</p>
    </div>
  );
}

