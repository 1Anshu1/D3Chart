import { useEffect, useRef } from "react";
import * as d3 from "d3";

import styles from "./areaChart.module.css";
import arrow from "../../assets/icons/arrow.svg";
import ChartContainer from "../chartContainer/ChartContainer";

const AreaChart = ({ data, title, stats, timeData, averageData }) => {
    const svgRef = useRef();

    const xAccessor = (d) => d.month;
    const yAccessor = (d) => d.call;

    const formatTime = (time) => {
        const min = (time / 60).toFixed(0);
        const sec = (time - min * 60) % 60;
        return `${min}min ${sec}sec`;
    };

    useEffect(() => {
        const width = 100;
        const height = 40;
        // const margin = {top: 20, right: 30, bottom: 30, left: 40};

        // declare the svg container
        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("overflow", "visible");

        // Declare the x scale.
        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.month))
            .range([0, width]);

        // Declare the y scale.
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.call)])
            .range([height, 0]);

        const line = d3
            .line()
            .x((d) => xScale(d.month))
            .y((d) => yScale(d.call));

        const areaGenerator = d3
            .area()
            .x((d) => xScale(xAccessor(d)))
            .y1((d) => yScale(yAccessor(d)))
            .y0(height)
            .curve(d3.curveBumpX);

        svg.append("path")
            .datum(data)
            .attr("d", areaGenerator)
            .attr("fill", "rgba(0, 255, 158, 0.2)")
            .attr("class", styles.path);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            //    .call(d3.axisBottom(xScale).tickSize(0))
            .call((g) => g.select(".domain").remove());

        svg.append("g")
            // .call(d3.axisLeft(yScale).tickSize(0))
            .call((g) => g.select(".domain").remove());

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#00FF9E")
            .attr("stroke-width", 2)
            .attr("d", line);
    });

    return (
        <div className={styles.container}>
            <ChartContainer>
                <div className={styles.headerContainer}>
                    <span className={styles.title}>{title}</span>
                    <div className={styles.growthContainer}>
                        <img src={arrow} alt="arrow" className={styles.arrowIcon}/>
                        <span className={styles.growth}>{12}%</span>
                    </div>
                </div>
                <div className={styles.bottomContainer}>
                    {stats && <span className={styles.stats}>{stats.toLocaleString("en-IN")}</span>}
                    {timeData && <span className={styles.stats}>{formatTime(timeData)}</span>}
                    {averageData && <span className={styles.stats}>{averageData}%</span>}
                    <svg ref={svgRef} className={styles.svgContainer}></svg>
                </div>
            </ChartContainer>
        </div>
    );
};

export default AreaChart;
