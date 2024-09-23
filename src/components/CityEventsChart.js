// src/components/CityEventsChart.js

import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ThemeContext } from "../contexts/ThemeContext";

const CityEventsChart = ({ events, allLocations }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [data, setData] = useState([]);

  const getData = useMemo(() => {
    if (
      !Array.isArray(allLocations) ||
      !Array.isArray(events) ||
      allLocations.length === 0 ||
      events.length === 0
    ) {
      return [];
    }
    const chartData = allLocations.map((location) => {
      const count = events.filter(
        (event) => event.location === location
      ).length;
      const city = location.split(/, | - /)[0];
      return { city, count };
    });
    return chartData;
  }, [allLocations, events]);

  useEffect(() => {
    setData(getData);
  }, [getData]);

  if (data.length === 0) {
    return <div>No data available for chart</div>;
  }
  return (
    <ResponsiveContainer width="99%" height={400}>
      <ScatterChart
        style={{
          backgroundColor: isDarkMode ? "#143B5F" : "#FFEEE6",
        }}
        margin={{
          top: 20,
          right: 20,
          bottom: 65,
          left: -30,
        }}
      >
        <CartesianGrid stroke={isDarkMode ? "#495670" : "#ccc"} />
        <XAxis
          type="category"
          dataKey="city"
          name="City"
          angle={45}
          interval={0}
          tick={{ dy: 2, textAnchor: "start", transform: "translate(10, 0)" }}
          stroke={isDarkMode ? "#ECF0F1" : "#333"}
        />
        <YAxis
          type="number"
          dataKey="count"
          name="Number of Events"
          allowDecimals={false}
          stroke={isDarkMode ? "#ECF0F1" : "#333"}
          label={{
            value: "Number of Events",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          contentStyle={{
            backgroundColor: isDarkMode ? "#FFEEE6" : "#fff",
            color: isDarkMode ? "#ECF0F1" : "#333",
            border: `1px solid ${isDarkMode ? "#ECF0F1" : "#ccc"}`,
          }}
        />
        <Scatter
          name="Events by City"
          data={data}
          fill={isDarkMode ? "#ECF0F1" : "#0F4BB8"}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CityEventsChart;
