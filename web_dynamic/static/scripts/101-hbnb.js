/* Jquery handling amenities checkbox */
let checkedAmenityIds = [];
let checkedAmenityNames = [];

$(document).ready(function () {
	/* ************************* */
	/* handle amenity check box */
	const amenityInputs = $('.amenity_check');


	/* Append reviews to articles*/
	const appendReviews = async (response) => {
		for (const element of response) {
			const place_id = element.id;
			const data = await $.get(`http://0.0.0.0:5001/api/v1/places/${place_id}/reviews`);
			element.review = data;
		}
		buildArticles(response, true);
	};


	/* ******************************* */
	/* Build the articles html */
	const buildArticles = (response, hasReview) => {
		$('SECTION.places').empty();
		$('SECTION.places').text('Loading . . .');
		$('SECTION.places').empty();
		response.forEach(element => {
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
			</div>`

			if (hasReview === true) {
				if ('review' in element) {
					textToAppend = textToAppend + `<div class=reviews data-id=${element.id} > <h2 style="display:inline;">${element.review.length} Reviews </h2> <span class="toggle_review" data-id=${element.id}>Hide</span>`
					element.review.forEach((data => {
						textToAppend = textToAppend + `<h3>From Kamie Nean the 6th September 2017</h3><p>${data.text}</p>`
					}))
				}
			}
			textToAppend = textToAppend + "</div> </article>"
			$("SECTION.places").append(textToAppend);
		});
	}

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


	/* *************************** */
	/* Toggle the review on click hide/show */
	$('.toggle_review').on('click', (e) => { 
		console.log(id)
		const id = $(e.target).data('id');
		
		const $header = $(`#review_${id} h3`);
		const $body = $(`#review_${id} p`);
	  
		if ($('.toggle_review').text() === 'Hide')
		{
		  $header.hide();
		  $body.hide();
		  $(`.toggle_review[data-id="${id}"]`).text('Show');
		}
		else
		{
		  $header.show();
		  $body.show();
		  $(`.toggle_review[data-id="${id}"]`).text('Hide');
		}
	  });

});
