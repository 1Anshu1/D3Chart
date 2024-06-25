import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

import styles from "./multilineChart.module.css";
import { useResize } from "../../hooks/useResize";

const MultilineChart = ({ callDurationData, title, height }) => {
    const svgContainer = useRef(null);
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);

    const parseDate = d3.timeParse("%Y-%m");
    callDurationData = callDurationData?.map((data) => ({
        date: parseDate(data.date),
        talkTime: data.talkTime,
        holdTime: data.holdTime,
    }));

    const [width, setWidth] = useState();

    const getSvgContainerSize = () => {
        const newWidth = svgContainer.current.offsetWidth - 48;
        setWidth(newWidth);
    };

    useEffect(() => {
        getSvgContainerSize();
        window.addEventListener("resize", getSvgContainerSize);
        // cleanup event listener
        return () => window.removeEventListener("resize", getSvgContainerSize);
    }, []);

    // const width = useResize(svgContainer);

    useEffect(() => {
        if (!width || !callDurationData) {
            return;
        }

        const margin = { top: 10, right: 40, bottom: 50, left: 15 };

        // setting the svg container
        const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

        // clear all previous content on refresh
        const everything = svg.selectAll("*");
        everything.remove();

        // set the scales
        const xScale = d3
            .scaleTime()
            .domain(d3.extent(callDurationData, (d) => d.date))
            .range([margin.left, width - margin.right])
            .nice();

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(callDurationData, (d) => d.talkTime) + 1.0])
            .range([height - margin.bottom, margin.top])
            .nice();

        const container = svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // setting the axis
        const xAxis = d3
            .axisBottom(xScale)
            .tickSize(0)
            .tickPadding(20)
            .tickFormat(d3.timeFormat("%b"));

        const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(10);

        container
            .append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxis)
            .call((g) => g.select(".domain").remove())
            .style("font-size", "12px");

        container
            .append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxis)
            .call((g) => g.select(".domain").remove())
            .call((g) =>
                g.selectAll(".tick line").clone().attr("x2", width).attr("stroke-opacity", 0.1)
            )
            .style("font-size", "12px");

        // define the  talkTime line
        const talkTimeline = d3
            .line()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d.talkTime))
            .curve(d3.curveCatmullRom.alpha(0.4));

        // define the holdTime line
        const holdTimeline = d3
            .line()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d.holdTime))
            .curve(d3.curveCatmullRom.alpha(0.4));

        // Add the talkTime path.
        const talkTimePath = container
            .append("path")
            .datum(callDurationData)
            .attr("fill", "none")
            .attr("stroke", "#00FF9E")
            .attr("d", talkTimeline);

        // Add the holdTime path.
        const holdTimePath = container
            .append("path")
            .datum(callDurationData)
            .attr("fill", "none")
            .style("stroke", "#A363FF")
            .attr("d", holdTimeline);

        // Mouseover and Mouseout event handlers
        container
            .selectAll("path")
            .on("mouseover", function () {
                ttdots.style("visibility", "visible");
                htdots.style("visibility", "visible");
                d3.select(this).attr("stroke-width", 2); // Increase stroke width on hover
            })
            .on("mouseout", function () {
                ttdots.style("visibility", "hidden");
                htdots.style("visibility", "hidden");
                d3.select(this).attr("stroke-width", 2); // Revert stroke width on mouseout
            });

        const tooltip = d3.select(svgContainer.current).append("div").attr("class", styles.tooltip);

        // Dots (Circles)
        const htdots = container
            .selectAll("htcircle")
            .data(callDurationData)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(d.date))
            .attr("cy", (d) => yScale(d.holdTime))
            .attr("r", 4)
            .attr("fill", "#A363FF")
            .style("visibility", "hidden");

        const ttdots = container
            .selectAll("ttcircle")
            .data(callDurationData)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(d.date))
            .attr("cy", (d) => yScale(d.talkTime))
            .attr("r", 4)
            .attr("fill", "#00FF9E")
            .style("visibility", "hidden");

        // Mouseover and Mouseout event handlers for dots
        ttdots
            .on("mouseover", function (e, data) {
                e.preventDefault();
                tooltip.style("visibility", "visible");
                tooltip
                    .html(
                        `<div>TalkTime: ${data.talkTime}</div><div>HoldTime: ${data.holdTime}</div>`
                    )
                    .style("left", `${e.pageX}px`)
                    .style("top", `${e.pageY - 10}px`);
            })
            .on("mouseout", function (e) {
                e.preventDefault();
                tooltip.style("visibility", "hidden");
            });

        htdots
            .on("mouseover", function (e, data) {
                e.preventDefault();
                tooltip.style("visibility", "visible");
                tooltip
                    .html(
                        `<div>TalkTime: ${data.talkTime}</div><div>HoldTime: ${data.holdTime}</div>`
                    )
                    .style("left", `${e.pageX}px`)
                    .style("top", `${e.pageY - 10}px`);
            })
            .on("mouseout", function (e) {
                e.preventDefault();
                tooltip.style("visibility", "hidden");
            });

        // function formatDate(date) {
        //     return date.toLocaleString("en", {
        //         month: "short",
        //         day: "numeric",
        //         year: "numeric",
        //     });
        // }
    }, [callDurationData, width, height]);

    return (
        <div ref={svgContainer} className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>{title}</div>
                <div className={styles.legendContainer}>
                    <span className={styles.legend}>
                        <div className={`${styles.circle} ${styles.htCircle}`}></div>
                        <div className={`${styles.label} ${styles.htLabel}`}>Hold Time (min)</div>
                    </span>
                    <span className={styles.legend}>
                        <div className={`${styles.circle} ${styles.ttCircle}`}></div>
                        <div className={`${styles.label} ${styles.ttLabel}`}>Talk Time</div>
                    </span>
                </div>
            </div>
            <svg ref={svgRef} className={styles.svgContainer} />
            <div ref={tooltipRef} className={styles.tooltip}></div>
        </div>
    );
};

export default MultilineChart;
