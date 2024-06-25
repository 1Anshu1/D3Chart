import { useEffect, useRef } from "react";
import * as d3 from "d3";

import styles from "./areaChart.module.css";
import arrow from "../../assets/icons/arrow.svg";

const AreaChart = ({ data, title, stats, timeData, averageData }) => {
    const svgRef = useRef();
    const tooltipRef = useRef();

    const xAccessor = (d) => d.date;
    const yAccessor = (d) => d.value;

    const formatTime = (time) => {
        const min = (time / 60).toFixed(0);
        const sec = (time - min * 60) % 60;
        return `${min}min ${sec}sec`;
    };

    useEffect(() => {
        const width = 100;
        const height = 50;
        // const margin = {top: 20, right: 30, bottom: 30, left: 40};

        // declare the svg container
        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("overflow", "visible")
            .attr("transform", `translate(${15},${5})`);

        // Declare the x scale.
        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.date))
            .range([0, width]);

        // Declare the y scale.
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.value)])
            .range([height, 0]);

        const line = d3
            .line()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d.value));

        const areaGenerator = d3
            .area()
            .x((d) => xScale(xAccessor(d)))
            .y1((d) => yScale(yAccessor(d)))
            .y0(height)
            .curve(d3.curveBumpX);

        const createGradient = (select) => {
            const gradient = select
                .select("defs")
                .append("linearGradient")
                .attr("id", "gradient")
                .attr("x1", "0%")
                .attr("y1", "100%")
                .attr("x2", "0%")
                .attr("y2", "0%");

            gradient
                .append("stop")
                .attr("offset", "0%")
                .attr("style", "stop-color:#00FF9E;stop-opacity:0.01");
            gradient
                .append("stop")
                .attr("offset", "50%")
                .attr("style", "stop-color:#00FF9E;stop-opacity:0.08");

            gradient
                .append("stop")
                .attr("offset", "100%")
                .attr("style", "stop-color:#00FF9E;stop-opacity:0.2");
        };

        svg.append("defs");
        svg.call(createGradient);

        svg.append("path").datum(data).attr("d", areaGenerator).style("fill", "url(#gradient)");

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            //    .call(d3.axisBottom(xScale).tickSize(0))
            .call((g) => g.select(".domain").remove());

        svg.append("g")
            // .call(d3.axisLeft(yScale).tickSize(0))
            .call((g) => g.select(".domain").remove());

        const path = svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#00FF9E")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Mouseover and Mouseout event handlers
        path.on("mouseover", function () {
            console.log(dots)
            dots.style("visibility", "visible");
            d3.select(this).attr("stroke-width", 2); // Increase stroke width on hover
        }).on("mouseout", function () {
            dots.style("visibility", "hidden");
            d3.select(this).attr("stroke-width", 2); // Revert stroke width on mouseout
        });

        const tooltip = d3.select(tooltipRef.current).style("opacity", 1);

        const dots = svg
            .selectAll("circlee")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(d.date))
            .attr("cy", (d) => yScale(d.value))
            .attr("r", 4)
            .attr("fill", "#00FF9E")
            .style("visibility", "hidden");

        // Mouseover and Mouseout event handlers for dots
        dots.on("mouseover", function (e, data) {
            console.log(data);
            // e.preventDefault();
            tooltip.style("visibility", "visible");
            tooltip
                .html(`<div>${data.value}</div>`)
                .style("left", `${e.pageX}px`)
                .style("top", `${e.pageY - 28}px`);
        }).on("mouseout", function (e) {
            // e.preventDefault();
            tooltip.style("visibility", "hidden");
        });
    });

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <span className={styles.title}>{title}</span>
                <div className={styles.growthContainer}>
                    <img src={arrow} alt="arrow" className={styles.arrowIcon} />
                    <span className={styles.growth}>{12}%</span>
                </div>
            </div>
            <div className={styles.bottomContainer}>
                {stats && <span className={styles.stats}>{stats.toLocaleString("en-IN")}</span>}
                {timeData && <span className={styles.stats}>{formatTime(timeData)}</span>}
                {averageData && <span className={styles.stats}>{averageData}%</span>}
                <svg ref={svgRef} className={styles.svgContainer}></svg>
                <div ref={tooltipRef} className={styles.tooltip}></div>
            </div>
        </div>
    );
};

export default AreaChart;
