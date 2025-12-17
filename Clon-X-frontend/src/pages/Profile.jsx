import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../config";
import EditProfileModal from "../components/EditProfileModal";
import { UserContext } from "../context/userContext";
import { Calendar } from "lucide-react";
import { PostCard } from "./Home";
import { getPostsByUserId, getPostsLikedByUserId } from "../services/postService";

export default function Profile() {
  const [user, setUser] = useState({});
  const [postsFromUser, setPostsFromUser] = useState([]);
  const [postsLiked, setPostsLiked] = useState([])
  const [tabSelected, setTabSelected] = useState("Posts");
  const [isEditing, setIsEditing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [followings, setFollowings] = useState(0);

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
        const resProfile = await fetch(`${API_URL}/profile/${userId}`);
        const dataProfile = await resProfile.json();
        const followers = dataProfile.profile?.user?.followers?.length ?? 0;
        const followings = dataProfile.profile?.user?.following?.length ?? 0;

        const posts = await getPostsByUserId(userId);
        const resLiked = await getPostsLikedByUserId(userId)
        const likedPosts = resLiked.posts

        console.log("likedPosts: ", likedPosts)
        setPostsLiked(likedPosts)
        setFollowers(followers);
        setFollowings(followings);
        setPostsFromUser(posts);
        setUser(dataProfile); // o data.user, depende cómo respondas
      } catch (err) {
        console.log("Error:", err);
      }
    }

    fetchUser();
  }, [userId]);

  return (
    <div className="w-full max-w-2xl mx-auto border border-gray-200 ">
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
                  setUser={setUser}
                  edit={isEditing}
                  onClose={() => setIsEditing(false)}
                />
              </>
            )}
          </div>
        </div>

        {/* Datos del usuario */}
        <div className="mt-2 flex flex-col justify-between space-y-2">
          <h1 className="text-2xl font-bold">{user.profile?.user?.name}</h1>
          <p className="text-gray-600 text-sm">
            @{user.profile?.user?.username}
          </p>

          {/* Biografía */}
          {user.profile?.biography && (
            <p className="mt-2">{user.profile?.biography}</p>
          )}

          {user.profile?.birth && (
            <>
              <div className="flex flex-row">
                <p className="mt-2 text-sm">
                  Fecha de nacimiento: {formatDate(user?.profile?.birth)}
                </p>
                <Calendar className="w-5 h-5 mt-2 ml-5" />
                <p className="mt-2 ml-1 text-sm">
                  Se unió el {formatDate(user?.profile?.user.createdAt)}
                </p>
              </div>
            </>
          )}

          {/* Ubicación */}
          {user.profile?.location && (
            <p className="text-gray-500 text-sm">📍 {user.profile?.location}</p>
          )}
        </div>

        <div className="flex flex-row mt-2">
          <p className="text-[13px]">{followers} Followers</p>
          <p className="ml-4 text-[13px]">{followings} Following</p>
        </div>

        {/* Tabs */}
        <div className="mt-4 border-b border-gray-300 flex justify-around text-gray-600">
          <button
            onClick={() => setTabSelected("Posts")}
            className={`py-3 flex-1 text-center font-medium ${
              tabSelected === "Posts" && "border-b-2 border-black text-black"
            }`}
          >
            Posts
          </button>

          <button
            onClick={() => setTabSelected("Replies")}
            className="py-3 flex-1 text-center font-medium"
          >
            Replies
          </button>

          <button
            onClick={() => setTabSelected("Likes")}
            className="py-3 flex-1 text-center font-medium"
          >
            Likes
          </button>
        </div>
        <div className="mt-4">
          {tabSelected === "Posts" &&
            (postsFromUser.length > 0 ? (
              postsFromUser.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <p className="text-center text-gray-500 mt-6">No hay posts</p>
            ))}

          {tabSelected === "Replies" && (
            <p className="text-center text-gray-500 mt-6">No hay replies aún</p>
          )}

          {tabSelected === "Likes" && (
            postsLiked.length > 0 ? (postsLiked.map((post) => (
               <PostCard key={post.id} post={post} /> 
            ))) : (<p className="text-center text-gray-500 mt-6">No hay likes aún</p>)
            
          )}
        </div>
      </div>
    </div>
  );
}
