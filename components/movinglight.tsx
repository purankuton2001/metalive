import React, {useContext, useEffect, useRef, useState} from "react";
import {useGLTF, useHelper} from "@react-three/drei";
import {EditorContext} from "../context/EditorContext";
import {ActionTypes} from "../types/utils";
import {Color, Object3D, SpotLightHelper,} from "three";
import {extend} from "@react-three/fiber";
import {gsap} from "gsap";
import * as THREE from "three";
import {volumetricMaterial} from "./VolumetricSpotlightMaterial";
import {ConvertRGBtoHex} from "../utils";
import {omitBy} from "lodash";

extend({Object3D});
export default function Movinglight(props) {
    const vertexShader = `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main(){
        // compute intensity
        vNormal		= normalize( normalMatrix * normal );

        vec4 worldPosition	= modelMatrix * vec4( position, 1.0 );
        vWorldPosition		= position.xyz;

        // set gl_Position
        gl_Position	= projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`;
    const fragmentShader = `
        varying vec3		vNormal;
        varying vec3		vWorldPosition;

        uniform vec3		lightColor;

        uniform vec3		spotPosition;

        uniform float		attenuation;
        uniform float		anglePower;
        uniform float       dimmer;

        void main(){
        float intensity;

        //////////////////////////////////////////////////////////
        // distance attenuation					//
        //////////////////////////////////////////////////////////
        intensity	= distance(vWorldPosition, spotPosition)/attenuation;
        intensity	= 1.0 - clamp(intensity, 0.0, 1.0);

        //////////////////////////////////////////////////////////
        // intensity on angle					//
        //////////////////////////////////////////////////////////
        vec3 normal	= vec3(vNormal.x, vNormal.y, abs(vNormal.z));
        float angleIntensity	= pow( dot(normal, vec3(0.0, 0.0, 1.0)), anglePower );
        intensity	= intensity * angleIntensity;
        // gl_FragColor	= vec4( vWorldPosition, intensity );

        //////////////////////////////////////////////////////////
        // final color						//
        //////////////////////////////////////////////////////////

        // set the final color
        gl_FragColor	= vec4( lightColor, dimmer * intensity);
        }`;
    const gsapTimer = useRef();
    const tl = useRef();
    const {index} = props;
    const group = useRef();
    const obj = useRef();
    const {state, dispatch} = useContext(EditorContext);
    const {parmeter} = state.equipments[index]
    const volumetricMaterial = {
        uniforms: {
            attenuation: {
                type: "f",
                value: 20.0
            },
            anglePower: {
                type: "f",
                value: 1.2
            },
            spotPosition: {
                type: "v3",
                value: new THREE.Vector3(0, 0, 0)
            },
            lightColor: {
                type: "c",
                value: new Color(
                    parmeter.color.r,
                    parmeter.color.g,
                    parmeter.color.b
                )
            },
            dimmer: {
                type: "f",
                value: parmeter.dimmer / 255,
            },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    };
    const {nodes} = useGLTF("asset/movinglight.glb");
    const spotlight = useRef();

    useHelper(spotlight, SpotLightHelper);
    useEffect(() => {
        tl.current?.clear();
        tl.current?.fromTo({currentTime: 0}, parmeter, {
            currentTime: state.duration,
            duration: state.duration
        });
        if (state.equipments[index]?.keyframes) {
            Object.keys(state.equipments[index].keyframes).forEach((key) => {
                if (state.equipments[index].keyframes[key].length >= 2) {
                    let preTime = 0;
                    state.equipments[index].keyframes[key].forEach((k, idx) => {
                        const gsappar = {};
                        if (idx === 0) {
                            gsappar[key] = k.value;
                            const from = {};
                            from[key] = k.value;
                            gsappar["duration"] = k.time - preTime;
                            tl.current.fromTo(
                                parmeter,
                                from,
                                gsappar,
                                preTime
                            );
                        } else {
                            gsappar[key] = k.value;
                            gsappar["duration"] = k.time - preTime;
                            tl.current.to(parmeter, gsappar, preTime);
                        }
                        console.log(gsappar);
                        preTime = k.time;
                    });
                }
                if (typeof state.equipments[index].keyframes[key] === "object") {
                    Object.keys(state.equipments[index].keyframes[key]).forEach((k) => {
                        if (state.equipments[index].keyframes[key][k].length >= 2) {
                            let preTime = 0;
                            state.equipments[index].keyframes[key][k].forEach(
                                (keyframe, idx) => {
                                    const gsappar = {};
                                    if (idx === 0) {
                                        gsappar[k] = keyframe.value;
                                        const from = {};
                                        from[k] = keyframe.value;
                                        gsappar["duration"] = keyframe.time - preTime;
                                        tl.current.fromTo(
                                            parmeter[key],
                                            from,
                                            gsappar,
                                            preTime
                                        );
                                    } else {
                                        gsappar["duration"] = keyframe.time - preTime;
                                        gsappar[k] = keyframe.value;
                                        tl.current.to(
                                            parmeter[key],
                                            gsappar,
                                            preTime
                                        );
                                    }
                                    preTime = keyframe.time;
                                }
                            );
                        }
                    });
                }
            });
        }
    }, [state.equipments[index]?.keyframes.changed]);
    useEffect(() => {
        tl.current?.clear();
        tl.current?.fromTo({currentTime: 0}, parmeter, {
            currentTime: state.duration,
            duration: state.duration
        });
        if (state.equipments[index]?.keyframes) {
            Object.keys(state.equipments[index].keyframes).forEach((key) => {
                if (state.equipments[index].keyframes[key].length >= 2) {
                    let preTime = 0;
                    state.equipments[index].keyframes[key].forEach((k, idx) => {
                        const gsappar = {};
                        if (idx === 0) {
                            gsappar[key] = k.value;
                            const from = {};
                            from[key] = k.value;
                            gsappar["duration"] = k.time - preTime;
                            tl.current.fromTo(
                                parmeter,
                                from,
                                gsappar,
                                preTime
                            );
                        } else {
                            gsappar[key] = k.value;
                            gsappar["duration"] = k.time - preTime;
                            tl.current.to(parmeter, gsappar, preTime);
                            if (idx === state.equipments[index].keyframes[key].length - 1) {
                                const lastFrom = {};
                                const lastTo = {};
                                lastFrom[key] = k.value;
                                lastTo[key] = k.value;
                                lastTo["duration"] = state.duration - k.time;
                                tl.current.fromTo(
                                    parmeter,
                                    lastFrom,
                                    lastTo,
                                    k.time
                                );
                            }
                        }
                        console.log(gsappar);
                        preTime = k.time;
                    });
                }
                if (typeof state.equipments[index].keyframes[key] === "object") {
                    Object.keys(state.equipments[index].keyframes[key]).forEach((k) => {
                        if (state.equipments[index].keyframes[key][k].length >= 2) {
                            let preTime = 0;
                            state.equipments[index].keyframes[key][k].forEach(
                                (keyframe, idx) => {
                                    const gsappar = {};
                                    if (idx === 0) {
                                        gsappar[k] = keyframe.value;
                                        const firstfrom = {};
                                        firstfrom[k] = keyframe.value;
                                        gsappar["duration"] = keyframe.time - preTime;
                                        tl.current.fromTo(
                                            parmeter[key],
                                            firstfrom,
                                            gsappar,
                                            preTime
                                        );
                                    } else {
                                        gsappar["duration"] = keyframe.time - preTime;
                                        gsappar[k] = keyframe.value;
                                        tl.current.to(
                                            parmeter[key],
                                            gsappar,
                                            preTime
                                        );
                                    }
                                    preTime = keyframe.time;
                                }
                            );
                        }
                    });
                }
            });
        }
    }, [state.equipments[index]?.keyframes.amount]);
    useEffect(() => {
        if (state.playing) {
            gsapTimer.current = setInterval(() => {
                const time = tl.current.time();
                if (time !== 0) {
                    dispatch({
                        type: ActionTypes.CHANGECURRENTTIME,
                        payload: {value: time},
                    });
                }
            }, 10);
            tl.current?.play();
        } else {
            clearInterval(gsapTimer.current);
            tl.current?.pause();
        }
    }, [state.playing]);

    useEffect(() => {
        tl.current = gsap.timeline();
        tl.current?.pause();
        tl.current?.fromTo({currentTime: 0}, parmeter, {
            currentTime: state.duration,
            duration: state.duration
        });
    }, []);
    useEffect(() => {
        if (spotlight.current) {
            spotlight.current.target = obj.current;
        }
    }, [spotlight]);
    useEffect(() => {
        if (!state.playing) {
            tl.current?.seek(state.currentTime);
            dispatch({type: ActionTypes.RERENDERING});
        }
    }, [state.currentTime]);
    let preOut = {};
    useEffect(() => {
        const out = {
            1: parmeter.pan * 255 / 540,
            2: parmeter.tilt * 270 / 255,
            3: parmeter.color.r * 255,
            4: parmeter.color.g * 255,
            5: parmeter.color.b * 255,
            7: parmeter.dimmer,
            8: parmeter.strobe !== 0 ? 0 : 10 + parmeter.strobe * 245 / 20,
            9: (1 - (parmeter.zoom / 90)) * 255,
        };
        const diff = omitBy(out, (v, k) => preOut[k] === v)
        // universe?.update(diff);
        preOut = out;
    }, [parmeter])
    if (state.equipments[index]) {
        return (
            <group
                rotation={props.rotation}
                position={props.position}
                ref={group}
                scale={[5, 5, 5]}
                dispose={null}
                onClick={() => {
                    console.log("click");
                    dispatch({
                        type: ActionTypes.CHANGETRANSFORMOBJECT,
                        payload: {object: group, index},
                    });
                }}
            >
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.StageLigt_11_7.geometry}
                    // material={nodes.StageLigt_11_7.material}
                    position={[2.13, 0.06, 0]}
                    rotation={[1.59, 0.01, -0.01]}
                    scale={0.36}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.StageLigt_11_3.geometry}
                        rotation={[
                            0,
                            0,
                            state.equipments[index]?.parmeter.pan
                                ? (state.equipments[index]?.parmeter.pan * Math.PI * 2) / 360
                                : 0,
                        ]}
                    >
                        <mesh
                            castShadow
                            receiveShadow
                            geometry={nodes.StageLigt_11_2.geometry}
                            position={[-0.11, -1.31, -9.63]}
                            rotation={[
                                state.equipments[index]?.parmeter.tilt
                                    ? (state.equipments[index]?.parmeter.tilt * Math.PI * 2) / 360
                                    : 0,
                                0,
                                0,
                            ]}
                        >
                            <spotLight
                                color={
                                    new Color(
                                        parmeter.color.r,
                                        parmeter.color.g,
                                        parmeter.color.b
                                    )
                                }
                                rotation={[Math.PI, Math.PI, Math.PI]}
                                position={[0, 4.5, 0]}
                                intensity={parmeter.dimmer}
                                scale={[1, 1, 1]}
                                ref={spotlight}
                                angle={
                                    state.equipments[index]
                                        ? ((parmeter.zoom / 90) *
                                            Math.PI) /
                                        2
                                        : Math.PI / 3
                                }
                                penumbra={1}
                                castShadow
                                distance={100}
                            >
                                <object3D position={[0, 50, 5]} ref={obj}/>
                            </spotLight>
                            <mesh rotation={[0, 0, Math.PI]} position={[0, 15, 0]}>
                                <coneGeometry args={[parmeter.zoom, 40, 64, 30, true, 40]}
                                              attach="geometry"/>
                                <shaderMaterial
                                    attach="material"
                                    args={[volumetricMaterial]}
                                    uniforms-lightColor-value={
                                        ConvertRGBtoHex(
                                            parmeter.color.r,
                                            parmeter.color.g,
                                            parmeter.color.b)}/>
                            </mesh>
                            <mesh
                                castShadow
                                receiveShadow
                                geometry={nodes.StageLigt_11_1.geometry}
                                material={nodes.StageLigt_11_1.material}
                                position={[0.01, 1.12, 9.63]}
                            >
                                <meshStandardMaterial
                                    emissiveIntensity={
                                        parmeter.dimmer / 255
                                    }
                                    emissive={
                                        new Color(
                                            parmeter.color.r,
                                            parmeter.color.g,
                                            parmeter.color.b
                                        )
                                    }
                                    color={
                                        new Color(
                                            parmeter.color.r,
                                            parmeter.color.g,
                                            parmeter.color.b
                                        )
                                    }
                                />
                            </mesh>
                        </mesh>
                    </mesh>
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.StageLigt_11_4.geometry}
                        // material={nodes.StageLigt_11_4.material}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.StageLigt_11_5.geometry}
                        // material={nodes.StageLigt_11_5.material}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.StageLigt_11_6.geometry}
                        // material={nodes.StageLigt_11_6.material}
                    />
                </mesh>
            </group>
        );
    } else {
        return null;
    }
}
