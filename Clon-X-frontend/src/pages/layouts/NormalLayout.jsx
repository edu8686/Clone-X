// src/layouts/NormalLayout.jsx
import { Outlet } from "react-router-dom";
import RightSection from "../../components/RightSection";

export default function NormalLayout() {
  return (
    <div className="flex">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <aside className="mr-10 p-4">
        <RightSection />
      </aside>
    </div>
  );
}
