import React, {useEffect, useRef} from "react";
import {useThree, useFrame, extend} from "@react-three/fiber";
import * as THREE from "three";
import {animated as a} from "@react-spring/three";

// from https://github.com/jeromeetienne/threex.volumetricspotlight
import VolumetricSpotlight from "./volumetric-spotlight";


extend({
    VolumetricSpotlight
});

export default function MyVolSpotlight(props) {
    const ref = useRef();
    const vs = useRef();
    const obj = useRef();
    const spotlight = useRef();

    const {scene} = useThree();

    const {
        angle = 0.3,
        penumbra = 0.1,
        distance = 60,
    } = props;

    // INIT
    useEffect(() => {
        scene.add(spotlight.current.target);

        const geometry = vs.current.geometry;

        geometry.applyMatrix4(
            new THREE.Matrix4().makeTranslation(0, -geometry.parameters.height / 2, 0)
        );
        geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

        vs.current.material.uniforms.spotPosition.value = vs.current.position;

        spotlight.current.position.copy(vs.current.position);
    }, [scene]);
    useEffect(() => {
        if (spotlight.current) {
            spotlight.current.target = obj.current;
        }
    }, [spotlight]);


    useFrame(({clock}) => {
        spotlight.current.position.copy(vs.current.position);
        // @todo fix this
        vs.current.material.uniforms.lightColor.value = spotlight.current.color;

    });

    const setRef = React.useCallback(function setRef(el) {
        vs.current = el;
        if (ref) {
            ref.current = el;
        }
    }, []);

    useFrame(() => {
        const angle = spotlight.current.angle;
        vs.current.scale.set(6 * angle, 6 * angle, 1);
    });

    return (
        <>
            <spotLight
                castShadow
                ref={spotlight}
                intensity={500}
                angle={angle}
                penumbra={penumbra}
                distance={distance}
                color={"black"}
            >
                <object3D position={[0, 50, 5]} ref={obj}/>
            </spotLight>

            <mesh ref={setRef} position={[0, 0, 0]}>
                <coneGeometry args={[10, 40, 64, 30, 40, true]} attach="geometry"/>
                <volumetricSpotlight
                    attach="material"
                    uniforms-lightColor-value={"black"}
                    uniforms-attenuation-value={24}
                    uniforms-anglePower-value={8}
                />
            </mesh>
        </>
    );
}
