/**
 * Created by water on 4/11/18.
 */
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
        var status = xhr.status;
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

app.get('/placeToken', function(req, res) {
    var query=req.query;
    var placeToken=query.placeToken;
    var nextUrl="https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken="+placeToken+"&key="+key;
    getJSON(nextUrl,
        function(err2, data2) {
            if (err2!== null) {
                res.json({"status":"error"
                });
                return;

            } else {
                if (data2.status!="OK"){

                    res.json({"status":"error"
                    });

                    return;
                }
                var results=data2.results;
                var nextToken=data2.next_page_token;
                res.json({"status":"OK",
                    "data":results,
                    "nextToken":nextToken
                });
                return;

            }
        });
});

app.get('/direction', function(req, res) {
    var query=req.query;
    var startAddress=query.startAddress;
    var endLat=query.endLat;
    var endLng=query.endLng;
    var travelMethod=query.travelMethod;
    startAddress = startAddress.replace(/ /g, '+');
    travelMethod=travelMethod.toLowerCase();
    startAddress=encodeURIComponent(startAddress);

    var geoStartUrl="https://maps.googleapis.com/maps/api/geocode/json?address="+startAddress+"&key="+key;
    getJSON(geoStartUrl,
        function(err2, geoInfo) {
            if (err2!== null) {
                res.json({"status":"error"
                });
                return;

            } else {
                if (geoInfo.status!="OK"){

                    res.json({"status":"error"
                    });

                    return;
                }
                var startLat= geoInfo.results[0].geometry.location.lat;
                var startLng=geoInfo.results[0].geometry.location.lng;
                var nextUrl="https://maps.googleapis.com/maps/api/directions/json?origin="+startLat+","+startLng+"&destination="+endLat+","+endLng+"&mode="+travelMethod+"&key="+key;


                getJSON(nextUrl,
                    function(err2, data2) {
                        if (err2!== null) {
                            res.json({"status":"error"
                            });
                            return;

                        } else {
                            if (data2.status!="OK"){

                                res.json({"status":"error"
                                });

                                return;
                            }
                            var encodedPoints=data2.routes[0].overview_polyline.points;

                            res.json({"status":"OK",
                                "directionPoints":encodedPoints,
                                "startLat":startLat,
                                "startLng":startLng
                            });
                            return;

                        }
                    });


            }
        });



});

app.get('/detail', function(req, res) {
    var query=req.query;
    var placeId=query.placeId;
    var nextUrl="https://maps.googleapis.com/maps/api/place/details/json?placeid="+placeId+"&key="+key;
    getJSON(nextUrl,
        function(err2, data2) {
            if (err2!== null) {
                res.json({"status":"error"
                });
                console.log("error");
                return;

            } else {
                if (data2.status!="OK"){

                    res.json({"status":"error"
                    });
                    console.log("deny");
                    return;
                }
                var result=data2.result;
                var responseSoFar={"status":"OK",
                    "place_name": result.name,
                    "place_address":result.formatted_address,
                    "phone_number":result.formatted_phone_number,
                    "place_rating": result.rating,
                    "google_page":result.url,
                    "place_website": result.website,
                    "place_photos":result.photos,
                    "place_reviews":result.reviews,
                    "price_level":result.price_level,
                    "place_lat":result.geometry.location.lat,
                    "place_lng":result.geometry.location.lng,

                };
                //yelp
                var yelpName=result.name;
                var yelpFormattedAddress=result.formatted_address.split(", ");
                var yelpCountry="US";
                var po_st=yelpFormattedAddress[yelpFormattedAddress.length-2].split(" ");
                var yelpState=po_st[0];
                var yelpPostalCode=po_st[1];
                var yelpCity=yelpFormattedAddress[yelpFormattedAddress.length-3];


                var infoForYelp = {
                    "name":yelpName,
                    //"address1":yelpAddress1,
                    "city":yelpCity,
                    "state":yelpState,
                    "postal_code":yelpPostalCode,
                    "country":yelpCountry
                };
                if (yelpFormattedAddress.length>=4){
                    var yelpAddress1=yelpFormattedAddress[yelpFormattedAddress.length-4];
                    infoForYelp["address1"]=yelpAddress1;

                }
                //yelp request
                var client = yelp.client(yelpKey);

                client.businessMatch('best', infoForYelp).then(response => {
                    console.log("OK1");
                    if (response.jsonBody.businesses.length==0){
                        console.log(response);
                        res.json(responseSoFar);
                        return;
                    }

                    var businessId= response.jsonBody.businesses[0].id;

                    client.reviews(businessId).then(response => {
                        responseSoFar["yelp_review"]=response.jsonBody.reviews;

                        res.json(responseSoFar);

                        return;
                    }).catch(e1 => {
                        res.json(responseSoFar);
                        return;
                    });

                }).catch(e => {//all error goes here not include empty
                    res.json(responseSoFar);
                    return;

                });


            }
        });
});


app.get('/iniForm', function(req, res) {

    console.log("getIniForm");
    //placeNameDown=[];
    //iconDown=[];
    //addressDown=[];
    var query=req.query;
    //console.log(query);
    var keyword=query.keyword;
    var category=query.category;
    var distance=query.distance;
    var selectcenter=query.selectcenter;
    var place=query.place;
    var localLat=query.lat;
    var localLng=query.lng;


    //keyword = keyword.replace(/&/g, '+');
    //distance = distance.replace(/&/g, '+');
    //place = place.replace(/&/g, '+');
    category = category.replace(/ /g, '_');
    category=category.toLowerCase();

    keyword = keyword.replace(/ /g, '+');
    distance = distance.replace(/ /g, '+');

    keyword=encodeURIComponent(keyword);
    distance=encodeURIComponent(distance);

    if (distance=="")
        distance=10;
    distance=distance*1609;
    var nearbyUrl="";
    var placeCheckUrl="";
    if (selectcenter=="other"){

        place = place.replace(/ /g, '+');

        place=encodeURIComponent(place);
        console.log(place);

        placeCheckUrl="https://maps.googleapis.com/maps/api/geocode/json?address="+place+"&key="+key;
        console.log(placeCheckUrl);
        getJSON(placeCheckUrl,
            function(err, geoInfo) {
                if (err !== null) {
                    res.json({"status":"error"});
                    return;
                } else {
                    if (geoInfo.status!="OK"){
                        if (geoInfo.status=="ZERO_RESULTS"){
                            res.json({"status":"zero","data":[]});
                            return;

                        }else{
                            res.json({"status":"error"});
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
                            } else {
                                if (data.status!="OK"){
                                    if (data.status=="ZERO_RESULTS"){
                                        res.json({"status":"zero","data":[]});
                                        return;

                                    }else{
                                        res.json({"status":"error"});
                                        return;
                                    }
                                }
                                var results=data.results;
                                var nextToken=data.next_page_token;
                                res.json({"status":"OK",
                                    "data":results,
                                    "nextToken":nextToken
                                });
                                return;

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
                            return;

                        }else{
                            res.json({"status":"error"});

                            console.log("error_geo");
                            return;
                        }
                    }
                    var results=data.results;
                    var nextToken=data.next_page_token;
                    res.json({"status":"OK",
                        "data":results,
                        "nextToken":nextToken
                    });
                    return;

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
