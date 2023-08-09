let viewproductcategory={
    modal:$('#modal-view-category'),
    tblCategory:{
        table:null,
        init:function () {
            // alert();
            
            viewproductcategory.tblCategory.table = viewproductcategory.modal.find('#tblProductCategory').DataTable({
                ajax:{
                    url:'category/get',
                    type:'GET',
                    data: function(data){
                        $shortcode = viewproductcategory.modal.find('#txtSearchShortCode').val();
                        $categoryname = viewproductcategory.modal.find('#txtSearchCategoryName').val(); 
                        data.shortcode = $shortcode;
                        data.categoryname = $categoryname;
                    },
                    dataSrc:'data'
                },
                columns:[
                    {data:'categoryid',render: function ( data, type, row ){
                            // return '<a class="action-btn" data-toggle="dropdown" href="#">Actions</a>';
                            return '<div class="">\
                                <a class="action-btn" data-toggle="dropdown" href="#">Actions</a>\
                                <div class="dropdown-menu">\
                                    <a href="#" class="dropdown-item edit-category" data-backdrop="static" data-dismiss="modal" data-toggle="modal" data-target="#modal-save-category">Edit</a>\
                                    <a href="#" class="dropdown-item">Delete</a>\
                                </div>\
                            </div>';
                        }
                    },
                    { data: 'shortcode' },
                    { data: 'categoryname' }
                ],
                serverSide:true,
                pageLength:10,
                rowId: 'categoryid',
                searching: false,
                ordering:  false,
                bLengthChange : false, //thought this line could hide the LengthMenu
                // bInfo:false,    
                columnDefs: [{
                    targets: 0,
                    className: 'action-col'
                }],
                initComplete:function(settings, json) {
                    viewproductcategory.modal.find('#tblProductCategory tbody').on('click', '.edit-category', function () {
                        var row = viewproductcategory.tblCategory.table.row($(this).closest('tr'));
                        var data = row.data();

                        saveproductcategory.params.categoryid = data.categoryid;
                        saveproductcategory.params.categoryname = data.categoryname;
                        saveproductcategory.params.shortcode = data.shortcode;
                    });
                }
            });

            
        },
        reload: function(){
            viewproductcategory.tblCategory.table.ajax.reload();
        },
        editCategory:function(){

        }
    },
    init: function(){
        //ON MODAL SHOWN
        viewproductcategory.modal.on('shown.bs.modal', function () {
            //FOCUS ON FIRST INPUT
            viewproductcategory.modal.find('#txtSearchShortCode').focus();

            ////LOAD TABLE
            if ( ! $.fn.DataTable.isDataTable('#tblProductCategory' ) ) {
                viewproductcategory.tblCategory.init();
            }
            else{
                viewproductcategory.tblCategory.reload();
            }
        });

        //ON MODAL CLOSE
        viewproductcategory.modal.on('hidden.bs.modal', function () {
            util.hideAlert(viewproductcategory.modal);
        });

        //SEARCH
        viewproductcategory.modal.find('#txtSearchShortCode, #txtSearchCategoryName').keypress(function(event){
            if(event.keyCode == 13){
                viewproductcategory.tblCategory.reload();
            }
        });

        window.onbeforeunload = function() {
            if (viewproductcategory.modal.hasClass('show')) {
                return 'Changes you made may not be saved.';
            }
            return undefined;
            }
    }

}

$(document).ready(function(){
    viewproductcategory.init();
});