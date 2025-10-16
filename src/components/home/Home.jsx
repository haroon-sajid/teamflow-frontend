// import React from 'react';
// import { motion } from 'framer-motion';
// import './Home.css';

// // FeatureCard Component
// const FeatureCard = ({ icon, title, description, delay }) => (
//   <motion.div 
//     className="feature-card"
//     initial={{ opacity: 0, y: 20 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     viewport={{ once: true }}
//     transition={{ duration: 0.5, delay }}
//   >
//     <div className="feature-icon">{icon}</div>
//     <h3>{title}</h3>
//     <p>{description}</p>
//   </motion.div>
// );

// // TestimonialCard Component
// const TestimonialCard = ({ quote, author, role, company, delay }) => (
//   <motion.div 
//     className="testimonial-card"
//     initial={{ opacity: 0, scale: 0.95 }}
//     whileInView={{ opacity: 1, scale: 1 }}
//     viewport={{ once: true }}
//     transition={{ duration: 0.5, delay }}
//   >
//     <p className="testimonial-quote">"{quote}"</p>
//     <div className="testimonial-author">
//       <strong>{author}</strong>
//       <span>{role}, {company}</span>
//     </div>
//   </motion.div>
// );

// // Main Home Component
// const Home = () => {
//   return (
//     <div className="home-container">
//       {/* Hero Section */}
//       <section className="hero-section">
//         <div className="hero-content">
//           <motion.h1 
//             className="hero-title"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             Great outcomes start with TeamFlow
//           </motion.h1>
//           <motion.p 
//             className="hero-subtitle"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             AI-powered collaboration for teams that ship faster. 
//             Made for complex projects or everyday tasks.
//           </motion.p>
//           <motion.div 
//             className="hero-cta"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//           >
//             <button className="btn-primary">Get started free</button>
//             <button className="btn-secondary">Watch demo</button>
//           </motion.div>
//         </div>
//         <motion.div 
//           className="hero-visual"
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8, delay: 0.3 }}
//         >
//           <div className="hero-image-placeholder">
//             <div className="dashboard-mockup"></div>
//           </div>
//         </motion.div>
//       </section>

//       {/* Features Grid */}
//       <section className="features-section">
//         <motion.div 
//           className="section-header"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5 }}
//         >
//           <h2>Everything your team needs</h2>
//           <p>Powerful features to help your team collaborate and ship faster</p>
//         </motion.div>
//         <div className="features-grid">
//           <FeatureCard 
//             icon="⚡"
//             title="Plan and organize tasks"
//             description="Break down complex projects into manageable tasks with intuitive boards and workflows"
//             delay={0.1}
//           />
//           <FeatureCard 
//             icon="🎯"
//             title="Align work to goals"
//             description="Connect daily work to company objectives and track progress in real-time"
//             delay={0.2}
//           />
//           <FeatureCard 
//             icon="📊"
//             title="Track work your way"
//             description="Choose from boards, timelines, calendars, and more to visualize your work"
//             delay={0.3}
//           />
//           <FeatureCard 
//             icon="💡"
//             title="Optimize with insights"
//             description="Get actionable insights and reports to continuously improve team performance"
//             delay={0.4}
//           />
//         </div>
//       </section>

//       {/* AI Feature Highlight */}
//       <section className="ai-feature-section">
//         <div className="feature-content-left">
//           <motion.div
//             initial={{ opacity: 0, x: -30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2>Your next move, powered by AI</h2>
//             <p>TeamFlow Intelligence takes your big ideas and automatically suggests the tasks to help get it done. Smart automation that learns from your team's patterns.</p>
//           </motion.div>
//         </div>
//         <motion.div 
//           className="feature-visual-right"
//           initial={{ opacity: 0, x: 30 }}
//           whileInView={{ opacity: 1, x: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//         >
//           <div className="visual-placeholder ai-visual"></div>
//         </motion.div>
//       </section>

//       {/* Collaboration Section */}
//       <section className="collaboration-section">
//         <motion.div 
//           className="feature-visual-left"
//           initial={{ opacity: 0, x: -30 }}
//           whileInView={{ opacity: 1, x: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//         >
//           <div className="visual-placeholder collab-visual"></div>
//         </motion.div>
//         <div className="feature-content-right">
//           <motion.div
//             initial={{ opacity: 0, x: 30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2>Bring every team together under one roof</h2>
//             <p>Spend less time trying to get aligned and more time driving projects forward with confidence. Real-time collaboration that just works.</p>
//           </motion.div>
//         </div>
//       </section>

//       {/* Feature Cards Section */}
//       <section className="detailed-features-section">
//         <div className="detailed-features-grid">
//           <motion.div 
//             className="detailed-feature-card"
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="feature-image-placeholder feature-img-1"></div>
//             <div className="feature-text">
//               <h3>Everything in one place</h3>
//               <p>The context you need, when you need it. See team updates, design files, and more, all inside TeamFlow.</p>
//               <a href="#" className="feature-link">Explore features →</a>
//             </div>
//           </motion.div>
//           <motion.div 
//             className="detailed-feature-card"
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//           >
//             <div className="feature-image-placeholder feature-img-2"></div>
//             <div className="feature-text">
//               <h3>Tailor it for your team</h3>
//               <p>Configure TeamFlow to match your team's processes, workflows, language, and more. Integrate with every tool you use.</p>
//               <a href="#" className="feature-link">Learn more →</a>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Big Picture Section */}
//       <section className="big-picture-section">
//         <motion.div 
//           className="section-header"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5 }}
//         >
//           <h2>Never lose sight of the big picture</h2>
//         </motion.div>
//         <div className="big-picture-grid">
//           <motion.div 
//             className="big-picture-card"
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//           >
//             <div className="picture-visual picture-1"></div>
//             <h3>Easily see every team's progress</h3>
//             <p>Track every team's work in a single timeline. Understand progress, map dependencies, and stay ahead of risks.</p>
//           </motion.div>
//           <motion.div 
//             className="big-picture-card"
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//           >
//             <div className="picture-visual picture-2"></div>
//             <h3>Map work to company impact</h3>
//             <p>With goals in TeamFlow, it's easy to track all the tasks that contribute to a goal, no matter what team is working on it.</p>
//           </motion.div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="testimonials-section">
//         <motion.div 
//           className="section-header"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5 }}
//         >
//           <h2>For teams big & small</h2>
//           <p>Hear from start-ups & large enterprises that prefer TeamFlow</p>
//         </motion.div>
//         <div className="testimonials-grid">
//           <TestimonialCard 
//             quote="Before, our team saw tools as separate pieces. Now, TeamFlow has really been pivotal in collaboration, productivity, and discoverability."
//             author="Sarah Chen"
//             role="Engineering Manager"
//             company="TechCorp"
//             delay={0.1}
//           />
//           <TestimonialCard 
//             quote="TeamFlow transformed how we work. Our productivity increased by 40% in the first month alone. It's incredible."
//             author="Michael Rodriguez"
//             role="Product Lead"
//             company="InnovateLabs"
//             delay={0.2}
//           />
//           <TestimonialCard 
//             quote="The AI features are game-changing. TeamFlow anticipates what we need before we even ask. Best tool we've ever used."
//             author="Emily Johnson"
//             role="Design Director"
//             company="CreativeHub"
//             delay={0.3}
//           />
//         </div>
//       </section>

//       {/* Final CTA Section */}
//       <section className="final-cta-section">
//         <motion.div 
//           className="final-cta-content"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//         >
//           <h2>No matter what you're trying to dream up, TeamFlow helps you get it done</h2>
//           <button className="btn-primary-large">Start free trial</button>
//         </motion.div>
//       </section>
//     </div>
//   );
// };

// export default Home;



















import React from 'react';
import { motion } from 'framer-motion';
import './Home.css';

// FeatureCard Component
const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div 
    className="feature-card"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </motion.div>
);

// TestimonialCard Component
const TestimonialCard = ({ quote, author, role, company, delay }) => (
  <motion.div 
    className="testimonial-card"
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <p className="testimonial-quote">"{quote}"</p>
    <div className="testimonial-author">
      <strong>{author}</strong>
      <span>{role}, {company}</span>
    </div>
  </motion.div>
);

// Main Home Component
const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Great outcomes start with TeamFlow
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            AI-powered collaboration for teams that ship faster. 
            Made for complex projects or everyday tasks.
          </motion.p>
          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button className="btn-primary">Get started free</button>
            <button className="btn-secondary">Watch demo</button>
          </motion.div>
        </div>
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="hero-image-placeholder">
            <div className="dashboard-mockup"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>Everything your team needs</h2>
          <p>Powerful features to help your team collaborate and ship faster</p>
        </motion.div>
        <div className="features-grid">
          <FeatureCard 
            icon="⚡"
            title="Plan and organize tasks"
            description="Break down complex projects into manageable tasks with intuitive boards and workflows"
            delay={0.1}
          />
          <FeatureCard 
            icon="🎯"
            title="Align work to goals"
            description="Connect daily work to company objectives and track progress in real-time"
            delay={0.2}
          />
          <FeatureCard 
            icon="📊"
            title="Track work your way"
            description="Choose from boards, timelines, calendars, and more to visualize your work"
            delay={0.3}
          />
          <FeatureCard 
            icon="💡"
            title="Optimize with insights"
            description="Get actionable insights and reports to continuously improve team performance"
            delay={0.4}
          />
        </div>
      </section>

      {/* AI Feature Highlight */}
      <section className="ai-feature-section">
        <div className="feature-content-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Your next move, powered by AI</h2>
            <p>TeamFlow Intelligence takes your big ideas and automatically suggests the tasks to help get it done. Smart automation that learns from your team's patterns.</p>
          </motion.div>
        </div>
        <motion.div 
          className="feature-visual-right"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="visual-placeholder ai-visual"></div>
        </motion.div>
      </section>

      {/* Collaboration Section */}
      <section className="collaboration-section">
        <motion.div 
          className="feature-visual-left"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="visual-placeholder collab-visual"></div>
        </motion.div>
        <div className="feature-content-right">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Bring every team together under one roof</h2>
            <p>Spend less time trying to get aligned and more time driving projects forward with confidence. Real-time collaboration that just works.</p>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="detailed-features-section">
        <div className="detailed-features-grid">
          <motion.div 
            className="detailed-feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="feature-image-placeholder feature-img-1"></div>
            <div className="feature-text">
              <h3>Everything in one place</h3>
              <p>The context you need, when you need it. See team updates, design files, and more, all inside TeamFlow.</p>
              <a href="#" className="feature-link">Explore features →</a>
            </div>
          </motion.div>
          <motion.div 
            className="detailed-feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="feature-image-placeholder feature-img-2"></div>
            <div className="feature-text">
              <h3>Tailor it for your team</h3>
              <p>Configure TeamFlow to match your team's processes, workflows, language, and more. Integrate with every tool you use.</p>
              <a href="#" className="feature-link">Learn more →</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Big Picture Section */}
      <section className="big-picture-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>Never lose sight of the big picture</h2>
        </motion.div>
        <div className="big-picture-grid">
          <motion.div 
            className="big-picture-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="picture-visual picture-1"></div>
            <h3>Easily see every team's progress</h3>
            <p>Track every team's work in a single timeline. Understand progress, map dependencies, and stay ahead of risks.</p>
          </motion.div>
          <motion.div 
            className="big-picture-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="picture-visual picture-2"></div>
            <h3>Map work to company impact</h3>
            <p>With goals in TeamFlow, it's easy to track all the tasks that contribute to a goal, no matter what team is working on it.</p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>For teams big & small</h2>
          <p>Hear from start-ups & large enterprises that prefer TeamFlow</p>
        </motion.div>
        <div className="testimonials-grid">
          <TestimonialCard 
            quote="Before, our team saw tools as separate pieces. Now, TeamFlow has really been pivotal in collaboration, productivity, and discoverability."
            author="Sarah Chen"
            role="Engineering Manager"
            company="TechCorp"
            delay={0.1}
          />
          <TestimonialCard 
            quote="TeamFlow transformed how we work. Our productivity increased by 40% in the first month alone. It's incredible."
            author="Michael Rodriguez"
            role="Product Lead"
            company="InnovateLabs"
            delay={0.2}
          />
          <TestimonialCard 
            quote="The AI features are game-changing. TeamFlow anticipates what we need before we even ask. Best tool we've ever used."
            author="Emily Johnson"
            role="Design Director"
            company="CreativeHub"
            delay={0.3}
          />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <motion.div 
          className="final-cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>No matter what you're trying to dream up, TeamFlow helps you get it done</h2>
          <button className="btn-primary-large">Start free trial</button>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
