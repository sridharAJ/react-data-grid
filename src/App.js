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
                title: '',
                resultsPerPage: 10000,
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
        this.onSort = this.onSort.bind(this);
    }

    onChangeGrid(event, data) {

        var tableConfig = this.state.tableConfig;
        _.extend(tableConfig, data);
        this.setState({
            tableConfig: tableConfig
        });
    }

    onSort(a, b, sortColumn) {
        const numberRegx = /^[-]*[0-9,/.]*$/;
        const numA = typeof a == 'number' ? a : numberRegx.test(a) ? Number(a.replace(/,/g , '')) : a
        const numB = typeof b == 'number' ? b : numberRegx.test(b) ? Number(b.replace(/,/g , '')) : b
        if (!isNaN(numA) && !isNaN(numB)) {
            if (sortColumn.direction === 'ASC') {
                return numA - numB
            } else {
                return numB - numA
            }
        } else if (a && b) {
            if (sortColumn.direction === 'ASC') {
                return a.toString().localeCompare(b.toString())
            }
            else {
                return b.toString().localeCompare(a.toString())
            }
        }
        return 0;
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React pp</h2>
                </div>
                <p className="App-intro">
                To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <div style={{height: 300}}>
                    <DataGrid {...this.state.tableConfig} onChangeGrid={this.onChangeGrid} />
                </div>
            </div>
        );
    }
}

export default App;
