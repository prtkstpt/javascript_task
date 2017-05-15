var user_list = []; //to fetch all user details
var user_token;     //to assign token send by the Server
var error;
var logged_in_user;
var logged_in_user_id;
var flag=false;

// Function for Request and Response
function httpRequest(method, url, headers, data) {
  return new Promise(function(resolve, reject){
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      // code for older browsers
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open(method, url, true);
    if(headers) {
      for(var header in headers){
        xmlhttp.setRequestHeader(header, headers[header]);
      }
    }
    if(data){
      xmlhttp.send(JSON.stringify(data));
    }
    else{
      xmlhttp.send();
    }

    //checking status code of response
    xmlhttp.onload = function() {
      if ([200,201, 204].indexOf(this.status)!=-1) {
        resolve(this.responseText);
      }
      else{
        reject(this.responseText);
        var error_field = JSON.parse(this.responseText);
        if(error_field.non_field_errors)
          document.getElementById('error').innerHTML = error_field.non_field_errors;
        if(error_field.username)
          document.getElementById('error').innerHTML = error_field.username;
        if(error_field.password)
          document.getElementById('error_pass').innerHTML = error_field.password;
        if(error_field.email)
          document.getElementById('error_email').innerHTML = error_field.email;
      }
    };
  });
}

function validateName(inputElem){
  var inputName = /^[a-zA-Z]*$/;
  if(inputElem.value.match(inputName))
  {
    document.getElementById('error_field_'+inputElem.name).innerHTML ="";
    flag=true;
    return true;
  }
  else
  {
    document.getElementById('error_field_'+inputElem.name).innerHTML = "Only Alphabets allowed";
    flag=false;
    return false;
  }
}
// function for Display Login Form
function login(){
  var login_html ="<div class='wrapper'><form class='form-signin'><center><h2 class='form-signin-heading'>User Login</h2></center><input type='text' class='form-control' name='username' placeholder='Username' required='required' autofocus='' /><br><input type='password' class='form-control' name='password' placeholder='Password' required='required'/><center><div id='error' style = 'padding-top: 20px;padding-right: 30px; padding-bottom :20px;color:red'></div></center><div style='padding-left:60px;'><button class='btn btn-md btn-primary' style='width:78px;' type='button' onclick=loginUser()>Login</button>&nbsp;&nbsp;&nbsp;<button class='btn btn-md btn-success' type='button' onclick = create()>Register</button></div></form></div>";

  document.getElementById("mainPage").innerHTML = login_html;
}
//function to Login the user (onclick event of 'Login' button)
function loginUser(){
  var data = {};
  var fields = document.getElementsByTagName('input');
  for(var i=0; i<fields.length;i++){
    data[fields[i].name] = fields[i].value;
  }
  var headers = {"Content-type":"application/json"};
  httpRequest("POST","https://amazatic-test-app.herokuapp.com/login/", headers,data).then(function(res){
    var user = JSON.parse(res);
    logged_in_user = data.username;
    console.log("print",logged_in_user);
    document.cookie = "Token=" + user.token;
    loadUserList();
  });

}

//function to Display Create Userform (Registration form)
function create(){

  var create_html = "<div class='wrapper'><form class='form-signin'><center><h2 class='form-signin-heading'>User Registration</h2></center>Username<input type='text' class='form-control' name='username' placeholder='Username' required='required' autofocus=''/ ><span id='error' style = 'padding-top: 20px;padding-right: 30px; padding-bottom :20px;color:red'></span><br>First Name<input type='text' class='form-control' name='first_name' placeholder='First Name' required='required' onfocusout=validateName(this) /><span id='error_field_first_name' style ='color:red'></span><br>Last Name<input type='text' class='form-control' name='last_name' placeholder='Last Name' required='required' onfocusout=validateName(this) /><span id='error_field_last_name' style ='color:red'></span><br>Email Address<input type='text' class='form-control' name='email' placeholder='Email Address' required='required'/><span id='error_email' style='color:red'></span><br>Password<input type='password' class='form-control' name='password' placeholder='Password' required='required'/><span id='error_pass' style='color:red'></span><br><center><button class='btn btn-md btn-success' type='button' onclick = createUser() data-toggle='modal' data-target='#regModal'>Register</button><button id='btn-back' class='btn btn-md btn-primary' type='button' onclick=login()>Back</button></center></form></div><div id='register_msg'></div><center><div id='validate_msg' style='color:red'></div></center>";

  document.getElementById("mainPage").innerHTML = create_html;
}

//function for Creating new user(onclick event of 'Register' button)
function createUser(){
  var headers = {"Content-type":"application/json"};
  var data = {};
  var fields = document.getElementsByTagName('input');
     //Assigning input details of form to the 'data' variable
  for(var i=0; i<fields.length;i++){
    data[fields[i].name] = fields[i].value;
  }
  if(flag){
    httpRequest("POST","https://amazatic-test-app.herokuapp.com/user/", headers,data).then(function(res){
      document.getElementById('validate_msg').innerHTML="";
    var register_msg = "<center><h2 class='logout_msg'>Successfully Registered!</h2></center>";
    document.getElementById('mainPage').innerHTML = register_msg;
    setTimeout(login,2000);
  });
  }
  else{
    document.getElementById('validate_msg').innerHTML = "Please enter correct Information!!";
  }
};

//functoin to Edit user details (onclick event on 'Edit' button )
function editDetails(obj){
  var form_html = "<div class='wrapper'><form class='form-signin'><center><h2 class='form-signin-heading'>User Edit</h2></center>Username<input type='text' class='form-control' name='username' placeholder='Username' required='required' autofocus='' value="+obj.username+" /><span id='error' style = 'padding-top: 20px;padding-right: 30px; padding-bottom :20px;color:red'></span><br>First Name<input type='text' class='form-control' name='first_name' placeholder='First Name' required='required' onfocusout=validateName(this) value="+obj.first_name+"  /><span id='error_field_first_name' style ='color:red'></span><br>Last Name<input type='text' class='form-control' name='last_name' placeholder='Last Name' required='required' onfocusout=validateName(this) value="+obj.last_name+" /><span id='error_field_last_name' style ='color:red'></span><br>Email Address<input type='text' class='form-control' name='email' placeholder='Email Address' required='required' value="+obj.email+" /><br><center><button class='btn btn-md btn-success' type='button' onClick = edit("+JSON.stringify(obj)+")>Update</button><button id='btn-back' class='btn btn-md btn-primary' type='button' onclick=loadUserList();>Back</button></center></form></div><center><div id='validate_msg' style='color:red'></div></center>";

  document.getElementById("mainPage").innerHTML = form_html;
}

//function for Update user details (onclick event on 'Update' button)
function edit(obj){
  var data = {}; // to send in httpRequest method
  var fields = document.getElementsByTagName('input');
  var old_user=null;
  for(var index in user_list){
    if(user_list[index].id==obj.id) {
      old_user = user_list[index];
      break;
    }
  }

  for(var i=0; i<fields.length;i++){
    if(old_user[fields[i].name]!=fields[i].value){
      data[fields[i].name] = fields[i].value;    //Assigning data with Updated User details
    }
  }

  var headers = {"Content-type":"application/json","Authorization":document.cookie};
  if(flag){
  httpRequest("PATCH", "https://amazatic-test-app.herokuapp.com/user/"+obj.id+'/',headers, data).then(function(res){
    var user = JSON.parse(res);
    for(var index in user_list){
      if(user_list[index].id==user.id) {
        user_list[index] = user;
        break;
      }
    }
    createUserTable(user_list);
  });
  }
  else{
    document.getElementById('validate_msg').innerHTML = "Please enter correct Information!!";
  }
  }

  //function for Delete user ()
function deleteUser(id){
  var headers = {"Content-type":"application/json","Authorization":document.cookie};
  httpRequest("DELETE", "https://amazatic-test-app.herokuapp.com/user/"+id+'/',headers).then(function(res){
    for(var index in user_list){
      if(user_list[index].id==id) {
        if(logged_in_user_id == id)
          alert("me", logged_in_user_id);
        user_list.splice(index,1);    //removing single user selected for delete from the user_list
        break;
      }
    }
    createUserTable(user_list);
  });

  createUserTable(user_list);
}

//function to Create Table and display All users in it.
function createUserTable(users){

  var table = document.getElementById("myTable");

  var table_data ="<button id='logout' type='button' class='btn btn-danger' value='Logout' style='float: right' onclick=logout() data-toggle='modal' data-target='.bs-example-modal-sm'><i class='glyphicon glyphicon-log-out'></i> Logout</button><center><h2>User List</h2><br></center><table class='table table-striped' id='myTable'><thead class='thead-inverse'><tr><th>Username</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Edit</th><th>Delete</th></tr></thead><tbody>";


  for(var i=0;i<users.length;i++)
  {

    table_data+="<tr><td>"+users[i].username+"</td><td>"+users[i].first_name+"</td><td>"+users[i].last_name+"</td><td>"+users[i].email+"</td><td><button onclick=editDetails("+JSON.stringify(users[i])+") class='btn btn-info'><i class='glyphicon glyphicon-pencil'></i></button></td><td><button class='btn btn-primary' data-toggle='modal' data-target='#myModal' onclick=createModal("+ JSON.stringify(users[i])+")><i class='glyphicon glyphicon-trash'></i></button></td></tr><div id='deleteModal'></div>";

  }
  table_data+="</tbody></table>";
  document.getElementById("mainPage").innerHTML = table_data;
}

/*function deleteValidation(user){
  console.log("log usr", logged_in_user);
  if(user.username == logged_in_user){
    alert("You can't delete your account !");
  }
  else{
    deleteUser(user.id);
  }
}*/

//function to display modal for delete confirmation
function createModal(user) {
  console.log("admin", logged_in_user);
  if(logged_in_user == user.username){
     var deleteConfirmationModal = "<div class='modal fade' id='myModal' role='dialog'><div class='modal-dialog'><div class='modal-content'><div><button type='button' class='close' id='close' data-dismiss='modal'>&times;</button></div><div class='modal-body'><center><h3>You can't Delete your record</h3></center></div><div class='delete_modal'><button type='button' class='btn  btn-danger deleteNo' data-dismiss='modal'>OK</button></div></div></div></div>";

  }
  else{
  var deleteConfirmationModal = "<div class='modal fade' id='myModal' role='dialog'><div class='modal-dialog'><div class='modal-content'><div><button type='button' class='close' id='close' data-dismiss='modal'>&times;</button></div><div class='modal-body'><center><h3>Delete  "+user.username+" ?</h3></center></div><div class='delete_modal'><button type='button' class='btn btn-success deleteYes' data-dismiss='modal' onclick=deleteUser("+user.id+")>Yes</button><button type='button' class='btn  btn-danger deleteNo' data-dismiss='modal'>No</button></div></div></div></div>";
  }
    document.getElementById("deleteModal").innerHTML = deleteConfirmationModal;
}


//function to fetching all user detail
function loadUserList() {
  var headers = {"Content-type":"application/json","Authorization":document.cookie};
  httpRequest("GET", "https://amazatic-test-app.herokuapp.com/user/",headers).then(function(res){
    user_list = JSON.parse(res); //string of JSON text into a Javascript object (user_list).
    createUserTable(user_list); //passing loaded user details to function to display in Table
  });
}

//function for logout the user
function logout(){

  var mainpageid = document.getElementById("mainPage");
  var headers = {"Content-type":"application/json","Authorization":document.cookie.replace('=', ' ').replace(/;(.)*/, '')}; //getting only Token valie from the cookie
  httpRequest("POST", "https://amazatic-test-app.herokuapp.com/logout/",headers).then(function(res){

    var logout_msg = "<center><h2 class='logout_msg'>You have successfully logged out!</h2></center>";
    mainpageid.innerHTML = logout_msg;
    setTimeout(login,3000);
    document.cookie = "Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; //delete the cookie
  });
}


function checkLogin()
{

  if (document.cookie)
    loadUserList();
  else
    login(); //call to login,  to Display it as first form (i.e Homepage)
}

checkLogin();
