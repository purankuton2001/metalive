import React, {Suspense, useMemo} from "react";
import {useGLTF} from "@react-three/drei";
import {} from "react";
import {useLoader} from '@react-three/fiber'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

export default function Venue(props) {
    const gltf = useLoader(GLTFLoader, props.url);
    // @ts-ignore
    const copiedScene = useMemo(() => gltf.scene.clone(), [gltf.scene])
    return (
        <Suspense fallback={null}>
            <primitive ref={props.ref} object={copiedScene} rotation={[0, Math.PI / 2, 0]}/>
        </Suspense>
    );
}
