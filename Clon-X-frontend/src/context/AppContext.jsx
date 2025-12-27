import { UserProvider } from "./UserContext";
import { PostProvider } from "./PostContext";
import { ChatProvider } from "./ChatContext";
import { createContext } from "react";

const AppContext = createContext();

export function AppProvider({children}){
    return(
        <UserProvider>
            <PostProvider>
                <ChatProvider>{children}</ChatProvider>
            </PostProvider>
        </UserProvider>
    )
}
