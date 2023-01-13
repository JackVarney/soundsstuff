import * as Tone from "tone";
import { ctx, H, W } from "../config";
import { drawStar } from "../renderer/star";

function bass(track: { time: number, midi: number, dur: number }[]) {
    const synth = new Tone.Synth({
        oscillator: {
            type: "sine",
        },
        envelope: {
            attack: 0.02,
            decay: 0.4,
            sustain: 0.3,
            release: 0.2,
        },
        volume: -16,
    }).toDestination();

    const panner = new Tone.Panner(0.5).toDestination();
    synth.connect(panner);

    const trackDuration = track[track.length - 1].time + track[track.length - 1].dur;
    const part = new Tone.Part((time, value) => {
        synth.triggerAttackRelease(
            Tone.Frequency(value.midi, "midi").toFrequency(),
            value.dur,
            time,
        );

        Tone.Draw.schedule(() => {
            const x = value.time * (W / trackDuration);
            // ctx.fillRect(x, (H * 0.1) + (value.midi * 16), value.dur * 100, 2);

            // drawStar({
            //     x,
            //     y: (H * 0.1) + (value.midi * 16),
            //     radius: 3,
            //     spikes: 9,
            //     fill: "hsla(180, 80%, 90%, 0.8)",
            // })
        }, time);
    }, track);

    part.loop = true;
    part.loopEnd = "17m";

    return part;
}

export { bass }