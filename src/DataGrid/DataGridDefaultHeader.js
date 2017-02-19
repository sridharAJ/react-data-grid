/**
 * Created by 12072 on 17/02/17.
 */
import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import typeRenderer from './dataTypeRenderer';
import './DataGrid.css'
export default class DataGridDefaultHeader extends React.Component {
    constructor(props) {
        super(props)
        this.getGroup = this.getGroup.bind(this)
    }

    getGroup(columnMeta, columnIndex) {
        var style = (columnMeta.flexBasis !== undefined) ? {flexBasis:columnMeta.flexBasis,flexGrow:0,flexShrink:0} : {};
        if (columnMeta.flexGrow !== undefined) {
            style.flexGrow = columnMeta.flexGrow;
        }

        style = typeRenderer.style(style, columnMeta);
        style = Object.assign(style, columnMeta.style, columnMeta.headerStyle);
        if (columnMeta.columns) {
            return (
                <div key={columnIndex} className="header-group" style={style}>
                    <div data-column={columnMeta.columnName} title={columnMeta.toolTip}
                         className={'defaultCell column-group-'+ columnIndex +' column-'+ columnMeta.columnName +' header-cell'} key={columnIndex}>
                        {columnMeta.displayName}
                    </div>
                    <div className="header-item">
                        {
                            columnMeta.columns.map((nestedColumn, nestedColumnIndex) => {
                                return <HeaderCell  key={nestedColumnIndex} columnMeta={nestedColumn} columnIndex={nestedColumnIndex} {...this.props}/>
                            })
                        }
                    </div>
                </div>
            )
        }
        return <HeaderCell key={columnIndex} columnMeta={columnMeta} columnIndex={columnIndex} {...this.props}/>
    }

    render() {
        const {columnMetadata} = this.props;
        return (
            <div className='defaultRow header'>
                {columnMetadata.map(this.getGroup)}
            </div>
        )
    }
}

class HeaderCell extends Component {
    constructor(props) {
        super(props)
        this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
        this.doDrag = this.doDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this)
    }

    onColumnResize(newWidth) {
        let columnMetadata = this.props.columnMetadata;
        let columnName = this.props.columnMeta.columnName;
        columnMetadata = columnMetadata.map((item) => {
            if(item.columnName === columnName){
                item.flexBasis = newWidth;
            }
            return item;
        });
        let width = 0;
        columnMetadata.forEach((column) => {
            if(column.flexBasis) {
                width += parseInt(column.flexBasis);
            }else {
                width += 100;
            }
        });
        this.props.onChangeGrid(null, {width, columnMetadata});
    }

    componentDidMount() {
        this.hideResizeIndicator();
    }

    getParentElement() {
        return document.getElementById(this.props.elementId);
    }

    setResizeIndicatorPosition(e) {
        let dataGridScroll = this.getParentElement();
        if(dataGridScroll) {
            var tableLine = dataGridScroll.getElementsByClassName("table-header-line")[0];
            var parentEle = dataGridScroll.getElementsByClassName("grid row")[0];
            var headerCellBound = parentEle.getBoundingClientRect();
            tableLine.style.left = ((e.clientX) - headerCellBound.left) + "px";
        }
    }

    hideResizeIndicator() {
        let dataGridScroll = this.getParentElement();
        if(dataGridScroll) {
            var tableLine = dataGridScroll.getElementsByClassName("table-header-line")[0];
            tableLine.style.display = "none";
        }
    }

    showResizeIndicator() {
        let dataGridScroll = this.getParentElement();
        if(dataGridScroll) {
            var tableLine = dataGridScroll.getElementsByClassName("table-header-line")[0];
            tableLine.style.display = "block";
        }
    }

    doDrag(e) {
        this.pauseEvent(e);
        let width = (this.startWidth + e.clientX - this.startX);
        let minWidth = this.props.columnMeta.minWidth ? parseInt(this.props.columnMeta.minWidth) : 0;
        if(width > minWidth) {
            this.setResizeIndicatorPosition(e);
            this.width = width + "px";
        }else {
            this.width = minWidth + "px";
        }

    }

    stopDrag(e) {
        this.pauseEvent(e);
        this.lastDragEvent = e.timeStamp;
        this.hideResizeIndicator()
        this.startX = this.startWidth = 0;
        this.onColumnResize(this.width);
        document.documentElement.removeEventListener('mousemove', this.doDrag, false);
        document.documentElement.removeEventListener('mouseup', this.stopDrag, false);
    }

    pauseEvent(e){
        if(e.stopPropagation) e.stopPropagation();
        if(e.preventDefault) e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }

    handleOnClick(event) {

        if (event.timeStamp === this.lastDragEvent)
            return;

        const {sortColumns} = this.props
        const sortColumn = event.currentTarget.getAttribute('data-column');
        const existingColumn = this.props.sortColumns && this.props.sortColumns.filter((column) => column.name === sortColumn)[0]

        if (event.shiftKey && existingColumn){
            event.preventDefault();
            existingColumn.direction = existingColumn.direction === 'DESC' ? 'ASC' : 'DESC';
        } else if (event.shiftKey) {
            event.preventDefault();
            sortColumns.push({direction: 'ASC', name: sortColumn});
        } else {
            sortColumns.length = 0;
            sortColumns.push({direction: existingColumn && existingColumn.direction === 'ASC' ? 'DESC' : 'ASC', name: sortColumn});
        }
        this.props.onChangeGrid(event,{
            sortColumns,
            rerender: true
        })
    }

    handleOnMouseDown(e) {
        e.stopPropagation();
        e.preventDefault();
        const headerCell = ReactDOM.findDOMNode(this.refs[this.props.columnMeta.columnName]);
        this.startX = e.clientX;
        this.startWidth = parseInt(document.defaultView.getComputedStyle(headerCell).width, 10);
        this.width = this.startWidth;
        this.showResizeIndicator();
        this.setResizeIndicatorPosition(e);

        document.documentElement.addEventListener('mousemove', this.doDrag, false);
        document.documentElement.addEventListener('mouseup', this.stopDrag, false);
    }

    render() {
        const {columnMeta, columnIndex} = this.props;
        var displayName = columnMeta.displayName;

        var sortIcon = (<i className="fa fw"></i>);
        const existingColumn = this.props.sortColumns && this.props.sortColumns.filter((column) => column.name === columnMeta.columnName)[0]


        if (existingColumn) {
            if (existingColumn.direction === 'ASC')
                sortIcon = (<i className="fa fa-sort-asc">&nbsp;</i>);
            else if (existingColumn.direction === 'DESC')
                sortIcon = (<i className="fa fa-sort-desc">&nbsp;</i>);
        } else {
            sortIcon = <i style={{color: '#ccc'}} className="fa fa-sort">&nbsp;</i>;
        }

        var style = (columnMeta.flexBasis !== undefined) ? {minWidth: columnMeta.flexBasis,  flexBasis: columnMeta.flexBasis,flexGrow:0,flexShrink:0} : {};
        if (columnMeta.flexGrow !== undefined) {
            style.flexGrow = columnMeta.flexGrow;
        }
        style = typeRenderer.style(style, columnMeta);
        style = Object.assign(style, columnMeta.style, columnMeta.headerStyle);
        style.cursor = "pointer";
        style.userSelect = "none";
        return (
            <div ref={columnMeta.columnName} data-column={columnMeta.columnName} title={columnMeta.toolTip || displayName}
                 className={'defaultCell column-' + columnIndex + ' column-' + columnMeta.columnName +' header-cell ' + columnMeta.className} style={{...style}}
                 onClick={this.handleOnClick} key={columnIndex}>
                <span style={{flex: 1}}>{displayName}</span>
                <span style={{position:'relative'}}>{sortIcon}</span>
                <span className="table-header-resize" onMouseDown={this.handleOnMouseDown}></span>
            </div>
        )
    }
}