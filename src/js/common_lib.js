const UA_DATETIME_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };

let clib = {}

clib.imprecizeComparison = function (search_string, array, ignore_fields=[]) {
    let search_items = search_string.split(' ');
    let result_list = []

    for (let array_item in array) {
        let full_match_found = true;

        for (let item in search_items) {
            let found = false;

            for (let value in array[array_item]) {
                if (!ignore_fields.includes(value) && array[array_item] && array[array_item][value] && array[array_item][value].toString().toLowerCase().indexOf(search_items[item].toLowerCase()) != -1) {
                    found = true;
                }
            }

            if (!found) {
                full_match_found = false;
            }
        }

        if (full_match_found) {
            result_list.push(array[array_item])
        }
    }

    return result_list;
}

clib.clearQueryParams = function(currentData) {
    return {
        'env': currentData.env
    }
}

clib.formatDateTimeWithMonthText = function(datetime) {
    if (datetime)
        return new Date(datetime).toLocaleDateString('uk-UA', UA_DATETIME_OPTIONS)
    return ''
}

clib.redirectToIdGovUa = function(url, client_id, state, redirect_uri) {
    window.open(`${url}/?response_type=code&client_id=${client_id}&state=${state}&redirect_uri=${redirect_uri}`, 
                    '_self',
                    null);
}

clib.gotoTop = function() {
    window.scrollTo(0, 0);
}

clib.fileSizeToString = function(size) {
    if (size > 0 && size < 1000) {
        return toFixed(size) + " байт."
    } else if (size >= 1000 && size < 1000000) {
        return toFixed(size / 1000) + " кб."
    } else if (size >= 1000000 && size < 1000000000) {
        return toFixed(size / 1000000) + " мб."
    }
}

function toFixed(x) {
    let e;
    if (Math.abs(x) < 1.0) {
    e = parseInt(x.toString().split('e-')[1]);
      if (e) {
          x *= Math.pow(10,e-1);
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
        e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
          e -= 20;
          x /= Math.pow(10,e);
          x += (new Array(e+1)).join('0');
      }
    }
    return x;
  }

clib.isEmptyObject = function(obj) {
    if (!obj) return true;
    if (obj && Object.keys(obj).length === 0 && obj.constructor === Object)
        return true;
    return false;
}

clib.uuidv4 = function() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}  

clib.toggleSecondaryTabActiveClass = function(parent_id, element_name) {
    var buttons_row = document.getElementById(parent_id);

    var children = buttons_row.children;
    for (var i = 0; i < children.length; i++) {
        children[i].className = children[i].className.replace(" diia-secondary-tab-active", "");
    }

    var element = document.getElementById(element_name);
    if (element)
        element.className += ' diia-secondary-tab-active';
}

export default clib;