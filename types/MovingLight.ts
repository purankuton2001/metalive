import {AnimationClipJson} from "./AnimationJson";
import {Transform, Color, KeyFrame} from "./utils";
import {AnimationClip} from "three";

export type MovingLight = {
    position: Transform;
    parmeter: {
        pan: { val: number, idx: 0 };
        tilt: { val: number, idx: 1 };
        color: { val: Color, idx: 2 };
        dimmer: { val: number, idx: 3 };
        strobe: { val: number, idx: 4 };
        zoom: { val: number, idx: 5 };
        currentTime: { val: number, idx: 6 };
    };
    max: {
        pan: 540;
        tilt: 270;
        zoom: 90;
        dimmer: 255;
        strobe: 20;
        color: { r: 1, g: 1, b: 1 };
    };
    eId: number;
    keyframes: MovingLightKeyFrames
};

export type MovingLightKeyFrames = {
    changed: boolean;
    amount: number;
    pan: KeyFrame[];
    tilt: KeyFrame[];
    zoom: KeyFrame[];
    dimmer: KeyFrame[];
    strobe: KeyFrame[];
    color: { r: KeyFrame[]; g: KeyFrame[]; b: KeyFrame[] };
}
