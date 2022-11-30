const ipInput = document.getElementById("ip-input")
const resetButton = document.getElementById("reset-button")
const results = document.getElementById("results")


resetButton.onclick = function(){
    let ip = ipInput.value.trim();
    if (ip.length < 4){
        alert("Invalid IP Address");
        return;
    }
    if (ip.split(".").length != 4){
        alert("Invalid IP Address");
        return;
    }
    alert("Sending Request to "+ip+" to reset.")
    fetch("http://"+ip+":3000/full-game-reset", {
        method: "POST",
        headers: [["Content-Type", "text/plain"]],
        body: JSON.stringify({
            reset: true
        })
    }).then(response=>{
        console.log("Got response?")
        results.innerText = `[${new Date()}] Reset ${ip} Database\n`+results.innerText

    })
    


}


