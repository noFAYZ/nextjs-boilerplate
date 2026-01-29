'use client';

import React from 'react';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
import { GoalsDashboard } from '@/components/modules/goals/components/goals-dashboard';

const GoalsPage = () => {
  usePostHogPageView('goals');
  return <GoalsDashboard />;
};

export default GoalsPage;
