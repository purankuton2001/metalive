import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from "react";
import {useGLTF, useHelper} from "@react-three/drei";
import {EditorContext} from "../context/EditorContext";
import {ActionTypes} from "../types/utils";
import {Color, Material, MeshStandardMaterial, Object3D, SpotLightHelper,} from "three";
import {extend} from "@react-three/fiber";
import {gsap} from "gsap";
import * as THREE from "three";
import {volumetricMaterial} from "./VolumetricSpotlightMaterial";
import {ConvertRGBtoHex} from "../utils";
import {omitBy} from "lodash";

extend({Object3D});
export default function Movinglight(props) {

    function decimalPart(num) {
        var decPart = num - ((num >= 0) ? Math.floor(num) : Math.ceil(num));
        return decPart;
    }

    const {index, mode} = props;
    const {state, dispatch} = useContext(EditorContext);
    const {parmeter} = state.equipments[index];
    console.log(state.currentTime);
    console.log(Math.sin(2 * Math.PI * parmeter.strobe.val * decimalPart(state.currentTime)))


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
                    parmeter.color.val.r.val,
                    parmeter.color.val.g.val,
                    parmeter.color.val.b.val
                )
            },
            dimmer: {
                type: "f",
                value: parmeter.strobe.val === 0 ? (parmeter.dimmer.val / 255) : (parmeter.dimmer.val / 255) * 0.5 + 0.5 * Math.sin(2 * Math.PI * parmeter.strobe.val * decimalPart(state.currentTime)),
            },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    };

    const gsapTimer = useRef();
    const tl = useRef();
    useEffect(() => {
    }, [mode])
    const group = useRef();

    console.log(state.equipments[index])
    // @ts-ignore
    const {nodes} = useGLTF("asset/movinglight.glb");
    const obj = useRef();
    const spotlight = useRef<THREE.SpotLight>();
    useEffect(() => {
        if (spotlight.current) {
            spotlight.current.target = obj.current;
        }
    }, [spotlight]);
    useLayoutEffect(() => {
        // @ts-ignore
        tl.current?.clear();
        // @ts-ignore
        tl.current?.fromTo({...parmeter.currentTime, val: 0}, parmeter.currentTime, {
            ...parmeter.currentTime,
            val: state.duration,
            duration: state.duration
        });
        if (state.equipments[index]?.keyframes) {
            Object.keys(state.equipments[index].keyframes).forEach((key) => {
                if (state.equipments[index].keyframes[key].length >= 2) {
                    let preTime = 0;
                    state.equipments[index].keyframes[key].forEach((k, idx) => {
                        if (idx === 0) {
                            const from = {...parmeter[key], val: k.value};
                            const gsappar = {...parmeter[key], val: k.value};
                            gsappar["duration"] = k.time - preTime;
                            // @ts-ignore
                            tl.current.fromTo(
                                parmeter[key],
                                from,
                                gsappar,
                                preTime
                            );
                        } else {
                            const gsappar = {...parmeter[key], val: k.value};
                            gsappar["duration"] = k.time - preTime;
                            // @ts-ignore
                            tl.current.to(parmeter[key], gsappar, preTime);
                        }
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
                                        const gsappar = {...parmeter[key].val[k], val: keyframe.value};
                                        const from = {...parmeter[key].val[k], val: keyframe.value};
                                        gsappar["duration"] = keyframe.time - preTime;
                                        // @ts-ignore
                                        tl.current.fromTo(
                                            parmeter[key].val[k],
                                            from,
                                            gsappar,
                                            preTime
                                        );
                                    } else {
                                        const gsappar = {...parmeter[key].val[k], val: keyframe.value};
                                        gsappar["duration"] = keyframe.time - preTime;
                                        // @ts-ignore
                                        tl.current.to(
                                            parmeter[key].val[k],
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
        // @ts-ignore
        tl.current?.seek(state.currentTime);
        dispatch({type: ActionTypes.RERENDERING});

    }, [state.equipments[index]?.keyframes.changed]);
    useLayoutEffect(() => {
        // @ts-ignore
        tl.current?.clear();
        // @ts-ignore
        tl.current?.fromTo({...parmeter.currentTime, val: 0}, parmeter.currentTime, {
            ...parmeter.currentTime,
            val: state.duration,
            duration: state.duration
        });
        if (state.equipments[index]?.keyframes) {
            Object.keys(state.equipments[index].keyframes).forEach((key) => {
                if (state.equipments[index].keyframes[key].length >= 2) {
                    let preTime = 0;
                    state.equipments[index].keyframes[key].forEach((k, idx) => {
                        if (idx === 0) {
                            const gsappar = {...parmeter[key], val: k.value};
                            const from = {...parmeter[key], val: k.value};
                            const duration = k.time - preTime
                            if (duration !== 0) {
                                gsappar["duration"] = duration;
                                // @ts-ignore
                                tl.current.fromTo(
                                    parmeter[key],
                                    from,
                                    gsappar,
                                    preTime
                                );
                            }
                        } else {
                            const gsappar = {...parmeter[key], val: k.value};
                            gsappar["duration"] = k.time - preTime;
                            // @ts-ignore
                            tl.current.to(parmeter[key], gsappar, preTime);
                        }
                        preTime = k.time;
                    });
                }
                if (typeof state.equipments[index].keyframes[key] === "object") {
                    Object.keys(state.equipments[index].keyframes[key]).forEach((k) => {
                        if (state.equipments[index].keyframes[key][k].length >= 2) {
                            let preTime = 0;
                            state.equipments[index].keyframes[key][k].forEach(
                                (keyframe, idx) => {
                                    if (idx === 0) {
                                        const gsappar = {...parmeter[key].val[k], val: keyframe.value}
                                        const from = {...parmeter[key].val[k], val: keyframe.value};
                                        gsappar["duration"] = keyframe.time - preTime;
                                        // @ts-ignore
                                        tl.current.fromTo(
                                            parmeter[key].val[k],
                                            from,
                                            gsappar,
                                            preTime
                                        );
                                    } else {
                                        const gsappar = {...parmeter[key].val[k], val: keyframe.value};
                                        gsappar["duration"] = keyframe.time - preTime;
                                        // @ts-ignore
                                        tl.current.to(
                                            parmeter[key].val[k],
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
        // @ts-ignore
        tl.current?.seek(state.currentTime);
        dispatch({type: ActionTypes.RERENDERING});
    }, [state.equipments[index]?.keyframes.amount]);
    useEffect(() => {
        if (state.playing) {
            console.log('play');
            // @ts-ignore
            gsapTimer.current = setInterval(() => {
                // @ts-ignore
                const time = tl.current.time();
                if (time !== 0) {
                    dispatch({
                        type: ActionTypes.CHANGECURRENTTIME,
                        payload: {value: time},
                    });
                }
            }, 10);
            // @ts-ignore
            tl.current?.play();
        } else {
            clearInterval(gsapTimer.current);
            // @ts-ignore
            tl.current?.pause();
        }
    }, [state.playing]);

    useEffect(() => {
        // @ts-ignore
        tl.current = gsap.timeline();
        // @ts-ignore
        tl.current?.pause();
        // @ts-ignore
        tl.current?.fromTo({...parmeter.currentTime, val: 0}, parmeter.currentTime, {
            ...parmeter.currentTime,
            val: state.duration,
            duration: state.duration
        });
    }, []);
    useEffect(() => {
        if (!state.playing) {
            // @ts-ignore
            tl.current?.seek(state.currentTime);
            dispatch({type: ActionTypes.RERENDERING});
        }
    }, [state.currentTime]);
    let preOut = {};
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
                    receiveShadow
                    geometry={nodes.StageLigt_11_7.geometry}
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
                            parmeter.pan.val
                                ? (parmeter.pan.val * Math.PI * 2) / 360
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
                                    ? (state.equipments[index]?.parmeter.tilt.val * Math.PI * 2) / 360
                                    : 0,
                                0,
                                0,
                            ]}
                        >
                            <spotLight
                                color={
                                    new Color(
                                        parmeter.color.val.r.val,
                                        parmeter.color.val.g.val,
                                        parmeter.color.val.b.val
                                    )
                                }
                                rotation={[Math.PI, Math.PI, Math.PI]}
                                position={[0, 4.5, 0]}
                                intensity={parmeter.strobe.val === 0 ? (parmeter.dimmer.val / 255) : (parmeter.dimmer.val / 255) * 0.5 + 0.5 * Math.sin(2 * Math.PI * parmeter.strobe.val * decimalPart(state.currentTime))}
                                scale={[1, 1, 1]}
                                ref={spotlight}
                                angle={
                                    state.equipments[index]
                                        ? ((parmeter.zoom.val / 90) *
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
                                <coneGeometry args={[parmeter.zoom.val, 40, 64, 30, true, 40]}
                                              attach="geometry"/>
                                <shaderMaterial
                                    attach="material"
                                    args={[volumetricMaterial]}
                                    uniforms-lightColor-value={
                                        ConvertRGBtoHex(
                                            parmeter.color.val.r.val,
                                            parmeter.color.val.g.val,
                                            parmeter.color.val.b.val)}/>
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
                                        parmeter.strobe.val === 0 ? (parmeter.dimmer.val / 255) : (parmeter.dimmer.val / 255) * 0.5 + 0.5 * Math.sin(2 * Math.PI * parmeter.strobe.val * decimalPart(state.currentTime))
                                    }
                                    emissive={
                                        new Color(
                                            parmeter.color.val.r.val,
                                            parmeter.color.val.g.val,
                                            parmeter.color.val.b.val
                                        )
                                    }
                                    color={
                                        new Color(
                                            parmeter.color.val.r.val,
                                            parmeter.color.val.g.val,
                                            parmeter.color.val.b.val
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
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.StageLigt_11_6.geometry}
                    />
                </mesh>
            </group>
        );
    } else {
        return null;
    }
}
