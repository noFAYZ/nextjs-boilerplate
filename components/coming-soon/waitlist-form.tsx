'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { CheckCircle, Loader2, Mail, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GameIconsUpgrade } from '../icons';

const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
 
});

type WaitlistForm = z.infer<typeof waitlistSchema>;

interface WaitlistFormProps {
  className?: string;
}

export function WaitlistForm({ className }: WaitlistFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<WaitlistForm>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: '',
 
    },
  });

  const onSubmit = async (data: WaitlistForm) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to join waitlist');
      }

      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      console.error('Waitlist signup failed:', error);
      // In a real app, you'd show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground">You're on the list!</h3>
          <p className="text-muted-foreground max-w-sm">
            Thanks for joining our waitlist. We'll notify you as soon as MoneyMappr launches.
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center">

          
          <FormField
          
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 z-10 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Enter your email address"
                      {...field}
                      className="h-14 pl-12 text-lg border-border/60 focus:ring-0 bg-background/80 backdrop-blur-sm hover:shadow-md"
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
            
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            size={'sm'}
            className="w-fit h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs transition-all duration-200 hover:shadow-lg "
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                Join
                <GameIconsUpgrade className="w-5 h-5 ml-3" />
              </>
            )}
          </Button>
        </form>
      </Form>
      
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          No spam, ever. We'll only email you when MoneyMappr is ready to launch.
        </p>
    
      </div>
    </div>
  );
}