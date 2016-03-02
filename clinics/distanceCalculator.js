//This function is using the Haversine formula
// ref : https://en.wikipedia.org/wiki/Haversine_formula

exports.calculateDistance = function getDistanceFromLatLonInKm(latitude1,longitude1,latitude2,longitude2) {
    var earthRadius = 6371; // in km
    var dLat = deg2rad(latitude2-latitude1);
    var dLon = deg2rad(longitude2-longitude1);
    var hav =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(latitude1)) * Math.cos(deg2rad(latitude2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(hav), Math.sqrt(1-hav));
    var distance = earthRadius * c; //in km
    return convertToString(distance);
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function convertToString(distance){
    var dist = distance > 1 ? Math.round(distance * 100)/100 + ' km' : Math.round(distance * 100000)/100 + ' m';
    return  dist;
}