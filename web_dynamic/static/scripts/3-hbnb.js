/* Jquery handling amenities checkbox */
let checked_amenity_ids = [];
let checked_amenity_names = []

$(document).ready(function () {
	/* ************************* */
	/* handle amenity check box */
	const inputs = $('input[type="checkbox"]')

	inputs.each(function (index, input) {
		$(this).on('change', (e) => {
			const amenity_id = e.target.dataset.id;
			const amenity_name = e.target.dataset.name;

			/* add amenities to list */
			if (e.target.value === 'on') {
				if (!(checked_amenity_ids.includes(amenity_id))) {
					checked_amenity_ids.push(amenity_id)
					checked_amenity_names.push(amenity_name)
				}
			}
			if (e.target.value === 'off') {
				if (checked_amenity_ids.includes(amenity_id)) {
					checked_amenity_ids = checked_amenity_ids.filter(value => value !== amenity_id)
					checked_amenity_names = checked_amenity_names.filter(value => value !== amenity_name);
				}
			}

			/* toggle checkbox values */
			if (e.target.value === 'on') {
				e.target.value = 'off'
			}
			else {
				e.target.value = 'on'
			}

			/* update h4 tag */
			$('.amenities h4').html('&nbsp;');
			let amenityText = checked_amenity_names.join(', ');
			if (checked_amenity_names.length === 0) {
				$('.amenities h4').html('&nbsp;');
			}
			else if (amenityText.length > 30) {
				amenityText = amenityText.slice(0, 30) + '...';
				$('.amenities h4').text(amenityText);
			}
			else {
				$('.amenities h4').text(amenityText);
			}
		})
	});

	/* *************************************** */
	/* handle http return status */

	const statusElem = $('div#api_status')
	let apiStatus = ""
	$.get('http://0.0.0.0:5001/api/v1/status', (res) => {
		if (res.status === "OK") {
			statusElem.addClass('available');
			statusElem.removeAttr('id')
		}
		else {
			statusElem.attr('id', 'api_status');
			statusElem.removeClass('available');
		}
	})


	/* *************************************************** */
	/* Handle places search */
	let mydata = {}
	$('SECTION.places').text("Loading . . .")
	$.ajax({
		type: 'POST',
		url: 'http://0.0.0.0:5001/api/v1/places_search',
		data: '{}',
		contentType: 'application/json',
		success: function (response) {
			$('SECTION.places').text('')
			response.forEach(element => {
				let name = element.name;
				let desc = element.description
				let guests = element.max_guest ? `${element.max_guest} Guests` : `${element.max_guest} Guest`
				let baths = element.number_bathrooms ? `${element.number_bathrooms} Bathrooms` : `${element.number_bathrooms} Bathroom`
				let rooms = element.number_rooms ? `${element.number_rooms} Bedrooms` : `${element.number_rooms} Bedroom`
				let price = `$${element.price_by_night}`

				$('SECTION.places').append(`\
					<article>
					<div class="title_box">
					<h2>${name}</h2>
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
					</article>`)
			});
		},
		error: function (xhr, status, error) {
			console.log(error)
		}
	});
})
