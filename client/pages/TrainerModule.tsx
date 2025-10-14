import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, FileText, Zap, Edit3, Users, BarChart3, Brain, Volume2, Globe } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import UploadCenter from "@/components/trainer/UploadCenter";
import TranslationPreview from "@/components/trainer/TranslationPreview";
import CollaborativeEditor from "@/components/collaboration/CollaborativeEditor";
import AutoSubtitler from "@/components/trainer/AutoSubtitler";
import AIContentCreator from "@/components/trainer/AIContentCreator";
import ReportsInsights from "@/components/trainer/ReportsInsights";

type FileItem = { id: string; name: string; size: number; progress: number; status: "uploading" | "processing" | "done" };

// Global state interfaces
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'processing' | 'translated' | 'error' | 'ready';
  sourceLanguage: string;
  targetLanguages: string[];
  translationProgress: number;
  uploadedAt: string;
  lastModified: string;
  downloadUrl?: string;
  previewUrl?: string;
}

interface TranslationDocument {
  id: string;
  title: string;
  originalLanguage: string;
  targetLanguage: string;
  content: string;
  translatedContent: string;
  segments: TranslationSegment[];
  status: 'draft' | 'review' | 'approved' | 'published';
  lastModified: string;
  version: number;
  wordCount: number;
  characterCount: number;
  collaborators?: Collaborator[];
  comments?: Comment[];
}

// Type alias for CollaborativeEditor compatibility
type CollaborativeDocument = TranslationDocument & {
  collaborators: Collaborator[];
  comments: Comment[];
};

interface TranslationSegment {
  id: string;
  original: string;
  translated: string;
  confidence: number;
  status: 'high' | 'medium' | 'low';
  language: string;
  domain: string;
  lastUpdated: string;
  isEdited: boolean;
  version: number;
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role: 'trainer' | 'reviewer' | 'admin';
  isOnline: boolean;
  lastSeen: string;
}

interface Comment {
  id: string;
  author: Collaborator;
  content: string;
  timestamp: string;
  type: 'comment' | 'suggestion' | 'question';
  status: 'open' | 'resolved' | 'rejected';
  replies: Comment[];
}

interface GeneratedContent {
  id: string;
  title: string;
  type: 'text' | 'video' | 'image' | 'interactive';
  content: string;
  language: string;
  domain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  tags: string[];
  createdAt: string;
  status: 'generating' | 'ready' | 'error';
  confidence: number;
  version: number;
  isEdited: boolean;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', flag: '🇮🇳' },
  { code: 'sa', name: 'Sanskrit', flag: '🇮🇳' }
];

export default function TrainerModule() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("upload");
  
  // Global state management
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [documents, setDocuments] = useState<TranslationDocument[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<TranslationDocument | null>(null);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);

  // Initialize with sample data
  useEffect(() => {
    const sampleDocument: TranslationDocument = {
      id: 'doc-1',
      title: 'Solar Panel Installation Guide',
      originalLanguage: 'English',
      targetLanguage: 'Hindi',
      content: 'Introduction to solar panel installation: Types of panels, tools, safety equipment, step-by-step mounting and wiring.\n\nSafety checks: always wear PPE, isolate circuits before work, test connections.\n\nStep 1: Site Assessment\nBefore installation, conduct a thorough site assessment to determine the best location for solar panels.\n\nStep 2: Safety Preparation\nEnsure all safety equipment is in place and all team members are properly trained.',
      translatedContent: 'सौर पैनल स्थापना का परिचय: पैनल के प्रकार, उपकरण, सुरक्षा उपकरण, चरणबद्ध माउंटिंग और वायरिंग।\n\nसुरक्षा जांच: हमेशा PPE पहनें, काम से पहले सर्किट को अलग करें, कनेक्शन का परीक्षण करें।\n\nचरण 1: साइट मूल्यांकन\nस्थापना से पहले, सौर पैनलों के लिए सबसे अच्छे स्थान का निर्धारण करने के लिए एक व्यापक साइट मूल्यांकन करें।\n\nचरण 2: सुरक्षा तैयारी\nसुनिश्चित करें कि सभी सुरक्षा उपकरण जगह पर हैं और सभी टीम सदस्यों को उचित रूप से प्रशिक्षित किया गया है।',
      segments: [
        {
          id: 'seg-1',
          original: 'Introduction to solar panel installation',
          translated: 'सौर पैनल स्थापना का परिचय',
          confidence: 95,
          status: 'high',
          language: 'Hindi',
          domain: 'Solar Energy',
          lastUpdated: '2024-01-15',
          isEdited: false,
          version: 1
        },
        {
          id: 'seg-2',
          original: 'Safety checks: always wear PPE',
          translated: 'सुरक्षा जांच: हमेशा PPE पहनें',
          confidence: 88,
          status: 'medium',
          language: 'Hindi',
          domain: 'Safety',
          lastUpdated: '2024-01-15',
          isEdited: false,
          version: 1
        },
        {
          id: 'seg-3',
          original: 'Step 1: Site Assessment',
          translated: 'चरण 1: साइट मूल्यांकन',
          confidence: 92,
          status: 'high',
          language: 'Hindi',
          domain: 'Solar Energy',
          lastUpdated: '2024-01-15',
          isEdited: false,
          version: 1
        },
        {
          id: 'seg-4',
          original: 'Step 2: Safety Preparation',
          translated: 'चरण 2: सुरक्षा तैयारी',
          confidence: 90,
          status: 'high',
          language: 'Hindi',
          domain: 'Safety',
          lastUpdated: '2024-01-15',
          isEdited: false,
          version: 1
        }
      ],
      status: 'draft',
      lastModified: '2024-01-15',
      version: 1,
      wordCount: 67,
      characterCount: 420,
      collaborators: [
        {
          id: 'user-1',
          name: 'John Smith',
          avatar: 'JS',
          role: 'trainer',
          isOnline: true,
          lastSeen: '2 minutes ago'
        },
        {
          id: 'user-2',
          name: 'Maria Garcia',
          avatar: 'MG',
          role: 'reviewer',
          isOnline: false,
          lastSeen: '1 hour ago'
        }
      ],
      comments: [
        {
          id: 'comment-1',
          author: {
            id: 'user-1',
            name: 'John Smith',
            avatar: 'JS',
            role: 'trainer',
            isOnline: true,
            lastSeen: '2 minutes ago'
          },
          content: 'The translation looks good, but we should add more context for technical terms.',
          timestamp: '2 hours ago',
          type: 'comment',
          status: 'open',
          replies: []
        },
        {
          id: 'comment-2',
          author: {
            id: 'user-2',
            name: 'Maria Garcia',
            avatar: 'MG',
            role: 'reviewer',
            isOnline: false,
            lastSeen: '1 hour ago'
          },
          content: 'I suggest using "स्थापना" instead of "माउंटिंग" for better clarity.',
          timestamp: '1 hour ago',
          type: 'suggestion',
          status: 'open',
          replies: []
        }
      ]
    };

    setDocuments([sampleDocument]);
    setSelectedDocument(sampleDocument);
  }, []);

  const currentUser: Collaborator = {
    id: 'user-1',
    name: 'John Smith',
    avatar: 'JS',
    role: 'trainer',
    isOnline: true,
    lastSeen: '2 minutes ago'
  };

  // Generate realistic dummy content based on file type and name
  const generateDummyContent = (fileName: string, fileType: string, targetLanguage: string) => {
    const domain = getDomainFromFileName(fileName);
    const contentData = getContentByDomain(domain);
    
    const segments = contentData.segments.map((segment, index) => ({
      id: `seg-${Date.now()}-${index + 1}`,
      original: segment.original,
      translated: segment.translated[targetLanguage] || segment.translated['Hindi'],
      confidence: segment.confidence,
      status: segment.confidence >= 90 ? 'high' as const : segment.confidence >= 75 ? 'medium' as const : 'low' as const,
      language: targetLanguage,
      domain: domain,
      lastUpdated: new Date().toISOString(),
      isEdited: false,
      version: 1
    }));

    return {
      content: contentData.content,
      translatedContent: contentData.translatedContent[targetLanguage] || contentData.translatedContent['Hindi'],
      segments: segments,
      domain: domain
    };
  };

  const getDomainFromFileName = (fileName: string): string => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('solar')) return 'Solar Energy';
    if (lowerName.includes('electrical') || lowerName.includes('electric')) return 'Electrical';
    if (lowerName.includes('plumbing') || lowerName.includes('pipe')) return 'Plumbing';
    if (lowerName.includes('construction') || lowerName.includes('building')) return 'Construction';
    if (lowerName.includes('automotive') || lowerName.includes('car') || lowerName.includes('vehicle')) return 'Automotive';
    if (lowerName.includes('safety')) return 'Safety';
    return 'General';
  };

  const getContentByDomain = (domain: string) => {
    const contentMap: Record<string, any> = {
      'Solar Energy': {
        content: `# Solar Panel Installation Guide

## Introduction
This comprehensive guide covers the complete process of installing solar panels for residential and commercial applications. Solar energy is a clean, renewable source of power that can significantly reduce electricity bills and carbon footprint.

## Safety Requirements
- Always wear appropriate Personal Protective Equipment (PPE)
- Ensure all electrical circuits are properly isolated
- Work with a qualified electrician for electrical connections
- Check weather conditions before installation
- Use proper fall protection equipment when working on roofs

## Tools and Materials Required
- Solar panels (monocrystalline or polycrystalline)
- Mounting rails and brackets
- Inverter (string or micro-inverter)
- DC disconnect switch
- AC disconnect switch
- Grounding equipment
- Cable management system
- Weatherproof junction boxes

## Installation Process

### Step 1: Site Assessment
- Measure roof dimensions and orientation
- Check for shading from trees or buildings
- Verify structural integrity of roof
- Determine optimal panel placement

### Step 2: Mounting System Installation
- Install mounting rails parallel to roof edge
- Ensure proper spacing between rails
- Secure brackets to roof structure
- Apply weatherproofing around penetrations

### Step 3: Panel Installation
- Position panels on mounting system
- Secure panels with clamps
- Maintain proper spacing for ventilation
- Ensure all panels are level and aligned

### Step 4: Electrical Connections
- Connect panels in series or parallel configuration
- Install DC disconnect switch
- Run conduit from panels to inverter location
- Connect to inverter following manufacturer instructions

### Step 5: Inverter Installation
- Mount inverter in appropriate location
- Connect DC input from panels
- Connect AC output to electrical panel
- Install AC disconnect switch

### Step 6: Grounding and Bonding
- Install grounding electrode system
- Bond all metal components
- Connect equipment grounding conductors
- Test grounding system continuity

## Testing and Commissioning
- Perform insulation resistance tests
- Check all electrical connections
- Verify proper operation of disconnect switches
- Test inverter functionality
- Measure system output

## Maintenance Requirements
- Clean panels regularly to maintain efficiency
- Inspect mounting system annually
- Check electrical connections for corrosion
- Monitor system performance
- Replace components as needed

## Troubleshooting Common Issues
- Low power output: Check for shading or dirty panels
- Inverter faults: Verify connections and settings
- Ground faults: Inspect grounding system
- Communication errors: Check wiring and settings

## Conclusion
Proper installation of solar panels requires careful planning, attention to safety, and adherence to electrical codes. Following this guide will help ensure a safe and efficient solar energy system.`,
        translatedContent: {
          'Hindi': `# सौर पैनल स्थापना गाइड

## परिचय
यह व्यापक गाइड आवासीय और वाणिज्यिक अनुप्रयोगों के लिए सौर पैनल स्थापित करने की पूरी प्रक्रिया को कवर करता है। सौर ऊर्जा बिजली के बिलों और कार्बन फुटप्रिंट को काफी कम कर सकती है।

## सुरक्षा आवश्यकताएं
- हमेशा उपयुक्त व्यक्तिगत सुरक्षा उपकरण (PPE) पहनें
- सुनिश्चित करें कि सभी विद्युत सर्किट उचित रूप से अलग हैं
- विद्युत कनेक्शन के लिए योग्य इलेक्ट्रीशियन के साथ काम करें
- स्थापना से पहले मौसम की स्थिति की जांच करें
- छत पर काम करते समय उचित गिरावट सुरक्षा उपकरण का उपयोग करें

## आवश्यक उपकरण और सामग्री
- सौर पैनल (मोनोक्रिस्टलाइन या पॉलीक्रिस्टलाइन)
- माउंटिंग रेल और ब्रैकेट
- इन्वर्टर (स्ट्रिंग या माइक्रो-इन्वर्टर)
- DC डिस्कनेक्ट स्विच
- AC डिस्कनेक्ट स्विच
- ग्राउंडिंग उपकरण
- केबल प्रबंधन प्रणाली
- वेदरप्रूफ जंक्शन बॉक्स

## स्थापना प्रक्रिया

### चरण 1: साइट मूल्यांकन
- छत के आयाम और दिशा मापें
- पेड़ों या इमारतों से छाया की जांच करें
- छत की संरचनात्मक अखंडता सत्यापित करें
- इष्टतम पैनल प्लेसमेंट निर्धारित करें

### चरण 2: माउंटिंग सिस्टम स्थापना
- छत के किनारे के समानांतर माउंटिंग रेल स्थापित करें
- रेल के बीच उचित दूरी सुनिश्चित करें
- छत की संरचना में ब्रैकेट सुरक्षित करें
- पैठ के आसपास वेदरप्रूफिंग लगाएं

### चरण 3: पैनल स्थापना
- माउंटिंग सिस्टम पर पैनल रखें
- क्लैंप के साथ पैनल सुरक्षित करें
- वेंटिलेशन के लिए उचित दूरी बनाए रखें
- सुनिश्चित करें कि सभी पैनल समतल और संरेखित हैं

### चरण 4: विद्युत कनेक्शन
- पैनल को श्रृंखला या समानांतर कॉन्फ़िगरेशन में कनेक्ट करें
- DC डिस्कनेक्ट स्विच स्थापित करें
- पैनल से इन्वर्टर स्थान तक कंड्यूट चलाएं
- निर्माता निर्देशों के अनुसार इन्वर्टर से कनेक्ट करें

### चरण 5: इन्वर्टर स्थापना
- उपयुक्त स्थान पर इन्वर्टर माउंट करें
- पैनल से DC इनपुट कनेक्ट करें
- AC आउटपुट को विद्युत पैनल से कनेक्ट करें
- AC डिस्कनेक्ट स्विच स्थापित करें

### चरण 6: ग्राउंडिंग और बॉन्डिंग
- ग्राउंडिंग इलेक्ट्रोड सिस्टम स्थापित करें
- सभी धातु घटकों को बांधें
- उपकरण ग्राउंडिंग कंडक्टर कनेक्ट करें
- ग्राउंडिंग सिस्टम निरंतरता का परीक्षण करें

## परीक्षण और कमीशनिंग
- इन्सुलेशन प्रतिरोध परीक्षण करें
- सभी विद्युत कनेक्शन जांचें
- डिस्कनेक्ट स्विच के उचित संचालन को सत्यापित करें
- इन्वर्टर कार्यक्षमता का परीक्षण करें
- सिस्टम आउटपुट मापें

## रखरखाव आवश्यकताएं
- दक्षता बनाए रखने के लिए पैनल को नियमित रूप से साफ करें
- माउंटिंग सिस्टम का वार्षिक निरीक्षण करें
- जंग के लिए विद्युत कनेक्शन जांचें
- सिस्टम प्रदर्शन की निगरानी करें
- आवश्यकतानुसार घटकों को बदलें

## सामान्य समस्याओं का निवारण
- कम बिजली उत्पादन: छाया या गंदे पैनल की जांच करें
- इन्वर्टर दोष: कनेक्शन और सेटिंग्स सत्यापित करें
- ग्राउंड दोष: ग्राउंडिंग सिस्टम का निरीक्षण करें
- संचार त्रुटियां: वायरिंग और सेटिंग्स जांचें

## निष्कर्ष
सौर पैनल की उचित स्थापना के लिए सावधानीपूर्वक योजना, सुरक्षा पर ध्यान और विद्युत कोड का पालन आवश्यक है। इस गाइड का पालन करने से एक सुरक्षित और कुशल सौर ऊर्जा प्रणाली सुनिश्चित होगी।`
        },
        segments: [
          {
            original: 'Solar Panel Installation Guide',
            translated: { 'Hindi': 'सौर पैनल स्थापना गाइड' },
            confidence: 95
          },
          {
            original: 'This comprehensive guide covers the complete process of installing solar panels',
            translated: { 'Hindi': 'यह व्यापक गाइड सौर पैनल स्थापित करने की पूरी प्रक्रिया को कवर करता है' },
            confidence: 92
          },
          {
            original: 'Always wear appropriate Personal Protective Equipment (PPE)',
            translated: { 'Hindi': 'हमेशा उपयुक्त व्यक्तिगत सुरक्षा उपकरण (PPE) पहनें' },
            confidence: 88
          },
          {
            original: 'Ensure all electrical circuits are properly isolated',
            translated: { 'Hindi': 'सुनिश्चित करें कि सभी विद्युत सर्किट उचित रूप से अलग हैं' },
            confidence: 90
          },
          {
            original: 'Work with a qualified electrician for electrical connections',
            translated: { 'Hindi': 'विद्युत कनेक्शन के लिए योग्य इलेक्ट्रीशियन के साथ काम करें' },
            confidence: 85
          }
        ]
      },
      'Electrical': {
        content: `# Electrical Safety Training

## Introduction
Electrical safety is paramount in any workplace. This training covers essential safety procedures, hazard identification, and emergency response protocols for electrical work.

## Electrical Hazards
- Electric shock and electrocution
- Arc flash and arc blast
- Electrical fires
- Explosions in hazardous locations
- Falls from electrical equipment

## Safety Procedures
- Lockout/Tagout (LOTO) procedures
- Personal Protective Equipment (PPE) requirements
- Safe work practices
- Emergency response procedures
- First aid for electrical injuries

## PPE Requirements
- Insulated gloves and sleeves
- Safety glasses and face shields
- Flame-resistant clothing
- Hard hats with electrical insulation
- Safety shoes with electrical hazard protection

## Lockout/Tagout Procedures
1. Notify affected employees
2. Shut down equipment
3. Isolate energy sources
4. Apply lockout/tagout devices
5. Release stored energy
6. Verify isolation
7. Perform work
8. Remove lockout/tagout devices
9. Notify affected employees

## Emergency Response
- Call emergency services immediately
- Do not touch the victim
- Turn off power if safe to do so
- Use non-conductive materials to separate victim from power source
- Begin CPR if trained and safe to do so
- Wait for emergency medical services

## Conclusion
Following proper electrical safety procedures can prevent serious injuries and fatalities. Always prioritize safety over convenience.`,
        translatedContent: {
          'Hindi': `# विद्युत सुरक्षा प्रशिक्षण

## परिचय
किसी भी कार्यस्थल में विद्युत सुरक्षा सर्वोपरि है। यह प्रशिक्षण विद्युत कार्य के लिए आवश्यक सुरक्षा प्रक्रियाओं, खतरों की पहचान और आपातकालीन प्रतिक्रिया प्रोटोकॉल को कवर करता है।

## विद्युत खतरे
- विद्युत झटका और विद्युत प्रवाह
- आर्क फ्लैश और आर्क ब्लास्ट
- विद्युत आग
- खतरनाक स्थानों में विस्फोट
- विद्युत उपकरण से गिरना

## सुरक्षा प्रक्रियाएं
- लॉकआउट/टैगआउट (LOTO) प्रक्रियाएं
- व्यक्तिगत सुरक्षा उपकरण (PPE) आवश्यकताएं
- सुरक्षित कार्य प्रथाएं
- आपातकालीन प्रतिक्रिया प्रक्रियाएं
- विद्युत चोटों के लिए प्राथमिक चिकित्सा

## PPE आवश्यकताएं
- इन्सुलेटेड दस्ताने और आस्तीन
- सुरक्षा चश्मे और चेहरे के ढाल
- ज्वाला-प्रतिरोधी कपड़े
- विद्युत इन्सुलेशन के साथ हार्ड हेट
- विद्युत खतरा सुरक्षा के साथ सुरक्षा जूते

## लॉकआउट/टैगआउट प्रक्रियाएं
1. प्रभावित कर्मचारियों को सूचित करें
2. उपकरण बंद करें
3. ऊर्जा स्रोतों को अलग करें
4. लॉकआउट/टैगआउट उपकरण लगाएं
5. संग्रहीत ऊर्जा मुक्त करें
6. अलगाव सत्यापित करें
7. कार्य करें
8. लॉकआउट/टैगआउट उपकरण हटाएं
9. प्रभावित कर्मचारियों को सूचित करें

## आपातकालीन प्रतिक्रिया
- तुरंत आपातकालीन सेवाओं को कॉल करें
- पीड़ित को न छुएं
- सुरक्षित होने पर बिजली बंद करें
- पीड़ित को बिजली स्रोत से अलग करने के लिए गैर-संवाहक सामग्री का उपयोग करें
- प्रशिक्षित और सुरक्षित होने पर CPR शुरू करें
- आपातकालीन चिकित्सा सेवाओं की प्रतीक्षा करें

## निष्कर्ष
उचित विद्युत सुरक्षा प्रक्रियाओं का पालन करने से गंभीर चोटों और मौतों को रोका जा सकता है। हमेशा सुविधा से अधिक सुरक्षा को प्राथमिकता दें।`
        },
        segments: [
          {
            original: 'Electrical Safety Training',
            translated: { 'Hindi': 'विद्युत सुरक्षा प्रशिक्षण' },
            confidence: 95
          },
          {
            original: 'Electrical safety is paramount in any workplace',
            translated: { 'Hindi': 'किसी भी कार्यस्थल में विद्युत सुरक्षा सर्वोपरि है' },
            confidence: 90
          },
          {
            original: 'Lockout/Tagout (LOTO) procedures',
            translated: { 'Hindi': 'लॉकआउट/टैगआउट (LOTO) प्रक्रियाएं' },
            confidence: 88
          },
          {
            original: 'Personal Protective Equipment (PPE) requirements',
            translated: { 'Hindi': 'व्यक्तिगत सुरक्षा उपकरण (PPE) आवश्यकताएं' },
            confidence: 92
          }
        ]
      }
    };

    return contentMap[domain] || contentMap['Solar Energy'];
  };

  // File upload handlers
  const handleFileUploaded = (file: UploadedFile) => {
    setUploadedFiles(prev => [file, ...prev]);
    console.log('File uploaded:', file);
  };

  const handleFileProcessed = (file: UploadedFile) => {
    setUploadedFiles(prev => prev.map(f => f.id === file.id ? file : f));
    
    // If file is ready, create a document for translation
    if (file.status === 'ready') {
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
      const targetLang = LANGUAGES.find(l => l.code === file.targetLanguages[0])?.name || 'Hindi';
      
      // Generate realistic content based on file type and name
      const { content, translatedContent, segments, domain } = generateDummyContent(fileName, file.type, targetLang);
      
      const newDocument: TranslationDocument = {
        id: `doc-${Date.now()}`,
        title: fileName,
        originalLanguage: file.sourceLanguage === 'auto' ? 'English' : LANGUAGES.find(l => l.code === file.sourceLanguage)?.name || 'English',
        targetLanguage: targetLang,
        content: content,
        translatedContent: translatedContent,
        segments: segments,
        status: 'draft',
        lastModified: new Date().toISOString(),
        version: 1,
        wordCount: content.split(' ').length,
        characterCount: content.length,
        collaborators: [currentUser],
        comments: []
      };
      
      setDocuments(prev => [newDocument, ...prev]);
      setSelectedDocument(newDocument);
    }
    
    console.log('File processed:', file);
  };

  const handleFileDeleted = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    console.log('File deleted:', fileId);
  };

  const handleFileRetry = (fileId: string) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status: 'uploading', progress: 0, translationProgress: 0 }
        : f
    ));
    console.log('File retry:', fileId);
  };

  // Translation handlers
  const handleTranslationSave = (content: string) => {
    if (selectedDocument) {
      const updatedDocument = {
        ...selectedDocument,
        translatedContent: content,
        lastModified: new Date().toISOString(),
        version: selectedDocument.version + 1
      };
      setDocuments(prev => prev.map(d => d.id === selectedDocument.id ? updatedDocument : d));
      setSelectedDocument(updatedDocument);
      console.log('Translation saved:', content);
    }
  };

  const handleSegmentEdit = (segment: TranslationSegment) => {
    if (selectedDocument) {
      const updatedSegments = selectedDocument.segments.map(s => 
        s.id === segment.id ? segment : s
      );
      const updatedDocument = {
        ...selectedDocument,
        segments: updatedSegments,
        lastModified: new Date().toISOString()
      };
      setDocuments(prev => prev.map(d => d.id === selectedDocument.id ? updatedDocument : d));
      setSelectedDocument(updatedDocument);
      console.log('Segment edited:', segment);
    }
  };

  const handleRetrain = () => {
    console.log('Retraining AI model...');
    if (selectedDocument) {
      // Simulate retraining process
      const updatedDocument = {
        ...selectedDocument,
        status: 'draft' as const,
        lastModified: new Date().toISOString(),
        version: selectedDocument.version + 1
      };
      
      // Update segments with improved confidence scores
      const updatedSegments = selectedDocument.segments.map(segment => ({
        ...segment,
        confidence: Math.min(95, segment.confidence + Math.random() * 10),
        lastUpdated: new Date().toISOString(),
        version: segment.version + 1
      }));
      
      updatedDocument.segments = updatedSegments;
      
      setDocuments(prev => prev.map(d => d.id === selectedDocument.id ? updatedDocument : d));
      setSelectedDocument(updatedDocument);
      
      console.log('AI model retrained successfully - confidence scores improved');
    }
  };

  const handleExportTranslation = () => {
    console.log('Exporting translation...');
    if (selectedDocument) {
      // Create export data
      const data = {
        title: selectedDocument.title,
        originalContent: selectedDocument.content,
        translatedContent: selectedDocument.translatedContent,
        originalLanguage: selectedDocument.originalLanguage,
        targetLanguage: selectedDocument.targetLanguage,
        segments: selectedDocument.segments,
        wordCount: selectedDocument.wordCount,
        characterCount: selectedDocument.characterCount,
        version: selectedDocument.version,
        lastModified: selectedDocument.lastModified,
        timestamp: new Date().toISOString()
      };
      
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedDocument.title}-translation-${selectedDocument.targetLanguage}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('Translation exported successfully:', data);
    }
  };

  const handleShareForReview = () => {
    console.log('Sharing for review...');
    if (selectedDocument) {
      const updatedDocument = {
        ...selectedDocument,
        status: 'review' as const,
        lastModified: new Date().toISOString(),
        version: selectedDocument.version + 1
      };
      setDocuments(prev => prev.map(d => d.id === selectedDocument.id ? updatedDocument : d));
      setSelectedDocument(updatedDocument);
      
      // Simulate sharing with collaborators
      const shareData = {
        documentId: selectedDocument.id,
        title: selectedDocument.title,
        collaborators: selectedDocument.collaborators || [],
        reviewUrl: `${window.location.origin}/review/${selectedDocument.id}`,
        sharedAt: new Date().toISOString()
      };
      
      console.log('Document shared for review:', shareData);
    }
  };

  const handleVersionHistory = () => {
    console.log('Opening version history...');
    if (selectedDocument) {
      // Simulate version history data
      const versionHistory = [
        {
          version: selectedDocument.version,
          timestamp: selectedDocument.lastModified,
          changes: 'Current version',
          author: 'John Smith',
          status: selectedDocument.status
        },
        {
          version: selectedDocument.version - 1,
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          changes: 'Updated translation segments',
          author: 'John Smith',
          status: 'draft'
        },
        {
          version: selectedDocument.version - 2,
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          changes: 'Initial translation',
          author: 'AI Assistant',
          status: 'draft'
        }
      ];
      
      console.log('Version history:', versionHistory);
      // In a real app, this would open a modal or navigate to a version history page
    }
  };

  // Collaboration handlers
  const handleDocumentSave = (content: string) => {
    if (selectedDocument) {
      const updatedDocument = {
        ...selectedDocument,
        translatedContent: content,
        lastModified: new Date().toISOString(),
        version: selectedDocument.version + 1
      };
      setDocuments(prev => prev.map(d => d.id === selectedDocument.id ? updatedDocument : d));
      setSelectedDocument(updatedDocument);
      console.log('Document saved:', content);
    }
  };

  const handleComment = (comment: Omit<Comment, 'id' | 'timestamp'>) => {
    if (selectedDocument) {
      const newComment: Comment = {
        ...comment,
        id: `comment-${Date.now()}`,
        timestamp: new Date().toLocaleString()
      };
      const updatedDocument = {
        ...selectedDocument,
        comments: [...(selectedDocument.comments || []), newComment],
        lastModified: new Date().toISOString()
      };
      setDocuments(prev => prev.map(d => d.id === selectedDocument.id ? updatedDocument : d));
      setSelectedDocument(updatedDocument);
      console.log('Comment added:', newComment);
    }
  };

  const handleApprove = () => {
    if (selectedDocument) {
      const updatedDocument = {
        ...selectedDocument,
        status: 'approved' as const,
        lastModified: new Date().toISOString()
      };
      setDocuments(prev => prev.map(d => d.id === selectedDocument.id ? updatedDocument : d));
      setSelectedDocument(updatedDocument);
      console.log('Translation approved');
    }
  };

  const handleReject = () => {
    if (selectedDocument) {
      const updatedDocument = {
        ...selectedDocument,
        status: 'draft' as const,
        lastModified: new Date().toISOString()
      };
      setDocuments(prev => prev.map(d => d.id === selectedDocument.id ? updatedDocument : d));
      setSelectedDocument(updatedDocument);
      console.log('Translation rejected');
    }
  };

  // Content generation handlers
  const handleContentGenerated = (content: GeneratedContent) => {
    setGeneratedContent(prev => [content, ...prev]);
    setSelectedContent(content);
    console.log('Content generated:', content);
  };

  const handleContentSaved = (content: GeneratedContent) => {
    setGeneratedContent(prev => prev.map(c => c.id === content.id ? content : c));
    setSelectedContent(content);
    console.log('Content saved:', content);
  };

  const handleContentExported = (content: GeneratedContent, format: string) => {
    console.log('Content exported:', content, format);
    // Simulate export
    const exportData = {
      content: content.content,
      title: content.title,
      format: format,
      timestamp: new Date().toISOString()
    };
    console.log('Export data:', exportData);
  };

  // Reports handlers
  const handleExportReport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log('Exporting report in format:', format);
    // Simulate report generation
    const reportData = {
      format: format,
      timestamp: new Date().toISOString(),
      data: {
        totalFiles: uploadedFiles.length,
        totalDocuments: documents.length,
        totalContent: generatedContent.length,
        translationAccuracy: 94.2,
        userEngagement: 78.5
      }
    };
    console.log('Report data:', reportData);
  };

  const handleRefreshData = () => {
    console.log('Refreshing data...');
    // Simulate data refresh
    setTimeout(() => {
      console.log('Data refreshed successfully');
    }, 1000);
  };

  // Subtitle handlers
  const handleSubtitleGenerated = (subtitles: any[]) => {
    console.log('Subtitles generated:', subtitles);
  };

  const handleVoiceGenerated = (audioUrl: string) => {
    console.log('Voice generated:', audioUrl);
  };

  const handleSubtitleExport = (format: 'srt' | 'vtt' | 'ass') => {
    console.log('Exporting subtitles in format:', format);
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Trainer / Content Creator Dashboard</h1>
        <p className="text-gray-600">
          Upload, localize, review, and publish multilingual training content using AI-assisted workflows
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <UploadCloud className="h-4 w-4" />
            Upload Center
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Translation Preview
          </TabsTrigger>
          <TabsTrigger value="collaborate" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Collaborate
          </TabsTrigger>
          <TabsTrigger value="subtitles" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Auto Subtitler
          </TabsTrigger>
          <TabsTrigger value="ai-content" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Content
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <UploadCenter
            files={uploadedFiles}
            onFileUploaded={handleFileUploaded}
            onFileProcessed={handleFileProcessed}
            onFileDeleted={handleFileDeleted}
            onFileRetry={handleFileRetry}
          />
        </TabsContent>

        <TabsContent value="preview">
          <div className="space-y-4">
            {documents.length > 0 && (
          <Card>
            <CardHeader>
                  <CardTitle>Select Document</CardTitle>
                  <CardDescription>Choose a document to preview and edit translations</CardDescription>
            </CardHeader>
            <CardContent>
                  <div className="grid gap-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedDocument?.id === doc.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedDocument(doc)}
                      >
                      <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{doc.title}</h3>
                            <p className="text-sm text-gray-600">
                              {doc.originalLanguage} → {doc.targetLanguage} • {doc.wordCount} words
                            </p>
                          </div>
                          <Badge variant={doc.status === 'draft' ? 'outline' : 'default'}>
                            {doc.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
              </div>
            </CardContent>
          </Card>
            )}
            
            {selectedDocument ? (
              <TranslationPreview
                document={selectedDocument}
                onSave={handleTranslationSave}
                onSegmentEdit={handleSegmentEdit}
                onRetrain={handleRetrain}
                onExport={handleExportTranslation}
                onShare={handleShareForReview}
                onVersionHistory={handleVersionHistory}
              />
            ) : (
            <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Document Selected</h3>
                  <p className="text-gray-600">Select a document above to see the translation preview.</p>
              </CardContent>
            </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="collaborate">
          <div className="space-y-4">
            {documents.length > 0 && (
          <Card>
            <CardHeader>
                  <CardTitle>Select Document for Collaboration</CardTitle>
                  <CardDescription>Choose a document to collaborate on with your team</CardDescription>
            </CardHeader>
            <CardContent>
                  <div className="grid gap-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedDocument?.id === doc.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{doc.title}</h3>
                            <p className="text-sm text-gray-600">
                              {doc.originalLanguage} → {doc.targetLanguage} • {doc.collaborators?.length || 0} collaborators
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={doc.status === 'draft' ? 'outline' : 'default'}>
                              {doc.status}
                            </Badge>
                            <Badge variant="outline">
                              {doc.comments?.length || 0} comments
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </CardContent>
          </Card>
            )}
            
            {selectedDocument ? (
              <CollaborativeEditor
                document={selectedDocument as CollaborativeDocument}
                currentUser={currentUser}
                onSave={handleDocumentSave}
                onComment={handleComment}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Document Selected</h3>
                  <p className="text-gray-600">Select a document above to start collaborating with your team.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="subtitles">
          <AutoSubtitler
            onSubtitleGenerated={handleSubtitleGenerated}
            onVoiceGenerated={handleVoiceGenerated}
            onExport={handleSubtitleExport}
          />
        </TabsContent>

        <TabsContent value="ai-content">
          <div className="space-y-4">
            {generatedContent.length > 0 && (
              <Card>
            <CardHeader>
                  <CardTitle>Generated Content</CardTitle>
                  <CardDescription>Manage your AI-generated training content</CardDescription>
            </CardHeader>
            <CardContent>
                  <div className="grid gap-3">
                    {generatedContent.map((content) => (
                      <div
                        key={content.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedContent?.id === content.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedContent(content)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{content.title}</h3>
                            <p className="text-sm text-gray-600">
                              {content.language} • {content.domain} • {content.difficulty} • {content.duration} min
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={content.status === 'ready' ? 'default' : 'outline'}>
                              {content.status}
                            </Badge>
                            <Badge variant="outline">
                              {content.confidence}% confidence
                            </Badge>
                            {content.isEdited && (
                              <Badge className="bg-blue-100 text-blue-800">Edited</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
            </CardContent>
          </Card>
            )}
            
            <AIContentCreator
              selectedContent={selectedContent}
              onContentSelect={setSelectedContent}
              onContentGenerated={handleContentGenerated}
              onContentSaved={handleContentSaved}
              onContentExported={handleContentExported}
            />
    </div>
        </TabsContent>

        <TabsContent value="reports">
          <ReportsInsights
            onExportReport={handleExportReport}
            onRefreshData={handleRefreshData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

