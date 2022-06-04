import {Action, ActionTypes, EditorState, Equipment, EquipmentTypes,} from "../types/utils";
import axios from "axios";

export const editorReducer = (state: EditorState, action: Action) => {
    switch (action.type) {
        case ActionTypes.ADDUNIVERSE:
            axios.post(
                "https://us-central1-metalive-348103.cloudfunctions.net/addUniverse",
                {ipAdress: action.payload.ipAdress}
            ).then(() => {
                return {...state, dmxConnect: action.payload.ipAdress}
            });
        case ActionTypes.ADDEQUIPMENT:
            switch (action.payload.equipment) {
                case EquipmentTypes.MovingLight:
                    const s: Equipment = {
                        position: [0, 0, 0],
                        parmeter: {
                            pan: 0,
                            tilt: 0,
                            zoom: 0,
                            dimmer: 0,
                            strobe: 0,
                            color: {r: 0, g: 0, b: 0},
                            currentTime: 0,
                        },
                        eId: 0,
                        keyframes: {
                            changed: false,
                            amount: 0,
                            pan: [],
                            tilt: [],
                            zoom: [],
                            dimmer: [],
                            strobe: [],
                            color: {r: [], g: [], b: []},
                        },
                    };
                    const newEquipments = state.equipments;
                    newEquipments.push(s);
                    console.log(newEquipments);
                    return {...state, equipments: newEquipments};
            }
        case ActionTypes.CHANGETRANSFORMOBJECT:
            return {
                ...state,
                transformControl: {
                    ...state.transformControl,
                    object: action.payload.object,
                    index: action.payload.index,
                },
            };
        case ActionTypes.CHANGEPARMETER:
            const newEquipments = state.equipments;
            newEquipments[state.transformControl.index].parmeter[action.payload.key] =
                action.payload.value;
            if (
                state.equipments[state.transformControl.index].keyframes[
                    action.payload.key
                    ].length >= 1
            ) {
                const targetIndex = newEquipments[
                    state.transformControl.index
                    ].keyframes[action.payload.key].findIndex(
                    (f) => f.time === state.currentTime
                );
                if (targetIndex === -1) {
                    newEquipments[state.transformControl.index].keyframes[
                        action.payload.key
                        ].push({
                        time: state.currentTime,
                        value: action.payload.value,
                    });
                    newEquipments[state.transformControl.index].keyframes[
                        action.payload.key
                        ].sort((a, b) => {
                        return a.time - b.time;
                    });
                    newEquipments[state.transformControl.index].keyframes.amount += 1;
                } else {
                    newEquipments[state.transformControl.index].keyframes[
                        action.payload.key
                        ][targetIndex].value = action.payload.value;
                    newEquipments[state.transformControl.index].keyframes.changed =
                        !newEquipments[state.transformControl.index].keyframes.changed;
                }
            }
            return {...state, equipments: newEquipments};
        case ActionTypes.CHANGEOBJECTPARMETER:
            const newObjectEquipments = state.equipments;
            newObjectEquipments[state.transformControl.index].parmeter[
                action.payload.par[0]
                ][action.payload.par[1]] = action.payload.value;
            if (
                state.equipments[state.transformControl.index].keyframes[
                    action.payload.par[0]
                    ][action.payload.par[1]].length >= 1
            ) {
                const targetIndex = newObjectEquipments[
                    state.transformControl.index
                    ].keyframes[action.payload.par[0]][action.payload.par[1]].findIndex(
                    (f) => f.time === state.currentTime
                );
                if (targetIndex === -1) {
                    newObjectEquipments[state.transformControl.index].keyframes[
                        action.payload.par[0]
                        ][action.payload.par[1]].push({
                        time: state.currentTime,
                        value: action.payload.value,
                    });
                    newObjectEquipments[state.transformControl.index].keyframes[
                        action.payload.par[0]
                        ][action.payload.par[1]].sort((a, b) => {
                        return a.time - b.time;
                    });
                    newObjectEquipments[
                        state.transformControl.index
                        ].keyframes.amount += 1;
                } else {
                    newObjectEquipments[state.transformControl.index].keyframes[
                        action.payload.par[0]
                        ][action.payload.par[1]][targetIndex].value = action.payload.value;
                    newObjectEquipments[state.transformControl.index].keyframes.changed =
                        !newObjectEquipments[state.transformControl.index].keyframes
                            .changed;
                }
            }
            return {...state, equipments: newObjectEquipments};
        case ActionTypes.CHANGECURRENTTIME:
            return {...state, currentTime: action.payload.value};
        // if (action.payload.value > state.displayRange[1] - 0.1) {
        //   const rangelength = state.displayRange[1] - state.displayRange[0];
        //   const newDisplayRange =
        //     state.duration < action.payload.value
        //       ? [state.duration - rangelength, state.duration]
        //       : [
        //           action.payload.value + 0.1 - rangelength,
        //           action.payload.value + 0.1,
        //         ];
        //   return {
        //     ...state,
        //     displayRange: newDisplayRange,
        //     currentTime: Math.min(state.duration, action.payload.value),
        //   };
        // } else {
        //   if (action.payload.value < state.displayRange[0] + 0.1) {
        //     const rangelength = state.displayRange[1] - state.displayRange[0];
        //     const newDisplayRange =
        //       0 > action.payload.value
        //         ? [0, rangelength]
        //         : [
        //             action.payload.value - 0.1,
        //             action.payload.value - 0.1 + rangelength,
        //           ];
        //     return {
        //       ...state,
        //       displayRange: newDisplayRange,
        //       currentTime: Math.max(0, action.payload.value),
        //     };
        //   } else {
        //   }
        // }
        case ActionTypes.CHANGEDISPLAYRANGE:
            return {...state, displayRange: action.payload.value};
        // if (action.payload.value[0] > state.currentTime) {
        //   return {
        //     ...state,
        //     currentTime: action.payload.value[0],
        //     displayRange: action.payload.value,
        //   };
        // } else {
        // }
        case ActionTypes.TOGGLEPLAYING:
            axios.post("https://us-central1-metalive-348103.cloudfunctions.net/playDmx",
                {currentTime: state.currentTime, parmeter: state.equipments[0].parmeter, playing: !state.playing})
                .catch(err => console.log(err));
            return {...state, playing: !state.playing};
        case ActionTypes.TIMEPROGRESS:
            return {...state, currentTime: state.currentTime + 0.01};
        case ActionTypes.ADDKEYFRAME:
            const newEquipments2 = state.equipments;
            newEquipments2[state.transformControl.index].keyframes[
                action.payload.par
                ].push({
                time: state.currentTime,
                value:
                    newEquipments2[state.transformControl.index].parmeter[
                        action.payload.par
                        ],
            });
            newEquipments2[state.transformControl.index].keyframes[
                action.payload.par
                ].sort((a, b) => {
                return a.time - b.time;
            });
            newEquipments2[state.transformControl.index].keyframes.amount += 1;
            return {...state, equipments: newEquipments2};
        case ActionTypes.ADDOBJECTKEYFRAME:
            const newEquipments6 = state.equipments;
            newEquipments6[state.transformControl.index].keyframes[
                action.payload.par[0]
                ][action.payload.par[1]].push({
                time: state.currentTime,
                value:
                    newEquipments6[state.transformControl.index].parmeter[
                        action.payload.par[0]
                        ][action.payload.par[1]],
            });
            newEquipments6[state.transformControl.index].keyframes[
                action.payload.par[0]
                ][action.payload.par[1]].sort((a, b) => {
                return a.time - b.time;
            });

            console.log(newEquipments6[state.transformControl.index].keyframes);
            newEquipments6[state.transformControl.index].keyframes.amount += 1;
            return {...state, equipments: newEquipments6};
        case ActionTypes.CHANGEKEYFRAMETIME:
            const newEquipments3 = state.equipments;
            newEquipments3[state.transformControl.index].keyframes[
                action.payload.par
                ][action.payload.idx].time = action.payload.value;
            return {...state, equipments: newEquipments3};
        case ActionTypes.CHANGEOBJECTKEYFRAMETIME:
            const newEquipments4 = state.equipments;
            newEquipments4[state.transformControl.index].keyframes[
                action.payload.par[0]
                ][action.payload.par[1]][action.payload.idx].time = action.payload.value;
            return {...state, equipments: newEquipments4};
        case ActionTypes.RERENDERING:
            return {...state};
        case ActionTypes.CHANGEKEYFRAMEFINISH:
            const newEquipments7 = state.equipments;
            newEquipments7[state.transformControl.index].keyframes[
                action.payload.par
                ].sort((a, b) => {
                return a.time - b.time;
            });
            newEquipments7[state.transformControl.index].keyframes.changed =
                !newEquipments7[state.transformControl.index].keyframes.changed;
            return {...state, equipments: newEquipments7};
        case ActionTypes.CHANGEOBJECTKEYFRAMEFINISH:
            const newEquipments8 = state.equipments;
            newEquipments8[state.transformControl.index].keyframes[
                action.payload.par[0]
                ][action.payload.par[1]].sort((a, b) => {
                return a.time - b.time;
            });
            newEquipments8[state.transformControl.index].keyframes.changed =
                !newEquipments8[state.transformControl.index].keyframes.changed;
            return {...state, equipments: newEquipments8};
        case ActionTypes.PROGRESSTIME:
            return {...state, currentTime: state.currentTime + 0.01};
        case ActionTypes.TURNNEXTKEYFRAME:
            const newCurrentTimearr2 = state.equipments[state.transformControl.index].keyframes[action.payload.par]
                .filter(t => t.time > state.currentTime)
            if (newCurrentTimearr2.length !== 0) {
                const newCurrentTime2 = newCurrentTimearr2.reduce((a, b) => Math.min(a.time, b.time))
                return {
                    ...state,
                    currentTime: typeof newCurrentTime2 == "object" ? newCurrentTime2.time : newCurrentTime2
                }
            } else {
                return state
            }
        case ActionTypes.TURNPREKEYFRAME:
            const newCurrentTimearr = state.equipments[state.transformControl.index].keyframes[action.payload.par]
                .filter(t => t.time < state.currentTime)
            if (newCurrentTimearr.length !== 0) {
                const newCurrentTime = newCurrentTimearr.reduce((a, b) => Math.max(a.time, b.time))
                return {
                    ...state,
                    currentTime: typeof newCurrentTime == "object" ? newCurrentTime.time : newCurrentTime
                }
            } else {
                return state
            }
    }
};
