<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Invitation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: white;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .title {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
        }
        .project-info {
            background-color: #f3f4f6;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .project-name {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 5px;
        }
        .inviter-info {
            color: #6b7280;
            font-size: 14px;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            margin: 0 10px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s;
        }
        .button-accept {
            background-color: #10b981;
            color: white;
        }
        .button-accept:hover {
            background-color: #059669;
        }
        .button-decline {
            background-color: #ef4444;
            color: white;
        }
        .button-decline:hover {
            background-color: #dc2626;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
        }
        .expiry-notice {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #92400e;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">TaskFlow</div>
        </div>

        <div class="title">You've been invited to join a project!</div>
        
        <p>Hi there!</p>
        
        <p><strong>{{ $inviter->name }}</strong> has invited you to collaborate on their project.</p>

        <div class="project-info">
            <div class="project-name">{{ $project->name }}</div>
            <div class="inviter-info">
                Invited by {{ $inviter->name }} ({{ $inviter->email }})
            </div>
            @if($project->description)
                <div style="margin-top: 10px; color: #4b5563;">
                    {{ $project->description }}
                </div>
            @endif
        </div>

        <p>You can accept or decline this invitation using the buttons below:</p>

        <div class="button-container">
            <a href="{{ $acceptUrl }}" class="button button-accept">Accept Invitation</a>
            <a href="{{ $declineUrl }}" class="button button-decline">Decline Invitation</a>
        </div>

        <div class="expiry-notice">
            <strong>Note:</strong> This invitation will expire on {{ $invitation->expires_at->format('F j, Y \a\t g:i A') }}.
        </div>

        <p>If you have any questions about this invitation, you can reach out to {{ $inviter->name }} directly at {{ $inviter->email }}.</p>

        <div class="footer">
            <p>This invitation was sent by TaskFlow on behalf of {{ $inviter->name }}.</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
        </div>
    </div>
</body>
</html>