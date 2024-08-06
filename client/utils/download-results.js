const downloadResults = () => {
    const canvas = document.getElementById("entropyChart");
    const ctx = canvas.getContext("2d");

    // Save the current state
    ctx.save();

    // Set the background color
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#091d33";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the chart again to ensure it is on top of the background
    chartInstance.update();

    // Download the image
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "EntropyChart.png";
    link.click();

    // Restore the state
    ctx.restore();
};