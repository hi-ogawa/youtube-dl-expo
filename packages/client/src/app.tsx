export function App() {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="flex flex-col items-center gap-[8px]">
        <p>Hello Vite</p>
        <button
          className="border px-2 py-1 uppercase bg-gray-200 shadow"
          onClick={() => {
            window.ReactNativeWebView.postMessage("vite-to-expo-postMessage");
          }}
        >
          click-vite
        </button>
      </div>
    </div>
  );
}
