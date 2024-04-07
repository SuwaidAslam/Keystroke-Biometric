var keysPress = []
var keysPressTime = []
var keysRelease = []
var keysReleaseTime = []
let timeHoldDD_signup = [];

const password = "roberto"

function press(event) {
    let d = new Date()
    let time = d.getTime() / 1000
    let tecla = event.key
    //console.log(time)

    keysPress.push(tecla)
    keysPressTime.push(time)

    //console.log(tecla)
}

function release(event) {
    let d = new Date()
    let time = d.getTime() / 1000
    let tecla = event.key
    //console.log(time)

    keysRelease.push(tecla)
    keysReleaseTime.push(time)

    //console.log(tecla)
}

const enviar = () => {
    let keys = ''

    for (let i = 0; i < keysPress.length; i++) {
        keys += keysPress[i]
    }
    let wrong = false

    if (password != keys) {
        wrong = true
    }
    //console.log(keys)
    //console.log(password)

    //se a senha está errada, resetar tudo
    if (wrong) {
        alert("Password is wrong!")
        keysPress = []
        keysRelease = []
        keysPressTime = []
        keysReleaseTime = []
        let textInput = document.getElementById("textInput")
        textInput.value = ""
        return null
    }

    let timeHoldDD = []

    for (let i = 0; i < keysPressTime.length; i++) {
        //console.log(keysReleaseTime[i])
        //console.log(keysPressTime[i])
        //console.log(keysReleaseTime[i] - keysPressTime[i])
        timeHoldDD.push(keysReleaseTime[i] - keysPressTime[i])
    }

    //console.log(timeHoldDD)

    let timeDD = []

    for (let i = 0; i < keysPressTime.length - 1; i++) {
        timeDD.push(keysPressTime[i + 1] - keysPressTime[i])
    }

    //console.log(timeDD)

    for (let i = 0; i < timeDD.length; i++) {
        timeHoldDD.push(timeDD[i])
    }

    let user = document.getElementById("users")
    timeHoldDD.push(user.value)
    console.log(timeHoldDD)

    //send timeHoldDD to the backend to test with the already trained classifier
    //also send the name of the user taken from select
    let resultado = document.getElementById("result")
    fetch("http://127.0.0.1:5000/learn", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timeHoldDD)
    }).then(res => {
        res.text()
            .then((result) => {
                if (result == "True") {
                    window.location.href = "./painel.html";
                } else {
                    resultado.innerHTML = "Authentication error."
                }
                console.log(result)
            })
    }).catch(err => {
        console.log(err)
    })
    //after sending, reset everything
    keysPress = []
    keysRelease = []
    keysPressTime = []
    keysReleaseTime = []
    let textInput = document.getElementById("textInput")
    textInput.value = ""
}

const populateDropdown = (users) => {
    const dropdown = document.getElementById("users");
    dropdown.innerHTML = ""; // Clear existing options
    users.forEach(user => {
        const option = document.createElement("option");
        option.value = user;
        option.text = user;
        dropdown.appendChild(option);
    });
}

const getUsers = () => {
    fetch("http://127.0.0.1:5000/users", {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(users => {
            populateDropdown(users);
        })
        .catch(err => {
            console.log(err);
        });
}

let currentCount = 0; // Current count of inputs

function sendInput() {
    let keys = ''

    for (let i = 0; i < keysPress.length; i++) {
        keys += keysPress[i]
    }
    let wrong = false

    if (password != keys) {
        wrong = true
    }

    //if the Password is wrong, reset everything
    if (wrong) {
        alert("Password is not correct!")
        keysPress = []
        keysRelease = []
        keysPressTime = []
        keysReleaseTime = []
        let textInput = document.getElementById("phraseInput")
        textInput.value = ""
        return null
    }

    let timeHoldDD = []

    let user = document.getElementById("username")
    timeHoldDD.push(user.value)

    for (let i = 0; i < keysPressTime.length; i++) {
        //console.log(keysReleaseTime[i])
        //console.log(keysPressTime[i])
        //console.log(keysReleaseTime[i] - keysPressTime[i])
        timeHoldDD.push(keysReleaseTime[i] - keysPressTime[i])
    }

    //console.log(timeHoldDD)

    let timeDD = []

    for (let i = 0; i < keysPressTime.length - 1; i++) {
        timeDD.push(keysPressTime[i + 1] - keysPressTime[i])
    }

    //console.log(timeDD)

    for (let i = 0; i < timeDD.length; i++) {
        timeHoldDD.push(timeDD[i])
    }
    timeHoldDD_signup.push(timeHoldDD)
    console.log(timeHoldDD)

    // console.log(JSON.stringify(timeHoldDD))
    let result_element = document.getElementById("result")
    //reset values
    keysPress = []
    keysRelease = []
    keysPressTime = []
    keysReleaseTime = []
    // let textInput = document.getElementById("textInput")
    // textInput.value = ""

    // Update count and display
    currentCount++;
    document.getElementById('count').innerText = `${currentCount}/20`;

    // Reset phrase input if count is less than  to 20
    if (currentCount <= 20) {
        document.getElementById('phraseInput').value = '';
    }

    // Display message and disable send button if inputs are complete
    if (currentCount >= 20) {
        fetch("http://127.0.0.1:5000/train", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(timeHoldDD_signup)
        }).then(res => {
            res.text()
                .then((result) => {
                    if (result == "True") {
                        // window.location.href = "./login.html";
                        result_element.innerText = 'Data has been Collected. Thanks for your time!';
                    } else {
                        result_element.innerHTML = "Authentication error."
                    }
                    console.log(result)
                })
        }).catch(err => {
            console.log(err)
        })
        document.getElementById('username').value = '';
        document.getElementById('entrar').disabled = true; // Disable send button
        timeHoldDD_signup = [];
    }
}

// Call the getUsers function when the page loads
window.onload = getUsers;
