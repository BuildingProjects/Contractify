"use client";
import ComprehensiveServices from "./components/ComprehensiveServices";
import Navbar from "./components/Navbar";
import OnboardingPage from "./components/OnboardingPage";
export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-[#FFF5EB] to-white'>
      <Navbar />
      <OnboardingPage />
      <ComprehensiveServices/>
    </div>
  );
}
