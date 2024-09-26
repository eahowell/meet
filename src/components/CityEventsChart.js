// src/components/CityEventsChart.js

import React, { useState, useEffect, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CityEventsChart = ({ events, allLocations }) => {
  // const { isDarkMode } = useContext(ThemeContext);
  const [data, setData] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const CustomXAxisTick = ({ x, y, payload }) => {
    const isVerySmallScreen = screenWidth <= 450;
    const rotationAngle = isVerySmallScreen ? 60 : 45;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="start"
          stroke=  "white" //{isDarkMode ? "White" : "#333"}
          transform={`rotate(${rotationAngle})`}
          data-testid={`XAxislabel-${payload.value}`}
          className="recharts-text recharts-cartesian-axis-tick-value x-axis-label"
          style={{ fontSize: isVerySmallScreen ? "10px" : "12px" }}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  if (data.length === 0) {
    return <div>No data available for chart</div>;
  }

  const chartMargin =
    screenWidth <= 450
      ? { top: 10, right: 10, bottom: 40, left: -15 }
      : { top: 20, right: 20, bottom: 50, left: -15 };
  return (
    <div data-testid="scatterChart">
      <div className="chartGroup"># of Events Per Location</div>
      <ResponsiveContainer
        width="99%"
        height={400}
        style={{
          backgroundColor: "#143B5F", //isDarkMode ? "#143B5F" : "#FFEEE6",
        }}
        role="chart"
        aria-label="scatterChart"
        className="scatterChart"
        data-testid="scatterChartSVG"
      >
        <ScatterChart
          role="graphics-document"
          data-testid="scatterChartSVG"
          className="scatterChart"
          aria-label="scatterChart"
          style={{
            backgroundColor: "#143B5F", //isDarkMode ? "#143B5F" : "#FFEEE6"
          }}
          margin={chartMargin}
        >
          <CartesianGrid stroke={"#495670"} />
          {/* isDarkMode ? "#495670" : "#ccc" */}
          <XAxis
            type="category"
            dataKey="city"
            name="City"
            tick={<CustomXAxisTick />}
            interval={0}
            stroke= "#ECF0F1" //{isDarkMode ? "#ECF0F1" : "#333"}
          />
          <YAxis
            type="number"
            dataKey="count"
            name="Number of Events"
            allowDecimals={false}
            stroke="#ECF0F1" //{isDarkMode ? "#ECF0F1" : "#333"}
            label={{
              value: "Number of Events",
              angle: -90,
              position: "center",
              fill: "#ECF0F1", //{isDarkMode ? "#ECF0F1" : "#333"},
              style: { fontSize: screenWidth <= 320 ? "12px" : "14px" },
            }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              backgroundColor: "#FFEEE6", //isDarkMode ? "#FFEEE6" : "#fff",
              color: "#ECF0F1", //{isDarkMode ? "#ECF0F1" : "#333"}
              border: `1px solid ${"#ECF0F1" }`,
            }}
          />
          <Scatter
            name="Events by City"
            data={data}
            fill="#ECF0F1" //{isDarkMode ? "#ECF0F1" : "#0F4BB8"}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CityEventsChart;
