/* Jquery handling amenities checkbox */
let checkedAmenityIds = [];
let checkedAmenityNames = [];

$(document).ready(function () {
	/* ************************* */
	/* handle amenity check box */
	const inputs = $('.amenities input[type="checkbox"]');

	const build_articles = (response) => {
		$('SECTION.places').text('');
		response.forEach(element => {
			const name = element.name;
			const desc = element.description;
			const guests = element.max_guest !== 1 ? `${element.max_guest} Guests` : `${element.max_guest} Guest`;
			const baths = element.number_bathrooms !== 1 ? `${element.number_bathrooms} Bathrooms` : `${element.number_bathrooms} Bathroom`;
			const rooms = element.number_rooms !== 1 ? `${element.number_rooms} Bedrooms` : `${element.number_rooms} Bedroom`;
			const price = `$${element.price_by_night}`;

			$('SECTION.places').append(`\
                    <article>
                    <div class="title_box">
                    <h2 style="max-width:75%">${name}</h2>
                    <div class="price_by_night">${price}</div>
                    </div>
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
                    </div>
                    </article>`);
		});
	}


	inputs.each(function (index, input) {
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

	$('SECTION.places').text('Loading . . .');
	$.ajax({
		type: 'POST',
		url: 'http://0.0.0.0:5001/api/v1/places_search',
		data: '{}',
		contentType: 'application/json',
		success: function (response) {
			build_articles(response)
		},
		error: function (xhr, status, error) {
			console.log(error);
		}
	});

	/* **************************************************** */
	/* Make a post request when the button is clicked */
	$('.filters button').on('click', () => {
		$.ajax({
			type: 'POST',
			url: 'http://0.0.0.0:5001/api/v1/places_search',
			data: JSON.stringify({ amenities: checkedAmenityIds }),
			contentType: 'application/json',
			success: function (response) {
				build_articles(response)
			},
			error: function (xhr, status, error) {
				console.log(error);
			}
		});
	});
});
