app.functions = (function (_module) {

    _module.Init = function (function_name, data) {

        switch (function_name) {
            case "GetPayOut":
                return GetPayout(data);
            case "GetAllPayouts":
                return GetAllPayouts();
            case "formatCurrency":
                return formatCurrency(data);
            case "buildBetObject":
                return BuildBetObject(data);
            case "buildBetSlipObject":
                return BuildBetSlipObject(data);
            case "buildReceiptObject":
                return buildReceiptObject(data);
        }

    };

    var GetPayout = function (data) {
        var s = data.stake;
        var id = data.bet_id;
        var n = data.odds.numerator;
        var d = data.odds.denominator;
        var payout = (n + d) / d * s;
        return payout;
    };

    var GetAllPayouts = function () {
        var stake = $("#input_stake").val();
        var payouts = [];
        $(app.data.bets).each(function () {
            var bet = this;
            var amount = app.functions.Init("GetPayOut",
                {
                    "bet_id": bet.bet_id,
                    "stake": stake,
                    "odds": {
                        "numerator": bet.odds.numerator,
                        "denominator": bet.odds.denominator
                    }
                }
            );
            var payout = { id: bet.bet_id, amount: amount };
            payouts.push(payout);
        });
        app.data.payouts = payouts;
        return payouts;
    };

    var BuildBetObject = function (initialiser) {
        var betElement = initialiser.closest("[data-bet-id]");
        var bet_id = betElement.data("bet-id");

        var odds = {};

        $(app.data.bets).each(function () {
            if (this.bet_id === bet_id) {
                odds = this.odds;
            }
        });

        app.data.betstosubmit.push({
            "bet_id": bet_id,
            "odds": {
                "numerator": odds.numerator,
                "denominator": odds.denominator
            },
            "stake": $("#input_stake").val()
        });

    };

    var BuildBetSlipObject = function (initialiser) {
        var betElement = initialiser.closest("[data-bet-id]");
        var bet_id = betElement.data("bet-id");
        var bet = {};
        var payout;
        var stake = formatCurrency($("#input_stake").val());

        $(app.data.bets).each(function () {
            if (this.bet_id === bet_id) {
                bet = this;
            }
        });

        $(app.data.payouts).each(function () {
            if (this.id === bet_id) {
                payout = this.amount;
            }
        });

        app.data.betslip.push({
            "bet_id": bet.bet_id,
            "event": bet.event,
            "name": bet.name,
            "odds": bet.odds,
            "decimal": bet.decimal,
            "stake": stake,
            "payout": formatCurrency(payout)
        });
    };

    var buildReceiptObject = function (data) {
        var bet_id = data.bet_id;

        var odds = {};
        var decimal;

        $(app.data.bets).each(function () {
            if (this.bet_id === bet_id) {
                odds = this.odds;
                decimal = this.decimal;
            }
        });

        var payout = app.functions.Init("GetPayOut",
            {
                "bet_id": data.bet_id,
                "stake": data.stake,
                "odds": {
                    "numerator": odds.numerator,
                    "denominator": odds.denominator
                }
            }
        );

        app.data.receipt.push({
            "transaction_id": data.transaction_id,
            "bet_id": bet_id,
            "event": data.event,
            "name": data.name,
            "odds": {
                "numerator": odds.numerator,
                "denominator": odds.denominator
            },
            "decimal": decimal,
            "stake": app.functions.Init("formatCurrency", data.stake),
            "payout": app.functions.Init("formatCurrency", payout)
        });

    };

    var formatCurrency = function (amount) {
        var formatter = new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        var formattedAmount = formatter.format(amount);

        return formattedAmount;
    };


    return _module;
}(app.functions || {}));