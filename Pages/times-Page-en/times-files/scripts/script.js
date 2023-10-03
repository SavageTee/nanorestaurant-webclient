var elem = document.getElementById("pbar");
var plusurl = ""
var sels = 0;
var selsperiod = 0;

var submitted = false;

$('#resdate').on('click',function(){
    $('#tabledatetime').bootstrapTable('destroy')
})

$('#restaurants').on('click',function(){
    $('#tabledatetime').bootstrapTable('destroy')
})


$('#periodtable').bootstrapTable().bootstrapTable()


function priceperiod(){return '<input id="priceperiod" placeholder="Price" type="text" class="container-fluid form-control text-center" aria-describedby="basic-addon1">';}
function dateperiod(){return '<input id="dateperiod" placeholder="Time" type="text" class="container-fluid form-control text-center" aria-describedby="basic-addon1">';}
function ACTIONperiod(row,data){return '<button type="button" onclick="EditItemperiod(\''+ JSON.stringify(row).replace(/'/g, '&apos;').replace(/"/g, '&quot;')+'\')" class="btn btn-primary btn-group">  Add / Edit    <i class="fas fa-plus"></i></button></div>'}    
function Action_editperiod(row,data){var kolas = selsperiod; selsperiod = selsperiod + 1; return '<div class="btn-group"> <div class="horizontalgap" style="width:10px"></div>  <button onclick="DeleteEntryperiod(\''+kolas+'\')" type="button" class="btn btn-danger"><i class="fas fa-trash-alt fa-lg"></i></button>   <div class="horizontalgap" style="width:10px"></div>  </div>'}    


function price(){return '<input id="date" placeholder="Time" type="text" class="container-fluid form-control text-center" aria-describedby="basic-addon1">';}
function date(){return '<input id="price" placeholder="Price" type="text" class="container-fluid form-control text-center" aria-describedby="basic-addon1">';}
function ACTION(row,data){return '<button type="button" onclick="EditItem(\''+ JSON.stringify(row).replace(/'/g, '&apos;').replace(/"/g, '&quot;')+'\')" class="btn btn-primary btn-group">  Add / Edit   <i class="fas fa-plus"></i></button></div>'}    
function Action_edit(row,data){var kola = sels; sels = sels + 1; return '<div class="btn-group"> <div class="horizontalgap" style="width:10px"></div>  <button onclick="DeleteEntry(\''+kola+'\')" type="button" class="btn btn-danger"><i class="fas fa-trash-alt fa-lg"></i></button>   <div class="horizontalgap" style="width:10px"></div>  </div>'}    
function loadingTemplate(loadingMessage) {return '<div class="spinner-grow" role="status"></div><div class="spinner-grow" role="status"></div><div class="spinner-grow" role="status"></div>'}





function DeleteEntry(which){
    if($('#restaurants').val() == 'قم باختيار المطعم'){  $('#erroralert').text('برجاء قم باختيار مطعم'); $('#alertcontain').removeAttr('hidden');  return; }
    var reg = new RegExp('^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])$')
    if( !reg.test( $('#resdate').val()) ){  $('#erroralert').text('برجاء اختيار يوم'); $('#alertcontain').removeAttr('hidden');  return; }
    var dates = [];
    var prices = [];
    var uuid = Number($('#resdate').val().split('-')[0]).toString() + "-" + Number($('#resdate').val().split('-')[1]).toString() + "-" + JSON.parse($('#restaurants').val())['id']
    for(var i =0; i< $('#tabledatetime').bootstrapTable('getData').length; i++){
        if(parseInt(which) != i){
            dates.push($('#tabledatetime').bootstrapTable('getData')[i][`day_${ Number($('#resdate').val().split('-')[2]).toString()}`])
            prices.push($('#tabledatetime').bootstrapTable('getData')[i][`day_${ Number($('#resdate').val().split('-')[2]).toString()}_price`])
        }
    }
    sels=0;
    $.ajax({
        url: "/availabletime"+plusurl+"/api/edittimes",
        method: 'POST', 
        dataType: 'text',  
        beforeSend: function(xhr) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        },
        data: {
            rowid: uuid,
            day: `day_${ Number($('#resdate').val().split('-')[2]).toString()}`,
            dates:  dates.join(',').trim().toString(),
            prices: prices.join(',').trim().toString(),
        },
        error: function(res){
            $('#alertcontain').removeAttr('hidden')
            $('#erroralert').text('حدث خطا ما ')
        },
        statusCode:{
            200: function(response){
                var mydata = JSON.parse(response)
                GetAvData();
                    setTimeout(function() {
                    $('#pbar').css('width', '0%').attr('aria-valuenow', 0);
                    }, 3000);              
            }
        },
    });    
    return;
}

function EditItemperiod(i){
    if($('#dateperiod').val() == '' || $('#priceperiod').val() == ''){
        $('#alertcontainperiod').removeAttr('hidden')
        $('#erroralertperiod').text('بعض الحقول فارغه او لم يتم اختيار عنصر')
        return
    }
    if($('#dateperiod').val().indexOf(',') > -1 || $('#priceperiod').val().indexOf(',') > -1){  $('#erroralertperiod').text('لا يمكن استخدام ,'); $('#alertcontainperiod').removeAttr('hidden');  return;  }
    selsperiod = 0;
    $('#periodtable').bootstrapTable('append', [{ "dateperiod": $('#dateperiod').val(), "priceperiod" : $('#priceperiod').val() }])
}

function DeleteEntryperiod(which){
    console.log(which)
    $('#periodtable').bootstrapTable('remove', {
        field: '$index',
        values: [parseInt(which)]
      }) 
      selsperiod = 0;
      $('#periodtable').bootstrapTable().bootstrapTable();
      $('#periodtable').bootstrapTable('load',$('#periodtable').bootstrapTable('getData'));
}


$('#addnow').on('click',function(){
    if(!submitted){
        $('#spinnerss').removeAttr('hidden','true')
        submitted = true;
        var reg = new RegExp('^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])$')
        if($('#restaurantsperiod').val() == 'قم باختيار المطعم'){ $('#spinnerss').attr('hidden','true'); submitted = false;  $('#erroralertperiod').text('برجاء قم باختيار مطعم'); $('#alertcontainperiod').removeAttr('hidden');  return; }
        if(!reg.test($('#fromdate').val())){ $('#spinnerss').attr('hidden','true'); submitted = false;  $('#erroralertperiod').text('التاريخ من غير صحيح'); $('#alertcontainperiod').removeAttr('hidden');  return; }
        if(!reg.test($('#todate').val())){ $('#spinnerss').attr('hidden','true'); submitted = false;  $('#erroralertperiod').text('التاريخ الى غير صحيح'); $('#alertcontainperiod').removeAttr('hidden');  return; }
        if( (parseInt($('#fromdate').val().split('-')[0]) != parseInt($('#todate').val().split('-')[0])) || (parseInt($('#fromdate').val().split('-')[1]) != parseInt($('#todate').val().split('-')[1]))  )
        { $('#spinnerss').attr('hidden','true'); submitted = false;  $('#erroralertperiod').text('يجب ان يكون التاريخين في نفس السنه والشهر'); $('#alertcontainperiod').removeAttr('hidden');  return;   }
        var uuid = Number($('#fromdate').val().split('-')[0]).toString() + "-" + Number($('#fromdate').val().split('-')[1]).toString() + "-" + JSON.parse($('#restaurantsperiod').val())['id']
        var loopcount = (parseInt($('#todate').val().split('-')[2]) - parseInt($('#fromdate').val().split('-')[2]));
        if(loopcount <= 0){ $('#spinnerss').attr('hidden','true'); submitted = false;  $('#erroralertperiod').text('عدد الايام اقل من او يساوي الصفر'); $('#alertcontainperiod').removeAttr('hidden');  return; }
        var dates = [];
        var prices = [];
        for(var x =0; x < $('#periodtable').bootstrapTable('getData').length; x++){
            dates.push($('#periodtable').bootstrapTable('getData')[x]['dateperiod'])
            prices.push($('#periodtable').bootstrapTable('getData')[x]['priceperiod'])
        }
        for(var y = parseInt($('#fromdate').val().split('-')[2]); y <= parseInt($('#todate').val().split('-')[2]); y++){
            $.ajax({
                url: "/availabletime"+plusurl+"/api/edittimes",
                method: 'POST', 
                dataType: 'text',               
                beforeSend: function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                },
                data: {
                    rowid: uuid,
                    day: `day_${y}`,
                    dates:  dates.join(',').trim().toString(),
                    prices: prices.join(',').trim().toString(),
                },
                error: function(res){
                    $('#spinnerss').attr('hidden','true')
                    submitted = false;
                    $('#alertcontainperiod').removeAttr('hidden')
                    $('#erroralertperiod').text('حدث خطا ما ')
                },
                statusCode:{
                    200: function(response){
                        $('#success').css('display','inline')
                        $('#success').delay(5000).fadeOut('slow');
                        console.log(y,  parseInt($('#todate').val().split('-')[2]))
                        if(y == (parseInt($('#todate').val().split('-')[2]) + 1)){
                            $('#spinnerss').attr('hidden','true')
                            submitted = false;
                        }                            
                            setTimeout(function() {
                            $('#pbar').css('width', '0%').attr('aria-valuenow', 0);
                            }, 3000);              
                    }
                },
            });   
        }
    }
})






function EditItem(i){
    if($('#date').val() == '' || $('#price').val() == ''){
        $('#alertcontain').removeAttr('hidden')
        $('#erroralert').text('بعض الحقول فارغه او لم يتم اختيار عنصر')
        return
    }
    if($('#restaurants').val() == 'قم باختيار المطعم'){  $('#erroralert').text('برجاء قم باختيار مطعم'); $('#alertcontain').removeAttr('hidden');  return; }
    var reg = new RegExp('^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])$')
    if( !reg.test( $('#resdate').val()) ){  $('#erroralert').text('برجاء اختيار يوم'); $('#alertcontain').removeAttr('hidden');  return; }
    if($('#date').val().indexOf(',') > -1 || $('#price').val().indexOf(',') > -1){  $('#erroralert').text('لا يمكن استخدام ,'); $('#alertcontain').removeAttr('hidden');  return;  }
    var uuid = Number($('#resdate').val().split('-')[0]).toString() + "-" + Number($('#resdate').val().split('-')[1]).toString() + "-" + JSON.parse($('#restaurants').val())['id']
    var rows = JSON.parse(i)
    var dates = [];
    var prices = [];
    rows.forEach(function(val){
        dates.push(val[`day_${ Number($('#resdate').val().split('-')[2]).toString()}`])
        prices.push(val[`day_${ Number($('#resdate').val().split('-')[2]).toString()}_price`])
    })
    dates.push($('#date').val())
    prices.push($('#price').val())
    sels = 0;
    $.ajax({
        url: "/availabletime"+plusurl+"/api/edittimes",
        method: 'POST', 
        dataType: 'text',  
        beforeSend: function(xhr) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        },
        data: {
            rowid: uuid,
            day: `day_${ Number($('#resdate').val().split('-')[2]).toString()}`,
            dates:  dates.join(',').trim().toString(),
            prices: prices.join(',').trim().toString(),
        },
        error: function(res){
            $('#alertcontain').removeAttr('hidden')
            $('#erroralert').text('حدث خطا ما ')
        },
        statusCode:{
            200: function(response){
                var mydata = JSON.parse(response)
                GetAvData();
                    setTimeout(function() {
                    $('#pbar').css('width', '0%').attr('aria-valuenow', 0);
                    }, 3000);              
            }
        },
    });   
}


    if(window.location.href.indexOf('/en') == -1){
        plusurl =  '/ar';
        $('#lang').text('EN ');
    }else{
        plusurl = '/en';
        $('#lang').text('AR ');
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

      function GetAvData(){
        $('#tabledatetime').removeAttr('hidden')
        $('#erroralert').text('')
        $('#alertcontain').attr('hidden',true)
        if($('#restaurants').val() == 'قم باختيار المطعم'){  $('#erroralert').text('برجاء قم باختيار مطعم'); $('#alertcontain').removeAttr('hidden');  return; }
        var reg = new RegExp('^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])$')
        if( !reg.test( $('#resdate').val()) ){  $('#erroralert').text('برجاء اختيار يوم'); $('#alertcontain').removeAttr('hidden');  return; }
        if($('#jumpheader').is(":hidden")){$('#jumpheader').removeAttr('hidden')}
        $('#cardname').text( JSON.parse($('#restaurants').find(":selected").val())['name'] + " - " +  JSON.parse($('#restaurants').find(":selected").val())['country'] + "")
        $('#cardabout').text( JSON.parse($('#restaurants').find(":selected").val())['about'] )
        $('#cardcapa').text("Full Capacity: " +  JSON.parse($('#restaurants').find(":selected").val())['full_capacity'])
        $('#cardimage').attr('src', `data:image/png;base64, ${btoa(new Uint8Array( JSON.parse($('#restaurants').find(":selected").val())['photo'].data).reduce((data, byte) => data + String.fromCharCode(byte), ''))} ` )
        $('#tabledatetime').find('tr').first().next().find('th').first().attr('data-field',`day_${ Number($('#resdate').val().split('-')[2]).toString()}_price`)
        $('#tabledatetime').find('tr').first().next().find('th').first().next().attr('data-field',`day_${ Number($('#resdate').val().split('-')[2]).toString()}`)
        $('#tabledatetime').bootstrapTable('destroy');
        $('#tabledatetime').find('tr').first().next().find('th').first().attr('data-field',`day_${ Number($('#resdate').val().split('-')[2]).toString()}_price`)
        $('#tabledatetime').find('tr').first().next().find('th').first().next().attr('data-field',`day_${ Number($('#resdate').val().split('-')[2]).toString()}`)
        $('#tabledatetime').bootstrapTable().bootstrapTable('showLoading')
        $.ajax({
            url: "/availabletime"+plusurl+"/api/getavailablewtime",
            method: 'POST', 
            dataType: 'text',  
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            },
            data: {
              restaurant: JSON.parse($('#restaurants').val())['id'] ,
              month:Number($('#resdate').val().split('-')[1]).toString(),
              year: Number($('#resdate').val().split('-')[0]).toString(),
            },
            error: function(res){
                $('#alertcontain').removeAttr('hidden')
                $('#alertcontain').text('حدث خطا ما ')             
            },
            statusCode:{
                200: function(response){
                var mydata = JSON.parse(response);
                    var arr  = [];
                    var obj = {}
                    console.log()
                    if( mydata[0].length ==  0 ){ $('#tabledatetime').bootstrapTable('load', arr);$('#tabledatetime').bootstrapTable('hideLoading');return;}
                    if(mydata[0][0][`day_${ Number($('#resdate').val().split('-')[2]).toString()}`] == null || mydata[0][0][`day_${ Number($('#resdate').val().split('-')[2]).toString()}`].length <= 0){$('#tabledatetime').bootstrapTable('load', arr);$('#tabledatetime').bootstrapTable('hideLoading');return;}
                    for(var x = 0; x< mydata[0][0][`day_${ Number($('#resdate').val().split('-')[2]).toString()}`].split(',').length ; x++  ) {
                        obj = {}
                        obj[`day_${ Number($('#resdate').val().split('-')[2]).toString()}`] = mydata[0][0][`day_${ Number($('#resdate').val().split('-')[2]).toString()}`].split(',')[x]
                        obj[`day_${ Number($('#resdate').val().split('-')[2]).toString()}_price`] = mydata[0][0][`day_${ Number($('#resdate').val().split('-')[2]).toString()}_price`].split(',')[x]
                        arr.push(obj)
                    }
                    $('#tabledatetime').bootstrapTable('load', arr); 
                    $('#tabledatetime').bootstrapTable('hideLoading')    
                   setTimeout(function() {
                    $('#pbar').css('width', '0%').attr('aria-valuenow', 0);
                 }, 3000); 
                }
            },
        });
    }



$( document ).ready(function() {


    $('#showrestaurant').on('click',function(){
        GetAvData();
    })

   
 
    

   $('#alertcontain').on('click',function(){
    $('#erroralert').text('')
    $('#alertcontain').attr('hidden',true)
   })

   $('#alertcontainperiod').on('click',function(){
    $('#erroralertperiod').text('')
    $('#alertcontainperiod').attr('hidden',true)
   })

    


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
                $('#restaurantsperiod').append(`
                <option value='${JSON.stringify(mydata[0][x])}'>
                <h6> ${mydata[0][x]['name']} </h6>
                </option>
              `)
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


  

    $('#langch').on('click',function(){
        event.preventDefault();
        if($('#lang').text() == '/ar'){
            window.location.href =   window.location.origin + '/home/ar/';
        }else{
            window.location.href =   window.location.origin + '/home/en/';
        }
    })

    $.ajax({
        url: "/home"+plusurl+"/api/uname",
        method: 'GET', 
        dataType: 'text',  
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        },
        error: function(res){
            $('#alertcontain').removeAttr('hidden')
            $('#erroralert').text(res)
        },
        statusCode:{
            200: function(response){
                if(JSON.parse(response).hasOwnProperty('value')){
                   $('#username').text(JSON.parse(response)['value'].toUpperCase());    
                }
            }
        },
    }); 

    $('#homepag').on('click',function(){
        event.preventDefault();
        window.location.href =   window.location.origin + '/home' + plusurl;
    })
    
    $('#logout').on('click',function(){
        event.preventDefault()
        $.ajax({
            url: "/home"+plusurl+"/api/logout",
            method: 'POST', 
            dataType: 'text',  
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            },
            error: function(res){
                $('#alertcontain').removeAttr('hidden')
                $('#erroralert').text(res)
            },
            statusCode:{
                200: function(response){
                    $("body").fadeTo(50, 0.1, function() {
                        window.location.href =   window.location.origin + '/login'+ plusurl;
                    });      
                }
            },
        }); 
    })





 

   

   $('#dropdownbutton').on('click',function(){
    $('#vardropdown').toggle("fast")
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

 function GetData(){
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
GetData();
$('#itemvar').on('click',function(event){
    event.preventDefault();
        if(window.location.origin.search('companyvariables') <= 0 ){
            $("body").fadeTo(50, 0.1, function() {
             window.location.href =   window.location.origin + '/items'+plusurl;
        });   
        }
   })

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


  $('#clovar').on('click',function(event){
    event.preventDefault();
        if(window.location.origin.search('companyvariables') <= 0 ){
            $("body").fadeTo(50, 0.1, function() {
             window.location.href =   window.location.origin + '/availabletime'+plusurl;
        });   
        }
   })

   $('#gounit').on('click',function(){
    event.preventDefault();
    if(window.location.origin.search('companyvariables') <= 0 ){
        $("body").fadeTo(50, 0.1, function() {
         window.location.href =   window.location.origin + '/registeritem'+plusurl;
    });   
    }
})

   $('#goexcell').on('click',function(){
    event.preventDefault();
    if(window.location.origin.search('companyvariables') <= 0 ){
        $("body").fadeTo(50, 0.1, function() {
         window.location.href =   window.location.origin + '/excell'+plusurl;
    });   
    }
})
$('#goadd').on('click',function(){
    event.preventDefault();
    if(window.location.origin.search('companyvariables') <= 0 ){
        $("body").fadeTo(50, 0.1, function() {
         window.location.href =   window.location.origin + '/newinvoice'+plusurl;
    });   
    }
})



$('#gorep').on('click',function(){
    event.preventDefault();
    if(window.location.origin.search('companyvariables') <= 0 ){
        $("body").fadeTo(50, 0.1, function() {
         window.location.href =   window.location.origin + '/reports'+plusurl;
    });   
    }
})

$('#gosendrec').on('click',function(){
    event.preventDefault();
    if(window.location.origin.search('companyvariables') <= 0 ){
        $("body").fadeTo(50, 0.1, function() {
         window.location.href =   window.location.origin + '/invoices'+plusurl;
    });   
    }
})

$('#gosend').on('click',function(){
    event.preventDefault();
    if(window.location.origin.search('companyvariables') <= 0 ){
        $("body").fadeTo(50, 0.1, function() {
         window.location.href =   window.location.origin + '/submit'+plusurl;
    });   
    }
})

});