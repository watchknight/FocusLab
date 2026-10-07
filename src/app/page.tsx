import React from 'react';
import type { Metadata } from 'next';
import { HomeContent } from '@/components/HomeContent';
import { IntroOverlay } from '@/components/IntroOverlay';

export const metadata: Metadata = {
  title: {
    absolute: 'FocusLab — Build focus you can measure',
  },
  description:
    'A calm, local-first web laboratory pairing evidence-graded attention practices with an informal browser reaction-time test to find what works for you.',
  openGraph: {
    title: 'FocusLab — Build focus you can measure',
    description:
      'A calm, local-first web laboratory pairing evidence-graded attention practices with an informal browser reaction-time test to find what works for you.',
  },
};

export default function HomePage() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FocusLab',
    url: 'https://focuslab.app',
    description:
      'A calm, local-first web app to measure attentional states and test evidence-labelled focus protocols.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <IntroOverlay />
      <HomeContent />
    </>
  );
}
