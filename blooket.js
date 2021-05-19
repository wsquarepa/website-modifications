(function() {
    'use strict';

    var questions = []
    var notifiednoid = false
    var enabled = true
    var selectedanswerbox;
    const box = document.createElement("div")
    const enabledisabledisplay = document.createElement("div")
    const gamedisplay = document.createElement("div")
    const opensettingsbutton = document.createElement("div")
    const gameidfield = document.createElement("input")
    const customusernamefield = document.createElement("input")
    const gameidsubmitbutton = document.createElement("button")
    const autosubmit = document.createElement("input")
    const autosubmitlabel = document.createElement("label")

    function getid (id) {
        fetch("https://api.blooket.com/api/games?gameId=" + id).then(res => res.json())
            .then(res => {
            const rightgame = confirm("Is the name of this game " + res.title + "?")
            if (rightgame) {
                questions = res.questions
                gamedisplay.innerHTML = "Playing " + res.title
            }
        }).catch(() => {
            alert("No game found")
        })
    }

    function showAnswer() {
        console.log("Getting Question!")
        var question;
        try {
            question = document.getElementsByClassName("styles__questionText___1mqO1-camelCase")[0].children[0].innerHTML
        } catch {
            try {
                question = document.getElementsByClassName("styles__questionText___3haSu-camelCase")[0].children[0].innerHTML
            } catch {
                question = document.getElementsByClassName("styles__questionText___1t_TN-camelCase")[0].children[0].innerHTML
            }
        }

        var questionimages = document.getElementsByClassName("styles__image___2HAE2-camelCase")
        console.log(question)
        console.log(questions)

        var found = false
        if (question) {
            if (questions.length < 1) {
                alert("The set does not seem to have questions. Are you sure you supplied a Game/Set id?")
                return;
            }

            for (var i = 0; i < questions.length; i++) {
                var isquestion = false
                if (questions[i].question == question) {
                    isquestion = true
                    console.warn("WARNING: Image Checking is off due to false checks. Enable it in the code below this warning.")
                    /*
                    if (questionimages.length) {
                        isquestion = false
                        if (questionimages[0].src == questions[i].image.url) {
                            isquestion = true
                        }
                    }
                    */

                    if (isquestion) {
                        console.log("Found question!")
                        found = true
                        const answers = questions[i].correctAnswers
                        //alert("Correct answers for that question are: [" + answers.join(", ") + "]")
                        var answerboxes = document.getElementsByClassName("styles__answerText___25Dsb-camelCase")

                        if (answerboxes.length < 1) {
                            console.log("Did not find original answer boxes, trying other")
                            answerboxes = document.getElementsByClassName("styles__answerText___2vOpH-camelCase")
                        }

                        if (answerboxes.length < 1) {
                            console.log("Did not find other answer boxes, trying final")
                            answerboxes = document.getElementsByClassName("styles__answerText___2ztqv-camelCase")
                        }

                        for (var s = 0; s < answerboxes.length; s++) {
                            if (answers.includes(answerboxes[s].children[0].innerHTML)) {
                                console.log("Injecting...")
                                answerboxes[s].style.color = "black"
                                selectedanswerbox = answerboxes[s]
                                if (autosubmit.checked) {
                                    setTimeout(() => {
                                        const event = new MouseEvent('click', {
                                            view: window,
                                            bubbles: true,
                                            cancelable: true
                                        });

                                        selectedanswerbox.dispatchEvent(event)
                                    }, 300)
                                }
                            }
                        }
                    }
                }
            }

            if (!found) {
                alert("WARNING: None of the questions supplied by the set ID matched your question. You may have the wrong set/game ID.")
            }
        }
    }

    document.addEventListener("keypress", (key) => {
        console.log("Key " + key.key + " pressed!")
        if (key.key == "h") {
            if (!enabled) return;
            showAnswer()
        } else if (key.key == "f") {
            const code = prompt("Enter Join Code:")
            console.log(code.toString())
            fetch("https://api.blooket.com/api/firebase/join", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-CA,en;q=0.9,fr-CA;q=0.8,fr;q=0.7,en-US;q=0.6",
                    "content-type": "application/json;charset=UTF-8",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "sec-gpc": "1"
                },
                "referrer": "https://www.blooket.com/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": "{\"id\":\"" + code + "\",\"name\":\"Username\"}",
                "method": "PUT",
                "mode": "cors"
            }).then(res => res.json())
                .then(res => {
                if (res.success) {
                    fetch("https://api.blooket.com/api/games?gameId=" + res.host.set).then(resp => resp.json())
                        .then(resp => {
                        const rightgame = confirm("Is the name of this game " + resp.title + "?")
                        if (rightgame) {
                            questions = resp.questions
                            gamedisplay.innerHTML = "Playing " + resp.title

                        }
                    }).catch(() => {
                        alert("No game found")
                    })
                }
            })
        } else if (key.key == "v") {
            const gameid = prompt("Enter Set ID:")
            getid(gameid)
        } else if (key.key == "p") {
            var PIN = "2007"

            if (PIN == "2007") {
                enabled = !enabled
                enabledisabledisplay.innerHTML = (enabled? "ENABLED":"DISABLED")
            } else {
                alert("INCORRECT PIN")
            }
        } else if (key.key == "o") {
            if (box.style.display == "none") {
                box.style.display = "block"
            } else {
                box.style.display = "none"
            }
        }
    })

    document.addEventListener("mousedown", () => {
        setTimeout(() => {
            if (!enabled) return;
            showAnswer()
        }, 250)
    })

    box.style = "color: white; font-size:20px; position:absolute; top: 0px; right: 0px;background-color: gray;"
    enabledisabledisplay.innerHTML = "ENABLED"
    gamedisplay.innerHTML = "Not playing anything"

    opensettingsbutton.style = "position:absolute; top: 0px; right: 0px; height: 10px; width: 10px; background-color: black;cursor:pointer;"
    opensettingsbutton.addEventListener("click", () => {
        if (box.style.display == "none") {
            box.style.display = "block"
        } else {
            box.style.display = "none"
        }
    })

    gameidsubmitbutton.addEventListener("click", () => {
        const value = gameidfield.value

        if (value.length < 1) {
            alert("Next time, put something in the field.")
            return
        }

        if (value.length > 6) {
            fetch("https://api.blooket.com/api/games?gameId=" + value).then(res => res.json())
            .then(res => {
                questions = res.questions
                gamedisplay.innerHTML = "Playing " + res.title
                gameidfield.value = ""
            }).catch(() => {
                alert("No game found")
            })
        } else {
            var username = customusernamefield.value
            if (username.length < 1) {
                username = "Username"
            }

            fetch("https://api.blooket.com/api/firebase/join", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-CA,en;q=0.9,fr-CA;q=0.8,fr;q=0.7,en-US;q=0.6",
                    "content-type": "application/json;charset=UTF-8",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "sec-gpc": "1"
                },
                "referrer": "https://www.blooket.com/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": "{\"id\":\"" + value + "\",\"name\":\"" + username + "\"}",
                "method": "PUT",
                "mode": "cors"
            }).then(res => res.json())
                .then(res => {
                if (res.success) {
                    fetch("https://api.blooket.com/api/games?gameId=" + res.host.set).then(resp => resp.json())
                    .then(resp => {
                        questions = resp.questions
                        gamedisplay.innerHTML = "Playing " + resp.title
                        gameidfield.value = ""
                    }).catch(() => {
                        alert("No game found")
                    })
                }
            })
        }
    })

    box.style.display = "none"
    autosubmit.id = "autosubmit"
    autosubmit.type = "checkbox"
    autosubmitlabel.for = "autosubmit"
    autosubmitlabel.innerHTML = "Automatically Submit? "
    gameidfield.placeholder = "Game ID or Set ID"
    gameidsubmitbutton.innerHTML = "Submit"
    customusernamefield.placeholder = "Custom Username"

    document.body.appendChild(box)
    document.body.appendChild(opensettingsbutton)
    box.appendChild(enabledisabledisplay)
    box.appendChild(gamedisplay)
    box.appendChild(gameidfield)
    box.appendChild(customusernamefield)
    box.appendChild(gameidsubmitbutton)
    box.appendChild(document.createElement("br"))
    box.appendChild(autosubmitlabel)
    box.appendChild(autosubmit)
})();