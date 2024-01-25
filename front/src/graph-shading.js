// customChartPlugin.js
export function drawQuadrantsPlugin(Chart) {
    function drawQuadrants(chart) {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const midX = (chartArea.left + chartArea.right) / 2;
        const midY = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();
        ctx.globalAlpha = 0.2;

    // Top-left quadrant (Red)
    ctx.fillStyle = 'red';
    ctx.fillRect(chartArea.left, chartArea.top, midX - chartArea.left, midY - chartArea.top);

    // Top-right quadrant (Green)
    ctx.fillStyle = 'green';
    ctx.fillRect(midX, chartArea.top, chartArea.right - midX, midY - chartArea.top);

    // Bottom-left quadrant (Blue)
    ctx.fillStyle = 'blue';
    ctx.fillRect(chartArea.left, midY, midX - chartArea.left, chartArea.bottom - midY);

    // Bottom-right quadrant (Yellow)
    ctx.fillStyle = 'yellow';
    ctx.fillRect(midX, midY, chartArea.right - midX, chartArea.bottom - midY);
    
        ctx.restore();
    }

    return {
        id: 'customQuadrantPlugin',
        beforeDraw: (chart) => {
            drawQuadrants(chart);
        }
    };
}


