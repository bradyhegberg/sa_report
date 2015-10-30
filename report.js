// reference the http module so we can create a webserver
var http = require("http");
var https = require("https");
var url = require("url");
var parseString = require('xml2js').parseString;
var util = require("util");

var data = "";
var date = new Date();
var dateStrFirst = (date.getMonth() + 1) + "-" + "1" + "-" + date.getFullYear();
var dateStrToday = (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear();

// options for GET
var optionsget = {
    host : 'sdg%5Cbrady.hegberg%40solutiondesign.com:n2BoERa%240p@api.springahead.com', // here only the domain name
    //host : 'www.google.com',
    // (no http/https !)
    port : 443,  //443 for https, 80 for http
    //res.write("date: " + dateStr;
    path : '/v1/mytimecard/range/2015-10-1/2015-11-1', // the rest of the url with parameters if needed
    //path : '',
    method : 'GET' // do GET
};


// create a server
http.createServer(function(req, res) {
    // on every request, we'll output 'Hello world'
    
    var pwd = req.params.pwd;
    var springAheadURL = "https://sdg%5Cbrady.hegberg%40solutiondesign.com:n2BoERa%240p@api.springahead.com/v1/mytimecard/range/" + dateStrFirst + "/" + dateStrToday;
    
    res.writeHeader(200, {"Content-Type": "text/html"});
    res.write("<html>");

//    var reqGet = http.request(optionsget, function(res2) {
    var reqGet = https.get(springAheadURL, function(res2) {
        console.log("statusCode: ", res2.statusCode);
        // uncomment below for header details
        // console.log("headers: ", res.headers);
    
        res2.on('data', function(d) {
            //console.info('Got bytes:' + d.length);
            //process.stdout.write(d);
            //console.info('\nCall completed');
            
            data = data + d;
        });
    
        res2.on('end', function(d) {
            console.info("\n\nlength = " + data.length);
            //console.info("\n\ndata = " + data);
            
            //console.info(data);
            
            parseString(data, function (err, result) {
                //console.dir(result.SpringAhead.List[0].Timecard);  //output to depth = 2
                //console.log(util.inspect(result, false, null));  //output all depths
                
                var i;
                for (i in result.SpringAhead.List[0].Timecard)
                {
                    var tc = result.SpringAhead.List[0].Timecard[i];
                    //console.dir(tc.TimecardDate[0] + ", " + tc.HoursDay[0]);
                    res.write(tc.TimecardDate[0] + ", " + tc.HoursDay[0] + "</br>");
                }
                
            });
            
            // var parser = new DOMParser();
            // var doc = parser.parseFromString(data, "text/html");
            
            
            // var thedata = JSON.parse(data);
            // var i;
            // for (i in thedata.results)
            // {
            //     res.write(thedata.results[i].city + "</br>");
            //     res.write(thedata.results[i].description + "</br></br>");
            //   //console.log(thedata.results[i].description + "\n");
            // }
            // data = "";
            
            res.end("\n</html>");
            console.info("\n\nbye");
            
        });
    
        // console.info("\n\nlength = " + data.length);
        // console.info("\n\ndata = " + data);
    
    });
    
    reqGet.end();
    reqGet.on('error', function(e) {
        console.error(e);
    });


}).listen(process.env.PORT, process.env.IP);
// Note: when spawning a server on Cloud9 IDE, 
// listen on the process.env.PORT and process.env.IP environment variables
