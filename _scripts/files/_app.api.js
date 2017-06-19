app.api = (function (_module) {

    _module.Init = function (requestType, data) {
        if (requestType === "get") {
            get();
        } else if (requestType === "post") {
            post(data);
        } else {
            console.log("an error occured");
        }
    };

    var get = function () {
        $.ajax({
            url: app.settings.getBetUrl
        }).done(function (bets) {
            app.data.bets = bets;
            app.view.component("betList");
        });
    };

    var post = function (data) {

        var receipt_requests = [];

        $(data).each(function (i) {

            var receipt_request = $.ajax({
                method: "POST",
                url: app.settings.postBetUrl,
                data: data[i]
            }).done(function (receipt) {                
                app.functions.Init("buildReceiptObject", receipt);
            });

            receipt_requests.push(receipt_request);
        });

        $.when.apply(null, receipt_requests).done(function () {
            app.view.component("receipt");
        });
    };

    return _module;
}(app.api || {}));