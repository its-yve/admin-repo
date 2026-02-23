import React, { useState } from "react";
import "../App.css";

import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import SyncIcon from "@mui/icons-material/Sync";
import PlaceIcon from "@mui/icons-material/Place";
import SensorsIcon from "@mui/icons-material/Sensors";
import MicIcon from "@mui/icons-material/Mic";
import SecurityIcon from "@mui/icons-material/Security";
import MemoryIcon from "@mui/icons-material/Memory";
import SpeedIcon from "@mui/icons-material/Speed";

import lily from "../assets/lily.png";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

function RobotStatus() {
  const [activeTab, setActiveTab] = useState("overview");

  /* ================= SYSTEM STATUS ================= */
  const status = {
    online: true,
    wifi: "Strong",
    lastSync: "2 minutes ago",
    mode: "Patrol",
    location: "Lobby",
    obstacle: false,
    microphone: true
  };

  /* ================= HARDWARE PERFORMANCE ================= */
  const [hardware] = useState({
    power: {
      battery: 78,
      efficiency: 89
    },
    compute: {
      cpu: 32,
      gpu: 18,
      ramUsed: 2.1,
      ramTotal: 4
    },
    thermals: {
      cpuTemp: 58,
      estimatedRuntime: 3.2
    },
    storage: {
      used: 18,
      total: 64,
      health: "Healthy"
    },
    cpuHistory: [
      { time: "-30", value: 65 },
      { time: "-25", value: 70 },
      { time: "-20", value: 68 },
      { time: "-15", value: 75 },
      { time: "-10", value: 72 },
      { time: "-5", value: 80 },
      { time: "Now", value: 85 }
    ],
    gpuHistory: [
      { time: "-30", value: 55 },
      { time: "-25", value: 60 },
      { time: "-20", value: 62 },
      { time: "-15", value: 58 },
      { time: "-10", value: 65 },
      { time: "-5", value: 72 },
      { time: "Now", value: 78 }
    ]
  });

  /* ================= ANALYTICS ================= */
  const interactionData = [
    { day: "Mon", value: 45 },
    { day: "Tue", value: 52 },
    { day: "Wed", value: 78 },
    { day: "Thu", value: 63 },
    { day: "Fri", value: 88 },
    { day: "Sat", value: 24 },
    { day: "Sun", value: 18 }
  ];

  const emotionData = [
    { name: "Neutral", value: 500, color: "#22c55e" },
    { name: "Happy", value: 250, color: "#fbbf24" },
    { name: "Sad", value: 610, color: "#3b82f6" }
  ];

  return (
    <div className="page">
      <h1>Robot Status</h1>

      <div className="logsHeaderInfo">
        <p className="logsDescription">
          Real-time operation, interaction analytics, and diagnostics
        </p>
      </div>

      {/* ================= TABS ================= */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          System Overview
        </button>

        <button
          className={`tab ${activeTab === "hardware" ? "active" : ""}`}
          onClick={() => setActiveTab("hardware")}
        >
          Hardware Performance
        </button>
      </div>

      <div className="tabsDivider"></div>

      {/* ================= SYSTEM OVERVIEW ================= */}
      {activeTab === "overview" && (
        <>
          <h3 className="sectionTitle">Connectivity</h3>

          <div className="cardGrid">
            <div className="statusCard">
              <div className="cardHeader">
                <span>Connection Status</span>
                <div className={`statusIcon ${status.online ? "online" : "offline"}`}>
                  {status.online ? <WifiIcon /> : <WifiOffIcon />}
                </div>
              </div>
              <h2>{status.online ? "Online" : "Offline"}</h2>
              <p>Connected via Wi-Fi</p>
            </div>

            <div className="statusCard">
              <div className="cardHeader">
                <span>Wi-Fi Signal</span>
                <div className="statusIcon online">
                  <WifiIcon />
                </div>
              </div>
              <h2>{status.wifi}</h2>
              <p>Full signal strength</p>
            </div>

            <div className="statusCard">
              <div className="cardHeader">
                <span>Last Sync</span>
                <div className="statusIcon online">
                  <SyncIcon />
                </div>
              </div>
              <h2>{status.lastSync}</h2>
              <p>Jan 16, 2026 · 1:00 PM</p>
            </div>
          </div>

          <h3 className="sectionTitle">Navigation & Detection</h3>

          <div className="cardGrid">
            <div className="statusCard">
              <div className="cardHeader">
                <span>Current Mode</span>
                <div className="statusIcon online">
                  <SecurityIcon />
                </div>
              </div>
              <h2>{status.mode}</h2>
              <p>Patrol mode active</p>
            </div>

            <div className="statusCard">
              <div className="cardHeader">
                <span>Location</span>
                <div className="statusIcon online">
                  <PlaceIcon />
                </div>
              </div>
              <h2>{status.location}</h2>
              <p>Last updated position</p>
            </div>

            <div className="statusCard">
              <div className="cardHeader">
                <span>Infrared Sensor</span>
                <div className="statusIcon online">
                  <SensorsIcon />
                </div>
              </div>
              <h2>{status.obstacle ? "Obstacle" : "No Obstacle"}</h2>
              <p>Clear path ahead</p>
            </div>

            <div className="statusCard">
              <div className="cardHeader">
                <span>Microphone</span>
                <div className="statusIcon online">
                  <MicIcon />
                </div>
              </div>
              <h2>Active</h2>
              <p>Audio monitoring enabled</p>
            </div>
          </div>

          <h3 className="sectionTitle">Interaction Analytics</h3>

          <div className="analyticsGrid">
            <div className="analyticsCard">
              <h4>Daily Interactions</h4>

              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={interactionData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#9f1239"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="analyticsCard">
              <h4>Emotion Distribution</h4>

              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={emotionData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {emotionData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

 {/* ================= HARDWARE PERFORMANCE ================= */}
{activeTab === "hardware" && (
  <div className="hardwareLayout">
    {/* LEFT COLUMN */}
    <div className="hardwareColumn">
      {/* POWER */}
      <div className="hardwareCard fixedCard">
        <div className="cardHeader">
          <span>Power</span>
          <SpeedIcon />
        </div>

        <h2>{hardware.power.battery}%</h2>
        <p>Battery Level</p>

        <div className="progressBar">
          <div
            className="progressFill"
            style={{ width: `${hardware.power.battery}%` }}
          />
        </div>

        <div className="cardFooter">
          <span>Energy Efficiency</span>
          <strong>{hardware.power.efficiency}%</strong>
        </div>
      </div>

      {/* COMPUTE */}
      <div className="hardwareCard fixedCard">
        <div className="cardHeader">
          <span>Compute</span>
          <MemoryIcon />
        </div>

        <div className="metricBlock">
          <div className="metricRow">
            <span>CPU Usage</span>
            <strong>{hardware.compute.cpu}%</strong>
          </div>
          <div className="progressBar">
            <div
              className="progressFill"
              style={{ width: `${hardware.compute.cpu}%` }}
            />
          </div>
        </div>

        <div className="metricBlock">
          <div className="metricRow">
            <span>GPU Usage</span>
            <strong>{hardware.compute.gpu}%</strong>
          </div>
          <div className="progressBar">
            <div
              className="progressFill"
              style={{ width: `${hardware.compute.gpu}%` }}
            />
          </div>
        </div>

        <div className="metricBlock">
          <div className="metricRow">
            <span>RAM Usage</span>
            <strong>
              {hardware.compute.ramUsed} / {hardware.compute.ramTotal} GB
            </strong>
          </div>
          <div className="progressBar">
            <div
              className="progressFill"
              style={{
                width: `${
                  (hardware.compute.ramUsed / hardware.compute.ramTotal) * 100
                }%`
              }}
            />
          </div>
        </div>
      </div>

      {/* THERMALS */}
      <div className="hardwareCard fixedCard">
        <div className="cardHeader">
          <span>Thermals</span>
          <SensorsIcon />
        </div>

        <h2>{hardware.thermals.cpuTemp}°C</h2>
        <p>CPU Temperature</p>

        <div className="progressBar">
          <div
            className="progressFill"
            style={{ width: `${hardware.thermals.cpuTemp}%` }}
          />
        </div>

        <small>Estimated Runtime: ~{hardware.thermals.estimatedRuntime} hrs</small>
      </div>
    </div>

    {/* CENTER ROBOT */}
    <div className="robotCenter">
      <img src={lily} alt="Lily Robot" />
    </div>

    {/* RIGHT COLUMN */}
    <div className="hardwareColumn">
      {/* STORAGE */}
      <div className="hardwareCard fixedCard">
        <div className="cardHeader">
          <span>Storage</span>
          <MemoryIcon />
        </div>

        <h2>
          {hardware.storage.used} / {hardware.storage.total} GB
        </h2>

        <div className="progressBar">
          <div
            className="progressFill"
            style={{
              width: `${
                (hardware.storage.used / hardware.storage.total) * 100
              }%`
            }}
          />
        </div>

        <p className="statusHealthy">● {hardware.storage.health}</p>
      </div>

      {/* CPU CHART */}
      <div className="hardwareCard fixedCard chartCard">
        <h4>CPU Usage (Last 30 minutes)</h4>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={hardware.cpuHistory}>
            <XAxis dataKey="time" hide />
            <YAxis hide />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#fbbf24"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* GPU CHART */}
      <div className="hardwareCard fixedCard chartCard">
        <h4>GPU Usage During Interaction</h4>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={hardware.gpuHistory}>
            <XAxis dataKey="time" hide />
            <YAxis hide />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
)}



    </div>
  );
}

export default RobotStatus;
