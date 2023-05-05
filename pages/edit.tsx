import React, {
    useCallback, useEffect, useLayoutEffect,
    useReducer, useRef,
    useState,
} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {GetStaticProps} from "next";
import DmxSetting from "../components/DmxSetting";

import {
    Box,
    Button,
    Text,
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel, Modal, ModalOverlay, ModalBody, ModalHeader, ModalContent, ModalFooter, ModalCloseButton, useDisclosure,
} from "@chakra-ui/react";
import {useWindowSize} from "../hooks/useWindowSize";
import {
    ActionTypes, Color,
    EditorState,
    Equipment,
    EquipmentTypes,
} from "../types/utils";
import {editorReducer} from "../context/editorReducer";
import {EditorContext} from "../context/EditorContext";
import {Resizable} from "re-resizable";
import {CloseIcon} from "@chakra-ui/icons";
import {ParmeterPanel} from "../components/ParmeterPanel";
import useFirebase from "../hooks/useFirebase";
import {getAuth} from "@firebase/auth";
import {Direction} from "../types/lives";
import EditSpace from "../components/EditSpace";
import DirectionPost from "../components/DirectionPost";
import {Howl} from 'howler';


const initialEditorState: EditorState = {
    equipments: [{
        eId: 0,
        parmeter: {
            pan: {val: 0, idx: 0},
            tilt: {val: 0, idx: 1},
            color: {val: {r: {val: 0, idx: 0}, g: {val: 0, idx: 1}, b: {val: 0, idx: 2}}, idx: 2},
            dimmer: {val: 0, idx: 3},
            strobe: {val: 0, idx: 4},
            zoom: {val: 0, idx: 5},
            currentTime: {val: 0, idx: 6},
        },
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
        max: {
            pan: 540,
            tilt: 270,
            zoom: 90,
            dimmer: 255,
            strobe: 20,
            color: {r: 1, g: 1, b: 1},
        },
        position: [-55, 5, 95],
    }, {
        eId: 0,
        parmeter: {
            pan: {val: 0, idx: 0},
            tilt: {val: 0, idx: 1},
            color: {val: {r: {val: 0, idx: 0}, g: {val: 0, idx: 1}, b: {val: 0, idx: 2}}, idx: 2},
            dimmer: {val: 0, idx: 3},
            strobe: {val: 0, idx: 4},
            zoom: {val: 0, idx: 5},
            currentTime: {val: 0, idx: 6},
        },
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
        max: {
            pan: 540,
            tilt: 270,
            zoom: 90,
            dimmer: 255,
            strobe: 20,
            color: {r: 1, g: 1, b: 1},
        },
        position: [90, 5, 95],
    }],
    url: 'https://firebasestorage.googleapis.com/v0/b/metalive-348103.appspot.com/o/Venue.glb?alt=media&token=a9e2cedb-8050-43b6-bdec-6f77d9ccdb6f',
    dmxConnect: null,
    duration: 10,
    currentTime: 0,
    playing: false,
    displayRange: [0, 10],
    transformControl: {
        mode: "rotate",
        object: null,
        index: null,
    },
    liveId: '',
};

function Edit({data}) {
    useEffect(() => {
        if (data) {
            dispatch({type: ActionTypes.LIVEDATAFETCH, payload: {data}})
        }
    }, [data])
    const {width, height} = useWindowSize();
    const [state, dispatch] = useReducer(editorReducer, initialEditorState);
    const [isVisible, setIsVisible] = useState(false);
    let loading = false;
    const {app, user} = useFirebase();
    const {isOpen, onOpen, onClose} = useDisclosure()
    const audio = useRef(new Howl({
        src: '/asset/e-ma_Mastered2.wav',
        html5: true,
    }));
    useLayoutEffect(() => {
        audio.current.on('load', () => {
            console.log(audio.current.duration())
            dispatch({type: ActionTypes.SETDURATION, payload: {duration: audio.current.duration()}})
        })
        audio.current.load();
    }, []);
    useLayoutEffect(() => {
        if (state.playing) {
            audio.current.seek(state.currentTime);
            audio.current.play();
        } else {
            audio.current.pause();
        }
    }, [state.playing])
    useEffect(() => {
        setIsVisible(true)
    }, [state.transformControl.index])

    return (
        <Box w={width} h={height} maxHeight={isVisible ? (4 * height) / 5 : height} pos={"absolute"} top={0}
             zIndex={20}>
            <EditorContext.Provider value={{state, dispatch}}>
                <EditSpace state={state} dispatch={dispatch}/>
                {!isVisible && (
                    <Button
                        onClick={() => {
                            setIsVisible(true);
                        }}
                        pos={"absolute"}
                        isActive={!isVisible}
                        bottom={10}
                        right={10}
                    >
                        menu
                    </Button>
                )}
                {!isVisible && (
                    <Button
                        onClick={async () => {
                            onOpen();
                        }}
                        pos={"absolute"}
                        isActive={!isVisible}
                        bottom={10}
                        right={150}
                    >
                        POST
                    </Button>
                )}
                {isVisible && (
                    <Resizable
                        defaultSize={{width: width, height: height / 5}}
                        enable={{top: true, left: false, right: false, bottom: false}}
                        style={{
                            position: "absolute",
                            bottom: -height / 5 + 4,
                            overflow: "hidden",
                        }}
                        minHeight={height / 5}
                    >
                        <Box py={4} bg={"white"} width={width} height={"100%"} px={8}>
                            <ParmeterPanel/>

                            {/*<Tabs>*/}
                            {/*    <TabList>*/}
                            {/*        <Tab>機材一覧</Tab>*/}
                            {/*        <Tab>エフェクト</Tab>*/}
                            {/*        <Tab>DMX</Tab>*/}
                            {/*    </TabList>*/}
                            {/*    <TabPanels>*/}
                            {/*        <TabPanel>*/}
                            {/*            <Button*/}
                            {/*                onClick={() => {*/}
                            {/*                    console.log("click");*/}
                            {/*                    dispatch({*/}
                            {/*                        type: ActionTypes.ADDEQUIPMENT,*/}
                            {/*                        payload: {equipment: EquipmentTypes.MovingLight},*/}
                            {/*                    });*/}
                            {/*                }}*/}
                            {/*            >*/}
                            {/*                ムービングライト{state.equipments.length}*/}
                            {/*            </Button>*/}
                            {/*        </TabPanel>*/}
                            {/*        <TabPanel>*/}
                            {/*        </TabPanel>*/}
                            {/*        <TabPanel>*/}
                            {/*            <DmxSetting/>*/}
                            {/*        </TabPanel>*/}
                            {/*    </TabPanels>*/}
                            {/*</Tabs>*/}
                        </Box>
                        <CloseIcon
                            cursor={"pointer"}
                            w={6}
                            h={6}
                            position={"absolute"}
                            right={4}
                            top={4}
                            onClick={() => {
                                setIsVisible(false);
                            }}
                        />
                    </Resizable>
                )}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader>POST</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <DirectionPost/>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </EditorContext.Provider>
        </Box>
    );
}

export default Edit;

export const getStaticProps: GetStaticProps = async () => {
    const res = await axios.get(
        `https://us-central1-metalive-348103.cloudfunctions.net/liveFetch`, {
            params: {id: "xSfcYiI8qpEqMI6ADGuy"}
        });
    const data = res.data;
    data.liveId = "xSfcYiI8qpEqMI6ADGuy";

    if (!data) {
        return {
            notFound: true,
        };
    }

    return {
        props: {data},
    };
};
