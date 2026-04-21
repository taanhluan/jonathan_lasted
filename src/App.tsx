import { AmbientBackground } from "./components/visuals/AmbientBackground";
import { BackToTop } from "./components/layout/BackToTop";
import { Footer } from "./components/layout/Footer";
import { JourneyPanel } from "./components/layout/JourneyPanel";
import { Navbar } from "./components/layout/Navbar";
import { ScrollProgress } from "./components/layout/ScrollProgress";
import { sections } from "./data/portfolioData";
import { useActiveSection } from "./hooks/useActiveSection";
import { AboutSection } from "./sections/AboutSection";
import { CaseStudiesSection } from "./sections/CaseStudiesSection";
import { ContactSection } from "./sections/ContactSection";
import { DomainExpertiseSection } from "./sections/DomainExpertiseSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { HeroSection } from "./sections/HeroSection";
import { HighlightsSection } from "./sections/HighlightsSection";
import { LearningSection } from "./sections/LearningSection";
import { StrengthsSection } from "./sections/StrengthsSection";

export default function App() {
  const { activeId, sectionProgress } = useActiveSection(
  sections.map((section) => section.id),
);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-obsidian text-ivory">
      <AmbientBackground />
      <ScrollProgress />
      <div className="relative z-10">
        <Navbar activeId={activeId} />
        <JourneyPanel
  activeId={activeId}
  sectionProgress={sectionProgress}
/>
        <main>
          <HeroSection />
          <AboutSection />
          <StrengthsSection />
          <ExperienceSection />
          <CaseStudiesSection />
          <DomainExpertiseSection />
          <LearningSection />
          <HighlightsSection />
          <ContactSection />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </div>
  );
}
