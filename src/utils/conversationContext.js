/**
 * Conversation Context Manager
 * Tracks user conversation state and intent
 */

// In-memory storage for conversation context
const conversationContexts = new Map();

// Context expires after 30 minutes of inactivity
const CONTEXT_TIMEOUT = 30 * 60 * 1000;

/**
 * User intent types
 */
const IntentTypes = {
  SERVICES: 'services',
  FRANCHISE: 'franchise',
  UNKNOWN: 'unknown'
};

/**
 * Set user's conversation context
 */
function setUserContext(phoneNumber, intent, data = {}) {
  conversationContexts.set(phoneNumber, {
    intent,
    data,
    timestamp: Date.now(),
    lastActivity: Date.now()
  });
}

/**
 * Get user's conversation context
 */
function getUserContext(phoneNumber) {
  const context = conversationContexts.get(phoneNumber);
  
  if (!context) {
    return null;
  }
  
  // Check if context has expired
  if (Date.now() - context.lastActivity > CONTEXT_TIMEOUT) {
    conversationContexts.delete(phoneNumber);
    return null;
  }
  
  // Update last activity
  context.lastActivity = Date.now();
  return context;
}

/**
 * Update user's context data
 */
function updateUserContext(phoneNumber, data = {}) {
  const context = getUserContext(phoneNumber);
  if (context) {
    context.data = { ...context.data, ...data };
    context.lastActivity = Date.now();
  }
}

/**
 * Clear user's context
 */
function clearUserContext(phoneNumber) {
  conversationContexts.delete(phoneNumber);
}

/**
 * Check if user has active context
 */
function hasUserContext(phoneNumber) {
  return getUserContext(phoneNumber) !== null;
}

/**
 * Get user's intent (services or franchise)
 */
function getUserIntent(phoneNumber) {
  const context = getUserContext(phoneNumber);
  return context ? context.intent : IntentTypes.UNKNOWN;
}

/**
 * Check if user is in franchise flow
 */
function isInFranchiseFlow(phoneNumber) {
  return getUserIntent(phoneNumber) === IntentTypes.FRANCHISE;
}

/**
 * Check if user is in services flow
 */
function isInServicesFlow(phoneNumber) {
  return getUserIntent(phoneNumber) === IntentTypes.SERVICES;
}

module.exports = {
  IntentTypes,
  setUserContext,
  getUserContext,
  updateUserContext,
  clearUserContext,
  hasUserContext,
  getUserIntent,
  isInFranchiseFlow,
  isInServicesFlow
};
