import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { TrackRecordSection } from '@/components/track-record-section'
import { ProductsSection } from '@/components/products-section'
import { FeaturesSection } from '@/components/features-section'
import { SupportStepsSection } from '@/components/support-steps-section'
import { JourneySection } from '@/components/journey-section'
import { StreakSection } from '@/components/streak-section'
import { DashboardPreview } from '@/components/dashboard-preview'
import { FAQSection } from '@/components/faq-section'
import { PricingSection } from '@/components/pricing-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <HeroSection />
      <TrackRecordSection />
      <ProductsSection />
      <FeaturesSection />
      <SupportStepsSection />
      <JourneySection />
      <StreakSection />
      <DashboardPreview />
      <FAQSection />
      <PricingSection />
      <Footer />
    </main>
  )
}
