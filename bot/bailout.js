var bailoutBot = {
    doBailout: function doBailout() {
        this.trace();
        this.eachCity(function doBailOutEach(city) {
            if(city.type != "DoriaAirport") {
                this.sendGetCommand("Update bail" , "cities/" + city.id + "/cash_jail.json", "", city);
            }
        });
    },
    payBailout: function payBailout(city) {
        this.trace();
        if(!city || !city.bailout) {
            this.debugBailout('No city or bailout', city);
            return;
        }

        var cash = 0;
        if(city.resources) {
            cash = parseInt(city.resources.cash, 10);
        } else {
            this.debugBailout('No resources', city);
        }
        var data = "";
        var str = "";
        var total_cost = 0;

        for(var unit in city.bailout) {
            if(this.attackUnits[unit] && this.attackUnits[unit].bailout) {
                var cost = this.attackUnits[unit].bailout;
                var all = parseInt(city.bailout[unit], 10);
                var all_cost = cost * all;
                this.debugBailout(unit + " costs " + all_cost + " and all units costs " + total_cost + " and I have " + cash, city);
                var count = parseInt((cash - total_cost) / cost, 10);
                if(count > 0) {
                    count = count > all ? all : (count - 1);
                    var count_cost = count * cost;
                    this.debugBailout("I can affort " + count + " " + unit + " because it cost " + count_cost + " and I have " + (cash - total_cost) + " (" + cash + ")", city);
                    total_cost += count_cost;

                    data += "&units[" + unit + "]=" + count;
                    str += count + " " + unit + ", ";
                } else {
                    this.debugBailout("Can't affort " + unit + " because it cost " + cost + " and I have " + (cash - total_cost) + " (" + cash + ")", city);
                }
            } else {
                this.debug("Missing bailout for " + unit, city);
            }
        }
        city.bailout = {};
        if(data !== "") {
            this.debugBailout(str, city);
            this.sendCommand("Pay Bailout in " + city.type, "cities/" + city.id + "/cash_jail/bail.json", "payment_method=cash" + data, city);
        } else {
            this.debugBailout('No bailout data to send', city);
        }
    }
};
module.exports = bailoutBot;
