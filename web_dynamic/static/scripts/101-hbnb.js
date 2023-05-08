/* Jquery handling amenities checkbox */
let checkedAmenityIds = [];
let checkedAmenityNames = [];

$(document).ready(function () {
  /* *************************** */
  /* handle date conversion */
  function getDayOrdinalSuffix (day) {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  /* ************************* */
  /* Wait while page loads */
  $('SECTION.places').text('Loading . . .');
  /* ************************* */

  /* handle amenity check box */
  const amenityInputs = $('.amenity_check');

  /* Append reviews to articles */
  const appendReviews = async (response) => {
    for (const element of response) {
      const placeId = element.id;
      const data = await $.get(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`);
      for (const review of data) {
        const userId = review.user_id;
        const user = await $.get(`http://0.0.0.0:5001/api/v1/users/${userId}`);
        review.user = user;

        const dateString = review.updated_at;
        const date = new Date(dateString);

        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();

        const dayOrdinalSuffix = getDayOrdinalSuffix(day);

        const formattedDate = `${day}${dayOrdinalSuffix} ${month} ${year}`;
        review.date = formattedDate;
      }

      element.review = data;
    }
    buildArticles(response, true);
  };

  /* ******************************* */
  /* Build the articles html */
  const buildArticles = (response, hasReview) => {
    $('SPAN.toggle_review').click(e => {
      e.preventDefault();
      /* const currText = $('SPAN.toggle_review').text() */
      const currId = e.target.id;
      const header = $(`.reviewh_${currId}`);
      const paragraph = $(`.reviewp_${currId}`);

      if ($(`#${e.target.id}`).text() === 'Hide') {
        header.show();
        paragraph.show();
        $(`#${e.target.id}`).text('Show');
      } else {
        header.hide();
        paragraph.hide();
        $(`#${e.target.id}`).text('Hide');
      }
    });

    $('SECTION.places').text('Loading . . .');
    $('SECTION.places').empty();
    response.forEach((element) => {
      const name = element.name;
      const desc = element.description;
      const guests = element.max_guest !== 1 ? `${element.max_guest} Guests` : `${element.max_guest} Guest`;
      const baths = element.number_bathrooms !== 1 ? `${element.number_bathrooms} Bathrooms` : `${element.number_bathrooms} Bathroom`;
      const rooms = element.number_rooms !== 1 ? `${element.number_rooms} Bedrooms` : `${element.number_rooms} Bedroom`;
      const price = `$${element.price_by_night}`;

      let textToAppend = `<article>
            <div class="title_box" >
            <h2 style="max-width:75%;">${name}</h2>
            <div class="price_by_night">${price}</div>
            </div >
            <div class="information">
            <div class="max_guest">${guests}</div>
            <div class="number_rooms">${rooms}</div>
            <div class="number_bathrooms">${baths}</div>
            </div>
            <div class="user">
            <b>Owner:</b> John Doe
            </div>
            <div class="description">
            ${desc}
            </div>`;

      if (hasReview === true) {
        if ('review' in element) {
          textToAppend = textToAppend + `<div class=reviews > <h2 style="display:inline;">${element.review.length} Reviews </h2> <span id=${element.id} class="toggle_review" data-id=${element.id}>Hide</span>`;

          element.review.forEach(data => {
            const firstName = data.user.first_name;
            const lastName = data.user.last_name;
            const username = `${firstName} ${lastName}`;
            const dateMade = data.date;

            textToAppend = textToAppend + `<h3 class="reviewh_${element.id}" >From ${username} the ${dateMade}</h3><p class="reviewp_${element.id}" >${data.text}</p>`;
          });
        }
      }
      textToAppend = textToAppend + '</div> </article>';
      $('SECTION.places').append(textToAppend);
    });

    $('SPAN.toggle_review').click(e => {
      e.preventDefault();
      /* const currText = $('SPAN.toggle_review').text() */
      const currId = e.target.id;
      const header = $(`.reviewh_${currId}`);
      const paragraph = $(`.reviewp_${currId}`);

      if ($(`#${e.target.id}`).text() === 'Hide') {
        header.hide();
        paragraph.hide();
        $(`#${e.target.id}`).text('Show');
      } else {
        header.show();
        paragraph.show();
        $(`#${e.target.id}`).text('Hide');
      }
    });
  };

  /* ****************************** */
  /* handle amenity check boxes */
  amenityInputs.each(function (index, input) {
    $(this).on('change', (e) => {
      const amenityId = e.target.dataset.id;
      const amenityName = e.target.dataset.name;

      /* add amenities to list */
      if (e.target.value === 'on') {
        if (!(checkedAmenityIds.includes(amenityId))) {
          checkedAmenityIds.push(amenityId);
          checkedAmenityNames.push(amenityName);
        }
      }
      if (e.target.value === 'off') {
        if (checkedAmenityIds.includes(amenityId)) {
          checkedAmenityIds = checkedAmenityIds.filter(value => value !== amenityId);
          checkedAmenityNames = checkedAmenityNames.filter(value => value !== amenityName);
        }
      }

      /* toggle checkbox values */
      if (e.target.value === 'on') {
        e.target.value = 'off';
      } else {
        e.target.value = 'on';
      }

      /* update h4 tag */
      $('.amenities h4').html('&nbsp;');
      let amenityText = checkedAmenityNames.join(', ');
      if (checkedAmenityNames.length === 0) {
        $('.amenities h4').html('&nbsp;');
      } else if (amenityText.length > 30) {
        amenityText = amenityText.slice(0, 30) + '...';
        $('.amenities h4').text(amenityText);
      } else {
        $('.amenities h4').text(amenityText);
      }
    });
  });

  /* *************************************** */
  /* handle http return status */
  const statusElem = $('div#api_status');
  $.get('http://0.0.0.0:5001/api/v1/status', (res) => {
    if (res.status === 'OK') {
      statusElem.addClass('available');
      statusElem.removeAttr('id');
    } else {
      statusElem.attr('id', 'api_status');
      statusElem.removeClass('available');
    }
  });

  /* *************************************************** */
  /* Handle places search and update articles from frontend */
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    data: JSON.stringify({}),
    contentType: 'application/json',
    success: function (response) {
      appendReviews(response);
    },
    error: function (xhr, status, error) {
      console.log(error);
    }
  });

  /* ************************* */
  /* handle state check box */
  let checkedStateIds = [];
  let checkedStateCityNames = [];
  const stateInputs = $('.state_check');

  stateInputs.each(function (index, input) {
    $(this).on('change', (e) => {
      const stateId = e.target.dataset.id;
      const stateName = e.target.dataset.name;

      /* add states to list */
      if (e.target.value === 'on') {
        if (!(checkedStateIds.includes(stateId))) {
          checkedStateIds.push(stateId);
          checkedStateCityNames.push(stateName);
        }
      }
      if (e.target.value === 'off') {
        if (checkedStateIds.includes(stateId)) {
          checkedStateIds = checkedStateIds.filter(value => value !== stateId);
          checkedStateCityNames = checkedStateCityNames.filter(value => value !== stateName);
        }
      }

      /* toggle checkbox values */
      if (e.target.value === 'on') {
        e.target.value = 'off';
      } else {
        e.target.value = 'on';
      }

      /* update h4 tag */
      $('.locations h4').html('&nbsp;');
      let stateCityText = checkedStateCityNames.join(', ');
      if (checkedStateCityNames.length === 0) {
        $('.locations h4').html('&nbsp;');
      } else if (stateCityText.length > 24) {
        stateCityText = stateCityText.slice(0, 24) + '...';
        $('.locations h4').text(stateCityText);
      } else {
        $('.locations h4').text(stateCityText);
      }
    });
  });

  /* ******************************* */
  /* handle checkbox for cities */
  const cityInputs = $('.city_check');
  let checkedCityIds = [];

  cityInputs.each(function (index, input) {
    $(this).on('change', (e) => {
      const cityId = e.target.dataset.id;
      const cityName = e.target.dataset.name;

      /* add cities to list */
      if (e.target.value === 'on') {
        if (!(checkedCityIds.includes(cityId))) {
          checkedCityIds.push(cityId);
          checkedStateCityNames.push(cityName);
        }
      }
      if (e.target.value === 'off') {
        if (checkedCityIds.includes(cityId)) {
          checkedCityIds = checkedCityIds.filter(value => value !== cityId);
          checkedStateCityNames = checkedStateCityNames.filter(value => value !== cityName);
        }
      }

      /* toggle checkbox values */
      if (e.target.value === 'on') {
        e.target.value = 'off';
      } else {
        e.target.value = 'on';
      }

      /* update h4 tag */
      $('.locations h4').html('&nbsp;');
      let stateCityText = checkedStateCityNames.join(', ');
      if (checkedStateCityNames.length === 0) {
        $('.locations h4').html('&nbsp;');
      } else if (stateCityText.length > 24) {
        stateCityText = stateCityText.slice(0, 24) + '...';
        $('.locations h4').text(stateCityText);
      } else {
        $('.locations h4').text(stateCityText);
      }
    });
  });

  /* **************************************************** */
  /* Make a post request when the button is clicked */
  $('.filters button').on('click', () => {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      data: JSON.stringify({ amenities: checkedAmenityIds, states: checkedStateIds, cities: checkedCityIds }),
      contentType: 'application/json',
      success: function (response) {
        appendReviews(response);
      },
      error: function (xhr, status, error) {
        console.log(error);
      }
    });
  });
});
