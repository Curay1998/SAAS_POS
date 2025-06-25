# Database Backup Guide

This document outlines strategies for backing up the application's database. Regular backups are crucial for data recovery in case of hardware failure, data corruption, or other unforeseen issues.

## Automated Backups (Recommended)

For production environments, automated backups are highly recommended. This typically involves setting up a cron job or a scheduled task on your server that periodically dumps the database and stores it in a secure, remote location (e.g., Amazon S3, Google Cloud Storage, or another backup server).

**Tools:**
- **MySQL:** `mysqldump`
- **PostgreSQL:** `pg_dump`

**Example Cron Job (conceptual):**
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/your/backup_script.sh
```
Your `backup_script.sh` would contain the necessary commands to dump the database, compress it, and upload it to your backup storage. Ensure the script handles credentials securely and includes error logging/notifications.

## Manual Backups using Artisan Command

A Laravel Artisan command `db:backup` has been provided for convenience. This command can perform a manual backup of the database (supports MySQL and PostgreSQL).

**Usage:**
```bash
php artisan db:backup
```
This will create a `.sql` (or `.sql.gz` if compression is enabled and successful) file in `storage/app/backups/`.

**Custom Path:**
You can specify a custom directory to store the backup:
```bash
php artisan db:backup --path=/custom/backup/directory
```

**Scheduling the Artisan Command:**
You can also use this Artisan command within a cron job:
```bash
0 2 * * * cd /path/to/your/project/back-end && php artisan db:backup >> /var/log/backup.log 2>&1
```
Ensure the user running the cron job has the necessary permissions to execute the command and write to the backup location.

## Using `spatie/laravel-backup` (Alternative)

For a more comprehensive and configurable backup solution within Laravel, consider using the `spatie/laravel-backup` package. It offers features like:
- Backing up files and databases.
- Storing backups on multiple filesystems (S3, Dropbox, etc.).
- Cleaning up old backups.
- Notifications on backup success/failure.

Refer to the official Spatie documentation for installation and configuration: [https://spatie.be/docs/laravel-backup](https://spatie.be/docs/laravel-backup)

## Important Considerations
- **Backup Frequency:** Determine an appropriate backup frequency based on your data change rate and recovery point objectives (RPO).
- **Backup Retention:** Define how long backups should be kept.
- **Storage Location:** Store backups in a separate physical location from your primary server. Cloud storage is a good option.
- **Security:** Ensure backup files are encrypted if they contain sensitive data, and that access to backup storage is restricted.
- **Testing:** Regularly test your backup restoration process to ensure backups are valid and can be restored successfully.
- **Database Credentials:** The `db:backup` command uses credentials from your `.env` file. Ensure these are secure and the command is run in a trusted environment.
