$(document).ready(function(){

    let tmodal = $('#modal-save-category')
    //Submit
    $('#btnAddCategory').on('click',function(){
        $shortcode = $('#txtAddShortCode').val();
        $categoryname = $('#txtAddCategoryName').val(); 

        if ($('#formSaveProductCategory')[0].checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            $.ajax({
                type:'POST',
                url: 'category/save/',
                data:{
                    csrfmiddlewaretoken: $('#formSaveProductCategory input[name=csrfmiddlewaretoken]').val(),
                    shortcode: $shortcode,
                    categoryname: $categoryname
                },
                success:function(){
                    util.showAlert($('#modal-save-category'),'Product Category successfully saved');
                    tblCategory.reload();

                    $('#formSaveProductCategory')
                    .find("input[type=text],textarea,select")
                        .val('')
                        .end()
                    .find("input[type=checkbox], input[type=radio]")
                        .prop("checked", "")
                        .end();

                    $('.was-validated').removeClass('was-validated');

                    $('#modal-save-category #txtShortCode').focus();

                },
                fail: function(){

                }
            });
        }

        $('#formSaveProductCategory').addClass('was-validated');

    });

    //SEARCH
    $('#modal-save-category').find('#txtSearchShortCode, #txtSearchCategoryName').keypress(function(event){
        if(event.keyCode == 13){
            tblCategory.reload();
        }
    });

    //Focus on first input
    $('#modal-save-category').on('shown.bs.modal', function () {
        $('#modal-save-category #txtAddShortCode').focus();
        if ( ! $.fn.DataTable.isDataTable('#tblProductCategory' ) ) {
            tblCategory.init();
        }
        else{
            tblCategory.reload();
        }
    })  

    //Data Table
    var tblCategory ={
        table:null,
        init:function () {
            // alert();
            
            tblCategory.table = $('#tblProductCategory').DataTable({
                ajax:{
                    url:'category/get',
                    type:'GET',
                    data: function(data){
                        $shortcode = $('#modal-save-category').find('#txtSearchShortCode').val();
                        $categoryname = $('#modal-save-category').find('#txtSearchCategoryName').val(); 
                        data.shortcode = $shortcode;
                        data.categoryname = $categoryname;
                    },
                    dataSrc:'data'
                },
                columns:[
                    { data: 'shortcode' },
                    { data: 'categoryname' }
                ],
                serverSide:true,
                pageLength:20,
                rowId: 'categoryid',
                searching: false,
                ordering:  false,
                bLengthChange : false, //thought this line could hide the LengthMenu
                // bInfo:false,    
            });
        },
        reload: function(){
            tblCategory.table.ajax.reload();
        }
    }
    
});