import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";

const genres = ["React", "JavaScript", "Node", "jQuery", "Angular"];

const EventGenresChart = ({ events }) => {
  const [data, setData] = useState([]);

  const getData = useMemo(() => {
    if (!Array.isArray(events) || events.length === 0) {
      return [];
    }
    
    return genres.map((genre) => {
      const filteredEvents = events.filter(event => event.summary.includes(genre));
      return {
        name: genre,
        value: filteredEvents.length
      };
    });
  }, [events]);


  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius;
    const x = cx + radius * Math.cos(-midAngle * RADIAN) * 1.07;
    const y = cy + radius * Math.sin(-midAngle * RADIAN) * 1.07;
    return percent ? (
      <text
        x={x}
        y={y}
        fill="#8884d8"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${genres[index]} ${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };
  useEffect(() => {
    setData(getData);
  }, [getData]);
  if (data.length === 0) {
    return <div>No data available for chart</div>;
  }
  return (
    <ResponsiveContainer width="99%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          fill="#8884d8"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EventGenresChart;
