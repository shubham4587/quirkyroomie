// utils/punishmentGenerator.js
const punishments = [
  "Didn’t clean the dishes? You’re making chai for everyone for a week.",
  "Blasted loud music at 2 AM? You owe everyone samosas.",
  "Left the lights on? You’re on laundry duty for a week.",
  "Forgot to pay the internet bill? Mop all floors this weekend.",
  "Used all the milk? Buy dessert for the flat.",
  "Ignored trash day? 20 push‑ups before lunch—daily."
];

module.exports = () => {
  const idx = Math.floor(Math.random() * punishments.length);
  return punishments[idx];
};
