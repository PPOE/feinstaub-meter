(function ($) {
  'use strict';

  $(function () {

    var particleValue = 0;

    var url = 'https://kamerascheu.at/feinstaub.php';
    $.get(url, function (data) {
      particleValue = data.value;
      startAnimation();
    }, 'json');

    function degrees(radians) {
      return radians * 180 / Math.PI;
    }

    function startAnimation() {
      var $meter = $('#meter');
      var $pointer = $('#pointer', $meter);

      //$pointer.attr('transform', 'rotate(45 250 250)');
      //$pointer.css('transform', 'rotate(45deg)');

      particleValue %= 120;

      var position = degrees(((particleValue) / 80) * Math.PI);

      var start = null;
      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;

        if (progress > 100) {
          draw();
          start = timestamp;
        }

        window.requestAnimationFrame(step);
      }

      var variance = 5;
      function draw() {
        var animationPosition = position + (Math.random() * variance) - (variance / 2);
        $pointer.css('transform', 'rotate(' + animationPosition + 'deg)');
      }

      window.requestAnimationFrame(step);
    };

  });

})(jQuery);