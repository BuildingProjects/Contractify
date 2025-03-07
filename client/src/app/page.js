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
import Footer from "./components/Footer";
import Experiences from "./components/Experiences";
export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF4E7]">
      <Navbar />
      <OnboardingPage />
      <AboutPage />
      <ComprehensiveServices />
      <ESolutionsSection />
      <WorkProcess />
      <ClientsSection />
      <TeamSection />
      <Experiences />
      <ConnectUs />
      <Footer />
      <script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"></script>
      <script src="https://files.bpcontent.cloud/2025/03/05/06/20250305061557-S2N1UNLI.js"></script>
      
    </div>
  );
}
