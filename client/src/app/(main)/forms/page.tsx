"use client"
import { Button } from "@/registry/new-york-v4/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import FormsList from "./components/FormsList";

const Forms = () => {
    const router = useRouter();

    const handleCreateForm = () => {
        router.push('/forms/create');
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Research Surveys</h1>
                    <p className="text-gray-600">
                        Create and manage your research surveys. Share them with collaborators and collect responses.
                    </p>
                </div>
                <Button 
                    onClick={handleCreateForm}
                    className="flex items-center gap-2"
                    size="lg"
                >
                    <PlusCircle className="w-5 h-5" />
                    Create New Survey
                </Button>
            </div>

            <FormsList />
        </div>
    );
};

export default Forms;