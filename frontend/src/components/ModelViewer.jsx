import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Bounds, useBounds } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { useEffect } from "react";
import * as THREE from "three";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
      <p>⚠ Failed to load model:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function ModelViewerComponent({ filePath }) {
  if (!filePath) return null;

  const fileExtension = filePath.split(".").pop().toLowerCase();
  let model = null;

  try {
    if (fileExtension === "stl") {
      const geometry = useLoader(STLLoader, filePath);
      geometry.computeVertexNormals();
      model = (
        <mesh geometry={geometry} scale={0.5}>
          <meshStandardMaterial color="white" flatShading={false} />
        </mesh>
      );
    } else if (fileExtension === "obj") {
      const basePath = filePath.substring(0, filePath.lastIndexOf("/"));
      const mtlPath = `${basePath}/${filePath.split("/").pop().replace(".obj", ".mtl")}`;
      const materials = useLoader(MTLLoader, mtlPath);
      const object = useLoader(OBJLoader, filePath, (loader) => {
        loader.setMaterials(materials);
      });
      model = <primitive object={object} scale={0.5} />;
    }
  } catch (error) {
    console.error("Model loading error:", error);
    throw error;
  }

  const bounds = useBounds();
  useEffect(() => {
    if (bounds && model) {
      bounds.refresh(model).fit();
    }
  }, [bounds, model]);

  return (
    <Canvas style={{ width: "100%", height: "100%" }} camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <Bounds fit margin={1.2}>
        {model}
      </Bounds>
      <OrbitControls enablePan enableZoom enableRotate dampingFactor={0.1} />
    </Canvas>
  );
}

export default function ModelViewer({ filePath }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      {filePath && <ModelViewerComponent filePath={filePath} />}
    </ErrorBoundary>
  );
}