/**
 * Franchise Routing Service
 * Maps city/state to franchise officers and routes inquiries
 */

class FranchiseService {
  constructor() {
    // State/City to Franchise Officer mapping
    // TODO: Load this from database or config file in production
    this.franchiseOfficers = {
      'tamil nadu': {
        name: 'Rajesh Kumar',
        phone: '+919876543210',
        cities: ['chennai', 'coimbatore', 'madurai', 'salem', 'trichy'],
        state: 'Tamil Nadu'
      },
      'karnataka': {
        name: 'Priya Sharma',
        phone: '+919876543211',
        cities: ['bangalore', 'bengaluru', 'mysore', 'mangalore', 'hubli'],
        state: 'Karnataka'
      },
      'maharashtra': {
        name: 'Amit Patel',
        phone: '+919876543212',
        cities: ['mumbai', 'pune', 'nagpur', 'nashik', 'aurangabad'],
        state: 'Maharashtra'
      },
      'delhi': {
        name: 'Vikram Singh',
        phone: '+919876543213',
        cities: ['delhi', 'new delhi', 'gurgaon', 'noida', 'faridabad'],
        state: 'Delhi NCR'
      },
      'telangana': {
        name: 'Sneha Reddy',
        phone: '+919876543214',
        cities: ['hyderabad', 'warangal', 'nizamabad', 'karimnagar'],
        state: 'Telangana'
      },
      'west bengal': {
        name: 'Arjun Banerjee',
        phone: '+919876543215',
        cities: ['kolkata', 'siliguri', 'durgapur', 'asansol'],
        state: 'West Bengal'
      },
      'gujarat': {
        name: 'Meera Shah',
        phone: '+919876543216',
        cities: ['ahmedabad', 'surat', 'vadodara', 'rajkot', 'bhavnagar'],
        state: 'Gujarat'
      },
      'rajasthan': {
        name: 'Karan Rathore',
        phone: '+919876543217',
        cities: ['jaipur', 'jodhpur', 'udaipur', 'kota', 'bikaner'],
        state: 'Rajasthan'
      },
      'kerala': {
        name: 'Lakshmi Nair',
        phone: '+919876543218',
        cities: ['kochi', 'thiruvananthapuram', 'kozhikode', 'thrissur', 'kollam'],
        state: 'Kerala'
      },
      'punjab': {
        name: 'Harpreet Singh',
        phone: '+919876543219',
        cities: ['ludhiana', 'amritsar', 'jalandhar', 'patiala', 'bathinda'],
        state: 'Punjab'
      }
    };

    // Default officer for states not in the list
    this.defaultOfficer = {
      name: 'National Franchise Head',
      phone: '+919876543200',
      state: 'India'
    };
  }

  /**
   * Find franchise officer for a given city/state
   * @param {string} location - City or state name
   * @returns {object} Franchise officer details
   */
  findOfficer(location) {
    if (!location) {
      return null;
    }

    const normalizedLocation = location.toLowerCase().trim();

    // First, try to match by state
    for (const [state, officer] of Object.entries(this.franchiseOfficers)) {
      if (normalizedLocation.includes(state)) {
        return {
          ...officer,
          matchType: 'state'
        };
      }
    }

    // If no state match, try to match by city
    for (const [state, officer] of Object.entries(this.franchiseOfficers)) {
      if (officer.cities.some(city => normalizedLocation.includes(city))) {
        return {
          ...officer,
          matchType: 'city'
        };
      }
    }

    // If no match found, return default officer
    return {
      ...this.defaultOfficer,
      matchType: 'default'
    };
  }

  /**
   * Generate formatted response message for franchise inquiry
   * @param {object} officer - Franchise officer details
   * @param {string} location - User's location
   * @returns {string} Formatted message
   */
  generateResponseMessage(officer, location) {
    if (!officer) {
      return `Thank you for your interest in McKingstown franchise! 🤝

Please share your city and state, and I'll connect you with the right franchise manager.`;
    }

    return `Thank you for your interest in McKingstown franchise from ${location}! 🤝

I've connected you with our franchise officer for your region:

👤 **${officer.name}**
📍 ${officer.state}
📱 WhatsApp: ${officer.phone}

Please reach out to them directly for:
• Franchise investment details
• Outlet setup process
• ROI expectations
• Location requirements
• Training & support

They'll be happy to guide you through the entire process!

Your lead has been recorded. Our team will also reach out to you within 24 hours. 📝`;
  }

  /**
   * Get all franchise officers (for admin purposes)
   * @returns {object} All franchise officers
   */
  getAllOfficers() {
    return this.franchiseOfficers;
  }

  /**
   * Add or update franchise officer
   * @param {string} state - State name
   * @param {object} officerData - Officer details
   */
  updateOfficer(state, officerData) {
    const normalizedState = state.toLowerCase().trim();
    this.franchiseOfficers[normalizedState] = {
      ...officerData,
      state: state
    };
  }
}

// Export singleton instance
module.exports = new FranchiseService();
