import Link from "next/link" 
export default function AboutMe() {
return (
 <div className="container mt-5">
     
      <section id="about-me">
        <br />
  <h1>About Me</h1>
<br /><br />
  <section>
    <h2><i className="bi bi-cpu-fill"></i> Computers!</h2>
    <p>
      I spend most of my time building things — with code, creativity, and caffeine. I love programming not just as a skill but as an art form. Whether I’m debugging a stubborn PHP issue or designing a smooth React interface, I find joy in perfecting every detail.
    </p>
    <p>
      I’ve worked with HTML, CSS, JS, PHP, Laravel, MySQL, Bootstrap, and more recently, I’ve been diving deeper into React, Tailwind, and other modern stacks. I’ve built and deployed dozens of side projects, from full-featured crypto platforms to personal utilities and mini-games. Some are featured in my portfolio — others live quietly in my local folders, waiting for their moment.
    </p>
    <p>
      I love understanding how systems work and often lose track of time diving into performance optimizations, elusive frontend bugs, or obscure Ubuntu tweaks. I daily drive Windows for compatibility but tinker with Linux when I need more control — I even made my own distro, <strong>GhalibOS</strong>!
    </p>
    <p>
      I use <strong>Illustrator</strong> and <strong>Photoshop</strong> for all my design work, and yes, I tweak every pixel.
    </p>
    <Link href="/" className="socialbutton">Read More <i className="bi bi-arrow-up-right-circle-fill"></i></Link>

  </section>
<br /><br />
  <section> 
    <h2><i className="bi bi-moon-fill"></i> Islami Jamiat Talaba (IJT)</h2>
    <p>
      I’m proud to be associated with <strong>Islami Jamiat Talaba Pakistan</strong>, where I contribute my skills to meaningful causes. Through IJT, I’ve helped organize events, design social media campaigns, and lead awareness initiatives.
    </p>
    <p>
      Being part of IJT is more than community service — it’s part of my identity and spiritual journey. It teaches me discipline, unity, and how to lead with purpose.
    </p>
        <Link href="/" className="socialbutton">Read More <i className="bi bi-arrow-up-right-circle-fill"></i></Link>

  </section>
<br /><br />
  <section>
    <h2><i className="bi bi-dice-5-fill"></i> Hack Club</h2>
    <p>
      Joining <strong>Hack Club</strong> was a turning point in my journey. It connected me to a global network of young builders and dreamers. My GitHub activity exploded after joining, and my hunger to learn — from low-level systems to creative web apps — only grew.
    </p>
    <p>
      Hack Club is where I first explored collaborative coding and started sharing my work with confidence. Whether it’s writing shell scripts, building hackable tools, or contributing to open-source, I feel right at home in that community.
    </p>
        <Link href="/" className="socialbutton">Read More <i className="bi bi-arrow-up-right-circle-fill"></i></Link>

  </section>
  <br /><br />
   <section>
  <h2><i className="bi bi-music-note"></i> Poetry & Music</h2>
  <p>
    I find peace and perspective in poetry, especially the works of Allama Iqbal and contemporary Urdu poets. Their words fuel both my thoughts and creativity.
  </p>
  <p>
    When it comes to music, I’m more of a listener than a composer — you’ll often find me tuned into thoughtful playlists on Spotify while working or winding down.
  </p>
      <Link href="/" className="socialbutton">Read More <i className="bi bi-arrow-up-right-circle-fill"></i></Link>

</section>

</section>

   </div>
)
}