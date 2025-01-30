import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import CommuteCalculator from "../components/CommuteCalculator";
import Navigation from "../components/Navigation";
import UserProfile from "../components/UserProfile";
import UserStats from "../components/UserStats";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("calc");

  return (
    <div className="dashboard">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="dashboard-content">
        <AnimatePresence mode="wait">
          {activeTab === "calc" && <CommuteCalculator />}
          {activeTab === "stats" && <UserStats />}
          {activeTab === "profile" && <UserProfile />}
        </AnimatePresence>
      </main>
    </div>
  );
}
