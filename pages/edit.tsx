import { Canvas } from "@react-three/fiber";
import React, { Suspense, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

async function Edit() {
  const url = await fetch(
    "https://us-central1-metalive-348103.cloudfunctions.net/liveFetch/Stage",
    {
      method: "POST",
    }
  ).then((response) => {
    console.log(response.text());
    return response.text();
  });

  const gltf = useLoader(GLTFLoader, url);
  return (
    <div>
      <Canvas>
        <Suspense fallback={null}>
          {gltf && <primitive object={gltf.scene} />}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Edit;
