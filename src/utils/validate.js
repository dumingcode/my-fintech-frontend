/* eslint-disable */
export const isIntNum = (val) => {
    var regPos = /^\d+$/; // 非负整数
    if (regPos.test(val)) {
        return true;
    } else {
        return false;
    }
}