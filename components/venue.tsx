import React, { useRef, Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import { position } from "@chakra-ui/react";
import {} from "react";

export default function Venue(props) {
  const group = useRef();
  const gltf = useGLTF(props.url);
  console.log(gltf);
  return (
    <Suspense fallback={null} >
      <primitive object={gltf.scene} rotation={[0, Math.PI/2, 0]}/>
    </Suspense>
  );
}
