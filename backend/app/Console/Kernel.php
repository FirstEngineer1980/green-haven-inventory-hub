<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Run at 1:00 AM every day
        $schedule->command('orders:process-recurring')->dailyAt('01:00');

        // Prune old logs every week (Sunday at 2 AM)
        $schedule->command('activitylog:clean')->weekly()->sundays()->at('02:00');

        // Backup the database daily
        $schedule->command('backup:clean')->daily()->at('01:30');
        $schedule->command('backup:run')->daily()->at('02:30');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
