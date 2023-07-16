function first(callback) {
    console.log('First function called');
    setTimeout(function () {
        console.log('First function finished');
        callback();
    }, 1000);
}

function second() {
    console.log('Second function called');
}

first(function () {
    second();
});