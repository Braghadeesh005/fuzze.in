import React, { useState, useEffect } from 'react';
import {NavLink,Link} from 'react-router-dom'
import img1 from './images/slider/anime_1.jpg'
import img2 from './images/slider/anime_2.jpg'
import img3 from './images/slider/anime_3.jpg'
import img4 from './images/slider/anime_4.jpg'
import img5 from './images/slider/marvel_1.jpg'
import img6 from './images/slider/marvel_2.jpg'
import img7 from './images/slider/marvel_3.jpg'
import img8 from './images/slider/random_1.jpg'
import img9 from './images/slider/random_2.jpg'
import img10 from './images/slider/random_3.jpg'
import img11 from './images/slider/random_4.jpg'
import img12 from './images/t_shirt_1.jpg'
import img13 from './images/Necklace_1.jpg'
import img14 from './images/Necklace_2.jpg'
import img15 from './images/Necklace_3.jpg'
import img16 from './images/Necklace_4.jpg'
import img17 from './images/Necklace_5.jpg'
import img18 from './images/Necklace_6.jpg'
import img19 from './images/Necklace_7.jpg'
import img20 from './images/Ring_1.jpg'
import img21 from './images/Ring_2.jpg'
import img22 from './images/Bracelet_1.jpg'

import logoimg from './images/logo.png'
import mid from './images/made_in_india.jpg'
// import animecover from './images/anime-cover.png'
// import randomcover from './images/random-cover.png'
// import marvelcover from './images/marvel-cover.png'
// import carcover from './images/car-cover.png'
import 'aos/dist/aos.css'; // Import the AOS CSS
import AOS from 'aos';
import axios from 'axios'

import Navbar from '../1.Navbar/Navbar'
import Footer from '../10.Footer/Footer'
import './Home.css'

import modalimg1 from './images/case1.jpeg'  
import modalimg2 from './images/case3.jpeg'  
import modalimg3 from './images/case5.jpeg'  
import modalimg4 from './images/case2.jpeg'  
import modalimg5 from './images/case6.jpg'  

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200
    });
  }, []);
  const handleNavLinkClick = (route) => {
    window.scrollTo(0, 0);
  };

  const Modal = ({ isOpen, closeModal, children }) => {
      return (
        <div className={`modal ${isOpen ? 'active' : ''}`}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            {children}
          </div>
        </div>
      );
    }
    const [modal1Open, setModal1Open] = useState(false);
    const [modal2Open, setModal2Open] = useState(false);
    const [modal3Open, setModal3Open] = useState(false);
    const [modal4Open, setModal4Open] = useState(false);
    const [modal5Open, setModal5Open] = useState(false);
    const openModal1 = () => setModal1Open(true);
    const openModal2 = () => setModal2Open(true);
    const openModal3 = () => setModal3Open(true);
    const openModal4 = () => setModal4Open(true);
    const openModal5 = () => setModal5Open(true);
    const closeModal1 = () => setModal1Open(false);
    const closeModal2 = () => setModal2Open(false);
    const closeModal3 = () => setModal3Open(false);
    const closeModal4 = () => setModal4Open(false);
    const closeModal5 = () => setModal5Open(false);

  //special products based on discount
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetchUsers();
  }, []); 
  useEffect(() => {
    axios.get('https://fuzze-api.vercel.app/product/images')
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); 
  const fetchUsers = async () => {
    const response = await axios.get('https://fuzze-api.vercel.app/products');
    setImages(response.data);
  }; 
  const filteredImages = images.filter((image) => {
    return image.special_discount === 'yes'
  });
  // Limit the filtered products to 5
  const limitedImages = filteredImages.slice(0, 6);

  return (
    <>
    <Navbar/>
            

            <div className='home-slogan'>
                <div className='home-slogan-text'>FUZZE.IN</div>
            </div>

            <div className='panel1'>

                <div className='logo-div'><img className='logo1' src={logoimg}/></div>

                <div class="scroll-container">
                    <div class="scroll-content">
                        <a ><img className='slider' src={img13} /></a>
                        <a ><img className='slider' src={img14} /></a>
                        <a ><img className='slider' src={img15} /></a>
                        <a ><img className='slider' src={img16} /></a>
                        <a ><img className='slider' src={img17} /></a>
                        <a ><img className='slider' src={img12} /></a>
                        <a ><img className='slider' src={img18} /></a>
                        <a ><img className='slider' src={img19} /></a>
                        <a ><img className='slider' src={img20} /></a>
                        <a ><img className='slider' src={img21} /></a>
                        <a ><img className='slider' src={img22} /></a>
                    </div>
                </div>  

                <div className='explore-div'><NavLink className='explore' to='/products' onClick={() => handleNavLinkClick('/products')}>Explore</NavLink></div>

            </div>

            {/* <div className='p3-title special-product-heading' >Today's Special</div>
            <div className='specialproducts_panel'>
            
            {limitedImages.map((image) => (
            image._id && image.avatar && image.name && image.price ? (
            <Link to={`/product/${image._id}`} key={image._id}>
            <div className='special_product_indivual'>
            <img src={image.avatar} alt={image.name} className='special_product_indivual_image'/>
            </div>
            </Link>
            ) : (<p>Currently No Products Discounted. Checkout Later</p>)
            ))}
            </div> */}

 
            

             <div className='panel4'>
              <p className='p3-title imp-title' >Fuzze Flair - Our Priorities</p>
                <div className='types'>
                    <div className='type1' >
                        <p className='p4-text'>T - Shirts</p>
                         <NavLink className='buynow' to='/products' onClick={() => handleNavLinkClick('/products')}><button className='buynow'>Explore</button> </NavLink>
                     </div>
                    <div className='type2'>
                    <p className='p4-text'>Jewels</p>
                    <NavLink className='buynow' to='/products' onClick={() => handleNavLinkClick('/products')}><button className='buynow'>Explore</button> </NavLink>
                     </div> 
                 </div>  
             </div>   

             {/*<div className='panel5' >
                <h1 className='p5-text'>Collections.</h1>
            </div> */}

           


            <div className='panel6a'>
            <div className='p3-title imp-title p3-title-2' >Our Collections</div>
              <div className='random'> 
                Jewels.
                {/* <img src={randomcover} className='anime-cover'/> */}
                <NavLink to='/products' onClick={() => handleNavLinkClick('/products')}><button className='random-btn' >Explore</button></NavLink>
              </div>
            </div>

            <div className='panel6'>
              <div className='anime'>
                Clothing.
                {/* <img src={animecover} className='anime-cover' /> */}
                <NavLink to='/products' onClick={() => handleNavLinkClick('/products')}><button className='anime-btn' >Explore</button></NavLink>
                {/* <button className='anime-btn' >Explore</button> */}
              </div>
            </div>

            <div className='panel7'>
              <div className='marvel'> 
                Mobile Cases.
                {/* <img src={marvelcover} className='anime-cover'/> */}
                <NavLink to='/products' onClick={() => handleNavLinkClick('/products')}><button className='marvel-btn' >Explore</button></NavLink>
              </div>
            </div>
            <div className='panel8'>
              <div className='car'> 
                Accessories.
                {/* <img src={carcover} className='anime-cover'/> */}
                <NavLink to='/products' onClick={() => handleNavLinkClick('/products')}><button className='car-btn' >Explore</button></NavLink>
              </div>
            </div>

             {/* <div className='panel2'>
              <h1 className='p2-title' >Captures</h1>
              
              <div className='card-outer'>
                <div className="card" >
                  <div className="card2a">                    
                   </div>
                </div>

                <div className="card">
                  <div className="card2b">                   
                   </div>
                </div> 
                
                 <div className="card" >
                  <div className="card2c">
                   </div>
                </div>

              </div> 
             </div>  */}

            <div className='panel3'>
              <p className='p3-title' >Fuzze Flair - An Array of Chic Fashion Collections</p>
                <div className='modals'>
                    <div className='mod1' >
                    <button onClick={openModal1} className='modal-btn'>Explore</button>
                    </div>
                    <div className='mod2'>
                    <button onClick={openModal2} className='modal-btn'>Explore</button>

                    </div>
                    <div className='mod3' >
                    <button onClick={openModal3} className='modal-btn'>Explore</button>
               

                    </div>
                    {/* <div className='mod4'>
                    <button onClick={openModal4} className='modal-btn'>Explore</button>

                    </div> */}
                    <div className='mod5' >
                    <button onClick={openModal5} className='modal-btn'>Explore</button>
                    </div>
                </div>
            </div>



            <div className='panel9-outer'>
              <div className='panel9'>
                <div className='p9-left'>
                    <img className='made-in-india' src={mid} ></img>
                </div>
                <div className='p9-right'>
                        <p className='p9-text' >Proudly Made In India</p>
                        <p className='p9-content' >Behind every successful project, there's a team of dedicated individuals who work tirelessly to make it happen. Our team embodies the spirit of hard work, dedication, and collaboration. Each member brings unique skills and perspectives to the table, contributing to our collective success.</p>
                        <NavLink to='/about' onClick={() => handleNavLinkClick('/about')}><button className='read-more' >Read More</button></NavLink>
                        </div>
              </div>
            </div>

            











      <Modal isOpen={modal1Open} closeModal={closeModal1}>
        <div className='modal-1'>
          <div className='mod-1-left'>
              <img src={img14} className='mod-1-left-item'/>
          </div>
          <div className='mod-1-right'>
              <p className='mod-1-title'>NeckLace</p>
              <p className='mod-1-content'>
                <p>It conveys a sense of brilliance, elegance, and enchantment, making it appealing and memorable to customers.
                Discover our range of men's necklaces, meticulously crafted to exude masculinity and individuality. From minimalist chains to bold pendants, find the perfect piece to express your personal style.
                </p>
               
              </p>
              {/* <button className='visit'>Visit Now</button> */}
          </div>
        </div>
      </Modal>

      <Modal isOpen={modal2Open} closeModal={closeModal2}>
      <div className='modal-1'>
          <div className='mod-1-left'>
          <img src={img20} className='mod-1-left-item'/>
          </div>
          <div className='mod-1-right'>
              <p className='mod-1-title'>Ring</p>
              <p className='mod-1-content'>
                <p>It conveys a sense of brilpance, elegance, and enchantment, making it appealing and memorable to customers.
                Elevate your style with our sleek and sophisticated men's rings, crafted with precision and attention to detail for a timeless accessory that complements any ensemble.
                </p>
              </p>
              {/* <button className='visit'>Visit Now</button> */}
          </div>
        </div>
      </Modal>

      <Modal isOpen={modal3Open} closeModal={closeModal3}>
      <div className='modal-1'>
          <div className='mod-1-left'>
          <img src={img22} className='mod-1-left-item'/>
          </div>
          <div className='mod-1-right'>
              <p className='mod-1-title'>Bracelet</p>
              <p className='mod-1-content'>
              <p>It conveys a sense of brilliance, elegance, and enchantment, making it appealing and memorable to customers.
              Make a statement with our collection of men's bracelets, designed to add a touch of rugged refinement or urban edge to your look, whether you're dressing up for a special occasion or keeping it casual.
              </p>
               
              </p>
              {/* <button className='visit'>Visit Now</button> */}
          </div>
        </div>
      </Modal>

      <Modal isOpen={modal4Open} closeModal={closeModal4}>
      <div className='modal-1'>
          <div className='mod-1-left'>
          <img src={modalimg4} className='mod-1-left-item'/>
          </div>
          <div className='mod-1-right'>
              <p className='mod-1-title'>T - Shirt</p>
              <p className='mod-1-content'>
                <p>It's comfortable, breathable, and easy to care for. Cotton t-shirts are suitable for casual wear, and they come in various styles and colors to suit different preferences.</p>
              </p>
              {/* <button className='visit'>Visit Now</button> */}
          </div>
        </div>
      </Modal>

      <Modal isOpen={modal5Open} closeModal={closeModal5}>
      <div className='modal-1'>
          <div className='mod-1-left'>
          <img src={img12} className='mod-1-left-item'/>
          </div>
          <div className='mod-1-right'>
          <p className='mod-1-title'>T - Shirt</p>
              <p className='mod-1-content'>
                <p>It's comfortable, breathable, and easy to care for. Cotton t-shirts are suitable for casual wear, and they come in various styles and colors to suit different preferences.</p>
              </p>
              {/* <button className='visit'>Visit Now</button> */}
          </div>
        </div>
      </Modal>



    <Footer/>        
    </>
  )
}

export default Home
