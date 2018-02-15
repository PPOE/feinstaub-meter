(function ($) {
  'use strict';

  $(function () {

    if (navigator.userAgent.match(/iPhone|iPad|Android/i)) {
      $('.share-btn.whatsapp,.share-btn.facebook-messenger').css('display', 'inline-block');
    }

    $('button').on('click', function (event) {
      if ($('article').hasClass('show')) {
        $('article').removeClass('show');
      } else {
        $('article').addClass('show');
      }
    });

    $('article .close').on('click', function(event) {
      event.preventDefault();
      $('article').removeClass('show');
    });

    $('html, body, .content, .headline, div, svg').on('click', function(event) {
      if (event.target !== this) {
        return;
      }
      $('article').removeClass('show');
    });

    $(document).keyup(function(event) {
      if (event.keyCode === 27) { // esc
        $('article').removeClass('show');
      }
    });

    var particleValue = 0;

    var url = 'https://feinstaub-meter.petergrassberger.at/index.php';
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

      $('#meter #number').text(Math.round(particleValue));
      if (particleValue > 120) {
        $('#meter #pointer').attr('fill', 'red');
      }
      if (particleValue > 140) {
        particleValue = 140;
      }

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
