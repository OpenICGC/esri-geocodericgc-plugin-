        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //   PART DEL CERCADOR - Cercador Pelias ICGC
        //   Cercador CustomSearch
        //   Documentacio: https://developers.arcgis.com/javascript/latest/sample-code/widgets-search-customsource/index.html
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
		
        var customSearchSource = function(Graphic,esriRequest,MapView,Search,SearchSource,geometryEngine,Point) {   
          //var url = "https://aws.icgc.cat/cerca_pelias/autocomplete";
          var url = "https://eines.icgc.cat/geocodificador/autocompletar";

          return new SearchSource({
            // Objecte SearchSource https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search-SearchSource.html
            // Property:  placeholder, getResults, getSuggestions ...
            placeholder: "example: Nou 3,girona",

            getSuggestions: function(params) {
              // Utilitza el GetSuggestionsParameters -> objecte 'params'   https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search-SearchSource.html#GetSuggestionsParameters  
              // Amb 'params' capturem el que entra l'usuari en la caixeta de cerca
              return esriRequest(url, {  
                // Utilitzem esri.request (retorna un Promise) -> https://developers.arcgis.com/javascript/latest/api-reference/esri-request.html
                // i Request options: ->  https://developers.arcgis.com/javascript/latest/api-reference/esri-request.html#RequestOptions    
                
                // GEOCODIFCADOR PELIAS: Parametres de cosulta . Ex.: https://aws.icgc.cat/cerca_pelias/autocomplete?text=nou%203%2Cblanes&layers=mun%2Caddress%2Ctopo%2Cpois%2Ccom%2Cpk&size=50
                query: {               
                  text: params.suggestTerm.replace(/ /g, "+"),
                  layers: 'topo1,topo2,address',
                  size: 5

                },
                              
                responseType: "json"

              }).then(function(results) {
                console.info(results);            
                // Exemple resposta:
                // results.data = {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[2.179517,42.369386]},"properties":{"layer":"topo","label":"Salt del Grill, Queralbs","mun":"Queralbs","topo":"Salt del Grill"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[2.181295,42.369894]},"properties":{"layer":"topo","label":"Solaneta del Salt del Grill, Queralbs","mun":"Queralbs","topo":"Solaneta del Salt del Grill"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[2.176289,42.379413]},"properties":{"layer":"topo","label":"Torrent del Salt del Grill","mun":"(null)","topo":"Torrent del Salt del Grill"}}],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}}}                  
                return results.data.features.map(function(feature) {    
                // Amb results.data.features.map...  recorre (mapeja) els arrays feature de la resposta    
                  return {
                    key: "name",
                    text: feature.properties.label,   //agafem el nom de la resposta donada per Pelias
                    sourceIndex: params.sourceIndex
                  };
                });

              });
            },
                      
            getResults: function(params) {       
              // Utilitza el getResultsHandle -> obejcte 'params'   https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search-SearchSource.html#GetResultsHandler 
              // Amb 'params' capturem el que ha escollit l'usuari despres de llistar els resultats en el droplist de la caixeta de cerca o el text que hi ha a ala caixeta i hem fet clic al botó de cerca de la caixa. 
              console.info(params);            

              var query = {};
            
              if (params.location) {
                query.lat = params.location.latitude;
                query.lon = params.location.longitude;
              } else {
                query.text = params.suggestResult.text.replace(/ /g, "+");  //fem la consulta a Pellias sobre el suggrest triat per l'usuari en el droplist. https://aws.icgc.cat/cerca_pelias/autocomplete?text=salt%20del%20grill
               // query.layers = 'mun,address,topo,pois,com,pk';
                query.layers = 'topo1,topo2,address';
                query.size = 5;              
              }  
              console.info(url);                      
                return esriRequest(url, {
                // Utilitzem esri.request (retorna un Promise) -> https://developers.arcgis.com/javascript/latest/api-reference/esri-request.html
                // i Request options: ->  https://developers.arcgis.com/javascript/latest/api-reference/esri-request.html#RequestOptions    
                
                // GEOCODIFCADOR PELIAS: Parametres de consulta (només per toponims)    
                query: query,                           
                responseType: "json"
              }).then(function(results) {
                console.info(results);                      

                // Exemple resposta:
                // results.data = {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[2.179517,42.369386]},"properties":{"layer":"topo","label":"Salt del Grill, Queralbs","mun":"Queralbs","topo":"Salt del Grill"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[2.181295,42.369894]},"properties":{"layer":"topo","label":"Solaneta del Salt del Grill, Queralbs","mun":"Queralbs","topo":"Solaneta del Salt del Grill"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[2.176289,42.379413]},"properties":{"layer":"topo","label":"Torrent del Salt del Grill","mun":"(null)","topo":"Torrent del Salt del Grill"}}],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}}}                  
                var searchResults = results.data.features.map(function(feature) {  
                // Amb results.data.features.map...  recorre (mapeja) els arrays feature de la resposta    
                
                // Pintem un punt en el mapa amb el resultat
                  var graphic = new Graphic({
                    geometry: new Point({
                      x: feature.geometry.coordinates[0],
                      y: feature.geometry.coordinates[1]
                    }),
                    attributes: feature
                  });
                  
                  var buffer = geometryEngine.geodesicBuffer(
                    graphic.geometry,
                    100,
                    "meters"
                  );

                  // Return a Search Result sobre un feature. La resposta pot ser de n features. Amb 'results.data.features.map' es recorre tot els elements resposta
                  var searchResult = {
                    extent: buffer.extent,
                    feature: graphic,                  
                    name: feature.properties.label
                  };
                  return searchResult;
                });

                // Return an array of Search Results
                // Return a Search Result
                // - Si hem fet clic en un resultat de cerca, només es fara la consulta a Pelias sobre aquest resultat i tornarà un sol resultat
                // - Si hem fet clic al botó de cerca, es fara la consulta sobre el text de la caixeta, que sol teni més d'un resultat   
                return searchResults;
              });
            }
          });
    }