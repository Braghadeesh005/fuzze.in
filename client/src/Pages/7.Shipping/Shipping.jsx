import React,{useState,useEffect} from 'react'
import { useNavigate} from 'react-router-dom'
import swal from 'sweetalert';
import axios from 'axios';
import swal2 from 'sweetalert2'
import './Shipping.css';
import Navbar from '../1.Navbar/Navbar';
import Footer from '../11.Footer2/Footer2';
 
const Shipping = () =>
{
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [userData, setuserData] = useState({});
  const statesInIndia = [
    'Andaman and Nicobar Islands',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ];

  const userPage = async () =>{
    try{ 
      const res = await fetch('https://fuzze-api.vercel.app/getData',{
        method:"GET",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },          
        credentials:"include"
      });
      const data = await res.json();
      console.log(data);
      setuserData(data);
      setCartItems(data.cart);
    }
    catch(err)
    {
      console.log(err);
      navigate("/");
      swal2.fire({
        position: 'top-end',
        title: 'Invalid Sending Review!',
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          popup: 'my-custom-popup-class-error',
          title: 'my-custom-title-class-error',
          content: 'my-custom-content-class-error',
          timerProgressBar:'progress-bar-error',
        },
        didOpen: () => {
          swal.showLoading();
          const b = swal.getHtmlContainer().querySelector('b');
          timerInterval = setInterval(() => {
            b.textContent = swal.getTimerLeft();
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        if (result.dismiss === swal.DismissReason.timer) {
          console.log('I was closed by the timer');
        }
      });
      console.log("Invalid Placing Order");

    }
  }
  useEffect(()=>{
    userPage();
  },[]);


  const [user,setUser] = useState({
    phone:"" , address:"" , pincode:"" , state:"" ,
  });
  let name, value;

  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;
    setUser({...user, [name]:value});
  }

  
   
  let total_savings = 0;

  const PostData = async (e) => {
      e.preventDefault();

      // Validate phone number
      const isValidPhoneNumber = /^[6-9]\d{9}$/.test(user.phone);
      if (!isValidPhoneNumber) {
        swal("Invalid phone number!", "Please enter a proper 10-digit number", "error");
        return;
      }

      // Validate pin code
      const isValidPincode = /^\d{6}$/.test(user.pincode);
      if (!isValidPincode) {
        swal("Invalid PIN Code!", "Please enter a proper PIN code", "error");
        return;
      }

      const {  phone, address, pincode, state } = user;
 
       // Post shipping details
       const res = await fetch("https://fuzze-api.vercel.app/checkout", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           total_amount:userData.total_amount, phone, address, pincode, state, country: "India",status:"notpaid"
         }),
         credentials: 'include',
       });
       const data = await res.json();
       if (res.status === 404 || !data) {
         swal("Invalid Credentials!", "Fill Properly", "error");
         console.log("Invalid Placing Order");
         return;
       }
      
      //Razorpay  
      const amount = userData.total_amount;
      const {data:{key}}=await axios.get("https://fuzze-api.vercel.app/api/getkey")
      const {data:{order}}=await axios.post("https://fuzze-api.vercel.app/checkout1",{amount})
      console.log(window);
      const options ={
        key,
        amount:order.amount,
        currency:"INR",
        name:"Complete Payment",
        description:"Pay using your preferred payment method",
        image:"https://res.cloudinary.com/ds6pcfz7u/image/upload/v1698600578/logo_tgbpsi.png",
        order_id:order.id,
        callback_url:"https://fuzze-api.vercel.app/paymentverification",
        prefill:{
          name:"Enter your name",
          email:"Enter your email",
          contact:"enter your contact number"
        },
        notes:{
          "address":"razorpay official"
        },
        theme:{
          "color":"#000000"
        }
      };
      const razor = new window.Razorpay(options);
      razor.open();
  }

     
   return(
    <>
    <Navbar/>
    <div className='ship-title'>Shipping Details</div>
    <form method='POST'>
      <div className='ship-outer'>

      <div className='ship-inputs'>

      <div className='heading'>Enter your details</div>
      <div className='ship-inputs-2'>

        <div className='ship-input'>
          Ph. Number
          <div className='placeholder-2'><span className='input-span'></span><input type='number' name="phone" autoComplete='off' className='placeholder1' value={user.phone} onChange={handleInputs} /></div>
        </div>

        <div className='ship-input'>
          Address
          <div className='placeholder-2'><span className='input-span'></span><textarea name="address" className='placeholder2' value={user.address} onChange={handleInputs} /></div>
        </div>

        {/* <div className='ship-input'>
          State
          <div className='placeholder-2'><span className='input-span'></span><input type="text" name="state" autoComplete='off' className='placeholder1' value={user.state} onChange={handleInputs} /></div>
        </div> */}

        <div className='ship-input'>
          State
          <div className='placeholder-2'>
          <span className='input-span'></span>
          <select name='state' autoComplete='off' className='placeholder1' value={user.state} onChange={handleInputs}>
          <option value='' disabled> Select State </option>
            {statesInIndia.map((state, index) => (<option key={index} value={state}>{state}</option>))}
          </select>
          </div>
        </div>

        <div className='ship-input'>
          PinCode
          <div className='placeholder-2'><span className='input-span'></span><input type="number" name="pincode" autoComplete='off' className='placeholder1' value={user.pincode} onChange={handleInputs} /></div>
        </div>
        
      </div>  
      </div>

      <div className='ship-img'>
        <h1 className='heading'>order summary</h1>
        <div className='cart-items'>
        {cartItems && cartItems.map((item, index) => (
          <div key={index} >
            <div className='cart-item-indivual'>
              <img src={item.avatar} height='80px' width='80px'/>
              <p>{item.name}</p>
              <p><b>Quantity:</b> {item.curr_quantity}</p>
              <p><b>Rs. </b>{(item.price)*(item.curr_quantity)}</p>
              <p><b>Your savings: </b>Rs. {(((item.price)*(item.curr_quantity)/(100-item.discount))*100)-(item.price)*(item.curr_quantity)}</p>
              <div className='savings'>{total_savings = total_savings + (((item.price)*(item.curr_quantity)/(100-item.discount))*100)-(item.price)*(item.curr_quantity)}</div>
            </div>
          </div>
        ))}
        </div>
        <div className='total-price'>
        <div><span className='font-price'>Total amount to be paid : </span><b><span className='font-size-price'>Rs. {userData.total_amount}</span></b></div>
        <div><span className='font-price'>Total savings : </span><b>Rs. {total_savings}</b></div>
        </div>
      </div>

      </div>

      <div className='ship-input-1'>
            <input type="submit" value="Place Order" className='ship-submit' onClick={PostData}/>                        
      </div>
      
    </form>
    
    <Footer/>

    </>
   )
}

export default Shipping