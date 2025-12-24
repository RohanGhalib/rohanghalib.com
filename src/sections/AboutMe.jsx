'use client';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';

export default function AboutMe({ content }) {
  return (
    <div className="container mt-5">
      <section id="about-me">
        <br />
        <h1>About Me</h1>
        <br /><br />
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            a: ({ node, ...props }) => <Link {...props} />
          }}
        >
          {content}
        </ReactMarkdown>
      </section>
    </div>
  );
}
