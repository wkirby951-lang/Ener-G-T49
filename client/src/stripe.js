/**
 * Stripe payment link configuration.
 * Maps plan IDs to Stripe-hosted checkout URLs.
 * These are used across PricingCards, Dashboard, and ContentLibrary.
 */
const STRIPE_LINKS = {
  monthly: 'https://buy.stripe.com/8x24gBgFydpd8B4dxh4ow00',
  quarterly: 'https://buy.stripe.com/fZu4gB60Ufxl2cG3WH4ow01',
  'semi-annual': 'https://buy.stripe.com/6oUdRb1KE1GvaJcal54ow02',
  annual: 'https://buy.stripe.com/9B6fZj9d6dpd4kO64P4ow03',
  lifetime: 'https://buy.stripe.com/bJecN72OIcl9eZs1Oz4ow04',
  'annual-renewal': 'https://buy.stripe.com/4gM3cxbleethg3wal54ow05',
  'a-la-carte': 'https://buy.stripe.com/6oU8wRahabh57x078T4ow06',
};

export function openStripeCheckout(planId) {
  const url = STRIPE_LINKS[planId];
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export function getStripeLink(planId) {
  return STRIPE_LINKS[planId] || null;
}

export default STRIPE_LINKS;