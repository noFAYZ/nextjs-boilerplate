import { apiClient } from '@/lib/api-client';
import type {
  Goal,
  CreateGoalRequest,
  UpdateGoalRequest,
  AddContributionRequest,
  GetGoalsParams,
  GetGoalsResponse,
  GetGoalResponse,
  CreateGoalResponse,
  UpdateGoalResponse,
  DeleteGoalResponse,
  CalculateGoalProgressResponse,
  AddContributionResponse,
  GetAnalyticsResponse,
  ApiResponse
} from '@/lib/types/goals';

class GoalsApiService {
  private readonly basePath = '/goals';

  // Get all goals
  async getGoals(params: GetGoalsParams = {}): Promise<GetGoalsResponse> {
    const searchParams = new URLSearchParams();

    // Filters
    if (params.type) {
      const types = Array.isArray(params.type) ? params.type : [params.type];
      types.forEach(type => searchParams.append('type', type));
    }
    if (params.category) searchParams.set('category', params.category);
    if (params.priority) searchParams.set('priority', params.priority);
    if (params.isAchieved !== undefined) searchParams.set('isAchieved', params.isAchieved.toString());
    if (params.isActive !== undefined) searchParams.set('isActive', params.isActive.toString());
    if (params.sourceType) searchParams.set('sourceType', params.sourceType);
    if (params.onTrack !== undefined) searchParams.set('onTrack', params.onTrack.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.tags) searchParams.set('tags', params.tags);

    // Date range filters
    if (params.targetDateFrom) searchParams.set('targetDateFrom', params.targetDateFrom);
    if (params.targetDateTo) searchParams.set('targetDateTo', params.targetDateTo);

    // Sorting
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

    // Pagination
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());

    // Include options
    if (params.includeArchived !== undefined) searchParams.set('includeArchived', params.includeArchived.toString());
    if (params.includeMilestones !== undefined) searchParams.set('includeMilestones', params.includeMilestones.toString());
    if (params.includeSnapshots !== undefined) searchParams.set('includeSnapshots', params.includeSnapshots.toString());
    if (params.snapshotLimit) searchParams.set('snapshotLimit', params.snapshotLimit.toString());

    const query = searchParams.toString();
    return apiClient.get<GetGoalsResponse>(`${this.basePath}${query ? `?${query}` : ''}`);
  }

  // Get single goal
  async getGoal(goalId: string, includeSnapshots: boolean = false): Promise<GetGoalResponse> {
    const query = includeSnapshots ? '?includeSnapshots=true' : '';
    return apiClient.get<GetGoalResponse>(`${this.basePath}/${goalId}${query}`);
  }

  // Create goal
  async createGoal(goalData: CreateGoalRequest): Promise<CreateGoalResponse> {
    return apiClient.post<CreateGoalResponse>(this.basePath, goalData);
  }

  // Update goal
  async updateGoal(goalId: string, updates: UpdateGoalRequest): Promise<UpdateGoalResponse> {
    return apiClient.put<UpdateGoalResponse>(`${this.basePath}/${goalId}`, updates);
  }

  // Delete goal
  async deleteGoal(goalId: string): Promise<DeleteGoalResponse> {
    return apiClient.delete<DeleteGoalResponse>(`${this.basePath}/${goalId}`);
  }

  // Calculate goal progress
  async calculateProgress(goalId: string): Promise<CalculateGoalProgressResponse> {
    return apiClient.post<CalculateGoalProgressResponse>(`${this.basePath}/${goalId}/calculate`);
  }

  // Add manual contribution
  async addContribution(goalId: string, contribution: AddContributionRequest): Promise<AddContributionResponse> {
    return apiClient.post<AddContributionResponse>(`${this.basePath}/${goalId}/contribute`, contribution);
  }

  // Get analytics
  async getAnalytics(): Promise<GetAnalyticsResponse> {
    // Analytics endpoint should be called before other endpoints to avoid conflicts
    return apiClient.get<GetAnalyticsResponse>('/goals/analytics');
  }

  // Archive/Unarchive goal
  async archiveGoal(goalId: string): Promise<UpdateGoalResponse> {
    return this.updateGoal(goalId, { isArchived: true });
  }

  async unarchiveGoal(goalId: string): Promise<UpdateGoalResponse> {
    return this.updateGoal(goalId, { isArchived: false });
  }

  // Activate/Deactivate goal
  async activateGoal(goalId: string): Promise<UpdateGoalResponse> {
    return this.updateGoal(goalId, { isActive: true });
  }

  async deactivateGoal(goalId: string): Promise<UpdateGoalResponse> {
    return this.updateGoal(goalId, { isActive: false });
  }

  // Utility methods for common operations
  async refreshAllGoals(): Promise<ApiResponse<{ goalIds: string[]; successCount: number; failureCount: number }>> {
    try {
      const goalsResponse = await this.getGoals({ isActive: true });

      if (!goalsResponse.success) {
        return goalsResponse as ApiResponse<{ goalIds: string[]; successCount: number; failureCount: number }>;
      }

      const results = await Promise.allSettled(
        goalsResponse.data.map(goal => this.calculateProgress(goal.id))
      );

      const successful = results.filter(r => r.status === 'fulfilled');
      const goalIds = results
        .filter((r): r is PromiseFulfilledResult<CalculateGoalProgressResponse> => r.status === 'fulfilled')
        .filter(r => r.value.success)
        .map(r => r.value.data.goalId);

      return {
        success: true,
        data: {
          goalIds,
          successCount: successful.length,
          failureCount: results.length - successful.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'REFRESH_ERROR',
          message: 'Failed to refresh goals',
          details: error
        }
      };
    }
  }

  // Get goals by type
  async getGoalsByType(type: GetGoalsParams['type']): Promise<GetGoalsResponse> {
    return this.getGoals({ type, isActive: true });
  }

  // Get active goals only
  async getActiveGoals(params: GetGoalsParams = {}): Promise<GetGoalsResponse> {
    return this.getGoals({ ...params, isActive: true, includeArchived: false });
  }

  // Get completed goals
  async getCompletedGoals(params: GetGoalsParams = {}): Promise<GetGoalsResponse> {
    return this.getGoals({ ...params, isAchieved: true });
  }

  // Get goals that are off track
  async getOffTrackGoals(params: GetGoalsParams = {}): Promise<GetGoalsResponse> {
    return this.getGoals({ ...params, onTrack: false, isActive: true, isAchieved: false });
  }

  // Get goals by priority
  async getGoalsByPriority(priority: GetGoalsParams['priority']): Promise<GetGoalsResponse> {
    return this.getGoals({ priority, isActive: true, sortBy: 'targetDate', sortOrder: 'asc' });
  }

  // Bulk operations
  async bulkUpdateGoals(
    updates: { goalId: string; updates: UpdateGoalRequest }[]
  ): Promise<ApiResponse<Goal[]>> {
    try {
      const results = await Promise.allSettled(
        updates.map(({ goalId, updates }) => this.updateGoal(goalId, updates))
      );

      const successful = results
        .filter((result): result is PromiseFulfilledResult<UpdateGoalResponse> =>
          result.status === 'fulfilled' && result.value.success
        )
        .map(result => result.value.data);

      const failed = results.filter(result =>
        result.status === 'rejected' ||
        (result.status === 'fulfilled' && !result.value.success)
      );

      if (failed.length > 0) {
        console.warn(`${failed.length} goal updates failed`);
      }

      return {
        success: true,
        data: successful
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BULK_UPDATE_ERROR',
          message: 'Failed to update goals',
          details: error
        }
      };
    }
  }

  async bulkDeleteGoals(goalIds: string[]): Promise<ApiResponse<{ deletedCount: number; failedCount: number }>> {
    try {
      const results = await Promise.allSettled(
        goalIds.map(id => this.deleteGoal(id))
      );

      const successful = results.filter(
        (result): result is PromiseFulfilledResult<DeleteGoalResponse> =>
          result.status === 'fulfilled' && result.value.success
      );

      return {
        success: true,
        data: {
          deletedCount: successful.length,
          failedCount: results.length - successful.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BULK_DELETE_ERROR',
          message: 'Failed to delete goals',
          details: error
        }
      };
    }
  }

  async bulkArchiveGoals(goalIds: string[]): Promise<ApiResponse<{ archivedCount: number; failedCount: number }>> {
    try {
      const results = await Promise.allSettled(
        goalIds.map(id => this.archiveGoal(id))
      );

      const successful = results.filter(
        (result): result is PromiseFulfilledResult<UpdateGoalResponse> =>
          result.status === 'fulfilled' && result.value.success
      );

      return {
        success: true,
        data: {
          archivedCount: successful.length,
          failedCount: results.length - successful.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BULK_ARCHIVE_ERROR',
          message: 'Failed to archive goals',
          details: error
        }
      };
    }
  }

  // Helper to get goal progress summary
  async getGoalProgressSummary(): Promise<ApiResponse<{
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    onTrackGoals: number;
    offTrackGoals: number;
    averageProgress: number;
    totalTargetAmount: number;
    totalCurrentAmount: number;
  }>> {
    try {
      const [allGoals, analytics] = await Promise.all([
        this.getGoals({ isActive: true }),
        this.getAnalytics()
      ]);

      if (!allGoals.success) {
        return allGoals as unknown as GetGoalsResponse;
      }

      if (!analytics.success) {
        return analytics as unknown as GetGoalsResponse;
      }

      const goals = allGoals.data;
      const averageProgress = goals.length > 0
        ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
        : 0;

      return {
        success: true,
        data: {
          totalGoals: analytics.data.totalGoals,
          activeGoals: analytics.data.activeGoals,
          completedGoals: analytics.data.completedGoals,
          onTrackGoals: analytics.data.onTrackGoals,
          offTrackGoals: analytics.data.offTrackGoals,
          averageProgress,
          totalTargetAmount: analytics.data.totalTargetAmount,
          totalCurrentAmount: analytics.data.totalCurrentAmount
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SUMMARY_ERROR',
          message: 'Failed to fetch goal summary',
          details: error
        }
      };
    }
  }
}

export const goalsApi = new GoalsApiService();
export default goalsApi;
