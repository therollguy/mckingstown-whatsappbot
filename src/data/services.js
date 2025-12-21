/**
 * McKingstown Men's Salon - Complete Service Menu
 * All prices include taxes
 * T&C Apply. Outdoor Charges and Conveyance Extra
 */

const services = {
  haircut: {
    title: 'HAIRCUT SERVICES',
    items: [
      { name: 'Haircut (Neat & Clean)', price: 125 },
      { name: 'Taper Haircut', price: 150, description: 'Casual and Professional' },
      { name: 'Fade Haircut', price: 175, description: 'Blends to Skin' },
      { name: 'Mullet Haircut', price: 200, description: 'Short Front, Long Back' },
      { name: 'New Look', price: 200, description: 'Change of Style' },
      { name: 'The Bald', price: 200, description: 'Head Shave' },
      { name: 'Little Champ', price: 75, description: 'Any Haircut - Boys Below 7 Years' }
    ],
    styling: [
      { name: 'Wash & Style', price: 100 }
    ]
  },

  beard: {
    title: 'BEARD SERVICES',
    items: [
      { name: 'Beard Trim', price: 40 },
      { name: 'Zero Trim', price: 50 },
      { name: 'Regular Shave', price: 75 },
      { name: 'Beard Design', price: 400, description: 'French, Shaping, Stubble' },
      { name: 'Hot Towel Shave', description: 'Immaculate Shave with soothing hot towel - Selective Outlets*' }
    ]
  },

  hairSpa: {
    title: 'HAIR SPA (Hair & Scalp Treatment)',
    items: [
      { name: 'Dry / Repair', price: 400 },
      { name: 'Dandruff / Hairfall', price: 800 },
      { name: 'Nourishing Protein Treatment', price: 800 },
      { name: 'Detox (With Oil Shots)', price: 1000 }
    ]
  },

  texture: {
    title: 'TEXTURE TREATMENT',
    items: [
      { name: 'Keratin/Smoothening - Crown/Mullet/Beard', price: 1500 },
      { name: 'Keratin/Smoothening - Upto Neck', price: 2000 },
      { name: 'Keratin/Smoothening - Shoulder', price: 2500 },
      { name: 'Keratin/Smoothening - Below Shoulder', price: 3500 }
    ]
  },

  colour: {
    title: 'COLOUR SERVICES',
    items: [
      { name: 'Moustache', price: 100 },
      { name: 'Beard', price: 150 },
      { name: 'Hair Dye / Own Colour Application', price: 200 },
      { name: 'Global Hair', price: 250 },
      { name: 'Global Hair (Upto Neck)', price: 350 },
      { name: 'Global Hair (Shoulder)', price: 600 },
      { name: 'Global Hair (Below Shoulder)', price: 800 },
      { name: 'Global Hair (Extended)', price: 1200 },
      { name: 'Per Streak', price: 200 },
      { name: 'Highlights', price: 300 },
      { name: 'Fashion Colour', price: 700 }
    ],
    addOn: [
      { name: 'Pre-Lightening', price: 500 }
    ]
  },

  cleanUp: {
    title: 'CLEAN UP',
    items: [
      { name: 'Charcoal', price: 300 },
      { name: 'Gold', price: 350 },
      { name: 'Oily Skin', price: 300 },
      { name: 'Whitening', price: 350 }
    ]
  },

  facials: {
    title: 'FACIALS',
    subtitle: 'No Parabens | No Sulphates | Vegan | Cruelty Free',
    items: [
      { name: 'Gold', price: 700 },
      { name: 'Diamond', price: 800 },
      { name: 'Glo Vite', price: 900 },
      { name: 'Tan Clear', price: 1000 },
      { name: 'Oxy Radiance', price: 1200 },
      { name: 'Hydra Boost', price: 1500 },
      { name: 'Sensi Fusion', price: 1800 },
      { name: 'De-Aging', price: 2000 }
    ]
  },

  advancedFacials: {
    title: 'ADVANCED FACIAL',
    items: [
      { name: 'Vitamin Fix', price: 2500 },
      { name: 'Skin Whitening', price: 3000 },
      { name: 'Shine Lume', price: 3500 },
      { name: 'Radiance 10 Layer', price: 4000 },
      { name: 'Crystal Bright', price: 4500 }
    ],
    addOn: [
      { name: 'De-Tan', price: 200 },
      { name: 'Gel Peel Off Mask', price: 600 }
    ]
  },

  oilMassage: {
    title: 'OIL MASSAGE',
    items: [
      { name: 'Head Oil Massage (20 mins)', price: 200, description: 'Almond/Coconut/Gingelly/Navratna/Olive' },
      { name: 'Signature Head Oil Massage (20 mins)', price: 350, description: 'Onion Seed/Jojoba Beads' }
    ]
  },

  groom: {
    title: 'GROOM (Make-up & Hair Styling)',
    items: [
      { name: 'Classic', price: 2000, description: 'Selective Outlets*' },
      { name: 'High Definition', price: 3000, description: 'Selective Outlets*' }
    ]
  },

  deTan: {
    title: 'DE-TAN',
    items: [
      { name: 'Face & Neck', price: 200 },
      { name: 'Half Arms (Both)', price: 150 },
      { name: 'Full Arms (Both)', price: 250 },
      { name: 'Feet', price: 100 }
    ]
  },

  handsOrFeet: {
    title: 'HANDS OR FEET',
    items: [
      { name: 'Deluxe', price: 400 },
      { name: 'Signature', price: 600 },
      { name: 'Cut & File', price: 100 }
    ]
  },

  weddingDeals: {
    title: 'WEDDING DEALS',
    items: [
      {
        name: 'Wedding Package 1',
        price: 2999,
        includes: 'Any Haircut + Shave or Beard Design + Full Arms De-Tan + Hair Spa (Dry/Repair) or Global Hair Color* + Vitamin Fix Facial'
      },
      {
        name: 'Wedding Package 2',
        price: 3999,
        includes: 'Any Haircut + Shave or Beard Design + Full Arms De-Tan + Nourishing Protein Treatment + Shine Lume Facial'
      },
      {
        name: 'Wedding Package 3',
        price: 4999,
        includes: 'Any Haircut + Shave or Beard Design + Full Arms De-Tan + Detox Hair Spa (With Oil Shots) + Crystal Bright Facial'
      }
    ]
  },

  notes: [
    'As per request, ₹10 will be applicable for the usage of disposable cutting sheet.',
    'Haircut price varies depending on the style you choose.',
    'All pre booked appointments may vary up to 20 minutes.',
    'Monodose Kits used for all Facials, Manicures and Pedicures, prioritizing hygiene and personalized care.',
    'We offer both ammonia and ammonia-free hair colour options (prices are the same for both). Please confirm your preferred option with our stylist before the service.'
  ]
};

module.exports = services;
