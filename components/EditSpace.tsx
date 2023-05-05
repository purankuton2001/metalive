import {Canvas} from "@react-three/fiber";
import {OrbitControls, Stage} from "@react-three/drei";
import {EditorContext} from "../context/EditorContext";
import Venue from "./venue";
import React, {useEffect, useReducer, useState} from "react";
import {Equipment} from "../types/utils";
import Movinglight from "./movinglight";
import {editorReducer} from "../context/editorReducer";
import * as THREE from "three";

export default function EditSpace({state, dispatch}) {
    const stateToComponents = (equipment: Equipment, index) => {
        switch (equipment.eId) {
            case 0:
                return <Movinglight {...equipment} index={index}/>;
        }
    };
    const url = '/asset/vjloop.mp4';
    const [video] = useState(() => {
        if (typeof document !== 'undefined') {
            const vid = document.createElement("video");
            vid.src = url;
            vid.crossOrigin = "Anonymous";
            vid.loop = true;
            vid.play();
            return vid;
        }
    });

    useEffect(() => {
        if (state.playing) {
            video.play();
        } else {
            video.pause();
        }
    }, [state.playing])

    return (
        <Canvas
            gl={{alpha: false}}
            camera={{fov: 60, position: [20, 80, 300], rotation: [0, 1, 0]}}
        >
            <ambientLight intensity={0.5}/>
            <EditorContext.Provider value={{state, dispatch}}>
                {/*<mesh position={[30, 60, 55]} rotation={[0, Math.PI / 2, 0]} scale={[.1, 45, 80]}>*/}
                {/*    <boxGeometry args={[3.2, 1.9]}/>*/}
                {/*    <meshStandardMaterial emissive={"white"} side={THREE.DoubleSide}>*/}
                {/*        <videoTexture attach="map" args={[video]}/>*/}
                {/*        <videoTexture attach="emissiveMap" args={[video]}/>*/}
                {/*    </meshStandardMaterial>*/}
                {/*</mesh>*/}
                <Venue
                    url={state.url}/>
                {state.equipments?.map(stateToComponents)}
            </EditorContext.Provider>
            <OrbitControls attach="orbitControls"/>
        </Canvas>
    )
}
