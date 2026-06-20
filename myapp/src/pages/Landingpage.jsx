import { useState, useEffect } from "react";


export default function LandingPage({ setView }) {
  // --- STATS ENGINE STATE ---
  const [membersCount, setMembersCount] = useState("48,200+");
  const [paidoutCount, setPaidoutCount] = useState("₦18.4M+");

  // --- TESTIMONIAL CAROUSEL STATE ---
  const testimonials = [
    {
      text: '"Affilora has changed how I earn online. Payouts are always on time."',
      name: "Chinedu A.",
      location: "Lagos",
      avatar: "C"
    },
    {
      text: '"The Gold plan paid for itself in two weeks. Premium support is real."',
      name: "Amaka O.",
      location: "Abuja",
      avatar: "A"
    },
    {
      text: '"Transparent earnings, real campaigns. Easily the best platform in Africa."',
      name: "Tunde B.",
      location: "Ibadan",
      avatar: "T"
    }
  ];
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // --- RUN COUNTERS AND CAROUSEL EFFECT ---
  useEffect(() => {
    // 1. Members count calculation
    const baseMembers = 48200;
    const randomIncrease = Math.floor(Math.random() * 50);
    setMembersCount((baseMembers + randomIncrease).toLocaleString() + "+");

    // 2. Paid out calculation
    const basePaid = 18400000;
    const randomPaid = Math.floor(Math.random() * 500000);
    setPaidoutCount("₦" + ((basePaid + randomPaid) / 1000000).toFixed(1) + "M+");

    // 3. Testimonial carousel loop (every 3 seconds)
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="wrapper">
      
      {/* NAVBAR */}
      <header className="navbar">
        <div className="navInner">
          <a href="#" className="brand">
            <div className="brandLogo">
              <img src="Affilora main logo.jpeg" alt="main logo" width="40px" height="40px" style={{ objectFit: "cover" }} />
            </div>
            <div>
              <span className="brandName">Affilora</span>
              <span className="brandTag">Growing Wealth Intelligently</span>
            </div>
          </a>
          <nav className="navLinks">
            <a href="#plans" className="navLink">Plans</a>
            <a href="#earnings" className="navLink">Earnings</a>
            <a href="#stats" className="navLink">Stats</a>
            <a href="#faq" className="navLink">FAQ</a>
            <a href="#support" className="navLink">Support</a>
          </nav>
          <div className="navActions">
            <button className="btn btnGlass" onClick={() => setView("login")}>Sign in</button>
            <button className="btn btnHero" onClick={() => setView("register")}>Get Started</button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="heroGrid">
          <div>
            <div className="chip">✨ Nigeria's premium earning platform</div>
            <h1 className="heroTitle">Grow your wealth, <span className="textGold">intelligently.</span></h1>
            <p className="heroSub">
              Earn from sponsored ads, surveys, and tasks — verified, transparent, and built for Nigerian creators.
            </p>
            <div className="heroCta">
              <button className="btn btnHero stavi" onClick={() => setView("login")}>Start Earning →</button>
              <button className="btn btnGlass stavi" onClick={() => setView("login")}>View Plans</button>
            </div>
            <div className="heroTrust">
              <span>✓ Manual payment verification</span>
              <span>✓ ₦1500 referral bonus</span>
              <span>✓ Daily earnings</span>
            </div>
          </div>
          
          <div className="heroVisual">
            <div className="glassCard divgla">
              <span style={{ color: "#94a3b8" }}>Placeholder Image</span>
            </div>
            <div className="glassCard floatCard divflo">
              <div className="divflogla">Today's Earnings</div>
              <div className="divfloglas">₦12,450</div>
            </div>
            <div className="glassCard floatCard divflog">
              <div className="divflogla">Active Members</div>
              <div className="divfloglass">48,200+</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section id="stats" className="section back">
        <div className="divStat">
          <div className="glassCard glaStat">
            <div>
              <h2 className="stats">{membersCount}</h2>
              <div className="desc">Active Members</div>
            </div>
            <div>
              <h2 className="stats">{paidoutCount}</h2>
              <div className="desc">Naira Paid Out</div>
            </div>
            <div>
              <h2 className="stats">99%</h2>
              <div className="desc">Payout Reliability</div>
            </div>
            <div>
              <h2 className="stats">24/7</h2>
              <div className="desc">Member Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* EARNINGS SECTION */}
      <section id="earnings" className="section">
        <div className="sectionHead">
          <div className="kicker">Earning Opportunities</div>
          <h2 className="sectionTitle">Multiple ways to <span className="textGreen">earn daily</span></h2>
          <p className="aller">All earnings come from legitimate sponsored activities — no income guarantees, just real opportunities.</p>
        </div>
        
        <div className="grid4">
          <div className="card">
            <div className="iconBox">📣</div>
            <h3 className="labels">Sponsored Ads</h3>
            <p className="descs">Engage with brand campaigns and earn per verified interaction.</p>
            <div className="reward">
              <span className="divflogla">Reward Range</span>
              <div className="labelPrice">₦40 – ₦220</div>
            </div>
          </div>

          <div className="card">
            <div className="iconBox">📋</div>
            <h3 className="labels">Daily Surveys & Tasks</h3>
            <p className="descs">Share opinions on products and services from top brands.</p>
            <div className="reward">
              <span className="divflogla">Reward Range</span>
              <div className="labelPrice">₦50 – ₦250</div>
            </div>
          </div>

          <div className="card">
            <div className="iconBox">⭐</div>
            <h3 className="labels">Product Reviews</h3>
            <p className="descs">Write honest reviews for verified merchant products.</p>
            <div className="reward">
              <span className="divflogla">Reward Range</span>
              <div className="labelPrice">₦80 – ₦200</div>
            </div>
          </div>

          <div className="card">
            <div className="iconBox">📊</div>
            <h3 className="labels">Market Research</h3>
            <p className="descs">Participate in research panels for global research firms.</p>
            <div className="reward">
              <span className="divflogla">Reward Range</span>
              <div className="labelPrice">₦50 – ₦150</div>
            </div>
          </div>
        </div>
      </section>

      

      {/* REFERRAL CTA SECTION */}
      <section className="section">
        <div className="ctaBox">
          <div>
            <div className="kicker">Referral Program</div>
            <h2 className="sectionTitle earn">Earn <span className="textGold">₦1,500</span> for every referral</h2>
            <p className="invite">Invite friends and earn instantly when they register.</p>
          </div>
          <button className="btn btnGold refLink" onClick={() => setView("register")}>Get Your Referral Link</button>
        </div>
      </section>

      {/* TESTIMONIALS SYSTEM */}
      <section className="section back">
        <div className="sectionHead">
          <div className="kicker">Testimonials</div>
          <h2 className="sectionTitle">Trusted by <span className="textGreen">thousands</span></h2>
        </div>
        <div className="dcsr">
          {/* Dynamic Carousel Slide Rendering */}
          <div className="divTestih">
            <p className="testih">
              {testimonials[currentTestimonial].text}
            </p>
            <div className="divTesti">
              <div className="avatar">{testimonials[currentTestimonial].avatar}</div>
              <div style={{ textAlign: "left" }}>
                <h4 className="name">{testimonials[currentTestimonial].name}</h4>
                <div className="location">{testimonials[currentTestimonial].location}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section id="faq" className="section">
        <div className="sectionHead">
          <div className="kicker">FAQ</div>
          <h2 className="sectionTitle">Questions, <span className="textGold">answered</span></h2>
        </div>
        <div className="faqContainer">
          <details open>
            <summary>How does membership work?</summary>
            <p className="desup">Pay the one-time fee for your chosen tier. Our team manually verifies the payment within 24 hours.</p>
          </details>
          <details>
            <summary>How are earnings calculated?</summary>
            <p className="desup">Earnings are based on completed tasks, surveys, reviews and research participation. Rates vary by campaign.</p>
          </details>
          <details>
            <summary>Are there payouts?</summary>
            <p className="desup">Yes — verified earnings are paid to your registered bank account.</p>
          </details>
          <details>
            <summary>How does the referral bonus work?</summary>
            <p className="desup">You earn ₦1500 instantly when your referral registers with your referral code.</p>
          </details>
        </div>
      </section>

      {/* SUPPORT GRID SECTION */}
      <section id="support" className="section back">
        <div className="sectionHead">
          <div className="kicker">Support</div>
          <h2 className="sectionTitle">We're here <span className="textGreen">24/7</span></h2>
        </div>
        <div className="grid3">
          <div className="card divsup">
            <div className="iconBox icons">💬</div>
            <h3 className="sup">Live Chat</h3>
            <p className="supInfo">Average response under 2 minutes.</p>
          </div>
          <div className="card divsup">
            <div className="iconBox icons">✉️</div>
            <h3 className="sup">Email</h3>
            <p className="supInfo">affilorasupport@gmail.com</p>
          </div>
          <div className="card divsup">
            <div className="iconBox icons">📞</div>
            <h3 className="sup">Telegram</h3>
            <p className="supInfo">@affilora55</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footerGrid">
          <div>
            <div className="brand">
              <div className="brandLogo aff">A</div>
              <div>
                <span className="brandName">Affilora</span>
                <span className="brandTag">Growing Wealth Intelligently</span>
              </div>
            </div>
            <p className="assure">
              Earnings come from legitimate sponsored campaigns, surveys, reviews and research tasks. No misleading income guarantees.
            </p>
          </div>
          <div>
            <h4 className="linkH">Platform</h4>
            <ul className="footerLinks">
              <li className="footerLinkItem">Plans</li>
              <li className="footerLinkItem">Earnings</li>
              <li className="footerLinkItem">Referrals</li>
              <li className="footerLinkItem">Dashboard</li>
            </ul>
          </div>
          <div>
            <h4 className="linkH">Company</h4>
            <ul className="footerLinks">
              <li className="footerLinkItem">About</li>
              <li className="footerLinkItem">Careers</li>
              <li className="footerLinkItem">Press</li>
              <li className="footerLinkItem">Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="linkH">Legal</h4>
            <ul className="footerLinks">
              <li className="footerLinkItem">Terms & Conditions</li>
              <li className="footerLinkItem">Privacy Policy</li>
              <li className="footerLinkItem">Earnings Disclosure</li>
              <li className="footerLinkItem">Anti-spam Policy</li>
            </ul>
          </div>
        </div>
        <div className="copy">
          © 2026 Affilora. All rights reserved.
        </div>
      </footer>

    </div>
  );
}