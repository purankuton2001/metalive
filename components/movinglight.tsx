import * as THREE from "three";
import React, { useRef, Suspense, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { gsap } from "gsap";

export default function Movinglight(props) {
  const group = useRef();
  const mesh = useRef();
  const positionKeyframeTrackJSON = {
    name: ".position",
    type: "vector",
    times: [0, 1, 2],
    values: [0, 0, 0, 2, 1, 150, 0, 0, 0],
  };
  const colorKeyframeTrackJSON = {
    name: ".material.color",
    type: "vector",
    times: [0, 1, 2],
    values: [0, 0, 0, 2, 1, 150, 0, 0, 0],
  };
  const rotationKeyframeTrackJSON = {
    name: ".rotation[y]",
    type: "number",
    times: [0, 2],
    values: [0, 2 * Math.PI],
    interpolation: THREE.InterpolateSmooth,
  };
  const groupClipJSON = {
    duration: 2,
    tracks: [positionKeyframeTrackJSON, rotationKeyframeTrackJSON],
  };
  const meshClipJSON = {
    duration: 2,
    tracks: [colorKeyframeTrackJSON],
  };

  const groupClip = THREE.AnimationClip.parse(groupClipJSON);
  const meshClip = THREE.AnimationClip.parse(meshClipJSON);
  let groupMixer;
  let meshMixer;
  useEffect(() => {
    groupMixer = new THREE.AnimationMixer(group.current);
    meshMixer = new THREE.AnimationMixer(mesh.current);
    const groupAction = groupMixer.clipAction(groupClip);
    const meshAction = meshMixer.clipAction(meshClip);
    groupAction.play();
    meshAction.play();
  }, [group.current]);
  useFrame(() => {
    meshMixer?.update(0.01);
    groupMixer?.update(0.01);
    console.log(mesh.current?.material.color.r);
  });

  // const tl = useMemo(() => gsap.timeline(), []);
  // useEffect(() => {
  //   tl.to(group.current.position, { x: 500 }, 10)
  //     .to(group.current.position, { x: -500 }, 1)
  //     .to(mesh.current.material.color, { r: 0 }, 1);
  // }, [group.current]);

  const { nodes, materials } = useGLTF("asset/movinglight.glb");
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        ref={mesh}
        castShadow
        receiveShadow
        geometry={nodes.StageLigt_11_7.geometry}
        material={nodes.StageLigt_11_7.material}
        position={[2.13, 0.06, 0]}
        rotation={[1.59, 0.01, -0.01]}
        scale={0.36}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.StageLigt_11_3.geometry}
          material={nodes.StageLigt_11_3.material}
          rotation={[0, 0, -0.04]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.StageLigt_11_2.geometry}
            material={nodes.StageLigt_11_2.material}
            position={[-0.11, -1.31, -9.63]}
            rotation={[-0.12, -0.01, 0]}
          >
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.StageLigt_11_1.geometry}
              material={nodes.StageLigt_11_1.material}
              position={[0.01, 1.12, 9.63]}
            />
          </mesh>
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.StageLigt_11_4.geometry}
          material={nodes.StageLigt_11_4.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.StageLigt_11_5.geometry}
          material={nodes.StageLigt_11_5.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.StageLigt_11_6.geometry}
          material={nodes.StageLigt_11_6.material}
        />
      </mesh>
    </group>
  );
}
