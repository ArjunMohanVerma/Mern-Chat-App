import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    // ✅ FIXED navbar overlap
    <div className="h-full overflow:hidden bg-base-200">
      <div className="h-full flex justify-center">
        <div className="bg-base-100 w-full max-w-6xl h-full flex overflow-hidden rounded-lg">

          {/* ✅ Mobile + Tablet */}
          <div className="block lg:hidden w-full h-full">
            {!selectedUser ? <Sidebar /> : <ChatContainer />}
          </div>

          {/* ✅ Desktop */}
          <div className="hidden lg:flex w-full h-full">

            {/* ❌ removed extra border here */}
            <div className="w-1/3 h-full">
              <Sidebar />
            </div>

            <div className="w-2/3 h-full flex">
              {selectedUser ? <ChatContainer /> : <NoChatSelected />}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;