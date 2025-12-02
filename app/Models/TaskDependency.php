<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskDependency extends Model
{
    protected $fillable = [
        'task_id',
        'depends_on_id',
        'type',
    ];

    /**
     * The task that has a dependency
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * The task that is depended upon
     */
    public function dependsOn(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'depends_on_id');
    }
}
