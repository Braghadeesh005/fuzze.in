// In-memory cache object
const usercache = {};
// Middleware function to check cache
const userMiddleware = (req, res, next) => {
    const key = `user_${req.userID}`;
    // Check if data exists in cache
    if (usercache[key]) {
        console.log('user data found in cache.');
        res.send(usercache[key]);
    } else {
        console.log('user data not found in cache. Executing route...');
        next();
    }
};
module.exports = { userMiddleware, usercache };
