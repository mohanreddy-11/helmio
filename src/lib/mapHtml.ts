import type { Pod } from './store';

export type MapUser = { lat: number; lng: number } | null;

/** The JSON the map page receives. Only pods that already have coordinates are sent. */
export function buildPayload(user: MapUser, pods: Pod[]): string {
  return JSON.stringify({
    type: 'update',
    user,
    pods: pods
      .filter(p => p.lat !== undefined && p.lng !== undefined)
      .map(p => ({ id: p.id, name: p.name, status: p.status, lat: p.lat, lng: p.lng })),
  });
}

/**
 * One self-contained Leaflet page shared by web (iframe) and phone (WebView).
 * Tiles: OpenStreetMap, with Esri as an automatic fallback. Both are keyless and fine for
 * development; switch to a keyed provider (Mapbox, MapTiler, Google) before launch.
 */
export const MAP_HTML = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css">
<style>
html,body,#m{height:100%;margin:0}body{background:#EDEFF1}
.pin{width:30px;height:30px;border-radius:50%;border:2px solid #fff;color:#fff;font:700 12px system-ui,sans-serif;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.35)}
.me{width:16px;height:16px;border-radius:50%;background:#3E8EFF;border:3px solid #fff;animation:p 2s infinite}
@keyframes p{0%{box-shadow:0 0 0 0 rgba(62,142,255,.55)}70%{box-shadow:0 0 0 16px rgba(62,142,255,0)}100%{box-shadow:0 0 0 0 rgba(62,142,255,0)}}
.rc{position:absolute;right:10px;bottom:24px;z-index:1000;width:38px;height:38px;border-radius:10px;border:0;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.3);font-size:18px;color:#14181B}
</style></head><body>
<div id="m"></div><button class="rc" id="rc" aria-label="Show me and nearby pods">&#9678;</button>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
<script>
var map=L.map('m',{zoomControl:false}).setView([20,0],2);
var osm=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'});
var esri=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,attribution:'Tiles &copy; Esri'});
var tileErrors=0;
osm.on('tileerror',function(){tileErrors++;if(tileErrors===4){map.removeLayer(osm);esri.addTo(map);}});
osm.addTo(map);
var me=null,pods={},fitted=false,last=null;
var COL={available:'#1E8E6E',cycle:'#6C4CFF',offline:'#8A939A'};
function send(m){var s=JSON.stringify(m);if(window.ReactNativeWebView){window.ReactNativeWebView.postMessage(s);}else{parent.postMessage(s,'*');}}
function fit(){
  if(!last)return;var pts=[];
  if(last.user)pts.push([last.user.lat,last.user.lng]);
  last.pods.forEach(function(p){pts.push([p.lat,p.lng]);});
  if(pts.length)map.fitBounds(pts,{padding:[40,40],maxZoom:17});
}
window.__update=function(d){
  last=d;
  if(d.user){
    var ll=[d.user.lat,d.user.lng];
    if(!me){me=L.marker(ll,{icon:L.divIcon({className:'',html:'<div class="me"></div>',iconSize:[16,16]}),zIndexOffset:1000}).addTo(map);}
    else{me.setLatLng(ll);}
  }
  var seen={};
  d.pods.forEach(function(p){
    seen[p.id]=1;
    var ic=L.divIcon({className:'',html:'<div class="pin" style="background:'+COL[p.status]+'">H</div>',iconSize:[30,30]});
    if(pods[p.id]){pods[p.id].setLatLng([p.lat,p.lng]);pods[p.id].setIcon(ic);}
    else{pods[p.id]=L.marker([p.lat,p.lng],{icon:ic}).addTo(map);pods[p.id].on('click',function(){send({type:'podPress',id:p.id});});}
  });
  Object.keys(pods).forEach(function(id){if(!seen[id]){map.removeLayer(pods[id]);delete pods[id];}});
  if(!fitted&&(d.user||d.pods.length)){fit();fitted=true;}
};
document.getElementById('rc').onclick=fit;
window.addEventListener('message',function(e){try{var d=JSON.parse(e.data);if(d.type==='update'){window.__update(d);}}catch(x){}});
send({type:'ready'});
</script></body></html>`;
