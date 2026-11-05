"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { HowItWorks } from "@/components/site/how-it-works";
import { Services } from "@/components/site/services";
import { Gallery } from "@/components/site/gallery";
import { Testimonials } from "@/components/site/testimonials";
import { Faq } from "@/components/site/faq";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { ChatWidget } from "@/components/site/chat-widget";
import { QuoteWizard } from "@/components/site/quote-wizard";

export default function Home() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  const openQuote = () => setQuoteOpen(true);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onQuoteClick={openQuote} />

      <main className="flex-1">
        <Hero onQuoteClick={openQuote} />
        <About />
        <HowItWorks />
        <Services onQuoteClick={openQuote} />
        <Gallery onQuoteClick={openQuote} />
        <Testimonials />
        <Faq />
        <Contact />
      </main>

      <Footer />

      {/* Floating widgets */}
      <ChatWidget />
      <QuoteWizard open={quoteOpen} onOpenChange={setQuoteOpen} />
    </div>
  );
}
