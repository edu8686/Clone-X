import {
  Home,
  Search,
  Bell,
  Mail,
  User,
  MoreHorizontal,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function Sidebar() {
  const { setLoginUser } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <aside className="flex flex-col h-screen w-96 border-r border-gray-200 p-4">
      <div className="flex items-center justify-center md:justify-center mb-8">
        <span className="text-4xl font-bold text-black">X</span>
      </div>
      <nav className="flex flex-col justify-center gap-4 self-center">
        <SidebarItem
          icon={<Home />}
          label="Inicio"
          active
          onClick={() => navigate("/")}
        />
        <SidebarItem
          icon={<Search />}
          label="Explorar"
          onClick={() => navigate("/explore")}
        />
        <SidebarItem icon={<Bell />} label="Notificaciones" />
        <SidebarItem
          icon={<Mail />}
          label="Mensajes"
          onClick={() => navigate("/chat")}
        />
        <SidebarItem icon={<User />} label="Perfil" />
        <SidebarItem icon={<MoreHorizontal />} label="Más" />
        <SidebarItem
          icon={<LogOut />}
          label="Log out"
          onClick={() => {
            console.log("Clic en logout");
            localStorage.clear();
            setLoginUser(null);
            navigate("/auth/login", { replace: true });
          }}
        />

        <button className="bg-black text-white rounded-full py-2 px-4 mt-8 transition w-52 h-14">
          <span className="hidden md:inline">Post</span>
          <span className="md:hidden text-xl font-bold">+</span>
        </button>
      </nav>
    </aside>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-2 rounded-full hover:bg-gray-100 transition w-full ${
        active ? "font-semibold text-black" : "text-gray-800"
      }`}
    >
      <div className="text-3xl">{icon}</div>
      <span className="hidden md:inline text-lg">{label}</span>
    </button>
  );
}
