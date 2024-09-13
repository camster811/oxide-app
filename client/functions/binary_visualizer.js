import * as d3 from 'd3';

const plotBinary = async (chartData) => {
    const container = document.getElementById("network");

    if (!container) {
        console.error("Container element with ID 'network' not found.");
        return;
    }

    // Clear any existing plot
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const key = Object.keys(chartData)[0];
    const binaryDataString = chartData[key];
    let gridData;

    try {
        gridData = JSON.parse(binaryDataString);
    } catch (error) {
        console.error("Failed to parse binary data string:", error);
        return;
    }

    console.log("Grid data:", gridData);

    // Set up dimensions and SVG container
    const width = 800;
    const height = 800;
    const cellSize = 10;

    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create a color scale
    const colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain([0, 255]);

    // Create a grid of cells
    const rows = gridData.length;
    const cols = gridData[0].length;

    const cells = svg.selectAll("rect")
        .data(gridData.flat())
        .enter()
        .append("rect")
        .attr("x", (d, i) => (i % cols) * cellSize)
        .attr("y", (d, i) => Math.floor(i / cols) * cellSize)
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("fill", d => colorScale(d))
        .attr("stroke", "gray")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "red");
            // Display byte value (you can customize this part)
            d3.select(container).append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background", "white")
                .style("border", "1px solid black")
                .style("padding", "5px")
                .style("pointer-events", "none")
                .html(`Value: ${d}`)
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY + 5}px`);
        })
        .on("mouseout", function() {
            d3.select(this).attr("stroke", "gray");
            d3.select(container).select(".tooltip").remove();
        });
};

export default plotBinary;