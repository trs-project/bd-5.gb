const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = ["#006a4e", "#f42a41"];
const pieces = [];

for (let i = 0; i < 120; i++) {
    pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 6 + 4,
        c: colors[Math.floor(Math.random() * colors.length)],
        s: Math.random() * 2 + 1
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.fill();

        p.y += p.s;
        if (p.y > canvas.height) p.y = -10;
    });

    requestAnimationFrame(draw);
}

draw();
