import * as Tone from "tone";
import { Midi } from "@tonejs/midi";

function bass(track: { time: number, midi: number, dur: number }[]) {
    const synth = new Tone.Synth({
        oscillator: {
            type: "triangle12",
        },
        envelope: {
            attack: 0.1,
            decay: 0.1,
            sustain: 0.3,
            release: 0.2,
        },
    }).toDestination();

    const panner = new Tone.Panner(0.5).toDestination();
    synth.connect(panner);

    const part = new Tone.Part((time, value) => {
        synth.triggerAttackRelease(
            // @ts-ignore
            Tone.Frequency(value.midi, "midi"),
            value.dur,
            time,
            0.1
        );
    }, track);

    return part;
}

function guitar(track: { time: number, midi: number, dur: number }[]) {
    const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
            type: "square12",
        },
        envelope: {
            attack: 0.01,
            decay: 0.4,
            sustain: 0.00000000000001,
            release: 1,
        },
    }).toDestination();

    const filter = new Tone.Filter(10000, "highpass", -96).toDestination();
    synth.connect(filter);

    const reverb = new Tone.Reverb(0.25).toDestination();
    synth.connect(reverb);

    const panner = new Tone.Panner(-0.5).toDestination();
    synth.connect(panner);

    const part = new Tone.Part((time, value) => {
        synth.triggerAttackRelease(
            // @ts-ignore
            Tone.Frequency(value.midi, "midi"),
            value.dur,
            time,
            0.1
        );
    }, track);

    return part;
}

const button = document.querySelector("button")!;
button.addEventListener("click", async () => {
    const midi = await Midi.fromUrl("/ivy.mid");

    const [, bassTrack, guitarTrack] = midi.tracks.map((track) => {
        return track.notes.map((note) => {
            return {
                time: note.time,
                midi: note.midi,
                dur: note.duration,
            };
        });
    });

    const bassPart = bass(bassTrack);
    const guitarPart = guitar(guitarTrack);

    bassPart.start(0);
    guitarPart.start(0);
    Tone.Transport.start();
});
