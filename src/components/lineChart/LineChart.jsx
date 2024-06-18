import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import ChartContainer from "../chartContainer/ChartContainer";

import styles from "./lineChart.module.css";

const LineChart = ({ slaData, title }) => {
    const parseDate = d3.timeParse("%Y-%m");

    slaData = slaData?.map((data) => ({
        date: parseDate(data.date),
        sla: data.sla,
    }));

    const svgRef = useRef();

    useEffect(() => {
        const margin = { top: 20, right: 30, bottom: 20, left: 50 };
        const width = 700 - margin.left - margin.right;
        const height = 250 - margin.top - margin.bottom;

        // setting the svg container
        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height + margin.top + margin.bottom)
            .attr("viewBox", [0, 0, 700, 250])
            .attr("class", styles.svgContainer)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .on("pointerenter pointermove", pointermoved)
            .on("pointerleave", pointerleft)
            .on("touchstart", (event) => event.preventDefault());

        // setting the scales
        const x = d3
            .scaleTime()
            .domain(d3.extent(slaData, (d) => d.date))
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(slaData, (d) => d.sla)])
            .nice()
            .range([height, 0]);

        // setting the axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSize(0).tickPadding(10).tickFormat(d3.timeFormat("%V")))
            .call((g) => g.select(".domain").remove());

        svg.append("g")
            .call(d3.axisLeft(y).tickSize(0).tickPadding(30))
            .call((g) => g.select(".domain").remove());

        // setting the title
        svg.append("text")
            .attr("x", -10)
            .attr("y", -20)
            .attr("text-anchor", "start")
            .attr("class", styles.title)
            .text(`${title}`);

        // Line generator
        const line = d3
            .line()
            .x((d) => x(d.date))
            .y((d) => y(d.sla));

        // Draw the line
        svg.append("path")
            .datum(slaData)
            .attr("fill", "none")
            .attr("stroke", "#A363FF")
            .attr("stroke-width", 2)
            .attr("d", line);

        const tooltip = svg.append("g");

        function formatDate(date) {
            return date.toLocaleString("en", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        }
        const bisect = d3.bisector((d) => d.date).center;

        function pointermoved(event) {
            const i = bisect(slaData, x.invert(d3.pointer(event)[0]));
            tooltip.style("display", null);
            tooltip.attr("transform", `translate(${x(slaData[i].date)},${y(slaData[i].sla)})`);

            const path = tooltip
                .selectAll("path")
                .data([,])
                .join("path")
                .attr("fill", "white")
                .attr("stroke", "black");

            const text = tooltip
                .selectAll("text")
                .data([,])
                .join("text")
                .call((text) =>
                    text
                        .selectAll("tspan")
                        .data([formatDate(slaData[i].date), slaData[i].sla])
                        .join("tspan")
                        .attr("x", 0)
                        .attr("y", (_, i) => `${i * 1.1}em`)
                        .attr("font-weight", (_, i) => (i ? null : "bold"))
                        .text((d) => d)
                );
            size(text, path);
        }

        function pointerleft() {
            tooltip.style("display", "none");
        }

        // Wraps the text with a callout path of the correct size, as measured in the page.
        function size(text, path) {
            const { x, y, width: w, height: h } = text.node().getBBox();
            text.attr("transform", `translate(${-w / 2},${15 - y})`);
            path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
        }
    }, [slaData]);

    return (
        <>
        {/* <div className={styles.container}> */}
            {/* <ChartContainer> */}
                <svg ref={svgRef}></svg>
            {/* </ChartContainer> */}
        {/* </div> */}
        </>
    );
};

export default LineChart;
