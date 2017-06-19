$(document).ready(function () {
    app.Init();
});

var app = (function (_module) {

    const APIURL = "https://bedefetechtest.herokuapp.com/v1/";

    _module.Init = function () {
        app.api.Init("get");
    };

    _module.settings = {
        getBetUrl: APIURL + "markets",
        postBetUrl: APIURL + "bets"
    };

    _module.data = {
        bets: [],
        payouts: [],
        betslip: [],
        betstosubmit: [],
        receipt: [],
        oddstype : "f"
    };

    return _module;
}(app || {}));