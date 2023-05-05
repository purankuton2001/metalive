import {ActionTypes, DirectionPlayerAction, DirectionPlayerActionTypes, DirectionPlayerState} from "../types/utils";

export const directionPlayerReducer = (state: DirectionPlayerState, action: DirectionPlayerAction) => {
    switch (action.type) {
        case DirectionPlayerActionTypes.SETDURATION:
            return {...state, duration: action.payload.duration}
        case DirectionPlayerActionTypes.CHANGECURRENTTIME:
            return {...state, currentTime: action.payload.value};
        case DirectionPlayerActionTypes.TOGGLEPLAYING:
            return {...state, playing: !state.playing};
        case DirectionPlayerActionTypes.TIMEPROGRESS:
            return {...state, currentTime: state.currentTime + 0.01};
        case DirectionPlayerActionTypes.LIVEDATAFETCH:
            const {url, equipments, liveId, duration} = action.payload.data
            return {...state, url, equipments, liveId, duration, currentTime: 0, playing: false}
        case DirectionPlayerActionTypes.SKIPSTART:
            return {...state, currentTime: 0}
        case DirectionPlayerActionTypes.RERENDERING:
            return {...state};
    }
};