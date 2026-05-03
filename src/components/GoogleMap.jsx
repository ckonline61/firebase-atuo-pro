import { useEffect, useRef, useState } from 'react';

// Load Google Maps script dynamically
let isScriptLoaded = false;
let isScriptLoading = false;
const callbacks = [];

function loadGoogleMapsScript(apiKey) {
  if (isScriptLoaded) return Promise.resolve();
  if (isScriptLoading) {
    return new Promise((resolve) => callbacks.push(resolve));
  }
  
  isScriptLoading = true;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      isScriptLoaded = true;
      isScriptLoading = false;
      resolve();
      callbacks.forEach(cb => cb());
    };
    script.onerror = (err) => {
      isScriptLoading = false;
      reject(err);
    };
    document.head.appendChild(script);
  });
}

export default function GoogleMap({ 
  center = { lat: 21.2514, lng: 81.6296 }, // Default: Raipur, Chhattisgarh
  zoom = 14,
  markers = [],
  height = '200px',
  onLocationSelect = null,
  showSearch = false,
  showUserLocation = false,
  searchBounds = null,
  strictSearchBounds = false,
  searchPlaceholder = 'Search location...',
  style = {}
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    
    if (!apiKey || apiKey.includes('XXXX')) {
      setError(true);
      return;
    }

    loadGoogleMapsScript(apiKey)
      .then(() => {
        setLoaded(true);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] }
      ]
    });

    mapInstanceRef.current = map;

    // Add markers
    markers.forEach(markerData => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map,
        title: markerData.title || '',
        icon: markerData.icon || undefined
      });

      if (markerData.label) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="font-family:Inter,sans-serif;font-size:13px;font-weight:600;padding:4px">${markerData.label}</div>`
        });
        marker.addListener('click', () => infoWindow.open(map, marker));
      }
    });

    // Click to select location
    if (onLocationSelect) {
      let selectMarker = null;
      map.addListener('click', (e) => {
        const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        
        if (selectMarker) selectMarker.setMap(null);
        selectMarker = new window.google.maps.Marker({
          position: pos,
          map,
          animation: window.google.maps.Animation.DROP
        });

        // Reverse geocode to get address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: pos }, (results, status) => {
          if (status === 'OK' && results[0]) {
            onLocationSelect({
              lat: pos.lat,
              lng: pos.lng,
              address: results[0].formatted_address
            });
          } else {
            onLocationSelect({ lat: pos.lat, lng: pos.lng, address: 'Selected Location' });
          }
        });
      });
    }

    // Show user's current location
    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          new window.google.maps.Marker({
            position: userPos,
            map,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2
            },
            title: 'Your Location'
          });

          map.setCenter(userPos);
        },
        () => console.log('Location access denied')
      );
    }

    // Search autocomplete
    if (showSearch) {
      const input = document.getElementById('map-search-input');
      if (input) {
        const autocompleteOptions = {
          componentRestrictions: { country: 'in' }
        };

        if (searchBounds) {
          autocompleteOptions.bounds = new window.google.maps.LatLngBounds(
            { lat: searchBounds.south, lng: searchBounds.west },
            { lat: searchBounds.north, lng: searchBounds.east }
          );
          autocompleteOptions.strictBounds = strictSearchBounds;
        }

        const autocomplete = new window.google.maps.places.Autocomplete(input, autocompleteOptions);
        autocomplete.bindTo('bounds', map);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            map.setCenter(place.geometry.location);
            map.setZoom(16);
            
            if (onLocationSelect) {
              onLocationSelect({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                address: place.formatted_address
              });
            }
          }
        });
      }
    }
  }, [loaded, center, zoom]);

  if (error) {
    // Fallback to embed map
    return (
      <div style={{ width: '100%', height, borderRadius: '14px', overflow: 'hidden', ...style }}>
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.6!2d${center.lng}!3d${center.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zLocation!5e0!3m2!1sen!2sin`}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          loading="lazy"
          title="Map"
        ></iframe>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', ...style }}>
      {showSearch && (
        <input
          id="map-search-input"
          type="text"
          placeholder={searchPlaceholder}
          style={{
            width: '100%',
            padding: '10px 14px',
            border: '1.5px solid #E0E0E0',
            borderRadius: '10px',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '10px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      )}
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height, 
          borderRadius: '14px',
          background: '#f5f5f5',
          display: loaded ? 'block' : 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {!loaded && <div className="spinner"></div>}
      </div>
    </div>
  );
}
