// Set dimensions and margins
const width = 800;
const height = 600;
const margin = { top: 20, right: 30, bottom: 40, left: 50 };

// Append SVG to chart div
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Load data and create chart
d3.csv("datasets/StudentsPerformance.csv").then(data => {
    // Inspect data structure and log first few entries to verify
    console.log("Data Loaded:", data.slice(0, 5));

    // Parse and check column names based on actual CSV data structure
    data.forEach(d => {
        d.math_score = +d["math score"] || 0; // Adjust name if needed
        d.reading_score = +d["reading score"] || 0; // Adjust name if needed
    });

    // Log data again to confirm parsing
    console.log("Parsed Data:", data.slice(0, 5));

    // Set scales based on data ranges
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.math_score) + 10])
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.reading_score) + 10])
        .range([height - margin.bottom, margin.top]);

    // Add x-axis and y-axis
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(10))
        .append("text")
        .attr("fill", "black")
        .attr("x", width / 2)
        .attr("y", margin.bottom - 10)
        .text("Math Score");

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale).ticks(10))
        .append("text")
        .attr("fill", "black")
        .attr("x", 20)
        .attr("y", margin.top - 10)
        .text("Reading Score");

    // Plot data points
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.math_score))
        .attr("cy", d => yScale(d.reading_score))
        .attr("r", 5)
        .style("fill", "steelblue")
        .style("opacity", 0.7);

    // Tooltip for interactivity
    const tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("background", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "8px")
        .style("display", "none");

    svg.selectAll("circle")
        .on("mouseover", (event, d) => {
            tooltip.style("display", "inline-block")
                .html(`Math: ${d.math_score}<br>Reading: ${d.reading_score}`)
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", () => {
            tooltip.style("display", "none");
        });
}).catch(error => console.error("Error loading or processing data:", error));

