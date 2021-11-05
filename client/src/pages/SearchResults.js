import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios';
import Result from '../components/Result';
import MapContainer from '../components/MapContainer';

const SearchResults = (props) => {
  const[place, setPlace] = useState({ formatted_address: "Loading..." });
  const[radiusMiles, setRadiusMiles] = useState(1);
  const[sites, setSites] = useState([]);
  const[permit, setPermit] = useState('all');
  const[permitText, setPermitText] = useState('All');
  // const[zoom, setZoom] = useState(15);
  const[loading, setLoading] = useState(true);

  const handlePermitChange = event => {
    setPermit(event.target.value);
    setPermitText(event.target.options[event.target.selectedIndex].text)
  }

  const handleRadiusChange = event => {
    setRadiusMiles(Number(event.target.value));
    fetchSites(place);
  }

  const fetchSites = place => {
    if (!place || !place.geometry) return;
    const [lat, lng] = [place.geometry.location.lat(), place.geometry.location.lng()];
    const radiusDegrees = (radiusMiles/138);
    const minLng = lng - radiusDegrees;
    const maxLng = lng + radiusDegrees;
    const minLat = lat - radiusDegrees;
    const maxLat = lat + radiusDegrees;
    const url = `https://services.arcgis.com/8Pc9XBTAsYuxx9Ny/arcgis/rest/services/ContaminatedSite_gdb/FeatureServer/0/query?where=1%3D1&outFields=*&geometry=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outSR=4326&f=json`;
    axios.get(url)
    .then(response => {
      const { data } = response;
      const { features } = data;
      setLoading(false);
      setSites(features);
      setPlace(place);
    })
  }

  const fetchSitesCopy = useCallback((place) => {
    if (!place || !place.geometry) return;
    const [lat, lng] = [place.geometry.location.lat(), place.geometry.location.lng()];
    const radiusDegrees = (radiusMiles/138);
    const minLng = lng - radiusDegrees;
    const maxLng = lng + radiusDegrees;
    const minLat = lat - radiusDegrees;
    const maxLat = lat + radiusDegrees;
    const url = `https://services.arcgis.com/8Pc9XBTAsYuxx9Ny/arcgis/rest/services/ContaminatedSite_gdb/FeatureServer/0/query?where=1%3D1&outFields=*&geometry=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outSR=4326&f=json`;
    axios.get(url)
    .then(response => {
      const { data } = response;
      const { features } = data;
      setLoading(false);
      setSites(features);
      setPlace(place);
    });
  }, [radiusMiles]);

 
  useEffect(() => {
    const service = new window.google.maps.places.PlacesService(document.getElementById('map'));
    service.getDetails({ placeId: props.match.params.placeId }, (place) => fetchSitesCopy(place));
  }, [props.match.params.placeId, fetchSitesCopy]);

    if (loading) {
      return (<div>Loading...</div>)
    } 
    return(
      <>
        <div style={{position: 'relative', minHeight: '400px', backgroundColor: 'azure', marginTop: '64px'}}>
        {
          place.geometry &&
          <MapContainer
            place={place}
            sites={sites}
            permit={permit}
            zoom={15}
          />
        }
        </div>
          <Result 
            sites={sites}
            permit={permit}
            permitText={permitText}
            radiusMiles={radiusMiles}
            placeId={props.match.params.placeId}
            handlePermitChange={handlePermitChange}
            handleRadiusChange={handleRadiusChange}
          />
        <div id="map"></div>
      </>
    )
}
export default SearchResults