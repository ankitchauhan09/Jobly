import api_service from "./api_service.jsx";

export const PaymentService = {
    handleMentorServicePayment: async (amount, dataToSend, user, setIsBookedStatus) => {
        try {
            // Dynamically load Razorpay script if not available
            if (typeof window.Razorpay !== 'function') {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.onload = resolve;
                    script.onerror = reject;
                    document.body.appendChild(script);
                });
            }

            const order = await PaymentService.createOrder(amount, dataToSend);
            if (!order || !order.data) {
                throw new Error('Invalid order response');
            }
            console.log(order)
            const options = {
                key: "rzp_test_4NpMK0PvmRLIsO",
                amount: order.data.amount,
                currency: "INR",
                name: "Jobly",
                description: "Test Transactions",
                order_id: order.data.order_id,
                handler: async function (response) {
                    try {
                        if (!response.razorpay_order_id || !response.razorpay_payment_id) {
                            throw new Error('Incomplete payment response');
                        }
                        const paymentStatus = await PaymentService.verifyPayment(response, amount.toString(), user, dataToSend)
                        if(paymentStatus) {
                            setIsBookedStatus(true)
                        }
                        return paymentStatus
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        alert("Payment verification failed!");
                        return false;
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.contact
                },
                theme: {
                    color: "#F37254"
                }
            };
            console.log(order.data.order_id)
            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.on("payment.failed", function (response) {
                console.error("Payment failed:", response.error);
                alert(`Payment Failed: ${response.error.description}`);
            });

            razorpayInstance.open();
        } catch (error) {
            console.error("Payment initiation failed:", error);
            alert("Unable to initiate payment. Please try again.");
            throw error;
        }
    },

    createOrder: async (amount, dto) => {
        try {
            const dataToSend = {
                amount: Number(amount),
                serviceFee : Number(amount),
                mentorId : dto.mentorId
            };
            return await api_service.post("http://localhost:8099/mentor/payment/service", dataToSend);
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    },

    isBooked : async (mentorId, serviceId) => {
        const isBooked = await api_service.get("http://localhost:8099/mentor/service/isBooked/"+mentorId+"/"+serviceId)
        if(isBooked) {
            return isBooked.data;
        } else {
            return false;
        }
    },

    verifyPayment: async (response, amount, user, dataToSend) => {
        try {

            console.log("am : {}", amount)

            const verificationResponse = await api_service.post("http://localhost:8099/mentor/payment/validate", {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                userId : dataToSend.userId,
                mentorId : dataToSend.mentorId,
                mentorName : dataToSend.mentorName,
                serviceId : dataToSend.serviceId,
                timeSlotBooked : dataToSend.timeSlotBooked,
                scheduledDate : dataToSend.scheduledDate,
                amount : amount,
                userEmail : user.email
            });

            console.log(verificationResponse);
            if (verificationResponse.data.paymentStatus) {
                alert("Payment successful!");
                return true;
            } else {
                throw new Error("Payment verification failed");
            }
        } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed!");
            return false;
        }
    }
};