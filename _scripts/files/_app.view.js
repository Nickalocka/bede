app.view = (function (_module) {

    var bb_collection = Backbone.Collection.extend();

    _module.component = function (component, data) {

        switch (component) {
            case "betList":
                render_BetList();
                break;
            case "betSlip":
                render_BetSlip(data);
                break;
            case "receipt":
                render_Receipt();
                break;
            case "allPayouts":
                render_AllPayouts();
                break;
            case "btn_switchFormat":
                render_btnSwitchFormat(data);
                break;
            default:
                console.log("default");
        }
    };

    var render_BetList = function () {
        $(app.data.bets).each(function () {
            this.decimal = parseFloat((this.odds.numerator / this.odds.denominator) + 1).toFixed(2); 
        });

        var collection_ListOfBets = new bb_collection(app.data.bets);

        var setview_ListOfBets = Marionette.View.extend({
            el: '#component_bet-list',
            template: '#template_BetList',
            events: {
                'input #input_stake': 'showPayouts',
                'click #add_bet': 'addBetSlip',
                'click [data-odds-type]': "switchFormat"
            },
            showPayouts: function (event) {
                app.view.component("allPayouts");
            },
            addBetSlip: function (event) {
                app.view.component("betSlip", $(event.currentTarget));
            },
            switchFormat: function (event) {
                var btn = $(event.currentTarget);
                if (btn.data("odds-type") === "d") {
                    app.data.oddstype = "d";
                } else {
                    app.data.oddstype = "f";
                };

                app.view.component("btn_switchFormat", btn);
            }
        });

        var view_ListOfBets = new setview_ListOfBets({ collection: collection_ListOfBets });
        view_ListOfBets.render();
        $("#component_bet-list").fadeIn();
    };

    var render_AllPayouts = function () {

        var input = $("#input_stake");

        var v = input.val();
        var no_nonnumerals = v.replace(/[^0-9]/g, '');
        input.val(no_nonnumerals);

        if (input.val() > 1) {
            $("#stake").removeClass("invalid");
        };

        var payouts = app.functions.Init("GetAllPayouts");

        var betList = $("#component_bet-list");

        $(payouts).each(function () {
            var id = this.id;
            var bet = betList.find("[data-bet-id='" + id + "']");
            var el = bet.find("[data-bet-payout]");
            var amount = app.functions.Init("formatCurrency", this.amount);
            el.html(amount);
        });

    };

    var render_BetSlip = function (initialiser) {

        if ($("#input_stake").val() < 1) {
            $("#stake").addClass("invalid");
            $("html, body").animate({ scrollTop: 0 }, 1000);
        } else {

            if (initialiser !== "slip_removed") {
                app.functions.Init("buildBetObject", initialiser);
                app.functions.Init("buildBetSlipObject", initialiser);
            };

            var collection_BetSlip = new bb_collection(app.data.betslip);

            var setview_BetSlip = Marionette.View.extend({
                el: '#bet-slip',
                template: '#template_BetSlip'
            });

            var view_BetSlip = new setview_BetSlip({ collection: collection_BetSlip });

            view_BetSlip.render();

            if (app.data.oddstype === "d") {
                app.view.component("btn_switchFormat", $("[data-odds-type]"));
            };

            $("#component_bet-slip").fadeIn();
            $("html, body").animate({ scrollTop: $(document).height() }, 1000);

            $("[data-slip-delete]").off().on("click", function () {
                var id = $(this).data("slip-delete");
                app.data.betstosubmit = _.reject(app.data.betstosubmit, function (el) { return el.bet_id === id; });
                app.data.betslip = _.reject(app.data.betslip, function (el) { return el.bet_id === id; });


                if (app.data.betslip.length < 1) {
                    $("#component_bet-slip").fadeOut();
                } else {
                    app.view.component("betSlip", "slip_removed");
                };

            });

            $("#btn_submitBetSlip").off().on("click", function () {
                app.api.Init("post", app.data.betstosubmit);
            });

        };

    };

    var render_Receipt = function () {
        var collection_Receipt = new bb_collection(app.data.receipt);

        var setview_Receipt = Marionette.View.extend({
            el: '#component_receipt',
            template: '#template_receipt',
            events: {
                'click [data-odds-type]': "switchFormat"
            },
            switchFormat: function (event) {
                var btn = $(event.currentTarget);
                if (btn.data("odds-type") === "d") {
                    app.data.oddstype = "d";
                    btn.data("odds-type", "f").attr("data-odds-type", "f");
                    $("[data-odds='f']").hide();
                    $("[data-odds='d']").show();
                } else {
                    app.data.oddstype = "f";
                    btn.data("odds-type", "d").attr("data-odds-type", "d");                    
                    $("[data-odds='f']").show();
                    $("[data-odds='d']").hide();
                };
            }
        });

        var view_Receipt = new setview_Receipt({ collection: collection_Receipt });
        view_Receipt.render();

        if (app.data.oddstype === "d") {
            app.view.component("btn_switchFormat", $("[data-odds-type]"));
        };

        $("#component_bet-slip").fadeOut().remove();
        $("#component_bet-list").fadeOut(function () {
            $("#component_receipt").fadeIn();
        }).remove();        
    };

    var render_btnSwitchFormat = function (btn) {
        if (app.data.oddstype === "d") {
            btn.data("odds-type", "f").attr("data-odds-type", "f");
            $("[data-odds='f']").hide();
            $("[data-odds='d']").show();
        } else {
            btn.data("odds-type", "d").attr("data-odds-type", "d");
            $("[data-odds='f']").show();
            $("[data-odds='d']").hide();
        };
    };

    return _module;
}(app.view || {}));