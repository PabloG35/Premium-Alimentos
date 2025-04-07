import LoadingAnimation from "@/src/components/LoadingAnimation";

export default function GlobalLoadingOverlay({ isLoading }) {
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <LoadingAnimation />
    </div>
  );
}
