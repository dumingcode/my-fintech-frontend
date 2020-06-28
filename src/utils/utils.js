function deepCopy (obj) {
    var ret, k, b
    if ((b = (obj instanceof Array)) || obj instanceof Object) {
        ret = b ? [] : {}
        for (k in obj) {
            if (obj[k] instanceof Array || obj[k] instanceof Object) {
                ret[k] = deepCopy(obj[k])
            } else {
                ret[k] = obj[k]
            }
        }
    }

    return ret
}
function isNull (a) {
    if (a === undefined) { // 只能用 === 运算来测试某个值是否是未定义的
        return true
    }
    if (a === 'NaN') { // 只能用 === 运算来测试某个值是否是未定义的
        return true
    }

    // String
    if (a === '' || a === null || a === undefined) { // "",null,undefined
        return true
    }
    if (!a) { // "",null,undefined,NaN
        return true
    }
    return false
}
function objToArr (obj) {
    if (isNull(obj)) {
        return []
    }
    const arr = []
    for (const prop in obj) {
        arr.push(obj[prop])
    }
    return arr
}
function formatDate (date, format = 'yyyy-MM-dd') {
    if (!date) return ''
    if (typeof date === 'number') {
        date = new Date(date)
    }
    date = new Date(date)
    const d = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S+': date.getMilliseconds()
    }
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in d) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? d[k] : ('00' + d[k]).substr(('' + d[k]).length))
        }
    }
    return format
}
export { deepCopy, isNull, objToArr, formatDate }
