// ==UserScript==
// @name         Google Formatting
// @namespace    https://wsquarepa.github.io/
// @description  Makes google, in my opinion, look better.
// @version      1.0
// @author       wsquarepa
// @match        https://www.google.com/*
// ==/UserScript==
(function() {
    const style = document.createElement("style")
    style.innerHTML = `
        a {
            color:blue;
        }
        
        a:visited {
            color:gray;
        }
        
        a:hover {
            color:red;
        }
    `
    document.head.appendChild(style)
})()