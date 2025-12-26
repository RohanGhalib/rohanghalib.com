"use client";
import React from 'react';

// --- Badge Data Configuration ---
const ROW_1 = [
  "https://img.shields.io/badge/Java-%23ED8B00.svg?style=flat&logo=openjdk&logoColor=white",
  "https://img.shields.io/badge/C%2B%2B-00599C?style=flat&logo=c%2B%2B&logoColor=white",
  "https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white",
  "https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black",
  "https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white",
  "https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white",
  "https://img.shields.io/badge/Rust-000000?style=flat&logo=rust&logoColor=white",
  "https://img.shields.io/badge/Swift-F05138?style=flat&logo=swift&logoColor=white",
  "https://img.shields.io/badge/Kotlin-7F52FF?style=flat&logo=kotlin&logoColor=white",
  "https://img.shields.io/badge/Dart-0175C2?style=flat&logo=dart&logoColor=white",
  "https://img.shields.io/badge/Ruby-CC342D?style=flat&logo=ruby&logoColor=white",
  "https://img.shields.io/badge/PHP-777BB4?style=flat&logo=php&logoColor=white",
  "https://img.shields.io/badge/C%23-%23239120.svg?style=flat&logo=c-sharp&logoColor=white",
  "https://img.shields.io/badge/Lua-2C2D72?style=flat&logo=lua&logoColor=white",
  "https://img.shields.io/badge/Flutter-%2302569B.svg?style=flat&logo=Flutter&logoColor=white",
  "https://img.shields.io/badge/react_native-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB",
  "https://img.shields.io/badge/Android-3DDC84?style=flat&logo=android&logoColor=white"
];

const ROW_2 = [
  "https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB",
  "https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white",
  "https://img.shields.io/badge/Vue.js-35495E?style=flat&logo=vue.js&logoColor=4FC08D",
  "https://img.shields.io/badge/Svelte-4A4A55?style=flat&logo=svelte&logoColor=FF3E00",
  "https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white",
  "https://img.shields.io/badge/Nuxt-002E3B?style=flat&logo=nuxt.js&logoColor=00DC82",
  "https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white",
  "https://img.shields.io/badge/Astro-BC52EE?style=flat&logo=astro&logoColor=white",
  "https://img.shields.io/badge/jQuery-0769AD?style=flat&logo=jquery&logoColor=white",
  "https://img.shields.io/badge/Bootstrap-563D7C?style=flat&logo=bootstrap&logoColor=white",
  "https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white",
  "https://img.shields.io/badge/Sass-CC6699?style=flat&logo=sass&logoColor=white",
  "https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white",
  "https://img.shields.io/badge/Redux-593D88?style=flat&logo=redux&logoColor=white",
  "https://img.shields.io/badge/Webpack-8DD6F9?style=flat&logo=webpack&logoColor=black"
];

const ROW_3 = [
  "https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white",
  "https://img.shields.io/badge/Deno-000000?style=flat&logo=deno&logoColor=white",
  "https://img.shields.io/badge/Express.js-404D59?style=flat",
  "https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white",
  "https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi",
  "https://img.shields.io/badge/Spring_Boot-F2F4F9?style=flat&logo=spring-boot",
  "https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white",
  "https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white",
  "https://img.shields.io/badge/Laravel-FF2D20?style=flat&logo=laravel&logoColor=white",
  "https://img.shields.io/badge/.NET-512BD4?style=flat&logo=dotnet&logoColor=white",
  "https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white",
  "https://img.shields.io/badge/MySQL-005C84?style=flat&logo=mysql&logoColor=white",
  "https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white",
  "https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white",
  "https://img.shields.io/badge/Firebase-039BE5?style=flat&logo=Firebase&logoColor=white",
  "https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white",
  "https://img.shields.io/badge/AWS-%23FF9900.svg?style=flat&logo=amazon-aws&logoColor=white",
  "https://img.shields.io/badge/Google_Cloud-%234285F4.svg?style=flat&logo=google-cloud&logoColor=white"
];

const ROW_4 = [
  "https://img.shields.io/badge/Linux-FCC624?style=flat&logo=linux&logoColor=black",
  "https://img.shields.io/badge/Ubuntu-E95420?style=flat&logo=ubuntu&logoColor=white",
  "https://img.shields.io/badge/Debian-A81D33?style=flat&logo=debian&logoColor=white",
  "https://img.shields.io/badge/Arch_Linux-1793D1?style=flat&logo=arch-linux&logoColor=white",
  "https://img.shields.io/badge/Fedora-51A2DA?style=flat&logo=fedora&logoColor=white",
  "https://img.shields.io/badge/Kali_Linux-557C94?style=flat&logo=kali-linux&logoColor=white",
  "https://img.shields.io/badge/Alpine_Linux-0D597F?style=flat&logo=alpine-linux&logoColor=white",
  "https://img.shields.io/badge/Windows-0078D6?style=flat&logo=windows&logoColor=white",
  "https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white",
  "https://img.shields.io/badge/Kubernetes-326CE5?style=flat&logo=kubernetes&logoColor=white",
  "https://img.shields.io/badge/Terraform-7B42BC?style=flat&logo=terraform&logoColor=white",
  "https://img.shields.io/badge/Ansible-EE0000?style=flat&logo=ansible&logoColor=white",
  "https://img.shields.io/badge/Jenkins-D24939?style=flat&logo=jenkins&logoColor=white",
  "https://img.shields.io/badge/GitLab_CI-FC6D26?style=flat&logo=gitlab&logoColor=white",
  "https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white",
  "https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white"
];

const ROW_5 = [
  "https://img.shields.io/badge/Arduino-00979D?style=flat&logo=arduino&logoColor=white",
  "https://img.shields.io/badge/Raspberry_Pi-A22846?style=flat&logo=raspberry-pi&logoColor=white",
  "https://img.shields.io/badge/Espressif-E7352C?style=flat&logo=espressif&logoColor=white",
  "https://img.shields.io/badge/GIT-E44C30?style=flat&logo=git&logoColor=white",
  "https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white",
  "https://img.shields.io/badge/VS_Code-007ACC?style=flat&logo=visual-studio-code&logoColor=white",
  "https://img.shields.io/badge/Vim-%2311AB00.svg?style=flat&logo=vim&logoColor=white",
  "https://img.shields.io/badge/Postman-FF6C37?style=flat&logo=postman&logoColor=white",
  "https://img.shields.io/badge/Figma-F24E1E?style=flat&logo=figma&logoColor=white",
  "https://img.shields.io/badge/Canva-%2300C4CC?style=flat&logo=Canva&logoColor=white",
  "https://img.shields.io/badge/Adobe%20Photoshop-31A8FF?style=flat&logo=Adobe%20Photoshop&logoColor=black",
  "https://img.shields.io/badge/Adobe%20Illustrator-FF9A00?style=flat&logo=Adobe%20Illustrator&logoColor=black",
  "https://img.shields.io/badge/Blender-E87D0D?style=flat&logo=blender&logoColor=white",
  "https://img.shields.io/badge/Unity-100000?style=flat&logo=unity&logoColor=white",
  "https://img.shields.io/badge/Unreal_Engine-313131?style=flat&logo=unreal-engine&logoColor=white",
  "https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat&logo=google-gemini&logoColor=white",
  "https://img.shields.io/badge/ChatGPT-74aa9c?style=flat&logo=openai&logoColor=white",
  "https://img.shields.io/badge/GitHub_Copilot-000000?style=flat&logo=githubcopilot&logoColor=white"
];

export default function TechMarquee() {
  return (
    <div className="tech-marquee-container">
      {/* We use 'global' styled-jsx to check the data-theme attribute on the body.
        If data-theme="dark", we set the background variable to your dark bg color (#121212).
        Otherwise, it defaults to white/transparent for light mode.
      */}
      <style jsx global>{`
        :root {
          --marquee-bg: #ffffff;
        }
        [data-theme="dark"] {
          --marquee-bg: #121212;
        }
      `}</style>

      <style jsx>{`
        .tech-marquee-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 10px 0;
          /* Use the variable defined above */
          --bg-fade: var(--marquee-bg);
        }

        /* Gradient Fades for Smooth Entrance/Exit */
        .tech-marquee-container::before,
        .tech-marquee-container::after {
          content: "";
          position: absolute;
          top: 0;
          width: 60px;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        /* Left Fade */
        .tech-marquee-container::before {
          left: 0;
          background: linear-gradient(to right, var(--bg-fade), transparent);
        }

        /* Right Fade */
        .tech-marquee-container::after {
          right: 0;
          background: linear-gradient(to left, var(--bg-fade), transparent);
        }

        .marquee-row {
          display: flex;
          width: 100%;
          margin-bottom: 8px; 
        }

        .track {
          display: flex;
          align-items: center;
          gap: 12px;
          white-space: nowrap;
          will-change: transform;
        }

        .track img {
          height: 24px;
          border-radius: 3px;
          transition: transform 0.2s ease, filter 0.2s ease;
        }
        
        .track img:hover {
          transform: scale(1.15);
          filter: brightness(1.1);
          z-index: 10;
          cursor: pointer;
        }

        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .animate-left {
          animation: scrollLeft 40s linear infinite;
        }
        
        .animate-right {
          animation: scrollRight 45s linear infinite;
        }

        .animate-left-fast {
          animation: scrollLeft 30s linear infinite;
        }

        .tech-marquee-container:hover .track {
          animation-play-state: paused;
        }
      `}</style>

      {/* Row 1: Languages (Left) */}
      <div className="marquee-row">
        <div className="track animate-left">
          {ROW_1.map((src, i) => <img key={`r1-a-${i}`} src={src} alt="tech" />)}
          {ROW_1.map((src, i) => <img key={`r1-b-${i}`} src={src} alt="tech" />)}
        </div>
      </div>

      {/* Row 2: Frameworks (Right) */}
      <div className="marquee-row">
        <div className="track animate-right">
          {ROW_2.map((src, i) => <img key={`r2-a-${i}`} src={src} alt="tech" />)}
          {ROW_2.map((src, i) => <img key={`r2-b-${i}`} src={src} alt="tech" />)}
        </div>
      </div>

      {/* Row 3: Backend (Left Fast) */}
      <div className="marquee-row">
        <div className="track animate-left-fast">
          {ROW_3.map((src, i) => <img key={`r3-a-${i}`} src={src} alt="tech" />)}
          {ROW_3.map((src, i) => <img key={`r3-b-${i}`} src={src} alt="tech" />)}
        </div>
      </div>

      {/* Row 4: DevOps (Right) */}
      <div className="marquee-row">
        <div className="track animate-right">
          {ROW_4.map((src, i) => <img key={`r4-a-${i}`} src={src} alt="tech" />)}
          {ROW_4.map((src, i) => <img key={`r4-b-${i}`} src={src} alt="tech" />)}
        </div>
      </div>

       {/* Row 5: Hardware & Tools (Left) */}
       <div className="marquee-row">
        <div className="track animate-left">
          {ROW_5.map((src, i) => <img key={`r5-a-${i}`} src={src} alt="tech" />)}
          {ROW_5.map((src, i) => <img key={`r5-b-${i}`} src={src} alt="tech" />)}
        </div>
      </div>

    </div>
  );
}