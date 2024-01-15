import { Map, View } from 'ol';
import * as customCRS from '../openlayers/CustomCRS.js';
import {
  Vector as VectorSource,
  ImageWMS as ImageWMSSource,
  XYZ as XYZSource,
  OSM as OSMSource,
  Raster as RasterSource,
  TileJSON as TileJSONSource,
} from 'ol/source.js';
import { Vector as VectorLayer, Tile as TileLayer, Group as LayerGroup, Image as ImageLayer } from 'ol/layer.js';
import { Style, Icon, Stroke, Circle, Fill, Text } from 'ol/style.js';
import { GeoJSON } from 'ol/format.js';
import { LineString, Geometry, Polygon, Point } from 'ol/geom.js';
import { Feature } from 'ol';
import { Draw } from 'ol/interaction';
import { WKB } from 'ol/format.js';

import ol_interaction_Hover from 'ol-ext/interaction/Hover.js';
import ol_source_IDW from 'ol-ext/source/IDW.js';

const runMap = () => {
  // var map;
  const map = new Map({
    target: 'map',
    view: new View({
      projection: 'EPSG:4326',
      // projection: customCRS.addCustomCrs('EPSG:5899'),

      minZoom: 5,
      maxZoom: 22,
    }),
  });

  var format = 'image/png';
  var degreeBounds = [107.667, 15.228, 108.804, 16.197];
  // const meterBounds = [576281.1063905563, 1720086.1249637157, 580872.2309828001, 1724335.9856269273];
  const maxMeterBounds = [556421, 1702209, 604820, 1739026];
  // var TKmeterBounds = [548539.1168823242187500, 1719723.5018920898437500, 554086.7171020507812500, 1724261.0479125976562500];
  const maptilerKey = 'FaZvqSsyUcg9u0pnhR97';
  // ---------------------------------
  // ----------Map Layer--------------
  // ---------------------------------
  var baseLayerGroup = new LayerGroup({
    title: 'Base layers',
    // openInLayerSwitcher: true,
    layers: [
      new TileLayer({
        title: 'Google Map',
        baseLayer: true,
        preload: Infinity,
        type: 'base',
        visible: false,
        source: new XYZSource({
          url: 'https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga',
          crossOrigin: 'anonymous',
        }),
      }),

      new TileLayer({
        preload: Infinity,
        title: 'Toner',
        baseLayer: true,
        visible: false,
        source: new TileJSONSource({
          url: `https://api.maptiler.com/maps/toner-v2/tiles.json?key=${maptilerKey}`, // source URL
          tileSize: 512,
          attributions: [],
          attributionsCollapsible: false,
          crossOrigin: 'anonymous',
        }),
      }),
      new TileLayer({
        preload: Infinity,
        baseLayer: true,
        source: new OSMSource({
          attributions: [],
          attributionsCollapsible: false,
        }),
        visible: false,
        title: 'Open Street Map',
      }),
      new TileLayer({
        title: 'Topo Map',
        baseLayer: true,
        preload: Infinity,
        type: 'base',
        visible: false,
        source: new TileJSONSource({
          url: `https://api.maptiler.com/maps/topo-v2/tiles.json?key=${maptilerKey}`, // source URL
          tileSize: 512,
          attributions: [],
          attributionsCollapsible: false,
          crossOrigin: 'anonymous',
        }),
      }),
      new TileLayer({
        title: 'Streets Map',
        baseLayer: true,
        preload: Infinity,
        type: 'base',
        visible: true,
        source: new TileJSONSource({
          url: `https://api.maptiler.com/maps/streets-v2/tiles.json?key=${maptilerKey}`, // source URL
          tileSize: 512,
          attributions: [],
          attributionsCollapsible: false,
          crossOrigin: 'anonymous',
        }),
      }),
      new TileLayer({
        baseLayer: true,
        visible: false,
        title: 'No Basemap',
      }),
    ],
  });

  var mainLayerGroup = new LayerGroup({
    title: 'Main layers',
    layers: [
      new VectorLayer({
        title: 'Hồ chứa layer',
        preview: '/src/assets/luffy-chilling-gear5-round.png',
        // preview: 'F:/Programming project/Personal/web-gis-dev/front-end/src/assets/luffy-chilling-gear5-round.png',
        source: new VectorSource({
          // url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3Aho_dieu_hoa&outputFormat=application%2Fjson',
          url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3Aho_chua_quang_nam_EPSG4326&outputFormat=application%2Fjson',
          format: new GeoJSON(),
        }),
        style: new Style({
          stroke: new Stroke({
            color: 'white',
            width: 1,
          }),
          fill: new Fill({
            color: '#1ca9c9',
          }),
        }),
      }),
    ],
  });

  map.addLayer(baseLayerGroup);
  map.addLayer(mainLayerGroup);
  // map.getView().fit(meterBounds, map.getSize());
  map.getView().fit(degreeBounds, map.getSize());

  var hover = new ol_interaction_Hover({ cursor: 'pointer' });
  map.addInteraction(hover);

  const measureVector = new VectorLayer({
    title: 'Measure layer',
    // source: measureSource,
    // style: function (feature) {
    //   return measureStyleFunction(feature, true);
    // },
  });
  map.addLayer(measureVector);

  return map;
};

export default runMap;
