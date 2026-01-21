import "./App.css";
import Sidebar from "./Components/Sidebar";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import RobotStatus from "./Pages/RobotStatus";
import StudentLogs from "./Pages/StudentLogs";
import Reports from "./Pages/Reports";
import ContentManagement from "./Pages/ContentManagement";
import Settings from "./Pages/Settings";

function App() {
  return (
    <Router>
      <div className="appLayout">
        <Sidebar />

        <div className="mainContent">
          <Routes>
            <Route path="/" element={<Navigate to="/robotstatus" replace />} />
            <Route path="/robotstatus" element={<RobotStatus />} />
            <Route path="/studentlogs" element={<StudentLogs />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/contentmanagement" element={<ContentManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}


export default App;
