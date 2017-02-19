/**
 * Created by 12072 on 17/02/17.
 */
import moment from 'moment';

var isDefined = function (value){
    if(value===null || value===undefined)
        return false;
    else
        return true;
};

module.exports = {
    data: function (value, meta) {

        var finalValue = value;

        switch(meta.type) {

            case 'date':

                var format = (meta.dateFormat || 'DD MMM YYYY');
                finalValue = isDefined(value) ? moment(new Date(value)).format(format):' ';
                break;

            case 'currency':

                finalValue = isDefined(value)?value.toLocaleString('hi-IN'):' ';
                break;
            case 'percentage':

                finalValue = isDefined(value)?value+'%':'';
                break;
            default:
                break;

        }

        return isDefined(value)?finalValue.toString():finalValue;
    },

    style: function (style, meta) {

        switch (meta.type) {

            case 'currency':
            case 'number':
            case 'percentage':

                style.justifyContent = 'flex-end';
                style.textAlign = 'right';
                break;
            default:
                break;

        }

        return style;
    }
}
