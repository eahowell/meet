import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const genres = ["React", "JavaScript", "Node", "jQuery", "Angular"];

const EventGenresChart = ({ events }) => {
  const [data, setData] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const getData = useMemo(() => {
    if (!Array.isArray(events) || events.length === 0) {
      return [];
    }

    return genres.map((genre) => {
      const filteredEvents = events.filter((event) =>
        event.summary.includes(genre)
      );
      return {
        name: genre,
        value: filteredEvents.length,
      };
    });
  }, [events]);

  const COLORS = ["#ACAAFE", "#00C49F", "#FFBB28", "#FF8042", "white"];

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
    // On small screens, only display the percentage inside the pie
    return percent ? (
        <text
          x={x}
          y={y}
          fill={COLORS[index]}
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
  data-testid={`genre-label-${genres[index]}`}
        >
          {isSmallScreen
            ? `${(percent * 100).toFixed(0)}%`
            : `${genres[index]} ${(percent * 100).toFixed(0)}%`}
        </text>
      ) : null;
  };
  useEffect(() => {
    setData(getData);

    // Handle screen resizing
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize on mount

    return () => window.removeEventListener("resize", handleResize);
  }, [getData]);

  if (data.length === 0) {
    return <div>No data available for chart</div>;
  }
  return (
    <div data-testid="pieChart">
    <ResponsiveContainer width="99%" height={400}  >
      <PieChart role="graphics-document" >
        <Pie
          data={data}
          dataKey="value"
          fill="#8884d8"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={130}
          cx="50%"
          cy="50%"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Legend
          align="center"
          verticalAlign="top"
          height={50}
        />
      </PieChart>
    </ResponsiveContainer>
    </div>
  );
};

export default EventGenresChart;
