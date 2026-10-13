import type { Metadata } from 'next';
import React from 'react';
import { MapPin, Phone, Clock, Car, Navigation, CheckCircle2 } from 'lucide-react';
import { restaurantConfig } from '../../config/restaurant.config';
import { Card } from '../../components/ui/Card';
import { ContactClient } from './ContactClient';
import { GoogleReviewsSection } from '../../components/GoogleReviewsSection';

export const metadata: Metadata = {
  title: `Location, Hours & Contact | ${restaurantConfig.brand.name}`,
  description: `Find ${restaurantConfig.brand.name} at ${restaurantConfig.address.full}. Lunch & dinner timings, directions, free street parking, and phone numbers.`,
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: `Location, Hours & Contact | ${restaurantConfig.brand.name}`,
    description: `Find us at ${restaurantConfig.address.shop}, ${restaurantConfig.address.street}, ${restaurantConfig.address.locality}. Free street parking & daily lunch/dinner.`,
    url: '/contact',
    images: [
      {
        url: restaurantConfig.images.hero,
        width: 1200,
        height: 630,
        alt: `${restaurantConfig.brand.name} Location and Hours`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Location, Hours & Contact | ${restaurantConfig.brand.name}`,
    description: `Find us at ${restaurantConfig.address.full}.`,
    images: [restaurantConfig.images.hero],
  },
};

export default function ContactPage() {
  const faqs = restaurantConfig.faqs || [
    {
      question: 'Do I need a reservation for lunch or dinner?',
      answer:
        'Walk-ins are always welcomed! We have ample casual seating for solo diners and regular groups. However, for large weekend groups (6+ guests), reserving a table online ensures your party is seated together immediately.',
    },
    {
      question: `How does Free Street Parking work on ${restaurantConfig.address.street}?`,
      answer:
        `There is complimentary, open curb street parking directly along ${restaurantConfig.address.street} right outside ${restaurantConfig.address.shop} and neighboring storefronts. It is safe, convenient, and easy for two-wheelers and cars.`,
    },
    {
      question: 'Are the dishes suitable for children?',
      answer:
        'Yes, very much so! We can make custom mild dum biryani rice or gentle Paneer Tikka and Veg Samosa small plates with negligible spice for kids. We also offer high chairs.',
    },
    {
      question: 'How fast is takeaway packaging prepared?',
      answer:
        'Takeaway orders typically take 15 to 20 minutes from the moment you place them. You can order online through our website bag or call ahead so it is hot and waiting when you arrive.',
    },
    {
      question: 'What is the solo dining experience like?',
      answer:
        'Solo dining is one of our most popular offerings! We offer complete single-portion biryani meal platters with sides and quick bites so you do not need to order a massive family handi just for yourself.',
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const googleMapsUrl = restaurantConfig.googleMaps.shareUrl;

  return (
    <div className="shell shell-safe-bottom py-8 sm:py-12 space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
          Visit Us in {restaurantConfig.address.locality}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-stone-900 tracking-tight">
          Location, Timings & Contact
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Conveniently located on {restaurantConfig.address.street}. Stop by for hot lunch, casual dinner, or grab swift takeaway.
        </p>
      </div>

      {/* Main Grid: Details + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Address Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-orange-100 text-orange-700 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">
                  Kitchen Address
                </h3>
                <p className="text-sm text-stone-700 font-medium">
                  {restaurantConfig.address.shop}, {restaurantConfig.address.street}
                </p>
                <p className="text-xs text-stone-500">
                  {restaurantConfig.address.locality}, {restaurantConfig.address.state} {restaurantConfig.address.postalCode}
                </p>
                <p className="text-xs text-stone-500 pt-1">
                  Landmark: {restaurantConfig.address.landmark}
                </p>
              </div>
            </div>

            <ContactClient />
          </Card>

          {/* Timings Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-stone-100 text-stone-800 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-bold text-stone-900">
                  Operating Hours
                </h3>
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="font-semibold text-stone-800">Lunch Service:</span>
                    <span className="tabular-nums font-medium text-stone-900">{restaurantConfig.timings.lunch}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="font-semibold text-stone-800">Dinner Service:</span>
                    <span className="tabular-nums font-medium text-stone-900">{restaurantConfig.timings.dinner}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 text-emerald-700 font-semibold">
                    <span>Schedule:</span>
                    <span>{restaurantConfig.timings.days}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Direct Phones Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base font-bold text-stone-900">
                  Direct Kitchen Helplines
                </h3>
                <div className="text-sm font-semibold text-stone-900">
                  <a href={`tel:${restaurantConfig.contact.phone}`} className="hover:text-orange-600 transition-colors tabular-nums">
                    {restaurantConfig.contact.phone}
                  </a>
                </div>
                {restaurantConfig.contact.secondaryPhone && (
                  <div className="text-xs text-stone-500 tabular-nums">
                    Tel: {restaurantConfig.contact.secondaryPhone}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Free Parking Notice */}
          <div className="p-4 bg-stone-100 rounded-xl border border-stone-200 flex items-start gap-3 text-xs text-stone-700">
            <Car className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900">Free Street Parking:</strong> Plentiful curbside parking available on {restaurantConfig.address.street} right outside {restaurantConfig.address.shop} for hassle-free dining and takeaway grab-and-go.
            </div>
          </div>
        </div>

        {/* Right Col: Map & Neighborhood Guide */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="overflow-hidden border border-stone-200/90 shadow-2xs">
            {/* Visual map preview header */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Location Visualizer · {restaurantConfig.address.locality}, {restaurantConfig.address.city}
                </span>
              </div>
              <span className="text-xs text-stone-500">Pincode: {restaurantConfig.address.postalCode}</span>
            </div>

            {/* Stylized Map View */}
            <div className="relative h-80 sm:h-96 bg-stone-100 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
              {/* Street grid background design */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10 max-w-md p-6 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-lg space-y-4">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md ring-4 ring-orange-100">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-display text-stone-900">
                    {restaurantConfig.brand.name}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    {restaurantConfig.address.full}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500">
                  <span>{restaurantConfig.address.landmark}</span>
                  <span>·</span>
                  <span>{restaurantConfig.address.locality}</span>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-xs"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Driving Route to {restaurantConfig.address.shop}</span>
                </a>
              </div>
            </div>

            <div className="p-5 bg-white border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600">
              <div>
                <div className="font-bold text-stone-900">From LB Nagar / Sagar Ring Rd</div>
                <div>{restaurantConfig.address.directionsNotes?.fromNorth || 'Approx. 12–15 mins via Badangpet main road'}</div>
              </div>
              <div>
                <div className="font-bold text-stone-900">From Balapur / Chandrayangutta</div>
                <div>{restaurantConfig.address.directionsNotes?.fromSouth || 'Approx. 8–10 mins drive straight towards Almasguda'}</div>
              </div>
              <div>
                <div className="font-bold text-stone-900">Parking Setup</div>
                <div>{restaurantConfig.address.directionsNotes?.parkingInfo || 'Free street parking on both curbs'}</div>
              </div>
            </div>
          </Card>

          {/* Quick FAQ Accordion */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold font-display text-stone-900">
              Frequently Asked Questions
            </h3>
            <div className="space-y-2.5">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-xl border border-stone-200/90 space-y-1.5"
                >
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>{faq.question}</span>
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps Reviews & Manual Feedback */}
      <div className="pt-6 border-t border-stone-200">
        <GoogleReviewsSection />
      </div>
    </div>
  );
}
