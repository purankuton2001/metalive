import {Equipment, Keyframes} from "./utils";

export type Live = {
    url: string,
    equipments: Equipment[],
    title: string,
    artist: string,
    description: string,
}

export type Direction = {
    title: string,
    description: string,
    liveId: string,
    duration: number,
    artist: string,
    url: string,
    equipments: Equipment[]
}