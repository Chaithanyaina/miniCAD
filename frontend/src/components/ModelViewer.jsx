import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Failed to load model:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

function ModelViewerComponent({ url }) {
  const geometry = useLoader(STLLoader, url);
  
  return (
    <Canvas camera={{ position: [0, 0, 100] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10,10,10]} intensity={1} />
      <mesh geometry={geometry}>
        <meshStandardMaterial color="orange" />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
}

export default function ModelViewer({ url }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ModelViewerComponent url={url} />
    </ErrorBoundary>
  );
}