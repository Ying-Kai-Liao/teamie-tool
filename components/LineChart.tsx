import React, { createRef, RefObject, useEffect, useState } from "react";
import "./BasicLineChart.scss";
import * as d3 from "d3";
import { DSVParsedArray } from "d3";

type Data = {
    date: string;
    value: number;
  };

const url =
  "https://gist.githubusercontent.com/Thieffen/0f95e0e41a91b1c1c793c9c35cf3fce7/raw/tsla.csv";

const BasicLineChart = (props: IBasicLineChartProps) => {
  const ref: RefObject<HTMLDivElement> = React.createRef();

  const [data, setData] = useState<DSVParsedArray<Data>>();

  const width = props.width - props.left - props.right;
  const height = props.height - props.top - props.bottom;

  useEffect(() => {
    console.log("loading data....");
    d3.dsv(",", url, (d) => {
      const ddate: string = d.Date || "";
      return {
        date: d3.timeParse("%Y-%m-%d")(ddate),
        value: d.Close
      };
    }).then((data) => {
      setData(data);
      console.log("data loaded!");
      console.log(data.slice(0, 10).map((d) => d));
    });
  }, []);

  useEffect(() => {
    if (!data) {
      console.log("do not draw graph while data is loading...");
    } else {
      console.log("draw graph now!");
      draw();
    }
  }, [data]);

  const draw = () => {
    console.log("drawing...");

    const x = d3
      .scaleTime()
      .domain(
        d3.extent(data, (d) => {
          return d.date;
        }) as [Data.date, Data.date]
      )
      .range([0, width]);

    d3.select(ref.current).append("p").text("Hello World");
    d3.select("svg")
      .append("g")
      .attr("transform", "translate(250, 0)")
      .append("rect")
      .attr("width", 500)
      .attr("height", 500)
      .attr("fill", "tomato");
  };

  return (
    <div className=".basicLineChart" ref={ref}>
      <svg width={width} height={height}>
        <g transform="translate(0, 0)">
          <rect width="500" height="500" fill="green" />
        </g>
      </svg>
    </div>
  );
};

interface IBasicLineChartProps {
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
  fill: string;
}

export default BasicLineChart;
