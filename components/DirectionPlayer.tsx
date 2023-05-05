import {Canvas} from "@react-three/fiber";
import {OrbitControls, PerspectiveCamera, Stage} from "@react-three/drei";
import Venue from "./venue";
import React, {createContext, Dispatch, useEffect, useLayoutEffect, useReducer, useRef, useState} from "react";
import {
    DirectionPlayerAction,
    DirectionPlayerActionTypes,
    DirectionPlayerState,
    Equipment
} from "../types/utils";
import {directionPlayerReducer} from "../context/directionPlayerReducer";
import MovinglightPlayer from "./movinglightplayer";
import {
    Box,
    Button,
    chakra,
    Icon,
    position,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack
} from "@chakra-ui/react";
import {BsFillSkipStartFill, BsPauseFill, BsPlayFill} from "react-icons/bs";
import {Vector3} from "three";
import {saveAs} from 'file-saver';
import {Howl} from 'howler'


const initialState: DirectionPlayerState = {
    liveId: '',
    url: '',
    equipments: [],
    duration: 0,
    currentTime: 0,
    playing: false,
}
export const DirectionPlayerContext = createContext(
    {} as {
        state: DirectionPlayerState;
        dispatch: Dispatch<DirectionPlayerAction>;
    }
);
export default function DirectionPlayer({direction}) {
    const [audio, setAudio] = useState<any>();
    useLayoutEffect(() => {
        dispatch({type: DirectionPlayerActionTypes.LIVEDATAFETCH, payload: {data: direction}});
        setAudio(new Howl({
            src: '/asset/e-ma_Mastered2.wav',
            html5: true,
        }));
        if (audio) {
            audio.on('load', () => {
                dispatch({type: DirectionPlayerActionTypes.SETDURATION, payload: {duration: audio.duration()}})
            })
            audio.load();
            audio.stop();
        }
    }, [direction]);
    const [state, dispatch] = useReducer(directionPlayerReducer, initialState);
    useLayoutEffect(() => {
        if (state.playing) {
            audio?.seek(state.currentTime);
            audio?.play();
        } else {
            audio?.pause();
        }
    }, [state?.playing]);
    const stateToComponents = (equipment: Equipment, index) => {
        switch (equipment.eId) {
            case 0:
                return <MovinglightPlayer equipment={equipment} index={index}/>;
        }
    };
    const orbitcontrol = useRef();
    return (
        <Box h={'100%'} zIndex={1}>
            <Canvas
                gl={{alpha: false}}
                camera={{fov: 60, position: [20, 80, 300], rotation: [0, 1, 0]}}
            >
                <ambientLight intensity={1}/>
                <DirectionPlayerContext.Provider value={{state, dispatch}}>
                    <Venue
                        url={state?.url}/>
                    {state.equipments?.map(stateToComponents)}
                </DirectionPlayerContext.Provider>
                <OrbitControls attach="orbitControls" ref={orbitcontrol} onChange={() => {
                    console.log(orbitcontrol.current)
                }}/>
            </Canvas>
            {direction.duration !== 0 && <chakra.div>
                <Slider aria-label='slider-ex-1'
                        min={0}
                        max={state.duration}
                        step={0.1}
                        value={state.currentTime}
                        onChange={(v) => {
                            dispatch({
                                type: DirectionPlayerActionTypes.CHANGECURRENTTIME,
                                payload: {value: v}

                            })
                        }}>
                    <SliderTrack>
                        <SliderFilledTrack/>
                    </SliderTrack>
                    <SliderThumb/>
                </Slider>
                <chakra.div flexDirection={'row'} alignItems={'center'} display={"flex"}>
                    <Icon
                        as={BsFillSkipStartFill}
                        w={8}
                        h={8}
                        onClick={() => {
                            dispatch({type: DirectionPlayerActionTypes.SKIPSTART});
                        }}
                    />
                    <Icon
                        as={!state.playing ? BsPlayFill : BsPauseFill}
                        w={8}
                        h={8}
                        onClick={() => {
                            dispatch({type: DirectionPlayerActionTypes.TOGGLEPLAYING});
                        }}
                    />
                    <chakra.text>{state.currentTime}/{state.duration}</chakra.text>
                </chakra.div>
                <Button onClick={() => {
                    const out = [{duration: 10}];
                    direction.equipments.forEach((equipment) => {
                        const outObject: any = {};
                        outObject.parmeter = {};
                        Object.keys(equipment.parmeter).forEach(k => {
                            if (k !== 'currentTime') {
                                outObject.parmeter[k] = {};
                                outObject.parmeter[k].idx = equipment.parmeter[k].idx;
                                outObject.parmeter[k].val = equipment.parmeter[k].val;
                            }
                        })
                        outObject.eId = equipment.eId;
                        outObject.position = equipment.position;
                        outObject.keyframes = equipment.keyframes;
                        outObject.max = equipment.max;
                        out.push(outObject);
                    })
                    const blob = new Blob([JSON.stringify(out)], {
                        type: "application/json"
                    })
                    saveAs(blob, direction.title + '.json');
                }}>
                    json出力
                </Button>
            </chakra.div>
            }
        </Box>
    )
}
