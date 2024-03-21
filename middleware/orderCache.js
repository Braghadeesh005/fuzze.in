// In-memory cache object
const order = {};
// Middleware function to check cache
const orderMiddleware = (req, res, next) => {
    const key = `order_${req.userID}`;
    // Check if data exists in cache
    if (order[key]) {
        console.log('Order data found in cache.');
        res.send(order[key]);
    } else {
        console.log('Order data not found in cache. Executing route...');
        next();
    }
};

module.exports = { orderMiddleware, order };
