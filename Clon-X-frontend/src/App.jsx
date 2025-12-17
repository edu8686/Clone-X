// src/App.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <aside className="w-64 h-screen fixed top-0 left-0 bg-white dark:bg-black">
        <Sidebar />
      </aside>

      <main className="ml-96 flex-1 h-screen overflow-y-auto">
        <Outlet />
      </main>


    </div>
  );
}

export default App;

