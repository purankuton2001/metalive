import {Equipment, Keyframes} from "./utils";

type Live = {
    id: string,
    url: string,
    equipments: Equipment[],
    title: string,
    artist: string,
    description: string,
}

type Direction = {
    id: string,
    duration: number,
    artist: string,
    url: string,
    equipments: Equipment[]
}