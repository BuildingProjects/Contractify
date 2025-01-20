"use client";
import ComprehensiveServices from "./components/ComprehensiveServices";
import AboutPage from "./components/AboutPage";
import ClientsSection from "./components/ClientsPage";
import ConnectUs from "./components/ConnectUsPage";
import Navbar from "./components/Navbar";
import OnboardingPage from "./components/OnboardingPage";
import TeamSection from "./components/TeamSection";
import WorkProcess from "./components/WorkProcessPage";
import ESolutionsSection from "./components/ESolutionsSection";
import Experiences from "./components/Experiences";
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
      <ConnectUs />
      <Experiences />
    </div>
  );
}
