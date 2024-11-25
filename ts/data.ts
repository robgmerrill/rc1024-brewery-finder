// ts/data.ts

// Define a key for local storage
const key = 'visitedBreweries';

// Define a data object for managing state
const data = {
  // An array to store visited breweries
  visitedBreweries: [] as {
    id: string; // Unique identifier for the brewery
    name: string; // Name of the brewery
    address: string; // Address of the brewery
    phone: string; // Phone number of the brewery
  }[], // Persistent state for visited breweries

  // String to track the current view of the app
  currentView: 'home', // Default view is the homepage
};

// Function to save visited breweries to localStorage
function saveToLocalStorage(): void {
  // Convert the visitedBreweries array to a JSON string and store it in localStorage under the key
  localStorage.setItem(key, JSON.stringify(data.visitedBreweries));
}

// Function to load visited breweries from localStorage into the data object
function loadFromLocalStorage(): void {
  // Retrieve the JSON string of visited breweries from localStorage using the key
  const storedData = localStorage.getItem(key);

  // If there is stored data, parse it back into an array and assign it to data.visitedBreweries
  if (storedData) {
    data.visitedBreweries = JSON.parse(storedData);
  }
}
