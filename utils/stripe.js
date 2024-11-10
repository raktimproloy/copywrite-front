import { loadStripe } from "@stripe/stripe-js";

let stripePromise;
const stripePK = "pk_test_51OkfuoG5edtHy0UxdjPVb1jO6qlRK0IhwTH4a51JSXYxVMfg9hO1VjeucKGiTt7FTxIzysprCK8YELcrfnc0ySlT00LYGucmtz";

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePK);
  }
  return stripePromise;
};

export default getStripe;
