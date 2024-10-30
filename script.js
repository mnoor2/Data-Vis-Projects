// Define the SVG canvas dimensions
const margin = {top: 40, right: 100, bottom: 50, left: 60},  // Increased right margin
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

// Create SVG container
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the data
d3.csv("spending_totals.csv").then(data => {
  // Format the data
  data.forEach(d => {
    d.year = +d.year;
    d.total = +d.total;
    d.costumes = +d.costumes;
    d.candy = +d.candy;
    d.decorations = +d.decorations;
    d.cards = +d.cards;
  });

  // Set up stack
  const categories = ["costumes", "candy", "decorations", "cards"];
  const stackedData = d3.stack().keys(categories)(data);

  // Set up scales
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.year))
    .range([0, width])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.total)])
    .nice()
    .range([height, 0]);

  const colorScale = d3.scaleOrdinal()
    .domain(categories)
    .range(["#4daf4a", "#377eb8", "#ff7f00", "#984ea3"]);

  // Add X axis
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
    .append("text")
    .attr("y", 35)
    .attr("x", width / 2)
    .attr("text-anchor", "middle")
    .attr("class", "axis-label")
    .text("Year");

  // Add Y axis
  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("x", -height / 2)
    .attr("dy", "1em")
    .attr("text-anchor", "middle")
    .attr("class", "axis-label")
    .text("Spending (in billions)");

  // Draw the bars
  svg.selectAll("layers")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", d => colorScale(d.key))
    .selectAll("rect")
    .data(d => d)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.data.year))
    .attr("y", d => yScale(d[1]))
    .attr("height", d => yScale(d[0]) - yScale(d[1]))
    .attr("width", xScale.bandwidth())
    .on("mouseover", function(event, d) {
      d3.select(this).attr("opacity", 0.7);
    })
    .on("mouseout", function(event, d) {
      d3.select(this).attr("opacity", 1);
    });

  // Add legend
  const legend = svg.selectAll(".legend")
    .data(categories)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(80,${i * 20})`);

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", colorScale);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(d => d);
});
