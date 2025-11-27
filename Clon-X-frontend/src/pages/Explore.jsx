import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { getUsersToFollow } from "../services/userService";
import UserCard from "../components/UserCard";

export default function Explore() {
  const { usersToFollow, handleUsersToFollow, loginUser } =
    useContext(UserContext);
  console.log("Explore users: ", usersToFollow);

  useEffect(() => {
    if (!loginUser) return;

    async function fetchUsers() {
      try {
        console.log("usersToFollow: ", usersToFollow)
        const usersArray = await getUsersToFollow(loginUser.id);
        const users = usersArray.users;
        console.log("Users: ", users);
        handleUsersToFollow(users);
      } catch (error) {
        console.error("Error fetching users to follow:", error);
      }
    }
    fetchUsers();
  }, [loginUser]);

  return (
    <div className="flex ml-8">
      <div className="flex flex-col items-center w-130 space-y-4 mr-4">
        <h2 className="text-2xl font-bold mb-4">Explore users</h2>
        {usersToFollow?.map((user) => (
          <UserCard
            key={user.id}
            user={user}
          />
        ))}
      </div>
    </div>
  );
}
