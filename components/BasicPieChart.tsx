"use client";
import React, { useEffect } from "react";
import * as d3 from "d3";
import { PieArcDatum } from "d3-shape";
import { Types } from "../types/types";

const BasicPieChart = ({ input }: PieChartProps) => {
  useEffect(() => {
    draw();
  }, []);

  const draw = async () => {
    const width = 928;
    const height = Math.min(width, 500);
    const radius = Math.min(width, height) / 2 - 1;

    const svgElement = d3.select(".basicPieChart").select("svg");

    if (!svgElement.empty()) {
      svgElement.remove(); // Clear existing SVG to prevent duplicates
    }

    const svg = d3
      .select(".basicPieChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");
    // .append("g")
    // .attr("transform", `translate(${innerWidth / 2} ${innerHeight / 2})`);

    const data = input
      ? input
      : await d3.dsv(
          ",",
          "/population-by-age.csv",
          // "https://gist.githubusercontent.com/Thieffen/a684b4e0d9a4dc97974d32bff84c16df/raw/8068fa1bdf1084ff39a509450d85f7138025006c/pie.csv",
          (d) => {
            const res = d as unknown as Types.Data;
            return {
              name: res.name,
              value: res.value,
            };
          }
        );

    if (data[0]) console.log("data loaded!", data);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(
        d3
          .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
          .reverse()
      );

    const pie = d3
      .pie<Types.Data>()
      .sort(null)
      .value((record) => record.value);

    const arc = d3
      .arc<d3.PieArcDatum<Types.Data>>()
      .innerRadius(0)
      .outerRadius(radius);

    const labelRadius = radius * 0.8;

    // A separate arc generator for labels.
    const arcLabel = d3
      .arc<d3.PieArcDatum<Types.Data>>()
      .innerRadius(labelRadius)
      .outerRadius(labelRadius);

    const arcs = pie(data);
    console.log(arcs);

    // generate the arch SVGs for each pie data
    // use the color for each name
    const arch = svg
      .selectAll(".arc")
      .data(arcs)
      .enter()
      .append("g")
      .attr("class", "arc");

    arch
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.name) as string)
      .attr("stroke", "white");

    arch
      .append("title")
      .text((d) => `${d.data.name}: ${d.data.value.toString()}`);

    svg
      .append("g")
      .attr("text-anchor", "middle")
      .selectAll()
      .data(arcs)
      .join("text")
      .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
      .call((text) =>
        text
          .append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text((d) => d.data.name)
      )
      .call((text) =>
        text
          .filter((d) => d.endAngle - d.startAngle > 0.25)
          .append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text((d) => d.data.value.toLocaleString("en-US"))
      );
  };

  return <div className="basicPieChart" />;
};

interface DataItem {
  name: string;
  value: number;
}

interface PieChartProps {
  input?: DataItem[];
}

interface IBasicPieChartProps {
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export default BasicPieChart;
