import { X } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "../store/useChatStore";

const NewChatModel = ({ onClose }) => {
  const { users, setSelectedUser } = useChatStore();
  const [query, setQuery] = useState("");

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-xl w-11/12 max-w-md p-5 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Start New Chat</h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-base-200">
            <X />
          </button>
        </div>

        {/* Search */}
        <input
          className="input input-sm w-full mb-4"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Users List */}
        <div className="max-h-72 overflow-y-auto space-y-2">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                onClose();
              }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 cursor-pointer"
            >
              <img
                src={
                  user.profilePic ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="min-w-0">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-xs text-zinc-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default NewChatModel;
