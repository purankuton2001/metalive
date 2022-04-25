import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { position } from "@chakra-ui/react";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF(props.url);
  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["uploads_files_642685_sankhau_(2)_1"].geometry}
          material={materials.wire_028089177}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["uploads_files_642685_sankhau_(2)_2"].geometry}
          material={materials["03___Default"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["uploads_files_642685_sankhau_(2)_3"].geometry}
          material={materials.metal}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["uploads_files_642685_sankhau_(2)_4"].geometry}
          material={materials.Material__39}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["uploads_files_642685_sankhau_(2)_5"].geometry}
          material={materials.Material__38}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["uploads_files_642685_sankhau_(2)_6"].geometry}
          material={materials.wire_027177148}
        />
      </group>
    </group>
  );
}
