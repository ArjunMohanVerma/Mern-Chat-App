import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex items-center justify-center h-full bg-base-100">
      <div className="text-center flex flex-col items-center">

        {/* ✅ Visible icon */}
        <div className="mb-4 p-4 bg-primary/10 rounded-full animate-float">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>

        <h2 className="text-2xl font-bold mb-2">
          Welcome to Chatty!
        </h2>

        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;