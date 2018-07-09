/* eslint-disable */
export const isIntNum = (val) => {
    var regPos = /^\d+$/; // 非负整数
    if (!val || regPos.test(val)) {
        return true;
    } else {
        return false;
    }
}

export const isPositiveFloat = (val) => {
    var regPos = /^\d+(\.\d+)?$/; // 非负浮点数
    if (!val || regPos.test(val)) {
        return true;
    } else {
        return false;
    }
}