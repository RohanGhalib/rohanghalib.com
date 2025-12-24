'use client';
import Link from "next/link"
import { Typewriter } from 'react-simple-typewriter';
import ReactDOM from 'react-dom';
import useSWR from 'swr';
import SpotifyPlayer from "./SpotifyPlayer";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Hero() {
  ReactDOM.preload("/profile.jpg", { as: "image" });
  const { data: nowPlayingData, error: nowPlayingError } = useSWR('/api/now-playing', fetcher);

 return (
    <>
    <div className="container mt-5">
    <div className="row">
    <div className="col-lg-6">  
    <img className="profilepicture" src="/profile.jpg" alt="" />
    <h1 className="mt-4">Muhammad Rohan Ghalib</h1>
    {nowPlayingData && nowPlayingData.isPlaying && (
      <p className="mb-4">
        Currently Listening to: {nowPlayingData.title} by {nowPlayingData.artist}
      </p>
    )}
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
    <SpotifyPlayer />
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
