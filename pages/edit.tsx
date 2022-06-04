import {Canvas} from "@react-three/fiber";
import React, {
    memo,
    useCallback,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react";
import Venue from "../components/venue";
import {OrbitControls, Stage, TransformControls} from "@react-three/drei";
import axios from "axios";
import {GetStaticProps} from "next";
import DmxSetting from "../components/DmxSetting";
import {
    IconButton,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
} from "@chakra-ui/react";
import {
    Box,
    Button,
    Text,
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel,
    RangeSlider,
    Grid,
    GridItem,
    chakra,
} from "@chakra-ui/react";
import {useWindowSize} from "../hooks/useWindowSize";
import Movinglight from "../components/movinglight";
import {
    ActionTypes,
    EditorState,
    Equipment,
    EquipmentTypes,
} from "../types/utils";
import {editorReducer} from "../context/editorReducer";
import {EditorContext} from "../context/EditorContext";
import {Resizable} from "re-resizable";
import {CloseIcon} from "@chakra-ui/icons";
import {ParmeterPanel} from "../components/ParmeterPanel";
import * as THREE from "three";

const initialEditorState: EditorState = {
    equipments: [
        {
            position: [-55, 5, 95],
            parmeter: {
                currentTime: 0,
                pan: 0,
                tilt: 0,
                zoom: 0,
                dimmer: 0,
                strobe: 0,
                color: {r: 0, g: 0, b: 0},
            },
            max: {
                pan: 540,
                tilt: 270,
                zoom: 90,
                dimmer: 255,
                strobe: 20,
                color: {r: 1, g: 1, b: 1},
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
        },
        {
            position: [90, 5, 95],
            max: {
                pan: 540,
                tilt: 270,
                zoom: 90,
                dimmer: 255,
                strobe: 20,
                color: {r: 1, g: 1, b: 1},
            },
            parmeter: {
                currentTime: 0,
                pan: 0,
                tilt: 0,
                zoom: 0,
                dimmer: 0,
                strobe: 0,
                color: {r: 0, g: 0, b: 0},
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
        },
    ],
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
};

function Edit({url}) {
    console.log(url);
    const stateToComponents = (equipment: Equipment, index) => {
        switch (equipment.eId) {
            case 0:
                return <Movinglight {...equipment} index={index}/>;
        }
    };

    const {width, height} = useWindowSize();
    const [state, dispatch] = useReducer(editorReducer, initialEditorState);
    const [isVisible, setIsVisible] = useState(false);

    return (
        <Box w={width} h={height} maxHeight={isVisible ? (4 * height) / 5 : height}>
            <EditorContext.Provider value={{state, dispatch}}>
                <Canvas
                    gl={{alpha: false}}
                    camera={{position: [0, 0, 0], fov: 30}}
                >
                    <Stage>
                        <EditorContext.Provider value={{state, dispatch}}>
                            <Venue
                                url={"https://firebasestorage.googleapis.com/v0/b/metalive-348103.appspot.com/o/Venue.glb?alt=media&token=a9e2cedb-8050-43b6-bdec-6f77d9ccdb6f"}/>
                            {state.equipments?.map(stateToComponents)}
                        </EditorContext.Provider>
                    </Stage>
                    <OrbitControls attach="orbitControls" makeDefault/>
                    {/*{state.transformControl.object && (*/}
                    {/*  <TransformControls*/}
                    {/*    mode={state.transformControl?.mode}*/}
                    {/*    object={state.transformControl.object}*/}
                    {/*  />*/}
                    {/*)}*/}
                </Canvas>
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
                        test
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
                            <Tabs>
                                <TabList>
                                    <Tab>機材一覧</Tab>
                                    <Tab>エフェクト</Tab>
                                    <Tab>DMX</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <Button
                                            onClick={() => {
                                                console.log("click");
                                                dispatch({
                                                    type: ActionTypes.ADDEQUIPMENT,
                                                    payload: {equipment: EquipmentTypes.MovingLight},
                                                });
                                            }}
                                        >
                                            ムービングライト{state.equipments.length}
                                        </Button>
                                    </TabPanel>
                                    <TabPanel>
                                        <ParmeterPanel/>
                                    </TabPanel>
                                    <TabPanel>
                                        <DmxSetting/>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
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
            </EditorContext.Provider>
        </Box>
    );
}

export default Edit;

export const getStaticProps: GetStaticProps = async () => {
    const data = {fileName: "Venue.glb"};
    const res = await axios.post(
        "https://us-central1-metalive-348103.cloudfunctions.net/liveFetch",
        data
    );
    const url: string = res.data;

    if (!url) {
        return {
            notFound: true,
        };
    }

    return {
        props: {url},
    };
};
