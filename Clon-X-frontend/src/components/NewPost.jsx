import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Image, Laugh, Smile } from "lucide-react";
import { PostContext } from "../context/PostContext";

export default function NewPost() {
  const [postText, setPostText] = useState("");
  const { loginUser } = useContext(UserContext);
  const { createPost } = useContext(PostContext)

  return (
    <div className="flex flex-row p-4 border-b border-gray-200 dark:border-gray-800">
      
      {/* Avatar */}
      <div>
        <img
          src={
            loginUser.profile?.profilePhoto ||
            "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
          }
          alt=""
          className="w-12 h-12 rounded-full object-cover mr-3"
        />
      </div>

      {/* Formulario */}
      <div className="flex flex-col flex-1">

        {/* Textarea */}
        <div>
          <textarea
            className="w-full bg-transparent text-lg resize-none focus:outline-none text-gray-800 dark:text-gray-200"
            placeholder="¿Qué está pasando?"
            rows={3}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          ></textarea>
        </div>

        <div className="flex flex-row items-center justify-between mt-3 mb-3 border-t border-gray-200 pt-5">

          <div className="flex flex-row space-x-4 text-sky-500">
            <button className="hover:text-sky-600 transition">
              <Image className="w-5 h-5" />
            </button>

            <button className="hover:text-sky-600 transition">
              <Laugh className="w-5 h-5" />
            </button>

            <button className="hover:text-sky-600 transition">
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <button
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded-full font-semibold transition disabled:opacity-50"
            disabled={postText.trim() === ""}
            onClick={() => {createPost(loginUser.id, postText); setPostText("")} }
          >
            Post
          </button>
        </div>

      </div>
    </div>
  );
}
