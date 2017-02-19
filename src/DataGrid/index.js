/**
 * Created by 12072 on 17/02/17.
 */
import React from 'react';
import './DataGrid.css'
import DataGridHeader from './DataGridHeader';
import DataGridRows from './DataGridRows';
import DataGridFooter from './DataGridFooter';
import _ from 'underscore';

export default class DataGrid extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeGrid = this.onChangeGrid.bind(this);
        this.setRef = this.setRef.bind(this);
        this.state = {
            search: ""
        }
    }

    onChangeGrid(event, data) {
        data = data || {};
        data.forceRender = false;
        this.props.onChangeGrid(event, data, this.props.elementId);
    }

    compareObjects(a, b, direction) {

        if (!isNaN(a) && !isNaN(b)) {
            if (direction === 'ASC') {
                return a - b;
            } else {
                return b - a;
            }
        } else if (a && b) {
            if (direction === 'ASC') {
                return a.toString().localeCompare(b.toString())
            }
            else {
                return b.toString().localeCompare(a.toString())
            }
        }
        return 0;
    }

    sortComparator(a, b, column) {
        return this.compareObjects(a, b, column.direction);
    }

    sortDataOnColumn(data, sortColumns) {
        if (!sortColumns || !sortColumns.length)
            return data;

        data.map((item, index)=> {
            item['_index'] = index;
        });

        data.sort((a, b) => {
            let cmp = 0, ax, bx;
            sortColumns.map((column, i) => {
                ax = a[column.name];
                bx = b[column.name];
                const temp = this.props.sortComparator ? this.props.sortComparator(ax, bx, column) : this.sortComparator(ax, bx, column);
                if (cmp == 0) {
                    cmp = temp;
                }
            })
            return cmp;
        })
        return data;
    }

    getResponse() {
        var startIndex = (this.props.currentPage - 1) * this.props.resultsPerPage;
        var endIndex = startIndex + this.props.resultsPerPage;
        const sortColumns = this.props.sortColumns.length ? this.props.sortColumns : (this.props.sortColumn ? [{name: this.props.sortColumn, direction: this.props.sortDirection}] : [])
        var data = this.sortDataOnColumn(this.props.data, sortColumns);
        let search = this.props.searchTerm == null || this.props.searchTerm === undefined ? this.state.search : this.props.searchTerm;
        data = this.patternMatch(search, data);
        var length = data.length;
        data = data.slice(startIndex, endIndex);

        return data;
    }

    getSearchAttributes(columnMetaData){
        return _.map(columnMetaData, (item, inx) => {
            if(item.columns) {
                return this.getSearchAttributes(item.columns);
            }else{
                return item;
            }
        })
    }
    patternMatch(text, data) {
        if (!text) {
            return data
        }
        var attributes = _.flatten(this.getSearchAttributes(this.props.columnMetadata));
        return _.chain(data)
            .map((obj) => {
                var exist = false;
                for (var i = 0; i < attributes.length; i++) {
                    if (attributes[i]["searchable"]) {
                        var columnValue = obj[attributes[i]["columnName"]];
                        columnValue = (typeof columnValue === "number") ? columnValue.toString() : columnValue;
                        var formattedValue = attributes[i]["formatter"] ? attributes[i]["formatter"](columnValue) : columnValue;
                        if (typeof formattedValue === 'string' && formattedValue.toLowerCase().indexOf(text.trim().toLowerCase()) != -1) {
                            exist = true;
                            break;
                        }
                    }
                }
                return exist ? obj : null
            })
            .compact()
            .value();
    }

    hideResizeIndicator() {
        if(this.dataGridScroll) {
            var tableLine = this.dataGridScroll.getElementsByClassName("table-header-line")[0];
            tableLine.style.display = "none";
        }
    }

    searchHandler(event) {
        if (this.props.searchTerm!==null && this.props.searchTerm!==undefined) {
            this.props.onChangeSearch && this.props.onChangeSearch(event);
        }
        else {
            this.setState({
                search: event.value
            })
        }
    }

    setRef(ref) {
        this.dataGridScroll = ref;
        this.hideResizeIndicator();
    }

    getGridWidth() {
        let total = 0;
        this.props.columnMetadata.forEach((column) => {
            total += column.flexBasis ? parseInt(column.flexBasis) : 100
        });
        return total;
    }

    render() {

        let data = this.getResponse();
        var resultsOnPage = data && data.length <= this.props.resultsPerPage ? data.length : this.props.resultsPerPage;

        return (
            <div className={"gridParent"}>
                <div className="gridScroll" ref={this.setRef} id={this.props.elementId}>
                    <div className={"grid row"} style={{minWidth: this.getGridWidth()}}>
                        <div className="table-header-line">
                            <div className="table-header-border">
                            </div>
                        </div>
                        <DataGridHeader {...this.props}
                            onChangeGrid={this.onChangeGrid}
                            data={data}
                        />
                        <DataGridRows {...this.props}
                            onChangeGrid={this.onChangeGrid}
                            data={data}
                            resultsOnPage={resultsOnPage}
                        />
                    </div>
                </div>
                <DataGridFooter {...this.props}
                    className=''
                    style={{}}
                    currentPage={parseInt(this.props.currentPage)}
                    totalCount={this.props.data.length}
                    onChangeGrid={this.onChangeGrid}
                    resultsOnPage={resultsOnPage}/>
            </div>
        )
    }
}

DataGrid.defaultProps = {
    className: '',
    data: null,
    enableSorting: true,
    resultsPerPage: 10,
    currentPage: 1,
    sortColumn: '',
    sortDirection: '',
    sortColumns: [],
    sortComparator: null,
    loading: false,
    onColumnResize: () => {
    },
    onHeaderClick: null,
    onFooterClick: null,
    showHeader: true,
    showFooter: true,
    elementId: null
}