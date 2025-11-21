import { useContext, useState, useEffect } from "react";
import {
  getUsersToFollow,
  startFollow,
  stopFollow,
} from "../services/userService";
import { UserContext } from "../context/userContext";

export default function UserCard({ user }) {
  const { loginUser, handleUsersToFollow } = useContext(UserContext);
  const [following, setFollowing] = useState(user.isFollowed);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.isFollowed) setFollowing(true);
  }, [user]);

  async function handleClick() {
    if (loading) return;
    setLoading(true);

    try {
      if (following) {
        const res = await stopFollow(loginUser.id, user.id);
        setFollowing(false);
        console.log("Res stopFollow: ", res);
      } else {
        const res = await startFollow(loginUser.id, user.id);
        setFollowing(true);
        console.log("Res startFollow: ", res);
      }

      const usersArray = await getUsersToFollow(loginUser.id);
      handleUsersToFollow(usersArray.users);
    } catch (error) {
      console.error("Error updating follow status:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-start justify-between w-full max-w-2xl border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
      {/* Avatar + info */}
      <div className="flex items-start space-x-3">
        <img
          src={
            user.avatar ||
            "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
          }
          alt={user.username}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:underline">
              {user.name}
            </h3>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
          {user.bio && (
            <p className="text-sm text-gray-700 dark:text-gray-400 mt-1 line-clamp-2 max-w-md">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {/* Botón seguir / dejar de seguir */}
      <button
        onClick={handleClick}
        disabled={loading}
        className={`ml-4 px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-full text-sm font-semibold transition-colors ${
          following
            ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-300"
            : "text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? "..." : following ? "Following" : "Follow"}
      </button>
    </div>
  );
}
