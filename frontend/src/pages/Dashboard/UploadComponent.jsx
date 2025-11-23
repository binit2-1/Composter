import React from "react";
import { Upload, FileCode, Type } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

const UploadComponent = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Upload Component</h1>
        <p className="text-white/60">Share your component with the team or save it for later.</p>
      </div>

      <Card className="p-8">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Input
              id="name"
              label="Component Name"
              placeholder="e.g. Auth Modal"
              required
            />
            <Input
              id="version"
              label="Version"
              placeholder="1.0.0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">Description</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 min-h-[100px]"
              placeholder="Describe what this component does..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">Component Code</label>
            <div className="relative">
              <div className="absolute top-3 right-3">
                <Button variant="ghost" className="text-xs py-1 px-2 h-auto">Paste</Button>
              </div>
              <textarea
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 min-h-[200px] font-mono text-sm"
                placeholder="// Paste your component code here..."
              ></textarea>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Button variant="ghost">Cancel</Button>
            <Button>
              Upload Component
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UploadComponent;