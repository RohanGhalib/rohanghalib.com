'use client';
import Photos from '@/components/Photos';
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
        <div className="about-me-layout">
          <div className="about-me-container">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                a: ({ node, ...props }) => <Link {...props} />,
                p: ({ node, ...props }) => <p className="markdown-paragraph" {...props} />,
                h2: ({ node, ...props }) => <h2 className="about-me-subheading" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
          <div className="about-me-photos">
            <Photos />
          </div>
        </div>
      </section>
    </div>
  );
}
