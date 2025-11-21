import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import { getPostsFromFollowed } from "../services/postService";
import { Heart } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { loginUser } = useContext(UserContext);

  useEffect(() => {
    if (!loginUser) return;

    async function fetchData() {
      const response = await getPostsFromFollowed(loginUser.id);
      setPosts(response);
    }

    fetchData();
  }, [loginUser?.id]);

  return (
    <div className="flex flex-col border-r border-gray-200 dark:border-gray-800 min-h-screen max-w-2xl">
      <h2 className="text-2xl font-bold p-4 border-b border-gray-200 dark:border-gray-800">
        Inicio
      </h2>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes);

  function toggleLike() {
    setLikes((prev) => prev + 1); // solo UI, sin back
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="flex p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition cursor-pointer">
      
      {/* Avatar */}
      <img
        src={
          post.author.profile?.avatar ||
          "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
        }
        alt={post.author.username}
        className="w-12 h-12 rounded-full object-cover mr-3"
      />

      {/* Contenido */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{post.author.name}</span>
          <span className="text-gray-500">@{post.author.username}</span>
          <span className="text-gray-500 text-sm">· {formattedDate}</span>
        </div>

        {/* Texto */}
        <p className="mt-1 text-gray-800 dark:text-gray-300">
          {post.text}
        </p>

        {/* Footer */}
        <div className="flex items-center space-x-6 mt-3">
          <button
            className="flex items-center space-x-1 hover:text-red-500 transition"
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
          >
            <Heart className="w-5 h-5" />
            <span>{likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
