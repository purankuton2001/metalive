import { Canvas, useFrame, extend } from "@react-three/fiber";
import React, { lazy, Suspense } from "react";
import Model from "./model";
import * as THREE from "three";
import {
  Stage,
  OrbitControls,
  Environment,
  TransformControls,
} from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import axios from "axios";
import { GetStaticProps } from "next";
import { Box, position } from "@chakra-ui/react";

function Edit({ url }) {
  return (
    <Box h={800}>
      <Canvas
        gl={{ alpha: false }}
        camera={{ position: [0, 15, 30], fov: 70 }}
        onCreated={({ gl, camera }) => {
          camera.lookAt(0, 0, 0);
        }}
      >
        <OrbitControls attach="orbitControls" makeDefault />
        <TransformControls mode="translate" />
        <Stage>
          <Model url={url} position={[0, 0, 0]} />
        </Stage>
      </Canvas>
    </Box>
  );
}
export default Edit;

export const getStaticProps: GetStaticProps = async () => {
  const data = { fileName: "Stage.glb" };
  const res = await axios.post(
    "https://us-central1-metalive-348103.cloudfunctions.net/liveFetch",
    data
  );
  console.log(res.data);
  const url = res.data;

  if (!url) {
    return {
      notFound: true,
    };
  }

  return {
    props: { url },
  };
};
