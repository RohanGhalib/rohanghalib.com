import Link from "next/link";

export default function AboutMe() {
  return (
    <div className="container mt-5">
      <section id="about-me">
        <br />
        <h1>About Me</h1>
        <br />
        <br />
        <section>
          <h2>
            <i className="bi bi-cpu-fill"></i> Computers!
          </h2>
          <p>
            I spend most of my time building things{" "}
            <i className="bi bi-tools"></i> because I genuinely enjoy the
            process. I view programming as a craft, so whether I’m debugging a{" "}
            <i className="bi bi-filetype-php"></i> PHP issue or working on a{" "}
            <i className="bi bi-react"></i> React interface, I like getting the
            details right. My background is in{" "}
            <i className="bi bi-filetype-html"></i> HTML,{" "}
            <i className="bi bi-filetype-css"></i> CSS,{" "}
            <i className="bi bi-filetype-php"></i> PHP, Laravel, and{" "}
            <i className="bi bi-database"></i> MySQL, but lately I’ve been
            focusing on modern stacks like <i className="bi bi-react"></i> React
            and <i className="bi bi-filetype-css"></i> Tailwind. I’ve deployed
            plenty of projects, ranging from crypto platforms to simple
            mini-games, though I have just as many experiments sitting in my local
            folders. I’m naturally curious about how systems work and spend a lot
            of time optimizing performance or tinkering with{" "}
            <i className="bi bi-ubuntu"></i> Linux. I even built my own distro
            called <strong>GhalibOS</strong>. For design, I stick to{" "}
            <i className="bi bi-brush-fill"></i> Illustrator and{" "}
            <i className="bi bi-camera"></i> Photoshop to make sure everything
            looks as good as it works.
          </p>
        </section>
      </section>
    </div>
  );
}
