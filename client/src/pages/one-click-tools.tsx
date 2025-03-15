import { Dashboard } from "@/components/ui/dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  CheckCircle,
  Loader2,
  FileText,
  ImageIcon,
  MessageCircle,
  BarChart,
  Code,
  Zap,
  Download,
  Copy,
  Share2
} from "lucide-react";

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

export default function OneClickTools() {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const tools: Tool[] = [
    { 
      id: "text-summarizer", 
      title: "Text Summarizer", 
      description: "Automatically create concise summaries from long-form content", 
      icon: <FileText className="h-5 w-5" />,
      category: "content"
    },
    { 
      id: "image-enhancer", 
      title: "Image Enhancer", 
      description: "Improve image quality and resolution with AI enhancement", 
      icon: <ImageIcon className="h-5 w-5" />,
      category: "media"
    },
    { 
      id: "sentiment-analyzer", 
      title: "Sentiment Analyzer", 
      description: "Analyze text to determine sentiment and emotional tone", 
      icon: <MessageCircle className="h-5 w-5" />,
      category: "analytics"
    },
    { 
      id: "chart-generator", 
      title: "Chart Generator", 
      description: "Create visual charts from data with one click", 
      icon: <BarChart className="h-5 w-5" />,
      category: "analytics"
    },
    { 
      id: "code-formatter", 
      title: "Code Formatter", 
      description: "Format and beautify code snippets instantly", 
      icon: <Code className="h-5 w-5" />,
      category: "development"
    },
    { 
      id: "quick-api", 
      title: "Quick API Generator", 
      description: "Generate API endpoints from data models", 
      icon: <Zap className="h-5 w-5" />,
      category: "development"
    }
  ];
  
  const handleSelectTool = (toolId: string) => {
    setActiveToolId(toolId);
    setIsComplete(false);
  };
  
  const handleRunTool = () => {
    if (!activeToolId) return;
    
    setIsProcessing(true);
    setIsComplete(false);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2500);
  };
  
  const toolCategories = [...new Set(tools.map(tool => tool.category))];
  
  const getActiveTool = () => tools.find(tool => tool.id === activeToolId);
  
  return (
    <Dashboard>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-slate-900">One-Click Tools</h2>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
              Active Demo
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-medium flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-primary" />
                  Available Tools
                </CardTitle>
              </CardHeader>
              
              <CardContent className="px-0 py-0">
                <div className="space-y-1">
                  {toolCategories.map(category => (
                    <div key={category} className="space-y-1">
                      <h3 className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </h3>
                      
                      {tools
                        .filter(tool => tool.category === category)
                        .map(tool => (
                          <div
                            key={tool.id}
                            className={`px-4 py-2 cursor-pointer hover:bg-slate-50 flex items-center ${activeToolId === tool.id ? 'bg-slate-50 border-l-2 border-primary' : ''}`}
                            onClick={() => handleSelectTool(tool.id)}
                          >
                            <div className={`mr-3 p-1.5 rounded-md ${activeToolId === tool.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'}`}>
                              {tool.icon}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-slate-900">{tool.title}</h4>
                              <p className="text-xs text-slate-500 line-clamp-1">{tool.description}</p>
                            </div>
                          </div>
                        ))
                      }
                      
                      <Separator className="my-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="shadow-md h-full">
              {activeToolId ? (
                <>
                  <CardHeader className="border-b border-slate-200 bg-slate-50">
                    <CardTitle className="text-xl font-medium flex items-center">
                      {getActiveTool()?.icon}
                      <span className="ml-2">{getActiveTool()?.title}</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-6">
                    <p className="text-slate-600">{getActiveTool()?.description}</p>
                    
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      {activeToolId === "text-summarizer" && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Input Text</h3>
                          <textarea 
                            className="w-full min-h-[150px] p-3 border border-slate-300 rounded-md focus:ring-primary focus:border-primary" 
                            placeholder="Paste your text here to summarize..."
                          ></textarea>
                          
                          <div className="flex items-center space-x-4">
                            <div className="space-x-2">
                              <label htmlFor="length" className="text-sm">Summary Length:</label>
                              <select 
                                id="length" 
                                className="p-1 text-sm border border-slate-300 rounded focus:ring-primary focus:border-primary"
                              >
                                <option>Brief</option>
                                <option>Moderate</option>
                                <option>Detailed</option>
                              </select>
                            </div>
                            
                            <div className="space-x-2">
                              <label htmlFor="style" className="text-sm">Style:</label>
                              <select 
                                id="style" 
                                className="p-1 text-sm border border-slate-300 rounded focus:ring-primary focus:border-primary"
                              >
                                <option>Neutral</option>
                                <option>Professional</option>
                                <option>Casual</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {activeToolId === "code-formatter" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">Input Code</h3>
                            <select className="p-1 text-sm border border-slate-300 rounded focus:ring-primary focus:border-primary">
                              <option>JavaScript</option>
                              <option>TypeScript</option>
                              <option>Python</option>
                              <option>HTML</option>
                              <option>CSS</option>
                            </select>
                          </div>
                          <textarea 
                            className="w-full min-h-[150px] p-3 border border-slate-300 rounded-md focus:ring-primary focus:border-primary font-mono" 
                            placeholder="Paste your code here to format..."
                          ></textarea>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <input 
                                type="checkbox" 
                                id="indent" 
                                className="rounded border-slate-300 text-primary focus:ring-primary" 
                              />
                              <label htmlFor="indent" className="text-sm">2-space indentation</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input 
                                type="checkbox" 
                                id="semicolons" 
                                className="rounded border-slate-300 text-primary focus:ring-primary" 
                              />
                              <label htmlFor="semicolons" className="text-sm">Include semicolons</label>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {activeToolId === "sentiment-analyzer" && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Text for Analysis</h3>
                          <textarea 
                            className="w-full min-h-[150px] p-3 border border-slate-300 rounded-md focus:ring-primary focus:border-primary" 
                            placeholder="Paste text for sentiment analysis..."
                          ></textarea>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <input 
                                type="checkbox" 
                                id="detailed" 
                                className="rounded border-slate-300 text-primary focus:ring-primary" 
                              />
                              <label htmlFor="detailed" className="text-sm">Detailed analysis</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input 
                                type="checkbox" 
                                id="visualization" 
                                className="rounded border-slate-300 text-primary focus:ring-primary" 
                              />
                              <label htmlFor="visualization" className="text-sm">Include visualization</label>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Default view for other tools */}
                      {!["text-summarizer", "code-formatter", "sentiment-analyzer"].includes(activeToolId) && (
                        <div className="flex items-center justify-center h-[200px]">
                          <div className="text-center">
                            <div className="mx-auto h-12 w-12 text-slate-400 mb-3">
                              {getActiveTool()?.icon}
                            </div>
                            <p className="text-slate-500">Tool configuration interface will appear here</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleRunTool}
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
                            <Zap className="mr-2 h-4 w-4" />
                            Run Tool
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {isComplete && (
                      <div className="bg-white rounded-lg p-4 border border-slate-200">
                        <div className="flex items-center text-green-600 mb-3">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span className="font-medium">Processing Complete</span>
                        </div>
                        
                        <div className="prose prose-slate max-w-none text-sm bg-slate-50 p-4 rounded-md border border-slate-200">
                          <p>
                            This is a representation of the tool's output. In a production environment, 
                            this would contain the actual results processed by the selected tool.
                          </p>
                          <p>
                            The output format varies based on the tool selected and can include 
                            text, data, visualizations, or downloadable assets.
                          </p>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            <Share2 className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </>
              ) : (
                <div className="flex items-center justify-center h-full p-6">
                  <div className="text-center max-w-md">
                    <Zap className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 mb-2">Select a Tool</h3>
                    <p className="text-slate-500">
                      Choose one of the available one-click tools from the sidebar to get started. 
                      Each tool provides a streamlined interface for completing common tasks.
                    </p>
                  </div>
                </div>
              )}
              
              <CardFooter className="bg-slate-50 border-t border-slate-200 p-4 mt-auto">
                <div className="text-sm text-slate-500">
                  <p>One-Click Tools provide instant solutions without complex configuration.</p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}
