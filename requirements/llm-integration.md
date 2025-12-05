# LLM Integration Requirements

## Overview

Rytnow is a personal/small team project management system that will also be used for agentic development workflows. This document outlines how LLM providers can enhance the platform for both human users and AI agents.

## Current State

### Existing Infrastructure
- **LLM Providers** (`llm_providers` table) - Users can configure multiple OpenAI-compatible endpoints
  - OpenAI, Anthropic, Groq, Together AI, OpenRouter
  - Local: Ollama, LM Studio
  - Custom endpoints
- **Audio Recordings** - "Explain Task" feature captures voice notes on tasks
- **Rich Documents** - TipTap editor for plans and documentation
- **Full PM Stack** - Tasks, sprints, time tracking, comments, subtasks, dependencies, plans

### Provider Configuration
- Per-user provider configuration
- Encrypted API key storage
- Support for multiple providers with default selection
- Model discovery from endpoints

---

## Feature Requirements

### Phase 1: Core LLM Service

#### 1.1 LlmService (Foundation)
**Priority: Critical**

Create a centralized service for all LLM interactions.

```php
App\Services\LlmService
├── chat(string $prompt, array $messages = [], array $options = [])
├── complete(string $prompt, array $options = [])
├── transcribe(string $audioPath) // via Whisper-compatible endpoint
└── embed(string $text) // for future semantic search
```

**Requirements:**
- Use user's default LlmProvider
- Support provider override per-request
- Graceful fallback when no provider configured
- Token usage tracking (optional)
- Rate limiting awareness
- Streaming support for long responses

**Configuration Options:**
```php
[
    'model' => 'gpt-4',           // Override default model
    'temperature' => 0.7,
    'max_tokens' => 2000,
    'provider_id' => 123,         // Use specific provider
]
```

---

### Phase 2: Voice-to-Task (High Impact)

#### 2.1 Audio Transcription
**Priority: High**

Convert existing audio recordings to text using Whisper-compatible API.

**User Flow:**
1. User records audio explanation on task (existing feature)
2. System transcribes audio in background
3. Transcription saved alongside audio
4. User can edit transcription

**Technical:**
- Background job for transcription
- Store transcription in `audio_recordings.transcription` column
- Retry logic for API failures
- Support for Whisper API (OpenAI) and local Whisper (Ollama)

#### 2.2 Audio-to-Description Enhancement
**Priority: High**

Use transcription to enhance task description.

**User Flow:**
1. After transcription, offer "Enhance Description" action
2. LLM processes transcription + existing description
3. Generates structured task description with:
   - Clear problem statement
   - Acceptance criteria
   - Technical notes (if applicable)
4. User reviews and applies changes

**Prompt Template:**
```
You are helping structure a task for a project management system.

Current task title: {title}
Current description: {description}
Voice explanation: {transcription}

Generate a clear, structured task description that includes:
1. Problem/Goal statement
2. Acceptance criteria (as checkbox list)
3. Any technical considerations mentioned

Keep the tone professional but concise.
```

---

### Phase 3: Smart Task Creation

#### 3.1 Natural Language Task Input
**Priority: High**

Quick task creation from natural language.

**User Flow:**
1. User types: "Fix login bug on mobile, high priority, assign to me"
2. System parses and extracts:
   - Title: "Fix login bug on mobile"
   - Priority: high
   - Assignee: current user
3. Shows preview for confirmation
4. Creates task

**Parsing Approach:**
- LLM extracts structured data from input
- Returns JSON with extracted fields
- Handles ambiguity by asking clarifying questions

**Supported Extractions:**
- Title (required)
- Description
- Priority (low/medium/high)
- Assignee (@mentions)
- Labels (#tags)
- Due date (natural language: "next Friday", "in 2 days")
- Story points
- Sprint assignment

#### 3.2 Similar Task Detection
**Priority: Medium**

Prevent duplicate tasks.

**Flow:**
1. Before creating task, search for similar existing tasks
2. Use title + description similarity
3. Show potential duplicates to user
4. Option to link as related or proceed with creation

**Technical:**
- Simple: Keyword matching + LLM verification
- Future: Embedding-based semantic search

---

### Phase 4: Plan & Document Intelligence

#### 4.1 Plan-to-Tasks Breakdown
**Priority: High**

Automatically generate tasks from a plan document.

**User Flow:**
1. User writes plan document (feature spec)
2. Clicks "Generate Tasks"
3. LLM analyzes document and suggests tasks:
   - Task title
   - Description
   - Suggested story points
   - Dependencies between tasks
4. User reviews, adjusts, and bulk-creates

**Prompt Template:**
```
Analyze this feature plan and break it down into implementable tasks.

Plan Title: {plan_title}
Plan Content: {plan_content}

For each task, provide:
- title: Clear, actionable title
- description: What needs to be done
- story_points: Estimate (1, 2, 3, 5, 8)
- depends_on: List of task titles this depends on

Return as JSON array. Focus on concrete implementation tasks, not meta-tasks.
```

#### 4.2 Document Writing Assistant
**Priority: Medium**

Help write plan documents.

**Features:**
- Expand bullet points into full sections
- Generate technical approach from requirements
- Suggest missing sections (risks, alternatives, etc.)
- Improve clarity and structure

**UI:**
- Inline "AI Assist" button in document editor
- Select text + "Improve" / "Expand" / "Simplify"
- Generate section from prompt

---

### Phase 5: Summaries & Reports

#### 5.1 Daily Standup Generator
**Priority: Medium**

Generate standup reports from activity.

**Input:**
- Tasks completed yesterday
- Tasks in progress
- Time entries
- Blockers (tasks with blocked status)

**Output:**
```
## Yesterday
- Completed ABC-123: Fixed login validation
- Worked on ABC-124: User profile redesign (4h)

## Today
- Continue ABC-124
- Start ABC-125: API rate limiting

## Blockers
- ABC-126 waiting on API access from external team
```

#### 5.2 Sprint Summary
**Priority: Medium**

Generate sprint retrospective data.

**Input:**
- Sprint tasks (completed, incomplete, added mid-sprint)
- Time tracking data
- Velocity comparison

**Output:**
- What was accomplished
- What wasn't completed and why
- Velocity analysis
- Suggested improvements

#### 5.3 Comment Thread Summarization
**Priority: Low**

Summarize long discussion threads.

**Use Case:**
- Task has 20+ comments
- User wants quick summary of decisions made
- LLM extracts: key decisions, action items, unresolved questions

---

### Phase 6: Agentic Development Support

#### 6.1 MCP Server
**Priority: Critical for Agentic Workflows**

Expose Rytnow as an MCP (Model Context Protocol) server for AI assistants like Claude Code.

**Tools to Expose:**
```
rytnow_list_projects()
rytnow_list_tasks(project_id, status?, assignee?)
rytnow_get_task(task_id)
rytnow_create_task(project_id, title, description, ...)
rytnow_update_task(task_id, status?, description?, ...)
rytnow_add_comment(task_id, content)
rytnow_get_plan(plan_id)
rytnow_list_plans(project_id)
rytnow_log_time(task_id, duration, note?)
```

**Resources to Expose:**
```
project://{id} - Project details + recent tasks
task://{id} - Full task with comments, subtasks
plan://{id} - Plan document content
sprint://{id} - Sprint with all tasks
```

**Use Cases:**
- Claude Code queries current tasks before starting work
- Agent creates task when identifying needed work
- Agent updates task status upon completion
- Agent logs time spent on implementation
- Agent links commits/PRs to tasks via comments

#### 6.2 Webhook Events
**Priority: Medium**

Emit webhooks for agent consumption.

**Events:**
- `task.created`
- `task.updated`
- `task.completed`
- `comment.created`
- `plan.updated`

**Payload:**
```json
{
  "event": "task.completed",
  "timestamp": "2025-12-05T10:30:00Z",
  "data": {
    "task_id": 123,
    "project_id": 1,
    "title": "Fix login bug",
    "completed_by": "user@example.com"
  }
}
```

#### 6.3 Agent Context Endpoint
**Priority: High**

Provide rich context for agents working on tasks.

**Endpoint:** `GET /api/v1/tasks/{task}/context`

**Response:**
```json
{
  "task": { ... },
  "plan": { "title": "...", "content": "..." },
  "related_tasks": [...],
  "recent_comments": [...],
  "subtasks": [...],
  "time_logged": "4h 30m",
  "blockers": [...]
}
```

---

## Technical Architecture

### Service Layer
```
App\Services\
├── LlmService.php              # Core LLM interaction
├── TranscriptionService.php    # Audio → Text
├── TaskEnhancementService.php  # Task description improvement
├── TaskParserService.php       # Natural language → task
├── SummaryService.php          # Standup/sprint reports
└── PlanBreakdownService.php    # Plan → tasks
```

### API Endpoints (Internal)
```
POST /ai/transcribe              # Transcribe audio
POST /ai/enhance-task            # Improve task description
POST /ai/parse-task              # Natural language → task JSON
POST /ai/breakdown-plan          # Plan → task suggestions
POST /ai/summarize-comments      # Summarize thread
GET  /ai/standup                 # Generate standup report
```

### Database Changes
```sql
-- Add transcription to audio recordings
ALTER TABLE audio_recordings ADD COLUMN transcription TEXT;
ALTER TABLE audio_recordings ADD COLUMN transcription_status ENUM('pending', 'processing', 'completed', 'failed');

-- AI usage tracking (optional)
CREATE TABLE ai_usage_logs (
    id BIGINT PRIMARY KEY,
    user_id BIGINT,
    provider_id BIGINT,
    feature VARCHAR(50),      -- 'transcription', 'enhancement', etc.
    tokens_used INT,
    model VARCHAR(100),
    created_at TIMESTAMP
);
```

### Background Jobs
```
App\Jobs\
├── TranscribeAudioJob.php      # Process audio transcription
├── EnhanceTaskJob.php          # Async task enhancement
└── GenerateSummaryJob.php      # Generate reports
```

---

## Implementation Priority

| Phase | Feature | Impact | Effort | Priority |
|-------|---------|--------|--------|----------|
| 1 | LlmService foundation | Critical | Medium | P0 |
| 2.1 | Audio transcription | High | Medium | P1 |
| 2.2 | Audio → description | High | Low | P1 |
| 3.1 | Natural language task | High | Medium | P1 |
| 4.1 | Plan → tasks breakdown | High | Medium | P1 |
| 6.1 | MCP Server | Critical | High | P1 |
| 6.3 | Agent context endpoint | High | Low | P1 |
| 5.1 | Standup generator | Medium | Low | P2 |
| 4.2 | Document assistant | Medium | Medium | P2 |
| 3.2 | Similar task detection | Medium | Medium | P2 |
| 5.2 | Sprint summary | Medium | Low | P2 |
| 6.2 | Webhooks | Medium | Medium | P2 |
| 5.3 | Comment summarization | Low | Low | P3 |

---

## UI/UX Considerations

### Non-Intrusive AI Features
- AI features should be optional enhancements
- Always show "AI-generated" indicator
- Allow easy editing of AI output
- Don't block workflows if AI unavailable

### Progressive Disclosure
- Simple UI for basic features
- Advanced options for power users
- Clear feedback during AI processing

### Error Handling
- Graceful degradation when provider unavailable
- Clear error messages
- Retry options for transient failures

---

## Security Considerations

1. **API Key Security** - Already implemented with encryption
2. **Content Privacy** - User content sent to configured providers only
3. **Rate Limiting** - Prevent abuse of AI features
4. **Audit Logging** - Track AI feature usage
5. **Provider Isolation** - User data only sent to user's chosen provider

---

## Success Metrics

1. **Adoption**
   - % of users with configured LLM provider
   - AI feature usage per user

2. **Quality**
   - Task description quality improvement (subjective)
   - Time saved in task creation
   - Accuracy of natural language parsing

3. **Agentic**
   - Number of tasks created via API/MCP
   - Agent-assisted task completion rate
