import React from 'react';

const enhancePlotlyHOC = (WrappedComponent) => {

    class enhancePlotly extends React.PureComponent {
        render() {
            const {chartData, resizeplotly, id } = this.props;
            return(
                <WrappedComponent data={chartData} resizeplotly={resizeplotly} id={id} />
            )
        }
    }
    return enhancePlotly;
}

export default enhancePlotlyHOC;