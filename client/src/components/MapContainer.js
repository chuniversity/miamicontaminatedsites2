import React from 'react'
import {Map, GoogleApiWrapper, Marker} from 'google-maps-react'
 
const MapContainer = (props) => {
 const displayMarkers = () => {
    return props.sites
    .filter(site => {
      let cleaned = site.attributes.PERMITTYPE.split(' ').join(''); // fix spacing error in api
      if (props.permit === 'all') return true;
        else return cleaned === props.permit;
      })
    .map((site, index) => {
      return (
        <Marker  
          key={index} id={index} 
          position={{
            lat: site.geometry.y,
            lng: site.geometry.x
          }}
        />
      )
    })
  };
        return (
          <Map
            google={props.google}
            style={{width: '100%', 
                    height: '400px'
                  }}
            initialCenter={{
              lat: props.place.geometry.location.lat(),
              lng: props.place.geometry.location.lng()
            }}
            zoom={props.zoom}
          >
          {displayMarkers()}
          </Map>
        );
  };

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_API_KEY)
})(MapContainer);
