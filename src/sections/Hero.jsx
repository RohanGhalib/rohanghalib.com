"use client";
import Badges from "@/components/Badges";
import Link from "next/link"
import ReactDOM from 'react-dom';
import SpotifyWidget from '@/components/SpotifyWidget';
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";
export default function Hero() {
  ReactDOM.preload("/profile.jpg", { as: "image" });
  const { theme } = useTheme();

 return (
    <>
    <div className="container mt-5">
    <div className="row">
    <div className="col-lg-6">  
    <img className="profilepicture" src="/profile.jpg" alt="" />
    <h1 className="mt-4">Muhammad Rohan Ghalib</h1>

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
    <br /> <br /><br />
    
    <Badges />
   </div>
    <div className="col-lg-6 mt-3">
    <SpotifyWidget isDark={theme === 'dark'} />      <p className="mt-5 text-end">

      <br />
         <span className="urdutext fs-2">رنگ محفل چاہتا ہے اک مکمل انقلاب
          <br />

چند شمعوں کے بھڑکنے سے سحر ہوتی نہیں

</span><br />
<i> — Iqbal Ajmeri </i>
      <br />
  
      </p>
    </div>
    </div>
    </div>
   </>
 )
}
