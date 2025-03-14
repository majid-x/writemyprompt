"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { useAuth } from "../../context/auth-context";
import ProtectedRoute from "../../components/auth/protected-route";

export default function SavedPromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPrompts();
    }
  }, [user]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/prompts");

      if (!response.ok) {
        throw new Error("Failed to fetch prompts");
      }

      const data = await response.json();
      setPrompts(data);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      setError("Failed to load your saved prompts");
    } finally {
      setLoading(false);
    }
  };

  const deletePrompt = async (promptId) => {
    try {
      setDeleting(promptId);
      const response = await fetch(`/api/prompts/${promptId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete prompt");
      }

      // Remove the deleted prompt from the state
      setPrompts(prompts.filter((prompt) => prompt._id !== promptId));
    } catch (error) {
      console.error("Error deleting prompt:", error);
      setError("Failed to delete prompt");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Saved Prompts</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Generator
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              You don't have any saved prompts yet.
            </p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Create Your First Prompt
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt) => (
              <Card key={prompt._id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg capitalize">
                      {prompt.model} Prompt
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePrompt(prompt._id)}
                      disabled={deleting === prompt._id}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                      {deleting === prompt._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created: {formatDate(prompt.createdAt)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <h3 className="text-sm font-medium mb-1">Your Request:</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {prompt.userInput}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">
                      Generated Prompt:
                    </h3>
                    <div className="bg-muted p-3 rounded-md text-xs max-h-32 overflow-y-auto">
                      <p className="whitespace-pre-wrap line-clamp-6">
                        {prompt.generatedPrompt}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => {
                      navigator.clipboard.writeText(prompt.generatedPrompt);
                    }}>
                    Copy Prompt
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
