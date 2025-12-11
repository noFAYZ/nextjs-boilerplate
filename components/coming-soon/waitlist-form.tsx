'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CheckCircle, Loader2, Mail, Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GameIconsUpgrade } from '../icons';
import { useJoinWaitlist } from '@/lib/queries/use-waitlist-data';
import { toast } from 'sonner';
import { useGTM } from '@/lib/hooks/use-gtm';

const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(1, 'First name is required').max(50).optional(),
  lastName: z.string().min(1, 'Last name is required').max(50).optional(),
});

type WaitlistForm = z.infer<typeof waitlistSchema>;

interface WaitlistFormProps {
  className?: string;
}

export function WaitlistForm({ className }: WaitlistFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ✅ TanStack Query mutation for server data
  const { mutate: joinWaitlist, isPending } = useJoinWaitlist();

  // ✅ GTM tracking
  const { trackWaitlistSignup } = useGTM();

  const form = useForm<WaitlistForm>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit = (data: WaitlistForm) => {
    joinWaitlist(data, {
      onSuccess: (response) => {
        setIsSubmitted(true);
        form.reset();

        // Track successful waitlist signup with GTM
        trackWaitlistSignup({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        });

        toast.success('Successfully joined the waitlist!', {
          description: 'We\'ll notify you when MoneyMappr launches.',
        });
      },
      onError: (error) => {
        toast.error('Failed to join waitlist', {
          description: error.message,
        });
      },
    });
  };

  if (isSubmitted) {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground">You&apos;re on the list!</h3>
          <p className="text-muted-foreground max-w-sm">
            Thanks for joining our waitlist. We&apos;ll notify you as soon as MoneyMappr launches.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsSubmitted(false)}
          className="mt-4 border-primary/30 hover:bg-primary/10"
        >
          Join another email
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-8", className)}>
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <GameIconsUpgrade className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Join the Waitlist</h3>
        </div>
      
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Fields Row */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">First Name (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 z-10 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="John"
                        {...field}
                        className="h-11 pl-10 border-border/60 focus:ring-0 bg-background/80 backdrop-blur-sm"
                        disabled={isPending}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">Last Name (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 z-10 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Doe"
                        {...field}
                        className="h-11 pl-10 border-border/60 focus:ring-0 bg-background/80 backdrop-blur-sm"
                        disabled={isPending}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-muted-foreground">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 z-10 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="your.email@example.com"
                      {...field}
                      className="h-12 pl-11 text-lg border-border/60 focus:ring-0 bg-background/80 backdrop-blur-sm hover:shadow-md"
                      disabled={isPending}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base transition-all duration-100 hover:shadow-lg "
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Joining Waitlist...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Join the Waitlist
              </>
            )}
          </Button>
        </form>
      </Form>
      
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          No spam, ever. We&apos;ll only email you when MoneyMappr is ready to launch.
        </p>
    
      </div>
    </div>
  );
}