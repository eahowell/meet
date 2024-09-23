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
import { ThemeContext } from '../contexts/ThemeContext';

const CityEventsChart = ({ events, allLocations }) => {
    const { isDarkMode } = useContext(ThemeContext);
  const [data, setData] = useState([]);

  const getData = useMemo(() => {
    if (!Array.isArray(allLocations) || !Array.isArray(events)) {
      return [];
    }
    return allLocations.map((location) => {
      const count = events.filter(
        (event) => event.location === location
      ).length;
      const city = location.split(", ")[0];
      return { city, count };
    });
  }, [allLocations, events]);

  useEffect(() => {
    setData(getData);
  }, [getData]);

  return (
    <ResponsiveContainer width="99%" height={400}>
      <ScatterChart
        style={{
          backgroundColor: isDarkMode ? "#FFEEE6 ":  "#FFEEE6",
        }}
        margin={{
          top: 20,
          right: 20,
          bottom: 65,
          left: 0,
        }}
      >
        <CartesianGrid />
        <XAxis
          type="category"
          dataKey="city"
          name="City"
          angle={60}
          interval={0}
          tick={{ dy: 2, textAnchor: "start", transform: "translate(10, 0)" }}
          tickFormatter={(value) => value.split(" ")[0]}
        />
        <YAxis
          type="number"
          dataKey="count"
          name="Number of Events"
          allowDecimals={false}
        />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name="Events by City" data={data} fill="#0F4BB8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CityEventsChart;
