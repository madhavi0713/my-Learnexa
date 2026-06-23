import "./Footer.css";

function Footer() {
  return (

    <footer className="footer">

      <div className="footer-container">

        {/* ABOUT */}

        <div className="footer-section">

          <h2>About Learnexa</h2>

          <div className="footer-line"></div>

          <p>
            Learnexa is a beginner-friendly
            e-learning platform committed to
            making education accessible,
            engaging, and professional.
            Learn key modern skills online
            from anywhere, anytime.
          </p>

        </div>

        {/* SOCIAL LINKS */}

        <div className="footer-section">

          <h2>Social Links</h2>

          <div className="footer-line"></div>

          <ul>

            <li>🔵 Facebook</li>

            <li>🐦 Twitter (X)</li>

            <li>💼 LinkedIn</li>

            <li>📸 Instagram</li>

          </ul>

        </div>

        {/* CONTACT */}

        <div className="footer-section">

          <h2>Contact Us</h2>

          <div className="footer-line"></div>

          <ul>

            <li>📧 support@learnexa.com</li>

            <li>📞 +1 (555) 019-2834</li>

            <li>📍 123 Learning Lane, EdTech City</li>

          </ul>

        </div>

      </div>

      <div className="footer-bottom">

        © 2026 LernX. All rights reserved.

      </div>

    </footer>
  );
}

export default Footer;