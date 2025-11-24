'use client';

import { useState } from 'react';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
import AuthGuard from '@/components/auth/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PageLoader, PageLoaderWrapper } from '@/components/ui/page-loader';
import {
  useUserProfile,
  useUserStats,
  useUpdateUserProfile,
  useUploadProfilePicture,
  useDeleteUserAccount
} from '@/lib/queries/use-auth-data';
import { useToast } from '@/lib/hooks/use-toast';
import { useLoading } from '@/lib/contexts/loading-context';
import { User, Mail, Phone, Calendar, DollarSign, Globe, Camera, Trash2 } from 'lucide-react';
import type { UserProfileUpdateData } from '@/lib/types';
import { FailLoader, LogoLoader } from '@/components/icons';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function ProfilePage() {
  usePostHogPageView('profile');
  // PRODUCTION-GRADE: Use TanStack Query hooks with explicit enabled flag
  const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile({ enabled: true });
  const { data: stats, isLoading: statsLoading } = useUserStats({ enabled: true });
  const { mutateAsync: updateProfile } = useUpdateUserProfile();
  const { mutateAsync: uploadProfilePicture } = useUploadProfilePicture();
  const { mutateAsync: deleteAccount } = useDeleteUserAccount();

  const { toast } = useToast();
  const { withLoading, showLoading, hideLoading } = useLoading();

  const isLoading = profileLoading || statsLoading;
  const error = profileError ? (profileError instanceof Error ? profileError.message : 'Failed to load profile') : null;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<UserProfileUpdateData>({});

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data when canceling
      setFormData({});
    } else {
      // Pre-populate form data when starting to edit
      setFormData({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        phone: profile?.phone || '',
        dateOfBirth: profile?.dateOfBirth?.split('T')[0] || '',
        monthlyIncome: profile?.monthlyIncome || 0,
        currency: profile?.currency || 'USD',
        timezone: profile?.timezone || 'UTC',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      setIsSaving(true);
      showLoading('Updating your profile...');

      const response = await updateProfile(formData as Partial<{ name?: string; image?: string; email?: string }>);

      if (response.success) {
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully.',
        });
        setIsEditing(false);
      } else {
        toast({
          title: 'Update failed',
          description: response.error.message,
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Update failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
      hideLoading();
    }
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      showLoading('Uploading profile picture...');

      const response = await uploadProfilePicture(file);

      if (response.success) {
        toast({
          title: 'Profile picture updated',
          description: 'Your profile picture has been updated successfully.',
        });
      } else {
        toast({
          title: 'Upload failed',
          description: response.error.message,
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Upload failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      hideLoading();
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      showLoading('Deleting your account...');

      const response = await deleteAccount();

      if (response.success) {
        toast({
          title: 'Account deleted',
          description: 'Your account has been deleted successfully.',
        });
        // The user will be redirected by the auth system
      } else {
        toast({
          title: 'Deletion failed',
          description: response.error.message,
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Deletion failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      hideLoading();
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <PageLoader message="Loading your profile..." />
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <FailLoader className="w-16 h-16" />
              </div>
              <CardTitle className="text-destructive">Failed to Load Profile</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    );
  }

  if (!profile) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Profile not found</CardTitle>
              <CardDescription>Unable to load your profile information.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Breadcrumb className="mb-2">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Profile</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <p className="text-muted-foreground text-sm">
                Manage your account settings and preferences
              </p>
            </div>
            <Button 
              onClick={handleEditToggle}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="relative mx-auto w-24 h-24">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.profilePicture} />
                      <AvatarFallback className="text-2xl">
                        {profile?.firstName?.[0] }
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2">
                      <label htmlFor="profile-picture" className="cursor-pointer">
                        <div className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors">
                          {isUploading ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Camera className="w-4 h-4" />
                          )}
                        </div>
                      </label>
                      <input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureUpload}
                        disabled={isUploading}
                      />
                    </div>
                  </div>
                  <CardTitle>
                    {profile.firstName && profile.lastName 
                      ? `${profile.firstName} ${profile.lastName}`
                      : profile.email
                    }
                  </CardTitle>
                  <CardDescription>{profile.email}</CardDescription>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    <Badge variant="secondary">{profile.currentPlan}</Badge>
                    <Badge variant={profile.status === 'ACTIVE' ? 'default' : 'destructive'}>
                      {profile.status}
                    </Badge>
                    {profile.emailVerified && (
                      <Badge variant="default">Verified</Badge>
                    )}
                  </div>
                </CardHeader>
              </Card>

              {/* Stats */}
              {stats && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Account Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Accounts</span>
                      <span className="font-medium">{stats.accounts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transactions</span>
                      <span className="font-medium">{stats.transactions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Categories</span>
                      <span className="font-medium">{stats.categories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budgets</span>
                      <span className="font-medium">{stats.budgets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Goals</span>
                      <span className="font-medium">{stats.goals}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        <User className="w-4 h-4 inline mr-2" />
                        First Name
                      </Label>
                      {isEditing ? (
                        <Input
                          id="firstName"
                          value={formData.firstName || ''}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="Enter first name"
                        />
                      ) : (
                        <p className="text-sm bg-muted p-3 rounded-md">
                          {profile.firstName || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        <User className="w-4 h-4 inline mr-2" />
                        Last Name
                      </Label>
                      {isEditing ? (
                        <Input
                          id="lastName"
                          value={formData.lastName || ''}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Enter last name"
                        />
                      ) : (
                        <p className="text-sm bg-muted p-3 rounded-md">
                          {profile.lastName || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </Label>
                      <p className="text-sm bg-muted p-3 rounded-md">
                        {profile.email}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <p className="text-sm bg-muted p-3 rounded-md">
                          {profile.phone || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Date of Birth
                      </Label>
                      {isEditing ? (
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth || ''}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm bg-muted p-3 rounded-md">
                          {profile.dateOfBirth 
                            ? new Date(profile.dateOfBirth).toLocaleDateString()
                            : 'Not provided'
                          }
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthlyIncome">
                        <DollarSign className="w-4 h-4 inline mr-2" />
                        Monthly Income
                      </Label>
                      {isEditing ? (
                        <Input
                          id="monthlyIncome"
                          type="number"
                          value={formData.monthlyIncome || ''}
                          onChange={(e) => setFormData({ ...formData, monthlyIncome: parseFloat(e.target.value) || 0 })}
                          placeholder="Enter monthly income"
                        />
                      ) : (
                        <p className="text-sm bg-muted p-3 rounded-md">
                          {profile.monthlyIncome 
                            ? formatCurrency(profile.monthlyIncome, profile.currency)
                            : 'Not provided'
                          }
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">
                        <DollarSign className="w-4 h-4 inline mr-2" />
                        Currency
                      </Label>
                      {isEditing ? (
                        <select
                          id="currency"
                          value={formData.currency || 'USD'}
                          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="CAD">CAD - Canadian Dollar</option>
                          <option value="AUD">AUD - Australian Dollar</option>
                        </select>
                      ) : (
                        <p className="text-sm bg-muted p-3 rounded-md">
                          {profile.currency}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">
                        <Globe className="w-4 h-4 inline mr-2" />
                        Timezone
                      </Label>
                      {isEditing ? (
                        <Input
                          id="timezone"
                          value={formData.timezone || ''}
                          onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                          placeholder="Enter timezone (e.g., America/New_York)"
                        />
                      ) : (
                        <p className="text-sm bg-muted p-3 rounded-md">
                          {profile.timezone}
                        </p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 pt-6">
                      <Button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1"
                      >
                        {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleEditToggle}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="mt-8 border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Delete Account</h3>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}