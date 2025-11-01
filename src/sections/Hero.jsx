import Link from "next/link"
export default function Hero() {

 return (
    <>
    <div className="container mt-5">
    <div className="row">
    <div className="col-lg-6">  
    <img className="profilepicture" src="/profile.jpg" alt="" />
    <h1 className="mt-4">Muhammad Rohan Ghalib</h1>
    <p className="mb-4"><i>Skilled tech enthusiast and CS Student from Pakistan whose dream is <u>Tech Revolution in his Country</u></i></p>
    <a href="https://instagram.com/rohanghalib" className="socialbutton"><i className="bi bi-instagram"></i></a>
    <a href="https://github.com/rohanghalib" className="ms-2 mt-2 socialbutton"><i className="bi bi-github"></i></a>
    <a href="https://facebook.com/rohanghalib" className="ms-2 mt-2 socialbutton"><i className="bi bi-facebook"></i></a>
    <a href="https://discord.com/rohanghalib" className="ms-2 mt-2 socialbutton"><i className="bi bi-discord"></i></a>
    <a href="https://linkedin.com/in/rohanghalib" className="ms-2 mx-2 mt-2 socialbutton"><i className="bi bi-linkedin"></i></a>
        <a href="mailto:muhammadrohanghalib@gmail.com" className="   socialbutton"><i className="bi bi-envelope-at-fill"></i></a>
<br />
<br />
        <Link href="/projects" className="socialbutton">My Projects <i className="bi bi-arrow-up-right-circle-fill"></i></Link>
<br /><br />
    <Link href="/articles" className="socialbutton mt-5">Read My Articles <i className="bi bi-arrow-up-right-circle-fill"></i></Link>

    </div>
    <div className="col-lg-6">
   <div className="spotifyplayer mt-3">
  <iframe style={{ borderRadius: "12px" }} src="https://open.spotify.com/embed/playlist/4nLGl7FR7LNNjblONwy0Dp?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0"  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" ></iframe>
  <p className="mt-5 text-end">

  Remember That Iqbal Said: <br />
     <span className="urdutext fs-2">جنون عشق سے تو خدا بھی نہ بچ سکا اقبال<br />
  تعریف حسن یار میں سارا قران لکھ دیا</span>
  <br /><br /><br />
  And Someone Said: <br />
  <span className="urdutext fs-2">
   عجیب سی بیتابی ہے تیرے بنا کے <br />
   رہ بھی لیتے ہیں اور رہا بھی نہیں جاتا

  </span>
  </p>
   </div>
    </div>
    </div>
    </div>
   </>
 )
}