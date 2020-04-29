ESRI Geocodificador ICGC plugin
========================================

Plugin que permet tenir les funcions de geocodificació en una aplicació d'ESRI utilitzant el geocodificador ICGC fet amb Pelias.

## Requeriments

Utilitzar les llibres d'ESRI.


## Ús bàsic

**Pas 1:** Al codi HTML, importar els fitxers d'ESRI i les llibreries que necessitarem

```javascript
//Widget cerca Pelias
<script type="text/javascript" src="js/cercadorPelias.js"></script>

//Llibreries ESRI
<div id="viewDiv"></div>
<script src="https://js.arcgis.com/4.14/"></script>
require([        
        "esri/Graphic",    //Per funcions relacionades amb cercador
        "esri/request",    //Per funcions relacionades amb cercador 
        "esri/views/MapView",
        "esri/widgets/Search",   //Per funcions relacionades amb cercador
        "esri/widgets/Search/SearchSource",  //Per funcions relacionades amb cercador
        "esri/geometry/geometryEngine",  //Per funcions relacionades amb cercador
        "esri/geometry/Point",  //Per funcions relacionades amb cercador
        "esri/WebMap",
        "esri/layers/Layer",
        "esri/layers/MapImageLayer",
        "esri/portal/Portal",
        "esri/widgets/BasemapToggle"
      ], function(        
        Graphic,
        esriRequest,
        MapView,
        Search,
        SearchSource,
        geometryEngine,
        Point,
        WebMap,
		    Layer,
        MapImageLayer,
        Portal,
        BasemapToggle
      )...
```

**Pas 2:** Al codi JavaScript afegir el widget del cercador.

```javascript
var searchWidget = new Search({
    view: view,
    //Geocodificador PELIAS 
    sources: [customSearchSource(Graphic,esriRequest,MapView,Search,SearchSource,geometryEngine,Point)],
              
    includeDefaultSources: false
});
// Add the search widget to the top left corner of the view        
view.ui.add(searchWidget, {
    position: "top-right"
}); 
```

**Pas 3**: Provar!

## Demo

https://openicgc.github.io/esri-geocodericgc-plugin/


