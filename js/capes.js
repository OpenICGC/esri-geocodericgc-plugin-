
//la funció retorna una array de {map,view,toggle}
var construirCapes = {} = function(MapView,WebMap,Layer,MapImageLayer,Portal,BasemapToggle) {
    var map = new WebMap({
        basemap: "topo-vector",  
          /*            
          portalItem: {
           id: "c0a1cb48f1684d7b8a317d3e7237bcc0",   // Dona Problema de CORS!!!!!!!!!!               
           portal: {
                 url: "https://agedev01.icgc.local/portal/"
              }
          } 
          */                                    
    });
    var xcenter = 1.677472;
    var ycenter = 41.761689;
    var view = new MapView({
          container: "viewDiv",
          map: map,
          center: [xcenter, ycenter], // longitude, latitude
          //zoom: zoom,  ---> Si utilitzes com base un WebMap posa sempre el zoom inicial de tot el mapa              
          scale: zoomToScale(zoom)
    });
    
    var toggle = new BasemapToggle({
              view: view, // view that provides access to the map's 'topo' basemap
              nextBasemap: "satellite"  
    });  
    
    // CAPA PUNTS - Tipus Map (raster)			
    var layer = new MapImageLayer({
      url: "https://agedev01.icgc.local/server/rest/services/lliscat_punts_map_dev/MapServer",
      
      sublayers: [
        {
          id:0,
        visible:true,
        definitionExpression: `id_mov = '${moviment}'`
        }
      ] 
              
    });
    map.add(layer);  
    
    
    // CAPA ARCS - Tipus Map (raster)
    var layer = new MapImageLayer({
      url: "https://agedev01.icgc.local/server/rest/services/lliscat_arcs_map_dev/MapServer",
      
      sublayers: [
        {
          id:0,
        visible:true,
        definitionExpression: `id_mov = '${moviment}'`
        }
      ] 
              
    });
    map.add(layer);  	
    
    
    // CAPA POLIGONS - Tipus Map (raster)
    var layer = new MapImageLayer({
            url: "https://agedev01.icgc.local/server/rest/services/lliscat_poligons_map_dev/MapServer",
            
      sublayers: [
        {
          id:0,
        visible:true,
        definitionExpression: `id_mov = '${moviment}'`
        }
      ] 
                            
          });
    map.add(layer); 
    return {map,view,toggle};
}


