/**
 * Created by 12072 on 17/02/17.
 */
import React from 'react'
import typeRenderer from './dataTypeRenderer';
import './DataGrid.css'

export default class DataGridDefaultRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={'defaultRow '+this.props.className} style={{height: this.props.heightOfItem}}>
                {
                    this.props.columnMetadata.map((columnMeta, columnIndex) => {
                        if(columnMeta.show === false) return null;
                        var style = (columnMeta.flexBasis !== undefined) ? { minWidth: columnMeta.flexBasis, flexBasis: columnMeta.flexBasis,flexGrow:0,flexShrink:0} : {};
                        if (columnMeta.flexGrow !== undefined) {
                            style.flexGrow = columnMeta.flexGrow;
                        }
                        var cell;
                        if (typeof columnMeta.render === 'function') {
                            cell = columnMeta.render(this.props, this.state, columnMeta, columnIndex);
                        } else {
                            cell = this.props.data[columnMeta.columnName];
                            cell = typeRenderer.data(cell, columnMeta);
                            style = typeRenderer.style(style, columnMeta);

                        }

                        if (typeof columnMeta.formatter === 'function') {
                            var cellToolTip = columnMeta.formatter(this.props.data[columnMeta.columnName]);
                        }else if(typeof this.props.data[columnMeta.columnName] === 'string'){
                            cellToolTip = this.props.data[columnMeta.columnName];
                        }else{
                            cellToolTip = columnMeta.displayName;
                        }

                        style = Object.assign(style,columnMeta.style);
                        
                        return (
                            <div className={'defaultCell cell column-'+columnIndex+' column-'+columnMeta.columnName+" "+columnMeta.className} style={style} key={columnIndex} title={cellToolTip}>{cell}</div>
                        );
                    })
                }
            </div>

        )
    }
}