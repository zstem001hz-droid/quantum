import QuantumLogo from "./animations/QuantumLogo";

// Full-screen loading state — uses animated QuantumLogo as spinner
const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-quantum-bg flex items-center justify-center">
      <QuantumLogo size={80} />
    </div>
  );
};

export default LoadingSpinner;
