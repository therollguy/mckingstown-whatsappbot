/**
 * Response Generator for McKingstown WhatsApp Bot
 * Generates formatted responses for different service categories
 */

const services = require('../data/services');

class ResponseGenerator {
  /**
   * Format complete menu
   */
  static getCompleteMenu() {
    return `📋 *MCKINGSTOWN COMPLETE MENU*

💈 *Type these keywords for details:*

• *haircut* - Haircut Services (₹75-₹200)
• *beard* - Beard Services (₹40-₹400)
• *spa* - Hair Spa Treatments (₹400-₹1,000)
• *facial* - Facial Services (₹300-₹4,500)
• *color* - Hair Color Services (₹100-₹1,200)
• *massage* - Oil Massage (₹200-₹350)
• *wedding* - Wedding Packages (₹2,999-₹4,999)
• *groom* - Makeup & Styling (₹2,000-₹3,000)

📍 100+ outlets across India
🌐 www.mckingstown.in

Type any service name to see prices! 😊`;
  }

  /**
   * Format haircut services
   */
  static getHaircutServices() {
    const haircut = services.haircut;
    let response = `💈 *MCKINGSTOWN HAIRCUT SERVICES*\n\n✂️ *Popular Haircuts:*\n`;
    
    haircut.items.forEach(item => {
      response += `• ${item.name} - ₹${item.price}\n`;
      if (item.description) response += `  ${item.description}\n`;
    });

    response += `\n💅 *Styling:*\n`;
    haircut.styling.forEach(item => {
      response += `• ${item.name} - ₹${item.price}\n`;
    });

    response += `\n📍 100+ outlets across India!\n\nType *"menu"* for all services or *"book"* to schedule! 😊`;
    
    return response;
  }

  /**
   * Format beard services
   */
  static getBeardServices() {
    const beard = services.beard;
    let response = `🧔 *MCKINGSTOWN BEARD SERVICES*\n\n`;
    
    beard.items.forEach(item => {
      if (item.price) {
        response += `• ${item.name} - ₹${item.price}\n`;
      } else {
        response += `\n🔥 *${item.name}:*\n${item.description}\n`;
      }
    });

    response += `\nType *"menu"* for all services! 💈`;
    
    return response;
  }

  /**
   * Format facial services
   */
  static getFacialServices() {
    const facials = services.facials;
    const advanced = services.advancedFacials;
    const cleanUp = services.cleanUp;
    
    let response = `✨ *MCKINGSTOWN FACIAL SERVICES*\n\n💎 *Premium Facials:*\n`;
    
    facials.items.forEach(item => {
      response += `• ${item.name} - ₹${item.price.toLocaleString('en-IN')}\n`;
    });

    response += `\n🌟 *Advanced Facials:*\n`;
    advanced.items.forEach(item => {
      response += `• ${item.name} - ₹${item.price.toLocaleString('en-IN')}\n`;
    });

    response += `\n🧖 *Clean Up:*\n`;
    cleanUp.items.forEach(item => {
      response += `• ${item.name} - ₹${item.price}\n`;
    });

    response += `\n*${facials.subtitle}*\n\nType *"book"* to schedule! 😊`;
    
    return response;
  }

  /**
   * Format hair spa services
   */
  static getHairSpaServices() {
    const spa = services.hairSpa;
    let response = `💆 *MCKINGSTOWN HAIR SPA*\n\n*Hair & Scalp Treatment:*\n\n`;
    
    spa.items.forEach(item => {
      response += `• ${item.name} - ₹${item.price}\n`;
    });

    response += `\nProfessional scalp care for healthy hair! 💇\n\nType *"menu"* for all services!`;
    
    return response;
  }

  /**
   * Format color services
   */
  static getColorServices() {
    const colour = services.colour;
    let response = `🎨 *MCKINGSTOWN COLOR SERVICES*\n\n`;
    
    colour.items.forEach(item => {
      response += `• ${item.name} - ₹${item.price.toLocaleString('en-IN')}\n`;
    });

    response += `\n*Add-On:*\n`;
    colour.addOn.forEach(item => {
      response += `• ${item.name} - ₹${item.price}\n`;
    });

    response += `\n*Both ammonia and ammonia-free options available!*\n\nType *"book"* to schedule! 🌈`;
    
    return response;
  }

  /**
   * Format wedding packages
   */
  static getWeddingPackages() {
    const wedding = services.weddingDeals;
    let response = `💍 *MCKINGSTOWN WEDDING PACKAGES*\n\n`;
    
    wedding.items.forEach((pkg, index) => {
      response += `*Package ${index + 1} - ₹${pkg.price.toLocaleString('en-IN')}*\n`;
      response += `${pkg.includes}\n\n`;
    });

    response += `✨ Complete grooming for your special day!\n\nType *"book"* to schedule! 🎉`;
    
    return response;
  }

  /**
   * Format oil massage services
   */
  static getMassageServices() {
    const massage = services.oilMassage;
    let response = `💆‍♂️ *MCKINGSTOWN OIL MASSAGE*\n\n`;
    
    massage.items.forEach(item => {
      response += `*${item.name}* - ₹${item.price}\n${item.description}\n\n`;
    });

    response += `Relaxing scalp therapy for stress relief! 🌿\n\nType *"book"* to schedule!`;
    
    return response;
  }

  /**
   * Format groom/makeup services
   */
  static getGroomServices() {
    const groom = services.groom;
    let response = `🎭 *MCKINGSTOWN GROOM SERVICES*\n\n*Make-up & Hair Styling:*\n\n`;
    
    groom.items.forEach(item => {
      response += `*${item.name}* - ₹${item.price.toLocaleString('en-IN')}\n${item.description}\n\n`;
    });

    response += `Professional styling for events & occasions!\n\nType *"book"* to schedule! ✨`;
    
    return response;
  }
}

module.exports = ResponseGenerator;
