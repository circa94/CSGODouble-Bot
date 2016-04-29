// CONFIG ////////////////

var initialBetAmount = 1;

var mode = 'martingale'; // can be 'martingale' or 'anti-martingale' (WAT? https://en.wikipedia.org/wiki/Martingale_(betting_sys.. )

var betColor = 'black'; // can be 'red' or 'black'

//////////////////////////

function tick() {
    secondsRunning++;
    DisplayInfoText();
    var a = getStatus();
    if (a !== lastStatus && "unknown" !== a) {
        switch (a) {
            case "waiting": bet();
                break;
            case "rolled": rolled();
        }
        lastStatus = a, printInfo()
    }
}
function checkBalance() {
    return getBalance() < currentBetAmount ? (console.warn("BANKRUPT! Not enough balance for next bet, aborting."), clearInterval(refreshIntervalId), !1) : !0
}

function printInfo() {
    var a = " \nStatus: " + lastStatus + "\nRolls played: " + currentRollNumber + "\nInitial bet amount: " + initialBetAmount + "\nCurrent bet amount: " + currentBetAmount + "\nLast roll result: " + (null === wonLastRoll() ? "-" : wonLastRoll() ? "won" : "lost");
    console.log(a)
}

function rolled() {
    return "anti-martingale" === mode ? void antiMartingale() : (martingale(), void currentRollNumber++)
}

function antiMartingale() {
    if (wonLastRoll()) {
        earnedSoFar += (currentBetAmount * 2);
    }
    currentBetAmount = wonLastRoll() ? 2 * currentBetAmount : initialBetAmount
}

function martingale() {
    if (wonLastRoll()) {
        earnedSoFar += (currentBetAmount * 2);
    }
    currentBetAmount = wonLastRoll() ? initialBetAmount : 2 * currentBetAmount
}

function bet() {
    checkBalance() && (setBetAmount(currentBetAmount), setTimeout(placeBet, 50))
}

function setBetAmount(a) {
    $betAmountInput.val(a)
}

function placeBet() {
    earnedSoFar -= currentBetAmount;
    return "red" === betColor ? ($redButton.click(), void (lastBetColor = "red")) : ($blackButton.click(), void (lastBetColor = "black"))
}

function getStatus() {
    var a = $statusBar.text();
    if (hasSubString(a, "Rolling in")) return "waiting";
    if (hasSubString(a, "***ROLLING***")) return "rolling";
    if (hasSubString(a, "rolled")) {
        var b = parseInt(a.split("rolled")[1]);
        return lastRollColor = getColor(b), "rolled"
    }
    return "unknown"
}

function getBalance() {
    return parseInt($balance.text())
}

function hasSubString(a, b) {
    return a.indexOf(b) > -1
}

function getColor(a) {
    return 0 == a ? "green" : a >= 1 && 7 >= a ? "red" : "black"
}

function wonLastRoll() {
    return lastBetColor ? lastRollColor === lastBetColor : null
}
var currentBetAmount = initialBetAmount,
    currentRollNumber = 1,
    lastStatus,
    lastBetColor,
    lastRollColor,
    $balance = $("#balance"),
    $betAmountInput = $("#betAmount"),
    $statusBar = $(".progress #banner"),
    $redButton = $("#panel1-7 .betButton"),
    $blackButton = $("#panel8-14 .betButton"),
    refreshIntervalId = setInterval(tick, 1000);

var startCoinsAmount = getBalance();
var earnedSoFar = 0;
var secondsRunning = 0;
var div = $("#balance").parent().parent();
div.append($('<p>Starting with: <span id="startAmount">' + startCoinsAmount + ' (' + (startCoinsAmount / 1000).toFixed(2) + '$)</span></p>'));
div.append($('<p>Earned so far: <span id="earnedSoFar">' + earnedSoFar + ' (' + (earnedSoFar / 1000).toFixed(2) + '$)</span></p>'));
div.append($('<p>Running: <span id="running">' + ToTimer(secondsRunning) + '</span></p>'));
div.append($('<p>Earnings per second: <span id="eps">' + eps(secondsRunning) + '</span></p>'));
div.append($('<p>Earnings per minute: <span id="epm">' + epm(secondsRunning) + '</span></p>'));
div.append($('<p>Earnings per hour: <span id="eph">' + eph(secondsRunning) + '</span></p>'));

function DisplayInfoText() {
    $("#startAmount").text(startCoinsAmount + ' (' + (startCoinsAmount / 1000).toFixed(2) + '$)');
    $("#earnedSoFar").text(earnedSoFar + ' (' + (earnedSoFar / 1000).toFixed(2) + '$)');
    $("#running").text(ToTimer(secondsRunning));
    $("#eps").text(eps(secondsRunning));
    $("#epm").text(epm(secondsRunning));
    $("#eph").text(eph(secondsRunning));
}

function ToTimer(seconds) {
    var sec_num = parseInt(seconds, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
}

function eps(seconds) {
    return earnedSoFar / seconds;
}

function epm(seconds) {
    var minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
        return earnedSoFar / minutes;
    }
    return "let the bot run for a minute!";
}

function eph(seconds) {
    var hours = Math.floor(seconds / 3600)
    if (hours > 0) {
        return earnedSoFar / hours;
    }
    return "let the bot run for a hour!";
}
