import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import { PostContext } from "../context/PostContext";
import {
  getPostsFromFollowed,
  incrementLikes,
  decrementLikes,
} from "../services/postService";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import NewPost from "../components/NewPost";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { loginUser } = useContext(UserContext);
  const { setCurrentPost } = useContext(PostContext);

  function handleClick(post) {
    setCurrentPost(post);
  }

  useEffect(() => {
    if (!loginUser) return;

    async function fetchData() {
      const response = await getPostsFromFollowed(loginUser.id);
      setPosts(response);
    }

    fetchData();
  }, [loginUser?.id]);

  return (
    <div className="flex flex-col border-r border-gray-200 dark:border-gray-800 min-h-screen max-w-xl">
      <h2 className="text-2xl font-bold p-4 border-b border-gray-200 dark:border-gray-800">
        Inicio
      </h2>
      <NewPost />

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          handleClick={handleClick}
          loginUser={loginUser}
        />
      ))}
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import CommentModal from "../components/CommentModal";
import { createComment } from "../services/commentService"; // supuesto endpoint

export function PostCard({
  post,
  loginUser,
  disableNavigate = false,
  handleClick,
}) {
  console.log("Post: ", post);

  const [likes, setLikes] = useState(Number(post.numLikes ?? 0));
  const [comments, setComments] = useState(post.comments);
  const [liked, setLiked] = useState(
    Array.isArray(post.likedBy)
      ? post.likedBy.some((l) => l.userId === loginUser.id)
      : false
  );
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const navigate = useNavigate();

  const [processingLike, setProcessingLike] = useState(false);

  const isLiked = post.likes?.some((u) => u.userId === loginUser.id);

  async function toggleLike() {
    if (processingLike) return;
    setProcessingLike(true);
    try {
      if (!liked) {
        const newNum = await incrementLikes(post.id, loginUser.id);
        setLikes(Number(newNum ?? likes + 1));
        setLiked(true);
      } else {
        const newNum = await decrementLikes(post.id, loginUser.id);
        setLikes(Number(newNum ?? Math.max(0, likes - 1)));
        setLiked(false);
      }
    } catch (err) {
      // opcional: mostrar toast/error
      console.error("Like error:", err);
    } finally {
      setProcessingLike(false);
    }
  }

  function handleModal() {
    setIsOpenedModal(true);
  }

  function handleNavigate() {
    if (disableNavigate) return;
    navigate("details", {
      state: { post, comments },
    });
  }

  async function handleSubmitComment(commentText) {
    await createComment(post.id, loginUser.id, commentText);
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });

  return (
    <>
      <div className="flex flex-row"></div>
      <div
        onClick={() => {
          handleClick(post);
          localStorage.setItem("post", post.id);
          setTimeout(() => handleNavigate(), 0);
        }}
        role="button"
        tabIndex={0}
        className={!disableNavigate ? "cursor-pointer" : ""}
      >
        <div className="flex-1">
          <div className="flex p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition cursor-pointer">
            <img
              src={
                post.author?.profile?.avatar ||
                "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
              }
              alt={post.author?.username}
              className="w-12 h-12 rounded-full object-cover mr-3"
            />

            <div className="flex flex-col flex-1">
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${post.author.id}`);
                  }}
                >
                  <span className="font-semibold hover:underline hover:cursor-pointer">
                    {post.author?.name}
                  </span>
                </button>
                <span className="text-gray-500">@{post.author?.username}</span>
                <span className="text-gray-500 text-sm">· {formattedDate}</span>
              </div>

              <p className="mt-1 text-gray-800 dark:text-gray-300">
                {post.text}
              </p>

              <div className="flex items-center space-x-6 mt-3">
                <button
                  className="flex items-center space-x-1 hover:text-sky-500 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModal();
                    handleClick(post);
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{comments?.length}</span>
                </button>

                <Repeat2 className="ml-28" />

                <button
                  className="flex items-center space-x-1 hover:text-red-500 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike();
                  }}
                >
                  <Heart
                    className={`w-5 h-5 ml-28 ${
                      isLiked ? "text-red-500 fill-red-500" : ""
                    }`}
                  />

                  <span>{likes}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <CommentModal
        isOpen={isOpenedModal}
        onClose={() => setIsOpenedModal(false)}
        onSubmitComment={handleSubmitComment}
        user={loginUser}
      >
        <div className="flex space-x-3">
          <img
            src={
              post.author.profile?.avatar ||
              "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
            }
            alt={post.author.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{post.author.name}</span>
              <span className="text-gray-500">@{post.author.username}</span>
              <span className="text-gray-500 text-sm">· {formattedDate}</span>
            </div>
            <p className="text-gray-800 dark:text-gray-300">{post.text}</p>
          </div>
        </div>
      </CommentModal>
    </>
  );
}
