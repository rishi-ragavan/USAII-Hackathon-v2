// Shared data contract. Person 1 owns this. Persons 2 & 3 import these shapes.

/**
 * @typedef {Object} Property
 * @property {string} id
 * @property {string} address
 * @property {string} city
 * @property {string} state        // 2-letter
 * @property {string} zip
 * @property {string} county
 * @property {string} fips         // 5-digit county FIPS  -> HUD income limits
 * @property {string} censusTract  // 11-digit            -> HMDA lenders/rates
 * @property {number} lat          // -> USDA eligibility
 * @property {number} lng
 * @property {number} price
 * @property {number} beds
 * @property {number} baths
 * @property {number} sqft
 * @property {string} propertyType
 * @property {string} photo
 */

/**
 * @typedef {Object} UserProfile
 * @property {number} income          // annual household income
 * @property {number} householdSize
 * @property {boolean} firstTimeBuyer
 * @property {boolean} veteran
 * @property {number} savings         // cash on hand for down payment
 */

/**
 * @typedef {Object} EligibilityResult  // produced by Person 2
 * @property {string} name              // program, e.g. "USDA 0% Down"
 * @property {number} downPayment       // estimated $ needed
 * @property {boolean} qualifies
 * @property {string} note
 */

/**
 * @typedef {Object} LenderResult       // produced by Person 3
 * @property {string} name
 * @property {number} apr
 * @property {string} note
 */

export {};
