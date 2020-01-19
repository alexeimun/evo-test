require('dotenv').config();

/**
 * @summary Makes sure all env vars are set
 */

const {
    MONGO_URL,
    JWT_PRIVATE_KEY,
} = process.env;

if (!MONGO_URL || MONGO_URL.trim().length === 0) {
    console.error('FATAL ERROR: MONGO_URL env var missing');
    process.exit(1);
}

if (!JWT_PRIVATE_KEY || JWT_PRIVATE_KEY.trim().length === 0) {
    console.error('FATAL ERROR: JWT_PRIVATE_KEY env var missing');
    process.exit(1);
}
