let pokemonData = [];

// Fetch data from mock server and PokeAPI
async function fetchPokemon() {
  try {
    // Fetch Pokemon list from local server
    const response = await fetch("http://localhost:3000/pokemon");
    if (!response.ok) {
      throw new Error("HTTP call to local server failed");
    }
    const localPokemonList = await response.json();

    // Fetch details for each Pokémon from PokeAPI
    const fetches = localPokemonList.map(async (pokemon) => {
      const apiResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      if (!apiResponse.ok) {
        throw new Error(`Failed to fetch data for ${pokemon.name}`);
      }
      const pokeData = await apiResponse.json();
      return {
        id: pokeData.id,
        name: pokeData.name,
        types: pokeData.types.map((typeInfo) => typeInfo.type.name),
        image: pokeData.sprites.front_default,
      };
    });

    // Wait for all fetches to complete
    pokemonData = await Promise.all(fetches);
    renderApp();
  } catch (error) {
    console.error("Failed to fetch Pokemon data:", error);
    renderApp();
  }
}

// Card component with destructuring
function PokemonCard({ name, image, types }) {
  return React.createElement(
    "div",
    { className: "m-4 p-4 border rounded shadow-lg text-center" },
    React.createElement("img", {
      src: image,
      alt: name,
      className: "w-32 h-32 mx-auto",
    }),
    React.createElement("h2", { className: "text-xl font-bold" }, name),
    React.createElement(
      "p",
      { className: "text-gray-600" },
      `Type: ${types ? types.join("/") : "Unknown"}`
    )
  );
}

// List component
function PokemonList() {
  if (pokemonData.length === 0) {
    return React.createElement(
      "p",
      { className: "text-center" },
      "Loading Pokemon data..."
    );
  }

  return React.createElement(
    "div",
    { className: "flex flex-wrap justify-center" },
    pokemonData.map((pokemon) =>
      React.createElement(PokemonCard, {
        key: pokemon.id,
        name: pokemon.name,
        types: pokemon.types,
        image: pokemon.image,
      })
    )
  );
}

// App component wrapping header and list
function App() {
  return React.createElement(
    "div",
    { className: "p-4" },
    React.createElement(
      "header",
      { className: "mb-4" },
      React.createElement(
        "h1",
        { className: "text-3xl text-center font-bold underline" },
        "List Pokedex"
      )
    ),
    React.createElement(PokemonList, null)
  );
}

// Function to render the app
function renderApp() {
  ReactDOM.render(React.createElement(App), document.getElementById("root"));
}

// Initial render
renderApp();

// Fetch and display the Pokemon data
fetchPokemon();
