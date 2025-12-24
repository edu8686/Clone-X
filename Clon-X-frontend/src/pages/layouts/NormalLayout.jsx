// src/layouts/NormalLayout.jsx
import { Outlet } from "react-router-dom";
import RightSection from "../../components/RightSection";

export default function NormalLayout() {
  return (
    <div className="flex w-full">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <aside className="hidden lg:flex w-[420px] justify-center p-4">
        <RightSection />
      </aside>
    </div>
  );
}
