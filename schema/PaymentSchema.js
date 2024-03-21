const mongoose=require('mongoose')


const schema = new mongoose.Schema({
    razorpay_order_id:{
        type:String,
        required:true,
    },
    razorpay_payment_id:{
        type:String,
        required:true,
    },
    razorpay_signature:{
        type:String,
        required:true,
    },
  }) 
  
  const PaymentSchema =mongoose.model("PAYMENT", schema);

  module.exports = PaymentSchema;