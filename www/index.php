<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>

    <p>
        Now is: <?php echo strftime("%d.%m %H:%M"); ?>
    </p>

    <p class="php">
        <span>This should be red</span> and this should be green
    </p>

    <?php 

        print_r(get_loaded_extensions());
        phpinfo();
    ?>
    
</body>
</html>