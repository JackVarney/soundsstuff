import * as Tone from "tone";
import { ctx, H, W } from "../config";
import { drawSky } from "../renderer/sky";

function guitar(track: { time: number, midi: number, dur: number }[]) {
    const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
            type: "sine",
        },
        envelope: {
            attack: 0.01,
            decay: 1,
            sustain: 0.00000000000001,
            release: 4,
        },
        volume: -28,
    }).toDestination();

    const panner = new Tone.Panner(-0.5).toDestination();
    synth.connect(panner);

    const reverb = new Tone.Reverb(2).toDestination();
    synth.connect(reverb);

    const part = new Tone.Part((time, value) => {
        synth.triggerAttackRelease(
            Tone.Frequency(value.midi, "midi").toFrequency(),
            value.dur,
            time,
        );

        Tone.Draw.schedule(() => {
            ctx.filter = "blur(0px)";
            drawSky(value.midi);
            ctx.filter = "blur(0px)";
        }, time);
    }, track);

    part.loop = true;
    part.loopEnd = "17m";

    return part;
}

export { guitar }
