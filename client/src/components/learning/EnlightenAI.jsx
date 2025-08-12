import axiosInstance from "@/config/axiosConfig";
import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useState } from "react";
import toast from "react-hot-toast";

function EnlightenAI() {
  const [messages, setMessages] = useState([
    {
      message: "Ask Enlighten Anything!",
      sender: "ChatGPT",
      direction: "incoming",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      sender: "user",
      direction: "outgoing", // User messages on the right
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setIsTyping(true);
    await processMessageToChatGPT([...messages, newMessage]);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((msg) => ({
      role: msg.sender === "ChatGPT" ? "assistant" : "user",
      content: msg.message,
    }));

    try {
      const response = await axiosInstance.post(`/learning/AI-tutor`, {
        apiMessages,
      });

      const { tutorResponse } = response.data;
      if (tutorResponse) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: tutorResponse,
            sender: "ChatGPT",
            direction: "incoming",
          },
        ]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="App">
      <div style={{ position: "relative", height: "600px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="Enlighten is typing..." />
                ) : null
              }
            >
              {messages.map((msg, index) => (
                <Message key={index} model={msg} />
              ))}
            </MessageList>
            <MessageInput
              placeholder="Type message here..."
              onSend={handleSend}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default EnlightenAI;
