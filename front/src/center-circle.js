// customChartPlugin.js
export function drawCenterCirclePlugin(Chart) {
    function drawCenterCircle(chart) {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;
        const radius = Math.min(chartArea.right - centerX, chartArea.bottom - centerY) * 0.5; // 50% of the smaller dimension

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // Set color and opacity for the circle
        ctx.fill();
        ctx.restore();
    }

    return {
        id: 'customCenterCirclePlugin',
        beforeDatasetsDraw: (chart) => {
            drawCenterCircle(chart);
        }
    };
}
