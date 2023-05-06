/* Jquery handling amenities checkbox */
let checkedAmenityIds = [];
let checkedAmenityNames = [];

$(document).ready(function () {
  /* ************************* */
  /* handle amenity check box */
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
    console.log(res);
    if (res.status === 'OK') {
      statusElem.addClass('available');
      statusElem.removeAttr('id');
    } else {
      statusElem.attr('id', 'api_status');
      statusElem.removeClass('available');
    }
  });
});
