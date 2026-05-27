ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
        center: [58.008414, 56.187999],
        zoom: 10
    });

    var myPlacemark = new ymaps.Placemark([58.008414, 56.187999], {
        balloonContent: 'SkiSpot: Главный офис'
    });
    myMap.geoObjects.add(myPlacemark);

};
