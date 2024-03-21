// In-memory cache object
const cartcache = {};
// Middleware function to check cache
const cartcacheMiddleware = (req, res, next) => {
    const key = `cart_${req.userID}`;
    // Check if data exists in cache
    if (cartcache[key]) {
        console.log('Cart Data found in cache.');
        res.send(cartcache[key]);
    } else {
        console.log('Cart data not found in cache. Executing route...');
        next();
    }
};
 
module.exports = { cartcacheMiddleware, cartcache };
