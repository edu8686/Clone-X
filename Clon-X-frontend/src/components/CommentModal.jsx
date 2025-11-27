import { useState } from "react";
import { X } from "lucide-react";

export default function CommentModal({ isOpen, onClose, onSubmitComment, user, children }) {
  const [commentText, setCommentText] = useState("");

  if (!isOpen) return null;

  function handleSubmit() {
    if (commentText.trim().length === 0) return;

    onSubmitComment(commentText);
    setCommentText("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 backdrop-blur-[3px] flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-2xl shadow-xl p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          className="absolute top-3 left-3 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contenido del post (children) */}
        <div className="py-6  dark:border-gray-800">
          {children}
        </div>

        {/* Zona de comentario */}
        <div className="flex mt-4">
          <img
            src={
              user.profile?.avatar ||
              "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
            }
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover mr-4"
          />

          <textarea
            className="flex-1 bg-transparent resize-none text-lg focus:outline-none text-gray-800 dark:text-gray-200"
            placeholder="Responder..."
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
        </div>

        {/* Botón responder */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full font-semibold transition"
          >
            Responder
          </button>
        </div>
      </div>
    </div>
  );
}
