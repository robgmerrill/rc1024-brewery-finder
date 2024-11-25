// ts/main.ts

// Select the form element with ID 'zipForm' for ZIP code input
const form = document.querySelector<HTMLFormElement>('#zipForm');
// Select the input element with ID 'zipInput' for entering the ZIP code
const input = document.querySelector<HTMLInputElement>('#zipInput');
// Select the div element with ID 'results' for displaying brewery results
const resultsContainer = document.querySelector<HTMLDivElement>('#results');

// Function to fetch breweries from the API using async/await
async function fetchBreweries(
  zipCode: string,
): Promise<{ id: string; name: string; address: string; phone: string }[]> {
  // Define the endpoint URL with the provided ZIP code
  const endpoint = `https://api.openbrewerydb.org/breweries?by_postal=${zipCode}`;
  try {
    // Make a fetch request to the API
    const response = await fetch(endpoint);
    // Throw an error if the response is not OK
    if (!response.ok) {
      throw new Error('Failed to fetch breweries');
    }

    // Parse the JSON data from the response
    const apiData = await response.json();

    // Map the API data to a consistent format, ensuring each brewery has an ID
    return apiData.map(function (brewery: any) {
      return {
        id: brewery.id, // Use the unique ID provided by the API
        name: brewery.name, // Get the brewery name
        address: `${brewery.street}, ${brewery.city}, ${brewery.state}`, // Format the address
        phone: brewery.phone || 'N/A', // Use 'N/A' if the phone number is not available
      };
    });
  } catch (error) {
    // Log any errors that occur during the fetch process
    console.error('Error fetching breweries:', error);
    // Return an empty array if an error occurs
    return [];
  }
}

// Function to add a brewery to the visited list
function addToVisited(
  breweryId: string,
  breweries: { id: string; name: string; address: string; phone: string }[],
): void {
  // Find the brewery in the current list using its ID
  const brewery = breweries.find((b) => b.id === breweryId);
  // Check if the brewery exists and is not already in the visited list
  if (brewery && !data.visitedBreweries.some((b) => b.id === breweryId)) {
    // Add the brewery to the visited list
    data.visitedBreweries.push(brewery);
    // Save the updated visited list to localStorage
    saveToLocalStorage();
    // Notify the user that the brewery has been added
    alert(`${brewery.name} has been added to your visited breweries!`);
  } else {
    // Notify the user if the brewery is already in the visited list
    alert('This brewery is already in your visited list.');
  }
}

// Function to create brewery cards using DOM manipulation
function createBreweryCard(
  brewery: { id: string; name: string; address: string; phone: string },
  breweries: { id: string; name: string; address: string; phone: string }[],
): HTMLElement {
  // Create a div element for the brewery card
  const card = document.createElement('div');
  // Assign a class name for styling the card
  card.className = 'brewery-card';

  // Create an h3 element for the brewery name
  const nameElement = document.createElement('h3');
  // Set the text content to the brewery's name
  nameElement.textContent = brewery.name;

  // Create a p element for the brewery address
  const addressElement = document.createElement('p');
  // Set the text content to the brewery's address
  addressElement.textContent = brewery.address;

  // Create a p element for the brewery phone number
  const phoneElement = document.createElement('p');
  // Set the text content to the brewery's phone number
  phoneElement.textContent = brewery.phone;

  // Create a "Map" button with Font Awesome icon
  const buttonElement = document.createElement('button');
  // Assign a class name for styling the button
  buttonElement.className = 'map-button';
  // Set the title attribute for accessibility
  buttonElement.title = 'Add to Visited Breweries';

  // Create an i element for the Font Awesome icon
  const iconElement = document.createElement('i');
  // Assign the Font Awesome classes to the icon
  iconElement.className = 'fas fa-map-marker-alt';
  // Append the icon to the button
  buttonElement.appendChild(iconElement);

  // Add an event listener to the button for adding to the visited list
  buttonElement.addEventListener('click', function () {
    addToVisited(brewery.id, breweries);
  });

  // Append all elements to the card
  card.appendChild(nameElement);
  card.appendChild(addressElement);
  card.appendChild(phoneElement);
  card.appendChild(buttonElement);

  // Return the complete brewery card element
  return card;
}

// Function to render breweries on the page
function renderBreweries(
  breweries: { id: string; name: string; address: string; phone: string }[],
): void {
  // Check if the results container exists
  if (resultsContainer) {
    // Clear previous results from the container
    resultsContainer.textContent = '';

    // Iterate through the list of breweries and create a card for each
    breweries.forEach(function (brewery) {
      const card = createBreweryCard(brewery, breweries);
      // Append the card to the results container
      resultsContainer.appendChild(card);
    });
  }
}

// Function to handle form submission
async function handleFormSubmit(event: Event): Promise<void> {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Check if the input element exists
  if (input) {
    // Trim whitespace from the entered ZIP code
    const zipCode = input.value.trim();
    // Alert the user if the ZIP code is empty
    if (!zipCode) {
      alert('Please enter a valid ZIP code');
      return;
    }

    // Fetch the breweries based on the ZIP code and render them
    const breweries = await fetchBreweries(zipCode);
    renderBreweries(breweries);
  }
}

// Initialize the app by loading visited breweries from localStorage
function initializeApp(): void {
  // Load the visited breweries from localStorage into the data object
  loadFromLocalStorage();
}

// Check if the form element exists and attach an event listener to handle submissions
if (form) {
  form.addEventListener('submit', handleFormSubmit);
}

// Call the initialize function to set up the app on page load
initializeApp();
