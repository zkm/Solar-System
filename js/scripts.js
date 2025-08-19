$(document).ready(function () {
  const $body = $("body");
  const $universe = $("#universe");
  const $solarSystem = $("#solar-system");

  function init() {
    $body
      .removeClass("view-2D opening")
      .addClass("view-3D")
      .delay(2000)
      .queue(function () {
        $(this).removeClass("hide-UI").addClass("set-speed");
        $(this).dequeue();
      });
  }

  function setView(view) {
    $universe.removeClass().addClass(view);
  }

  function toggleData() {
    $body.toggleClass("data-open data-close");
  }

  function toggleControls() {
    $body.toggleClass("controls-open controls-close");
  }

  function selectData(e) {
    const ref = $(this).attr("class");
    $solarSystem.removeClass().addClass(ref);
    $(this).parent().find("a").removeClass("active");
    $(this).addClass("active");
    e.preventDefault();
  }

  function toggleView() {
    $body.toggleClass("view-3D view-2D");
  }

  function toggleZoom() {
    $body.toggleClass("zoom-large zoom-close");
  }

  function setSpeed() {
    setView("scale-stretched set-speed");
  }

    function setSize() {
      setView("scale-s set-size");
    }
  
  });

