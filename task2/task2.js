const axios = require('axios');

const BASE_URL = 'https://petstore.swagger.io/v2';

// Class to count pets with the same name
class PetNameCounter {
  constructor(pets) {
    this.pets = pets; // Array of {id, name} objects
  }

  // Method to count pets with the same name
  countNames() {
    const nameCounts = {};
    for (const pet of this.pets) {
      if (pet.name) {
        nameCounts[pet.name] = (nameCounts[pet.name] || 0) + 1;
      }
    }
    return nameCounts;
  }
}

// Main function to interact with the Petstore API
async function main() {
  try {
    // Step 1: Create a user
    const user = {
      id: 12345,
      username: 'testuser123',
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password123',
      phone: '123-456-7890',
      userStatus: 0
    };

    console.log('Creating user...');
    const createUserResponse = await axios.post(`${BASE_URL}/user`, user);
    console.log('User created:', createUserResponse.status, createUserResponse.data);

    // Step 2: Retrieve user data
    console.log('\nRetrieving user data...');
    const getUserResponse = await axios.get(`${BASE_URL}/user/${user.username}`);
    console.log('User data:', getUserResponse.data);

    // Step 3: Fetch sold pets
    console.log('\nFetching sold pets...');
    const findPetsResponse = await axios.get(`${BASE_URL}/pet/findByStatus?status=sold`);
    const soldPets = findPetsResponse.data;

    // Step 4: Extract {id, name} tuples
    const petTuples = soldPets
      .filter(pet => pet.id && pet.name) // Filter out pets without id or name
      .map(pet => ({ id: pet.id, name: pet.name }));
    console.log('\nSold pets (id, name):', petTuples);

    // Step 5: Count pets with the same name
    const counter = new PetNameCounter(petTuples);
    const nameCounts = counter.countNames();
    console.log('\nPet name counts:', nameCounts);

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

// Run the main function
main();