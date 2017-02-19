/**
 * Created by 12072 on 17/02/17.
 */
import React from 'react';
import DefaultHeader from './DataGridDefaultHeader';
import './DataGrid.css'
export default class DataGridHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        if(this.props.showHeader==false) return null;

        let Header, headerContainerClass;
        if (this.props.customHeader) {
            Header = this.props.CustomHeader;
            headerContainerClass = 'customHeaderContainer';
        }else {
            Header = DefaultHeader;
            headerContainerClass = '';
        }
        
        
        return (
            <div className={"headerContainer " + headerContainerClass}>
                <Header {...this.props}/>
            </div>
        )
    }
}