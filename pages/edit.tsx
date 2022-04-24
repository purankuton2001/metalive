import { Canvas } from "@react-three/fiber";
import React, { Suspense, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function Edit() {
  const gltf = useLoader(
    GLTFLoader,
    "https://firebasestorage.googleapis.com/v0/b/hitokoto-309511.appspot.com/o/Stage.glb?alt=media&token=603a56a5-fd93-4670-b0bd-2ac4ce2f9e9c"
  );
  return (
    <div>
      <Canvas>
        <Suspense fallback={null}>
          <primitive object={gltf.scene} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Edit;
