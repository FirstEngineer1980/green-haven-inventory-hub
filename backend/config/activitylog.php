
<?php

return [
    'activity_model' => \Spatie\Activitylog\Models\Activity::class,

    'default_log_name' => 'default',

    'default_auth_driver' => null,

    'subject_returns_soft_deleted_models' => false,

    'activity_logger_on_clean' => Spatie\Activitylog\CleanActivitylogCommandLoggerBased::class,

    'delete_records_older_than_days' => 365,

    'delete_records_limit' => 5000,

    'delete_batch_size' => 1000,

    'activity_can_contain_logged_models' => true,
];
