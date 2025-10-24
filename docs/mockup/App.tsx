
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import WhyDobbie from './components/WhyDobbie';
import Vision from './components/Vision';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import ChatPage from './components/ChatPage';

const LandingPage: React.FC = () => (
  <div className="overflow-x-hidden">
    <Header />
    <main>
      <Hero />
      <Stats />
      <WhyDobbie />
      <Vision />
      <Pricing />
      <FAQ />
    </main>
    <Footer />
    <ScrollToTopButton />
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
};

export default App;
