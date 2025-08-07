import Link from 'next/link';
import Footer from '@/sections/Footer';
export default function Projects() {
 return(
  <>
<div className="container mt-5">
 <h1><Link style={{textDecoration: 'none', color: 'inherit'}} href={"./"}> <i  className="bi bi-arrow-left-circle-fill"></i> </Link>Projects</h1>
 <div className="row mt-5">
  <div className="col-lg-3 mt-3">
    <div className="card-project card-green">
            <h2 className='card-heading-light'>teenVerse</h2>

    </div>
  </div>
 
  <div className="col-lg-3 mt-3"> <div className="card-project card-introtaps">
                      <h2 className='card-heading-dark '>IntroTaps</h2>

    </div></div>
     <div className="col-lg-3 mt-3"> <div className="card-project card-pink">
                <h2 className='card-heading-light urdutext'>دیوان غالب</h2>

    </div></div>
  <div className="col-lg-3 mt-3"> <div className="card-project card-publicnotepad">
                            <h2 className='card-heading-dark '><i className="bi bi-notepad"></i> PublicNotePad</h2>

    </div></div>
 </div>
</div>
<Footer />
  </>
 )
}