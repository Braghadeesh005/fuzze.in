//  --------------------------------------------------------------------------------       SETUP         -----------------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")

const passport = require("passport");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const authenticate = require('../middleware/authenticate')

const razorpay =require("razorpay");
const crypto =require("crypto") 

// Caches
const { productcache, productMiddleware } = require('../middleware/productCache');
const { cartcache, cartcacheMiddleware } = require('../middleware/cartCache');
const { order, orderMiddleware } = require('../middleware/orderCache');
const { usercache, userMiddleware } = require('../middleware/userCache');


//DB
require('../db/dbconn')

//Schema
const productSchema = require('../schema/productSchema');
const userSchema = require("../schema/userSchema");
const orderSchema = require("../schema/orderSchema");
const reviewSchema = require('../schema/reviewSchema');
const PaymentSchema = require('../schema/PaymentSchema');

//Razorpay
const instance = new razorpay({
	key_id:process.env.KEY,
	key_secret:process.env.SECRET,
  })


  router.get("/",(req,res)=>{
	res.send("hello");
  })

 
// ---------------------------------------------------------------------------------   GOOGLE OAUTH 2     --------------------------------------------------------------------------------------

//signup - strategy
router.get("/auth/google/signup", passport.authenticate("google", ["profile", "email"]));

router.get(
	"/auth/google/signup/callback",
	passport.authenticate("google",{session: false}),
	(req,res) => {
		// successRedirect: process.env.CLIENT_URL,
		// failureRedirect: "/signup/failed",
		const token = req.user.token
		res.cookie("jwtoken", token, { path: '/' },{ expires:new Date(Date.now()+ 25892000),httpOnly: true });
		console.log("Cookie stored");
		console.log("========================");
    	res.redirect(process.env.CLIENT_URL);

	}
);


// -------------------------------------------------------------------------------------    ROUTES     ----------------------------------------------------------------------------------------

//For registering users
router.post('/user-register', async (req, res) => {
	const { displayName, email, password } = req.body;
	// Validate email format using a regular expression
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	if (!email || !emailRegex.test(email)) {
	  console.log("Invalid email format");
	  return res.status(422).json({ error: "Invalid email format" });
	}
	// Validate password length
	if (!password || password.length < 6) {
	  console.log("Password should be at least 6 characters long");
	  return res.status(422).json({ error: "Password should be at least 6 characters long" });
	}
	// Ensure displayName is not empty
	if (!displayName) {
	  console.log("Display name is required");
	  return res.status(422).json({ error: "Display name is required" });
	}
	try {
	  const userExist = await userSchema.findOne({ email: email });
	  if (userExist) {
		console.log("Email already exists");
		return res.status(422).json({ error: "Email already exists" });
	  }  
	  const user = new userSchema({ displayName, email, password });
	  const token = await user.generateAuthToken();
	  res.cookie("jwtoken", token, { path: '/', expires: new Date(Date.now() + 25892000), httpOnly: true });
	  console.log("Cookie stored");
	  console.log("========================");
	  const userRegister = await user.save();
	  if (userRegister) {
		console.log(user);
		console.log("User registered successfully");
		res.status(201).json({ message: "User registered successfully" });
	  } else {
		console.log("Failed to register");
		res.status(500).json({ error: "Failed to register" });
	  }
	} catch (err) {
	  console.log(err);
	}
  });
  

// Login for Users
router.post('/user-login', async (req,res)=>{
    try
    { 
        const { email, password }=req.body;
        if(!email || !password){
         console.log("Please fill the data");
         return res.status(400).json({errror:"Please fill the data"})
        }
        const userLogin = await userSchema.findOne({email:email}); 
        if(userLogin)
        {
           const isMatch = await bcrypt.compare(password, userLogin.password);
           if(!isMatch)
           {
            console.log("Invalid Credentials");
            return res.status(400).json({error:"Invalid Credentials"});
           }
           else
           { 
			const token = await userLogin.generateAuthToken();
			res.cookie("jwtoken", token, { path: '/' },{ expires:new Date(Date.now()+ 25892000),httpOnly: true });
			console.log("Cookie stored");
			console.log("========================");
            console.log("User SignIn Successful");
            res.json({message:"User SignIn Successful"});
           }
        }
        else
        {
         console.log("Email you have entered has not registered or incorrect");
         return res.status(400).json({error:"Email you have entered has not registered or incorrect"});
        }
     }  
     catch(err)
     {
        console.log(err);
     }
})


//This will return the user's detail to the user's page in client side
router.get("/getData",authenticate, (req,res) => 
{
	// // Caching
    // const key = `user_${req.userID}`;
    // usercache[key] = req.rootUser;
    // setTimeout(() => {
    //     delete usercache[key]; 
    // }, 7200000);

    res.send(req.rootUser);
});  

//to get all data with images
router.get('/product/images', (req, res) => {
	productSchema.find()
	  .sort('-created')
	  .then((images) => {
		res.json(images);
	  }).catch((err) => {
		res.status(500).json({ success: false, error: err.message });
	  });
  });
	

 // handle GET request for all Products
router.get('/products', productMiddleware, async (req, res) => {
    try {
        const products = await productSchema.find();
        // Caching
        const key = req.originalUrl;
        productcache[key] = products;
        setTimeout(() => {
            delete productcache[key]; 
        }, 7200000); 

        res.send(products);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});
  
// Get an product by ID (dynamic pages) with caching
router.get('/api/dynamicproduct/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        // Check if product exists in cache
        const cachedProduct = Object.values(productcache['/products']).find(product => product._id.toString() === productId);

        if (cachedProduct) {
            console.log('Expected Product found in cache.');
            res.json(cachedProduct);
        } else {
            // If product not found in cache, fetch from database
            console.log('Expected Product not found in cache. Fetching from database...');
            const product = await productSchema.findById(productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            } 
            // Add fetched product to cache
            productcache['/products'].push(product);
            console.log('New Product added to cache.');
            res.json(product);
        }
    } catch (err) {    
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch product details' });
    }
});

// Clearance of cookies when Logout 
router.get("/logout1", (req,res) => 
{	
	res.clearCookie('jwtoken', {path: '/'});
	res.status(200).send("User Logout");
});



// --------------------------------------------------------------------    CART FUNCTIONALITY      -----------------------------------------------------------------------------------------
 

//ADD TO CART
router.post('/addtocart',authenticate, async (req, res) => {
	try {
	  const { name,model_id,type,category,avatar,price,discount,quantity} = req.body;
	  const user=await userSchema.findOne({_id:req.userID});
	  // Check if the product is already in the user's cart
	  const productInCart = user.cart.find((item) => item.name === name);
	  if (productInCart) {
		console.log(`Product "${name}" already exists in cart`);
		return res.status(422).json({ error: 'Product already added to the cart' });
	  }
	  // Add the new item to the user's cart
	  user.cart.push({ name,model_id,type,category,avatar,price,discount,total_quantity:quantity});
	  // Save the user document with the updated cart
	  await user.save();

	  // Clear the cart cache for this user
	  const key = `cart_${user._id}`;
	  delete cartcache[key];

	  // Retrieve the updated cart items
	  const updatedItems = user.cart;

	  // Cache the updated cart items
	  cartcache[key] = updatedItems;
	  
	  res.json({ message: 'Item added to the cart' });
	  console.log(`the product "${name}" is added successfully to the cart of "${user.displayName}"`);
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: 'Server error' });
	}
});
    

  
// handle GET request for all Products in the cart
router.get('/cartitems', authenticate, cartcacheMiddleware , async (req, res) => {
    const user = await userSchema.findOne({ _id: req.userID });
    const items = user.cart;

    // Caching
    const key = `cart_${req.userID}`;
    cartcache[key] = items;

    setTimeout(() => {
        delete cartcache[key]; 
    }, 7200000); 

    res.send(items);
});



// Delete items in cart
router.delete('/cartitems/:id', authenticate, async (req, res) => {
    const userId = req.userID;
    const itemIdToDelete = req.params.id;
    try {
        // Find the user by their ID
        const user = await userSchema.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Use Mongoose's pull method to remove the item from the cart array
        user.cart.pull(itemIdToDelete);

        // Save the updated user
        await user.save();

        // Clear the entire cart cache for this user
        const key = `cart_${userId}`;
        delete cartcache[key];

        // Retrieve the updated cart items
        const updatedItems = user.cart;

        // Cache the updated cart items
        cartcache[key] = updatedItems;

        res.json({ message: 'Item removed from the cart successfully' });
        console.log(`The product is deleted successfully from the cart of "${user.displayName}"`);
    } catch (error) { 
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ----------------------------------------------------------------------  order history ------------------------------------------------------------------------------------------


  // handle GET request for all Products in the cart
  router.get('/orderitems', authenticate, orderMiddleware, async (req, res) => {
	try {
	  const user = await userSchema.findOne({ _id: req.userID });
	  if (!user) {
		return res.status(404).json({ message: 'User not found' });
	  }
	  const orderHistory = user.order_history; // Assuming it's 'order_history' in your schema
	  // Set data in cache with a unique key for each user
	  const key = `order_${req.userID}`;
	  order[key] = {orderHistory};
	  setTimeout(() => {
		  delete order[key]; 
	  }, 7200000); 
	  res.json({ orderHistory }); 
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: 'Server error' });
	}
  });  


// ----------------------------------------------------------------------  CHECKOUT ------------------------------------------------------------------------------------------


  	// Create a route to update the cart
	router.post('/updateCart', authenticate, async (req, res) => {
	try {
	  // Extract the cart data from the request body
	  let { cart , total} = req.body;
		console.log(total);
		total = Math.floor(total);
		console.log(total);
	  // Find the user by their ID using the authenticated user data
	  const user = req.rootUser;
  
	  // Update the curr_quantity for each item in the user's cart
	  cart.forEach((cartItem) => {
		const userCartItem = user.cart.find(
		  (item) => item.model_id === cartItem.model_id
		);
  
		if (userCartItem) {
		  userCartItem.curr_quantity = cartItem.cartquantity;
		}
	  });
	  user.total_amount = total;
	  // Save the user with the updated cart
	  await user.save();
	  console.log("cart updated");
	  res.status(200).json({ message: 'Cart updated successfully' });
	} catch (error) {
	  console.error('Error updating cart:', error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  	});
  

	//checkout - shipping
	router.post('/checkout', authenticate, async (req, res) => {
		try {
		  const user = await userSchema.findOne({ _id: req.userID });
		  const { total_amount, phone, address, pincode, state, country , status} = req.body;
		//   console.log(total_amount);
		//   console.log(phone);
		//   console.log(address);
		//   console.log(pincode);
		//   console.log(state);
		//   console.log(country);
		//   console.log(status);
		  if ( !total_amount || !phone || !address || !pincode || !state || !country  ) {
			console.log("please fill the field properly");
			return res.status(404).json({ error: "Fill the fields properly" });
		  }
		  const orderItems = [];
		  // Iterate through the items in the user's cart
		  for (const cartItem of user.cart) {
			// Map cart item data to order item fields
			const orderItem = {
			  product_name: cartItem.name,
			  model_id: cartItem.model_id,
			  price: cartItem.price,
			  quantity: cartItem.curr_quantity,
			};
			// Push the order item to the orderItems array
			orderItems.push(orderItem);
		  }
		  const order = new orderSchema({
			user_name: user.displayName,
			email: user.email,
			phone,
			address,
			pincode,
			state,
			country,
			total_amount,
			order_items: orderItems,
			status: status,
		  });     
		  await order.save();
		  
		  // Add the order to the user's order history
		  user.order_history.push({
			order_date: new Date(),
			order_items: orderItems,
			total_amount: total_amount,
			status: status,
		  });
		  
		  await user.save();

		  // Clear the cart cache for this user
		 const key = `order_${user._id}`;
		 delete order[key];
	     console.log("order cache cleared");	


		  res.status(200).json({ message: 'Order request received' });
		  console.log(`Order request received from ${user.displayName} \n Razorpay pop-up initiated`);
		} catch (error) {
		  console.error(error);
		  res.status(500).json({ error: 'Internal server error' });
		  console.log("Error placing order");
		}
	  });


// ========================================================================== user review - footer page ===================================================================

	  router.post('/submit-review', authenticate , async (req, res) => {
		try {
			const {message} = req.body;
			const user = await userSchema.findOne({ _id: req.userID });
			if (!user) {
			  return res.status(404).json({ message: 'User not found' });
			}
	  
		  // Create a new review
		  const review = new reviewSchema({
			user: user.displayName,
			email: user.email,
			message: message,
		  });
	  
		  // Save the review to the database
		  await review.save();
		  console.log("message saved");
		  res.status(201).json({ message: 'Review submitted successfully' });
		} catch (error) {
		  console.error(error);
		  res.status(500).json({ error: 'Internal Server Error' });
		}
	  });
  
// ----------------------------------------------------------------------- Razorpay payment ---------------------------------------------------

// checkout api
router.post("/checkout1",async(req,res)=>{
	const options ={
		amount:Number(req.body.amount*100),
		currency:"INR",
	};
	const order = await instance.orders.create(options);
	console.log("======================================");
	console.log(order);
	console.log("======================================");
	res.status(200).json({ 
		success:true,order
	})
  }) 
  // payemnt verification
  router.post("/paymentverification", authenticate, async(req,res)=>{

   const user = req.rootUser;
   const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
   const body = razorpay_order_id + "|" +razorpay_payment_id;
   const expectedsgnature =crypto.createHmac('sha256',process.env.SECRET).update(body.toString()).digest('hex')
   const isauth = expectedsgnature === razorpay_signature;
   if(isauth){
	await PaymentSchema.create({
		razorpay_order_id,razorpay_payment_id,razorpay_signature 
	})
	try{
	//logic for decrementing product quantity and cart clearance
	for (const cartItem of user.cart) {
		const product = await productSchema.findOne({ model_id: cartItem.model_id });
		if (!product) {
		  return res.status(404).json({ error: `Product not found for model_id: ${cartItem.model_id}` });
		}
		if (product.quantity >= cartItem.curr_quantity) {
		  product.quantity -= cartItem.curr_quantity; 
		} else {
		  return res.status(400).json({ error: `Insufficient product quantity for model_id: ${cartItem.model_id}` });
		}  
		// Save the updated product data
		await product.save();
		// clear the cart
		user.cart = [];
		await user.save();
		console.log("cart cleared");

		// Clear the cart cache for this user
		 const key = `cart_${user._id}`;
		 delete cartcache[key];
	     console.log("cart cache cleared");	

		 // Clear the order cache for this user
		 const key1 = `order_${user._id}`;
		 delete order[key1];
	     console.log("order cache cleared");	

		 // Clear the user cache for this user
		 const key2 = `user_${user._id}`;
		 delete usercache[key2];
	     console.log("user cache cleared");	

		// Clear the product cache for this user  
		const key3 = `/products`;
		delete productcache[key3];
		console.log("product cache cleared");	

		 
	  }
	  console.log("product quantities decremented and payment successful");
	//res.status(200).json({  success: true, message: 'Payment Successful!' ,  redirectUrl: `${process.env.CLIENT_URL}`});
	  res.redirect(`${process.env.CLIENT_URL}/user`);
	}  
	catch(error){
	  console.error('Error decrementing quantities:', error);
	  res.status(500).json({  success: false, error: 'Internal server error' });
	} 
	// Change the status to paid .............................

   }
   else{
	res.status(400).json({success:false});
   }
  })   
  router.get("/api/getkey",(req,res)=>{
	return res.status(200).json({key:process.env.KEY})
  })

module.exports = router; 