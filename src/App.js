import React, { Component } from 'react';
import './App.css';
import RGL, { WidthProvider } from "react-grid-layout";
import ChartWrapper from './chartWrapper';

const ReactGridLayout = WidthProvider(RGL);

class App extends Component {
  
  state = {
    resizeplotly: {},
    chartData: ["1", "2"],
    layout: [],
  };

  gridRef = null;

  componentDidMount() {
      const { chartData } = this.state;
      const generatedLayout = this.generateLayout(chartData);
      this.setState({
          layout: generatedLayout,
      });
  }

  // Function to generate React Grid Layout
  generateLayout = (data, _yIndex) => {
    let yIndex = _yIndex || 0;
    let count = 0;
    if (data && data.length > 0) {
        return data.map((item, idx) => {
            const obj = {};
            if (idx % 2 === 0) {
                count = 0;
                obj.x = count;
                obj.y = yIndex * 4;
            } else {
                count += 1;
                obj.x = count;
                if (idx === 1) {
                    obj.y = yIndex * 4;
                    yIndex += 1;
                }
                if (idx !== 0 && idx !== 1) {
                    obj.y = yIndex * 4;
                    yIndex += 1;
                }
            }
            obj.w = 1;
            obj.h = 4;
            obj.i = item;
            // default options required
            obj.moved = false;
            obj.static = false;
            return obj;
        });
    }
    return [];
  }

  onLayoutChange = (layout) => {
    this.setState({layout});
  }

//   onResize = (layout) => {
//     this.setState({ layout });
//   }

  onDragEnd = (e) => {
    const { onMouseUp } = this.props;
    e.preventDefault();
    e.stopPropagation();
    onMouseUp(e);
  }

  getToggleChartLayout = (idx, layout) => {
    const _x = layout[idx].x;
    const _y = layout[idx].y;
    const _w = layout[idx].w;

    const sortedYLayout = layout.map(a => ({ ...a }));
    const sortedLayout = sortedYLayout.sort((a, b) => a.y - b.y); // Sort the layout based on 'y' element's.
    // Sort the layout based on 'x' element's.
    for (let i = 0; i < sortedLayout.length - 1; i += 1) {
        if (sortedLayout[i].y === sortedLayout[i + 1].y) {
            if (sortedLayout[i].x === 1 && sortedLayout[i + 1].x === 0) {
                // swap the elements in the array
                const temp = sortedLayout[i + 1];
                sortedLayout[i + 1] = sortedLayout[i];
                sortedLayout[i] = temp;
            }
        }
    }
    // Find the index of the chart element, user is trying to toggle in the SORTED layout array
    const toggleChartIndex = sortedLayout.findIndex(item => item.x === _x && item.y === _y);
    if (toggleChartIndex !== -1) {
        if (_w === 1) {
            // chart from 50% to 100%
            let hasToggledChartOnColTwo = false;
            let hasToggledChartOnColOne = false;
            let isChartPresentinCol2;
            let isChartPresentinCol1;
            let hasMetFullWidthTile = false;
            for (let item = toggleChartIndex; item < sortedLayout.length; item += 1) {
                if (item === toggleChartIndex) { // change chart width = 2
                    sortedLayout[item].w = 2;
                    isChartPresentinCol1 = sortedLayout.findIndex(elm => elm.x === 0 && elm.y === _y); // To check if Chart is Present in Col-1
                    if (sortedLayout[item].x === 1) { // col - 2
                        if (isChartPresentinCol1 === -1) {
                            sortedLayout[item].x = 0;
                        } else {
                            sortedLayout[item].x = 0; // Move chart to next row only when there is no chart present in the col-1.
                            sortedLayout[item].y += 4;
                            hasToggledChartOnColTwo = true;
                        }
                    } else {
                        hasToggledChartOnColOne = true;
                        isChartPresentinCol2 = sortedLayout.findIndex(elm => elm.x === 1 && elm.y === _y);
                    }
                } else {
                    // change layout for the charts below the target chart element.
                    if (hasToggledChartOnColTwo) {
                        sortedLayout[item].y += 4; // Move chart to next row.
                    } else if (hasToggledChartOnColOne) {
                        // check if there is a chart present in col-2
                        if (isChartPresentinCol2 !== -1) {
                            if (sortedLayout[item].w === 2) {
                                sortedLayout[item].y += 4; // Move chart to next row.
                                hasMetFullWidthTile = true;
                            } else {
                                if (!hasMetFullWidthTile) {
                                    if (sortedLayout[item].x === 0) {
                                        sortedLayout[item].x = 1;
                                    } else {
                                        sortedLayout[item].x = 0;
                                        sortedLayout[item].y += 4;
                                    }
                                } else {
                                    // Move chart element's to next row's - without changing X position.
                                    sortedLayout[item].y += 4;
                                    hasMetFullWidthTile = false;
                                }
                            }
                        }
                    }
                }
            }
        } else {
            // chart from 100% to 50%
            for (let item = toggleChartIndex; item < sortedLayout.length; item += 1) {
                if (item === toggleChartIndex) { // change chart width = 1
                    sortedLayout[item].w = 1;
                }
            }
        }
    }
    // replace the X, Y values of layout array with sortedLayout array.
    layout.map((element) => {
        const index = sortedLayout.findIndex(itm => itm.i === element.i);
        if (index !== -1) {
            element.x = sortedLayout[index].x;
            element.y = sortedLayout[index].y;
            element.w = sortedLayout[index].w;
        }
        return element;
    });
    return layout;
  }

  toggleExpandChart = (chartId, idx) => {
    const { layout, resizeplotly } = this.state;
    const gridLayout = this.getToggleChartLayout(idx, layout);
    if (this.gridRef) {
        this.gridRef.setState({ layout: JSON.parse(JSON.stringify(layout)) });
    }
    this.setState({
        resizeplotly: {
            ...resizeplotly,
            [chartId]: !resizeplotly[chartId],
        },
        layout: gridLayout,
    });
  }

  render() {
    const { resizeplotly, layout } = this.state;
    const chartItem = layout && layout.length > 0 && layout.map((item, idx) => (
        <div className="item" key={idx}>
            <div className='MyDragHandleClassName' style={{ display: 'flex', justifyContent: 'space-around' }}> 
                Drag from Here - {idx + 1}
                <button onClick={()=>this.toggleExpandChart(idx, idx)}> {item.w === 2 ? 'Collpase' : 'Expand'} </button>
            </div>
            <ChartWrapper resizeplotly={resizeplotly} id={idx}/>
        </div>
    ));
    return (
      <div className="App">
        {layout && layout.length > 0
            && (
                <ReactGridLayout
                    ref={(_gridLayout) => {
                        this.gridRef = _gridLayout;
                        }
                    }
                    {...this.props}
                    cols={2}
                    onLayoutChange={this.onLayoutChange}
                    onMouseUp={event => this.onDragEnd(event)}
                    // onResize={this.onResize}
                    isDraggable
                    draggableHandle=".MyDragHandleClassName"
                    draggableCancel=".MyDragCancel"
                >
                    {layout.map((e, i) => (
                        <div
                            key={e.i}
                            data-grid={{
                                x: e.x,
                                y: e.y,
                                w: e.w,
                                h: e.h,
                            }}
                        >
                            {chartItem[i]}
                        </div>
                    ))
                    }
                </ReactGridLayout>
            )
        }
      </div>
    );
  }
}

App.defaultProps = {
    rowHeight: 115,
    cols: 2, // to make grid item 50% - 100%
};

export default App;
