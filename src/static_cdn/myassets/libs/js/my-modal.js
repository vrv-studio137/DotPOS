$('.modal').on('hidden.bs.modal', function (e) {
    $(this)
      .find("input[type=text],textarea,select")
         .val('')
         .end()
      .find("input[type=checkbox], input[type=radio]")
         .prop("checked", "")
         .end();
    $('.was-validated').removeClass('was-validated');
  })

