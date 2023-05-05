import React, {useContext, useEffect, useRef} from "react";
import {useGLTF} from "@react-three/drei";
import * as THREE from "three";
import {Color, Object3D,} from "three";
import {extend} from "@react-three/fiber";
import {ConvertRGBtoHex} from "../utils";
import {DirectionPlayerContext} from "./DirectionPlayer";
import {gsap} from "gsap";
import {DirectionPlayerActionTypes} from "../types/utils";
// @ts-ignore
import Timeline = gsap.core.Timeline;

extend({Object3D});
export default function MovinglightPlayer(props) {
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
    const {index, equipment} = props;
    const group = useRef();
    const {state, dispatch} = useContext(DirectionPlayerContext);
    const {parmeter} = state.equipments[index];

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
                value: parmeter.dimmer.val / 255,
            },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    };
    const obj = useRef();
    const gsapTimer = useRef<any>();
    const tl = useRef<Timeline>();
    useEffect(() => {
        tl.current = gsap.timeline();
        tl.current?.pause();
        console.log(state.duration)
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
                            tl.current.fromTo(
                                parmeter[key],
                                from,
                                gsappar,
                                preTime
                            );
                            console.log(from);
                            console.log(gsappar)
                        } else {
                            const gsappar = {...parmeter[key], val: k.value};
                            gsappar["duration"] = k.time - preTime;
                            tl.current.to(parmeter[key], gsappar, preTime);
                            console.log(gsappar);
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
                                        tl.current.fromTo(
                                            parmeter[key].val[k],
                                            from,
                                            gsappar,
                                            preTime
                                        );
                                    } else {
                                        const gsappar = {...parmeter[key].val[k], val: keyframe.value};
                                        gsappar["duration"] = keyframe.time - preTime;
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
    }, [state.equipments[index], state.duration]);
    useEffect(() => {
        if (state.playing) {
            gsapTimer.current = setInterval(() => {
                const time = tl.current.time();
                console.log(time)
                if (time !== 0) {
                    dispatch({
                        type: DirectionPlayerActionTypes.CHANGECURRENTTIME,
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
        if (!state.playing) {
            tl.current?.seek(state.currentTime);
            dispatch({type: DirectionPlayerActionTypes.RERENDERING});
        }
    }, [state.currentTime]);


    // @ts-ignore
    const {nodes} = useGLTF("../asset/movinglight.glb");
    const spotlight = useRef();
    useEffect(() => {
        if (spotlight.current) {
            // @ts-ignore
            spotlight.current.target = obj.current;
        }
    }, [spotlight]);
    // useHelper(spotlight, SpotLightHelper);
    if (equipment) {
        return (
            <group
                rotation={equipment.rotation}
                position={equipment.position}
                ref={group}
                scale={[5, 5, 5]}
                dispose={null}
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
                            parmeter.pan
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
                                parmeter.tilt
                                    ? (parmeter.tilt.val * Math.PI * 2) / 360
                                    : 0,
                                0,
                                0,
                            ]}
                        >
                            <spotLight
                                color={
                                    new Color(
                                        parmeter?.color.val.r.val,
                                        parmeter?.color.val.g.val,
                                        parmeter?.color.val.b.val
                                    )
                                }
                                rotation={[Math.PI, Math.PI, Math.PI]}
                                position={[0, 4.5, 0]}
                                intensity={parmeter.dimmer.val}
                                scale={[1, 1, 1]}
                                ref={spotlight}
                                angle={
                                    equipment
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
                                        parmeter.dimmer.val / 255
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
