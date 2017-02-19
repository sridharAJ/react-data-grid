/**
 * Created by 12072 on 20/02/17.
 */
import React from 'react';
import './DataGrid.css'
import SmartDropDownSelect from 'react-select';

export default class DataGridDefaultFooter extends React.Component {
    constructor(props) {
        super(props);
        var totalPages = this.computePage(props.totalCount, props.resultsPerPage);

        this.state = {
            totalPages: totalPages
        }

        this.handlePreviousClick = this.handlePreviousClick.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnChangePage = this.handleOnChangePage.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
    }

    handleOnChange(response) {
        var resultsPerPage = response.value;
        this.props.onChangeGrid(null, {
            resultsPerPage: resultsPerPage,
            currentPage:1
        });
    }

    handleOnChangePage(response) {
        var currentPage = response.value;
        this.props.onChangeGrid(null, {
            currentPage: currentPage
        });
    }

    handleNextClick(event) {
        if (this.props.currentPage < this.state.totalPages) {
            this.props.onChangeGrid(event, {
                currentPage: this.props.currentPage + 1
            });
        }
    }

    handlePreviousClick(event) {
        if (this.props.currentPage > 1) {
            this.props.onChangeGrid(event, {
                currentPage: this.props.currentPage - 1
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        var totalPages = this.computePage(nextProps.totalCount, nextProps.resultsPerPage);
        this.setState({
            totalPages: totalPages
        });
    }

    computePage(totalCount, resultsPerPage){
        var totalPages = Math.floor(totalCount / resultsPerPage);
        if (totalCount % resultsPerPage !== 0) {
            totalPages++;
        }
        return totalPages;
    }

    render() {
        var optionsArray = [];
        var arr = [10,20,50,100];
        for (var i = 0; i < arr.length; i++) {
            optionsArray.push({
                label: arr[i],
                value: arr[i]
            });
        }
        var pageArr=[];
        for(var i=1;i<=Math.ceil(this.props.totalCount/this.props.resultsPerPage);i++){
            pageArr.push({
                label: i,
                value: i
            });
        }
        return (
            <div className='defaultFooter'>
                <div className="pagination pull-left">
                    Rows per page : <SmartDropDownSelect style={{width:50}} clearable={false} searchable={false} className="selectPage" value={this.props.resultsPerPage} placeholder="" options= {optionsArray} onChange={this.handleOnChange}/> </div>
                <div className="pagination pull-right">
                    <div style={{display:'inline-block'}}>
                        {this.props.totalCount>0? ((this.props.currentPage - 1) * this.props.resultsPerPage + 1):0}&nbsp;
                        to {(this.props.currentPage - 1) * this.props.resultsPerPage + this.props.resultsOnPage}&nbsp;
                        of {this.props.totalCount} rows &nbsp;&nbsp;&nbsp;</div>
                    <div style={{display:'flex'}}>
                        <button className='btn previousButton' type="button" onClick={this.handlePreviousClick}>
                            <i className="fa fa-angle-left"></i></button>
                        <SmartDropDownSelect style={{width:50}} clearable={false}  searchable={false} className="selectPage" value={this.props.currentPage}  placeholder="" options= {pageArr} onChange={this.handleOnChangePage}/>
                        <button className='btn nextButton' type="button" onClick={this.handleNextClick}>
                            <i className="fa fa-angle-right"></i></button>
                    </div>
                </div>
                <div style={{clear:'both'}}></div>
            </div>
        )
    }
}