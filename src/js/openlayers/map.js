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
import { Style, Icon, Stroke, Circle, Fill, Text, RegularShape, Image } from 'ol/style.js';
import { GeoJSON } from 'ol/format.js';
import { ZoomSlider, ScaleLine, defaults as defaultControls } from 'ol/control.js';
import Overlay from 'ol/Overlay.js';
import { Draw, Modify, Snap, Select } from 'ol/interaction.js';
import { doubleClick as doubleClickMapEvent } from 'ol/events/condition.js';
import { MultiPoint } from 'ol/geom.js';

import ol_interaction_Hover from 'ol-ext/interaction/Hover.js';
import ol_control_Legend from 'ol-ext/control/Legend.js';
import ol_legend_Legend from 'ol-ext/legend/Legend.js';
import ol_control_CanvasTitle from 'ol-ext/control/CanvasTitle.js';
import ol_control_PrintDialog from 'ol-ext/control/PrintDialog.js';
import ol_control_CanvasScaleLine from 'ol-ext/control/CanvasScaleLine.js';
import ol_interaction_ModifyTouch from 'ol-ext/interaction/ModifyTouch.js';

import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

import hoChuaLegendImage from '@/assets/legend-image/ho-chua.png';

const runMap = () => {
  // var map;
  // const GEOSERVER_DOMAIN = 'http://aqtran.name.vn:8080';
  // const GEOSERVER_DOMAIN = 'https://geo.tamky.click';
  const GEOSERVER_DOMAIN = 'http://localhost:8080';
  const GEOSERVER_WORKSPACE = 'webgis_dev';
  const map = new Map({
    target: 'map',
    view: new View({
      // projection: 'EPSG:4326',
      projection: customCRS.addCustomCrs('EPSG:5899'),

      minZoom: 5,
      maxZoom: 22,
    }),
  });
  const zoomslider = new ZoomSlider();
  map.addControl(zoomslider);

  var format = 'image/png';
  var degreeBounds = [107.667, 15.228, 108.804, 16.197]; // 4326
  // const meterBounds = [576281.1063905563, 1720086.1249637157, 580872.2309828001, 1724335.9856269273]; // 5899
  const meterBounds = [509147, 1686198, 603668, 1766721]; // 5899

  // const meterBounds = [576281.1063905563, 1720086.1249637157, 580872.2309828001, 1724335.9856269273];
  // const maxMeterBounds = [556421, 1702209, 604820, 1739026];
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
        dbName: 'ho_chua_quang_nam_epsg5899',
        preview: '/src/assets/luffy-chilling-gear5-round.png',
        // preview: 'F:/Programming project/Personal/web-gis-dev/front-end/src/assets/luffy-chilling-gear5-round.png',
        source: new VectorSource({
          // url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3Aho_dieu_hoa&outputFormat=application%2Fjson',
          // url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3Aho_chua_quang_nam_EPSG5899&outputFormat=application%2Fjson',
          url:
            GEOSERVER_DOMAIN +
            '/geoserver/thuy_loi_quang_nam/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=thuy_loi_quang_nam%3Aho_chua_quang_nam_epsg5899&outputFormat=application%2Fjson',
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

      new VectorLayer({
        title: 'Kênh layer',
        dbName: 'kenh',
        source: new VectorSource({
          // url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3Akenh&outputFormat=application%2Fjson',
          // url:
          //   GEOSERVER_DOMAIN +
          //   '/geoserver/thuy_loi_quang_nam/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=thuy_loi_quang_nam%3Akenh&outputFormat=application%2Fjson',
          url:
            GEOSERVER_DOMAIN +
            '/geoserver/thuy_loi_quang_nam/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=thuy_loi_quang_nam%3Akenh&outputFormat=application%2Fjson',
          format: new GeoJSON(),
        }),
        style: new Style({
          stroke: new Stroke({
            color: '#00ab5b',
            // lineDash: [10, 10],
            width: 2,
          }),
        }),
      }),

      new VectorLayer({
        title: 'Cửa xả layer',
        dbName: 'cuaxa',
        source: new VectorSource({
          // url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3Acua_xa&outputFormat=application%2Fjson',
          // url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3Acua_xa_postgresql&outputFormat=application%2Fjson',
          url:
            GEOSERVER_DOMAIN +
            '/geoserver/thuy_loi_quang_nam/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=thuy_loi_quang_nam%3Acuaxa&outputFormat=application%2Fjson',
          format: new GeoJSON(),
        }),
        style: new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({
              color: '#ffa500',
            }),
            stroke: new Stroke({
              color: 'white',
              width: 1,
            }),
          }),
        }),
      }),
    ],
  });

  map.addLayer(baseLayerGroup);
  map.addLayer(mainLayerGroup);
  // map.getView().fit(meterBounds, map.getSize());
  map.getView().fit(meterBounds, map.getSize());

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

  // ---------------------------------
  // ----------Layer legend--------------------------------------------------------------------------------------------------------
  // ---------------------------------
  // map.addControl(new ol_control_CanvasAttribution({ canvas: true }));
  // map.addControl(
  //   new ol_control_CanvasTitle({
  //     title: 'my title',
  //     visible: false,
  //     style: new Style({
  //       text: new Text({ font: '20px "Lucida Grande",Verdana,Geneva,Lucida,Arial,Helvetica,sans-serif' }),
  //     }),
  //   }),
  // );

  var legend = new ol_legend_Legend({
    title: 'Chú thích',
    margin: 5,
    maxWidth: 300,
    items: [
      {
        title: 'Hồ chứa',
        typeGeom: 'Point',
        style: new Style({
          image: new Icon({
            anchor: [0.5, 15],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            // src: new URL('/src/assets/legend-image/ho-chua.png', import.meta.url),
            src: hoChuaLegendImage,

            scale: 0.5,
          }),
        }),
      },
      {
        title: 'Đập',
        typeGeom: 'Point',
        style: new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({
              color: '#ffa500',
            }),
            stroke: new Stroke({
              color: 'white',
              width: 1,
            }),
          }),
        }),
      },
      {
        title: 'Kênh',
        typeGeom: 'LineString',
        style: new Style({
          stroke: new Stroke({
            color: '#00ab5b',
            // lineDash: [10, 10],
            width: 2,
          }),
        }),
      },
    ],
  });

  var legendCtrl = new ol_control_Legend({
    target: document.getElementById('none'),
    legend: legend,
    // collapsed: false,
  });
  // legend.addItem({});
  // legend.addItem({ t, height: 8 });
  // legend.addItem({ properties: { pop: 1000000 }, typeGeom: 'Point', height: 8 });
  // legend.addItem({ title: '100.000', properties: { pop: 100000 }, typeGeom: 'Point', height: 8 });
  // legendCtrl.hide();
  map.addControl(legendCtrl);

  // ---------------------------------
  // ----------Scale Control--------------------------------------------------------------------------------------------------------
  // ---------------------------------
  map.addControl(new ol_control_CanvasScaleLine());
  // const scaleControl = new ScaleLine({
  //   title: 'map scale',
  //   className: 'ol-scale-line',
  //   units: 'metric',
  //   bar: false,
  //   steps: parseInt(0.1, 10),
  //   text: true,
  //   minWidth: 100,
  // });
  // map.addControl(scaleControl);

  // ---------------------------------
  // ----------Print Control--------------------------------------------------------------------------------------------------------
  // ---------------------------------
  ol_control_PrintDialog.addLang('vn', {
    title: 'Print',
    orientation: 'Orientation',
    portrait: 'Portrait',
    landscape: 'Landscape',
    size: 'Page size',
    custom: 'screen size',
    margin: 'Margin',
    scale: 'Tỷ lệ',
    legend: 'Chú thích',
    north: 'La bàn',
    mapTitle: 'Tiêu đề bản đồ',
    saveas: 'Lưu bản đồ...',
    saveLegend: 'Lưu chú thích...',
    copied: '✔ Copied to clipboard',
    errorMsg: "Can't save map canvas...",
    printBt: 'Print...',
    clipboardFormat: 'copy to clipboard...',
    jpegFormat: 'save as jpeg',
    pngFormat: 'save as png',
    pdfFormat: 'save as pdf',
    none: 'none',
    small: 'small',
    large: 'large',
    cancel: 'Huỷ',
  });
  map.addControl(
    new ol_control_CanvasTitle({
      title: 'Quảng Nam',
      visible: false,
      style: new Style({
        text: new Text({ font: '20px "Lucida Grande",Verdana,Geneva,Lucida,Arial,Helvetica,sans-serif' }),
      }),
    }),
  );
  var printControl = new ol_control_PrintDialog({
    target: document.getElementById('none'),
    lang: 'vn',
    // targetDialog: map.getTargetElement()
    // save: false,
    // copy: false,
    // pdf: false,
  });
  printControl.set('title', 'Print control');
  printControl.setSize('A4');
  /* On print > save image file */
  printControl.on(['print', 'error'], function (e) {
    // Print success
    if (e.image) {
      if (e.pdf) {
        // Export pdf using the print info
        var pdf = new jsPDF({
          orientation: e.print.orientation,
          unit: e.print.unit,
          format: e.print.size,
        });
        pdf.addImage(
          e.image,
          'JPEG',
          e.print.position[0],
          e.print.position[0],
          e.print.imageWidth,
          e.print.imageHeight,
        );
        pdf.save(e.print.legend ? 'legend.pdf' : 'map.pdf');
      } else {
        // Save image as file
        e.canvas.toBlob(
          function (blob) {
            var name = (e.print.legend ? 'legend.' : 'map.') + e.imageType.replace('image/', '');
            saveAs(blob, name);
          },
          e.imageType,
          e.quality,
        );
      }
    } else {
      console.warn('No canvas to export');
    }
  });
  map.addControl(printControl);

  // ---------------------------------
  // ----------Geolocation control--------------------------------------------------------------------------------------------------------
  // ---------------------------------
  // var geoloc = new ol_control_GeolocationButton({
  //   // title: 'Where am I?',
  //   delay: 3000, // 2s
  // });
  // geoloc.set('title', 'Geolocation control');
  // geoloc.setVisible(false);
  // map.addControl(geoloc);
  const geolocationStyle = {
    Point: new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({
          color: '#00b4d8',
        }),
        stroke: new Stroke({
          color: 'white',
          width: 2,
        }),
      }),
    }),
    Circle: new Style({
      stroke: new Stroke({
        color: '#6ec531',
        width: 1,
      }),
      fill: new Fill({
        color: 'rgba(255,255,255, 0.5)',
      }),
    }),
  };
  const geolocationLayer = new VectorLayer({
    title: 'Geolocation layer',
    source: new VectorSource(),
    style: (feature) => {
      return geolocationStyle[feature.getGeometry().getType()];
    },
  });
  map.addLayer(geolocationLayer);
  return map;
};

export default runMap;
