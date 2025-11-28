import { Heart } from "lucide-react";

export default function Comment({ comment }) {

  const formattedDate = new Date(comment.createdAt).toLocaleDateString(
    "es-AR",
    { day: "numeric", month: "short" }
  );

  return (
    <div className="flex p-4 border-b border-gray-200 dark:border-gray-800">
      {/* Avatar */}
      <img
        src={
          comment.author?.profile?.profilePhoto ||
          "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
        }
        alt={comment.author.username}
        className="w-10 h-10 rounded-full object-cover mr-3"
      />

      {/* Contenido */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{comment.author.name}</span>
          <span className="text-gray-500">@{comment.author.username}</span>
          <span className="text-gray-500 text-sm">· {formattedDate}</span>
        </div>

        {/* Texto */}
        <p className="mt-1 text-gray-800 dark:text-gray-300">{comment.text}</p>

        <div className="flex items-center space-x-6 mt-3">
          <div className="flex items-center space-x-1 text-gray-500">
            <Heart size={16} className="text-gray-500" />
            <span className="text-sm">{comment.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
