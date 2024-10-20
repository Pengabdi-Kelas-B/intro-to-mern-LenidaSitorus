const fs = require("fs");
const axios = require("axios").default;

console.log("test");

async function generateJsonDB() {
  // TODO: fetch data pokemon api dan buatlah JSON data sesuai dengan requirement.
  // json file bernama db.json. pastikan ketika kalian menjalankan npm run start
  // dan ketika akses url http://localhost:3000/pokemon akan muncul seluruh data
  // pokemon yang telah kalian parsing dari public api pokemon
  const pokemonApiURL = "https://pokeapi.co/api/v2/pokemon/?limit=100";
  try {
    // 1. Fetch API
    const response = await axios.get(pokemonApiURL);
    console.log(response.data.results);

    // 2. Write data to db.json
    const sample = {
      pokemon: [],
    };

    // Loop to fetch detailed Pokémon data based on each URL
    for (const pokemon of response.data.results) {
      const pokemonDetailResponse = await axios.get(pokemon.url);
      const speciesResponse = await axios.get(
        pokemonDetailResponse.data.species.url
      );

      // Extract necessary data
      const pokemonData = {
        id: pokemonDetailResponse.data.id,
        name: pokemonDetailResponse.data.name,
        height: pokemonDetailResponse.data.height,
        weight: pokemonDetailResponse.data.weight,
        types: pokemonDetailResponse.data.types.map((type) => type.type.name),
        abilities: pokemonDetailResponse.data.abilities.map(
          (ability) => ability.ability.name
        ),

        cries: {
          latest: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonDetailResponse.data.id}.ogg`,
          legacy: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/${pokemonDetailResponse.data.id}.ogg`,
        },

        evolutionChain: speciesResponse.data.evolution_chain.url,
      };

      // Save Pokémon data into sample
      sample.pokemon.push(pokemonData);
    }

    // Save data to db.json
    fs.writeFileSync("db.json", JSON.stringify(sample, null, 4));
    console.log("Database created successfully: db.json");
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}

generateJsonDB();
