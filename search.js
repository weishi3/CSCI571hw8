/**
 * Created by water on 3/16/18.
 */

var submitIsClick=false;

var userLat;
var userLng;


function zoomImg(path){
    var win= window.open(path, '_blank');
    win.focus();
}




var app = angular.module('myApp', ['ngRoute', 'ngAnimate','ngSanitize']);


//app.value('$anchorScroll', angular.noop);
app.animation('.slide', ['$animateCss', function($animateCss) {
    return {
        enter: function(element) {
            // this will trigger `.slide.ng-enter` and `.slide.ng-enter-active`.
            return $animateCss(element, {
                event: 'enter',
                structural: true
            });
        }
    }
}]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'emptyInitial.html'
        })
        .when('/list', {
            templateUrl: 'list.html'
        })
        .when('/favorList', {
            templateUrl: 'favorList.html'
        })
        .when('/detail', {
            templateUrl: 'detail.html'
        })
        .otherwise({
            redirectTo: '/'
        });



}]);

//this can be called by onsubmit but cannot use scope
//function showRoute(){
//    console.log($('#routeForm').serialize());
//}

app.controller('myCtrl', function($scope,$filter,$timeout) {

    //$.ajax({
    //    url: "https://maps.googleapis.com/maps/api/geocode/json?address=LOS+ANGELES&key=AIzaSyA9B2j1QeDz4ldRWdxSzrVcMYVTJcvhZ8A",
    //    type: "GET",
    //    success: function (data) {
    //
    //    },
    //    error: function (jXHR, textStatus, errorThrown) {
    //    }
    //}); not cross domain error


    //var re = new RegExp("name" + "=([^;]+)");
    //var value = re.exec("name=mother;");
    //console.log( (value != null) ? unescape(value) : null);

   // $('[name="keyword"]').val("Hot Fuzz");ok
   //$('input[name="keyword"]').val("Hot Fuzz");ok
    //$('input[value="ini"]').val("Hot Fuzz");ok

    $("#search_box").css("background", "red");
    //document.getElementById('search_box').css("background","red");not OK
    console.log("hre2");
    //document.getElementById('search_box').style.background="red"; OK

    $scope.badStartDirection=false;
    $scope.isSubmit = false;
    $scope.currentPage = 0;
    $scope.maxPageIndex = -1;
    $scope.pageClass = 'no-Effect';
    $scope.listError=false;
    $scope.defaultStartLocation="Your location";
    $scope.travelMode=undefined;
    $scope.directionsDisplay=undefined;
    $scope.directionsService=undefined;
    $scope.panorama=undefined;
    $scope.cpSearchResultJson=undefined;
    $scope.currentPageF=0;
    $scope.cpFavors=undefined;
    $scope.favors=undefined;
    $scope.searchResultJson=undefined;
    $scope.maxPageIndexF=-1;
    $scope.highlightedBriefInfo=undefined;
    $scope.placeDetail=undefined;
    $scope.hourStr=undefined;
    $scope.otherHours=undefined;
    $scope.todayHours=undefined;
    $scope.allImages=undefined;
    $scope.highlightedPlaceId=undefined;
    $scope.starPercentStr=undefined;
    $scope.yelpReviews=undefined;
    $scope.rvs=undefined;
    $scope.iniRvs=undefined;
    $scope.rvTimes=undefined;
    $scope.iniOrderYelpReview=undefined;
    $scope.isGoogleReview=true;
    $scope.showProgressBar=false;
    $scope.submitOtherLocation=undefined;
    $scope.submitCenter=undefined;
    $scope.marker=undefined;
    $scope.userGeoOK=false;
    $scope.inputCenterOK=true;
    $scope.keywordOK=false;
    $scope.checkValue="here";
    $scope.fetchYelp=false;
    $scope.yellowHighLight="highlightedPlaceId==placeJson.place_id? {'background-color' : '#fdde95'} : {}";





    var storedPlaces = JSON.parse(localStorage.getItem("favor"));
    if (!storedPlaces){
        storedPlaces=[];
    }
    localStorage.setItem("favor", JSON.stringify(storedPlaces));
    var autocomplete1 = new google.maps.places.Autocomplete((document.getElementById('input_location')));

    //var xmlhttp = new XMLHttpRequest();
    //xmlhttp.open("GET", "http://ip-api.com/json", false); //open, send, responseText are
    //xmlhttp.send();
    ////console.log(xmlhttp.status);
    //if (xmlhttp.status == 200){
    //    var usergeo = JSON.parse(xmlhttp.responseText);
    //    var theForm, newInput1, newInput2;
    //    // Start by creating a <form>
    //    theForm = document.getElementById("form");
    //
    //    // Next create the <input>s in the form and give them names and values
    //    newInput1 = document.createElement('input');
    //    newInput1.type = 'hidden';
    //    newInput1.name = 'lat';
    //    newInput1.value = usergeo.lat;
    //    newInput2 = document.createElement('input');
    //    newInput2.type = 'hidden';
    //    newInput2.name = 'lng';
    //
    //    newInput2.value = usergeo.lon;
    //    userLat=usergeo.lat;
    //    userLng=usergeo.lon;
    //    theForm.appendChild(newInput1);
    //    theForm.appendChild(newInput2);
    //    $scope.userGeoOK=true;
    //
    //}else{
    //    $scope.userGeoOK=false;
    //}

    $.ajax({
        //url: "http://127.0.0.1:3000/iniForm",
        url: "http://ip-api.com/json",
        type: "GET",
        success: function (data) {
            var usergeo = data;
            var theForm, newInput1, newInput2;
            // Start by creating a <form>
            theForm = document.getElementById("form");

            // Next create the <input>s in the form and give them names and values
            newInput1 = document.createElement('input');
            newInput1.type = 'hidden';
            newInput1.name = 'lat';
            newInput1.value = usergeo.lat;
            newInput2 = document.createElement('input');
            newInput2.type = 'hidden';
            newInput2.name = 'lng';

            newInput2.value = usergeo.lon;
            userLat=usergeo.lat;
            userLng=usergeo.lon;
            theForm.appendChild(newInput1);
            theForm.appendChild(newInput2);
            $scope.userGeoOK=true;

        },
        error: function (jXHR, textStatus, errorThrown) {

        }
    });







    $scope.requestResult= function () {
        $scope.pageClass = 'no-Effect';
        if ($scope.isSubmit){
            $timeout(function(){
                $('#toList').click();
            });

        }else{
            $timeout(function(){
                $('#toMain').click();
            });
        }
    }
    $scope.iniFavor=function(){

        $scope.pageClass = 'no-Effect';
        $scope.favors = JSON.parse(localStorage.getItem("favor"));
        console.log($scope.favors);
        $scope.currentPageF = 0;
        $scope.maxPageIndexF =Math.ceil($scope.favors.length/20)-1;
        displayListF();

        //$timeout(function () {
        //    $('#toFavor').click();
        //});
    };

    $scope.showRoute = function () {

        console.log($scope.defaultStartLocation);
        $scope.badStartDirection=false;
        console.log($scope.highlightedBriefInfo);
        //$scope.displayRoutes=true;
        $scope.travelMode=$("#selectTravelMode").val();
        var startLocation=$("#selectStart").val();

        if (startLocation=="Your location"||startLocation=="My location"){
            startLocation= new google.maps.LatLng(userLat, userLng);
            console.log("s1");
            $scope.showRoute2(startLocation);
        }
        else{
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode( { 'address': startLocation}, function(results, status) {
                if (status == 'OK') {
                    startLocation = results[0].geometry.location;
                    console.log("s2");
                    $scope.showRoute2(startLocation);
                } else {
                    console.log("s3");
                    $scope.showRoute2(startLocation);
                }
            });

        }





    };

    $scope.showRoute2 = function (startLocation) {
        var endLocation = new google.maps.LatLng($scope.highlightedBriefInfo.geometry.location.lat, $scope.highlightedBriefInfo.geometry.location.lng);
        console.log(startLocation);
        console.log(endLocation);
        $scope.directionsService.route({
            origin: startLocation,
            destination: endLocation,
            travelMode: $scope.travelMode,
            provideRouteAlternatives:true
        }, function(response, status) {
            if (status === 'OK') {
                $scope.marker.setMap(null);
                $scope.directionsDisplay.setPanel(document.getElementById('routesPanel'));

                $scope.directionsDisplay.setDirections(response);

            } else {
                $scope.badStartDirection=true;
                console.log("hrere");
                console.log(status);
                console.log($scope.badStartDirection);
                console.log(startLocation);
                console.log(endLocation);
                $timeout(function(){
                    $('#toggleButton').click();

                });
                $timeout(function(){
                    $('#toggleButton').click();

                });
                $scope.directionsDisplay.setPanel(null);

            }
        });

    }
    $scope.toggle = function() {
        var toggle = $scope.panorama.getVisible();
        if (toggle == false) {
            $scope.panorama.setVisible(true);
            document.getElementById("toggleButton").src="testImage/Map.png";

        } else {
            $scope.panorama.setVisible(false);
            document.getElementById("toggleButton").src="testImage/Pegman.png";
        }
    };

    $scope.nextPage = function() {
        $scope.currentPage = $scope.currentPage + 1;
        displayList();
    };
    function displayList() {
        $scope.cpSearchResultJson=$scope.searchResultJson.slice($scope.currentPage*20, $scope.currentPage*20+20);
        console.log($scope.currentPage);
        console.log($scope.maxPageIndex);
        console.log($scope.cpSearchResultJson);

    }
    $scope.prevPage = function() {
        $scope.currentPage = $scope.currentPage -1;
        displayList();
    };
    $scope.nextPageF = function() {
        $scope.currentPageF = $scope.currentPageF + 1;
        displayListF();
    };
    $scope.prevPageF = function() {
        $scope.currentPageF = $scope.currentPageF -1;
        displayListF();
    };
    function displayListF() {
        $scope.cpFavors=$scope.favors.slice($scope.currentPageF*20, $scope.currentPageF*20+20);
        console.log($scope.currentPageF);
        console.log($scope.maxPageIndexF);
        console.log($scope.cpFavors);
    }




    $scope.AFavorByListIndex=function(indexJsonG) {
        var storedPlaces = JSON.parse(localStorage.getItem("favor"));

        storedPlaces[storedPlaces.length]=$scope.searchResultJson[indexJsonG];

        $scope.searchResultJson[indexJsonG]['loveOrNot']=true;
        localStorage.setItem("favor", JSON.stringify(storedPlaces));
        displayList();

    };

    $scope.RFavorByListIndex=function(indexJsonG) {
        var storedPlaces = JSON.parse(localStorage.getItem("favor"));
        var proposedId=$scope.searchResultJson[indexJsonG]['place_id'];


        //if ($scope.highlightedBriefInfo){
        //    if ($scope.highlightedBriefInfo.place_id==proposedId)
        //       console.log($scope.highlightedBriefInfo.loveOrNot);
        //
        //}

        for (var i=0;i<storedPlaces.length;i++){
            if (storedPlaces[i]['place_id']==proposedId){
                storedPlaces.splice(i, 1);
                $scope.searchResultJson[indexJsonG]['loveOrNot']=false;
                break;
            }
        }
        localStorage.setItem("favor", JSON.stringify(storedPlaces));
        displayList();

        //if ($scope.highlightedBriefInfo){
        //    if ($scope.highlightedBriefInfo.place_id==proposedId)
        //        console.log($scope.highlightedBriefInfo.loveOrNot);
        //
        //}


    };

    $scope.AFavorInDetail=function() {
        var storedPlaces = JSON.parse(localStorage.getItem("favor"));

        $scope.highlightedBriefInfo.loveOrNot=true;
        storedPlaces[storedPlaces.length]=$scope.highlightedBriefInfo;
        localStorage.setItem("favor", JSON.stringify(storedPlaces));

        //console.log($scope.highlightedBriefInfo.loveOrNot);
        //console.log($scope.highlightedBriefInfo['loveOrNot']);

        $scope.favors = JSON.parse(localStorage.getItem("favor"));
        $scope.maxPageIndexF =Math.ceil($scope.favors.length/20)-1;
        displayListF();

        var proposedId=$scope.highlightedBriefInfo['place_id'];
        if ($scope.searchResultJson){
            for (var i=0;i<$scope.searchResultJson.length;i++){
                if ($scope.searchResultJson[i]['loveOrNot']==true) continue;
                var toCheckId= $scope.searchResultJson[i]['place_id'];
                if (toCheckId==proposedId){
                    $scope.searchResultJson[i]['loveOrNot']=true;
                    break;
                }


            }

            displayList();

        }

    };

    $scope.RFavorInDetail=function() {
        var storedPlaces = JSON.parse(localStorage.getItem("favor"));
        var proposedId=$scope.highlightedBriefInfo['place_id'];
        for (var i=0;i<storedPlaces.length;i++){
            if (storedPlaces[i]['place_id']==proposedId){
                storedPlaces.splice(i, 1);
                $scope.highlightedBriefInfo.loveOrNot=false;
                break;
            }
        }
        //console.log($scope.highlightedBriefInfo.loveOrNot);
        //console.log($scope.highlightedBriefInfo['loveOrNot']);

        localStorage.setItem("favor", JSON.stringify(storedPlaces));
        $scope.favors = JSON.parse(localStorage.getItem("favor"));
        $scope.maxPageIndexF =Math.ceil($scope.favors.length/20)-1;
        if ( $scope.currentPageF> $scope.maxPageIndexF)
            $scope.currentPageF = $scope.currentPageF -1;
        if ($scope.currentPageF<0)
            $scope.currentPageF=0;
        displayListF();

        if ($scope.searchResultJson){
            for (var i=0;i<$scope.searchResultJson.length;i++){
                if ($scope.searchResultJson[i]['loveOrNot']==false) continue;
                var toCheckId= $scope.searchResultJson[i]['place_id'];
                if (toCheckId==proposedId){
                    $scope.searchResultJson[i]['loveOrNot']=false;
                    break;
                }


            }

            displayList();

        }

    };
    $scope.RFavor = function(indexJsonG) {

        console.log($scope.searchResultJson);
        console.log($scope.cpSearchResultJson);//bad
        var storedPlacesR = JSON.parse(localStorage.getItem("favor"));

        var removedPlaceId=storedPlacesR[indexJsonG]['place_id'];

        storedPlacesR.splice(indexJsonG, 1);
        localStorage.setItem("favor", JSON.stringify(storedPlacesR));
        $scope.favors = JSON.parse(localStorage.getItem("favor"));
        //$scope.currentPageF = 0;
        $scope.maxPageIndexF =Math.ceil($scope.favors.length/20)-1;
        if ( $scope.currentPageF> $scope.maxPageIndexF)
            $scope.currentPageF = $scope.currentPageF -1;
        if ($scope.currentPageF<0)
            $scope.currentPageF=0;
        displayListF();

        if ($scope.searchResultJson){
            for (var i=0;i<$scope.searchResultJson.length;i++){
                if ($scope.searchResultJson[i]['loveOrNot']==false) continue;
                var toCheckId= $scope.searchResultJson[i]['place_id'];
                if (toCheckId==removedPlaceId){
                    $scope.searchResultJson[i]['loveOrNot']=false;
                    break;
                }


            }

            displayList();

        }

        if ($scope.highlightedBriefInfo){
            if ($scope.highlightedBriefInfo.place_id==removedPlaceId)
                $scope.highlightedBriefInfo.loveOrNot=false;

        }
        //$scope.highlightedPlaceId=undefined;


        //why not same?

    };


    $scope.getNumber = function(num) {
        var x=new Array();
        for(var i=0;i<num;i++){ x.push(i+1); }//can not be same
        return x;
    }

    $scope.setAniClassDetail=function(jsonPick){


        $scope.hourStr=undefined;
        $scope.yelpError=false;
        $scope.placeDetail=undefined;
        $scope.pageClass = 'no-effect';
        $scope.showProgressBar=true;
        $scope.highlightedBriefInfo=undefined;
        $scope.highlightedPlaceId=undefined;
        $scope.todayHours=undefined;
        $scope.otherHours=undefined;
        $scope.rvs=undefined;
        $scope.iniRvs=undefined;
        $scope.rvTimes=undefined;
        $scope.starPercentStr=undefined;
        $scope.allImages=undefined;
        //$('#toMainFrom ').click();k();
        //$timeout(function(){
        //    $('#toMain').click();
        //});
        //

        var placeId=jsonPick.place_id;
        console.log(placeId);

        var request = {
            placeId: placeId
        };

        var map = new google.maps.Map(document.getElementById('getDetailPseudoMap'), {
            center: {lat: userLat, lng: userLng},
            zoom: 15
        });

        var service = new google.maps.places.PlacesService(map);
        $scope.highlightedBriefInfo=jsonPick;
        service.getDetails(request, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {



                $scope.placeDetail=place;

                console.log($scope.placeDetail);
                var open_hours=$scope.placeDetail.opening_hours;
                if(open_hours){
                   // moment().utcOffset($scope.placeDetail.utc_offset);
                    var d = moment().utcOffset($scope.placeDetail.utc_offset).day()-1;
                    console.log(d);
                    if (d==-1) d=6;
                    if (open_hours.open_now){
                        //open now sunday error
                        //Sunday as 0 and Saturday as 6.
                        $scope.hourStr="Open now:";
                        console.log(d);
                        console.log(open_hours.weekday_text[d]);
                        $scope.hourStr+= open_hours.weekday_text[d].split(": ")[1];
                    }else{
                        $scope.hourStr="Closed";
                    }
                    $scope.todayHours=open_hours.weekday_text[d];
                    $scope.otherHours=open_hours.weekday_text;
                    //change weekday_text not important
                    $scope.otherHours.splice(d, 1);


                }
               //how about best match can find but without review look like[]
               // don't need as my server would send back at least []
               // $scope.yelpReviews=[];
                $scope.rvs=$scope.placeDetail.reviews;
                $scope.iniRvs=$scope.placeDetail.reviews;
                if (!$scope.rvs){
                    $scope.rvs=[];
                }

                $scope.rvTimes=[];
                var tempTime;
                for (var i=0;i<$scope.rvs.length;i++){

                    tempTime= moment($scope.rvs[i].time*1000).format("YYYY-MM-DD HH:mm:ss");
                    console.log(tempTime);
                    $scope.rvTimes.push(tempTime);
                }



                //OK
                if ($scope.placeDetail.rating)
                    $scope.starPercentStr= Math.floor($scope.placeDetail.rating*20)+"%";

                $scope.pageClass = 'page-detail';
                $('#toDetail').click();

                $scope.showProgressBar=false;
                $scope.highlightedPlaceId=placeId;

                $scope.allImages=[];
                $scope.allImages.push("");
                $scope.allImages.push("");
                $scope.allImages.push("");
                $scope.allImages.push("");
                if ($scope.placeDetail.photos){


                    var colNum=0;
                    for (var i=0;i<$scope.placeDetail.photos.length;i++){
                        var tempUrl=$scope.placeDetail.photos[i].getUrl({'maxWidth': 1600, 'maxHeight': 1600});
                        $scope.allImages[colNum] += '<img src="'+tempUrl+'" style="width:100%" onclick="zoomImg(\''+tempUrl+'\');">';
                        colNum=(colNum+1)%4;

                    }


                }
                //

                var yelpName=$scope.placeDetail.name;
                var yelpFormattedAddress=$scope.placeDetail.formatted_address.split(", ");




                var yelpCountry="US";
                var po_st=yelpFormattedAddress[yelpFormattedAddress.length-2].split(" ");
                var yelpState=po_st[0];
                var yelpPostalCode=po_st[1];
                var yelpCity=yelpFormattedAddress[yelpFormattedAddress.length-3];

                $scope.yelpReviews=[];
                $scope.iniOrderYelpReview=[];

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
                console.log(JSON.stringify(infoForYelp));
                $scope.fetchYelp=true;


                $.ajax({
                    url: "http://127.0.0.1:3000/yelp",
                    //url: "http://miraclewater.us-east-2.elasticbeanstalk.com/yelp",
                    type: "GET",
                    data: infoForYelp,
                    success: function (data) {
                        $scope.fetchYelp=false;
                        if (data.status=="OK"){
                            $scope.yelpReviews=data.data;
                            $scope.iniOrderYelpReview=data.data;
                            $scope.yelpError=false;
                            console.log($scope.yelpReviews);

                        }else{
                            $scope.yelpError=true;
                            $scope.yelpReviews=[];
                            $scope.iniOrderYelpReview=[];
                        }


                    },
                    error: function (jXHR, textStatus, errorThrown) {
                        $scope.fetchYelp=false;
                        $scope.yelpError=true;
                        $scope.yelpReviews=[];
                        $scope.iniOrderYelpReview=[];
                    }
                });




            }else{
                console.log(status);
                $scope.pageClass = 'page-detail';
                $('#toDetail').click();
                $scope.highlightedPlaceId=placeId;
                $scope.showProgressBar=false;
            }
        });



    };


    $scope.initDetail = function () {
        if ($scope.placeDetail){
            var tweetIniUrl="https://twitter.com/intent/tweet?text=";
            var tweetText="Check out "+$scope.placeDetail.name+" located at "+$scope.placeDetail.formatted_address+".";
            tweetText+=" Website: ";
            tweetText=encodeURIComponent(tweetText);
            tweetIniUrl+=tweetText;
            tweetIniUrl+="&url="
            var tweetUrl;
            if ($scope.placeDetail.website){
                tweetUrl=encodeURIComponent($scope.placeDetail.website);
            }else{
                tweetUrl=encodeURIComponent($scope.placeDetail.url);
            }
            tweetIniUrl+=tweetUrl;
            tweetIniUrl+="&hashtags=";
            tweetIniUrl+="TravelAndEntertainmentSearch";



            document.getElementById("tweetContainer").href=tweetIniUrl;
            document.getElementById("tweetImage").style.opacity=1;
            document.getElementById("tweetImage").style.cursor="pointer";

        }




    };
    $scope.changeTab = function(newTab){
        if (newTab==1){
            //console.log($scope.allImages[0]);
            //console.log();
            if ($scope.placeDetail){
                document.getElementById("column10").innerHTML=$scope.allImages[0];
                document.getElementById("column11").innerHTML=$scope.allImages[1];
                document.getElementById("column12").innerHTML=$scope.allImages[2];
                document.getElementById("column13").innerHTML=$scope.allImages[3];

            }


        }
        if (newTab==2){
            $scope.checkFrom=$scope.defaultStartLocation;
            $scope.badStartDirection=false;
            var autocomplete2 = new google.maps.places.Autocomplete((document.getElementById('selectStart')));
            $scope.directionsService = new google.maps.DirectionsService;
            $scope.directionsDisplay = new google.maps.DirectionsRenderer;


            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center:$scope.highlightedBriefInfo.geometry.location
                //center: $scope.placeDetail.geometry.location
            });
            $scope.directionsDisplay.setMap(map);
            $scope.marker = new google.maps.Marker({
                map: map,
                position: $scope.highlightedBriefInfo.geometry.location
            });
            $scope.panorama = map.getStreetView();
            $scope.panorama.setPosition($scope.highlightedBriefInfo.geometry.location);
            $scope.panorama.setPov(/** @type {google.maps.StreetViewPov} */({
                heading: 265,
                pitch: 0
            }));
        }

        if (newTab==3){
            $scope.isGoogleReview=true;
        }
        //$scope.tab = newTab;
    };

    $scope.setGoogleReview = function(text){
        document.getElementById('gOY').innerHTML=text;
    };

    $scope.toListFromDetail = function(text){
        $scope.pageClass = 'page-list';
        if (document.getElementById("pills-result-tab").className.includes("active")){
            $timeout(function(){
                $('#toList').click();
            });
        }
        else{
            $timeout(function(){
                $('#toFavor').click();
            });

        }


    };
    $scope.toDetailFromList = function(text){
        $scope.pageClass = 'page-detail';
        $timeout(function(){
            $('#toDetail').click();
        });





    };

    $scope.setOrder = function(text){

        document.getElementById('sortButton').innerHTML=text;
        if (text=="Default Order"){
            if ($scope.rvs.length)
                $scope.rvs = $scope.iniRvs;
            if ($scope.yelpReviews.length)
                $scope.yelpReviews = $scope.iniOrderYelpReview;

        }else if(text=="Highest Rating"){
            if ($scope.rvs.length)
                $scope.rvs = $filter('orderBy')($scope.rvs, '-rating');
            if ($scope.yelpReviews.length)
                $scope.yelpReviews = $filter('orderBy')($scope.yelpReviews, '-rating');
        }
        else if(text=="Lowest Rating"){
            if ($scope.rvs.length)
                $scope.rvs = $filter('orderBy')($scope.rvs, 'rating');
            if ($scope.yelpReviews.length)
                $scope.yelpReviews = $filter('orderBy')($scope.yelpReviews, 'rating');

        }else if(text=="Most Recent"){
            if ($scope.rvs.length)
                $scope.rvs = $filter('orderBy')($scope.rvs, '-time');
            if ($scope.yelpReviews.length)
                $scope.yelpReviews = $filter('orderBy')($scope.yelpReviews, '-time_created');

        }else{
            if ($scope.rvs.length)
                $scope.rvs = $filter('orderBy')($scope.rvs, 'time');
            if ($scope.yelpReviews.length)
                $scope.yelpReviews = $filter('orderBy')($scope.yelpReviews, 'time_created');
        }

        $scope.rvTimes=[];
        var tempTime;
        for (var i=0;i<$scope.rvs.length;i++){

            tempTime= moment($scope.rvs[i].time*1000).format("YYYY-MM-DD HH:mm:ss");
            console.log(tempTime);
            $scope.rvTimes.push(tempTime);
        }
    };










    $scope.clear = function () {


        $scope.badStartDirection=false;

        $scope.isSubmit = false;
        $scope.currentPage = 0;
        $scope.maxPageIndex = -1;
        $scope.pageClass = 'no-Effect';
        $scope.listError=false;
        $scope.defaultStartLocation="Your location";
        $scope.travelMode=undefined;
        $scope.directionsDisplay=undefined;
        $scope.directionsService=undefined;
        $scope.panorama=undefined;
        $scope.cpSearchResultJson=undefined;
        $scope.currentPageF=0;
        $scope.cpFavors=undefined;
        $scope.favors=undefined;
        $scope.searchResultJson=undefined;
        $scope.maxPageIndexF=-1;

        $scope.placeDetail=undefined;
        $scope.hourStr=undefined;
        $scope.otherHours=undefined;
        $scope.todayHours=undefined;
        $scope.allImages=undefined;
        $scope.highlightedBriefInfo=undefined;
        $scope.highlightedPlaceId=undefined;
        $scope.starPercentStr=undefined;
        $scope.yelpReviews=undefined;
        $scope.rvs=undefined;
        $scope.iniRvs=undefined;
        $scope.rvTimes=undefined;
        $scope.iniOrderYelpReview=undefined;
        $scope.isGoogleReview=true;

        $scope.showProgressBar=false;
        $scope.submitOtherLocation=undefined;
        $scope.submitCenter=undefined;
        $scope.marker=undefined;
        //$scope.userGeoOK=false;
        $scope.inputCenterOK=true;
        $scope.keywordOK=false;
        $scope.checkValue="here";
        $scope.fetchYelp=false;


        var me=document.getElementById('keyword');
        document.getElementById('keywordAlert').style.display='none';
        me.style.border="1px solid gray";
        me.style.outline="initial";


        me=document.getElementById('input_location');
        document.getElementById('input_locationAlert').style.display='none';
        me.style.border="1px solid gray";
        me.style.outline="initial";

        $timeout(function(){
            $('#pills-result-tab').click();
        });

    }

    $scope.mySubmitFunction = function () {

        $scope.badStartDirection=false;
        $scope.fetchYelp=false;
        $scope.isSubmit = false;
        $scope.currentPage = 0;
        $scope.maxPageIndex = -1;
        $scope.pageClass = 'no-Effect';
        $scope.listError=false;
        $scope.defaultStartLocation="Your location";
        $scope.travelMode=undefined;
        $scope.directionsDisplay=undefined;
        $scope.directionsService=undefined;
        $scope.panorama=undefined;
        $scope.cpSearchResultJson=undefined;
        $scope.currentPageF=0;
        $scope.cpFavors=undefined;
        $scope.favors=undefined;
        $scope.searchResultJson=undefined;
        $scope.maxPageIndexF=-1;

        $scope.placeDetail=undefined;
        $scope.hourStr=undefined;
        $scope.otherHours=undefined;
        $scope.todayHours=undefined;
        $scope.allImages=undefined;
        $scope.highlightedBriefInfo=undefined;
        $scope.highlightedPlaceId=undefined;
        $scope.starPercentStr=undefined;
        $scope.yelpReviews=undefined;
        $scope.rvs=undefined;
        $scope.iniRvs=undefined;
        $scope.rvTimes=undefined;
        $scope.iniOrderYelpReview=undefined;
        $scope.isGoogleReview=true;

        $scope.showProgressBar=false;
        $scope.submitOtherLocation=undefined;
        $scope.submitCenter=undefined;
        $scope.marker=undefined;

        //NOT SAME AS CLEAR
        //$scope.userGeoOK=false;
        $scope.inputCenterOK=true;
        $scope.keywordOK=true;
        //$scope.checkValue="here";

            //record what place have submited


                $scope.showProgressBar=true;
                //$('#toMainFrom ').click();
                $timeout(function(){
                    $('#toMain').click();
                });
                $scope.submitOtherLocation= $("#input_location").val();
                $scope.submitCenter= $('input[name=selectcenter]:checked', '#form').val();
                if ($scope.submitCenter=="here"){
                    $scope.defaultStartLocation="Your location";
                }else{
                    $scope.defaultStartLocation=$scope.submitOtherLocation;
                }
                $.ajax({
                    url: "http://127.0.0.1:3000/iniForm",
                    //url: "http://miraclewater.us-east-2.elasticbeanstalk.com/iniForm",
                    type: "GET",
                    data: $('#form').serialize(),
                    success: function (data) {
                        console.log( $('#form').serialize());
                        $scope.isSubmit=true;
                        $scope.currentPage = 0;
                        if (data.status=="error"){
                            $scope.listError=true;
                            $scope.maxPageIndex=0;
                        }else if (data.status=="partial"){
                            $scope.listError=true;
                            $scope.maxPageIndex=data.lastIndex;
                            $scope.searchResultJson=data.data;
                            for (var i=0;i<$scope.searchResultJson.length;i++){
                                $scope.searchResultJson[i]['loveOrNot']=false;
                                // $scope.searchResultJson[i]['starColor']="black";
                                var toCheckId= $scope.searchResultJson[i]['place_id'];
                                //storeP to $scope.
                                var storedP = JSON.parse(localStorage.getItem("favor"));

                                for (var j=0;j<storedP.length;j++){
                                    if (storedP[j]['place_id']==toCheckId){
                                        $scope.searchResultJson[i]['loveOrNot']=true;
                                        // $scope.searchResultJson[i]['starColor']="gold";
                                        break;
                                    }
                                }

                            }
                            displayList();
                        }else{
                            $scope.searchResultJson=data.data;
                            for (var i=0;i<$scope.searchResultJson.length;i++){
                                $scope.searchResultJson[i]['loveOrNot']=false;
                                // $scope.searchResultJson[i]['starColor']="black";
                                var toCheckId= $scope.searchResultJson[i]['place_id'];
                                //storeP to $scope.
                                var storedP = JSON.parse(localStorage.getItem("favor"));

                                for (var j=0;j<storedP.length;j++){
                                    if (storedP[j]['place_id']==toCheckId){
                                        $scope.searchResultJson[i]['loveOrNot']=true;
                                        // $scope.searchResultJson[i]['starColor']="gold";
                                        break;
                                    }
                                }

                            }
                            $scope.maxPageIndex=Math.ceil($scope.searchResultJson.length/20)-1;
                            displayList();
                        }





                        //assume have at least three columns data



                        $('#pills-result-tab').click();
                        $scope.showProgressBar=false;
                    },
                    error: function (jXHR, textStatus, errorThrown) {
                        $scope.listError=true;
                        $scope.isSubmit=true;
                        $('#pills-result-tab').click();
                        $scope.showProgressBar=false;


                        $scope.currentPage = 0;
                        $scope.maxPageIndex=0;

                    }
                });



            return false;



    };



    $scope.detect_inputLocationK= function () {
        console.log("trug");
        var me=document.getElementById('input_location');
        var result = document.querySelector('input[name="selectcenter"]:checked').value;
        if( (me.value.trim()==""&&me.value!="" && result=="other" )){
            document.getElementById('input_locationAlert').style.display='inline';
            me.style.border=" 1px solid red";
            me.style.outline=" 1px solid red";
            $scope.inputCenterOK=false;
        }
        else{
            document.getElementById('input_locationAlert').style.display='none';
            me.style.border="1px solid gray";
            me.style.outline="initial";
            $scope.inputCenterOK=true;
        }
        if (me.value=="" && result=="other"){
            $scope.inputCenterOK=false;
        }

    };
    $scope.detect_inputLocationB= function () {
        var me=document.getElementById('input_location');
        var result = document.querySelector('input[name="selectcenter"]:checked').value;
        if( (me.value.trim()=="" && result=="other" )){
            document.getElementById('input_locationAlert').style.display='inline';
            me.style.border=" 1px solid red";
            me.style.outline=" 1px solid red";
            $scope.inputCenterOK=false;
        }
        else{
            document.getElementById('input_locationAlert').style.display='none';
            me.style.border="1px solid gray";
            me.style.outline="initial";
            $scope.inputCenterOK=true;
        }
    };
    $scope.detectKeywordK= function () {
        var me=document.getElementById('keyword');
        if( (me.value.trim()=="" &&me.value!="") ){
            document.getElementById('keywordAlert').style.display='inline';
            me.style.border=" 1px solid red";
            me.style.outline=" 1px solid red";
            $scope.keywordOK=false;
        }
        else{
            document.getElementById('keywordAlert').style.display='none';
            me.style.border="1px solid gray";
            me.style.outline="initial";
            $scope.keywordOK=true;
        }
        if (me.value==""){
            $scope.keywordOK=false;
        }
    };

    $scope.detectKeywordB= function () {
        var me=document.getElementById('keyword');
        if( (me.value.trim()=="") ){
            document.getElementById('keywordAlert').style.display='inline';
            me.style.border=" 1px solid red";
            me.style.outline=" 1px solid red";
            $scope.keywordOK=false;

        }
        else{
            document.getElementById('keywordAlert').style.display='none';
            me.style.border="1px solid gray";
            me.style.outline="initial";
            $scope.keywordOK=true;

        }
    };
    $scope.findselected= function (){
        console.log("r");
        var result = document.querySelector('input[name="selectcenter"]:checked').value;
        if(result=="other"){

            document.getElementById("input_location").removeAttribute('disabled');
            $scope.detect_inputLocationK();
        }
        else{
            document.getElementById("input_location").setAttribute('disabled', true);
            document.getElementById("input_location").value="";
             $scope.detect_inputLocationK();

        }

    }



});

//ngChange not work?
//onchange must put findselected outside controller

//function findselected() {
//    console.log("r");
//    var result = document.querySelector('input[name="selectcenter"]:checked').value;
//    if(result=="other"){
//
//        document.getElementById("input_location").removeAttribute('disabled');
//    }
//    else{
//        document.getElementById("input_location").setAttribute('disabled', true);
//        document.getElementById("input_location").value="";
//        var me=document.getElementById('input_location');
//        me.style.border="1px solid gray";
//        me.style.outline="initial";
//
//    }
//
//}


