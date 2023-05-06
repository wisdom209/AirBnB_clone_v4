/* Jquery handling amenities checkbox */
let checkedAmenityIds = [];
let checkedAmenityNames = [];

$(document).ready(function () {
  const inputs = $('input[type="checkbox"]');

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
      } else if (amenityText.length > 17) {
        amenityText = amenityText.slice(0, 17) + '...';
        $('.amenities h4').text(amenityText);
      } else {
        $('.amenities h4').text(amenityText);
      }
    });
  });
});
