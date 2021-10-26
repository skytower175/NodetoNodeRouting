import { Console } from "console";
import { isCaseOrDefaultClause, isShorthandPropertyAssignment } from "typescript";

import * as rd from 'readline'
import { readFile } from "fs";

class Route{
    location: string;
    destination: string;
    distance: number;
    constructor(location: string, destination: string, distance: number){
        this.location = location;
        this.destination = destination;
        this.distance = distance;
    }
    display_Location(){
        return this.location;
    }
    display_Destination(){
        return this.destination;
    }
    display_Distance(){
        return this.distance;
    }
}//Route class


class Cordinate {
    location: string;
    roads: Route[];
    constructor(location: string){
        this.roads = [];
        this.location = location;
            global.routes.forEach(Route => {
                
                if (this.location == Route.location){
                    this.roads.push(Route);

                }
            });
    }//identify the paths that this cordinate is attached to
    Matchlocation(query: string){
        if (query === this.location){
            return this
        }else{
            return null
        }
    }

    Routing(){
        let destinations: Array<Cordinate> = [];
        this.roads.forEach(route => {
            destinations.push(new Cordinate(route.destination));
        });
        
        return destinations;
    }
}//Cordinate Class


declare global {
    var routes: Array<Route>;
    var checkpoint: string[];
    var paths:string[][];
    var path:string[];
    var calls: number;
    var Cordinates: Array<Cordinate>; 
}
global.checkpoint = new Array();
global.routes = new Array();
global.Cordinates = new Array();
global.paths = new Array();
global.path = new Array();
global.checkpoint = new Array();
global.calls = 0;

//initializing global variable

function Addcheckpoint(input: string){
    if (global.checkpoint.indexOf(input) === -1){
        global.checkpoint.push(input);
        //onsole.log("input "+ input);
    }
}//loading checkpoints




function distancetravel(location: string, destintaion: string){
    let distance = 0;
    global.routes.forEach(Route => {
        if ((location === Route.display_Location()) && (destintaion === Route.display_Destination())){
            distance = (Route.display_Distance());
        }
    });

    return distance;
}//figuring the distance travel

function graphing(question: string[]){
    var distance: number = 0;
    for (let i = 0; i < (question.length-1); i++){
        let j = i +1;
        let res = (distancetravel(question[i], question[j]));
        if (0 === res){
            return ('NO SUCH ROUTE')
        }else{
            distance = distance + res;
        }
  }
  var ans: string = distance.toString();
  return ans;
}//graphing the cordinate 


function removeUnnecessarycord(){
    global.paths.forEach(path => {
        while(path[2] === path[0]){
            console.log(path);
            path.splice(2,2);
            console.log(path);
        }

    });
}


function removeDuplicate(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}//remove any duplicate from array

function possiblity(cord: Cordinate, destination: string, max?: number, min?: number, maxdist?: number){
    //console.log("path " + global.path.length);  
    if ((global.path.length <= max) && (cord.location === destination) && (global.path.length >= min)){
        global.paths.push(global.path);
        return;
        //success condition
    }else if ((global.path.length > max)) {
        global.path.forEach(element => {
            console.log("before " + element);  
        });
        global.path.pop();
        global.path.forEach(element => {
            console.log("after " + element);  
        });
        return;
    }//exit condition
    
    cord.Routing().forEach(node => {
        global.path.push(node.location);
      //  console.log(node.location);
        possiblity(node, destination, max, min);
    });//routing through cordinates
}

function question6(location: string,  destination: string, max?: number, min?: number){
    let cord = global.Cordinates.find(i => i.location === location)
   // console.log("dd" +  location);
    global.paths =[];//reset path 
    possiblity(cord, destination, max, min);
    global.paths = removeDuplicate(global.paths)
    removeUnnecessarycord();
    global.paths.forEach(path => {
        path.unshift(location);//adding the initial location
        path.forEach(element => {
            //console.log("ans " + element); 
        }); 
    });
    return (global.paths.length);
}

function Findshortest(location: string, destination: string){
    global.routes.forEach(route => {
        //console.log("routes" + route.location + route.destination);
    })
    
    var ignore = question6(location, destination, 5, 2);
    //console.log('Hello');
    var distance: number = 10;
    global.paths.forEach(path => {
        console.log("path " + path)
        var dist = (graphing(path));
        //console.log(dist);
        if (dist !== "NO SUCH ROUTE"){
            if (distance >= parseInt(dist)){
                distance = parseInt(dist);
            }
        }
    });
    return distance;
}

function questions(){
    global.checkpoint = removeDuplicate(global.checkpoint);
    global.checkpoint.forEach(check => {
        //console.log("add cordinate" + check);
        global.Cordinates.push(new Cordinate(check));   
    });    
    global.routes.forEach(route => {
        //console.log("Routes " + route.location + route.destination);
        global.Cordinates.push(new Cordinate(route.destination));   
    });
    
    console.log('1: '+ graphing(['A', 'B', 'C']));
    console.log('2: '+ graphing(['A', 'D']));
    console.log('3: '+ graphing(['A', 'D', 'C']));
    console.log('4: '+ graphing(['A', 'E', 'B', 'C', 'D']));
    console.log('5: '+ graphing(['A', 'E', 'D']));
    console.log('6: '+ question6("C", 'C', 3, 1));
    console.log('7: '+ question6('A', 'C', 4, 3));
    console.log("8: " + Findshortest('A', 'C'));
    console.log("9: " + Findshortest('B', 'B'));
}


function Read(){
    if (process.argv.length < 3) {
        //console.log('Usage: node ' + process.argv[1] + ' FILENAME');
        process.exit(1);
    }
        // Read the file and print its contents.
    let fs = require('fs'), filename = process.argv[2];
    var reader = rd.createInterface(fs.createReadStream(filename))

    var data: Array<{number: string; from: string; to: string; dist: number}> = [];
    reader.on("line", (l: string) =>{
        var nr = (l[0]);
        var from = l[1];
        var to = l[2];
        var dist = parseInt(l[3]);
       //console.log(`from: ${from} to ${to} dist ${dist}`);
        data.push({
            number: nr, from, to, dist
        });
        //console.log(`Will be empty data has not yet been read ${data.length}` );

    });
    reader.on('close', ()=> {
        data.forEach(element => {
           // console.log(element.from + element.to);
            global.routes.push(new Route(element.from, element.to, element.dist));
            Addcheckpoint(element.from);
            Addcheckpoint(element.to);
        });//Adding coordinates 
        //console.log('here');F
        questions();
    });
}


    
Read();//reading the input file










/*global.Cordinates.forEach(element => {
    console.log(element.location);
    
});*/



