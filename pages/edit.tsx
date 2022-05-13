import { Canvas, useFrame, extend } from "@react-three/fiber";
import React, { lazy, Suspense, useState } from "react";
import Venue from "../components/venue";
import * as THREE from "three";
import {
  Stage,
  OrbitControls,
  Environment,
  TransformControls,
  useGLTF,
} from "@react-three/drei";
import axios from "axios";
import { GetStaticProps } from "next";
import { Box, Button, position, Text } from "@chakra-ui/react";
import { useWindowSize } from "../hooks/useWindowSize";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Movinglight from "../components/movinglight";

function Edit({ url }) {
  const { width, height } = useWindowSize();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Box w={width} h={height}>
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
          <Venue url={url} position={[0, 0, 0]} />
          <Movinglight scale={50} />
        </Stage>
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
        <Box pos={"absolute"} bottom={0}>
          <Text color={"white"}>機材</Text>
          <Button onClick={() => {}}>ムービングライト</Button>
        </Box>
      )}
    </Box>
  );
}
export default Edit;

export const getStaticProps: GetStaticProps = async () => {
  const data = { fileName: "Venue.glb" };
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
    props: { url },
  };
};
