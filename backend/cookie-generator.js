// generates a random string of alphanumberic digits then appends the unix time it got the connection 
function generateRandomCookie(){
    let result = ``
    var possible = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIkLMNOPQRSTUVWXYZ";
    for (var i = 0; i < 20; i++) {
        result += possible.charAt(Math.floor(Math.random() * possible.length));         
    }
    result+=new Date().getTime();
    return result
}
module.exports.getNewCookie = generateRandomCookie;