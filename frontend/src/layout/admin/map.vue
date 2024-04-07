<template>
    <div>
      <input v-model="address" type="text" placeholder="Nhập địa chỉ">
      <button @click="search">Tìm Kiếm</button>
  
      <!-- Provide token and ref for MapboxMap -->
      <MapboxMap
        ref="mapboxRef"
        style="height: 400px"
        :access-token="mapboxToken"
        map-style="mapbox://styles/mapbox/streets-v11"
        :zoom="1" 
      >
        <!-- Use the MapboxMarker component directly -->
        <MapboxMarker :lng-lat="location" />
      </MapboxMap>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { MapboxMap, MapboxMarker } from '@studiometa/vue-mapbox-gl';
  
  const address = ref(''); // Initial address
  const location = ref({ lng: 0, lat: 0 }); // Đặt giá trị mặc định là { lng: 0, lat: 0 }
  const mapboxRef = ref(null);
  const mapboxToken = import.meta.env.VITE_TOKEN_MAPBOX;
  
  
  // Import mapboxgl library
  import mapboxgl from 'mapbox-gl';
  
  // Initialize mapboxgl
  mapboxgl.accessToken = import.meta.env.VITE_TOKEN_MAPBOX;
  
  // This function will be responsible for creating and updating the marker
  function createMarker(lngLat) {
    // Update the reactive location with the new lngLat
    location.value = lngLat;
  
    // Di chuyển bản đồ đến vị trí mới và đặt giá trị zoom cố định là 1
    if (mapboxRef.value && mapboxRef.value.map) {
      mapboxRef.value.map.flyTo({
        center: lngLat,
        zoom: 15, // Đặt giá trị zoom cố định là 15
        essential: true, // Chắc chắn rằng hiệu ứng zoom sẽ được thực hiện
      });
    }
  }
  
  
  const search = async () => {
    // Kiểm tra xem address có giá trị hợp lệ không
    if (address.value.trim() !== '') {
      try {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address.value)}.json?access_token=${mapboxToken}`);
        if (response.data.features.length > 0) {
          const firstResult = response.data.features[0];
          const lngLat = {
            lng: firstResult.center[0],
            lat: firstResult.center[1]
          };
  
          // Kiểm tra định dạng của lngLat trước khi gọi createMarker
          if (isValidLngLat(lngLat)) {
            createMarker(lngLat);
          } else {
            console.error('Dữ liệu không đúng định dạng LngLat');
          }
        } else {
          console.error('Không tìm thấy địa chỉ');
        }
      } catch (error) {
        console.error('Lỗi geocoding: ', error);
      }
    }
  };
    
  function isValidLngLat(lngLat) {
    return lngLat && typeof lngLat === 'object' && 'lng' in lngLat && 'lat' in lngLat;
  }
  </script>