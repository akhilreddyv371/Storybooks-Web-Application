const moment = require('moment')

module.exports = {
    formatDate : function(date, format){
        return moment(date).format(format)
    }, 
    truncate : function(str, len){
        if (str.length > len && str.length > 0){
            let new_str = str + ' ';
            new_str = str.substr(0, len)
            new_str = str.substr(0, new_str.lastIndexOf(' '))
            new_str = new_str.length > 0 ? new_str : str.substr(0, len)
            return new_str + '...'
        }
        return str
    },
    stripTags : function(input){
        return input.replace(/<(?:.|\n)*?>/, '')
        // return input.replace(['<p>', '</p>', /<(?:.|\n)*?>/], '')
    },
    select: function(selected, options) {
        return options
            .replace(
                new RegExp(' value="' + selected + '"'),
                '$& selected="selected"'
            )
            .replace(
                new RegExp('>' + selected + '</option>'),
                ' selected="selected"$&'
            );
    }
    
}

