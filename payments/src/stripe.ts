import Stripe from 'stripe';

export const stripe = new Stripe(
  'sk_test_51MIBIXCp9XMqHneaScAze2bDVpYDn1PK4qAZrkTEF3B4YmKJLyEBMu3AfjCOZsawKqnCI7STVkKWX2x6XrdT2Pd000sVQwGMeC',
  {
    apiVersion: '2022-11-15'
  }
);
