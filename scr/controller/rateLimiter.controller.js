const rateLimit = require('express-rate-limit');

// Custom message when limit is reached
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Allow only 5 attempts
  message: {
    error: true,
    message: '⛔ អ្នកត្រូវបានផ្អាកបណ្តោះអាសន្ន ពីព្រោះបានព្យាយាមចូលច្រើនដង។ សូមព្យាយាមម្ដងទៀតក្រោយនេះ។',
    status: 429
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter };
