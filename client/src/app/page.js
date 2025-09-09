"use client";

import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Loader } from "@googlemaps/js-api-loader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Send,
  MapPin,
  Thermometer,
  Droplets,
  Navigation,
  Menu,
  Bell,
  User,
  Settings,
  HelpCircle,
  Activity,
  Database,
  BarChart3,
  Waves,
} from "lucide-react";
// import { marked } from "marked";
// import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

// Realistic ARGO float data with ocean coordinates - expanded dataset
const dummyFloats = [
  {
    id: 1,
    name: "ARGO-7900556",
    lat: 18.521,
    lng: 67.342,
    temperature: 28.7,
    salinity: 35.8,
    pressure: 10.5,
    status: "active",
    lastUpdate: "2024-01-07 14:30",
    batteryLevel: 85,
    dataPoints: 1247,
    deploymentDate: "2023-03-15",
    cycleNumber: 89,
    profilesCompleted: 156,
    maxDepth: 2000,
    timeSeriesData: [
      { date: "Dec 25", temperature: 29.1, salinity: 35.6, pressure: 9.8 },
      { date: "Dec 26", temperature: 29.0, salinity: 35.7, pressure: 10.1 },
      { date: "Dec 27", temperature: 28.8, salinity: 35.6, pressure: 10.3 },
      { date: "Dec 28", temperature: 28.9, salinity: 35.8, pressure: 10.0 },
      { date: "Dec 29", temperature: 28.6, salinity: 35.9, pressure: 10.4 },
      { date: "Dec 30", temperature: 28.7, salinity: 35.7, pressure: 10.6 },
      { date: "Dec 31", temperature: 28.9, salinity: 35.7, pressure: 10.2 },
      { date: "Jan 01", temperature: 28.9, salinity: 35.7, pressure: 10.2 },
      { date: "Jan 02", temperature: 28.6, salinity: 35.8, pressure: 10.5 },
      { date: "Jan 03", temperature: 28.7, salinity: 35.6, pressure: 10.8 },
      { date: "Jan 04", temperature: 28.5, salinity: 35.9, pressure: 11.2 },
      { date: "Jan 05", temperature: 28.2, salinity: 35.8, pressure: 11.5 },
      { date: "Jan 06", temperature: 28.1, salinity: 35.7, pressure: 11.8 },
      { date: "Jan 07", temperature: 28.7, salinity: 35.8, pressure: 10.5 },
    ],
    depthProfileData: [
      {
        depth: 0,
        temperature: 28.7,
        salinity: 35.8,
        density: 1023.2,
        oxygen: 4.8,
      },
      {
        depth: 10,
        temperature: 27.9,
        salinity: 35.9,
        density: 1023.5,
        oxygen: 4.6,
      },
      {
        depth: 20,
        temperature: 26.3,
        salinity: 36.1,
        density: 1024.1,
        oxygen: 4.3,
      },
      {
        depth: 30,
        temperature: 24.8,
        salinity: 36.3,
        density: 1024.8,
        oxygen: 4.0,
      },
      {
        depth: 50,
        temperature: 21.5,
        salinity: 36.7,
        density: 1026.2,
        oxygen: 3.5,
      },
      {
        depth: 75,
        temperature: 18.9,
        salinity: 36.9,
        density: 1027.1,
        oxygen: 3.1,
      },
      {
        depth: 100,
        temperature: 16.2,
        salinity: 37.0,
        density: 1027.8,
        oxygen: 2.8,
      },
      {
        depth: 150,
        temperature: 12.8,
        salinity: 37.1,
        density: 1028.9,
        oxygen: 2.4,
      },
      {
        depth: 200,
        temperature: 9.7,
        salinity: 37.2,
        density: 1029.5,
        oxygen: 2.1,
      },
      {
        depth: 300,
        temperature: 6.8,
        salinity: 37.0,
        density: 1030.1,
        oxygen: 1.9,
      },
      {
        depth: 500,
        temperature: 4.2,
        salinity: 36.8,
        density: 1030.8,
        oxygen: 1.7,
      },
      {
        depth: 750,
        temperature: 2.8,
        salinity: 36.5,
        density: 1031.2,
        oxygen: 1.5,
      },
      {
        depth: 1000,
        temperature: 2.1,
        salinity: 36.2,
        density: 1031.5,
        oxygen: 1.4,
      },
    ],
  },
  {
    id: 2,
    name: "ARGO-7900567",
    lat: 19.234,
    lng: 68.921,
    temperature: 27.9,
    salinity: 35.3,
    pressure: 15.8,
    status: "active",
    lastUpdate: "2024-01-07 14:25",
    batteryLevel: 72,
    dataPoints: 1098,
    deploymentDate: "2023-05-22",
    cycleNumber: 72,
    profilesCompleted: 134,
    maxDepth: 1800,
    timeSeriesData: [
      { date: "Dec 25", temperature: 28.4, salinity: 35.1, pressure: 15.2 },
      { date: "Dec 26", temperature: 28.1, salinity: 35.3, pressure: 15.5 },
      { date: "Dec 27", temperature: 28.3, salinity: 35.2, pressure: 15.7 },
      { date: "Dec 28", temperature: 28.0, salinity: 35.4, pressure: 15.4 },
      { date: "Dec 29", temperature: 27.8, salinity: 35.5, pressure: 15.9 },
      { date: "Dec 30", temperature: 27.9, salinity: 35.3, pressure: 16.1 },
      { date: "Dec 31", temperature: 28.1, salinity: 35.2, pressure: 15.6 },
      { date: "Jan 01", temperature: 28.2, salinity: 35.2, pressure: 15.6 },
      { date: "Jan 02", temperature: 27.9, salinity: 35.4, pressure: 15.9 },
      { date: "Jan 03", temperature: 28.1, salinity: 35.3, pressure: 16.2 },
      { date: "Jan 04", temperature: 27.8, salinity: 35.5, pressure: 16.5 },
      { date: "Jan 05", temperature: 27.6, salinity: 35.4, pressure: 16.8 },
      { date: "Jan 06", temperature: 27.5, salinity: 35.3, pressure: 17.1 },
      { date: "Jan 07", temperature: 27.9, salinity: 35.3, pressure: 15.8 },
    ],
    depthProfileData: [
      {
        depth: 0,
        temperature: 27.9,
        salinity: 35.3,
        density: 1022.8,
        oxygen: 4.9,
      },
      {
        depth: 10,
        temperature: 27.2,
        salinity: 35.4,
        density: 1023.2,
        oxygen: 4.7,
      },
      {
        depth: 20,
        temperature: 25.8,
        salinity: 35.6,
        density: 1023.9,
        oxygen: 4.4,
      },
      {
        depth: 30,
        temperature: 24.3,
        salinity: 35.8,
        density: 1024.6,
        oxygen: 4.1,
      },
      {
        depth: 50,
        temperature: 21.2,
        salinity: 36.2,
        density: 1026.0,
        oxygen: 3.6,
      },
      {
        depth: 75,
        temperature: 18.6,
        salinity: 36.4,
        density: 1026.9,
        oxygen: 3.2,
      },
      {
        depth: 100,
        temperature: 15.9,
        salinity: 36.5,
        density: 1027.6,
        oxygen: 2.9,
      },
      {
        depth: 150,
        temperature: 12.5,
        salinity: 36.6,
        density: 1028.7,
        oxygen: 2.5,
      },
      {
        depth: 200,
        temperature: 9.4,
        salinity: 36.7,
        density: 1029.3,
        oxygen: 2.2,
      },
      {
        depth: 300,
        temperature: 6.5,
        salinity: 36.5,
        density: 1029.9,
        oxygen: 2.0,
      },
      {
        depth: 500,
        temperature: 3.9,
        salinity: 36.3,
        density: 1030.6,
        oxygen: 1.8,
      },
      {
        depth: 750,
        temperature: 2.5,
        salinity: 36.0,
        density: 1031.0,
        oxygen: 1.6,
      },
      {
        depth: 1000,
        temperature: 1.8,
        salinity: 35.7,
        density: 1031.3,
        oxygen: 1.5,
      },
    ],
  },
  {
    id: 3,
    name: "ARGO-7900578",
    lat: 17.876,
    lng: 66.543,
    temperature: 29.2,
    salinity: 36.2,
    pressure: 12.7,
    status: "inactive",
    lastUpdate: "2024-01-05 09:15",
    batteryLevel: 23,
    dataPoints: 856,
    deploymentDate: "2023-01-08",
    cycleNumber: 45,
    profilesCompleted: 98,
    maxDepth: 1500,
    timeSeriesData: [
      { date: "Dec 30", temperature: 29.6, salinity: 36.0, pressure: 12.1 },
      { date: "Dec 31", temperature: 29.4, salinity: 36.1, pressure: 12.4 },
      { date: "Jan 01", temperature: 29.5, salinity: 36.1, pressure: 12.3 },
      { date: "Jan 02", temperature: 29.3, salinity: 36.2, pressure: 12.6 },
      { date: "Jan 03", temperature: 29.4, salinity: 36.0, pressure: 12.9 },
      { date: "Jan 04", temperature: 29.1, salinity: 36.3, pressure: 13.2 },
      { date: "Jan 05", temperature: 29.2, salinity: 36.2, pressure: 12.7 },
    ],
    depthProfileData: [
      {
        depth: 0,
        temperature: 29.2,
        salinity: 36.2,
        density: 1023.6,
        oxygen: 4.5,
      },
      {
        depth: 10,
        temperature: 28.5,
        salinity: 36.3,
        density: 1024.0,
        oxygen: 4.3,
      },
      {
        depth: 20,
        temperature: 26.9,
        salinity: 36.5,
        density: 1024.7,
        oxygen: 4.0,
      },
      {
        depth: 30,
        temperature: 25.3,
        salinity: 36.7,
        density: 1025.4,
        oxygen: 3.7,
      },
      {
        depth: 50,
        temperature: 22.1,
        salinity: 37.1,
        density: 1026.8,
        oxygen: 3.2,
      },
      {
        depth: 75,
        temperature: 19.5,
        salinity: 37.3,
        density: 1027.7,
        oxygen: 2.8,
      },
      {
        depth: 100,
        temperature: 16.8,
        salinity: 37.4,
        density: 1028.4,
        oxygen: 2.5,
      },
      {
        depth: 150,
        temperature: 13.4,
        salinity: 37.5,
        density: 1029.5,
        oxygen: 2.1,
      },
      {
        depth: 200,
        temperature: 10.3,
        salinity: 37.6,
        density: 1030.1,
        oxygen: 1.8,
      },
      {
        depth: 300,
        temperature: 7.4,
        salinity: 37.4,
        density: 1030.7,
        oxygen: 1.6,
      },
      {
        depth: 500,
        temperature: 4.8,
        salinity: 37.2,
        density: 1031.4,
        oxygen: 1.4,
      },
    ],
  },
  {
    id: 4,
    name: "ARGO-7900589",
    lat: 18.765,
    lng: 69.432,
    temperature: 28.4,
    salinity: 35.1,
    pressure: 18.9,
    status: "active",
    lastUpdate: "2024-01-07 14:35",
    batteryLevel: 91,
    dataPoints: 1512,
    deploymentDate: "2022-11-30",
    cycleNumber: 108,
    profilesCompleted: 187,
    maxDepth: 2200,
    timeSeriesData: [
      { date: "Dec 25", temperature: 28.9, salinity: 34.9, pressure: 18.0 },
      { date: "Dec 26", temperature: 28.6, salinity: 35.1, pressure: 18.3 },
      { date: "Dec 27", temperature: 28.8, salinity: 35.0, pressure: 18.6 },
      { date: "Dec 28", temperature: 28.5, salinity: 35.2, pressure: 18.2 },
      { date: "Dec 29", temperature: 28.3, salinity: 35.3, pressure: 18.8 },
      { date: "Dec 30", temperature: 28.2, salinity: 35.1, pressure: 19.1 },
      { date: "Dec 31", temperature: 28.4, salinity: 35.0, pressure: 18.7 },
      { date: "Jan 01", temperature: 28.7, salinity: 35.0, pressure: 18.4 },
      { date: "Jan 02", temperature: 28.5, salinity: 35.2, pressure: 18.7 },
      { date: "Jan 03", temperature: 28.6, salinity: 35.1, pressure: 19.0 },
      { date: "Jan 04", temperature: 28.3, salinity: 35.3, pressure: 19.3 },
      { date: "Jan 05", temperature: 28.2, salinity: 35.2, pressure: 19.6 },
      { date: "Jan 06", temperature: 28.1, salinity: 35.1, pressure: 19.9 },
      { date: "Jan 07", temperature: 28.4, salinity: 35.1, pressure: 18.9 },
    ],
    depthProfileData: [
      {
        depth: 0,
        temperature: 28.4,
        salinity: 35.1,
        density: 1022.5,
        oxygen: 5.1,
      },
      {
        depth: 10,
        temperature: 27.7,
        salinity: 35.2,
        density: 1022.9,
        oxygen: 4.9,
      },
      {
        depth: 20,
        temperature: 26.1,
        salinity: 35.4,
        density: 1023.6,
        oxygen: 4.6,
      },
      {
        depth: 30,
        temperature: 24.6,
        salinity: 35.6,
        density: 1024.3,
        oxygen: 4.3,
      },
      {
        depth: 50,
        temperature: 21.4,
        salinity: 36.0,
        density: 1025.7,
        oxygen: 3.8,
      },
      {
        depth: 75,
        temperature: 18.8,
        salinity: 36.2,
        density: 1026.6,
        oxygen: 3.4,
      },
      {
        depth: 100,
        temperature: 16.1,
        salinity: 36.3,
        density: 1027.3,
        oxygen: 3.1,
      },
      {
        depth: 150,
        temperature: 12.7,
        salinity: 36.4,
        density: 1028.4,
        oxygen: 2.7,
      },
      {
        depth: 200,
        temperature: 9.6,
        salinity: 36.5,
        density: 1029.0,
        oxygen: 2.4,
      },
      {
        depth: 300,
        temperature: 6.7,
        salinity: 36.3,
        density: 1029.6,
        oxygen: 2.2,
      },
      {
        depth: 500,
        temperature: 4.1,
        salinity: 36.1,
        density: 1030.3,
        oxygen: 2.0,
      },
      {
        depth: 750,
        temperature: 2.7,
        salinity: 35.8,
        density: 1030.7,
        oxygen: 1.8,
      },
      {
        depth: 1000,
        temperature: 2.0,
        salinity: 35.5,
        density: 1031.0,
        oxygen: 1.7,
      },
      {
        depth: 1500,
        temperature: 1.5,
        salinity: 35.2,
        density: 1031.4,
        oxygen: 1.6,
      },
    ],
  },
  {
    id: 5,
    name: "ARGO-7900590",
    lat: 19.543,
    lng: 67.891,
    temperature: 27.8,
    salinity: 35.9,
    pressure: 9.9,
    status: "active",
    lastUpdate: "2024-01-07 14:28",
    batteryLevel: 67,
    dataPoints: 1203,
    deploymentDate: "2023-04-18",
    cycleNumber: 64,
    profilesCompleted: 142,
    maxDepth: 1900,
    timeSeriesData: [
      { date: "Dec 25", temperature: 28.3, salinity: 35.7, pressure: 9.2 },
      { date: "Dec 26", temperature: 28.0, salinity: 35.8, pressure: 9.5 },
      { date: "Dec 27", temperature: 28.2, salinity: 35.6, pressure: 9.8 },
      { date: "Dec 28", temperature: 27.9, salinity: 35.9, pressure: 9.4 },
      { date: "Dec 29", temperature: 27.7, salinity: 36.0, pressure: 10.1 },
      { date: "Dec 30", temperature: 27.6, salinity: 35.8, pressure: 10.4 },
      { date: "Dec 31", temperature: 27.8, salinity: 35.7, pressure: 10.0 },
      { date: "Jan 01", temperature: 28.1, salinity: 35.8, pressure: 9.6 },
      { date: "Jan 02", temperature: 27.9, salinity: 35.9, pressure: 9.9 },
      { date: "Jan 03", temperature: 28.0, salinity: 35.7, pressure: 10.2 },
      { date: "Jan 04", temperature: 27.7, salinity: 36.0, pressure: 10.5 },
      { date: "Jan 05", temperature: 27.6, salinity: 35.9, pressure: 10.8 },
      { date: "Jan 06", temperature: 27.5, salinity: 35.8, pressure: 11.1 },
      { date: "Jan 07", temperature: 27.8, salinity: 35.9, pressure: 9.9 },
    ],
    depthProfileData: [
      {
        depth: 0,
        temperature: 27.8,
        salinity: 35.9,
        density: 1023.4,
        oxygen: 4.7,
      },
      {
        depth: 10,
        temperature: 27.1,
        salinity: 36.0,
        density: 1023.8,
        oxygen: 4.5,
      },
      {
        depth: 20,
        temperature: 25.5,
        salinity: 36.2,
        density: 1024.5,
        oxygen: 4.2,
      },
      {
        depth: 30,
        temperature: 24.0,
        salinity: 36.4,
        density: 1025.2,
        oxygen: 3.9,
      },
      {
        depth: 50,
        temperature: 20.8,
        salinity: 36.8,
        density: 1026.6,
        oxygen: 3.4,
      },
      {
        depth: 75,
        temperature: 18.2,
        salinity: 37.0,
        density: 1027.5,
        oxygen: 3.0,
      },
      {
        depth: 100,
        temperature: 15.5,
        salinity: 37.1,
        density: 1028.2,
        oxygen: 2.7,
      },
      {
        depth: 150,
        temperature: 12.1,
        salinity: 37.2,
        density: 1029.3,
        oxygen: 2.3,
      },
      {
        depth: 200,
        temperature: 9.0,
        salinity: 37.3,
        density: 1029.9,
        oxygen: 2.0,
      },
      {
        depth: 300,
        temperature: 6.1,
        salinity: 37.1,
        density: 1030.5,
        oxygen: 1.8,
      },
      {
        depth: 500,
        temperature: 3.5,
        salinity: 36.9,
        density: 1031.2,
        oxygen: 1.6,
      },
      {
        depth: 750,
        temperature: 2.1,
        salinity: 36.6,
        density: 1031.6,
        oxygen: 1.5,
      },
      {
        depth: 1000,
        temperature: 1.4,
        salinity: 36.3,
        density: 1031.9,
        oxygen: 1.4,
      },
    ],
  },
  {
    id: 6,
    name: "ARGO-7900601",
    lat: 20.123,
    lng: 69.765,
    temperature: 26.9,
    salinity: 34.8,
    pressure: 22.3,
    status: "active",
    lastUpdate: "2024-01-07 14:20",
    batteryLevel: 78,
    dataPoints: 1389,
    deploymentDate: "2023-02-14",
    cycleNumber: 95,
    profilesCompleted: 178,
    maxDepth: 2100,
    timeSeriesData: [
      { date: "Dec 25", temperature: 27.2, salinity: 34.6, pressure: 21.8 },
      { date: "Dec 26", temperature: 26.9, salinity: 34.7, pressure: 22.1 },
      { date: "Dec 27", temperature: 27.1, salinity: 34.5, pressure: 22.4 },
      { date: "Dec 28", temperature: 26.8, salinity: 34.8, pressure: 21.9 },
      { date: "Dec 29", temperature: 26.6, salinity: 34.9, pressure: 22.6 },
      { date: "Dec 30", temperature: 26.7, salinity: 34.7, pressure: 22.8 },
      { date: "Dec 31", temperature: 26.9, salinity: 34.6, pressure: 22.2 },
      { date: "Jan 01", temperature: 27.0, salinity: 34.7, pressure: 21.9 },
      { date: "Jan 02", temperature: 26.8, salinity: 34.8, pressure: 22.2 },
      { date: "Jan 03", temperature: 26.9, salinity: 34.6, pressure: 22.5 },
      { date: "Jan 04", temperature: 26.7, salinity: 34.9, pressure: 22.8 },
      { date: "Jan 05", temperature: 26.5, salinity: 34.8, pressure: 23.1 },
      { date: "Jan 06", temperature: 26.6, salinity: 34.7, pressure: 23.4 },
      { date: "Jan 07", temperature: 26.9, salinity: 34.8, pressure: 22.3 },
    ],
    depthProfileData: [
      {
        depth: 0,
        temperature: 26.9,
        salinity: 34.8,
        density: 1022.1,
        oxygen: 5.3,
      },
      {
        depth: 10,
        temperature: 26.2,
        salinity: 34.9,
        density: 1022.5,
        oxygen: 5.1,
      },
      {
        depth: 20,
        temperature: 24.6,
        salinity: 35.1,
        density: 1023.2,
        oxygen: 4.8,
      },
      {
        depth: 30,
        temperature: 23.1,
        salinity: 35.3,
        density: 1023.9,
        oxygen: 4.5,
      },
      {
        depth: 50,
        temperature: 19.9,
        salinity: 35.7,
        density: 1025.3,
        oxygen: 4.0,
      },
      {
        depth: 75,
        temperature: 17.3,
        salinity: 35.9,
        density: 1026.2,
        oxygen: 3.6,
      },
      {
        depth: 100,
        temperature: 14.6,
        salinity: 36.0,
        density: 1026.9,
        oxygen: 3.3,
      },
      {
        depth: 150,
        temperature: 11.2,
        salinity: 36.1,
        density: 1028.0,
        oxygen: 2.9,
      },
      {
        depth: 200,
        temperature: 8.1,
        salinity: 36.2,
        density: 1028.6,
        oxygen: 2.6,
      },
      {
        depth: 300,
        temperature: 5.2,
        salinity: 36.0,
        density: 1029.2,
        oxygen: 2.4,
      },
      {
        depth: 500,
        temperature: 2.6,
        salinity: 35.8,
        density: 1029.9,
        oxygen: 2.2,
      },
      {
        depth: 750,
        temperature: 1.2,
        salinity: 35.5,
        density: 1030.3,
        oxygen: 2.1,
      },
      {
        depth: 1000,
        temperature: 0.5,
        salinity: 35.2,
        density: 1030.6,
        oxygen: 2.0,
      },
    ],
  },
  {
    id: 7,
    name: "ARGO-7900612",
    lat: 16.789,
    lng: 68.234,
    temperature: 30.1,
    salinity: 36.8,
    pressure: 8.7,
    status: "active",
    lastUpdate: "2024-01-07 14:32",
    batteryLevel: 94,
    dataPoints: 1678,
    deploymentDate: "2022-09-12",
    cycleNumber: 125,
    profilesCompleted: 203,
    maxDepth: 2300,
    timeSeriesData: [
      { date: "Dec 25", temperature: 30.4, salinity: 36.6, pressure: 8.2 },
      { date: "Dec 26", temperature: 30.2, salinity: 36.7, pressure: 8.5 },
      { date: "Dec 27", temperature: 30.3, salinity: 36.5, pressure: 8.8 },
      { date: "Dec 28", temperature: 30.0, salinity: 36.8, pressure: 8.4 },
      { date: "Dec 29", temperature: 29.8, salinity: 36.9, pressure: 9.0 },
      { date: "Dec 30", temperature: 29.9, salinity: 36.7, pressure: 9.2 },
      { date: "Dec 31", temperature: 30.1, salinity: 36.6, pressure: 8.8 },
      { date: "Jan 01", temperature: 30.2, salinity: 36.7, pressure: 8.5 },
      { date: "Jan 02", temperature: 30.0, salinity: 36.8, pressure: 8.8 },
      { date: "Jan 03", temperature: 30.1, salinity: 36.6, pressure: 9.1 },
      { date: "Jan 04", temperature: 29.9, salinity: 36.9, pressure: 9.4 },
      { date: "Jan 05", temperature: 29.7, salinity: 36.8, pressure: 9.7 },
      { date: "Jan 06", temperature: 29.8, salinity: 36.7, pressure: 10.0 },
      { date: "Jan 07", temperature: 30.1, salinity: 36.8, pressure: 8.7 },
    ],
    depthProfileData: [
      {
        depth: 0,
        temperature: 30.1,
        salinity: 36.8,
        density: 1024.2,
        oxygen: 4.2,
      },
      {
        depth: 10,
        temperature: 29.4,
        salinity: 36.9,
        density: 1024.6,
        oxygen: 4.0,
      },
      {
        depth: 20,
        temperature: 27.8,
        salinity: 37.1,
        density: 1025.3,
        oxygen: 3.7,
      },
      {
        depth: 30,
        temperature: 26.2,
        salinity: 37.3,
        density: 1026.0,
        oxygen: 3.4,
      },
      {
        depth: 50,
        temperature: 23.0,
        salinity: 37.7,
        density: 1027.4,
        oxygen: 2.9,
      },
      {
        depth: 75,
        temperature: 20.4,
        salinity: 37.9,
        density: 1028.3,
        oxygen: 2.5,
      },
      {
        depth: 100,
        temperature: 17.7,
        salinity: 38.0,
        density: 1029.0,
        oxygen: 2.2,
      },
      {
        depth: 150,
        temperature: 14.3,
        salinity: 38.1,
        density: 1030.1,
        oxygen: 1.8,
      },
      {
        depth: 200,
        temperature: 11.2,
        salinity: 38.2,
        density: 1030.7,
        oxygen: 1.5,
      },
      {
        depth: 300,
        temperature: 8.3,
        salinity: 38.0,
        density: 1031.3,
        oxygen: 1.3,
      },
      {
        depth: 500,
        temperature: 5.7,
        salinity: 37.8,
        density: 1032.0,
        oxygen: 1.1,
      },
      {
        depth: 750,
        temperature: 4.3,
        salinity: 37.5,
        density: 1032.4,
        oxygen: 1.0,
      },
      {
        depth: 1000,
        temperature: 3.6,
        salinity: 37.2,
        density: 1032.7,
        oxygen: 0.9,
      },
      {
        depth: 1500,
        temperature: 2.9,
        salinity: 36.9,
        density: 1033.0,
        oxygen: 0.8,
      },
      {
        depth: 2000,
        temperature: 2.4,
        salinity: 36.6,
        density: 1033.3,
        oxygen: 0.7,
      },
    ],
  },
  {
    id: 8,
    name: "ARGO-7900623",
    lat: 17.432,
    lng: 67.123,
    temperature: 28.6,
    salinity: 35.4,
    pressure: 14.2,
    status: "maintenance",
    lastUpdate: "2024-01-06 11:45",
    batteryLevel: 45,
    dataPoints: 967,
    deploymentDate: "2023-06-07",
    cycleNumber: 58,
    profilesCompleted: 115,
    maxDepth: 1700,
    timeSeriesData: [
      { date: "Dec 29", temperature: 28.9, salinity: 35.2, pressure: 13.8 },
      { date: "Dec 30", temperature: 28.7, salinity: 35.3, pressure: 14.1 },
      { date: "Dec 31", temperature: 28.8, salinity: 35.1, pressure: 14.4 },
      { date: "Jan 01", temperature: 28.6, salinity: 35.4, pressure: 14.0 },
      { date: "Jan 02", temperature: 28.4, salinity: 35.5, pressure: 14.3 },
      { date: "Jan 03", temperature: 28.5, salinity: 35.3, pressure: 14.6 },
      { date: "Jan 04", temperature: 28.3, salinity: 35.6, pressure: 14.9 },
      { date: "Jan 05", temperature: 28.2, salinity: 35.5, pressure: 15.2 },
      { date: "Jan 06", temperature: 28.6, salinity: 35.4, pressure: 14.2 },
    ],
    depthProfileData: [
      {
        depth: 0,
        temperature: 28.6,
        salinity: 35.4,
        density: 1022.9,
        oxygen: 4.8,
      },
      {
        depth: 10,
        temperature: 27.9,
        salinity: 35.5,
        density: 1023.3,
        oxygen: 4.6,
      },
      {
        depth: 20,
        temperature: 26.3,
        salinity: 35.7,
        density: 1024.0,
        oxygen: 4.3,
      },
      {
        depth: 30,
        temperature: 24.8,
        salinity: 35.9,
        density: 1024.7,
        oxygen: 4.0,
      },
      {
        depth: 50,
        temperature: 21.6,
        salinity: 36.3,
        density: 1026.1,
        oxygen: 3.5,
      },
      {
        depth: 75,
        temperature: 19.0,
        salinity: 36.5,
        density: 1027.0,
        oxygen: 3.1,
      },
      {
        depth: 100,
        temperature: 16.3,
        salinity: 36.6,
        density: 1027.7,
        oxygen: 2.8,
      },
      {
        depth: 150,
        temperature: 12.9,
        salinity: 36.7,
        density: 1028.8,
        oxygen: 2.4,
      },
      {
        depth: 200,
        temperature: 9.8,
        salinity: 36.8,
        density: 1029.4,
        oxygen: 2.1,
      },
      {
        depth: 300,
        temperature: 6.9,
        salinity: 36.6,
        density: 1030.0,
        oxygen: 1.9,
      },
      {
        depth: 500,
        temperature: 4.3,
        salinity: 36.4,
        density: 1030.7,
        oxygen: 1.7,
      },
    ],
  },
  {
    id: 9,
    name: "ARGO-7900634",
    lat: 19.876,
    lng: 66.789,
    temperature: 27.3,
    salinity: 35.6,
    pressure: 16.8,
    status: "active",
    lastUpdate: "2024-01-07 14:27",
    batteryLevel: 83,
    dataPoints: 1334,
    deploymentDate: "2022-12-20",
    cycleNumber: 98,
    profilesCompleted: 167,
    maxDepth: 1950,
    timeSeriesData: [
      { date: "Dec 25", temperature: 27.6, salinity: 35.4, pressure: 16.3 },
      { date: "Dec 26", temperature: 27.4, salinity: 35.5, pressure: 16.6 },
      { date: "Dec 27", temperature: 27.5, salinity: 35.3, pressure: 16.9 },
      { date: "Dec 28", temperature: 27.2, salinity: 35.6, pressure: 16.5 },
      { date: "Dec 29", temperature: 27.0, salinity: 35.7, pressure: 17.1 },
      { date: "Dec 30", temperature: 27.1, salinity: 35.5, pressure: 17.3 },
      { date: "Dec 31", temperature: 27.3, salinity: 35.4, pressure: 16.9 },
      { date: "Jan 01", temperature: 27.4, salinity: 35.5, pressure: 16.6 },
      { date: "Jan 02", temperature: 27.2, salinity: 35.6, pressure: 16.9 },
      { date: "Jan 03", temperature: 27.3, salinity: 35.4, pressure: 17.2 },
      { date: "Jan 04", temperature: 27.1, salinity: 35.7, pressure: 17.5 },
      { date: "Jan 05", temperature: 26.9, salinity: 35.6, pressure: 17.8 },
      { date: "Jan 06", temperature: 27.0, salinity: 35.5, pressure: 18.1 },
      { date: "Jan 07", temperature: 27.3, salinity: 35.6, pressure: 16.8 },
    ],
    depthProfileData: [
      {
        depth: 0,
        temperature: 27.3,
        salinity: 35.6,
        density: 1023.1,
        oxygen: 4.9,
      },
      {
        depth: 10,
        temperature: 26.6,
        salinity: 35.7,
        density: 1023.5,
        oxygen: 4.7,
      },
      {
        depth: 20,
        temperature: 25.0,
        salinity: 35.9,
        density: 1024.2,
        oxygen: 4.4,
      },
      {
        depth: 30,
        temperature: 23.5,
        salinity: 36.1,
        density: 1024.9,
        oxygen: 4.1,
      },
      {
        depth: 50,
        temperature: 20.3,
        salinity: 36.5,
        density: 1026.3,
        oxygen: 3.6,
      },
      {
        depth: 75,
        temperature: 17.7,
        salinity: 36.7,
        density: 1027.2,
        oxygen: 3.2,
      },
      {
        depth: 100,
        temperature: 15.0,
        salinity: 36.8,
        density: 1027.9,
        oxygen: 2.9,
      },
      {
        depth: 150,
        temperature: 11.6,
        salinity: 36.9,
        density: 1029.0,
        oxygen: 2.5,
      },
      {
        depth: 200,
        temperature: 8.5,
        salinity: 37.0,
        density: 1029.6,
        oxygen: 2.2,
      },
      {
        depth: 300,
        temperature: 5.6,
        salinity: 36.8,
        density: 1030.2,
        oxygen: 2.0,
      },
      {
        depth: 500,
        temperature: 3.0,
        salinity: 36.6,
        density: 1030.9,
        oxygen: 1.8,
      },
      {
        depth: 750,
        temperature: 1.6,
        salinity: 36.3,
        density: 1031.3,
        oxygen: 1.7,
      },
      {
        depth: 1000,
        temperature: 0.9,
        salinity: 36.0,
        density: 1031.6,
        oxygen: 1.6,
      },
    ],
  },
  {
    id: 10,
    name: "ARGO-7900645",
    lat: 18.234,
    lng: 69.876,
    temperature: 29.8,
    salinity: 36.1,
    pressure: 11.3,
    status: "active",
    lastUpdate: "2024-01-07 14:38",
    batteryLevel: 88,
    dataPoints: 1456,
    deploymentDate: "2023-08-25",
    cycleNumber: 76,
    profilesCompleted: 149,
    maxDepth: 2050,
    timeSeriesData: [
      { date: "Dec 25", temperature: 30.1, salinity: 35.9, pressure: 10.8 },
      { date: "Dec 26", temperature: 29.9, salinity: 36.0, pressure: 11.1 },
      { date: "Dec 27", temperature: 30.0, salinity: 35.8, pressure: 11.4 },
      { date: "Dec 28", temperature: 29.7, salinity: 36.1, pressure: 11.0 },
      { date: "Dec 29", temperature: 29.5, salinity: 36.2, pressure: 11.6 },
      { date: "Dec 30", temperature: 29.6, salinity: 36.0, pressure: 11.8 },
      { date: "Dec 31", temperature: 29.8, salinity: 35.9, pressure: 11.4 },
      { date: "Jan 01", temperature: 29.9, salinity: 36.0, pressure: 11.1 },
      { date: "Jan 02", temperature: 29.7, salinity: 36.1, pressure: 11.4 },
      { date: "Jan 03", temperature: 29.8, salinity: 35.9, pressure: 11.7 },
      { date: "Jan 04", temperature: 29.6, salinity: 36.2, pressure: 12.0 },
      { date: "Jan 05", temperature: 29.4, salinity: 36.1, pressure: 12.3 },
      { date: "Jan 06", temperature: 29.5, salinity: 36.0, pressure: 12.6 },
      { date: "Jan 07", temperature: 29.8, salinity: 36.1, pressure: 11.3 },
    ],
    depthProfileData: [
      {
        depth: 0,
        temperature: 29.8,
        salinity: 36.1,
        density: 1023.8,
        oxygen: 4.4,
      },
      {
        depth: 10,
        temperature: 29.1,
        salinity: 36.2,
        density: 1024.2,
        oxygen: 4.2,
      },
      {
        depth: 20,
        temperature: 27.5,
        salinity: 36.4,
        density: 1024.9,
        oxygen: 3.9,
      },
      {
        depth: 30,
        temperature: 25.9,
        salinity: 36.6,
        density: 1025.6,
        oxygen: 3.6,
      },
      {
        depth: 50,
        temperature: 22.7,
        salinity: 37.0,
        density: 1027.0,
        oxygen: 3.1,
      },
      {
        depth: 75,
        temperature: 20.1,
        salinity: 37.2,
        density: 1027.9,
        oxygen: 2.7,
      },
      {
        depth: 100,
        temperature: 17.4,
        salinity: 37.3,
        density: 1028.6,
        oxygen: 2.4,
      },
      {
        depth: 150,
        temperature: 14.0,
        salinity: 37.4,
        density: 1029.7,
        oxygen: 2.0,
      },
      {
        depth: 200,
        temperature: 10.9,
        salinity: 37.5,
        density: 1030.3,
        oxygen: 1.7,
      },
      {
        depth: 300,
        temperature: 8.0,
        salinity: 37.3,
        density: 1030.9,
        oxygen: 1.5,
      },
      {
        depth: 500,
        temperature: 5.4,
        salinity: 37.1,
        density: 1031.6,
        oxygen: 1.3,
      },
      {
        depth: 750,
        temperature: 4.0,
        salinity: 36.8,
        density: 1032.0,
        oxygen: 1.2,
      },
      {
        depth: 1000,
        temperature: 3.3,
        salinity: 36.5,
        density: 1032.3,
        oxygen: 1.1,
      },
    ],
  },
];

// Default time series data (will be updated when float is selected)
const defaultTimeSeriesData = dummyFloats[0].timeSeriesData;

// Default depth profile data (will be updated when float is selected)
const defaultDepthProfileData = dummyFloats[0].depthProfileData;

// Expanded dummy questions for the chatbot
const dummyQuestions = [
  "What's the current temperature reading?",
  "Show me salinity trends over time",
  "Which float has the highest pressure reading?",
  "How does temperature change with depth?",
  "What's the average salinity across all floats?",
  "Show me the location of all active floats",
  "Compare oxygen levels at different depths",
  "Which float has been deployed the longest?",
  "Show me battery levels across the fleet",
  "What's the deepest measurement recorded?",
];

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm FloatChat, your ARGO ocean data assistant. I can help you analyze ocean temperature, salinity, pressure, oxygen levels, and density data from our network of 10 autonomous floats deployed across the Arabian Sea. What would you like to explore today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedFloat, setSelectedFloat] = useState(dummyFloats[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTimeSeries, setCurrentTimeSeries] = useState(
    defaultTimeSeriesData
  );
  const [currentDepthProfile, setCurrentDepthProfile] = useState(
    defaultDepthProfileData
  );
  const messagesEndRef = useRef(null);
  const mapRef = useRef(null);

  // For demo purposes - replace with your actual API key
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API;
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  // Initialize Google Maps
useEffect(() => {
  if (
    !GOOGLE_MAPS_API_KEY ||
    GOOGLE_MAPS_API_KEY === "your-google-maps-api-key-here"
  ) {
    console.warn("Google Maps API key not configured");
    return;
  }

  const loader = new Loader({
    apiKey: GOOGLE_MAPS_API_KEY,
    version: "weekly",
  });

  loader
    .load()
    .then(() => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 18.7, lng: 68.0 },
        zoom: 7,
        mapTypeId: "terrain",
        styles: [
          {
            featureType: "water",
            stylers: [{ color: "#4285F4" }],
          },
        ],
      });

      setMap(map);

      // Add markers for each float
      const newMarkers = dummyFloats.map((float) => {
        const pinColor =
          float.status === "active"
            ? "#4285F4"
            : float.status === "maintenance"
            ? "#F59E0B"
            : "#9CA3AF";

        const marker = new window.google.maps.Marker({
          position: { lat: float.lat, lng: float.lng },
          map: map,
          title: float.name,
          icon: {
            url: `data:image/svg+xml;base64,${btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
                <path fill="${pinColor}" stroke="#ffffff" stroke-width="2" 
                  d="M15 0C9.7 0 5.4 4.3 5.4 9.6c0 5.2 9.6 19.4 9.6 19.4s9.6-14.2 9.6-19.4C24.6 4.3 20.3 0 15 0z"/>
                <circle cx="15" cy="9" r="4" fill="#ffffff"/>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(30, 40),
            anchor: new window.google.maps.Point(15, 40),
          },
        });

        marker.addListener("click", () => {
          handleFloatSelect(float);
        });

        return marker;
      });

      setMarkers(newMarkers);
    })
    .catch((error) => {
      console.error("Failed to load Google Maps:", error);
    });
}, []);

  const handleFloatSelect = (float) => {
    setSelectedFloat(float);
    setCurrentTimeSeries(float.timeSeriesData);
    setCurrentDepthProfile(float.depthProfileData);

    // Add a message about the selected float
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `You've selected ${float.name}. Status: ${
          float.status.charAt(0).toUpperCase() + float.status.slice(1)
        } | Location: ${float.lat.toFixed(3)}°N, ${float.lng.toFixed(
          3
        )}°E | Deployed: ${
          float.deploymentDate
        } | Current readings - Temperature: ${float.temperature}°C, Salinity: ${
          float.salinity
        } PSU, Pressure: ${float.pressure} dbar | Battery: ${
          float.batteryLevel
        }% | Profiles completed: ${
          float.profilesCompleted
        } | Max depth capability: ${float.maxDepth}m`,
      },
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Check if API key is configured
      if (!GEMINI_API_KEY || GEMINI_API_KEY === "your-gemini-api-key-here") {
        throw new Error("API key not configured");
      }

      // Create a prompt that includes the dummy data context
      const contextPrompt = `
        You are FloatChat, an AI assistant for ARGO ocean data analysis. You're knowledgeable, helpful, and enthusiastic about oceanography.
        
        You have access to the following ARGO float data from the Arabian Sea:
        
        ARGO Floats Data:
        ${JSON.stringify(dummyFloats, null, 2)}
        
        Currently selected float: ${selectedFloat ? selectedFloat.name : "None"}
        
        Fleet Statistics:
        - Total Floats: ${dummyFloats.length}
        - Active: ${dummyFloats.filter((f) => f.status === "active").length}
        - Inactive: ${
          dummyFloats.filter((f) => f.status === "inactive").length
        }  
        - Maintenance: ${
          dummyFloats.filter((f) => f.status === "maintenance").length
        }
        - Total Data Points: ${dummyFloats
          .reduce((sum, f) => sum + f.dataPoints, 0)
          .toLocaleString()}
        - Total Profiles: ${dummyFloats.reduce(
          (sum, f) => sum + f.profilesCompleted,
          0
        )}
        - Average Temperature: ${(
          dummyFloats.reduce((sum, f) => sum + f.temperature, 0) /
          dummyFloats.length
        ).toFixed(1)}°C
        - Average Salinity: ${(
          dummyFloats.reduce((sum, f) => sum + f.salinity, 0) /
          dummyFloats.length
        ).toFixed(1)} PSU
        - Depth Coverage: Surface to ${Math.max(
          ...dummyFloats.map((f) => f.maxDepth)
        )}m
        - Deployment Period: ${new Date(
          Math.min(...dummyFloats.map((f) => new Date(f.deploymentDate)))
        ).getFullYear()} - ${new Date(
        Math.max(...dummyFloats.map((f) => new Date(f.deploymentDate)))
      ).getFullYear()}
        
        Based on this comprehensive data, please provide helpful, accurate responses about ocean conditions. 
        If asked about data not available in this demo dataset, explain what real ARGO data could provide.
        Keep responses conversational and informative.
        
        User question: ${input}
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);

      // Provide intelligent fallback responses based on common queries
      let fallbackResponse =
        "I'm currently running with comprehensive ARGO demo data from 10 floats in the Arabian Sea. ";

      const lowerInput = input.toLowerCase();
      if (lowerInput.includes("temperature")) {
        const temps = dummyFloats.map((f) => f.temperature);
        const avgTemp = (
          temps.reduce((a, b) => a + b, 0) / temps.length
        ).toFixed(1);
        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);
        fallbackResponse += `Current temperature readings range from ${minTemp}°C to ${maxTemp}°C across our ${dummyFloats.length} floats, with an average of ${avgTemp}°C. The warmest readings are from floats in the southern region.`;
      } else if (lowerInput.includes("salinity")) {
        const sals = dummyFloats.map((f) => f.salinity);
        const avgSal = (sals.reduce((a, b) => a + b, 0) / sals.length).toFixed(
          1
        );
        const minSal = Math.min(...sals);
        const maxSal = Math.max(...sals);
        fallbackResponse += `Salinity levels vary from ${minSal} to ${maxSal} PSU, with an average of ${avgSal} PSU. Higher salinity values are typically observed in areas with greater evaporation.`;
      } else if (
        lowerInput.includes("depth") ||
        lowerInput.includes("profile")
      ) {
        const maxDepths = dummyFloats.map((f) => f.maxDepth);
        fallbackResponse += `Our floats can measure down to depths of ${Math.min(
          ...maxDepths
        )}m to ${Math.max(
          ...maxDepths
        )}m. We have comprehensive depth profiles showing temperature, salinity, density, and oxygen variations with depth.`;
      } else if (
        lowerInput.includes("battery") ||
        lowerInput.includes("status")
      ) {
        const avgBattery = (
          dummyFloats.reduce((sum, f) => sum + f.batteryLevel, 0) /
          dummyFloats.length
        ).toFixed(0);
        const activeCount = dummyFloats.filter(
          (f) => f.status === "active"
        ).length;
        fallbackResponse += `Fleet status: ${activeCount} of ${
          dummyFloats.length
        } floats are currently active. Average battery level is ${avgBattery}%. We have ${
          dummyFloats.filter((f) => f.status === "maintenance").length
        } float(s) under maintenance.`;
      } else if (
        lowerInput.includes("data") ||
        lowerInput.includes("measurement")
      ) {
        const totalData = dummyFloats.reduce((sum, f) => sum + f.dataPoints, 0);
        const totalProfiles = dummyFloats.reduce(
          (sum, f) => sum + f.profilesCompleted,
          0
        );
        fallbackResponse += `Our fleet has collected ${totalData.toLocaleString()} data points across ${totalProfiles} vertical profiles. We're measuring temperature, salinity, pressure, density, and dissolved oxygen at multiple depths.`;
      } else {
        fallbackResponse += `Our ${dummyFloats.length} ARGO floats are monitoring ocean conditions across the Arabian Sea (16.8°-20.1°N, 66.1°-69.9°E), providing real-time data on temperature, salinity, pressure, and more. What specific aspect would you like to explore?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fallbackResponse,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertDummyQuestion = (question) => {
    setInput(question);
  };

  // Calculate fleet statistics
  const activeFloats = dummyFloats.filter((f) => f.status === "active").length;
  const totalDataPoints = dummyFloats.reduce((sum, f) => sum + f.dataPoints, 0);
  const avgBatteryLevel = Math.round(
    dummyFloats.reduce((sum, f) => sum + f.batteryLevel, 0) / dummyFloats.length
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg border-b border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Waves className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-slate-800">
                    FloatChat
                  </h1>
                  <p className="text-xs text-slate-500">
                    ARGO Ocean Data Assistant
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <Database className="w-4 h-4" />
                  <span>{totalDataPoints.toLocaleString()} Data Points</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="w-4 h-4" />
                  <span>
                    {activeFloats} of {dummyFloats.length} Floats Active
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>Avg Battery: {avgBatteryLevel}%</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <HelpCircle className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-4 py-3 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-slate-600 py-2">
                <Database className="w-4 h-4" />
                <span>{totalDataPoints.toLocaleString()} Data Points</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 py-2">
                <Activity className="w-4 h-4" />
                <span>
                  {activeFloats} of {dummyFloats.length} Floats Active
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 py-2">
                <BarChart3 className="w-4 h-4" />
                <span>Avg Battery: {avgBatteryLevel}%</span>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-1/2 flex flex-col bg-white border-r border-slate-200 shadow-lg">
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">AI Assistant Online</span>
            </div>
            <p className="text-xs text-blue-100 mt-1">
              Ask me about ocean data, temperature trends, depth profiles, or
              fleet status
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-800 border border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeSanitize]}
                      components={{
                        table: ({ node, ...props }) => (
                          <table className="min-w-full text-sm" {...props} />
                        ),
                        th: ({ node, ...props }) => (
                          <th
                            className="px-3 py-2 text-left text-xs font-semibold"
                            {...props}
                          />
                        ),
                        td: ({ node, ...props }) => (
                          <td className="px-3 py-2 text-xs" {...props} />
                        ),
                        code({ inline, children, ...props }) {
                          return inline ? (
                            <code
                              className="bg-slate-100 px-1 rounded text-xs"
                              {...props}
                            >
                              {children}
                            </code>
                          ) : (
                            <pre
                              className="rounded-md p-2 overflow-auto text-xs"
                              {...props}
                            >
                              <code>{children}</code>
                            </pre>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 border border-slate-200 px-4 py-3 rounded-2xl shadow-sm">
                  <div className="flex space-x-2 items-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                      <div
                        className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500">
                      FloatChat is analyzing data...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex flex-wrap gap-2 mb-2">
              {dummyQuestions.slice(0, 4).map((question, index) => (
                <button
                  key={index}
                  onClick={() => insertDummyQuestion(question)}
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
            <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-sm">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about ocean data, temperature trends, float locations, depth profiles..."
                className="text-gray-900 flex-1 px-4 py-3 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-r-xl hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Map and Visualizations */}
        <div className="w-1/2 flex flex-col">
          {/* Top Half - Map */}
          <div className="h-1/2 border-b border-slate-200 relative bg-slate-100">
            <div ref={mapRef} className="w-full h-full rounded-tl-lg"></div>
            {!GOOGLE_MAPS_API_KEY ||
            GOOGLE_MAPS_API_KEY === "your-google-maps-api-key-here" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <div className="text-center p-8">
                  <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">
                    Map View
                  </h3>
                  <p className="text-sm text-slate-500">
                    Configure Google Maps API key to see float locations
                  </p>
                  <div className="mt-4 text-xs text-slate-400">
                    {dummyFloats.length} floats deployed across Arabian Sea
                  </div>
                </div>
              </div>
            ) : null}
            {selectedFloat && (
              <div className="absolute top-4 right-4 bg-white p-4 rounded-xl shadow-xl border border-slate-200 max-w-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-blue-600 text-lg">
                    {selectedFloat.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      selectedFloat.status === "active"
                        ? "bg-green-100 text-green-800"
                        : selectedFloat.status === "maintenance"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedFloat.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <MapPin size={16} className="text-blue-600 mr-3" />
                    <span className="text-slate-700">
                      {selectedFloat.lat.toFixed(3)}°N,{" "}
                      {selectedFloat.lng.toFixed(3)}°E
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Thermometer size={16} className="text-red-500 mr-3" />
                    <span className="text-slate-700">
                      {selectedFloat.temperature}°C
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Droplets size={16} className="text-blue-400 mr-3" />
                    <span className="text-slate-700">
                      {selectedFloat.salinity} PSU
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Navigation size={16} className="text-slate-600 mr-3" />
                    <span className="text-slate-700">
                      {selectedFloat.pressure} dbar
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Battery: {selectedFloat.batteryLevel}%</span>
                      <span>Cycle: {selectedFloat.cycleNumber}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Profiles: {selectedFloat.profilesCompleted}</span>
                      <span>Max depth: {selectedFloat.maxDepth}m</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      Deployed: {selectedFloat.deploymentDate}
                    </div>
                    <div className="text-xs text-slate-400">
                      Last update: {selectedFloat.lastUpdate}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Half - Visualizations */}
          <div className="h-1/2 p-6 bg-white overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {selectedFloat
                  ? `${selectedFloat.name} Analytics`
                  : "Ocean Data Analytics"}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Live data</span>
                </div>
                <span>
                  {selectedFloat
                    ? selectedFloat.dataPoints.toLocaleString()
                    : totalDataPoints.toLocaleString()}{" "}
                  points
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Temperature and Salinity over Time */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold mb-3 text-slate-700 flex items-center">
                  <Thermometer size={16} className="mr-2 text-red-500" />
                  Temperature & Salinity Trends (14-day)
                </h3>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart
                    data={currentTimeSeries}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                    />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="temperature"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="salinity"
                      stackId="2"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Depth Profile */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold mb-3 text-slate-700 flex items-center">
                  <Navigation size={16} className="mr-2 text-slate-600" />
                  Vertical Ocean Profile (T°C, Salinity, O₂)
                </h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart
                    data={currentDepthProfile}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="depth"
                      type="number"
                      domain={["dataMin", "dataMax"]}
                      tick={{ fontSize: 10, fill: "#64748b" }}
                    />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444", strokeWidth: 2, r: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="salinity"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="oxygen"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
