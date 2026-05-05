import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4 h-full">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-full overflow-hidden">

          {/* 📱 Mobile + Tablet (<1024px) */}
          <div className="block lg:hidden h-full">
            {!selectedUser ? <Sidebar /> : <ChatContainer />}
          </div>

          {/* 💻 Desktop (≥1024px) */}
          <div className="hidden lg:flex h-full">
            <div className="w-1/3 border-r">
              <Sidebar />
            </div>

            <div className="w-2/3">
              {selectedUser ? <ChatContainer /> : <NoChatSelected />}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;