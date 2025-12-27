import { PostCard } from "./Home";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import  Comment  from "../components/Comment"
export default function PostDetails() {
  const { loginUser } = useContext(UserContext);
  const location = useLocation();
  const post = location.state?.post;
  const comments = location.state?.comments;
  console.log("Post: ", post);
  console.log("Comments: ", comments);
  return (
    <div className="border-r border-r-gray-200">
      <PostCard
        key={post.id}
        post={post}
        loginUser={loginUser}
        disableNavigate={true}
      />
      
      {comments.map((comment) => (
        <div key={comment.id}>
          {console.log("Comment in map: ", comment.text)}
          <Comment comment={comment} />
        </div>
      ))}
    </div>
  );
}
