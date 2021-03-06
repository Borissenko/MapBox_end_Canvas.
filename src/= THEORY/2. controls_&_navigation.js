//кнопки навигации
//https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker#getelement
let navigationControl_1 = new mapboxgl.NavigationControl()
let navigationControl_2 = new mapboxgl.NavigationControl({
  showCompass: true,
  showZoom: true
})

map.addControl(navigationControl_2, 'top-left')



//кнопка для перехода в точку, где ты сейчас находишься
//This locates the user on the map based on the browser's geolocation API.

const geolocateControl_1 = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
})

map.addControl(geolocateControl_1, "top-left")



// Включение навигации по карте при помощи КЛАВИАТУРЫ.
map.keyboard.enable()



//определить текущий zoom карты.
map.getZoom()



//ПЕРЕЛЕТ в точку
// https://docs.mapbox.com/mapbox-gl-js/example/flyto/
// https://docs.mapbox.com/mapbox-gl-js/example/center-on-symbol/

map.on('click', 'layerId', function (e) {
  map.flyTo({
    center: e.features[0].geometry.coordinates,
    zoom: 15,
    essential: true,  // this animation is considered essential(основной, по-сути) with respect to prefers-reduced-motion
  })
})





//ПЕРЕЛЕТ в квадрат карты
//а) Конвертация координат
let ll = new mapboxgl.LngLat(37.63, 55.75)        //перевод координат точки в спец.объект {lng: 37.63, lat: 55.75}
let bounds = new mapboxgl.LngLatBounds(ll_1, ll_2)   //перевод координат квадрата в спец.объект
// {
//   _ne: {lng: 37.63, lat: 55.75},
//   _sw: {lng: 37.59, lat: 55.72}
// }

bounds.isEmpty()  // Ут.


//б) Перелет
map.fitBounds(bounds, {padding: 80})

let bounds = [[32.958984, -5.353521], [43.50585, 5.615985]]  //коордитаты 2 противоположных по диагонали углов квадрата, [SouthWest, NorthEast].
let bounds = {
  _ne: {lng: 37.63974116967, lat: 55.750394234349},
  _sw: {lng: 37.5996961776984, lat: 55.724208264997}
}




//Получить координары сектора карты, который ограничен скрином броузерного окна.
function getVisiblePartOfMapCoordinates(map) {
  let coords2 = [];
  let canvas = map.getCanvas();
  let w = canvas.width;
  let h = canvas.height;
  coords2[0] = map.unproject([-50, -50]).toArray();  //unproject - returns a LngLat representing geographical coordinates that correspond to the specified pixel coordinates.
  coords2[1] = map.unproject([-50, h + 50]).toArray();
  coords2[2] = map.unproject([w + 50, h + 50]).toArray();
  coords2[3] = map.unproject([w + 50, -50]).toArray();
  let leftBottom = [coords2[0][0], coords2[0][1]];
  let topRight = [coords2[0][0], coords2[0][1]];
  coords2.forEach(item => {
    if (leftBottom[0] > item[0]) leftBottom[0] = item[0];
    if (leftBottom[1] > item[1]) leftBottom[1] = item[1];
    if (topRight[0] < item[0]) topRight[0] = item[0];
    if (topRight[1] < item[1]) topRight[1] = item[1];
  })
  
  return [leftBottom[0], leftBottom[1], topRight[0], topRight[1]]
}





// Расчет километража 1 градуса долготы и широты.
//Начало координат - пересечение Гринвича и экватора.
let {lng, lat} = map.getCenter()   // долгота, широта.
let Moscow = {lng: 37.56626254924169, lat: 55.72995530726897}

//Длинна 1 гр ДОЛГОТЫ (longitude, lng). Сильно зависит от широты нахождения.
let LongEtLan = 111321 * cos(lng)   // длинна в метрах у 1 градуса долготы, lng - широта в ГРАДУСАХ(не в радианах).
//1гр долготы на уровне Москвы (у которой lat, широта = 55.751244) = 63км/градус_долготы(lng).


//Длинна 1 гр ШИРОТЫ (latitude, lat).
let LongEtLongitude = 111319   //метров/гр_широты.






//Формула вычисления азимута на широте Москвы
var getAzimut = function (a, b) {
  var azimut = Math.atan2(b[0] - a[0], (b[1] - a[1])) * 57.295779513082
  if (azimut < 0) {
    azimut = 360 + azimut
  }
  return +azimut.toFixed(2)
}

