import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import { useChatStore } from "../store/useChatStore";

const Home = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-7xl h-[90vh] overflow-hidden animate-fadeIn">
        <div className="flex h-full">
          <Sidebar />

          <div className="flex-1 flex flex-col bg-base-100">
            {!selectedUser ? (
              <NoChatSelected />
            ) : (
              <ChatContainer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
