async function getAIResponse(message) {

    if (!message) {
        return "Please type a message 🤖";
    }

    message = message.toLowerCase().trim();

    // ================= GREETINGS =================
    if (message.includes("hi") || message.includes("hello")) {
        return "Hello 👋 Welcome to Travel Saathi 🚖";
    }
    else if (message.includes("hey")) return "Hey 😊 How can I help you?";
    else if (message.includes("good morning")) return "Good morning 🌅";
    else if (message.includes("good evening")) return "Good evening 🌙";
    else if (message.includes("good night")) return "Good night 😴";
    else if (message.includes("how are you")) return "I'm fine 😊";
    else if (message.includes("who are you")) return "I'm Travel Saathi AI 🤖";
    else if (message.includes("what is your name")) return "Travel Saathi Bot";
    else if (message.includes("are you real")) return "I'm a virtual assistant 🤖";

    // ================= FARE =================
    else if (message.includes("fare details") || message.includes("fare rate") || message === "fare") {
        return "Bike ₹6/km, Car ₹8/km, Cab ₹10/km, Bus ₹12/km";
    }
    else if (message.includes("bike fare")) return "Bike = ₹50 + ₹6/km";
    else if (message.includes("car fare")) return "Car = ₹50 + ₹8/km";
    else if (message.includes("cab fare")) return "Cab = ₹50 + ₹10/km";
    else if (message.includes("bus fare")) return "Bus = ₹50 + ₹12/km";
    else if (message.includes("price") || message.includes("cost")) return "Depends on distance";
    else if (message.includes("cheap")) return "Bike is cheapest 🚲";
    else if (message.includes("expensive")) return "Cab is premium 🚖";

    // ================= BOOKING =================
    else if (message.includes("book")) return "Go to booking page 🚖";
    else if (message.includes("booking")) return "Use booking system";
    else if (message.includes("how to book")) return "Fill form → Book Now";
    else if (message.includes("cancel")) return "Depends on system";
    else if (message.includes("ride")) return "Book ride anytime";
    else if (message.includes("trip")) return "Enter source & destination";
    else if (message.includes("vehicle")) return "Bike, Car, Cab, Bus";
    else if (message.includes("available")) return "All vehicles available";
    else if (message.includes("status")) return "Check booking system";
    else if (message.includes("confirm")) return "Booking confirmed";
    else if (message.includes("pickup")) return "Enter pickup location";

    // FIXED: better drop handling
    else if (
        message.includes("drop") ||
        message.includes("destination") ||
        message.includes("drop location")
    ) {
        return "Enter destination location";
    }

    else if (message.includes("route")) return "Google Maps used";

    // ================= PAYMENT =================
    else if (message.includes("payment")) return "Cash/Online available";
    else if (message.includes("cash")) return "Cash allowed";
    else if (message.includes("online")) return "Online optional";
    else if (message.includes("upi")) return "UPI not integrated yet";
    else if (message.includes("refund")) return "Depends on rules";
    else if (message.includes("bill")) return "Generated after booking";
    else if (message.includes("receipt")) return "After booking";
    else if (message.includes("pay")) return "Pay after ride";

    // ================= HELP =================
    else if (message.includes("help")) return "Ask about fare or booking";
    else if (message.includes("login")) return "Login required";
    else if (message.includes("signup")) return "Create account first";
    else if (message.includes("error")) return "Check server";
    else if (message.includes("not working")) return "Restart server";
    else if (message.includes("fix")) return "Check backend";

    // ================= GENERAL =================
    else if (message.includes("bye")) return "Goodbye 👋";
    else if (message.includes("thanks") || message.includes("thank")) return "You're welcome 😊";
    else if (message.includes("cool")) return "😎";
    else if (message.includes("yes")) return "👍";
    else if (message.includes("no")) return "Okay";

    // ================= DEFAULT =================
    else {
        return "🤖 I didn't understand. Try asking about fare, booking, ride or payment.";
    }
}

module.exports = { getAIResponse };