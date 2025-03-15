import { Dashboard } from "@/components/ui/dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { 
  Bot, 
  Database, 
  Sparkles, 
  Play, 
  Loader2, 
  CheckCircle,
  Code,
  Braces,
  RefreshCw,
  Cpu
} from "lucide-react";

export default function Nexus() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [selectedTab, setSelectedTab] = useState("ai-assist");
  
  const handleProcess = () => {
    setIsProcessing(true);
    setProcessingComplete(false);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingComplete(true);
    }, 3000);
  };
  
  return (
    <Dashboard>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-slate-900">Nexus</h2>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
              Active Demo
            </span>
          </div>
        </div>
        
        <Card className="shadow-md border border-slate-200">
          <CardHeader className="border-b border-slate-200 bg-slate-50">
            <div className="flex items-center space-x-3">
              <Bot className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl font-semibold">AI-Powered Processing Hub</CardTitle>
            </div>
          </CardHeader>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <div className="px-6 pt-4">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="ai-assist">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger value="data-proc">
                  <Database className="mr-2 h-4 w-4" />
                  Data Processing
                </TabsTrigger>
                <TabsTrigger value="automation">
                  <Cpu className="mr-2 h-4 w-4" />
                  Automation
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="ai-assist" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Intelligent Assistant</h3>
                <p className="text-slate-600">
                  The AI assistant processes natural language inputs and provides intelligent responses based on your data.
                </p>
                
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <textarea 
                    className="w-full min-h-[120px] p-3 border border-slate-300 rounded-md focus:ring-primary focus:border-primary" 
                    placeholder="Enter a prompt or question for the AI assistant..."
                  ></textarea>
                  
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={handleProcess}
                      disabled={isProcessing}
                      className="bg-primary hover:bg-indigo-700"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Response
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {processingComplete && (
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center text-green-600 mb-2">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Response Generated</span>
                    </div>
                    <div className="prose prose-slate max-w-none">
                      <p>
                        Here's a sample AI-generated response that demonstrates the capabilities of our system.
                        The content adapts based on your input and combines insights from your data sources.
                      </p>
                      <p>
                        For further information, you can refine your query or connect additional data sources to enhance the quality of responses.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="data-proc" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Processing Pipeline</h3>
                <p className="text-slate-600">
                  Process and transform data from multiple sources with our intelligent pipeline.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium flex items-center">
                        <Database className="h-4 w-4 mr-2 text-primary" />
                        Input Data
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <select className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary">
                          <option value="">Select a data source...</option>
                          <option value="csv">CSV Import</option>
                          <option value="api">API Integration</option>
                          <option value="db">Database Connection</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium flex items-center">
                        <Code className="h-4 w-4 mr-2 text-emerald-600" />
                        Output Format
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <select className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary">
                          <option value="">Select output format...</option>
                          <option value="json">JSON</option>
                          <option value="csv">CSV</option>
                          <option value="xml">XML</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md font-medium flex items-center">
                      <Braces className="h-4 w-4 mr-2 text-amber-600" />
                      Transformation Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="clean" className="rounded border-slate-300 text-primary focus:ring-primary" />
                      <label htmlFor="clean" className="text-sm">Clean and normalize data</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="dedupe" className="rounded border-slate-300 text-primary focus:ring-primary" />
                      <label htmlFor="dedupe" className="text-sm">Remove duplicates</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="enrich" className="rounded border-slate-300 text-primary focus:ring-primary" />
                      <label htmlFor="enrich" className="text-sm">Enrich with AI-generated insights</label>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="bg-primary hover:bg-indigo-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start Processing
                      </>
                    )}
                  </Button>
                </div>
                
                {processingComplete && (
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center text-green-600 mb-2">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Processing Complete</span>
                    </div>
                    <p className="text-slate-600">
                      Your data has been processed successfully. You can now download the results or continue with further analysis.
                    </p>
                    <div className="mt-4 flex space-x-3">
                      <Button variant="outline">
                        Download Results
                      </Button>
                      <Button variant="outline">
                        View Report
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="automation" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Workflow Automation</h3>
                <p className="text-slate-600">
                  Create automated workflows to streamline repetitive tasks and processes.
                </p>
                
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-4">
                  <h4 className="font-medium">Available Triggers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="border border-slate-200 rounded-md p-3 bg-white hover:border-primary cursor-pointer transition-colors">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <RefreshCw className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">Scheduled</h5>
                          <p className="text-xs text-slate-500">Run at specific times</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-slate-200 rounded-md p-3 bg-white hover:border-primary cursor-pointer transition-colors">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <Database className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">Data Change</h5>
                          <p className="text-xs text-slate-500">When data is updated</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-slate-200 rounded-md p-3 bg-white hover:border-primary cursor-pointer transition-colors">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                          <Code className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">API Webhook</h5>
                          <p className="text-xs text-slate-500">External API calls</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-medium pt-2">Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="border border-slate-200 rounded-md p-3 bg-white hover:border-primary cursor-pointer transition-colors">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <Bot className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">AI Analysis</h5>
                          <p className="text-xs text-slate-500">Run AI on data</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-slate-200 rounded-md p-3 bg-white hover:border-primary cursor-pointer transition-colors">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <RefreshCw className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">Transform</h5>
                          <p className="text-xs text-slate-500">Process data</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-slate-200 rounded-md p-3 bg-white hover:border-primary cursor-pointer transition-colors">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                          <Cpu className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">Notification</h5>
                          <p className="text-xs text-slate-500">Alert systems</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="bg-primary hover:bg-indigo-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Create Workflow
                      </>
                    )}
                  </Button>
                </div>
                
                {processingComplete && (
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center text-green-600 mb-2">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Workflow Created</span>
                    </div>
                    <p className="text-slate-600">
                      Your automated workflow has been created and is now active. You can monitor its performance in the dashboard.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="bg-slate-50 border-t border-slate-200 p-4">
            <div className="text-sm text-slate-500">
              <p>The Nexus module uses advanced AI algorithms to process data and automate workflows.</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Dashboard>
  );
}
