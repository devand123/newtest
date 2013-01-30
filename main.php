<?php 

// Require idiorm & paris for ORM
require_once 'includes/idiorm.php';
require_once 'includes/paris.php';
// Require slim framework
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

// Instantiate a slim application
$app = new \Slim\Slim();


//Configure database options
//Development version:
ORM::configure('mysql:host=localhost;dbname=newtest');
ORM::configure('username', 'root');
ORM::configure('password', 'root');
//Production
//ORM::configure('mysql:host=localhost;dbname=devinan4_newtest');
//ORM::configure('username', 'devinan4_devin');
//ORM::configure('password', 'Passiton1@');

// Represents the 'Users' table in the database
class Users extends Model {
}

// Represents the 'Messages' table in the database
class Messages extends Model {
}

// Rewrite to not show errrors
$app->notFound(function () use($app) {
    // Preventing slim from rendering any errors, as our front-end is handling routing,
    // and it seems to confuse slim for obvious reasons with pushState.
});

// Called when a user registers.
// This adds them into the database.
$app->post('/registeruser', function () use ($app) {

    $users = Model::factory('Users')->create();

    // Get the body of the json data sent from the form submit
    $request = $app->request();
    $body = $request->getBody();

    $json_a = json_decode($body, true);

    $users->username = $json_a['username'];

    //hash the password value received
    $passHash = md5($json_a['password']);
    //store the hashed password
    $users->password = $passHash;
    $users->email = $json_a['email'];

    // Save the users model received
    $users->save();
});

// Changing the user login status on logout
$app->put('/logoutuser/:id', function($id) use ($app) {

    //check against the users db table by matching the username
    $user = Model::factory('Users')->find_one($id);

    //update the loginstatus to 1 or true
    $user->loginstatus = 0;
    $user->save();
});

// Changing the user login status on login
$app->put('/loginuser/:id', function($id) use ($app) {

    //check against the users db table by matching the username
    $user = Model::factory('Users')->find_one($id);

    //update the loginstatus to 1 or true
    $user->loginstatus = 1;
    $user->save();
});


// Logging the user in
$app->get('/loginuser', function() use ($app) {

    $app->contentType('application/json');

    $username = $_GET['username'];
    $getpass = $_GET['password'];
    $passwordhash = md5($getpass);

    $user = Model::factory('Users')
            ->where('username', $username)
            ->where('password', $passwordhash)
            ->find_one();

    // Define all the values based on whatever the db returned from above
    $uid = $user->id;
    $newusername = $user->username;
    $password = $user->password;
    $email = $user->email;

    // Check to see if the hashed password matches their stored password in the db
    if($passwordhash == $password) {
        // JSON encode all of those values to pass back to the application in response
        $dataArray = array('uid' => $uid, 'username' => $newusername, 'password' => $password, 'email' => $email);

        echo json_encode($dataArray);
        exit();
    }
    // No need to specify else here, as it just wont return if the users password does
    // not match the one in the db

});

// MESSAGE SENDING
$app->post('/sendmessage', function () use ($app) {

    $message = Model::factory('Messages')->create();

    $request = $app->request();
    $body = $request->getBody();

    $myjson = json_decode($body, true);

    // the user the message is sent to's username
    $username = $myjson['to'];

    // find it in the users database
    $findUser = Model::factory('Users')->where('username', $username)->find_one();

    // return their id
    $usersid = $findUser->id;
    // their username associated with that id
    $userRecordUsername = $findUser->username;

    // save the id as the 'to' for this message record
    $message->sendto = $usersid;
    $message->sendtoname = $userRecordUsername;
    $message->messagetitle = $myjson['title'];
    $message->messagebody = $myjson['body'];
    $message->receiveddate = $myjson['received'];
    $message->uid = $myjson['uid'];
    $message->usersent = $myjson['usersent'];

    $message->save();
    exit();
});

// Get the message that is being replied to
// When reply button is clicked
$app->get('/replyto/:id', function ($id) use ($app) {

    $app->contentType('application/json');

    // Getting the recipients user record
    $message = Model::factory('Messages')->find_one($id);

    $id = $message->id;
    $sendTo = $message->sendto;
    $messageTitle = $message->messagetitle;
    $messageBody = $message->messagebody;
    $fromUser = $message->usersent;
    $fromUserID = $message->uid;
    $received = $message->receiveddate;

    $dataArray = array('id' => $id, 'sendto' => $sendTo, 'messagetitle' => $messageTitle, 'messagebody' => $messageBody, 'usersent' => $fromUser, 'fromid' => $fromUserID, 'receiveddate' => $received);

    echo json_encode($dataArray);
    exit();
});

// Get all messages for that particular user
$app->get('/getmessages', function () use ($app) {

    $app->contentType('application/json');

    // this is sent via ajax request
    // the username that the messages are for
    $userId = $_GET['uid'];

    // Getting the recipients user record
    $getUser = Model::factory('Users')->find_one($userId);

    // Getting their username to set in $sendto
    $username = $getUser->username;

    //Get the messages that were meant to be sent to this user ID
    $messagesForMe = Model::factory('Messages')->where('sendto', $userId)->order_by_desc('id')->find_array();

    echo json_encode($messagesForMe);
    exit();
});

// Get specific message for singleMessageView by id
$app->get('/getmessages/:id', function ($id) use ($app) {

    $app->contentType('application/json');

    // Make sure the message is for the current user by checking for their user id
    // which is sent with the ajax request

    $uid = $_GET['uid'];

    //Get the messages that were meant to be sent to this user ID
    $message = Model::factory('Messages')->where('sendto', $uid)->find_one($id);

    $dataArray = $message->as_array();

    echo json_encode($dataArray);
    exit();
});

// SENT MESSAGES

// Get all 'sent messages' for the current user
$app->get('/getsentmessages', function () use ($app) {

    $app->contentType('application/json');

    // this is sent via ajax request
    // the username that the messages are for
    $userId = $_GET['uid'];

    //Get the messages that were meant to be sent to this user ID
    $messagesForMe = Model::factory('Messages')->where('uid', $userId)->order_by_desc('id')->find_array();

    echo json_encode($messagesForMe);
    exit();
});

// Get specific message for singleMessageView by id
$app->get('/getsentmessages/:id', function ($id) use ($app) {

    $app->contentType('application/json');

    // Make sure the message is for the current user by checking for their user id
    // which is sent with the ajax request
    $uid = $_GET['uid'];

    //Get the messages that were meant to be sent to this user ID
    $message = Model::factory('Messages')->where('uid', $uid)->find_one($id);

    $dataArray = $message->as_array();

    echo json_encode($dataArray);
    exit();
});

// Mark message read
$app->put('/updatemessage/:id', function($id) use ($app) {

    //check against the users db table 'sendto' per the user id sent in
    // which was grabbed from localstorage api key uid stored data
    $message = Model::factory('Messages')->find_one($id);

    //update the loginstatus to 1 or true
    $message->isread = 1;
    $message->save();
    exit();
});

//Delete message
$app->delete('/deletemessage/:id', function ($id) {

    // Find message by the id provided
    $message = Model::factory('Messages')->find_one($id);
    $message->delete();
    exit();
});


// THIS IS THE EXPLORE PAGE
$app->get('/getusers', function () use($app) {

    $app->contentType('application/json');

    $users = Model::factory('Users')->where('profile', 'user')->limit(10)->find_array();

    echo json_encode($users);
    exit();

});

//explore page infinite scroll 'getusersagain'
$app->get('/getusersagain', function () use($app) {

    $id = $_GET['id'];

    $app->contentType('application/json');

    $users = Model::factory('Users')
            //where id is greater than the last results id
            //so it starts where it left off
            ->where_gt('id', $id)
            ->limit(15)
            ->find_array();

    echo json_encode($users);
    exit();

});

// Single user profile page, get single user by their ID
$app->get('/getuser/:id', function ($id) use($app) {

    $app->contentType('application/json');

    $user = Model::factory('Users')->find_one($id);

    $uid = $user->id;
    $username = $user->username;
    $email = $user->email;
    $aboutme = $user->aboutme;

    // NOTES TO SELF:
    // Eventually want to return last logged in time, which will have to update on each login
    // This will also be a good way to keep track of who to show first on the explore page.
    // Just show users that were last logged in descending
    $dataArray = array('id' => $uid, 'username' => $username, 'email' => $email, 'aboutme' => $aboutme);

    echo json_encode($dataArray);
    exit();

});

// Save profile/Edit profile
$app->put('/saveprofile/:id', function($id) use ($app) {

    // get the incoming data (in this case, the changed about me)
    $request = $app->request();
    // get the body of the json
    $body = $request->getBody();

    // decode it
    $json_a = json_decode($body, true);

    // find that specific user based off the id
    $user = Model::factory('Users')->find_one($id);

    // set the users about me to what we got from the incomind data
    $user->aboutme = $json_a['aboutme'];

    // save the user yo.
    $user->save();
    exit();
});

// Get matching user from compose send-to keydown event for the 'show user hint' function
$app->get('/getmatchinguser', function () use($app) {

    $app->contentType('application/json');

    // Get the incoming data
    $username = $_GET['username'];

    // find_many() returns an array, so you  dont have to construct one yourself, just encode and echo!
    $user = Model::factory('Users')->where_like('username', '%'.$username.'%')->find_array();

    echo json_encode($user);
    exit();

});

// Run the application
$app->run();


?>