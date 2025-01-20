"use client";
import ComprehensiveServices from "./components/ComprehensiveServices";
import AboutPage from "./components/AboutPage";
import ClientsSection from "./components/ClientsPage";
import Navbar from "./components/Navbar";
import OnboardingPage from "./components/OnboardingPage";
import TeamSection from "./components/TeamSection";
import WorkProcess from "./components/WorkProcessPage";
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5EB] to-white">
      <Navbar />
      <OnboardingPage />
      <ComprehensiveServices/>
      <AboutPage />
      <WorkProcess />
      <ClientsSection />
      <TeamSection />
    </div>
  );
}
