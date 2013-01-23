<?php include 'main.php' ?>

<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        <title>Jmail</title>
        <meta name="description" content=""/>
        <meta name="viewport" content="width=device-width"/>

        <base href="http://localhost:8888/newtest/" />
        <script src="./components/modernizr.js" type="text/javascript"></script>
        <link rel="stylesheet" href="styles/main.css"/>
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'>
    </head>
    <body>

        <header class="header">
            <div class="container">

                <section class="title">
                        <h1><a href="#">Jmail</a></h1>
                </section>

                <nav class="navcontain">
                    <ul class="nav">
                            <li><a href="#login">Login</a></li>
                            <li><a href="#register">Sign Up</a></li>
                    </ul>
                </nav>

            </div>
        </header>

    <!-- Main container. -->
    <div class="content">
        <div role="main" id="main">
            <!--content here-->
        </div>
    </div>

    <footer class="footercontain">
        <div class="container">
            <section class="footer">
                <p class="left"><a href="#register">Register</a>  -  <a href="#login">Login</a></p>
                <p>&copy; 2013 Jmail by Devin Andrews.</p>
            </section>
        </div>
    </footer>

        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an outdated browser. <a href="http://browsehappy.com/">Upgrade your browser today</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to better experience this site.</p>
        <![endif]-->

        <!-- Add your site or application content here -->

        <!-- build:js scripts/amd-app.js -->
        <script data-main="scripts/config" src="scripts/libs/require.js"></script>
        <!-- endbuild -->

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <!--<script>
            var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script'));
        </script>-->
    </body>
</html>