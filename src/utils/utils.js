function deepCopy(obj) {
    var ret, k, b;
    if ((b = (obj instanceof Array)) || obj instanceof Object) {
        ret = b ? [] : {};
        for (k in obj) {
            if (obj[k] instanceof Array || obj[k] instanceof Object) {
                ret[k] = deepCopy(obj[k]);
            } else {
                ret[k] = obj[k];
            }
        }
    }

    return ret;
}
export { deepCopy };