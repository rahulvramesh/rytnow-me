import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Check,
    Copy,
    ExternalLink,
    Terminal,
    Sparkles,
    Zap,
    Clock,
    MessageSquare,
    FolderKanban,
    ListTodo,
} from 'lucide-react';
import { useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

interface Token {
    id: number;
    name: string;
}

interface PageProps {
    tokens: Token[];
    apiUrl: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Integrations',
        href: '/settings/integrations',
    },
];

const MCP_TOOLS = [
    {
        category: 'Workspaces',
        icon: FolderKanban,
        tools: ['list_workspaces', 'get_workspace', 'get_workspace_members'],
    },
    {
        category: 'Projects',
        icon: FolderKanban,
        tools: ['list_projects', 'get_project', 'list_labels'],
    },
    {
        category: 'Tasks',
        icon: ListTodo,
        tools: [
            'list_tasks',
            'get_task',
            'create_task',
            'update_task',
            'update_task_status',
            'list_subtasks',
            'create_subtask',
            'toggle_subtask',
        ],
    },
    {
        category: 'Plans',
        icon: Sparkles,
        tools: [
            'list_plans',
            'get_plan',
            'create_plan',
            'update_plan_status',
            'link_task_to_plan',
            'unlink_task_from_plan',
        ],
    },
    {
        category: 'Time Tracking',
        icon: Clock,
        tools: ['list_time_entries', 'start_timer', 'stop_timer', 'log_time'],
    },
    {
        category: 'Comments',
        icon: MessageSquare,
        tools: ['list_comments', 'add_comment'],
    },
];

function CopyButton({ text, label }: { text: string; label?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="shrink-0"
        >
            {copied ? (
                <>
                    <Check className="mr-2 size-4 text-green-500" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="mr-2 size-4" />
                    {label || 'Copy'}
                </>
            )}
        </Button>
    );
}

function CodeBlock({
    code,
    language = 'json',
    copyable = true,
}: {
    code: string;
    language?: string;
    copyable?: boolean;
}) {
    return (
        <div className="relative">
            <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100">
                <code>{code}</code>
            </pre>
            {copyable && (
                <div className="absolute right-2 top-2">
                    <CopyButton text={code} />
                </div>
            )}
        </div>
    );
}

export default function Integrations({ tokens, apiUrl }: PageProps) {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        claude: true,
    });

    const hasToken = tokens.length > 0;
    const tokenPlaceholder = hasToken
        ? 'YOUR_API_TOKEN'
        : 'Generate a token in API Tokens settings';

    const claudeCodeConfig = `{
  "mcpServers": {
    "rytnow": {
      "command": "node",
      "args": ["/path/to/rytnow-mcp/dist/index.js"],
      "env": {
        "RYTNOW_API_URL": "${apiUrl}",
        "RYTNOW_API_TOKEN": "${tokenPlaceholder}"
      }
    }
  }
}`;

    const cursorConfig = `{
  "mcp": {
    "servers": {
      "rytnow": {
        "command": "node",
        "args": ["/path/to/rytnow-mcp/dist/index.js"],
        "env": {
          "RYTNOW_API_URL": "${apiUrl}",
          "RYTNOW_API_TOKEN": "${tokenPlaceholder}"
        }
      }
    }
  }
}`;

    const envConfig = `RYTNOW_API_URL=${apiUrl}
RYTNOW_API_TOKEN=${tokenPlaceholder}`;

    const toggleSection = (key: string) => {
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Integrations" />

            <SettingsLayout>
                <div className="space-y-8">
                    <HeadingSmall
                        title="Integrations"
                        description="Connect Rytnow with AI assistants and external tools"
                    />

                    {/* MCP Overview Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="flex items-center gap-2">
                                            <Terminal className="size-5" />
                                            MCP Server
                                        </CardTitle>
                                        <Badge variant="secondary">
                                            27 Tools
                                        </Badge>
                                    </div>
                                    <CardDescription>
                                        Model Context Protocol integration for
                                        AI-powered task management
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <a
                                        href="https://github.com/rahulvramesh/rytnow-mcp"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLink className="mr-2 size-4" />
                                        View on GitHub
                                    </a>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Benefits */}
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="flex items-start gap-3 rounded-lg border p-3">
                                    <Zap className="mt-0.5 size-5 text-yellow-500" />
                                    <div>
                                        <p className="font-medium">
                                            Natural Language
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Create tasks just by asking
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 rounded-lg border p-3">
                                    <Clock className="mt-0.5 size-5 text-blue-500" />
                                    <div>
                                        <p className="font-medium">
                                            Time Tracking
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Start/stop timers hands-free
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 rounded-lg border p-3">
                                    <Sparkles className="mt-0.5 size-5 text-purple-500" />
                                    <div>
                                        <p className="font-medium">
                                            Smart Planning
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            AI-assisted project planning
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Prerequisites */}
                            <div className="rounded-lg border bg-muted/50 p-4">
                                <h4 className="mb-2 font-medium">
                                    Prerequisites
                                </h4>
                                <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                                    <li>Node.js 18+ installed on your machine</li>
                                    <li>
                                        Clone the MCP server:{' '}
                                        <code className="rounded bg-background px-1.5 py-0.5">
                                            git clone
                                            https://github.com/rahulvramesh/rytnow-mcp
                                        </code>
                                    </li>
                                    <li>
                                        Build it:{' '}
                                        <code className="rounded bg-background px-1.5 py-0.5">
                                            cd rytnow-mcp && npm install && npm
                                            run build
                                        </code>
                                    </li>
                                    <li>
                                        <Link
                                            href="/settings/api-tokens"
                                            className="text-primary hover:underline"
                                        >
                                            Generate an API token
                                        </Link>{' '}
                                        {hasToken
                                            ? `(you have ${tokens.length} token${tokens.length > 1 ? 's' : ''})`
                                            : '(none created yet)'}
                                    </li>
                                </ol>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Configuration Sections */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Configuration</h3>

                        {/* Claude Code */}
                        <Collapsible
                            open={openSections.claude}
                            onOpenChange={() => toggleSection('claude')}
                        >
                            <Card>
                                <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base">
                                                Claude Code
                                            </CardTitle>
                                            <Badge>Recommended</Badge>
                                        </div>
                                        <CardDescription>
                                            Anthropic's official CLI for Claude
                                        </CardDescription>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="space-y-4 border-t pt-4">
                                        <div>
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                Add to{' '}
                                                <code className="rounded bg-muted px-1.5 py-0.5">
                                                    ~/.claude/settings.json
                                                </code>{' '}
                                                for global access, or{' '}
                                                <code className="rounded bg-muted px-1.5 py-0.5">
                                                    .claude/settings.json
                                                </code>{' '}
                                                in your project:
                                            </p>
                                            <CodeBlock code={claudeCodeConfig} />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            After adding, restart Claude Code.
                                            Try:{' '}
                                            <code className="rounded bg-muted px-1.5 py-0.5">
                                                "List my workspaces"
                                            </code>
                                        </p>
                                    </CardContent>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>

                        {/* Cursor */}
                        <Collapsible
                            open={openSections.cursor}
                            onOpenChange={() => toggleSection('cursor')}
                        >
                            <Card>
                                <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                                        <CardTitle className="text-base">
                                            Cursor
                                        </CardTitle>
                                        <CardDescription>
                                            AI-first code editor
                                        </CardDescription>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="space-y-4 border-t pt-4">
                                        <div>
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                Add to{' '}
                                                <code className="rounded bg-muted px-1.5 py-0.5">
                                                    ~/.cursor/mcp.json
                                                </code>
                                                :
                                            </p>
                                            <CodeBlock code={cursorConfig} />
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>

                        {/* Environment Variables */}
                        <Collapsible
                            open={openSections.env}
                            onOpenChange={() => toggleSection('env')}
                        >
                            <Card>
                                <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                                        <CardTitle className="text-base">
                                            Environment Variables
                                        </CardTitle>
                                        <CardDescription>
                                            For custom setups or CI/CD
                                        </CardDescription>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="space-y-4 border-t pt-4">
                                        <div>
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                Set these environment variables:
                                            </p>
                                            <CodeBlock
                                                code={envConfig}
                                                language="bash"
                                            />
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>
                    </div>

                    {/* Available Tools */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Available Tools</h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {MCP_TOOLS.map((category) => (
                                <Card key={category.category}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-2 text-sm">
                                            <category.icon className="size-4" />
                                            {category.category}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-1.5">
                                            {category.tools.map((tool) => (
                                                <Badge
                                                    key={tool}
                                                    variant="outline"
                                                    className="font-mono text-xs"
                                                >
                                                    {tool}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Quick Examples */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">
                            Example Commands
                        </h3>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <Badge
                                            variant="outline"
                                            className="mt-0.5 shrink-0"
                                        >
                                            Tasks
                                        </Badge>
                                        <span className="text-muted-foreground">
                                            "Create a task called 'Fix login
                                            bug' with high priority in the
                                            Backend project"
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Badge
                                            variant="outline"
                                            className="mt-0.5 shrink-0"
                                        >
                                            Time
                                        </Badge>
                                        <span className="text-muted-foreground">
                                            "Start a timer on task #42" / "Stop
                                            my current timer"
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Badge
                                            variant="outline"
                                            className="mt-0.5 shrink-0"
                                        >
                                            Plans
                                        </Badge>
                                        <span className="text-muted-foreground">
                                            "Create a plan for implementing user
                                            authentication"
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Badge
                                            variant="outline"
                                            className="mt-0.5 shrink-0"
                                        >
                                            Status
                                        </Badge>
                                        <span className="text-muted-foreground">
                                            "What tasks are in progress?" /
                                            "Show me today's time entries"
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Documentation Link */}
                    <div className="rounded-lg border bg-muted/50 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium">
                                    Full Documentation
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Complete tool reference, examples, and
                                    troubleshooting
                                </p>
                            </div>
                            <Button variant="outline" asChild>
                                <a
                                    href="https://github.com/rahulvramesh/rytnow-mcp/tree/main/docs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <ExternalLink className="mr-2 size-4" />
                                    View Docs
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
