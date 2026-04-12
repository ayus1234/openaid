const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `SET (${process.env.GEMINI_API_KEY.length} chars, starts: ${process.env.GEMINI_API_KEY.substring(0,8)})` : 'NOT SET');
console.log('PORT:', process.env.PORT);
