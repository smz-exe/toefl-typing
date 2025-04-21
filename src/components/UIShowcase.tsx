import React, { useState } from 'react';
import { Button } from './ui/Button.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/Dialog.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/Tooltip.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs.js';
import { Info, Settings, User, Bell } from 'lucide-react';

/**
 * Component showcasing the Shadcn/ui components
 */
export const UIShowcase: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div>
        <h2 className="text-2xl font-bold mb-4">UI Components Showcase</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Demonstration of Shadcn/ui components with TailwindCSS styling
        </p>
      </div>

      {/* Buttons showcase */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* Dialog showcase */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">Dialog</h3>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2"
                    defaultValue="John Doe"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="username" className="text-right text-sm font-medium">
                    Username
                  </label>
                  <input
                    id="username"
                    className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2"
                    defaultValue="@johndoe"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Controlled Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Controlled Dialog</DialogTitle>
                <DialogDescription>
                  This dialog&apos;s state is controlled programmatically.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>Dialog content goes here.</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Continue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Tooltip showcase */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">Tooltips</h3>
        <div className="flex gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Information tooltip</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Settings tooltip</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Button tooltip</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </section>

      {/* Tabs showcase */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">Tabs</h3>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="p-4 border rounded-md mt-2">
            <h4 className="text-sm font-medium mb-2">Account Settings</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your account settings and preferences.
            </p>
          </TabsContent>
          <TabsContent value="notifications" className="p-4 border rounded-md mt-2">
            <h4 className="text-sm font-medium mb-2">Notification Preferences</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configure how you receive notifications and alerts.
            </p>
          </TabsContent>
          <TabsContent value="settings" className="p-4 border rounded-md mt-2">
            <h4 className="text-sm font-medium mb-2">Application Settings</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Customize your application experience and preferences.
            </p>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default UIShowcase;
