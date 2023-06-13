export function onlyNumberTest(char) {
    let regex = /^[0-9]*$/
    return regex.test(char)
}

export function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
}
