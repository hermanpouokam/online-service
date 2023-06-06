export function onlyNumberTest(char) {
    let regex = /^[0-9]*$/
    return regex.test(char)
}