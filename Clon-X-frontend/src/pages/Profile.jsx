import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../config";
import EditProfileModal from "../components/EditProfileModal";
import { UserContext } from "../context/userContext";
import { Calendar } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { loginUser } = useContext(UserContext);
  const { userId } = useParams();

  function formatDate(dateString) {
    if (!dateString) return "—";

    const date = new Date(dateString);

    if (isNaN(date)) return "—";

    return new Intl.DateTimeFormat("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${API_URL}/profile/${userId}`);
        const data = await res.json();
        setUser(data); // o data.user, depende cómo respondas
      } catch (err) {
        console.log("Error:", err);
      }
    }

    fetchUser();
  }, [userId]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Banner */}
      <div className="w-full h-40 bg-gray-300 relative">
        {user.profile?.banner && (
          <img
            src={user.profile?.banner}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Contenedor siguiente */}
      <div className="px-4 pb-4">
        {/* Foto de perfil */}
        <div className="flex flex-row justify-between">
          <div className="-mt-16 relative z-10">
            <div className="w-32 h-32 rounded-full bg-gray-400 border-4 border-white overflow-hidden">
              {user.profile?.profilePhoto && (
                <img
                  src={user.profile?.profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          <div>
            {Number(userId) === loginUser.id && (
              <>
                <div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-3 px-4 py-1.5 border border-gray-300 rounded-full text-sm font-semibold text-gray-900 hover:bg-gray-100 transition"
                  >
                    Edit profile
                  </button>
                </div>
                <EditProfileModal
                  user={user}
                  edit={isEditing}
                  onClose={() => setIsEditing(false)}
                />
              </>
            )}
          </div>
        </div>

        {/* Datos del usuario */}
        <div className="mt-2">
          <h1 className="text-xl font-bold">{user.profile?.user?.name}</h1>
          <p className="text-gray-600">@{user.profile?.user?.username}</p>

          {/* Biografía */}
          {user.profile?.biography && (
            <p className="mt-2">{user.profile?.biography}</p>
          )}

          {user.profile?.birth && (
            <>
              <div className="flex flex-row">
                <p className="mt-2">
                  Fecha de nacimiento: {formatDate(user?.profile?.birth)}
                </p>
                <p className="mt-2 ml-4">
                  Se unió el {formatDate(user?.profile?.user.createdAt)}
                </p>
              </div>
            </>
          )}

          {/* Ubicación */}
          {user.profile?.location && (
            <p className="text-gray-500 mt-1 text-sm">
              📍 {user.profile?.location}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-4 border-b border-gray-300 flex justify-around text-gray-600">
          <button className="py-3 hover:bg-gray-100 flex-1 text-center font-medium">
            Posts
          </button>
          <button className="py-3 hover:bg-gray-100 flex-1 text-center font-medium">
            Replies
          </button>
          <button className="py-3 hover:bg-gray-100 flex-1 text-center font-medium">
            Likes
          </button>
        </div>
      </div>
    </div>
  );
}
