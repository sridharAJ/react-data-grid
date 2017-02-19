/**
 * Created by 12072 on 20/02/17.
 */
import React from 'react';
import DefaultFooter from './DataGridDefaultFooter';
import './DataGrid.css'

export default class DataGridFooter extends React.Component {
    constructor(props) {
        super(props);
        var totalPages = Math.ceil(props.numberOfEntries / props.resultsPerPage);

        this.state = {
            totalPages: totalPages
        }

        this.onChangeGrid = this.onChangeGrid.bind(this);
        this.handleFooterClick = this.handleFooterClick.bind(this);
    }

    onChangeGrid(event, data) {
        var newData = data;
        newData.selectedRows = {};
        this.props.onChangeGrid(event, newData);
    }

    handleFooterClick(data, event) {
        this.props.onFooterClick && this.props.onFooterClick(data, event);
    }

    render() {
        var optionsArray = [];
        for (var i = 1; i <= this.state.totalPages; i++) {
            optionsArray.push(
                <option >{i}</option>
            )
        }
        var Footer = this.props.showFooter ? this.props.CustomFooter ? this.props.CustomFooter : DefaultFooter : null;

        return (
            <div>
                {Footer ? <Footer {...this.props}
                    onChangeGrid={this.onChangeGrid}
                    onFooterClick={this.handleFooterClick}/> : null}
            </div>
        )
    }
}