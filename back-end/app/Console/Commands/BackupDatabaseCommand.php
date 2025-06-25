<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Carbon\Carbon;

class BackupDatabaseCommand extends Command
{
    protected $signature = 'db:backup {--path=}';
    protected $description = 'Creates a backup of the database (MySQL/PostgreSQL only).';

    public function handle()
    {
        $connection = Config::get('database.default');
        $dbConfig = Config::get("database.connections.{$connection}");

        $type = $dbConfig['driver'];
        $host = $dbConfig['host'];
        $port = $dbConfig['port'];
        $database = $dbConfig['database'];
        $username = $dbConfig['username'];
        $password = $dbConfig['password'];

        $backupPath = $this->option('path') ?: storage_path('app/backups');
        if (!is_dir($backupPath)) {
            mkdir($backupPath, 0755, true);
        }

        $fileName = Carbon::now()->format('Y-m-d_His') . '-backup.sql';
        $filePath = $backupPath . '/' . $fileName;

        $process = null;

        if ($type === 'mysql') {
            $command = sprintf(
                'mysqldump --user=%s --password=%s --host=%s --port=%s %s > %s',
                escapeshellarg($username),
                escapeshellarg($password),
                escapeshellarg($host),
                escapeshellarg($port),
                escapeshellarg($database),
                escapeshellarg($filePath)
            );
            $process = Process::fromShellCommandline($command);
        } elseif ($type === 'pgsql') {
            $command = sprintf(
                'PGPASSWORD=%s pg_dump --host=%s --port=%s --username=%s --dbname=%s -f %s',
                escapeshellarg($password),
                escapeshellarg($host),
                escapeshellarg($port),
                escapeshellarg($username),
                escapeshellarg($database),
                escapeshellarg($filePath)
            );
            // PGPASSWORD needs to be in env for pg_dump
            $process = Process::fromShellCommandline($command, null, ['PGPASSWORD' => $password]);
        } else {
            $this->error("Unsupported database type: {$type}. Only MySQL and PostgreSQL are supported by this command.");
            return 1;
        }

        try {
            $this->info("Starting database backup for '{$database}' ({$type})...");
            $process->mustRun();
            $this->info("Database backup successful: {$filePath}");

            // Compress the backup (optional)
            if (class_exists('PharData')) {
                 $this->info("Compressing backup file...");
                 $phar = new \PharData($filePath . '.gz');
                 $phar->addFile($filePath, $fileName);
                 $phar->compress(\Phar::GZ);
                 unlink($filePath); // Remove original SQL file
                 $this->info("Backup compressed: {$filePath}.gz");
            }

        } catch (ProcessFailedException $exception) {
            $this->error("Database backup failed: " . $exception->getMessage());
            // Log detailed error: $exception->getProcess()->getErrorOutput();
            return 1;
        }
        return 0;
    }
}
