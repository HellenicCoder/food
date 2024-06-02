
const searchInput = document.getElementById('searchInput')
const searchButton = document.getElementById('searchButton')
const mealList = document.getElementById('mealList')
const modalContainer = document.querySelector('.modal-container')
const mealDetailsContent = document.querySelector('.meal-details-content')
const recipeCloseBtn = document.getElementById('recipeCloseBtn')

// event listener
searchButton.addEventListener('click', async () => {
    const ingredient = searchInput.value.trim();
    if(ingredient){
        const meals = await searchMealsByIngredient(ingredient)
        displayMeals(meals)
    }
})

mealList.addEventListener('click', async (e) => {
    const card = e.target.closest('.meal-item')
    if(card){
        const mealId = card.dataset.id 
        const meal = await getMealDetails(mealId)
        if(meal){
            showMealDetailsPopup(meal)
        }
    }
})

async function searchMealsByIngredient(ingredient){
    try{
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
      const dataset = await response.json()
      return dataset.meals
    } catch(err){
       console.error("there is an error in data", err);
    }
}

async function getMealDetails(mealId){
    try{
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      const dataset = await response.json()
      return dataset.meals[0]
    } catch(error){
       console.error('error in featching meal details', error)
    }
}

function displayMeals(meals){
    mealList.innerHTML = '';
    if(meals){
        meals.forEach((meal) => {
            const mealItem = document.createElement('div')
            mealItem.classList.add('meal-item')
            mealItem.classList.id = meal.idMeal
            mealItem.innerHTML = `
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
              <h3>${meal.strMeal}</h3>
            `;
            mealList.appendChild(mealItem)
        });
    } else{
        mealList.innerHTML = '<p>No meals found. try another ingredient.</p>'
    }
}

function showMealDetailsPopup(meal){
    mealDetailsContent.innerHTML = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <div class="recipe-instruct">
       <h3>Instructions:</h3>
       <p>${meal.strMealThumb}</p>
    </div>
    <div class="recipe-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-video">
            <a href="${meal.strYoutube}" target="_blank">Video Tutorial</a>
    </div>
    `;
    modalContainer.style.display = 'block'
}

recipeCloseBtn.addEventListener('click', closeRecipeModal)

function closeRecipeModal(){
    modalContainer.style.display = 'none'
}

searchInput.addEventListener('keyup', (e) => {
    if(e.key === "Enter"){
        performSearch()
    }
})

async function performSearch(){
    const ingredient = searchInput.value.trim();
    if(ingredient){
        const meals = await searchMealsByIngredient(ingredient)
        displayMeals(meals)
    }
}

window.addEventListener('load', () => {
    searchInput.value = 'chicken';
    performSearch();
})