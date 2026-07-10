import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://b28f96d2ef0082eac5936061a8050bd9.ctonew.app';

export default function SEOHead({
  title,
  description = 'Guided EMDR, EFT Tapping, Havening, Silva Mind Control, and more. Personalized for teens, young adults, and adults. Start your free 30-day trial.',
  image = '/og-image.png',
  path = '',
}) {
  const fullTitle = title ? `${title} | Ener-G-T-49` : 'Ener-G-T-49 | The All-in-One Wellness App for Anxiety Relief & Emotional Regulation';
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${SITE_URL}${image}`} />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${SITE_URL}${image}`} />
    </Helmet>
  );
}