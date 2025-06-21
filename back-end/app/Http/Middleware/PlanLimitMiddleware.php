<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PlanLimitMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $feature = null): Response
    {
        $user = $request->user();
        
        if (!$user || !$user->plan) {
            return response()->json([
                'success' => false,
                'message' => 'No active plan found. Please subscribe to a plan.',
                'upgrade_required' => true
            ], 403);
        }

        $plan = $user->plan;

        // Check specific feature limits
        switch ($feature) {
            case 'team_members':
                $currentMembers = $user->projectMemberships()->count();
                if ($plan->max_users > 0 && $currentMembers >= $plan->max_users) {
                    return response()->json([
                        'success' => false,
                        'message' => "You've reached the team member limit for your {$plan->name} plan ({$plan->max_users} members).",
                        'current_limit' => $plan->max_users,
                        'current_usage' => $currentMembers,
                        'upgrade_required' => true
                    ], 403);
                }
                break;

            case 'projects':
                $currentProjects = $user->projects()->count();
                $projectLimit = $this->getProjectLimit($plan);
                if ($projectLimit > 0 && $currentProjects >= $projectLimit) {
                    return response()->json([
                        'success' => false,
                        'message' => "You've reached the project limit for your {$plan->name} plan ({$projectLimit} projects).",
                        'current_limit' => $projectLimit,
                        'current_usage' => $currentProjects,
                        'upgrade_required' => true
                    ], 403);
                }
                break;

            case 'storage':
                // This would require implementing storage tracking
                // For now, we'll just check if the user has storage limits
                $storageLimit = $this->getStorageLimit($plan);
                if ($storageLimit === 0) {
                    return response()->json([
                        'success' => false,
                        'message' => "Storage uploads are not available on your {$plan->name} plan.",
                        'upgrade_required' => true
                    ], 403);
                }
                break;

            case 'advanced_features':
                // Check if the plan allows advanced features
                if (!$this->hasAdvancedFeatures($plan)) {
                    return response()->json([
                        'success' => false,
                        'message' => "Advanced features are not available on your {$plan->name} plan.",
                        'upgrade_required' => true
                    ], 403);
                }
                break;
        }

        return $next($request);
    }

    private function getProjectLimit($plan): int
    {
        // Define project limits based on plan
        switch ($plan->name) {
            case 'Starter':
                return 3;
            case 'Professional':
                return 20;
            case 'Enterprise':
                return -1; // Unlimited
            default:
                return 1;
        }
    }

    private function getStorageLimit($plan): int
    {
        // Extract storage limit from plan storage field
        // This is a simple implementation - in production, you'd want more sophisticated parsing
        $storage = $plan->storage;
        if (strpos($storage, 'GB') !== false) {
            return (int) filter_var($storage, FILTER_SANITIZE_NUMBER_INT);
        }
        return 0;
    }

    private function hasAdvancedFeatures($plan): bool
    {
        // Check if plan includes advanced features
        $advancedPlans = ['Professional', 'Enterprise'];
        return in_array($plan->name, $advancedPlans);
    }
}
