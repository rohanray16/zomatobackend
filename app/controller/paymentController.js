require("dotenv").config();
const Razorpay = require('razorpay');
const crypto = require("crypto");
var instance = new Razorpay({
    key_id: process.env.KEYID,
    key_secret: process.env.KEYSECRET,
});

const paymentController = {
    payment: async (req, res) => {
        let { amount } = req.body;
        let receipt_id = crypto.randomBytes(16).toString("hex");
        var options = {
            amount: amount * 100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_" + receipt_id
        };
        try {
            let order = await instance.orders.create(options);
            res.status(200).send({
                status: true,
                order
            })
        } catch (error) {
            res.status(500).send({
                status: false,
                message: "server error",
                error
            });
        }
    },
    callback: async (req, res) => {
        let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

        var crypto = require("crypto");
        var expectedSignature = crypto.createHmac('sha256', process.env.KEYSECRET)
            .update(body.toString())
            .digest('hex');
        console.log("sig received ", req.body.razorpay_signature);
        console.log("sig generated ", expectedSignature);
        var response = { signatureIsValid: false }
        if (expectedSignature === req.body.razorpay_signature)
            response = { signatureIsValid: true }
        res.send(response);
    }
}
module.exports = paymentController;