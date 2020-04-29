
//la funció retorna una array de {map,view,toggle}
var construirCapes = {} = function(MapView,WebMap,Layer,MapImageLayer,Portal,BasemapToggle) {
    var map = new WebMap({
        basemap: "topo-vector"                  
    });
    var xcenter = 1.677472;
    var ycenter = 41.761689;
    var view = new MapView({
          container: "viewDiv",
          map: map,
          center: [xcenter, ycenter], // longitude, latitude
          //zoom: zoom,  ---> Si utilitzes com base un WebMap posa sempre el zoom inicial de tot el mapa              
          scale: zoomToScale(12)
    });
    
    var toggle = new BasemapToggle({
              view: view, // view that provides access to the map's 'topo' basemap
              nextBasemap: "satellite"  
    });      
   
    return {map,view,toggle};
}


