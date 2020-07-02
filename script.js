const search = document.getElementById('search'), //The getElementById() method returns
  submit = document.getElementById('submit'), //  the element that has the ID attribute 
  suggest = document.getElementById('suggest'),//with the specified value.
  searchedMeal = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_meal = document.getElementById('single-meal');

// Search meal and fetch from API
const searchMeal = (e) => {
  e.preventDefault(); //The preventDefault() method cancels the event if it is cancelable, 
  // meaning that the default action that belongs to the event will not occur.

  // Clear single meal
  single_meal.innerHTML = '';

  // Get search term
  const term = search.value;

  // Check for empty
  if (term.trim()) { //The trim() method removes whitespace from both sides of a string.
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log("Searched Result",data);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
        } else {
          searchedMeal.innerHTML = data.meals
            .map( //The map() method calls the provided function once for each element in an array, in order.
              meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `
            )
            .join('');  //The join() method returns the array as a string.
        }
      });
    // Clear search text
    search.value = '';
  } else { // Displays a alert window, when user keeps the 
    alert('Please enter a search term');
  }
}

// Fetch meal by ID
const getMealById = (mealID) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      console.log("Displays the selected record",data);
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Fetch random meal from API
const getRandomMeal = () => {
  // Clear meals and heading
  searchedMeal.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())  //res.json() – parse the response as JSON
    .then(data => {
      console.log("calls when the user click on Suggest me buttons",data);
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Add meal to DOM
const addMealToDOM = (meal) => {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngrediet${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_meal.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}  
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>


      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}



// Event listeners
// When using the addEventListener() method, the JavaScript is separated from the HTML markup,
//  for better readability and allows you to add event listeners even when you do not control the 
//  HTML markup.
submit.addEventListener('submit', searchMeal);
suggest.addEventListener('click', getRandomMeal);

searchedMeal.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info'); //The contains() method returns a Boolean value 
                                                  // indicating whether a node is a descendant of a specified node.
    } else {
      return false;
    }
  });


  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');  //The getAttribute() method returns the 
    getMealById(mealID); // value of the attribute with the specified name, of an element.
  }
});
