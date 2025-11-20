import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Camera,
  Shield,
  Scan,
  Navigation,
  Zap,
  Radio,
  Phone,
  AlertTriangle,
  Flame,
  HelpCircle,
  X,
  CheckCircle,
  Clock,
  Users,
  Target,
} from "lucide-react";

const Index = () => {
  const [cameraUrl, setCameraUrl] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [eventLogs, setEventLogs] = useState<Array<{ time: string; message: string; type?: string }>>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Initialize demo logs on mount
  useEffect(() => {
    const now = new Date();
    const initialLogs = [
      { time: formatTime(now), message: "System booted – AVIS-M4 Mark 4", type: "success" },
      { time: formatTime(new Date(now.getTime() + 3000)), message: "Under-car area clear", type: "success" },
      { time: formatTime(new Date(now.getTime() + 8000)), message: "Front sensor active", type: "info" },
    ];
    setEventLogs(initialLogs);

    // Auto-generate demo logs every 6-10 seconds
    const interval = setInterval(() => {
      addDemoLog();
    }, Math.random() * 4000 + 6000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [eventLogs]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour12: false });
  };

  const addLog = (message: string, type?: string) => {
    setEventLogs((prev) => [...prev, { time: formatTime(new Date()), message, type }]);
  };

  const addDemoLog = () => {
    const demoMessages = [
      { message: "Simulated obstacle detected – vehicle stop engaged (demo)", type: "warning" },
      { message: "Camera stream ok", type: "success" },
      { message: "Environment safe", type: "success" },
      { message: "Ultrasonic sensor reading: 125cm", type: "info" },
      { message: "Line following active", type: "info" },
      { message: "Under-car scan complete – clear", type: "success" },
    ];
    const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
    addLog(randomMessage.message, randomMessage.type);
  };

  const handleCameraConnect = () => {
    if (!cameraUrl.trim()) {
      toast.error("Please enter an IP address or URL");
      return;
    }

    // Normalize URL
    let url = cameraUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }

    // Update status
    setConnectionStatus("connecting");
    addLog(`Connecting to ${url}...`, "info");

    setTimeout(() => {
      setConnectionStatus("connected");
      addLog(`Redirecting to camera feed...`, "success");
      setIframeUrl(url);

      setTimeout(() => {
        window.open(url, "_blank");
        toast.success("Camera opened in new tab!");
      }, 800);
    }, 500);
  };

  const triggerAlarmDemo = () => {
    addLog("⚠️ ALARM TRIGGERED (DEMO)", "error");
    toast.error("Alarm Triggered!", { description: "This is a demo alarm" });

    // Flash effect
    document.body.style.backgroundColor = "hsl(0, 84%, 60%)";
    setTimeout(() => {
      document.body.style.backgroundColor = "";
    }, 300);

    // Play beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getStatusClass = () => {
    switch (connectionStatus) {
      case "disconnected":
        return "status-dot status-gray";
      case "connecting":
        return "status-dot status-yellow";
      case "connected":
        return "status-dot status-green";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "disconnected":
        return "Not Connected";
      case "connecting":
        return "Connecting...";
      case "connected":
        return "Connection Opened";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-primary">AVIS-M4</h1>
            </div>
            <div className="hidden md:flex gap-6">
              {["Home", "Camera", "Features", "Emergency", "Team", "About"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-sm hover:text-primary transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center pt-20 px-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(222, 47%, 5%) 0%, hsl(222, 40%, 8%) 50%, hsl(270, 40%, 10%) 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, hsl(174, 72%, 56%) 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
        </div>
        <div className="container mx-auto text-center relative z-10 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            AVIS-M4
            <br />
            <span className="text-primary">Autonomous Vehicle Intelligent System</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            A student-built prototype that combines smart navigation, under-vehicle safety checks, and real-time detection to protect lives and prevent accidents.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" onClick={() => scrollToSection("camera")} className="glow-teal">
              <Camera className="mr-2 h-5 w-5" />
              Open Camera Panel
            </Button>
            <Button size="lg" variant="secondary" onClick={() => scrollToSection("features")} className="glow-orange">
              <Target className="mr-2 h-5 w-5" />
              View Features
            </Button>
          </div>
        </div>
      </section>

      {/* Camera Section */}
      <section id="camera" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <Camera className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Connect to IP Camera</h2>
            <p className="text-muted-foreground">Access your ESP32-CAM live feed</p>
          </div>

          <Card className="p-6 md:p-8 glow-teal animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Camera Connection</h3>
                <div className="flex items-center">
                  <span className={getStatusClass()}></span>
                  <span className="text-sm text-muted-foreground">{getStatusText()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Enter camera IP or URL (e.g. 192.168.1.50 or http://192.168.1.50)"
                    value={cameraUrl}
                    onChange={(e) => setCameraUrl(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleCameraConnect()}
                    className="text-base"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter the ESP32-CAM IP address on your network and press Connect. You will be redirected to the camera's web page.
                  </p>
                </div>

                <Button onClick={handleCameraConnect} className="w-full glow-teal" size="lg" disabled={connectionStatus === "connecting"}>
                  <Radio className="mr-2 h-5 w-5" />
                  {connectionStatus === "connecting" ? "Connecting..." : "Connect Camera"}
                </Button>
              </div>

              {/* Camera Preview */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Camera Preview</h4>
                <div className="bg-muted rounded-lg overflow-hidden" style={{ minHeight: "300px" }}>
                  {iframeUrl ? (
                    <div>
                      <iframe src={iframeUrl} className="w-full h-[300px] border-0" title="Camera Feed" />
                      <p className="text-xs text-muted-foreground text-center p-2">
                        If preview doesn't load, some cameras block embedding. Check the new tab that opened.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[300px]">
                      <p className="text-muted-foreground">Camera preview will appear here (if your browser allows it)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AVIS-M4 Highlights</h2>
            <p className="text-muted-foreground">Advanced features for maximum safety</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Real-Time Detection",
                description: "Continuously checks surroundings and updates the driver instantly with real-time sensor data.",
              },
              {
                icon: <Scan className="w-8 h-8" />,
                title: "Under-Car Scan",
                description: "Helps detect any object or animal resting under the vehicle before moving, preventing accidents.",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Front Obstacle Stop",
                description: "Automatically detects obstacles in the front path and engages stopping mechanism for safety.",
              },
              {
                icon: <Navigation className="w-8 h-8" />,
                title: "Line Path Following",
                description: "Advanced line tracking algorithm ensures the vehicle stays on designated paths accurately.",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Mark 4 Prototype",
                description: "Fourth generation system with improved sensors, faster processing, and enhanced reliability.",
              },
              {
                icon: <Camera className="w-8 h-8" />,
                title: "Live Camera Feed",
                description: "ESP32-CAM provides real-time video streaming over Wi-Fi for remote monitoring and control.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Simple 4-step process for maximum safety</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Scan Under Vehicle",
                description: "Ultrasonic sensor + camera check the area below the car for any obstacles or animals.",
              },
              {
                step: "2",
                title: "Check Front Obstacles",
                description: "Front-mounted sensor continuously monitors distance while the vehicle is in motion.",
              },
              {
                step: "3",
                title: "Send Live Video",
                description: "ESP32-CAM streams a live feed over Wi-Fi to the control interface for real-time monitoring.",
              },
              {
                step: "4",
                title: "Alert Driver",
                description: "Buzzer, display, and app notifications immediately warn the user of any dangers detected.",
              },
            ].map((item, index) => (
              <div key={index} className="relative animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <Card className="p-6 h-full hover:scale-105 transition-all duration-300">
                  <div className="text-5xl font-bold text-primary/20 mb-4">{item.step}</div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
                {index < 3 && <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/30"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Actions */}
      <section id="emergency" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <AlertTriangle className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Emergency Control</h2>
            <p className="text-muted-foreground">Quick access to emergency services</p>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Button asChild size="lg" variant="destructive" className="h-20 text-lg">
                <a href="tel:108">
                  <Phone className="mr-2 h-6 w-6" />
                  Call Ambulance
                </a>
              </Button>
              <Button asChild size="lg" variant="destructive" className="h-20 text-lg">
                <a href="tel:100">
                  <Shield className="mr-2 h-6 w-6" />
                  Call Police
                </a>
              </Button>
              <Button asChild size="lg" variant="destructive" className="h-20 text-lg">
                <a href="tel:101">
                  <Flame className="mr-2 h-6 w-6" />
                  Call Fire Service
                </a>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Button size="lg" onClick={triggerAlarmDemo} className="h-16 glow-orange">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Trigger Alarm (Demo)
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  toast.info("Safety Tips", {
                    description: "• Always check surroundings\n• Use sensors in crowded areas\n• Visually confirm when possible",
                  });
                }}
                className="h-16"
              >
                <HelpCircle className="mr-2 h-5 w-5" />
                Show Safety Tips
              </Button>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Note: These buttons use phone call links. On a real system, they could connect to local emergency services.
            </p>
          </div>
        </div>
      </section>

      {/* Event Log */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AVIS-M4 Event Log (Demo)</h2>
            <p className="text-muted-foreground">Real-time system activity monitoring</p>
          </div>

          <Card className="p-6 bg-card/50">
            <div ref={logContainerRef} className="bg-muted rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto space-y-1">
              {eventLogs.map((log, index) => (
                <div
                  key={index}
                  className={`${
                    log.type === "error"
                      ? "text-destructive"
                      : log.type === "warning"
                      ? "text-secondary"
                      : log.type === "success"
                      ? "text-accent"
                      : "text-foreground"
                  }`}
                >
                  [{log.time}] {log.message}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Team AVIS-M4</h2>
            <p className="text-muted-foreground">Meet the creators behind the innovation</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-primary-foreground">
                G
              </div>
              <h3 className="text-xl font-semibold mb-2">Ganesh</h3>
              <p className="text-muted-foreground">Hardware, coding, and system logic</p>
            </Card>

            <Card className="p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <div className="w-20 h-20 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-secondary-foreground">
                M
              </div>
              <h3 className="text-xl font-semibold mb-2">Mohit</h3>
              <p className="text-muted-foreground">Testing, wiring, and presentation</p>
            </Card>
          </div>

          <Card className="p-6 text-center bg-card/50">
            <p className="text-lg mb-2">
              <strong>College:</strong> Carmel Composite PU College, Nanjangud
            </p>
            <p className="text-lg">
              <strong>Class:</strong> 2nd PUC – PCMC
            </p>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Project</h2>
          </div>

          <Card className="p-8">
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                <strong className="text-foreground">AVIS-M4 (Autonomous Vehicle Intelligent System - Mark 4)</strong> is our fourth-generation prototype designed
                to enhance vehicle safety through smart technology. This student-built system combines multiple sensors, a live camera feed, and intelligent
                algorithms to prevent accidents and protect lives.
              </p>
              <p className="text-lg leading-relaxed">
                The project is called "Mark 4" because it represents our fourth improved version, incorporating lessons learned from previous iterations. Each
                version has brought better accuracy, faster response times, and more reliable detection capabilities.
              </p>
              <p className="text-lg leading-relaxed">
                Our primary goals are <strong className="text-foreground">safety</strong>, <strong className="text-foreground">automation</strong>, and{" "}
                <strong className="text-foreground">real-time detection</strong>. The system helps protect animals resting under vehicles, detects obstacles in
                the front path, follows designated routes, and provides live video monitoring—all working together to make roads safer for everyone.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="mb-2">© 2025 AVIS-M4 – Student Prototype for Science Exhibition</p>
          <p className="text-sm text-muted-foreground">Designed by Ganesh & Mohit | Autonomous Vehicle Intelligent System (Mark 4)</p>
        </div>
      </footer>

      {/* Floating Help Button */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center glow-teal z-50"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
          <Card className="max-w-2xl w-full p-6 relative">
            <button onClick={() => setShowHelp(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold mb-4">Help & Information</h3>

            <div className="space-y-4 text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">How to use the IP Camera input:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Make sure your ESP32-CAM is powered on and connected to your Wi-Fi network</li>
                  <li>Find the IP address displayed on the ESP32-CAM serial monitor or OLED display</li>
                  <li>Enter the IP address in the camera connection panel (e.g., 192.168.1.50)</li>
                  <li>Click "Connect Camera" to open the live feed in a new browser tab</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Important Notes:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>This is a demo interface for a student science exhibition project</li>
                  <li>The camera must be on the same Wi-Fi network as your viewing device</li>
                  <li>Some browsers may block the iframe preview due to security settings</li>
                  <li>The event log and alarm features are simulated for demonstration purposes</li>
                  <li>Emergency call buttons will open your phone's dialer if clicked on a mobile device</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Troubleshooting:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>If the camera doesn't connect, verify the IP address is correct</li>
                  <li>Check that your device and ESP32-CAM are on the same network</li>
                  <li>Try accessing the IP address directly in your browser first</li>
                  <li>Make sure the ESP32-CAM web server is running properly</li>
                </ul>
              </div>
            </div>

            <Button onClick={() => setShowHelp(false)} className="w-full mt-6">
              Got it!
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
