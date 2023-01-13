import { drawStar } from "./star";
import { H, W } from "../config";
import { createNoise2D } from 'simplex-noise';

const TOTAL_STARS = 12 * 12; // 12 notes * 12 octaves
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const simplex = createNoise2D();

function generateStarField() {
    const grid = Array.from({ length: TOTAL_STARS }, (_, i) => i);

    // randomise grid
    for (let i = grid.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [grid[i], grid[j]] = [grid[j], grid[i]];
    }

    return grid.map((noteNumber, i) => {
        const twelthOfHeight = H / 12;
        const twelthOfWidth = W / 12;
        const heightOffset = twelthOfHeight / 2;
        const widthOffset = twelthOfWidth / 2;

        const x = i % 12;
        const y = Math.floor(i / 12);
        const noise = simplex(x * x, y * y) * 10;

        const note = NOTES[noteNumber % 12];

        return {
            x: x * twelthOfWidth + noise + widthOffset,
            y: y * twelthOfHeight + noise + heightOffset,
            radius: 12 + noise,
            spikes: 5,
            note
        };


    });
}

const sky = generateStarField();
function drawSky(midiKey: number) {
    const note: string = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][midiKey % 12];

    for (let i = 0; i < TOTAL_STARS; i++) {
        const isNote = sky[i].note === note;
        const fillColour = isNote ? "hsla(310, 80%, 90%, 1)" : "hsla(0, 100%, 100%, 0.2)";

        const star = sky[i];
        const draw = () => drawStar({
            ...star,
            fill: fillColour,
        });

        draw();
    }
}

export { drawSky }
