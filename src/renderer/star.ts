import { ctx } from "../config";

interface Star {
    x: number,
    y: number,
    radius: number,
    spikes: number,
    fill: string,
}

function drawStar(
    {
        x,
        y,
        radius,
        spikes,
        fill,
    }: Star
) {
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    for (let i = 0; i < spikes; i++) {
        const angle = Math.PI / 2 * i;
        const x1 = x + Math.cos(angle) * radius;
        const y1 = y + Math.sin(angle) * radius;
        ctx.lineTo(x1, y1);
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
}


export { drawStar, Star }
