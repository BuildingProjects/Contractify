"use client";
import ComprehensiveServices from "./components/ComprehensiveServices";
import AboutPage from "./components/AboutPage";
import ClientsSection from "./components/ClientsPage";
import Navbar from "./components/Navbar";
import OnboardingPage from "./components/OnboardingPage";
import TeamSection from "./components/TeamSection";
import WorkProcess from "./components/WorkProcessPage";
import ESolutionsSection from "./components/ESolutionsSection";
export default function Home() {
  return (
    <div className='min-h-screen bg-[#FAF4E7]'>
      <Navbar />
      <OnboardingPage />
      <ComprehensiveServices />
      <AboutPage />
      <WorkProcess />
      <ESolutionsSection />
      <ClientsSection />
      <TeamSection />
    </div>
  );
}
