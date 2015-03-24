var say = function (number) {
    if (number > 0) {
        number--
        console.log(number)
        say(number)
    }
}

say(10)
console.log('------------')
say(5)