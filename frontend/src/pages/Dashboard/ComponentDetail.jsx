import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, Download, GitBranch, Clock, Tag as TagIcon } from "lucide-react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { dracula } from "@codesandbox/sandpack-themes";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import CodeBlock from "../../components/ui/CodeBlock.jsx";

import { components } from "../../data/components.js";

const ComponentDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("preview");

  // Find the component from our data source
  const component = components.find(c => c.id === parseInt(id));

  if (!component) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white">Component not found</h2>
        <Link to="/app/components">
          <Button className="mt-4">Back to Components</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link to="/app/components" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={16} />
            Back to Components
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">{component.name}</h1>
          <p className="text-white/60 max-w-2xl">{component.description}</p>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-white/40">
              <GitBranch size={14} />
              <span>v{component.version}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Clock size={14} />
              <span>Updated {component.updated}</span>
            </div>
            <div className="flex gap-2">
              {component.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary">
            <Copy size={16} className="mr-2" />
            Copy Import
          </Button>
          <Button>
            <span className="mr-2">Download</span>
            Pull Component
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex gap-6">
          {["preview", "code", "versions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                pb-3 text-sm font-medium capitalize transition-all relative
                ${activeTab === tab ? "text-white" : "text-white/40 hover:text-white/70"}
              `}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === "preview" && (
          <Card className="overflow-hidden p-0 bg-[#151515]">
            <Sandpack
              template="react"
              theme={dracula}
              files={{
                "/App.js": component.code,
              }}
              options={{
                showNavigator: false,
                showTabs: false,
                editorHeight: 500,
              }}
            />
          </Card>
        )}

        {activeTab === "code" && (
          <CodeBlock code={component.code} language="jsx" />
        )}

        {activeTab === "versions" && (
          <div className="space-y-4">
            {[1, 2, 3].map((v) => (
              <Card key={v} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                    <GitBranch size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">v1.0.{3 - v}</h4>
                    <p className="text-xs text-white/40">Updated 2 days ago by Somesh</p>
                  </div>
                </div>
                <Button variant="ghost" className="text-xs">View Code</Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentDetail;