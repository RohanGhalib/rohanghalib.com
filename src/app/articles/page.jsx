import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/sections/Footer'), { loading: () => <p>Loading...</p> });

export default function Articles() {
  return (
    <>
    <div className='container'>
        <br />
      <h1>My Articles</h1>
      <br />
      <br />
      <div className='row'>
        <div className='col-md-4'>
          <Link href='/articles/1' className='a-to-minimize'>
            <div className='article-card'>
              <h3>Article Title 1</h3>
              <p>A short description of the article...</p>
            </div>
          </Link>
        </div>
        {/* Add more articles here */}
      </div>
    </div>
      <Footer />
      </>

  );
}
