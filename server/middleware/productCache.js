// In-memory cache object
const productcache = {};
// Middleware function to check cache
const productMiddleware = (req, res, next) => {
    const key = req.originalUrl;
    // Check if data exists in cache
    if (productcache[key]) {
        console.log('Products Data found in cache.');
        // console.log(productcache);
        res.send(productcache[key]);
    } else {
        console.log('Data not found in cache. Executing route...');
        next();
    }   
};

module.exports = { productMiddleware, productcache}; 