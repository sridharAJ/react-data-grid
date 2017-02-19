React Data Grid

## Table Component Features:
- Configurable Columns, ie coulmns can be of any type (input/checkbox/text/date) etc
- Pagination ie component should provide hooks to easily paginate and UI for pagination
- Sorting, ability to do soritng on single/multiple columns
- Ablitity to handle hundreds of thousands of rows without issue
- Infinite scroll
- Column Resizing

## Examples:

```
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './DataGrid/DataGrid.css';
import DataGrid from './DataGrid';
import Data from './react-data-grid-data.json';
import _ from 'underscore';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableConfig: {
                localSearch: true,
                showHeader: true,
                showFooter: true,
                currentPage: 1,
                sortDirection: null,
                sortColumn: null,
                resultsPerPage: 100,
                data: Data,
                elementId: "testTable",
                columnMetadata: [
                    {
                        columnName: "odometer",
                        displayName: "Odometer",
                        flexBasis: 200,
                        minWidth: 100,
                        render: (props, state, columnMeta, columnIndex) => {
                            return (
                                <div style={{color: 'red'}}>
                                    {props.data[columnMeta.columnName]}
                                </div>
                            )
                        }
                    },
                    {
                        columnName: "created_at",
                        displayName: "Created At",
                        flexBasis: 200,
                        minWidth: 100
                    },
                    {
                        columnName: "price",
                        displayName: "Price",
                        flexBasis: 200,
                        minWidth: 100
                    },
                    {
                        columnName: "year",
                        displayName: "Year",
                        flexBasis: 200,
                        minWidth: 100
                    },
                    {
                        columnName: "",
                        displayName: "Action",
                        flexBasis: 200,
                        minWidth: 100,
                        render: (props, state, columnMeta, columnIndex) => {
                            return (
                                <div style={{color: 'red'}}>
                                    <button>Remove</button>
                                </div>
                            )
                        }
                    }
                ]
            }
        }

        this.onChangeGrid = this.onChangeGrid.bind(this);
    }

    onChangeGrid(event, data) {

        var tableConfig = this.state.tableConfig;
        _.extend(tableConfig, data);
        this.setState({
            tableConfig: tableConfig
        });
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>React Data Grid</h2>
                </div>
                <div style={{height: 300}}>
                    <DataGrid {...this.state.tableConfig} onChangeGrid={this.onChangeGrid} />
                </div>
            </div>
        );
    }
}
```

## To run example in devlopment mode:
- git clone git@github.com:sridharAJ/react-data-grid.git
- npm install
- npm start
