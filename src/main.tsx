import ReactDOM from "react-dom/client";
import { ReactFlowProvider } from "reactflow";
import "./index.css";
import ChatBotFlow from "./ChatBotFlow";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ReactFlowProvider>
    <ChatBotFlow />
  </ReactFlowProvider>
);