import {
  Home,
  Search,
  Bell,
  Mail,
  User,
  MoreHorizontal,
  LogOut,
  Ellipsis,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { createPost } from "../services/postService";
import { useState } from "react";
import PostModal from "./PostModal";

export default function Sidebar() {
  const { loginUser, setLoginUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(false);

  function handleSubmitPost(userId, text) {
    createPost(userId, text);
  }

  return (
    <aside className="flex flex-col h-screen w-96 border-r border-gray-200 p-4">
      <div className="flex items-center justify-center md:justify-center mb-8">
        <span className="text-4xl font-bold text-black">X</span>
      </div>
      <nav className="flex flex-col justify-center gap-4 self-center">
        <SidebarItem
          icon={<Home />}
          label="Inicio"
          active={selectedItem === "Inicio"}
          onClick={() => {
            navigate("/");
            setSelectedItem("Inicio");
          }}
        />
        <SidebarItem
          icon={<Search />}
          label="Explorar"
          active={selectedItem === "Explore"}
          onClick={() => {
            navigate("/explore");
            setSelectedItem("Explore");
          }}
        />
        <SidebarItem
          icon={<Bell />}
          label="Notificaciones"
          active={selectedItem === "Notificaciones"}
          onClick={() => {
            setSelectedItem("Notificaciones");
            alert("Not functional section");
          }}
        />
        <SidebarItem
          icon={<Mail />}
          label="Mensajes"
          active={selectedItem === "Mensajes"}
          onClick={() => {
            navigate("/chat");
            setSelectedItem("Mensajes");
          }}
        />
        <SidebarItem
          icon={<User />}
          label="Perfil"
          active={selectedItem === "Perfil"}
          onClick={() => {
            setSelectedItem("Perfil");
            navigate(`/profile/${loginUser.id}`)
          }}
        />
        <SidebarItem
          icon={<MoreHorizontal />}
          label="Más"
          active={selectedItem === "Más"}
          onClick={() => {
            setSelectedItem("Más");
            alert("Not functional section");
          }}
        />
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

        <button
          onClick={() => {
            setIsOpenedModal(true);
          }}
          className="bg-black text-white rounded-full py-2 px-4 mt-8 transition w-52 h-14"
        >
          <span className="hidden md:inline">Post</span>
          <span className="md:hidden text-xl font-bold">+</span>
        </button>
      </nav>

      <div>
        <PostModal
          isOpen={isOpenedModal}
          onClose={() => setIsOpenedModal(false)}
          onSubmitPost={handleSubmitPost}
          user={loginUser}
        />
      </div>
      <div className="mt-auto flex justify-center">
        <div className="flex flex-row items-center gap-3 w-52">
          <img className="w-8 h-8 rounded-full bg-gray-400" src="" alt="" />
          <div className="flex flex-col">
            <div>{loginUser.name}</div>
            <div>{"@" + loginUser.username}</div>
          </div>
          <Ellipsis className="w-24" />
        </div>
      </div>
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
