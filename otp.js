const form = document.getElementById("data-form");
const otpBox = document.getElementById("otp-box");
const verifyBtn = document.getElementById("verifyBtn");
const timerText = document.getElementById("timer");

let countdown;

form.addEventListener("submit", function (e) {
    e.preventDefault();

    form.style.display = "none";
    otpBox.style.display = "block";

    startTimer(60);
});

function startTimer(seconds) {
    let time = seconds;

    countdown = setInterval(() => {
        time--;
        timerText.innerText = `⏳ সময় বাকি: ${time} সেকেন্ড`;

        if (time <= 0) {
            clearInterval(countdown);
            timerText.innerText = "❌ OTP সময় শেষ";
        }
    }, 1000);
}

verifyBtn.addEventListener("click", function () {
    const otp = document.getElementById("otp").value;

    if (otp.length !== 6) {
        alert("⚠️ ৬ ডিজিট OTP লিখুন");
        return;
    }

    clearInterval(countdown);

    alert(
        "🎉 সফলভাবে ভেরিফাই হয়েছে!\n\n🇧🇩 বিজয় দিবস উপলক্ষে ৫GB ডাটা রিকোয়েস্ট গ্রহণ করা হয়েছে।\n📌 ২৪ ঘণ্টার মধ্যে অ্যাক্টিভ হবে।"
    );

    location.reload();
});
