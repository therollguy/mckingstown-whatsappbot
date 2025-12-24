/**
 * Regional Franchise Advisors Contact Database
 * 
 * Configure regional advisors with their WhatsApp numbers and coverage areas.
 * When you have the actual contact details, update this file.
 */

const regionalAdvisors = {
  // South India
  southIndia: {
    name: "Regional Franchise Advisor - South India",
    whatsappNumber: +918608334398, // Will be updated: Format: +919XXXXXXXXX
    coverageAreas: [
      "Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Puducherry",
      "Chennai", "Bangalore", "Hyderabad", "Coimbatore", "Madurai", "Kochi", "Mysore",
      "Vijayawada", "Visakhapatnam", "Thiruvananthapuram", "Salem", "Trichy"
    ],
    active: true // Set to true when WhatsApp number is configured
  },

  // West India
  westIndia: {
    name: "Regional Franchise Advisor - West India",
    whatsappNumber: null, // Will be updated: Format: +919XXXXXXXXX
    coverageAreas: [
      "Gujarat", "Maharashtra", "Goa", "Rajasthan",
      "Mumbai", "Ahmedabad", "Surat", "Pune", "Nagpur", "Jaipur", "Nashik"
    ],
    active: false
  },

  // North India
  northIndia: {
    name: "Regional Franchise Advisor - North India",
    whatsappNumber: null, // Will be updated: Format: +919XXXXXXXXX
    coverageAreas: [
      "Delhi", "Haryana", "Punjab", "Uttar Pradesh", "Uttarakhand", "Himachal Pradesh",
      "New Delhi", "Noida", "Gurgaon", "Chandigarh", "Lucknow"
    ],
    active: false
  },

  // East India
  eastIndia: {
    name: "Regional Franchise Advisor - East India",
    whatsappNumber: null, // Will be updated: Format: +919XXXXXXXXX
    coverageAreas: [
      "West Bengal", "Bihar", "Odisha", "Jharkhand", "Assam",
      "Kolkata", "Patna", "Bhubaneswar", "Guwahati"
    ],
    active: false
  },

  // International - Dubai
  dubai: {
    name: "Franchise Advisor - Dubai",
    whatsappNumber: null, // Will be updated: Format: +971XXXXXXXXX
    coverageAreas: [
      "Dubai", "UAE", "Middle East", "Gulf"
    ],
    active: false
  },

  // Default/Fallback - Central Office
  central: {
    name: "Central Franchise Office",
    whatsappNumber: null, // Will be updated: Format: +919XXXXXXXXX (Head Office)
    coverageAreas: ["*"], // Catch-all for unmatched regions
    active: false
  }
};

/**
 * Find the appropriate regional advisor based on location
 * @param {string} location - City, state, or region mentioned by user
 * @returns {Object|null} Regional advisor details or null if not found
 */
function getAdvisorByLocation(location) {
  if (!location) return null;

  const locationLower = location.toLowerCase();

  // Check each regional advisor's coverage areas
  for (const [region, advisor] of Object.entries(regionalAdvisors)) {
    if (!advisor.active || !advisor.whatsappNumber) continue;

    for (const area of advisor.coverageAreas) {
      if (locationLower.includes(area.toLowerCase()) || area.toLowerCase().includes(locationLower)) {
        return {
          region,
          name: advisor.name,
          whatsappNumber: advisor.whatsappNumber,
          coverageAreas: advisor.coverageAreas
        };
      }
    }
  }

  // Return central office as fallback if active
  if (regionalAdvisors.central.active && regionalAdvisors.central.whatsappNumber) {
    return {
      region: 'central',
      name: regionalAdvisors.central.name,
      whatsappNumber: regionalAdvisors.central.whatsappNumber,
      coverageAreas: regionalAdvisors.central.coverageAreas
    };
  }

  return null;
}

/**
 * Get all active regional advisors
 * @returns {Array} List of active advisors
 */
function getAllActiveAdvisors() {
  return Object.entries(regionalAdvisors)
    .filter(([_, advisor]) => advisor.active && advisor.whatsappNumber)
    .map(([region, advisor]) => ({
      region,
      name: advisor.name,
      whatsappNumber: advisor.whatsappNumber,
      coverageAreas: advisor.coverageAreas
    }));
}

/**
 * Check if any regional advisor is configured
 * @returns {boolean}
 */
function hasActiveAdvisors() {
  return Object.values(regionalAdvisors).some(
    advisor => advisor.active && advisor.whatsappNumber
  );
}

/**
 * Update regional advisor details (for configuration)
 * @param {string} region - Region key (southIndia, westIndia, etc.)
 * @param {string} whatsappNumber - WhatsApp number in international format
 * @param {boolean} active - Whether this advisor is active
 */
function updateAdvisor(region, whatsappNumber, active = true) {
  if (regionalAdvisors[region]) {
    regionalAdvisors[region].whatsappNumber = whatsappNumber;
    regionalAdvisors[region].active = active;
    return true;
  }
  return false;
}

module.exports = {
  regionalAdvisors,
  getAdvisorByLocation,
  getAllActiveAdvisors,
  hasActiveAdvisors,
  updateAdvisor
};
