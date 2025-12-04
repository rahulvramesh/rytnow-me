<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentCommentMention extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_comment_id',
        'user_id',
        'notified',
    ];

    protected $casts = [
        'notified' => 'boolean',
    ];

    public function comment(): BelongsTo
    {
        return $this->belongsTo(DocumentComment::class, 'document_comment_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
