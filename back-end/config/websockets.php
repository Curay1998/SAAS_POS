<?php

use BeyondCode\LaravelWebSockets\Dashboard\Http\Middleware\Authorize;

return [
    /*
     * This package comes with multi tenancy out of the box. Here you can
     * configure the different apps that can use the webSockets server.
     *
     * Optionally you can disable client events so clients cannot send
     * messages to each other via the webSockets.
     */
    'apps' => [
        [
            'id' => env('PUSHER_APP_ID'),
            'name' => env('APP_NAME', 'Laravel'),
            'key' => env('PUSHER_APP_KEY'),
            'secret' => env('PUSHER_APP_SECRET'),
            'path' => env('PUSHER_APP_PATH', null),
            'capacity' => null,
            'enable_client_messages' => false,
            'enable_statistics' => true,
        ],
    ],

    /*
     * This class is responsible for finding the apps. The default provider
     * will use the apps defined in this config file.
     *
     * You can create your own provider by implementing the
     * `AppProvider` interface.
     */
    'app_provider' => BeyondCode\LaravelWebSockets\Apps\ConfigAppProvider::class,

    /*
     * This array contains the hosts of which you want to allow incoming requests.
     * Leave this empty if you want to accept requests from all hosts.
     */
    'allowed_origins' => [
        // env('APP_URL'), // Example: your frontend URL
    ],

    /*
     * The maximum request size in kilobytes that is allowed for an incoming WebSocket message.
     */
    'max_request_size_in_kb' => 250,

    /*
     * The path to call POST requests to.
     */
    'path' => 'laravel-websockets',

    /*
     * This class is responsible for handling the statistics of the webSocket server.
     * By default, it will store statistics in the database.
     *
     * You can create your own provider by implementing the
     * `StatisticsStore` interface.
     */
    'statistics' => [
        'model' => \BeyondCode\LaravelWebSockets\Statistics\Models\WebSocketsStatisticsEntry::class,
        'logger' => BeyondCode\LaravelWebSockets\Statistics\Logger\HttpStatisticsLogger::class,
        'interval_in_seconds' => 60,
        'delete_statistics_older_than_days' => 60,
        'perform_dns_lookup' => false,
    ],

    /*
     * Define the optional SSL configuration.
     */
    'ssl' => [
        'local_cert' => env('LARAVEL_WEBSOCKETS_SSL_LOCAL_CERT', null),
        'local_pk' => env('LARAVEL_WEBSOCKETS_SSL_LOCAL_PK', null),
        'passphrase' => env('LARAVEL_WEBSOCKETS_SSL_PASSPHRASE', null),
    ],

    /*
     * The dashboard is a web page where you can see statistics regarding webSocket server.
     */
    'dashboard' => [
        'port' => env('LARAVEL_WEBSOCKETS_PORT', 6001),
        'path' => 'laravel-websockets', // Matches the general path
        'middleware' => [
            'web', // Ensure session and other web middleware are active
            Authorize::class, // Default authorization for dashboard
        ],
    ],

    /*
     * Define the connection parameters for the websocket server.
     */
    'server' => [
        'host' => '0.0.0.0', // Listen on all interfaces
        'port' => env('LARAVEL_WEBSOCKETS_PORT', 6001),
        'max_connections' => null, // Set to an integer value to limit connections
    ],

    /*
     * Determine the ping interval and timeout for the websocket connections.
     */
    'ping_interval_in_seconds' => 15,
    'timeout_in_seconds' => 30,


    /*
     * This option controls whether the package should automatically restart the server
     * when it receives a SIGTERM or SIGINT signal. This is useful in combination
     * with a process manager like Supervisor.
     */
    'auto_restart_server' => true,
];
