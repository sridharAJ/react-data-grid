/**
 * Created by 12072 on 17/02/17.
 */
import React from 'react';
import DefaultRow from './DataGridDefaultRow';
import './DataGrid.css'
export default class DataGridRows extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollPosition: 0
        }

        this.updateScrollPosition = this.updateScrollPosition.bind(this);
    }

    componentDidMount() {
        this.refs.rowContainer.addEventListener('scroll', this.updateScrollPosition);
    }

    componentWillUnmount() {
        this.refs.rowContainer.removeEventListener('scroll', this.updateScrollPosition);
    }

    updateScrollPosition() {
        const newScrollPosition = this.refs.rowContainer.scrollTop / this.props.heightOfItem;
        const difference = Math.abs(this.state.scrollPosition - newScrollPosition);
        if (difference >= this.props.maxItemsToRender / 5) {
            this.setState({ scrollPosition: newScrollPosition });
        }
    }

    render() {

        const startPosition =
            this.state.scrollPosition - this.props.maxItemsToRender > 0
                ? this.state.scrollPosition - this.props.maxItemsToRender
                : 0;

        const endPosition =
            this.state.scrollPosition + this.props.maxItemsToRender >= this.props.data.length
                ? this.props.data.length
                : this.state.scrollPosition + this.props.maxItemsToRender;

        var rows = this.props.data.slice(startPosition, endPosition).map((item, index)=> {
            return (
                <DefaultRow {...this.props}
                    rowId={index}
                    data={item}
                    key={item.id} className={ 'row-' + index}/>
            );
        });

        return (
            <div className={"rowContainer"} ref='rowContainer'>
                <div key='top-scroll' style={{height: startPosition * this.props.heightOfItem}}></div>
                {rows}
                <div key='bottom-scroll' style={{height: this.props.data.length * this.props.heightOfItem - endPosition * this.props.heightOfItem}}></div>
            </div>
        )
    }
}

DataGridRows.defaultProps = {
    maxItemsToRender: 20,
    heightOfItem:30
}