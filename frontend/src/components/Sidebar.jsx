import { Users, Search, Filter, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./SidebarSkeleton";
import NewChatModel from "./NewChatModel";

const Sidebar = () => {
  const { onlineUsers } = useAuthStore();
  const {
    users,
    selectedUser,
    setSelectedUser,
    getUsers,
    isUsersLoading,
  } = useChatStore();

  const [query, setQuery] = useState("");
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filtered and memoized list
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !query ||
        u?.name?.toLowerCase().includes(query.toLowerCase()) ||
        u?.email?.toLowerCase().includes(query.toLowerCase()) ||
        u?.lastMessage?.text?.toLowerCase().includes(query.toLowerCase());
      const matchesOnline = !onlyOnline || onlineUsers.includes(u._id);
      return matchesSearch && matchesOnline;
    });
  }, [users, query, onlyOnline, onlineUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      {modalOpen && <NewChatModel onClose={() => setModalOpen(false)} />}

      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col bg-base-100 transition-all duration-200">
        {/* HEADER */}
        <div className="border-b border-base-300 px-4 py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-zinc-700" />
            <span className="hidden lg:block font-semibold">Contacts</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              title="New chat"
              onClick={() => setModalOpen(true)}
              className="p-2 rounded-md hover:bg-base-200 active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="px-3 py-3 hidden lg:block">
          <label className="relative block">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              className="input input-sm w-full pl-10 pr-3 bg-white"
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-zinc-500">Online: {onlineUsers.length}</div>
            <button
              onClick={() => setOnlyOnline((s) => !s)}
              className={`btn btn-ghost btn-xs gap-1 ${onlyOnline ? "btn-active" : ""}`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">{onlyOnline ? "Online" : "All"}</span>
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="overflow-y-auto w-full py-2">
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-zinc-400">No users found</div>
          )}

          {filtered.map((user) => {
            const isActive = selectedUser?._id === user._id;
            const isOnline = onlineUsers.includes(user._id);
            const unread = user.unread || 0;
            const lastMsg = user.lastMessage?.text || "";

            return (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-3 flex items-center gap-3 transition-colors hover:bg-base-200 ${
                  isActive ? "bg-base-200 ring-1 ring-base-300" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={
                      user.profilePic ||
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-base-100" />
                  )}
                </div>

                <div className="hidden lg:flex flex-col text-left min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium truncate">{user.name}</div>

                    <div className="flex items-center gap-2">
                      {unread > 0 && (
                        <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                          {unread}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-zinc-400 truncate">
                    {lastMsg || (isOnline ? "Online" : "Offline")}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
