import {
    Box,
    chakra,
    Icon,
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    RangeSliderTrack,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Spacer,
} from "@chakra-ui/react";
import {Resizable} from "re-resizable";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useWindowSize} from "../hooks/useWindowSize";
import {EditorContext} from "../context/EditorContext";
import {ActionTypes} from "../types/utils";
import {BsPauseFill, BsPlayFill} from "react-icons/bs";
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";


export function ParmeterPanel() {
    const timelineScroll = useRef<any>();
    const slider = useRef<any>();
    const {width, height} = useWindowSize();
    const [keys, setKeys] = useState([]);
    const {state, dispatch} = useContext(EditorContext);


    useEffect(() => {
        const w =
            (state.duration / (state.displayRange[1] - state.displayRange[0])) *
            timelineScroll.current.getBoundingClientRect().width;
        console.log(slider.current.getBoundingClientRect());
        timelineScroll?.current?.scrollTo(
            (state.displayRange[0] / state.duration) * w,
            0
        );
    }, [state.displayRange]);
    useEffect(() => {
        if (
            state.equipments.length !== 0 &&
            state.equipments[state.transformControl.index]
        ) {
            const newKeys = []
            const par = state.equipments[state.transformControl.index]?.parmeter;
            for (const [key, value] of Object.entries(par)) {
                newKeys[value.idx] = key;
            }
            setKeys(newKeys);
        }
    }, [state.transformControl.index, state.currentTime]);
    return (
        <Box>
            <chakra.div display={"flex"} flexDirection={"row"}>
                <Resizable
                    minHeight={(height * keys[state.transformControl.index]?.length) / 15}
                    minWidth={width / 5}
                    defaultSize={{
                        width: width / 5,
                        height: (height * keys[state.transformControl.index]?.length) / 15,
                    }}
                    enable={{
                        top: false,
                        left: false,
                        right: true,
                        bottom: false,
                    }}
                >
                    <chakra.div
                        borderWidth={.5}
                        height={height / 9}
                        width={"100%"}
                        bg={"white"}
                        alignItems={"center"}
                        display={"flex"}
                        flexDirection={"row"}
                        justifyContent={"right"}
                        px={2}
                    >
                        <chakra.text px={2} fontSize={18}>{state.currentTime} / {state.duration}</chakra.text>
                        <Icon
                            as={!state.playing ? BsPlayFill : BsPauseFill}
                            w={8}
                            h={8}
                            onClick={() => {
                                dispatch({type: ActionTypes.TOGGLEPLAYING});
                            }}
                        />
                    </chakra.div>
                    {state.transformControl.object &&
                        keys?.map((key) => {
                            if (
                                typeof state.equipments[state.transformControl.index].parmeter[
                                    key
                                    ]?.val === "number"
                            ) {
                                if (key !== "currentTime") {
                                    return (
                                        <chakra.div
                                            flexDirection={"row"}
                                            display={"flex"}
                                            width={"100%"}
                                            borderWidth={0.5}
                                            borderColor={"gray.500"}
                                            height={height / 15}
                                            alignItems={"center"}
                                            px={2}
                                        >
                                            <chakra.text fontSize={18} width={width / 5}>
                                                {key +
                                                    state.equipments[state.transformControl.index].parmeter[
                                                        key
                                                        ].val}
                                            </chakra.text>
                                            <chakra.div
                                                justifyContent={"space-around"}
                                                display={"flex"}
                                                flexDirection={"row"}
                                                w={60}
                                                h={4}
                                                bg={"white"}
                                                mr={4}
                                            >
                                                <ChevronLeftIcon
                                                    w={4}
                                                    h={4}
                                                    onClick={() => {
                                                        dispatch({
                                                            type: ActionTypes.TURNPREKEYFRAME,
                                                            payload: {par: key},
                                                        });
                                                    }}
                                                />
                                                <Spacer/>
                                                <chakra.div
                                                    bg={"gray.400"}
                                                    w={4}
                                                    h={4}
                                                    borderRadius={'full'}
                                                    onClick={() => {
                                                        dispatch({
                                                            type: ActionTypes.ADDKEYFRAME,
                                                            payload: {par: key},
                                                        });
                                                    }}
                                                />
                                                <Spacer/>
                                                <ChevronRightIcon w={4} h={4} onClick={() => {
                                                    dispatch({
                                                        type: ActionTypes.TURNNEXTKEYFRAME,
                                                        payload: {par: key},
                                                    });
                                                }}/>
                                            </chakra.div>
                                            <Slider
                                                min={0}
                                                max={state.equipments[state.transformControl.index].max[key]}
                                                step={state.equipments[state.transformControl.index].max[key] / 1000}
                                                value={
                                                    state.equipments[state.transformControl.index].parmeter[
                                                        key
                                                        ].val
                                                }
                                                onChange={(v) => {
                                                    dispatch({
                                                        type: ActionTypes.CHANGEPARMETER,
                                                        payload: {
                                                            key,
                                                            value: v,
                                                        },
                                                    });
                                                }}
                                            >
                                                <SliderTrack bg="red.100">
                                                    <Box position="relative" right={10}/>
                                                    <SliderFilledTrack bg="white"/>
                                                </SliderTrack>
                                                <SliderThumb boxSize={6}/>
                                            </Slider>
                                        </chakra.div>
                                    );
                                }
                            }
                            if (typeof state.equipments[state.transformControl.index].parmeter[
                                key
                                ]?.val) {
                                const ks = []
                                for (const [k, v] of Object.entries(state.equipments[state.transformControl.index]
                                    .parmeter[key].val)) {
                                    // @ts-ignore
                                    ks[v.idx] = k;
                                }
                                return ks.map((k) => {
                                    return (
                                        <chakra.div
                                            key={k}
                                            flexDirection={"row"}
                                            display={"flex"}
                                            width={"100%"}
                                            borderWidth={0.5}
                                            borderColor={"gray.500"}
                                            height={height / 15}
                                            alignItems={"center"}
                                            px={2}
                                        >
                                            <chakra.text fontSize={18} width={width / 5}>
                                                {k +
                                                    state.equipments[state.transformControl.index]
                                                        .parmeter[key].val[k].val}
                                            </chakra.text>
                                            <chakra.div
                                                justifyContent={"space-around"}
                                                display={"flex"}
                                                flexDirection={"row"}
                                                w={60}
                                                h={4}
                                                bg={"white"}
                                                mr={4}
                                            >
                                                <ChevronLeftIcon
                                                    w={4}
                                                    h={4}
                                                    onClick={() => {
                                                        dispatch({
                                                            type: ActionTypes.TURNOBJECTPREKEYFRAME,
                                                            payload: {par: [key, k]},
                                                        });
                                                    }}
                                                />
                                                <Spacer/>
                                                <chakra.div
                                                    bg={"gray.400"}
                                                    w={4}
                                                    h={4}
                                                    borderRadius={'full'}
                                                    onClick={() => {
                                                        dispatch({
                                                            type: ActionTypes.ADDOBJECTKEYFRAME,
                                                            payload: {par: [key, k]},
                                                        });
                                                    }}
                                                />
                                                <Spacer/>
                                                <ChevronRightIcon w={4} h={4} onClick={() => {
                                                    dispatch({
                                                        type: ActionTypes.TURNOBJECTNEXTKEYFRAME,
                                                        payload: {par: [key, k]},
                                                    });
                                                }}/>
                                            </chakra.div>
                                            <Slider
                                                min={0}
                                                max={1}
                                                step={0.1}
                                                value={
                                                    state.equipments[state.transformControl.index]
                                                        .parmeter[key].val[k].val
                                                }
                                                onChange={(v) => {
                                                    dispatch({
                                                        type: ActionTypes.CHANGEOBJECTPARMETER,
                                                        payload: {
                                                            par: [key, k],
                                                            value: v,
                                                        },
                                                    });
                                                }}
                                            >
                                                <SliderTrack bg="red.100">
                                                    <Box position="relative" right={10}/>
                                                    <SliderFilledTrack bg="gray.500"/>
                                                </SliderTrack>
                                                <SliderThumb boxSize={6}/>
                                            </Slider>
                                        </chakra.div>
                                    );
                                });
                            }
                        })}
                </Resizable>
                <chakra.div
                    height={(height * keys[state.transformControl.index]?.length) / 20}
                    width={"100%"}
                >
                    <Slider
                        height={height / 140}
                        min={0}
                        max={state.duration}
                        step={0.1}
                        value={state.currentTime}
                        onChange={(v) => {
                            dispatch({
                                type: ActionTypes.CHANGECURRENTTIME,
                                payload: {value: v},
                            });
                        }}
                    >
                        <SliderTrack height={2} bg="white"></SliderTrack>
                        <SliderThumb boxSize={3}/>
                    </Slider>
                    <RangeSlider
                        height={height / 50}
                        aria-label={["min", "max"]}
                        value={state.displayRange}
                        step={0.1}
                        min={0}
                        max={state.duration}
                        onChange={(v) => {
                            dispatch({
                                type: ActionTypes.CHANGEDISPLAYRANGE,
                                payload: {value: v},
                            });
                        }}
                        alignSelf={"flex-end"}
                    >
                        <RangeSliderTrack>
                            <RangeSliderFilledTrack/>
                        </RangeSliderTrack>
                        <RangeSliderThumb index={0}/>
                        <RangeSliderThumb index={1}/>
                    </RangeSlider>
                    <chakra.div
                        bg={"white"}
                        overflowX={"auto"}
                        width={"100%"}
                        ref={timelineScroll}
                    >
                        <Slider
                            ref={slider}
                            width={`${
                                (state.duration /
                                    (state.displayRange[1] - state.displayRange[0])) *
                                100
                            }%`}
                            min={0}
                            max={state.duration}
                            step={0.1}
                            value={state.currentTime}
                            onChange={(v) => {
                                if (v > state.displayRange[1]) {
                                    console.log(v);
                                    const newRange = state.displayRange;
                                    const RangeDuration =
                                        state.displayRange[1] - state.displayRange[0];
                                    newRange[1] = Math.min(v, state.duration);
                                    newRange[0] = newRange[1] - RangeDuration;
                                    dispatch({
                                        type: ActionTypes.CHANGEDISPLAYRANGE,
                                        payload: {value: newRange},
                                    });
                                    const w =
                                        (state.duration /
                                            (state.displayRange[1] - state.displayRange[0])) *
                                        timelineScroll.current.getBoundingClientRect().width;
                                    console.log(slider.current.getBoundingClientRect());
                                    timelineScroll?.current?.scrollTo(
                                        (state.displayRange[0] / state.duration) * w,
                                        0
                                    );
                                }
                                if (v < state.displayRange[0]) {
                                    const newRange = state.displayRange;
                                    const RangeDuration =
                                        state.displayRange[1] - state.displayRange[0];
                                    newRange[0] = Math.max(v, 0);
                                    newRange[1] = newRange[0] + RangeDuration;
                                    dispatch({
                                        type: ActionTypes.CHANGEDISPLAYRANGE,
                                        payload: {value: newRange},
                                    });
                                    const w =
                                        (state.duration /
                                            (state.displayRange[1] - state.displayRange[0])) *
                                        timelineScroll.current.getBoundingClientRect().width;
                                    console.log(slider.current.getBoundingClientRect());
                                    timelineScroll?.current?.scrollTo(
                                        (state.displayRange[0] / state.duration) * w,
                                        0
                                    );
                                }
                                dispatch({
                                    type: ActionTypes.CHANGECURRENTTIME,
                                    payload: {value: v},
                                });
                            }}
                        >
                            <SliderTrack bg="red.100">
                                <Box position="relative" right={10}/>
                                <SliderFilledTrack bg="white"/>
                            </SliderTrack>
                            <SliderThumb boxSize={6}/>
                        </Slider>
                        {state.transformControl.object &&
                            keys?.map((key) => {
                                if (
                                    typeof state.equipments[state.transformControl.index]
                                        .parmeter[key].val === "number"
                                ) {
                                    if (key !== "currentTime") {
                                        return (
                                            <chakra.div
                                                position={"relative"}
                                                width={`${
                                                    (state.duration /
                                                        (state.displayRange[1] - state.displayRange[0])) *
                                                    100
                                                }%`}
                                                height={height / 15}
                                                borderWidth={0.5}
                                                borderColor={"black"}
                                            >
                                                {state.equipments[state.transformControl.index].keyframes[
                                                    key
                                                    ]?.map(({time, value}, idx) => (
                                                    <chakra.div
                                                        key={idx}
                                                        width={"100%"}
                                                        height={"100%"}
                                                        position={"absolute"}
                                                        top={0}
                                                    >
                                                        <Slider
                                                            width={"100%"}
                                                            height={"100%"}
                                                            min={0}
                                                            max={state.duration}
                                                            step={0.1}
                                                            value={time}
                                                            onChange={(v) => {
                                                                dispatch({
                                                                    type: ActionTypes.CHANGEKEYFRAMETIME,
                                                                    payload: {value: v, idx, par: key},
                                                                });
                                                            }}
                                                            onChangeEnd={() => {
                                                                dispatch({
                                                                    type: ActionTypes.CHANGEKEYFRAMEFINISH,
                                                                    payload: {par: key},
                                                                });
                                                            }}
                                                        >
                                                            <SliderTrack
                                                                bg="white"
                                                                position={"absolute"}
                                                                top={0}
                                                            >
                                                                <SliderFilledTrack bg="white"/>
                                                            </SliderTrack>
                                                            <SliderThumb boxSize={6}/>
                                                        </Slider>
                                                    </chakra.div>
                                                ))}
                                            </chakra.div>
                                        );
                                    }
                                } else {
                                    if (typeof state.equipments[state.transformControl.index]
                                        .parmeter[key].val === "object") {
                                        const ks = []
                                        for (const [k, v] of Object.entries(state.equipments[state.transformControl.index]
                                            .parmeter[key].val)) {
                                            // @ts-ignore
                                            ks[v.idx] = k;
                                        }
                                        return ks.map((k) => {
                                            return (
                                                <chakra.div
                                                    key={k}
                                                    position={"relative"}
                                                    width={`${
                                                        (state.duration /
                                                            (state.displayRange[1] -
                                                                state.displayRange[0])) *
                                                        100
                                                    }%`}
                                                    height={height / 15}
                                                    borderWidth={0.5}
                                                    borderColor={"black"}
                                                >
                                                    {state.equipments[
                                                        state.transformControl.index
                                                        ]?.keyframes[key][k]?.map(({time, value}, idx) => (
                                                        <chakra.div
                                                            key={idx}
                                                            width={"100%"}
                                                            height={"100%"}
                                                            position={"absolute"}
                                                            top={0}
                                                        >
                                                            <Slider
                                                                width={"100%"}
                                                                height={"100%"}
                                                                min={0}
                                                                max={state.duration}
                                                                step={0.1}
                                                                value={time}
                                                                onChange={(v) => {
                                                                    dispatch({
                                                                        type: ActionTypes.CHANGEOBJECTKEYFRAMETIME,
                                                                        payload: {value: v, idx, par: [key, k]},
                                                                    });
                                                                }}
                                                                onChangeEnd={() => {
                                                                    dispatch({
                                                                        type: ActionTypes.CHANGEOBJECTKEYFRAMEFINISH,
                                                                        payload: {par: [key, k]},
                                                                    });
                                                                }}
                                                            >
                                                                <SliderTrack
                                                                    bg="white"
                                                                    position={"absolute"}
                                                                    top={0}
                                                                >
                                                                    <SliderFilledTrack bg="white"/>
                                                                </SliderTrack>
                                                                <SliderThumb boxSize={6}/>
                                                            </Slider>
                                                        </chakra.div>
                                                    ))}
                                                </chakra.div>
                                            );

                                        });
                                    }
                                }
                            })}
                    </chakra.div>
                </chakra.div>
            </chakra.div>
        </Box>
    );
}
