import Stripe from "stripe";
import config from ".";

export const stripe = new Stripe(config.STRIPE.STRIPE_SECRET_KEY);
