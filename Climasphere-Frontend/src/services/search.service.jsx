import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useNavigationType } from "react-router-dom";
import CryptoJS from "crypto-js";
import { debounce } from "lodash";
import axios from "axios";
import socket from "../socket.js";
import { AiOutlineSearch } from "react-icons/ai";
import { setSelectUser } from "../features/userSlice.js";
import { setChatAction } from "../features/layoutSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { BACKEND_API } from "../Backend_API.js";

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const secretKey = "0123456789abcdef0123456789abcdef";
  const iv = "abcdef9876543210abcdef9876543210";
  const dispatch = useDispatch();
  const { userId, userName } = useSelector((state) => state.user);
  console.log("RDS", userId, userName);

  // For message decryption
  function decryptMessage(encryptedText) {
    if (encryptedText) {
      const bytes = CryptoJS.AES.decrypt(
        encryptedText,
        CryptoJS.enc.Hex.parse(secretKey),
        {
          iv: CryptoJS.enc.Hex.parse(iv),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        },
      );
      return bytes.toString(CryptoJS.enc.Utf8);
    }
  }

  // Store previous chat
  const fetchRecentChats = async () => {
    console.log("FRC");

    setTimeout(async () => {
      try {
        const response = await axios.get(
          `${BACKEND_API}/api/users/userList?userId=${userId}`,
          {
            withCredentials: true
          }
        );

        if (response.data) {
          const updatedData = response.data.map((data) => ({
            ...data,
            lastMessage: {
              ...data.lastMessage,
              text: decryptMessage(data.lastMessage.text),
            },
          }));
          setRecentUsers(updatedData);
          console.log("Data", updatedData);
        }
      } catch (error) {
        console.error("Error fetching recent chats:", error);
      }
    }, 100);
  };

  // It is fetch users those are matchs with search query
  const fetchUsers = debounce(async (searchText) => {
    if (!searchText.trim()) {
      setUsers([]);
      return;
    }
    try {
      const response = await axios.get(
        `${BACKEND_API}/api/users/searchUser?query=${searchText}&userId=${userId}`,
        {
          withCredentials: true
        }
      );
      console.log("Res", response);
      const usersWithUUID = response.data.map((user) => ({
        ...user,
      }));
      console.log("Data", usersWithUUID);
      setUsers(usersWithUUID);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, 300);

  // It is work for make first position of searchable users on userlist
  const searchRecentChat = () => {
    setRecentUsers((prevUsers) => {
      let updatedUsers = [...prevUsers];
      users.forEach((newUser) => {
        const index = updatedUsers.findIndex(
          (user) => user._id === newUser._id,
        );
        if (index !== -1) {
          const [matchedUser] = updatedUsers.splice(index, 1);
          updatedUsers.unshift(matchedUser);
        } else {
          updatedUsers.unshift(newUser);
        }
      });
      return updatedUsers;
    });
    console.log("Recentusers", recentUsers);
  };

  // After sending last message userlist update code
  const handleLastMessage = (data) => {
    const { userId, sms, fileType, fileName, sentRequest, receiveRequest } =
      data;
    const t = decryptMessage(sms);
    setTimeout(() => {
      setRecentUsers((prevUsers) => {
        let updatedUsers = prevUsers.map((user) =>
          user._id === userId
            ? {
              ...user,
              lastMessage: {
                ...user.lastMessage,
                text: fileType ? "" : t,
                fileType,
                fileName,
              },
            }
            : user,
        );
        const index = updatedUsers.findIndex((u) => u._id === userId);
        if (index > -1) {
          const [moved] = updatedUsers.splice(index, 1);
          updatedUsers.unshift(moved);
        }
        return updatedUsers;
      });
    }, 1000);
  };

  // After selecting user from userlist
  const handleSelectUser = (user) => {
    const recieverName = user?.fullName?.replace(/\s+/g, "");
    dispatch(
      setSelectUser({
        receiverId: user._id,
        receiverName: user.fullName,
        receiverAvatar: user.avatar,
        receiverAbout: user.about,
      }),
    );
    setTimeout(() => {
      navigate(`/chat/${recieverName}`);
    }, 300);
    dispatch(
      setChatAction({
        chatAction: "chatPage",
      }),
    );
    console.log("Workredux");

    setQuery("");
    setRecentUsers((prevUsers) => {
      const updatedUsers = prevUsers.filter(
        (recentUser) => recentUser._id === user._id || recentUser.lastMessage,
      );
      // Ensure user is at the top
      const userIndex = updatedUsers.findIndex((u) => u._id === user._id);
      if (userIndex !== -1) {
        const [matchedUser] = updatedUsers.splice(userIndex, 1);
        updatedUsers.unshift(matchedUser);
      }
      return updatedUsers;
    });
  };

  // This code for show online after online
  useEffect(() => {
    console.log("work");
    if (socket.connected) {
      socket.emit("new-user-joined", userId, userName);
    } else {
      socket.connect();
      socket.emit("new-user-joined", userId, userName);
    }
  }, []);

  // After sending last message userlist update code
  useEffect(() => {
    fetchRecentChats();
    socket.on("last message", handleLastMessage);
  }, []);

  // fetchusers code (show users for typing query)
  useEffect(() => {
    fetchUsers(query);
  }, [query]);

  // searchRecentChat code (user transfer to first index for searching)
  useEffect(() => {
    searchRecentChat();
  }, [users]);

  return (
    <div>
      {/* Searchbar */}
      <div className="relative flex justify-center mt-[2rem] ml-[0.9rem] mr-[0.9rem]">
        <AiOutlineSearch
          size={18}
          className="absolute left-[1rem] top-[0.65rem] text-zinc-400"
        />
        <input
          type="text"
          value={query}
          placeholder="Search or start a new chat"
          onChange={(e) => {
            setQuery(e.target.value);
            fetchUsers(e.target.value);
          }}
          className="placeholder-zinc-500 pl-[2.8rem] pr-[1rem] text-[0.9rem] w-full h-[2.4rem] bg-zinc-800 border border-zinc-700 rounded-3xl outline-none focus:border-zinc-500 focus:bg-zinc-750 text-zinc-100 transition-all"
        />
      </div>

      {/* User list */}
      <ul className="pt-2 space-y-0.5 px-1">
        {recentUsers.map((user) => (
          <li
            key={user._id}
            className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors duration-150"
            onClick={() => handleSelectUser(user)}
          >
            {/* Avatar with online indicator */}
            <div className="relative shrink-0">
              <img
                src={user.avatar}
                className="w-11 h-11 rounded-full object-cover"
              />
              {user.isOnline && (
                <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-zinc-900" />
              )}
            </div>

            {/* Text content */}
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <p
                  className={`text-[0.9rem] truncate ${user.unreadCount > 0
                      ? "font-semibold text-white"
                      : "font-medium text-zinc-200"
                    }`}
                >
                  {user.fullName}
                </p>
                {user.lastMessage?.timestamp && (
                  <span
                    className={`text-[0.68rem] shrink-0 ml-2 ${user.unreadCount > 0
                        ? "text-green-400 font-medium"
                        : "text-zinc-500"
                      }`}
                  >
                    {new Date(user.lastMessage.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <p
                  className={`text-[0.78rem] truncate flex-1 ${user.unreadCount > 0
                      ? "text-zinc-200 font-medium"
                      : "text-zinc-400"
                    }`}
                >
                  {user.lastMessage?.fileType ? (
                    user.lastMessage.fileType.startsWith("image/") ? (
                      <span>📷 Photo</span>
                    ) : user.lastMessage.fileType.startsWith("video/") ? (
                      <span>🎥 Video</span>
                    ) : (
                      <span>
                        📄{" "}
                        {user.lastMessage.fileName
                          ? user.lastMessage.fileName.split(".").pop().toUpperCase() +
                          " file"
                          : "File"}
                      </span>
                    )
                  ) : user.lastMessage?.text ? (
                    user.lastMessage.text.length > 35
                      ? user.lastMessage.text.slice(0, 35) + "..."
                      : user.lastMessage.text
                  ) : (
                    <span className="text-zinc-600 italic">No messages yet</span>
                  )}
                </p>

                {/* Unread badge */}
                {user.unreadCount > 0 && (
                  <span className="ml-2 shrink-0 bg-green-500 text-white text-[0.65rem] font-semibold rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-4">
                    {user.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;

//  return (
//     <div>
//       {/* Searchbar */}
//       <div className="relative flex justify-center mt-[2rem] ml-[0.9rem] mr-[0.9rem]">
//         <AiOutlineSearch
//           size={21}
//           className="absolute left-[1rem] top-[0.6rem] text-slate-600"
//         />
//         <input
//           type="text"
//           value={query}
//           placeholder="Search or start a new chat"
//           onChange={(e) => {
//             setQuery(e.target.value);
//             fetchUsers(e.target.value);
//           }}
//           className="placeholder-slate-400 pl-[3rem] text-[1rem] w-full h-[2.3rem] border-2 rounded-3xl outline-none"
//         />
//       </div>
//       {/* Searching list */}
//       <ul className="pt-[1.5rem] pl-[0.6rem]">
//         {recentUsers.map((user) => (
//           <li
//             key={user._id}
//             className="flex gap-3 p-2 font-mono cursor-pointer"
//             onClick={() => handleSelectUser(user)}>
//             <img
//               src={user.avatar}
//               className="w-[2.7rem] h-[2.7rem] rounded-full object-cover"
//             />
//             <div className="flex flex-col">
//               {/* min-w-0 is important for truncate */}
//               <p className="font-bold text-[1rem] pl-[0.5rem]">
//                 {user.fullName}
//               </p>
//               <p className="text-gray-600 text-[1rem] truncate w-40 pl-[0.5rem]">
//                 {user.lastMessage?.fileType ? (
//                   user.lastMessage.fileType.startsWith("image/") ? (
//                     <>
//                       <span role="img" aria-label="image">
//                         📷
//                       </span>{" "}
//                       Photo
//                     </>
//                   ) : user.lastMessage.fileType.startsWith("video/") ? (
//                     <>
//                       <span role="img" aria-label="video">
//                         🎥
//                       </span>{" "}
//                       Video
//                     </>
//                   ) : (
//                     <>
//                       <span role="img" aria-label="file">
//                         📄
//                       </span>{" "}
//                       {user.lastMessage.fileName
//                         ? user.lastMessage.fileName
//                           .split(".")
//                           .pop()
//                           .toUpperCase() + " file"
//                         : "File"}
//                     </>
//                   )
//                 ) : user.lastMessage?.text &&
//                   user.lastMessage.text.length > 40 ? (
//                   user.lastMessage.text.slice(0, 40) + "..."
//                 ) : (
//                   user.lastMessage?.text
//                 )}
//               </p>
//             </div>
//           </li>
//         ))}
//       </ul>{" "}
//     </div>
//   );