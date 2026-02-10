<?php

namespace App\Console\Commands;

use Cloudinary\Cloudinary;
use Illuminate\Console\Command;

class TestCloudinaryConnection extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cloudinary:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Cloudinary connection and display configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing Cloudinary configuration...');
        $this->newLine();

        // Check if credentials are set
        $cloudName = config('cloudinary.cloud_name');
        $apiKey = config('cloudinary.api_key');
        $apiSecret = config('cloudinary.api_secret');

        if (empty($cloudName) || empty($apiKey) || empty($apiSecret)) {
            $this->error('❌ Cloudinary credentials are not configured properly!');
            $this->newLine();
            $this->warn('Please set the following in your .env file:');
            $this->line('- CLOUDINARY_CLOUD_NAME');
            $this->line('- CLOUDINARY_API_KEY');
            $this->line('- CLOUDINARY_API_SECRET');
            return Command::FAILURE;
        }

        // Display configuration
        $this->info('Configuration:');
        $this->table(
            ['Setting', 'Value'],
            [
                ['Cloud Name', $cloudName],
                ['API Key', substr($apiKey, 0, 4) . '***' . substr($apiKey, -4)],
                ['API Secret', '***' . substr($apiSecret, -4)],
                ['Folder', config('cloudinary.folders.entries')],
            ]
        );
        $this->newLine();

        // Test connection
        try {
            $this->info('Testing connection to Cloudinary...');
            
            $cloudinary = new Cloudinary([
                'cloud' => [
                    'cloud_name' => $cloudName,
                    'api_key' => $apiKey,
                    'api_secret' => $apiSecret,
                ],
            ]);

            // Try to ping Cloudinary by accessing the API
            $result = $cloudinary->adminApi()->ping();
            
            if ($result && isset($result['status']) && $result['status'] === 'ok') {
                $this->info('✅ Successfully connected to Cloudinary!');
                $this->newLine();
                
                // Get usage information
                try {
                    $usage = $cloudinary->adminApi()->usage();
                    $this->info('Account Usage:');
                    $this->table(
                        ['Resource', 'Used', 'Limit'],
                        [
                            ['Storage', $this->formatBytes($usage['storage']['usage'] ?? 0), $this->formatBytes($usage['storage']['limit'] ?? 0)],
                            ['Bandwidth', $this->formatBytes($usage['bandwidth']['usage'] ?? 0), $this->formatBytes($usage['bandwidth']['limit'] ?? 0)],
                            ['Transformations', number_format($usage['transformations']['usage'] ?? 0), number_format($usage['transformations']['limit'] ?? 0)],
                        ]
                    );
                } catch (\Exception $e) {
                    $this->warn('Could not fetch usage information.');
                }
                
                return Command::SUCCESS;
            } else {
                $this->error('❌ Connection test failed!');
                return Command::FAILURE;
            }
        } catch (\Exception $e) {
            $this->error('❌ Error: ' . $e->getMessage());
            $this->newLine();
            $this->warn('Please check your credentials and try again.');
            return Command::FAILURE;
        }
    }

    /**
     * Format bytes to human readable format.
     */
    private function formatBytes($bytes, $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
}
