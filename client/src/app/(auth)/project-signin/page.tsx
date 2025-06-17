'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import Image from 'next/image';
import { Button } from '@/registry/new-york-v4/ui/button';
import { useProjectStore, Project, ProjectStore } from '@/store/projectStore';

const mockProjects = [
  {
    id: '1',
    name: 'Research Project Alpha',
    url: 'alpha.researchify.com',
  },
  {
    id: '2',
    name: 'Development Team Beta',
    url: 'beta.researchify.com',
  },
  {
    id: '3',
    name: 'Marketing Campaign Gamma',
    url: 'gamma.researchify.com',
  },
  {
    id: '4',
    name: 'Product Design Delta',
    url: 'delta.researchify.com',
  },
];

export default function ProjectSignInPage() {
  const router = useRouter();
  const setProject = useProjectStore((state: ProjectStore) => state.setProject);
  const addProject = useProjectStore((state: ProjectStore) => state.addProject);

  const handleProjectSelect = (projectId: string) => {
    const selectedProject = mockProjects.find(project => project.id === projectId);
    if (selectedProject) {
      setProject(selectedProject);
      addProject(selectedProject);
      console.log(`Selected project: ${selectedProject.name}`);
      router.push('/task');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image
            src="/logo.svg"
            alt="Researchify Logo"
            width={200}
            height={50}
            className="mx-auto h-20 w-auto mb-4"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your project
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
             Choose your project from below
          </p>
        </div>

        <Card className="mx-auto w-full">
          <CardContent className="py-6">
            <div className="space-y-4">
              {/* Input for workspace URL - similar to Slack example */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                    You're already signed in to...
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {mockProjects.map((project) => (
                  <Card key={project.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      {/* Placeholder for logo - backend will integrate actual images */}
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        <span className="text-sm font-bold">{project.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{project.url}</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => handleProjectSelect(project.id)}>
                      Open
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 