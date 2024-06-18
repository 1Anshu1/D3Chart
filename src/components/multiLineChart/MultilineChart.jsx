// import React, { useState, useEffect, useRef } from "react";
// import * as d3 from "d3";

// import styles from "./multilineChart.module.css";

// import ChartContainer from "../chartContainer/ChartContainer";

// const MultilineChart = ({ callDurationData, title }) => {
//     const svgRef = useRef();

//     useEffect(() => {
//         const margin = { top: 40, right: 0, bottom: 20, left: 20 };
//         const width = 1000 - margin.left - margin.right;
//         const height = 300 - margin.top - margin.bottom;

//         // set the dimensions and margins of the graph
//         const svg = d3
//             .select(svgRef.current)
//             // .attr("width", "100%")
//             // .attr("height", height + margin.top + margin.bottom)
//             .attr("viewBox", [0, 0, 1000, 300])
//             .attr("class", styles.container)
//             .append("g")
//             .attr("transform", `translate(${margin.left},${margin.top})`)
//             .style("color", "#98A2B3");

//         // setting the scales
//         const x = d3
//             .scaleBand()
//             .domain(callDurationData?.map((d) => d.date))
//             .range([0, width]);

//         const y = d3
//             .scaleLinear()
//             .domain([0, d3.max(callDurationData, (d) => d.talkTime) + 1])
//             .range([height, 0]);

//         // setting the axis
//         svg.append("g")
//             .attr("transform", `translate(${0},0)`)
//             .call(d3.axisLeft(y).tickSize(0).tickPadding(5))
//             .call((g) => g.select(".domain").remove())
//             .call((g) =>
//                 g
//                     .selectAll(".tick line")
//                     .clone()
//                     .attr("x2", width - margin.left - margin.right)
//                     .attr("stroke-opacity", 0.1)
//             );

//         svg.append("g")
//             .attr("transform", `translate(${-margin.left},${height})`)
//             .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
//             .call((g) => g.select(".domain").remove());

//         // define the talkTime line
//         const valueline = d3
//             .line()
//             .x((d) => x(d.date))
//             .y((d) => y(d.talkTime))
//             .curve(d3.curveCatmullRom.alpha(0.4));

//         // define the holdTime line
//         const valueline2 = d3
//             .line()
//             .x((d) => x(d.date))
//             .y((d) => y(d.holdTime))
//             .curve(d3.curveCatmullRom.alpha(0.4));

//         // setting the legends
//         svg.append("circle")
//             .attr("cx", 700)
//             .attr("cy", 0 - margin.top / 2)
//             .attr("r", 6)
//             .style("fill", "#A363FF");

//         svg.append("text")
//             .attr("x", 720)
//             .attr("y", 0 - margin.top / 2)
//             .text("Hold Time (min)")
//             .style("font-size", "14px")
//             .style("fill", "white")
//             .style("padding", "10px")
//             .attr("alignment-baseline", "middle");

//         svg.append("circle")
//             .attr("cx", 850)
//             .attr("cy", 0 - margin.top / 2)
//             .attr("r", 6)
//             .style("fill", "#00FF9E");

//         svg.append("text")
//             .attr("x", 870)
//             .attr("y", 0 - margin.top / 2)
//             .text("Talk Time")
//             .style("font-size", "14px")
//             .style("fill", "white")
//             .style("padding", "10px")
//             .attr("alignment-baseline", "middle");

//         // // Scale the range of the data
//         // x.domain(d3.extent(data, function(d) { return d.date; }));
//         // y.domain([0, d3.max(data, function(d) {
//         //     return Math.max(d.close, d.open); })]);

//         // Add the talkTime path.
//         svg.append("path")
//             .data([callDurationData])
//             .attr("fill", "none")
//             .attr("class", "line")
//             .attr("stroke", "#00FF9E")
//             .attr("d", valueline)
//             .on("pointerenter pointermove", pointermoved)
//             .on("pointerleave", pointerleft)
//             .on("touchstart", (event) => event.preventDefault());

//         // Add the holdTime path.
//         svg.append("path")
//             .data([callDurationData])
//             .attr("fill", "none")
//             .attr("class", "line")
//             .style("stroke", "#A363FF")
//             .attr("d", valueline2);

//         // setting the title
//         svg.append("text")
//             .attr("x", margin.left + 10)
//             .attr("y", 0 - margin.top / 2)
//             .attr("text-anchor", "middle")
//             .style("font-size", "14px")
//             .style("fill", "white")
//             .text(`${title}`);

//         const tooltip = svg.append("g");

//         const bisect = d3.bisector((d) => d.date).center;

//         function pointermoved(event) {
//             const i = bisect(callDurationData, x.invert(d3.pointer(event)[0]));
//             tooltip.style("display", null);
//             tooltip.attr(
//                 "transform",
//                 `translate(${x(callDurationData[i].date)},${y(callDurationData[i].callTake)})`
//             );

//             const path = tooltip
//                 .selectAll("path")
//                 .data([,])
//                 .join("path")
//                 .attr("fill", "white")
//                 .attr("stroke", "black");

//             const text = tooltip
//                 .selectAll("text")
//                 .data([,])
//                 .join("text")
//                 .call((text) =>
//                     text
//                         .selectAll("tspan")
//                         .data([formatDate(callDurationData[i].date), callDurationData[i].callTake])
//                         .join("tspan")
//                         .attr("x", 0)
//                         .attr("y", (_, i) => `${i * 1.1}em`)
//                         .attr("font-weight", (_, i) => (i ? null : "bold"))
//                         .text((d) => d)
//                 );
//             size(text, path);
//         }

//         function pointerleft() {
//             tooltip.style("display", "none");
//         }

//         // Wraps the text with a callout path of the correct size, as measured in the page.
//         function size(text, path) {
//             const { x, y, width: w, height: h } = text.node().getBBox();
//             text.attr("transform", `translate(${-w / 2},${15 - y})`);
//             path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
//         }
//     }, [callDurationData]);

//     return (
//         <ChartContainer>
//             <svg ref={svgRef}></svg>
//         </ChartContainer>
//     );
// };

// export default MultilineChart;

import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

import styles from "./multilineChart.module.css";

import ChartContainer from "../chartContainer/ChartContainer";

const MultilineChart = ({ callDurationData, title }) => {
    const parseDate = d3.timeParse("%Y-%m");

    callDurationData = callDurationData?.map((data) => ({
        date: parseDate(data.date),
        talkTime: data.talkTime,
        holdTime: data.holdTime,
    }));

    const svgRef = useRef();

    useEffect(() => {
        const margin = { top: 40, right: 30, bottom: 20, left: 30 };
        const width = 1000 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        // setting the svg container
        const svg = d3
            .select(svgRef.current)
            .attr("viewBox", [0, 0, 1000, 300])
            .attr("class", styles.container)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .style("color", "#98A2B3");

        // set the xscales
        const x = d3
            .scaleTime()
            .domain(d3.extent(callDurationData, (d) => d.date))
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(callDurationData, (d) => d.talkTime) + 1])
            .range([height, 0]);

        // setting the axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSize(0).tickPadding(10).tickFormat(d3.timeFormat("%b")))
            .call((g) => g.select(".domain").remove());

        svg.append("g")
            .call(d3.axisLeft(y).tickSize(0).tickPadding(10))
            .call((g) => g.select(".domain").remove())
            .call((g) =>
                g.selectAll(".tick line").clone().attr("x2", width).attr("stroke-opacity", 0.1)
            );

        // define the talkTime line
        const valueline = d3
            .line()
            .x((d) => x(d.date))
            .y((d) => y(d.talkTime))
            .curve(d3.curveCatmullRom.alpha(0.4));

        // define the holdTime line
        const valueline2 = d3
            .line()
            .x((d) => x(d.date))
            .y((d) => y(d.holdTime))
            .curve(d3.curveCatmullRom.alpha(0.4));

        // setting the legends
        svg.append("circle")
            .attr("cx", 700)
            .attr("cy", 0 - margin.top / 2)
            .attr("r", 6)
            .style("fill", "#A363FF");

        svg.append("text")
            .attr("x", 720)
            .attr("y", 0 - margin.top / 2)
            .text("Hold Time (min)")
            .style("font-size", "15px")
            .style("fill", "white")
            .style("padding", "10px")
            .attr("alignment-baseline", "middle");

        svg.append("circle")
            .attr("cx", 850)
            .attr("cy", 0 - margin.top / 2)
            .attr("r", 6)
            .style("fill", "#00FF9E");

        svg.append("text")
            .attr("x", 870)
            .attr("y", 0 - margin.top / 2)
            .text("Talk Time")
            .style("font-size", "15px")
            .style("fill", "white")
            .style("padding", "10px")
            .attr("alignment-baseline", "middle");

        // setting the title
        svg.append("text")
            .attr("x", margin.left + 30)
            .attr("y", 0 - margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("fill", "white")
            .text(`${title}`);

        // // Scale the range of the data
        // x.domain(d3.extent(data, function(d) { return d.date; }));
        // y.domain([0, d3.max(data, function(d) {
        //     return Math.max(d.close, d.open); })]);

        // Add the valueline1 path.
        svg.append("path")
            .data([callDurationData])
            .attr("fill", "none")
            .attr("class", "line")
            .attr("stroke", "#00FF9E")
            .attr("d", valueline)
            .on("pointerenter pointermove", (event) => pointermoved(event, "talkTime"))
            .on("pointerleave", pointerleft)
            .on("touchstart", (event) => event.preventDefault());

        // Add the valueline2 path.
        svg.append("path")
            .data([callDurationData])
            .attr("fill", "none")
            .attr("class", "line")
            .style("stroke", "#A363FF")
            .attr("d", valueline2)
            .on("pointerenter pointermove", (event) => pointermoved(event, "holdTime"))
            .on("pointerleave", pointerleft)
            .on("touchstart", (event) => event.preventDefault());

        const tooltip = svg.append("g");

        function formatDate(date) {
            return date.toLocaleString("en", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        }
        const bisect = d3.bisector((d) => d.date).center;

        function pointermoved(event, lineType) {
            console.log(lineType);
            const i = bisect(callDurationData, x.invert(d3.pointer(event)[0]));
            tooltip.style("display", null);
            tooltip.attr(
                "transform",
                `translate(${x(callDurationData[i].date)},${
                    lineType === "talkTime"
                        ? y(callDurationData[i]?.talkTime)
                        : y(callDurationData[i]?.holdTime)
                })`
            );

            const path = tooltip
                .selectAll("path")
                .data([,])
                .join("path")
                .style("fill", "#475467")
                .style("fill-opacity", ".85");

            const text = tooltip
                .selectAll("text")
                .data([,])
                .join("text")
                .call((text) =>
                    text
                        .selectAll("tspan")
                        .data([
                            formatDate(callDurationData[i].date),
                            lineType === "talkTime"
                                ? callDurationData[i]?.talkTime
                                : callDurationData[i]?.holdTime,
                        ])
                        .join("tspan")
                        .attr("x", 0)
                        .attr("y", (_, i) => `${i * 1.1}em`)
                        .attr("font-weight", (_, i) => (i ? null : "bold"))
                        .attr("fill", "white")
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
    }, [callDurationData]);

    return (
        <ChartContainer>
            <svg ref={svgRef}></svg>
        </ChartContainer>
    );
};

export default MultilineChart;

// import React, { useState, useEffect, useRef } from "react";
// import * as d3 from "d3";
// import styles from "./multilineChart.module.css";
// import ChartContainer from "../chartContainer/ChartContainer";

// const MultilineChart = ({ callDurationData, title }) => {
//     const svgRef = useRef();

//     useEffect(() => {
//         const margin = { top: 40, right: 0, bottom: 20, left: 20 };
//         const width = 1000 - margin.left - margin.right;
//         const height = 300 - margin.top - margin.bottom;

//         const svg = d3
//             .select(svgRef.current)
//             .attr("viewBox", [0, 0, 1000, 300])
//             .attr("class", styles.container)
//             .append("g")
//             .attr("transform", `translate(${margin.left},${margin.top})`)
//             .style("color", "#98A2B3");

//         const x = d3
//             .scaleBand()
//             .domain(callDurationData?.map((d) => d.date))
//             .range([0, width]);

//         const y = d3
//             .scaleLinear()
//             .domain([
//                 0,
//                 d3.max(
//                     callDurationData,
//                     (d) => d.talkTime,
//                     (d) => d.holdTime
//                 ) + 1,
//             ])
//             .range([height, 0]);

//         svg.append("g")
//             .attr("transform", `translate(${0},0)`)
//             .call(d3.axisLeft(y).tickSize(0).tickPadding(5))
//             .call((g) => g.select(".domain").remove())
//             .call((g) =>
//                 g
//                     .selectAll(".tick line")
//                     .clone()
//                     .attr("x2", width - margin.left - margin.right)
//                     .attr("stroke-opacity", 0.1)
//             );

//         svg.append("g")
//             .attr("transform", `translate(${-margin.left},${height})`)
//             .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
//             .call((g) => g.select(".domain").remove());

//         const valueline = d3
//             .line()
//             .x((d) => x(d.date))
//             .y((d) => y(d.talkTime))
//             .curve(d3.curveCatmullRom.alpha(0.4));

//         const valueline2 = d3
//             .line()
//             .x((d) => x(d.date))
//             .y((d) => y(d.holdTime))
//             .curve(d3.curveCatmullRom.alpha(0.4));

//         svg.append("path")
//             .data([callDurationData])
//             .attr("fill", "none")
//             .attr("class", "line")
//             .attr("stroke", "#00FF9E")
//             .attr("d", valueline)
//             .on("mouseenter mousemove", pointermoved)
//             .on("mouseleave", pointerleft);

//         svg.append("path")
//             .data([callDurationData])
//             .attr("fill", "none")
//             .attr("class", "line")
//             .style("stroke", "#A363FF")
//             .attr("d", valueline2);

//         svg.append("text")
//             .attr("x", margin.left + 10)
//             .attr("y", 0 - margin.top / 2)
//             .attr("text-anchor", "middle")
//             .style("font-size", "14px")
//             .style("fill", "white")
//             .text(`${title}`);

//         const tooltip = svg.append("g").style("display", "none");

//         tooltip.append("path").attr("fill", "white").attr("stroke", "black");

//         tooltip
//             .append("text")
//             .attr("dy", "-0.5em")
//             .style("text-anchor", "middle")
//             .style("font-size", "12px")
//             .attr("fill", "black");

//         function pointermoved(event) {
//             const mouseX = d3.pointer(event)[0];
//             const i = Math.round(mouseX / (width / callDurationData.length));

//             if (i >= 0 && i < callDurationData.length) {
//                 const d = callDurationData[i];

//                 tooltip
//                     .attr("transform", `translate(${x(d.date) + margin.left},${y(d.talkTime)})`)
//                     .style("display", "block");

//                 tooltip.select("text").text(`Talk Time: ${d.talkTime} min`);
//             }
//         }

//         function pointerleft() {
//             tooltip.style("display", "none");
//         }
//     }, [callDurationData]);

//     return (
//         <ChartContainer>
//             <svg ref={svgRef}></svg>
//         </ChartContainer>
//     );
// };

// export default MultilineChart;
