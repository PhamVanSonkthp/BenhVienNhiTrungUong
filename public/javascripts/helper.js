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

function formatDateFormProfileVI(date) {
    if (isDefine(date) && date.length) {

        let day = date.split(' ')[0]
        let time = date.split(' ')[1].substring(0, 5) + '\''

        return time + ' ngày ' + day
    }

    return ''
}

function formatDateFormProfileResultVI(date) {
    if (isDefine(date) && date.length) {
        return 'ngày ' + date.split(' ')[0].split('/')[0] + ' tháng ' + date.split(' ')[0].split('/')[1] + ' năm ' + date.split(' ')[0].split('/')[2]
    }

    return ''
}

function formatDateFormProfileResultEN(date) {
    if (isDefine(date) && date.length) {
        let day = new Date(date.split(' ')[0].split('/')[2] + '-' + date.split(' ')[0].split('/')[1] + '-' + date.split(' ')[0].split('/')[0]).toGMTString()
        day = day.split(',')[1].trim().split(' ')[1] + ' ' + day.split(',')[1].trim().split(' ')[0] + '<sup>th</sup> ' + day.split(',')[1].trim().split(' ')[2]

        return day
    }

    return ''
}

function formatDateFormProfileEN(date) {
    if (isDefine(date) && date.length) {
        let day = new Date(date.split(' ')[0].split('/')[2] + '-' + date.split(' ')[0].split('/')[1] + '-' + date.split(' ')[0].split('/')[0]).toGMTString()
        let time = formatAMPM(new Date(date.split(' ')[0].split('/')[2] + '-' + date.split(' ')[0].split('/')[1] + '-' + date.split(' ')[0].split('/')[0] + ' ' + date.split(' ')[1]))

        day = day.split(',')[1].trim().split(' ')[1] + ' ' + day.split(',')[1].trim().split(' ')[0] + '<sup>th</sup> ' + day.split(',')[1].trim().split(' ')[2]

        if (time.length < 8) {
            time = '0' + time
        }
        return time + ' - ' + day
    }

    return ''
}

function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours %= 12;
    hours = hours || 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    const strTime = `${hours}:${minutes} ${ampm}`;

    return strTime;
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

const DROPZONE_DEFAULT = {
    acceptedFiles: ['.xlsx'].toString(),
    url: "./../api/profile/information/files",
    autoProcessQueue: false,
    addRemoveLinks: true,
    paramName: "avatar[]",
    uploadMultiple: true,
    maxFiles: 100,
    maxFilesize: 10,
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

// function changeOffset(page) {
//     page += 1
//     let url = window.location.href.split('?')[0] + '?q=' + $('#input_keyword').val() + '&page=' + page + '&level=' + (urlParams.get('level') || 1)
//     window.location.href = url
// }

// Phân trang
function paginator(total_count, curent_page) {
    $("#spn_loading").hide()

    let pagePatigation = "";
    pagePatigation += '<ul class="pagination home-product__pagination mt-4">';
    if (tryParseInt(limit) == 0) {
        limit = 20;
    }
    page = tryParseInt(curent_page);
    const total_page = Math.ceil(tryParseInt(total_count) / tryParseInt(limit));
    if (total_page > 1) {
        if (page > 1) {
            //first page
            pagePatigation += `<li onclick="changeOffset(0)" class="paginate_button page-item first" id="paginationOptionDatatable_first" ><a href="javascript:void(0);" class="page-link"><i style="transform:rotate(180deg)" class="pagination-item__icon fas fa-angle-double-right"></i></a></li>`;
            //previouse page
            pagePatigation += `<li onclick="previousPage()" class="paginate_button page-item previous"  ><a href="javascript:void(0);" class="page-link"><i class="pagination-item__icon fas fa-chevron-left"></i></a></li>`;
        } else {
            if (page == 1) {
                //first page
                pagePatigation += `<li class="paginate_button page-item first disabled" id="paginationOptionDatatable_first"><a href="javascript:void(0);"  class="page-link"><i style="transform:rotate(180deg)" class="pagination-item__icon fas fa-angle-double-right"></i></a></li>`;
            } else {
                //first page
                pagePatigation += `<li class="paginate_button page-item first " id="paginationOptionDatatable_first"><a href="javascript:void(0);"  class="page-link"><i style="transform:rotate(180deg)" class="pagination-item__icon fas fa-angle-double-right"></i></a></li>`;
            }
        }
        //pages
        if (total_page <= 1 + isShow * 2) {
            for (let i = 0; i < total_page - 1; i++) {
                if (i == page - 1) {
                    pagePatigation += `<li onclick="changeOffset(${i})" class="paginate_button page-item active"><a href="javascript:void(0);"  class="page-link">${i + 1}</a></li>`;
                } else {
                    pagePatigation += `<li onclick="changeOffset(${i})" class="paginate_button page-item"><a href="javascript:void(0);" class="page-link">${i + 1}</a></li>`;
                }
            }
        } else {
            //enough pages to hide some
            //close to beginning; only hide later pages
            if (page <= isShow) {
                for (let i = 0; i < isShow + 1; i++) {
                    if (i == page - 1) {
                        pagePatigation += `<li  onclick="changeOffset(${i})" class="paginate_button page-item active"><a href="javascript:void(0);"  class="page-link">${i + 1}</a></li>`;
                    } else {
                        pagePatigation += `<li onclick="changeOffset(${i})" class="paginate_button page-item"><a href="javascript:void(0);" class="page-link">${i + 1}</a></li>`;
                    }
                }
                pagePatigation += `<li onclick="changeOffset(${Math.round((page + total_page) / 2)})" class="paginate_button page-item"><a href="javascript:void(0);" class="page-link">...</a></li>`;
            } else if (total_page - isShow > page && page > isShow) {
                //in middle; hide some front and some back
                //page 1
                pagePatigation += `<li onclick="changeOffset(${0})" class="paginate_button page-item"><a href="javascript:void(0);"  class="page-link">${1}</a></li>`;
                //...
                pagePatigation += `<li onclick="changeOffset(${Math.round(page / 2)})" class="paginate_button page-item"><a href="javascript:void(0);" class="page-link">...</a></li>`;
                for (let i = page - 2; i < page + 1; i++) {
                    if (i == page - 1) {
                        pagePatigation += `<li onclick="changeOffset(${i})" class="paginate_button page-item active"><a href="javascript:void(0);" class="page-link">${i + 1}</a></li>`;
                    } else {
                        pagePatigation += `<li onclick="changeOffset(${i})" class="paginate_button page-item"><a href="javascript:void(0);"  class="page-link">${i + 1}</a></li>`;
                    }
                }
                //...
                pagePatigation += `<li onclick="changeOffset(${Math.round((page + total_page) / 2)})" class="paginate_button page-item"><a href="javascript:void(0);" class="page-link">...</a></li>`;
            } else {
                //close to end; only hide early pages
                //page 1
                pagePatigation += `<li onclick="changeOffset(${0})" class="paginate_button page-item"><a href="javascript:void(0);" class="page-link">${1}</a></li>`;
                //...
                pagePatigation += `<li onclick="changeOffset(${Math.round(page / 2)})" class="paginate_button page-item"><a href="javascript:void(0);" class="page-link">...</a></li>`;
                for (let i = total_page - isShow - 1; i < total_page - 1; i++) {
                    if (i == page - 1) {
                        pagePatigation += `<li onclick="changeOffset(${i})" class="paginate_button page-item active"><a href="javascript:void(0);" class="page-link">${i + 1}</a></li>`;
                    } else {
                        pagePatigation += `<li onclick="changeOffset(${i})" class="paginate_button page-item"><a href="javascript:void(0);" class="page-link">${i + 1}</a></li>`;
                    }
                }
            }
        }
        //next button
        if (page < total_page) {
            pagePatigation += `<li onclick="changeOffset(${total_page - 1})" class="paginate_button page-item"><a href="javascript:void(0);"  class="page-link">${total_page}</a></li>`;
            pagePatigation += `<li onclick="nextPage()" class="paginate_button page-item next" id="paginationOptionDatatable_next"><a href="javascript:void(0);" class="page-link"><i class="pagination-item__icon fas fa-chevron-right"></i></a></li>`;
            //last page
            pagePatigation += `<li onclick="changeOffset(${total_page - 1})" class="paginate_button page-item last" id="paginationOptionDatatable_last" ><a href="javascript:void(0);"  tabindex="10" class="page-link"><i class="pagination-item__icon fas fa-angle-double-right"></i></a></li>`;
        } else {
            pagePatigation += `<li onclick="changeOffset(${total_page - 1})" class="paginate_button page-item active "><a href="javascript:void(0);"  class="page-link">${total_page}</a></li>`;
            pagePatigation += `<li class="paginate_button page-item last disabled" id="paginationOptionDatatable_last" ><a href="javascript:void(0);" class="page-link"><i class="pagination-item__icon fas fa-angle-double-right"></i></a></li>`;
        }
    } else {
        pagePatigation += `<li onclick="changeOffset(${0})" class="paginate_button page-item active"><a href="javascript:void(0);" class="page-link">${1}</a></li>`;
    }
    pagePatigation += "</ul>";
    // $("#pagePatigation").addClass("mb-3");
    $("#pagePatigation").html(pagePatigation);
}
function nextPage() {
    page += 1
    let url = window.location.href.split('?')[0] + '?q=' + $('#input_keyword').val() + '&page=' + page + '&level=' + (urlParams.get('level') || 1)
    window.location.href = url
}
function previousPage() {
    page -= 1
    let url = window.location.href.split('?')[0] + '?q=' + $('#input_keyword').val() + '&page=' + page + '&level=' + (urlParams.get('level') || 1)
    window.location.href = url

}
function changeOffset(page) {
    page += 1
    let url = window.location.href.split('?')[0] + '?q=' + $('#input_keyword').val() + '&page=' + page + '&level=' + (urlParams.get('level') || 1)
    window.location.href = url
}