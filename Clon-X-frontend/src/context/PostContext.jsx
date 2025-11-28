import { createContext } from "react";
import { useState } from "react";
import { createPost } from "../services/postService";

const PostContext = createContext();

export function PostProvider({children}){

    const [currentPost, setCurrentPost] = useState(null);

    return (
        <PostContext.Provider value={{currentPost, setCurrentPost, createPost}}>
            {children}
        </PostContext.Provider>
    )
}

export {PostContext}