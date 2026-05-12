import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { formatSidebarTime } from "../lib/utils";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    unreadCounts,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full lg:w-72 flex flex-col bg-base-100">
      {/* Header */}
      <div className="border-b border-base-200 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium">Contacts</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Online only</span>
          </label>

          <span className="text-xs text-zinc-500">
            ({onlineUsers.length} online)
          </span>
        </div>
      </div>

      {/* Users */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => {
          const unread = unreadCounts[user._id] || 0;
          // const isSelected = selectedUser?._id === user._id;
          const isSelected = String(selectedUser?._id) === String(user._id);

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-200 transition-colors
                ${isSelected ? "bg-base-200" : ""}
              `}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />

                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
                )}
              </div>

              {/* User Info */}
              <div className="flex flex-col text-left min-w-0 flex-1">
                {/* Top Row */}
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`truncate ${
                      unread > 0 && !isSelected
                        ? "font-semibold"
                        : "font-medium"
                    }`}
                  >
                    {user.fullName}
                  </div>

                  {user.lastMessageTime && (
                    <span className="text-xs text-zinc-500 shrink-0">
                      {formatSidebarTime(user.lastMessageTime)}
                    </span>
                  )}
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-sm text-zinc-400 truncate">
                    {user.lastMessage || "No messages yet"}
                  </p>

                  {/* Unread Badge */}
                  {unread > 0 && !isSelected && (
                    <div className="bg-primary text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center shrink-0">
                      {unread}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
