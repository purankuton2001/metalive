import {MovingLight, MovingLightKeyFrames} from "./MovingLight";
import {AnimationClipJson} from "./AnimationJson";
import {gsap} from "gsap";

export type Transform = number[];
export type Color = { r: number; g: number; b: number; };

export enum EquipmentTypes {
    MovingLight = "MovingLight",
}

export type Equipment = MovingLight;
export type Keyframes = MovingLightKeyFrames;

export type Range = number[];


export type EditorState = {
    dmxConnect: string;
    equipments: Equipment[];
    duration: number;
    displayRange: Range;
    currentTime: number;
    playing: boolean;
    transformControl: {
        mode: "translate" | "scale" | "rotate";
        object: any;
        index: number;
    };
};
export type KeyFrame = { time: number; value: number };

export enum ActionTypes {
    TURNPREKEYFRAME = "TURNPREKEYFRAME",
    TURNNEXTKEYFRAME = "TURNNEXTKEYFRAME",
    ADDUNIVERSE = "ADDUNIVERSE",
    CHANGEKEYFRAMEFINISH = "CHANGEKEYFRAMEFINISH",
    CHANGEOBJECTKEYFRAMEFINISH = "CHANGEOBJECTKEYFRAMEFINISH",
    RERENDERING = "RERENDERING",
    CHANGEKEYFRAMETIME = "CHANGEKEYFRAMETIME",
    CHANGEOBJECTKEYFRAMETIME = "CHANGEOBJECTKEYFRAMETIME",
    ADDKEYFRAME = "ADDKEYFRAME",
    ADDOBJECTKEYFRAME = "ADDOBJECTKEYFRAME",
    TIMEPROGRESS = "TIMEPROGRESS",
    TOGGLEPLAYING = "TOGGLEPLAYING",
    ADDEQUIPMENT = "ADDEQUIPMENT",
    CHANGETRANSFORMOBJECT = "CHANGETRANSFORMOBJECT",
    CHANGEPARMETER = "CHANGEPARMETER",
    CHANGEOBJECTPARMETER = "CHANGEOBJECTPARMETER",
    CHANGECURRENTTIME = "CHANGECURRENTTIME",
    PROGRESSTIME = "PROGRESSTIME",
    CHANGEDISPLAYRANGE = "CHANGEDISPLAYRANGE",
}

export type Action = {
    type: ActionTypes;
    payload?: any;
};

export type StateToClip = (State: EditorState) => AnimationClipJson;

export type ClipToState = (Clip: AnimationClipJson) => EditorState;
