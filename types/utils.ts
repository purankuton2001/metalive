import {MovingLight, MovingLightKeyFrames} from "./MovingLight";
import {AnimationClipJson} from "./AnimationJson";
import {gsap} from "gsap";

export type Transform = number[];
export type Color = { r: { val: number, idx: 0 }; g: { val: number, idx: 1 }; b: { val: number, idx: 2 }; };

export enum EquipmentTypes {
    MovingLight = "MovingLight",
}

export type Equipment = MovingLight;
export type Keyframes = MovingLightKeyFrames;
export type KeyFrame = { time: number; value: number };
export type Range = number[];

export type DirectionPlayerState = {
    liveId: string;
    url: string;
    equipments: Equipment[];
    duration: number;
    currentTime: number;
    playing: boolean;
};

export type EditorState = {
    liveId: string;
    url: string;
    dmxConnect: string;
    equipments: Equipment[];
    duration: number;
    currentTime: number;
    playing: boolean;
    displayRange: Range;
    transformControl: {
        mode: "translate" | "scale" | "rotate";
        object: any;
        index: number;
    };
};

export enum ActionTypes {
    SETDURATION = "SETDURATION",
    TURNPREKEYFRAME = "TURNPREKEYFRAME",
    TURNNEXTKEYFRAME = "TURNNEXTKEYFRAME",
    TURNOBJECTPREKEYFRAME = "TURNOBJECTPREKEYFRAME",
    TURNOBJECTNEXTKEYFRAME = "TURNOBJECTNEXTKEYFRAME",
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
    CHANGEDISPLAYRANGE = "CHANGEDISPLAYRANGE",
    LIVEDATAFETCH = "LIVEDATAFETCH",
}

export enum DirectionPlayerActionTypes {
    SETDURATION = "SETDURATION",
    RERENDERING = "RERENDERING",
    TIMEPROGRESS = "TIMEPROGRESS",
    TOGGLEPLAYING = "TOGGLEPLAYING",
    CHANGECURRENTTIME = "CHANGECURRENTTIME",
    LIVEDATAFETCH = "LIVEDATAFETCH",
    SKIPSTART = "SKIPSTART",
}

export type DirectionPlayerAction = {
    type: DirectionPlayerActionTypes;
    payload?: any;
}

export type Action = {
    type: ActionTypes;
    payload?: any;
};

export type StateToClip = (State: EditorState) => AnimationClipJson;

export type ClipToState = (Clip: AnimationClipJson) => EditorState;
