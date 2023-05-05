/* Jquery handling amenities checkbox */
let checked_amenity_ids = [];
let checked_amenity_names = []

$(document).ready(function () {
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
      else if (amenityText.length > 17) {
        amenityText = amenityText.slice(0, 17) + '...';
        $('.amenities h4').text(amenityText);
      }
      else {
        $('.amenities h4').text(amenityText);
      }
    })
  });
})