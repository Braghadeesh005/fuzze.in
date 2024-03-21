import React, { useState, useEffect } from 'react';
import { Link,NavLink,useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../1.Navbar/Navbar';
import './Dynamicproduct.css'
import Footer from '../11.Footer2/Footer2'

function Dynamicproduct() {

  //Fetching the Dynamic product details
  const [product, setproduct] = useState(null);
  const { id } = useParams();
  const [images, setImages] = useState([]);

  useEffect(() => {

    //Fetch Data from backend (all products)
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://fuzze-one.vercel.app/api/dynamicproduct/${id}`);
        setproduct(response.data);
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

  fetchData();

  //Related products based on category
  const fetchImages = async () => {
    try {
      await fetchData(); // Wait for "block 1" to complete before fetching images
      const response = await axios.get('https://fuzze-one.vercel.app/product/images');
      setImages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchImages();

  },[id]);  

  const fetchUsers = async () => {
  try {
    const response = await axios.get('https://fuzze-one.vercel.app/products');
    setImages(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [filteredImages, setFilteredImages] = useState([]);

  useEffect(() => {
    // Function to filter images
    const filterImages = () => {
      if (images && product && product.type && product._id) {
        const filtered = images.filter((image) => {
          return image.type === product.type && image._id !== product._id;
        });
        setFilteredImages(filtered);
      }
    };
    // Trigger the filtering function whenever images or product changes
    filterImages();
  }, [images, product]);

  // Limit the filtered products to 5
  const limitedImages = filteredImages.slice(0, 4);

  //Add to cart
  const [addedToCart, setAddedToCart] = useState(false);
  const Navigate=useNavigate();

  const addToCart = async () => {
    try {
      const discounted_price = Math.floor((product.price) * ((100-product.discount)/100))
      const response = await fetch('https://fuzze-one.vercel.app/addtocart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          model_id: product.model_id,
          type: product.type, 
          category: product.category,
          price: discounted_price,
          discount: Math.floor(product.discount),
          quantity: product.quantity,
          avatar: product.avatar,
        }),
        credentials: 'include',
      });
      console.log(response.status);
      if(response.status!==200 && response.status!==201 && response.status!==422)
      {
        Swal.fire({
          position: 'top-end',
          icon: 'info',
          title: 'Login to continue',
          showConfirmButton: false,
          timer: 1500
        })
      }
      else{
      if (response.ok) {
        setAddedToCart(true);
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'info',
          title: 'Product already added to the cart',
          showConfirmButton: false,
          timer: 1500
        })
      }
    }
    } catch (err) {
      console.error(err);
    }
  };
  const handleNavLinkClick = (route) => {
    window.scrollTo(0, 0);
    Navigate(route);
  };
  

  return (
    <>
    <Navbar/>
 
    <div className='current_product_panel'>
      {product ? (
        <>
        <div className='current_product_image_div'>
          <img src={product.avatar} className='current_product_image'/>
        </div>
        <div className='current_product_content_div'>
          <div className='current_product_content_item current_product_content_item-1'>{product.name}</div>
          <div className='current_product_content_item current_product_content_item-2'>{product.description}</div>
          <hr/>
          <div className='current_product_content_item current_product_content_item-3'><b>TYPE: </b>{product.type}</div>
          <div className='current_product_content_item current_product_content_item-4'><b>{(product.type === 'T-shirt' || product.type === 'ring') ? 'SIZE':'CATEGORY'}: </b>{product.category}</div>
          <div className='current_product_content_item current_product_content_item-5'><b>{Math.floor(product.discount)}% OFF !!!</b></div>
          <div>
          <span className='current_product_content_item current_product_content_item-6'>Rs.{product.price}</span>
          <span className='current_product_content_item current_product_content_item-7'><b>Rs.{Math.floor((product.price)*((100-product.discount)/100))}</b></span>
          </div>
          <div className='current_product_content_item current_product_content_item-8'>Available!  <b>{product.quantity}</b> in stock</div>
          {!addedToCart ? (<button onClick={addToCart} className='current_product_button'>Add to Cart</button>) : (<div className='current_product_button'>Added to Cart</div>)} 
          <NavLink className='current_product_button current_product_navlink' to='/cart'>Go to Cart</NavLink>
        </div>
        </>
      ) : (
        <p>Loading product details... Refresh if took too long</p>
      )}
    </div>

{ filteredImages.length !== 0  ? (
  <>
    <h1 className='relatedproducts_heading'>SIMILAR PRODUCTS</h1>  
 
    <div className='product_display_array'>
      {limitedImages.map((image) => (
        image._id && image.avatar && image.name && image.price ? (
        <Link to={`/product/${image._id}`} onClick={() => handleNavLinkClick(`/product/${image._id}`)} key={image._id} className='no-line'>
        <div className='product_display_item'>
          <img src={image.avatar} alt={image.name} className='products_display_image'/>
            <div>
              <div className='product_display_name'>{image.name}</div>
              <span className='product_display_discount'><span> ₹</span>{Math.floor(image.price)}<span>.00</span></span>
              <span className='product_display_price'><span> ₹</span>{Math.floor(image.price*((100-image.discount)/100))}<span>.00</span></span>
            </div>
          </div>
        </Link>
        ) : (<p>Product not available</p>)
      ))}
    </div>
    </>

        ):(<h1></h1>)}
        
    <Footer/>
    </>
  );
}

export default Dynamicproduct;

