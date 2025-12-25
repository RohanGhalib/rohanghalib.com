"use client";
import Link from "next/link"
import { Typewriter } from 'react-simple-typewriter';
import ReactDOM from 'react-dom';
import SpotifyWidget from '@/components/SpotifyWidget';
import { useTheme } from "next-themes";

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

  

{/* <p className="mb-4"><i><Typewriter
                words={['Skilled Tech enthusiast', 'CS Student.', 'Open Source Contributor', 'Member of Islami Jamiat Talba', 'President Social Society @ KIPS College', 'Vector Artist who believes in simple art.', 'Pakistani Citizen .', 'Software Engineer', 'Noob Writer', 'Club Leader @ HackClub', 'Founder @ TeenVerse', 'Co Founder @ IntroTaps', 'Music Afficionado', 'Hobbbyist in Blending Urdu into modern Tech.', 'Poetry Lover', 'President School Units @ Bazm-e-Paigham Bahawalpur', 'Leader @ CodeForPakistan Bahawalpur Chapter', 'A Youngster who is still trying to understand his identity.', 'Captures everyone, Captured by none.', 'Ex Arqamite.', 'Ex Educatorian.', 'Hafiz e Quran', 'Not good at all in sports.', 'Unsure about the future, Just going with the flow', 'Loves Photography But cant do it.', 'Cinematography is amazing.' ] }
                loop={true} // Set to true to loop indefinitely
                cursor
                cursorStyle='🙂'
                typeSpeed={20}
                deleteSpeed={5}
                delaySpeed={700}
              /></i></p>*/}
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
