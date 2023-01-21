$(document).ready(function () {
  // dev
  // $('#mySidebar').slideToggle(300);
  // $(".Audit-detail-page").slideUp();
  // $(".forms_sec").removeClass("d-none");
  // $('.logo-header').css('display', 'block');
  // $('#main').css('margin-left', '0px');
  // $('.openbtn').css('display', 'none');
  // dev ---
  $('#submit').click(function () {
    setTimeout(() => {
      $('.loader').fadeOut();
    }, 1800);

    $('.wp-msg').remove();
    var wpError = true;
    var vesselName = $('#ves_name').val();
    var shipName = $('#smname').val();
    var masterName = $('#master').val();
    var dateOne = $('#datepicker').val();
    var portName = $('#portInsp').val();
    var inspectName = $('#inspectorName').val();
    var attachFile = $('#input').val();
    var imoNumber = $('#imoNum').val();
    var vesselType = $('#vess_type').val();
    var dateTwo = $('#datepicker1').val();
    var shipYard = $('#shipYard').val();
    var yardCountry = $('#shipYardCntry').val();
    var sizeGrt = $('#sizeGRT').val();
    var regName = /^[a-z 0-9,.'-]+$/i;
    var This = $(this);

    //
    if (!/\.(xlsx|xls|xlsm)$/i.test(attachFile)) {
      wpError = false;
      This.parents()
        .find('#form #input')
        .after(
          '<div class="wp-msg ctt-name-msg excelError">Please attach excel file</div>',
        );
    }

    //
    if (!regName.test(vesselName)) {
      wpError = false;
      This.parents()
        .find('#form #ves_name')
        .after('<div class="wp-msg ctt-name-msg">Enter a valid name</div>');
    }

    if (shipName.length <= 1) {
      wpError = false;
      This.parents()
        .find('#form #smname')
        .after('<div class="wp-msg ctt-name-msg">Enter a valid name</div>');
    }

    if (masterName.length <= 1) {
      wpError = false;
      This.parents()
        .find('#form #master')
        .after('<div class="wp-msg ctt-name-msg">Enter a valid name</div>');
    }

    if (dateOne.length <= 1) {
      wpError = false;
      This.parents()
        .find('#form #datepicker')
        .after('<div class="wp-msg ctt-name-msg">Enter a valid name</div>');
    }

    if (portName.length <= 1) {
      wpError = false;
      This.parents()
        .find('#form #portInsp')
        .after('<div class="wp-msg ctt-name-msg">Enter a valid name</div>');
    }

    if (inspectName.length <= 1) {
      wpError = false;
      This.parents()
        .find('#form #inspectorName')
        .after('<div class="wp-msg ctt-name-msg">Enter a valid name</div>');
    }

    if (vesselType.length <= 1) {
      wpError = false;
      This.parents()
        .find('#form #vess_type')
        .after('<div class="wp-msg ctt-name-msg">Enter a valid name</div>');
    }

    if (dateTwo.length <= 1) {
      wpError = false;
      This.parents()
        .find('#form #datepicker1')
        .after('<div class="wp-msg ctt-name-msg">Enter a valid name</div>');
    }

    if (shipYard.length <= 1) {
      wpError = false;
      This.parents()
        .find('#form #shipYard')
        .after('<div class="wp-msg ctt-name-msg">Enter a valid name</div>');
    }

    if (yardCountry.length <= 1) {
      wpError = false;
      This.parents()
        .find('#form #shipYardCntry')
        .after('<div class="wp-msg ctt-name-msg">Enter a valid name</div>');
    }

    if (sizeGrt.length <= 1) {
      wpError = false;
      This.parents()
        .find('#form #sizeGRT')
        .after('<div class="wp-msg ctt-name-msg">Enter a valid name</div>');
    }

    if (imoNumber.length <= 1) {
      wpError = false;
      This.parents()
        .find('#form #imoNum')
        // .find("#imoNum")
        .after(
          '<div class="wp-msg  ctt-name-msg">Please enter a valid number</div>',
        );
    }

    if (wpError) {
      $('.loader').fadeIn();
      $('.ctt-name-msg').remove();
      $('.Audit-detail-page').slideUp();
      $('.forms_sec').removeClass('d-none');
      $('#page-top-right').addClass('active');
      $('#side-menu-toggle-btn').css('display', 'none');
      $('.logo-header').css('display', 'block');

      let ves_name = document.querySelector('#ves_name');
      let showVesName = document.querySelector('#showVesName');
      showVesName.innerText = ves_name.value;

      let imoNum = document.querySelector('#imoNum');
      let showimonum = document.querySelector('#showimonum');
      showimonum.innerText = 'IMO ' + imoNum.value;

      let smname = document.querySelector('#smname');
      let showsmname = document.querySelector('#showsmname');
      showsmname.innerText = smname.value;

      let master = document.querySelector('#master');
      let showsmaster = document.querySelector('#showsmaster');
      showsmaster.innerText = master.value;

      let chiefEng = document.querySelector('#chiefEng');
      let showchiefEng = document.querySelector('#showchiefEng');
      showchiefEng.innerText = chiefEng.value;

      let datepicker = document.querySelector('#datepicker');
      let showdatepicker = document.querySelector('#showdatepicker');
      showdatepicker.innerText = datepicker.value;

      let portInsp = document.querySelector('#portInsp');
      let showportInsp = document.querySelector('#showportInsp');
      showportInsp.innerText = portInsp.value;

      let inspectorName = document.querySelector('#inspectorName');
      let showinspectorName = document.querySelector('#showinspectorName');
      showinspectorName.innerText = inspectorName.value;

      let datepicker1 = document.querySelector('#datepicker1');
      let showdatepicker1 = document.querySelector('#showdatepicker1');
      showdatepicker1.innerText = datepicker1.value;

      var sdt = new Date(datepicker1.value);
      var difdt = new Date(new Date() - sdt);
      var diffYear = difdt.toISOString().slice(0, 4) - 1970;
      var diffMonth = difdt.getMonth();
      let showage = document.getElementById('ageofyear');
      var finalyear = diffYear <= 9 ? '0' + diffYear : diffYear;
      var finalmonth = diffMonth <= 9 ? '0' + diffMonth : diffMonth;
      showage.innerText = finalyear + '.' + finalmonth;

      let vess_type = document.querySelector('#vess_type');
      let showvess_type = document.querySelector('#showvess_type');
      showvess_type.innerText = vess_type.value;

      let shipYard = document.querySelector('#shipYard');
      let showshipYard = document.querySelector('#showshipYard');
      showshipYard.innerText = shipYard.value;

      let shipYardCntry = document.querySelector('#shipYardCntry');
      let showshipYardCntry = document.querySelector('#showshipYardCntry');
      showshipYardCntry.innerText = shipYardCntry.value;

      let shipYarsizeGRTdCntry = document.querySelector('#sizeGRT');
      let showsizeGRT = document.querySelector('#showsizeGRT');
      showsizeGRT.innerText = sizeGRT.value;

      $('#mySidebar').slideToggle(300);
      $('#main').css('margin-left', '0px');
      $('.openbtn').css('display', 'none');

      setTimeout(() => {
        handleFileSelect1($('#input')[0]);
        handleFileSelect2($('#input')[0]);
        handleFileSelect3($('#input')[0]);
      }, 300);
    }
  });

  // print page
  (function () {
    const btn = document.getElementById('print-report-btn');

    btn.addEventListener('click', (e) => {
      // $("body").css("maxWidth", '1110px');
      e.preventDefault();
      window.print();
    });
  })();
});
