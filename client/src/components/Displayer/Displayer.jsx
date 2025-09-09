"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../Theme/ThemeProvider";
import MapComponent from "./MapComponent.jsx";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const lineData = [
  { name: "Jan", value: 40 },
  { name: "Feb", value: 30 },
  { name: "Mar", value: 60 },
  { name: "Apr", value: 80 },
  { name: "May", value: 50 },
];

const barData = [
  { name: "A", value: 12 },
  { name: "B", value: 19 },
  { name: "C", value: 8 },
  { name: "D", value: 15 },
];

const pieData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const COLORS = ["#dc2626", "#f97316", "#3b82f6", "#10b981"];

const Displayer = () => {
  const { theme } = useTheme();
  const [chartType, setChartType] = useState("line"); // line, bar, pie

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <XAxis dataKey="name" stroke="var(--text)" />
              <YAxis stroke="var(--text)" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="var(--text)" />
              <YAxis stroke="var(--text)" />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100}>
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Chat Section */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="flex-[4] border-r border-[var(--border)] flex flex-col"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--text)",
        }}
      >
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-[var(--card-bg)] text-[var(--text)] shadow rounded-2xl p-4 max-w-lg">
            👋 Hi! I’m your AI assistant. How can I help you today?
          </div>
          <div className="bg-[var(--primary)] text-white shadow rounded-2xl p-4 max-w-lg ml-auto">
            Show me the latest data visualization.
          </div>
        </div>
        <div className="border-t border-[var(--border)] p-4 flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 rounded-xl px-4 py-2 bg-[var(--input-bg)] text-[var(--text)] outline-none"
          />
          <button className="bg-[var(--button-bg)] text-white rounded-xl px-4 py-2 hover:opacity-90">
            Send
          </button>
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="flex-[3] flex flex-col overflow-hidden"
      >
        {/* Map Section */}
        <div
          className="flex-[5] border-b border-[var(--border)]"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          <MapComponent />
        </div>

        {/* Visualization Section */}
        <div
          className="flex-[5] flex flex-col p-4 overflow-y-auto"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          {/* Chart Container */}
          <div className="bg-[var(--background)] shadow-lg rounded-2xl p-4 flex flex-col items-center justify-center flex-1">
            {renderChart()}
          </div>

          {/* Controls */}
          <div className="mt-4 flex justify-center gap-4">
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${
                chartType === "line"
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--secondary-bg)] text-[var(--text)]"
              }`}
              onClick={() => setChartType("line")}
            >
              Line
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${
                chartType === "bar"
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--secondary-bg)] text-[var(--text)]"
              }`}
              onClick={() => setChartType("bar")}
            >
              Bar
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${
                chartType === "pie"
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--secondary-bg)] text-[var(--text)]"
              }`}
              onClick={() => setChartType("pie")}
            >
              Pie
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Displayer;
