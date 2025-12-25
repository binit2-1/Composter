import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Github, Copy, Check, Terminal, FileCode, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { sidebarNav, docsContent, ctaSection } from "@/data/docsContent";
import ComposterHover from "@/components/ui/ComposterHover";

// Code block component with copy button
const CodeBlock = ({ code, showLineNumbers = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="relative group rounded-xl border border-border/50 bg-[#0d0d0d] overflow-hidden">
      <div className="flex items-center overflow-x-auto">
        {showLineNumbers && (
          <div className="flex-shrink-0 py-4 pl-4 pr-3 text-right select-none border-r border-border/30">
            {lines.map((_, i) => (
              <div key={i} className="text-xs text-muted-foreground/50 leading-6 font-mono">
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <pre className="flex-1 py-4 px-4 overflow-x-auto">
          <code className="text-sm font-mono text-zinc-300 leading-6">
            {lines.map((line, i) => (
              <div key={i}>{line || ' '}</div>
            ))}
          </code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-lg bg-zinc-800/80 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-zinc-700/80 transition-all opacity-0 group-hover:opacity-100"
          title="Copy code"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
};

// Method selection card
const MethodCard = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 flex flex-col items-center justify-center gap-3 p-6 sm:p-8 rounded-xl border transition-all duration-200",
      active 
        ? "border-primary/50 bg-primary/5 text-primary" 
        : "border-border/50 bg-card/30 text-muted-foreground hover:border-border hover:text-foreground"
    )}
  >
    <Icon size={28} strokeWidth={1.5} />
    <span className="font-medium text-sm sm:text-base">{label}</span>
  </button>
);

// Section components for different content types
const SectionTitle = ({ children }) => (
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
    {children}
  </h2>
);

const InfoCard = ({ title, description }) => (
  <div className="p-4 sm:p-5 rounded-xl border border-border/30 bg-zinc-900/50">
    <h3 className="font-medium text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const FeatureItem = ({ title, description }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl border border-border/30 bg-zinc-900/50">
    <ChevronRight size={18} className="text-primary mt-0.5 shrink-0" />
    <div>
      <h4 className="font-medium text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const Docs = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [user, setUser] = useState(null);
  const [method, setMethod] = useState("cli");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await authClient.getSession();
        setUser(data?.user || null);
      } catch {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // Handle hash in URL to scroll to specific section
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
          setActiveSection(hash);
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = sidebarNav.flatMap(group => group.items.map(item => item.id));
      const scrollPos = window.scrollY + 120;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    }
  };

  // Render content based on section type
  const renderSection = (id) => {
    const content = docsContent[id];
    if (!content) return null;

    return (
      <section key={id} id={id} className="mb-16 sm:mb-20">
        <SectionTitle>{content.title}</SectionTitle>
        
        {content.description && (
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8">
            {content.description}
          </p>
        )}

        {/* Cards grid */}
        {content.cards && (
          <div className="grid sm:grid-cols-2 gap-4">
            {content.cards.map((card, i) => (
              <InfoCard key={i} {...card} />
            ))}
          </div>
        )}

        {/* Method selection (for installation section) */}
        {content.methodDescription && (
          <>
            <h3 className="text-lg sm:text-xl font-medium text-foreground mb-3">Pick The Method</h3>
            <p className="text-muted-foreground mb-4">{content.methodDescription}</p>
            {content.methodNote && (
              <p className="text-sm text-muted-foreground/70 mb-6">{content.methodNote}</p>
            )}
            <div className="flex gap-4 mb-8 sm:mb-12">
              <MethodCard 
                icon={FileCode} 
                label="Manual" 
                active={method === "manual"} 
                onClick={() => setMethod("manual")} 
              />
              <MethodCard 
                icon={Terminal} 
                label="CLI" 
                active={method === "cli"} 
                onClick={() => setMethod("cli")} 
              />
            </div>
            
            <h3 className="text-lg sm:text-xl font-medium text-foreground mb-3">Steps</h3>
            <p className="text-muted-foreground mb-6 sm:mb-8">
              Follow these steps to {method === "manual" ? "manually copy" : "install"} components:
            </p>
            
            <div className="space-y-6 sm:space-y-8">
              {content.steps[method].map((step, i) => (
                <div key={i}>
                  <h4 className="text-base sm:text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                    <span className="text-primary">{i + 1}.</span> {step.title}
                  </h4>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  {step.links && (
                    <div className="flex flex-col gap-2 mb-4">
                      {step.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group text-muted-foreground font-mono text-sm hover:text-gray-300"
                        >
                          {(() => {
                            const parts = link.label.split(': ');
                            if (parts.length === 2) {
                              return (
                                <>
                                  <span className="text-muted-foreground mr-1 font-[font]">{parts[0]}:</span>
                                  <span className="border-b-2 border-transparent group-hover:border-gray-300/80 transition-all font-[font]">{parts[1]}</span>
                                  <ExternalLink size={14} className="ml-2 inline-flex items-center text-muted-foreground group-hover:text-gray-300" aria-hidden />
                                </>
                              );
                            }
                            return (
                                <>
                                  <span className="border-b-2 border-transparent group-hover:border-gray-300/80 transition-all font-[font]">{link.label}</span>
                                  <ExternalLink size={14} className="ml-2 inline-flex items-center text-muted-foreground group-hover:text-gray-300" aria-hidden />
                                </>
                            );
                          })()}
                        </a>
                      ))}
                    </div>
                  )}
                  {step.code && <CodeBlock code={step.code} />}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Simple steps with code (quick-start, cli sections) */}
        {content.steps && !content.methodDescription && Array.isArray(content.steps) && (
          <div className="space-y-6">
            {content.steps.map((step, i) => (
              <div key={i}>
                {step.title && (
                  <>
                    <h4 className="text-base sm:text-lg font-medium text-foreground mb-3">{step.title}</h4>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                            {step.links && (
                              <div className="flex flex-col gap-2 mb-4">
                                {step.links.map((link, idx) => (
                                  <a
                                    key={idx}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group text-muted-foreground font-mono text-sm hover:text-gray-300"
                                  >
                                    {(() => {
                                      const parts = link.label.split(': ');
                                      if (parts.length === 2) {
                                        return (
                                          <>
                                            <span className="text-muted-foreground mr-1 font-[font]">{parts[0]}:</span>
                                            <span className="border-b-2 border-transparent group-hover:border-gray-300/80 transition-all font-[font]">{parts[1]}</span>
                                            <ExternalLink size={14} className="ml-2 inline-flex items-center text-muted-foreground group-hover:text-gray-300" aria-hidden />
                                          </>
                                        );
                                      }
                                      return (
                                        <>
                                          <span className="border-b-2 border-transparent group-hover:border-gray-300/80 transition-all font-[font]">{link.label}</span>
                                          <ExternalLink size={14} className="ml-2 inline-flex items-center text-muted-foreground group-hover:text-gray-300" aria-hidden />
                                        </>
                                      );
                                    })()}
                                  </a>
                                ))}
                              </div>
                            )}
                    {step.code && <CodeBlock code={step.code} />}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Simple numbered list steps (dashboard-upload) */}
        {content.steps && typeof content.steps[0] === 'string' && (
          <ol className="space-y-4 mb-12">
            {content.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0">
                  {i + 1}
                </span>
                <span className="text-muted-foreground pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        )}

        {/* Single code block */}
        {content.code && (
          <>
            <CodeBlock code={content.code} />
            {id === 'cli-login' ? (
              <>
                {content.note && (
                  <p className="text-sm text-muted-foreground mt-2">{content.note}</p>
                )}

                {content.links && (
                  <>
                    <h3 className={`text-lg sm:text-xl font-medium text-foreground mb-2 mt-4`}>Docs & packages</h3>
                    <p className="text-muted-foreground mb-2 font-[font]">Refer to the npm package pages for CLI usage.</p>
                    <div className="flex flex-col gap-2 mt-2">
                      {content.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group text-muted-foreground font-mono text-sm hover:text-gray-300"
                        >
{(() => {
                            const parts = link.label.split(': ');
                            if (parts.length === 2) {
                              return (
                                <>
                                  <span className="text-muted-foreground mr-1 font-[font]">{parts[0]}:</span>
                                  <span className="border-b-2 border-transparent group-hover:border-gray-300/80 transition-all font-[font]">{parts[1]}</span>
                                  <ExternalLink size={14} className="ml-2 inline-flex items-center align-middle text-muted-foreground group-hover:text-gray-300" aria-hidden />
                                </>
                              );
                            }
                            return (
                              <>
                                <span className="border-b-2 border-transparent group-hover:border-gray-300/80 transition-all">{link.label}</span>
                                <ExternalLink size={14} className="ml-2 inline-flex items-center align-middle text-muted-foreground group-hover:text-gray-300" aria-hidden />
                              </>
                            );
                          })()}
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                {content.links && (
                  <div className="flex flex-col gap-2 mt-4">
                    {(content.title !== 'Docs & Packages' && content.links.some(l => (l.href && l.href.includes('composter-mcp')) || (l.label && l.label.startsWith('MCP:')))) && (
                      <>
                        <h3 className={`text-lg sm:text-xl font-medium text-foreground mb-2 ${content.links.some(l => l.href && l.href.includes('composter-mcp')) ? 'mt-4' : ''}`}>Docs & Packages</h3>
                        <p className="text-muted-foreground mb-4 font-[font]">Refer to the npm package pages for MCP usage.</p>
                      </>
                    )}
                    {content.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group text-muted-foreground font-mono text-sm hover:text-gray-300"
                      >
{(() => {
                          const parts = link.label.split(': ');
                          if (parts.length === 2) {
                            return (
                              <>
                                <span className="text-muted-foreground mr-1 font-[font]">{parts[0]}:</span>
                                <span className="border-b-2 border-transparent group-hover:border-gray-300/80 transition-all font-[font]">{parts[1]}</span>
                                <ExternalLink size={14} className="ml-2 inline-flex items-center align-middle text-muted-foreground group-hover:text-gray-300" aria-hidden />
                              </>
                            );
                          }
                          return (
                            <>
                              <span className="border-b-2 border-transparent group-hover:border-gray-300/80 transition-all">{link.label}</span>
                              <ExternalLink size={14} className="ml-2 inline-flex items-center align-middle text-muted-foreground group-hover:text-gray-300" aria-hidden />
                            </>
                          );
                        })()}
                      </a>
                    ))}
                  </div>
                )}

                {content.note && (
                  <p className="text-sm text-muted-foreground mt-4">{content.note}</p>
                )}
              </>
            )}
          </>
        )}

        {/* Arguments list */}
        {content.args && (
          <div className="mt-6 p-4 rounded-xl border border-border/30 bg-zinc-900/50">
            <h4 className="font-medium text-foreground mb-2">Arguments</h4>
            <div className="space-y-2 text-sm">
              {content.args.map((arg, i) => (
                <div key={i} className="flex gap-4">
                  <code className="text-primary min-w-24">{arg.name}</code>
                  <span className="text-muted-foreground">{arg.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features list */}
        {content.features && (
          <div className="space-y-4">
            {content.features.map((feature, i) => (
              <FeatureItem key={i} {...feature} />
            ))}
          </div>
        )}

        {/* Actions list */}
        {content.actions && (
          <div className="space-y-4">
            {content.actions.map((action, i) => (
              <InfoCard key={i} {...action} />
            ))}
          </div>
        )}

        {/* MCP Configs (for mcp-setup) */}
        {content.configs && (
          <div className="mt-8 space-y-6">
            <h3 className="text-lg sm:text-xl font-medium text-foreground">Configuration Examples</h3>
            {content.configs.map((config, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground">{config.title}</h4>
                  <code className="text-xs text-muted-foreground bg-zinc-800 px-2 py-0.5 rounded">{config.path}</code>
                </div>
                <CodeBlock code={config.code} />
              </div>
            ))}
          </div>
        )}

        {/* MCP Tools (for mcp-tools) */}
        {content.tools && (
          <div className="space-y-8">
            {content.tools.map((tool, i) => (
              <div key={i} className="p-5 rounded-xl border border-border/30 bg-zinc-900/50">
                <h3 className="font-mono text-lg font-semibold text-primary mb-2">{tool.name}</h3>
                <p className="text-muted-foreground mb-4">{tool.description}</p>
                
                {tool.params && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Parameters</h4>
                    <div className="space-y-1">
                      {tool.params.map((param, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm">
                          <code className="text-primary">{param.name}</code>
                          <span className="text-muted-foreground/60">({param.type})</span>
                          <span className="text-muted-foreground">— {param.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {tool.example && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Example Response</h4>
                    <div className="bg-[#0d0d0d] rounded-lg p-4 border border-border/30">
                      <pre className="text-sm text-zinc-400 whitespace-pre-wrap font-mono">{tool.example}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2.5">
              <ComposterHover size={28} />
              <span className="text-sm sm:text-base font-semibold text-foreground">Composter</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg border border-border/50 bg-zinc-900 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <Github size={16} />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              
              {user ? (
                <Button asChild size="sm" className="h-8">
                  <Link to="/app">Dashboard</Link>
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm" className="h-8 hidden sm:inline-flex">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild size="sm" className="h-8">
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto border-r border-border/30">
          <nav className="py-8 px-4">
            {sidebarNav.map((group, groupIndex) => (
              <div key={group.title} className={cn(groupIndex > 0 && "mt-8")}>
                <h4 className="px-3 mb-2 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                  {group.title}
                </h4>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-150",
                        activeSection === item.id 
                          ? "text-primary bg-primary/10 border-l-2 border-primary -ml-0.5 pl-[calc(0.75rem+2px)]" 
                          : "text-muted-foreground hover:text-foreground hover:bg-zinc-800/50"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 pt-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {sidebarNav.flatMap(group => group.items).map(item => renderSection(item.id))}

            {/* CTA Section */}
            <section className="p-6 sm:p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <h3 className="text-xl sm:text-2xl font-medium text-foreground mb-2">{ctaSection.title}</h3>
              <p className="text-muted-foreground mb-6">{ctaSection.description}</p>
              <div className="flex flex-wrap gap-3">
                {ctaSection.buttons.map((btn, i) => (
                  <Button 
                    key={i} 
                    asChild 
                    size="lg" 
                    variant={btn.variant === "outline" ? "outline" : "default"}
                  >
                    <Link to={btn.href}>{btn.label}</Link>
                  </Button>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Docs;
