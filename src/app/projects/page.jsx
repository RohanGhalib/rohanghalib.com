import Link from 'next/link';
import Footer from '@/sections/Footer';
export default function Projects() {
 return(
  <>
<div className="container mt-5">
 <h1><Link style={{textDecoration: 'none', color: 'inherit'}} href={"./"}> <i  className="bi bi-arrow-left-circle-fill"></i> </Link>Projects</h1>
</div>
<Footer />
  </>
 )
}