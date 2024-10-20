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
        image: pokeData.sprites.front_default || "default-pokemon.png",
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

// Function to create a box for each type with dynamic styling
function TypeBox({ type }) {
  const typeColors = {
    fire: "bg-red-500",
    water: "bg-blue-500",
    grass: "bg-green-500",
    electric: "bg-yellow-500",
    psychic: "bg-pink-500",
    ice: "bg-blue-300",
    dragon: "bg-purple-500",
    dark: "bg-gray-700",
    fairy: "bg-pink-200",
    normal: "bg-gray-400",
    bug: "bg-green-700",
    flying: "bg-indigo-300",
    poison: "bg-purple-700",
    ground: "bg-yellow-600",
    rock: "bg-yellow-800",
    ghost: "bg-purple-900",
    fighting: "bg-red-700",
    steel: "bg-gray-500",
  };

  return React.createElement(
    "div",
    {
      className: `px-4 py-2 m-1 text-white rounded ${
        typeColors[type] || "bg-gray-500"
      }`,
    },
    type
  );
}

// Card component with destructuring and enhanced UI
function PokemonCard({ name, image, types }) {
  return React.createElement(
    "div",
    {
      className:
        "m-4 p-6 border rounded-lg shadow-lg text-center bg-gradient-to-b from-yellow-50 to-yellow-100 hover:scale-105 transition-transform duration-300 ease-in-out",
    },
    React.createElement("img", {
      src: image,
      alt: name,
      className: "w-40 h-40 mx-auto rounded-full border-4 border-yellow-400",
    }),
    React.createElement(
      "h2",
      { className: "text-xl font-bold text-yellow-600 mt-4" },
      name
    ),
    React.createElement(
      "div",
      { className: "flex justify-center mt-2 flex-wrap" },
      types.map((type) => React.createElement(TypeBox, { key: type, type }))
    )
  );
}

// List component
function PokemonList() {
  if (pokemonData.length === 0) {
    return React.createElement(
      "p",
      { className: "text-center text-gray-500" },
      "Loading Pokemon data..."
    );
  }

  return React.createElement(
    "div",
    {
      className:
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center",
    },
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
    { className: "p-4 bg-yellow-50 min-h-screen" },
    React.createElement(
      "header",
      {
        className:
          "mb-8 text-center py-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg border-4 border-yellow-700",
      },
      React.createElement(
        "h1",
        { className: "text-5xl font-extrabold text-white tracking-wider" },
        "Pokedex"
      ),
      React.createElement(
        "p",
        { className: "text-xl font-semibold text-yellow-100 mt-2" },
        "List of Pokemon"
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
