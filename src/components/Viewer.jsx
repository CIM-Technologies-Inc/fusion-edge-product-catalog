import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model({ type }) {
  const file = type == undefined ? 'model1' : type;
  const { scene } = useGLTF(`/model/${file}.glb`);

  return <primitive object={scene} scale={1} />;
}

export default function Viewer({ selectedProduct }) {
  // console.log(selectedProduct?.type);
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} />

        <Model type={selectedProduct?.type}/>

        <OrbitControls />
      </Canvas>
    </div>
  );
}