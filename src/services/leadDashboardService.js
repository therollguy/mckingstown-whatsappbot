/**
 * Lead Dashboard Service
 * 
 * Tracks and logs franchise enquiries for dashboard updates.
 * Stores leads in JSON file and provides methods to query/export.
 */

const fs = require('fs').promises;
const path = require('path');

const LEADS_FILE = path.join(__dirname, '../../data/franchise-leads.json');

/**
 * Lead status types
 */
const LeadStatus = {
  NEW: 'new',
  FORWARDED: 'forwarded',
  CONTACTED: 'contacted',
  IN_DISCUSSION: 'in_discussion',
  CONVERTED: 'converted',
  NOT_INTERESTED: 'not_interested'
};

/**
 * Initialize leads file if it doesn't exist
 */
async function initializeLeadsFile() {
  try {
    await fs.access(LEADS_FILE);
  } catch {
    // File doesn't exist, create it
    const initialData = {
      leads: [],
      metadata: {
        totalLeads: 0,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      }
    };
    await fs.writeFile(LEADS_FILE, JSON.stringify(initialData, null, 2));
  }
}

/**
 * Read all leads from file
 * @returns {Promise<Object>} Leads data
 */
async function readLeads() {
  try {
    await initializeLeadsFile();
    const data = await fs.readFile(LEADS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading leads file:', error);
    return { leads: [], metadata: { totalLeads: 0 } };
  }
}

/**
 * Write leads to file
 * @param {Object} data - Leads data to write
 */
async function writeLeads(data) {
  try {
    data.metadata.lastUpdated = new Date().toISOString();
    await fs.writeFile(LEADS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing leads file:', error);
  }
}

/**
 * Create a new franchise lead
 * @param {Object} leadInfo - Lead information
 * @returns {Promise<Object>} Created lead with ID
 */
async function createLead(leadInfo) {
  const data = await readLeads();
  
  const lead = {
    id: `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    customerPhone: leadInfo.customerPhone || 'Unknown',
    customerName: leadInfo.customerName || 'Unknown',
    location: leadInfo.location || 'Not specified',
    enquiryType: leadInfo.enquiryType || 'general',
    enquiryMessage: leadInfo.enquiryMessage || '',
    interestedIn: leadInfo.interestedIn || [],
    status: LeadStatus.NEW,
    source: 'whatsapp_bot',
    assignedTo: leadInfo.assignedTo || null,
    regionalAdvisor: leadInfo.regionalAdvisor || null,
    forwardedAt: leadInfo.forwardedAt || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: []
  };

  data.leads.unshift(lead); // Add to beginning
  data.metadata.totalLeads = data.leads.length;
  
  await writeLeads(data);
  
  console.log(`📊 Lead created: ${lead.id} - ${lead.customerPhone}`);
  
  return lead;
}

/**
 * Update lead status
 * @param {string} leadId - Lead ID
 * @param {string} status - New status
 * @param {string} note - Optional note about the update
 */
async function updateLeadStatus(leadId, status, note = null) {
  const data = await readLeads();
  const lead = data.leads.find(l => l.id === leadId);
  
  if (lead) {
    lead.status = status;
    lead.updatedAt = new Date().toISOString();
    
    if (note) {
      lead.notes.push({
        timestamp: new Date().toISOString(),
        note,
        type: 'status_update'
      });
    }
    
    await writeLeads(data);
    console.log(`📊 Lead updated: ${leadId} → ${status}`);
    return true;
  }
  
  return false;
}

/**
 * Mark lead as forwarded to regional advisor
 * @param {string} leadId - Lead ID
 * @param {Object} advisorInfo - Regional advisor details
 */
async function markLeadForwarded(leadId, advisorInfo) {
  const data = await readLeads();
  const lead = data.leads.find(l => l.id === leadId);
  
  if (lead) {
    lead.status = LeadStatus.FORWARDED;
    lead.forwardedAt = new Date().toISOString();
    lead.regionalAdvisor = advisorInfo;
    lead.updatedAt = new Date().toISOString();
    lead.notes.push({
      timestamp: new Date().toISOString(),
      note: `Forwarded to ${advisorInfo.name} (${advisorInfo.region})`,
      type: 'forwarding'
    });
    
    await writeLeads(data);
    console.log(`📊 Lead forwarded: ${leadId} → ${advisorInfo.name}`);
    return true;
  }
  
  return false;
}

/**
 * Add note to lead
 * @param {string} leadId - Lead ID
 * @param {string} note - Note text
 * @param {string} type - Note type (default: 'general')
 */
async function addLeadNote(leadId, note, type = 'general') {
  const data = await readLeads();
  const lead = data.leads.find(l => l.id === leadId);
  
  if (lead) {
    lead.notes.push({
      timestamp: new Date().toISOString(),
      note,
      type
    });
    lead.updatedAt = new Date().toISOString();
    
    await writeLeads(data);
    return true;
  }
  
  return false;
}

/**
 * Get leads summary statistics
 * @returns {Promise<Object>} Summary statistics
 */
async function getLeadsSummary() {
  const data = await readLeads();
  
  const summary = {
    total: data.leads.length,
    byStatus: {},
    byLocation: {},
    byEnquiryType: {},
    recentLeads: data.leads.slice(0, 10),
    todayCount: 0,
    weekCount: 0,
    monthCount: 0
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  data.leads.forEach(lead => {
    // Count by status
    summary.byStatus[lead.status] = (summary.byStatus[lead.status] || 0) + 1;
    
    // Count by location
    if (lead.location) {
      summary.byLocation[lead.location] = (summary.byLocation[lead.location] || 0) + 1;
    }
    
    // Count by enquiry type
    summary.byEnquiryType[lead.enquiryType] = (summary.byEnquiryType[lead.enquiryType] || 0) + 1;
    
    // Time-based counts
    const leadDate = new Date(lead.createdAt);
    if (leadDate >= today) summary.todayCount++;
    if (leadDate >= weekAgo) summary.weekCount++;
    if (leadDate >= monthAgo) summary.monthCount++;
  });

  return summary;
}

/**
 * Get leads by status
 * @param {string} status - Lead status
 * @returns {Promise<Array>} Filtered leads
 */
async function getLeadsByStatus(status) {
  const data = await readLeads();
  return data.leads.filter(lead => lead.status === status);
}

/**
 * Search leads by phone number
 * @param {string} phone - Phone number to search
 * @returns {Promise<Array>} Matching leads
 */
async function getLeadsByPhone(phone) {
  const data = await readLeads();
  return data.leads.filter(lead => lead.customerPhone.includes(phone));
}

/**
 * Export leads to CSV format
 * @returns {Promise<string>} CSV content
 */
async function exportLeadsToCSV() {
  const data = await readLeads();
  
  const headers = [
    'ID', 'Phone', 'Name', 'Location', 'Enquiry Type', 
    'Status', 'Regional Advisor', 'Created At', 'Forwarded At'
  ];
  
  const rows = data.leads.map(lead => [
    lead.id,
    lead.customerPhone,
    lead.customerName,
    lead.location,
    lead.enquiryType,
    lead.status,
    lead.regionalAdvisor ? lead.regionalAdvisor.name : 'Not assigned',
    lead.createdAt,
    lead.forwardedAt || 'Not forwarded'
  ]);
  
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csv;
}

module.exports = {
  LeadStatus,
  createLead,
  updateLeadStatus,
  markLeadForwarded,
  addLeadNote,
  getLeadsSummary,
  getLeadsByStatus,
  getLeadsByPhone,
  exportLeadsToCSV,
  readLeads
};
