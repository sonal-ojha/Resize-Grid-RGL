import React from 'react';
import Plot from 'react-plotly.js';

class PlotlyChart extends React.PureComponent {

    render() {
        const { layout, config, data, id } = this.props;
        return (
            <Plot
                id={id}
                data={data}
                layout={layout}
                config={config}
            />
        );
    }
}

PlotlyChart.defaultProps = {
    id: 'chart',
    config: {
        displaylogo: false,
        scrollZoom: false,
        displayModeBar: false,
        modeBarButtonsToRemove: ['sendDataToCloud',
            'zoom2d',
            'pan2d',
            'select2d',
            'lasso2d',
            'zoomIn2d',
            'zoomOut2d',
            'autoScale2d',
            'resetScale2d',
            'hoverClosestCartesian',
            'hoverCompareCartesian',
            'toggleSpikelines',
            'zoom3d',
            'pan3d',
            'orbitRotation',
            'tableRotation',
            'resetCameraDefault3d',
            'resetCameraLastSave3d',
            'zoomInGeo',
            'zoomOutGeo',
            'resetGeo',
            'hoverClosestGeo',
            'hoverClosestGl2d',
            'hoverClosestPie',
            'toggleHover',
            'resetViews',
            'resetViewMapbox',
            'hoverClosest3d',
            ],
    },
    layout: {
        width: undefined,
        height: undefined,
        autosize: true,
        margin: {
            l: 10,
            r: 10,
            b: 10,
            t: 10,
            pad: 0,
        },
        font: {
            family: "'PT Sans', sans-serif",
            size: 14,
            color: '#666666',
        },
        legend: {
            orientation: 'h',
                x: 0.3,
        },
        showlegend: true,
        hovermode: 'closest',
        hoverdistance: 30,
        xaxis: {
            showgrid: false,
        },
    },
};

export default PlotlyChart;