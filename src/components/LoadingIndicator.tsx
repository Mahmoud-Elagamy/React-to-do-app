function LoadingIndicator() {
  return (
    <div className="flex justify-center  space-x-2 h-screen items-center">
      <div className="size-3 animate-pulse rounded-full bg-blue-500"></div>
      <div className="size-3 animate-pulse rounded-full bg-blue-500 delay-100"></div>
      <div className="size-3 animate-pulse rounded-full bg-blue-500 delay-200"></div>
    </div>
  );
}

export default LoadingIndicator;
