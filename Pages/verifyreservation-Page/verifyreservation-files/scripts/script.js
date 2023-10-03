var imagess = "";
var TableData = null;
var plusurl = ""
var selected;
var selectedres = null;
var hotelsel = null;
var cancelselect;

if(window.location.href.indexOf('/en') == -1){
    plusurl =  '/ar';
    $('#lang').text('AR ');
}else{
    plusurl = '/en';
    $('#lang').text('EN ');
}
$('#langch').on('click',function(){
    if($('#lang').text() == '/ar'){
        window.location.href =   window.location.origin + '/clients/ar/';
    }else{
        window.location.href =   window.location.origin + '/clients/en/';
    }
})


function formatdatearr(row,date){
    return `<p class="h5"> ${(new Date(new Date(row) - (new Date(row).getTimezoneOffset() * 60000)).toISOString().split("T"))[0].toString()} </p>`;
}
function formatdatedep(row,date){
    return `<p class="h5"> ${(new Date(new Date(row) - (new Date(row).getTimezoneOffset() * 60000)).toISOString().split("T"))[0].toString()} </p>`;
}


function loadingTemplate(loadingMessage) {return '<div class="spinner-grow" role="status"></div><div class="spinner-grow" role="status"></div><div class="spinner-grow" role="status"></div>'}


function ID(data){return '<h3 id="cid"> '+  data.length +' </h3>';}
async function EditRouter(which){
    if($('tfoot').is(":hidden")){$('tfoot').removeAttr('hidden')}
    $('#tablereservation').bootstrapTable('hideLoading')  
    $('#id').val( JSON.parse(which)['id']) 
    $('#cid').text( JSON.parse(which)['id'])
}

function formatzbon(row,data){
    var back = ["blue","black"];
    var dom = "";
    var k = 0;
    row.split(',').forEach((val)=>{
        if(dom == ""){
            dom  =`${`<div style="color: ${back[k]};">${val}</div>`}`
        }else{
            dom  = dom + ` <hr class="my-0">${`<div style="color: ${back[k]};">${val}</div>`}`
        }
        k = k+1;
        if(k == 2){k = 0}
    })
    return dom 
}

function count(row,data){
    return  `<p class="h5 text-dark">${row.split(',').length}</p>`;
}

function formatcolor(row,data){
    return `<h4 class="h5 font-weight-bold" style="color: green"> ${row} <h4>`
}


function Action_edit(row,data){
    return '<div class="btn-group"><div class="horizontalgap" style="width:10px"></div>  <button onclick="DeleteClient(\''+ JSON.stringify(data).replace('\\t','').replace('\\n','').replace(/'/g, '&apos;').replace(/"/g, '&quot;')+'\')" type="button" class="btn btn-success"><i class="fas fa-check fa-lg"></i></button>    <div class="horizontalgap" style="width:10px"></div>  <button onclick="CencelRes(\''+ JSON.stringify(data).replace('\\t','').replace('\\n','').replace(/'/g, '&apos;').replace(/"/g, '&quot;')+'\')" type="button" class="btn btn-danger"><i class="fas fa-window-close fa-lg"></i></button>  </div>'
}    

$.ajax({
    url: "/hotels"+plusurl+"/api/gethotels",
    method: 'GET', 
    dataType: 'text',  
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    },
    error: function(res){
        $('#alertcontain').removeAttr('hidden')
        $('#alertcontain').text('حدث خطا ما ')             
    },
    statusCode:{
        200: async function(response){
        var mydata = JSON.parse(response);
        console.log(mydata)
        for(x=0 ; x< mydata[0].length;x++){
            $('#hotels').append(`
              <option value='${JSON.stringify(mydata[0][x]['id'])}'>
              <h6> ${mydata[0][x]['name']} </h6>
              </option>
            `)
        }
           setTimeout(function() {
            $('#pbar').css('width', '0%').attr('aria-valuenow', 0);
         }, 3000); 
        }
    },
});


$('#hotels').on('change',function(val){
    if($(this).find(":selected").val() == "Show all Hotels"){hotelsel = null; return;}
    hotelsel =  $(this).find(":selected").val()
})

$('#restaurants').on('change', function() {
    if($(this).find(":selected").val() != 'Show all Restaurants'){
        selectedres = JSON.parse($(this).find(":selected").val())['id']
    }else{
        selectedres = null;
    }
});


$.ajax({
    url: "/restaurants"+plusurl+"/api/getrestaurants",
    method: 'GET', 
    dataType: 'text',  
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    },
    error: function(res){
        $('#alertcontain').removeAttr('hidden')
        $('#alertcontain').text('حدث خطا ما ')             
    },
    statusCode:{
        200: async function(response){
        var mydata = JSON.parse(response);
        for(x=0 ; x< mydata[0].length;x++){
            $('#restaurants').append(`
              <option value='${JSON.stringify(mydata[0][x])}'>
              <h6> ${mydata[0][x]['name']} </h6>
              </option>
            `)
        }
           setTimeout(function() {
            $('#pbar').css('width', '0%').attr('aria-valuenow', 0);
         }, 3000); 
        }
    },
});

function CencelRes(which){
    cancelselect = JSON.parse(JSON.parse(JSON.stringify(which)))['id'];
    $('#cancelmodal').modal('show')   
}

function DeleteClient(which){
    selected = JSON.parse(JSON.parse(JSON.stringify(which)))['id'];
    $('#verifymodal').modal('show')   
}


$('#homepag').on('click',function(){
    event.preventDefault();
    window.location.href =   window.location.origin + '/home' + plusurl;
})

function EditItem(i){
    const reg = new RegExp('^[0-9]+$');
    if($('#id').val() == '' || $('#hotel_name').val() == '' || $('#country').val() == '' || $('#about').val() == '' || !reg.test($('#capacity').val()) ){
        $('#alertcontain').removeAttr('hidden')
        $('#erroralert').text('بعض الحقول فارغه او لم يتم اختيار عنصر')
        return
    }
 
    if( i == '15025' ){
        $('#cid').text(' ')
    }
   
        $.ajax({
            url: "/restaurants"+plusurl+"/api/editrestaurant",
            method: 'POST', 
            dataType: 'text',  
           beforeSend: function(xhr) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            },
            data: {
                id:  $('#id').val(),
                name:  $('#hotel_name').val(),
                country: $('#country').val(),
                about: $('#about').val(),
                photo: imagess,
                full_capacity: $('#capacity').val()
            },
            error: function(res){
                $('#alertcontain').removeAttr('hidden')
                $('#erroralert').text('حدث خطا ما ')
            },
            statusCode:{
                200: function(response){
                    var mydata = JSON.parse(response)
                    $('#tablereservation').bootstrapTable('load', mydata[0]); 
                    $('#tablereservation').bootstrapTable('hideLoading')
                    $('#cid').text('')    
                       setTimeout(function() {
                        $('#pbar').css('width', '0%').attr('aria-valuenow', 0);
                     }, 3000);              
                }
            },
        });   
}


$( document ).ready(function() {

   $('#clrall').on('click',function(){
    $('#roomfilter').val('')
    $("#restaurants").val('Show all Restaurants').change(); 
    $("#hotels").val('Show all Hotels').change(); 
    $('#datepicker').val('')
    GetData();
   })
    $('#clrrom').on('click',function(){
        $('#roomfilter').val('')
        GetData();
    })
    $('#clrslct').on('click',function(){
        $("#restaurants").val('Show all Restaurants').change();   
        GetData();
     })
    $('#clrdate').on('click',function(){
        $('#datepicker').val('')
        GetData();
    })

    $('#clrhtl').on('click',function(){
        $("#hotels").val('Show all Hotels').change();   
        GetData();
     })

    




    $(document).keypress(function (e) {
        if (e.which == 13) {
            if(!$('#roomfilter').is(":focus")){
                $('#roomfilter').focus()
                $('#roomfilter').val('')
            }else{
                GetData();
            }
           
        }
      });
    $('#searchbutton').on('click',function(){
        GetData();
    })
  $('#addnewclient').on('click',function(){
    if($('tfoot').is(":visible")){
        $('tfoot').attr('hidden',"true")
    }else{
        $('tfoot').removeAttr('hidden')
    }
  })  

var elem = document.getElementById("pbar");

move();



$('#alertcontain').on('click',function(){
    $('#alertcontain').attr('hidden',true)
    $('#erroralert').text('')
   })

$('#covar').on('click',function(event){
    event.preventDefault();
    location.reload();
})

$('#home').on('click',function(event){
    event.preventDefault();
    $("body").fadeTo(500, 0.1, function() {
        window.location.href =   window.location.origin + '/home' + plusurl;
    });    
})

function move() {
  var i = 0;
  if (i == 0) {
    i = 1;
    var width = 1;
    var id = setInterval(frame, 1);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        $('#pbar').text(width + "%");
        elem.style.width = width + "%";
      }
    }
  }
}
    $.ajax({
        url: "/home"+plusurl+"/api/uname",
        method: 'GET', 
        dataType: 'text',  
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        },
        error: function(res){
            $('#alertcontain').removeAttr('hidden')
             $('#erroralert').text('حدث خطا ما ')
        },
        statusCode:{
            200: function(response){
                if(JSON.parse(response).hasOwnProperty('value')){
                   $('#username').text(JSON.parse(response)['value'].toUpperCase());    
                }
            }
        },
    }); 


    function GetData(){
        $('#tablereservation').bootstrapTable({
            printPageBuilder: function (table) {    
              return `<html>
              <head>
              <style type="text/css" media="print">
              @page {
                size: auto;
                margin: 25px 0 25px 0;
              }
              </style>
              <style type="text/css" media="all">
              table {
                border-collapse: collapse;
                font-size: 12px;
              }
              table, th, td {
                border: 1px solid grey;
              }
              th, td {
                text-align: center;
                vertical-align: middle;
              }
              p {
                font-weight: bold;
                margin-left:20px;
              }
              table {
                width:94%;
                margin-left:3%;
                margin-right:3%;
              }
              div.bs-table-print {
                text-align:center;
              }
              p{
                text-align:center; 
              }
              </style>
              </head>
              <title>Print Table</title>
              <body>
              <p>العملاء</p>
              <div class="bs-table-print">${table}</div>           
              </body>
            </html>`
        }}).bootstrapTable('showLoading')
        $.ajax({
            url: "/verifyreservation"+plusurl+"/api/getreservations",
            method: 'POST', 
            dataType: 'text',  
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            },
            error: function(res){
                $('#alertcontain').removeAttr('hidden')
                $('#alertcontain').text('حدث خطا ما ')     
                console.log(res);         
            },
            data: {
                roomno: $('#roomfilter').val() == '' ? 'null' : $('#roomfilter').val(),
                date:   $('#datepicker').val() == '' ? 'null' : $('#datepicker').val(),
                restaurant: selectedres == null ? 'null' : selectedres,
                hotel: hotelsel == null ? 'null' : hotelsel,
            },
            statusCode:{
                200: function(response){
                var mydata = JSON.parse(response);
                $('#tablereservation').bootstrapTable('load', mydata[0]); 
                $('#tablereservation').bootstrapTable('hideLoading')    
                   setTimeout(function() {
                    $('#pbar').css('width', '0%').attr('aria-valuenow', 0);
                 }, 3000); 
                }
            },
        }); 
    }
    GetData();


    $('#verify').on('click',function(){
        $.ajax({
             url: "/verifyreservation"+plusurl+"/api/verify ",
             method: 'POST', 
             dataType: 'text',  
            beforeSend: function(xhr) {
             xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
             },
             data: {
                 id:  selected,
                 roomno: $('#roomfilter').val() == '' ? 'null' : $('#roomfilter').val(),
                 date:   $('#datepicker').val() == '' ? 'null' : $('#datepicker').val(),
                 restaurant: selectedres == null ? 'null' : selectedres,  
             },
             error: function(res){
                 $('#alertcontain').removeAttr('hidden')
                 $('#erroralert').text('حدث خطا ما ')
             },
             statusCode:{
                 200: function(response){
                     GetData()
                     $('#verifymodal').modal('hide')
                        setTimeout(function() {
                         $('#pbar').css('width', '0%').attr('aria-valuenow', 0);
                      }, 3000);              
                 }
             },
         });
     })


     $('#cancel').on('click',function(){
        $.ajax({
             url: "/verifyreservation"+plusurl+"/api/cancel ",
             method: 'POST', 
             dataType: 'text',  
            beforeSend: function(xhr) {
             xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
             },
             data: {
                 id:  cancelselect,
                 roomno: $('#roomfilter').val() == '' ? 'null' : $('#roomfilter').val(),
                 date:   $('#datepicker').val() == '' ? 'null' : $('#datepicker').val(),
                 restaurant: selectedres == null ? 'null' : selectedres,
                
             },
             error: function(res){
                 $('#alertcontain').removeAttr('hidden')
                 $('#erroralert').text('حدث خطا ما ')
             },
             statusCode:{
                 200: function(response){
                     GetData()
                     $('#cancelmodal').modal('hide')
                        setTimeout(function() {
                         $('#pbar').css('width', '0%').attr('aria-valuenow', 0);
                      }, 3000);              
                 }
             },
         });
     })



    
    
    $('#logout').on('click',function(){
        $.ajax({
            url: "/home"+plusurl+"/api/logout",
            method: 'POST', 
            dataType: 'text',  
           beforeSend: function(xhr) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            },
            error: function(res){
                $('#alertcontain').removeAttr('hidden')
                $('#erroralert').text('حدث خطا ما ')
            },
            statusCode:{
                200: function(response){
                    $("body").fadeTo(1000, 0.1, function() {
                        window.location.href =   window.location.origin + '/login' + plusurl;
                    });      
                }
            },
        }); 
    })

    $('#covar').on('click',function(event){
        event.preventDefault();
            if(window.location.origin.search('companyvariables') <= 0 ){
                $("body").fadeTo(1000, 0.1, function() {
                window.location.href =   window.location.origin + '/companyvariables' + plusurl;
            });   
            }
       })

       
   $('#comvar').on('click',function(event){
    event.preventDefault();
        if(window.location.origin.search('companyvariables') <= 0 ){
            $("body").fadeTo(50, 0.1, function() {
            window.location.href =   window.location.origin + '/companyvariables'+plusurl;
        });   
        }
   })


   $('#hotvar').on('click',function(event){
    event.preventDefault();
        if(window.location.origin.search('companyvariables') <= 0 ){
            $("body").fadeTo(50, 0.1, function() {
             window.location.href =   window.location.origin + '/hotels'+plusurl;
        });   
        }
   })

   $('#resvar').on('click',function(event){
    event.preventDefault();
        if(window.location.origin.search('companyvariables') <= 0 ){
            $("body").fadeTo(50, 0.1, function() {
             window.location.href =   window.location.origin + '/restaurants'+plusurl;
        });   
        }
   })

   $( "#clovar" ).hover(
    function() {
        $(this).animate({  top: "-=10" }, "fast");
        $(this).css("box-shadow","0px 0px 0px 2.5px #ffffff");
        $(this).css("cursor","pointer",);
    }, function() {
        $(this).animate({ top: "+=10" }, "fast");
        $(this).css("box-shadow","0px 0px 0px 0px #ffffff");
    }
  );

  $('#clovar').on('click',function(event){
    event.preventDefault();
        if(window.location.origin.search('companyvariables') <= 0 ){
            $("body").fadeTo(50, 0.1, function() {
             window.location.href =   window.location.origin + '/availabletime'+plusurl;
        });   
        }
   })

   $('#itemvar').on('click',function(event){
    event.preventDefault();
        if(window.location.origin.search('companyvariables') <= 0 ){
            $("body").fadeTo(50, 0.1, function() {
             window.location.href =   window.location.origin + '/items'+plusurl;
        });   
        }
   })


   $('#dropdownbutton').on('click',function(){
    $('#vardropdown').toggle("fast")
   })

   $( "#comvar" ).hover(
    function() {
        $(this).animate({  top: "-=10" }, "fast");
        $(this).css("box-shadow","0px 0px 0px 2.5px #ffffff",);
        $(this).css("cursor","pointer",);
    }, function() {
        $(this).animate({ top: "+=10" }, "fast");
        $(this).css("box-shadow","0px 0px 0px 0px #ffffff");

    }
  );

  $( "#itemvar" ).hover(
    function() {
        $(this).animate({  top: "-=10" }, "fast");
        $(this).css("box-shadow","0px 0px 0px 2.5px #ffffff",);
        $(this).css("cursor","pointer",);
    }, function() {
        $(this).animate({ top: "+=10" }, "fast");
        $(this).css("box-shadow","0px 0px 0px 0px #ffffff");

    }
  );

  $( "#hotvar" ).hover(
    function() {
        $(this).animate({  top: "-=10" }, "fast");
        $(this).css("box-shadow","0px 0px 0px 2.5px #ffffff");
        $(this).css("cursor","pointer",);
    }, function() {
        $(this).animate({ top: "+=10" }, "fast");
        $(this).css("box-shadow","0px 0px 0px 0px #ffffff");
    }
  );

  $( "#univar" ).hover(
    function() {
        $(this).animate({  top: "-=10" }, "fast");
        $(this).css("box-shadow","0px 0px 0px 2.5px #ffffff");
        $(this).css("cursor","pointer",);
    }, function() {
        $(this).animate({ top: "+=10" }, "fast");
        $(this).css("box-shadow","0px 0px 0px 0px #ffffff");
    }
  );

  $( "#resvar" ).hover(
    function() {
        $(this).animate({  top: "-=10" }, "fast");
        $(this).css("box-shadow","0px 0px 0px 2.5px #ffffff");
        $(this).css("cursor","pointer",);
    }, function() {
        $(this).animate({ top: "+=10" }, "fast");
        $(this).css("box-shadow","0px 0px 0px 0px #ffffff");
    }
  );
  $('#univar').on('click',function(event){
    event.preventDefault();
        if(window.location.origin.search('companyvariables') <= 0 ){
            $("body").fadeTo(50, 0.1, function() {
             window.location.href =   window.location.origin + '/units'+plusurl;
        });   
        }
   })
});


$.ajax({
    url: "/home"+plusurl+"/api/defaults",
    method: 'GET', 
    dataType: 'text',  
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    },
    error: function(res){
        window.scrollTo(0,0)
        $('#alertcontain').removeAttr('hidden')
        $('#erroralert').text('')
    },
    statusCode:{
        200: function(response){
           var data = JSON.parse(response)
           if(data.hasOwnProperty('Data')){ 
            $('#footer').text(data['Data'][0]['company_name']); 
           }
           setTimeout(function() {
            $('#pbar').css('width', '0%').attr('aria-valuenow', 0);
         }, 3000); 
        }
    },
}); 