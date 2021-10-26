"use strict";
exports.__esModule = true;
var rd = require("readline");
var Route = /** @class */ (function () {
    function Route(location, destination, distance) {
        this.location = location;
        this.destination = destination;
        this.distance = distance;
    }
    Route.prototype.display_Location = function () {
        return this.location;
    };
    Route.prototype.display_Destination = function () {
        return this.destination;
    };
    Route.prototype.display_Distance = function () {
        return this.distance;
    };
    return Route;
}()); //Route class
var Cordinate = /** @class */ (function () {
    function Cordinate(location) {
        var _this = this;
        this.roads = [];
        this.location = location;
        global.routes.forEach(function (Route) {
            if (_this.location == Route.location) {
                _this.roads.push(Route);
            }
        });
    } //identify the paths that this cordinate is attached to
    Cordinate.prototype.Matchlocation = function (query) {
        if (query === this.location) {
            return this;
        }
        else {
            return null;
        }
    };
    Cordinate.prototype.Routing = function () {
        var destinations = [];
        this.roads.forEach(function (route) {
            destinations.push(new Cordinate(route.destination));
        });
        return destinations;
    };
    return Cordinate;
}()); //Cordinate Class
global.checkpoint = new Array();
global.routes = new Array();
global.Cordinates = new Array();
global.paths = new Array();
global.path = new Array();
global.checkpoint = new Array();
global.calls = 0;
//initializing global variable
function Addcheckpoint(input) {
    if (global.checkpoint.indexOf(input) === -1) {
        global.checkpoint.push(input);
        //onsole.log("input "+ input);
    }
} //loading checkpoints
function distancetravel(location, destintaion) {
    var distance = 0;
    global.routes.forEach(function (Route) {
        if ((location === Route.display_Location()) && (destintaion === Route.display_Destination())) {
            distance = (Route.display_Distance());
        }
    });
    return distance;
} //figuring the distance travel
function graphing(question) {
    var distance = 0;
    for (var i = 0; i < (question.length - 1); i++) {
        var j = i + 1;
        var res = (distancetravel(question[i], question[j]));
        if (0 === res) {
            return ('NO SUCH ROUTE');
        }
        else {
            distance = distance + res;
        }
    }
    var ans = distance.toString();
    return ans;
} //graphing the cordinate 
function removeUnnecessarycord() {
    global.paths.forEach(function (path) {
        while (path[2] === path[0]) {
            console.log(path);
            path.splice(2, 2);
            console.log(path);
        }
    });
}
function removeDuplicate(arr) {
    var uniques = [];
    var itemsFound = {};
    for (var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if (itemsFound[stringified]) {
            continue;
        }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
} //remove any duplicate from array
function possiblity(cord, destination, max, min, maxdist) {
    //console.log("path " + global.path.length);  
    if ((global.path.length <= max) && (cord.location === destination) && (global.path.length >= min)) {
        global.paths.push(global.path);
        return;
        //success condition
    }
    else if ((global.path.length > max)) {
        global.path.forEach(function (element) {
            console.log("before " + element);
        });
        global.path.pop();
        global.path.forEach(function (element) {
            console.log("after " + element);
        });
        return;
    } //exit condition
    cord.Routing().forEach(function (node) {
        global.path.push(node.location);
        //  console.log(node.location);
        possiblity(node, destination, max, min);
    }); //routing through cordinates
}
function question6(location, destination, max, min) {
    var cord = global.Cordinates.find(function (i) { return i.location === location; });
    // console.log("dd" +  location);
    global.paths = []; //reset path 
    possiblity(cord, destination, max, min);
    global.paths = removeDuplicate(global.paths);
    removeUnnecessarycord();
    global.paths.forEach(function (path) {
        path.unshift(location); //adding the initial location
        path.forEach(function (element) {
            //console.log("ans " + element); 
        });
    });
    return (global.paths.length);
}
function Findshortest(location, destination) {
    global.routes.forEach(function (route) {
        //console.log("routes" + route.location + route.destination);
    });
    var ignore = question6(location, destination, 5, 2);
    //console.log('Hello');
    var distance = 10;
    global.paths.forEach(function (path) {
        console.log("path " + path);
        var dist = (graphing(path));
        //console.log(dist);
        if (dist !== "NO SUCH ROUTE") {
            if (distance >= parseInt(dist)) {
                distance = parseInt(dist);
            }
        }
    });
    return distance;
}
function questions() {
    global.checkpoint = removeDuplicate(global.checkpoint);
    global.checkpoint.forEach(function (check) {
        //console.log("add cordinate" + check);
        global.Cordinates.push(new Cordinate(check));
    });
    global.routes.forEach(function (route) {
        //console.log("Routes " + route.location + route.destination);
        global.Cordinates.push(new Cordinate(route.destination));
    });
    console.log('1: ' + graphing(['A', 'B', 'C']));
    console.log('2: ' + graphing(['A', 'D']));
    console.log('3: ' + graphing(['A', 'D', 'C']));
    console.log('4: ' + graphing(['A', 'E', 'B', 'C', 'D']));
    console.log('5: ' + graphing(['A', 'E', 'D']));
    console.log('6: ' + question6("C", 'C', 3, 1));
    console.log('7: ' + question6('A', 'C', 4, 3));
    console.log("8: " + Findshortest('A', 'C'));
    console.log("9: " + Findshortest('B', 'B'));
}
function Read() {
    if (process.argv.length < 3) {
        //console.log('Usage: node ' + process.argv[1] + ' FILENAME');
        process.exit(1);
    }
    // Read the file and print its contents.
    var fs = require('fs'), filename = process.argv[2];
    var reader = rd.createInterface(fs.createReadStream(filename));
    var data = [];
    reader.on("line", function (l) {
        var nr = (l[0]);
        var from = l[1];
        var to = l[2];
        var dist = parseInt(l[3]);
        //console.log(`from: ${from} to ${to} dist ${dist}`);
        data.push({
            number: nr,
            from: from,
            to: to,
            dist: dist
        });
        //console.log(`Will be empty data has not yet been read ${data.length}` );
    });
    reader.on('close', function () {
        data.forEach(function (element) {
            // console.log(element.from + element.to);
            global.routes.push(new Route(element.from, element.to, element.dist));
            Addcheckpoint(element.from);
            Addcheckpoint(element.to);
        }); //Adding coordinates 
        //console.log('here');F
        questions();
    });
}
Read(); //reading the input file
/*global.Cordinates.forEach(element => {
    console.log(element.location);
    
});*/
