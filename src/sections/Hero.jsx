"use client";
import Link from "next/link"
import { Typewriter } from 'react-simple-typewriter';
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
    <ReactMarkdown>

![Next.js](https://img.shields.io/badge/Next.js-black?style=flat\&logo=next.js\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat\&logo=vite\&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-%23FF2D20.svg?style=flat\&logo=laravel\&logoColor=white)
![React](https://img.shields.io/badge/React-%23007ACC.svg?style=flat\&logo=react\&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-%23039BE5.svg?style=flat\&logo=firebase)
![MySQL](https://img.shields.io/badge/MySQL-%2300f.svg?style=flat\&logo=mysql\&logoColor=white)


![GitHub Actions](https://img.shields.io/badge/GitHub%20Automations-2088FF?style=flat\&logo=githubactions\&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=flat\&logo=cloudflare\&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=flat\&logo=linux\&logoColor=black)
![Windows](https://img.shields.io/badge/Windows-0078D6?style=flat\&logo=windows\&logoColor=white)


![Figma](https://img.shields.io/badge/Figma-%23F24E1E.svg?style=flat\&logo=figma\&logoColor=white)
![Photoshop](https://img.shields.io/badge/Photoshop-31A8FF?style=flat\&logo=adobephotoshop\&logoColor=white)
![Illustrator](https://img.shields.io/badge/Illustrator-FF9A00?style=flat\&logo=adobeillustrator\&logoColor=white)


![Python](https://img.shields.io/badge/Python-3776AB?style=flat\&logo=python\&logoColor=white)
![Raspberry Pi 5](https://img.shields.io/badge/Raspberry%20Pi-CC0000?style=flat\&logo=raspberrypi\&logoColor=white)    </ReactMarkdown>
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
