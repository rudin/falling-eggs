import { Suspense, useEffect, useMemo } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, Box, Torus } from "@react-three/drei";
import {
  Physics,
  RigidBody,
  Debug,
  CuboidCollider,
  InstancedRigidBodies,
  BallCollider,
} from "@react-three/rapier";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Delay from "./Delay";

const MAX_EGGS = 50;
let egg_count = 0;

const colors = [
  "#93cba6",
  "#eea500",
  "#aadadc",
  "#c784b9",
  "#ffe900",
  "#cdd572",
  "#72c5c9",
  "#f6bac2",
];

export function Egg(props) {
  const { nodes, materials } = useGLTF("/egg.gltf");
  return (
    <mesh
      {...props}
      castShadow
      receiveShadow
      geometry={nodes.Circle.geometry}
      material-color={props.color}
    >
      {/* does not work, eggs become black <meshStandardMaterial attach="material" color={"orange"} /> */}

      {/* does work, no shadows: <meshBasicMaterial
        attach="material"
        color={props.color}
        transparent
      />*/}
    </mesh>
  );
}

useGLTF.preload("/egg.gltf");

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);

    controls.minDistance = 3;
    controls.maxDistance = 40;
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);
  return null;
};

const SomeEggs = () => {
  const eggPositions = useMemo(() => {
    egg_count += 2;
    return [...new Array(2)].map((_, index) => [
      Math.random() * 20 - 10,
      40 + Math.random() * 80,
      Math.random() * 20 - 10,
    ]);
  });

  if (egg_count > MAX_EGGS) return null;

  return (
    <>
      {eggPositions.map((position, index) => (
        <RigidBody
          key={index}
          colliders={"hull"}
          restitution={0.2}
          args={[0.5, -2, 5]}
        >
          <Egg
            key={index}
            position={position}
            color={colors[Math.floor(Math.random() * colors.length)]}
          />
        </RigidBody>
      ))}
      <Delay ms={600}>
        <SomeEggs />
      </Delay>
    </>
  );
};

const App = () => {
  return (
    <Canvas shadows>
      <CameraController />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Suspense>
        <Physics gravity={[0, -20, 0]}>
          <Delay ms={100}>
            <SomeEggs />
          </Delay>
          <CuboidCollider position={[0, -12, 0]} args={[80, 0.5, 80]} />
          <mesh
            position={[0, -12, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            castShadow
            receiveShadow
          >
            <planeBufferGeometry args={[160, 160]} />
            <meshStandardMaterial color={"#ffffff"} />
          </mesh>
        </Physics>
      </Suspense>
    </Canvas>
  );
};

export default App;
