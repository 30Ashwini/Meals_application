// To store favourite meals in local storage without  any expiration after a refresh of the page.
if (localStorage.getItem("MyfavouritesList") == null) {
    localStorage.setItem("MyfavouritesList", JSON.stringify([]));
}
//To fetch the meal from API
async function fetchMealsFromApi(url,value) {
    const response=await fetch(`${url+value}`);
    const meals=await response.json();
    return meals;
}
// This function helps to display the meal card list in main body when the user searches for a particular meal.
function showMealList(){
    let inputName = document.getElementById("my-search").value;
    let arr=JSON.parse(localStorage.getItem("MyfavouritesList"));    // has the existing favourite 
    let url="https://www.themealdb.com/api/json/v1/1/search.php?s="; //API url
    let html = "";
    let meals=fetchMealsFromApi(url,inputName);
    //meal result from api 
    meals.then(data=>{
        if (data.meals) {
            data.meals.forEach((element) => {
                let isInFav=false;
                for (let index = 0; index < arr.length; index++) {
                    if(arr[index]==element.idMeal){
                        isInFav=true;
                    }
                }
                //if meal is in favourite list then it shows red colour heart for favourite button
                if (isInFav) {
                    html += `
                    <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                    <h5 class="card-title">${element.strMeal}</h5>
                    <div class="d-flex justify-content-between mt-5">
                    <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                    <button id="main${element.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%;color:white; background-color:red;"><i class="fa-solid fa-heart"></i></button>
                    </div>
                    </div>
                    </div>
                    `;
                    //if meal is not in favourite list then it shows white heart button
                } else {
                    html += `
                    <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                    <h5 class="card-title">${element.strMeal}</h5>
                    <div class="d-flex justify-content-between mt-5">
                    <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                    <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                    </div>
                    </div>
                    </div>
                    `;
                }  
            });
            //if no meal found then it shows No meal found
        } else {
            html += `
            <div class="page-wrap d-flex flex-row align-items-center">
            <div class="container">
            <div class="row justify-content-center">
            <div class="col-md-12 text-center">
            <span class="display-1 d-block"> </span>
            <div class="mb-4 lead">
            SORRY! No meal found.
            </div>
            </div>
            </div>
            </div>
            </div>
            `;
        }
        // Displays the meal card list in main body
        document.getElementById("main").innerHTML = html;
    });
}
//Fetching meal details from api including the instructions and video link of the meal provided
async function showMealDetails(id) {
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html="";
    await fetchMealsFromApi(url,id).then(data=>{
        html += `
        <div id="meal-details" class="mb-5">
        <div id="meal-header" class="d-flex justify-content-around flex-wrap">
        <div id="meal-thumbail">
        <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
        </div>
        <div id="details">
        <h3>${data.meals[0].strMeal}</h3>
        <h6>Category : ${data.meals[0].strCategory}</h6>
        <h6>Area : ${data.meals[0].strArea}</h6>
        </div>
        </div>
        <div id="meal-instruction" class="mt-3">
        <h5 class="text-center text-primary">INSTRUCTIONS</h5>
        <p>${data.meals[0].strInstructions}</p>  
        </div>
        <div class="text-center">
        <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-success mt-3">Watch Video</a>    
        </div>
        </div>
        `;
    });
    document.getElementById("main").innerHTML=html;  //displays the meal details
}
//Shows your favourite meal list added in the favourite list
async function FavMealList() {
    let arr=JSON.parse(localStorage.getItem("MyfavouritesList"));
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html="";
    //if no meal is added in favourite list then it shows 404 error
    if (arr.length==0) {
        html += `
        <div class="page-wrap d-flex flex-row align-items-center">
        <div class="container">
        <div class="row justify-content-center">
        <div class="col-md-12 text-center">
        <span class="display-1 d-block">No item found</span>
        <div class="mb-4 lead">
        please add your favourite food...
        </div>
        </div>
        </div>
        </div>
        </div>
        `;
        //if meal is added in favourite list then it shows the meal card list in favourite list
    } else {
        for (let index = 0; index < arr.length; index++) {
            await fetchMealsFromApi(url,arr[index]).then(data=>{
                html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">${data.meals[0].strMeal}</h5>
                <div class="d-flex justify-content-between mt-5">
                <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%; color:white; background-color:red;"><i class="fa-solid fa-heart"></i></button>
                </div>
                </div>
                </div>
                `;
            });   
        }
    }
    document.getElementById("favourites-body").innerHTML=html;  //displays the favourite meal list
}
//This function helps user to add to or remove meals from favourites list
function addRemoveToFavList(id) {
    let arr=JSON.parse(localStorage.getItem("MyfavouritesList"));
    let contain=false;
    for (let index = 0; index < arr.length; index++) {
        if (id==arr[index]) {
            contain=true;
        }
    }
    //if meal is already added in favourite list then it removes the meal from favourite list
    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("Removed the food item from favourites list");
    } 
    //if meal is not added in favourite list then it adds the meal to favourite list
    else {
        arr.push(id);
        alert("Added your food item to favourites list");
    }
    localStorage.setItem("MyfavouritesList",JSON.stringify(arr));
    showMealList();   //To display the meal list
    FavMealList();  //To display the favourite meal list
}