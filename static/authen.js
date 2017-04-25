
var Api = {
      login: "/auth/login/",
      logout: "/auth/logout/",
      register: "/auth/register/",
      profile: "/auth/me/",
      activate: "/activate/",
      password: "/auth/password/reset/",
      password_confirm: "/auth/password/reset/confirm/"
};

var REST_TOKEN_COOKIE_KEY = 'Token';

var AjaxUtil = {
  request: function (ajaxSetting) {
    var AjaxUtil = this;

    var commonSetting = {
      data: {},
      dataType: 'json',
      headers: Authen.getAuthHeaders(),
      crossDomain: true,
    };

    var finalSetting = $.extend(commonSetting, ajaxSetting);
    $.ajax(finalSetting);
  },
};

var Authen = {

  setCookieToken: function(token){
    Cookies.set(REST_TOKEN_COOKIE_KEY, token);
  },

  getToken: function(){
    if (Cookies.get(REST_TOKEN_COOKIE_KEY) != ""){
      return Cookies.get(REST_TOKEN_COOKIE_KEY);
    }        
    return "";
  },

  getAuthHeaders: function () {
    var headers = {};

    if (this.getToken()) {      
      headers.Authorization = "Token " + Authen.getToken();
    }    
    return headers;
  },

  checkLogin: function(){    
    
  },
  showProfile: function(){   
    var authen = this;
    if(this.getToken() != ""){    
      $('#profile-panel').show();
      $('#login-panel').hide();
      $('#register-form').hide();      
      var header = this.getAuthHeaders();      
      AjaxUtil.request({
          headers: $.extend({}, header, {"X-Requested-With": "XMLHttpRequest"}),
          method: "GET",
          url: Api.profile.toString(),        
          success: function (response, textStatus, jqXHR) {            
            if (textStatus == "success") {
              // Show profile
              $("#desc_name").text("Hello "+response.name);
              $("#desc_address").html("<strong>Adress:</strong> "+response.address); 
              $("#desc_email").html("<strong>Email:</strong> "+response.email);               
              $("#desc_mobile").html("<strong>Mobile:</strong> "+response.mobile_number);                             
              $("#desc_username").html("<strong>Nickname:</strong> "+response.username);   
              authen.handleLogout();
            } 
          },
           error: function (jqXHR, textStatus, errorThrown) {
            if(textStatus == "error"){
              // Login required
              authen.handleLoginDialog();
            }           
          },
        });
    }else{
      Authen.handleLoginDialog();
    }    
  },
  showLogin: function(){
    $('#profile-panel').hide();
    $('#login-panel').show();
    $("#login-form").delay(100).fadeIn(100);
    $("#register-form").fadeOut(100);
    $('#register-form-link').removeClass('active');
    $('#login-form-link').addClass('active');
    $('#register-form').hide();   
    this.forgotPasswordHandle();
  },
  showRegister: function(){
    $('#profile-panel').hide();
    $('#login-panel').show();
    $("#register-form").delay(100).fadeIn(100);
    $("#login-form").fadeOut(100);
    $('#register-form-link').removeClass('active');
    $(this).addClass('active');    
    Registration.handleRegister();
  },
  handleLoginDialog: function () {    
    // Show login dialog
    this.showLogin();
    var authen = this;
    var tokenHeader = {};
    $('body').on('submit', '#login-form', function (e) {
      e.preventDefault();
      var form = $(this);
      // Do login
      AjaxUtil.request({
        headers: $.extend({}, tokenHeader, {"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded"}),
        method: "POST",
        url: Api.login.toString(),
        data: {
          username: form.find('input[name="username"]').val(),
          password: form.find('input[name="password"]').val()
        },        
        beforeSend: function (jqXHR, settings) {
          
        },
        success: function (response, textStatus, jqXHR) {
          if (textStatus == 'success') {
            // Set cookie
            authen.setCookieToken(response.auth_token);
            // Show profile
            authen.showProfile();
          } 
        },
        error: function (jqXHR, textStatus, errorThrown) {                         
          alert('Incorrect username or password!');
        },
      });
    });
  },

  handleLogout: function(){
    // Logout
    var authen = this;
    $('#logout-btn').click(function(e){
      e.preventDefault();                  
      if(authen.getToken() != ""){    
        var header = authen.getAuthHeaders();      
        AjaxUtil.request({
            headers: $.extend({}, header, {"X-Requested-With": "XMLHttpRequest"}),
            method: "POST",
            url: Api.logout.toString()
          });
      }
      authen.setCookieToken("");
      authen.showLogin();
      });    
  },
  forgotPasswordHandle: function(){
    $('#forgot-password-action').click(function(e){
      informText = "<p>Your reset has been sent to admin (nauh94@gmail.com), he will do it for you soon!</p>";
      ModalInform.showModal("Reset password", "Confirm", informText, function(){          
          // if(Authen.getToken() != ""){    
            // var header = Authen.getAuthHeaders();      
            var header = {"Content-Type": "application/json"};
            AjaxUtil.request({
                headers: $.extend({}, header, {"X-Requested-With": "XMLHttpRequest"}),
                method: "POST",
                data:JSON.stringify({
                  email: "nauh94@gmail.com",
                }),
                url: Api.password.toString(),        
                success: function (response, textStatus, jqXHR) {                              
                },
                 error: function (jqXHR, textStatus, errorThrown) {                         
                },
              });
          // }
          Authen.showLogin();
      });
      e.preventDefault();  
    });
  }, 
  handleConfirmPassword: function(uid, token){
    var informText = $("#confirm_password_tmpl").html()
    ModalInform.showModal("Reset password", "Close", informText, function(){});
    $('body').on('submit', '#password-confirm-form', function (e) {
      e.preventDefault();
      var form = $(this);
      AjaxUtil.request({
        headers: $.extend({},{"Content-Type": "application/json"},{"X-Requested-With": "XMLHttpRequest"}),
        method: "POST",
        url: Api.password_confirm.toString(),
        data: JSON.stringify({
          new_password: form.find('input[name="password_new"]').val(), 
          uid: uid,
          token: token
        }),                
        success: function (response, textStatus, jqXHR) {
          alert("Reset password success!");          
        },
        error: function (jqXHR, textStatus, errorThrown) { 
          alert("Reset password "+textStatus+" !\n"+jqXHR.responseText);
        },
      });
      $("#infor-modal").modal("hide");
      Authen.showLogin();
    });
  }
};

var Registration = {
  /*
  registration
  */
  handleRegister: function(){   
    this.formValidate();
  },
  formValidate: function(){
    $("form[name='registration']").validate({
    // Specify validation rules
    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side
      username: {
        required: true,
        minlength: 2,
        maxlength: 30
      },
      name: {
        required: true,
        minlength: 2,
        maxlength: 65
      },
      address: {
        required: true,
        minlength: 2,
        maxlength: 65
      },
      mobile_number: {
        digits: true,
        required: true,
        minlength: 2,
        maxlength: 20
      },
      email: {
        required: true,
        // Specify that email should be validated
        // by the built-in "email" rule
        email: true,
        maxlength: 255
      },
      regist_password: {
        required: true,
        minlength: 5
      },
      confirm_password: {
        required: true,
        minlength: 5,
        equalTo: "#regist_password"
      }
    },
    // Specify validation error messages
    messages: {
      username: "Please enter username",
      address: "Please enter address",
      mobile_number: "Must containt numeric values",
      name: "Please enter your name",
      regist_password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long"
      },
      confirm_password: {
        required: "Please provide a confirm password",
        equalTo: "Not same to password"
      },
      email: "Please enter a valid email address"
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
      // form.submit();
      var form = $(form);    
      // submit data
      var tokenHeader = {};  
      
      AjaxUtil.request({
        headers: $.extend({},{"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded"}),
        method: "POST",
        url: Api.register.toString(),
        data: {
          username: form.find('input[name="username"]').val(),
          name: form.find('input[name="name"]').val(),
          address: form.find('input[name="address"]').val(),
          mobile_number: form.find('input[name="mobile_number"]').val(),
          email: form.find('input[name="email"]').val(),
          password: form.find('input[name="regist_password"]').val()
        },                
        success: function (response, textStatus, jqXHR) {
          
          if (textStatus == 'success') {
            // redirect to activate page
            // or inform user
            content = "<p><em>Congratulations!</em></p>"+
                "<p>You've been register success with username: <em>"+response.username+"</em></p>"+
                "<p>Click Login below to show your profile.</p>";
            ModalInform.showModal("", "Login", content, function(){
              Authen.showLogin();
            });
          } else {
            //@TODO            
            // Show error
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {              
          alert("Reset password "+textStatus+" !\n"+jqXHR.responseText);
        },
      });
    }
  });
  },
};

var ModalInform = {
  showModal: function(title, actionText, informContent, actionCallback){
    if(title != "") {
      $("#infor-modal .modal-title").text(title);  
    };
    $("#infor-modal .modal-footer button").text(actionText);
    $("#modal-body-box").html(informContent);
    $("#infor-modal").modal();
    $("#infor-modal").on('hide.bs.modal', actionCallback);
  }
}

$(function() {
  // 
  $('#login-form-link').click(function(e) {
    Authen.showLogin();
    e.preventDefault();    
  });
  $('#register-form-link').click(function(e) {    
    Authen.showRegister();
    e.preventDefault();    
  });
  // Auto login
  Authen.showProfile();    
  // Confirm password
  var pathname = window.location.href;
  if (pathname.indexOf("/password/reset/confirm/") >= 0){
    var tokens = pathname.split("/");
    var authToken = tokens[tokens.length-1];
    var uid = tokens[tokens.length-2];
    Authen.handleConfirmPassword(uid, authToken);
  }    
});
