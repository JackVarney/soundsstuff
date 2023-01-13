import * as Tone from "tone";
import { Midi } from "@tonejs/midi";
import { canvas, ctx, H, W } from "./config";
import { bass } from "./instrument/bass";
import { guitar } from "./instrument/guitar";

canvas.height = H;
canvas.width = W

async function getTracksFromMIDI() {
    const midi = await Midi.fromUrl("/ivy.mid");

    console.log(midi)

    const [, bassTrack, guitarTrack] = midi.tracks.map((track) => {
        return track.notes.map((note) => {
            return {
                time: note.time,
                midi: note.midi,
                dur: note.duration,
            };
        });
    });

    return {
        bassTrack,
        guitarTrack,
    }
}

async function play() {
    const { bassTrack, guitarTrack } = await getTracksFromMIDI();

    const bassPart = bass(bassTrack);
    const guitarPart = guitar(guitarTrack);

    bassPart.start(0);
    guitarPart.start(0);

    Tone.Transport.start();
}

let hasStarted = false;
canvas.addEventListener("click", async () => {
    if (hasStarted) {
        return;
    }

    play();
});


function x() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    window.requestAnimationFrame(x);
};

x();

