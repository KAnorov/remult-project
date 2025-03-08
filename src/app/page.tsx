"use client";
import Tile from "../demo/Tile";
import Auth from "../demo/auth/Auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TasksPage from "./api/tasks/page";

export default function Home() {
  return (
    <div className="tiles">
      <Auth />

      <Tile
        title="remult-project"
        subtitle=""
        icon="remult"
        className="intro"
        status="Success"
        width="half"
      >
        <div className="tile__subtitle">Technology Stack Info:</div>
        <div className="intro__stack">
          <div className="intro__stack-item">
            <span>Framework</span>
            Next.js
          </div>
          <div className="intro__stack-item">
            <span>Database</span>
            JSON Files
          </div>
          <div className="intro__stack-item">
            <span>Auth</span>
            auth.js
          </div>
        </div>
      </Tile>

      <TasksPage />

      <ToastContainer
        
      />
    </div>
  );
}