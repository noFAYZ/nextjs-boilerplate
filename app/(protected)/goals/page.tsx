'use client';

import React from 'react';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
import { GoalsDashboard } from '@/components/goals/goals-dashboard';

const GoalsPage = () => {
  usePostHogPageView('goals');
  return <GoalsDashboard />;
};

export default GoalsPage;
