import { useEffect, useState } from "react";
import { getChats, getChatMessages } from "../services/chatService";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { socket } from "../socket";
import { API_URL } from "../config";

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const { loginUser } = useContext(UserContext);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [messageResults, setMessageResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  const otherUser = selectedChat?.users?.find(
    (u) => u.userId !== loginUser.id
  )?.user;

  async function handleQuery(query) {
    if (!query.trim()) {
      setUserResults([]);
      setMessageResults([]);
      return;
    }

    try {
      setIsSearching(true);

      const token = localStorage.getItem("token");

      const usersResults = await fetch(`${API_URL}/user/${query}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const messagesResults = await fetch(`${API_URL}/chat/messages/${query}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dataUsers = await usersResults.json();
      const dataMessages = await messagesResults.json();

      setUserResults(dataUsers);
      setMessageResults(dataMessages);
    } catch (err) {
      console.error("Error en búsqueda:", err);
    } finally {
      setIsSearching(false);
    }
  }

  useEffect(() => {
    handleQuery(query);
  }, [query]);

  async function handleSelectChat(chat) {
    if (!socket.connected) {
      socket.connect();
    }

    if (!chat?.id) {
      console.warn("Chat inválido:", chat);
      return;
    }

    socket.emit("joinChat", chat.id);
    const fullMessages = await getChatMessages(chat.id);

    const fullChats = await getChats();
    const fullChat = fullChats.chats.find((c) => c.id === chat.id);

    setSelectedChat({
      ...fullChat,
      messages: fullMessages,
    });

    setQuery("");
    setUserResults([]);
    setMessageResults([]);
  }

  useEffect(() => {
    async function load() {
      const data = await getChats();
      console.log("data: ", data);
      setChats(data.chats);
    }
    load();
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on("newMessage", (message) => {
      console.log("Nuevo mensaje recibido:", message);

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === message.chatId
            ? {
                ...chat,
                messages: [...(chat.messages || []), message],
              }
            : chat
        )
      );

      setSelectedChat((prev) => {
        if (!prev) return prev;
        if (prev.id !== message.chatId) return prev;

        return {
          ...prev,
          messages: [...(prev.messages || []), message],
        };
      });
    });

    return () => {
      socket.off("newMessage");
      socket.disconnect();
    };
  }, []);

  function getDate(date) {
    const d = new Date(date);

    const day = d.getDate();
    const month =
      d.toLocaleString("es-AR", { month: "long" }).slice(0, 3) + ".";
    const year = d.getFullYear();

    const lastDate = `${day} de ${month} de ${year}`;
    return lastDate;
  }

  useEffect(() => {
    function closeMenu() {
      setContextMenu(null);
    }

    if (contextMenu) {
      window.addEventListener("click", closeMenu);
    }

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, [contextMenu]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* LEFT COLUMN — Chats list */}
      <aside
        className={`
    w-full md:w-[450px]
    border-r border-gray-200 dark:border-gray-800
    bg-white dark:bg-black
    shrink-0
    ${selectedChat ? "hidden md:block" : "block"}
  `}
      >
        <div className="p-4 ">
          <h2 className="text-xl font-bold">Mensajes</h2>
        </div>

        {/* Search bar */}
        <div className="px-4 py-3">
          <input
            type="text"
            placeholder="Buscar mensajes o usuarios..."
            className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-900  text-sm outline-none"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          {isSearching && (
            <p className="text-sm text-gray-500 px-4">Buscando...</p>
          )}

          {/* RESULTADOS DE USUARIOS */}
          {userResults.length > 0 && (
            <div className="px-4 py-2">
              <p className="text-xs text-gray-400 mb-1">Usuarios</p>

              {userResults.map((user) => (
                <div
                  key={user.id}
                  className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={async () => {
                    const res = await fetch(`${API_URL}/chat/new`, {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ otherUserId: user.id }),
                    });

                    const chat = await res.json();

                    setChats((prev) => {
                      const exists = prev.some((c) => c.id === chat.id);
                      if (exists) return prev;
                      return [chat, ...prev];
                    });

                    handleSelectChat(chat);

                    setQuery("");
                    setUserResults([]);
                    setMessageResults([]);
                  }}
                >
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
              ))}
            </div>
          )}

          {/* RESULTADOS DE MENSAJES */}
          {messageResults.length > 0 && (
            <div className="px-4 py-2">
              <p className="text-xs text-gray-400 mb-1">Mensajes</p>

              {messageResults.map((msg) => (
                <div
                  key={msg.id}
                  className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    const chatFound = chats.find(
                      (chat) => chat.id === msg.chatId
                    );

                    if (chatFound) {
                      handleSelectChat(chatFound);
                      setQuery("");
                      setMessageResults([]);
                      setUserResults([]);
                    } else {
                      console.warn("Chat no encontrado en estado:", msg.chatId);
                    }
                  }}
                >
                  <p className="text-sm font-semibold">{msg.sender.name}</p>
                  <p className="text-sm text-gray-600 truncate">{msg.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat list */}
        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              onContextMenu={(e) => {
                e.preventDefault();

                setContextMenu({
                  x: e.clientX,
                  y: e.clientY,
                  chat,
                });
              }}
              className={`p-4 flex gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 
    ${
      selectedChat?.id === chat.id
        ? "bg-gray-100 dark:bg-gray-900 border-r-2 border-r-blue-400"
        : ""
    }
  `}
            >
              <div className="shrink-0">
                <img
                  className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-800"
                  src={
                    chat.users.find((u) => u.userId !== loginUser.id)?.user
                      .profile.profilePhoto || ""
                  }
                  alt=""
                />
              </div>

              <div className="flex flex-col">
                <div className="flex flex-row">
                  <span className="font-semibold truncate">
                    {chat.users.find((u) => u.userId !== loginUser.id)?.user
                      .name || "User"}
                  </span>

                  <span className="font-light ml-2 text-base">
                    @
                    {
                      chat.users.find((u) => u.userId !== loginUser.id)?.user
                        .username
                    }
                  </span>

                  <span className="text-sm  text-gray-500 truncate ml-2 mt-[3px] items-center">
                    {chat?.messages?.length
                      ? getDate(
                          chat.messages[chat.messages.length - 1].createdAt
                        )
                      : ""}
                  </span>
                </div>
                <span className="text-sm text-gray-500 truncate">
                  {chat?.messages?.length
                    ? chat.messages[chat.messages.length - 1].text
                    : "Sin mensajes"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT COLUMN — Chat messages */}
      <main
        className={`
    flex-1 flex flex-col
    bg-white dark:bg-black
    ${!selectedChat ? "hidden md:flex" : "flex"}
  `}
      >
        {/* Header */}
        {selectedChat ? (
          <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3">
            <button
              className="md:hidden text-blue-500"
              onClick={() => setSelectedChat(null)}
            >
              ←
            </button>

            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-800"></div>

            <div className="flex flex-col">
              <span>{otherUser?.name}</span>
              <span className="text-sm text-gray-500">
                @{otherUser?.username}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Seleccioná una conversación
          </div>
        )}

        {/* Messages */}
        {selectedChat && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Array.isArray(selectedChat.messages) &&
              selectedChat.messages.map((msg) =>
                msg.senderId !== loginUser.id ? (
                  <div key={msg.id} className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl px-4 py-2 max-w-xs">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex justify-end">
                    <div className="bg-blue-400 text-white rounded-2xl rounded-br-none px-4 py-2 max-w-xs">
                      {msg.text}
                    </div>
                  </div>
                )
              )}
          </div>
        )}

        {/* Input */}
        {selectedChat && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2">
            <input
              className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-900 outline-none"
              placeholder="Escribir un mensaje"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-full"
              onClick={() => {
                if (!text.trim()) return;

                socket.emit("sendMessage", {
                  chatId: selectedChat.id,
                  senderId: loginUser.id,
                  text,
                });
                setText("");
              }}
            >
              Enviar
            </button>
          </div>
        )}
      </main>
      {contextMenu && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-900 border rounded-lg shadow-lg"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          <button
            className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 w-full text-left"
            onClick={async () => {
              const chatId = contextMenu.chat.id;

              try {
                await fetch(`${API_URL}/chat/${chatId}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                });

                setChats((prev) => prev.filter((c) => c.id !== chatId));

                setSelectedChat((prev) => (prev?.id === chatId ? null : prev));
              } catch (err) {
                console.error("Error eliminando chat", err);
              } finally {
                setContextMenu(null);
              }
            }}
          >
            Eliminar conversación
          </button>
        </div>
      )}
    </div>
  );
}
