// Define your amenities and their icons
const amenities = {
  'wifi': { name: 'WiFi', icon: 'icons/wifi.png' },
  'pool': { name: 'Pool', icon: 'icons/pool.png' },
  // Add more amenities here
};

// Function to update the display area
function updateDisplay() {
  const displayArea = document.getElementById('amenities-display');
  displayArea.innerHTML = ''; // Clear the current display

  // Check which checkboxes are checked and display them
  for (const [key, amenity] of Object.entries(amenities)) {
    const checkbox = document.getElementById(`checkbox-${key}`);
    if (checkbox.checked) {
      const icon = document.createElement('img');
      icon.src = amenity.icon;
      icon.alt = amenity.name;

      const text = document.createTextNode(amenity.name);

      const div = document.createElement('div');
      div.appendChild(icon);
      div.appendChild(text);

      displayArea.appendChild(div);
    }
  }
}

// Add event listeners to checkboxes
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', updateDisplay);
});
