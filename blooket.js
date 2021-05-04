(function () {
    var questions = []
    var enabled = true

    function getid() {
        const gameid = prompt("Enter Set ID:")
        fetch("https://api.blooket.com/api/games?gameId=" + gameid).then(res => res.json())
            .then(res => {
                const rightgame = confirm("Is the name of this game " + res.title + "?")
                if (rightgame) {
                    questions = res.questions
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
                    "body": "{\"id\":\"" + code + "\",\"name\":\"ChickenMaster1022\"}",
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
                                }
                            }).catch(() => {
                                alert("No game found")
                            })
                    }
                })
        } else if (key.key == "v") {
            getid()
        } else if (key.key == "p") {
            var PIN = "2007"
            if (enabled) {
                PIN = prompt("Enter PIN to disable hack:")
            }

            if (PIN == "2007") {
                enabled = !enabled
                alert("Blooket Hack successfully " + (enabled ? "enabled" : "disabled"))
            } else {
                alert("INCORRECT PIN")
            }
        }
    })

    document.addEventListener("mousedown", () => {
        setTimeout(() => {
            if (!enabled) return;
            showAnswer()
        }, 250)
    })
})