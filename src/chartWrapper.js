import React from 'react';
import PlotlyChart from './plotly';
import enhancePlotlyHOC from './HOC';

const EnhancedPlotlyChart = enhancePlotlyHOC(PlotlyChart);

class ChartWrapper extends React.PureComponent {

    state = {
        data: [
            {
              x: [1, 2, 3],
              y: [2, 6, 3],
              type: 'scatter',
              mode: 'lines+points',
              marker: {color: 'red'},
            },
            {type: 'line', x: [1, 2, 3], y: [2, 5, 3]},
        ],
    }
    render() {
        const { data } = this.state;
        const { resizeplotly, id } = this.props;
        return (
            <EnhancedPlotlyChart chartData={data} resizeplotly={resizeplotly} id={id} />
        )
    }
}

export default ChartWrapper;