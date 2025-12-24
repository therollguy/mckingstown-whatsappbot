/**
 * Dashboard API Routes
 * 
 * API endpoints for viewing and managing franchise leads dashboard.
 */

const express = require('express');
const router = express.Router();
const leadDashboardService = require('../services/leadDashboardService');
const { getAllActiveAdvisors, regionalAdvisors } = require('../data/regionalAdvisors');

/**
 * GET /dashboard/leads/summary
 * Get summary statistics of all leads
 */
router.get('/leads/summary', async (req, res) => {
  try {
    const summary = await leadDashboardService.getLeadsSummary();
    res.json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting leads summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leads summary'
    });
  }
});

/**
 * GET /dashboard/leads
 * Get all leads with optional filters
 */
router.get('/leads', async (req, res) => {
  try {
    const { status, phone, limit } = req.query;
    
    let leads;
    
    if (status) {
      leads = await leadDashboardService.getLeadsByStatus(status);
    } else if (phone) {
      leads = await leadDashboardService.getLeadsByPhone(phone);
    } else {
      const data = await leadDashboardService.readLeads();
      leads = data.leads;
    }
    
    // Apply limit if specified
    if (limit) {
      leads = leads.slice(0, parseInt(limit));
    }
    
    res.json({
      success: true,
      count: leads.length,
      data: leads,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting leads:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leads'
    });
  }
});

/**
 * GET /dashboard/leads/:leadId
 * Get specific lead by ID
 */
router.get('/leads/:leadId', async (req, res) => {
  try {
    const { leadId } = req.params;
    const data = await leadDashboardService.readLeads();
    const lead = data.leads.find(l => l.id === leadId);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }
    
    res.json({
      success: true,
      data: lead,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting lead:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lead'
    });
  }
});

/**
 * PUT /dashboard/leads/:leadId/status
 * Update lead status
 */
router.put('/leads/:leadId/status', async (req, res) => {
  try {
    const { leadId } = req.params;
    const { status, note } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }
    
    const updated = await leadDashboardService.updateLeadStatus(leadId, status, note);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Lead status updated successfully',
      leadId,
      status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update lead status'
    });
  }
});

/**
 * POST /dashboard/leads/:leadId/notes
 * Add note to lead
 */
router.post('/leads/:leadId/notes', async (req, res) => {
  try {
    const { leadId } = req.params;
    const { note, type } = req.body;
    
    if (!note) {
      return res.status(400).json({
        success: false,
        error: 'Note is required'
      });
    }
    
    const added = await leadDashboardService.addLeadNote(leadId, note, type || 'general');
    
    if (!added) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Note added successfully',
      leadId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add note'
    });
  }
});

/**
 * GET /dashboard/leads/export/csv
 * Export all leads to CSV
 */
router.get('/leads/export/csv', async (req, res) => {
  try {
    const csv = await leadDashboardService.exportLeadsToCSV();
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="franchise-leads-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting leads:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export leads'
    });
  }
});

/**
 * GET /dashboard/advisors
 * Get all regional advisors configuration
 */
router.get('/advisors', async (req, res) => {
  try {
    const activeAdvisors = getAllActiveAdvisors();
    
    res.json({
      success: true,
      active: activeAdvisors.length,
      total: Object.keys(regionalAdvisors).length,
      data: {
        activeAdvisors,
        allRegions: Object.keys(regionalAdvisors)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting advisors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch advisors'
    });
  }
});

/**
 * GET /dashboard/stats
 * Get comprehensive dashboard statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const summary = await leadDashboardService.getLeadsSummary();
    const activeAdvisors = getAllActiveAdvisors();
    
    const stats = {
      leads: {
        total: summary.total,
        today: summary.todayCount,
        week: summary.weekCount,
        month: summary.monthCount,
        byStatus: summary.byStatus,
        topLocations: Object.entries(summary.byLocation)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([location, count]) => ({ location, count }))
      },
      advisors: {
        active: activeAdvisors.length,
        total: Object.keys(regionalAdvisors).length,
        regions: activeAdvisors.map(a => a.region)
      },
      recentActivity: summary.recentLeads.slice(0, 5).map(lead => ({
        id: lead.id,
        phone: lead.customerPhone,
        location: lead.location,
        status: lead.status,
        createdAt: lead.createdAt
      }))
    };
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

/**
 * GET /dashboard
 * Serve dashboard HTML page
 */
router.get('/', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>McKingstown Franchise Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    .header {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      margin-bottom: 30px;
    }
    .header h1 {
      color: #667eea;
      font-size: 32px;
      margin-bottom: 10px;
    }
    .header p {
      color: #666;
      font-size: 16px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: white;
      padding: 25px;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }
    .stat-card h3 {
      color: #667eea;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }
    .stat-card .value {
      font-size: 36px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    .stat-card .label {
      color: #888;
      font-size: 14px;
    }
    .table-container {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      overflow-x: auto;
    }
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .table-header h2 {
      color: #667eea;
      font-size: 24px;
    }
    .refresh-btn, .export-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      margin-left: 10px;
      transition: background 0.3s;
    }
    .refresh-btn:hover, .export-btn:hover {
      background: #764ba2;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background: #f8f9fa;
      padding: 15px;
      text-align: left;
      font-weight: 600;
      color: #667eea;
      border-bottom: 2px solid #667eea;
    }
    td {
      padding: 15px;
      border-bottom: 1px solid #eee;
      color: #333;
    }
    tr:hover {
      background: #f8f9fa;
    }
    .status-badge {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-new { background: #e3f2fd; color: #1976d2; }
    .status-forwarded { background: #fff3e0; color: #f57c00; }
    .status-contacted { background: #f3e5f5; color: #7b1fa2; }
    .status-converted { background: #e8f5e9; color: #388e3c; }
    .loading {
      text-align: center;
      padding: 40px;
      color: #667eea;
      font-size: 18px;
    }
    .error {
      background: #ffebee;
      color: #c62828;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>👑 McKingstown Franchise Dashboard</h1>
      <p>Track and manage franchise enquiries in real-time</p>
    </div>

    <div class="stats-grid" id="stats-grid">
      <div class="loading">Loading statistics...</div>
    </div>

    <div class="table-container">
      <div class="table-header">
        <h2>Recent Franchise Leads</h2>
        <div>
          <button class="export-btn" onclick="exportCSV()">📥 Export CSV</button>
          <button class="refresh-btn" onclick="loadData()">🔄 Refresh</button>
        </div>
      </div>
      <div id="leads-table">
        <div class="loading">Loading leads...</div>
      </div>
    </div>
  </div>

  <script>
    async function loadData() {
      try {
        // Load statistics
        const statsRes = await fetch('/dashboard/stats');
        const statsData = await statsRes.json();
        
        if (statsData.success) {
          displayStats(statsData.data);
        }

        // Load leads
        const leadsRes = await fetch('/dashboard/leads?limit=50');
        const leadsData = await leadsRes.json();
        
        if (leadsData.success) {
          displayLeads(leadsData.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('leads-table').innerHTML = 
          '<div class="error">Failed to load data. Please refresh the page.</div>';
      }
    }

    function displayStats(stats) {
      const html = \`
        <div class="stat-card">
          <h3>Total Leads</h3>
          <div class="value">\${stats.leads.total}</div>
          <div class="label">All time</div>
        </div>
        <div class="stat-card">
          <h3>Today</h3>
          <div class="value">\${stats.leads.today}</div>
          <div class="label">New leads</div>
        </div>
        <div class="stat-card">
          <h3>This Week</h3>
          <div class="value">\${stats.leads.week}</div>
          <div class="label">Last 7 days</div>
        </div>
        <div class="stat-card">
          <h3>Active Advisors</h3>
          <div class="value">\${stats.advisors.active}</div>
          <div class="label">Out of \${stats.advisors.total} regions</div>
        </div>
      \`;
      document.getElementById('stats-grid').innerHTML = html;
    }

    function displayLeads(leads) {
      if (leads.length === 0) {
        document.getElementById('leads-table').innerHTML = 
          '<p style="text-align:center;padding:40px;color:#888;">No leads yet. Start receiving franchise enquiries!</p>';
        return;
      }

      const html = \`
        <table>
          <thead>
            <tr>
              <th>Lead ID</th>
              <th>Phone</th>
              <th>Name</th>
              <th>Location</th>
              <th>Enquiry Type</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            \${leads.map(lead => \`
              <tr>
                <td><strong>\${lead.id}</strong></td>
                <td>\${lead.customerPhone}</td>
                <td>\${lead.customerName}</td>
                <td>\${lead.location}</td>
                <td>\${lead.enquiryType}</td>
                <td><span class="status-badge status-\${lead.status}">\${lead.status}</span></td>
                <td>\${new Date(lead.createdAt).toLocaleString()}</td>
              </tr>
            \`).join('')}
          </tbody>
        </table>
      \`;
      document.getElementById('leads-table').innerHTML = html;
    }

    function exportCSV() {
      window.location.href = '/dashboard/leads/export/csv';
    }

    // Load data on page load
    loadData();

    // Auto-refresh every 30 seconds
    setInterval(loadData, 30000);
  </script>
</body>
</html>
  `;
  
  res.send(html);
});

module.exports = router;
