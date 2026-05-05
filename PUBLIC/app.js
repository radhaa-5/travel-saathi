let fare = 0;

/* =========================
   GET COORDINATES
========================= */
async function getCoordinates(place) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&countrycodes=in&limit=5`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch location coordinates.");
    }

    const data = await response.json();

    if (!data.length) {
        throw new Error(`Location not found: ${place}`);
    }

    return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
    };
}

/* =========================
   DISTANCE CALCULATION
========================= */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
}

/* =========================
   FARE CALCULATION
========================= */
function calculateFareFromDistance(distance, vehicleType) {
    const baseFare = 50;
    let rate = 8;

    if (vehicleType === "Bike") rate = 6;
    else if (vehicleType === "Car") rate = 8;
    else if (vehicleType === "Cab") rate = 10;
    else if (vehicleType === "Bus") rate = 12;

    return Math.round(baseFare + distance * rate);
}

/* =========================
   MAIN FARE FUNCTION
========================= */
async function calculateFare() {
    const source = document.getElementById("source").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const vehicleType = document.getElementById("vehicleType").value;
    const fareText = document.getElementById("fare");

    if (!source || !destination || !vehicleType) {
        fare = 0;
        fareText.innerText = "Enter source, destination and vehicle.";
        return;
    }

    try {
        const src = await getCoordinates(source);
        const dest = await getCoordinates(destination);

        const distance = calculateDistance(
            src.lat,
            src.lon,
            dest.lat,
            dest.lon
        );

        fare = calculateFareFromDistance(distance, vehicleType);

        fareText.innerHTML =
            "Distance: " + distance.toFixed(2) +
            " km <br> Fare: ₹" + fare;

    } catch (error) {
        console.error(error);
        fare = 0;
        fareText.innerText = "Unable to calculate fare. Check locations.";
    }
}

/* =========================
   BOOKING FUNCTION
========================= */
async function bookNow() {
    const pickup = document.getElementById("source").value.trim();
    const drop = document.getElementById("destination").value.trim();
    const date = document.getElementById("date").value;
    const vehicleType = document.getElementById("vehicleType").value;

    if (!pickup || !drop || !date || !vehicleType) {
        alert("Please fill all fields before booking.");
        return;
    }

    if (fare === 0) {
        alert("Please calculate fare first.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pickup,
                drop_location: drop,
                date,
                vehicleType,
                fare
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Booking Confirmed ✅");
        } else {
            alert(data.message || "Booking failed ❌");
        }

    } catch (error) {
        console.error(error);
        alert("Server error. Make sure backend is running.");
    }
}

/* =========================
   AUTO SUGGESTIONS
========================= */
let timeout;

function getSuggestions(query, listId) {
    clearTimeout(timeout);

    timeout = setTimeout(async () => {
        if (query.length < 3) return;

        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in`;

            const response = await fetch(url);
            const data = await response.json();

            const list = document.getElementById(listId);
            list.innerHTML = "";

            data.forEach(place => {
                const option = document.createElement("option");
                option.value = place.display_name;
                list.appendChild(option);
            });

        } catch (error) {
            console.error(error);
        }
    }, 300);
}

/* =========================
   RESET FARE FIX (IMPORTANT)
========================= */
window.addEventListener("DOMContentLoaded", function () {

    const vehicleType = document.getElementById("vehicleType");

    if (vehicleType) {
        vehicleType.addEventListener("change", function () {
            document.getElementById("fare").innerText =
                "Click 'Calculate Fare' to update fare.";
            fare = 0;
        });
    }

    // extra safety reset
    const source = document.getElementById("source");
    const destination = document.getElementById("destination");

    function resetFare() {
        fare = 0;
        document.getElementById("fare").innerText =
            "Click 'Calculate Fare' to update fare.";
    }

    if (source) source.addEventListener("input", resetFare);
    if (destination) destination.addEventListener("input", resetFare);
});

/* =========================
   LOGOUT
========================= */
function logoutUser() {
    localStorage.removeItem("userEmail");
    window.location.href = "login.html";
}