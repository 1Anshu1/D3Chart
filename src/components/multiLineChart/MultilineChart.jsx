import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

import styles from "./multilineChart.module.css";

import ChartContainer from "../chartContainer/ChartContainer";

const MultilineChart = ({ callDurationData }) => {
    const svgRef = useRef();

    useEffect(() => {
        const margin = { top: 40, right: 0, bottom: 20, left: 20 };
        const width = 1000 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        // set the dimensions and margins of the graph
        const svg = d3
            .select(svgRef.current)
            .attr("width", "100%")
            .attr("height", height + margin.top + margin.bottom)
            .attr("viewBox", [0, 0, 1000, 300])
            .attr("class", styles.container)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .style("color", "#98A2B3");

        // set the ranges
        const x = d3
            .scaleBand()
            .domain(callDurationData.map((d) => d.date))
            .range([0, width]);
        const y = d3
            .scaleLinear()
            .domain([0, d3.max(callDurationData, (d) => d.callTake) + 1])
            .range([height, 0]);

        // define the 1st line
        const valueline = d3
            .line()
            .x((d) => x(d.date) )
            .y((d) => y(d.callHold))
            .curve(d3.curveCatmullRom.alpha(0.4));

        // define the 2nd line
        const valueline2 = d3
            .line()
            .x((d) => x(d.date))
            .y((d) => y(d.callTake))
            .curve(d3.curveCatmullRom.alpha(0.4));

        svg.append("g")
            .attr("transform", `translate(${-margin.left},${height})`)
            .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
            .call((g) => g.select(".domain").remove());

        // setting horizontal line in chart
        svg.append("g")
            .attr("transform", `translate(${0},0)`)
            .call(d3.axisLeft(y).tickSize(0).tickPadding(5))
            .call((g) => g.select(".domain").remove())
            .call((g) =>
                g
                    .selectAll(".tick line")
                    .clone()
                    .attr("x2", width - margin.left - margin.right)
                    .attr("stroke-opacity", 0.1)
            );

        svg.append("text")
            .attr("x", margin.left + 10)
            .attr("y", 0 - margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "white")
            .text("Call Duration");

        svg.append("circle")
            .attr("cx", 700)
            .attr("cy", 0 - margin.top / 2)
            .attr("r", 6)
            .style("fill", "#A363FF");
        svg.append("text")
            .attr("x", 720)
            .attr("y", 0 - margin.top / 2)
            .text("Hold Time (min)")
            .style("font-size", "14px")
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
            .style("font-size", "14px")
            .style("fill", "white")
            .style("padding", "10px")
            .attr("alignment-baseline", "middle");

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
            .attr("d", valueline);

        // Add the valueline2 path.
        svg.append("path")
            .data([callDurationData])
            .attr("fill", "none")
            .attr("class", "line")
            .style("stroke", "#A363FF")
            .attr("d", valueline2);
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

// const MultilineChart = ({ callDurationData }) => {
//     const parseDate = d3.timeParse("%Y-%m");
//     callDurationData = callDurationData?.map((data) => ({
//         date: parseDate(data.date),
//         callTake: data.callTake,
//         callHold: data.callHold,
//     }));
//     const svgRef = useRef();

//     useEffect(() => {
//         const margin = { top: 40, right: 20, bottom: 30, left: 40 };
//         const width = 1000 - margin.left - margin.right;
//         const height = 300 - margin.top - margin.bottom;

//         // set the dimensions and margins of the graph
//         const svg = d3
//             .select(svgRef.current)
//             .attr("width", width + margin.left + margin.right)
//             .attr("height", height + margin.top + margin.bottom)
//             .attr("viewBox", [0, 0, 1000, 300])
//             .attr("class", styles.container)
//             .append("g")
//             .attr("transform", `translate(${margin.left},${margin.top})`)
//             .style("color", "#98A2B3")
//             // .on("pointerenter pointermove", pointermoved)
//             // .on("pointerleave", pointerleft)
//             // .on("touchstart", (event) => event.preventDefault());

//         // set the ranges
//         const x = d3
//             .scaleTime()
//             .domain(d3.extent(callDurationData, (d) => d.date))
//             .range([0, width]);

//         const y = d3
//             .scaleLinear()
//             .domain([0, d3.max(callDurationData, (d) => d.callTake) + 1])
//             .range([height, 0]);

//         // define the 1st line
//         const valueline = d3
//             .line()
//             .x((d) => x(d.date))
//             .y((d) => y(d.callHold))
//             .curve(d3.curveCatmullRom.alpha(0.4));

//         // define the 2nd line
//         const valueline2 = d3
//             .line()
//             .x((d) => x(d.date))
//             .y((d) => y(d.callTake))
//             .curve(d3.curveCatmullRom.alpha(0.4));

//         svg.append("g")
//             .attr("transform", `translate(0,${height})`)
//             .call(d3.axisBottom(x).tickSize(0).tickPadding(20).tickFormat(d3.timeFormat("%V")))
//             .call((g) => g.select(".domain").remove());

//         // setting horizontal line in chart
//         svg.append("g")
//             .attr("transform", `translate(${margin.left},0)`)
//             .call(d3.axisLeft(y).tickSize(0).tickPadding(20))
//             .call((g) => g.select(".domain").remove())
//             .call((g) =>
//                 g
//                     .selectAll(".tick line")
//                     .clone()
//                     .attr("x2", width - margin.left - margin.right)
//                     .attr("stroke-opacity", 0.1)
//             );

//         svg.append("circle")
//             .attr("cx", 700)
//             .attr("cy", 0 - margin.top / 2)
//             .attr("r", 6)
//             .style("fill", "#A363FF");
//         svg.append("text")
//             .attr("x", 720)
//             .attr("y", 0 - margin.top / 2)
//             .text("Hold Time (min)")
//             .style("font-size", "15px")
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
//             .style("font-size", "15px")
//             .style("fill", "white")
//             .style("padding", "10px")
//             .attr("alignment-baseline", "middle");

//         svg.append("text")
//             .attr("x", margin.left + 30)
//             .attr("y", 0 - margin.top / 2)
//             .attr("text-anchor", "middle")
//             .style("font-size", "16px")
//             .style("fill", "white")
//             .text("Call Duration");

//         // // Scale the range of the data
//         // x.domain(d3.extent(data, function(d) { return d.date; }));
//         // y.domain([0, d3.max(data, function(d) {
//         //     return Math.max(d.close, d.open); })]);

//         // Add the valueline1 path.
//         svg.append("path")
//             .data([callDurationData])
//             .attr("fill", "none")
//             .attr("class", "line")
//             .attr("stroke", "#00FF9E")
//             .attr("d", valueline);

//         // Add the valueline2 path.
//         svg.append("path")
//             .data([callDurationData])
//             .attr("fill", "none")
//             .attr("class", "line")
//             .style("stroke", "#A363FF")
//             .attr("d", valueline2);

//         // const tooltip = svg.append("g");

//         // function formatDate(date) {
//         //     return date.toLocaleString("en", {
//         //         month: "short",
//         //         day: "numeric",
//         //         year: "numeric",
//         //     });
//         // }
//         // const bisect = d3.bisector((d) => d.date).center;

//         // function pointermoved(event) {
//         //     const i = bisect(callDurationData, x.invert(d3.pointer(event)[0]));
//         //     tooltip.style("display", null);
//         //     tooltip.attr(
//         //         "transform",
//         //         `translate(${x(callDurationData[i].date)},${y(callDurationData[i].callTake)})`
//         //     );

//         //     const path = tooltip
//         //         .selectAll("path")
//         //         .data([,])
//         //         .join("path")
//         //         .attr("fill", "white")
//         //         .attr("stroke", "black");

//         //     const text = tooltip
//         //         .selectAll("text")
//         //         .data([,])
//         //         .join("text")
//         //         .call((text) =>
//         //             text
//         //                 .selectAll("tspan")
//         //                 .data([formatDate(callDurationData[i].date), callDurationData[i].callTake])
//         //                 .join("tspan")
//         //                 .attr("x", 0)
//         //                 .attr("y", (_, i) => `${i * 1.1}em`)
//         //                 .attr("font-weight", (_, i) => (i ? null : "bold"))
//         //                 .text((d) => d)
//         //         );
//         //     size(text, path);
//         // }

//         // function pointerleft() {
//         //     tooltip.style("display", "none");
//         // }

//         // Wraps the text with a callout path of the correct size, as measured in the page.
//         // function size(text, path) {
//         //     const { x, y, width: w, height: h } = text.node().getBBox();
//         //     text.attr("transform", `translate(${-w / 2},${15 - y})`);
//         //     path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
//         // }
//     }, [callDurationData]);

//     return (
//         <ChartContainer>
//             <svg ref={svgRef}></svg>
//         </ChartContainer>
//     );
// };

// export default MultilineChart;
