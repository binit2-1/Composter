import React from "react";
import CodeBlock from "../../components/ui/CodeBlock.jsx";
import Card from "../../components/ui/Card.jsx";

const DocsContent = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Introduction */}
            <section id="introduction" className="space-y-6">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                        Introduction
                    </h1>
                    <p className="text-lg text-white/70 leading-relaxed">
                        Composter is your personal vault for React components. It streamlines the process of
                        saving, versioning, and sharing your UI components across projects. Think of it as
                        your own private npm registry, but visual and tailored for component development.
                    </p>
                </div>
            </section>

            {/* Getting Started */}
            <section id="getting-started" className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 text-sm">01</span>
                    Getting Started
                </h2>
                <Card className="p-6">
                    <p className="text-white/70 mb-4">
                        To get started with Composter, you'll need to install our CLI tool. This allows you to
                        push and pull components directly from your terminal.
                    </p>
                    <CodeBlock language="bash" code="npm install -g composter-cli" />
                </Card>
            </section>

            {/* CLI Commands */}
            <section id="cli" className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 text-sm">02</span>
                    CLI Commands
                </h2>

                <div className="grid gap-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Login</h3>
                        <p className="text-white/60 mb-4">Authenticate your machine with your Composter account.</p>
                        <CodeBlock language="bash" code="composter login" />
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Push Component</h3>
                        <p className="text-white/60 mb-4">Upload a component to your vault. Run this in the component's directory.</p>
                        <CodeBlock language="bash" code="composter push Button.jsx" />
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Pull Component</h3>
                        <p className="text-white/60 mb-4">Download a specific version of a component to your current project.</p>
                        <CodeBlock language="bash" code="composter pull card@1.2.0" />
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Sync</h3>
                        <p className="text-white/60 mb-4">Sync all components in your `composter.json` config file.</p>
                        <CodeBlock language="bash" code="composter sync" />
                    </Card>
                </div>
            </section>

            {/* Component Structure */}
            <section id="structure" className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">03</span>
                    Component Structure
                </h2>
                <Card className="p-6">
                    <p className="text-white/70 mb-4">
                        Composter works best with single-file components or components that are self-contained
                        within a directory. We recommend the following structure:
                    </p>
                    <CodeBlock language="bash" code={`src/
  components/
    ui/
      Button.jsx
      Card.jsx
    layout/
      Sidebar.jsx`} />
                </Card>
            </section>

            {/* Installation */}
            <section id="installation" className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">04</span>
                    Installation
                </h2>
                <Card className="p-6">
                    <p className="text-white/70 mb-4">
                        You can install the Composter CLI globally using npm or yarn.
                    </p>
                    <CodeBlock language="bash" code="npm install -g composter-cli" />
                    <p className="text-white/70 mt-4 mb-2">
                        Or use npx for one-time usage:
                    </p>
                    <CodeBlock language="bash" code="npx composter-cli login" />
                </Card>
            </section>

            {/* Best Practices */}
            <section id="best-practices" className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 text-sm">05</span>
                    Best Practices
                </h2>
                <Card className="p-6 space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">Keep Components Pure</h3>
                        <p className="text-white/60">Try to avoid side effects within your UI components. Pass data via props.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">Use Tailwind Utility Classes</h3>
                        <p className="text-white/60">Composter is optimized for Tailwind CSS. Avoid external CSS files if possible.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">Document Props</h3>
                        <p className="text-white/60">Use JSDoc comments to document your component props for better intellisense.</p>
                    </div>
                </Card>
            </section>

            {/* Versioning */}
            <section id="versioning" className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 text-sm">06</span>
                    Versioning
                </h2>
                <Card className="p-6">
                    <p className="text-white/70 mb-4">
                        Composter uses semantic versioning (SemVer) for your components. When you push a change,
                        you can specify the version bump type.
                    </p>
                    <CodeBlock language="bash" code="composter push Button.jsx --major" />
                    <CodeBlock language="bash" code="composter push Button.jsx --minor" />
                    <CodeBlock language="bash" code="composter push Button.jsx --patch" />
                </Card>
            </section>

            {/* FAQ */}
            <section id="faq" className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm">07</span>
                    FAQ
                </h2>
                <div className="grid gap-4">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Is Composter free?</h3>
                        <p className="text-white/60">Yes, Composter is free for personal use. We offer paid plans for teams.</p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Can I use it with private repos?</h3>
                        <p className="text-white/60">Absolutely. Your components are private by default.</p>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default DocsContent;
