"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

type Datum = {
  name: string;
  value: number;
};

type PieChartData = Datum[];

type Props = {
  data: PieChartData;
};

const PieChart: React.FC<Props> = ({ data }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (data && data.length) {
      drawChart();
    }
  }, [data]);

  const drawChart = () => {
    // Set dimensions and margins for the graph
    const width = 450;
    const height = 450;
    const margin = 40;

    // Calculate the radius of the pie chart
    const radius = Math.min(width, height) / 2 - margin;

    // Set the color scale
    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(d3.schemeCategory10);

    // Compute the position of each group on the pie
    const pie = d3.pie<Datum>().value((d) => d.value);

    const data_ready = pie(data);

    // Shape helper to build arcs
    const arcGenerator = d3
      .arc<d3.PieArcDatum<Datum>>()
      .innerRadius(0)
      .outerRadius(radius);

    // Clear previous SVG content
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    // Translate the graph to the center of the container
    const group = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Draw pie slices
    group
      .selectAll("path")
      .data(data_ready)
      .join("path")
      .attr("d", arcGenerator)
      .attr("fill", (d) => color(d.data.name))
      .attr("stroke", "white")
      .style("stroke-width", "2px");

    // Add labels
    group
      .selectAll("text")
      .data(data_ready)
      .join("text")
      .text((d) => d.data.name)
      .attr("transform", (d) => `translate(${arcGenerator.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", 15);
  };

  return <svg ref={ref}/>;
};

export default PieChart;
