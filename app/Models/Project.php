<?php

namespace App\Models;

use App\Services\CacheService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'workspace_id',
        'name',
        'key',
        'description',
        'status',
        'start_date',
        'due_date',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'due_date' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Project $project) {
            if (empty($project->key)) {
                $project->key = $project->generateKey();
            }
            if (empty($project->next_task_number)) {
                $project->next_task_number = 1;
            }
        });

        static::created(fn (Project $project) => CacheService::clearProjectCache($project));
        static::updated(fn (Project $project) => CacheService::clearProjectCache($project));
        static::deleted(fn (Project $project) => CacheService::clearProjectCache($project));
    }

    /**
     * Generate a unique project key from the name
     */
    public function generateKey(): string
    {
        $name = $this->name;
        $words = preg_split('/[\s\-_]+/', $name);

        if (count($words) >= 2) {
            // Use first letter of each word (up to 4)
            $key = '';
            foreach (array_slice($words, 0, 4) as $word) {
                $key .= strtoupper(substr($word, 0, 1));
            }
        } else {
            // Single word - use first 3-4 consonants/letters
            $key = strtoupper(substr(preg_replace('/[aeiou]/i', '', $name), 0, 4));
            if (strlen($key) < 2) {
                $key = strtoupper(substr($name, 0, 4));
            }
        }

        // Ensure uniqueness within workspace
        $baseKey = $key;
        $counter = 1;
        while (static::where('workspace_id', $this->workspace_id)
            ->where('key', $key)
            ->exists()) {
            $key = $baseKey.$counter;
            $counter++;
        }

        return $key;
    }

    /**
     * Get the next task number and increment the counter
     */
    public function getNextTaskNumber(): int
    {
        $number = $this->next_task_number;
        $this->increment('next_task_number');

        return $number;
    }

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function labels(): HasMany
    {
        return $this->hasMany(Label::class);
    }

    public function docFolders(): HasMany
    {
        return $this->hasMany(DocFolder::class)->orderBy('position');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
