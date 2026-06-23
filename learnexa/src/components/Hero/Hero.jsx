import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      {/* LEFT MARKETING TITLE BLOCK */}
      <div className="hero-left">
        <h1>
          Learn New <span className="hero-gradient-text">Skills</span> Online
        </h1>

        <p>
          Unlock your true learning potential with SkillSphere. Join our 
          platform, study at your own pace, and acquire industry-ready 
          technical certifications under expert guidance.
        </p>

        <button className="hero-btn" onClick={() => {
          document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
        }}>
          Explore Courses
        </button>
      </div>

      {/* RIGHT ABSTRACT INTERFACE BLOCK */}
      <div className="hero-right">
        <div className="hero-card">
          <div className="hero-card-content">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hero-laptop-icon">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
              <polyline points="10 8 8 10 10 12"></polyline>
              <polyline points="14 8 16 10 14 12"></polyline>
            </svg>
            <h2>LEARNEXA PLATFORM</h2>
            <p>Interactive Courses & Certifications</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;