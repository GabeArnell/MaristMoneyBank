function centsToString(amount){
    let cents = Math.abs(amount%100);
    let dollars = Math.abs(Math.floor(amount/100))

    let result = `${amount<0?"-":""}${dollars}.${cents}`
    if (cents < 10){
        result+="0"
    }
    return result
}