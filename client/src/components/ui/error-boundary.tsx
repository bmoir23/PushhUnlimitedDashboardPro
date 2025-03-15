import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
          <Card className="w-full max-w-lg shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
              </div>
              
              <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-100">
                <p className="text-red-800 text-sm font-medium">{this.state.error?.message || "An unknown error occurred"}</p>
              </div>
              
              {this.state.errorInfo && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2">Component Stack</h2>
                  <pre className="bg-slate-100 p-4 rounded-md text-xs overflow-auto max-h-56">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Try Again
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
