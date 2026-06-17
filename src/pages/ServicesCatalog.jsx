import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, ChevronUp, Zap, Shield, DollarSign, Heart, Building, Sword, Radio, Lightbulb, Factory, ShoppingCart, Truck, Leaf, GraduationCap, Gamepad2, Scale, Umbrella, Plane, FlaskConical, Lock, Wifi, Brain, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const CORE_CAPABILITIES = [
  { metric: "Processing Rate", value: "71.68B states/sec" },
  { metric: "Power Draw", value: "2W" },
  { metric: "Efficiency", value: "35.84B ops/watt" },
  { metric: "Pipeline Depth", value: "100+ concurrent" },
  { metric: "Cascade Amplification", value: "2.8x" },
  { metric: "17-Layer State Space", value: "17,179,869,184 combinations" },
];

const CATALOG = [
  {
    id: "offensive",
    label: "Offensive",
    icon: Sword,
    color: "#f43f5e",
    desc: "Penetration testing & vulnerability research capabilities",
    items: [
      { name: "Key Space Exhaustion", impl: "Brute force all key combinations", value: "71.68B keys/sec" },
      { name: "Hash Collision Mining", impl: "Find SHA256 collisions", value: "17-layer parallel paths" },
      { name: "Password Cracking", impl: "Dictionary + mutation attacks", value: "2.8x cascade amplification" },
      { name: "Cipher Cryptanalysis", impl: "Break weak encryption", value: "Quaternary reduces search" },
      { name: "Packet Injection", impl: "Flood networks with crafted packets", value: "111K packets/sec" },
      { name: "Protocol Fuzzing", impl: "Find protocol vulnerabilities", value: "100+ concurrent streams" },
      { name: "Deep Packet Inspection", impl: "Extract data from encrypted traffic", value: "71.68B pattern match" },
      { name: "Port Scanning", impl: "Enumerate all services", value: "65535 ports in <1ms" },
      { name: "ARP Spoofing", impl: "Man-in-the-middle attacks", value: "Real-time packet rewrite" },
      { name: "DNS Hijacking", impl: "Redirect domain lookups", value: "Hardware-speed response" },
      { name: "RF Signal Interception", impl: "Capture wireless communications", value: "8825 Hz coherence lock" },
      { name: "Frequency Hop Tracking", impl: "Follow spread spectrum", value: "17-layer state prediction" },
      { name: "Side-Channel Extraction", impl: "Power/EM analysis", value: "2W passive operation" },
      { name: "Jamming Signal Generation", impl: "Disrupt communications", value: "71.68B patterns/sec" },
      { name: "Binary Reverse Engineering", impl: "Disassemble executables", value: "DNA codon = opcode" },
      { name: "Malware Signature Creation", impl: "Generate detection bypasses", value: "280.7 variants/sec" },
      { name: "Exploit Development", impl: "Find memory corruption", value: "Cascade execution paths" },
      { name: "Firmware Extraction", impl: "Pull embedded code", value: "Direct memory mapping" },
      { name: "Social Engineering Automation", impl: "Generate phishing content", value: "Pattern-based text gen" },
      { name: "Credential Harvesting", impl: "Extract auth tokens", value: "Real-time traffic analysis" },
    ]
  },
  {
    id: "defensive",
    label: "Defensive",
    icon: Shield,
    color: "#00d4ff",
    desc: "Real-time defense, encryption & threat detection",
    items: [
      { name: "Real-Time IDS", impl: "Inspect all network traffic", value: "71.68B checks/sec" },
      { name: "Anomaly Detection", impl: "Find behavioral deviations", value: "L17 emergence signals" },
      { name: "Zero-Day Discovery", impl: "Detect unknown attacks", value: "Cascade unknown patterns" },
      { name: "DDoS Mitigation", impl: "Filter attack traffic", value: "111K classifications/sec" },
      { name: "Hardware Key Generation", impl: "True random from DNA entropy", value: "Unpredictable seeds" },
      { name: "Real-Time Encryption", impl: "Encrypt all data in flight", value: "71.68B ops/sec" },
      { name: "Multi-Factor Auth", impl: "Hardware challenge-response", value: "17-layer verification" },
      { name: "Quantum-Resistant Crypto", impl: "Post-quantum algorithms", value: "Quaternary complexity" },
      { name: "Secure Voice", impl: "Encrypted real-time audio", value: "2W power budget" },
      { name: "Mesh Network Security", impl: "Self-healing encrypted mesh", value: "Coherence routing" },
      { name: "Air-Gap Bridge", impl: "Secure physical transfer", value: "DNA-encoded media" },
      { name: "Covert Channel Detection", impl: "Find hidden communications", value: "Resonance analysis" },
      { name: "Memory Integrity", impl: "Verify every access", value: "ByteID checking" },
      { name: "Rootkit Detection", impl: "Find kernel compromises", value: "Hardware monitoring" },
      { name: "Secure Boot", impl: "Validate firmware before run", value: "DNA signature check" },
      { name: "Supply Chain Verification", impl: "Authenticate components", value: "Immutable ByteIDs" },
      { name: "Honeypot Acceleration", impl: "Simulate vulnerable systems", value: "100+ concurrent traps" },
      { name: "Threat Intelligence", impl: "Correlate IOCs globally", value: "71.68B correlations/sec" },
      { name: "Incident Response", impl: "Analyze attacks in real-time", value: "Cascade forensics" },
      { name: "Security Orchestration", impl: "Coordinate defenses", value: "Coherence sync all nodes" },
    ]
  },
  {
    id: "finance",
    label: "Finance",
    icon: DollarSign,
    color: "#ffd700",
    desc: "High-frequency trading, fraud detection & financial analytics",
    items: [
      { name: "High-Frequency Trading", impl: "Sub-microsecond decisions", value: "71.68B market evaluations/sec" },
      { name: "Arbitrage Detection", impl: "Cross-exchange price gaps", value: "Real-time all exchanges" },
      { name: "Order Book Analysis", impl: "Predict market movements", value: "17-layer depth analysis" },
      { name: "Risk Modeling", impl: "Monte Carlo simulations", value: "Cascade all outcome paths" },
      { name: "Fraud Detection", impl: "Transaction anomalies", value: "Real-time pattern matching" },
      { name: "Credit Scoring", impl: "Behavioral analysis", value: "DNA-based profiling" },
      { name: "Anti-Money Laundering", impl: "Track fund flows", value: "71.68B transaction traces/sec" },
      { name: "Blockchain Validation", impl: "Verify transactions", value: "280.7 blocks/sec" },
      { name: "Smart Contract Audit", impl: "Find vulnerabilities", value: "Cascade execution paths" },
      { name: "Portfolio Optimization", impl: "Balance risk/reward", value: "17-layer factor analysis" },
      { name: "Market Surveillance", impl: "Detect manipulation", value: "All trades real-time" },
      { name: "Algorithmic Trading", impl: "Execute strategies", value: "Hardware-speed execution" },
      { name: "Derivatives Pricing", impl: "Complex option valuation", value: "Quaternary precision" },
      { name: "Liquidity Analysis", impl: "Predict market depth", value: "Cascade order flow" },
      { name: "Sentiment Analysis", impl: "Parse news/social", value: "71.68B text patterns/sec" },
      { name: "Regulatory Compliance", impl: "Match all rules", value: "Real-time checking" },
      { name: "Customer Segmentation", impl: "Identify profitable clients", value: "DNA behavior clustering" },
      { name: "Loan Default Prediction", impl: "Assess repayment risk", value: "17-layer credit factors" },
      { name: "Insurance Underwriting", impl: "Price policies accurately", value: "Cascade risk scenarios" },
      { name: "Wealth Management", impl: "Personalized advice", value: "Real-time rebalancing" },
    ]
  },
  {
    id: "healthcare",
    label: "Healthcare",
    icon: Heart,
    color: "#f472b6",
    desc: "Genomics, diagnostics & medical AI at hardware speed",
    items: [
      { name: "Genome Sequencing", impl: "Read DNA bases", value: "Native 71.68B bases/sec" },
      { name: "Variant Calling", impl: "Find mutations", value: "17-layer comparison" },
      { name: "Drug-Gene Interaction", impl: "Predict reactions", value: "Quaternary molecular match" },
      { name: "Protein Folding", impl: "Predict 3D structure", value: "Cascade conformations" },
      { name: "Medical Imaging AI", impl: "CT/MRI analysis", value: "71.68B voxels/sec" },
      { name: "Cancer Detection", impl: "Find tumor markers", value: "Real-time biopsy analysis" },
      { name: "Patient Data Security", impl: "Encrypt all records", value: "Hardware PHI protection" },
      { name: "Clinical Trial Matching", impl: "Find eligible patients", value: "17-layer criteria matching" },
      { name: "Drug Discovery", impl: "Screen compounds", value: "71.68B molecules/sec" },
      { name: "Epidemic Modeling", impl: "Predict disease spread", value: "Cascade transmission" },
      { name: "Hospital Resource Optimization", impl: "Bed/staff allocation", value: "Real-time scheduling" },
      { name: "Remote Patient Monitoring", impl: "IoT health sensors", value: "2W wearable processing" },
      { name: "Surgical Robot Control", impl: "Precision movements", value: "Hardware-guaranteed latency" },
      { name: "Pathology Automation", impl: "Slide analysis", value: "280.7 slides/sec" },
      { name: "Radiology Assist", impl: "Flag abnormalities", value: "All images real-time" },
      { name: "Pharmacy Verification", impl: "Drug interaction check", value: "71.68B combinations/sec" },
      { name: "Mental Health Analysis", impl: "Speech/text patterns", value: "DNA behavioral markers" },
      { name: "Rehabilitation Tracking", impl: "Movement analysis", value: "Real-time feedback" },
      { name: "Prosthetics Control", impl: "Neural interface", value: "Hardware signal processing" },
      { name: "Emergency Triage", impl: "Severity assessment", value: "17-layer symptom analysis" },
    ]
  },
  {
    id: "government",
    label: "Government",
    icon: Building,
    color: "#818cf8",
    desc: "Public sector security, intelligence & infrastructure",
    items: [
      { name: "Classified Data Protection", impl: "Hardware encryption", value: "Unbreakable at rest/transit" },
      { name: "Intelligence Correlation", impl: "Connect disparate data", value: "71.68B pattern links/sec" },
      { name: "Border Biometrics", impl: "Face/fingerprint match", value: "Real-time all travelers" },
      { name: "Secure Voting", impl: "Immutable ballots", value: "ByteID each vote" },
      { name: "Critical Infrastructure", impl: "Monitor power/water/gas", value: "2W continuous watch" },
      { name: "Tax Fraud Detection", impl: "Find evasion patterns", value: "17-layer return analysis" },
      { name: "Benefits Verification", impl: "Validate eligibility", value: "Real-time checking" },
      { name: "License Plate Recognition", impl: "Track vehicles", value: "71.68B plates/sec" },
      { name: "Public Safety Analytics", impl: "Crime prediction", value: "Cascade historical patterns" },
      { name: "Emergency Response", impl: "Coordinate resources", value: "Coherence-synced dispatch" },
      { name: "Census Processing", impl: "Analyze demographics", value: "All data real-time" },
      { name: "Grant Management", impl: "Track fund usage", value: "ByteID every dollar" },
      { name: "Immigration Processing", impl: "Background checks", value: "71.68B record searches/sec" },
      { name: "Court Case Analysis", impl: "Legal precedent search", value: "17-layer case matching" },
      { name: "Public Health Surveillance", impl: "Disease tracking", value: "Real-time reporting" },
      { name: "Environmental Monitoring", impl: "Air/water quality", value: "2W sensor nodes" },
      { name: "Disaster Recovery", impl: "Coordinate relief", value: "Cascade resource allocation" },
      { name: "Cybersecurity Operations", impl: "Defend networks", value: "Hardware-speed response" },
      { name: "Diplomatic Communications", impl: "Secure messaging", value: "DNA-encrypted channels" },
      { name: "Asset Management", impl: "Track all property", value: "ByteID every item" },
    ]
  },
  {
    id: "military",
    label: "Military/Defense",
    icon: Sword,
    color: "#22d3ee",
    desc: "Tactical systems, EW, autonomous defense & cryptography",
    items: [
      { name: "Tactical Communications", impl: "Encrypted voice/data", value: "DNA crypto real-time" },
      { name: "Radar Signal Processing", impl: "Target detection", value: "71.68B returns/sec" },
      { name: "Sonar Analysis", impl: "Submarine detection", value: "17-layer acoustic patterns" },
      { name: "Drone Swarm Control", impl: "Coordinated maneuvers", value: "Coherence synchronization" },
      { name: "Electronic Warfare", impl: "Jamming/spoofing", value: "71.68B waveforms/sec" },
      { name: "Missile Guidance", impl: "Trajectory optimization", value: "Hardware-guaranteed latency" },
      { name: "IED Detection", impl: "Pattern recognition", value: "280.7 threat scans/sec" },
      { name: "Night Vision Enhancement", impl: "Image processing", value: "Real-time at 2W" },
      { name: "Satellite Imagery", impl: "Terrain analysis", value: "71.68B pixels/sec" },
      { name: "Logistics Optimization", impl: "Supply chain routing", value: "Cascade all paths" },
      { name: "Personnel Tracking", impl: "Blue force location", value: "Secure position updates" },
      { name: "Cryptographic Key Management", impl: "Secure distribution", value: "Hardware-generated keys" },
      { name: "Battle Damage Assessment", impl: "Post-strike analysis", value: "Real-time imagery" },
      { name: "Threat Intelligence Fusion", impl: "Combine all sources", value: "17-layer correlation" },
      { name: "Autonomous Vehicle Navigation", impl: "Self-driving military", value: "Hardware decision-making" },
      { name: "Cyber Attack/Defense", impl: "Network warfare", value: "71.68B packet analysis/sec" },
      { name: "Nuclear Command/Control", impl: "Secure launch auth", value: "Multi-layer verification" },
      { name: "Space Situational Awareness", impl: "Track all objects", value: "Cascade orbital prediction" },
      { name: "Psychological Operations", impl: "Content generation", value: "Pattern-based messaging" },
      { name: "Weapons System Integration", impl: "Sensor-to-shooter", value: "Hardware-speed fusion" },
    ]
  },
  {
    id: "telecom",
    label: "Telecommunications",
    icon: Radio,
    color: "#34d399",
    desc: "5G/6G processing, spectrum management & network security",
    items: [
      { name: "5G Signal Processing", impl: "Beamforming/MIMO", value: "Quaternary = QPSK native" },
      { name: "6G Research", impl: "Terahertz processing", value: "71.68B samples/sec" },
      { name: "Network Optimization", impl: "Traffic routing", value: "Real-time all paths" },
      { name: "Spectrum Management", impl: "Frequency allocation", value: "8825 Hz coherence" },
      { name: "Voice Compression", impl: "DNA encoding", value: "50x compression ratio" },
      { name: "Video Transcoding", impl: "Format conversion", value: "71.68B pixels/sec" },
      { name: "CDN Edge Processing", impl: "Local content delivery", value: "2W per edge node" },
      { name: "Quality of Service", impl: "Priority enforcement", value: "Hardware packet marking" },
      { name: "Fraud Prevention", impl: "SIM swap/toll fraud", value: "Real-time detection" },
      { name: "Customer Analytics", impl: "Usage patterns", value: "17-layer behavior analysis" },
      { name: "Network Security", impl: "Intrusion detection", value: "71.68B checks/sec" },
      { name: "Billing Verification", impl: "Usage reconciliation", value: "ByteID every call" },
      { name: "Predictive Maintenance", impl: "Equipment failure", value: "Cascade failure paths" },
      { name: "Capacity Planning", impl: "Demand forecasting", value: "17-layer prediction" },
      { name: "Roaming Optimization", impl: "Partner selection", value: "Real-time cost analysis" },
      { name: "Emergency Services", impl: "E911 location", value: "Hardware-speed routing" },
      { name: "IoT Connectivity", impl: "Massive device support", value: "111K connections/sec" },
      { name: "Satellite Backhaul", impl: "LEO constellation", value: "DNA-encoded links" },
      { name: "Private Networks", impl: "Enterprise 5G", value: "Secure isolated processing" },
      { name: "Network Slicing", impl: "Virtual network creation", value: "Real-time resource allocation" },
    ]
  },
  {
    id: "energy",
    label: "Energy",
    icon: Lightbulb,
    color: "#fbbf24",
    desc: "Grid management, renewables & energy trading optimization",
    items: [
      { name: "Grid Load Prediction", impl: "Demand forecasting", value: "17-layer weather/usage" },
      { name: "Smart Meter Analytics", impl: "Usage optimization", value: "111K meters/sec" },
      { name: "Pipeline Leak Detection", impl: "Acoustic analysis", value: "Cascade pressure patterns" },
      { name: "Nuclear Safety Monitoring", impl: "Reactor parameters", value: "Hardware-guaranteed response" },
      { name: "Renewable Optimization", impl: "Solar/wind prediction", value: "Real-time generation" },
      { name: "Energy Trading", impl: "Market optimization", value: "71.68B price evaluations/sec" },
      { name: "Demand Response", impl: "Load shedding", value: "Real-time coordination" },
      { name: "Battery Management", impl: "Charge optimization", value: "DNA-encoded cycling" },
      { name: "Grid Cybersecurity", impl: "SCADA protection", value: "Hardware firewall" },
      { name: "Carbon Tracking", impl: "Emissions monitoring", value: "ByteID every ton" },
      { name: "Outage Prediction", impl: "Failure forecasting", value: "Cascade failure modes" },
      { name: "EV Charging Optimization", impl: "Network coordination", value: "Real-time routing" },
      { name: "Oil/Gas Exploration", impl: "Seismic analysis", value: "71.68B samples/sec" },
      { name: "Refinery Optimization", impl: "Process control", value: "17-layer parameter tuning" },
      { name: "Wind Farm Control", impl: "Turbine coordination", value: "Coherence synchronization" },
      { name: "Solar Panel Tracking", impl: "Sun position optimization", value: "2W per panel controller" },
      { name: "Hydroelectric Management", impl: "Water flow optimization", value: "Cascade reservoir modeling" },
      { name: "Natural Gas Distribution", impl: "Pressure optimization", value: "Real-time all nodes" },
      { name: "Energy Theft Detection", impl: "Meter tampering", value: "Pattern anomaly detection" },
      { name: "Microgrid Management", impl: "Local generation/storage", value: "Autonomous operation" },
    ]
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    icon: Factory,
    color: "#94a3b8",
    desc: "Quality control, robotics & predictive maintenance",
    items: [
      { name: "Visual Quality Control", impl: "Defect detection", value: "71.68B pixels/sec" },
      { name: "Predictive Maintenance", impl: "Equipment failure", value: "Cascade failure analysis" },
      { name: "Supply Chain Tracking", impl: "Component provenance", value: "ByteID every part" },
      { name: "CNC Optimization", impl: "Toolpath generation", value: "Real-time adaptation" },
      { name: "Robotic Coordination", impl: "Multi-arm synchronization", value: "Coherence timing" },
      { name: "Process Control", impl: "Parameter optimization", value: "17-layer tuning" },
      { name: "Inventory Management", impl: "Stock optimization", value: "Real-time all SKUs" },
      { name: "Energy Efficiency", impl: "Power consumption", value: "2W monitoring per machine" },
      { name: "Safety Monitoring", impl: "Hazard detection", value: "Real-time all sensors" },
      { name: "Production Scheduling", impl: "Order optimization", value: "Cascade all constraints" },
      { name: "Digital Twin", impl: "Real-time simulation", value: "71.68B state updates/sec" },
      { name: "Additive Manufacturing", impl: "3D print optimization", value: "Layer-by-layer control" },
      { name: "Weld Quality", impl: "Seam inspection", value: "Real-time imaging" },
      { name: "Assembly Verification", impl: "Step confirmation", value: "ByteID each operation" },
      { name: "Material Testing", impl: "Stress/strain analysis", value: "17-layer property evaluation" },
      { name: "Packaging Optimization", impl: "Container utilization", value: "Cascade packing algorithms" },
      { name: "Environmental Compliance", impl: "Emissions monitoring", value: "Real-time reporting" },
      { name: "Workforce Optimization", impl: "Skill matching", value: "Real-time assignment" },
      { name: "Equipment Calibration", impl: "Precision maintenance", value: "Continuous drift detection" },
      { name: "Product Traceability", impl: "Full lifecycle tracking", value: "ByteID birth to disposal" },
    ]
  },
  {
    id: "retail",
    label: "Retail",
    icon: ShoppingCart,
    color: "#fb923c",
    desc: "Dynamic pricing, fraud prevention & personalization engines",
    items: [
      { name: "Dynamic Pricing", impl: "Real-time optimization", value: "71.68B factor evaluations/sec" },
      { name: "Inventory Forecasting", impl: "Demand prediction", value: "17-layer seasonal analysis" },
      { name: "Fraud Prevention", impl: "Transaction validation", value: "Hardware-speed checking" },
      { name: "Customer Analytics", impl: "Behavior modeling", value: "DNA-based segmentation" },
      { name: "POS Security", impl: "Terminal protection", value: "2W embedded security" },
      { name: "Supply Chain Optimization", impl: "Logistics routing", value: "Cascade all paths" },
      { name: "Personalization Engine", impl: "Product recommendations", value: "Real-time all customers" },
      { name: "Visual Merchandising", impl: "Shelf optimization", value: "Image analysis feedback" },
      { name: "Loss Prevention", impl: "Theft detection", value: "71.68B video frames/sec" },
      { name: "Checkout Automation", impl: "Self-service validation", value: "Real-time item recognition" },
      { name: "Loyalty Program", impl: "Reward optimization", value: "17-layer engagement analysis" },
      { name: "Price Matching", impl: "Competitor monitoring", value: "Real-time all markets" },
      { name: "Store Layout Optimization", impl: "Traffic flow analysis", value: "Cascade customer paths" },
      { name: "Workforce Scheduling", impl: "Staff optimization", value: "Real-time demand matching" },
      { name: "Product Authentication", impl: "Counterfeit detection", value: "ByteID verification" },
      { name: "Returns Processing", impl: "Fraud vs legitimate", value: "Pattern analysis" },
      { name: "Promotional Effectiveness", impl: "Campaign analysis", value: "Real-time attribution" },
      { name: "Omnichannel Integration", impl: "Cross-channel tracking", value: "ByteID customer journey" },
      { name: "Delivery Optimization", impl: "Last-mile routing", value: "Cascade all routes" },
      { name: "Customer Service AI", impl: "Query resolution", value: "71.68B response matches/sec" },
    ]
  },
  {
    id: "transportation",
    label: "Transportation",
    icon: Truck,
    color: "#a78bfa",
    desc: "Autonomous vehicles, traffic systems & fleet intelligence",
    items: [
      { name: "Autonomous Driving", impl: "Real-time decisions", value: "280.7 decisions/sec" },
      { name: "Traffic Optimization", impl: "City-wide coordination", value: "Cascade all intersections" },
      { name: "Fleet Management", impl: "Vehicle tracking", value: "Real-time all units" },
      { name: "Route Optimization", impl: "Shortest path", value: "17-layer constraint solving" },
      { name: "Collision Avoidance", impl: "Sensor fusion", value: "Hardware-guaranteed response" },
      { name: "Predictive Maintenance", impl: "Vehicle diagnostics", value: "Cascade failure prediction" },
      { name: "Fuel Optimization", impl: "Consumption reduction", value: "Real-time driving feedback" },
      { name: "Parking Management", impl: "Space optimization", value: "71.68B availability checks/sec" },
      { name: "Public Transit Scheduling", impl: "Demand-based routing", value: "Real-time adjustment" },
      { name: "Rail Signaling", impl: "Safety interlocking", value: "Hardware-guaranteed safety" },
      { name: "Aviation Traffic Control", impl: "Aircraft separation", value: "17-layer trajectory analysis" },
      { name: "Maritime Navigation", impl: "Ship routing", value: "Cascade weather/current" },
      { name: "Cargo Tracking", impl: "Shipment visibility", value: "ByteID every container" },
      { name: "Driver Behavior", impl: "Safety monitoring", value: "Real-time feedback" },
      { name: "Toll Collection", impl: "Seamless payment", value: "Hardware-speed processing" },
      { name: "Emergency Response", impl: "Ambulance routing", value: "Cascade all obstacles" },
      { name: "Electric Vehicle Range", impl: "Battery optimization", value: "Real-time calculation" },
      { name: "Ride Sharing", impl: "Match optimization", value: "71.68B pairings/sec" },
      { name: "Infrastructure Monitoring", impl: "Bridge/road condition", value: "2W sensor nodes" },
      { name: "Accident Reconstruction", impl: "Event analysis", value: "Cascade timeline" },
    ]
  },
  {
    id: "agriculture",
    label: "Agriculture",
    icon: Leaf,
    color: "#4ade80",
    desc: "Precision farming, crop genetics & supply chain traceability",
    items: [
      { name: "Crop Disease Detection", impl: "Plant health imaging", value: "DNA-native pathogen match" },
      { name: "Yield Prediction", impl: "Harvest forecasting", value: "17-layer environmental analysis" },
      { name: "Precision Irrigation", impl: "Water optimization", value: "2W solar-powered nodes" },
      { name: "Livestock Monitoring", impl: "Health tracking", value: "Real-time all animals" },
      { name: "Soil Analysis", impl: "Nutrient mapping", value: "DNA-based composition" },
      { name: "Weather Prediction", impl: "Microclimate modeling", value: "Cascade atmospheric data" },
      { name: "Pest Detection", impl: "Insect identification", value: "71.68B image classifications/sec" },
      { name: "Supply Chain Traceability", impl: "Farm to table", value: "ByteID every product" },
      { name: "Equipment Optimization", impl: "Tractor/harvester routing", value: "Cascade field coverage" },
      { name: "Greenhouse Automation", impl: "Climate control", value: "Real-time all parameters" },
      { name: "Drone Crop Surveillance", impl: "Aerial imaging", value: "2W flight processing" },
      { name: "Fertilizer Optimization", impl: "Application precision", value: "17-layer nutrient analysis" },
      { name: "Harvest Timing", impl: "Ripeness detection", value: "DNA-based sugar/starch" },
      { name: "Cold Chain Monitoring", impl: "Temperature tracking", value: "Real-time all shipments" },
      { name: "Market Price Prediction", impl: "Commodity forecasting", value: "Cascade supply/demand" },
      { name: "Water Quality Monitoring", impl: "Irrigation safety", value: "Real-time all sources" },
      { name: "Genetic Crop Improvement", impl: "Trait selection", value: "Native DNA processing" },
      { name: "Farm Management", impl: "Resource allocation", value: "Real-time all operations" },
      { name: "Pollination Optimization", impl: "Bee hive placement", value: "Cascade coverage analysis" },
      { name: "Carbon Sequestration", impl: "Soil carbon tracking", value: "ByteID environmental credit" },
    ]
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    color: "#38bdf8",
    desc: "Adaptive learning, academic security & research computing",
    items: [
      { name: "Adaptive Learning", impl: "Personalized curriculum", value: "17-layer student modeling" },
      { name: "Plagiarism Detection", impl: "Content comparison", value: "71.68B text comparisons/sec" },
      { name: "Exam Security", impl: "Hardware-locked testing", value: "Tamper-proof environment" },
      { name: "Research Computing", impl: "Scientific analysis", value: "Low-power lab deployment" },
      { name: "Remote Proctoring", impl: "Behavior monitoring", value: "Real-time analysis" },
      { name: "Learning Analytics", impl: "Student performance", value: "Cascade progress prediction" },
      { name: "Content Recommendation", impl: "Course suggestions", value: "Real-time all students" },
      { name: "Grading Automation", impl: "Assignment evaluation", value: "71.68B rubric checks/sec" },
      { name: "Language Learning", impl: "Pronunciation analysis", value: "Real-time feedback" },
      { name: "Virtual Labs", impl: "Simulation processing", value: "Hardware-accelerated" },
      { name: "Student Authentication", impl: "Biometric verification", value: "Hardware identity" },
      { name: "Accessibility Tools", impl: "Real-time transcription", value: "2W portable devices" },
      { name: "Collaborative Filtering", impl: "Study group matching", value: "17-layer compatibility" },
      { name: "Knowledge Graphs", impl: "Concept mapping", value: "Cascade relationship discovery" },
      { name: "Tutoring Systems", impl: "Intelligent assistance", value: "Real-time all queries" },
      { name: "Credential Verification", impl: "Diploma authenticity", value: "ByteID each certificate" },
      { name: "Campus Security", impl: "Threat detection", value: "Real-time all cameras" },
      { name: "Library Management", impl: "Resource optimization", value: "All materials tracked" },
      { name: "Sports Analytics", impl: "Performance analysis", value: "Real-time athlete data" },
      { name: "Alumni Engagement", impl: "Relationship modeling", value: "DNA behavioral patterns" },
    ]
  },
  {
    id: "entertainment",
    label: "Entertainment",
    icon: Gamepad2,
    color: "#c084fc",
    desc: "Real-time rendering, content moderation & metaverse computing",
    items: [
      { name: "Real-Time Ray Tracing", impl: "Photorealistic graphics", value: "71.68B rays/sec" },
      { name: "AI Game Characters", impl: "NPC decision-making", value: "17-layer behavior trees" },
      { name: "Content Moderation", impl: "Inappropriate detection", value: "Cascade context analysis" },
      { name: "Video Compression", impl: "DNA-encoded streaming", value: "50x compression" },
      { name: "VR/AR Processing", impl: "Immersive rendering", value: "2W headset compute" },
      { name: "Music Generation", impl: "Composition AI", value: "DNA-based patterns" },
      { name: "Recommendation Engine", impl: "Content matching", value: "71.68B preference checks/sec" },
      { name: "Live Event Production", impl: "Multi-camera switching", value: "Real-time all feeds" },
      { name: "Special Effects", impl: "CGI rendering", value: "Hardware-accelerated" },
      { name: "Anti-Cheat Systems", impl: "Exploit detection", value: "Real-time all players" },
      { name: "Audience Analytics", impl: "Engagement tracking", value: "17-layer behavior analysis" },
      { name: "DRM Protection", impl: "Content security", value: "Hardware-level encryption" },
      { name: "Facial Animation", impl: "Motion capture", value: "Real-time processing" },
      { name: "Sound Design", impl: "Audio synthesis", value: "DNA-based acoustics" },
      { name: "Streaming Quality", impl: "Adaptive bitrate", value: "Real-time network analysis" },
      { name: "Social Features", impl: "Friend matching", value: "Cascade compatibility" },
      { name: "Esports Analytics", impl: "Performance tracking", value: "All player stats real-time" },
      { name: "Ad Placement", impl: "Contextual insertion", value: "71.68B placement decisions/sec" },
      { name: "Language Localization", impl: "Translation automation", value: "Real-time all languages" },
      { name: "Metaverse Computing", impl: "Persistent world state", value: "Distributed coherence" },
    ]
  },
  {
    id: "legal",
    label: "Legal",
    icon: Scale,
    color: "#fcd34d",
    desc: "Contract analysis, e-discovery & compliance automation",
    items: [
      { name: "Contract Analysis", impl: "Clause extraction", value: "71.68B clause comparisons/sec" },
      { name: "Evidence Authentication", impl: "Chain of custody", value: "ByteID every item" },
      { name: "E-Discovery", impl: "Document correlation", value: "Cascade relevance analysis" },
      { name: "Compliance Monitoring", impl: "Regulation matching", value: "Real-time all rules" },
      { name: "IP Protection", impl: "DNA watermarking", value: "Embedded identification" },
      { name: "Case Prediction", impl: "Outcome modeling", value: "17-layer precedent analysis" },
      { name: "Legal Research", impl: "Citation finding", value: "71.68B case searches/sec" },
      { name: "Deposition Analysis", impl: "Transcript review", value: "Real-time contradiction detection" },
      { name: "Billing Verification", impl: "Time tracking", value: "ByteID every entry" },
      { name: "Jury Selection", impl: "Bias prediction", value: "17-layer demographic analysis" },
      { name: "Document Review", impl: "Privilege detection", value: "Cascade context evaluation" },
      { name: "Trademark Search", impl: "Similarity matching", value: "71.68B mark comparisons/sec" },
      { name: "Patent Analysis", impl: "Prior art discovery", value: "Real-time all databases" },
      { name: "Fraud Investigation", impl: "Transaction tracing", value: "Cascade fund flows" },
      { name: "Witness Credibility", impl: "Statement consistency", value: "Pattern analysis" },
      { name: "Regulatory Filing", impl: "Compliance automation", value: "Real-time submission" },
      { name: "Court Scheduling", impl: "Docket optimization", value: "Cascade all constraints" },
      { name: "Legal Translation", impl: "Multi-language documents", value: "Real-time accuracy" },
      { name: "Risk Assessment", impl: "Litigation probability", value: "17-layer factor analysis" },
      { name: "Knowledge Management", impl: "Firm expertise mapping", value: "DNA-based specialization" },
    ]
  },
  {
    id: "insurance",
    label: "Insurance",
    icon: Umbrella,
    color: "#67e8f9",
    desc: "Claims fraud detection, actuarial modeling & IoT underwriting",
    items: [
      { name: "Claims Fraud Detection", impl: "Anomaly identification", value: "17-layer pattern analysis" },
      { name: "Risk Assessment", impl: "Premium calculation", value: "71.68B factor evaluations/sec" },
      { name: "Actuarial Modeling", impl: "Loss prediction", value: "Cascade probability paths" },
      { name: "Policy Matching", impl: "Coverage analysis", value: "Real-time comparison" },
      { name: "Disaster Prediction", impl: "Catastrophe modeling", value: "Cascade environmental data" },
      { name: "Underwriting Automation", impl: "Application processing", value: "71.68B risk checks/sec" },
      { name: "Telematics Processing", impl: "Driving behavior", value: "Real-time all vehicles" },
      { name: "Image Assessment", impl: "Damage evaluation", value: "Hardware-accelerated vision" },
      { name: "Medical Underwriting", impl: "Health risk analysis", value: "DNA-based evaluation" },
      { name: "Subrogation", impl: "Recovery optimization", value: "Cascade liability analysis" },
      { name: "Customer Segmentation", impl: "Profitability analysis", value: "17-layer behavior clustering" },
      { name: "Renewal Prediction", impl: "Churn modeling", value: "Real-time all policies" },
      { name: "Agent Performance", impl: "Sales optimization", value: "Cascade success factors" },
      { name: "Regulatory Compliance", impl: "Filing automation", value: "Real-time all jurisdictions" },
      { name: "Reinsurance Optimization", impl: "Treaty analysis", value: "71.68B scenario evaluations/sec" },
      { name: "Property Valuation", impl: "Asset assessment", value: "Real-time market data" },
      { name: "Liability Estimation", impl: "Reserve calculation", value: "Cascade claim development" },
      { name: "Weather Integration", impl: "Risk adjustment", value: "Real-time all locations" },
      { name: "IoT Sensor Processing", impl: "Smart home/car data", value: "2W edge processing" },
      { name: "Blockchain Claims", impl: "Immutable records", value: "ByteID every claim" },
    ]
  },
  {
    id: "aerospace",
    label: "Aerospace",
    icon: Plane,
    color: "#60a5fa",
    desc: "Flight systems, satellite comms & spacecraft autonomy",
    items: [
      { name: "Flight Control Systems", impl: "Real-time autopilot", value: "Hardware-guaranteed response" },
      { name: "Satellite Communications", impl: "Telemetry encoding", value: "DNA-encrypted links" },
      { name: "Space Debris Tracking", impl: "Collision avoidance", value: "71.68B trajectories/sec" },
      { name: "Mission Planning", impl: "Trajectory optimization", value: "17-layer contingency" },
      { name: "Spacecraft Autonomy", impl: "Deep space decisions", value: "2W operation" },
      { name: "Rocket Engine Control", impl: "Thrust optimization", value: "Hardware-speed feedback" },
      { name: "Aerodynamic Simulation", impl: "CFD processing", value: "71.68B cell calculations/sec" },
      { name: "Structural Monitoring", impl: "Stress analysis", value: "Real-time all sensors" },
      { name: "Navigation Systems", impl: "Position calculation", value: "Hardware-guaranteed accuracy" },
      { name: "Weather Radar", impl: "Storm detection", value: "Cascade pattern analysis" },
      { name: "Air Traffic Management", impl: "Separation assurance", value: "All aircraft real-time" },
      { name: "Fuel Optimization", impl: "Consumption reduction", value: "17-layer route analysis" },
      { name: "Maintenance Prediction", impl: "Component failure", value: "Cascade failure modes" },
      { name: "Passenger Systems", impl: "Entertainment/connectivity", value: "DNA-compressed media" },
      { name: "Ground Operations", impl: "Turnaround optimization", value: "Real-time scheduling" },
      { name: "Noise Reduction", impl: "Active cancellation", value: "Hardware-speed processing" },
      { name: "Composite Manufacturing", impl: "Layup optimization", value: "DNA-based curing" },
      { name: "Test Data Analysis", impl: "Flight test processing", value: "71.68B samples/sec" },
      { name: "Supply Chain", impl: "Parts authenticity", value: "ByteID every component" },
      { name: "Cabin Pressure Control", impl: "Life support optimization", value: "Hardware safety critical" },
    ]
  },
  {
    id: "pharma",
    label: "Pharmaceutical",
    icon: FlaskConical,
    color: "#f9a8d4",
    desc: "Drug discovery, CRISPR design & clinical trial optimization",
    items: [
      { name: "Drug Discovery", impl: "Molecular screening", value: "71.68B compounds/sec" },
      { name: "Clinical Trial Analysis", impl: "Outcome prediction", value: "Cascade patient paths" },
      { name: "Compound Screening", impl: "Activity prediction", value: "DNA-native molecular match" },
      { name: "Manufacturing QC", impl: "Purity analysis", value: "Real-time batch verification" },
      { name: "Counterfeit Detection", impl: "Authenticity verification", value: "ByteID every package" },
      { name: "Pharmacovigilance", impl: "Adverse event detection", value: "71.68B report correlations/sec" },
      { name: "Protein Engineering", impl: "Structure optimization", value: "DNA-native design" },
      { name: "Formulation Development", impl: "Excipient selection", value: "17-layer stability analysis" },
      { name: "Biomarker Discovery", impl: "Disease indicators", value: "Native genetic processing" },
      { name: "Dosage Optimization", impl: "Patient-specific dosing", value: "DNA-based metabolism" },
      { name: "Supply Chain Security", impl: "Cold chain verification", value: "Real-time all shipments" },
      { name: "Regulatory Submission", impl: "Document automation", value: "Cascade compliance checking" },
      { name: "Patent Analysis", impl: "Prior art searching", value: "71.68B claim comparisons/sec" },
      { name: "Lab Automation", impl: "Experiment coordination", value: "Coherence synchronization" },
      { name: "CRISPR Design", impl: "Guide RNA optimization", value: "DNA-native processing" },
      { name: "Antibody Engineering", impl: "Binding optimization", value: "Cascade conformational search" },
      { name: "Vaccine Development", impl: "Antigen prediction", value: "Native immunogen analysis" },
      { name: "Drug Repurposing", impl: "New indication discovery", value: "17-layer interaction analysis" },
      { name: "Toxicity Prediction", impl: "Safety assessment", value: "Cascade metabolic pathways" },
      { name: "Gene Therapy", impl: "Vector optimization", value: "DNA-native delivery design" },
    ]
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    icon: Lock,
    color: "#f87171",
    desc: "SIEM, zero trust, threat hunting & red team automation",
    items: [
      { name: "Threat Intelligence", impl: "IOC correlation", value: "71.68B indicators/sec" },
      { name: "Penetration Testing", impl: "Vulnerability discovery", value: "Cascade attack paths" },
      { name: "Incident Response", impl: "Attack analysis", value: "Real-time forensics" },
      { name: "Malware Sandbox", impl: "Isolated execution", value: "Hardware protection" },
      { name: "Zero Trust Enforcement", impl: "Continuous verification", value: "17-layer authentication" },
      { name: "SIEM Processing", impl: "Log correlation", value: "71.68B events/sec" },
      { name: "Network Forensics", impl: "Packet capture analysis", value: "Real-time all traffic" },
      { name: "Vulnerability Scanning", impl: "Asset assessment", value: "All systems continuous" },
      { name: "Password Auditing", impl: "Credential testing", value: "71.68B hashes/sec" },
      { name: "Phishing Detection", impl: "Email analysis", value: "Real-time all messages" },
      { name: "DLP Enforcement", impl: "Data classification", value: "Cascade content analysis" },
      { name: "Access Control", impl: "Permission verification", value: "Hardware-speed decisions" },
      { name: "Encryption Key Management", impl: "Secure generation", value: "DNA-based entropy" },
      { name: "Deception Technology", impl: "Honeypot orchestration", value: "100+ concurrent traps" },
      { name: "Threat Hunting", impl: "Proactive detection", value: "17-layer behavior analysis" },
      { name: "Compliance Auditing", impl: "Control verification", value: "Real-time all systems" },
      { name: "Security Orchestration", impl: "Tool coordination", value: "Coherence automation" },
      { name: "Dark Web Monitoring", impl: "Underground intelligence", value: "71.68B content scans/sec" },
      { name: "Identity Verification", impl: "Multi-factor validation", value: "Hardware authentication" },
      { name: "Red Team Automation", impl: "Attack simulation", value: "Cascade attack generation" },
    ]
  },
  {
    id: "iot",
    label: "IoT",
    icon: Wifi,
    color: "#6ee7b7",
    desc: "Edge computing, sensor fusion & ultra-low power deployments",
    items: [
      { name: "Edge Computing", impl: "Local processing", value: "2W enables battery" },
      { name: "Sensor Fusion", impl: "Multi-source integration", value: "111K sensors/sec" },
      { name: "Device Authentication", impl: "Hardware identity", value: "ByteID every device" },
      { name: "Mesh Networking", impl: "Self-organizing", value: "Coherence coordination" },
      { name: "Predictive Analytics", impl: "Edge inference", value: "Real-time decisions" },
      { name: "Anomaly Detection", impl: "Behavior monitoring", value: "17-layer deviation analysis" },
      { name: "Firmware Security", impl: "Secure boot", value: "DNA signature verification" },
      { name: "Data Compression", impl: "Bandwidth optimization", value: "40:1 DNA encoding" },
      { name: "Power Management", impl: "Battery optimization", value: "2W total operation" },
      { name: "Protocol Translation", impl: "Gateway processing", value: "All protocols real-time" },
      { name: "Geolocation", impl: "Position tracking", value: "Hardware-accelerated" },
      { name: "Environmental Sensing", impl: "Climate monitoring", value: "2W solar powered" },
      { name: "Asset Tracking", impl: "Location management", value: "ByteID every item" },
      { name: "Smart Home", impl: "Automation control", value: "Real-time all devices" },
      { name: "Industrial IoT", impl: "Factory sensors", value: "Predictive maintenance" },
      { name: "Wearables", impl: "Health monitoring", value: "Ultra-low power" },
      { name: "Smart City", impl: "Infrastructure monitoring", value: "Cascade analysis" },
      { name: "Agriculture IoT", impl: "Crop/livestock sensors", value: "Solar-powered fields" },
      { name: "Retail IoT", impl: "Inventory tracking", value: "Real-time all items" },
      { name: "Vehicle IoT", impl: "Connected car processing", value: "71.68B vehicle data/sec" },
    ]
  },
  {
    id: "ai",
    label: "Artificial Intelligence",
    icon: Brain,
    color: "#a78bfa",
    desc: "Neural inference, training acceleration & edge AI deployment",
    items: [
      { name: "Neural Network Inference", impl: "Model execution", value: "71.68B activations/sec" },
      { name: "Training Acceleration", impl: "Gradient computation", value: "Quaternary weight encoding" },
      { name: "Model Compression", impl: "Parameter reduction", value: "DNA folding weights" },
      { name: "Federated Learning", impl: "Edge participation", value: "2W device training" },
      { name: "Explainable AI", impl: "Decision tracing", value: "17-layer path analysis" },
      { name: "Natural Language Processing", impl: "Text understanding", value: "71.68B token evaluations/sec" },
      { name: "Computer Vision", impl: "Image recognition", value: "Real-time all frames" },
      { name: "Speech Recognition", impl: "Audio transcription", value: "Hardware-accelerated" },
      { name: "Reinforcement Learning", impl: "Action optimization", value: "Cascade state exploration" },
      { name: "Generative Models", impl: "Content creation", value: "DNA-encoded generation" },
      { name: "Recommendation Systems", impl: "Preference matching", value: "Real-time personalization" },
      { name: "Anomaly Detection", impl: "Outlier identification", value: "17-layer deviation analysis" },
      { name: "Time Series Prediction", impl: "Forecasting", value: "Cascade temporal patterns" },
      { name: "Graph Neural Networks", impl: "Relationship learning", value: "DNA connectivity encoding" },
      { name: "Transfer Learning", impl: "Domain adaptation", value: "Quaternary feature transfer" },
      { name: "AutoML", impl: "Architecture search", value: "71.68B configs/sec" },
      { name: "Multimodal Fusion", impl: "Cross-modal learning", value: "Hardware-accelerated" },
      { name: "Edge AI", impl: "On-device inference", value: "2W deployment" },
      { name: "AI Safety", impl: "Behavior monitoring", value: "Real-time constraint checking" },
      { name: "Neuro-Symbolic", impl: "Logic integration", value: "DNA-based reasoning" },
    ]
  },
];

function CategorySection({ cat, expanded, onToggle }) {
  const Icon = cat.icon;
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0d0e16]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cat.color + "20", border: `1px solid ${cat.color}40` }}>
            <Icon className="w-5 h-5" style={{ color: cat.color }} />
          </div>
          <div className="text-left">
            <div className="font-bold text-white font-orbitron text-sm">{cat.label}</div>
            <div className="text-xs text-white/40 mt-0.5">{cat.desc}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: cat.color + "20", color: cat.color }}>
            {cat.items.length} use cases
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/5 px-6 pb-6">
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-white/30 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pr-4 w-6">#</th>
                  <th className="pb-3 pr-4">Use Case</th>
                  <th className="pb-3 pr-4 hidden md:table-cell">Implementation</th>
                  <th className="pb-3 text-right">Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cat.items.map((item, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 pr-4 text-white/20 text-xs">{i + 1}</td>
                    <td className="py-2.5 pr-4 font-semibold text-white">{item.name}</td>
                    <td className="py-2.5 pr-4 text-white/50 hidden md:table-cell">{item.impl}</td>
                    <td className="py-2.5 text-right">
                      <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: cat.color + "15", color: cat.color }}>
                        {item.value}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServicesCatalog() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const [expandAll, setExpandAll] = useState(false);

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const handleExpandAll = () => {
    const next = !expandAll;
    setExpandAll(next);
    const state = {};
    CATALOG.forEach(c => { state[c.id] = next; });
    setExpanded(state);
  };

  const filtered = search.trim()
    ? CATALOG.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.impl.toLowerCase().includes(search.toLowerCase()) ||
          item.value.toLowerCase().includes(search.toLowerCase()) ||
          cat.label.toLowerCase().includes(search.toLowerCase())
        )
      })).filter(cat => cat.items.length > 0)
    : CATALOG;

  const isExpanded = (id) => {
    if (search.trim()) return true;
    return !!expanded[id];
  };

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <p className="text-xs font-orbitron uppercase tracking-widest mb-3" style={{ color: "#00d4ff" }}>
            Build: C2230709
          </p>
          <h1 className="text-4xl sm:text-5xl font-orbitron font-bold mb-4 bg-gradient-to-r from-white via-cyan-300 to-yellow-300 bg-clip-text text-transparent">
            QVTX DNA FPGA
          </h1>
          <h2 className="text-2xl sm:text-3xl font-orbitron font-bold mb-4 text-white/80">
            Applications Catalog
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            420 use cases across 21 industries — powered by 71.68 billion states/sec at 2W
          </p>
          <p className="text-xs text-white/30 mt-2">QUANTVESTRIX INC. — Proprietary</p>
        </motion.div>

        {/* Core Capabilities */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CORE_CAPABILITIES.map((cap, i) => (
              <div key={i} className="bg-[#0d0e16] border border-white/10 rounded-xl p-4 text-center">
                <div className="text-xs text-white/30 mb-1">{cap.metric}</div>
                <div className="text-sm font-bold font-mono" style={{ color: "#00d4ff" }}>{cap.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search + controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search use cases, industries, implementations..."
              className="w-full bg-[#0d0e16] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <button
            onClick={handleExpandAll}
            className="px-5 py-3 rounded-xl border text-sm font-semibold text-white/60 hover:text-white transition-all"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            {expandAll ? "Collapse All" : "Expand All"}
          </button>
        </motion.div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-4 mb-8 text-sm">
          <span className="text-white/30">{filtered.length} industries</span>
          <span className="text-white/10">|</span>
          <span className="text-white/30">{filtered.reduce((a, c) => a + c.items.length, 0)} use cases {search ? "matched" : "total"}</span>
          {search && <span className="text-white/10">|</span>}
          {search && <span style={{ color: "#00d4ff" }} className="text-xs">Showing search results</span>}
        </div>

        {/* Catalog */}
        <div className="space-y-3">
          {filtered.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <CategorySection
                cat={cat}
                expanded={isExpanded(cat.id)}
                onToggle={() => toggle(cat.id)}
              />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-white/30">No use cases found for "{search}"</div>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center text-xs text-white/20 font-orbitron">
          QUANTVESTRIX INC. — Document Generated: 2026-05-23 — Build: C2230709
        </div>
      </div>
    </div>
  );
}