import {AnimationClipJson} from "./AnimationJson";
import {Transform, Color, KeyFrame} from "./utils";
import {AnimationClip} from "three";

export type MovingLight = {
    position: Transform;
    parmeter: {
        pan: number;
        tilt: number;
        zoom: number;
        dimmer: number;
        strobe: number;
        color: Color;
        currentTime: number;
    };
    max: {
        pan: number;
        tilt: number;
        zoom: number;
        dimmer: number;
        strobe: number;
        color: Color;
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
