const form = document.getElementById("data-form");
const otpBox = document.getElementById("otp-box");
const verifyBtn = document.getElementById("verifyBtn");
const timerText = document.getElementById("timer");
const otpInput = document.getElementById("otp");

let countdown;
let generatedOTP = "";

// Form submit
form.addEventListener("submit", function (e) {
    e.preventDefault();

    form.style.display = "none";
    otpBox.style.display = "block";

    startTimer(60);
    autoGenerateOTP();
});

// Countdown timer
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

// Auto generate OTP after 5–6 seconds
function autoGenerateOTP() {
    const delay = Math.floor(Math.random() * 2 + 5) * 1000; // 5 or 6 sec

    setTimeout(() => {
        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        otpInput.value = generatedOTP;

        timerText.innerText = "📩 Demo OTP auto received";
    }, delay);
}

// Verify OTP
verifyBtn.addEventListener("click", function () {
    const otp = otpInput.value;

    if (otp.length !== 6) {
        alert("⚠️ ৬ ডিজিট OTP লিখুন");
        return;
    }

    if (otp !== generatedOTP) {
        alert("❌ OTP মিলেনি (Demo)");
        return;
    }

    clearInterval(countdown);

    alert(
        "🎉 সফলভাবে ভেরিফাই হয়েছে!\n\n🇧🇩 বিজয় দিবস উপলক্ষে ৫GB ডাটা রিকোয়েস্ট গ্রহণ করা হয়েছে।\n📌 ২৪ ঘণ্টার মধ্যে অ্যাক্টিভ হবে।"
    );

    location.reload();
});
