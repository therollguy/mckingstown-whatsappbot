/**
 * McKingstown Franchise Service
 * Comprehensive franchise information and inquiry handling
 */

const franchiseData = {
  investment: {
    total: '₹19,00,000',
    areaLimit: 'Up to 500 Sq.Ft',
    breakup: [
      { item: 'Franchise Fee', amount: '₹3,00,000 + GST', note: 'Non Refundable' },
      { item: 'Salon Interiors', amount: '₹5,50,000', note: '₹1,100 per sq.ft' },
      { item: 'Signage & Branding', amount: '₹1,00,000' },
      { item: 'Products Start Up Kit', amount: '₹1,35,000', note: 'Hair & Beauty' },
      { item: '1st Order Kit & Furniture', amount: '₹4,65,000' },
      { item: 'Air Conditioner & Inverter', amount: '₹1,50,000' },
      { item: 'Tech Systems', amount: '₹67,000', note: 'Printer, Billing, Camera, Music' },
      { item: 'Pantry & Stationary', amount: '₹35,000' },
      { item: 'TV 40" Android', amount: '₹18,000' },
      { item: 'Launch Expenses', amount: '₹80,000', note: 'Press, Marketing, High Tea' }
    ],
    additionalNotes: [
      'Above quote excludes building advance',
      'Civil work and washroom remodelling not included',
      'Additional ₹550 per sq.ft if area exceeds 500 sq.ft',
      'Extra charges for sites outside Chennai (accommodation, travel, transport)',
      'Licensing fees and commissions not included'
    ]
  },

  revenue: {
    projections: [
      {
        level: 'Conservative',
        sales: '₹3,00,000',
        expenses: '₹2,30,000',
        profitMonth: '₹65,000',
        profitYear: '₹7,80,000',
        roi: '~41% annually'
      },
      {
        level: 'Moderate',
        sales: '₹4,00,000',
        expenses: '₹2,62,000',
        profitMonth: '₹1,33,000',
        profitYear: '₹15,96,000',
        roi: '~84% annually'
      },
      {
        level: 'Optimistic',
        sales: '₹5,00,000',
        expenses: '₹2,97,000',
        profitMonth: '₹1,98,000',
        profitYear: '₹23,76,000',
        roi: '~125% annually'
      }
    ],
    expenseBreakup: {
      salary: '₹1,22,000 - ₹1,60,000',
      rental: '₹40,000',
      products: '₹25,000 - ₹35,000',
      electricity: '₹8,000 - ₹12,000',
      royalty: '₹20,000',
      miscellaneous: '₹5,000 - ₹10,000',
      incentives: '₹15,000 - ₹25,000'
    }
  },

  locationRequirements: {
    minArea: '500 Sq. Feet',
    floor: 'Ground Floor Preferred',
    electrical: '3 Phase Electrical Connection',
    utilities: 'Water & Drainage Connection',
    visibility: 'High footfall area recommended'
  },

  outlets: {
    total: '100+',
    cities: ['Chennai', 'Bangalore', 'Dubai', 'Ahmedabad', 'Tirupati', 'Coimbatore', 'Surat'],
    regions: ['Tamil Nadu', 'Karnataka', 'Gujarat', 'Andhra Pradesh', 'Dubai (International)']
  },

  support: [
    'Location Analysis & Feasibility Study',
    'Marketing & Brand Promotion',
    'Complete Business Plan',
    'Staffing Assistance & Recruitment',
    'Business Development Support',
    'Comprehensive Training Programs',
    'Ongoing Product Support'
  ],

  advantages: [
    'Academy Training for Staff',
    'Certified Premium Products',
    'Competitive Pricing Structure',
    'Easy Exchange Policies',
    'Flexible Royalty Terms',
    'Open 7 Days a Week',
    'Non-Perishable Product Inventory'
  ],

  processSteps: [
    'Express your interest & schedule a meet in person',
    'Block your preferred location',
    'Start looking for properties',
    'Accept proposed layouts & costs',
    'Invest in store, renovation & start placing orders',
    'Drive Business and grow as per SOPs'
  ],

  contact: {
    phone: '+91 8939000150',
    email: 'franchise@mckingstown.com',
    address: '#809, 3rd Floor, Anna Salai, Teynampet, Chennai - 600002',
    landmark: 'Opposite to LIC METRO',
    website: 'www.mckingstown.com',
    company: 'Trinamite Grooming Hub Private Limited',
    social: '@mckingstown'
  },

  about: {
    mission: 'To grow the best, most profitable and most successful Men\'s Salon, where people love to work, and clients love to visit.',
    vision: 'Redefine grooming experience for modern men with a sophisticated blend of traditional techniques and modern trends.',
    experience: '10+ years in salon and grooming industry',
    usp: 'Premium quality and experience at affordable prices'
  }
};

// State-wise franchise officers
const franchiseOfficers = {
  'tamil nadu': {
    name: 'Rajesh Kumar',
    phone: '+918939000151',
    cities: ['chennai', 'coimbatore', 'madurai', 'trichy', 'salem', 'tirupati'],
    state: 'Tamil Nadu'
  },
  'karnataka': {
    name: 'Priya Sharma',
    phone: '+918939000152',
    cities: ['bangalore', 'bengaluru', 'mysore', 'mangalore', 'hubli'],
    state: 'Karnataka'
  },
  'gujarat': {
    name: 'Amit Patel',
    phone: '+918939000153',
    cities: ['ahmedabad', 'surat', 'vadodara', 'rajkot', 'baroda'],
    state: 'Gujarat'
  },
  'andhra pradesh': {
    name: 'Venkat Reddy',
    phone: '+918939000154',
    cities: ['vijayawada', 'visakhapatnam', 'guntur', 'nellore'],
    state: 'Andhra Pradesh'
  },
  'telangana': {
    name: 'Srinivas Rao',
    phone: '+918939000155',
    cities: ['hyderabad', 'warangal', 'nizamabad', 'karimnagar'],
    state: 'Telangana'
  },
  'maharashtra': {
    name: 'Suresh Desai',
    phone: '+918939000156',
    cities: ['mumbai', 'pune', 'nagpur', 'nashik', 'aurangabad'],
    state: 'Maharashtra'
  },
  'kerala': {
    name: 'Ravi Menon',
    phone: '+918939000157',
    cities: ['kochi', 'thiruvananthapuram', 'kozhikode', 'thrissur', 'kollam'],
    state: 'Kerala'
  },
  'delhi': {
    name: 'Vikram Singh',
    phone: '+918939000158',
    cities: ['delhi', 'noida', 'gurgaon', 'faridabad', 'ghaziabad'],
    state: 'Delhi NCR'
  },
  'rajasthan': {
    name: 'Mahesh Joshi',
    phone: '+918939000159',
    cities: ['jaipur', 'jodhpur', 'udaipur', 'kota', 'ajmer'],
    state: 'Rajasthan'
  },
  'west bengal': {
    name: 'Soumya Banerjee',
    phone: '+918939000160',
    cities: ['kolkata', 'siliguri', 'durgapur', 'asansol', 'howrah'],
    state: 'West Bengal'
  }
};

class FranchiseService {
  constructor() {
    this.data = franchiseData;
    this.officers = franchiseOfficers;
  }

  /**
   * Get complete franchise overview
   */
  getOverview() {
    return `🤝 *MCKINGSTOWN FRANCHISE OPPORTUNITY*

*Your Investment, Our Commitment*

🏪 *About Us:*
• 100+ outlets across India + Dubai
• 10+ years of grooming industry experience
• Premium grooming at affordable prices
• Expert professionals & academy training

💰 *Investment: ₹19,00,000*
(For up to 500 sq.ft outlet)

📊 *Expected Returns:*
• Monthly Profit: ₹65K - ₹1.98L
• Annual Profit: ₹7.8L - ₹23.76L
• ROI: 41% - 125% annually

📍 *Location: Minimum 500 sq.ft, Ground floor*

Type *"investment"* for detailed breakup
Type *"revenue"* for profit projections
Type *"support"* for franchise support
Type *"contact"* to connect with team

📞 Call: +91 8939000150
🌐 www.mckingstown.com`;
  }

  /**
   * Get investment details
   */
  getInvestmentDetails() {
    let response = `💰 *FRANCHISE INVESTMENT DETAILS*\n\n*Total Investment: ${this.data.investment.total}*\n(${this.data.investment.areaLimit})\n\n`;
    
    response += `📋 *Investment Breakup:*\n\n`;
    this.data.investment.breakup.forEach(item => {
      response += `• ${item.item}: ${item.amount}\n`;
      if (item.note) response += `  _${item.note}_\n`;
    });

    response += `\n⚠️ *Important Notes:*\n`;
    this.data.investment.additionalNotes.slice(0, 3).forEach(note => {
      response += `• ${note}\n`;
    });

    response += `\nType *"revenue"* for profit projections\nType *"contact"* to discuss with team\n\n📞 ${this.data.contact.phone}`;
    
    return response;
  }

  /**
   * Get revenue projections
   */
  getRevenueProjections() {
    let response = `📊 *REVENUE & PROFIT PROJECTIONS*\n\n`;
    
    this.data.revenue.projections.forEach(proj => {
      response += `*${proj.level} Scenario:*\n`;
      response += `💵 Sales: ${proj.sales}/month\n`;
      response += `💰 Net Profit: ${proj.profitMonth}/month\n`;
      response += `📈 Annual Profit: ${proj.profitYear}\n`;
      response += `🎯 ROI: ${proj.roi}\n\n`;
    });

    response += `*Monthly Expense Breakup:*\n`;
    response += `• Salary + Stay + Food: ${this.data.revenue.expenseBreakup.salary}\n`;
    response += `• Rental: ${this.data.revenue.expenseBreakup.rental}\n`;
    response += `• Products: ${this.data.revenue.expenseBreakup.products}\n`;
    response += `• Royalty: ${this.data.revenue.expenseBreakup.royalty}\n`;
    response += `• Others: ${this.data.revenue.expenseBreakup.miscellaneous}\n\n`;

    response += `Type *"investment"* for cost details\nType *"contact"* to discuss\n\n📞 ${this.data.contact.phone}`;
    
    return response;
  }

  /**
   * Get franchise support details
   */
  getSupportDetails() {
    let response = `🎯 *FRANCHISE SUPPORT & ADVANTAGES*\n\n*We Provide:*\n`;
    
    this.data.support.forEach(item => {
      response += `✅ ${item}\n`;
    });

    response += `\n*Your Advantages:*\n`;
    this.data.advantages.forEach(item => {
      response += `🌟 ${item}\n`;
    });

    response += `\n*6-Step Process:*\n`;
    this.data.processSteps.forEach((step, index) => {
      response += `${index + 1}. ${step}\n`;
    });

    response += `\nReady to start your franchise journey?\nType *"contact"* to connect!\n\n📞 ${this.data.contact.phone}`;
    
    return response;
  }

  /**
   * Get contact details
   */
  getContactDetails() {
    return `📞 *GET IN TOUCH WITH US*

*${this.data.contact.company}*

📍 *Head Office:*
${this.data.contact.address}
Tamil Nadu, India
${this.data.contact.landmark}

📱 *Phone:* ${this.data.contact.phone}
✉️ *Email:* ${this.data.contact.email}
🌐 *Website:* ${this.data.contact.website}
📲 *Social Media:* ${this.data.contact.social}

*For State-Specific Queries:*
Please share your state/city, and I'll connect you with the regional franchise manager! 🤝`;
  }

  /**
   * Find franchise officer by location
   */
  findOfficer(location) {
    if (!location) return null;

    const normalized = location.toLowerCase().trim();

    // Try state match first
    for (const [state, officer] of Object.entries(this.officers)) {
      if (normalized.includes(state) || state.includes(normalized)) {
        return { ...officer, matchType: 'state' };
      }
    }

    // Try city match
    for (const officer of Object.values(this.officers)) {
      if (officer.cities.some(city => normalized.includes(city) || city.includes(normalized))) {
        return { ...officer, matchType: 'city' };
      }
    }

    return null;
  }

  /**
   * Generate response for location-specific inquiry
   */
  getLocationResponse(location) {
    const officer = this.findOfficer(location);

    if (!officer) {
      return `Thank you for your interest in McKingstown franchise! 🤝

Please share your specific city or state, and I'll connect you with the right regional manager.

Or call our head office directly:
📞 ${this.data.contact.phone}

Type *"franchise"* for complete details!`;
    }

    return `Thank you for your interest in McKingstown franchise from *${location}*! 🤝

*Your Regional Franchise Manager:*

👤 *${officer.name}*
📍 ${officer.state}
📱 *WhatsApp:* ${officer.phone}

They will help you with:
✅ Investment details & ROI
✅ Location selection & analysis
✅ Outlet setup process
✅ Training & ongoing support

*Your inquiry has been recorded!* 📝
Our team will contact you within 24 hours.

You can also reach out directly:
📞 Head Office: ${this.data.contact.phone}

Type *"investment"* or *"revenue"* for details!`;
  }
}

module.exports = new FranchiseService();
