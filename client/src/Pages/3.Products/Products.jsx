import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import Navbar from '../1.Navbar/Navbar';
import Footer from '../11.Footer2/Footer2';
import './Products.css';

function Products() {

  const [images, setImages] = useState([]);
  const [imageType, setImageType] = useState('all');
  const [imageCategory, setImageCategory] = useState('');
  const [originalImages, setOriginalImages] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Products Fetching
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get('https://fuzze-api.vercel.app/products');
    setImages(response.data);
    setOriginalImages(response.data);
  };

  // Filtering and Searching
  useEffect(() => {
    filterImages();
  }, [imageType, imageCategory, searchInput]);

  const filterImages = () => {
    let filteredImages = originalImages;

    // Filter by type
    if (imageType !== 'all') {
      filteredImages = filteredImages.filter(image => image.type === imageType);
    }

    // Filter by category
    if (imageCategory !== '') {
      filteredImages = filteredImages.filter(image => image.category === imageCategory);
    }

    // Filter by search input
    if (searchInput.trim() !== '') {
      const input = searchInput.toLowerCase().trim();
      filteredImages = filteredImages.filter(image =>
        image.name.toLowerCase().includes(input) ||
        image.type.toLowerCase().includes(input) ||
        image.category.toLowerCase().includes(input)
      );
    }

    setImages(filteredImages);
    setCurrentPage(1); 
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = images.slice(indexOfFirstProduct, indexOfLastProduct);

  const shouldRenderPreviousButton = currentPage > 1;
  const shouldRenderNextButton = indexOfLastProduct < images.length;

  const handleNavLinkClick = (route) => {
    window.scrollTo(0, 0);
  };

  const handleNextClick = () => {
    setCurrentPage(currentPage + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevClick = () => {
    setCurrentPage(currentPage - 1);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Navbar />

      <div className='products_search_panel'>
        <button className="products_filter_button products_filter_item dropdown-button" onClick={() => setShowFilters(!showFilters)}>Filters</button>
             




      {showFilters && (
  <div className='checkbox-container'>



    <div className='child_checkbox'>
      <input
        type="checkbox"
        checked={imageType === 'all'}
        onChange={(e) => {
          if (!e.target.checked) return; // Prevent unchecking when there are no products
          setImageType('all');
          setImageCategory('');
        }}
      />
      <label className="label">All</label>
    </div>




    <div className='child_checkbox'>
      <input
        type="checkbox"
        checked={imageType === 'T-shirt'}
        onChange={(e) => {
          if (e.target.checked) {
            setImageType('T-shirt');
            setImageCategory('');
          } else {
            setImageType('');
          }
        }}
      />
      <label className="label">T-shirt</label>
    </div>

    





          <div className='child_checkbox'>
            <input
              type="checkbox"
              checked={imageType === 'jewels'}
              onChange={(e) => {
                if (e.target.checked) {
                  setImageType('jewels');
                  
                  setImageCategory('');
                } else {
                  setImageType('');
                }
              }}
            />
            <label className="label">Jewels</label>
          </div>

          {imageType === 'jewels' && (<>
            <div className='child_checkbox'>
              <input
                type="checkbox"
                checked={imageCategory === 'necklace'}
                onChange={(e) => setImageCategory(e.target.checked ? 'necklace' : '')}
              />
              <label className="label">Necklace</label>
            </div>  
              
              <div  className='child_checkbox'>
              <input
                type="checkbox"
                checked={imageCategory === 'bracelet'}
                onChange={(e) => setImageCategory(e.target.checked ? 'bracelet' : '')}
              />
              <label className="label">Bracelet</label>
             
            </div>
            </>
          )}


{ (imageType === 'jewels' || imageType === 'ring' ) && (
          <div className='child_checkbox'>
            <input
              type="checkbox"
              checked={imageType === 'ring'}
              onChange={(e) => {
                if (e.target.checked) {
                  setImageType('ring');
                  
                  setImageCategory('');
                } else {
                  setImageType('');
                }
              }}
            />
            <label className="label">ring</label>
          </div>
)}


          <div className='child_checkbox'>
            <input
              type="checkbox"
              checked={imageType === 'accessories'}
              onChange={(e) => {
                if (e.target.checked) {
                  setImageType('accessories');
                  
                  setImageCategory('');
                } else {
                  setImageType('');
                }
              }}
            />
            <label className="label">Accessories</label>
          </div>

          {imageType === 'accessories' && (
            <div  className='child_checkbox'>
              <input
                type="checkbox"
                checked={imageCategory === 'mobile_cases'}
                onChange={(e) => setImageCategory(e.target.checked ? 'mobile_cases' : '')}
              />
              <label className="label">Mobile Cases</label>
              
            </div>
          )}

    



  </div>
)}









        <input type='text' placeholder='Search' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className='products_search_bar' />
      </div>

      <div className='products_outerdiv'>
        <div className='product_display_panel'>
          <h5 className='product_display_total_products' >{images.length} items found</h5>
          <div className='product_display_array'>
            {currentProducts.map((image, index) => (
              <Link to={`/product/${image._id}`} onClick={() => handleNavLinkClick(`/product/${image._id}`)} className='no-line' key={image._id}>
                <div className='product_display_item'>
                  <img src={image.avatar} alt={image.name} className='products_display_image' />
                  <div>
                    <div className='product_display_name'>{image.name}</div>
                    <span className='product_display_discount'><span> ₹</span>{image.price}<span>.00</span></span>
                    <span className='product_display_price'><span> ₹</span>{Math.floor(image.price * ((100 - image.discount) / 100))}<span>.00</span></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className='product_display_prev_next_button'>
            <div className='product_display_prev_button_alignment'>
              {shouldRenderPreviousButton && (
                <button onClick={() => handlePrevClick()} className="product_display_button">Previous</button>
              )}
            </div>
            <div className='product_display_next_button_alignment'>
              {shouldRenderNextButton && (
                <button onClick={() => handleNextClick()} className='product_display_button'>Next</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Products;
