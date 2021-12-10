const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function getCookie(name) {
    function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}

function removeCookie(name) {
    document.cookie = name + "=removed; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
}

String.prototype.replaceAllTxt = function replaceAll(search, replace) {
    return this.split(search).join(replace);
}

var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
}

function rangerBetweenDatetimeMinutes(date1, date2) {
    return Math.floor(Math.abs((Date.parse(date1) - Date.parse(date2))) / (1000 * 60))
}

function rangerBetweenDatetimeSeconds(date1, date2) {
    return Math.floor(Math.abs((Date.parse(date1) - Date.parse(date2))) / (1000))
}

function getTimeNow(timezone) {
    if (timezone) {
        return new Date(timezone).toLocaleString("en-US");
    } else {
        return new Date().toLocaleString("en-US");
    }
}

function escapeHtml(string) {
    if (!isDefine(string)) return ''
        // if(string.includes('<script>') || true){
        // 	return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        // 		return entityMap[s];
        // 	})
        // }else{
        // 	return string
        // }

    string = string + ''
    if (string.includes('<script>') && string.includes('</script>')) {
        return $('<div />').text(string).html()

    } else {
        return string
    }
    //ENCODED FOR MAXIMUM SAFETY
}

function removeHTMLTags(html) {
    var regX = /(<([^>]+)>)/ig;
    return html.replace(regX, "")

}

function getOnlyNumber(str) {
    var num = str.replace(/[^0-9]/g, '');
    return num
}


function nameMonthToNumber(val) {
    for (let i = 0; i < monthNames.length; i++) {
        if (monthNames[i].includes(val)) {
            if (i < 9) {
                return '0' + (i + 1)
            }
            return '' + i + 1
        }
    }
    return 0
}

function setCookie(name, value, days) {
    days = 30
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function logout() {
    removeCookie('token');
    window.location.replace("./../../admin/sign-in");
}

function reloadScriptApp() {
    $('#reload_script_app').attr('src', '../views/admin/dist/js/app.js');
}

function reloadTagNumber() {
    $('.number').maskNumber({ integer: true });
}

function formatMoney(nStr) {
    nStr += '';
    x = nStr.split(',');
    x1 = x[0];
    x2 = x.length > 1 ? ',' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return (x1 + x2).split('.')[0];
}

function tryParseInt(val) {
    try {
        val = val.toString()
        return parseInt(val.replace(',', '').replace('$', ''));
    } catch (e) {
        return 0;
    }
}

// if (getCookie('_id') == null) {
// 	window.location.replace("sign-in");
// } else {
// 	if (getCookie('_id')) {
// 		let _id = getCookie('_id');
// 		let password = getCookie('password');
// 		socket.emit('recent-login', { _id: _id, password: password }, (response) => {
// 			if (response == null) {
// 				window.location.replace("sign-in");
// 			}
// 		});
// 	} else {
// 		logout();
// 	}
// }

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isDefine(val) {
    try {
        if (val == undefined) return false;
        if (val == null) return false;
        return true;
    } catch (err) {
        return false;
    }
}

function isNumber(val) {
    return !isNaN(val)
}


function showLoading() {
    $('#DialogLoading').show();
}

function hideLoading() {
    $('#DialogLoading').hide();
}

function showPaging() {
    $('#SpnLoading').show()
}

function hidePaging() {
    $('#SpnLoading').hide()
}

function removeIndexOfArray(arr, index) {
    let arrTemp = [];
    index = parseInt(index);
    for (let i = 0; i < arr.length && i < index; i++) {
        arrTemp.push(arr[i]);
    }

    for (let i = index + 1; i < arr.length; i++) {
        arrTemp.push(arr[i]);
    }

    return arrTemp;
}

function copyToClipboard(containerid) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select().createTextRange();
        document.execCommand("copy");
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().addRange(range);
        document.execCommand("copy");
    }
}

function empty(val) {

    // test results
    //---------------
    // []        true, empty array
    // {}        true, empty object
    // null      true
    // undefined true
    // ""        true, empty string
    // ''        true, empty string
    // 0         false, number
    // true      false, boolean
    // false     false, boolean
    // Date      false
    // function  false

    if (val === undefined)
        return true;

    if (typeof(val) == 'function' || typeof(val) == 'number' || typeof(val) == 'boolean' || Object.prototype.toString.call(val) === '[object Date]')
        return false;

    if (val == null || val.length === 0) // null or 0 length array
        return true;

    if (typeof(val) == "object") {
        // empty object

        var r = true;

        for (var f in val)
            r = false;

        return r;
    }

    return false;
}

function contains(input, val) {
    if (isDefine(input) && isDefine(val)) {
        for (let i = 0; i < val.length; i++) {
            if (!input.toUpperCase().includes(val[i].toUpperCase())) return false
        }
        return true
    } else {
        return false
    }
}

function CopyToClipboard(containerid) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select().createTextRange();
        document.execCommand("copy");
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().addRange(range);
        document.execCommand("copy");
    }
}

function changeOffset(page) {
    page += 1
    let url = window.location.href.split('?')[0] + '?q=' + $('#input_keyword').val() + '&page=' + page + '&level=' + (urlParams.get('level') || 1)
    window.location.href = url
}

function paginator(data) {
    var pagePatigation = '<div class="row dataTables_wrapper" style="float:right;padding-bottom: 25px;">';
    //page += '<div class="col-sm-12 col-md-5"><div class="dataTables_info" id="dataTable_info" role="status" aria-live="polite">Đang hiển thị ' + stt + ' -> ' + (stt + data.result - 1) + ' của ' + (parseInt(data.count)) + ' </div></div>';
    pagePatigation += '<div class="col-sm-12 col-md-7"><div style="margin-top:10px;" class="dataTables_paginate paging_simple_numbers" id="dataTable_paginate">';
    pagePatigation += '<ul class="pagination">';
    count = (isDefine(data.count) ? data.count : data)
        // if (count - offset <= 0) return

    if ((count / limit) - parseInt(count / limit) > 0) {
        count = parseInt(count / limit) + 1;
    } else {
        count = count / limit;
    }
    count = parseInt(count)


    for (var i = 0; i < count; i++) {
        if (count >= 2 && i == 0) // nếu có 2 trang trở lên thì sẽ có previous
        {
            if (offset != 0) // nếu offset khác 0 thì previous sẽ có thể click đc
                pagePatigation += '<li onclick="changeOffset(' + (i) + ')" class="paginate_button page-item previous" id="dataTable_previous"><a href="javascript:void(0);" aria-controls="dataTable" data-dt-idx="0" tabindex="0" class="page-link">đầu</a></li>';
            else //nếu  offset == 0 previous sẽ ko thể click đc
                pagePatigation += '<li class="paginate_button page-item previous disabled" id="dataTable_previous"><a href="javascript:void(0);" aria-controls="dataTable" data-dt-idx="0" tabindex="0" class="page-link">đầu</a></li>';
        }

        if (i == (parseInt((offset / limit)))) // nếu i nào bằng điều kiện trong if thì sẽ sáng màu xanh và ngược lại
        {
            pagePatigation += '<li onclick="changeOffset(' + i + ')" class="paginate_button page-item active"><a href="javascript:void(0);" aria-controls="dataTable" data-dt-idx="2" tabindex="0" class="page-link">' + (i + 1) + '</a></li>';
            if (i == count - 1 && count >= 3) {
                pagePatigation += '<li class="paginate_button page-item next disabled" id="dataTable_next"><a href="javascript:void(0);" aria-controls="dataTable" data-dt-idx="7" tabindex="0" class="page-link">cuối</a></li>';
            }
        } else {
            if (i <= 2 || i == count - 1) // hiện 5 trang đầu vaf trang cuối
            {
                pagePatigation += '<li  onclick="changeOffset(' + i + ')" class="paginate_button page-item"><a href="javascript:void(0);" aria-controls="dataTable" data-dt-idx="2" tabindex="0" class="page-link">' + (i + 1) + '</a></li>';
                if (i == count - 1) {
                    pagePatigation += '<li  onclick="changeOffset(' + (i) + ')" class="paginate_button page-item next" id="dataTable_next"><a href="javascript:void(0);" aria-controls="dataTable" data-dt-idx="7" tabindex="0" class="page-link">cuối</a></li>';
                }
            } else {
                if (i >= isShow - 1 && i <= isShow + 1) {
                    pagePatigation += '<li  onclick="changeOffset(' + i + ')" class="paginate_button page-item"><a href="javascript:void(0);" aria-controls="dataTable" data-dt-idx="2" tabindex="0" class="page-link">' + (i + 1) + '</a></li>';
                } else {
                    if (i == isShow - 2 || i == isShow + 3) {
                        pagePatigation += '<li class="paginate_button page-item"><a href="javascript:void(0);" class="page-link">...</a></li>';
                    }
                }
            }
        }

    }
    pagePatigation += '</ul></div></div></div>';

    $("#pagePatigation").html(pagePatigation);
    $("#spn_loading").hide()
}