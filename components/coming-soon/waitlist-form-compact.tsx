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
import { SolarCheckCircleBoldDuotone, SolarInboxInBoldDuotone } from '../icons/icons';
import { useJoinWaitlist } from '@/lib/queries/use-waitlist-data';
import { toast } from 'sonner';
import { useGTM } from '@/lib/hooks/use-gtm';
import { Card } from '../ui/card';

const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type WaitlistForm = z.infer<typeof waitlistSchema>;

interface WaitlistFormProps {
  className?: string;
}

export function WaitlistFormCompact({ className }: WaitlistFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ✅ TanStack Query mutation for server data
  const { mutate: joinWaitlist, isPending } = useJoinWaitlist();

  // ✅ GTM tracking
  const { trackWaitlistSignup } = useGTM();

  const form = useForm<WaitlistForm>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: WaitlistForm) => {
    joinWaitlist(data, {
      onSuccess: (response) => {
        setIsSubmitted(true);
        form.reset();

        // Track successful waitlist signup with GTM
        trackWaitlistSignup({ email: data.email });

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
      <Card className={cn("flex flex-col items-center space-y-2 p-6", className)}>
        <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
          <SolarCheckCircleBoldDuotone className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Yay! You&apos;re on the list!</h3>
          <p className="text-muted-foreground max-w-sm text-sm">
            Thanks for joining our waitlist. We&apos;ll notify you as soon as MoneyMappr launches.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsSubmitted(false)}
          className="mt-4 "
        >
          Add another email
        </Button>
      </Card>
    );
  }

  return (
    <div className={cn("  max-w-lg ", className)}>


      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full gap-2 items-center">

          
          <FormField
          
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <div className="relative items-center group hover:translate-y-[2px]">
                    <SolarInboxInBoldDuotone className="absolute left-4 top-1/2 z-10 transform -translate-y-1/2 w-5 h-5 text-muted-foreground  " />
                    <Input
                      placeholder="Enter your email address"
                      {...field}
                      className="h-10 pl-12  text-xs sm:placeholder:text-sm"
                      variant='primary'
                      disabled={isPending}
                    />
                  </div>
                </FormControl>
            
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            size={'sm'}
         
            className="w-fit h-9  "
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                Join

              </>
            )}
          </Button>
        </form>
      </Form>

    </div>
  );
}