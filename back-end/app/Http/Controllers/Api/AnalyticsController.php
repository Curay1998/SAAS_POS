<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use App\Models\StickyNote;
use App\Models\Task;
use App\Models\TeamInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Get system overview statistics.
     */
    public function getSystemOverview()
    {
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('created_at', '>=', now()->subDays(30))->count(),
            'total_projects' => Project::count(),
            'total_tasks' => Task::count(),
            'total_sticky_notes' => StickyNote::count(),
            'pending_invitations' => TeamInvitation::where('status', 'pending')->count(),
        ];

        // User growth over last 12 months
        $userGrowth = User::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('COUNT(*) as count')
        )
        ->where('created_at', '>=', now()->subMonths(12))
        ->groupBy('month')
        ->orderBy('month')
        ->get();

        // Project activity over last 30 days
        $projectActivity = Project::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count')
        )
        ->where('created_at', '>=', now()->subDays(30))
        ->groupBy('date')
        ->orderBy('date')
        ->get();

        return response()->json([
            'overview' => $stats,
            'user_growth' => $userGrowth,
            'project_activity' => $projectActivity,
        ]);
    }

    /**
     * Get user analytics.
     */
    public function getUserAnalytics()
    {
        // Users by plan
        $usersByPlan = User::join('plans', 'users.plan_id', '=', 'plans.id')
            ->select('plans.name as plan_name', DB::raw('COUNT(*) as count'))
            ->groupBy('plans.id', 'plans.name')
            ->get();

        // Users by role
        $usersByRole = User::select('role', DB::raw('COUNT(*) as count'))
            ->groupBy('role')
            ->get();

        // User registration trends (last 6 months)
        $registrationTrends = User::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('COUNT(*) as registrations')
        )
        ->where('created_at', '>=', now()->subMonths(6))
        ->groupBy('month')
        ->orderBy('month')
        ->get();

        // Active users by day (last 30 days)
        $activeUsers = User::select(
            DB::raw('DATE(updated_at) as date'),
            DB::raw('COUNT(DISTINCT id) as active_users')
        )
        ->where('updated_at', '>=', now()->subDays(30))
        ->groupBy('date')
        ->orderBy('date')
        ->get();

        return response()->json([
            'users_by_plan' => $usersByPlan,
            'users_by_role' => $usersByRole,
            'registration_trends' => $registrationTrends,
            'active_users' => $activeUsers,
        ]);
    }

    /**
     * Get project analytics.
     */
    public function getProjectAnalytics()
    {
        // Project creation trends
        $projectTrends = Project::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('COUNT(*) as count')
        )
        ->where('created_at', '>=', now()->subMonths(6))
        ->groupBy('month')
        ->orderBy('month')
        ->get();

        // Projects by status (active vs inactive based on recent activity)
        $activeProjects = Project::whereHas('tasks', function($query) {
            $query->where('updated_at', '>=', now()->subDays(30));
        })->count();

        $inactiveProjects = Project::whereDoesntHave('tasks', function($query) {
            $query->where('updated_at', '>=', now()->subDays(30));
        })->count();

        // Average tasks per project
        $avgTasksPerProject = Project::withCount('tasks')->get()->avg('tasks_count');

        // Most active projects (by task count)
        $topProjects = Project::select('projects.id', 'projects.name', 'users.name as owner_name')
            ->join('users', 'projects.user_id', '=', 'users.id')
            ->withCount('tasks')
            ->orderBy('tasks_count', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'project_trends' => $projectTrends,
            'project_status' => [
                'active' => $activeProjects,
                'inactive' => $inactiveProjects,
            ],
            'average_tasks_per_project' => round($avgTasksPerProject, 2),
            'top_projects' => $topProjects,
        ]);
    }

    /**
     * Get task analytics.
     */
    public function getTaskAnalytics()
    {
        // Task completion rates
        $completedTasks = Task::where('status', 'completed')->count();
        $totalTasks = Task::count();
        $completionRate = $totalTasks > 0 ? ($completedTasks / $totalTasks) * 100 : 0;

        // Tasks by status
        $tasksByStatus = Task::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get();

        // Task creation trends
        $taskTrends = Task::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m-%d") as date'),
            DB::raw('COUNT(*) as count')
        )
        ->where('created_at', '>=', now()->subDays(30))
        ->groupBy('date')
        ->orderBy('date')
        ->get();

        // Average tasks completed per day
        $avgTasksCompleted = Task::where('status', 'completed')
            ->where('updated_at', '>=', now()->subDays(30))
            ->count() / 30;

        return response()->json([
            'completion_rate' => round($completionRate, 2),
            'tasks_by_status' => $tasksByStatus,
            'task_trends' => $taskTrends,
            'average_tasks_completed_per_day' => round($avgTasksCompleted, 2),
        ]);
    }

    /**
     * Get team collaboration analytics.
     */
    public function getTeamAnalytics()
    {
        // Team invitation stats
        $invitationStats = TeamInvitation::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get();

        // Most collaborative users (by invitations sent)
        $topInviters = User::select('users.id', 'users.name', 'users.email')
            ->withCount(['sentInvitations' => function($query) {
                $query->where('created_at', '>=', now()->subMonths(3));
            }])
            ->orderBy('sent_invitations_count', 'desc')
            ->limit(10)
            ->get();

        // Team size distribution
        $teamSizes = Project::select('projects.id', 'projects.name')
            ->withCount('members')
            ->get()
            ->groupBy(function($project) {
                if ($project->members_count <= 1) return '1 member';
                if ($project->members_count <= 3) return '2-3 members';
                if ($project->members_count <= 5) return '4-5 members';
                if ($project->members_count <= 10) return '6-10 members';
                return '10+ members';
            })
            ->map(function($group) {
                return ['count' => $group->count()];
            });

        // Invitation acceptance rate
        $totalInvitations = TeamInvitation::count();
        $acceptedInvitations = TeamInvitation::where('status', 'accepted')->count();
        $acceptanceRate = $totalInvitations > 0 ? ($acceptedInvitations / $totalInvitations) * 100 : 0;

        return response()->json([
            'invitation_stats' => $invitationStats,
            'top_inviters' => $topInviters,
            'team_size_distribution' => $teamSizes,
            'invitation_acceptance_rate' => round($acceptanceRate, 2),
        ]);
    }
}
