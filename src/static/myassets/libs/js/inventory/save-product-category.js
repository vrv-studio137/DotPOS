let saveproductcategory={
    modal:$('#modal-save-category'),
    params:{
        categoryid:0,
        categoryname:'',
        shortcode:''
    },
    save: function(closeOnSave){
        $shortcode = saveproductcategory.modal.find('#txtAddShortCode').val();
        $categoryname = saveproductcategory.modal.find('#txtAddCategoryName').val(); 

        $.ajax({
            type:'POST',
            url: 'category/save/',
            data:{
                csrfmiddlewaretoken: saveproductcategory.modal.find('#formSaveProductCategory input[name=csrfmiddlewaretoken]').val(),
                categoryid: saveproductcategory.params.categoryid,
                shortcode: $shortcode,
                categoryname: $categoryname
            },
            success:function(res){
                if(res.message=='success'){
                    util.showAlertSuccess(saveproductcategory.modal,'Product Category successfully saved');

                    saveproductcategory.modal.find('#formSaveProductCategory')
                    .find("input[type=text],textarea,select")
                        .val('')
                        .end()
                    .find("input[type=checkbox], input[type=radio]")
                        .prop("checked", "")
                        .end();

                    $('.was-validated').removeClass('was-validated');

                    if(closeOnSave){
                        saveproductcategory.modal.find('#btnClose').click();
                    }
                    else{
                        saveproductcategory.modal.find('#txtAddShortCode').focus();
                    }

                }else{
                    // for (let i = 0; i < res.message.length; ++i) {
                    //     let invalid = saveproductcategory.modal.find('#'+res.message[i][0]+'-invalid');
                    //     invalid.innerHtml = res.message[0][1];
                    //     alert(invalid.attr('id'));
                    // }
                    util.showAlertFail(saveproductcategory.modal,res.message[0][1],saveproductcategory.modal.find('input[name='+ res.message[0][0]+']'));
                }
                
            },
            fail: function(res){
                
            }
        });
    },
    resetParamter:function(){
        saveproductcategory.params.categoryid = 0;
        saveproductcategory.params.categoryname = '';
        saveproductcategory.params.shortcode = '';
        saveproductcategory.modal.find('#formSaveProductCategory')
                .find("input[type=text],textarea,select")
                    .val('')
                    .end()
                .find("input[type=checkbox], input[type=radio]")
                    .prop("checked", "")
                    .end();

                $('.was-validated').removeClass('was-validated');
    },
    init: function(){
        saveproductcategory.modal.find('input[type="text"]').on('focus',function(){
            $(this).select();
        });

        //ON MODAL SHOWN
        saveproductcategory.modal.on('show.bs.modal', function () {
            //FOCUS ON FIRST INPUT
            
            if(saveproductcategory.params.categoryid != 0){
                saveproductcategory.modal.find('.card-title').html('Edit '+saveproductcategory.params.categoryname);
                saveproductcategory.modal.find('#txtAddShortCode').val(saveproductcategory.params.shortcode);
                saveproductcategory.modal.find('#txtAddCategoryName').val(saveproductcategory.params.categoryname);
                saveproductcategory.modal.find('#btnSaveAddMore').hide();
            }else{
                saveproductcategory.modal.find('.card-title').html('New Category');
                saveproductcategory.modal.find('#btnSaveAddMore').show();
            }


        });

        saveproductcategory.modal.on('shown.bs.modal',function(){
            saveproductcategory.modal.find('#txtAddShortCode').focus();
        });

        //ON MODAL CLOSE
        saveproductcategory.modal.on('hidden.bs.modal', function () {
            util.hideAlert(saveproductcategory.modal);

            //RESET PARAMETER
            saveproductcategory.resetParamter();
        });

        //Submit
        saveproductcategory.modal.find('#btnSaveClose').on('click',function(){

            if (saveproductcategory.modal.find('#formSaveProductCategory')[0].checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {

                if(saveproductcategory.params.categoryid == 0){
                    saveproductcategory.save(true);
                }else{
                    util.confirmDialog('Confirmation','Save changes for this category?',function(){saveproductcategory.save(true)})
                }

            }

            saveproductcategory.modal.find('#formSaveProductCategory').addClass('was-validated');

        });

        saveproductcategory.modal.find('#btnSaveAddMore').on('click',function(){
            
            if ($('#formSaveProductCategory')[0].checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                if(saveproductcategory.params.categoryid == 0){
                    saveproductcategory.save(false);
                }else{
                    util.confirmDialog('Confirmation','Save changes for this category?',function(){saveproductcategory.save(false)})
                }
            }

            saveproductcategory.modal.find('#formSaveProductCategory').addClass('was-validated');

        });

        window.onbeforeunload = function() {
            if (saveproductcategory.modal.hasClass('show')) {
                return 'Changes you made may not be saved.';
            }
            return undefined;
            }

    }

}

$(document).ready(function(){
    saveproductcategory.init();
});