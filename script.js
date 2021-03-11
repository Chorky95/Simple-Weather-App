'use strict';

//Search by using a city name(e.g. zagreb) or city name and country code sepparated by comma(e.g. zagreb,hr)
const form = document.querySelector('.top-banner form');
const input = document.querySelector('.top-banner input');
const msg = document.querySelector('.top-banner .msg');
const list = document.querySelector('.ajax-section .cities');

//Get your API key here: https://home.openweathermap.org/users/sign_up, don't use mine, it's free.
const apiKey = 'f28f426096b54e58a4421d84564e53b4';

form.addEventListener('submit', e => {
  e.preventDefault();
  let inputVal = input.value;

  //check if there's already a city
  const listItems = list.querySelectorAll('.ajax-section .city');
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = '';

      //if intups is for example zagreb,hr
      if (inputVal.includes(',')) {
        //zagreb,hrrrrrrrrrrrr->invalid country code, so we keep only the first part of inputVal and not the rest
        if (inputVal.split(',')[1].length > 2) {
          inputVal = inputVal.split(',')[0];
          content = el
            .querySelector('.city-name span')
            .textContent.toLowerCase();
        } else {
          content = el.querySelector('.city-name').dataset.name.toLowerCase();
        }
      } else {
        //zagreb
        content = el.querySelector('.city-name span').textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector('.city-name span').textContent
      } ...otherwise be more specific by providing the country code as well.`;
      form.reset();
      input.focus();
      return;
    }
  }

  //ajax
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather } = data;

      // console.log(data);
      // Openweather has its own icons which can be used with this line below, but i decided to add some i got at Flaticon
      //const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;
      const icon = `/icons/${weather[0]['icon']}.png`;

      const li = document.createElement('li');
      li.classList.add('city');
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]['description']
      }">
          <figcaption>${weather[0]['description']}</figcaption>
        </figure>
      `;
      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = 'Please search for a valid city.';
    });

  msg.textContent = '';
  form.reset();
  input.focus();
});
