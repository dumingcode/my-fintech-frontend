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
export { deepCopy, isNull, objToArr }
