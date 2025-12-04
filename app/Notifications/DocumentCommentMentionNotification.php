<?php

namespace App\Notifications;

use App\Models\Document;
use App\Models\DocumentComment;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DocumentCommentMentionNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public DocumentComment $comment,
        public User $mentioner,
        public Document $document
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $documentUrl = route('docs.show', [
            'project' => $this->document->project_id,
            'document' => $this->document->id,
        ]);

        // Strip mention markup from content for display
        $cleanContent = preg_replace('/@\[([^\]]+)\]\(\d+\)/', '@$1', $this->comment->content);

        return (new MailMessage)
            ->subject("{$this->mentioner->name} mentioned you in a document")
            ->greeting("Hello {$notifiable->name}!")
            ->line("{$this->mentioner->name} mentioned you in \"{$this->document->title}\":")
            ->line("\"{$cleanContent}\"")
            ->action('View Comment', $documentUrl)
            ->line('Reply to continue the conversation.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'comment_id' => $this->comment->id,
            'document_id' => $this->document->id,
            'document_title' => $this->document->title,
            'mentioner_id' => $this->mentioner->id,
            'mentioner_name' => $this->mentioner->name,
        ];
    }
}
