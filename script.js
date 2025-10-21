const appId = '680982be'; // Your Edamam App ID
const appKey = 'fdfd7b0e3a2ca1952ecd5f37a6368355'; // Your new Edamam App Key


// Event listener for search button
document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value.trim();
  const diet = document.getElementById('dietSelect').value;

  if (!query) {
    alert('Please enter a recipe name.');
    return;
  }

  searchRecipes(query, diet);
});

// Fetch recipes from Edamam API
function searchRecipes(query, diet) {
  let url = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${appId}&app_key=${appKey}&field=label&field=image&field=source&field=url`;


  // Apply diet filter if selected (except halal, which is handled manually)
  if (diet && diet !== 'halal') {
    url += `&diet=${diet}`;
  }

 
fetch(url, {
  headers: {
    'Accept': 'application/json',
    'Edamam-Account-User': 'testuser123'
  }
})
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json(); // convert response to JSON
  })
  .then(data => {
    const recipes = data.hits.map(hit => hit.recipe);
    displayResults(recipes, diet);
  })
}

// Display recipe cards
function displayResults(recipes, diet) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (!recipes || recipes.length === 0) {
    resultsDiv.innerHTML = '<p>No recipes found.</p>';
    return;
  }

  recipes.forEach(recipe => {

    if (diet === 'halal') {
      const name = recipe.label.toLowerCase();
      if (name.includes('pork') || name.includes('bacon') || name.includes('wine')) return;
    }

    const card = document.createElement('div');
    card.classList.add('recipe-card');

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.label}">
      <h3>${recipe.label}</h3>
      <p><strong>Source:</strong> ${recipe.source}</p>
      <a href="${recipe.url}" target="_blank">View your recipe</a>
    `;

    resultsDiv.appendChild(card);
  });
}

