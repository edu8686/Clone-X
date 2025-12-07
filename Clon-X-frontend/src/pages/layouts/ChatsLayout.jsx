// src/layouts/ChatLayout.jsx
import Chat from "../Chat";

export default function ChatLayout() {
  return (
    <div className="flex-1 h-screen w-5xl border-r border-r-gray-200 overflow-y-auto bg-white dark:bg-black text-gray-900 dark:text-white">
      <Chat />
    </div>
  );
}
