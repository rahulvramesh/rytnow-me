<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_id',
        'user_id',
        'parent_id',
        'content',
        'highlight_id',
        'selection_start',
        'selection_end',
        'selected_text',
        'is_resolved',
        'resolved_by',
        'resolved_at',
    ];

    protected $casts = [
        'is_resolved' => 'boolean',
        'resolved_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(DocumentComment::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(DocumentComment::class, 'parent_id')->orderBy('created_at');
    }

    public function mentions(): HasMany
    {
        return $this->hasMany(DocumentCommentMention::class);
    }

    public function resolvedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    /**
     * Scope to get only root comments (not replies)
     */
    public function scopeRootComments($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope to get unresolved comments
     */
    public function scopeUnresolved($query)
    {
        return $query->where('is_resolved', false);
    }

    /**
     * Check if the given user can resolve this comment
     * (author or mentioned users)
     */
    public function canBeResolvedBy(User $user): bool
    {
        // Comment author can resolve
        if ($this->user_id === $user->id) {
            return true;
        }

        // Mentioned users can resolve
        return $this->mentions()->where('user_id', $user->id)->exists();
    }
}
