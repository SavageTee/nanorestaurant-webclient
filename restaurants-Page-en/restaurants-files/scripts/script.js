var imagess = "";
var TableData = null;
var plusurl = ""
var whichres = null;
if(window.location.href.indexOf('/en') == -1){
    plusurl =  '/ar';
    $('#lang').text('AR ');
}else{
    plusurl = '/en';
    $('#lang').text('EN ');
}


$.ajax({
    url: "/home"+plusurl+"/api/permissions",
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
            mydata = JSON.parse(response)
            Perms = JSON.parse(mydata['Data'])
            Perms[0] == '0' ? $('#comvarcd').css('display','none') : null ;
            Perms[0] == '0' ? $('#comvarcd').removeClass() : null ;
            Perms[1] == '0' ? $('#hotvarcd').css('display','none') : null ;
            Perms[1] == '0' ? $('#hotvarcd').removeClass() : null ;
            Perms[2] == '0' ? $('#resvarcd').css('display','none') : null ;
            Perms[2] == '0' ? $('#resvarcd').removeClass() : null ;
            Perms[3] == '0' ? $('#clovarcd').css('display','none') : null ;
            Perms[3] == '0' ? $('#clovarcd').removeClass() : null ;
            Perms[4] == '0' ? $('#verifyreservationcd').css('display','none') : null ;
            Perms[4] == '0' ? $('#verifyreservationcd').removeClass() : null ;
            Perms[5] == '0' ? $('#checknumberscd').css('display','none') : null ;
            Perms[5] == '0' ? $('#checknumberscd').removeClass() : null ;
            Perms[6] == '0' ? $('#newreservationcd').css('display','none') : null ;
            Perms[6] == '0' ? $('#newreservationcd').removeClass() : null ;
            Perms[7] == '0' ? $('#reportscd').css('display','none') : null ;
            Perms[7] == '0' ? $('#reportscd').removeClass() : null ;
            Perms[8] == '0' ? $('#uservarcd').removeClass() : null ;  
            Perms[8] == '0' ? $('#uservarcd').css('display','none') : null ;
        }
    },
}); 



$('#langch').on('click',function(){
    if($('#lang').text() == '/ar'){
        window.location.href =   window.location.origin + '/clients/ar/';
    }else{
        window.location.href =   window.location.origin + '/clients/en/';
    }
})

function loadingTemplate(loadingMessage) {return '<div class="spinner-grow" role="status"></div><div class="spinner-grow" role="status"></div><div class="spinner-grow" role="status"></div>'}
function restaurantcode(){return '<input id="id" placeholder="كود المطعم" type="text" class="container-fluid form-control text-center" aria-describedby="basic-addon1">';}
function restaurant_name(){return '<input id="hotel_name" placeholder="اسم المطعم" type="text" class="container-fluid form-control text-center" aria-describedby="basic-addon1">';}

function country_format(){return '<input id="country" placeholder="اسم الدوله" type="text" class="container-fluid form-control text-center" aria-describedby="basic-addon1">';}
function photo_format(data,col){
    return  `
    <div><img type="file" alt="" id="photo" class="border border-dark bg-white" width=200px height=100px src="gifs/restaurantss.jpg">
    <br>
    <br>
    <form>
        <input  onchange="loadfile(event)" style="cursor: pointer;" type="file"  accept="image/*" name="image" id="file" class="btn btn-dark" type="file" id="myFile" name="filename">
        <input hidden id="upload"  style="cursor: pointer;" value="Change" class="btn btn-dark" type="button">
    </form>
    <div>
    `; 
}

function loadfile(event) {
    $('#photo').attr("src",URL.createObjectURL(event.target.files[0]))
    async function get(){
      fileData = await new Blob([event.target.files[0]]).arrayBuffer();
      imagess =  new Uint8Array(fileData).toString();
    }
    get();
    console.log(imagess)
};

function photo_display(row,data){
return  `<img class="border border-dark bg-white" width=200px height=100px src="data:image/png;base64, ${btoa(new Uint8Array(data['photo'].data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}">`;
}
function about_format(){return '<textarea id ="about" placeholder="عن المطعم" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>';}
function capacity_format(){return '<input id="capacity" placeholder="اقصى عدد للمطعم" type="text" class="container-fluid form-control text-center" aria-describedby="basic-addon1">';}



function ID(data){return '<h3 id="cid"> '+  data.length +' </h3>';}
async function EditRouter(which){
    if($('tfoot').is(":hidden")){$('tfoot').removeAttr('hidden')}
    $('#tableclient').bootstrapTable('hideLoading')  
    $('#id').val( JSON.parse(which)['id']) 
    $('#hotel_name').val( JSON.parse(which)['name']) 
    $('#cid').text( JSON.parse(which)['id'])
    console.log(JSON.parse(which)['id'])
    console.log( $('#cid').text() )
    $('#country').val( JSON.parse(which)['country'])
    $('#about').text( JSON.parse(which)['about'])
    $('#capacity').val( JSON.parse(which)['full_capacity'])
    $("#photo").attr("src",`data:image/png;base64, ${ await btoa(new Uint8Array(JSON.parse(which)['photo'].data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}` );
}

function ACTION(row,data){return '<button type="button" onclick="EditItem('+')" class="btn btn-primary btn-group">  Add / Edit  <i class="fas fa-plus"></i></button></div>'}    
function Action_edit(row,data){
    return '<div class="btn-group"><button onclick="EditRouter(\''+ JSON.stringify(data).replace(/'/g, '&apos;').replace(/"/g, '&quot;')+'\')" type="button" class="btn btn-primary"><i class="fas fa-edit">  </i></i></button> <div class="horizontalgap" style="width:10px"></div>  <button onclick="DeleteClient(\''+ JSON.stringify(data).replace(/'/g, '&apos;').replace(/"/g, '&quot;')+'\')" type="button" class="btn btn-danger"><i class="fas fa-trash-alt fa-lg"></i></button>       <div class="horizontalgap" style="width:10px"></div>  <button onclick="ChangeMenu(\''+ JSON.stringify(data).replace(/'/g, '&apos;').replace(/"/g, '&quot;')+'\')" type="button"  class="btn btn-info"><i class="fas fa-book-open fa-lg"></i> Change Menu</button>  </div>'
}    




async function loadmenu(event) {
    $('#uploadform').attr('hidden',true)
    $('#uploadspinner').addClass('spinner-border')
    var pdfs = await new Promise( async (resolve,reject) =>{
        fileData = await new Blob([event.target.files[0]]).arrayBuffer()
        pdf =  new Uint8Array(fileData).toString()
        resolve(pdf)
    })
    $.ajax({
        url: "/restaurants"+plusurl+"/api/uploadpdf ",
        method: 'POST', 
        dataType: 'text',  
       beforeSend: function(xhr) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        },
        data: {
            id:  whichres,
            pdf: pdfs 
        },
        error: function(res){
            $('#alertcontain').removeAttr('hidden')
            $('#erroralert').text('حدث خطا ما ')
            $('#uploadform').removeAttr('hidden',true)
            $('#uploadspinner').removeClass('spinner-border')
        },
        statusCode:{
            200: function(response){
                $('#uploadform').removeAttr('hidden',true)
                $('#uploadspinner').removeClass('spinner-border')
                $('#uploadmodal').modal('hide');
            }
        },
    });
};


function ChangeMenu(which){
 $('#modtitle').text('Change menu for ' + JSON.parse(which)['name'] + 'Restaurant' )   
 whichres = JSON.parse(which)['id']
 $('#uploadmodal').modal('show')
}

function DeleteClient(which){
    $.ajax({
        url: "/restaurants"+plusurl+"/api/deleterestaurant ",
        method: 'POST', 
        dataType: 'text',  
       beforeSend: function(xhr) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        },
        data: {
            id:  JSON.parse(which)['id'],
        },
        error: function(res){
            $('#alertcontain').removeAttr('hidden')
            $('#erroralert').text('حدث خطا ما ')
        },
        statusCode:{
            200: function(response){
                var mydata = JSON.parse(response)
                $('#tableclient').bootstrapTable('load', mydata[0]); 
                $('#tableclient').bootstrapTable('hideLoading')    
                   setTimeout(function() {
                    $('#pbar').css('width', '0%').attr('aria-valuenow', 0);
                 }, 3000);              
            }
        },
    });   
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
                    $('#tableclient').bootstrapTable('load', mydata[0]); 
                    $('#tableclient').bootstrapTable('hideLoading')
                    $('#cid').text('')    
                       setTimeout(function() {
                        $('#pbar').css('width', '0%').attr('aria-valuenow', 0);
                     }, 3000);              
                }
            },
        });   
}


$( document ).ready(function() {
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
        $('#tableclient').bootstrapTable({
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
            url: "/restaurants"+plusurl+"/api/getrestaurants",
            method: 'GET', 
            dataType: 'text',  
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            },
            error: function(res){
                $('#alertcontain').removeAttr('hidden')
                $('#alertcontain').text('حدث خطا ما ')     
                console.log(res);         
            },
            statusCode:{
                200: function(response){
                var mydata = JSON.parse(response);
                $('#tableclient').bootstrapTable('load', mydata[0]); 
                $('#tableclient').bootstrapTable('hideLoading')    
                   setTimeout(function() {
                    $('#pbar').css('width', '0%').attr('aria-valuenow', 0);
                 }, 3000); 
                }
            },
        }); 
    }
    GetData();






    
    
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
    
       $('#clovar').on('click',function(event){
        event.preventDefault();
            if(window.location.origin.search('companyvariables') <= 0 ){
                $("body").fadeTo(50, 0.1, function() {
                 window.location.href =   window.location.origin + '/availabletime'+plusurl;
            });   
            }
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
        
      
      function GetDatda(){
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
    }
    GetDatda();



   $('#dropdownbutton').on('click',function(){
    $('#vardropdown').toggle("fast")
   })

 

});