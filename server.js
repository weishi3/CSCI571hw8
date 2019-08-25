/**
 * Created by water on 3/16/18.
 */
// Get the packages we need
var express = require('express');

var key="AIzaSyA9B2j1QeDz4ldRWdxSzrVcMYVTJcvhZ8A";
var yelpKey="9zeg6KiWx1DhjDrXuGQ8s72Vvk_vaMSga1uW8gPEhsdUhIRRNJmsCwBGYdLyOs9Dopa_JboSaFYz-4p2QuSzhWUUiLFkoyvqj84JZUJ2Ua3R58uDpZot5RagRcu1WnYx";

var bodyParser = require('body-parser');
var router = express.Router();
var XMLHttpRequest = require('xhr2');



function sleep(milliseconds) {
    var start = new Date().getTime();
    while(true) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = this.status; //xhr.status
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};


// Create our Express application
var app = express();
var yelp = require('yelp-fusion');
// Use environment defined port or 4000
var port = process.env.PORT || 3000;


//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


//// All our routes will start with /api
//app.use('/api', router);

app.get("/hello", function (req, res) {
    res.json(["hello"]);
});

app.get("/yelp", function (req, res) {
    console.log(req.query);
    var query=req.query;
    var name=query.name;
    var address1=query.address1;
    var city=query.city;
    var state=query.state;
    var postal_code=query.postal_code;
    var country=query.country;

    var client = yelp.client(yelpKey);

    client.businessMatch('best', query).then(response => {
        console.log("OK1");
        if (response.jsonBody.businesses.length==0){
            console.log(response);
            res.json({"status":"OK","data":[]});
            return;
        }

        var businessId= response.jsonBody.businesses[0].id;

        client.reviews(businessId).then(response => {
            res.json({"status":"OK","data":response.jsonBody.reviews});
           // res.json();
            return;
        }).catch(e1 => {
            res.json({"status":"error"});
        });

    }).catch(e => {//all error goes here not include empty
        res.json({"status":"error"});
    });

});

app.get('/iniForm', function(req, res) {
    //test
    //getJSON("https://www.google.com",
    //    function(err, data) {
    //        if (err !== null) {
    //            console.log("googleerror");
    //        } else {
    //
    //            console.log("googleOK");
    //        }
    //    }); OK HERE NOT OK FRONT


    console.log("getIniForm");
    //placeNameDown=[];
    //iconDown=[];
    //addressDown=[];
    var query=req.query;
    //console.log(query);
    var keyword=query.keyword;
    var category=query.category;
    var distance=query.distance;
    if (distance=="")
        distance=10;
    var selectcenter=query.selectcenter;
    var place=query.place;
    distance=distance*1609;
    var localLat=query.lat;
    var localLng=query.lng;
    var nearbyUrl="";
    var placeCheckUrl="";

    keyword = keyword.replace(/ /g, '+');
    if (selectcenter=="other"){
        place = place.replace(/ /g, '+');
        placeCheckUrl="https://maps.googleapis.com/maps/api/geocode/json?address="+place+"&key="+key;
        console.log(placeCheckUrl);
        getJSON(placeCheckUrl,
            function(err, geoInfo) {
                if (err !== null) {
                    res.json({"status":"error"});
                    console.log("error_geo");
                    return;
                } else {
                    if (geoInfo.status!="OK"){
                        if (geoInfo.status=="ZERO_RESULTS"){
                            res.json({"status":"zero","data":[]});
                            console.log("no");
                            return;

                        }else{
                            res.json({"status":"error"});

                            console.log("error_geo");
                            return;
                        }
                    }
                    var speLat= geoInfo.results[0].geometry.location.lat;
                    var speLng=geoInfo.results[0].geometry.location.lng;
                    nearbyUrl="https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+speLat+","+speLng+"&radius="+distance+"&type="+category+"&keyword="+keyword+"&key="+key;
                    console.log(nearbyUrl);
                    getJSON(nearbyUrl,
                        function(err, data) {
                            if (err !== null) {

                                res.json({"status":"error"});
                                return;
                                //console.log(err);
                                //console.log(data);
                            } else {
                                if (data.status!="OK"){
                                    if (data.status=="ZERO_RESULTS"){
                                        res.json({"status":"zero","data":[]});
                                        console.log("no");
                                        return;

                                    }else{
                                        res.json({"status":"error"});

                                        console.log("error_geo");
                                        return;
                                    }
                                }
                                var results=data.results;
                                var nextToken=data.next_page_token;
                                if (nextToken){
                                    nearbyUrl="https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken="+nextToken+"&key="+key;
                                    sleep(2000);
                                    getJSON(nearbyUrl,
                                        function(err1, data1) {
                                            if (err1!== null) {
                                                res.json({"status":"partial",
                                                    "lastIndex":1,
                                                    "data":results
                                                });
                                                return;
                                            } else {

                                                if (data1.status!="OK"){

                                                    res.json({"status":"partial",
                                                        "lastIndex":1,
                                                        "data":results
                                                    });

                                                    return;
                                                }

                                                var results1=data1.results;
                                                for(var j=0;j<results1.length;j++){
                                                    results.push(results1[j]);
                                                }


                                                var nextToken1=data1.next_page_token;

                                                if (nextToken1){
                                                    sleep(2000);
                                                    nearbyUrl="https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken="+nextToken1+"&key="+key;
                                                    getJSON(nearbyUrl,
                                                        function(err2, data2) {
                                                            if (err2!== null) {
                                                                res.json({"status":"partial",
                                                                    "lastIndex":2,
                                                                    "data":results
                                                                });
                                                                return;

                                                            } else {

                                                                if (data2.status!="OK"){

                                                                    res.json({"status":"partial",
                                                                        "lastIndex":2,
                                                                        "data":results
                                                                    });

                                                                    return;
                                                                }
                                                                var results2=data2.results;
                                                                for(var k=0;k<results2.length;k++){
                                                                    results.push(results2[k]);
                                                                }
                                                                res.json({"status":"OK",
                                                                    "data":results
                                                                });
                                                                return;

                                                            }
                                                        });
                                                }else{

                                                    res.json({"status":"OK",
                                                        "data":results
                                                    });
                                                    return;

                                                }
                                            }
                                        });

                                }else{

                                    res.json({"status":"OK",
                                        "data":results
                                    });
                                    return;
                                }
                            }
                        });
                }
            });

    }else{
        nearbyUrl="https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+localLat+","+localLng+"&radius="+distance+"&type="+category+"&keyword="+keyword+"&key="+key;
        console.log(nearbyUrl);
        getJSON(nearbyUrl,
            function(err, data) {
                if (err !== null) {
                    res.json({"status":"error"});
                    return;

                } else {
                    if (data.status!="OK"){
                        if (data.status=="ZERO_RESULTS"){
                            res.json({"status":"zero","data":[]});
                            console.log("no");
                            return;

                        }else{
                            res.json({"status":"error"});

                            console.log("error_geo");
                            return;
                        }
                    }

                    var results=data.results;
                    var nextToken=data.next_page_token;
                    if (nextToken){
                        nearbyUrl="https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken="+nextToken+"&key="+key;
                            sleep(2000);
                            getJSON(nearbyUrl,
                                function(err1, data1) {
                                    if (err1!== null) {
                                        res.json({"status":"partial",
                                            "lastIndex":1,
                                            "data":results
                                        });
                                        return;

                                    } else {
                                        if (data1.status!="OK"){

                                            res.json({"status":"partial",
                                                "lastIndex":1,
                                                "data":results
                                            });

                                            return;
                                        }

                                        var results1=data1.results;
                                        for(var j=0;j<results1.length;j++){
                                            results.push(results1[j]);
                                        }


                                        var nextToken1=data1.next_page_token;

                                        if (nextToken1){
                                            sleep(2000);
                                            nearbyUrl="https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken="+nextToken1+"&key="+key;
                                            getJSON(nearbyUrl,
                                                function(err2, data2) {
                                                    if (err2!== null) {
                                                        res.json({"status":"partial",
                                                            "lastIndex":2,
                                                            "data":results
                                                        });
                                                        return;

                                                    } else {
                                                        if (data2.status!="OK"){

                                                            res.json({"status":"partial",
                                                                "lastIndex":2,
                                                                "data":results
                                                            });

                                                            return;
                                                        }
                                                        var results2=data2.results;
                                                        for(var k=0;k<results2.length;k++){
                                                            results.push(results2[k]);
                                                        }
                                                        res.json({"status":"OK",
                                                            "data":results
                                                        });
                                                        return;

                                                    }
                                                });
                                        }else{

                                            res.json({"status":"OK",
                                                "data":results
                                            });
                                            return;

                                        }
                                    }
                                });

                    }else{
                        res.json({"status":"OK",
                            "data":results
                        });
                        return;
                    }
                }
            });
    }




});


//Default route here
//var homeRoute = router.route('/');
//
//homeRoute.get(function(req, res) {
//    res.json({ message: 'Hello World!' });
//});

// for user












//Add more routes here

// Start the server
app.listen(port);
console.log('Server running on port ' + port);
